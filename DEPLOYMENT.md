# Deployment

Archi Travel Guide is a React SPA + FastAPI service backed by MongoDB. The
container in this environment is production-similar (supervisor + hot reload).
Follow this document when moving to the target domain
**https://affittacameregliarchi.com**.

## 1. Set the canonical site URL

The single most important environment variable at launch:

```
REACT_APP_SITE_URL=https://affittacameregliarchi.com
```

Set it in the deployment platform's frontend build environment. It's read by
`src/lib/seo.js` and drives:

- `<link rel="canonical">`
- `og:url` and JSON-LD `@id` fields
- The `<loc>` values in `public/sitemap.xml` (via `yarn sitemap`)
- Any absolute URL rendered in shared pages

If the variable is missing at build time, the app safely falls back to the same
production origin — so no page will ever emit `localhost` URLs. Fallback lives
in one place: `src/lib/seo.js`.

## 2. Regenerate the sitemap

```
cd frontend
REACT_APP_SITE_URL=https://affittacameregliarchi.com yarn sitemap
```

`yarn build` already runs `yarn sitemap` as a pre-step. Committing the
generated `public/sitemap.xml` is fine — the file is deterministic.

## 3. Confirm robots.txt

`public/robots.txt` is intentionally minimal:

```
User-agent: *
Allow: /
Disallow: /api/
Sitemap: https://affittacameregliarchi.com/sitemap.xml
```

## 4. Backend environment (production)

```
MONGO_URL=<your-production-connection-string>
DB_NAME=archi_travel_guide
CORS_ORIGINS=https://affittacameregliarchi.com,https://www.affittacameregliarchi.com
```

**Never** ship `CORS_ORIGINS=*` to production.

## 5. Frontend build

```
yarn install
yarn build       # produces /build with sitemap + hashed assets
```

Serve the `build/` folder from any static host. Configure the host to:

1. Redirect `www.affittacameregliarchi.com` → apex (or vice-versa — pick one and
   make it canonical).
2. Redirect all non-`/api/*` paths to `/index.html` for SPA routing.
3. Set `Cache-Control: public, max-age=31536000, immutable` for `/static/*`.
4. Set `Cache-Control: public, max-age=0, must-revalidate` for `/index.html`.
5. HTTPS only, HSTS enabled.

## 6. Post-deploy manual checks

Run these once, in this order:

1. Open `https://affittacameregliarchi.com/` — verify hero image, no console errors.
2. `curl -sI https://affittacameregliarchi.com/sitemap.xml` — expect 200 + XML.
3. `curl -sI https://affittacameregliarchi.com/robots.txt` — expect 200.
4. Open `view-source:` on 3 pages and confirm exactly one `<title>` and one
   `<meta name="description">` per page (see `SEO_CHECKLIST.md`).
5. Submit sitemap in **Google Search Console** and **Bing Webmaster Tools**.
6. Verify a JSON-LD article page in Google's Rich Results Test.
7. Confirm the contact form POSTs to `/api/contact` and creates a document in
   the `contact_messages` collection.

## 7. Deferred integrations

- **Resend** (contact form email) — see `HANDOFF.md`.
- **Google AdSense** — see `MONETIZATION_CHECKLIST.md`.
- **Analytics** — no analytics is wired in v1. If you add Plausible / GA4,
  update the cookie policy and cookie banner copy accordingly.

## 8. Rollback

Since the site is static SPA + stateless backend, roll back by redeploying the
previous build tag. MongoDB collections (`newsletter`, `contact_messages`)
are additive — no migrations required.
