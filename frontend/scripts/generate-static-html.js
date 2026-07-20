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

function readJsonIfExists(filePath) {
  if (!fs.existsSync(filePath)) return null;
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
}

const FLORENCE_TO_SIENA_GUIDE = readJsonIfExists(
  path.join(ROOT, 'src/data/florenceToSienaGuide.json')
);
const SIENA_DAY_TRIP_FROM_FLORENCE_GUIDE = JSON.parse(
  fs.readFileSync(path.join(ROOT, 'src/data/sienaDayTripFromFlorenceGuide.json'), 'utf-8')
);
const SIENA_CONTENT_CLUSTER = JSON.parse(
  fs.readFileSync(path.join(ROOT, 'src/data/sienaContentCluster.json'), 'utf-8')
);
const SITE_URL = (
  process.env.REACT_APP_SITE_URL ||
  process.env.VITE_SITE_URL ||
  process.env.NEXT_PUBLIC_SITE_URL ||
  'https://affittacameregliarchi.com'
).replace(/\/$/, '');
const SITE_NAME = 'Archi Travel Guide';
const DEFAULT_IMAGE = `${SITE_URL}/images/archi-travel-guide-siena-og.webp`;
const SCHEMA_UPDATED = '2026-07-10';
const SHOW_SCHEDULED_CONTENT =
  process.env.REACT_APP_SHOW_SCHEDULED_CONTENT === 'true' ||
  process.env.SHOW_SCHEDULED_CONTENT === 'true';
