// /tuscany-travel-guide destination parity: the same My Trip-aware plan
// strip and month cue that /siena carries.
const { test, expect } = require("@playwright/test");

test("plan strip adapts to a saved Tuscany trip", async ({ page }) => {
  await page.goto("/tuscany-travel-guide/");
  await expect(page.locator("text=Planning a Tuscany trip?")).toBeVisible();
  await expect(page.locator("a:has-text('Plan your Tuscany trip')")).toBeVisible();

  // Save a Tuscany plan on the hub, then return.
  const year = new Date().getFullYear() + 1;
  await page.goto("/travel-tools");
  const selects = page.locator(".mb-12 select");
  const inputs = page.locator(".mb-12 input");
  await selects.nth(0).selectOption("Tuscany");
  await inputs.nth(0).fill("6");
  await page.locator(".mb-12 input[type=date]").fill(`${year}-05-10`);

  await page.goto("/tuscany-travel-guide/");
  await expect(page.locator("text=days to your Tuscany trip")).toBeVisible();
  await expect(page.locator("a:has-text('Open your Trip Sheet')")).toBeVisible();
});

test("the month cue never dead-links on the Tuscany page", async ({ page }) => {
  await page.goto("/tuscany-travel-guide/");
  const cue = page.locator("a:has-text('Going this month?')");
  const count = await cue.count();
  expect(count).toBeLessThanOrEqual(1);
  if (count === 1) {
    await expect(cue).toHaveAttribute("href", /-in-[a-z]+-2\d{3}\/$/);
  }
});
