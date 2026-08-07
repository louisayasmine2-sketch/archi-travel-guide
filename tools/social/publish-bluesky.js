#!/usr/bin/env node
// Publishes today's fact card to Bluesky.
//
// What it publishes is decided by what is merged: every input is read from
// `origin/main` with `git show`, never from the working tree. Flow: fetch
// origin/main → find the package whose POSTING-GUIDE row carries today's date
// (WIB) → read caption.md, alt-text.txt and the feed PNG from that commit →
// createSession → uploadBlob → createRecord (app.bsky.feed.post with the card
// as an image embed and the article link as a rich-text facet) → read it back
// with getRecord → record it in bluesky-state.json. Already recorded means
// exit 0 without touching the API.
//
// Post text: Bluesky caps posts at 300 graphemes, so the full caption body
// rarely fits alongside a link. The text is composed from the caption.md body
// paragraphs verbatim — no rewriting — dropping whole paragraphs from the end
// until the post fits. Paragraphs that say "link in bio" are skipped: on
// Bluesky the link is inline. The link renders as its host+path, with the
// full utm_source=bluesky URL behind the facet.
//
// Credentials are an app password (Settings → Privacy and Security → App
// Passwords), never the account password.
//
// Usage:
//   node publish-bluesky.js [--dry-run] [--date YYYY-MM-DD] [--verbose]
//                           [--week 2026-W33] [--package day3-…]
//                           [--state <path>]
//
// Exit codes: 0 published, nothing due, already published, or waiting for
//             credentials (all success); 1 failure.

const os = require('os');
const path = require('path');

const {
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
} = require('./batch');

const CHANNEL = 'bluesky';
const FEED_IMAGE = 'card-feed-1080x1350.png';
const GRAPHEME_LIMIT = 300; // app.bsky.feed.post text limit
const BYTE_LIMIT = 3000; // hard byte cap on the same field
const BLOB_LIMIT = 1000000; // uploadBlob cap for images

const { has, valueOf } = makeArgs(process.argv);
const DRY_RUN = has('--dry-run');
const VERBOSE = has('--verbose');
const STATE_PATH = path.resolve(valueOf('--state') || path.join(__dirname, 'bluesky-state.json'));

const log = (...m) => console.log(...m);
const debug = (...m) => VERBOSE && console.log('  ·', ...m);

const graphemes = (s) => [...new Intl.Segmenter('en', { granularity: 'grapheme' }).segment(s)].length;
const utf8len = (s) => Buffer.byteLength(s, 'utf8');

// ---- post text -------------------------------------------------------------

// Display text for the link: host + path, no scheme, no UTM noise. The facet
// still carries the full URL, so attribution survives the shortening.
function displayLink(link) {
  const url = new URL(link);
  return `${url.host}${url.pathname.replace(/\/$/, '')}`;
}

function composeText(paragraphs, link) {
  const usable = paragraphs.filter((p) => !/link in bio/i.test(p));
  if (usable.length === 0) throw new Error('caption.md has no paragraphs usable on Bluesky');
  const display = displayLink(link);

  for (let n = usable.length; n >= 1; n--) {
    const text = `${usable.slice(0, n).join('\n\n')}\n\n${display}`;
    if (graphemes(text) <= GRAPHEME_LIMIT && utf8len(text) <= BYTE_LIMIT) {
      const byteEnd = utf8len(text);
      const byteStart = byteEnd - utf8len(display);
      return {
        text,
        dropped: usable.length - n,
        facets: [
          {
            index: { byteStart, byteEnd },
            features: [{ $type: 'app.bsky.richtext.facet#link', uri: link }],
          },
        ],
      };
    }
  }
  throw new Error(
    `caption headline alone does not fit Bluesky's ${GRAPHEME_LIMIT}-grapheme limit. ` +
      'Fix the copy in the batch rather than truncating it here.'
  );
}

// ---- package ---------------------------------------------------------------

