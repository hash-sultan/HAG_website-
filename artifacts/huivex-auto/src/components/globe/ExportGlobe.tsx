import { useEffect, useMemo, useRef } from 'react';
import { GLOBE_LAND_MASK, GLOBE_MASK_H, GLOBE_MASK_W } from './globeLandMask';
import './export-globe.css';

/* ------------------------------------------------------------------ */
/*  Public API                                                         */
/* ------------------------------------------------------------------ */

export type GlobeHQ = { lat: number; lon: number; label: string };
export type GlobeDestination = { label: string; lat: number; lon: number };

export type ExportGlobeProps = {
  /** Where the export lines start (your head office / port). */
  hq?: GlobeHQ;
  /** Regions or countries you ship to. */
  destinations?: GlobeDestination[];
  /** Accent colour for lines, pins and labels (any #rrggbb). */
  accent?: string;
  /** Tilt of the globe in degrees. */
  tiltDeg?: number;
  /** Sphere shading: [highlight, mid, edge]. */
  bodyColors?: [string, string, string];
  /** Continent colour (lit like a sphere, so it fades toward the edges). */
  landColor?: string;
  /** Text colour of the destination / HQ labels. */
  labelColor?: string;
  /** Background of the label chips. */
  chipBackground?: string;
  /** Canvas font-family for labels (canvas can't inherit CSS fonts). */
  fontFamily?: string;
  /** Stretch to fill the parent's height instead of staying square. */
  fill?: boolean;
  className?: string;
};

export const DEFAULT_HQ: GlobeHQ = { lat: 31.5497, lon: 74.3436, label: 'PAKISTAN' };

export const DEFAULT_DESTINATIONS: GlobeDestination[] = [
  { label: 'MIDDLE EAST', lat: 25.0, lon: 45.0 },
  { label: 'ASIA', lat: 34.0, lon: 100.0 },
  { label: 'EUROPE', lat: 50.1, lon: 14.4 },
  { label: 'NORTH AMERICA', lat: 39.8, lon: -98.6 },
  { label: 'AFRICA', lat: 7.1881, lon: 21.0938 },
  { label: 'SOUTH AMERICA', lat: -14.6, lon: -57.0 },
  { label: 'AUSTRALIA', lat: -25.27, lon: 133.77 },
];

/* ------------------------------------------------------------------ */
/*  Math helpers                                                       */
/* ------------------------------------------------------------------ */

const DEG = Math.PI / 180;

type Vec3 = { x: number; y: number; z: number };

function latLonToVec3(latDeg: number, lonDeg: number): Vec3 {
  const phi = latDeg * DEG;
  const theta = lonDeg * DEG;
  return { x: Math.cos(phi) * Math.sin(theta), y: Math.sin(phi), z: Math.cos(phi) * Math.cos(theta) };
}

/** Spherical interpolation — the curved path an export line traces across the globe. */
function slerpVec3(a: Vec3, b: Vec3, t: number): Vec3 {
  const dot = Math.max(-1, Math.min(1, a.x * b.x + a.y * b.y + a.z * b.z));
  const theta = Math.acos(dot);
  if (theta < 1e-6) return a;
  const sinTheta = Math.sin(theta);
  const wa = Math.sin((1 - t) * theta) / sinTheta;
  const wb = Math.sin(t * theta) / sinTheta;
  return { x: a.x * wa + b.x * wb, y: a.y * wa + b.y * wb, z: a.z * wa + b.z * wb };
}

