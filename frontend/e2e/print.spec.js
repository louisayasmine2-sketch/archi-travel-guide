// Print-to-PDF from the tool dialogs (Trip Sheet, Smart Packing List).
// The sheet lives inside a Radix dialog — fixed, transform-centred and
// scroll-clipped — which once produced PDFs that were blank past the title.
// index.css's @media print block frees it; these tests pin that behaviour.
const { test, expect } = require("@playwright/test");

async function saveTrip(page) {
  await page.goto("/travel-tools");
  await page.locator(".mb-12 select").first().selectOption("Siena");
  await page.locator(".mb-12 input").first().fill("4");
}

test("trip sheet escapes the dialog trap in print media", async ({ page }) => {
  await saveTrip(page);
  await page.goto("/travel-tools?tool=trip-sheet");
  await page.waitForSelector(".printable-area");
  await page.emulateMedia({ media: "print" });
  const state = await page.evaluate(() => {
    const dialog = document.querySelector("[role='dialog']");
    const cs = getComputedStyle(dialog);
    const sheet = document.querySelector(".printable-area");
    return {
      position: cs.position,
      transform: cs.transform,
      maxHeight: cs.maxHeight,
      overflowY: cs.overflowY,
      sheetHeight: sheet.scrollHeight,
      sheetText: sheet.innerText.length,
    };
  });
  // Freed from fixed/centred/clipped positioning…
  expect(state.position).toBe("static");
  expect(state.transform).toBe("none");
  expect(state.maxHeight).toBe("none");
  expect(state.overflowY).toBe("visible");
  // …and the full sheet flows (day-by-day + budget + months + packing),
  // far beyond the single clipped viewport the bug produced.
  expect(state.sheetHeight).toBeGreaterThan(1500);
  expect(state.sheetText).toBeGreaterThan(1000);
});

test("packing list print shows the checklist, not a blank page", async ({ page }) => {
  await saveTrip(page);
  await page.goto("/travel-tools?tool=packing");
  await page.waitForSelector(".printable-area");
  await page.locator("[role='dialog'] button:has-text('Generate Checklist')").click();
  await page.emulateMedia({ media: "print" });
  const visible = await page.evaluate(() => {
    const sheet = document.querySelector(".printable-area");
    return {
      visibility: getComputedStyle(sheet).visibility,
      hasChecklist: sheet.innerText.includes("Clothing"),
      dialogPosition: getComputedStyle(document.querySelector("[role='dialog']")).position,
    };
  });
  expect(visible.visibility).toBe("visible");
  expect(visible.hasChecklist).toBe(true);
  expect(visible.dialogPosition).toBe("static");
});
