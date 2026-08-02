// Accessibility & resilience polish: skip link, working header search,
// offline banner, helpful 404.
const { test, expect } = require("@playwright/test");

test("skip link jumps keyboard users to the main content", async ({ page }) => {
  await page.goto("/");
  const skip = page.locator("a.skip-link");
  await expect(skip).toHaveAttribute("href", "#main-content");
  await skip.focus();
  await expect(skip).toBeVisible();
  await expect(page.locator("main#main-content")).toHaveCount(1);
});

test("header search actually searches", async ({ page }) => {
  await page.goto("/");
  await page.locator("[aria-label='Search the site']").click();
  await page.locator("[data-testid='nav-search-input']").fill("parking");
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/\/blog\?q=parking/);
});

test("offline banner appears when the connection drops and clears on reconnect", async ({ page, context }) => {
  await page.goto("/travel-tools");
  await expect(page.locator("text=You're offline")).toHaveCount(0);
  await context.setOffline(true);
  await expect(page.locator("text=You're offline")).toBeVisible();
  await context.setOffline(false);
  await expect(page.locator("text=You're offline")).toHaveCount(0);
});

test("llms.txt follows the spec shape and carries real links", async ({ page }) => {
  const res = await page.request.get("/llms.txt");
  expect(res.status()).toBe(200);
  const body = await res.text();
  expect(body.startsWith("# Archi Travel Guide")).toBe(true);
  expect(body).toContain("\n> ");            // required blockquote summary
  expect(body).toContain("\n## Start here"); // H2 link-list sections
  expect(body).toContain("\n## Guides");
  const links = body.match(/^- \[[^\]]+\]\(https?:\/\/[^)]+\)/gm) || [];
  expect(links.length).toBeGreaterThanOrEqual(30);
  expect(body).not.toContain("localhost");
});

test("404 page offers search and the most useful routes", async ({ page }) => {
  await page.goto("/this-page-does-not-exist");
  await expect(page.locator("text=Not every road is paved.")).toBeVisible();
  const main = page.locator("#main-content");
  await expect(main.locator("a:has-text('Travel Tools')")).toBeVisible();
  await expect(main.locator("a:has-text('Florence → Siena transport')")).toBeVisible();
  await page.locator("input[aria-label='Search guides']").fill("palio");
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/\/blog\?q=palio/);
});
