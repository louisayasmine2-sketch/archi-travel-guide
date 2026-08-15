// Date-scheduled publishing. Articles go live by date, evaluated in the
// visitor's browser — so a listing that filtered at BUILD time would hide an
// article that is already live on its own URL until the next deploy.
// lib/publishedArticles.js is the one place the generated index is read.
const { test, expect } = require("@playwright/test");
const fs = require("fs");
const path = require("path");

const INDEX = JSON.parse(
  fs.readFileSync(path.join(__dirname, "..", "src", "data", "articlesIndex.json"), "utf-8")
);
const now = Date.now();
const byNewest = (a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt);
// The file is written in store order; listings sort. Sort here too so
// "newest" means the same thing in the test as on the page.
const live = INDEX.filter((a) => Date.parse(a.publishedAt) <= now).sort(byNewest);
const scheduled = INDEX.filter((a) => Date.parse(a.publishedAt) > now)
  .sort((a, b) => Date.parse(a.publishedAt) - Date.parse(b.publishedAt));

test("the generated index carries scheduled articles, not just published ones", () => {
  // If this is empty the index has been filtered at build time again, and
  // publication silently depends on deploys.
  expect(scheduled.length).toBeGreaterThan(0);
  for (const entry of INDEX) {
    expect(Number.isNaN(Date.parse(entry.publishedAt)), `${entry.slug} publishedAt`).toBe(false);
  }
});

test("the newest published article appears in the blog listing", async ({ page }) => {
  // Today's article — live by date, and only in the listing because the
  // filter runs in the browser rather than at build time.
  const newest = live.filter((a) => a.store === "articles")[0];
  await page.goto("/blog");
  await expect(page.locator(`text=${newest.title}`).first()).toBeVisible();
  await expect(page.locator("text=Updated").first()).toBeVisible();
});

test("scheduled articles stay out of listings and search", async ({ page }) => {
  const next = scheduled[0];
  await page.goto("/blog");
  await expect(page.locator(`text=${next.title}`)).toHaveCount(0);

  // …and out of search suggestions.
  await page.goto("/");
  await page.getByRole("button", { name: "Search the site" }).click();
  const words = next.title.split(/\s+/).slice(0, 3).join(" ");
  await page.getByTestId("nav-search-input").fill(words);
  const suggestions = page.getByTestId("nav-search-suggestion");
  const count = await suggestions.count();
  for (let i = 0; i < count; i += 1) {
    await expect(suggestions.nth(i)).not.toContainText(next.title);
  }
});

test("only lib/publishedArticles.js reads the raw index", () => {
  // A component importing the JSON directly would show tomorrow's article
  // today — the exact bug this module exists to prevent.
  const srcDir = path.join(__dirname, "..", "src");
  const offenders = [];
  const walk = (dir) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (/\.(js|jsx)$/.test(entry.name)) {
        const text = fs.readFileSync(full, "utf-8");
        if (text.includes("data/articlesIndex.json") && !full.endsWith("publishedArticles.js")) {
          offenders.push(path.relative(srcDir, full));
        }
      }
    }
  };
  walk(srcDir);
  expect(offenders).toEqual([]);
});
