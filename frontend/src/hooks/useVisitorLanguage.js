import { useEffect, useState } from "react";
import { BANNER_STRINGS, isDismissalActive, pickLanguage } from "@/lib/geoLanguage";

const DISMISS_KEY = "archi_lang_banner_dismissed";
const COUNTRY_CACHE_KEY = "archi_geo_country";
const GEO_TIMEOUT_MS = 3000;

// Fetch the visitor's country from the /api/geo edge function. Returns the
// ISO code, or null when the function is unavailable (local dev, timeouts,
// non-Cloudflare hosting) — the caller then falls back to browser language.
async function fetchCountry() {
  try {
    const cached = sessionStorage.getItem(COUNTRY_CACHE_KEY);
    if (cached) return cached === "none" ? null : cached;
  } catch (_) { /* ignore */ }

  let country = null;
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), GEO_TIMEOUT_MS);
    const res = await fetch("/api/geo", { signal: controller.signal });
    clearTimeout(timer);
    // The CRA dev server answers unknown paths with index.html, so a 200 is
    // not enough — it must actually be JSON.
    if (res.ok && (res.headers.get("content-type") || "").includes("application/json")) {
      const data = await res.json();
      if (typeof data.country === "string" && /^[A-Z]{2}$/.test(data.country)) {
        country = data.country;
      }
    }
  } catch (_) { /* offline, aborted, or no edge function — fall back */ }

  try {
    sessionStorage.setItem(COUNTRY_CACHE_KEY, country || "none");
  } catch (_) { /* ignore */ }
  return country;
}

// Suggests a language for the visitor based on the country their IP resolves
// to (browser language as fallback). Returns { suggestion, dismiss }, where
// suggestion is { lang, strings } or null. A dismissal holds for
// DISMISS_TTL_MS, after which the suggestion may appear once more.
export default function useVisitorLanguage() {
  const [suggestion, setSuggestion] = useState(null);

  useEffect(() => {
    try {
      if (isDismissalActive(localStorage.getItem(DISMISS_KEY))) return;
    } catch (_) { /* ignore */ }

    let cancelled = false;
    (async () => {
      const country = await fetchCountry();
      if (cancelled) return;
      const browserLanguages =
        (typeof navigator !== "undefined" &&
          (navigator.languages || [navigator.language])) || [];
      const lang = pickLanguage(country, browserLanguages);
      if (lang && BANNER_STRINGS[lang]) {
        setSuggestion({ lang, strings: BANNER_STRINGS[lang] });
      }
    })();

    return () => { cancelled = true; };
  }, []);

  const dismiss = () => {
    try { localStorage.setItem(DISMISS_KEY, String(Date.now())); } catch (_) { /* ignore */ }
    setSuggestion(null);
  };

  return { suggestion, dismiss };
}
