#!/usr/bin/env node
// One-off OAuth helper for the Pinterest publisher. Headless-friendly: it
// prints an authorize URL you open on any device, you paste the redirect URL
// (or just the code) back, and it writes the tokens into tools/social/.env.
//
// Usage:
//   node pinterest-auth.js [--sandbox|--production]   interactive code flow
//   node pinterest-auth.js --code <code> [--sandbox]  non-interactive exchange
//   node pinterest-auth.js --refresh [--sandbox]      force a token refresh
//   node pinterest-auth.js --status [--sandbox]       show what .env holds
//   node pinterest-auth.js --whoami [--sandbox]       call GET /v5/user_account
//   node pinterest-auth.js --create-board [--sandbox] create/find the board
//
// Sandbox note: the Configure app tab can also hand you a ready-made sandbox
// access token (30 days, no refresh token). Paste it into .env as
// PINTEREST_ACCESS_TOKEN_SANDBOX and skip the code flow entirely.

const readline = require('readline');
const {
  readEnv,
  writeEnv,
  resolveEnvName,
  envKey,
  authorizeUrl,
  exchangeCode,
  refreshTokens,
  getAccessToken,
  ensureBoard,
  api,
  SCOPES,
  ENV_FILE,
} = require('./pinterest-api');

const BOARD_NAME = process.env.PINTEREST_BOARD_NAME || 'Archi Travel Cards';
const BOARD_DESCRIPTION =
  'Fact cards from affittacameregliarchi.com — Siena and Tuscany travel figures, every one dated and checked against an official source.';

const args = process.argv.slice(2);
const has = (flag) => args.includes(flag);
const valueOf = (flag) => {
  const i = args.indexOf(flag);
  return i >= 0 ? args[i + 1] : undefined;
};

const log = (...m) => console.log(...m);

function ask(question) {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((resolve) => rl.question(question, (a) => { rl.close(); resolve(a.trim()); }));
}

// Accepts either a bare code or the whole redirect URL that Pinterest sent the
// browser to, which is what people actually have in front of them.
function extractCode(input) {
  const trimmed = input.trim();
  if (!trimmed) return '';
  if (!/^https?:\/\//i.test(trimmed)) return trimmed;
  try {
    const url = new URL(trimmed);
    const code = url.searchParams.get('code');
    if (!code) throw new Error('redirect URL carries no ?code= parameter');
    return code;
  } catch (err) {
    throw new Error(`could not read a code from that URL: ${err.message}`);
  }
}

function status(envName) {
  const env = readEnv();
  const rows = [
    ['app id', env.PINTEREST_APP_ID ? `${env.PINTEREST_APP_ID}` : '(unset)'],
    ['app secret', env.PINTEREST_APP_SECRET ? '(set)' : '(unset)'],
    ['redirect uri', env.PINTEREST_REDIRECT_URI || '(unset)'],
    ['access tier', env.PINTEREST_ACCESS_TIER || '(unset — treated as trial)'],
    ['environment', envName],
  ];
  for (const key of [
    'PINTEREST_ACCESS_TOKEN',
    'PINTEREST_REFRESH_TOKEN',
    'PINTEREST_TOKEN_EXPIRES_AT',
    'PINTEREST_REFRESH_EXPIRES_AT',
    'PINTEREST_BOARD_ID',
  ]) {
    const k = envKey(key, envName);
    const v = env[k];
    let shown = '(unset)';
    if (v && key.endsWith('EXPIRES_AT')) {
      const secs = Number(v) - Math.floor(Date.now() / 1000);
      const days = Math.floor(secs / 86400);
      shown = `${new Date(Number(v) * 1000).toISOString()} (${secs > 0 ? `in ${days}d` : 'EXPIRED'})`;
    } else if (v) {
      shown = key.endsWith('TOKEN') ? `${v.slice(0, 6)}…${v.slice(-4)} (${v.length} chars)` : v;
    }
    rows.push([k, shown]);
  }
  const width = Math.max(...rows.map((r) => r[0].length));
  for (const [k, v] of rows) log(`  ${k.padEnd(width)}  ${v}`);
  log(`\n  .env: ${ENV_FILE}`);
}

async function main() {
  const envName = resolveEnvName(has('--production') ? 'production' : has('--sandbox') ? 'sandbox' : undefined);
  log(`Pinterest auth — environment: ${envName}\n`);

  if (has('--status')) {
    status(envName);
    return;
  }

  if (has('--whoami')) {
    const token = await getAccessToken(envName, { log });
    const me = await api.whoami(envName, token);
    log(JSON.stringify(me, null, 2));
    return;
  }

  if (has('--refresh')) {
    const result = await refreshTokens(envName);
    log(`refreshed. access token valid until ${new Date(result.expiresAt * 1000).toISOString()}`);
    log(result.rotatedRefresh ? 'refresh token rotated and saved' : 'response carried no new refresh token; kept the existing one');
    return;
  }

  if (has('--create-board')) {
    const token = await getAccessToken(envName, { log });
    const board = await ensureBoard(envName, token, BOARD_NAME, BOARD_DESCRIPTION, { log });
    log(`board ready: "${board.name}" ${board.id}${board.created ? ' (created)' : ' (already existed)'}`);
    return;
  }

  const env = readEnv();
  for (const key of ['PINTEREST_APP_ID', 'PINTEREST_APP_SECRET', 'PINTEREST_REDIRECT_URI']) {
    if (!env[key]) {
      throw new Error(
        `${key} is missing from tools/social/.env. Register the app first — the ` +
          'click-by-click steps are in README.md, section "Pinterest app registration".'
      );
    }
  }

  const codeArg = valueOf('--code');
  if (codeArg) {
    const result = await exchangeCode(envName, extractCode(codeArg));
    log(`tokens stored in .env under the ${envName} keys.`);
    log(`access token valid until ${new Date(result.expiresAt * 1000).toISOString()}`);
    return;
  }

  const url = authorizeUrl(env, envName);
  log('1. Open this URL, sign in as the account that owns the board, and approve:\n');
  log(`   ${url}\n`);
  log(`   Scopes requested: ${SCOPES.join(', ')}`);
  log(`   Pinterest will redirect to ${env.PINTEREST_REDIRECT_URI} with ?code=… in the address bar.`);
  log('   That page does not have to exist — only the address bar matters.\n');
  const answer = await ask('2. Paste the full redirect URL (or just the code) here: ');
  const code = extractCode(answer);
  if (!code) throw new Error('no code given — nothing to exchange');

  const result = await exchangeCode(envName, code);
  log(`\ntokens stored in .env under the ${envName} keys.`);
  log(`access token valid until ${new Date(result.expiresAt * 1000).toISOString()}`);
  log('refresh token saved; it rotates on every refresh and the publisher always stores the new one.');
  log('\nNext: node pinterest-auth.js --create-board' + (envName === 'sandbox' ? ' --sandbox' : ''));
}

main().catch((err) => {
  console.error(`\npinterest-auth failed: ${err.message}`);
  process.exit(1);
});