const BUILD_NOW = process.env.SCHEDULED_CONTENT_NOW
  ? new Date(process.env.SCHEDULED_CONTENT_NOW)
  : new Date();
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
const REDIRECTED_ARTICLE_SLUGS = new Set([
  'florence-to-siena-transport',
  'siena-day-trip-from-florence',
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
  // noindex: thin page. Kept out of sitemap.xml and the nav; the route still serves.
  {
    ...page('/destinations', 'Destinations', 'Practical destination guides for Siena, Florence and the wider Tuscany region.', 'Destinations', [
      'Siena and Tuscany are the focus, with Florence as the cultural base and transport hub.',
      'Each destination page prioritizes logistics, timing, neighborhoods and realistic planning trade-offs.',
    ]),
    noindex: true,
  },
  page('/blog', 'Travel Blog', 'Practical travel articles for Siena, Tuscany, Italy, packing, transport, budget planning and itineraries.', 'Travel Blog', [
    'Read city guides, itinerary templates, transport explainers, budget breakdowns and packing advice.',
    'Articles include clear update dates and practical next-step links.',
  ]),
  page('/travel-tools', 'Travel Tools', 'Interactive travel tools for trip budgets, itineraries, area finding, packing lists, timing and transport.', 'Travel Tools', [
    'Plan budgets, choose neighborhoods, build packing lists and compare transport choices.',
    'The tools are designed to support editorial guides, not replace careful booking checks.',
  ]),
  // noindex until the page carries verified content. Kept out of sitemap.xml for
  // the same reason — submitting a URL we tell crawlers to ignore contradicts itself.
  {
    ...page('/travel-deals', 'Booking Platforms We Point Readers To', 'The booking platforms we point readers to for Tuscany travel. We have no affiliate relationship with any of them and earn nothing from these links.', 'Booking Platforms', [
      'The booking platforms we use ourselves when planning Tuscany travel.',
      'We have no commercial relationship with any of them and earn nothing if you book.',
      'No prices are listed, because none have been verified.',
    ]),
    noindex: true,
  },
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
  ...(FLORENCE_TO_SIENA_GUIDE
    ? [
      page(
        FLORENCE_TO_SIENA_GUIDE.canonicalPath,
        FLORENCE_TO_SIENA_GUIDE.seoTitle,
        FLORENCE_TO_SIENA_GUIDE.metaDescription,
        FLORENCE_TO_SIENA_GUIDE.title,
        []
      ),
    ]
    : []),
  page(
    SIENA_DAY_TRIP_FROM_FLORENCE_GUIDE.canonicalPath,
    SIENA_DAY_TRIP_FROM_FLORENCE_GUIDE.seoTitle,
    SIENA_DAY_TRIP_FROM_FLORENCE_GUIDE.metaDescription,
    SIENA_DAY_TRIP_FROM_FLORENCE_GUIDE.title,
    []
  ),
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

// These nine landing pages declared a canonical without the trailing slash the
// site actually serves (the sitemap lists every one of them with one). Align the
// static-HTML canonical with the sitemap and the client-rendered <link rel="canonical">.
// Only `canonicalPath` is touched, not `path` (which drives file output and route
// lookups), and the set is explicit so other page() routes are not changed.
const TRAILING_SLASH_CANONICAL = new Set([
  '/about', '/blog', '/contact', '/destinations', '/italy',
  '/siena', '/travel-deals', '/travel-tools', '/tuscany-travel-guide',
]);
for (const route of STATIC_ROUTES) {
  if (TRAILING_SLASH_CANONICAL.has(route.canonicalPath) && !route.canonicalPath.endsWith('/')) {
    route.canonicalPath = `${route.canonicalPath}/`;
  }
}

const florenceToSienaRoute = FLORENCE_TO_SIENA_GUIDE
  ? STATIC_ROUTES.find((route) => route.path === FLORENCE_TO_SIENA_GUIDE.canonicalPath)
  : null;
if (florenceToSienaRoute) {
  Object.assign(florenceToSienaRoute, {
    type: 'florence-to-siena-longform',
    category: FLORENCE_TO_SIENA_GUIDE.category,
    image: `${SITE_URL}${FLORENCE_TO_SIENA_GUIDE.hero.src}`,
    exactTitle: true,
    published: FLORENCE_TO_SIENA_GUIDE.datePublished,
    modified: FLORENCE_TO_SIENA_GUIDE.dateModified,
    author: FLORENCE_TO_SIENA_GUIDE.author.name,
    faq: FLORENCE_TO_SIENA_GUIDE.faq,
    breadcrumbs: [
      { label: 'Home', to: '/' },
      { label: 'Tuscany Travel Guide', to: '/tuscany-travel-guide' },
      { label: 'Florence to Siena by Train or Bus' },
    ],
  });
}

const sienaDayTripRoute = STATIC_ROUTES.find((route) => route.path === SIENA_DAY_TRIP_FROM_FLORENCE_GUIDE.canonicalPath);
if (sienaDayTripRoute) {
  Object.assign(sienaDayTripRoute, {
    type: 'siena-day-trip-longform',
    category: SIENA_DAY_TRIP_FROM_FLORENCE_GUIDE.category,
    image: `${SITE_URL}${SIENA_DAY_TRIP_FROM_FLORENCE_GUIDE.hero.src}`,
    exactTitle: true,
    published: SIENA_DAY_TRIP_FROM_FLORENCE_GUIDE.datePublished,
    modified: SIENA_DAY_TRIP_FROM_FLORENCE_GUIDE.dateModified,
    author: SIENA_DAY_TRIP_FROM_FLORENCE_GUIDE.author.name,
    faq: SIENA_DAY_TRIP_FROM_FLORENCE_GUIDE.faqs,
    breadcrumbs: [
      { label: 'Home', to: '/' },
      { label: 'Tuscany Travel Guide', to: '/tuscany-travel-guide' },
      { label: 'Siena Day Trip from Florence' },
    ],
  });
}

function page(routePath, title, description, h1, bullets, locale = 'en_US') {
  return { path: routePath, title, description, h1, bullets, locale, canonicalPath: routePath };
}

function isScheduledArticlePublished(article) {
  return SHOW_SCHEDULED_CONTENT || Date.parse(article.publishAtWib) <= BUILD_NOW.getTime();
}

function publishedSienaClusterRoutes() {
  return new Set(
    SIENA_CONTENT_CLUSTER.articles
      .filter(isScheduledArticlePublished)
      .map((article) => article.route)
  );
}

function sienaClusterRoutes() {
  const visibleRoutes = publishedSienaClusterRoutes();

  return SIENA_CONTENT_CLUSTER.articles.map((article) => {
    if (!isScheduledArticlePublished(article)) {
      return {
        path: article.route,
        canonicalPath: article.canonicalPath,
        title: `${article.title} - scheduled`,
        exactTitle: true,
        description: 'This Siena guide is scheduled for publication and is not indexable yet.',
        h1: article.title,
        locale: 'en_US',
        type: 'scheduled-draft',
        noindex: true,
        bullets: [
          `Scheduled for ${article.publishAtWib.replace('T', ' ').replace('+07:00', ' WIB')}.`,
          'The full guide will be available after its launch time.',
        ],
      };
    }

    return {
      path: article.route,
      canonicalPath: article.canonicalPath,
      title: article.seoTitle,
      exactTitle: true,
      description: article.metaDescription,
      h1: article.title,
      locale: 'en_US',
      type: 'siena-cluster-article',
      image: `${SITE_URL}${article.hero.ogSrc}`,
      published: article.datePublished,
      modified: article.dateModified,
      author: article.author?.name || SITE_NAME,
      faq: article.faqs,
      article,
      relatedLinks: article.relatedLinks.filter((link) => {
        const target = SIENA_CONTENT_CLUSTER.articles.find((item) => item.route === link.href);
        return !target || visibleRoutes.has(link.href);
      }),
      breadcrumbs: [
        { label: 'Home', to: '/' },
        { label: 'Siena Travel Guide', to: '/siena-travel-guide' },
        { label: article.title },
      ],
    };
  });
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
  return html.replace(/<noscript\b[^>]*>[\s\S]*?<\/noscript>/gi, '');
}

function removeExistingStatic(html) {
  return html
    .replace(/<style data-static-fallback>[\s\S]*?<\/style>/i, '')
    .replace(/<script data-static-fallback>[\s\S]*?<\/script>/i, '')
    .replace(/<main id="static-fallback"[\s\S]*?<\/main>/i, '');
}

function routeIsArticle(route) {
  if (route.noindex) return false;
  return route.type === 'article' || route.type === 'siena-cluster-article' || ARTICLE_SCHEMA_ROUTES.has(route.path);
}

function jsonLdScript(schema) {
  return `<script type="application/ld+json">${JSON.stringify(schema).replace(/</g, '\\u003c')}</script>`;
}

function breadcrumbJsonLd(route) {
  const items = route.breadcrumbs || [
    { label: 'Home', to: '/' },
    { label: route.h1 || route.title, to: route.canonicalPath },
  ];

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.label,
      ...(item.to ? { item: `${SITE_URL}${item.to === '/' ? '/' : item.to}` } : {}),
    })),
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
    headline: route.h1 || fullTitle,
    description: route.description,
    image: [route.image || DEFAULT_IMAGE],
    datePublished: route.published || SCHEMA_UPDATED,
    dateModified: route.modified || route.published || SCHEMA_UPDATED,
    author: { '@type': 'Organization', '@id': `${SITE_URL}/#organization`, name: route.author || SITE_NAME, url: SITE_URL },
    publisher: { '@type': 'Organization', '@id': `${SITE_URL}/#organization`, name: SITE_NAME, url: SITE_URL },
    articleSection: route.category || (route.type === 'article' ? 'Travel article' : 'Travel guide'),
    mainEntityOfPage: { '@type': 'WebPage', '@id': `${url}#webpage` },
  };
}

