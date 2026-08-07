#!/usr/bin/env node
// Publishes today's fact card to the public Telegram channel.
//
// This is a *publisher*, distinct from the pipeline's alarm bot: it posts the
// feed card as a photo to TELEGRAM_CHANNEL_ID, while ops/lib.sh keeps sending
// run notifications to the private TELEGRAM_CHAT_ID. Both use the same bot
// token, so the bot must be an administrator of the channel with permission to
// post messages.
//
// What it publishes is decided by what is merged: every input is read from
// `origin/main` with `git show`, never from the working tree. Flow: fetch
// origin/main → find the package whose POSTING-GUIDE row carries today's date
// (WIB) → read caption.md and the feed PNG from that commit → getChat (proves
// the bot can see the channel and resolves its public username) → sendPhoto →
// record the message in telegram-state.json. Already recorded means exit 0
// without touching the API.
//
// The caption is the caption.md body verbatim plus the article link with
// utm_source=telegram; hashtags are left off, where Telegram channels get no
// value from them. Telegram's sendPhoto response returns the created message
// object itself — that is the readback; the Bot API has no separate
// getMessage to call afterwards.
//
// Usage:
//   node publish-telegram-channel.js [--dry-run] [--date YYYY-MM-DD]
//                                    [--verbose] [--week 2026-W33]
//                                    [--package day3-…] [--state <path>]
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

const CHANNEL = 'telegram';
const FEED_IMAGE = 'card-feed-1080x1350.png';
const CAPTION_LIMIT = 1024; // Telegram's cap for photo captions

const { has, valueOf } = makeArgs(process.argv);
const DRY_RUN = has('--dry-run');
const VERBOSE = has('--verbose');
const STATE_PATH = path.resolve(valueOf('--state') || path.join(__dirname, 'telegram-state.json'));

const log = (...m) => console.log(...m);
const debug = (...m) => VERBOSE && console.log('  ·', ...m);

// ---- package ---------------------------------------------------------------

function readPackage(week, pkg) {
  const dir = `social-output/${week}/${pkg}`;
  const caption = parseCaption(showText(`${dir}/caption.md`));
  if (caption.paragraphs.length === 0) {
    throw new Error(`${dir}/caption.md has no body paragraphs`);
  }
  const link = linkForChannel(caption.links, CHANNEL);
  if (!link) throw new Error(`${dir}/caption.md has no usable link to derive a ${CHANNEL} link from`);

  const png = showBinary(`${dir}/${FEED_IMAGE}`);
  if (!png || png.length === 0) throw new Error(`${dir}/${FEED_IMAGE} is empty on ${REF}`);
  if (png.slice(0, 8).toString('hex') !== '89504e470d0a1a0a') {
    throw new Error(`${dir}/${FEED_IMAGE} is not a PNG`);
  }

  const text = `${caption.paragraphs.join('\n\n')}\n\n${link}`;
  if (text.length > CAPTION_LIMIT) {
    throw new Error(
      `${dir}: caption is ${text.length} characters, over Telegram's ${CAPTION_LIMIT} limit. ` +
        'Fix the copy in the batch rather than truncating it here.'
    );
  }
  return { week, pkg, dir, text, link, png };
}

// ---- Telegram Bot API ------------------------------------------------------

async function tg(token, method, body) {
  const resp = await fetch(`https://api.telegram.org/bot${token}/${method}`, {
    method: 'POST',
    body,
  });
  let data;
  try {
    data = await resp.json();
  } catch {
    throw new Error(`${method}: Telegram answered ${resp.status} with a non-JSON body`);
  }
  if (!data.ok) {
    // data.description never contains the token; the token only ever appears
    // in the URL path, which is not logged.
    throw new Error(`${method}: Telegram refused (${resp.status}): ${data.description || JSON.stringify(data)}`);
  }
  return data.result;
}

function messageUrl(chat, messageId) {
  if (chat.username) return `https://t.me/${chat.username}/${messageId}`;
  // Private channel: t.me/c/ links use the id without its -100 prefix and only
  // resolve for members.
  const internal = String(chat.id).replace(/^-100/, '');
  return `https://t.me/c/${internal}/${messageId}`;
}

// ---- publish ---------------------------------------------------------------

async function main() {
  const date = valueOf('--date') || todayInSiteTz();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) throw new Error(`--date must be YYYY-MM-DD, got: ${date}`);
  const env = readEnv();

  log(`telegram channel publish — date ${date} (WIB)${DRY_RUN ? ', DRY RUN' : ''}`);

  // Credentials not installed yet is a waiting state, not a failure: exit 0 on
  // one line so a runner stays quiet. A dry run needs no credentials.
  const missing = ['TELEGRAM_BOT_TOKEN', 'TELEGRAM_CHANNEL_ID'].filter((k) => !env[k]);
  if (!DRY_RUN && missing.length > 0) {
    log(
      `waiting for credentials: no ${missing.join(' or ')} in tools/social/.env — no-op ` +
        '(see .env.example: the channel id is the @username of the channel, and the bot must be a channel admin)'
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
    log(`already published as message ${seen.messageId} at ${seen.timestamp} — nothing to do`);
    return 0;
  }

  const item = readPackage(week, pkg);
  log(`  caption ${item.text.length} chars (limit ${CAPTION_LIMIT})`);
  log(`  link    ${item.link}`);
  log(`  image   ${FEED_IMAGE}, ${item.png.length} bytes from ${REF}`);

  if (DRY_RUN) {
    log('\nDRY RUN — caption that would go to sendPhoto:\n');
    log(item.text);
    log(`\nphoto: <${item.png.length} bytes>, chat_id: ${env.TELEGRAM_CHANNEL_ID || '<not set>'}`);
    log('\nNo request was made and no state was written.');
    return 0;
  }

  const token = env.TELEGRAM_BOT_TOKEN;
  const channelId = env.TELEGRAM_CHANNEL_ID;

  // getChat proves the id resolves and the bot can see the channel before we
  // try to post, and gives us the username for the public message link.
  const chat = await tg(token, 'getChat', new URLSearchParams({ chat_id: channelId }));
  log(`  channel ${chat.title || chat.id}${chat.username ? ` (@${chat.username})` : ' (private)'}`);

  const form = new FormData();
  form.append('chat_id', channelId);
  form.append('caption', item.text);
  form.append('photo', new Blob([item.png], { type: 'image/png' }), FEED_IMAGE);
  const message = await tg(token, 'sendPhoto', form);

  if (!message || !message.message_id || !Array.isArray(message.photo) || message.photo.length === 0) {
    throw new Error(`sendPhoto returned no photo message: ${JSON.stringify(message)}`);
  }
  const url = messageUrl(message.chat, message.message_id);
  debug(`message ${message.message_id}, largest photo ${message.photo.at(-1).width}x${message.photo.at(-1).height}`);

  recordState(STATE_PATH, {
    week,
    package: pkg,
    date,
    messageId: message.message_id,
    chatId: message.chat.id,
    chatUsername: message.chat.username || null,
    url,
    timestamp: new Date().toISOString(),
    host: os.hostname(),
  });
  log(`recorded in ${path.relative(REPO, STATE_PATH)}`);
  log(`published ${week}/${pkg} as message ${message.message_id}`);
  log(`post: ${url}`);
  return 0;
}

main()
  .then((code) => process.exit(code))
  .catch((err) => {
    console.error(`\npublish-telegram-channel failed: ${err.message}`);
    process.exit(1);
  });
