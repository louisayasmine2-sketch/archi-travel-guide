// Curated destination + section data for Archi Travel Guide.
// Kept in one place so header, homepage and destination pages stay in sync.

export const destinations = [
  {
    slug: 'italy',
    name: 'Italy',
    region: 'Europe',
    tagline: 'Where the first editorial pillar lives',
    blurb: 'Rome to Venice, Tuscan hilltowns to the Amalfi coast — practical planning for every kind of traveler.',
    image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=1600&q=75',
    featured: true,
  },
  {
    slug: 'tuscany',
    name: 'Tuscany',
    region: 'Italy',
    tagline: 'Rolling hills, medieval towns, slow food',
    blurb: 'Vineyards, Val d’Orcia road trips and hilltown itineraries designed to slow down without missing much.',
    image: 'https://images.unsplash.com/photo-1761995912965-8f134652fc6e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzV8MHwxfHNlYXJjaHwyfHx0dXNjYW55JTIwcm9sbGluZyUyMGhpbGxzJTIwc3VucmlzZXxlbnwwfHx8fDE3ODMwMDQ0ODZ8MA&ixlib=rb-4.1.0&q=85',
    featured: true,
  },
  {
    slug: 'siena',
    name: 'Siena',
    region: 'Tuscany',
    tagline: 'Medieval heart of Tuscany',
    blurb: 'Piazza del Campo, Contrada traditions and a two-day plan that fits families, couples and solo travelers.',
    image: 'https://images.unsplash.com/photo-1646319514161-8fba0ebc3275?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NTYxOTJ8MHwxfHNlYXJjaHwyfHxzaWVuYSUyMGl0YWx5JTIwYXJjaGl0ZWN0dXJlfGVufDB8fHx8MTc4MzAwNDQ4Nnww&ixlib=rb-4.1.0&q=85',
    featured: true,
  },
];

export const italyRegions = [
  { slug: 'tuscany', name: 'Tuscany', blurb: 'Countryside, wine and medieval hilltowns.', image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=75' },
  { slug: 'siena', name: 'Siena', blurb: 'The medieval heart of Tuscany.', image: 'https://images.unsplash.com/photo-1646319514161-8fba0ebc3275?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NTYxOTJ8MHwxfHNlYXJjaHwyfHxzaWVuYSUyMGl0YWx5JTIwYXJjaGl0ZWN0dXJlfGVufDB8fHx8MTc4MzAwNDQ4Nnww&ixlib=rb-4.1.0&q=85' },
  { slug: 'florence', name: 'Florence', blurb: 'Renaissance capital, walkable centre.', image: 'https://images.unsplash.com/photo-1534445867742-43195f401b6c?auto=format&fit=crop&w=1200&q=75' },
];

export const travelTools = [
  { slug: 'budget-calculator',    name: 'Trip Budget Calculator', blurb: 'Estimate low–high budgets by destination, party size and trip style.' },
  { slug: 'itinerary-generator',  name: 'Itinerary Generator',    blurb: 'Get a day-by-day plan tuned to your style, party and pace.' },
  { slug: 'area-finder',          name: 'Best Area to Stay Finder', blurb: 'Recommends the right neighborhood by budget, style and transport.' },
  { slug: 'packing-checklist',    name: 'Packing Checklist',      blurb: 'Season-aware checklist grouped by category, printable.' },
  { slug: 'best-time-to-visit',   name: 'Best Time to Visit',     blurb: 'Pick the right month based on weather, crowds, prices or festivals.' },
  { slug: 'transport-guide',      name: 'Airport & Transport Guide', blurb: 'How to move between airports, cities and hilltowns.' },
];
