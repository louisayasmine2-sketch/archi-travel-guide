// Listing pages must not download the article corpus. articles.js carries
// every article BODY (>1MB and growing with each new article); only the
// article route itself needs it. These tests fail the day a listing page
// imports the store again.
const { test, expect } = require("@playwright/test");

// A phrase that exists only inside an article body, never in card metadata.
const BODY_PHRASE = "Piazza del Campo & Palazzo Pubblico";

async function jsBytes(page, url) {
  const sizes = new Map();
  page.on("response", async (res) => {
    const u = res.url();
    if (!u.endsWith(".js") || !u.includes("/static/js/")) return;
    try {
      sizes.set(u, (await res.body()).length);
    } catch {
      /* response body already discarded — ignore */
    }
  });
  await page.goto(url);
  await page.waitForLoadState("networkidle");
  return [...sizes.entries()];
}

test("the blog listing does not ship article bodies", async ({ page }) => {
  const chunks = await jsBytes(page, "/blog");
  const total = chunks.reduce((n, [, bytes]) => n + bytes, 0);
  // The corpus chunk alone is >1MB; a listing page has no business near that.
  expect(total).toBeLessThan(900 * 1024);

  // Belt and braces: no loaded chunk may contain article body prose.
  const withBodies = [];
  for (const [url] of chunks) {
    const body = await (await page.request.get(url)).text();
    if (body.includes(BODY_PHRASE)) withBodies.push(url);
  }
  expect(withBodies).toEqual([]);

  // …and the page still renders real cards from the index.
  await expect(page.locator("#root a[href*='/blog/']").first()).toBeVisible();
});

test("destination pages do not ship article bodies", async ({ page }) => {
  for (const route of ["/siena", "/tuscany-travel-guide/"]) {
    const chunks = await jsBytes(page, route);
    const total = chunks.reduce((n, [, bytes]) => n + bytes, 0);
    expect(total, `${route} javascript payload`).toBeLessThan(900 * 1024);
  }
});

test("the article route still renders its full body", async ({ page }) => {
  // The corpus is legitimately loaded here — this guards against "fixing"
  // the bundle by breaking the article itself.
  await page.goto("/blog/siena-2-day-itinerary/");
  await expect(page.locator("#main-content, article").first()).toBeVisible();
  await expect(page.locator("[data-testid='related-articles']")).toBeVisible();
});
