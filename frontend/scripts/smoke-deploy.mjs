import http from "node:http";
import https from "node:https";

const PRIMARY_HOST = "affittacameregliarchi.com";
const WWW_HOST = `www.${PRIMARY_HOST}`;
const PRIMARY_ORIGIN = `https://${PRIMARY_HOST}`;
const CHECK_DEVICE = "mobile";
const USER_AGENT =
  "Mozilla/5.0 (Linux; Android 12; Pixel 5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Mobile Safari/537.36";

const checks = [
  {
    url: `https://${PRIMARY_HOST}/`,
    expectTitle: "Archi Travel Guide",
    expectedCanonical: PRIMARY_ORIGIN,
  },
  {
    url: `https://${WWW_HOST}/`,
    expectTitle: "Archi Travel Guide",
    expectedCanonical: PRIMARY_ORIGIN,
  },
  {
    url: `https://${PRIMARY_HOST}/siena-travel-guide`,
    expectTitle: "Siena Travel Guide",
    expectedCanonical: `${PRIMARY_ORIGIN}/siena-travel-guide`,
  },
  {
    url: `https://${PRIMARY_HOST}/where-to-stay-in-siena`,
    expectTitle: "Where to Stay in Siena",
    expectedCanonical: `${PRIMARY_ORIGIN}/where-to-stay-in-siena`,
  },
  {
    url: `https://www.${PRIMARY_HOST}/en/rooms-bed-and-breakfast-in-siena.html`,
    expectTitle: "Where to Stay in Siena",
    expectedCanonical: `${PRIMARY_ORIGIN}/where-to-stay-in-siena`,
  },
  {
    url: `https://${PRIMARY_HOST}/en/rooms-bed-and-breakfast-in-siena.html`,
    expectTitle: "Where to Stay in Siena",
    expectedCanonical: `${PRIMARY_ORIGIN}/where-to-stay-in-siena`,
  },
];

const allowedStatuses = new Set([200, 301, 302, 303, 307, 308]);

const badPatterns = [
  /Internal Server Error/i,
  /Application Error/i,
  /Unhandled Promise Rejection/i,
  /Runtime exception/i,
  /You need to enable JavaScript/i,
];

function normalizeUrl(input) {
  return input
    .replace("affittacamregliarchi.com", "affittacameregliarchi.com")
    .trim();
}

function requestHead(url) {
  return new Promise((resolve, reject) => {
    const parsed = new URL(url);
    const client = parsed.protocol === "http:" ? http : https;

    const req = client.request(
      {
        method: "GET",
        protocol: parsed.protocol,
        hostname: parsed.hostname,
        port: parsed.port,
        path: `${parsed.pathname}${parsed.search}`,
        headers: {
          "Cache-Control": "no-cache",
          "User-Agent": USER_AGENT,
        },
      },
      (res) => {
        let body = "";
        res.setEncoding("utf8");
        res.on("data", (chunk) => (body += chunk));
        res.on("end", () => {
          resolve({
            status: res.statusCode || 0,
            headers: res.headers,
            body,
          });
        });
      }
    );

    req.on("error", (err) => reject(err));
    req.on("timeout", () => {
      req.destroy(new Error(`Request timeout for ${url}`));
    });
    req.setTimeout(30000);
    req.end();
  });
}

async function fetchWithRedirects(startUrl, maxHops = 12) {
  const chain = [];
  let currentUrl = normalizeUrl(startUrl);

  for (let hop = 0; hop < maxHops; hop += 1) {
    const result = await requestHead(currentUrl);
    chain.push({
      url: currentUrl,
      status: result.status,
      location: result.headers.location || null,
      body: result.body,
    });

    if (result.status >= 300 && result.status < 400 && result.headers.location) {
      const next = new URL(result.headers.location, currentUrl).toString();
      currentUrl = normalizeUrl(next);
      continue;
    }

    return { chain, final: chain[chain.length - 1] };
  }

  return {
    chain,
    final: chain[chain.length - 1],
    error: "Too many redirects",
  };
}

function extractTitle(html) {
  const match = html.match(/<title[^>]*>(.*?)<\/title>/i);
  return match ? match[1].replace(/<[^>]*>/g, "").trim() : "";
}

function extractCanonical(html) {
  const match =
    html.match(
      /<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["'][^>]*>/i
    ) || html.match(/<link[^>]+href=["']([^"']+)["'][^>]+rel=["']canonical["'][^>]*>/i);
  return match ? match[1].trim() : "";
}

function normalizeCanonical(url) {
  try {
    const parsed = new URL(url);
    if (parsed.pathname === "/" || parsed.pathname === "") {
      return normalizeUrl(parsed.origin);
    }

    return `${normalizeUrl(
      `${parsed.origin}${parsed.pathname.replace(/\/+$/, "")}${parsed.search || ""}`
    )}`;
  } catch (_error) {
    return normalizeUrl(url.trim());
  }
}

function formatChain(chain) {
  return chain.map((h) => h.status).join(" -> ");
}

function hasForbiddenShell(html) {
  return badPatterns.some((pattern) => pattern.test(html));
}

function hasExpectedStatusChain(chain) {
  if (chain.length === 0) return false;
  if (!chain.every((step) => allowedStatuses.has(step.status))) return false;
  const finalStatus = chain[chain.length - 1].status;
  if (finalStatus !== 200) return false;

  for (let i = 0; i < chain.length - 1; i += 1) {
    if (chain[i].status === 200) return false;
  }

  return true;
}

let failed = false;

for (const check of checks) {
  try {
    const result = await fetchWithRedirects(check.url);
    const chain = result.chain;
    const final = result.final || {};
    const body = final.body || "";
    const title = extractTitle(body);
    const canonical = extractCanonical(body);
    const normalizedCanonical = normalizeCanonical(canonical);
    const expectedCanonical = normalizeCanonical(check.expectedCanonical);

    const statusesOk = hasExpectedStatusChain(chain);
    const titleOk = title.includes(check.expectTitle);
    const canonicalOk = normalizedCanonical === expectedCanonical;
    const bad = hasForbiddenShell(body);

    const statusText = formatChain(chain);
    const finalStatus = final.status;
    const finalUrl = final.location
      ? new URL(final.location, final.url || check.url).toString()
      : final.url || check.url;

    const ok = statusesOk && titleOk && canonicalOk && !bad;
    console.log(`[${ok ? "OK" : "FAIL"}] [${CHECK_DEVICE}] ${check.url} => status ${finalStatus} chain ${statusText}`);
    console.log(`  final: ${finalUrl}`);
    console.log(`  canonical: ${canonical || "(missing)"}`);
    console.log(
      `  canonical-match: ${canonicalOk ? `yes (${normalizedCanonical})` : `no (expected ${expectedCanonical})`}`
    );
    console.log(`  title-ok: ${titleOk}`);
    console.log(`  bad-pattern: ${bad}`);

    if (!ok) {
      failed = true;
      if (!canonicalOk) console.log(`  reason: canonical mismatch`);
      if (!titleOk) console.log(`  reason: title mismatch`);
      if (!statusesOk) console.log(`  reason: unexpected status chain -> ${statusText}`);
      if (result.error) console.log(`  reason: ${result.error}`);
      if (bad) console.log("  reason: JS-shell or runtime error pattern detected");
    }
  } catch (error) {
    failed = true;
    console.log(`[FAIL] ${check.url} => request error`);
    console.log(`  reason: ${error.code || ""} ${error.message}`);
  }
}

if (failed) {
  process.exit(1);
}

process.exit(0);
