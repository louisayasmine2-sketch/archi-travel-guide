#!/usr/bin/env node
// Publishes today's fact card to Pinterest.
//
// What it publishes is decided by what is merged: every input is read from
// `origin/main` with `git show`, never from the working tree. A batch that has
// not passed the human gate therefore cannot be pinned, whatever branch the
// checkout happens to be on.
//
// Flow: fetch origin/main → find the package whose POSTING-GUIDE row carries
// today's date (WIB) → read pinterest.md, alt-text.txt and the pin PNG from
// that commit → create the pin (image_base64) → read it back with
// GET /v5/pins/{id} → record it in pinterest-state.json. Already recorded means
// exit 0 without touching the API.
//
// Usage:
//   node publish-pinterest.js [--dry-run] [--date YYYY-MM-DD] [--verbose]
//                             [--sandbox|--production] [--week 2026-W33]
//                             [--package day3-…] [--state <path>]
//
// Exit codes: 0 published, nothing due, already published, or waiting for
//             credentials (all success); 1 failure.

const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync } = require('child_process');

const {
  readEnv,
  resolveEnvName,
  assertEnvAllowed,
  envKey,
  getAccessToken,
  ensureBoard,
  api,
  PinterestError,
} = require('./pinterest-api');

const REPO = path.join(__dirname, '..', '..');
const REF = 'origin/main';
const SITE_TZ_OFFSET_HOURS = 7; // +07:00 WIB, the timezone the schedule is written in
const PIN_IMAGE = 'card-pin-1000x1500.png';
const BOARD_NAME = process.env.PINTEREST_BOARD_NAME || 'Archi Travel Cards';
const BOARD_DESCRIPTION =
  'Fact cards from affittacameregliarchi.com — Siena and Tuscany travel figures, every one dated and checked against an official source.';

// Pinterest v5 field limits. Breaking one is an editorial problem, not
// something to paper over by truncating someone's copy.
const LIMITS = { title: 100, description: 800, alt_text: 500 };

const args = process.argv.slice(2);
const has = (flag) => args.includes(flag);
const valueOf = (flag) => {
  const i = args.indexOf(flag);
  if (i >= 0 && args[i + 1] && !args[i + 1].startsWith('--')) return args[i + 1];
  const inline = args.find((a) => a.startsWith(`${flag}=`));
  return inline ? inline.slice(flag.length + 1) : undefined;
};

const DRY_RUN = has('--dry-run');
const VERBOSE = has('--verbose');
const STATE_PATH = path.resolve(valueOf('--state') || path.join(__dirname, 'pinterest-state.json'));

const log = (...m) => console.log(...m);
const debug = (...m) => VERBOSE && console.log('  ·', ...m);

// ---- git (read-only, always from origin/main) --------------------------------

function git(cmdArgs, { buffer = false } = {}) {
  return execFileSync('git', ['-C', REPO, ...cmdArgs], {
    encoding: buffer ? null : 'utf8',
    maxBuffer: 64 * 1024 * 1024,
  });
}

function fetchMain() {
  try {
    git(['fetch', '--quiet', 'origin', 'main']);
    debug(`fetched origin/main → ${git(['log', '--oneline', '-1', REF]).trim()}`);
  } catch (err) {
    // A stale origin/main still publishes yesterday's merged work correctly;
    // it just cannot see anything merged in the last few minutes.
    log(`warning: could not fetch origin/main (${err.message.trim().split('\n')[0]}) — using the ref as it stands`);
  }
}

const showText = (file) => git(['show', `${REF}:${file}`]);
const showBinary = (file) => git(['show', `${REF}:${file}`], { buffer: true });

function listWeeks() {
  const out = git(['ls-tree', '-r', '--name-only', REF, '--', 'social-output']);
  const weeks = new Set();
  for (const line of out.split('\n')) {
    const m = line.match(/^social-output\/([^/]+)\/POSTING-GUIDE\.md$/);
    if (m) weeks.add(m[1]);
  }
  return [...weeks].sort();
}

// ---- schedule ----------------------------------------------------------------

