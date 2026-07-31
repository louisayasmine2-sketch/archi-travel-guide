// Site-wide behaviour: the header trip chip and the absence of decorative UI.
const { test, expect } = require("@playwright/test");

test("header trip chip appears only after a plan is saved, on every page", async ({ page }) => {
  await page.goto("/travel-tools");
  const chip = page.locator("header a[href*='trip-sheet']");
  await expect(chip).toHaveCount(0);

  // Any change to the My Trip bar saves a plan.
  await page.locator(".mb-12 select").nth(0).selectOption("Tuscany");
  await expect(chip).toBeVisible();
  await expect(chip).toContainText("Tuscany");

  await page.goto("/siena");
  await expect(page.locator("header a[href*='trip-sheet']")).toBeVisible();
});

test("header has no decorative language switcher", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("header").getByText("Italiano")).toHaveCount(0);
  await expect(page.locator("header").getByText("Bahasa ID")).toHaveCount(0);
});
