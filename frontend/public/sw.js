/* Service worker for Archi Travel Guide.
 *
 * Hand-written (no build-step precache manifest): the app's assets are
 * content-hashed, so runtime caching is enough — after the first visit,
 * pages and tools keep working offline. Strategy:
 *   - navigations: network-first, falling back to the cached page, then the
 *     cached shell ("/") so the SPA can client-route anywhere;
 *   - same-origin assets (JS/CSS/images/fonts): stale-while-revalidate;
 *   - cross-origin (map tiles, rate API, fonts CDN): untouched — network
 *     only, never cached here.
 *
 * Bump VERSION to invalidate old caches on deploy of a new SW.
 */

const VERSION = "v3";
const SHELL_CACHE = `archi-shell-${VERSION}`;
const RUNTIME_CACHE = `archi-runtime-${VERSION}`;
const SHELL_URLS = ["/", "/travel-tools"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const shell = await caches.open(SHELL_CACHE);
      await shell.addAll(SHELL_URLS);
      // The page that registered this worker fetched its assets BEFORE the
      // worker controlled it, so runtime caching alone would leave the first
      // visit uncached and offline broken. CRA publishes the hashed asset
      // list as asset-manifest.json — precache everything it names.
      try {
        const res = await fetch("/asset-manifest.json");
        if (res.ok) {
          const manifest = await res.json();
          // Sourcemaps are ~70% of the manifest by bytes and are only ever
          // opened by devtools — precaching them wasted ~6MB of every
          // visitor's first-install quota.
          const files = Object.values(manifest.files || {}).filter(
            (f) => typeof f === "string" && f.startsWith("/") && !f.endsWith(".map")
          );
          const runtime = await caches.open(RUNTIME_CACHE);
          await Promise.all(files.map((f) => runtime.add(f).catch(() => undefined)));
        }
      } catch {
        // Manifest missing — runtime caching still covers later visits.
      }
      await self.skipWaiting();
    })()
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((k) => k.startsWith("archi-") && !k.endsWith(VERSION))
            .map((k) => caches.delete(k))
        )
      )
      .then(() => self.clients.claim())
  );
});

// On-demand caching: the page posts {type: "CACHE_URLS", urls: [...]} (e.g.
// when a guide is saved to My Trip) and every same-origin URL is stored in
// the runtime cache so the guide's images work offline even if the reader
// never scrolled them into view. Replies "done" on the provided port.
self.addEventListener("message", (event) => {
  const data = event.data;
  if (!data || data.type !== "CACHE_URLS" || !Array.isArray(data.urls)) return;
  event.waitUntil(
    (async () => {
      const runtime = await caches.open(RUNTIME_CACHE);
      await Promise.all(
        data.urls
          .filter((u) => typeof u === "string")
          .map((u) => {
            const abs = new URL(u, self.location.origin);
            if (abs.origin !== self.location.origin) return undefined;
            return runtime.add(abs.href).catch(() => undefined);
          })
      );
      if (event.ports && event.ports[0]) event.ports[0].postMessage("done");
    })()
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  if (req.mode === "navigate") {
    event.respondWith(networkFirstNavigation(req));
    return;
  }
  event.respondWith(staleWhileRevalidate(req));
});

async function networkFirstNavigation(req) {
  try {
    const res = await fetch(req);
    const cache = await caches.open(SHELL_CACHE);
    cache.put(req, res.clone());
    return res;
  } catch {
    const cached = await caches.match(req);
    if (cached) return cached;
    const shell = await caches.match("/");
    return shell || Response.error();
  }
}

async function staleWhileRevalidate(req) {
  const cache = await caches.open(RUNTIME_CACHE);
  const cached = await cache.match(req);
  const network = fetch(req)
    .then((res) => {
      if (res && res.status === 200) cache.put(req, res.clone());
      return res;
    })
    .catch(() => undefined);
  return cached || (await network) || Response.error();
}
