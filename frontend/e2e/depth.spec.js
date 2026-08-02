// Depth motion: 3D tilt cards and staggered reveals — and, just as
// important, their complete absence under prefers-reduced-motion.
const { test, expect } = require("@playwright/test");

test("cards tilt towards the pointer on fine-pointer devices", async ({ page }) => {
  await page.goto("/");
  const card = page.locator(".tilt-card").first();
  await card.scrollIntoViewIfNeeded();
  await card.hover({ position: { x: 20, y: 10 } });
  await expect(card).toHaveAttribute("style", /rotateX/);
  // leaving the card resets the transform
  await page.mouse.move(0, 0);
  await expect(card).not.toHaveAttribute("style", /rotateX/);
});

test("reduced motion removes tilt and reveal behaviour entirely", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.locator("text=Essential guides")).toBeVisible();
  await expect(page.locator(".tilt-card")).toHaveCount(0);
  await expect(page.locator(".reveal-hidden")).toHaveCount(0);
});

test("below-the-fold cards reveal as they enter the viewport", async ({ page }) => {
  await page.goto("/");
  await page.locator("text=Recently updated guides").scrollIntoViewIfNeeded();
  await expect(page.locator(".reveal-in").first()).toBeVisible();
  // end state: the revealed card's content is fully readable
  await expect(page.locator(".reveal-in a").first()).toBeVisible();
});