function hexToRgb(hex: string): [number, number, number] {
  const clean = hex.replace('#', '');
  const n = parseInt(clean.length === 3 ? clean.split('').map((c) => c + c).join('') : clean, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

/* ------------------------------------------------------------------ */
/*  Land mask sampling                                                 */
/* ------------------------------------------------------------------ */

let landBytesCache: Uint8Array | null = null;

function getLandBytes(): Uint8Array {
  if (landBytesCache) return landBytesCache;
  const binary = atob(GLOBE_LAND_MASK);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
  landBytesCache = bytes;
  return bytes;
}

function landBitAt(bytes: Uint8Array, mx: number, my: number): number {
  const index = my * GLOBE_MASK_W + mx;
  return (bytes[index >> 3] >> (7 - (index & 7))) & 1;
}

/** Bilinear "landness" in [0,1] at a lat/lon — smooths 1° cells into antialiased coastlines. */
function sampleLandness(bytes: Uint8Array, latRad: number, lonRad: number): number {
  const gx = (lonRad / Math.PI) * 0.5 * GLOBE_MASK_W + GLOBE_MASK_W * 0.5 - 0.5;
  const gy = (0.5 - latRad / Math.PI) * GLOBE_MASK_H - 0.5;
  const xi = Math.floor(gx);
  const yi = Math.floor(gy);
  const fx = gx - xi;
  const fy = gy - yi;
  const x0 = ((xi % GLOBE_MASK_W) + GLOBE_MASK_W) % GLOBE_MASK_W;
  const x1 = (x0 + 1) % GLOBE_MASK_W;
  const y0 = yi < 0 ? 0 : yi > GLOBE_MASK_H - 1 ? GLOBE_MASK_H - 1 : yi;
  const y1 = yi + 1 < 0 ? 0 : yi + 1 > GLOBE_MASK_H - 1 ? GLOBE_MASK_H - 1 : yi + 1;
  const a = landBitAt(bytes, x0, y0);
  const b = landBitAt(bytes, x1, y0);
  const c = landBitAt(bytes, x0, y1);
  const d = landBitAt(bytes, x1, y1);
  const top = a + (b - a) * fx;
  const bottom = c + (d - c) * fx;
  return top + (bottom - top) * fy;
}

const ASIN_LUT_SIZE = 4096;
const ASIN_LUT = (() => {
  const table = new Float32Array(ASIN_LUT_SIZE + 1);
  for (let i = 0; i <= ASIN_LUT_SIZE; i += 1) table[i] = Math.asin((i / ASIN_LUT_SIZE) * 2 - 1);
  return table;
})();

function fastAsin(y: number): number {
  const t = (y + 1) * 0.5 * ASIN_LUT_SIZE;
  const i = t < 0 ? 0 : t > ASIN_LUT_SIZE ? ASIN_LUT_SIZE : t | 0;
  return ASIN_LUT[i];
}

/* ------------------------------------------------------------------ */
/*  Renderer                                                           */
/* ------------------------------------------------------------------ */

type RasterGeometry = { nx: Float32Array; ny: Float32Array; depth: Float32Array; offset: Int32Array; count: number };

function buildRasterGeometry(size: number): RasterGeometry {
  const nx: number[] = [];
  const ny: number[] = [];
  const depth: number[] = [];
  const offset: number[] = [];
  for (let py = 0; py < size; py += 1) {
    const y = -(((py + 0.5) / size) * 2 - 1);
    for (let px = 0; px < size; px += 1) {
      const x = ((px + 0.5) / size) * 2 - 1;
      const rr = x * x + y * y;
      if (rr > 1) continue;
      nx.push(x);
      ny.push(y);
      depth.push(Math.sqrt(1 - rr));
      offset.push((py * size + px) * 4);
    }
  }
  return {
    nx: Float32Array.from(nx),
    ny: Float32Array.from(ny),
    depth: Float32Array.from(depth),
    offset: Int32Array.from(offset),
    count: offset.length,
  };
}

type Assets = {
  landBytes: Uint8Array;
  raster: HTMLCanvasElement;
  rasterCtx: CanvasRenderingContext2D;
  rasterImage: ImageData;
  geometry: RasterGeometry;
  size: number;
};

type State = {
  rot: number; tilt: number; vRot: number; vTilt: number;
  dragging: boolean; lastX: number; lastY: number;
  idleSince: number; drop: number;
  target: { rot: number; tilt: number; fromRot: number; fromTilt: number; t: number } | null;
};

type Theme = { body: [string, string, string]; land: [number, number, number]; label: string; chipBg: string; font: string };

type Scene = {
  theme: Theme;
  hq: GlobeHQ;
  hqVec: Vec3;
  destinations: Array<GlobeDestination & { vec: Vec3 }>;
  accent: [number, number, number];
};

function renderGlobe(ctx: CanvasRenderingContext2D, width: number, height: number, assets: Assets, state: State, scene: Scene, now: number) {
  ctx.clearRect(0, 0, width, height);
  const cx = width / 2;
  const cy = height / 2;
  const radius = Math.min(width, height) * 0.42;
  if (radius <= 0) return;

  const [ar, ag, ab] = scene.accent;
  const rgba = (a: number) => `rgba(${ar}, ${ag}, ${ab}, ${a})`;

  const body = ctx.createRadialGradient(cx - radius * 0.35, cy - radius * 0.4, radius * 0.05, cx, cy, radius);
  body.addColorStop(0, scene.theme.body[0]);
  body.addColorStop(0.55, scene.theme.body[1]);
  body.addColorStop(1, scene.theme.body[2]);
  ctx.fillStyle = body;
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.fill();

  const cosR = Math.cos(state.rot);
  const sinR = Math.sin(state.rot);
  const cosT = Math.cos(state.tilt);
  const sinT = Math.sin(state.tilt);

  // Land: for each pixel of a small offscreen buffer, invert the sphere projection
  // back to lat/lon and sample the land mask → continuous, lit continents.
  const { raster, rasterCtx, rasterImage, landBytes, geometry, size } = assets;
  const data = rasterImage.data;
  const land = scene.theme.land;
  data.fill(0);
  const lightLen = Math.hypot(-0.5, 0.55, 0.68);
  const lx = -0.5 / lightLen;
  const ly = 0.55 / lightLen;
  const lz = 0.68 / lightLen;
  const { nx: NX, ny: NY, depth: DEPTH, offset: OFFSET, count } = geometry;

  for (let i = 0; i < count; i += 1) {
    const nx = NX[i];
    const screenY = NY[i];
    const depth = DEPTH[i];
    const y = screenY * cosT + depth * sinT;
    const z1 = -screenY * sinT + depth * cosT;
    const x = nx * cosR - z1 * sinR;
    const z = nx * sinR + z1 * cosR;
    const lat = fastAsin(y);
    const lon = Math.atan2(x, z);
    const landness = sampleLandness(landBytes, lat, lon);
    if (landness <= 0.22) continue;
    const t = landness >= 0.78 ? 1 : (landness - 0.22) / 0.56;
    const coverage = t * t * (3 - 2 * t);
    const diffuse = Math.max(0.16, nx * lx + screenY * ly + depth * lz);
    const edgeFade = Math.min(1, depth * 4.2);
    const idx = OFFSET[i];
    data[idx] = land[0];
    data[idx + 1] = land[1];
    data[idx + 2] = land[2];
    data[idx + 3] = Math.min(255, Math.round(255 * coverage * diffuse * edgeFade));
  }
  rasterCtx.putImageData(rasterImage, 0, 0);

  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.clip();
  ctx.imageSmoothingEnabled = true;
  ctx.drawImage(raster, 0, 0, size, size, cx - radius, cy - radius, radius * 2, radius * 2);
  ctx.restore();

  const project = (p: Vec3) => {
    const x1 = p.x * cosR + p.z * sinR;
    const z1 = -p.x * sinR + p.z * cosR;
    const y2 = p.y * cosT - z1 * sinT;
    const z2 = p.y * sinT + z1 * cosT;
    return { sx: cx + x1 * radius, sy: cy - y2 * radius, depth: z2 };
  };

  // Export lines: great-circle arcs from HQ to each destination, lifted off the surface.
  const ARC_SEGMENTS = 48;
  const ARC_LIFT = 0.34;
  for (const destination of scene.destinations) {
    ctx.strokeStyle = rgba(0.8);
    ctx.lineWidth = 1.15;
    ctx.beginPath();
    let pathOpen = false;
    let endPoint: { sx: number; sy: number; depth: number } | null = null;
    for (let i = 0; i <= ARC_SEGMENTS; i += 1) {
      const t = i / ARC_SEGMENTS;
      const dir = slerpVec3(scene.hqVec, destination.vec, t);
      const lift = 1 + ARC_LIFT * Math.sin(t * Math.PI);
      const point = project({ x: dir.x * lift, y: dir.y * lift, z: dir.z * lift });
      if (i === ARC_SEGMENTS) endPoint = point;
      const visible = point.depth > 0.015;
      if (visible) {
        if (pathOpen) ctx.lineTo(point.sx, point.sy);
        else { ctx.moveTo(point.sx, point.sy); pathOpen = true; }
      } else if (pathOpen) {
        ctx.stroke();
        ctx.beginPath();
        pathOpen = false;
      }
    }
    if (pathOpen) ctx.stroke();

    if (endPoint && endPoint.depth > 0.06) {
      ctx.globalAlpha = Math.min(1, endPoint.depth * 3.2);
      ctx.fillStyle = rgba(1);
      ctx.beginPath();
      ctx.arc(endPoint.sx, endPoint.sy, 2.2, 0, Math.PI * 2);
      ctx.fill();

      ctx.font = `700 9px ${scene.theme.font}`;
      ctx.textBaseline = 'middle';
      const label = destination.label;
      const chipW = ctx.measureText(label).width + 14;
      const chipY = endPoint.sy - 8;
      const chipX = endPoint.sx + 9 + chipW > width - 4 ? endPoint.sx - 9 - chipW : endPoint.sx + 9;
      ctx.fillStyle = scene.theme.chipBg;
      ctx.beginPath();
      if (typeof ctx.roundRect === 'function') ctx.roundRect(chipX, chipY, chipW, 16, 8);
      else ctx.rect(chipX, chipY, chipW, 16);
      ctx.fill();
      ctx.strokeStyle = rgba(0.5);
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.fillStyle = scene.theme.label;
      ctx.fillText(label, chipX + 7, chipY + 8.5);
      ctx.globalAlpha = 1;
    }
  }

  // HQ pin (dropped in on load, with a pulsing ring).
  const hq = project(scene.hqVec);
  if (hq.depth <= 0.06) return;

  const t = state.drop;
  const back = 1.70158;
  const eased = t >= 1 ? 1 : 1 + (back + 1) * Math.pow(t - 1, 3) + back * Math.pow(t - 1, 2);
  const headY = hq.sy - 32 - (1 - eased) * 66;
  const alpha = Math.min(1, hq.depth * 3.2);

  ctx.globalAlpha = alpha;
  ctx.strokeStyle = rgba(0.75);
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.moveTo(hq.sx, hq.sy);
  ctx.lineTo(hq.sx, headY);
  ctx.stroke();

  if (t > 0.92) {
    const pulse = (now % 1900) / 1900;
    ctx.globalAlpha = alpha * (1 - pulse) * 0.8;
    ctx.strokeStyle = rgba(1);
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.arc(hq.sx, hq.sy, 4 + pulse * 17, 0, Math.PI * 2);
    ctx.stroke();
  }

  ctx.globalAlpha = alpha;
  ctx.fillStyle = rgba(1);
  ctx.beginPath();
  ctx.arc(hq.sx, hq.sy, 2.6, 0, Math.PI * 2);
  ctx.fill();

  ctx.beginPath();
  ctx.arc(hq.sx, headY, 5.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = 'rgba(4, 5, 7, 0.9)';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  ctx.font = `700 10px ${scene.theme.font}`;
  ctx.textBaseline = 'middle';
  const chipW = ctx.measureText(scene.hq.label).width + 18;
  const chipY = headY - 9;
  const chipX = hq.sx + 12 + chipW > width - 4 ? hq.sx - 12 - chipW : hq.sx + 12;
  ctx.fillStyle = scene.theme.chipBg;
  ctx.beginPath();
  if (typeof ctx.roundRect === 'function') ctx.roundRect(chipX, chipY, chipW, 18, 9);
  else ctx.rect(chipX, chipY, chipW, 18);
  ctx.fill();
  ctx.strokeStyle = rgba(0.5);
  ctx.lineWidth = 1;
  ctx.stroke();
  ctx.fillStyle = scene.theme.label;
  ctx.fillText(scene.hq.label, chipX + 9, chipY + 9.5);
  ctx.globalAlpha = 1;
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function ExportGlobe({
  hq = DEFAULT_HQ,
  destinations = DEFAULT_DESTINATIONS,
  accent = '#f7c83c',
  tiltDeg = 16,
  bodyColors = ['#1b1f25', '#080a0d', '#000000'],
  landColor = '#ffffff',
  labelColor = '#f8dd8f',
  chipBackground = 'rgba(6, 7, 9, 0.85)',
  fontFamily = '"Space Mono", ui-monospace, monospace',
  fill = false,
  className = '',
}: ExportGlobeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const baseTilt = tiltDeg * DEG;

  // Keep the render loop reading the latest scene without restarting the effect.
  const scene = useMemo<Scene>(
    () => ({
      hq,
      hqVec: latLonToVec3(hq.lat, hq.lon),
      destinations: destinations.map((d) => ({ ...d, vec: latLonToVec3(d.lat, d.lon) })),
      accent: hexToRgb(accent),
      theme: { body: bodyColors, land: hexToRgb(landColor), label: labelColor, chipBg: chipBackground, font: fontFamily },
    }),
    [hq, destinations, accent, bodyColors, landColor, labelColor, chipBackground, fontFamily],
  );
  const sceneRef = useRef(scene);
  sceneRef.current = scene;

  const stateRef = useRef<State>({
    rot: -hq.lon * DEG, tilt: baseTilt, vRot: 0, vTilt: 0,
    dragging: false, lastX: 0, lastY: 0, idleSince: 0, drop: 0, target: null,
  });

  const recenter = () => {
    const state = stateRef.current;
    let rot = -sceneRef.current.hq.lon * DEG;
    const turn = Math.PI * 2;
    while (rot - state.rot > Math.PI) rot -= turn;
    while (rot - state.rot < -Math.PI) rot += turn;
    state.vRot = 0;
    state.vTilt = 0;
    state.target = { rot, tilt: baseTilt, fromRot: state.rot, fromTilt: state.tilt, t: 0 };
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const raster = document.createElement('canvas');
    const rasterCtx = raster.getContext('2d', { willReadFrequently: true });
    if (!rasterCtx) return;
    const assets: Assets = {
      landBytes: getLandBytes(),
      raster,
      rasterCtx,
      rasterImage: rasterCtx.createImageData(1, 1),
      geometry: { nx: new Float32Array(0), ny: new Float32Array(0), depth: new Float32Array(0), offset: new Int32Array(0), count: 0 },
      size: 0,
    };
    let width = 0;
    let height = 0;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.max(1, Math.round(width * dpr));
      canvas.height = Math.max(1, Math.round(height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const diameter = Math.min(width, height) * 0.84 * dpr;
      const nextSize = Math.max(140, Math.min(480, Math.round(diameter)));
      if (nextSize !== assets.size) {
        assets.size = nextSize;
        raster.width = nextSize;
        raster.height = nextSize;
        assets.rasterImage = rasterCtx.createImageData(nextSize, nextSize);
        assets.geometry = buildRasterGeometry(nextSize);
      }
    };
    resize();
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);

    // Pause rendering when scrolled off-screen.
    let onScreen = true;
    const visibility = new IntersectionObserver((entries) => { onScreen = entries[0]?.isIntersecting ?? true; });
    visibility.observe(canvas);

    const onPointerDown = (event: PointerEvent) => {
      const state = stateRef.current;
      state.dragging = true;
      state.lastX = event.clientX;
      state.lastY = event.clientY;
      state.target = null;
      try { canvas.setPointerCapture(event.pointerId); } catch { /* already released */ }
    };
    const onPointerMove = (event: PointerEvent) => {
      const state = stateRef.current;
      if (!state.dragging) return;
      const dx = event.clientX - state.lastX;
      const dy = event.clientY - state.lastY;
      state.lastX = event.clientX;
      state.lastY = event.clientY;
      state.rot += dx * 0.006;
      state.tilt = Math.max(-1.1, Math.min(1.1, state.tilt + dy * 0.005));
      state.vRot = Math.max(-0.06, Math.min(0.06, dx * 0.006));
      state.vTilt = Math.max(-0.04, Math.min(0.04, dy * 0.005));
    };
    const onPointerUp = (event: PointerEvent) => {
      const state = stateRef.current;
      state.dragging = false;
      state.idleSince = performance.now();
      try { if (canvas.hasPointerCapture(event.pointerId)) canvas.releasePointerCapture(event.pointerId); } catch { /* already released */ }
    };
    canvas.addEventListener('pointerdown', onPointerDown);
    canvas.addEventListener('pointermove', onPointerMove);
    canvas.addEventListener('pointerup', onPointerUp);
    canvas.addEventListener('pointercancel', onPointerUp);

    let frame = 0;
    let previous = performance.now();
    const tick = (now: number) => {
      frame = requestAnimationFrame(tick);
      const dt = Math.min((now - previous) / 16.667, 3);
      previous = now;
      if (!onScreen) return;
      const state = stateRef.current;

      if (state.drop < 1) state.drop = Math.min(1, state.drop + dt * (reduced ? 1 : 0.022));

      if (state.target) {
        state.target.t = Math.min(1, state.target.t + dt * 0.038);
        const progress = 1 - Math.pow(1 - state.target.t, 3);
        state.rot = state.target.fromRot + (state.target.rot - state.target.fromRot) * progress;
        state.tilt = state.target.fromTilt + (state.target.tilt - state.target.fromTilt) * progress;
        if (state.target.t >= 1) {
          state.target = null;
          state.idleSince = now;
        }
      } else if (!state.dragging) {
        state.rot += state.vRot * dt;
        state.tilt = Math.max(-1.1, Math.min(1.1, state.tilt + state.vTilt * dt));
        const decay = Math.pow(0.94, dt);
        state.vRot *= decay;
        state.vTilt *= decay;
        if (Math.abs(state.vRot) < 0.0002) state.vRot = 0;
        if (Math.abs(state.vTilt) < 0.0002) state.vTilt = 0;
        // Slow auto-rotation once the user stops interacting.
        if (!reduced && state.vRot === 0 && now - state.idleSince > 1800) state.rot += 0.0013 * dt;
      }

      renderGlobe(ctx, width, height, assets, state, sceneRef.current, now);
    };
    frame = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      visibility.disconnect();
      canvas.removeEventListener('pointerdown', onPointerDown);
      canvas.removeEventListener('pointermove', onPointerMove);
      canvas.removeEventListener('pointerup', onPointerUp);
      canvas.removeEventListener('pointercancel', onPointerUp);
    };
  }, []);

  return (
    <div className={`globe-stage${fill ? ' globe-stage--fill' : ''} ${className}`.trim()}>
      <canvas
        ref={canvasRef}
        className="globe-canvas"
        role="img"
        aria-label={`Interactive globe showing export routes from ${hq.label}`}
      />
      <span className="globe-hint">Drag to spin</span>
      <button type="button" className="globe-recenter" onClick={recenter}>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="12" cy="12" r="10" />
          <path d="M2 12h20" />
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </svg>
        Recenter
      </button>
    </div>
  );
}

export default ExportGlobe;
