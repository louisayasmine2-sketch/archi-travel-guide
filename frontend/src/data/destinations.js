// Curated destination + section data for Archi Travel Guide.
// Kept in one place so header, homepage and destination pages stay in sync.

export const destinations = [
  {
    slug: 'italy',
    name: 'Italy',
    region: 'Europe',
    tagline: 'Where the first editorial pillar lives',
    blurb: 'Rome to Venice, Tuscan hilltowns to the Amalfi coast — practical planning for every kind of traveler.',
    image: '/images/italy/budget-italy-itinerary-florence-rome-venice-hero.webp',
    featured: true,
  },
  {
    slug: 'tuscany',
    name: 'Tuscany',
    region: 'Italy',
    tagline: 'Rolling hills, medieval towns, slow food',
    blurb: 'Vineyards, Val d’Orcia road trips and hilltown itineraries designed to slow down without missing much.',
    image: '/images/tuscany/san-gimignano-medieval-towers.webp',
    featured: true,
  },
  {
    slug: 'siena',
    name: 'Siena',
    region: 'Tuscany',
    tagline: 'Medieval heart of Tuscany',
    blurb: 'Piazza del Campo, Contrada traditions and a two-day plan that fits families, couples and solo travelers.',
    image: '/images/siena/08-siena-cityscape.webp',
    featured: true,
  },
];

export const italyRegions = [
  { slug: 'tuscany', name: 'Tuscany', blurb: 'Countryside, wine and medieval hilltowns.', image: '/images/tuscany/chianti-wine-road-vineyard.webp' },
  { slug: 'siena', name: 'Siena', blurb: 'The medieval heart of Tuscany.', image: '/images/siena/08-siena-cityscape.webp' },
  { slug: 'florence', name: 'Florence', blurb: 'Renaissance capital, walkable centre.', image: '/images/tuscany/florence-piazzale-michelangelo-sunset.jpg' },
];

export const travelTools = [
  { slug: 'budget-calculator',    name: 'Trip Budget Calculator', blurb: 'Estimate low–high budgets by destination, party size and trip style.' },
  { slug: 'itinerary-generator',  name: 'Itinerary Generator',    blurb: 'Get a day-by-day plan tuned to your style, party and pace.' },
  { slug: 'area-finder',          name: 'Best Area to Stay Finder', blurb: 'Recommends the right neighborhood by budget, style and transport.' },
  { slug: 'packing-checklist',    name: 'Packing Checklist',      blurb: 'Season-aware checklist grouped by category, printable.' },
  { slug: 'best-time-to-visit',   name: 'Best Time to Visit',     blurb: 'Pick the right month based on weather, crowds, prices or festivals.' },
  { slug: 'transport-guide',      name: 'Airport & Transport Guide', blurb: 'How to move between airports, cities and hilltowns.' },
];
