// Minimal static server for the production build with SPA fallback.
// Used by the Playwright e2e suite (see playwright.config.js); no dependencies.
const http = require("http");
const fs = require("fs");
const path = require("path");

const BUILD = path.join(__dirname, "..", "build");
const PORT = process.env.PORT || 4173;
const MIME = {
  ".html": "text/html", ".js": "application/javascript", ".css": "text/css",
  ".json": "application/json", ".png": "image/png", ".svg": "image/svg+xml",
  ".webp": "image/webp", ".jpg": "image/jpeg", ".ico": "image/x-icon",
  ".txt": "text/plain", ".xml": "application/xml",
};

http
  .createServer((req, res) => {
    let file = path.join(BUILD, decodeURIComponent(req.url.split("?")[0]));
    if (!file.startsWith(BUILD)) {
      file = path.join(BUILD, "index.html");
    }
    // Cloudflare Pages serves <dir>/index.html for a directory URL; without
    // this, every pretty route fell through to the ROOT index.html, so the
    // per-route static HTML (fallback content, titles, preloads) was never
    // exercised locally or by the e2e suite.
    if (fs.existsSync(file) && fs.statSync(file).isDirectory()) {
      file = path.join(file, "index.html");
    }
    if (!fs.existsSync(file)) {
      file = path.join(BUILD, "index.html");
    }
    res.setHeader("Content-Type", MIME[path.extname(file)] || "application/octet-stream");
    fs.createReadStream(file).pipe(res);
  })
  .listen(PORT, () => console.log(`build served on http://localhost:${PORT}`));
