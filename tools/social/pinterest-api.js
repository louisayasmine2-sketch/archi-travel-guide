#!/usr/bin/env node
// Shared Pinterest API v5 plumbing: .env handling, host selection, OAuth token
// refresh with rotation, and a thin request helper. Required by
// pinterest-auth.js and publish-pinterest.js. No third-party dependencies —
// Node 22's global fetch is enough.
//
// Environments are kept strictly apart. Sandbox entities (boards, pins) do not
// exist in production and vice versa, so every credential key carries a
// _SANDBOX suffix when PINTEREST_ENV=sandbox:
//
//   production:  PINTEREST_ACCESS_TOKEN,         PINTEREST_BOARD_ID,         …
//   sandbox:     PINTEREST_ACCESS_TOKEN_SANDBOX, PINTEREST_BOARD_ID_SANDBOX, …
//
// App ID/secret are shared: the same app owns both environments.

const fs = require('fs');
const path = require('path');

const ENV_FILE = path.join(__dirname, '.env');

const HOSTS = {
  production: 'https://api.pinterest.com',
  sandbox: 'https://api-sandbox.pinterest.com',
};

const AUTHORIZE_URL = 'https://www.pinterest.com/oauth/';

// Scopes the publisher needs. boards:write is required for the sandbox board
// the helper creates; user_accounts:read only for the whoami sanity check.
const SCOPES = [
  'pins:read',
  'pins:write',
  'boards:read',
  'boards:write',
  'user_accounts:read',
];

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

// Updates or appends keys in .env, preserving every other line, comment and
// ordering. Written with 0600 because this file holds live tokens.
function writeEnv(updates, file = ENV_FILE) {
  const lines = fs.existsSync(file) ? fs.readFileSync(file, 'utf8').split('\n') : [];
  const remaining = { ...updates };

  const next = lines.map((raw) => {
    const line = raw.trim();
    if (!line || line.startsWith('#')) return raw;
    const eq = line.indexOf('=');
    if (eq < 1) return raw;
    const key = line.slice(0, eq).trim();
    if (!(key in remaining)) return raw;
    const value = remaining[key];
    delete remaining[key];
    return `${key}=${value}`;
  });

  const appended = Object.entries(remaining).map(([k, v]) => `${k}=${v}`);
  if (appended.length) {
    if (next.length && next[next.length - 1].trim() !== '') next.push('');
    next.push('# Pinterest publisher — written by pinterest-auth.js / publish-pinterest.js');
    next.push(...appended);
  }

  let body = next.join('\n');
  if (!body.endsWith('\n')) body += '\n';
  fs.writeFileSync(file, body, { mode: 0o600 });
  try {
    fs.chmodSync(file, 0o600);
  } catch {
    /* best effort: the file may be owned by another user in a shared checkout */
  }
  return Object.keys(updates);
}

// ---- environment resolution -------------------------------------------------

function resolveEnvName(explicit, env = readEnv()) {
  const name = (explicit || env.PINTEREST_ENV || 'sandbox').toLowerCase();
  if (!(name in HOSTS)) {
    throw new Error(`unknown PINTEREST_ENV "${name}" — use "sandbox" or "production"`);
  }
  return name;
}

// Credential key for the active environment (see header).
const envKey = (name, envName) => (envName === 'sandbox' ? `${name}_SANDBOX` : name);

// The production guard. Trial access cannot create public pins at all — the
// API answers 403 — so the publisher refuses to try until the app is on
// Standard access and PINTEREST_ACCESS_TIER says so explicitly.
function assertEnvAllowed(envName, env = readEnv()) {
  if (envName !== 'production') return;
  const tier = (env.PINTEREST_ACCESS_TIER || '').toLowerCase();
  if (tier !== 'standard') {
    throw new Error(
      'refusing to publish to production: PINTEREST_ACCESS_TIER is ' +
        `"${env.PINTEREST_ACCESS_TIER || '(unset)'}", not "standard". Trial apps cannot ` +
        'create public pins (the API returns 403). Set it only once the Standard ' +
        'access upgrade is approved — see STANDARD-APPLICATION.md.'
    );
  }
}

// ---- HTTP -------------------------------------------------------------------

class PinterestError extends Error {
  constructor(status, body, url) {
    const detail = typeof body === 'string' ? body : JSON.stringify(body);
    super(`Pinterest API ${status} on ${url}: ${detail}`);
    this.name = 'PinterestError';
    this.status = status;
    this.body = body;
  }
}

