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
