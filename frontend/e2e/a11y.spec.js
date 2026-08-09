// Accessibility gate: axe-core runs against the key page templates and the
// suite fails on any serious or critical violation. Moderate/minor issues
// are logged for visibility but do not fail the build.
const { test, expect } = require("@playwright/test");
const path = require("path");

const AXE_PATH = path.join(__dirname, "..", "node_modules", "axe-core", "axe.min.js");

const PAGES = [
  "/",
  "/siena",
  "/tuscany-travel-guide/",
  "/travel-tools",
  "/blog",
  "/blog/siena-with-kids/",
  "/piazza-del-campo-guide/",
];

for (const url of PAGES) {
  test(`no serious or critical a11y violations on ${url}`, async ({ page }) => {
    await page.goto(url);
    await page.waitForLoadState("networkidle");
    await page.addScriptTag({ path: AXE_PATH });
    const results = await page.evaluate(() =>
      window.axe.run(document, {
        runOnly: { type: "tag", values: ["wcag2a", "wcag2aa"] },
      })
    );
    if (process.env.A11Y_DUMP) {
      require("fs").appendFileSync(
        process.env.A11Y_DUMP,
        JSON.stringify({ url, violations: results.violations }) + "\n"
      );
    }
    const gating = results.violations.filter((v) => ["serious", "critical"].includes(v.impact));
    const advisory = results.violations.filter((v) => !["serious", "critical"].includes(v.impact));
    for (const v of advisory) {
      console.log(`[a11y advisory] ${url} ${v.id} (${v.impact}): ${v.nodes.length} node(s)`);
    }
    const detail = gating.map((v) =>
      `${v.id} (${v.impact}): ${v.help}\n` +
      v.nodes.slice(0, 5).map((n) => `    ${n.target.join(" ")} — ${n.failureSummary?.split("\n")[0]}`).join("\n")
    ).join("\n");
    expect(gating, detail).toEqual([]);
  });
}
