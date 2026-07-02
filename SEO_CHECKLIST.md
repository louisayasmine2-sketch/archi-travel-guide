# SEO Checklist

Verify these before opening the site to search engines.

## Per-page metadata

Every route in `src/App.js` renders a `<SEO>` component
(`src/components/common/SEO.jsx`). For every page confirm:

- [x] Unique `<title>` (never generic)
- [x] Unique `<meta name="description">` (~140–160 chars)
- [x] `<link rel="canonical">` points to production origin
- [x] `og:title`, `og:description`, `og:url`, `og:image`, `og:type`, `og:site_name`
- [x] `twitter:card=summary_large_image`, `twitter:title`, `twitter:description`, `twitter:image`
- [x] `<meta name="robots" content="index,follow,max-image-preview:large">` (or `noindex,nofollow` for `/404`)

### Verified route coverage

| Route                                     | title  | description | OG    | schema                             |
| ----------------------------------------- | ------ | ----------- | ----- | ---------------------------------- |
| `/`                                       | ✓      | ✓           | ✓     | WebSite + Organization             |
| `/destinations`                           | ✓      | ✓           | ✓     | BreadcrumbList                     |
| `/italy` `/tuscany` `/siena`              | ✓      | ✓           | ✓     | BreadcrumbList                     |
| `/florence` `/rome` `/venice`             | ✓      | ✓           | ✓     | Breadcrumb + TouristDestination + FAQPage |
| `/europe` `/asia`                         | ✓      | ✓           | ✓     | BreadcrumbList                     |
| `/travel-tools` + 6 tool routes           | ✓      | ✓           | ✓     | BreadcrumbList                     |
| `/travel-deals`                           | ✓      | ✓           | ✓     | BreadcrumbList                     |
| `/blog`                                   | ✓      | ✓           | ✓     | BreadcrumbList                     |
| `/blog/:slug`                             | ✓      | ✓           | ✓     | Breadcrumb + Article + FAQPage     |
| `/about` `/contact`                       | ✓      | ✓           | ✓     | BreadcrumbList                     |
| 5 legal pages                             | ✓      | ✓           | ✓     | BreadcrumbList                     |
| `/404` (any unknown route)                | ✓      | ✓           | ✓     | — (noindex)                        |

## Structured data

- Home: WebSite (with SearchAction) + Organization
- City pages: BreadcrumbList + TouristDestination + FAQPage
- Article pages: BreadcrumbList + Article + FAQPage
- Test in Google Rich Results Test: https://search.google.com/test/rich-results

## Sitemap & robots

- `/sitemap.xml` — 44 URLs. Regenerate with `yarn sitemap`.
- `/robots.txt` — allows crawling, disallows `/api/`, references sitemap.
- Submit sitemap in Google Search Console + Bing Webmaster Tools after DNS.

## Internal linking

- Every city page cross-links to Italy, Tuscany, Siena, Travel Tools.
- Every article's region breadcrumb links back to its parent destination page.
- Every travel tool page has "sibling" links to related tools via the Travel
  Tools hub.
- Footer contains persistent links to every destination, every tool, and every
  legal page.

## Performance guardrails

- Images use `loading="lazy"` with explicit `aspect-ratio` to prevent CLS.
- Hero images (`eager`) are the only images loaded above-the-fold.
- Video is never auto-embedded — thumbnail cards trigger the external embed
  only on user click.
- Fonts preconnect + swap; only two families loaded (Cormorant Garamond, Manrope).

## Common launch issues (already handled)

1. **Duplicate `<title>` / `<meta description>`** — the static ones were
   removed from `public/index.html` so react-helmet-async is the sole source.
2. **Wrong canonical origin** — the fallback in `src/lib/seo.js` is the
   production domain. Set `REACT_APP_SITE_URL` at build time to be safe.
3. **Missing lastmod** — `yarn sitemap` reads `updated` from
   `src/data/articles.js` and emits per-article `<lastmod>`.

## Post-launch monitoring

- Search Console: submit sitemap, monitor Coverage report for errors.
- Watch for soft-404s on legacy `/rooms/` or `/reservation/` paths (pre-brand).
- Add 301 redirects at the host level if any legacy URLs pointed at
  `affittacameregliarchi.com`.
