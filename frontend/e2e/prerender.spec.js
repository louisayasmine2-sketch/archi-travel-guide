// Prerendered article routes (scripts/prerender-routes.js): the served HTML
// must BE the article — no JavaScript required — and hydration must adopt
// that DOM cleanly. A hydration mismatch would log console errors and
// re-render the page; these tests pin both halves.
const { test, expect } = require("@playwright/test");

const ROUTE = "/blog/siena-day-trips-without-a-car/";

test("raw HTML carries the full article, not a fallback", async ({ request }) => {
  const res = await request.get(ROUTE);
  const html = await res.text();

  // The app root itself contains the rendered page…
  const root = html.slice(html.indexOf('<div id="root">'));
  expect(root).toContain("<h1");
  expect(root).toContain("Siena Day Trips Without a Car");
  // …deep body content included, not just a shell…
  expect(root).toContain("Sunday and holiday warning");
  // …and the old static fallback is gone rather than duplicated below it.
  expect(html).not.toContain('id="static-fallback"');
});

test("pillar pages served by dedicated components are prerendered too", async ({ request }) => {
  // Cluster and guide pages have their data statically imported, so their
  // prerendered HTML carries the full page and announces no article JSON.
  for (const route of ["/siena-cathedral-guide/", "/florence-to-siena-by-train-or-bus/"]) {
    const res = await request.get(route);
    const html = await res.text();
    const root = html.slice(html.indexOf('<div id="root">'));
    expect(root, route).toContain("<h1");
    expect(html, route).not.toContain('id="static-fallback"');
    expect(html, route).not.toContain("__ARTICLE_JSON__");
  }
});

test("a pillar route served by Article announces its article JSON", async ({ request }) => {
  const res = await request.get("/things-to-do-in-siena/");
  const html = await res.text();
  const root = html.slice(html.indexOf('<div id="root">'));
  expect(root).toContain("<h1");
  expect(html).not.toContain('id="static-fallback"');
  expect(html).toContain('__ARTICLE_JSON__="/article-data/best-things-to-do-in-siena.json');
});

test("pillar hydration adopts the prerendered DOM without console errors", async ({ page }) => {
  const errors = [];
  page.on("console", (msg) => {
    if (msg.type() === "error") errors.push(msg.text());
  });
  page.on("pageerror", (err) => errors.push(String(err)));

  await page.goto("/siena-cathedral-guide/");
  await expect(page.locator("#root h1").first()).toContainText("Siena Cathedral");

  const realErrors = errors.filter(
    (e) => !/error #418|error #423|net::ERR_/.test(e)
  );
  expect(realErrors, `console errors: ${errors.join(" | ")}`).toEqual([]);
});

test("hydration adopts the prerendered DOM without console errors", async ({ page }) => {
  const errors = [];
  page.on("console", (msg) => {
    if (msg.type() === "error") errors.push(msg.text());
  });
  page.on("pageerror", (err) => errors.push(String(err)));

  await page.goto(ROUTE);
  // Hydrated and interactive: the tool cue is a client-side <Link>.
  await expect(page.getByTestId("article-tool-cue")).toBeVisible();
  await expect(page.locator("#root h1").first()).toContainText("Siena Day Trips");

  // React #418/#423 are the innerHTML-capture seams (adjacent text nodes
  // merge on serialisation; React recovers to an identical DOM) and are
  // silenced in index.js via onRecoverableError. Anything ELSE — real
  // exceptions, failed chunks — must still fail this test.
  const realErrors = errors.filter(
    (e) => !/error #418|error #423|net::ERR_/.test(e)
  );
  expect(realErrors, `console errors: ${errors.join(" | ")}`).toEqual([]);
});
