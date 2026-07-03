const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

const htmlPath = path.join(__dirname, 'build', 'index.html');
const html = fs.readFileSync(htmlPath, 'utf-8');

const dom = new JSDOM(html, {
  url: 'http://localhost/',
  runScripts: 'dangerously',
  resources: 'usable',
  pretendToBeVisual: true
});

dom.window.console.log = (...args) => console.log('[BROWSER]', ...args);
dom.window.console.error = (...args) => console.error('[BROWSER ERROR]', ...args);
dom.window.console.warn = (...args) => console.warn('[BROWSER WARN]', ...args);

dom.window.addEventListener('error', (event) => {
  console.error('[UNCAUGHT ERROR]', event.error);
});
dom.window.addEventListener('unhandledrejection', (event) => {
  console.error('[UNHANDLED REJECTION]', event.reason);
});

console.log('Loading JSDOM...');
setTimeout(() => {
  console.log('Done loading. Did it throw?');
  process.exit(0);
}, 3000);
