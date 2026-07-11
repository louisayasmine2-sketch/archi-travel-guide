const getEnvUrl = (key) => {
  const value = process.env[key];
  return typeof value === "string" && value.trim().length > 0 ? value.trim() : null;
};

const resources = {
  sienaHotels: {
    id: "siena-hotels",
    category: "Hotels",
    partner: "Booking.com",
    title: "Compare Siena stays after choosing the right area",
    description:
      "Use this after reading the area guide so you compare hotels, B&Bs and apartments by location, not just price.",
    bestFor: "First-time Siena stays",
    ctaLabel: "Compare Siena stays",
    type: "hotel",
    href: getEnvUrl("REACT_APP_BOOKING_SIENA_URL"),
  },
  tuscanyTransport: {
    id: "tuscany-transport",
    category: "Transport",
    partner: "Omio / Trainline",
    title: "Check train and bus options before locking the itinerary",
    description:
      "Useful for Florence to Siena, airport connections and wider Tuscany route planning when timing matters.",
    bestFor: "Route decisions",
    ctaLabel: "Check transport options",
    type: "transport",
    href: getEnvUrl("REACT_APP_TRANSPORT_PARTNER_URL"),
  },
  sienaTours: {
    id: "siena-tours",
    category: "Tours",
    partner: "GetYourGuide",
    title: "Use a guided experience when logistics matter more than saving a few euros",
    description:
      "Good for first visits, food walks, wine routes and day trips where a local guide can reduce planning friction.",
    bestFor: "Guided day trips",
    ctaLabel: "Browse Siena tours",
    type: "tour",
    href: getEnvUrl("REACT_APP_TOURS_SIENA_URL"),
  },
  tuscanyExperiences: {
    id: "tuscany-experiences",
    category: "Experiences",
    partner: "Viator",
    title: "Compare food, wine and countryside experiences",
    description:
      "A useful second check for Chianti, San Gimignano and small-group Tuscany experiences from Siena or Florence.",
    bestFor: "Wine and countryside",
    ctaLabel: "Compare experiences",
    type: "tour",
    href: getEnvUrl("REACT_APP_VIATOR_TUSCANY_URL"),
  },
  italyEsim: {
    id: "italy-esim",
    category: "Connectivity",
    partner: "eSIM provider",
    title: "Set up mobile data before arrival",
    description:
      "Helpful for maps, train platforms, restaurant messages and check-in instructions without airport SIM stress.",
    bestFor: "Arrival day",
    ctaLabel: "Review eSIM options",
    type: "connectivity",
    href: getEnvUrl("REACT_APP_ESIM_PARTNER_URL"),
  },
};

const resourceSets = {
  "siena-travel-guide": ["sienaHotels", "tuscanyTransport", "sienaTours"],
  "siena-day-trip-from-florence": ["tuscanyTransport", "sienaTours", "tuscanyExperiences"],
  "where-to-stay-in-siena": ["sienaHotels", "tuscanyTransport", "italyEsim"],
  "siena-accommodation-guide": ["sienaHotels", "italyEsim", "sienaTours"],
  "travel-budget-calculator": ["sienaHotels", "tuscanyTransport", "tuscanyExperiences"],
  default: ["sienaHotels", "tuscanyTransport", "sienaTours"],
};

export function getAffiliateResources(context = "default") {
  const ids = resourceSets[context] || resourceSets.default;
  return ids.map((id) => resources[id]).filter((resource) => resource?.href);
}
