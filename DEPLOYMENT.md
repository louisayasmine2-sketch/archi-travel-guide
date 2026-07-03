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

If the variable is missing at build time, local development falls back to the browser origin or `http://localhost:3000`. Production deploys must set `REACT_APP_SITE_URL` so generated metadata and `public/sitemap.xml` use `https://affittacameregliarchi.com`. Fallback lives in one place: `src/lib/seo.js`.

For Cloudflare Pages, set the variable in **Settings → Environment Variables → Build variables**:

```
Variable name: REACT_APP_SITE_URL
Value: https://affittacameregliarchi.com
```

## 2. Enable Google Analytics 4 (Cloudflare Pages)

This project reads GA only from an env var and only runs in production builds.

Add this variable in Cloudflare Pages (same location as above):

```
Variable name: REACT_APP_GA_MEASUREMENT_ID
Value: G-XXXXXXXXXX
```

Optional: set an optional preview value for non-production preview builds:

```
Environment: Preview (optional)
Variable name: REACT_APP_GA_MEASUREMENT_ID
Value: (left empty)
```

If `REACT_APP_GA_MEASUREMENT_ID` is set and deployment is production, GA4 is initialized automatically and page views are tracked on SPA route changes.

Additional conversion events are already implemented:

- `contact_submit` (Contact page form submit)
- `lead_submit` (Article fast lead form submit)

To mark these as GA4 conversions, in Google Analytics go to
**Configure → Events → Import conversion events** and enable both event names.

## 3. Enable Microsoft Clarity (Cloudflare Pages)

Microsoft Clarity is optional and is controlled by an env var. It only loads in
production builds after the visitor accepts the cookie banner.

Add this variable in Cloudflare Pages (same location as above):

```
Variable name: REACT_APP_CLARITY_PROJECT_ID
Value: <your-clarity-project-id>
```

When enabled, Clarity records behavior analytics such as heatmaps and session
recordings. The app also sends Clarity custom events for:

- `contact_submit`
- `lead_submit`

If this variable is empty or missing, Clarity is not loaded and the build still
works normally.

## 4. Enable Amplitude (Cloudflare Pages)

Amplitude is optional and is controlled by env vars. It only loads in production
builds after the visitor accepts the cookie banner.

Add these variables in Cloudflare Pages (same location as above):

```
Variable name: REACT_APP_AMPLITUDE_API_KEY
Value: <your-amplitude-api-key>

Variable name: REACT_APP_AMPLITUDE_SERVER_ZONE
Value: US
```

Use `EU` only if the Amplitude project was created with EU data residency.

When enabled, Amplitude receives:

- `page_view`
- `contact_submit`
- `lead_submit`

If the API key is empty or missing, Amplitude is not loaded and the build still
works normally.

## 5. Regenerate the sitemap

```
cd frontend
REACT_APP_SITE_URL=https://affittacameregliarchi.com yarn sitemap
```

`yarn build` already runs `yarn sitemap` as a pre-step. Committing the
generated `public/sitemap.xml` is fine — the file is deterministic.

## 6. Confirm robots.txt

`public/robots.txt` is intentionally minimal:

```
User-agent: *
Allow: /
Disallow: /api/
Sitemap: https://affittacameregliarchi.com/sitemap.xml
```

## 7. Backend environment (production)

```
MONGO_URL=<your-production-connection-string>
DB_NAME=archi_travel_guide
CORS_ORIGINS=https://affittacameregliarchi.com,https://www.affittacameregliarchi.com
RESEND_API_KEY=<your-production-resend-api-key>
RESEND_FROM_EMAIL=Archi Travel Guide <noreply@affittacameregliarchi.com>
RESEND_TO_EMAIL=contact@affittacameregliarchi.com
```

**Never** ship `CORS_ORIGINS=*` to production.

## 8. Frontend build

```
yarn install
REACT_APP_SITE_URL=https://affittacameregliarchi.com yarn build
                 # produces /build with sitemap + hashed assets
```

Serve the `build/` folder from any static host. Configure the host to:

1. Redirect `www.affittacameregliarchi.com` → apex (or vice-versa — pick one and
   make it canonical).
2. Redirect all non-`/api/*` paths to `/index.html` for SPA routing.
3. Set `Cache-Control: public, max-age=31536000, immutable` for `/static/*`.
4. Set `Cache-Control: public, max-age=0, must-revalidate` for `/index.html`.
5. HTTPS only, HSTS enabled.

## 9. Post-deploy manual checks

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
8. If `REACT_APP_CLARITY_PROJECT_ID` is set, accept the cookie banner and confirm
   the visit appears in Microsoft Clarity.
9. If `REACT_APP_AMPLITUDE_API_KEY` is set, accept the cookie banner and confirm
   `page_view` appears in Amplitude.

## 10. Deferred integrations

- **Resend** (contact form email) — see `HANDOFF.md`.
- **Google AdSense** — see `MONETIZATION_CHECKLIST.md`.
- **Analytics** — GA4 is wired in via `REACT_APP_GA_MEASUREMENT_ID` when set in
  production. Microsoft Clarity is wired in via `REACT_APP_CLARITY_PROJECT_ID`
  and Amplitude is wired in via `REACT_APP_AMPLITUDE_API_KEY` when set in
  production and the visitor accepts cookies.

## 11. Rollback

Since the site is static SPA + stateless backend, roll back by redeploying the
previous build tag. MongoDB collections (`newsletter`, `contact_messages`)
are additive — no migrations required.
