#!/usr/bin/env node
/*
 * Prerenders the blog article routes: loads each one in headless Chromium
 * against the freshly built output, waits for the fully hydrated article,
 * and writes the rendered #root content back into that route's static file.
 * The served HTML then IS the page — hero, title and body paint straight
 * from the document, before any JavaScript — and src/index.js hydrates it
 * in place (hydrateRoot) instead of re-rendering.
 *
 * FAIL-OPEN BY DESIGN. This step must never break a deploy: if no browser
 * can be launched (Cloudflare's build image, a sandbox without Chromium) or
 * any route fails, the affected routes simply keep the static-fallback HTML
 * they already have — which is the site's current, fully working behaviour.
 * Exit code is 0 in every case short of programmer error.
 *
 * Runs last in the build chain, after generate-static-html and the GA
 * injection, so it captures the final page.
 */

const fs = require('fs');
const path = require('path');
const http = require('http');
const { spawn } = require('child_process');

const ROOT = path.resolve(__dirname, '..');
const BUILD_DIR = path.join(ROOT, 'build');
const PORT = 4179; // not 4173: never fight the e2e suite's server
const CONCURRENCY = 4;
const PAGE_TIMEOUT_MS = 30_000;

function log(msg) {
  console.log(`[prerender] ${msg}`);
}

function publishedBlogRoutes() {
  const index = JSON.parse(
    fs.readFileSync(path.join(ROOT, 'src/data/articlesIndex.json'), 'utf-8')
  );
  const now = Date.now();
  return index
    .filter((a) => a.store === 'articles' && new Date(a.publishedAt).getTime() <= now)
    .map((a) => ({ route: `/blog/${a.slug}/`, slug: a.slug, updated: a.updated }));
}

function waitForServer(port, tries = 40) {
  return new Promise((resolve, reject) => {
    const attempt = (left) => {
      const req = http.get({ host: '127.0.0.1', port, path: '/' }, (res) => {
        res.resume();
        resolve();
      });
      req.on('error', () => {
        if (left <= 0) return reject(new Error('serve-build never came up'));
        setTimeout(() => attempt(left - 1), 250);
      });
    };
    attempt(tries);
  });
}

async function launchBrowser() {
  // Playwright is already a devDependency (the e2e suite). The fallback chain,
  // in order, logging which source won so build logs answer "which browser?":
  //   1. PW_CHROMIUM_PATH        — sandbox and CI provide one explicitly
  //   2. Playwright's own browser — present wherever `playwright install` ran
  //   3. puppeteer's Chrome       — puppeteer is a dependency and downloads
  //      Chrome during npm install, so on build machines that block nothing
  //      at install time but where playwright's browser is absent
  //      (Cloudflare Pages), this is the browser that already exists on disk
  //   4. one guarded install      — headless-shell first (small), then full
  // Anything failing here means "skip prerendering", not "fail the build".
  const { chromium } = require('@playwright/test');
  if (process.env.PW_CHROMIUM_PATH) {
    // Explicit path: if it is wrong, installing would not fix it — throw.
    const browser = await chromium.launch({ executablePath: process.env.PW_CHROMIUM_PATH });
    log('browser: PW_CHROMIUM_PATH');
    return browser;
  }
  try {
    const browser = await chromium.launch();
    log('browser: playwright default');
    return browser;
  } catch (playwrightMiss) {
    try {
      const puppeteer = require('puppeteer');
      // await: executablePath() returns a string in older puppeteer versions
      // and a Promise in newer ones; await handles both.
      const chromePath = await puppeteer.executablePath();
      if (fs.existsSync(chromePath)) {
        const browser = await chromium.launch({ executablePath: chromePath });
        log(`browser: puppeteer chrome at ${chromePath}`);
        return browser;
      }
      log(`puppeteer chrome not on disk (${chromePath})`);
    } catch (puppeteerMiss) {
      log(`puppeteer fallback unavailable (${puppeteerMiss.message.split('\n')[0]})`);
    }
    log('no browser found; attempting a one-time install…');
    const { execSync } = require('child_process');
    try {
      execSync('npx playwright install chromium-headless-shell', { cwd: ROOT, stdio: 'inherit', timeout: 300_000 });
      const browser = await chromium.launch();
      log('browser: freshly installed chromium-headless-shell');
      return browser;
    } catch (shellMiss) {
      execSync('npx playwright install chromium', { cwd: ROOT, stdio: 'inherit', timeout: 300_000 });
      const browser = await chromium.launch();
      log('browser: freshly installed chromium');
      return browser;
    }
  }
}

