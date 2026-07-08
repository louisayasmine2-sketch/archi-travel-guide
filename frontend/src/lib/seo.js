const SITE_URL = "https://affittacameregliarchi.com";
const SITE_NAME = "Archi Travel Guide";
const SITE_TAGLINE = "Siena travel planning, guides, and practical itineraries";
const DEFAULT_DESCRIPTION =
  "Discover practical travel guidance for Siena and Tuscany: where to stay, what to do, how to plan transport, and budget-friendly trip planning.";
const DEFAULT_OG_IMAGE = "/og-image.jpg";
const TWITTER_HANDLE = "@architravelguide";

const canonical = (path = "/") => {
  if (!path) {
    return SITE_URL + "/";
  }

  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${SITE_URL}${normalizedPath}`;
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