function faqJsonLd(faq = []) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faq.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
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
    route.faq?.length ? faqJsonLd(route.faq) : null,
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
  const fullTitle = route.exactTitle || route.title.includes(SITE_NAME) ? route.title : `${route.title} · ${SITE_NAME}`;
  const url = `${SITE_URL}${route.canonicalPath}`;
  const isArticle = routeIsArticle(route);
  const image = route.image || DEFAULT_IMAGE;
  const head = [
    `<title data-rh="true">${escapeHtml(fullTitle)}</title>`,
    `<meta data-rh="true" name="description" content="${escapeHtml(route.description)}">`,
    `<meta data-rh="true" name="robots" content="${route.noindex ? 'noindex,nofollow' : 'index,follow,max-image-preview:large'}">`,
    `<link data-rh="true" rel="canonical" href="${escapeHtml(url)}">`,
    `<meta data-rh="true" property="og:site_name" content="${SITE_NAME}">`,
    `<meta data-rh="true" property="og:title" content="${escapeHtml(fullTitle)}">`,
    `<meta data-rh="true" property="og:description" content="${escapeHtml(route.description)}">`,
    `<meta data-rh="true" property="og:url" content="${escapeHtml(url)}">`,
    `<meta data-rh="true" property="og:type" content="${isArticle ? 'article' : 'website'}">`,
    `<meta data-rh="true" property="og:image" content="${escapeHtml(image)}">`,
    `<meta data-rh="true" property="og:locale" content="${route.locale || 'en_US'}">`,
    `<meta data-rh="true" name="twitter:card" content="summary_large_image">`,
    `<meta data-rh="true" name="twitter:title" content="${escapeHtml(fullTitle)}">`,
    `<meta data-rh="true" name="twitter:description" content="${escapeHtml(route.description)}">`,
    `<meta data-rh="true" name="twitter:image" content="${escapeHtml(image)}">`,
    schemaScripts(route, url, fullTitle),
    `<style data-static-fallback>.static-fallback{font-family:Arial,sans-serif;max-width:76ch;margin:0 auto;padding:2rem;color:#1f1f1f;line-height:1.65}.static-fallback a{color:#b95741}.static-fallback .overline{font-size:.78rem;letter-spacing:.12em;text-transform:uppercase;color:#9a6a55}.static-fallback h1{font-family:Georgia,serif;font-size:clamp(2rem,5vw,3.5rem);line-height:1.05;margin:.5rem 0 1rem}.static-fallback ul{padding-left:1.2rem}.static-fallback li{margin:.45rem 0}.js .static-fallback{display:none}</style>`,
    `<script data-static-fallback>document.documentElement.classList.add("js");</script>`,
  ].join('');

  return html.replace('</head>', `${head}</head>`);
}

