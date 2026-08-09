// "Save to My Trip": guides bookmarked on article pages appear as a reading
// list on the Trip Sheet (with full URLs for the printed copy) and can be
// unsaved again.
const { test, expect } = require("@playwright/test");

test("saving a guide puts it on the trip sheet, unsaving removes it", async ({ page }) => {
  await page.goto("/blog/siena-with-kids/");
  const btn = page.getByTestId("save-guide");
  await expect(btn).toContainText("Save to My Trip");
  await btn.click();
  await expect(btn).toContainText("Saved to My Trip");
  await expect(btn).toHaveAttribute("aria-pressed", "true");

  await page.goto("/travel-tools?tool=trip-sheet");
  const section = page.getByTestId("saved-guides");
  await expect(section).toBeVisible();
  await expect(section).toContainText("Siena with Kids");
  // The printed copy needs a real absolute URL.
  await expect(section).toContainText("https://affittacameregliarchi.com/blog/siena-with-kids");

  // Unsave from the article page; the sheet section disappears.
  await page.goto("/blog/siena-with-kids/");
  await page.getByTestId("save-guide").click();
  await expect(page.getByTestId("save-guide")).toContainText("Save to My Trip");
  await page.goto("/travel-tools?tool=trip-sheet");
  await expect(page.getByTestId("saved-guides")).toHaveCount(0);
});

test("cluster pages can be saved too and persist across reloads", async ({ page }) => {
  await page.goto("/piazza-del-campo-guide/");
  await page.getByTestId("save-guide").click();
  await expect(page.getByTestId("save-guide")).toContainText("Saved to My Trip");

  await page.reload();
  await expect(page.getByTestId("save-guide")).toContainText("Saved to My Trip");

  await page.goto("/travel-tools?tool=trip-sheet");
  await expect(page.getByTestId("saved-guides")).toContainText("Piazza del Campo");
});
