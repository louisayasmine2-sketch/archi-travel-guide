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
    // Audit the RESTING page. The cookie banner mounts on an 800ms timer and
    // fades in, and Reveal fades fold-straddling sections in; axe sampling
    // mid-transition reads blended colours (terracotta over ivory at partial
    // opacity: 3.0-4.5:1 instead of the real 5.9:1) and reports contrast
    // failures that do not exist on screen. Give the timer its beat, then
    // wait until every finite animation or transition has finished (the
    // hero's 25s Ken Burns loop on /siena and /tuscany-travel-guide repeats
    // forever and never changes a colour, so infinite ones are ignored).
    await page.waitForTimeout(1000);
    await page.waitForFunction(
      () =>
        document.getAnimations().every((a) => {
          if (a.playState !== "running") return true;
          const timing = a.effect && a.effect.getTiming ? a.effect.getTiming() : null;
          return Boolean(timing) && timing.iterations === Infinity;
        }),
      null,
      { timeout: 10000 }
    );
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
