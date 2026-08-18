// The tools' single commercial element: a contextual handoff that may render
// ONLY when the tool itself has just recommended the thing the link books
// (CLAUDE.md §2 — disclosure follows reality, and a link beside an option
// the tool did not recommend is an ad, not a handoff). These tests pin both
// directions: it appears with its disclosure and rel="sponsored" when
// earned, and never appears otherwise.
const { test, expect } = require("@playwright/test");

const openTool = async (page, name) => {
  await page.locator("div.bg-white", { hasText: name }).first()
    .locator("button:has-text('Try Now')").click();
};

const DISCLOSURE = "Affiliate link — booking through it may earn us a commission";

test.beforeEach(async ({ page }) => {
  await page.goto("/travel-tools");
});

test("transport comparator: tour recommendation earns the Viator handoff, others do not", async ({ page }) => {
  await openTool(page, "Transport Comparator");
  const dialog = page.getByRole("dialog", { name: "Transport Comparator" });

  // Default priority recommends the bus — no handoff anywhere.
  await expect(dialog.locator("text=Best match")).toBeVisible();
  await expect(dialog.getByTestId("affiliate-handoff-tour")).toHaveCount(0);
  await expect(dialog.getByTestId("affiliate-handoff-car")).toHaveCount(0);

  // "Several Tuscan stops" → tour is the best match → Viator handoff, with
  // its disclosure in the same box and the sponsored rel on the link.
  await dialog.locator("button:has-text('Several Tuscan stops')").click();
  const tour = dialog.getByTestId("affiliate-handoff-tour");
  await expect(tour).toBeVisible();
  await expect(tour.locator("a[href='/go/viator']")).toHaveAttribute("rel", "sponsored noopener noreferrer");
  await expect(tour).toContainText(DISCLOSURE);
  await expect(dialog.getByTestId("affiliate-handoff-car")).toHaveCount(0);

  // Switching to the car flips the handoff — never both at once.
  await dialog.locator("button:has-text('Full flexibility')").click();
  const car = dialog.getByTestId("affiliate-handoff-car");
  await expect(car).toBeVisible();
  await expect(car.locator("a[href='/go/discovercars-italy']")).toHaveAttribute("rel", "sponsored noopener noreferrer");
  await expect(car).toContainText(DISCLOSURE);
  await expect(dialog.getByTestId("affiliate-handoff-tour")).toHaveCount(0);

  // Back to a non-bookable recommendation → both gone again.
  await dialog.locator("button:has-text('Comfort and space')").click();
  await expect(dialog.getByTestId("affiliate-handoff-tour")).toHaveCount(0);
  await expect(dialog.getByTestId("affiliate-handoff-car")).toHaveCount(0);
});

test("budget planner: the car handoff appears only for a private-car budget", async ({ page }) => {
  await openTool(page, "Tuscany Budget Planner");
  const dialog = page.getByRole("dialog", { name: "Tuscany Budget Planner" });
  const transport = dialog.locator("select:has(option[value='private'])");

  // Public-transport budget: result renders with no handoff.
  await dialog.locator("button:has-text('Calculate My Budget')").click();
  await expect(dialog.locator("text=Where it goes")).toBeVisible();
  await expect(dialog.getByTestId("affiliate-handoff-car")).toHaveCount(0);

  // The same budget priced with a private car earns the DiscoverCars handoff.
  await transport.selectOption("private");
  await dialog.locator("button:has-text('Calculate My Budget')").click();
  const car = dialog.getByTestId("affiliate-handoff-car");
  await expect(car).toBeVisible();
  await expect(car.locator("a[href='/go/discovercars-italy']")).toHaveAttribute("rel", "sponsored noopener noreferrer");
  await expect(car).toContainText(DISCLOSURE);
});
