const SITE_URL = "https://affittacameregliarchi.com";
const SITE_NAME = "Archi Travel Guide";
const SITE_TAGLINE = "Siena travel planning, guides, and practical itineraries";
const DEFAULT_DESCRIPTION =
  "Discover practical travel guidance for Siena and Tuscany: where to stay, what to do, how to plan transport, and budget-friendly trip planning.";
const DEFAULT_OG_IMAGE = "/og-image.jpg";
const TWITTER_HANDLE = "@architravelguide";

// Cloudflare Pages 308-redirects /path to /path/, and sitemap.xml emits the
// slashed form. A canonical naming the slashless URL therefore points at a URL
// that immediately redirects back, so canonical, sitemap and the URL that
// actually serves 200 disagree. Normalise to the slashed form.
//
// canonical() is also used to absolutise image paths, so anything that ends in
// a file extension — or carries a query/fragment — is left exactly as it is.
// scripts/generate-static-html.js and scripts/generate-sitemap.js repeat this
// rule; they are standalone Node scripts and cannot import from src/.
const withTrailingSlash = (path) => {
  if (path.endsWith("/") || /[?#]/.test(path)) {
    return path;
  }

  const lastSegment = path.slice(path.lastIndexOf("/") + 1);
  return lastSegment.includes(".") ? path : `${path}/`;
};

const canonical = (path = "/") => {
  if (!path) {
    return SITE_URL + "/";
  }

  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${SITE_URL}${withTrailingSlash(normalizedPath)}`;
};

const ORGANIZATION_JSONLD = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${SITE_URL}/#organization`,
  name: SITE_NAME,
  url: SITE_URL,
  brand: {
    "@type": "Brand",
    name: SITE_NAME,
  },
};

const websiteSchema = () => ({
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${SITE_URL}/#website`,
  url: SITE_URL,
  name: SITE_NAME,
  description: DEFAULT_DESCRIPTION,
  // /blog?q= is the real, filtering search results page — see Blog.jsx.
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${SITE_URL}/blog?q={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
});

export {
  SITE_URL,
  SITE_URL as siteUrl,
  SITE_NAME,
  SITE_NAME as siteName,
  SITE_TAGLINE,
  SITE_TAGLINE as siteTagline,
  DEFAULT_DESCRIPTION,
  DEFAULT_DESCRIPTION as siteDescription,
  DEFAULT_OG_IMAGE,
  DEFAULT_OG_IMAGE as defaultOgImage,
  TWITTER_HANDLE,
  TWITTER_HANDLE as twitterHandle,
  canonical,
  canonical as canonicalUrl,
  ORGANIZATION_JSONLD,
  websiteSchema,
};