function readPackage(week, pkg) {
  const dir = `social-output/${week}/${pkg}`;
  const caption = parseCaption(showText(`${dir}/caption.md`));
  if (caption.paragraphs.length === 0) {
    throw new Error(`${dir}/caption.md has no body paragraphs`);
  }
  const link = linkForChannel(caption.links, CHANNEL);
  if (!link) throw new Error(`${dir}/caption.md has no usable link to derive a ${CHANNEL} link from`);

  let altText;
  try {
    altText = showText(`${dir}/alt-text.txt`).trim();
  } catch {
    altText = ''; // alt is required by the embed schema; empty string is legal, and we log its absence
  }

  const png = showBinary(`${dir}/${FEED_IMAGE}`);
  if (!png || png.length === 0) throw new Error(`${dir}/${FEED_IMAGE} is empty on ${REF}`);
  if (png.slice(0, 8).toString('hex') !== '89504e470d0a1a0a') {
    throw new Error(`${dir}/${FEED_IMAGE} is not a PNG`);
  }
  if (png.length > BLOB_LIMIT) {
    throw new Error(`${dir}/${FEED_IMAGE} is ${png.length} bytes, over Bluesky's ${BLOB_LIMIT}-byte blob limit`);
  }

  const m = FEED_IMAGE.match(/(\d+)x(\d+)/);
  const aspectRatio = m ? { width: Number(m[1]), height: Number(m[2]) } : undefined;

  const { text, facets, dropped } = composeText(caption.paragraphs, link);
  return { week, pkg, dir, text, facets, dropped, link, altText, aspectRatio, png };
}

// ---- AT Protocol -----------------------------------------------------------

async function xrpc(service, method, { token, params, json, body, contentType } = {}) {
  const url = new URL(`/xrpc/${method}`, service);
  for (const [k, v] of Object.entries(params || {})) url.searchParams.set(k, v);
  const resp = await fetch(url, {
    method: json || body ? 'POST' : 'GET',
    headers: {
      ...(token ? { authorization: `Bearer ${token}` } : {}),
      ...(json ? { 'content-type': 'application/json' } : {}),
      ...(contentType ? { 'content-type': contentType } : {}),
    },
    body: json ? JSON.stringify(json) : body,
  });
  let data;
  try {
    data = await resp.json();
  } catch {
    throw new Error(`${method}: ${service} answered ${resp.status} with a non-JSON body`);
  }
  if (!resp.ok) {
    throw new Error(`${method}: ${resp.status} ${data.error || ''}: ${data.message || JSON.stringify(data)}`);
  }
  return data;
}

// ---- publish ---------------------------------------------------------------

