// "Add to calendar": the itinerary exports as an .ics whose events carry the
// same verified content the tools render — real dates from the saved plan,
// no invented claims. Palio race days inside the trip get their own event.
const { test, expect } = require("@playwright/test");
const fs = require("fs");

const setTrip = async (page, { destination, nights, date }) => {
  await page.goto("/travel-tools");
  const selects = page.locator(".mb-12 select");
  const inputs = page.locator(".mb-12 input");
  await selects.nth(0).selectOption(destination);
  await inputs.nth(0).fill(String(nights));
  await page.locator(".mb-12 input[type=date]").fill(date);
};

const nextYear = new Date().getFullYear() + 1;

test("trip sheet shows real dates and exports a valid .ics", async ({ page }) => {
  await setTrip(page, { destination: "Siena", nights: 3, date: `${nextYear}-05-10` });
  await page.goto("/travel-tools?tool=trip-sheet");

  // Day labels now carry the actual date ("Day 1 · Mon, 10 May"). The comma
  // after the weekday varies between ICU builds — accept both.
  await expect(page.locator("text=/Day 1 · \\w{3},? 10 May/")).toBeVisible();

  const [download] = await Promise.all([
    page.waitForEvent("download"),
    page.getByTestId("add-to-calendar").click(),
  ]);
  const ics = fs.readFileSync(await download.path(), "utf-8");

  expect(ics).toContain("BEGIN:VCALENDAR");
  expect(ics).toContain(`DTSTART;VALUE=DATE:${nextYear}0510`);
  expect(ics).toContain(`DTSTART;VALUE=DATE:${nextYear}0512`);
  expect((ics.match(/BEGIN:VEVENT/g) || []).length).toBe(3);
  expect(ics).toContain("SUMMARY:Siena · Day 1: Piazza del Campo & Palazzo Pubblico");
  // The verified operational note travels into the event description.
  expect(ics).toContain("Plan around this:");
  expect(ics).toContain("Checked 20 July 2026");
  // May trip: no Palio event.
  expect(ics).not.toContain("Palio di Siena");
});

test("a trip over 16 August gets the verified Palio warning event", async ({ page }) => {
  await setTrip(page, { destination: "Siena", nights: 8, date: `${nextYear}-08-10` });
  await page.goto("/travel-tools?tool=trip-sheet");
  const [download] = await Promise.all([
    page.waitForEvent("download"),
    page.getByTestId("add-to-calendar").click(),
  ]);
  const ics = fs.readFileSync(await download.path(), "utf-8");

  // 5 itinerary days (Siena content cap) + 1 Palio event on the race day.
  expect((ics.match(/BEGIN:VEVENT/g) || []).length).toBe(6);
  expect(ics).toContain("SUMMARY:Palio di Siena — plan around it");
  expect(ics).toContain(`DTSTART;VALUE=DATE:${nextYear}0816`);
});

test("without a start date the calendar button does not exist", async ({ page }) => {
  await page.goto("/travel-tools");
  await page.locator(".mb-12 select").first().selectOption("Siena");
  await page.goto("/travel-tools?tool=trip-sheet");
  await expect(page.locator("text=Day by day")).toBeVisible();
  await expect(page.getByTestId("add-to-calendar")).toHaveCount(0);
});

test("the itinerary tool offers calendar export when the plan matches", async ({ page }) => {
  await setTrip(page, { destination: "Siena", nights: 3, date: `${nextYear}-05-10` });
  await page.goto("/travel-tools?tool=itinerary");
  await page.locator("button:has-text('Generate Itinerary')").click();
  await expect(page.locator("text=Day 1").first()).toBeVisible();
  const [download] = await Promise.all([
    page.waitForEvent("download"),
    page.getByTestId("itinerary-add-to-calendar").click(),
  ]);
  const ics = fs.readFileSync(await download.path(), "utf-8");
  expect(ics).toContain("BEGIN:VCALENDAR");
  expect(ics).toContain(`DTSTART;VALUE=DATE:${nextYear}0510`);
});
