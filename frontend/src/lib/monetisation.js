// Partner routing for the /go/ redirect layer.
//
// One rule holds this file together: article prose never carries a commercial
// link. Partners are resolved from an article's category and slug and rendered
// by <PartnerCta>, so when a programme is approved we change the destination in
// public/_redirects and the status below — never 72 article bodies.
//
// PROGRAMME_STATUS is the switch described in CLAUDE.md §2. While it reads
// "pending", every /go/ slug resolves to the platform's own site, outbound
// links carry rel="nofollow", and the block shows an independence note. On the
// day tracking goes live, flip it to "live" — the same day the _redirects
// destinations gain their partner parameters — and the note becomes a
// disclosure with rel="sponsored".
export const PROGRAMME_STATUS = "pending";

export const isProgrammeLive = PROGRAMME_STATUS === "live";

export const partnerRel = isProgrammeLive
  ? "sponsored noopener noreferrer"
  : "nofollow noopener noreferrer";

// Every slug here must exist in frontend/public/_redirects — the link checker
// fails the build's audit otherwise. Descriptions say what the platform does
// and what it costs the reader in attention; none of them states a price,
// because no price on these platforms has been verified.
const PARTNERS = {
  booking: {
    id: "booking",
    slug: "/go/booking",
    name: "Booking.com",
    kind: "Accommodation",
    solves: "Compare what each Siena neighbourhood actually costs before you pick a property",
    caveat:
      "Filter by area first — a room inside the walls buys atmosphere and steps; Camollia and the station area buy easier luggage access. Check the property's own site too, as direct rates and cancellation terms sometimes differ from the listing.",
  },
  getyourguide: {
    id: "getyourguide",
    slug: "/go/getyourguide",
    name: "GetYourGuide",
    kind: "Tours and tickets",
    solves: "Hold a timed entry or a guided walk before the date sells out",
    caveat:
      "Listings are run by independent operators. Read the operator name, the group size and the cancellation window before booking — official attraction sites remain the primary source for opening hours and ticket rules.",
  },
  viator: {
    id: "viator",
    slug: "/go/viator",
    name: "Viator",
    kind: "Tours and tickets",
    solves: "Cross-check a tour's price and availability against a second marketplace",
    caveat:
      "The same operator often lists on more than one platform at different prices. Compare both before booking, and check who actually runs the tour.",
  },
  omio: {
    id: "omio",
    slug: "/go/omio",
    name: "Omio",
    kind: "Transport",
    solves: "See trains, buses and coaches for the same route in one list",
    caveat:
      "Confirm times against the operator's own timetable before you rely on them — regional services in Tuscany thin out on Sundays and public holidays.",
  },
  trainline: {
    id: "trainline",
    slug: "/go/trainline",
    name: "Trainline",
    kind: "Transport",
    solves: "Book Italian rail legs without an Italian payment card or phone number",
    caveat:
      "Fares mirror the operator's own; the convenience is the checkout, not the price. Regional tickets in Tuscany are flat-fare and can be bought at the station just as easily.",
  },
  airalo: {
    id: "airalo",
    slug: "/go/airalo",
    name: "Airalo",
    kind: "Connectivity",
    solves: "Have working data the moment you land, without a roaming bill",
    caveat:
      "Check your handset supports eSIM and is carrier-unlocked before buying — plans are not refundable once installed.",
  },
};

// Intent groups, most specific first. An article matches on its slug or its
// category; the first two groups that match supply the block. Two is the cap —
// a third link turns an editorial page into a link farm and reads as one.
const RULES = [
  {
    partners: ["booking"],
    categories: ["Where to stay"],
    slugPattern: /where-to-stay|hotels?|apartment|accommodation|no-ac|ferragosto/,
  },
  {
    partners: ["getyourguide", "viator"],
    categories: ["Things to do"],
    slugPattern:
      /tours?|classes|things-to-do|walking|palio|cathedral|torre-del-mangia|piazza-del-campo|santa-maria-della-scala|contrade|film-locations|via-francigena|wine-harvest|olive-harvest|puccini|hidden-gems/,
  },
  {
    partners: ["omio", "trainline"],
    categories: ["Transport"],
    slugPattern:
      /train|bus|transfer|airport|parking|without-a-car|florence-to-siena|rome-to-siena|ztl|strikes/,
  },
  {
    partners: ["omio", "getyourguide"],
    categories: ["Day trips"],
    slugPattern: /day-trip|day-trips|which-to-visit|or-san-gimignano|val-dorcia/,
  },
  {
    partners: ["booking", "getyourguide"],
    categories: ["Itineraries"],
    slugPattern: /itinerary|weekend|one-day|\d-day/,
  },
  {
    partners: ["booking", "getyourguide"],
    categories: ["Family travel"],
    slugPattern: /with-kids|family/,
  },
  {
    // Month guides ("Tuscany in October 2026"). The reader is choosing when to
    // travel, which is the decision immediately before choosing where to sleep.
    partners: ["booking"],
    categories: [],
    slugPattern:
      /-in-(january|february|march|april|may|june|july|august|september|october|november|december)-\d{4}/,
  },
  {
    partners: ["airalo"],
    categories: ["Packing"],
    slugPattern: /packing|what-to-pack|entry-requirements|beach-rules/,
  },
];

const MAX_PARTNERS = 2;

/**
 * Resolve which partners belong on an article. Returns [] when nothing matches,
 * which is the correct outcome for food, budget and seasonal explainers — those
 * readers are not at a booking decision, and a CTA there is noise.
 */
export const partnersForArticle = (article) => {
  if (!article) return [];

  // articles.js entries carry `slug`; the Siena cluster JSON carries `route`.
  const slug = String(article.slug || article.route || "").toLowerCase();
  const category = article.category || "";
  const picked = [];

  for (const rule of RULES) {
    const matches =
      rule.categories.includes(category) || (slug && rule.slugPattern.test(slug));
    if (!matches) continue;

    for (const id of rule.partners) {
      if (!picked.includes(id)) picked.push(id);
    }
  }

  return picked.slice(0, MAX_PARTNERS).map((id) => PARTNERS[id]);
};

export const getPartner = (id) => PARTNERS[id];

export default PARTNERS;