function slugify(text) {
  return String(text)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function splitTableLine(line) {
  return line
    .trim()
    .replace(/^\|/, '')
    .replace(/\|$/, '')
    .split('|')
    .map((cell) => cell.trim());
}

function inlineMarkdownToHtml(text = '') {
  const parts = [];
  const re = /\[([^\]]+)\]\(([^)]+)\)|(https?:\/\/[^\s]+)/g;
  let lastIndex = 0;
  let match;

  while ((match = re.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(escapeHtml(text.slice(lastIndex, match.index)));
    }

    const label = match[1] || match[3];
    const href = match[2] || match[3];
    const safeHref = escapeHtml(href);
    const safeLabel = escapeHtml(label);
    if (/^https?:\/\//i.test(href)) {
      parts.push(`<a href="${safeHref}" target="_blank" rel="noopener noreferrer">${safeLabel}</a>`);
    } else {
      parts.push(`<a href="${safeHref}">${safeLabel}</a>`);
    }

    lastIndex = re.lastIndex;
  }

  if (lastIndex < text.length) {
    parts.push(escapeHtml(text.slice(lastIndex)));
  }

  return parts.join('').replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
}

function markdownToHtml(markdown = '') {
  const lines = markdown.split(/\n/);
  const html = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i].trim();
    if (!line) {
      i += 1;
      continue;
    }

    if (line.startsWith("![")) {
      const match = line.match(/^!\[([^\]]+)\]\(([^)]+)\)$/);
      if (match) {
        const alt = match[1];
        const src = match[2];
        let captionHtml = "";
        if (i + 1 < lines.length && lines[i + 1].trim()) {
          const nextLine = lines[i + 1].trim();
          if (nextLine.startsWith("*") || nextLine.startsWith("_") || nextLine.length < 150) {
            captionHtml = `<p class="mt-2 text-center text-sm text-[hsl(var(--charcoal-soft))] italic">${inlineMarkdownToHtml(nextLine)}</p>`;
            i += 1;
          }
        }
        html.push(`<div class="my-8"><img src="${escapeHtml(src)}" alt="${escapeHtml(alt)}" class="w-full rounded-2xl object-cover aspect-[16/9] shadow-sm" />${captionHtml}</div>`);
        i += 1;
        continue;
      }
    }

    const heading = line.match(/^(#{2,4})\s+(.+)$/);
    if (heading) {
      const level = heading[1].length;
      const text = heading[2].trim();
      const id = level <= 3 ? ` id="${slugify(text)}"` : '';
      html.push(`<h${level}${id}>${escapeHtml(text)}</h${level}>`);
      i += 1;
      continue;
    }

    if (line.startsWith('|')) {
      const tableLines = [];
      while (i < lines.length && lines[i].trim().startsWith('|')) {
        tableLines.push(lines[i]);
        i += 1;
      }
      const [headerLine, ...rowLines] = tableLines;
      const headers = splitTableLine(headerLine).map((cell) => `<th>${inlineMarkdownToHtml(cell)}</th>`).join('');
      const rows = rowLines
        .filter((rowLine) => !splitTableLine(rowLine).every((cell) => /^:?-{3,}:?$/.test(cell)))
        .map((rowLine) => `<tr>${splitTableLine(rowLine).map((cell) => `<td>${inlineMarkdownToHtml(cell)}</td>`).join('')}</tr>`)
        .join('');
      html.push(`<div class="longform-table-wrap"><table><thead><tr>${headers}</tr></thead><tbody>${rows}</tbody></table></div>`);
      continue;
    }

    if (line.startsWith('>')) {
      const quotes = [];
      while (i < lines.length && lines[i].trim().startsWith('>')) {
        quotes.push(`<p>${inlineMarkdownToHtml(lines[i].trim().replace(/^>\s?/, ''))}</p>`);
        i += 1;
      }
      html.push(`<blockquote>${quotes.join('')}</blockquote>`);
      continue;
    }

    if (line.startsWith('- ')) {
      const items = [];
      while (i < lines.length && lines[i].trim().startsWith('- ')) {
        items.push(`<li>${inlineMarkdownToHtml(lines[i].trim().slice(2))}</li>`);
        i += 1;
      }
      html.push(`<ul>${items.join('')}</ul>`);
      continue;
    }

    if (/^\d+\.\s+/.test(line)) {
      const items = [];
      while (i < lines.length && /^\d+\.\s+/.test(lines[i].trim())) {
        items.push(`<li>${inlineMarkdownToHtml(lines[i].trim().replace(/^\d+\.\s+/, ''))}</li>`);
        i += 1;
      }
      html.push(`<ol>${items.join('')}</ol>`);
      continue;
    }

    const paragraph = [];
    while (
      i < lines.length &&
      lines[i].trim() &&
      !/^(#{2,4})\s+/.test(lines[i].trim()) &&
      !lines[i].trim().startsWith('- ') &&
      !lines[i].trim().startsWith('>') &&
      !/^\d+\.\s+/.test(lines[i].trim()) &&
      !lines[i].trim().startsWith('|')
    ) {
      paragraph.push(lines[i].trim());
      i += 1;
    }
    html.push(`<p>${inlineMarkdownToHtml(paragraph.join(' '))}</p>`);
  }

  return html.join('');
}

function imageCreditHtml(imageCredit) {
  if (!imageCredit) return '';
  const author = imageCredit.source
    ? `<a href="${escapeHtml(imageCredit.source)}" target="_blank" rel="nofollow noopener noreferrer">${escapeHtml(imageCredit.author || 'Photo source')}</a>`
    : escapeHtml(imageCredit.author || 'Photo source');
  const license = imageCredit.license
    ? imageCredit.licenseUrl
      ? `, <a href="${escapeHtml(imageCredit.licenseUrl)}" target="_blank" rel="license noopener noreferrer">${escapeHtml(imageCredit.license)}</a>`
      : `, ${escapeHtml(imageCredit.license)}`
    : '';
  const changes = imageCredit.changes ? `. ${escapeHtml(imageCredit.changes)}` : '';
  return `<figcaption>Photo: ${author}${license}${changes}</figcaption>`;
}

function florenceToSienaFallbackMarkup() {
  const guide = FLORENCE_TO_SIENA_GUIDE;
  const links = guide.relatedLinks
    .map((item) => `<a href="${item.href}">${escapeHtml(item.label)}</a>`)
    .join(' · ');
  const officialSources = guide.officialSources
    .map((source) => `<li><a href="${escapeHtml(source.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(source.url)}</a></li>`)
    .join('');

  return [
    `<main id="static-fallback" class="static-fallback">`,
    `<p class="overline">${escapeHtml(guide.category)}</p>`,
    `<h1>${escapeHtml(guide.title)}</h1>`,
    markdownToHtml(guide.introMarkdown),
    `<p><strong>Author:</strong> <a href="${guide.author.url}">${escapeHtml(guide.author.name)}</a> · <strong>Published:</strong> July 14, 2026 · <strong>Updated:</strong> July 14, 2026 · <strong>Fact-checked:</strong> ${escapeHtml(guide.factChecked)}</p>`,
    `<figure class="article-image"><img src="${guide.hero.src}" alt="${escapeHtml(guide.hero.alt)}" width="${guide.hero.width}" height="${guide.hero.height}" loading="eager" fetchpriority="high">${guide.hero.credit ? `<figcaption>${escapeHtml(guide.hero.credit)}</figcaption>` : ""}</figure>`,
    `<section class="longform-callout">${markdownToHtml(guide.quickAnswerMarkdown)}</section>`,
    `<aside class="longform-disclosure">${markdownToHtml(guide.disclosureMarkdown)}</aside>`,
    markdownToHtml(guide.bodyMarkdown),
    `<section id="official-sources"><h2>Official sources</h2><ul>${officialSources}</ul></section>`,
    `<section><h2>${escapeHtml(guide.author.name)}</h2><p>${escapeHtml(guide.author.bio)}</p><p><a href="/editorial-policy">Editorial policy</a></p></section>`,
    `<p>${links}</p>`,
    `</main>`,
  ].join('');
}

function internalReferencesToLinks(markdown = '', linkMap = {}) {
  return markdown.replace(/\[Internal link:\s*([^\]]+)\]/g, (_match, label) => {
    const href = linkMap[label] || '/blog';
    return `[${label}](${href})`;
  });
}

