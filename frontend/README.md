# Archi Travel Guide Frontend

React SPA for Archi Travel Guide, built with Create React App, Craco, React Router, Tailwind, and react-helmet-async metadata.

## Commands

```bash
yarn install
yarn start
REACT_APP_SITE_URL=https://affittacameregliarchi.com yarn sitemap
REACT_APP_SITE_URL=https://affittacameregliarchi.com yarn build
```

There is no dedicated preview script. Serve the generated `build/` directory with your deployment host or a static server.

## Environment

Copy `.env.example` to `.env` for local development.

| Variable | Purpose |
| --- | --- |
| `REACT_APP_SITE_URL` | Canonical origin for SEO metadata, JSON-LD and sitemap generation. Use `https://affittacameregliarchi.com` in production. |
| `REACT_APP_BACKEND_URL` | Optional backend base URL for contact/newsletter API calls. |

If `REACT_APP_SITE_URL` is missing, the app uses the browser origin and falls back to `http://localhost:3000` outside the browser.

## Structure

```text
frontend/
├── public/               Static assets, robots.txt, sitemap.xml
├── scripts/              Sitemap generator
├── src/
│   ├── components/       Layout, common cards, SEO, UI primitives
│   ├── data/             Destinations, cities, and articles
│   ├── lib/              SEO and schema helpers
│   └── pages/            Route-level pages
└── package.json
```
