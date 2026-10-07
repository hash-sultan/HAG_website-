import { expect, test } from '@playwright/test';

test.describe('draft vehicle hiding and unlisted vehicle quote submission', () => {
  const draftSlugs = [
    'chinese-passenger-van',
    'chinese-commercial-van',
    'gac-gasoline-mpv',
    'denza-ev-mpv',
    'howo-truck',
    'commercial-crane',
  ];

  test('direct URL to a draft vehicle shows the 404 Not Found page', async ({ page }) => {
    for (const slug of draftSlugs) {
      await page.goto(`/vehicles/${slug}`);
      await expect(page.locator('.not-found')).toBeVisible();
      await expect(page.locator('.not-found .eyebrow')).toContainText('404');
    }
  });

  test('active vehicle detail page loads properly and does not show 404', async ({ page }) => {
    await page.goto('/vehicles/zeekr-9x');
    await expect(page.locator('.detail-hero')).toBeVisible();
    await expect(page.locator('.not-found')).toHaveCount(0);
  });

  test('the quote form vehicle picker excludes all draft vehicles', async ({ page }) => {
    await page.goto('/contact');
    await page.evaluate(() => document.fonts.ready.then(() => true));

    const vehicleSelect = page.locator('.quote-form select').filter({ hasText: 'Add a vehicle' });
    await expect(vehicleSelect).toBeVisible();

    const optionValues = await vehicleSelect.locator('option').evaluateAll((opts) => opts.map(o => o.value));

    for (const draft of draftSlugs) {
      expect(optionValues).not.toContain(draft);
    }

    // Verify active vehicles and "Other / not listed" are present
    expect(optionValues).toContain('zeekr-9x');
    expect(optionValues).toContain('xiaomi-su7-ev');
    expect(optionValues).toContain('__other__');
  });

  test('visiting /contact?vehicle=<draft-slug> falls back gracefully without crashing', async ({ page }) => {
    await page.goto('/contact?vehicle=howo-truck');
    await expect(page.locator('.quote-form')).toBeVisible();
    // No draft button pill in chosen vehicles
    const chosenPills = page.locator('.chosen-vehicles button');
    await expect(chosenPills).toHaveCount(0);
  });

  test('submitting "Other / not listed" option sends otherVehicle text to API', async ({ page }) => {
    let capturedBody = null;

    // Stub/mock the API endpoint so no real network email is sent
    await page.route('**/api/quotes', async (route) => {
      const request = route.request();
      capturedBody = JSON.parse(request.postData() || '{}');
      await route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify({
          id: 99991,
          createdAt: new Date().toISOString(),
        }),
      });
    });

    await page.goto('/contact');
    await page.evaluate(() => document.fonts.ready.then(() => true));

    // Fill contact details
    await page.locator('input[name="name"]').fill('Alex Mercer');
    await page.locator('.quote-form select').filter({ hasText: 'Select destination country' }).selectOption('KZ');
    await page.locator('input[type="email"]').fill('alex@centralasia-auto.kz');

    // Select "Other / not listed"
    const vehicleSelect = page.locator('.quote-form select').filter({ hasText: 'Add a vehicle' });
    await vehicleSelect.selectOption('__other__');

    // Free text input should appear
    const otherInput = page.locator('.other-vehicle-input');
    await expect(otherInput).toBeVisible();
    await otherInput.fill('BYD Yangwang U9 supercar in bespoke yellow');

    // Accept consent
    await page.locator('input[name="consent"]').check();

    // Submit form
    await page.locator('.submit-button').click();

    // Verify success response
    await expect(page.locator('.success-panel')).toBeVisible();
    await expect(page.locator('.success-panel')).toContainText('99991');

    // Verify captured payload received by API
    expect(capturedBody).not.toBeNull();
    expect(capturedBody.otherVehicle).toBe('BYD Yangwang U9 supercar in bespoke yellow');
    expect(capturedBody.name).toBe('Alex Mercer');
    expect(capturedBody.country).toBe('KZ');
    expect(capturedBody.email).toBe('alex@centralasia-auto.kz');
  });
});
