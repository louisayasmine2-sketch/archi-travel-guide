// Shared "My Trip" profile for the travel-tools hub.
//
// The visitor describes their trip once (destination, nights, travellers,
// season) and every tool opens pre-filled from it, instead of each modal
// asking the same questions again. Stored in localStorage so the plan
// survives navigation and return visits. Purely client-side.

const STORAGE_KEY = "archi_trip_plan_v1";

export const TRIP_DESTINATIONS = ["Siena", "Tuscany"];
export const TRIP_SEASONS = ["spring", "summer", "autumn", "winter"];

export const DEFAULT_TRIP = {
  destination: "Siena",
  trip_length: 3,
  travelers: 2,
  season: "summer",
};

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
}
