// Editorial city landing page — Florence.
// Real destination content structured with the SEO/article-friendly sections:
// overview, best time, where to stay, transport, itinerary ideas, budget,
// related guides. Not thin filler.

export const cities = {
  florence: {
    slug: 'florence',
    name: 'Florence',
    region: 'Tuscany',
    country: 'Italy',
    tagline: 'Renaissance capital, walkable centre',
    metaTitle: 'Florence Travel Guide — What to see, where to stay, when to go',
    metaDescription: 'A practical Florence travel guide: what to prioritise on a first visit, the best area to stay, honest itinerary lengths, transport tips, and realistic costs.',
    hero: 'https://images.unsplash.com/photo-1534445867742-43195f401b6c?auto=format&fit=crop&w=2000&q=75',
    overview:
      'Florence is dense. Its historic core fits inside a walk of about 40 minutes, and the great sights — the Duomo, the Uffizi, the Ponte Vecchio — sit almost on top of each other. That density is a gift and a warning: two days is enough to see the icons, but you will not truly know the city on a two-day trip.',
    overview2:
      'Our recommendation for a first visit: three nights. That unlocks one museum-heavy day, one slow walking day, and one day for the Oltrarno — the quieter, more residential south bank where locals still outnumber tourists.',
    bestTime: {
      good: 'May and September — mild days, longer light and the crowds settle just enough.',
      avoid: 'Mid-July to mid-August. The heat is real, and the queues around the Duomo double.',
      quiet: 'February and early November are surprisingly good — cool but crisp, and museum tickets go on sale.',
    },
    whereToStay: [
      { name: 'Santa Croce', why: 'Central, walkable, packed with trattorias yet quieter than the Duomo area at night.' },
      { name: 'Santo Spirito (Oltrarno)', why: 'Artisan workshops by day, buzzing wine bars by night. Our favourite base.' },
      { name: 'San Marco', why: 'Green squares, tram access, and safer nights — great with kids.' },
      { name: 'Santa Maria Novella', why: 'Best if you arrive late by train. Skip if you value quiet streets.' },
    ],
    transport: [
      'From FLR airport: tram T2 to the historic centre in ~20 minutes. Cheap and reliable.',
      'From PSA airport: PisaMover + regional train to Florence Santa Maria Novella (~1h20m).',
      'From Rome: Frecciarossa or Italo high-speed train, 1h30m. Book 3–6 weeks ahead for the best fare.',
      'Inside the city: walk everything. The ZTL keeps cars out; buses are handy only for a few outer neighborhoods.',
    ],
    itineraryIdeas: [
      { title: 'A dense first day', body: 'Duomo climb early, Baptistery, then Uffizi with a timed slot after lunch. Sunset from Piazzale Michelangelo.' },
      { title: 'A slow second day', body: 'Oltrarno morning — Santo Spirito market, Brancacci Chapel, artisan streets. Long lunch. Pitti Palace or Bardini Gardens.' },
      { title: 'A day trip to Siena', body: 'Bus from Villa Costanza (~75 min). See our full Florence-to-Siena transport guide.' },
    ],
    budget: {
      budget: '€90–130 per person per day (guesthouse, casual meals, walking).',
      mid: '€170–260 per person per day (3–4★ hotel in Santa Croce or Oltrarno, one enoteca dinner).',
      luxury: '€360–520 per person per day (design hotel, tasting menus, private guide for the Uffizi).',
    },
    faqs: [
      { q: 'Is two days enough for Florence?', a: 'Two full days lets you see the icons — Duomo, Uffizi, Ponte Vecchio — but not much more. Three nights is the sweet spot.' },
      { q: 'Should I book Uffizi tickets ahead?', a: 'Yes. Skip-the-line matters here. Book at least a week ahead in shoulder season; 3–4 weeks in peak.' },
      { q: 'Can I walk everywhere?', a: 'Yes. The historic centre is small and mostly pedestrianised. Comfortable shoes are non-negotiable — the stones are uneven.' },
    ],
    related: ['best-things-to-do-in-siena', 'florence-to-siena-transport', 'best-time-to-visit-tuscany', 'tuscany-food-guide'],
    internalLinks: [
      { to: '/tuscany-travel-guide', label: 'Tuscany region overview' },
      { to: '/siena', label: 'Siena guide' },
      { to: '/florence-to-siena-by-train-or-bus', label: 'Florence → Siena transport guide' },
      { to: '/travel-tools/area-finder', label: 'Where to stay finder' },
      { to: '/travel-budget-calculator', label: 'Trip budget calculator' },
    ],
  },
};

export const getCity = (slug) => cities[slug];
export const citySlugs = Object.keys(cities);
