// Playwright e2e configuration. The suite runs against the production build
// (npm run build first — or `craco build` for a faster loop without the
// sitemap/static-html steps), served by scripts/serve-build.js.
//
// PW_CHROMIUM_PATH can point at a pre-installed Chromium (used in sandboxes
// where `playwright install` is unavailable); CI installs browsers normally.
const { defineConfig } = require("@playwright/test");

module.exports = defineConfig({
  testDir: "./e2e",
  timeout: 60_000,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? [["list"], ["github"]] : "list",
  use: {
    baseURL: "http://localhost:4173",
    trace: "retain-on-failure",
    launchOptions: process.env.PW_CHROMIUM_PATH
      ? { executablePath: process.env.PW_CHROMIUM_PATH }
      : {},
  },
  webServer: {
    command: "node scripts/serve-build.js",
    port: 4173,
    reuseExistingServer: !process.env.CI,
  },
});
