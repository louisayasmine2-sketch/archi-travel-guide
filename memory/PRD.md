# Archi Travel Guide — PRD

## Original problem statement
Production-ready professional global travel website "Archi Travel Guide" (for domain
affittacameregliarchi.com). Global travel planning brand with first editorial pillar
on Italy, Tuscany, and Siena. Premium editorial style, warm neutral palette,
mobile-first, monetization-ready (AdSense + affiliate) but low-density and clearly
labeled ads. Must include travel tools, article template, trust/legal pages.

## Architecture
- Backend: FastAPI (server.py) + MongoDB via motor. All endpoints prefixed `/api`.
- Frontend: React 19 + React Router 7, Tailwind + Shadcn UI, Manrope + Cormorant
  Garamond typography, warm ivory/terracotta/olive palette.
- Data: articles + destinations stored in `/frontend/src/data/*.js` (static editorial).

## User personas
- Smart travelers, families, digital nomads, first-time travelers, budget-conscious
  tourists (per problem statement).

## Core requirements (static)
- Global brand feel, Italy first content pillar.
- No misleading buttons, ads clearly labeled "Advertisement", low density.
- Independent editorial voice — not the previous B&B.
- Mobile-first, fast-loading, lazy images, video thumbnails.

## What's been implemented (2025-11-10 v1)
- Full site scaffolding:
  - Home with hero, "Start with Italy" featured section, destinations grid,
    tools preview, featured guides, newsletter, trust strip.
  - Destinations directory with search + region filter.
  - Italy / Tuscany / Siena editorial pages.
  - Europe / Asia placeholder pages with editorial roadmap (no thin filler).
  - Travel Tools hub + 6 tool pages (Budget Calculator, Itinerary Generator,
    Area Finder, Packing Checklist, Best Time to Visit, Transport Guide).
  - Travel Deals & Resources (affiliate cards with disclosure).
  - Blog index with search + region filter, Article template with TOC, FAQ,
    author card, ad placeholders.
  - About, Contact (with backend POST), Legal (Privacy, Cookie, Terms,
    Affiliate, Editorial policies), 404.
  - Cookie consent banner.
- Backend endpoints:
  - GET /api/ (health)
  - POST /api/newsletter/subscribe
  - POST /api/contact
  - POST /api/tools/budget-calculator
  - POST /api/tools/itinerary-generator
  - POST /api/tools/area-finder
  - POST /api/tools/packing-checklist
  - POST /api/tools/best-time
- Design system: Cormorant Garamond + Manrope fonts, terracotta/ivory/olive
  palette, editorial spacing, grain texture, subtle motion.

## P0/P1/P2 backlog
- P1: Extended Italy city pages (Florence, Rome, Venice) beyond placeholder.
- P1: Real ads integration (AdSense) once traffic warrants.
- P1: SEO meta tags per-page via react-helmet or Next migration.
- P1: Sitemap.xml + robots.txt.
- P2: Email delivery for contact form (Resend or SendGrid).
- P2: Auth + saved trips (user accounts).
- P2: Europe / Asia country expansion (France, Spain, Japan, Indonesia first).
- P2: Rich schema.org markup for articles + FAQ.
- P2: Image CDN wrapper with next-gen format serving.

## Next tasks
- Real analytics wiring.
- Extended editorial content for Q1 country expansions.
- Deploy to production domain.
