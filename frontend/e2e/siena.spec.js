// The /siena destination page's depth layer: verified operational rules,
// the My Trip-aware plan strip, the fact-checked map, and the month cue.
const { test, expect } = require("@playwright/test");

test("know-before-you-go shows the three verified rules with their checked dates", async ({ page }) => {
  await page.goto("/siena");
  await expect(page.locator("text=Know before you go")).toBeVisible();
  await expect(page.locator("h3:has-text('Torre del Mangia')")).toBeVisible();
  await expect(page.locator("h3:has-text('Siena Cathedral')")).toBeVisible();
  await expect(page.locator("h3:has-text('Piazza del Campo')")).toBeVisible();
  await expect(page.locator("text=Checked 20 July 2026")).toHaveCount(3);
});

test("plan strip adapts to a saved Siena trip, including the Palio warning", async ({ page }) => {
  await page.goto("/siena");
  await expect(page.locator("text=Planning a Siena trip?")).toBeVisible();
  await expect(page.locator("a:has-text('Plan your Siena trip')")).toBeVisible();

  // Save a Siena plan whose dates overlap 16 August, then return.
  const year = new Date().getFullYear() + 1;
  await page.goto("/travel-tools");
  const selects = page.locator(".mb-12 select");
  const inputs = page.locator(".mb-12 input");
  await selects.nth(0).selectOption("Siena");
  await inputs.nth(0).fill("8");
  await page.locator(".mb-12 input[type=date]").fill(`${year}-08-10`);

  await page.goto("/siena");
  await expect(page.locator("text=days to your Siena trip")).toBeVisible();
  await expect(page.locator("a:has-text('Open your Trip Sheet')")).toBeVisible();
  await expect(page.locator("text=Your dates overlap the Palio")).toBeVisible();
});

test("the verified map renders and the month cue never dead-links", async ({ page }) => {
  await page.goto("/siena");
  await expect(page.locator(".leaflet-container")).toBeVisible();
  await expect(page.locator("text=The lie of the land")).toBeVisible();

  // Month cue: at most one, and when present it links to a month-guide slug.
  const cue = page.locator("a:has-text('Going this month?')");
  const count = await cue.count();
  expect(count).toBeLessThanOrEqual(1);
  if (count === 1) {
    await expect(cue).toHaveAttribute("href", /-in-[a-z]+-2\d{3}\/$/);
  }
});
