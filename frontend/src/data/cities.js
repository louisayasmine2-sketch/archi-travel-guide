// Editorial city landing pages — Florence, Rome, Venice.
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
      { to: '/tuscany', label: 'Tuscany region overview' },
      { to: '/siena', label: 'Siena guide' },
      { to: '/blog/florence-to-siena-transport', label: 'Florence → Siena transport guide' },
      { to: '/travel-tools/area-finder', label: 'Where to stay finder' },
      { to: '/travel-tools/budget-calculator', label: 'Trip budget calculator' },
    ],
  },
  rome: {
    slug: 'rome',
    name: 'Rome',
    region: 'Lazio',
    country: 'Italy',
    tagline: 'Ancient layers, modern life',
    metaTitle: 'Rome Travel Guide — Itinerary, neighborhoods, and honest advice',
    metaDescription: 'A practical Rome travel guide: what to see first, which neighborhoods actually work as a base, how to skip queues at the Vatican and Colosseum, and realistic costs.',
    hero: 'https://images.unsplash.com/photo-1531572753322-ad063cecc140?auto=format&fit=crop&w=2000&q=75',
    overview:
      'Rome does not reveal itself in a weekend. The mistake most first-timers make is trying to combine Colosseum, Vatican, Trastevere and the Villa Borghese into two days. You end up moving constantly and remembering little.',
    overview2:
      'Our recommendation: four nights, minimum. One day for ancient Rome (Colosseum + Forum + Palatine). One day for the Vatican. One day just walking — Trastevere, Campo de’ Fiori, Jewish Quarter. One day off the tourist grid: Testaccio, Aventine, and the neighborhoods where Romans actually live.',
    bestTime: {
      good: 'April, May, late September, October — pleasant temperatures and manageable crowds.',
      avoid: 'August. Half of Rome literally closes and the heat is punishing.',
      quiet: 'January and February are cheapest, coldest, and quietest. Museums are a joy in winter.',
    },
    whereToStay: [
      { name: 'Monti', why: 'Cobbled lanes, independent cafés, walking distance to the Forum and Colosseum. Our top pick.' },
      { name: 'Trastevere', why: 'The classic evening neighborhood. Great atmosphere; pick a side street for lower noise.' },
      { name: 'Prati', why: 'Wide sidewalks, safe streets near the Vatican. The most family-friendly base.' },
      { name: 'Centro Storico', why: 'The heart of Rome; you’ll walk to nearly everything, but pay a premium.' },
    ],
    transport: [
      'From FCO (Fiumicino): Leonardo Express to Roma Termini in 32 minutes. Book online for a small discount.',
      'From CIA (Ciampino): Terravision / SIT bus to Termini (~40 min). Cheap and reliable.',
      'Metro Lines A and B intersect at Termini and cover most tourist sights. Tap-and-go with contactless bank cards.',
      'Do not rent a car for Rome itself — the historic centre is a ZTL and impossible to park.',
    ],
    itineraryIdeas: [
      { title: 'Ancient Rome day', body: 'Colosseum first slot, then Forum, then Palatine Hill. Long late lunch in Monti. Sunset from Circo Massimo.' },
      { title: 'Vatican day', body: 'Vatican Museums first-entry slot, Sistine Chapel, then St Peter’s. Afternoon coffee in Prati. Sunset from Castel Sant’Angelo bridge.' },
      { title: 'Slow Rome day', body: 'Campo de’ Fiori market, Jewish Quarter lunch, walk to Trastevere via Isola Tiberina.' },
    ],
    budget: {
      budget: '€85–120 per person per day (small hotel outside the centre, casual meals, walking + metro).',
      mid: '€170–270 per person per day (mid-range hotel in Monti or Prati, one nice dinner per day).',
      luxury: '€380–650 per person per day (design hotel, private Vatican tour, tasting menus).',
    },
    faqs: [
      { q: 'Is Rome walkable?', a: 'Mostly yes for the historic centre. Add short metro hops for the Vatican and Villa Borghese.' },
      { q: 'How many days do I need?', a: 'Three nights is a rushed minimum. Four unlocks the city. A week is when Rome starts to feel like yours.' },
      { q: 'Are skip-the-line tickets worth it?', a: 'For the Colosseum and the Vatican Museums, absolutely — book official timed entry directly with the site.' },
    ],
    related: ['how-to-plan-europe-trip', 'europe-budget-guide', 'best-travel-apps'],
    internalLinks: [
      { to: '/italy', label: 'Italy overview' },
      { to: '/travel-tools/area-finder', label: 'Where to stay finder — includes Rome' },
      { to: '/travel-tools/best-time-to-visit', label: 'Best time to visit tool' },
      { to: '/travel-deals', label: 'Travel deals & resources' },
    ],
  },
  venice: {
    slug: 'venice',
    name: 'Venice',
    region: 'Veneto',
    country: 'Italy',
    tagline: 'Islands, canals, quiet mornings',
    metaTitle: 'Venice Travel Guide — Beyond San Marco, where to sleep, when to visit',
    metaDescription: 'A practical Venice travel guide: how to escape the day-tripper crowds, which sestiere to sleep in, transport with vaporetti and water taxis, and realistic Venice costs.',
    hero: 'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?auto=format&fit=crop&w=2000&q=75',
    overview:
      'Venice is a city of mornings and evenings. Between 10:30 and 17:00, day-trippers from cruise ships flood San Marco and the Rialto. If you sleep in Venice, you get the two hours on either side of that window — and those are the hours that make the trip.',
    overview2:
      'Our recommendation: two nights, minimum. That gives you one full day to walk far from San Marco (Cannaregio, Castello, Dorsoduro) and one shorter day for the islands — Murano and Burano, ideally by public vaporetto rather than a rushed group tour.',
    bestTime: {
      good: 'April, May, late September, October — mild days without the peak crush.',
      avoid: 'Mid-July to August — hot, humid, and eye-wateringly crowded.',
      quiet: 'Late January (before Carnival) and early December — moody light, misty canals, quiet campos. Bring layers.',
    },
    whereToStay: [
      { name: 'Cannaregio', why: 'Our favourite base. Walkable to San Marco but full of local life. Best evening atmosphere.' },
      { name: 'Dorsoduro', why: 'Museums, students, and quieter canals. Great for culture-first trips.' },
      { name: 'Castello', why: 'Away from the crowds, more residential, closer to the Biennale sites.' },
      { name: 'San Marco', why: 'Iconic but noisy and expensive; sleep here only if it’s a one-night stopover.' },
    ],
    transport: [
      'From Marco Polo airport: Alilaguna water bus (~1h to San Marco) or the ATVO bus to Piazzale Roma + vaporetto.',
      'From Treviso airport: ATVO bus to Piazzale Roma (~1h5m).',
      'Inside Venice: no cars. Buy a vaporetto pass (24h / 48h / 72h) if you plan to hop between sestieri or reach the islands.',
      'Water taxis are beautiful and expensive — €80+ from the airport. Only worth it with luggage or a tight schedule.',
    ],
    itineraryIdeas: [
      { title: 'Slow-off-the-tourist-grid day', body: 'Cannaregio morning, Jewish Ghetto history walk, lunch in a bacaro. Afternoon vaporetto to San Giorgio Maggiore for the view.' },
      { title: 'Islands day', body: 'Vaporetto to Murano (glass), then Burano (colours + lace) for lunch. Return by late afternoon.' },
      { title: 'Big-sight day', body: 'Doge’s Palace first slot, San Marco Basilica, then a quiet Castello walk to escape the crowd.' },
    ],
    budget: {
      budget: '€110–160 per person per day (small hotel in Cannaregio, cicchetti dinners, mostly walking).',
      mid: '€220–340 per person per day (3–4★ hotel in Dorsoduro or Cannaregio, one memorable dinner).',
      luxury: '€480–780 per person per day (design hotel on the Grand Canal, tasting menus, private water taxi).',
    },
    faqs: [
      { q: 'Should I sleep on the mainland to save money?', a: 'No. The whole point of Venice is being there in the morning and evening. A modest sestiere hotel beats a fancy Mestre hotel every time.' },
      { q: 'How many days do I need?', a: 'Two nights unlocks Venice. Three lets you add the islands without rushing.' },
      { q: 'Is Venice good for kids?', a: 'Surprisingly yes — no traffic, plenty of boat rides, and pizza is everywhere. Bring a light stroller only if it’s foldable; steps and bridges are constant.' },
    ],
    related: ['how-to-plan-europe-trip', 'international-packing-checklist'],
    internalLinks: [
      { to: '/italy', label: 'Italy overview' },
      { to: '/travel-tools/best-time-to-visit', label: 'Best time to visit tool' },
      { to: '/travel-tools/packing-checklist', label: 'Packing checklist tool' },
      { to: '/travel-deals', label: 'Travel deals & resources' },
    ],
  },
};

export const getCity = (slug) => cities[slug];
export const citySlugs = Object.keys(cities);