function sienaDayTripFallbackMarkup() {
  const guide = SIENA_DAY_TRIP_FROM_FLORENCE_GUIDE;
  const links = STATIC_FOOTER_LINKS
    .map((item) => `<a href="${item.href}">${escapeHtml(item.label)}</a>`)
    .join(' · ');
  const credits = [guide.hero, ...Object.values(guide.imagePlacements || {})]
    .map((image) => (
      `<li>${escapeHtml(image.caption)} Photo: <a href="${escapeHtml(image.source)}" target="_blank" rel="nofollow noopener">${escapeHtml(image.photographer)}</a>, <a href="${escapeHtml(image.licenseUrl)}" target="_blank" rel="license noopener">${escapeHtml(image.licenseName)}</a>. ${escapeHtml(image.adaptation)}</li>`
    ))
    .join('');
  const published = new Date(guide.datePublished).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return [
    `<main id="static-fallback" class="static-fallback">`,
    `<p class="overline">${escapeHtml(guide.category)}</p>`,
    `<h1>${escapeHtml(guide.title)}</h1>`,
    `<p>${escapeHtml(guide.excerpt)}</p>`,
    markdownToHtml(internalReferencesToLinks(guide.introMarkdown, guide.linkMap)),
    `<p><strong>Author:</strong> <a href="${guide.author.url}">${escapeHtml(guide.author.name)}</a> · <strong>Published:</strong> ${published} · <strong>Fact-checked:</strong> ${escapeHtml(guide.factChecked)}</p>`,
    `<figure class="article-image"><img src="${guide.hero.src}" alt="${escapeHtml(guide.hero.alt)}" width="${guide.hero.width}" height="${guide.hero.height}" loading="eager" fetchpriority="high"><figcaption>${escapeHtml(guide.hero.caption)} Photo: <a href="${escapeHtml(guide.hero.source)}" target="_blank" rel="nofollow noopener">${escapeHtml(guide.hero.photographer)}</a>, <a href="${escapeHtml(guide.hero.licenseUrl)}" target="_blank" rel="license noopener">${escapeHtml(guide.hero.licenseName)}</a>. ${escapeHtml(guide.hero.adaptation)}</figcaption></figure>`,
    markdownToHtml(internalReferencesToLinks(guide.bodyMarkdown, guide.linkMap)),
    `<section id="photo-credits"><h2>Photo credits</h2><ul>${credits}</ul></section>`,
    `<section><h2>${escapeHtml(guide.author.name)}</h2><p>${escapeHtml(guide.author.bio)}</p><p><a href="/editorial-policy">Editorial policy</a></p></section>`,
    `<p>${links}</p>`,
    `</main>`,
  ].join('');
}

