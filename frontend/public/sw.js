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

const VERSION = "v1";
const SHELL_CACHE = `archi-shell-${VERSION}`;
const RUNTIME_CACHE = `archi-runtime-${VERSION}`;
const SHELL_URLS = ["/", "/travel-tools"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(SHELL_CACHE)
      .then((cache) => cache.addAll(SHELL_URLS))
      .then(() => self.skipWaiting())
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
