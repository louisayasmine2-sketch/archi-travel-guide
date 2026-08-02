// JSON-LD schema helpers.
import { SITE_URL, SITE_NAME, canonical } from "@/lib/seo";

export function breadcrumbSchema(items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.label,
      // canonical() rather than plain concatenation: a breadcrumb item naming
      // the slashless URL points at a 308 redirect, same as the canonical tag.
      ...(it.to ? { item: canonical(it.to) } : {}),
    })),
  };
}

export function articleSchema({ title, description, image, url, published, modified, author, category }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    // Same @id the static shells emit (scripts/generate-static-html.js), so
    // the client- and static-rendered copies dedupe into one entity.
    ...(url ? { '@id': `${url}#article` } : {}),
    headline: title,
    description,
    ...(image ? { image: [image] } : {}),
    ...(published ? { datePublished: published } : {}),
    ...(modified || published ? { dateModified: modified || published } : {}),
    author: {
      '@type': 'Organization',
      name: author?.name || SITE_NAME,
      url: SITE_URL,
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      logo: { '@type': 'ImageObject', url: `${SITE_URL}/logo192.png` },
    },
    articleSection: category,
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
  };
}

export function faqSchema(faqs) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };
}

export function placeSchema({ name, description, image, url, region, country, touristType }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'TouristDestination',
    '@id': `${url}#destination`,
    name,
    description,
    ...(image ? { image: [image] } : {}),
    url,
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    ...(touristType ? { touristType } : {}),
    ...(region
      ? {
          containedInPlace: {
            '@type': 'Place',
            name: region,
            ...(country ? { containedInPlace: { '@type': 'Country', name: country } } : {}),
          },
        }
      : country
      ? { containedInPlace: { '@type': 'Country', name: country } }
      : {}),
  };
}

export function websiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    name: SITE_NAME,
    url: SITE_URL,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${SITE_URL}/blog?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };
}
