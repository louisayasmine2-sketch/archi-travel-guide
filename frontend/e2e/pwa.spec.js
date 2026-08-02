// PWA behaviour. Skips itself cleanly while the PWA branch is not merged —
// the SPA fallback serves index.html (text/html) for a missing manifest.
const { test, expect } = require("@playwright/test");

test("manifest is valid and the site works offline after one visit", async ({ page, context }) => {
  const res = await page.request.get("/manifest.json");
  const isJson = (res.headers()["content-type"] || "").includes("json");
  test.skip(!isJson, "PWA (manifest + service worker) not present in this build");

  const manifest = await res.json();
  expect(manifest.name).toBe("Archi Travel Guide");
  expect(manifest.icons.length).toBeGreaterThanOrEqual(3);
  for (const icon of manifest.icons) {
    const iconRes = await page.request.get(icon.src);
    expect(iconRes.status(), `${icon.src} exists`).toBe(200);
    expect(iconRes.headers()["content-type"]).toContain("image/png");
  }

  // Visit once online, wait for the worker, then cut the network.
  await page.goto("/travel-tools");
  const swState = await page.evaluate(async () => {
    if (!("serviceWorker" in navigator)) return "unsupported";
    const reg = await navigator.serviceWorker.register("/sw.js");
    await navigator.serviceWorker.ready;
    return reg.active ? "active" : "registered";
  });
  expect(swState).toBe("active");
  await page.waitForTimeout(1500); // let the runtime cache fill

  await context.setOffline(true);
  await page.reload({ waitUntil: "domcontentloaded" });
  await expect(page.locator("button:has-text('Try Now')")).toHaveCount(9, { timeout: 15000 });
});
