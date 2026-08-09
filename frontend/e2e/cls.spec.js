// Anti-CLS: in-body article images carry measured width/height so the
// browser reserves their box before the file loads. The SVG diagrams were
// the one render path with zero reserved space (lazy-loaded, h-auto) —
// every page containing one shifted by the diagram's full height.
const { test, expect } = require("@playwright/test");

test("a lazy-loaded SVG diagram reserves its box with measured dimensions", async ({ page }) => {
  await page.goto("/blog/siena-parking-and-transfer-guide/");
  const diagram = page.locator("img[src*='siena-ztl-parking-diagram']");
  await expect(diagram).toHaveAttribute("width", "680");
  await expect(diagram).toHaveAttribute("height", "600");
});

test("the prerendered static shell carries the same dimensions", async ({ page }) => {
  // Fetch the prerendered file directly: serve-build.js has no
  // directory-index resolution, so the bare path returns the SPA shell.
  const res = await page.request.get("/blog/siena-parking-and-transfer-guide/index.html");
  expect(res.status()).toBe(200);
  const html = await res.text();
  const img = html.match(/<img[^>]*siena-ztl-parking-diagram[^>]*>/);
  expect(img).not.toBeNull();
  expect(img[0]).toContain('width="680"');
  expect(img[0]).toContain('height="600"');
});

test("raster body images carry measured dimensions too", async ({ page }) => {
  await page.goto("/blog/italy-hotels-no-ac-2026/");
  const img = page.locator("img[src*='tuscany-hidden-gems-monteriggioni']");
  await expect(img).toHaveAttribute("width", "1168");
  await expect(img).toHaveAttribute("height", "784");
});