async function parseBody(res) {
  const text = await res.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

// Low-level call. `token` may be omitted for the token endpoint, which
// authenticates with the app's Basic credentials instead.
async function apiRequest(envName, method, endpoint, { token, body, basic, form, timeoutMs = 60000 } = {}) {
  const url = `${HOSTS[envName]}${endpoint}`;
  const headers = { Accept: 'application/json' };
  if (token) headers.Authorization = `Bearer ${token}`;
  if (basic) headers.Authorization = `Basic ${basic}`;

  let payload;
  if (form) {
    headers['Content-Type'] = 'application/x-www-form-urlencoded';
    payload = new URLSearchParams(form).toString();
  } else if (body !== undefined) {
    headers['Content-Type'] = 'application/json';
    payload = JSON.stringify(body);
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  let res;
  try {
    res = await fetch(url, { method, headers, body: payload, signal: controller.signal });
  } catch (err) {
    if (err.name === 'AbortError') throw new Error(`Pinterest API timeout after ${timeoutMs}ms on ${url}`);
    throw new Error(`Pinterest API request failed on ${url}: ${err.message}`);
  } finally {
    clearTimeout(timer);
  }

  const parsed = await parseBody(res);
  if (!res.ok) throw new PinterestError(res.status, parsed, url);
  return parsed;
}

// ---- OAuth ------------------------------------------------------------------

function basicAuth(env) {
  const id = env.PINTEREST_APP_ID;
  const secret = env.PINTEREST_APP_SECRET;
  if (!id || !secret) {
    throw new Error('PINTEREST_APP_ID and PINTEREST_APP_SECRET must be set in tools/social/.env');
  }
  return Buffer.from(`${id}:${secret}`).toString('base64');
}

function authorizeUrl(env, envName, state) {
  const redirect = env.PINTEREST_REDIRECT_URI;
  if (!redirect) throw new Error('PINTEREST_REDIRECT_URI must be set in tools/social/.env');
  const params = new URLSearchParams({
    client_id: env.PINTEREST_APP_ID || '',
    redirect_uri: redirect,
    response_type: 'code',
    scope: SCOPES.join(','),
    state: state || `archi-${envName}`,
  });
  return `${AUTHORIZE_URL}?${params.toString()}`;
}

// Exchanges an authorization code for tokens and stores them under the keys
// belonging to `envName`.
async function exchangeCode(envName, code, env = readEnv()) {
  const tokens = await apiRequest(envName, 'POST', '/v5/oauth/token', {
    basic: basicAuth(env),
    form: {
      grant_type: 'authorization_code',
      code,
      redirect_uri: env.PINTEREST_REDIRECT_URI,
      continuous_refresh: 'true',
    },
  });
  return storeTokens(envName, tokens);
}

// Refresh tokens rotate on the continuous-refresh flow: whatever the response
// carries replaces what we hold, or the next refresh fails.
async function refreshTokens(envName, env = readEnv()) {
  const refresh = env[envKey('PINTEREST_REFRESH_TOKEN', envName)];
  if (!refresh) {
    throw new Error(
      `no ${envKey('PINTEREST_REFRESH_TOKEN', envName)} in .env — run: node pinterest-auth.js` +
        (envName === 'sandbox' ? ' --sandbox' : '')
    );
  }
  const tokens = await apiRequest(envName, 'POST', '/v5/oauth/token', {
    basic: basicAuth(env),
    form: {
      grant_type: 'refresh_token',
      refresh_token: refresh,
      continuous_refresh: 'true',
    },
  });
  return storeTokens(envName, tokens, env);
}

function storeTokens(envName, tokens, env = readEnv()) {
  if (!tokens || !tokens.access_token) {
    throw new Error(`token response carried no access_token: ${JSON.stringify(tokens)}`);
  }
  const now = Math.floor(Date.now() / 1000);
  const updates = {
    [envKey('PINTEREST_ACCESS_TOKEN', envName)]: tokens.access_token,
    [envKey('PINTEREST_TOKEN_EXPIRES_AT', envName)]: String(now + Number(tokens.expires_in || 2592000)),
  };
  // Only overwrite the refresh token when the response carries one: a plain
  // refresh may legitimately return only the access token.
  const keptRefresh = tokens.refresh_token || env[envKey('PINTEREST_REFRESH_TOKEN', envName)];
  if (keptRefresh) updates[envKey('PINTEREST_REFRESH_TOKEN', envName)] = keptRefresh;
  if (tokens.refresh_token_expires_in) {
    updates[envKey('PINTEREST_REFRESH_EXPIRES_AT', envName)] = String(
      now + Number(tokens.refresh_token_expires_in)
    );
  }
  writeEnv(updates);
  return {
    accessToken: tokens.access_token,
    expiresAt: now + Number(tokens.expires_in || 2592000),
    rotatedRefresh: Boolean(tokens.refresh_token),
  };
}

// Returns a usable access token, refreshing first when it expires within the
// next hour. A directly pasted sandbox token (Configure app → generate) works
// too: it simply has no refresh token, and is used until it expires.
async function getAccessToken(envName, { log = () => {} } = {}) {
  const env = readEnv();
  const token = env[envKey('PINTEREST_ACCESS_TOKEN', envName)];
  const expiresAt = Number(env[envKey('PINTEREST_TOKEN_EXPIRES_AT', envName)] || 0);
  const now = Math.floor(Date.now() / 1000);
  const hasRefresh = Boolean(env[envKey('PINTEREST_REFRESH_TOKEN', envName)]);

  if (token && (!expiresAt || expiresAt - now > 3600)) return token;

  if (!hasRefresh) {
    if (token) {
      log(`access token expires at ${new Date(expiresAt * 1000).toISOString()} and there is no refresh token — using it as is`);
      return token;
    }
    throw new Error(
      `no ${envKey('PINTEREST_ACCESS_TOKEN', envName)} in tools/social/.env — run: node pinterest-auth.js` +
        (envName === 'sandbox' ? ' --sandbox' : '')
    );
  }

  log('access token missing or expiring within the hour — refreshing');
  const refreshed = await refreshTokens(envName, env);
  log(`refreshed; new expiry ${new Date(refreshed.expiresAt * 1000).toISOString()}${refreshed.rotatedRefresh ? ' (refresh token rotated and saved)' : ''}`);
  return refreshed.accessToken;
}

// ---- resources ---------------------------------------------------------------

const api = {
  whoami: (envName, token) => apiRequest(envName, 'GET', '/v5/user_account', { token }),
  listBoards: (envName, token) => apiRequest(envName, 'GET', '/v5/boards?page_size=50', { token }),
  createBoard: (envName, token, name, description) =>
    apiRequest(envName, 'POST', '/v5/boards', {
      token,
      body: { name, description, privacy: 'PUBLIC' },
    }),
  createPin: (envName, token, pin) => apiRequest(envName, 'POST', '/v5/pins', { token, body: pin }),
  getPin: (envName, token, pinId) => apiRequest(envName, 'GET', `/v5/pins/${pinId}`, { token }),
};

// Finds the board by name, creating it when absent, and remembers the id in
// .env so the next run is a no-op lookup.
async function ensureBoard(envName, token, name, description, { log = () => {} } = {}) {
  const env = readEnv();
  const key = envKey('PINTEREST_BOARD_ID', envName);
  const existingId = env[key];
  if (existingId) {
    try {
      const boards = await api.listBoards(envName, token);
      const match = (boards.items || []).find((b) => b.id === existingId);
      if (match) return { id: existingId, name: match.name, created: false };
      log(`board id ${existingId} from .env is not in this account's boards — re-resolving by name`);
    } catch (err) {
      log(`could not list boards (${err.message}) — trusting ${key} from .env`);
      return { id: existingId, name, created: false };
    }
  }

  const boards = await api.listBoards(envName, token);
  const byName = (boards.items || []).find((b) => b.name === name);
  if (byName) {
    writeEnv({ [key]: byName.id });
    log(`found board "${name}" (${byName.id}); saved to .env as ${key}`);
    return { id: byName.id, name: byName.name, created: false };
  }

  const board = await api.createBoard(envName, token, name, description);
  writeEnv({ [key]: board.id });
  log(`created board "${name}" (${board.id}); saved to .env as ${key}`);
  return { id: board.id, name: board.name, created: true };
}

module.exports = {
  ENV_FILE,
  HOSTS,
  SCOPES,
  PinterestError,
  readEnv,
  writeEnv,
  resolveEnvName,
  envKey,
  assertEnvAllowed,
  apiRequest,
  authorizeUrl,
  exchangeCode,
  refreshTokens,
  getAccessToken,
  ensureBoard,
  api,
};
