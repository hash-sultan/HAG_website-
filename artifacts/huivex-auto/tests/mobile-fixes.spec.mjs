import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import { expect, test } from '@playwright/test';

const screenshotDir = path.resolve(import.meta.dirname, '../../../docs/audit/after-fixes');
const viewports = [
  { width: 320, height: 640 },
  { width: 360, height: 640 },
  { width: 390, height: 844 },
  { width: 568, height: 320 },
  { width: 844, height: 390 },
];
const routes = [
  { path: '/', name: 'home' },
  { path: '/services', name: 'services' },
];
const locales = ['en', 'zh'];

test.describe('mobile layout fixes', () => {
  test.beforeAll(async () => {
    await mkdir(screenshotDir, { recursive: true });
  });

  for (const locale of locales) {
    for (const route of routes) {
      for (const viewport of viewports) {
        test(`${locale} ${route.name} ${viewport.width}x${viewport.height} closed and open`, async ({ page }) => {
          await page.setViewportSize(viewport);
          await page.addInitScript((value) => localStorage.setItem('huivex-locale', value), locale);
          await page.goto(route.path);
          await page.evaluate(() => document.fonts.ready.then(() => true));

          const nodes = page.locator('.process-node');
          await expect(nodes).toHaveCount(6);
          const boxes = await nodes.evaluateAll((elements) => elements.map((el) => {
            const rect = el.getBoundingClientRect();
            return { x: rect.x, y: rect.y, width: rect.width, height: rect.height };
          }));
          for (const box of boxes) {
            expect(box.x, 'timeline node must not clip past the left edge').toBeGreaterThanOrEqual(0);
          }
          const cols = viewport.width <= 600 ? 1 : viewport.width <= 850 ? 3 : 6;
          for (let col = 0; col < cols; col += 1) {
            const group = boxes.filter((_, index) => index % cols === col);
            const center = group[0].x + group[0].width / 2;
            for (const box of group) {
              expect(Math.abs(box.x + box.width / 2 - center), 'timeline node centers in a column must align').toBeLessThanOrEqual(1);
            }
          }

          const headerImages = page.locator('.site-header img');
          await expect(headerImages).toHaveCount(1);
          const hasOpaqueWhite = await headerImages.first().evaluate(async (img) => {
            if (!(img instanceof HTMLImageElement)) return true;
            if (!img.complete) await img.decode();
            const canvas = document.createElement('canvas');
            canvas.width = img.naturalWidth || 1;
            canvas.height = img.naturalHeight || 1;
            const ctx = canvas.getContext('2d');
            if (!ctx) return true;
            ctx.drawImage(img, 0, 0);
            const samples = [
              [0, 0],
              [canvas.width - 1, 0],
              [0, canvas.height - 1],
              [canvas.width - 1, canvas.height - 1],
            ];
            return samples.some(([x, y]) => {
              const [r, g, b, a] = ctx.getImageData(x, y, 1, 1).data;
              return a > 240 && r > 240 && g > 240 && b > 240;
            });
          });
          expect(hasOpaqueWhite, 'header mark must not have an opaque white background').toBe(false);

          await page.screenshot({
            path: path.join(screenshotDir, `${locale}-${route.name}-${viewport.width}x${viewport.height}-closed.png`),
            animations: 'disabled',
          });

          await page.getByRole('button', { name: 'Open menu' }).click();
          const drawer = page.locator('.mobile-drawer.drawer-open');
          await expect(drawer).toBeVisible();
          const drawerBox = await drawer.boundingBox();
          expect(drawerBox).not.toBeNull();
          expect(drawerBox.width, 'open drawer must cover the viewport width').toBeGreaterThanOrEqual(viewport.width - 1);
          expect(drawerBox.height, 'open drawer must cover the viewport height').toBeGreaterThanOrEqual(viewport.height - 1);

          const linkNames = locale === 'zh'
            ? ['首页', '车辆目录', '服务流程', '目标市场', '展厅合作', '关于我们', '联系我们']
            : ['Home', 'Vehicles', 'Services', 'Markets', 'Showrooms', 'About', 'Contact'];
          const viewportBox = { x: 0, y: 0, width: viewport.width, height: viewport.height };
          for (const name of linkNames) {
            const link = drawer.locator('a', { hasText: name }).first();
            await expect(link).toBeVisible();
            const linkBox = await link.boundingBox();
            expect(linkBox, `${name} must be in the viewport`).not.toBeNull();
            expect(linkBox.x).toBeGreaterThanOrEqual(viewportBox.x - 1);
            expect(linkBox.y).toBeGreaterThanOrEqual(viewportBox.y - 1);
            expect(linkBox.x + linkBox.width).toBeLessThanOrEqual(viewportBox.width + 1);
            expect(linkBox.y + linkBox.height).toBeLessThanOrEqual(viewportBox.height + 1);

            const contrast = await link.evaluate((el) => {
              const parse = (color) => {
                const match = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([0-9.]+))?\)/);
                if (!match) return null;
                return { rgb: [Number(match[1]), Number(match[2]), Number(match[3])], alpha: match[4] === undefined ? 1 : Number(match[4]) };
              };
              const fg = parse(getComputedStyle(el).color);
              let node = el;
              let bg = null;
              while (node && node instanceof Element) {
                const parsed = parse(getComputedStyle(node).backgroundColor);
                if (parsed && parsed.alpha > 0.95) { bg = parsed; break; }
                node = node.parentElement;
              }
              if (!fg || !bg) return 0;
              const lum = (rgb) => {
                const toLin = (c) => {
                  const s = c / 255;
                  return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
                };
                return 0.2126 * toLin(rgb[0]) + 0.7152 * toLin(rgb[1]) + 0.0722 * toLin(rgb[2]);
              };
              const a = lum(fg.rgb);
              const b = lum(bg.rgb);
              return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
            });
            expect(contrast, `${name} contrast`).toBeGreaterThanOrEqual(4.5);
          }

          await page.screenshot({
            path: path.join(screenshotDir, `${locale}-${route.name}-${viewport.width}x${viewport.height}-open.png`),
            animations: 'disabled',
          });
        });
      }
    }
  }
});
