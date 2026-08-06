// Article → tool funnel: every article carries a category-matched deep link
// into the travel-tools hub.
const { test, expect } = require("@playwright/test");

test("a best-time article deep-links into the Best Time tool", async ({ page }) => {
  await page.goto("/blog/tuscany-in-august-2026/");
  const cue = page.locator("[data-testid='article-tool-cue']");
  await expect(cue).toBeVisible();
  await expect(cue).toHaveAttribute("href", "/travel-tools?tool=best-time");
  await expect(cue).toContainText("Best Time to Visit");
});

test("a Siena cluster page deep-links into the Itinerary Generator", async ({ page }) => {
  await page.goto("/piazza-del-campo-guide/");
  const cue = page.locator("[data-testid='article-tool-cue']");
  await expect(cue).toBeVisible();
  await expect(cue).toHaveAttribute("href", "/travel-tools?tool=itinerary");
  await expect(cue).toContainText("Itinerary Generator");
});

test("a packing article deep-links into the Smart Packing List and the link works", async ({ page }) => {
  await page.goto("/blog/summer-packing-list-for-tuscany-and-florence-2026/");
  const cue = page.locator("[data-testid='article-tool-cue']");
  await expect(cue).toHaveAttribute("href", "/travel-tools?tool=packing");
  await cue.click();
  // The deep link opens the tool's modal on the hub.
  await expect(page.locator("button:has-text('Generate Checklist')")).toBeVisible();
});
