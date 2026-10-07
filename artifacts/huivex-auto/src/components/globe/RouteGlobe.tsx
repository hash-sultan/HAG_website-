import { ExportGlobe, type GlobeDestination, type GlobeHQ } from './ExportGlobe';

/** Head office — Xi'an. */
const HQ: GlobeHQ = { lat: 34.3416, lon: 108.9398, label: "XI'AN" };

/**
 * Starting set, based on the destinations visible on the Markets page.
 * Edit freely: `label` is what shows on the globe, lat/lon is where the line lands.
 */
const DESTINATIONS: GlobeDestination[] = [
  { label: 'RUSSIA', lat: 55.75, lon: 37.62 },
  { label: 'CENTRAL ASIA', lat: 41.3, lon: 66.0 },
  { label: 'MIDDLE EAST', lat: 27.0, lon: 46.0 },
  { label: 'PAKISTAN', lat: 30.4, lon: 69.3 },
  { label: 'SOUTH AMERICA', lat: -14.6, lon: -57.0 },
];

type Props = {
  hq?: GlobeHQ;
  destinations?: GlobeDestination[];
  caption?: string;
};

/** Interactive replacement for <RouteGraphic /> — same wrapper classes, canvas globe inside. */
export function RouteGlobe({ hq = HQ, destinations = DESTINATIONS, caption = 'ROUTES / INDICATIVE ONLY' }: Props) {
  return (
    <div className="route-graphic route-graphic--globe">
      <div className="map-grid" />
      <ExportGlobe
        fill
        hq={hq}
        destinations={destinations}
        accent="#d7ad57"
        bodyColors={['#1c4486', '#0b2150', '#050f28']}
        landColor="#ece9e0"
        labelColor="#f1dfae"
        chipBackground="rgba(7, 20, 48, 0.88)"
        fontFamily='Georgia, "Times New Roman", serif'
      />
      <div className="route-caption">{caption}</div>
    </div>
  );
}

export default RouteGlobe;
