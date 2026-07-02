// Central SEO configuration. Canonical URLs use SITE_URL.
// Override via REACT_APP_SITE_URL at build time when deploying to production.
// When no env value is set, use the browser origin locally or localhost in scripts/tests.

const configuredSiteUrl =
  process.env.REACT_APP_SITE_URL ||
  process.env.VITE_SITE_URL ||
  process.env.NEXT_PUBLIC_SITE_URL ||
  "";
const runtimeSiteUrl =
  typeof window !== "undefined" && window.location?.origin
    ? window.location.origin
    : "http://localhost:3000";

export const SITE_URL = (configuredSiteUrl || runtimeSiteUrl).replace(/\/$/, '');
export const SITE_NAME = 'Archi Travel Guide';
export const SITE_TAGLINE = 'Plan smarter trips around the world';
export const DEFAULT_OG_IMAGE = 'https://images.unsplash.com/photo-1761995912965-8f134652fc6e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzV8MHwxfHNlYXJjaHwyfHx0dXNjYW55JTIwcm9sbGluZyUyMGhpbGxzJTIwc3VucmlzZXxlbnwwfHx8fDE3ODMwMDQ0ODZ8MA&ixlib=rb-4.1.0&q=85&w=1200&h=630&fit=crop';
export const DEFAULT_DESCRIPTION = 'Archi Travel Guide — an independent global travel planning platform. Practical destination guides, itineraries, budget & packing tools. First editorial pillar: Italy, Tuscany, Siena.';
export const TWITTER_HANDLE = '@architravelguide';
export const ORGANIZATION_JSONLD = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: SITE_NAME,
  url: SITE_URL,
  logo: `${SITE_URL}/logo192.png`,
  sameAs: [],
};

export const canonical = (path = '/') => `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`;