async function prerenderRoute(context, entry) {
  const { route, slug, updated } = entry;
  const filePath = path.join(BUILD_DIR, route.replace(/^\//, '').replace(/\/$/, ''), 'index.html');
  if (!fs.existsSync(filePath)) return { route, skipped: 'no static file' };

  const page = await context.newPage();
  try {
    // 'load', not 'networkidle': pages with long-polling or streamed assets
    // never reach network idle, and the explicit waits below are the real
    // hydration signal anyway.
    await page.goto(`http://127.0.0.1:${PORT}${route}`, {
      waitUntil: 'load',
      timeout: PAGE_TIMEOUT_MS,
    });
    // Fully hydrated means: the app's article rendered (h1 inside #root) and
    // the two-phase store finished (no loading line left).
    await page.waitForSelector('#root h1', { timeout: PAGE_TIMEOUT_MS });
    await page.waitForFunction(
      () => !document.querySelector('#root [aria-busy="true"]'),
      { timeout: PAGE_TIMEOUT_MS }
    );
    // Let framer's entrance animations land on their final values so the
    // captured styles are the resting state.
    await page.waitForTimeout(1200);

    const rendered = await page.evaluate(() => document.getElementById('root').innerHTML);
    if (!rendered || rendered.length < 2000) return { route, skipped: 'implausibly small render' };

    let html = fs.readFileSync(filePath, 'utf-8');
    const marker = '<div id="root">';
    const start = html.indexOf(marker);
    if (start === -1) return { route, skipped: 'no root marker' };
    // The template's root div is empty (<div id="root"></div>), so the close
    // is immediate; replace the pair and drop the now-redundant fallback.
    const emptyRoot = '<div id="root"></div>';
    if (!html.includes(emptyRoot)) return { route, skipped: 'root not empty (already prerendered?)' };
    html = html.replace(emptyRoot, `<div id="root">${rendered}</div>`);
    html = html.replace(/<main id="static-fallback"[\s\S]*?<\/main>/i, '');
    // Announce this article's data URL so index.js fetches it before
    // hydrating — Article.jsx's first client render must carry the full
    // body to match this captured DOM. Same ?v= the client route uses, so
    // the preload and any later fetch share one HTTP cache entry.
    const dataUrl = `/article-data/${slug}.json?v=${encodeURIComponent(updated)}`;
    html = html.replace('</head>', `<script>window.__ARTICLE_JSON__=${JSON.stringify(dataUrl)}</script></head>`);
    fs.writeFileSync(filePath, html, 'utf-8');
    return { route, ok: true };
  } catch (err) {
    return { route, skipped: err.message.split('\n')[0].slice(0, 120) };
  } finally {
    await page.close();
  }
}

async function main() {
  const routes = publishedBlogRoutes();
  log(`${routes.length} published blog routes to prerender`);

  let browser;
  try {
    browser = await launchBrowser();
  } catch (err) {
    log(`no browser available (${err.message.split('\n')[0]}); shipping static-fallback HTML unchanged`);
    return;
  }

  const server = spawn('node', [path.join(__dirname, 'serve-build.js')], {
    env: { ...process.env, PORT: String(PORT) },
    stdio: 'ignore',
  });

  try {
    await waitForServer(PORT);
    const context = await browser.newContext({
      // Keep captured pages deterministic: no cookie banner (it appears on a
      // timer and would bake into the HTML), no analytics side effects.
      storageState: {
        cookies: [],
        origins: [
          {
            origin: `http://127.0.0.1:${PORT}`,
            localStorage: [{ name: 'archi_cookie_consent', value: 'declined' }],
          },
        ],
      },
    });

    let ok = 0;
    const skipped = [];
    const retryable = [];
    for (let i = 0; i < routes.length; i += CONCURRENCY) {
      const batch = routes.slice(i, i + CONCURRENCY);
      const results = await Promise.all(batch.map((r) => prerenderRoute(context, r)));
      for (let j = 0; j < results.length; j += 1) {
        const r = results[j];
        if (r.ok) ok += 1;
        else if (r.skipped === 'no static file' || /root not empty/.test(r.skipped)) skipped.push(`${r.route} (${r.skipped})`);
        else retryable.push(batch[j]);
      }
    }
    // One retry sweep for transient failures (a slow first paint, a timeout
    // under build-machine load). Anything still failing keeps its fallback.
    for (const entry of retryable) {
      const r = await prerenderRoute(context, entry);
      if (r.ok) ok += 1;
      else skipped.push(`${r.route} (${r.skipped}, after retry)`);
    }

    log(`prerendered ${ok}/${routes.length}`);
    if (skipped.length) {
      log(`kept static fallback on ${skipped.length}:`);
      for (const s of skipped) log(`  - ${s}`);
    }
  } catch (err) {
    log(`prerender pass failed (${err.message.split('\n')[0]}); affected routes keep their fallback HTML`);
  } finally {
    server.kill();
    await browser.close();
  }
}

main().catch((err) => {
  // Fail-open: a broken prerender must never take the deploy down with it.
  log(`unexpected error, shipping without prerender: ${err.message}`);
});