async function main() {
  const date = valueOf('--date') || todayInSiteTz();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) throw new Error(`--date must be YYYY-MM-DD, got: ${date}`);
  const env = readEnv();
  const service = env.BLUESKY_SERVICE || 'https://bsky.social';

  log(`bluesky publish — date ${date} (WIB), service ${service}${DRY_RUN ? ', DRY RUN' : ''}`);

  // Credentials not installed yet is a waiting state, not a failure: exit 0 on
  // one line so a runner stays quiet. A dry run needs no credentials.
  const missing = ['BLUESKY_HANDLE', 'BLUESKY_APP_PASSWORD'].filter((k) => !env[k]);
  if (!DRY_RUN && missing.length > 0) {
    log(
      `waiting for credentials: no ${missing.join(' or ')} in tools/social/.env — no-op ` +
        '(see .env.example: use an app password from bsky.app Settings, not the account password)'
    );
    return 0;
  }

  fetchMain(log);

  const due = resolveDuePackage({ date, week: valueOf('--week'), pkg: valueOf('--package'), log });
  if (!due) {
    log(`nothing scheduled for ${date} in any week merged to main — no-op`);
    return 0;
  }
  const { week, pkg } = due;
  log(`today's package: ${week}/${pkg}`);

  const state = readState(STATE_PATH);
  const seen = alreadyPublished(state, week, pkg);
  if (seen) {
    log(`already published as ${seen.uri} at ${seen.timestamp} — nothing to do`);
    return 0;
  }

  const item = readPackage(week, pkg);
  log(`  text     ${graphemes(item.text)} graphemes (limit ${GRAPHEME_LIMIT})${item.dropped ? `, ${item.dropped} trailing paragraph(s) dropped to fit` : ''}`);
  log(`  link     ${item.link}`);
  log(`  alt text ${item.altText ? `${item.altText.length} chars` : '(none in the package)'}`);
  log(`  image    ${FEED_IMAGE}, ${item.png.length} bytes from ${REF}`);

  if (DRY_RUN) {
    log('\nDRY RUN — post text that would go to app.bsky.feed.post:\n');
    log(item.text);
    log(`\nfacets: ${JSON.stringify(item.facets)}`);
    log(`embed: image <${item.png.length} bytes>, alt <${item.altText.length} chars>, aspect ${item.aspectRatio ? `${item.aspectRatio.width}x${item.aspectRatio.height}` : 'unknown'}`);
    log('\nNo request was made and no state was written.');
    return 0;
  }

  const session = await xrpc(service, 'com.atproto.server.createSession', {
    json: { identifier: env.BLUESKY_HANDLE, password: env.BLUESKY_APP_PASSWORD },
  });
  if (!session.accessJwt || !session.did) throw new Error('createSession returned no token');
  log(`  session  ${session.handle} (${session.did})`);

  const upload = await xrpc(service, 'com.atproto.repo.uploadBlob', {
    token: session.accessJwt,
    body: item.png,
    contentType: 'image/png',
  });
  if (!upload.blob) throw new Error(`uploadBlob returned no blob: ${JSON.stringify(upload)}`);
  debug(`blob ${upload.blob.ref?.$link || '(inline ref)'}, ${upload.blob.size} bytes`);

  const record = {
    $type: 'app.bsky.feed.post',
    text: item.text,
    facets: item.facets,
    embed: {
      $type: 'app.bsky.embed.images',
      images: [
        {
          image: upload.blob,
          alt: item.altText,
          ...(item.aspectRatio ? { aspectRatio: item.aspectRatio } : {}),
        },
      ],
    },
    langs: ['en'],
    createdAt: new Date().toISOString(),
  };
  const created = await xrpc(service, 'com.atproto.repo.createRecord', {
    token: session.accessJwt,
    json: { repo: session.did, collection: 'app.bsky.feed.post', record },
  });
  if (!created.uri || !created.cid) throw new Error(`createRecord returned no uri/cid: ${JSON.stringify(created)}`);
  log(`created post ${created.uri}`);

  const rkey = created.uri.split('/').pop();

  // Readback is the actual proof. Nothing is recorded as published until the
  // PDS hands the record back to us.
  const readback = await xrpc(service, 'com.atproto.repo.getRecord', {
    params: { repo: session.did, collection: 'app.bsky.feed.post', rkey },
  });
  if (!readback || readback.uri !== created.uri || readback.cid !== created.cid) {
    throw new Error(`readback failed for ${created.uri}: ${JSON.stringify(readback)}`);
  }
  debug(`readback ok: cid ${readback.cid}`);

  const url = `https://bsky.app/profile/${session.handle}/post/${rkey}`;
  recordState(STATE_PATH, {
    week,
    package: pkg,
    date,
    uri: created.uri,
    cid: created.cid,
    rkey,
    did: session.did,
    handle: session.handle,
    url,
    timestamp: new Date().toISOString(),
    host: os.hostname(),
  });
  log(`recorded in ${path.relative(REPO, STATE_PATH)}`);
  log(`published ${week}/${pkg} as ${created.uri}`);
  log(`post: ${url}`);
  return 0;
}

main()
  .then((code) => process.exit(code))
  .catch((err) => {
    console.error(`\npublish-bluesky failed: ${err.message}`);
    process.exit(1);
  });