function hideFutureClusterLinks(html = '') {
  const visibleRoutes = publishedSienaClusterRoutes();
  const clusterRoutes = new Set(SIENA_CONTENT_CLUSTER.articles.map((article) => article.route));

  return html.replace(/<a href="(\/[^"]+)"([^>]*)>(.*?)<\/a>/gims, (match, href, attrs, label) => {
    if (!clusterRoutes.has(href) || visibleRoutes.has(href)) {
      return match;
    }

    return `<span class="scheduled-inline-link">${label}</span>`;
  });
}

function sienaClusterFallbackMarkup(route) {
  const article = route.article;
  const links = STATIC_FOOTER_LINKS
    .map((item) => `<a href="${item.href}">${escapeHtml(item.label)}</a>`)
    .join(' · ');
  const related = (route.relatedLinks || [])
    .slice(0, 8)
    .map((link) => `<li><a href="${link.href}">${escapeHtml(link.label)}</a></li>`)
    .join('');

  return [
    `<main id="static-fallback" class="static-fallback">`,
    `<p class="overline">Siena Travel Guide</p>`,
    `<h1>${escapeHtml(article.title)}</h1>`,
    `<p>${escapeHtml(article.excerpt)}</p>`,
    `<figure><img src="${article.hero.src}" alt="${escapeHtml(article.hero.alt)}" width="1600" height="1000" loading="eager" decoding="async"><figcaption>${escapeHtml(article.hero.credit)} License: <a href="${article.hero.licenseUrl}" rel="license noopener">${escapeHtml(article.hero.license)}</a>. Cropped, resized, and compressed for web.</figcaption></figure>`,
    hideFutureClusterLinks(article.bodyHtml),
    related ? `<section><h2>Related Siena guides</h2><ul>${related}</ul></section>` : '',
    `<p>${links}</p>`,
    `</main>`,
  ].join('');
}

