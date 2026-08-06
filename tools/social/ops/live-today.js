#!/usr/bin/env node
// Prints a JSON array of articles whose datePublished is today:
//   [{ store, path }, …]
// Guide JSONs: datePublished prefix match. articles.js: a bare 'YYYY-MM-DD'
// literal (the publish-date argument), canonicalPath read from the options
// object that follows it.
//
// Usage: node live-today.js <repoRoot> <YYYY-MM-DD>

const fs = require('fs');
const path = require('path');

const [repo, today] = process.argv.slice(2);
const dataDir = path.join(repo, 'frontend', 'src', 'data');
const out = [];

for (const f of fs.readdirSync(dataDir).filter((f) => f.endsWith('.json'))) {
  try {
    const d = JSON.parse(fs.readFileSync(path.join(dataDir, f), 'utf8'));
    if ((d.datePublished || '').startsWith(today)) {
      out.push({ store: f, path: d.canonicalPath || '/' + d.slug });
    }
  } catch {}
}

const raw = fs.readFileSync(path.join(dataDir, 'articles.js'), 'utf8');
const re = new RegExp(`['"]${today}['"]`, 'g');
let m;
while ((m = re.exec(raw))) {
  const after = raw.slice(m.index, m.index + 2000);
  const cp = after.match(/canonicalPath:\s*['"]([^'"]+)['"]/);
  if (cp && !out.some((o) => o.path === cp[1])) {
    out.push({ store: 'articles.js', path: cp[1] });
  }
}

console.log(JSON.stringify(out));
