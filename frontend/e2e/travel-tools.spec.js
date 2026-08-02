// End-to-end coverage of the /travel-tools hub and all nine tools,
// run against the production build (see playwright.config.js).
const { test, expect } = require("@playwright/test");

const openTool = async (page, name) => {
  await page.locator("div.bg-white", { hasText: name }).first()
    .locator("button:has-text('Try Now')").click();
};

// Fill the My Trip bar. Field order matches the TripBar grid.
const setTrip = async (page, { destination, nights, travelers, season, date }) => {
  const selects = page.locator(".mb-12 select");
  const inputs = page.locator(".mb-12 input");
  if (destination) await selects.nth(0).selectOption(destination);
  if (nights) await inputs.nth(0).fill(String(nights));
  if (travelers) await inputs.nth(1).fill(String(travelers));
  if (season) await selects.nth(1).selectOption(season);
  if (date) await page.locator(".mb-12 input[type=date]").fill(date);
};

test.beforeEach(async ({ page }) => {
  await page.goto("/travel-tools");
});

test("hub renders all nine tool cards", async ({ page }) => {
  await expect(page.locator("button:has-text('Try Now')")).toHaveCount(9);
  await expect(page.locator("text=My Trip").first()).toBeVisible();
});

test("My Trip bar pre-fills the budget planner", async ({ page }) => {
  await setTrip(page, { destination: "Tuscany", nights: 5, travelers: 4 });
  await openTool(page, "Tuscany Budget Planner");
  await expect(page.locator("form input").nth(0)).toHaveValue("Tuscany");
  await expect(page.locator("form input").nth(1)).toHaveValue("4");
  await expect(page.locator("form input").nth(2)).toHaveValue("5");
});

test("itinerary generates day cards, a map and a share button", async ({ page }) => {
  await openTool(page, "Itinerary Generator");
  await page.locator("button:has-text('Generate Itinerary')").click();
  await expect(page.locator(".leaflet-container")).toBeVisible();
  await expect(page.locator("text=Day 1").first()).toBeVisible();
  await expect(page.locator("button:has-text('Copy share link')")).toBeVisible();
});

test("a share deep link opens with the itinerary already generated", async ({ page }) => {
  await page.goto("/travel-tools?tool=itinerary&dest=Siena&days=2");
  await expect(page.locator("text=Day 1").first()).toBeVisible();
  await expect(page.locator("text=Day 2").first()).toBeVisible();
  await expect(page.locator("button:has-text('Copy share link')")).toBeVisible();
});

test("currency converter auto-converts, swaps, and survives a malformed response", async ({ page }) => {
  await page.route("**/api.frankfurter.app/**", (route) => {
    const url = new URL(route.request().url());
    const to = url.searchParams.get("to");
    const amount = parseFloat(url.searchParams.get("amount"));
    route.fulfill({ json: { amount, base: url.searchParams.get("from"), date: "2026-07-29", rates: { [to]: amount * 0.865 } } });
  });
  await openTool(page, "Live Currency Converter");
  await expect(page.locator("#result")).toContainText("86.50");
  await expect(page.locator("text=reference rate dated 2026-07-29")).toBeVisible();

  await page.locator("[aria-label='Swap currencies']").click();
  await expect(page.locator("#from")).toHaveValue("EUR");
  await expect(page.locator("#to")).toHaveValue("USD");
  await expect(page.locator("#result")).toContainText("86.50");

  // A response missing the requested currency must degrade to the error
  // message, never crash the dialog.
  await page.unroute("**/api.frankfurter.app/**");
  await page.route("**/api.frankfurter.app/**", (route) => route.fulfill({ json: { rates: {} } }));
  await page.locator("#amount").fill("50");
  await expect(page.locator("text=Couldn't fetch the exchange rate")).toBeVisible();
  await expect(page.locator("#from")).toBeVisible();
});

test("packing checklist persists ticks across close and reopen", async ({ page }) => {
  await openTool(page, "Smart Packing List");
  await page.locator("button:has-text('Generate Checklist')").click();
  await expect(page.locator("text=Packing progress")).toBeVisible();
  const items = page.locator("li > button");
  await items.nth(0).click();
  await items.nth(3).click();
  await expect(page.locator("text=2 of")).toBeVisible();
  await page.keyboard.press("Escape");

  await openTool(page, "Smart Packing List");
  await expect(page.locator("text=Packing progress")).toBeVisible();
  await expect(page.locator("text=2 of")).toBeVisible();
});

test("transport comparator moves the best match with the chosen priority", async ({ page }) => {
  await openTool(page, "Transport Comparator");
  const bestMatchCard = () =>
    page.locator("div.rounded-3xl", { has: page.locator("span:has-text('Best match')") }).first();
  await expect(bestMatchCard()).toContainText("131R regional bus");
  await page.locator("button:has-text('Comfort and space on board')").click();
  await expect(bestMatchCard()).toContainText("Regional train");
  await expect(page.locator("text=Fact-checked July 23, 2026")).toBeVisible();
});

