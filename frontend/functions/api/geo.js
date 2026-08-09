// Cloudflare Pages Function served at /api/geo on the Pages domain.
//
// Cloudflare resolves every visitor's IP to a country at the edge and exposes
// it on the request object. We return only that two-letter country code: the
// IP address itself is never read, logged, or forwarded, and no third-party
// geolocation service is involved.
export function onRequest({ request }) {
  const country =
    (request.cf && request.cf.country) ||
    request.headers.get("CF-IPCountry") ||
    null;

  return new Response(JSON.stringify({ country }), {
    headers: {
      "content-type": "application/json; charset=utf-8",
      // Per-visitor answer — must never be cached at the edge or by the
      // browser, or one visitor's country would leak to the next.
      "cache-control": "no-store",
    },
  });
}
