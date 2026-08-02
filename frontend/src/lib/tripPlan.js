// Shared "My Trip" profile for the travel-tools hub.
//
// The visitor describes their trip once (destination, nights, travellers,
// season, optional start date) and every tool opens pre-filled from it,
// instead of each modal asking the same questions again. Stored in
// localStorage so the plan survives navigation and return visits. Purely
// client-side.

const STORAGE_KEY = "archi_trip_plan_v1";

export const TRIP_DESTINATIONS = ["Siena", "Tuscany"];
export const TRIP_SEASONS = ["spring", "summer", "autumn", "winter"];

export const DEFAULT_TRIP = {
  destination: "Siena",
  trip_length: 3,
  travelers: 2,
  season: "summer",
  start_date: "", // optional "YYYY-MM-DD"; empty = not set
};

// Fired on every plan/progress write so the header chip and the hub bar
// stay in sync without prop-drilling across the layout.
export const TRIP_CHANGE_EVENT = "archi:trip-change";

export function notifyTripChange() {
  try {
    window.dispatchEvent(new Event(TRIP_CHANGE_EVENT));
  } catch {
    // No window (prerender) — nothing to notify.
  }
}

function validDate(s) {
  return typeof s === "string" && /^\d{4}-\d{2}-\d{2}$/.test(s) && !isNaN(new Date(`${s}T00:00:00`).getTime());
}

// True once the visitor has actually saved a plan (vs. the defaults).
export function hasTripPlan() {
  try {
    return localStorage.getItem(STORAGE_KEY) !== null;
  } catch {
    return false;
  }
}

export function loadTripPlan() {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
    if (!parsed || typeof parsed !== "object") return { ...DEFAULT_TRIP };
    return {
      destination: TRIP_DESTINATIONS.includes(parsed.destination) ? parsed.destination : DEFAULT_TRIP.destination,
      trip_length: Number.isInteger(parsed.trip_length) && parsed.trip_length >= 1 && parsed.trip_length <= 60
        ? parsed.trip_length : DEFAULT_TRIP.trip_length,
      travelers: Number.isInteger(parsed.travelers) && parsed.travelers >= 1 && parsed.travelers <= 20
        ? parsed.travelers : DEFAULT_TRIP.travelers,
      season: TRIP_SEASONS.includes(parsed.season) ? parsed.season : DEFAULT_TRIP.season,
      start_date: validDate(parsed.start_date) ? parsed.start_date : "",
    };
  } catch {
    return { ...DEFAULT_TRIP };
  }
}

export function saveTripPlan(plan) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(plan));
  } catch {
    // Storage blocked or full — the hub state still works for this visit.
  }
  notifyTripChange();
}

// Whole days from today (local midnight) to the trip's start date.
// null when no valid date is set; negative once the date has passed.
export function daysUntilTrip(plan) {
  if (!validDate(plan.start_date)) return null;
  const start = new Date(`${plan.start_date}T00:00:00`);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return Math.round((start - today) / 86400000);
}

// Verified Palio facts — text copied verbatim from the operational note in
// lib/travelTools.js, which carries its checked date (per CLAUDE.md §1).
export const PALIO_NOTE = {
  checked: "20 July 2026",
  text: "The Palio runs on 2 July and 16 August; trial races fill the days immediately before each, when the Campo is fenced for the track and the city is at its busiest. Check the official Palio calendar if your dates fall near these.",
};

// True when the trip window (start date + nights) contains 2 July or
// 16 August. Only meaningful for Siena/Tuscany plans, which is all this
// profile allows.
export function tripOverlapsPalio(plan) {
  if (!validDate(plan.start_date)) return false;
  const start = new Date(`${plan.start_date}T00:00:00`);
  const end = new Date(start.getTime() + plan.trip_length * 86400000);
  for (const year of [start.getFullYear(), end.getFullYear()]) {
    for (const palio of [new Date(year, 6, 2), new Date(year, 7, 16)]) {
      if (palio >= start && palio <= end) return true;
    }
  }
  return false;
}

// ---------------------------------------------------------------------------
// Budget style preferences — the levels last used in the Budget Planner, so
// the Trip Sheet estimates with the visitor's actual travel style instead of
// hard-coded defaults.
// ---------------------------------------------------------------------------

const BUDGET_PREFS_KEY = "archi_budget_prefs_v1";

export const DEFAULT_BUDGET_PREFS = {
  accommodation_level: "mid",
  food_level: "casual",
  transport_type: "public",
  activities_level: "moderate",
};

export function loadBudgetPrefs() {
  try {
    const parsed = JSON.parse(localStorage.getItem(BUDGET_PREFS_KEY) || "null");
    if (!parsed || typeof parsed !== "object") return { ...DEFAULT_BUDGET_PREFS };
    const pick = (key, allowed) => (allowed.includes(parsed[key]) ? parsed[key] : DEFAULT_BUDGET_PREFS[key]);
    return {
      accommodation_level: pick("accommodation_level", ["budget", "mid", "luxury"]),
      food_level: pick("food_level", ["street", "casual", "fine"]),
      transport_type: pick("transport_type", ["public", "mixed", "private"]),
      activities_level: pick("activities_level", ["light", "moderate", "packed"]),
    };
  } catch {
    return { ...DEFAULT_BUDGET_PREFS };
  }
}

export function saveBudgetPrefs(prefs) {
  try {
    localStorage.setItem(BUDGET_PREFS_KEY, JSON.stringify(prefs));
  } catch { /* storage blocked — the sheet falls back to defaults */ }
  notifyTripChange();
}

// ---------------------------------------------------------------------------
// Planning progress — which tools the visitor has already used.
// ---------------------------------------------------------------------------

const DONE_KEYS = { itinerary: "archi_itinerary_done_v1", budget: "archi_budget_done_v1" };

export function markToolDone(tool) {
  const key = DONE_KEYS[tool];
  if (!key) return;
  try {
    localStorage.setItem(key, "1");
  } catch { /* storage blocked — progress is cosmetic */ }
  notifyTripChange();
}

export function loadTripProgress() {
  const read = (k) => {
    try {
      return JSON.parse(localStorage.getItem(k) || "null");
    } catch {
      return null;
    }
  };
  const has = (k) => {
    try {
      return localStorage.getItem(k) !== null;
    } catch {
      return false;
    }
  };
  const packing = read("archi_packing_list_v1");
  return {
    planSet: hasTripPlan(),
    itineraryDone: has(DONE_KEYS.itinerary),
    budgetDone: has(DONE_KEYS.budget),
    packing: packing?.result?.categories
      ? {
          done: Array.isArray(packing.checked) ? packing.checked.length : 0,
          total: Object.values(packing.result.categories).reduce((n, items) => n + items.length, 0),
        }
      : null,
  };
}
