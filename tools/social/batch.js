#!/usr/bin/env node
// Shared plumbing for the per-channel publishers (publish-telegram-channel.js,
// publish-bluesky.js): .env parsing, read-only git access to origin/main,
// POSTING-GUIDE schedule lookup, caption.md parsing, and the local publish
// state file. publish-pinterest.js predates this module and keeps its own
// copies of these helpers.
//
// Everything content-related is read from `origin/main` with `git show`, never
// from the working tree: a batch that has not passed the human gate cannot be
// published, whatever branch the checkout happens to be on.

const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const REPO = path.join(__dirname, '..', '..');
const REF = 'origin/main';
const ENV_FILE = path.join(__dirname, '.env');
const SITE_TZ_OFFSET_HOURS = 7; // +07:00 WIB, the timezone the schedule is written in

// ---- .env ------------------------------------------------------------------

// Parses KEY=VALUE lines. Values are taken literally; surrounding single or
// double quotes are stripped, everything else (including '#' inside a value)
// is kept. Lines that are blank or start with '#' are ignored.
function readEnv(file = ENV_FILE) {
  if (!fs.existsSync(file)) return {};
  const out = {};
  for (const raw of fs.readFileSync(file, 'utf8').split('\n')) {
    const line = raw.trim();
    if (!line || line.startsWith('#')) continue;
    const eq = line.indexOf('=');
    if (eq < 1) continue;
    const key = line.slice(0, eq).trim();
    let value = line.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"') && value.length > 1) ||
      (value.startsWith("'") && value.endsWith("'") && value.length > 1)
    ) {
      value = value.slice(1, -1);
    }
    out[key] = value;
  }
  return out;
}

// ---- CLI flags -------------------------------------------------------------

function makeArgs(argv) {
  const args = argv.slice(2);
  const has = (flag) => args.includes(flag);
  const valueOf = (flag) => {
    const i = args.indexOf(flag);
    if (i >= 0 && args[i + 1] && !args[i + 1].startsWith('--')) return args[i + 1];
    const inline = args.find((a) => a.startsWith(`${flag}=`));
    return inline ? inline.slice(flag.length + 1) : undefined;
  };
  return { has, valueOf };
}

// ---- git (read-only, always from origin/main) ------------------------------

function git(cmdArgs, { buffer = false } = {}) {
  return execFileSync('git', ['-C', REPO, ...cmdArgs], {
    encoding: buffer ? null : 'utf8',
    maxBuffer: 64 * 1024 * 1024,
  });
}

function fetchMain(log) {
  try {
    git(['fetch', '--quiet', 'origin', 'main']);
  } catch (err) {
    // A stale origin/main still publishes yesterday's merged work correctly;
    // it just cannot see anything merged in the last few minutes.
    log(`warning: could not fetch origin/main (${err.message.trim().split('\n')[0]}) — using the ref as it stands`);
  }
}

const showText = (file) => git(['show', `${REF}:${file}`]);
const showBinary = (file) => git(['show', `${REF}:${file}`], { buffer: true });

// ---- schedule --------------------------------------------------------------

function todayInSiteTz() {
  const now = new Date(Date.now() + SITE_TZ_OFFSET_HOURS * 3600 * 1000);
  return now.toISOString().slice(0, 10);
}

function listWeeks() {
  const out = git(['ls-tree', '-r', '--name-only', REF, '--', 'social-output']);
  const weeks = new Set();
  for (const line of out.split('\n')) {
    const m = line.match(/^social-output\/([^/]+)\/POSTING-GUIDE\.md$/);
    if (m) weeks.add(m[1]);
  }
  return [...weeks].sort();
}

// Rows look like:
// | 3 | Friday 2026-08-07 | day3-bus-vs-train-arrival | Instagram + … | … |
function parsePostingGuide(week, markdown) {
  const rows = [];
  for (const line of markdown.split('\n')) {
    if (!line.startsWith('|')) continue;
    const cells = line.split('|').map((c) => c.trim());
    const dateCell = cells.find((c) => /\d{4}-\d{2}-\d{2}/.test(c));
    const pkgCell = cells.find((c) => /^day\d+-[a-z0-9-]+$/i.test(c));
    if (!dateCell || !pkgCell) continue;
    rows.push({ week, date: dateCell.match(/\d{4}-\d{2}-\d{2}/)[0], pkg: pkgCell });
  }
  return rows;
}