test("trip sheet composes itinerary, budget, months and packing from the plan", async ({ page }) => {
  await setTrip(page, { destination: "Tuscany", nights: 4, travelers: 3, season: "summer" });
  await page.goto("/travel-tools?tool=trip-sheet");
  await expect(page.locator("h2:has-text('My Tuscany Trip Sheet')")).toBeVisible();
  await expect(page.locator("text=4 nights · 3 travellers · summer")).toBeVisible();
  await expect(page.locator("text=Day by day")).toBeVisible();
  await expect(page.locator("text=USD total")).toBeVisible();
  await expect(page.locator("text=Best months for weather")).toBeVisible();
  await expect(page.locator("text=Packing checklist — summer")).toBeVisible();
  await expect(page.locator("button:has-text('Print / save as PDF')")).toBeVisible();
});

test("best time finder updates live and offers the other preferences", async ({ page }) => {
  await openTool(page, "Best Time to Visit");
  await expect(page.locator("text=If you'd rather optimise for")).toBeVisible();
  await page.locator("[role='dialog'] select").nth(1).selectOption("low_prices");
  await expect(page.locator("text=Lowest prices in").first()).toBeVisible();
});

test("planning progress badge flips after generating an itinerary", async ({ page }) => {
  await expect(page.locator("span:has-text('✓ Itinerary')")).toHaveCount(0);
  await openTool(page, "Itinerary Generator");
  await page.locator("button:has-text('Generate Itinerary')").click();
  await expect(page.locator("text=Day 1").first()).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.locator("span:has-text('✓ Itinerary')")).toBeVisible();
});

test("dates overlapping the Palio show the verified warning", async ({ page }) => {
  const year = new Date().getFullYear() + 1;
  await setTrip(page, { destination: "Siena", nights: 8, date: `${year}-08-10` });
  await expect(page.locator("text=Your dates overlap the Palio")).toBeVisible();
  await expect(page.locator("text=Checked 20 July 2026")).toBeVisible();
});

test("area match quiz updates the recommendation live", async ({ page }) => {
  await openTool(page, "Area Match");
  const dialog = page.locator("[role='dialog']");
  // Siena + walking is the default; family flips the pick to walk_family.
  await expect(dialog.locator("text=Your match in Siena")).toBeVisible();
  await dialog.locator("input[type='checkbox']").check();
  await expect(dialog.locator("text=Terzo di Città")).toBeVisible();
  await dialog.locator("select").nth(0).selectOption("Rome");
  await expect(dialog.locator("text=Prati")).toBeVisible();
});

test("budget result includes a category breakdown that feeds the trip sheet", async ({ page }) => {
  await openTool(page, "Tuscany Budget Planner");
  const dialog = page.locator("[role='dialog']");
  await dialog.locator("select").nth(0).selectOption("luxury");
  await dialog.locator("button:has-text('Calculate My Budget')").click();
  await expect(dialog.locator("text=Where it goes")).toBeVisible();
  await expect(dialog.locator(".h-2.rounded-full").first()).toBeVisible();
  await page.keyboard.press("Escape");
  // The sheet's assumption line reflects the saved luxury choice.
  await page.goto("/travel-tools?tool=trip-sheet");
  await expect(page.locator("text=luxury boutique stays")).toBeVisible();
});

test("currency converter falls back to the dated cached rate when the API is down", async ({ page }) => {
  await page.route("**/api.frankfurter.app/**", (route) => {
    const url = new URL(route.request().url());
    const to = url.searchParams.get("to");
    const amount = parseFloat(url.searchParams.get("amount"));
    route.fulfill({ json: { amount, base: url.searchParams.get("from"), date: "2026-07-29", rates: { [to]: amount * 0.865 } } });
  });
  await openTool(page, "Live Currency Converter");
  await expect(page.locator("#result")).toContainText("86.50");

  // API goes away: the converter must keep working on the saved rate,
  // clearly labelled with its date.
  await page.unroute("**/api.frankfurter.app/**");
  await page.route("**/api.frankfurter.app/**", (route) => route.abort());
  await page.locator("#amount").fill("200");
  await expect(page.locator("text=Offline — using the saved rate from 2026-07-29")).toBeVisible();
  await expect(page.locator("#result")).toContainText("173.00");
});

test("custom packing items are added, counted and persisted", async ({ page }) => {
  await openTool(page, "Smart Packing List");
  await page.locator("button:has-text('Generate Checklist')").click();
  await expect(page.locator("text=Your items")).toBeVisible();
  await page.locator("input[placeholder*='Add your own item']").fill("Camera batteries");
  await page.locator("button:has-text('Add')").click();
  await expect(page.locator("text=Camera batteries").first()).toBeVisible();
  await page.keyboard.press("Escape");

  await openTool(page, "Smart Packing List");
  await expect(page.locator("text=Camera batteries").first()).toBeVisible();
});
