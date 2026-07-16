const fs = require("fs");
const html = fs.readFileSync("lighthouse-report.html", "utf8");
const match = html.match(/window\.__LIGHTHOUSE_JSON__ = (\{.*?\});<\/script>/s);
if (match && match[1]) {
  const data = JSON.parse(match[1]);
  const categories = data.categories;
  const metrics = data.audits;
  console.log("Performance Score:", Math.round(categories.performance.score * 100));
  console.log("LCP:", metrics["largest-contentful-paint"].displayValue);
  console.log("CLS:", metrics["cumulative-layout-shift"].displayValue);
} else {
  console.log("Could not parse Lighthouse JSON");
}