function fallbackMarkup(route) {
  if (route.type === 'florence-to-siena-longform') {
    return florenceToSienaFallbackMarkup();
  }

  if (route.type === 'siena-day-trip-longform') {
    return sienaDayTripFallbackMarkup();
  }

  if (route.type === 'siena-cluster-article') {
    return sienaClusterFallbackMarkup(route);
  }

  const bullets = (route.bullets || []).map((item) => `<li>${escapeHtml(item)}</li>`).join('');
  const image = route.image
    ? `<figure><img src="${escapeHtml(route.image)}" alt="${escapeHtml(route.imageAlt || route.h1 || route.title)}" width="1600" height="900" loading="eager" decoding="async">${imageCreditHtml(route.imageCredit)}</figure>`
    : '';
  const body = route.bodyHtml || (bullets ? `<ul>${bullets}</ul>` : '');
  const links = STATIC_FOOTER_LINKS
    .map((item) => `<a href="${item.href}">${escapeHtml(item.label)}</a>`)
    .join(' · ');

  return [
    `<main id="static-fallback" class="static-fallback">`,
    `<p class="overline">Archi Travel Guide</p>`,
    `<h1>${escapeHtml(route.h1 || route.title)}</h1>`,
    `<p>${escapeHtml(route.description)}</p>`,
    image,
    body,
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
  if ((quote !== "'" && quote !== '"' && quote !== '`') || trimmed[trimmed.length - 1] !== quote) return '';
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

    if (ch === '"' || ch === "'" || ch === '`') {
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

function safeEvalLiteral(literal, fallback) {
  try {
    return Function(`"use strict"; return (${literal});`)();
  } catch (_) {
    return fallback;
  }
}

function absoluteImageUrl(image = '') {
  if (!image) return DEFAULT_IMAGE;
  if (/^https?:\/\//i.test(image)) return image;
  return `${SITE_URL}${image.startsWith('/') ? image : `/${image}`}`;
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
      } else if (ch === '"' || ch === "'" || ch === '`') {
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
    if (REDIRECTED_ARTICLE_SLUGS.has(slug)) {
      i = j;
      continue;
    }

    if (slug && !seen.has(slug)) {
      seen.add(slug);
      const title = stringArg(args[1]);
      const category = stringArg(args[2]);
      const region = stringArg(args[3]);
      const excerpt = stringArg(args[4]);
      const image = stringArg(args[5]);
      const routeImage = image ? absoluteImageUrl(image) : '';
      const sections = safeEvalLiteral(args[6] || '[]', []);
      const faqs = safeEvalLiteral(args[7] || '[]', []);
      const updated = stringArg(args[8]) || SCHEMA_UPDATED;
      const options = safeEvalLiteral(args[9] || '{}', {});
      const headings = sections.slice(0, 4).map((section) => section.heading).filter(Boolean);
      const faq = faqs.map((item) => ({
        question: item.q || item.question,
        answer: item.a || item.answer,
      })).filter((item) => item.question && item.answer);
      const bodyMarkdown = [
        ...sections.map((section) => `## ${section.heading}\n\n${section.body}`),
        ...(faqs.length
          ? [`## Frequently asked questions\n\n${faqs.map((item) => `### ${item.q}\n\n${item.a}`).join('\n\n')}`]
          : []),
      ].join('\n\n');

      results.push({
        path: `/blog/${slug}`,
        canonicalPath: options.canonicalPath || `/blog/${slug}`,
        title: options.seoTitle || title,
        exactTitle: Boolean(options.seoTitle),
        description: excerpt,
        h1: title,
        locale: 'en_US',
        type: 'article',
        image: routeImage,
        imageAlt: options.imageAlt || title,
        imageCredit: options.imageCredit,
        published: options.published || updated.slice(0, 10),
        modified: updated.slice(0, 10),
        category,
        faq,
        bodyHtml: markdownToHtml(bodyMarkdown),
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
  const routes = [...STATIC_ROUTES, ...sienaClusterRoutes(), ...extractArticles()];

  routes.forEach((route) => {
    const outPath = outputPathFor(route.path);
    fs.mkdirSync(path.dirname(outPath), { recursive: true });
    fs.writeFileSync(outPath, renderRoute(template, route), 'utf-8');
  });

  console.log(`✓ Wrote static HTML fallback for ${routes.length} routes`);
  console.log(`  SITE_URL = ${SITE_URL}`);
}

main();
