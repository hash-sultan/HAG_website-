import { expect, test } from '@playwright/test';

const mobileViewports = [
  { name: '390x844 portrait', width: 390, height: 844 },
  { name: '844x390 landscape', width: 844, height: 390 },
  { name: '360x640 portrait', width: 360, height: 640 },
  { name: '640x360 landscape', width: 640, height: 360 },
];

test.describe('mobile catalog vehicle visibility', () => {
  for (const vp of mobileViewports) {
    test(`all 15 active vehicles are reachable and visible at ${vp.name}`, async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto('/vehicles');
      await page.evaluate(() => document.fonts.ready.then(() => true));

      const cards = page.locator('.catalog-grid .vehicle-card');
      await expect(cards).toHaveCount(15);

      // Verify every single card is visible and reachable
      for (let i = 0; i < 15; i += 1) {
        const card = cards.nth(i);
        await card.scrollIntoViewIfNeeded();
        await expect(card).toBeVisible();
      }
    });
  }
});
