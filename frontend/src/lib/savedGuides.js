import { TRIP_CHANGE_EVENT } from "@/lib/tripPlan";

// Saved guides — the reading list a visitor builds while planning. Stored
// like the rest of the My Trip layer (localStorage, versioned key) and
// surfaced on the Trip Sheet, including its printed PDF.

const KEY = "archi_saved_guides_v1";

export function loadSavedGuides() {
  try {
    const parsed = JSON.parse(localStorage.getItem(KEY));
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (g) => g && typeof g.path === "string" && g.path.startsWith("/") && typeof g.title === "string"
    );
  } catch {
    return [];
  }
}

export function isGuideSaved(path) {
  return loadSavedGuides().some((g) => g.path === path);
}

// Best-effort offline capture of the guide being saved: its page URL plus
// every same-origin image currently in the document (lazy-loaded photos the
// reader never scrolled to would otherwise be missing offline). No-op when
// no service worker controls the page (dev, first visit, unsupported).
export function cacheGuideOffline() {
  const controller = typeof navigator !== "undefined" && navigator.serviceWorker?.controller;
  if (!controller) return;
  // The page's real pathname (canonicalPath formatting varies per article,
  // and offline lookups match the URL the browser actually navigates to).
  const urls = [window.location.pathname];
  // The article body is a separate per-article JSON since the store split;
  // without it an offline revisit would hydrate back to the loading shell.
  // Prerendered pages announce their data URL (scripts/prerender-routes.js).
  if (window.__ARTICLE_JSON__) urls.push(window.__ARTICLE_JSON__);
  for (const img of document.querySelectorAll("img[src^='/images/']")) {
    urls.push(img.getAttribute("src"));
  }
  controller.postMessage({ type: "CACHE_URLS", urls: [...new Set(urls)] });
}

export function toggleSavedGuide({ path, title }) {
  const current = loadSavedGuides();
  const next = current.some((g) => g.path === path)
    ? current.filter((g) => g.path !== path)
    : [...current, { path, title }];
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    // Storage full/blocked: the UI simply stays unsaved.
  }
  window.dispatchEvent(new Event(TRIP_CHANGE_EVENT));
  return next.some((g) => g.path === path);
}
