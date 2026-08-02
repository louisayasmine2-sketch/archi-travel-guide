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

  // February has no guide — no dead link, just the verified best-time context.
  await page.locator("button:has-text('February')").click();
  await expect(page.locator("text=No dedicated February guide yet")).toBeVisible();
  await expect(page.locator("text=May, June, September")).toBeVisible();

  // The panel carries its seasonal illustration in both states.
  await expect(page.locator(".tuscan-scene")).toHaveCount(1);
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
