// Editorial articles. Original placeholder content, written for Archi Travel Guide.
// Not copied from any previous business. Each article is structured for the
// Article page template (breadcrumbs, TOC, sections, FAQ, related).

const A = (slug, title, category, region, excerpt, image, sections, faqs = [], updated = '2025-11-10') => ({
  slug, title, category, region, excerpt, image, sections, faqs, updated,
  author: {
    name: 'Archi Editorial Team',
    role: 'Travel guides & itinerary planning',
    bio: 'Our editorial team writes practical, opinionated travel guides — no filler, no clickbait.',
  },
  readMinutes: Math.max(4, Math.round(sections.reduce((n, s) => n + (s.body?.length || 0), 0) / 1200)),
});

export const articles = [
  A(
    'best-things-to-do-in-siena',
    'Best Things to Do in Siena for First-Time Visitors',
    'Things to do', 'Siena',
    'A practical, opinionated shortlist for a first visit to Siena — what to prioritise, what to skip on a short trip, and how to time the crowds.',
    'https://images.unsplash.com/photo-1646319514161-8fba0ebc3275?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NTYxOTJ8MHwxfHNlYXJjaHwyfHxzaWVuYSUyMGl0YWx5JTIwYXJjaGl0ZWN0dXJlfGVufDB8fHx8MTc4MzAwNDQ4Nnww&ixlib=rb-4.1.0&q=85',
    [
      { id: 'why-siena', heading: 'Why Siena rewards slow travelers', body: 'Siena is compact enough to explore on foot but layered enough to reward two full days. Unlike Florence, the historic centre is largely traffic-free, which changes the pace of a visit noticeably.\n\nFirst-time visitors often try to combine Siena with a day trip from Florence. That works, but you will leave with a shallower memory of the city. If you have any flexibility, sleep at least one night inside the walls.' },
      { id: 'piazza-del-campo', heading: '1. Sit on Piazza del Campo — twice', body: 'The Campo is the shell-shaped medieval square at the heart of the city. Visit it once in the morning for coffee and once at sunset, when families and locals return. This is not a photo-and-leave sight; it is designed to be sat in.' },
      { id: 'duomo', heading: '2. Siena Cathedral & the Piccolomini Library', body: 'The Duomo is arguably one of the most detailed Gothic cathedrals in Italy. Buy the OPA Si Pass if you plan to visit more than one site — it bundles the Duomo, the Baptistery, the Crypt and the Panorama dal Facciatone.\n\nGo mid-morning, after the first tour groups have moved on to the museums.' },
      { id: 'torre-del-mangia', heading: '3. Climb the Torre del Mangia', body: 'Torre del Mangia gives you the best view over Siena and the surrounding hills. It is a 400-step climb with limited-capacity windows every 15 minutes. Book online, first slot of the day.' },
      { id: 'contrada', heading: '4. Walk one Contrada carefully', body: 'The city is divided into 17 contrade (neighborhood districts) with their own churches, museums and heraldry. Pick one — Onda, Selva or Torre are good first choices — and walk it slowly.' },
      { id: 'terzo-di-citta', heading: '5. Aperitivo in Terzo di Città', body: 'Skip the postcard-priced places right on the Campo for aperitivo. Walk five minutes into Terzo di Città and you’ll find enotecas where a glass of Chianti Classico is around €5–7 with generous snacks.' },
      { id: 'what-to-skip', heading: 'What we skip on a short first trip', body: 'On a two-day trip, we deprioritise: (1) the Palazzo Salimbeni interior; (2) the Basilica dei Servi (worth it if you love quiet churches, otherwise no); (3) a rushed drive-through of San Gimignano — better on a separate day.' },
      { id: 'practical', heading: 'Practical tips', body: '• Wear real walking shoes — the medieval stones are uneven and steep.\n• Public toilets are limited; use café toilets while you eat.\n• Most museums close on Monday afternoons off-season.\n• Cash is still handy at family-run trattorias.' },
    ],
    [
      { q: 'Is one day enough for Siena?', a: 'You can see the highlights in a day, but you will leave with a rushed memory. Two nights unlocks Siena.' },
      { q: 'When is Siena less crowded?', a: 'March, early April and November (outside Palio dates) are quiet without being cold.' },
      { q: 'Is Siena walkable?', a: 'Yes — the historic centre is largely pedestrianised. Bring walking shoes, the terrain is hilly.' },
    ],
  ),
  A(
    'where-to-stay-in-siena',
    'Where to Stay in Siena: Best Areas Compared',
    'Where to stay', 'Siena',
    'The three terzi of Siena compared honestly — noise levels, walking times, and who each area actually suits.',
    'https://images.unsplash.com/photo-1568650834015-6ff1c2cd6e7b?auto=format&fit=crop&w=1600&q=75',
    [
      { id: 'overview', heading: 'How Siena is organised', body: 'Siena divides into three historic terzi (thirds): Città, San Martino and Camollia. All three sit inside the medieval walls and are walkable to Piazza del Campo. The differences show up in atmosphere, price and noise.' },
      { id: 'terzo-citta', heading: 'Terzo di Città — quietest, most elegant', body: 'The southern third around the Duomo. Best for couples and families who want quiet nights, elegant architecture and short walks to the main museums. Expect a small premium on hotel prices.' },
      { id: 'terzo-san-martino', heading: 'Terzo di San Martino — most walkable to nightlife', body: 'East of the Campo. Livelier enotecas, easy access to Via di Città and Via Banchi di Sotto. Great for solo travelers and small groups.' },
      { id: 'terzo-camollia', heading: 'Terzo di Camollia — best value, most local', body: 'Northern third, closer to the train station and bus terminal. Slightly further to the Campo (10–15 min walk) but rooms cost 20–30% less. Best for budget travelers and long stays.' },
      { id: 'outside-walls', heading: 'Outside the walls — when it makes sense', body: 'Only recommended if (1) you are driving and want free parking, or (2) you want a countryside experience with a car. Otherwise stay inside the walls.' },
    ],
    [
      { q: 'Is it safe to walk in Siena at night?', a: 'Yes. Siena is one of the safer historic centres in Italy. The main streets stay lively until midnight.' },
      { q: 'Can I park inside the walls?', a: 'No — the centre is ZTL (limited traffic). Use Santa Caterina, Il Campo or Il Duomo parking garages.' },
    ],
  ),
  A(
    'siena-2-day-itinerary',
    'Siena 2-Day Itinerary',
    'Itineraries', 'Siena',
    'A well-paced two-day plan for Siena that mixes big sights, quiet corners and a proper aperitivo.',
    'https://images.unsplash.com/photo-1515861909916-15b118e2f92f?auto=format&fit=crop&w=1600&q=75',
    [
      { id: 'day-1', heading: 'Day 1 — The Campo and the Duomo', body: 'Morning: coffee on Piazza del Campo, then climb Torre del Mangia (first slot).\n\nMid-morning: Duomo complex — Cathedral, Piccolomini Library, Baptistery.\n\nLunch: casual trattoria in Via del Porrione.\n\nAfternoon: Museo dell’Opera, then Panorama dal Facciatone.\n\nEvening: aperitivo in Terzo di Città, dinner near Via Stalloreggi.' },
      { id: 'day-2', heading: 'Day 2 — Contrada walk and Fontebranda', body: 'Morning: walk the Onda or Selva contrada, visit their small museum if open.\n\nLate morning: descend to Fontebranda (medieval fountain) and Santa Caterina’s house.\n\nLunch: enoteca lunch with two glasses of Chianti Classico.\n\nAfternoon: Pinacoteca Nazionale (skippable if art-fatigued) or slow shopping on Via di Città.\n\nEvening: passeggiata on the Campo, then dinner in Terzo di Camollia.' },
      { id: 'variations', heading: 'Variations', body: 'With kids: replace the Pinacoteca with a gelato stop and a game of hide-and-seek in the Campo (locals do this).\n\nWith more time: add a half-day drive to Val d’Orcia (Pienza + Montalcino).' },
    ],
    [
      { q: 'Can I do Siena in one day?', a: 'Yes, but sacrifice the Pinacoteca and Panorama. Prioritise Campo, Duomo, Torre del Mangia and one enoteca lunch.' },
    ],
  ),
  A(
    'siena-3-day-itinerary',
    'Siena 3-Day Itinerary',
    'Itineraries', 'Siena',
    'Three days lets you slow down and add a real half-day trip into Val d’Orcia or San Gimignano.',
    'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1600&q=75',
    [
      { id: 'day-1', heading: 'Day 1 — Orientation', body: 'Same as the two-day plan: Campo, Torre del Mangia, Duomo.' },
      { id: 'day-2', heading: 'Day 2 — Contrada and Fontebranda', body: 'Contrada walk, Pinacoteca, Fontebranda, enoteca lunch. Slow evening.' },
      { id: 'day-3', heading: 'Day 3 — Half-day trip', body: 'Choose one: Val d’Orcia (Pienza + Montalcino), San Gimignano + Monteriggioni, or a Brunello winery tour. Return to Siena for dinner.' },
    ],
  ),
  A(
    'how-much-siena-trip-costs',
    'How Much Does a Trip to Siena Cost?',
    'Budget planning', 'Siena',
    'A realistic breakdown of Siena costs today — accommodation, food, museum passes, transport — with three budget tiers.',
    'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1600&q=75',
    [
      { id: 'tiers', heading: 'Three tiers, per person per day', body: 'Budget: €70–100 (guesthouse, casual meals, walking).\nMid: €140–200 (3★ hotel, one enoteca dinner, museum passes).\nUpper mid: €260–380 (design hotel, tasting menus, driver day).' },
      { id: 'accommodation', heading: 'Accommodation', body: 'Guesthouses inside the walls start around €80/night off-season. Boutique 3–4★ hotels sit at €130–220. Small design hotels can be €280+.' },
      { id: 'food', heading: 'Food & drink', body: 'A casual trattoria dinner runs €25–35pp. Enoteca dinners €45–70pp. Coffee on the Campo is €1.30–1.80 at the bar, €4–5 seated.' },
      { id: 'passes', heading: 'Museum passes', body: 'The OPA Si Pass bundles the main Duomo complex sights and pays for itself if you visit two or more. Torre del Mangia is separate.' },
    ],
  ),
  A(
    'best-time-to-visit-tuscany',
    'Best Time to Visit Tuscany',
    'Best time to visit', 'Tuscany',
    'Month-by-month guide to Tuscany with an honest take on weather, crowds and pricing.',
    'https://images.unsplash.com/photo-1503152394-c571994fd383?auto=format&fit=crop&w=1600&q=75',
    [
      { id: 'may-june', heading: 'May–June — the sweet spot', body: 'Warm days, cool evenings, everything is green, and crowds are still manageable before the July peak.' },
      { id: 'september', heading: 'September — harvest colors', body: 'Vineyards start harvesting. Fewer families, better hotel rates, and the light is exceptional.' },
      { id: 'october', heading: 'October — quiet and cheap', body: 'Cooler but reliable. Countryside agriturismos drop rates. Watch for shorter museum hours.' },
      { id: 'winter', heading: 'November–February', body: 'Quiet and low-priced. Some agriturismos close. Christmas markets are a highlight around Siena and Florence.' },
      { id: 'summer', heading: 'July–August — heat and Palio', body: 'Hot and crowded. Great if you plan for the Palio in Siena (July 2 & August 16). Book accommodation months ahead.' },
    ],
  ),
  A(
    'florence-to-siena-transport',
    'Florence to Siena Transport Guide',
    'Transport', 'Tuscany',
    'Bus, train or rental car — how to get from Florence to Siena, and which option makes sense for your trip.',
    'https://images.unsplash.com/photo-1519677100203-a0e668c92439?auto=format&fit=crop&w=1600&q=75',
    [
      { id: 'bus', heading: 'Bus (recommended for most)', body: 'Autolinee Toscane runs frequent buses from Florence (Villa Costanza) to Siena (Piazza Gramsci) in about 75 minutes. Fastest and drops you closer to the historic centre.' },
      { id: 'train', heading: 'Train (scenic but slower)', body: 'Direct trains take 90 minutes to Siena station, which is downhill from the centre. Take the escalators up to the walls.' },
      { id: 'car', heading: 'Rental car (only if you’re staying in the countryside)', body: 'Under 90 minutes on the SS2 or the SI-FI Raccordo. Only choose this if you plan to explore Val d’Orcia — parking in Siena is outside the walls and paid.' },
    ],
    [
      { q: 'Which is faster?', a: 'The bus. About 75 minutes and lands you close to the walls.' },
      { q: 'Can I take a day trip?', a: 'Yes, but leave by 8:30 to make the most of it. Better to stay one night.' },
    ],
  ),
  A(
    'tuscany-packing-checklist',
    'Tuscany Packing Checklist',
    'Packing', 'Tuscany',
    'A season-aware Tuscany packing list — designed for uneven cobblestones, church visits and countryside dinners.',
    'https://images.unsplash.com/photo-1619467416348-6a782839e95f?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzd8MHwxfHNlYXJjaHwyfHx0cmF2ZWwlMjBmbGF0bGF5JTIwcGxhbm5pbmclMjBtYXB8ZW58MHx8fHwxNzgzMDA0NDg2fDA&ixlib=rb-4.1.0&q=85',
    [
      { id: 'clothing', heading: 'Clothing basics', body: 'Comfortable walking shoes (broken in), a light layer for evenings, and one dressy piece for a nicer dinner. Modest cover-up for churches (shoulders + knees).' },
      { id: 'weather', heading: 'By season', body: 'Spring/autumn: light rain jacket, layered tops.\nSummer: breathable fabrics, wide-brim hat, refillable water bottle.\nWinter: warm coat, waterproof shoes, scarf.' },
      { id: 'smart', heading: 'Smart extras', body: 'Foldable daypack, packing cubes, a plug adapter, offline maps, and a small notebook — many small towns have poor cell signal.' },
    ],
  ),
  A(
    'siena-with-kids',
    'Siena with Kids: Practical Family Guide',
    'Family travel', 'Siena',
    'Siena is unexpectedly great with kids — small enough to explore on foot, safe, and full of visual details children notice before adults do.',
    'https://images.unsplash.com/photo-1503457574462-bd27054394c1?auto=format&fit=crop&w=1600&q=75',
    [
      { id: 'why-siena-kids', heading: 'Why Siena works with kids', body: 'Compact, largely pedestrianised, and full of small details (contrada flags, animal symbols, fountains) that kids can turn into a scavenger hunt. Distances between sights are short.' },
      { id: 'itinerary-kids', heading: 'A kid-paced day', body: 'Late-morning coffee break on the Campo, short Duomo visit (skip the library queue if the kids are done), gelato mid-afternoon, downtime at the hotel, then a family trattoria at 7:30.' },
      { id: 'family-food', heading: 'Family-friendly food', body: 'Look for trattorias with a printed menu (many still handwritten) and a kids’ pasta option. Highchairs are rare but staff will usually improvise.' },
    ],
  ),
  A(
    'best-day-trips-from-siena',
    'Best Day Trips from Siena',
    'Day trips', 'Tuscany',
    'Five day trips from Siena, ranked by ease and reward — with our honest take on each.',
    'https://images.unsplash.com/photo-1516815231560-8f41ec531527?auto=format&fit=crop&w=1600&q=75',
    [
      { id: 'san-gimignano', heading: 'San Gimignano & Monteriggioni', body: 'Two hilltowns in one day. San Gimignano is famous for its towers; Monteriggioni is smaller and quieter. Best paired with a rental car or a small group tour.' },
      { id: 'val-dorcia', heading: 'Val d’Orcia (Pienza + Montalcino)', body: 'Cypress-lined roads, cheese in Pienza, Brunello in Montalcino. Ideal for a driver-led day.' },
      { id: 'chianti', heading: 'Chianti wine route', body: 'Between Florence and Siena. A relaxed day; pick two wineries max.' },
      { id: 'florence', heading: 'Florence', body: 'Reverse commute — Siena to Florence works well if you set out early. Focus on one museum, not three.' },
      { id: 'volterra', heading: 'Volterra', body: 'Etruscan roots, quieter than San Gimignano, and beautiful in shoulder season.' },
    ],
  ),
  A(
    'tuscany-food-guide',
    'Tuscany Food Guide for First-Time Visitors',
    'Food & drink', 'Tuscany',
    'What to actually eat in Tuscany, plus the small vocabulary that opens up menus at family-run trattorias.',
    'https://images.unsplash.com/photo-1523986371872-9d3ba2e2a389?auto=format&fit=crop&w=1600&q=75',
    [
      { id: 'signature-dishes', heading: 'Signature dishes to order', body: 'Pici cacio e pepe (a chunky handmade pasta with pecorino), ribollita (bread and vegetable soup), pappa al pomodoro, bistecca alla fiorentina (share for two), and cinta senese cured meats.' },
      { id: 'wine', heading: 'Wine, briefly', body: 'Chianti Classico for lighter, food-friendly reds; Brunello di Montalcino for deeper, aging-worthy bottles; Vino Nobile di Montepulciano sits between the two.' },
      { id: 'vocab', heading: 'Menu vocabulary', body: 'Antipasti (starters), primi (pasta/soup), secondi (mains), contorni (sides — ordered separately), dolci (desserts). Coperto is the small cover charge; servizio is a rare service charge.' },
    ],
  ),
  A(
    'common-mistakes-siena',
    'Common Mistakes to Avoid When Visiting Siena',
    'Practical tips', 'Siena',
    'The mistakes we see first-timers make in Siena — and simple fixes so you don’t.',
    'https://images.unsplash.com/photo-1533929736458-ca588d08c8be?auto=format&fit=crop&w=1600&q=75',
    [
      { id: 'day-trip', heading: 'Treating Siena as a day trip', body: 'The city genuinely changes in the evening. If you can, stay one night inside the walls.' },
      { id: 'campo-food', heading: 'Eating on the Campo', body: 'Not always bad, but you pay a big premium. Walk five minutes off the square for better food and lower prices.' },
      { id: 'ztl', heading: 'Driving into the walls', body: 'The centre is a ZTL zone. Cameras will fine you weeks later. Park at Santa Caterina, Il Campo or Il Duomo garages.' },
      { id: 'shoes', heading: 'Wrong shoes', body: 'The stones are uneven and can be slippery when damp. Do not underestimate this.' },
    ],
  ),
  A(
    'how-to-plan-europe-trip',
    'How to Plan a Europe Trip for the First Time',
    'Planning', 'Europe',
    'A calm, non-overwhelming framework for planning your first Europe trip: how many cities, how long, what to book first.',
    'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1600&q=75',
    [
      { id: 'framework', heading: 'The 3-2-1 framework', body: 'For a 10-day first trip, aim for 3 base cities, 2 nights minimum in each, and 1 shorter side trip. This prevents the classic “I felt like I was always in a train” fatigue.' },
      { id: 'book-order', heading: 'What to book first', body: 'Flights → base city accommodation → high-demand attractions (Uffizi, Vatican, Alhambra) → intercity trains → smaller experiences and restaurants.' },
      { id: 'buffer', heading: 'Leave one unbooked day per city', body: 'It sounds counter-intuitive, but the unplanned days are the ones travelers remember.' },
    ],
  ),
  A(
    'europe-budget-guide',
    'Europe Travel Budget Guide',
    'Budget planning', 'Europe',
    'A realistic Europe budget guide with three tiers and honest per-country adjustments.',
    'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=1600&q=75',
    [
      { id: 'tiers', heading: 'Three budget tiers', body: 'Budget: €75–110/day. Mid: €140–210/day. Upper: €280–420/day. Adjust for city — Paris, London, Zurich and Copenhagen sit 20–30% higher; Portugal, Greece, and much of Central Europe sit 15–25% lower.' },
      { id: 'levers', heading: 'The 4 biggest levers', body: 'Accommodation area, meal mix, transport type, and how many paid attractions per day. Getting three of these right lets the fourth flex.' },
    ],
  ),
  A(
    'best-travel-apps',
    'Best Travel Apps for International Trips',
    'Resources', 'Global',
    'The apps our editorial team actually uses on international trips — no affiliate padding, just what works.',
    'https://images.unsplash.com/photo-1522199755839-a2bacb67c546?auto=format&fit=crop&w=1600&q=75',
    [
      { id: 'core', heading: 'The core stack', body: 'Google Maps (with offline maps), Rome2Rio (city-to-city planning), Trainline or the national rail app, Google Translate with camera translation, and a currency converter.' },
      { id: 'esim', heading: 'eSIM & connectivity', body: 'An eSIM avoids expensive roaming and lets you use maps from day one. Test the eSIM before your flight.' },
    ],
  ),
  A(
    'choose-area-any-city',
    'How to Choose the Best Area to Stay in Any City',
    'Planning', 'Global',
    'A repeatable framework for picking the right neighborhood in any city — not just the ones you already know.',
    'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?auto=format&fit=crop&w=1600&q=75',
    [
      { id: 'framework', heading: 'The 4-question framework', body: '1) What are the two things you most want to walk to?\n2) Do you value quiet nights or lively ones?\n3) How much do you value one-metro-ring-out savings?\n4) Are you arriving late or early?' },
      { id: 'anti', heading: 'Neighborhoods to avoid — usually', body: 'Areas that are only clusters of hotels tend to feel dead in the evening. Areas immediately next to major train stations are often cheaper but noisier.' },
    ],
  ),
  A(
    'international-packing-checklist',
    'International Packing Checklist for First-Time Travelers',
    'Packing', 'Global',
    'The universal checklist we run through before any international trip, grouped so nothing gets forgotten.',
    'https://images.unsplash.com/photo-1553531384-cc64ac80f931?auto=format&fit=crop&w=1600&q=75',
    [
      { id: 'documents', heading: 'Documents', body: 'Passport (check 6-month validity rule), printed booking confirmations, insurance card, backup credit card, small local currency.' },
      { id: 'tech', heading: 'Tech', body: 'Phone + charger, EU/UK plug adapter, portable power bank, headphones, eSIM downloaded before flight.' },
      { id: 'basics', heading: 'Health & basics', body: 'Prescription meds in original packaging, small first-aid kit, sunscreen, reusable water bottle, small foldable daypack.' },
    ],
  ),
  A(
    'flexible-itinerary',
    'How to Build a Flexible Travel Itinerary',
    'Planning', 'Global',
    'A repeatable way to plan a trip that has structure but leaves room for the moments you can’t predict.',
    'https://images.unsplash.com/photo-1526772662000-3f88f10405ff?auto=format&fit=crop&w=1600&q=75',
    [
      { id: 'anchors', heading: 'Anchor and gap', body: 'Book 1 anchor per day (a museum, a restaurant, a train). Leave the rest open. Two thirds of your best travel moments will happen in those gaps.' },
      { id: 'buffer', heading: 'Buffer transitions', body: 'The single most common mistake: back-to-back bookings. Add a two-hour buffer around every train, transfer, or timed entry.' },
    ],
  ),
];

export const getArticle = (slug) => articles.find((a) => a.slug === slug);
export const articlesByRegion = (region) =>
  articles.filter((a) => a.region.toLowerCase() === region.toLowerCase());
