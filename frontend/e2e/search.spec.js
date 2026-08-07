// Site search: live header suggestions from the published-content index,
// and a /blog?q= listing that actually filters (it once silently ignored
// its query — these tests keep that from coming back).
const { test, expect } = require("@playwright/test");

test("header search suggests a real guide and navigates to it", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Search the site" }).click();
  await page.getByTestId("nav-search-input").fill("packing");
  const suggestions = page.getByTestId("nav-search-suggestion");
  await expect(suggestions.first()).toBeVisible();
  await suggestions.first().click();
  await expect(page).toHaveURL(/packing/);
  await expect(page.locator("#main-content h1, h1").first()).toBeVisible();
});

test("header search surfaces tools and deep-links into the hub", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Search the site" }).click();
  await page.getByTestId("nav-search-input").fill("budget planner");
  const tool = page.getByTestId("nav-search-suggestion").filter({ hasText: "Tuscany Budget Planner" });
  await expect(tool.first()).toBeVisible();
  await tool.first().click();
  await expect(page).toHaveURL(/travel-tools\?tool=budget/);
  await expect(page.locator("[role='dialog']")).toBeVisible();
});

test("/blog?q= filters the list, shows an honest count, and clears", async ({ page }) => {
  await page.goto("/blog?q=palio");
  const summary = page.getByTestId("blog-search-summary");
  await expect(summary).toBeVisible();
  await expect(summary).toContainText(/\d+ guides? match/);
  await page.getByTestId("blog-search-clear").click();
  await expect(page.getByTestId("blog-search-summary")).toHaveCount(0);
});

test("a query matching nothing says so instead of showing everything", async ({ page }) => {
  await page.goto("/blog?q=zzyzxqx");
  await expect(page.locator("text=No guides match")).toBeVisible();
  await expect(page.locator("#root a[href*='/blog/']:has(h3)")).toHaveCount(0);
});