function todayInSiteTz() {
  const now = new Date(Date.now() + SITE_TZ_OFFSET_HOURS * 3600 * 1000);
  return now.toISOString().slice(0, 10);
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

function scheduleFromMain() {
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

// ---- package -----------------------------------------------------------------

function field(markdown, label) {
  const m = markdown.match(new RegExp(`^\\*\\*${label}:\\*\\*\\s*(.+)$`, 'm'));
  return m ? m[1].trim() : undefined;
}

function readPackage(week, pkg) {
  const dir = `social-output/${week}/${pkg}`;
  const pinterest = showText(`${dir}/pinterest.md`);

  const title = field(pinterest, 'Title');
  const description = field(pinterest, 'Description');
  const link = field(pinterest, 'Destination link');
  const image = field(pinterest, 'Image') || PIN_IMAGE;
  if (!title || !description || !link) {
    throw new Error(`${dir}/pinterest.md is missing Title, Description or Destination link`);
  }

  let altText;
  try {
    altText = showText(`${dir}/alt-text.txt`).trim();
  } catch {
    altText = undefined; // alt text is optional to the API; we log its absence
  }

  const png = showBinary(`${dir}/${image}`);
  if (!png || png.length === 0) throw new Error(`${dir}/${image} is empty on ${REF}`);
  if (png.slice(0, 8).toString('hex') !== '89504e470d0a1a0a') {
    throw new Error(`${dir}/${image} is not a PNG`);
  }

  for (const [key, value] of Object.entries({ title, description, alt_text: altText })) {
    if (value && value.length > LIMITS[key]) {
      throw new Error(
        `${dir}: ${key} is ${value.length} characters, over Pinterest's ${LIMITS[key]} limit. ` +
          'Fix the copy in the batch rather than truncating it here.'
      );
    }
  }
  try {
    const url = new URL(link);
    if (!/^https?:$/.test(url.protocol)) throw new Error('not http(s)');
  } catch {
    throw new Error(`${dir}: destination link is not a usable URL: ${link}`);
  }

  return { week, pkg, dir, title, description, link, altText, image, png };
}

// ---- state -------------------------------------------------------------------

function readState() {
  if (!fs.existsSync(STATE_PATH)) return { published: [] };
  try {
    const parsed = JSON.parse(fs.readFileSync(STATE_PATH, 'utf8'));
    return { published: Array.isArray(parsed.published) ? parsed.published : [] };
  } catch (err) {
    throw new Error(`state file ${STATE_PATH} is unreadable: ${err.message}`);
  }
}

function recordState(entry) {
  const state = readState();
  state.published.push(entry);
  const tmp = `${STATE_PATH}.tmp-${process.pid}`;
  fs.writeFileSync(tmp, JSON.stringify(state, null, 2) + '\n');
  fs.renameSync(tmp, STATE_PATH); // atomic: a crash never leaves half a state file
}

const alreadyPublished = (state, week, pkg, envName) =>
  state.published.find((e) => e.week === week && e.package === pkg && e.env === envName);

// ---- publish -----------------------------------------------------------------

async function main() {
  const date = valueOf('--date') || todayInSiteTz();
  const envName = resolveEnvName(
    has('--production') ? 'production' : has('--sandbox') ? 'sandbox' : undefined
  );
  const env = readEnv();
  assertEnvAllowed(envName, env);

  log(`pinterest publish — date ${date} (WIB), environment ${envName}${DRY_RUN ? ', DRY RUN' : ''}`);

  // Credentials not installed yet is a waiting state, not a failure: exit 0 on
  // one line so the runner stays quiet. A dry run needs no token and proceeds.
  // Once a token exists, any API error is a real failure and exits 1 as usual.
  const hasCredentials = Boolean(
    env[envKey('PINTEREST_ACCESS_TOKEN', envName)] || env[envKey('PINTEREST_REFRESH_TOKEN', envName)]
  );
  if (!DRY_RUN && !hasCredentials) {
    log(
      `waiting for credentials: no ${envKey('PINTEREST_ACCESS_TOKEN', envName)} or ` +
        `${envKey('PINTEREST_REFRESH_TOKEN', envName)} in tools/social/.env — no-op ` +
        `(install with: node pinterest-auth.js${envName === 'sandbox' ? ' --sandbox' : ''})`
    );
    return 0;
  }

  fetchMain();

  let week = valueOf('--week');
  let pkg = valueOf('--package');

  if (!week || !pkg) {
    const schedule = scheduleFromMain();
    debug(`${schedule.length} scheduled package row(s) on ${REF}`);
    const due = schedule.filter((r) => r.date === date && (!week || r.week === week));
    if (due.length === 0) {
      log(`nothing scheduled for ${date} in any week merged to main — no-op`);
      return 0;
    }
    if (due.length > 1) {
      log(`warning: ${due.length} packages carry ${date}; taking the first: ${due.map((d) => `${d.week}/${d.pkg}`).join(', ')}`);
    }
    ({ week, pkg } = { week: due[0].week, pkg: due[0].pkg });
  }

  log(`today's package: ${week}/${pkg}`);

  const state = readState();
  const seen = alreadyPublished(state, week, pkg, envName);
  if (seen) {
    log(`already published as pin ${seen.pinId} at ${seen.timestamp} — nothing to do`);
    return 0;
  }

  const item = readPackage(week, pkg);
  log(`  title       ${item.title}`);
  log(`  description ${item.description.slice(0, 80)}${item.description.length > 80 ? '…' : ''} (${item.description.length} chars)`);
  log(`  link        ${item.link}`);
  log(`  alt text    ${item.altText ? `${item.altText.length} chars` : '(none in the package)'}`);
  log(`  image       ${item.image}, ${item.png.length} bytes from ${REF}`);

  if (DRY_RUN) {
    const payload = {
      board_id: env[envName === 'sandbox' ? 'PINTEREST_BOARD_ID_SANDBOX' : 'PINTEREST_BOARD_ID'] || '<resolved at publish time>',
      title: item.title,
      description: item.description,
      link: item.link,
      alt_text: item.altText,
      media_source: {
        source_type: 'image_base64',
        content_type: 'image/png',
        data: `<${item.png.length} bytes → ${Math.ceil((item.png.length * 4) / 3)} base64 chars>`,
      },
    };
    log('\nDRY RUN — payload that would go to POST /v5/pins:\n');
    log(JSON.stringify(payload, null, 2));
    log('\nNo request was made and no state was written.');
    return 0;
  }

  const token = await getAccessToken(envName, { log: (m) => debug(m) });
  const board = await ensureBoard(envName, token, BOARD_NAME, BOARD_DESCRIPTION, { log: (m) => log(`  board: ${m}`) });
  log(`  board       ${board.name} (${board.id})`);

  const pin = await api.createPin(envName, token, {
    board_id: board.id,
    title: item.title,
    description: item.description,
    link: item.link,
    ...(item.altText ? { alt_text: item.altText } : {}),
    media_source: {
      source_type: 'image_base64',
      content_type: 'image/png',
      data: item.png.toString('base64'),
    },
  });

  if (!pin || !pin.id) throw new Error(`create pin returned no id: ${JSON.stringify(pin)}`);
  log(`created pin ${pin.id}`);

  // Readback is the actual proof. Nothing is recorded as published until the
  // API hands the pin back to us.
  const readback = await api.getPin(envName, token, pin.id);
  if (!readback || readback.id !== pin.id) {
    throw new Error(`readback failed for pin ${pin.id}: ${JSON.stringify(readback)}`);
  }
  debug(`readback ok: board_id ${readback.board_id}, created_at ${readback.created_at}`);

  const entry = {
    week,
    package: pkg,
    date,
    pinId: pin.id,
    boardId: board.id,
    env: envName,
    url: envName === 'production' ? `https://www.pinterest.com/pin/${pin.id}/` : null,
    timestamp: new Date().toISOString(),
    host: os.hostname(),
  };
  recordState(entry);
  log(`recorded in ${path.relative(REPO, STATE_PATH)}`);
  log(`${envName === 'sandbox' ? '[SANDBOX] ' : ''}published ${week}/${pkg} as pin ${pin.id}`);
  return 0;
}

main()
  .then((code) => process.exit(code))
  .catch((err) => {
    if (err instanceof PinterestError && err.status === 403) {
      console.error(
        '\npublish failed: Pinterest answered 403. On Trial access this is expected for ' +
          'production pin creation — publish to the sandbox until Standard access is approved.'
      );
    }
    console.error(`\npublish-pinterest failed: ${err.message}`);
    process.exit(1);
  });
