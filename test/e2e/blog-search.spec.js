/**
 * Integration test against a running local AEM / Franklin dev server.
 *
 * Prerequisites:
 *   - `aem up` (or equivalent) so the site responds at E2E_BASE_URL (default http://localhost:3000)
 *   - A page that loads scripts.js and injects <blog-search> (e.g. home with Milo top nav)
 *
 * Run: npm run test:e2e
 *
 * Optional env:
 *   E2E_BASE_URL   — origin (default http://localhost:3000)
 *   E2E_START_PATH — first navigation path (default /). Use /en/ if that is where gnav loads.
 */
const { test, expect } = require('@playwright/test');

test.describe('blog-search', () => {
  test('typing "creative" shows at least one result', async ({ page }) => {
    const startPath = process.env.E2E_START_PATH || '/';
    // `load` fires before scripts.js finishes await loadArea(); blog-search is injected after that.
    await page.goto(startPath, { waitUntil: 'domcontentloaded' });

    await expect(
      page.locator('.feds-topnav'),
      'Milo top nav not found. Try E2E_START_PATH=/ or /en/ and ensure aem up is running.',
    ).toBeVisible({ timeout: 45_000 });

    const search = page.locator('blog-search').first();
    const input = search.locator('.search-input');
    await expect(
      input,
      'blog-search is injected only after loadArea(). Wait for shadow input, not just <blog-search>.',
    ).toBeVisible({ timeout: 60_000 });
    await input.fill('creative');

    // Debounce 300ms in blog-search.js, then fetch query index (see data-source on <blog-search>).
    const firstTitle = search.locator('.search-result-title').first();
    await expect(firstTitle).toBeVisible({ timeout: 30_000 });
  });
});
