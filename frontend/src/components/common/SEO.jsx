import { Helmet } from "react-helmet-async";
import { SITE_URL, SITE_NAME, SITE_TAGLINE, DEFAULT_OG_IMAGE, DEFAULT_DESCRIPTION, TWITTER_HANDLE, canonical } from "@/lib/seo";

/**
 * SEO component — renders <title>, meta description, OG, Twitter card, canonical,
 * and optional JSON-LD structured data.
 *
 * Props:
 *  - title:        Page title (appended with site name automatically).
 *  - titleTemplate 'append' | 'replace' | 'exact' — how to combine with site name.
 *  - description:  Meta description (defaults to site default).
 *  - path:         Route path used to build the canonical URL (defaults to current window path).
 *  - image:        OG / Twitter image URL (defaults to hero fallback).
 *  - type:         OG type (defaults to 'website'; use 'article' for articles).
 *  - noindex:      Adds robots noindex,nofollow.
 *  - schema:       Single JSON-LD object OR array of objects.
 *  - articleMeta:  { published, modified, section, tags } — emits article:* OG tags.
 */
export default function SEO({
  title,
  titleTemplate = "append",
  description = DEFAULT_DESCRIPTION,
  path,
  image = DEFAULT_OG_IMAGE,
  type = "website",
  noindex = false,
  schema,
  articleMeta,
}) {
  const routePath = path ?? (typeof window !== "undefined" ? window.location.pathname : "/");
  const url = canonical(routePath);
  const fullTitle =
    titleTemplate === "exact"
      ? title || SITE_NAME
      : titleTemplate === "replace"
      ? (title || SITE_NAME)
      : title
      ? `${title} · ${SITE_NAME}`
      : `${SITE_NAME} — ${SITE_TAGLINE}`;

  const schemas = Array.isArray(schema) ? schema : schema ? [schema] : [];

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      {noindex && <meta name="robots" content="noindex,nofollow" />}
      {!noindex && <meta name="robots" content="index,follow,max-image-preview:large" />}

      {/* Open Graph */}
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content={type} />
      <meta property="og:image" content={image} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:locale" content="en_US" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content={TWITTER_HANDLE} />
      <meta name="twitter:creator" content={TWITTER_HANDLE} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* Article-specific tags */}
      {articleMeta?.published && <meta property="article:published_time" content={articleMeta.published} />}
      {articleMeta?.modified && <meta property="article:modified_time" content={articleMeta.modified} />}
      {articleMeta?.section && <meta property="article:section" content={articleMeta.section} />}
      {(articleMeta?.tags || []).map((t) => (
        <meta key={t} property="article:tag" content={t} />
      ))}

      {/* JSON-LD structured data */}
      {schemas.map((s, i) => (
        <script key={i} type="application/ld+json">{JSON.stringify(s)}</script>
      ))}
    </Helmet>
  );
}

export { SITE_URL, SITE_NAME };
