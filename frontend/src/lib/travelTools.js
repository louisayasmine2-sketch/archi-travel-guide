// Client-side travel-tool logic.
//
// These five functions are a faithful port of the pure-computation endpoints
// that used to live in backend/server.py (/api/tools/*). They take no server,
// no database and no secret — just tables and arithmetic — so running them in
// the browser removes the Render cold-start wait (~21s) that a visitor hit when
// they were first to use a tool after an idle period. Each function returns the
// exact same shape the backend returned, so the tool components are drop-in.
//
// Ported verbatim from server.py; if the numbers or copy change, change them
// here (the backend endpoints no longer exist).

// Python round() uses banker's rounding (round half to even). Match it so the
// numbers are identical to what the server produced. Inputs here are always >= 0.
function pyRound(x, ndigits) {
  const scale = Math.pow(10, Math.abs(ndigits));
  const y = ndigits >= 0 ? x * scale : x / scale;
  const floor = Math.floor(y);
  const diff = y - floor;
  const EPS = 1e-9;
  let n;
  if (diff > 0.5 + EPS) n = floor + 1;
  else if (diff < 0.5 - EPS) n = floor;
  else n = floor % 2 === 0 ? floor : floor + 1; // exactly halfway -> even
  return ndigits >= 0 ? n / scale : n * scale;
}

