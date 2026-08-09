// Relevance-scored "Keep reading" (lib/relatedArticles.js). The old logic
// showed the same three file-order articles on every Tuscany page; these
// tests pin the two behaviours that prove scoring is actually applied.
const { test, expect } = require("@playwright/test");

test("a family-travel article recommends its sibling first, not file-order filler", async ({ page }) => {
  await page.goto("/blog/siena-with-kids/");
  const cards = page.locator("[data-testid='related-articles'] a");
  await expect(cards.first()).toBeVisible();
  // Highest score: same category + same region + shared title keywords.
  // Slash-tolerant: canonicalPath formatting varies per article.
  await expect(cards.first()).toHaveAttribute("href", /^\/blog\/siena-with-kids-in-one-day\/?$/);
});

test("a monthly guide recommends other monthly guides, never itself", async ({ page }) => {
  await page.goto("/blog/tuscany-in-august-2026/");
  const cards = page.locator("[data-testid='related-articles'] a");
  await expect(cards).toHaveCount(3);
  const hrefs = await cards.evaluateAll((els) => els.map((el) => el.getAttribute("href")));
  expect(new Set(hrefs).size).toBe(3);
  expect(hrefs).not.toContain("/blog/tuscany-in-august-2026");
  expect(hrefs.some((h) => /tuscany-in-[a-z]+-2\d{3}/.test(h))).toBe(true);
});
