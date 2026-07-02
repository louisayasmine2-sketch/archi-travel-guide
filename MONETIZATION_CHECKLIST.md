# Monetization Checklist

Archi Travel Guide is designed for two revenue streams: **display advertising
(Google AdSense)** and **affiliate travel bookings**. Both are prepared but
**neither is wired to a real provider in v1** — the UI is in place, the
placement rules are in place, the compliance safeguards are in place.

## AdSense — placeholder state

- Component: `src/components/common/AdPlaceholder.jsx`.
- Every slot renders a dashed frame with the label **"Advertisement"** above it.
- Slots are placed at low density: hero-adjacent, mid-article, before related
  articles, and in city/tool sidebars.
- **No real `<script async src="…adsbygoogle.js">` is loaded.** Do not add it
  until an AdSense publisher account is approved for `affittacameregliarchi.com`.

### Compliance rules (already enforced)

- Every ad slot is labeled "Advertisement".
- Ads never appear in the header, mobile menu, or footer navigation.
- Ads never look like buttons, download links, or navigation.
- Density: at most one ad per fold; one on the sidebar; ~2–3 within a long article.
- No prompts to click ads. No urgency or misleading copy near ad slots.

### To turn AdSense on later

1. Get AdSense approved at https://adsense.google.com.
2. Add the publisher script to `public/index.html` (inside `<head>`):
   ```html
   <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXX" crossorigin="anonymous"></script>
   ```
3. Extend `AdPlaceholder` to accept a `data-ad-slot` prop and render:
   ```jsx
   <ins className="adsbygoogle" style={{display:'block'}}
        data-ad-client="ca-pub-XXXXX"
        data-ad-slot={slot}
        data-ad-format="auto"
        data-full-width-responsive="true" />
   ```
   and call `window.adsbygoogle.push({})` in a `useEffect`.
4. **Do not remove the "Advertisement" label** — AdSense policy requires clear labeling.
5. Update the cookie consent copy if you enable personalised advertising (already prepared in `Cookie Policy`).

## Affiliate travel — ready to wire

- Component: `src/components/common/AffiliateCard.jsx`.
- Cards render on `/travel-deals` and can be dropped into any editorial page.
- Each card carries provider, description, an optional tag, and an
  `href` that opens in a new tab with `rel="sponsored noopener noreferrer"`.
- Cards display "Affiliate link — Archi may earn a commission at no extra cost
  to you" underneath the CTA. The page also carries a global disclosure block.
- Editorial policy (`/editorial-policy`) declares that partnerships never
  dictate coverage.

### To turn affiliate links on later

1. Sign up with your partners (booking meta-search, tours, eSIM, insurance,
   rail, gear).
2. Replace the `href="#"` placeholders in `src/pages/TravelDeals.jsx` with
   the real tracking URLs.
3. Optionally add per-card `Product` JSON-LD once you have real pricing.

## What must never happen

- ❌ Ads inside the main navigation, mobile menu, or footer.
- ❌ Ad slots that mimic download buttons or CTAs.
- ❌ "Click here" / "Sponsored offer just for you" copy next to ad slots.
- ❌ Removing the "Advertisement" label — it is a legal + policy requirement.
- ❌ Placing more than one ad above-the-fold.
- ❌ Affiliate links without a visible disclosure.

## Revenue quality signals to protect

- **Editorial independence** — see `/editorial-policy`. Never accept payment
  for a destination recommendation or itinerary inclusion.
- **Update dates** — every article and city page shows an "Updated" date.
  Bump it when facts change; do not fake it for SEO.
- **Low ad density** — the site quality score matters more than a few extra
  impressions per session.
