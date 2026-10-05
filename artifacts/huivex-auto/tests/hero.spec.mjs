import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import { expect, test } from '@playwright/test';

const landscapeSizes = [
  { width: 568, height: 320 },
  { width: 667, height: 375 },
  { width: 844, height: 390 },
  { width: 932, height: 430 },
];
const screenshotDir = path.resolve(import.meta.dirname, '../../../docs/audit/after-A');

async function touchSwipe(page, selector, direction = 'left') {
  const box = await page.locator(selector).boundingBox();
  expect(box, `${selector} should be visible before the swipe`).not.toBeNull();
  const session = await page.context().newCDPSession(page);
  const startX = box.x + box.width * (direction === 'left' ? 0.82 : 0.18);
  const endX = box.x + box.width * (direction === 'left' ? 0.18 : 0.82);
  const y = box.y + box.height * 0.55;
  const point = (x) => ({ x: Math.round(x), y: Math.round(y), id: 1, radiusX: 2, radiusY: 2, force: 1 });

  await session.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [point(startX)] });
  for (let step = 1; step <= 5; step += 1) {
    const x = startX + ((endX - startX) * step) / 5;
    await session.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [point(x)] });
  }
  await session.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
  await session.detach();
}

test('hero fits the four required short-landscape viewports and saves screenshots', async ({ page }) => {
  await mkdir(screenshotDir, { recursive: true });

  for (const { width, height } of landscapeSizes) {
    await page.setViewportSize({ width, height });
    await page.goto('/');
    await expect(page.locator('.hero-slide')).toHaveCount(4);
    await expect(page.locator('.hero-slide.is-active')).toBeVisible();
    await page.evaluate(() => document.fonts.ready.then(() => true));

    const layout = await page.evaluate(() => {
      const hero = document.querySelector('.hero').getBoundingClientRect();
      const header = document.querySelector('.site-header').getBoundingClientRect();
      const actions = document.querySelector('.hero-slide.is-active .hero-actions').getBoundingClientRect();
      const pagination = document.querySelector('.hero-pagination').getBoundingClientRect();
      return {
        viewportWidth: document.documentElement.clientWidth,
        documentWidth: document.documentElement.scrollWidth,
        heroHeight: hero.height,
        headerHeight: header.height,
        actionsBottom: actions.bottom,
        paginationTop: pagination.top,
      };
    });

    expect(layout.documentWidth, `horizontal overflow at ${width}×${height}`).toBeLessThanOrEqual(layout.viewportWidth);
    expect(layout.heroHeight, `hero should match the ${height}px landscape viewport`).toBeCloseTo(height, 0);
    expect(layout.headerHeight, 'landscape header should be 56px').toBeCloseTo(56, 0);
    expect(layout.actionsBottom, 'hero actions should clear the bottom carousel controls').toBeLessThanOrEqual(layout.paginationTop - 8);

    await page.screenshot({
      path: path.join(screenshotDir, `hero-${width}x${height}.png`),
      animations: 'disabled',
    });
  }
});

test('audit-listed and carousel controls are at least 44px with 8px group spacing', async ({ page }) => {
  await page.setViewportSize({ width: 568, height: 320 });
  for (const route of ['/', '/vehicles']) {
    await page.goto(route);
    const targetResults = await page.evaluate(() => {
      const selector = [
        '.language-btn',
        '.menu-toggle',
        '.header-cta',
        '.hero-pagination button',
        '.hero-arrows button',
        '.featured-dots button',
        '.featured-arrows button',
        '.chips button',
        '.catalog-results > button',
        '.quick-button',
        '.quick-menu > a',
        '.quick-menu > button',
      ].join(',');
      return [...document.querySelectorAll(selector)].flatMap((element) => {
        const rect = element.getBoundingClientRect();
        const style = getComputedStyle(element);
        if (style.display === 'none' || style.visibility === 'hidden' || rect.width === 0 || rect.height === 0) return [];
        return [{
          label: element.getAttribute('aria-label') || element.textContent?.trim() || element.className,
          width: rect.width,
          height: rect.height,
        }];
      });
    });
    expect(targetResults.length, `expected to find measured controls on ${route}`).toBeGreaterThan(0);
    expect(
      targetResults.filter((target) => target.width < 44 || target.height < 44),
      `undersized controls on ${route}: ${JSON.stringify(targetResults)}`,
    ).toEqual([]);

    const spacingResults = await page.evaluate(() => {
      const selectors = ['.nav-actions', '.hero-pagination', '.hero-arrows', '.featured-dots', '.featured-arrows', '.chips', '.quick-menu'];
      return selectors.flatMap((selector) => {
        const element = document.querySelector(selector);
        if (!element || element.children.length < 2 || getComputedStyle(element).display === 'none') return [];
        return [{ selector, gap: parseFloat(getComputedStyle(element).columnGap) }];
      });
    });
    expect(spacingResults.filter((group) => group.gap < 8), `groups with less than 8px spacing on ${route}`).toEqual([]);
  }
});

test('hero and featured carousels respond to real touch-emulated swipes', async ({ browser }) => {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
    deviceScaleFactor: 1,
  });
  const page = await context.newPage();
  await page.goto('/');

  const heroDots = page.locator('.hero-pagination button');
  const beforeHero = await page.locator('.hero-pagination button[aria-current="true"]').getAttribute('aria-label');
  await touchSwipe(page, '.hero-viewport');
  await expect.poll(() => page.locator('.hero-pagination button[aria-current="true"]').getAttribute('aria-label')).not.toBe(beforeHero);

  await page.locator('.featured-viewport').scrollIntoViewIfNeeded();
  const beforeFeatured = await page.locator('.featured-dots button[aria-current="true"]').getAttribute('aria-label');
  await touchSwipe(page, '.featured-viewport');
  await expect.poll(() => page.locator('.featured-dots button[aria-current="true"]').getAttribute('aria-label')).not.toBe(beforeFeatured);
  await expect(heroDots).toHaveCount(4);
  await context.close();
});

test('hero selection, open navigation, and typed quote fields survive orientation changes', async ({ browser }) => {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
    deviceScaleFactor: 1,
  });
  const page = await context.newPage();
  await page.goto('/');

  await page.locator('.hero-pagination button').nth(1).click();
  await expect(page.locator('.hero-pagination button[aria-current="true"]')).toHaveAttribute('aria-label', 'Show slide 2');
  await page.getByRole('button', { name: 'Open menu' }).click();
  await expect(page.locator('.mobile-drawer')).toHaveClass(/drawer-open/);
  await page.setViewportSize({ width: 844, height: 390 });
  await expect(page.locator('.mobile-drawer')).toHaveClass(/drawer-open/);
  await expect(page.locator('.hero-pagination button[aria-current="true"]')).toHaveAttribute('aria-label', 'Show slide 2');

  await page.getByRole('button', { name: 'Close site menu' }).click();
  await page.goto('/contact');
  await page.locator('input[name="name"]').fill('Rotation Test');
  await page.locator('input[type="email"]').fill('rotation@example.test');
  await page.setViewportSize({ width: 667, height: 375 });
  await expect(page.locator('input[name="name"]')).toHaveValue('Rotation Test');
  await expect(page.locator('input[type="email"]')).toHaveValue('rotation@example.test');
  await context.close();
});