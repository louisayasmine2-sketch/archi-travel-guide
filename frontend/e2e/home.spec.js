// Homepage engagement layer: month picker, resume-trip band, Palio countdown.
const { test, expect } = require("@playwright/test");

test("month picker shows a guide for covered months and an honest fallback otherwise", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("text=When are you going?")).toBeVisible();

  // August has a published guide — the panel must link to it.
  await page.locator("button:has-text('August')").click();
  await expect(page.locator("text=Month guide")).toBeVisible();
  const readLink = page.locator("a:has-text('Read the August guide')");
  await expect(readLink).toBeVisible();
  await expect(readLink).toHaveAttribute("href", /tuscany-in-august/);

  // Every month must resolve to EITHER a real guide link or the honest
  // fallback — never a dead link. Which months are covered changes as guides
  // ship (a hardcoded "February has no guide" assertion went stale), so walk
  // all twelve and assert the invariant on each.
  const MONTHS = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];
  for (const m of MONTHS) {
    await page.locator(`button:has-text('${m}')`).click();
    const link = page.locator(`a:has-text('Read the ${m} guide')`);
    const fallback = page.locator(`text=No dedicated ${m} guide yet`);
    if (await link.count()) {
      await expect(link).toHaveAttribute("href", new RegExp(`-in-${m.toLowerCase()}-2\\d{3}`));
    } else {
      await expect(fallback).toBeVisible();
      // The fallback still gives verified best-time context instead of nothing.
      await expect(page.locator("text=May, June, September")).toBeVisible();
    }
  }

  // The panel carries its seasonal illustration in both states.
  await expect(page.locator(".tuscan-scene")).toHaveCount(1);
});

test("prerendered fallback paints without JS and is swapped out after hydration", async ({ page, browser }) => {
  // Hydrated visit: React removed the fallback, real hero is up.
  await page.goto("/");
  await expect(page.locator("#static-fallback")).toHaveCount(0);
  await expect(page.locator("h1:has-text('The practical side')")).toBeVisible();

  // No-JS visit: the prerendered content is immediately visible — this is
  // what fast first paint on slow connections relies on.
  const noJs = await browser.newContext({ javaScriptEnabled: false });
  const p = await noJs.newPage();
  await p.goto("/");
  await expect(p.locator("#static-fallback h1")).toBeVisible();
  await noJs.close();
});

test("palio countdown appears exactly when inside the 60-day window", async ({ page }) => {
  // Mirror of nextPalio() in PalioCountdown.jsx so the assertion is correct
  // on any day the suite runs.
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  let expected = null;
  for (const year of [today.getFullYear(), today.getFullYear() + 1]) {
    for (const [m, d, label] of [[6, 2, "2 July"], [7, 16, "16 August"]]) {
      const days = Math.round((new Date(year, m, d) - today) / 86400000);
      if (!expected && days >= 0 && days <= 60) expected = label;
    }
  }

  await page.goto("/");
  const banner = page.locator("text=Palio di Siena —");
  if (expected) {
    await expect(banner).toBeVisible();
    await expect(page.locator(`text=Palio di Siena — ${expected}`)).toBeVisible();
  } else {
    await expect(banner).toHaveCount(0);
  }
});

test("resume band appears on the homepage only after a trip plan is saved", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("text=Open your Trip Sheet")).toHaveCount(0);

  // Save a plan on the tools page, then return home.
  await page.goto("/travel-tools");
  await page.locator(".mb-12 select").nth(0).selectOption("Tuscany");
  await page.goto("/");
  await expect(page.locator("text=Open your Trip Sheet")).toBeVisible();
  await expect(page.locator("text=Your Tuscany trip").first()).toBeVisible();
});
