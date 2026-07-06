// Editorial articles. Original placeholder content, written for Archi Travel Guide.
// Not copied from any previous business. Each article is structured for the
// Article page template (breadcrumbs, TOC, sections, FAQ, related).

const A = (slug, title, category, region, excerpt, image, sections, faqs = [], updated = '2025-11-10', options = {}) => {
  const safeSections = Array.isArray(sections) ? sections : [];
  const safeFaqs = Array.isArray(faqs) ? faqs : [];

  return {
    slug, title, category, region, excerpt, image, sections: safeSections, faqs: safeFaqs, updated,
    ...options,
    author: {
      name: 'Archi Editorial Team',
      role: 'Travel guides & itinerary planning',
      bio: 'Our editorial team writes practical, opinionated travel guides — no filler, no clickbait.',
    },
    readMinutes: Math.max(4, Math.round(safeSections.reduce((n, s) => n + (s.body?.length || 0), 0) / 1200)),
  };
};

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
    'https://images.unsplash.com/photo-1478476868527-002ae3f3e159?auto=format&fit=crop&w=1600&q=75',
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
    'https://images.unsplash.com/photo-1520175480921-4edfa2983e0f?auto=format&fit=crop&w=1600&q=75',
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
    'siena-hotel-vs-apartment-guide',
    'Siena Hotel vs Apartment: Which Booking Is Better for Your Trip',
    'Accommodation', 'Siena',
    'A practical comparison for a 2–5 day trip: hotel, B&B, or apartment — with pricing, logistics and real booking trade-offs.',
    'https://images.unsplash.com/photo-1478476868527-002ae3f3e159?auto=format&fit=crop&w=1600&q=75',
    [
      { id: 'booking-shape', heading: 'Start with your trip shape', body: 'If you want maximum flexibility and easy check-in support, choose a hotel or B&B. If you travel as a family, or stay 4+ nights, apartment stays usually beat hotels on value and storage.' },
      { id: 'noise-cost', heading: 'Noise vs. value trade-off', body: 'Best-value apartments are often just outside the walls, while top convenience stays sit closer to Campo. Decide first: do you value quiet mornings more than lower nightly rates?' },
      { id: 'cancellation-flex', heading: 'Cancellation policy before price', body: 'One cancelled plan can erase all savings if there is no free cancellation. For Italy mid-season plans, refundable options are worth a small premium.' },
      { id: 'siena-specific', heading: 'Siena-specific reality', body: 'The walk to the city walls is excellent from central B&Bs and hotels. If your focus is transport simplicity and luggage handling, pick proximity over square footage.' },
      { id: 'booking-flow', heading: 'Decision flow', body: 'Option 1: if travelling as a family: apartment > B&B > hotel.\nOption 2: if short trip and no car: B&B > hotel > apartment.\nOption 3: if you value one-time check-in: hotel > B&B > apartment.' },
    ],
    [
      { q: 'Which option is cheapest?', a: 'Usually apartment, then B&B, then hotel — but location and breakability can change the total cost.' },
      { q: 'Do apartments save on food budget?', a: 'Yes, if you use a kitchenette. But remember cleaning + deposit costs can reduce the advantage.' },
    ],
    '2026-07-03',
    {
      monetization: {
        booking: {
          heading: 'Need help choosing the right stay type?',
          description: 'Send your dates and group type, and we will suggest booking-ready options.',
          linkText: 'Send dates for booking advice',
          linkHref: '/contact',
          linkTone: 'primary',
          leadSubjectHint: 'Accommodation type help for Siena trip',
        },
        affiliates: [
          { title: 'Compare Siena hotel options by date', provider: 'Hotels', tag: 'Accommodation', description: 'Neutral comparison of hotels, B&Bs and apartments in central Siena.', ctaLabel: 'Open hotel comparison', href: '/travel-deals?utm_source=archi&utm_medium=article_affiliate&utm_campaign=siena_hotel_vs_apartment' },
          { title: 'Apartment-style stays near Siena centre', provider: 'Apartments', tag: 'Lodging', description: 'Family-fit and long-stay stays with in-unit kitchens and practical services.', ctaLabel: 'Open apartment comparison', href: '/travel-deals?utm_source=archi&utm_medium=article_affiliate&utm_campaign=siena_hotel_vs_apartment' },
        ],
      },
    }
  ),
  A(
    'siena-parking-and-transfer-guide',
    'Siena Parking Guide: Garages, Transfers, and Cost Planning',
    'Transport', 'Siena',
    'A direct, low-friction guide to Siena parking zones, transfer points and parking-related stress minimisation.',
    'https://images.unsplash.com/photo-1519677100203-a0e668c92439?auto=format&fit=crop&w=1600&q=75',
    [
      { id: 'ztl-reality', heading: 'Siena is car-limited inside the walls', body: 'Most historic areas are inside a controlled traffic zone. Arrive, park outside, then walk or use short-transfer options into the centre.' },
      { id: 'best-garages', heading: 'Best practical garage zones', body: 'Santa Caterina, Campo, and Porta Camollia zones usually work best for groups without overpaying. Confirm gate opening hours and any special-event surcharge.' },
      { id: 'transfer-timing', heading: 'Add transfer time upfront', body: 'On arrival day, add 25–35 minutes for parking plus 5–10 minutes of local walking. This is enough to avoid missing evening reservations.' },
      { id: 'avoid-fines', heading: 'Avoid fines and stress', body: 'Use only signed-access parking for city-edge entry, and save a screenshot of permit rules if you are uncertain before leaving your location.' },
    ],
    [
      { q: 'Can I park in the centre?', a: 'Generally no, unless you have explicit permission and know the rules. The centre is designed for pedestrians during most periods.' },
      { q: 'Should I book parking?', a: 'For weekends and holidays, yes. Pre-booked garage slots reduce arrival stress significantly.' },
    ],
    '2026-07-03',
    {
      monetization: {
        booking: {
          heading: 'Need a quick parking + transfer plan?',
          description: 'Share arrival time, airport/rail details, and your room plan for a practical route suggestion.',
          linkText: 'Get a fast arrival plan',
          linkHref: '/contact',
          linkTone: 'primary',
          leadSubjectHint: 'Parking + transfer planning for Siena',
        },
        affiliates: [
          { title: 'Find Siena airport transfer options', provider: 'Transfers', tag: 'Transport', description: 'Explore reliable transfer providers for airport and long-distance arrivals.', ctaLabel: 'Check transfer options', href: '/travel-deals?utm_source=archi&utm_medium=article_affiliate&utm_campaign=siena_parking_and_transfer' },
          { title: 'Reserve flexible car parks in Siena', provider: 'Parking', tag: 'Parking', description: 'Weekend and event-week parking strategies for short trips.', ctaLabel: 'View parking guides', href: '/travel-deals?utm_source=archi&utm_medium=article_affiliate&utm_campaign=siena_parking_and_transfer' },
        ],
      },
    }
  ),
  A(
    'siena-with-kids-in-one-day',
    'Siena in One Day with Kids: Slow Family Plan',
    'Family travel', 'Siena',
    'A kid-friendly 1-day Siena plan balancing walking, food, and no-fuss movement through the historic core.',
    'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=1600&q=75',
    [
      { id: 'morning', heading: 'Morning (gentle start)', body: 'Start with coffee and a short Campo walk, then one monument visit. Keep the first two stops within 20 minutes of each other.' },
      { id: 'midday', heading: 'Midday (downshift)', body: 'Use one trattoria with highchairs and easy menu reading. Add a quick gelato break and hydrate before late afternoon.' },
      { id: 'afternoon', heading: 'Afternoon (recovery block)', body: 'Swap one museum for a slower route: street fountains, square, or shaded lane walk. Families perform better with planned rest windows.' },
      { id: 'night', heading: 'Night (keep it short)', body: 'Keep first-day evenings early and close to your lodging. Kids absorb less when the night schedule is consistent.' },
    ],
    [
      { q: 'How many steps are realistic for kids?', a: 'Keep total intense walking under 4–5 hours with at least 3 breaks.' },
      { q: 'What if kids get tired early?', a: 'Drop museums first, choose a family-friendly plaza and food stop instead of rigid routing.' },
    ],
    '2026-07-03',
    {
      monetization: {
        booking: {
          heading: 'Need a family-ready booking setup?',
          description: 'We can suggest family-fit areas, rooms and practical routes in one reply.',
          linkText: 'Share family dates',
          linkHref: '/contact',
          linkTone: 'primary',
          leadSubjectHint: 'Family-friendly Siena itinerary',
        },
        affiliates: [
          { title: 'Family-friendly Siena stays', provider: 'Family travel', tag: 'Accommodation', description: 'Rooms with practical space, child-friendly routines and central walking access.', ctaLabel: 'Compare family options', href: '/travel-deals?utm_source=archi&utm_medium=article_affiliate&utm_campaign=siena_with_kids_in_one_day' },
          { title: 'Family transport and mobility tools', provider: 'Mobility', tag: 'Transport', description: 'Short routes and movement options designed for slower pacing.', ctaLabel: 'Check mobility options', href: '/travel-deals?utm_source=archi&utm_medium=article_affiliate&utm_campaign=siena_with_kids_in_one_day' },
        ],
      },
    }
  ),
  A(
    'siena-from-florence-airport-transfer',
    'How to Reach Siena from Florence Airport',
    'Transport', 'Siena',
    'Direct, practical routes from Florence airport to Siena for low-stress transfers and small-city timing.',
    'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1600&q=75',
    [
      { id: 'airport-first-step', heading: 'One route that usually works best', body: 'Use the bus/rail link to Florence city and then switch to Siena bus lines. It is cheaper and usually less complex than private alternatives.' },
      { id: 'time-window', heading: 'Arrival time planning', body: 'For late evening arrivals, allow an extra transfer buffer and confirm service frequency. Airports can create unrealistic assumptions during rush periods.' },
      { id: 'day-trips', heading: 'Return logic', body: 'For weekend returns, pre-check both daytime and evening transfer options. Late return windows reduce available seats unless pre-booked.' },
      { id: 'budget-vs-speed', heading: 'Budget vs speed in practice', body: 'Bus-first routes tend to be cheapest, but private transfer can be simpler when you have many bags and no public-transport comfort.' },
      { id: 'checklist', heading: 'Transfer checklist', body: 'Bring your transfer voucher, hotel address, and one phone number that is reachable in local time.' },
    ],
    [
      { q: 'Which is cheaper: train or transfer?', a: 'For most one-way plans, public transport is cheaper, especially without large luggage.' },
      { q: 'Can I still do this with kids?', a: 'Yes. Add one stopover in Florence and avoid transfer stacking.' },
    ],
    '2026-07-03',
    {
      monetization: {
        booking: {
          heading: 'Need transfer help from airport to Siena?',
          description: 'Tell us flight time, luggage count, and arrival date for a practical transfer suggestion.',
          linkText: 'Build transfer plan',
          linkHref: '/contact',
          linkTone: 'primary',
          leadSubjectHint: 'Airport transfer planning for Siena',
        },
        affiliates: [
          { title: 'Airport-to-Siena transfer options', provider: 'Private transfer', tag: 'Transfer', description: 'Compare transfer providers for direct, luggage-friendly routes.', ctaLabel: 'Check transfer options', href: '/travel-deals?utm_source=archi&utm_medium=article_affiliate&utm_campaign=siena_from_florence_airport_transfer' },
          { title: 'Train and bus schedule tools', provider: 'Tickets', tag: 'Transport', description: 'Use planning tools before transfer day so route windows are realistic.', ctaLabel: 'Compare transport tools', href: '/travel-deals?utm_source=archi&utm_medium=article_affiliate&utm_campaign=siena_from_florence_airport_transfer' },
        ],
      },
    }
  ),
  A(
    'siena-weekend-itinerary-for-couples',
    'Siena Weekend Itinerary for Couples',
    'Itineraries', 'Siena',
    'A practical 2-night, low-stress couple itinerary with food, timing, and walk pacing.',
    'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=1600&q=75',
    [
      { id: 'night-one', heading: 'Night 1: landmarks + aperitivo', body: 'Start with Campo and Duomo window blocks, then end at a quieter enoteca around 18:30–19:00.' },
      { id: 'night-two', heading: 'Night 2: art + local dinner', body: 'Reserve one landmark, then a local restaurant where seating policy is clear. Keep one open hour for weather adjustment.' },
      { id: 'walking-budget', heading: 'Walking budget', body: 'Even in a weekend, two concentrated blocks are better than chasing too many sites. Protect your pace by leaving one evening for a walk-only recovery.' },
      { id: 'budget-swap', heading: 'Budget trade-offs', body: 'Swap one taxi expectation for pre-booked transport if you are tired, but keep most movement walkable for value.' },
    ],
    [
      { q: 'Can we do this in 2 days?', a: 'Yes, if you limit to one major site per half-day and accept slower pacing.' },
      { q: 'Do we need to book everything?', a: 'Only one reservation-heavy item needs hard booking; most meals and one major attraction can be timed without strict prebooking.' },
    ],
    '2026-07-03',
    {
      monetization: {
        booking: {
          heading: 'Want a couple-style booking recommendation?',
          description: 'Share your preferred pace and we’ll suggest the best stay + dinner area for a 2-night trip.',
          linkText: 'Get couple booking support',
          linkHref: '/contact',
          linkTone: 'primary',
          leadSubjectHint: 'Couple weekend trip to Siena',
        },
        affiliates: [
          { title: 'Romantic stays in Siena', provider: 'Hotels', tag: 'Accommodation', description: 'Top-value romantic options with strong location and easy access.', ctaLabel: 'View options', href: '/travel-deals?utm_source=archi&utm_medium=article_affiliate&utm_campaign=siena_weekend_itinerary_for_couples' },
          { title: 'Dining booking and reservations', provider: 'Restaurants', tag: 'Dining', description: 'Flexible options around peak Aperitivo and weekend hours.', ctaLabel: 'See dining options', href: '/travel-deals?utm_source=archi&utm_medium=article_affiliate&utm_campaign=siena_weekend_itinerary_for_couples' },
        ],
      },
    }
  ),
  A(
    'siena-budget-and-meal-planning',
    'Siena on a Mid-Range Budget: Meals, Hotels, and Movement',
    'Budget planning', 'Siena',
    'A practical spending map for a realistic mid-range Siena visit that avoids overpaying for the same 7-hour core.',
    'https://images.unsplash.com/photo-1533777857889-4be7c050a86c?auto=format&fit=crop&w=1600&q=75',
    [
      { id: 'meal-curve', heading: 'Meal budget pattern', body: 'Set one special dinner, one mid-range dinner, and one casual lunch. The total cost stays predictable even in August.' },
      { id: 'nights-and-location', heading: 'Hotel spend levers', body: 'Central first-night rates are usually higher, but movement is easier and logistics are smoother. Use value zones 10–15 minutes away to save cost.' },
      { id: 'transport-cost', heading: 'Transport cost control', body: 'Public transport and short rides are usually cheaper than private transport unless you carry heavy group luggage.' },
      { id: 'avoid-purchases', heading: 'Avoid impulse purchases', body: 'Skip late-night shopping sprees and souvenir duplication. One small local item plus one edible memory is enough for most trips.' },
    ],
    [
      { q: 'Is €140/day realistic?', a: 'For a mid-range couple or pair with one nice dinner, yes. The cost range is wide depending on hotel area and transport choice.' },
      { q: 'Where should I spend first?', a: 'Accommodation and one quality dinner give biggest return. Spend there; keep one meal and one attraction light.' },
    ],
    '2026-07-03',
    {
      monetization: {
        booking: {
          heading: 'Need a budget-optimized booking package?',
          description: 'Send your budget target and we will suggest realistic options with the best value split.',
          linkText: 'Get budget booking help',
          linkHref: '/contact',
          linkTone: 'primary',
          leadSubjectHint: 'Budget Siena trip planning',
        },
        affiliates: [
          { title: 'Hotel and package price comparison', provider: 'Hotels', tag: 'Travel deals', description: 'Compare stay and transfer options by price band and cancellation terms.', ctaLabel: 'Open price comparison', href: '/travel-deals?utm_source=archi&utm_medium=article_affiliate&utm_campaign=siena_budget_and_meal_planning' },
          { title: 'Travel insurance for short trips', provider: 'Insurance', tag: 'Risk', description: 'Basic coverage for trips with transfer, luggage and medical contingencies.', ctaLabel: 'Review insurance options', href: '/travel-deals?utm_source=archi&utm_medium=article_affiliate&utm_campaign=siena_budget_and_meal_planning' },
        ],
      },
    }
  ),
  A(
    'siena-food-that-fits-a-budget',
    'Siena Eating Cheap and Good: Budget-Friendly Local Food Guide',
    'Food & drink', 'Siena',
    'A concrete way to eat well in Siena without paying every time you sit down.',
    'https://images.unsplash.com/photo-1527515545088-6dfde8f3b7f0?auto=format&fit=crop&w=1600&q=75',
    [
      { id: 'smart-ordering', heading: 'Order with the right anchor', body: 'Start with a simple soup or house wine, then one full pasta, then one dessert or gelato.' },
      { id: 'best-time-spots', heading: 'Timing lowers cost', body: 'Early lunch, fixed dinner windows, and a dessert-only stop can cut unnecessary add-ons.' },
      { id: 'where-to-look', heading: 'Location strategy', body: 'Main-square spots cost more. Walk 5–10 blocks and use menu language as a quick value filter.' },
      { id: 'cashless-tips', heading: 'Simple payment logic', body: 'Use one card and one budget cap for each block. Keep 5–8% buffer for cover charge or service variability.' },
    ],
    [
      { q: 'Is a seated meal always expensive?', a: 'Usually yes. The same food may be cheaper standing/bar style nearby.' },
      { q: 'What should we avoid if we have a budget?', a: 'Skip wine-heavy add-ons and avoid dessert in every stop.' },
    ],
    '2026-07-03',
    {
      monetization: {
        booking: {
          heading: 'Need a meal plan for your exact dates?',
          description: 'Share your dining budget and party size for tailored restaurant and area suggestions.',
          linkText: 'Get budget dining suggestions',
          linkHref: '/contact',
          linkTone: 'primary',
          leadSubjectHint: 'Budget dining guide for Siena',
        },
        affiliates: [
          { title: 'Dining guides and local booking options', provider: 'Dining', tag: 'Restaurants', description: 'Reserve tables and avoid long waits on busy meal slots.', ctaLabel: 'See dining resources', href: '/travel-deals?utm_source=archi&utm_medium=article_affiliate&utm_campaign=siena_food_that_fits_a_budget' },
          { title: 'Local experiences and food walks', provider: 'Tours', tag: 'Experiences', description: 'Small-group tastings and guided neighborhood food walks.', ctaLabel: 'See Siena food options', href: '/travel-deals?utm_source=archi&utm_medium=article_affiliate&utm_campaign=siena_food_that_fits_a_budget' },
        ],
      },
    }
  ),
  A(
    'siena-day-trips-without-a-car',
    'Siena Day Trips Without a Car',
    'Day trips', 'Siena',
    'A clean list of day trips you can do from Siena using train and bus logic, not a rental.',
    'https://images.unsplash.com/photo-1602002418082-5f3d5d8df4f8?auto=format&fit=crop&w=1600&q=75',
    [
      { id: 'best-matches', heading: 'Best trips without a vehicle', body: 'Montepulciano, San Gimignano and Monticchiello are easiest with public transport or guided shuttle.' },
      { id: 'day-start', heading: 'Departure windows', body: 'Start earlier for train-dependent routes and use one fixed fallback plan if service changes.' },
      { id: 'bookings', heading: 'Booking sequence', body: 'Book the outbound first, then choose one flexible return window. Keep snacks and paper maps for station transitions.' },
      { id: 'why-no-car', heading: 'Why this is often cheaper', body: 'Parking fees and traffic stress often exceed comfort gain from a day rental, unless group size is high.' },
    ],
    [
      { q: 'Can I do Val d’Orcia without a car?', a: 'Yes, but choose guided options and one fixed return slot to stay comfortable.' },
      { q: 'What if one service is delayed?', a: 'Keep one backup activity and one indoor stop near central transport nodes.' },
    ],
    '2026-07-03',
    {
      monetization: {
        booking: {
          heading: 'Need a non-driving trip plan with Siena?',
          description: 'Send your preferred destination list and we will return a transfer-friendly day trip plan.',
          linkText: 'Send day-trip destinations',
          linkHref: '/contact',
          linkTone: 'primary',
          leadSubjectHint: 'Day trips from Siena without a car',
        },
        affiliates: [
          { title: 'Train and bus routes for Siena day trips', provider: 'Rail', tag: 'Transport', description: 'Fast checks for route options that align with your city-based schedule.', ctaLabel: 'Check transport options', href: '/travel-deals?utm_source=archi&utm_medium=article_affiliate&utm_campaign=siena_day_trips_without_a_car' },
          { title: 'Guided Siena day-tour alternatives', provider: 'Tours', tag: 'Tours', description: 'Short guided departures with low coordination overhead.', ctaLabel: 'Review guided options', href: '/travel-deals?utm_source=archi&utm_medium=article_affiliate&utm_campaign=siena_day_trips_without_a_car' },
        ],
      },
    }
  ),
  A(
    'siena-weather-and-what-to-pack',
    'Siena Weather by Season: What to Pack and Why',
    'Packing', 'Siena',
    'A practical season guide for Siena weather in 2026 planning windows, with clear packing logic for each season.',
    'https://images.unsplash.com/photo-1472396961693-142e6e269027?auto=format&fit=crop&w=1600&q=75',
    [
      { id: 'spring', heading: 'Spring (March–May)', body: 'Mild days, occasional rain, and uneven walk surfaces. Bring layered layers, a rain shell, and fast-dry shoes.' },
      { id: 'summer', heading: 'Summer (June–August)', body: 'Heat can be high midday. Prioritise hydration, shade windows, and a light cap strategy for museum exits.' },
      { id: 'autumn', heading: 'Autumn (September–November)', body: 'Balanced weather, often best value, still walkable. Add a warmer shell for evening streets and churches.' },
      { id: 'winter', heading: 'Winter (November–February)', body: 'Shorter daylight, colder mornings, and occasional rain/sleet. Keep electronics dry and carry indoor backup plans.' },
      { id: 'siena-checklist', heading: 'Quick Siena packing checklist', body: 'Walking shoes, compact umbrella, reusable bottle, power bank, printed itinerary, and local transport fallback card.' },
    ],
    [
      { q: 'Do I need warm layers in summer?', a: 'For daytime maybe not, but evenings and high walls are usually cooler. A light jumper helps.' },
      { q: 'Is rain common?', a: 'Less than in coastal Italy, but showers are common in shoulders. A compact rain layer is worth the space.' },
    ],
    '2026-07-03',
    {
      monetization: {
        booking: {
          heading: 'Need help matching booking dates to weather season?',
          description: 'Share travel month and trip duration for a practical date and gear recommendation.',
          linkText: 'Build a season-ready trip',
          linkHref: '/contact',
          linkTone: 'primary',
          leadSubjectHint: 'Siena weather + booking planning',
        },
        affiliates: [
          { title: 'Travel gear for Siena city walks', provider: 'Gear', tag: 'Accessories', description: 'Compact packing essentials for uneven streets and changing weather.', ctaLabel: 'See packing options', href: '/travel-deals?utm_source=archi&utm_medium=article_affiliate&utm_campaign=siena_weather_and_what_to_pack' },
          { title: 'Reliable eSIM and connectivity', provider: 'Connectivity', tag: 'Tech', description: 'Keep maps and bookings available even when roaming is weak.', ctaLabel: 'Compare connectivity options', href: '/travel-deals?utm_source=archi&utm_medium=article_affiliate&utm_campaign=siena_weather_and_what_to_pack' },
        ],
      },
    }
  ),
  A(
    'siena-tours-and-classes-to-book-first',
    'Siena Tours to Book First (and What to Skip)',
    'Experiences', 'Siena',
    'A fast ranking of Siena experiences by value, crowd management, and booking urgency for realistic budgets.',
    'https://images.unsplash.com/photo-1592919505781-2f6f0f1dc9dd?auto=format&fit=crop&w=1600&q=75',
    [
      { id: 'book-first', heading: 'Must-book items', body: 'For peak months, book museum-heavy afternoons and guided experiences tied to specific time slots at least 4–6 weeks early.' },
      { id: 'book-late', heading: 'Can-wait items', body: 'Food walks and flexible countryside tours often perform better with 1–3 weeks or on-site booking within open windows.' },
      { id: 'budget-priority', heading: 'Budget-aware priority', body: 'If your budget is tight, prioritise one signature paid experience and let two others be free or walkable.' },
      { id: 'experience-fit', heading: 'Match to traveler profile', body: 'Family groups with kids usually perform better with one short experiential block and one short guided option than two long tours.' },
    ],
    [
      { q: 'Which is highest priority to book first?', a: 'Choose one time-sensitive item first, especially in July/August and during major events.' },
      { q: 'Should I prebook parking and tours together?', a: 'Only if you travel with luggage-heavy groups; otherwise prebook one, keep the other flexible.' },
    ],
    '2026-07-03',
    {
      monetization: {
        booking: {
          heading: 'Need prebooking help for Siena experiences?',
          description: 'Share your dates and interests; we will rank the highest-value experiences for your plan.',
          linkText: 'Prioritise my Siena booking list',
          linkHref: '/contact',
          linkTone: 'primary',
          leadSubjectHint: 'Siena experiences prebooking',
        },
        affiliates: [
          { title: 'Guided Siena experience marketplaces', provider: 'Tours', tag: 'Tours', description: 'Compare guide options and timing with clear cancellation rules.', ctaLabel: 'Check experience links', href: '/travel-deals?utm_source=archi&utm_medium=article_affiliate&utm_campaign=siena_tours_and_classes_to_book_first' },
          { title: 'Attraction entry and skip-the-line tools', provider: 'Tickets', tag: 'Attractions', description: 'Fast planning for high-demand sights near city peak times.', ctaLabel: 'Check attraction tools', href: '/travel-deals?utm_source=archi&utm_medium=article_affiliate&utm_campaign=siena_tours_and_classes_to_book_first' },
        ],
      },
    }
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
  A(
    'best-things-to-do-in-florence',
    'Best Things to Do in Florence for First-Time Visitors',
    'Things to do', 'Florence',
    'A practical, opinionated shortlist for a first visit to Florence — what to prioritise, what to skip, and how to time the crowds.',
    'https://images.unsplash.com/photo-1543429776-2782fc8e1acd?auto=format&fit=crop&w=1600&q=75',
    [
      { id: 'why-florence', heading: 'The cradle of the Renaissance', body: 'Florence is dense. It holds an overwhelming amount of art in a very small footprint. Do not try to see everything; pick two major museums and spend the rest of your time eating and walking.' },
      { id: 'uffizi', heading: '1. The Uffizi Gallery', body: 'Book tickets months in advance. Go early in the morning to beat the worst of the crowds.' },
      { id: 'duomo', heading: '2. Florence Cathedral (Il Duomo)', body: 'You can admire the outside for free. Climbing the dome requires booking well in advance.' },
    ],
    [
      { q: 'Is one day enough for Florence?', a: 'No. You need at least three days to see the highlights without burning out.' },
    ],
    '2026-07-03'
  ),
  A(
    'rome-3-day-itinerary',
    'Rome 3-Day Itinerary: The Classic Route',
    'Itineraries', 'Rome',
    'A well-paced three-day plan for Rome that balances the Vatican, the Colosseum, and proper pasta.',
    'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=1600&q=75',
    [
      { id: 'day-1', heading: 'Day 1 — Ancient Rome', body: 'Start early at the Colosseum, Roman Forum, and Palatine Hill. Spend the evening in Monti for dinner.' },
      { id: 'day-2', heading: 'Day 2 — The Vatican', body: 'Vatican Museums and St. Peter\'s Basilica. Walk to Castel Sant\'Angelo in the afternoon.' },
      { id: 'day-3', heading: 'Day 3 — The Historic Center', body: 'Pantheon, Trevi Fountain, Spanish Steps, and Piazza Navona. End with dinner in Trastevere.' },
    ],
    [
      { q: 'Can I do Rome in one day?', a: 'Only if you want to be exhausted. Three days is the absolute minimum.' },
    ],
    '2026-07-03'
  ),
  A(
    'paris-3-day-itinerary',
    'Paris 3-Day Itinerary: The First-Timer Route',
    'Itineraries', 'Paris',
    'A realistic, highly walkable three-day plan for Paris that balances world-class museums with slow café afternoons.',
    'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=1600&q=75',
    [
      { id: 'day-1', heading: 'Day 1 — The Classic Centre', body: 'Start early at the Louvre (book 1st slot). Walk the Tuileries Garden to Place de la Concorde. Cross to the Left Bank for lunch in Saint-Germain-des-Prés. Sunset at the Eiffel Tower (Trocadéro view).' },
      { id: 'day-2', heading: 'Day 2 — Art & The Latin Quarter', body: 'Morning at Musée d’Orsay. Lunch in the Latin Quarter. Afternoon exploring the Pantheon and the Luxembourg Gardens. Evening wine bar near Canal Saint-Martin.' },
      { id: 'day-3', heading: 'Day 3 — Montmartre & Le Marais', body: 'Early morning in Montmartre (Sacré-Cœur) before the crowds. Afternoon shopping, eating, and gallery-hopping in Le Marais. Farewell dinner in a classic bistro.' },
    ],
    [
      { q: 'Is three days enough for Paris?', a: 'It covers the highlights, but you will leave wanting more. Four or five days is ideal.' },
      { q: 'Should I buy the Paris Museum Pass?', a: 'If you plan to visit the Louvre, Orsay, and Versailles, yes. Otherwise, buy individual timed tickets.' },
    ],
    '2026-07-03'
  ),
  A(
    'where-to-stay-in-paris',
    'Where to Stay in Paris: A Neighborhood Guide',
    'Planning', 'Paris',
    'Paris is a collection of villages. Here is how to pick the right arrondissement for your budget and travel style.',
    'https://images.unsplash.com/photo-1522199755839-a2bacb67c546?auto=format&fit=crop&w=1600&q=75',
    [
      { id: 'marais', heading: 'Le Marais (3rd & 4th Arr.)', body: 'Best for: First-timers, foodies, and boutique shoppers. Pros: Highly walkable, beautiful architecture, buzzing on Sundays. Cons: Expensive.' },
      { id: 'saint-germain', heading: 'Saint-Germain-des-Prés (6th Arr.)', body: 'Best for: Classic Parisian elegance. Pros: Iconic cafés (Les Deux Magots), Luxembourg Gardens nearby. Cons: Very expensive, can feel tourist-heavy.' },
      { id: 'montmartre', heading: 'Montmartre (18th Arr.)', body: 'Best for: Romantics and budget travelers. Pros: Village feel, incredible views, cheaper. Cons: Lots of stairs, requires Metro to reach the center.' },
      { id: 'canal', heading: 'Canal Saint-Martin (10th Arr.)', body: 'Best for: Young travelers and second-time visitors. Pros: Great coffee scene, natural wine bars, few tourists. Cons: Less classic architecture.' },
    ],
    [
      { q: 'Which arrondissement is best for families?', a: 'The 6th (near Luxembourg Gardens) or the 7th (near the Eiffel Tower) are safe, quiet, and have great parks.' },
    ],
    '2026-07-03'
  ),
  A(
    'rome-3-day-itinerary',
    'Rome 3-Day Itinerary: The Classic Route',
    'Itineraries', 'Rome',
    'A well-paced three-day plan for Rome that balances the Vatican, the Colosseum, and proper pasta.',
    'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=1600&q=75',
    [
      { id: 'day-1', heading: 'Day 1 — Ancient Rome', body: 'Start early at the Colosseum, Roman Forum, and Palatine Hill. Spend the evening in Monti for dinner.' },
      { id: 'day-2', heading: 'Day 2 — The Vatican', body: 'Vatican Museums and St. Peter\'s Basilica. Walk to Castel Sant\'Angelo in the afternoon.' },
      { id: 'day-3', heading: 'Day 3 — The Historic Center', body: 'Pantheon, Trevi Fountain, Spanish Steps, and Piazza Navona. End with dinner in Trastevere.' },
    ],
    [
      { q: 'Can I do Rome in one day?', a: 'Only if you want to be exhausted. Three days is the absolute minimum.' },
    ],
    '2026-07-03'
  ),
  A(
    'paris-3-day-itinerary',
    'Paris 3-Day Itinerary: The First-Timer Route',
    'Itineraries', 'Paris',
    'A realistic, highly walkable three-day plan for Paris that balances world-class museums with slow café afternoons.',
    'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=1600&q=75',
    [
      { id: 'day-1', heading: 'Day 1 — The Classic Centre', body: 'Start early at the Louvre (book 1st slot). Walk the Tuileries Garden to Place de la Concorde. Cross to the Left Bank for lunch in Saint-Germain-des-Prés. Sunset at the Eiffel Tower (Trocadéro view).' },
      { id: 'day-2', heading: 'Day 2 — Art & The Latin Quarter', body: 'Morning at Musée d\'Orsay. Lunch in the Latin Quarter. Afternoon exploring the Pantheon and the Luxembourg Gardens. Evening wine bar near Canal Saint-Martin.' },
      { id: 'day-3', heading: 'Day 3 — Montmartre & Le Marais', body: 'Early morning in Montmartre (Sacré-Cœur) before the crowds. Afternoon shopping, eating, and gallery-hopping in Le Marais. Farewell dinner in a classic bistro.' },
    ],
    [
      { q: 'Is three days enough for Paris?', a: 'It covers the highlights, but you will leave wanting more. Four or five days is ideal.' },
      { q: 'Should I buy the Paris Museum Pass?', a: 'If you plan to visit the Louvre, Orsay, and Versailles, yes. Otherwise, buy individual timed tickets.' },
    ],
    '2026-07-03'
  ),
  A(
    'where-to-stay-in-paris',
    'Where to Stay in Paris: A Neighborhood Guide',
    'Planning', 'Paris',
    'Paris is a collection of villages. Here is how to pick the right arrondissement for your budget and travel style.',
    'https://images.unsplash.com/photo-1522199755839-a2bacb67c546?auto=format&fit=crop&w=1600&q=75',
    [
      { id: 'marais', heading: 'Le Marais (3rd & 4th Arr.)', body: 'Best for: First-timers, foodies, and boutique shoppers. Pros: Highly walkable, beautiful architecture, buzzing on Sundays. Cons: Expensive.' },
      { id: 'saint-germain', heading: 'Saint-Germain-des-Prés (6th Arr.)', body: 'Best for: Classic Parisian elegance. Pros: Iconic cafés (Les Deux Magots), Luxembourg Gardens nearby. Cons: Very expensive, can feel tourist-heavy.' },
      { id: 'montmartre', heading: 'Montmartre (18th Arr.)', body: 'Best for: Romantics and budget travelers. Pros: Village feel, incredible views, cheaper. Cons: Lots of stairs, requires Metro to reach the center.' },
      { id: 'canal', heading: 'Canal Saint-Martin (10th Arr.)', body: 'Best for: Young travelers and second-time visitors. Pros: Great coffee scene, natural wine bars, few tourists. Cons: Less classic architecture.' },
    ],
    [
      { q: 'Which arrondissement is best for families?', a: 'The 6th (near Luxembourg Gardens) or the 7th (near the Eiffel Tower) are safe, quiet, and have great parks.' },
    ],
    '2026-07-03'
  ),
  A(
    'where-to-stay-in-venice',
    'Where to Stay in Venice — A Neighborhood Guide for First-Time Visitors',
    'Where to stay', 'Italy',
    'The three best districts to base yourself in Venice — whether you are visiting for the first time or returning to fall in love again.',
    'https://images.unsplash.com/photo-1514890547357-a9ee288728e0?auto=format&fit=crop&w=1600&q=75',
    [
      { id: 'intro', heading: 'Navigating Venice', body: 'Venice is not a city you navigate with logic. It is a city you navigate with surrender — turning left when the alley narrows, crossing a bridge because the light on the water looked interesting, and arriving somewhere you never planned to be. This is precisely why choosing the right neighborhood matters more here than in almost any other European city.\n\nThere are no cars in Venice. No buses weaving through traffic. Your legs and the vaporetto (water bus) are your only options. Stay in the wrong area, and you will spend your entire trip dragging luggage over bridges and fighting crowds near San Marco. Stay in the right area, and Venice will feel like a secret told only to you.' },
      { id: 'san-polo', heading: 'San Polo — For the Traveler Who Wants Everything Within Reach', body: 'San Polo sits in the belly of Venice, curled around the western end of the Rialto Bridge. It is the oldest sestiere in the city, and it feels that way — not tired, but layered, like a painting with centuries of brushstrokes still visible beneath the surface.\n\nThis is where you will find the Rialto Market, where fishermen have sold the morning catch since the 11th century. The stalls overflow with clams, sardines, and soft-shell crabs still twitching from the lagoon. By 8 a.m., local nonnas are already negotiating prices. By noon, the market is packed away as if it never existed.\n\nHotels in San Polo range from converted palazzos with original frescoed ceilings to small family-run guesthouses tucked above bakeries. Budget travelers will find more affordable options here compared to San Marco, while still being a five-minute walk from the Grand Canal. If you want a neighborhood that is unmistakably Venetian but still convenient, San Polo is the answer.' },
      { id: 'dorsoduro', heading: 'Dorsoduro — For the Traveler Who Craves Beauty and Quiet', body: 'Dorsoduro is the art district. The Peggy Guggenheim Collection sits here, along with the Gallerie dell\'Accademia and a handful of smaller galleries that most tourists never find. But what makes Dorsoduro special is not the museums — it is the light.\n\nBecause Dorsoduro faces south across the Giudecca Canal, it catches the afternoon sun in a way that makes the ochre and terracotta facades glow as if lit from within. The Zattere promenade, a long waterfront walkway, is the single best place in Venice to sit with a spritz and watch cargo ships glide past in slow motion.\n\nAccommodation in Dorsoduro tends to attract a slightly older, more culturally inclined crowd. You will find elegant boutique hotels, artist residences converted into B&Bs, and a few well-kept Airbnbs with canal views that cost half of what you would pay in San Marco. The neighborhood is walkable, calm after dark, and close to the Accademia Bridge — your gateway to the rest of the city.\n\nIf Venice were a novel, Dorsoduro would be the chapter you keep re-reading.' },
      { id: 'cannaregio', heading: 'Cannaregio — For the Traveler on a Budget Who Wants Authenticity', body: 'Cannaregio is where Venetians actually live. This is the largest sestiere by population, and the further north you walk from the train station, the quieter it becomes. Streets empty out. The souvenir shops vanish. You begin to hear laundry flapping above your head and smell someone\'s grandmother\'s ragù simmering through an open window.\n\nThe Jewish Ghetto — the world\'s first, established in 1516 — is located in Cannaregio, and it remains one of the most atmospheric and historically significant corners of the city. The synagogues here are still active, and the small kosher restaurants serve cicchetti (Venetian tapas) that rival anything near the Rialto.\n\nHotels in Cannaregio offer the best value in Venice. You can find clean, well-located three-star hotels for under 100 euros per night in shoulder season — a price that would be unthinkable in San Marco or near the Piazza. The trade-off is a slightly longer walk to the major sights, but the vaporetto stops along the Fondamenta Nuove connect you to Murano, Burano, and the rest of Venice within minutes.' },
      { id: 'advice', heading: 'Our Advice', body: 'For first-time visitors: start in San Polo. For couples seeking romance: choose Dorsoduro. For budget travelers and repeat visitors: Cannaregio will reward your curiosity.\n\nNo matter where you stay, book a hotel with a view of water — even if it is just a narrow canal visible from your bathroom window. In Venice, the water is the point.' }
    ],
    [
      { q: 'Is it hard to walk with luggage in Venice?', a: 'Yes. There are over 400 bridges in Venice, and most have steps. Pack light or book a hotel close to a vaporetto stop.' }
    ],
    '2026-07-04'
  ),
  A(
    'perfect-3-day-rome-itinerary',
    'The Perfect 3-Day Rome Itinerary — What to See, Skip, and Savor',
    'Itineraries', 'Italy',
    'Three days in Rome is not enough to see everything, but it is exactly enough to see the things that matter.',
    'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=1600&q=75',
    [
      { id: 'intro', heading: 'Rome does not do subtlety', body: 'This is a city that built a 50,000-seat amphitheater for entertainment, covered its churches in gold leaf, and invented a fountain so extravagant that it takes up an entire piazza. Rome wants to be seen. Your job, as a visitor, is simply to show up — and to plan your days well enough that you are not too exhausted to appreciate what you are looking at.\n\nThree days in Rome is not enough to see everything. It is, however, exactly enough to see the things that matter — and to eat well while doing it.' },
      { id: 'day-1', heading: 'Day 1 — Ancient Rome and the Colosseum Quarter', body: 'Start early. The Colosseum opens at 9 a.m., and the line begins forming at 8. Buy your tickets online in advance. Enter the Colosseum first, spend 60 to 90 minutes inside, then walk directly into the Roman Forum through the connecting path.\n\nThe Forum is where most visitors make their first mistake: they rush through it. Do not. This was the political, religious, and commercial heart of the Roman Empire.\n\nFor lunch, walk ten minutes south to the Celio neighborhood. Trattoria Luzzi on Via di San Giovanni in Laterano has been serving enormous plates of cacio e pepe to locals and savvy tourists for decades.\n\nSpend the afternoon at the Capitoline Museums (Musei Capitolini), a short walk from the Forum. It is far less crowded than the Vatican Museums, and many travelers consider it the better collection.' },
      { id: 'day-2', heading: 'Day 2 — Vatican City and Trastevere', body: 'The Vatican demands a full morning. Arrive at the Vatican Museums by 8 a.m. The Sistine Chapel is at the very end of the museum route, which means you will walk through nearly two kilometers of galleries before reaching Michelangelo\'s ceiling.\n\nAfter the Sistine Chapel, walk directly into St. Peter\'s Basilica through the internal connecting door (this saves you from re-entering through the main security line outside). Climb the dome for the best panoramic view in Rome.\n\nFor lunch, cross the Tiber River and head to Trastevere. This neighborhood feels like a small village trapped inside a major capital. Try Da Enzo al 29 for the best carbonara in the city.\n\nSpend the afternoon wandering Trastevere without a plan.' },
      { id: 'day-3', heading: 'Day 3 — Baroque Rome, Fountains, and Piazzas', body: 'Your final day belongs to the Rome that exists between the monuments: the piazzas, the fountains, the espresso bars, and the gelato shops.\n\nStart at the Trevi Fountain before 8 a.m. — it is the only way to see it without five hundred other people in your photograph. Throw a coin over your left shoulder with your right hand.\n\nWalk to the Spanish Steps, then continue north to the Borghese Gardens. If you have pre-booked tickets (mandatory), visit the Galleria Borghese.\n\nFor your final Roman lunch, walk to the Pantheon. The building itself is free to enter and remains the best-preserved structure from ancient Rome. Sit in the Piazza della Rotonda afterward and order one last plate of pasta.' }
    ],
    [
      { q: 'Is the Roma Pass worth it?', a: 'A 72-hour Roma Pass costs 52 euros and includes free entry to your first two museums and unlimited public transport. It is usually worth it if you plan to visit the Colosseum and Borghese Gallery.' }
    ],
    '2026-07-04'
  ),
  A(
    'florence-travel-budget-guide',
    'How Much Does Florence Really Cost? A Practical Budget Guide',
    'Budget planning', 'Italy',
    'A realistic breakdown of what Florence costs today — from budget hostels to luxury hotels, plus money-saving tips.',
    'https://images.unsplash.com/photo-1543429776-2782fc8e1acd?auto=format&fit=crop&w=1600&q=75',
    [
      { id: 'intro', heading: 'Florence is smaller than you think', body: 'You can walk from one end of the historic center to the other in about twenty minutes, which means you will spend less on transport and more on the things that actually matter — the food, the art, and the leather jacket you swore you would not buy but absolutely will.\n\nThe good news is that Florence is significantly cheaper than Rome or Venice for accommodation and dining. Here is what Florence actually costs, broken down by budget level.' },
      { id: 'budget', heading: 'Budget Traveler — €65 to €90 per day', body: 'A bed in a well-reviewed hostel runs €25 to €40 per night. Private rooms in basic guesthouses start around €50 to €70.\n\nFor food, eat where the students eat. The area around San Lorenzo and Sant\'Ambrogio is filled with trattorias serving three-course lunch menus for €10 to €13.\n\nFor breakfast, do what locals do: stand at a bar counter, order a cornetto and a caffè, pay €2.50, and leave. Sitting down often doubles the price.' },
      { id: 'mid-range', heading: 'Mid-Range Traveler — €130 to €180 per day', body: 'A double room in a three-star hotel in the Oltrarno district costs €90 to €140 per night.\n\nLunch at a proper trattoria costs €20 to €30 per person. Dinner at one of the city\'s beloved neighborhood restaurants runs €30 to €45, including wine.\n\nThe mid-range traveler should budget for two or three paid museums: the Uffizi (€25), the Accademia Gallery (€16), and the Palazzo Pitti (€15). Book online to avoid queues.' },
      { id: 'luxury', heading: 'Luxury Traveler — €350 and above per day', body: 'Florence has some of the most beautiful boutique hotels in Europe. A luxury room starts around €400 per night.\n\nDining at this level is an event. The best meal you will eat might be a €60 bistecca alla fiorentina (Florentine T-bone steak) at a traditional steakhouse.\n\nFor a unique luxury experience, book a private after-hours tour of the Vasari Corridor.' },
      { id: 'tips', heading: 'Money-Saving Tips for All Budgets', body: '• Water is free. Ask for "acqua del rubinetto" (tap water) at restaurants.\n• Aperitivo culture is your secret weapon. Many bars offer a free buffet of pasta and snacks when you order a drink between 6 and 9 p.m.\n• Avoid restaurants with photos on the menu. Photos mean tourist prices and tourist quality.' }
    ],
    [],
    '2026-07-04'
  ),
  A(
    'amalfi-coast-3-days-itinerary',
    '3 Days in the Amalfi Coast: The Perfect Itinerary Without a Car',
    'Itineraries', 'Italy',
    "The Amalfi Coast is one of Italy's most rewarding — and most punishing — destinations. Skip the rental car entirely: ferries, SITA buses, and your own two feet will get you further.",
    'https://images.unsplash.com/photo-1533676802871-eca1ae998cd5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    [
      { id: 'introduction', heading: 'Why you don\'t need a car', body: 'Let\'s be direct about something the Instagram posts never show: the Amalfi Coast road is a single-lane cliff-edge corridor shared by tour coaches, delivery vans, and approximately ten thousand other tourists who also rented a Fiat 500. In July and August, it grinds to a complete standstill. Drivers have been known to wait two hours to move four kilometres.\n\nThe good news is that you don\'t need a car here — and in fact, travelling without one gives you a cleaner, more fluid experience. The coast runs on a network of SITA buses and public ferries that connect every major town. You walk the staircases that slice between villages, board a ferry like a local, and arrive at Ravello without having white-knuckled your way up a cliff road.' },
      { id: 'basecamp', heading: 'Basecamp: Sorrento vs Positano', body: 'Choosing your base is the single most important logistical decision of your trip. Two towns make the most sense as operational headquarters.\n\nSorrento is the practical choice. It sits at the top of the Sorrentine Peninsula, connected directly to Naples by the Circumvesuviana train. From Sorrento, SITA buses run along the entire Amalfi Drive. It has a broader range of hotels at every price point, but you will spend time in transit each day.\n\nPositano is the immersive choice. It is vertical, photogenic, and expensive. You are on the coast, not near it. Ferries to Amalfi town and Capri depart from the dock below. If your budget allows and you have a flexible travel schedule, base yourself in Positano. If you\'re cost-conscious or connecting to/from Naples with luggage, Sorrento is the smarter call.' },
      { id: 'day-1', heading: 'Day 1: Arrival and Orientation', body: 'Arrive before noon if possible. Check in, leave your bags, and resist the temptation to do too much. The coast will exhaust anyone who tries to sprint through it.\n\nIf you\'re based in Positano: Walk the two main pedestrian staircases — Via dei Mulini down to Spiaggia Grande, then back up via Via Cristoforo Colombo. You\'ll learn the geography instinctively within an hour.\n\nFor dinner, walk away from the beach. In Positano, the restaurants on the upper streets are meaningfully better value. In Sorrento, avoid Piazza Tasso entirely and head to the streets behind the Sedile Dominova. Reserve dinner in advance during June–September.' },
      { id: 'day-2', heading: 'Day 2: Amalfi Town and Ravello', body: 'Today is about Amalfi town and the hill town of Ravello. Take the ferry from your base (Positano or Sorrento) to Amalfi rather than the bus. The journey by sea takes approximately 35–40 minutes from Positano and removes you entirely from the road traffic. It also gives you a perspective of the coastline that no road can replicate.\n\nAmalfi is a working town. The Duomo di Sant\'Andrea dominates the main piazza. Walk into the paper museum (Museo della Carta) on Via delle Cartiere. After two hours, catch the SITA bus from Amalfi to Ravello (25 minutes).\n\nRavello sits 350 metres above sea level. Villa Cimbrone is the essential stop. The gardens extend to a cliff-edge terrace — the Belvedere of Infinity — from which the coastline spreads in both directions below you. Return to Amalfi by bus, then take the afternoon ferry back to your base.' },
      { id: 'day-3', heading: 'Day 3: The Path of the Gods', body: 'The Sentiero degli Dei — Path of the Gods — is a 7.8km trail running along the ridge above the coast between Agerola and Nocelle. It is the definitive physical experience of the Amalfi Coast.\n\nWalk from Agerola to Nocelle (west to east), finishing above Positano. This way you descend toward the coast rather than away from it. Take the SITA bus from Amalfi or Praiano to Agerola to start. Begin walking no later than 8:00am in summer. The trail is exposed and offers no shade after mid-morning.\n\nWear proper walking shoes. The path is beautiful and completely unforgiving of wrong footwear. Bring 1.5 litres of water minimum per person. Allow 3.5–4.5 hours walking, plus transit.' },
      { id: 'transport-cheat-sheet', heading: 'Transport Cheat Sheet', body: 'SITA Buses run the entire Amalfi Drive between Sorrento and Salerno. Purchase tickets at tabacchi or bars before boarding — do not board without a ticket. In July and August, buses are routinely overcrowded and delayed.\n\nFerries run between Sorrento, Positano, Amalfi, and Salerno. Take the ferry when travelling between towns on the coast. Check traghettiamalfi.it for timetables. Services are weather-dependent. During peak season, popular morning departures sell out, so book online the day before.\n\nFor inland destinations like Ravello or Agerola, the bus is your only practical option.' }
    ],
    [
      { q: 'Is the Amalfi Coast expensive?', a: 'Yes. Positano in particular operates at a significant premium. Budget travellers can manage by basing themselves in Sorrento, using SITA buses, and avoiding waterfront restaurants.' },
      { q: 'When is the best time to visit?', a: 'May and late September are optimal. Temperatures are warm, the sea is swimmable, and the worst of the summer crowds have not yet arrived.' },
      { q: 'How many days do I actually need on the Amalfi Coast?', a: 'Three days gives you meaningful coverage of the main towns and one hiking day. Anything under two nights is a day trip, not an itinerary.' }
    ],
    '2026-07-05'
  ),
  A(
    'italy-train-travel-guide',
    'How to Travel Italy by Train: A Complete Guide to Trenitalia & Italo',
    'Travel Tips', 'Italy',
    "Italy's train network connects Rome, Florence, Venice, and Milan in hours — faster, cheaper, and far less stressful than flying or driving. Here's how to use it properly.",
    'https://images.unsplash.com/photo-1549448057-010eeb95c96b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    [
      { id: 'introduction', heading: 'Why the train wins', body: 'The case for flying between Italian cities collapses quickly when you do the actual arithmetic. A flight from Rome to Milan takes about an hour in the air — but add two hours at Fiumicino before boarding, thirty minutes to retrieve luggage, another forty minutes on the Malpensa Express into the city, and you have a four-hour ordeal that costs more than a Frecciarossa ticket.\n\nRenting a car fares no better. The autostrada tolls are expensive, Italian city centres are largely inaccessible to non-resident vehicles, parking is a negotiation with fate, and the urban one-way street systems have undone experienced drivers from twenty different countries.\n\nThe train, by contrast, connects city centre to city centre. Rome Termini to Milano Centrale in three hours. Florence Santa Maria Novella to Venice Santa Lucia in two hours and ten minutes. You board in the middle of one city and step out in the middle of another, ready to walk to your hotel.' },
      { id: 'trenitalia-vs-italo', heading: 'Trenitalia vs. Italo: Which Operator to Use', body: 'Italy has two separate high-speed rail operators running on the same tracks in direct competition with each other. This is unusual globally, and it works to your advantage.\n\nTrenitalia is the state-owned national railway. It operates the full spectrum of Italian rail — from the flagship Frecciarossa high-speed services between major cities down to the slow regional trains. If you are travelling anywhere that isn\'t a major city, Trenitalia is your only option.\n\nItalo is a private high-speed operator, running exclusively between major Italian cities. On the routes where it does compete (Rome–Florence–Milan being the primary corridor), Italo is frequently cheaper and the onboard experience is considered slightly more refined.\n\nUse Trenitalia when travelling to smaller cities and towns. Use Italo when travelling the major Rome–Florence–Milan–Venice corridor and you want to compare prices. Always check both operators before booking.' },
      { id: 'high-speed-network', heading: 'The High-Speed Network (Le Frecce)', body: 'Trenitalia\'s high-speed trains operate under the Le Frecce brand (The Arrows). There are three tiers.\n\nFrecciarossa (Red Arrow) is the flagship. It runs at up to 300 km/h on dedicated high-speed track. Connects Rome, Florence, Bologna, Milan, Turin, Venice, and Naples. Book as early as possible. Base fares on the Frecciarossa can drop to €19–29 on the Rome–Florence segment if booked weeks in advance.\n\nFrecciargento (Silver Arrow) runs at up to 250 km/h, using a mix of high-speed and conventional track. Connects cities not directly on the high-speed line, including Rome–Venice.\n\nFrecciabianca (White Arrow) is the slowest of the three, running on conventional track at up to 200 km/h. Serves routes along the Adriatic and Ligurian coasts that the high-speed network doesn\'t reach.' },
      { id: 'regional-trains', heading: 'Regional Trains (The Validation Rule)', body: 'Not every destination in Italy sits on a high-speed line. For smaller towns and coastal villages, the regional network takes over. Regional trains (Regionale and Regionale Veloce) are significantly slower, stop at many intermediate stations, and require no advance reservation.\n\nThe Validation Rule: On regional trains, paper tickets and tickets printed at a machine must be validated before boarding. Look for the small green or yellow validation machines at the entrance to the platforms. Insert your ticket, it gets date-stamped, and you\'re legal to board.\n\nIf you do not validate your ticket and an inspector boards, you will receive a fine. Digital tickets (purchased via app and displayed on your phone) do not require separate validation.' },
      { id: 'booking-tips', heading: 'Essential Booking Tips', body: 'Italian high-speed train tickets operate on a yield-pricing model identical to budget airlines. The cheapest fares — sold under names like Super Economy or Low Cost — are non-refundable, non-changeable, and released when booking first opens, often 90–120 days before travel.\n\nFor travel on the major Rome–Florence–Milan corridor, book 4–8 weeks in advance for a reasonable middle-ground fare. For travel in July and August specifically: book as early as possible.\n\nAvoid buying at the station on the day unless you are on a flexible fare class. Walk-up pricing on high-speed trains is punishingly expensive. You can book on the official websites (Trenitalia or Italo) or use aggregators like Trainline or Omio for price comparison.' },
      { id: 'station-navigation', heading: 'Navigating Italian Train Stations', body: 'The major Italian intercity stations — Roma Termini, Milano Centrale, Firenze Santa Maria Novella — are large and busy. Look for the large Partenze (Departures) board. Your train will be listed by departure time, destination, train number, and platform (Binario).\n\nCritical detail: the platform is not always shown until 20–30 minutes before departure. Do not go looking for your platform an hour early — it won\'t be there yet.\n\nRoma Termini in particular has a persistent pickpocket problem. Keep your bag in front of you. Do not accept help from strangers who approach you at ticket machines. If someone insists on showing you how the machine works, they are reading your PIN.' }
    ],
    [
      { q: 'Do I need to book Italy train tickets in advance?', a: 'For high-speed trains (Frecciarossa, Italo) between major cities, advance booking is strongly recommended because prices increase significantly as the departure date approaches. For regional trains serving smaller towns, advance booking is not required.' },
      { q: 'Is there luggage storage on Italian trains?', a: 'There are overhead racks and end-of-carriage luggage areas, but no formal storage rules — you are responsible for finding space for your bags. On Frecciarossa trains, the vestibule area at the end of each carriage has a dedicated luggage section.' },
      { q: 'Is first class worth it on Italian trains?', a: 'For most travellers, no. Standard class on Italian high-speed trains is modern and comfortable. The upgrade to Business or Executive becomes worthwhile primarily on the longest routes or when the price differential has narrowed to €15–20.' }
    ],
    '2026-07-05'
  ),
  A(
    'where-to-stay-in-cinque-terre',
    'Where to Stay in Cinque Terre: An Honest Village-by-Village Guide',
    'Where to stay', 'Italy',
    "Five villages. Zero cars. Hundreds of stairs. Your choice of base in Cinque Terre will make or break the trip — especially if you're travelling with luggage.",
    'https://images.unsplash.com/photo-1534008897995-27a23e859048?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    [
      { id: 'introduction', heading: 'The brutal reality of Cinque Terre', body: 'Let\'s establish something immediately: Cinque Terre is not a resort. It is five medieval fishing villages built into vertical cliffs along the Ligurian coast, connected by a regional train line, a series of hiking trails, and seasonal ferry services. There are no cars inside the villages. There are no elevators in most accommodation. There are, however, an extraordinary number of stone staircases.\n\nThis is one of Italy\'s most visited stretches of coastline, and the infrastructure has not meaningfully changed since the fishing boats outnumbered the tourists. The streets are steep, often narrow enough that two people with luggage cannot pass each other comfortably, and the train stations are rarely at the same level as the village above.\n\nA traveller who chooses the wrong village, books a hotel they haven\'t verified is accessible, and arrives with a 25-kilogram suitcase will spend the first hour of their trip red-faced and furious on a staircase rather than drinking local white wine with a view of the harbour. Each of the five villages has a distinct character, a distinct logistical profile, and a distinct type of traveller it suits best.' },
      { id: 'monterosso', heading: 'Monterosso al Mare — Best for First-Timers and Beach Lovers', body: 'Monterosso is the largest and most accessible of the five villages, and if you are visiting Cinque Terre for the first time, it is almost certainly where you should base yourself.\n\nThe train station opens directly onto the waterfront, and the old town and new town (Fegina) are connected by a tunnel. The key logistical advantage Monterosso has over every other village is simple: it has flat ground. A meaningful amount of it. The seafront promenade, the main street through the old town, and the area around the beach hotels are all navigable with wheeled luggage without requiring mountaineering ability.\n\nIt is also the only village in Cinque Terre with a proper sandy beach. Not a rocky ledge. An actual beach, with sunbeds and umbrellas available for hire. The drawback is character. Monterosso is the most developed of the five — it has the most restaurants, the most shops, and consequently the most crowds during July and August.' },
      { id: 'vernazza', heading: 'Vernazza — Best for Romance and Photography', body: 'Vernazza is arguably the most beautiful village in Cinque Terre. The harbour, the castle ruins above the waterfront, the church of Santa Margherita d\'Antiochia rising from the main piazza — it photographs exactly as it looks, which is to say, extraordinarily well.\n\nIt is also the most congested village in Cinque Terre during peak season, and the stairs here are serious. The train station sits at the edge of the village, and most accommodation requires a climb through narrow stone streets with gradient that reminds experienced hikers of actual trails. There are no flat streets of consequence in Vernazza. Every lane goes either up or down.\n\nFor a couple travelling with a single carry-on bag each, staying here in May or September is one of the more memorable experiences available in coastal Italy. Arrive in July with a large suitcase and you will have a different opinion.' },
      { id: 'manarola', heading: 'Manarola — Best for Wine and Views', body: 'Manarola has the most famous postcard shot in Cinque Terre: the view from the Via dell\'Amore promontory at dusk, looking across the harbour at the stacked coloured houses lit against the darkening sky. It is a view that has been photographed from exactly the same angle approximately 80 million times and remains genuinely worth seeing in person.\n\nThe village is also the centre of the local wine culture. The Sciacchetrà — a sweet passito wine made from the indigenous grapes grown on the terraced hillsides — is produced here with more seriousness than elsewhere in the region.\n\nThe logistical caveat: the train station at Manarola is at sea level, connected to the village above by a long tunnel and then an immediately steep incline. Getting to most accommodation requires a meaningful uphill walk. It is not as punishing as Corniglia, but it is not Monterosso either.' },
      { id: 'riomaggiore', heading: 'Riomaggiore — Best for Nightlife and Independent Travellers', body: 'Riomaggiore is the southernmost village. The village has more evening life than Manarola or Corniglia, with bars and restaurants staying open later and a generally more social atmosphere along the harbour. The main street, Via Colombo, runs steeply downhill from the station toward the water, lined with wine bars, focaccia shops, and trattorias.\n\nBe clear-eyed about the geography: arriving at the train station and reaching your accommodation in Riomaggiore involves navigating the same steep, narrow stone streets that define the rest of Cinque Terre. Wheeled luggage does not roll gracefully over cobblestones at a 20-degree incline. The station-to-harbour walk takes 10 minutes but requires physical attention.\n\nThat said, the harbour at Riomaggiore is one of the most atmospheric in the Cinque Terre, and it is a more affordable base than Vernazza or the larger hotels in Monterosso.' },
      { id: 'corniglia', heading: 'Corniglia — The One to Avoid if You Have Luggage', body: 'This section exists as a service to travellers who discover the relevant information after they have already booked, when it is significantly less useful.\n\nCorniglia is the only one of the five villages that is not directly on the water. It sits on a promontory 100 metres above sea level, and access from the train station involves either a shuttle bus (which runs on a limited and seasonally variable schedule) or the Lardarina — a long staircase of 382 steps carved into the hillside. There is no alternative route. You go up the stairs, or you wait for a bus that may not be running, or you do not go to Corniglia.\n\nThe village itself is the quietest and least commercialised of the five. If you are travelling with a single daypack and value tranquility over convenience, Corniglia rewards you. If you have a rolling suitcase, a heavy backpack, are travelling with children under 10, or have any mobility limitations, do not stay in Corniglia. This is not a nuanced recommendation — it is a logistical fact. The 382 steps are not metaphorical.' }
    ],
    [
      { q: 'Which is the quietest village in Cinque Terre?', a: 'Corniglia is the quietest by a significant margin — it receives fewer day-trippers due to its clifftop location and 382-step staircase access. Manarola is the quietest option among the waterfront villages.' },
      { q: 'Can I drive a car to Cinque Terre?', a: 'Not into the villages themselves. Private vehicle access is prohibited within all five villages. You can drive to parking areas outside Riomaggiore or Monterosso, but from the car park you still descend to the village on foot. The train remains the most practical and stress-free way to arrive.' },
      { q: 'Which Cinque Terre village is best for families with young children?', a: 'Monterosso is the clear recommendation for families. It is the only village with flat, navigable streets suitable for pushchairs, the only village with a proper sandy beach, and the most equipped with family-oriented services. The others are significantly harder to navigate with young children.' }
    ],
    '2026-07-05'
  ),
  A(
    'rome-to-venice-by-train',
    'Rome to Venice by Train: The Complete Practical Guide',
    'Logistics & Transport', 'Italy',
    "The Rome to Venice train takes under four hours, drops you at the Grand Canal, and costs less than a flight. There is no better way to make this journey.",
    'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    [
      { id: 'introduction', heading: 'Why the train beats flying', body: 'Consider what flying between Rome and Venice actually involves. You leave your hotel in central Rome and take a taxi or express train to Fiumicino, which is thirty kilometres outside the city. You arrive two hours before departure. You queue through security, board a flight that takes fifty minutes in the air, land at Marco Polo Airport on the mainland, transfer to a water bus or private boat, and arrive at your Venice hotel approximately four and a half hours after you left your Rome hotel — having paid for the airport transfers, the baggage fees, and the entirely unnecessary stress of it.\n\nNow consider the alternative. You walk to Roma Termini, which is served by metro lines A and B, dozens of bus routes, and taxis from across the city. You board a Frecciarossa or Italo high-speed train. Four hours later — having had a coffee, watched the Apennine countryside transition into the Veneto plain, and done absolutely nothing stressful — the train slides into Venezia Santa Lucia station. You step outside. You are standing on the edge of the Grand Canal.\n\nThere is no meaningful argument for flying this route. The train is faster door-to-door, cheaper in most cases, less exhausting, and ends in precisely the right place.' },
      { id: 'operators', heading: 'The High-Speed Options — Frecciarossa vs. Italo', body: 'Two operators run high-speed trains between Rome and Venice, and both are excellent. The practical difference between them is smaller than their marketing suggests.\n\nFrecciarossa is operated by Trenitalia, the state-owned national railway. On the Rome–Venice route, the Frecciarossa typically travels via Florence and Bologna. Journey time is generally between three hours and forty minutes and four hours fifteen minutes.\n\nItalo is the private high-speed operator. It runs the same corridor with comparable journey times. The onboard product is slightly different in aesthetic terms, but the seat comfort, speed, and reliability are comparable to Frecciarossa.\n\nThe booking strategy is simple: check both operators for your preferred time slot and book whichever is cheaper. Use a comparison tool to see both simultaneously. Early morning departures and late afternoon services tend to offer cheaper base fares than mid-morning trains.' },
      { id: 'departure', heading: 'Departure — Navigating Roma Termini', body: 'Roma Termini is the largest railway station in Italy and one of the busiest in Europe. Arriving without a plan costs time; arriving with one costs nothing.\n\nFind the Partenze board in the main central hall. The platform number (Binario) is often not displayed until 20 minutes before departure. This is normal. Do not stand at the platform entrance for forty-five minutes waiting for the number to appear. Wait in the main hall, watch the board, and move to the platform when the number shows.\n\nThe pickpocket situation is real. Roma Termini has a persistent and well-documented pickpocket problem. It concentrates specifically around the ticket machines, the escalators, and the metro connections. Anyone who approaches you unsolicited to "help" with the ticket machine is attempting to read your PIN or distract you.\n\nOnce your platform number appears, walk directly to it. High-speed trains board from the main platform hall.' },
      { id: 'arrival', heading: 'Arrival — Stepping Out at Venezia Santa Lucia', body: 'This section contains one critical piece of information that a meaningful number of first-time visitors to Venice get wrong, and the consequences of getting it wrong are significant.\n\nBook to Venezia Santa Lucia, not Venezia Mestre. Venezia Santa Lucia is on the island, right at the entrance to the city, with the Grand Canal immediately outside the front doors. Venezia Mestre is a separate station on the mainland, four kilometres away in an industrial area. If you disembark at Mestre, you will need to catch a regional train onward to Santa Lucia or take a taxi across the causeway.\n\nThe arrival itself is one of the few moments in European travel where the setting matches the expectation. Santa Lucia station is a 1950s modernist building that opens directly onto the Canal Grande. You walk through the station doors, descend five steps, and the Grand Canal is in front of you. From here, ACTV vaporetto Line 1 or Line 2 will take you to most hotels along the Grand Canal route.' },
      { id: 'luggage-validation', heading: 'Luggage and Ticket Validation', body: 'Luggage on high-speed trains: There is no checked luggage service on Italian high-speed trains. You bring everything on board yourself. Overhead racks accommodate most carry-on and medium-sized bags; the vestibule areas at the end of each carriage have space for larger suitcases. Arrive at the platform early enough to find good storage space.\n\nTicket validation: This is where many first-time visitors to Italy create unnecessary problems for themselves.\n\nThe rule is straightforward: high-speed train tickets (Frecciarossa, Italo) purchased digitally and displayed on your phone do not require validation. Show the QR code or booking reference to the inspector and you are compliant.\n\nPaper tickets and tickets printed at home for regional trains require stamping in the green or yellow validation machines at the platform entrance before you board. The validation rule applies to regional services — not to the high-speed trains covered by this guide.' }
    ],
    [
      { q: 'How far in advance should I book Rome to Venice train tickets?', a: 'For the best base fares, book two to four weeks in advance for standard dates. The cheapest fares are released often 90 to 120 days before travel. For travel in July and August, book as early as your plans are confirmed.' },
      { q: 'Is the train ride from Rome to Venice scenic?', a: 'Partially. The section through Tuscany between Florence and Bologna is pleasant. The arrival into Venice itself is genuinely beautiful: the train crosses the causeway over the Venetian Lagoon for the final few minutes. Sit on the left side of the train for the better lagoon view.' },
      { q: 'Is there food on the train?', a: 'Yes. Frecciarossa trains have a bar car serving coffee, sandwiches, pastries, and alcohol. Italo trains have a similar food and beverage service. The quality is adequate rather than excellent.' }
    ],
    '2026-07-06'
  ),
  A(
    'paris-to-london-by-train',
    'Paris to London by Train: The Complete Eurostar Guide',
    'Logistics & Transport', 'Europe',
    "The Eurostar connects Paris and London in 2 hours 15 minutes, city centre to city centre. It is faster, cheaper, and far less stressful than flying.",
    'https://images.unsplash.com/photo-1548625361-ecde1be1f5e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    [
      { id: 'introduction', heading: 'Why the train beats flying', body: 'Work through the actual arithmetic of flying between Paris and London. You leave central Paris and travel forty-five minutes to Charles de Gaulle — on a good day, with no traffic. You arrive two hours before departure, queue through security, and board a one-hour-fifteen-minute flight. You land at Heathrow, one of the most congested airports in Europe, and spend another forty-five minutes to an hour getting to central London. By the time you walk out onto a central London street, approximately four and a half hours have elapsed since you left your Paris hotel room.\n\nThe Eurostar takes two hours and fifteen minutes, Gare du Nord to St Pancras International. That is the complete journey time. No airport bus. No middle seat. No 100ml liquid restrictions. No baggage carousel.\n\nFor travellers who have not taken the Eurostar, the revelation tends to be that the train arrives not at some peripheral station on the outskirts of the city, but at St Pancras International in Bloomsbury — connected directly to the King\'s Cross St Pancras Underground station. You are, in practical terms, in central London the moment you step off the train.' },
      { id: 'experience', heading: 'The Eurostar Experience', body: 'The Eurostar operates through the Channel Tunnel — the 50-kilometre undersea rail tunnel connecting Folkestone in England to Coquelles in France. The journey through the tunnel itself takes approximately twenty minutes and is entirely unremarkable: it is dark. On the French side, the train runs on high-speed track at speeds up to 300 km/h.\n\nStandard class is the base fare and is perfectly comfortable. Seating is in airline-style configurations, with tables and power sockets. Standard Premier is the step up. Wider seats, a 2+1 configuration, and a meal included. Business Premier provides full flexibility on ticket changes, lounge access, and a full restaurant-standard meal service on board.\n\nFor most travellers, Standard is sufficient for a two-hour journey. Standard Premier is worth considering for early morning or late night departures.' },
      { id: 'departure', heading: 'Departure — Navigating Paris Gare du Nord', body: 'Here is the critical difference between taking the Eurostar and taking any other train in continental Europe: you must arrive significantly earlier than you would for a domestic or Schengen-area service.\n\nBecause the United Kingdom is not a member of the Schengen Area, crossing from France to the UK by Eurostar involves the full passport control and security process — equivalent to an international flight departure, conducted in Paris before you board the train. Eurostar requires passengers to check in at least thirty minutes before departure and strongly recommends arriving at the station sixty to ninety minutes before.\n\nThe UK Border Force check is conducted in Paris under a legal arrangement called "juxtaposed controls." This means that when you arrive in London, you simply walk off the train and exit the station — there is no further UK immigration processing on the British side.\n\nGare du Nord itself is one of Paris\'s most chaotic major stations. Do not navigate it for the first time with five minutes to spare.' },
      { id: 'arrival', heading: 'Arrival — Stepping Out at London St Pancras', body: 'The arrival at St Pancras International requires no further administrative processing. Because the passport and immigration procedures were completed in Paris, Eurostar passengers disembark and walk directly through the arrivals hall and out into the station concourse. There are no further border checks on the London side.\n\nSt Pancras International is a genuinely magnificent building — a restored Victorian Gothic structure with a spectacular arched train shed that serves as one of the great pieces of railway architecture in Europe.\n\nDirectly adjacent to St Pancras is King\'s Cross station, which together with St Pancras forms one of the largest transport interchanges in London. From King\'s Cross St Pancras Underground station, six London Tube lines are immediately accessible. You can be sitting in a central London hotel room approximately thirty minutes after stepping off the Eurostar.' },
      { id: 'luggage', heading: 'Luggage Rules', body: 'This is where the Eurostar creates one of its most significant and underappreciated advantages over flying.\n\nThere are no weight restrictions on Eurostar luggage. The guidance is that you should be able to lift your bags into the overhead rack yourself and that bags must not be excessively oversized, but there is no 23kg limit, no baggage fee for a second bag, and no system of oversized bag charges. You bring what you can carry. This is the correct way to manage luggage on a train.\n\nThere are no liquid restrictions. The 100ml rule that governs airport security does not apply to the Eurostar. You may pack full-sized bottles of shampoo, perfume, or toiletries. More practically, you may bring wine, spirits, or any other liquid purchases from France back to the UK in your hand luggage without confiscation.' }
    ],
    [
      { q: 'How far in advance should I book the Paris to London Eurostar?', a: 'The cheapest Standard fares are typically released six to nine months before travel and disappear quickly for popular dates. For travel in July, August, or over Christmas, booking three to four months in advance is advisable. The Eurostar pricing model rewards early commitment.' },
      { q: 'Do I need a passport for the Eurostar?', a: 'Yes. A passport is required for all Eurostar passengers, regardless of nationality. EU citizens cannot use a national ID card for travel to the UK following Brexit — a full passport is mandatory. Present your passport at both French exit controls and UK Border Force checks at Gare du Nord before departure.' },
      { q: 'Is there Wi-Fi on the Eurostar?', a: 'Yes, complimentary Wi-Fi is available on board all Eurostar services. The connection quality is generally good on the French high-speed sections and intermittent during the Channel Tunnel transit. The trains also have power sockets at table seats.' }
    ],
    '2026-07-07T18:00:00+07:00'
  ),
  A(
    'barcelona-to-madrid-train',
    'Barcelona to Madrid by Train: The Complete High-Speed Guide',
    'Logistics & Transport', 'Spain',
    "Spain's AVE connects Barcelona and Madrid in 2.5 hours, city centre to city centre. With three operators competing on price, this is Europe's best-value high-speed rail route.",
    'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    [
      { id: 'introduction', heading: 'Why the train beats flying', body: 'The case for flying between Barcelona and Madrid dissolves the moment you examine it honestly. Both cities have airports that are not in either city. El Prat is fifteen kilometres southwest of central Barcelona; Barajas is twelve kilometres northeast of central Madrid. Before you have boarded a single aircraft, you have already committed to two airport transfers.\n\nThe AVE — Alta Velocidad Española, Spain\'s high-speed rail network — covers the 621 kilometres between Barcelona Sants and Madrid Puerta de Atocha in approximately two and a half hours. The train departs from the centre of one city and arrives at the centre of the other. The journey requires no security theatre, no overhead bin competition, and no middle seat negotiation.\n\nThe flight — including the commute to El Prat, check-in, security, boarding, the one-hour-fifteen-minute flight, the commute from Barajas, and the psychological damage of budget airline travel — takes longer. Not comparable longer. Actually longer.' },
      { id: 'operators', heading: 'The Golden Age of Competition — AVE vs. Iryo vs. Ouigo', body: 'Most international tourists arrive in Spain unaware that the Barcelona–Madrid corridor is now operated by three entirely separate train companies — a development that is, for the traveller\'s wallet, entirely positive.\n\nAVE (Renfe) is the state-owned operator and the original high-speed service on this route. The fleet is modern, the service is reliable, and the timetable is the most comprehensive.\n\nIryo is the newest entrant, backed by Trenitalia. It uses Italian Frecciarossa 1000 trains, which means the onboard product is excellent. Iryo\'s pricing is competitive and frequently undercuts Renfe on equivalent time slots.\n\nOuigo España is the budget high-speed option. Fares are aggressively priced — it is not uncommon to find Barcelona–Madrid tickets for under €10 on off-peak dates if booked well in advance. The trade-off is a stricter and more airline-like experience.\n\nThe booking strategy: Use a comparison site to see all three operators simultaneously for your preferred time slot.' },
      { id: 'departure', heading: 'Departure — Navigating Barcelona Sants', body: 'Barcelona Sants is the city\'s principal mainline station. For most visitors staying in central Barcelona, the Metro journey to Sants is twenty minutes or less.\n\nThere is one critical logistical fact about departing from Barcelona Sants on a high-speed train that distinguishes Spain from every other major European rail network:\n\nAll luggage on Spanish high-speed trains must pass through an X-ray security scanner before you can access the departure platforms.\n\nThis is not optional, it is not a recommendation, and it is not specific to certain operators. The process is similar to airport security: bags go through a scanner on a conveyor belt, you walk through a metal detector, and your belongings are returned to you. Arrive at Barcelona Sants at least 30 minutes before your scheduled departure. During peak travel periods, extend this to 45 minutes.' },
      { id: 'arrival', heading: 'Arrival — Madrid Puerta de Atocha', body: 'Madrid Puerta de Atocha is one of Europe\'s most distinctive railway stations. The station\'s older section houses what became one of Madrid\'s more unusual public spaces: a large tropical garden occupying the former main hall, complete with towering palms, fig trees, and ferns. The indoor garden remains a striking architectural curiosity worth a brief detour on your way out.\n\nThe high-speed arrival platforms are in the modern extension of Atocha. From the platform level, follow signs for Salida (exit) to reach the main concourse.\n\nAtocha Renfe is served by Metro Line 1 (light blue), which runs through the city centre. The official taxi rank is outside the main station exit. Madrid taxis are metered and generally honest. The Prado Museum is a twelve-minute walk from Atocha. The Retiro park is ten minutes. You are, in practical terms, already inside one of Madrid\'s most interesting neighbourhoods the moment you exit the station.' },
      { id: 'luggage', heading: 'Luggage Rules', body: 'The X-ray process described above is the primary luggage consideration on this route, but the allowances themselves are broadly generous — particularly compared to the budget airlines operating the same corridor.\n\nAVE (Renfe) and Iryo allow passengers to bring two medium-sized bags plus one personal item without additional charge. A standard 23kg checked suitcase fits without issue.\n\nOuigo España operates on a low-cost model with strictly tiered baggage allowances. The base fare typically includes only a small personal item that fits under the seat. A cabin-size trolley bag and larger luggage require paid add-ons at booking.\n\nOne useful note: because all bags pass through the X-ray regardless of operator, there is no advantage in packing liquids into checked luggage versus carry-on on this route. The 100ml rule does not apply — you are on a train, not in airport security.' }
    ],
    [
      { q: 'Is the train ride from Barcelona to Madrid scenic?', a: 'The middle section of the route — particularly through the meseta, the high central plateau of Spain — is dramatic in its own austere way: an enormous, flat, ochre landscape under an unbroken sky. Window seats on either side offer comparable views.' },
      { q: 'How far in advance should I book Barcelona to Madrid train tickets?', a: 'With three operators competing on this route, the pricing dynamics differ from monopoly rail markets. Ouigo\'s cheapest fares are released months in advance and sell out quickly. Iryo and Renfe offer early-booking discounts that progressively increase as the departure date approaches. Book four to six weeks ahead for reasonable fares in summer.' },
      { q: 'Is there a dining car on the Barcelona to Madrid train?', a: 'On AVE high-speed services, a bar-cafetería car offers hot and cold food, coffee, and alcohol. Iryo has a café service on board. Ouigo has a more limited snack offering consistent with its low-cost model.' }
    ],
    '2026-07-08T18:00:00+07:00'
  ),
  A(
    'paris-to-nice-by-train',
    'Paris to Nice by Train: The Complete TGV Guide to the French Riviera',
    'Logistics & Transport', 'France',
    "The TGV covers Paris to Nice in six hours, delivering you directly to the French Riviera's city centre. The Mediterranean coastline view in the final stretch alone justifies the journey.",
    'https://images.unsplash.com/photo-1533676802871-eca1aa998ce5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    [
      { id: 'introduction', heading: 'Why the train beats flying', body: 'There is a version of the Paris-to-Nice journey that involves taking the RER B from central Paris to Charles de Gaulle, queueing through one of Europe\'s more chaotic airports, boarding a one-hour-thirty-minute flight, landing at Nice Côte d\'Azur Airport, and then taking a bus or taxi along the Promenade des Anglais to your hotel — a route that, door to door, consumes the better part of five hours and deposits you on the Riviera mildly defeated.\n\nThere is another version. You take the Métro or a taxi to Gare de Lyon in central Paris, board a TGV, and settle into your reserved seat for six hours. The train passes through the Rhône Valley, Marseille, Toulon, and then turns eastward along the coast. For the final two hours, the Mediterranean appears on your right — the actual sea, turquoise and luminous in a way that photographs from aircraft windows cannot convey.\n\nThe flight saves approximately one hour of elapsed time while costing you the two finest hours of the journey. It is, on balance, a poor trade.' },
      { id: 'options', heading: 'The Options — TGV Inoui vs. Ouigo', body: 'Two distinct products operate the Paris–Nice route, and the difference between them is significant enough to warrant careful consideration before booking.\n\nTGV Inoui is the SNCF premium product. All Inoui fares include your choice of seat reservation within your selected class, a reasonable baggage allowance, and access to the bar car. The onboard experience is comfortable and quiet enough to work or read for extended periods.\n\nOuigo is SNCF\'s low-cost rail product. Base fares are frequently under €15. The trade-offs are material: Ouigo applies strict baggage limits (one small bag under the seat in the base fare; larger bags charged extra), requires check-in via app before departure, and the onboard experience prioritises density over comfort.\n\nThe recommendation for a six-hour journey: book TGV Inoui. The additional cost buys you meaningful comfort across six hours and a legitimate baggage allowance.' },
      { id: 'departure', heading: 'Departure — Navigating Paris Gare de Lyon', body: 'Gare de Lyon is one of Paris\'s principal mainline stations. The station has two main departure halls: Hall 1 (the historic hall) and Hall 2 (the modern extension). TGV departures operate from both halls, and your ticket will specify your departure level and voie (platform) number.\n\nA specific and worth-knowing logistical note: Gare de Lyon does not have the mandatory security X-ray process that distinguishes Spanish stations. You can arrive thirty minutes before departure and board without difficulty.\n\nLe Train Bleu deserves mention. Located on the mezzanine level above Hall 1, Le Train Bleu is a Belle Époque restaurant dating from 1901. It is one of the most beautiful restaurant interiors in Paris. If your departure permits time for a coffee before boarding, it is worth the detour up the stairs.' },
      { id: 'route-arrival', heading: 'The Route and Arrival — Nice-Ville', body: 'The Paris–Nice TGV runs south through Burgundy, descends into the Rhône corridor, passes Valence and then Marseille, and turns east along the Côte d\'Azur.\n\nThe single most important practical instruction in this guide: sit on the right side of the train, facing the direction of travel. The coastal section from Toulon eastward — the final two hours of the journey — runs along the cliff edge of the Côte d\'Azur with the sea on the south (right) side of the train. Sitting on the right, you will watch the turquoise water pass at near-eye level. Sitting on the left, you will look at the cliff face and a series of road tunnels. Reserve your seat on the right side when booking.\n\nArrival at Nice-Ville: The station is located in central Nice. Tram Line 2 departs from directly outside the station and runs to the airport and along the coast. A taxi rank is immediately outside the main station exit.' },
      { id: 'luggage', heading: 'Luggage Rules', body: 'The standard allowance on TGV Inoui is two pieces of luggage up to 85cm in length plus one piece of hand luggage. There are no formal weight limits — the practical constraint is that you must be able to lift your bags into the overhead rack.\n\nThe French labelling rule: SNCF requires that all luggage carried on board be labelled with the passenger\'s name and destination. In reality, a luggage tag with your name and journey destination attached to your main bag is sufficient compliance.\n\nOuigo baggage: Ouigo\'s base fare covers one small personal item. A standard cabin bag requires a paid add-on, and a large suitcase requires a further add-on. These must be purchased at booking — adding luggage at the station is significantly more expensive.' }
    ],
    [
      { q: 'Is the train from Paris to Nice scenic?', a: 'Yes — but specifically in the final two hours. The journey through Burgundy and the Rhône Valley is pleasant rather than dramatic. The transformation occurs at Toulon, when the train turns east and begins following the Mediterranean coastline. For the last ninety minutes, the sea is visible on the right side of the train (sit on the right, facing forward, to maximise this).' },
      { q: 'Is there a night train from Paris to Nice?', a: 'Yes. SNCF operates a night train — the Intercités de Nuit — on the Paris–Nice route. The service departs Paris Austerlitz in the evening and arrives in Nice the following morning. Accommodation options include couchette berths and private sleeper compartments. Book through SNCF Connect.' },
      { q: 'How far in advance should I book Paris to Nice train tickets?', a: 'The cheapest TGV Inoui fares are released approximately ninety days before travel and disappear quickly for peak summer departures. For July and August travel, booking two to three months in advance is strongly advisable. For shoulder season travel (May, early June, September, October), reasonable fares are often available three to four weeks before departure.' }
    ],
    '2026-07-09T18:00:00+07:00'
  ),
  A(
    'where-to-stay-in-lucerne-switzerland',
    'Where to Stay in Lucerne, Switzerland: A Practical Neighbourhood Guide',
    'Where to Stay', 'Switzerland',
    "Lucerne is Switzerland's most photogenic city and one of Europe's most expensive. Choosing the right neighbourhood determines both your daily logistics and your hotel bill.",
    'https://images.unsplash.com/photo-1527668752968-14ce70732551?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    [
      { id: 'introduction', heading: 'Lucerne Logistics and Reality', body: 'Lucerne occupies a position in central Switzerland that is, from a logistical standpoint, almost uniquely convenient. The city sits at the western end of Lake Lucerne, with the Swiss Alps visible from its waterfront and the country\'s most efficient rail network connecting it to Zurich, Bern, and Interlaken.\n\nNow for the reality that no amount of Alpine charm will obscure: Lucerne is expensive. Switzerland as a whole occupies the upper tier of European cost of living, and Lucerne, as one of its most popular tourist destinations, applies a further premium. A midrange hotel in the Altstadt during summer will cost what a luxury hotel costs in most Southern European cities.\n\nThe neighbourhood you choose determines your daily hotel expenditure, your proximity to the main attractions, how far you carry your luggage, and how easily you access the mountain excursions that constitute the primary reason most visitors come.' },
      { id: 'altstadt', heading: 'Altstadt (Old Town) — Best for First-Timers and Romance', body: 'The Altstadt is the section of Lucerne that produces every photograph you have already seen of the city: the Kapellbrücke (Chapel Bridge) and the painted facades of the Weinmarkt. Staying here means waking up in the middle of this.\n\nThe logistical reality: the Altstadt is almost entirely pedestrian-only. This means that arriving at your hotel with wheeled luggage involves either a short taxi drop at the nearest permitted point and then carrying your bags through cobblestones, or hotels arranging their own porter service.\n\nThe pricing reality: Altstadt hotels command the highest rates in Lucerne. The premium is for location — specifically for the view from the room and the proximity to the Kapellbrücke.' },
      { id: 'neustadt', heading: 'Near the Train Station (Neustadt) — Best for Logistics', body: 'The Hauptbahnhof (central station) in Lucerne is the most strategically located railway station in central Switzerland. From here, every major excursion in the region begins: Mount Rigi, Mount Pilatus, the GoldenPass Express, and intercity trains.\n\nStaying within a five-minute walk of the Hauptbahnhof is the strategically correct choice for the vast majority of travellers visiting Lucerne on a multi-destination Swiss itinerary.\n\nThe hotels here are almost universally more affordable than equivalent properties in the Altstadt. They are also accessible by vehicle — taxis and rideshares can reach your hotel entrance directly, which matters if you arrive by train with a full suitcase. The Altstadt is a ten-minute walk away.' },
      { id: 'seeburg', heading: 'Lake Promenade — Best for Luxury and Views', body: 'The eastern lakeshore of Lucerne is where the grand nineteenth-century palace hotels are located. These properties share a common characteristic: direct lake frontage, with rooms and terraces that face across Lake Lucerne toward the Alps.\n\nThis is the most expensive accommodation option in Lucerne. Luxury lake-view rooms at the established palace hotels in summer are priced accordingly, and there is no midrange equivalent in this specific location. The walk to the Altstadt from the Haldenstrasse is approximately fifteen to twenty minutes.\n\nThe trade-off is precise: you pay significantly more, you are further from transport connections, and you receive, in return, views and a level of service that the more practically located hotels do not offer.' },
      { id: 'kriens', heading: 'Kriens and Weggis — Best for Budget and Mountain Access', body: 'Both Kriens and Weggis are separate municipalities from Lucerne proper.\n\nKriens is immediately southwest of Lucerne, accessible by bus. Its primary relevance is its position as the base station for the Pilatus Cable Car. Accommodation here is substantially cheaper than in central Lucerne, but the town itself is functional rather than picturesque.\n\nWeggis sits on the southern shore of Lake Lucerne, accessible from Lucerne by boat service or by road. It is a quieter resort town. The trade-off is the commute: the boat to Lucerne runs on a schedule that may not align with early morning mountain departures.' }
    ],
    [
      { q: 'Do hotels in Lucerne provide a free transport pass?', a: 'Yes. Most hotels in the city of Lucerne provide registered guests with a complimentary guest card (Gästekarte). This card provides free travel on the city buses, trams, and boats on Lake Lucerne within the city transport zone for the duration of your stay. It does not cover the mountain railways.' },
      { q: 'Is two days enough for Lucerne?', a: 'Two full days is sufficient to cover the main city attractions while incorporating one mountain day trip. Three days allows a more comfortable pace: one day for the city, one for a mountain, one for the lake or a day trip to Interlaken.' },
      { q: 'Can you swim in Lake Lucerne?', a: 'Yes. Lake Lucerne is an alpine lake fed by mountain runoff, which means the water is extraordinarily clear and cold — typically around 20°C in July and August at the surface. Several designated swimming areas (Strandbäder) are accessible from the city.' }
    ],
    '2026-07-10T18:00:00+07:00'
  ),
  A(
    'madrid-to-seville-train',
    'Madrid to Seville by Train: The Complete AVE Guide to Andalusia',
    'Logistics & Transport', 'Spain',
    "The AVE covers Madrid to Seville in 2.5 hours, city centre to city centre. It is the fastest, most comfortable route into the heart of Andalusia — and far superior to driving.",
    'https://images.unsplash.com/photo-1558642084-fd07fae5282e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    [
      { id: 'introduction', heading: 'Why the train beats flying', body: 'The drive from Madrid to Seville is 534 kilometres on the A-4 motorway, a route that traverses the bleached, flat plains of La Mancha and the scorched dehesa of Extremadura. In summer, the temperature at road level in this stretch regularly exceeds 40°C. The drive takes five and a half hours under optimistic conditions.\n\nThe AVE — Alta Velocidad Española — covers the same distance in two hours and thirty minutes. The train departs from Madrid Puerta de Atocha and arrives at Sevilla Santa Justa. No highway, no petrol station stop in 42°C heat, no parking decisions on arrival.\n\nThe Madrid–Seville AVE line was the first high-speed railway line opened in Spain, inaugurated in 1992. It is therefore one of the most established and reliable routes on the Spanish high-speed network.' },
      { id: 'operators', heading: 'The Operators — AVE vs. Iryo', body: 'The Madrid–Seville corridor, like the Barcelona–Madrid route, has been opened to rail competition. Two operators currently serve the route, and the difference between them affects your booking strategy.\n\nAVE (Renfe) is the state operator and the founding carrier on this route. Renfe operates the full Madrid–Seville timetable with the greatest frequency. For leisure travellers with fixed dates, the BÁSICO or ELIGE fares on Renfe represent good value when booked in advance.\n\nIryo uses Frecciarossa 1000 trains — the same Italian high-speed trains that operate between Rome and Milan. The onboard product is excellent: wide seats, a 2+1 configuration in Club class, and a quieter, more refined atmosphere.\n\nBooking strategy: Check both operators for your preferred time slot using a comparison tool such as Trainline or Omio.' },
      { id: 'departure', heading: 'Departure — Navigating Madrid Puerta de Atocha', body: 'Madrid Puerta de Atocha is Spain\'s busiest railway station and a genuine architectural landmark — its Victorian-era iron and glass hall, now repurposed as a tropical garden, is worth a moment\'s detour.\n\nHere is the non-negotiable logistical reality of all Spanish high-speed rail departures: Every bag on every Spanish high-speed train must pass through an X-ray security scanner before you can access the departure platforms.\n\nThe practical instruction: arrive at Atocha at least 30 minutes before your scheduled departure. On busy travel days, extend this to 45 minutes.' },
      { id: 'arrival', heading: 'Arrival — Sevilla Santa Justa', body: 'Sevilla Santa Justa is Seville\'s principal railway station. The station is located in the northeastern part of the city, approximately two kilometres from the historic centre. This distance is important to understand before arrival: Sevilla Santa Justa is not a station embedded in the tourist core of the city.\n\nOnward connections from Sevilla Santa Justa:\n\nTaxi: The taxi rank is immediately outside the main station exit. Seville taxis are metered, regulated, and reliable. The journey to the Barrio Santa Cruz is typically seven to twelve minutes depending on traffic. This is the most direct option with luggage.\n\nBus: City bus lines serve the station and connect to the historic centre. Line C2 is particularly useful for reaching the Prado de San Sebastián bus station.' },
      { id: 'luggage', heading: 'Luggage Rules', body: 'The X-ray process at departure is the defining luggage consideration for this route, but the allowances themselves compare favourably to the budget airlines.\n\nAVE (Renfe): The standard allowance is two medium-sized bags plus one personal item, with no formal weight restriction. A standard wheeled suitcase of 23kg fits without issue.\n\nIryo: Iryo\'s luggage allowances are similarly generous for standard fares — two bags plus one personal item. As with Renfe, no liquid restrictions apply: you are on a train, not in airport security. You may pack full-size toiletries, wine purchased in Madrid, or any other liquids without restriction.' }
    ],
    [
      { q: 'Is the train ride from Madrid to Seville scenic?', a: 'The Madrid–Seville route passes through the plains of La Mancha and the dehesa landscape of the southern meseta — an austere, wide, golden-brown expanse of oak scrubland and farmland that is distinctly Iberian. The approach into Seville offers a final stretch of more cultivated, greener countryside.' },
      { q: 'Are there direct trains from Madrid Airport (Barajas) to Seville?', a: 'There is no direct high-speed train from Madrid Barajas Airport to Seville. Travellers arriving at Madrid Airport who wish to continue to Seville must first travel from the airport to central Madrid. The most practical route is the Cercanías line C-1, which connects Madrid Airport Terminal 4 to Atocha station in approximately thirty minutes.' },
      { q: 'Is there food on the Madrid to Seville train?', a: 'Yes. AVE services on this route include a bar-cafetería car offering hot and cold food, pastries, sandwiches, coffee, and alcohol throughout the journey. PRÉMIUM and CLUB class passengers on Renfe services receive meal service at their seats.' }
    ],
    '2026-07-11T18:00:00+07:00'
  )
];

export const articles = allArticles.filter(a => new Date(a.updated) <= new Date());

export const getArticle = (slug) => allArticles.find((a) => a.slug === slug);
export const articlesByRegion = (region) =>
  articles.filter((a) => a.region.toLowerCase() === region.toLowerCase());
