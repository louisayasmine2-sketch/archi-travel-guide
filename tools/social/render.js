#!/usr/bin/env node
// Renders the fact cards in facts.json to PNG via headless Chromium.
// Self-contained: run `npm install` and `npx playwright install chromium`
// in tools/social/ first. Never touches the site build.
//
// Usage: node render.js [outputDir] [factsFile]
//   outputDir  default: ../../social-output/2026-W32
//   factsFile  default: facts.json next to this script (the W32 batch)

const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const FORMATS = [
  { name: 'feed', class: 'feed', width: 1080, height: 1350 },
  { name: 'pin', class: 'pin', width: 1000, height: 1500 },
];

const factsFile = path.resolve(process.argv[3] || path.join(__dirname, 'facts.json'));
const data = JSON.parse(fs.readFileSync(factsFile, 'utf8'));
const template = fs.readFileSync(path.join(__dirname, 'template.html'), 'utf8');

function fill(tpl, vars) {
  return tpl.replace(/\{\{(\w+)\}\}/g, (_, k) => {
    if (!(k in vars)) throw new Error(`No value for placeholder {{${k}}}`);
    return vars[k];
  });
}

async function main() {
  const outRoot = path.resolve(process.argv[2] || path.join(__dirname, '..', '..', 'social-output', '2026-W32'));
  const browser = await chromium.launch();

  for (const fact of data.facts) {
    const dir = path.join(outRoot, `day${fact.day}-${fact.id}`);
    fs.mkdirSync(dir, { recursive: true });

    for (const format of FORMATS) {
      const html = fill(template, {
        format: format.class,
        siteName: data.site.name,
        siteUrl: data.site.url,
        tagline: data.site.tagline,
        hook: fact.hook,
        figure: fact.figure,
        figureLabel: fact.figureLabel,
        detail: fact.detail,
        checked: fact.checked,
      });
      const htmlPath = path.join(dir, `card-${format.name}.html`);
      fs.writeFileSync(htmlPath, html);

      const page = await browser.newPage({
        viewport: { width: format.width, height: format.height },
        deviceScaleFactor: 1,
      });
      await page.goto('file://' + htmlPath);
      await page.evaluate(() => document.fonts.ready);
      const pngPath = path.join(dir, `card-${format.name}-${format.width}x${format.height}.png`);
      await page.screenshot({ path: pngPath });
      await page.close();
      console.log('rendered', path.relative(process.cwd(), pngPath));
    }
  }

  await browser.close();
}

main().catch((err) => { console.error(err); process.exit(1); });
