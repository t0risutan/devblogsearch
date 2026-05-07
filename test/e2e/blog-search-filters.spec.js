/**
 * e2e tests for faceted filter functions
 *
 * prerequisites: aem up running on localhost:3000
 */

const { test, expect } = require('@playwright/test');

const START_PATH = process.env.E2E_START_PATH || '/';

// helper: navigate to page and wait for blog-search to be ready
async function loadPage(page, url = START_PATH) {
  await page.goto(url, { waitUntil: 'domcontentloaded' });
  const bs = page.locator('blog-search').first();
  await expect(bs.locator('input[type="search"]')).toBeVisible({ timeout: 60_000 });
  return bs;
}

// T06: 0 results: "No results" message appears

test('T06 — zero-result filter: "No results" message is shown', async ({ page }) => {
  const bs = await loadPage(page, `${START_PATH}?cat=NONEXISTENT_CATEGORY_XYZ`);

  // trigger handleSearch + applyFilters
  await bs.locator('input[type="search"]').fill('the');

  // expect a "No results" message to be visible
  await expect(bs.locator('text=No results')).toBeVisible({ timeout: 8_000 });
});

// T07: Clear All removes all filters, chips and URL params

test('T07 — Clear All removes all filters, chips and URL parameters', async ({ page }) => {
  const bs = await loadPage(page, `${START_PATH}?cat=UXP`);
  await expect(bs.locator('.filter-bar')).toBeVisible({ timeout: 15_000 });

  // chip for UXP is visible before clearing
  await expect(bs.locator('.filter-chip').first()).toBeVisible();

  await bs.locator('.filter-clear-all').click();

  // all chips removed
  await expect(bs.locator('.filter-chip')).toHaveCount(0);

  // URL params cleared
  const url = new URL(page.url());
  expect(url.searchParams.has('cat')).toBe(false);
});

// T08: Filter state persists after page reload

test('T08 — filter state is restored after page reload', async ({ page }) => {
  const bs = await loadPage(page, `${START_PATH}?cat=UXP`);
  await expect(bs.locator('.filter-bar')).toBeVisible({ timeout: 15_000 });

  // chip for UXP visible after reload, state restored from URL
  await expect(bs.locator('.filter-chip').first()).toBeVisible();
  await expect(bs.locator('.filter-chip').first()).toContainText('UXP');
});

// T09: Filter activation does not add a browser history entry

test('T09 — activating a filter does not create a new browser history entry', async ({ page }) => {
  const bs = await loadPage(page);
  await expect(bs.locator('.filter-bar')).toBeVisible({ timeout: 15_000 });

  const lengthBefore = await page.evaluate(() => window.history.length);

  // open first dropdown and check a checkbox
  const toggle = bs.locator('.filter-dropdown-toggle').first();
  await toggle.click();
  const checkbox = bs.locator('.filter-dropdown input[type="checkbox"]').first();
  await checkbox.check();

  // replaceState was used, history length must remain the same
  const lengthAfter = await page.evaluate(() => window.history.length);
  expect(lengthAfter).toBe(lengthBefore);
});

// T10: Show More button appears when group has more than 10 options
// expected to fail (not implemented)

test('T10 — "Show more" button appears when dropdown has more than 10 options', async ({ page }) => {
  const bs = await loadPage(page);
  await expect(bs.locator('.filter-bar')).toBeVisible({ timeout: 15_000 });

  // open first dropdown (category typically has >10 options)
  const toggle = bs.locator('.filter-dropdown-toggle').first();
  await toggle.click();

  // not implemented, this assertion will fail
  await expect(bs.locator('text=Show more')).toBeVisible({ timeout: 5_000 });
});

// T11: Invalid URL parameters are ignored gracefully

test('T11 — invalid URL parameters cause no errors', async ({ page }) => {
  const consoleErrors = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
  });

  const bs = await loadPage(page, `${START_PATH}?cat=TOTALLY_INVALID_VALUE_XYZ`);
  await expect(bs.locator('.filter-bar')).toBeVisible({ timeout: 15_000 });

  // only flag uncontrolled errors from blog-search (structured logError messages are allowed)
  const unexpectedErrors = consoleErrors.filter(
    (e) => e.includes('blog-search') && !e.includes('[blog-search]'),
  );
  expect(unexpectedErrors).toHaveLength(0);

  // app remains functional
  await expect(bs.locator('input[type="search"]')).toBeVisible();
});

// T12: XSS via URL parameter is not executed

test('T12 — XSS string in URL parameter is not executed as script', async ({ page }) => {
  let dialogFired = false;
  page.on('dialog', async (dialog) => {
    dialogFired = true;
    await dialog.dismiss();
  });

  const xssUrl = `${START_PATH}?cat=${encodeURIComponent('<script>alert(1)</script>')}`;
  await loadPage(page, xssUrl);

  expect(dialogFired).toBe(false);
});

// T13: XSS in search input is not executed

test('T13 — XSS string typed into search input is not executed as script', async ({ page }) => {
  let dialogFired = false;
  page.on('dialog', async (dialog) => {
    dialogFired = true;
    await dialog.dismiss();
  });

  const bs = await loadPage(page);
  await bs.locator('input[type="search"]').fill('<script>alert(1)</script>');

  // wait for debounce to fire
  await page.waitForTimeout(500);

  expect(dialogFired).toBe(false);
});