// Python str.title(): capitalise the first letter of each run of letters.
function pyTitle(s) {
  return String(s).replace(/[A-Za-z]+/g, (w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase());
}

// ---------- Budget Calculator ----------

const BUDGET_RATES = {
  italy:   { food: { street: 20, casual: 45, fine: 110 }, stay: { budget: 45, mid: 130, luxury: 320 }, trans: { public: 12, mixed: 30, private: 70 }, act: { light: 10, moderate: 30, packed: 65 } },
  tuscany: { food: { street: 22, casual: 50, fine: 120 }, stay: { budget: 55, mid: 145, luxury: 360 }, trans: { public: 14, mixed: 35, private: 85 }, act: { light: 10, moderate: 35, packed: 75 } },
  siena:   { food: { street: 18, casual: 42, fine: 105 }, stay: { budget: 50, mid: 125, luxury: 300 }, trans: { public: 8,  mixed: 22, private: 60 }, act: { light: 8,  moderate: 28, packed: 60 } },
  europe:  { food: { street: 22, casual: 48, fine: 115 }, stay: { budget: 55, mid: 140, luxury: 340 }, trans: { public: 14, mixed: 32, private: 75 }, act: { light: 12, moderate: 32, packed: 70 } },
  asia:    { food: { street: 8,  casual: 22, fine: 65 },  stay: { budget: 22, mid: 75,  luxury: 220 }, trans: { public: 5,  mixed: 15, private: 45 }, act: { light: 8,  moderate: 22, packed: 55 } },
  global:  { food: { street: 18, casual: 42, fine: 100 }, stay: { budget: 45, mid: 120, luxury: 300 }, trans: { public: 12, mixed: 28, private: 70 }, act: { light: 10, moderate: 28, packed: 60 } },
};

function rateBucket(destination) {
  const key = (destination || "").trim().toLowerCase();
  for (const k of Object.keys(BUDGET_RATES)) {
    if (key.includes(k)) return BUDGET_RATES[k];
  }
  return BUDGET_RATES.global;
}

export function budgetCalculator(payload) {
  const rates = rateBucket(payload.destination);
  const perPersonDay =
    rates.food[payload.food_level] +
    (rates.stay[payload.accommodation_level] / Math.max(payload.travelers, 1)) * 1.6 +
    rates.trans[payload.transport_type] +
    rates.act[payload.activities_level];
  const baseTotal = perPersonDay * payload.travelers * payload.trip_length;
  const low = pyRound(baseTotal * 0.9, -1);
  const high = pyRound(baseTotal * 1.25, -1);
  const tips = [
    "Book accommodation 6–8 weeks ahead for the best rates.",
    "Mix casual meals with one memorable dinner per 2–3 days to control food costs.",
    "Use regional trains and buses — they’re reliable and up to 60% cheaper than taxis.",
  ];
  if (payload.accommodation_level === "luxury") {
    tips.push("Consider one 'showcase' hotel night and mid-range for the rest — same trip, ~30% lower cost.");
  }
  if (payload.activities_level === "packed") {
    tips.push("Buy city passes or bundled tickets — they typically save 15–25% on top attractions.");
  }
  return {
    currency: "USD",
    per_person_per_day: pyRound(perPersonDay, 2),
    estimated_low: Math.trunc(low),
    estimated_high: Math.trunc(high),
    tips,
  };
}

// ---------- Itinerary Generator ----------

const ITIN_TEMPLATES = {
  siena: [
    ["Piazza del Campo & Palazzo Pubblico", "Torre del Mangia climb", "Aperitivo on Piazza del Campo"],
    ["Siena Cathedral & Piccolomini Library", "Museo dell’Opera & Panorama dal Facciatone", "Dinner in Terzo di Città"],
    ["Contrada walking tour", "Pinacoteca Nazionale", "Dinner near Fontebranda"],
    ["Day trip: San Gimignano & Monteriggioni", "Return to Siena", "Evening walk"],
    ["Day trip: Val d’Orcia (Pienza, Montalcino)", "Wine tasting", "Dinner in the countryside"],
  ],
  tuscany: [
    ["Florence: Duomo, Uffizi highlights", "Ponte Vecchio walk", "Dinner in Oltrarno"],
    ["Siena: Piazza del Campo, Duomo", "Walk through Terzo di Città", "Dinner"],
    ["Val d’Orcia road trip", "Pienza & Montalcino", "Brunello tasting"],
    ["San Gimignano & Volterra", "Etruscan sites", "Dinner at an agriturismo"],
    ["Chianti wine route", "Castello tour", "Vineyard picnic"],
  ],
};

// Destinations offered by the itinerary form. Only those with a real template
// appear; `days` is that template's distinct-day count, which the form uses to
// cap trip length so the plan is never padded past the content that exists.
export const ITINERARY_DESTINATIONS = [
  { value: "Siena", label: "Siena", days: ITIN_TEMPLATES.siena.length },
  { value: "Tuscany", label: "Tuscany", days: ITIN_TEMPLATES.tuscany.length },
];

// Operational notes attach to a plan item when a verified rule changes how a
// visitor should plan around it. Each carries the date it was checked (per
// CLAUDE.md §1). `match` is a landmark name that appears verbatim in a template
// item, so a note shows only when that item is actually in the generated plan.
// Sources (checked 20 July 2026): Torre del Mangia — Comune di Siena / Musei
// Civici; Cathedral & OPA SI Pass — operaduomo.siena.it and VisitTuscany
// (pass validity confirmed; current price to be read off the official site);
// Palio — Comune di Siena. Prices/dates are deliberately not hard-coded where
// they could not be confirmed on a primary source this session.
const OPERATIONAL_NOTES = [
  {
    match: "Torre del Mangia",
    checked: "20 July 2026",
    text: "Tickets are sold same day only, in person at the Palazzo Pubblico — they cannot be reserved in advance, capacity is limited, and the climb goes up in small timed groups. Buy in the morning.",
  },
  {
    match: "Siena Cathedral",
    checked: "20 July 2026",
    text: "The marble floor is uncovered only during scheduled periods each year — check the Opera Duomo calendar before fixing your date. Entry is via the OPA SI Pass, valid three consecutive days; it costs more during floor-uncovering periods, so check the current price on the official Opera Duomo site.",
  },
  {
    match: "Piazza del Campo",
    checked: "20 July 2026",
    text: "The Palio runs on 2 July and 16 August; trial races fill the days immediately before each, when the Campo is fenced for the track and the city is at its busiest. Check the official Palio calendar if your dates fall near these.",
  },
];

// A factual summary of what the generated plan actually covers — the distinct
// morning stops, in order. No tone, mood or party framing.
function buildItinerarySummary(destination, days) {
  const stops = [];
  for (const d of days) {
    if (!stops.includes(d.morning)) stops.push(d.morning);
  }
  return `A ${days.length}-day outline for ${destination}, structured morning, afternoon and evening. Main stops: ${stops.join("; ")}.`;
}

export function itineraryGenerator(payload) {
  // Exact-match only: destination must be one of the templates. There is no
  // default/fallback — an unsupported destination should not be offered by the
  // form, so it returns an empty plan rather than generic filler under its name.
  const key = (payload.destination || "").trim().toLowerCase();
  const template = ITIN_TEMPLATES[key];
  if (!template) {
    return { destination: payload.destination, trip_length: 0, summary: "", days: [] };
  }
  // Cap at the number of distinct days the template actually has — never repeat
  // a shorter template to fill a longer request.
  const dayCount = Math.max(1, Math.min(Number(payload.trip_length) || 1, template.length));
  const days = [];
  for (let i = 0; i < dayCount; i++) {
    const base = template[i];
    const items = [base[0], base[1], base[2]];
    const notes = OPERATIONAL_NOTES
      .filter((n) => items.some((item) => item.includes(n.match)))
      .map((n) => ({ text: n.text, checked: n.checked }));
    days.push({ day: i + 1, morning: base[0], afternoon: base[1], evening: base[2], notes });
  }
  return {
    destination: payload.destination,
    trip_length: dayCount,
    summary: buildItinerarySummary(payload.destination, days),
    days,
  };
}

// ---------- Area Finder ----------

const AREA_MAP = {
  siena: {
    walk_family:    ["Terzo di Città", "Quiet, elegant streets steps from the Duomo and Piazza del Campo — the calmest of the three terzi."],
    walk_night:     ["Terzo di San Martino", "Lively enotecas, walkable to the Campo, great for evening passeggiata."],
    public_default: ["Near Porta Camollia", "Just outside the historic core with easy access to buses and the train station."],
    default:        ["Terzo di Camollia", "Best mix of authentic residential feel, affordable stays, and short walks into the centre."],
  },
  florence: {
    walk_default: ["Santa Croce", "Central, walkable, packed with trattorias yet quieter than the Duomo area."],
    night:        ["Santo Spirito (Oltrarno)", "Artisan workshops by day, buzzing wine bars by night."],
    family:       ["San Marco", "Green squares, museums, and easy tram access to the outskirts."],
    default:      ["Santa Maria Novella", "Practical base near the train station with a growing food scene."],
  },
  rome: {
    walk_default: ["Monti", "Cobbled lanes, indie cafés, walking distance to the Forum and Colosseum."],
    family:       ["Prati", "Wide sidewalks, grocery stores, and safe streets near the Vatican."],
    night:        ["Trastevere", "The classic evening neighborhood — pick a side street for lower noise."],
    default:      ["Centro Storico", "The heart of Rome; you’ll walk to nearly everything."],
  },
};

const AREA_BUDGET_NOTE = {
  budget: "Look at guesthouses and B&Bs on the edge of this area for 25–40% lower rates.",
  mid: "Boutique 3–4★ hotels here offer the best value.",
  luxury: "Small design hotels and historic residences in this area punch well above chains.",
};

export function areaFinder(payload) {
  const dest = (payload.destination || "").trim().toLowerCase();
  let city = null;
  for (const k of Object.keys(AREA_MAP)) {
    if (dest.includes(k)) {
      city = k;
      break;
    }
  }
  if (!city) {
    return {
      destination: payload.destination,
      recommended_area: "Historic Centre",
      why: "For most cities we recommend staying near the historic centre for a first visit — you’ll cut transport time and see more on foot. Look for streets 5–10 minutes off the main square to avoid noise.",
      runner_up: "Neighborhood One Metro/Bus Ring Out",
      runner_up_why: "Quieter and 20–35% cheaper, still 15–20 minutes to the main sights.",
    };
  }

  const m = AREA_MAP[city];
  // priority: family > nightlife > walkability
  let key = "default";
  if (payload.family && "family" in m) key = "family";
  else if (payload.nightlife === "high" && "night" in m) key = "night";
  else if (payload.transport_preference === "walk" && "walk_default" in m) key = "walk_default";
  else if (payload.transport_preference === "walk" && "walk_family" in m && payload.family) key = "walk_family";
  else if (payload.transport_preference === "public" && "public_default" in m) key = "public_default";

  const [area, why] = m[key];
  return {
    destination: pyTitle(payload.destination),
    recommended_area: area,
    why,
    budget_note: AREA_BUDGET_NOTE[payload.budget],
  };
}

// ---------- Packing Checklist ----------

const PACKING = {
  spring: {
    clothing: ["Light layers", "Waterproof jacket", "Comfortable walking shoes", "1 warm sweater", "Scarf for churches"],
    weather: ["Compact umbrella", "Sunglasses", "SPF 30 sunscreen"],
  },
  summer: {
    clothing: ["Breathable T-shirts", "Linen shirt or blouse", "Walking sandals", "Light cardigan for evenings", "Modest cover-up for churches"],
    weather: ["Wide-brim hat", "Sunglasses", "SPF 50 sunscreen", "Refillable water bottle"],
  },
  autumn: {
    clothing: ["Layered tops", "Light wool sweater", "Waterproof shoes", "Rain jacket", "Scarf"],
    weather: ["Compact umbrella", "Sunglasses", "SPF 30"],
  },
  winter: {
    clothing: ["Warm coat", "Thermal base layer", "Waterproof boots", "Gloves & beanie", "Wool scarf"],
    weather: ["Compact umbrella", "SPF 30", "Lip balm"],
  },
};

export function packingChecklist(payload) {
  const base = PACKING[payload.season];
  const categories = {
    Clothing: [...base.clothing],
    "Weather & Sun": [...base.weather],
    Documents: ["Passport / ID", "Printed hotel confirmations", "Travel insurance card", "Credit card + backup card", "Local currency (small notes)"],
    Tech: ["Phone + charger", "EU adapter", "Portable power bank", "Headphones", "Offline maps downloaded"],
    "Health & Personal": ["Prescription meds (in original packaging)", "Small first-aid kit", "Reusable water bottle", "Hand sanitiser", "Personal toiletries"],
    "Smart Extras": ["Foldable daypack", "Packing cubes", "Microfiber travel towel", "Notebook + pen", "Snack bars for long transit days"],
  };
  if (payload.trip_length >= 7) categories["Smart Extras"].push("Laundry sheets or small detergent");
  if (payload.trip_length >= 14) categories["Smart Extras"].push("Compression bag for dirty laundry");
  return { season: payload.season, trip_length: payload.trip_length, categories };
}

// ---------- Best Time to Visit ----------

const BEST_TIME = {
  italy: {
    good_weather: ["May–June, September", "Warm days, manageable crowds, produce at its peak."],
    low_crowds: ["Late October–March (excl. Christmas)", "Cool but very quiet; ideal for museums and cities."],
    low_prices: ["November & February", "Best flight and hotel rates outside holidays."],
    festivals: ["July (Palio), August (Ferragosto), December (markets)", "Iconic events, but book months ahead."],
  },
  tuscany: {
    good_weather: ["May, June, September", "Perfect countryside light and mild days."],
    low_crowds: ["March–April, mid-October", "Vineyards and hilltowns feel local again."],
    low_prices: ["November–March", "Agriturismos discount 30–50%."],
    festivals: ["Late September (harvest), Palio in Siena on Jul 2 & Aug 16", "Book stays 4–6 months ahead."],
  },
  siena: {
    good_weather: ["May, June, September", "T-shirt days, cool evenings."],
    low_crowds: ["Late Feb–March, November", "The Campo returns to locals."],
    low_prices: ["Nov–March (excl. Palio)", "Family-run hotels drop rates significantly."],
    festivals: ["Palio: July 2 & August 16", "Book 6–9 months ahead; standing room in the Campo is free."],
  },
  europe: {
    good_weather: ["May–September", "Long daylight, café terraces open."],
    low_crowds: ["October–March", "Fewer queues at major sites."],
    low_prices: ["Late January–February, November", "Best hotel rates outside holidays."],
    festivals: ["Christmas markets (Dec), Carnival (Feb–Mar), summer festivals (Jun–Aug)", ""],
  },
  asia: {
    good_weather: ["November–February", "Dry season for most of SE Asia."],
    low_crowds: ["May–early June, September", "Shoulder months with better rates."],
    low_prices: ["May–September (shoulder)", "Rain risk but sharp discounts."],
    festivals: ["Lunar New Year (Jan–Feb), Songkran (Apr), Diwali (Oct–Nov)", ""],
  },
};

export function bestTime(payload) {
  const dest = (payload.destination || "").trim().toLowerCase();
  let bucket = null;
  for (const k of Object.keys(BEST_TIME)) {
    if (dest.includes(k)) {
      bucket = BEST_TIME[k];
      break;
    }
  }
  if (!bucket) bucket = BEST_TIME.europe;
  const [months, note] = bucket[payload.preference];
  return { destination: payload.destination, preference: payload.preference, months, note };
}