function scheduleFromMain(log) {
  const rows = [];
  for (const week of listWeeks()) {
    try {
      rows.push(...parsePostingGuide(week, showText(`social-output/${week}/POSTING-GUIDE.md`)));
    } catch (err) {
      log(`warning: could not read the posting guide for ${week}: ${err.message.trim().split('\n')[0]}`);
    }
  }
  return rows;
}

// Resolves which package is due: explicit --week/--package flags win, otherwise
// the POSTING-GUIDE row carrying `date`. Returns null when nothing is due
// (the caller no-ops), throws when the guides cannot be read at all.
function resolveDuePackage({ date, week, pkg, log }) {
  if (week && pkg) return { week, pkg };
  const schedule = scheduleFromMain(log);
  const due = schedule.filter((r) => r.date === date && (!week || r.week === week));
  if (due.length === 0) return null;
  if (due.length > 1) {
    log(`warning: ${due.length} packages carry ${date}; taking the first: ${due.map((d) => `${d.week}/${d.pkg}`).join(', ')}`);
  }
  return { week: due[0].week, pkg: due[0].pkg };
}

// ---- caption.md ------------------------------------------------------------

// A caption file is: a `# Caption — …` title, body paragraphs, then
// `## Hashtags` and `## Links …` sections. The links section lists one URL per
// platform (`- instagram: https://…`); only utm_source differs between them.
function parseCaption(markdown) {
  const lines = markdown.split('\n');
  const bodyLines = [];
  const links = {};
  let hashtags;
  let section = 'body';
  for (const line of lines) {
    if (/^#\s/.test(line)) continue; // the `# Caption — …` title
    if (/^##\s*Hashtags/i.test(line)) { section = 'hashtags'; continue; }
    if (/^##\s*Links/i.test(line)) { section = 'links'; continue; }
    if (/^##\s/.test(line)) { section = 'other'; continue; }
    if (section === 'body') bodyLines.push(line);
    if (section === 'hashtags' && line.trim().startsWith('#')) hashtags = line.trim();
    if (section === 'links') {
      const m = line.match(/^-\s*([a-z0-9_-]+):\s*(\S+)/i);
      if (m) links[m[1].toLowerCase()] = m[2];
    }
  }
  const paragraphs = bodyLines
    .join('\n')
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);
  return { paragraphs, hashtags, links };
}

// The per-platform links in caption.md differ only in utm_source. A channel
// that has no explicit row derives its link from an existing one by swapping
// utm_source — same destination, correct attribution. Anything beyond the
// utm_source swap would be inventing a URL, which the editorial standard bans.
function linkForChannel(links, channel) {
  const explicit = links[channel];
  const base = explicit || links.instagram || Object.values(links)[0];
  if (!base) return undefined;
  let url;
  try {
    url = new URL(base);
    if (!/^https?:$/.test(url.protocol)) return undefined;
  } catch {
    return undefined;
  }
  if (!explicit && url.searchParams.has('utm_source')) {
    url.searchParams.set('utm_source', channel);
  }
  return url.toString();
}

// ---- state -----------------------------------------------------------------

function readState(statePath) {
  if (!fs.existsSync(statePath)) return { published: [] };
  try {
    const parsed = JSON.parse(fs.readFileSync(statePath, 'utf8'));
    return { published: Array.isArray(parsed.published) ? parsed.published : [] };
  } catch (err) {
    throw new Error(`state file ${statePath} is unreadable: ${err.message}`);
  }
}

function recordState(statePath, entry) {
  const state = readState(statePath);
  state.published.push(entry);
  const tmp = `${statePath}.tmp-${process.pid}`;
  fs.writeFileSync(tmp, JSON.stringify(state, null, 2) + '\n');
  fs.renameSync(tmp, statePath); // atomic: a crash never leaves half a state file
}

const alreadyPublished = (state, week, pkg) =>
  state.published.find((e) => e.week === week && e.package === pkg);

module.exports = {
  REPO,
  REF,
  readEnv,
  makeArgs,
  fetchMain,
  showText,
  showBinary,
  todayInSiteTz,
  resolveDuePackage,
  parseCaption,
  linkForChannel,
  readState,
  recordState,
  alreadyPublished,
};
