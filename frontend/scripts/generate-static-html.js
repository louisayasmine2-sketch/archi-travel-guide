#!/usr/bin/env node
/*
 * Generates route-level static HTML shells after the CRA build.
 *
 * The React app remains the interactive experience, but crawlers, link preview
 * bots, and no-JavaScript clients now receive page-specific titles,
 * descriptions, canonical URLs, and concise body content instead of a generic
 * "enable JavaScript" shell.
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const BUILD_DIR = path.join(ROOT, 'build');
const INDEX_PATH = path.join(BUILD_DIR, 'index.html');
const SITE_URL = (
  process.env.REACT_APP_SITE_URL ||
  process.env.VITE_SITE_URL ||
  process.env.NEXT_PUBLIC_SITE_URL ||
  'https://affittacameregliarchi.com'
).replace(/\/$/, '');
const SITE_NAME = 'Archi Travel Guide';
const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1761995912965-8f134652fc6e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzV8MHwxfHNlYXJjaHwyfHx0dXNjYW55JTIwcm9sbGluZyUyMGhpbGxzJTIwc3VucmlzZXxlbnwwfHx8fDE3ODMwMDQ0ODZ8MA&ixlib=rb-4.1.0&q=85&w=1200&h=630&fit=crop';
const SCHEMA_UPDATED = '2026-07-10';
const ARTICLE_SCHEMA_ROUTES = new Set([
  '/siena-travel-guide',
  '/where-to-stay-in-siena',
  '/florence-to-siena-by-train-or-bus',
  '/siena-day-trip-from-florence',
  '/one-day-in-siena',
  '/things-to-do-in-siena',
  '/siena-itinerary',
  '/siena-accommodation-guide',
  '/travel-tips',
]);
const DESTINATION_SCHEMA = {
  '/tuscany-travel-guide': {
    name: 'Tuscany',
    description: 'Italian region known for Siena, Florence, hilltowns, vineyards, food routes, and slow countryside itineraries.',
    country: 'Italy',
    touristType: ['Cultural travelers', 'Food travelers', 'Road trip planners', 'Couples'],
  },
  '/siena': {
    name: 'Siena',
    description: 'Medieval Tuscan city known for Piazza del Campo, the Palio, Gothic streets, and slow travel planning.',
    region: 'Tuscany',
    country: 'Italy',
    touristType: ['Cultural travelers', 'Couples', 'Families', 'Slow travel planners'],
  },
  '/florence': {
    name: 'Florence',
    description: 'Renaissance city in Tuscany with walkable art, food, and transport links to Siena.',
    region: 'Tuscany',
    country: 'Italy',
    touristType: ['Art travelers', 'Cultural travelers', 'Couples', 'First-time Italy visitors'],
  },
  '/rome': {
    name: 'Rome',
    description: 'Italian capital known for ancient sites, neighborhoods, food, and multi-day cultural itineraries.',
    region: 'Lazio',
    country: 'Italy',
    touristType: ['Cultural travelers', 'Families', 'History travelers', 'First-time Italy visitors'],
  },
  '/venice': {
    name: 'Venice',
    description: 'Canal city in Veneto known for islands, walking routes, art, and quiet morning travel.',
    region: 'Veneto',
    country: 'Italy',
    touristType: ['Couples', 'Cultural travelers', 'Slow travel planners', 'Island travelers'],
  },
  '/paris': {
    name: 'Paris',
    description: 'French capital known for art, cafes, walkable arrondissements, museums, and neighborhood-based planning.',
    region: 'Ile-de-France',
    country: 'France',
    touristType: ['Cultural travelers', 'Couples', 'Food travelers', 'Museum travelers'],
  },
};
const STATIC_FOOTER_LINKS = [
  { href: '/siena-travel-guide', label: 'Siena Travel Guide' },
  { href: '/florence-to-siena-by-train-or-bus', label: 'Florence to Siena by Train or Bus' },
  { href: '/where-to-stay-in-siena', label: 'Where to Stay in Siena' },
  { href: '/tuscany-travel-guide', label: 'Tuscany Travel Guide' },
  { href: '/travel-budget-calculator', label: 'Travel Budget Calculator' },
  { href: '/editorial-policy', label: 'Editorial Policy' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
  { href: '/privacy-policy', label: 'Privacy Policy' },
  { href: '/sitemap.xml', label: 'Sitemap' },
];

const STATIC_ROUTES = [
  page('/', 'Archi Travel Guide', 'Independent travel planning guides for Siena, Tuscany, Italy, Europe and Asia, with practical itineraries, budget tools and honest recommendations.', 'Plan smarter trips around the world', [
    'Independent travel planning guides with a practical first pillar in Siena and Tuscany.',
    'Use city guides, itineraries, budget tools and packing checklists to make faster trip decisions.',
    'Commercial links are disclosed clearly and editorial recommendations remain independent.',
  ]),
  page('/destinations', 'Destinations', 'Browse practical destination guides across Italy, Tuscany, Siena, Europe and Asia.', 'Destinations', [
    'Start with Siena and Tuscany, then browse broader Italy, Europe and Asia planning guides.',
    'Each destination page prioritizes logistics, timing, neighborhoods and realistic planning trade-offs.',
  ]),
  page('/blog', 'Travel Blog', 'Practical travel articles for Siena, Tuscany, Italy, packing, transport, budget planning and itineraries.', 'Travel Blog', [
    'Read city guides, itinerary templates, transport explainers, budget breakdowns and packing advice.',
    'Articles include clear update dates and practical next-step links.',
  ]),
  page('/travel-tools', 'Travel Tools', 'Interactive travel tools for trip budgets, itineraries, area finding, packing lists, timing and transport.', 'Travel Tools', [
    'Plan budgets, choose neighborhoods, build packing lists and compare transport choices.',
    'The tools are designed to support editorial guides, not replace careful booking checks.',
  ]),
  page('/travel-deals', 'Travel Deals & Resources', 'Curated travel resources for hotels, tours, eSIM, insurance, transport and gear, with clear affiliate disclosure.', 'Travel Deals & Resources', [
    'A carefully selected shortlist of travel planning categories.',
    'Partner links are only active when real provider URLs are configured.',
    'Readers can request a fast shortlist by email when they need practical help.',
  ]),
  page('/about', 'About Archi Travel Guide', 'Learn how Archi Travel Guide writes independent destination guides, travel tools and monetized recommendations.', 'About Archi Travel Guide', [
    'Archi Travel Guide is an independent editorial travel planning platform.',
    'We do not claim to represent any previous business associated with this domain.',
    'Commercial relationships are disclosed and do not decide editorial coverage.',
  ]),
  page('/contact', 'Contact Archi Travel Guide', 'Contact Archi Travel Guide for editorial questions, corrections, partnerships and practical travel requests.', 'Contact Archi Travel Guide', [
    'Send editorial questions, partnership requests and travel planning notes to contact@affittacameregliarchi.com.',
    'Messages are delivered directly to the team, with email fallback if form delivery is unavailable.',
  ]),
  page('/italy', 'Italy Travel Guide', 'Practical Italy travel planning guides for cities, regions, transport, itineraries and seasonal decisions.', 'Italy Travel Guide', [
    'Plan Italy with region-first city guides, route decisions and realistic timing advice.',
    'Siena and Tuscany are the first deep editorial pillars.',
  ]),
  page('/tuscany-travel-guide', 'Tuscany Travel Guide', 'A practical Tuscany travel guide covering Siena, Florence, hill towns, transport, food, stays and trip timing.', 'Tuscany Travel Guide', [
    'Compare Siena, Florence, countryside routes and day trips without overloading your itinerary.',
    'Use transport, food, stay and budget guides to make practical booking choices.',
  ]),
  page('/siena', 'Siena Travel Guide', 'Things to do in Siena, where to stay, 1-3 day itineraries, family travel, budget tips and Florence transport.', 'Siena Travel Guide', [
    'Plan Piazza del Campo, the Duomo, Torre del Mangia, contrada walks and food stops.',
    'Compare where to stay, how long to visit, what to skip and how to arrive from Florence.',
  ]),
  page('/florence', 'Florence Travel Guide', 'Practical Florence travel planning for neighborhoods, art, food, transport and Tuscany connections.', 'Florence Travel Guide', [
    'Use Florence as a cultural base and transport hub for Tuscany.',
    'Plan museum timing, neighborhoods and Siena connections before booking.',
  ]),
  page('/rome', 'Rome Travel Guide', 'Practical Rome travel planning for first-time visitors, neighborhoods, transport and trip pacing.', 'Rome Travel Guide', [
    'Plan Rome by neighborhood, transport window and realistic museum timing.',
    'Use guides to keep first trips focused instead of overpacked.',
  ]),
  page('/venice', 'Venice Travel Guide', 'Practical Venice travel planning for stays, routes, timing and crowd-aware itineraries.', 'Venice Travel Guide', [
    'Plan Venice with route pacing, neighborhood decisions and crowd-aware timing.',
    'Use simple itinerary structures before booking stays and transport.',
  ]),
  page('/europe', 'Europe Travel Guide', 'Practical Europe travel planning guides for routes, cities, rail, budget and timing.', 'Europe Travel Guide', [
    'Build Europe routes around fewer bases, better timing and less transfer friction.',
    'Use city and transport guides to simplify booking decisions.',
  ]),
  page('/asia', 'Asia Travel Guide', 'Practical Asia travel planning guides for route design, packing, stays and seasonal timing.', 'Asia Travel Guide', [
    'Plan Asia routes with weather, visas, transport and packing realities in mind.',
    'Use practical guides before committing to long multi-city routes.',
  ]),
  page('/travel-budget-calculator', 'Travel Budget Calculator', 'Estimate trip costs by destination, accommodation, food, transport and activity choices.', 'Travel Budget Calculator', ['Estimate daily and total travel costs before booking.']),
  page('/travel-tools/itinerary-generator', 'Itinerary Generator', 'Build a practical itinerary structure from trip length, pace and interests.', 'Itinerary Generator', ['Create a realistic day-by-day structure before adding bookings.']),
  page('/travel-tools/area-finder', 'Area Finder', 'Find better neighborhoods and stay areas based on travel style, budget and mobility needs.', 'Area Finder', ['Compare stay areas before choosing accommodation.']),
  page('/travel-tools/packing-checklist', 'Packing Checklist', 'Create a practical packing checklist for city trips, countryside stays and seasonal travel.', 'Packing Checklist', ['Pack for cobblestones, weather, transit and day trips.']),
  page('/travel-tools/best-time-to-visit', 'Best Time to Visit Tool', 'Compare destination timing by weather, crowds, prices and seasonal trade-offs.', 'Best Time to Visit Tool', ['Choose months using weather, crowd and price trade-offs.']),
  page('/travel-tools/transport-guide', 'Transport Guide', 'Compare transport choices for airports, trains, buses, rental cars and local movement.', 'Transport Guide', ['Plan transport windows and avoid common arrival mistakes.']),
  page('/privacy-policy', 'Privacy Policy', 'How Archi Travel Guide collects, uses and protects contact form data, analytics data and cookie preferences.', 'Privacy Policy', [
    'We collect only the information needed to run the website, respond to messages and improve guides.',
    'Contact form data includes name, email, subject and message.',
    'Analytics providers may include Google Analytics, Microsoft Clarity and Amplitude when configured.',
    'You can request access, correction or deletion by emailing contact@affittacameregliarchi.com.',
  ]),
  page('/cookie-policy', 'Cookie Policy', 'Cookies used by Archi Travel Guide for essential functionality, analytics and future advertising consent.', 'Cookie Policy', [
    'Essential cookies support basic site functionality.',
    'Analytics tools may measure page views, lead events, clicks, scroll depth, heatmaps and session behavior when configured.',
    'Advertising cookies should only be used where consent and provider setup allow them.',
  ]),
  page('/terms-of-use', 'Terms of Use', 'Terms for using Archi Travel Guide editorial travel content and planning tools.', 'Terms of Use', [
    'Travel content is editorial and for planning purposes.',
    'Always confirm travel details with official providers before booking.',
  ]),
  page('/terms-of-service', 'Terms of Service', 'Service terms for Archi Travel Guide editorial content, recommendations and planning tools.', 'Terms of Service', [
    'Travel content is editorial and provided in good faith.',
    'Booking decisions remain the responsibility of the reader.',
  ]),
  page('/affiliate-disclosure', 'Affiliate Disclosure', 'How affiliate links and commercial relationships work on Archi Travel Guide.', 'Affiliate Disclosure', [
    'Some outbound links may be affiliate links when live partner URLs are configured.',
    'Affiliate relationships do not determine destination coverage or editorial recommendations.',
  ]),
  page('/editorial-policy', 'Editorial Policy', 'Editorial standards for Archi Travel Guide research, updates, corrections and independence.', 'Editorial Policy', [
    'Guides are reviewed for practical accuracy and updated when facts change.',
    'Corrections can be sent to contact@affittacameregliarchi.com.',
  ]),
  page('/disclaimer', 'Disclaimer', 'Important limitations for travel recommendations, booking decisions and changing local conditions.', 'Disclaimer', [
    'Travel details can change quickly.',
    'Confirm opening hours, prices, transport and booking rules with official sources.',
  ]),
  page('/siena-travel-guide', 'Siena Travel Guide | Where to stay, plan, and enjoy', 'A practical Siena travel guide with accommodation zones, itineraries, transport and first-hand planning tips.', 'Siena travel guide', [
    'Start with where to stay, what to skip, how to move efficiently and how to stretch your budget.',
    'Use this page as the hub for Siena planning before reading deeper guides.',
  ]),
  page('/florence-to-siena-by-train-or-bus', 'Florence to Siena by Train or Bus', 'Compare practical train and bus options from Florence to Siena before planning your day trip.', 'Florence to Siena by train or bus', [
    'Use this guide to compare transport trade-offs before choosing your route.',
    'The page connects transport planning with Siena itinerary and stay decisions.',
  ]),
  page('/siena-day-trip-from-florence', 'Siena Day Trip from Florence', 'Plan a focused Siena day trip from Florence with realistic timing and practical route notes.', 'Siena day trip from Florence', [
    'Keep the day focused around Piazza del Campo, the Duomo, and a realistic meal stop.',
    'Use the transport guide before committing to a train or bus plan.',
  ]),
  page('/one-day-in-siena', 'One Day in Siena', 'A practical one-day Siena planning page for short visits, pacing, and first-time priorities.', 'One day in Siena', [
    'Prioritize the Campo, Duomo area, and one slow walk rather than overloading the day.',
    'Use this route as a short-stay entry point before deeper Siena guides.',
  ]),
  page('/where-to-stay-in-siena', 'Where to Stay in Siena', 'Zone-by-zone Siena accommodation advice for couples, families and budget-focused travelers.', 'Where to stay in Siena', [
    'Choose by mood and mobility, not just price.',
    'Compare Terzo di Citta, San Martino and Camollia for comfort, noise and access.',
  ]),
  page('/things-to-do-in-siena', 'Things to Do in Siena', 'A practical shortlist of things to do in Siena for first-time visitors and short stays.', 'Things to do in Siena', [
    'Start with the sights that shape a first Siena visit, then leave room for slow streets and food stops.',
    'This page keeps priority clear for travelers with limited time.',
  ]),
  page('/siena-itinerary', 'Siena Itinerary Guide', 'Practical Siena itinerary guidance for 1 day, 2 days and 3 days with pacing and transport notes.', 'Siena itinerary', [
    'Use 1-day, 2-day and 3-day structures that balance sights, food and downtime.',
    'Add countryside time only when the core city plan has enough room.',
  ]),
  page('/siena-accommodation-guide', 'Siena Accommodation Guide', 'Clear guide to B&Bs, apartments and practical stay categories around Siena.', 'Siena accommodation guide', [
    'Compare B&Bs, apartments and hotels by comfort, location, parking and check-in needs.',
    'Ask the right questions before confirming a room.',
  ]),
  page('/travel-tips', 'Travel Tips for Siena and Tuscany', 'Compact travel tips for mobility, parking, packing, safety and money-saving habits in Italy.', 'Travel tips that save time and stress', [
    'Plan transfer windows around weather, strikes, parking and old-town walking limits.',
    'Preload maps and keep offline essentials ready.',
  ]),
];

function page(routePath, title, description, h1, bullets, locale = 'en_US') {
  return { path: routePath, title, description, h1, bullets, locale, canonicalPath: routePath };
}

function escapeHtml(value = '') {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function stripNoscript(html) {
  return html.replace(/<noscript>[\s\S]*?<\/noscript>/i, '');
}

function removeExistingStatic(html) {
  return html
    .replace(/<style data-static-fallback>[\s\S]*?<\/style>/i, '')
    .replace(/<script data-static-fallback>[\s\S]*?<\/script>/i, '')
    .replace(/<main id="static-fallback"[\s\S]*?<\/main>/i, '');
}

function routeIsArticle(route) {
  return route.type === 'article' || ARTICLE_SCHEMA_ROUTES.has(route.path);
}

function jsonLdScript(schema) {
  return `<script type="application/ld+json">${JSON.stringify(schema).replace(/</g, '\\u003c')}</script>`;
}

function breadcrumbJsonLd(route) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_URL}/` },
      { '@type': 'ListItem', position: 2, name: route.h1 || route.title, item: `${SITE_URL}${route.canonicalPath}` },
    ],
  };
}

function webPageJsonLd(route, url, fullTitle) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${url}#webpage`,
    url,
    name: fullTitle,
    description: route.description,
    isPartOf: { '@type': 'WebSite', '@id': `${SITE_URL}/#website`, name: SITE_NAME, url: SITE_URL },
    publisher: { '@type': 'Organization', '@id': `${SITE_URL}/#organization`, name: SITE_NAME, url: SITE_URL },
  };
}

function articleJsonLd(route, url, fullTitle) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    '@id': `${url}#article`,
    headline: fullTitle,
    description: route.description,
    image: [DEFAULT_IMAGE],
    datePublished: SCHEMA_UPDATED,
    dateModified: SCHEMA_UPDATED,
    author: { '@type': 'Organization', '@id': `${SITE_URL}/#organization`, name: SITE_NAME, url: SITE_URL },
    publisher: { '@type': 'Organization', '@id': `${SITE_URL}/#organization`, name: SITE_NAME, url: SITE_URL },
    articleSection: route.type === 'article' ? 'Travel article' : 'Travel guide',
    mainEntityOfPage: { '@type': 'WebPage', '@id': `${url}#webpage` },
  };
}

function destinationJsonLd(route, url) {
  const destination = DESTINATION_SCHEMA[route.path];
  if (!destination) return null;

  return {
    '@context': 'https://schema.org',
    '@type': 'TouristDestination',
    '@id': `${url}#destination`,
    name: destination.name,
    description: destination.description,
    image: [DEFAULT_IMAGE],
    url,
    touristType: destination.touristType,
    mainEntityOfPage: { '@type': 'WebPage', '@id': `${url}#webpage` },
    containedInPlace: destination.region
      ? {
          '@type': 'Place',
          name: destination.region,
          containedInPlace: { '@type': 'Country', name: destination.country },
        }
      : { '@type': 'Country', name: destination.country },
  };
}

function schemaScripts(route, url, fullTitle) {
  const schemas = [
    breadcrumbJsonLd(route),
    webPageJsonLd(route, url, fullTitle),
    routeIsArticle(route) ? articleJsonLd(route, url, fullTitle) : null,
    destinationJsonLd(route, url),
    route.path === '/'
      ? {
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          '@id': `${SITE_URL}/#website`,
          name: SITE_NAME,
          url: SITE_URL,
          description: route.description,
        }
      : null,
  ].filter(Boolean);

  return schemas.map(jsonLdScript).join('');
}

function injectHead(html, route) {
  const fullTitle = route.title.includes(SITE_NAME) ? route.title : `${route.title} · ${SITE_NAME}`;
  const url = `${SITE_URL}${route.canonicalPath}`;
  const isArticle = routeIsArticle(route);
  const head = [
    `<title data-rh="true">${escapeHtml(fullTitle)}</title>`,
    `<meta data-rh="true" name="description" content="${escapeHtml(route.description)}">`,
    `<meta data-rh="true" name="robots" content="index,follow,max-image-preview:large">`,
    `<link data-rh="true" rel="canonical" href="${escapeHtml(url)}">`,
    `<meta data-rh="true" property="og:site_name" content="${SITE_NAME}">`,
    `<meta data-rh="true" property="og:title" content="${escapeHtml(fullTitle)}">`,
    `<meta data-rh="true" property="og:description" content="${escapeHtml(route.description)}">`,
    `<meta data-rh="true" property="og:url" content="${escapeHtml(url)}">`,
    `<meta data-rh="true" property="og:type" content="${isArticle ? 'article' : 'website'}">`,
    `<meta data-rh="true" property="og:image" content="${DEFAULT_IMAGE}">`,
    `<meta data-rh="true" property="og:locale" content="${route.locale || 'en_US'}">`,
    `<meta data-rh="true" name="twitter:card" content="summary_large_image">`,
    `<meta data-rh="true" name="twitter:title" content="${escapeHtml(fullTitle)}">`,
    `<meta data-rh="true" name="twitter:description" content="${escapeHtml(route.description)}">`,
    `<meta data-rh="true" name="twitter:image" content="${DEFAULT_IMAGE}">`,
    schemaScripts(route, url, fullTitle),
    `<style data-static-fallback>.static-fallback{font-family:Arial,sans-serif;max-width:76ch;margin:0 auto;padding:2rem;color:#1f1f1f;line-height:1.65}.static-fallback a{color:#b95741}.static-fallback .overline{font-size:.78rem;letter-spacing:.12em;text-transform:uppercase;color:#9a6a55}.static-fallback h1{font-family:Georgia,serif;font-size:clamp(2rem,5vw,3.5rem);line-height:1.05;margin:.5rem 0 1rem}.static-fallback ul{padding-left:1.2rem}.static-fallback li{margin:.45rem 0}.js .static-fallback{display:none}</style>`,
    `<script data-static-fallback>document.documentElement.classList.add("js");</script>`,
  ].join('');

  return html.replace('</head>', `${head}</head>`);
}

function fallbackMarkup(route) {
  const bullets = (route.bullets || []).map((item) => `<li>${escapeHtml(item)}</li>`).join('');
  const links = STATIC_FOOTER_LINKS
    .map((item) => `<a href="${item.href}">${escapeHtml(item.label)}</a>`)
    .join(' · ');

  return [
    `<main id="static-fallback" class="static-fallback">`,
    `<p class="overline">Archi Travel Guide</p>`,
    `<h1>${escapeHtml(route.h1 || route.title)}</h1>`,
    `<p>${escapeHtml(route.description)}</p>`,
    bullets ? `<ul>${bullets}</ul>` : '',
    `<p>${links}</p>`,
    `</main>`,
  ].join('');
}

function injectBody(html, route) {
  return html.replace('<div id="root"></div>', `${fallbackMarkup(route)}<div id="root"></div>`);
}

function outputPathFor(routePath) {
  if (routePath === '/') return INDEX_PATH;
  const clean = routePath.replace(/^\//, '');
  if (clean.endsWith('.html')) return path.join(BUILD_DIR, clean);
  return path.join(BUILD_DIR, clean, 'index.html');
}

function stringArg(arg = '') {
  const trimmed = arg.trim();
  const quote = trimmed[0];
  if ((quote !== "'" && quote !== '"') || trimmed[trimmed.length - 1] !== quote) return '';
  return trimmed
    .slice(1, -1)
    .replace(/\\'/g, "'")
    .replace(/\\"/g, '"')
    .replace(/\\n/g, '\n');
}

function splitTopLevelArgs(callText) {
  const args = [];
  let current = '';
  let depth = 0;
  let inString = false;
  let quote = '';
  let escaped = false;

  for (let i = 0; i < callText.length; i += 1) {
    const ch = callText[i];

    if (inString) {
      current += ch;
      if (escaped) {
        escaped = false;
      } else if (ch === '\\') {
        escaped = true;
      } else if (ch === quote) {
        inString = false;
        quote = '';
      }
      continue;
    }

    if (ch === '"' || ch === "'") {
      inString = true;
      quote = ch;
      current += ch;
      continue;
    }

    if (ch === '[' || ch === '{' || ch === '(') depth += 1;
    if (ch === ']' || ch === '}' || ch === ')') depth -= 1;

    if (ch === ',' && depth === 0) {
      args.push(current.trim());
      current = '';
      continue;
    }

    current += ch;
  }

  if (current.trim()) args.push(current.trim());
  return args;
}

function extractArticles() {
  const src = fs.readFileSync(path.join(ROOT, 'src/data/articles.js'), 'utf-8');
  const results = [];
  const seen = new Set();

  let i = 0;
  while ((i = src.indexOf('A(', i)) !== -1) {
    let j = i + 2;
    let depth = 1;
    let inString = false;
    let quote = '';
    let escaped = false;

    while (j < src.length && depth > 0) {
      const ch = src[j];
      if (inString) {
        if (escaped) {
          escaped = false;
        } else if (ch === '\\') {
          escaped = true;
        } else if (ch === quote) {
          inString = false;
          quote = '';
        }
      } else if (ch === '"' || ch === "'") {
        inString = true;
        quote = ch;
      } else if (ch === '(') {
        depth += 1;
      } else if (ch === ')') {
        depth -= 1;
      }
      j += 1;
    }

    if (depth !== 0) break;

    const callText = src.slice(i + 2, j - 1);
    const args = splitTopLevelArgs(callText);
    const slug = stringArg(args[0]);
    if (slug && !seen.has(slug)) {
      seen.add(slug);
      const title = stringArg(args[1]);
      const category = stringArg(args[2]);
      const region = stringArg(args[3]);
      const excerpt = stringArg(args[4]);
      const headings = [...callText.matchAll(/heading:\s*'([^']+)'/g)]
        .slice(0, 4)
        .map((match) => match[1]);

      results.push({
        path: `/blog/${slug}`,
        canonicalPath: `/blog/${slug}`,
        title,
        description: excerpt,
        h1: title,
        locale: 'en_US',
        type: 'article',
        bullets: [
          `${category} guide for ${region}.`,
          ...headings.map((heading) => `Covers: ${heading}.`),
        ],
      });
    }

    i = j;
  }

  return results;
}

function renderRoute(template, route) {
  let html = removeExistingStatic(stripNoscript(template));
  html = injectHead(html, route);
  html = injectBody(html, route);
  return html;
}

function main() {
  if (!fs.existsSync(INDEX_PATH)) {
    throw new Error(`Build index.html not found at ${INDEX_PATH}. Run craco build first.`);
  }

  const template = fs.readFileSync(INDEX_PATH, 'utf-8');
  const routes = [...STATIC_ROUTES, ...extractArticles()];

  routes.forEach((route) => {
    const outPath = outputPathFor(route.path);
    fs.mkdirSync(path.dirname(outPath), { recursive: true });
    fs.writeFileSync(outPath, renderRoute(template, route), 'utf-8');
  });

  console.log(`✓ Wrote static HTML fallback for ${routes.length} routes`);
  console.log(`  SITE_URL = ${SITE_URL}`);
}

main();
