import https from "https";

const checks = [
  {
    url: "https://affittacameregliarchi.com/",
    title: "Archi Travel Guide",
  },
  {
    url: "https://affittacameregliarchi.com/siena-travel-guide",
    title: "Siena Travel Guide",
  },
  {
    url: "https://affittacameregliarchi.com/where-to-stay-in-siena",
    title: "Where to Stay in Siena",
  },
];

const badPatterns = [/Please enable JavaScript/i, /enable JavaScript/i];

function fetchUrl(targetUrl, redirectLimit = 8) {
  return new Promise((resolve, reject) => {
    const req = https.get(
      targetUrl,
      { headers: { "Cache-Control": "no-cache" } },
      (res) => {
        const status = res.statusCode || 0;
        const headers = res.headers;
        const location = headers.location;
        let body = "";

        res.setEncoding("utf8");
        res.on("data", (chunk) => {
          body += chunk;
        });
        res.on("end", async () => {
          if (status >= 300 && status < 400 && location && redirectLimit > 0) {
            const nextUrl = /^https?:\/\//i.test(location)
              ? location
              : new URL(location, targetUrl).toString();
            try {
              const next = await fetchUrl(nextUrl, redirectLimit - 1);
              resolve({
                url: targetUrl,
                status: next.status,
                finalStatus: next.status,
                body: next.body,
                finalUrl: next.finalUrl,
                location,
                redirectCount: next.redirectCount + 1,
              });
              return;
            } catch (err) {
              reject(err);
              return;
            }
          }

          if (status >= 300 && status < 400 && redirectLimit <= 0) {
            resolve({
              url: targetUrl,
              status,
              finalStatus: status,
              body,
              finalUrl: targetUrl,
              location,
              redirectCount: 0,
            });
            return;
          }

          resolve({
            url: targetUrl,
            status,
            finalStatus: status,
            body,
            finalUrl: targetUrl,
            location,
            redirectCount: 0,
          });
        });
      }
    );

    req.on("error", reject);
    req.setTimeout(15000, () =>
      req.destroy(new Error(`Request timeout for ${targetUrl}`))
    );
  });
}

function extractTitle(body) {
  const match = body.match(/<title[^>]*>(.*?)<\/title>/i);
  return match ? match[1].trim() : "";
}

function hasMetaDescription(body) {
  return /<meta[^>]+name=["']description["'][^>]*>/i.test(body);
}

function hasCanonical(body) {
  return /<link[^>]+rel=["']canonical["'][^>]*>/i.test(body);
}

let failed = false;

(async () => {
  for (const check of checks) {
    const result = await fetchUrl(check.url);
    const finalStatus = result.finalStatus ?? result.status;
    const body = result.body || "";

    const finalTitle = extractTitle(body);
    const hasExpectedTitle = finalTitle
      ? finalTitle.toLowerCase().includes(check.title.toLowerCase())
      : false;
    const hasBadPattern = badPatterns.some((re) => re.test(body));
    const hasSeoSignals = hasMetaDescription(body) && hasCanonical(body);

    const ok = finalStatus === 200 && hasExpectedTitle && hasSeoSignals && !hasBadPattern;

    const trace = result.redirectCount
      ? `redirected via ${result.redirectCount} hop(s): ${result.location} -> ${result.finalUrl}`
      : "direct";

    console.log(`[${ok ? "OK" : "FAIL"}] ${check.url} => status ${finalStatus} (${trace})`);

    if (!ok) {
      failed = true;
      if (finalStatus !== 200) {
        console.log(`  reason: expected final status 200`);
      }
      if (!hasExpectedTitle) {
        console.log(
          `  reason: missing expected title "${check.title}" (got: "${finalTitle || "none"}")`
        );
      }
      if (!hasSeoSignals) {
        console.log(`  reason: missing meta description or canonical tag`);
      }
      if (hasBadPattern) {
        console.log(`  reason: JS-shell fallback message detected`);
      }
    }
  }

  process.exit(failed ? 1 : 0);
})();
