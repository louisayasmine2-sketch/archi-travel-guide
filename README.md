# Archi Travel Guide

An independent global travel planning platform. Practical destination guides,
itineraries, budget & packing tools. First editorial pillar: Italy, Tuscany, Siena.

- **Live domain (target):** https://affittacameregliarchi.com
- **Stack:** React 19 (CRA + Craco) + Tailwind + Shadcn UI · FastAPI · MongoDB
- **Status:** Launch-ready v1.1 (see [`memory/PRD.md`](memory/PRD.md) for changelog)

## Project layout

```
/app
├── backend/                  FastAPI service (all endpoints prefixed /api)
│   ├── server.py             Routes, models, tool logic
│   ├── requirements.txt
│   ├── .env                  Local secrets (do not commit)
│   └── .env.example
├── frontend/                 React SPA
│   ├── src/
│   │   ├── App.js            React Router routes
│   │   ├── components/
│   │   │   ├── common/       SEO, AdPlaceholder, cards, forms, LazyImage…
│   │   │   ├── layout/       Header, Footer, Layout, MobileMenu, CookieConsent
│   │   │   └── ui/           shadcn primitives
│   │   ├── data/             Editorial content (articles, destinations, cities)
│   │   ├── lib/              SEO + JSON-LD schema helpers
│   │   ├── pages/            Every route lives here
│   │   └── constants/testIds All data-testids for QA
│   ├── scripts/
│   │   └── generate-sitemap.js   Regenerates public/sitemap.xml
│   ├── public/
│   │   ├── sitemap.xml
│   │   ├── robots.txt
│   │   └── index.html
│   ├── .env                  Local env
│   ├── .env.example
│   └── package.json
├── memory/                   Product docs (PRD, credentials, handoff)
├── DEPLOYMENT.md
├── SEO_CHECKLIST.md
├── MONETIZATION_CHECKLIST.md
└── HANDOFF.md
```

## Local development

Both services are supervisor-managed inside the container.

- Frontend hot-reloads on file save.
- Backend hot-reloads on `server.py` change (via `--reload`).
- Do not run `npm` — this project uses **yarn**.
- Do not start your own uvicorn — use `sudo supervisorctl restart backend`.

## Environment variables

Copy the examples and fill in as needed:

```bash
cp frontend/.env.example frontend/.env
cp backend/.env.example  backend/.env
```

| Variable                | Where     | Purpose                                                                 |
| ----------------------- | --------- | ----------------------------------------------------------------------- |
| `REACT_APP_SITE_URL`    | frontend  | Canonical origin for `<link rel=canonical>`, OG, JSON-LD, sitemap.      |
| `REACT_APP_BACKEND_URL` | frontend  | Base URL for `/api/*` calls. Do not include trailing slash.             |
| `MONGO_URL`             | backend   | MongoDB connection string. Pre-configured — do not change locally.      |
| `DB_NAME`               | backend   | MongoDB database name. Pre-configured — do not change locally.          |
| `CORS_ORIGINS`          | backend   | Comma-separated allowed origins for CORS. Restrict at launch.           |
| `RESEND_*` (commented)  | backend   | Reserved for future contact-form email delivery. See `HANDOFF.md`.      |

If `REACT_APP_SITE_URL` is not set, the app safely falls back to
`https://affittacameregliarchi.com` (see `frontend/src/lib/seo.js`) — so no
canonical URL will ever leak `localhost`.

## Frontend commands

```bash
yarn start          # dev server
yarn sitemap        # regenerate public/sitemap.xml from articles/destinations
yarn build          # runs `yarn sitemap` then `craco build`
```

## Backend commands

```bash
sudo supervisorctl restart backend
tail -f /var/log/supervisor/backend.err.log
```

## Testing

Automated end-to-end pass covers all 28 routes + 8 API endpoints
(see `/app/test_reports/iteration_*.json`).

## Documentation index

- `DEPLOYMENT.md` — moving to the production domain
- `SEO_CHECKLIST.md` — what to verify before / after launch
- `MONETIZATION_CHECKLIST.md` — AdSense + affiliate readiness
- `HANDOFF.md` — deferred integrations (Resend, AdSense) and next-agent context
- `memory/PRD.md` — feature-by-feature changelog and backlog
- `memory/test_credentials.md` — test accounts (currently empty; no auth in v1)
