# Affiliate application worklist

<!-- audit:ignore -->
Owner-side execution brief: which affiliate programmes to apply to, in what
order, with what details — researched via web search August 2026 and
adversarially cross-checked in the same session. Direct page fetches were
blocked in the research environment, so **every URL below comes from search
results, not from an opened page**: if one 404s, search the programme name +
"affiliate" and use the official domain's own navigation. Commission figures
are for expectation-setting only — the numbers that bind are the ones shown
inside each dashboard at sign-up, and nothing here may be quoted in a
published article.

Companion documents: `docs/UPDATE_TRIGGERS.md` (maintenance registry),
`GSC_INDEXATION_TRACKER.md` (indexing worklist). When an approval lands,
see "When an approval lands" at the bottom — that step is repo-side and a
Claude session can do it in minutes.
<!-- /audit:ignore -->

## Before you start: prepare these once

Every application asks for roughly the same things. Have them ready in a
note so each form takes minutes, not an evening:

1. **Site URL**: `https://affittacameregliarchi.com` (state it with https).
2. **Site description** (copy-paste, adjust freely):
   > Archi Travel Guide is an independent English-language travel guide to
   > Siena and Tuscany at affittacameregliarchi.com — practical itineraries,
   > transport guides, month-by-month planning and honest advice for
   > independent travellers. 70+ in-depth articles, updated continuously.
3. **Promotion method** (forms ask "how will you promote us?"):
   > In-content contextual recommendations inside destination, transport and
   > planning guides. No paid ads, no incentivised clicks, no social-only
   > promotion — editorial content on our own site.
4. **Traffic numbers**: take current monthly users/sessions from Google
   Search Console + your analytics before you start; several forms ask.
   Answer honestly — inflated numbers get accounts terminated later.
5. **Contact email**: `contact@affittacameregliarchi.com` (use one address
   for every programme so payout notices land in one inbox).
6. **Payout details**: PayPal account (needed by Stay22, Viator's weekly
   option) and bank/IBAN details (most others). Tax/VAT or personal
   taxpayer ID where you have one — DiscoverCars pays a *lower* rate to
   business accounts without a valid VAT/EIN.
7. **Pages programmes check**: `/about/`, `/contact/`, `/privacy-policy/` —
   all live on the site already. Link them in the application if there's a
   field for it.

## Application order

Ordered by (approval odds for a small site) × (fit with our content).
Do the top four in one sitting; they are the easy wins.

### 1. Viator (tours & activities) — apply first

- **Where**: viator.com → "Affiliate program" / partner signup
  (search "Viator affiliate program signup" if the footer link moves).
- **Route**: direct, no network account needed.
- **Terms as researched**: 8% commission, 30-day cookie, no traffic
  minimum, deep links to any tour page; payout via PayPal (weekly, no
  minimum) or bank (monthly, ~$50 minimum).
- **Why first**: consistently reported the easiest approval for new content
  sites, and our day-trip/month-guide articles are exactly tour-intent
  pages. We already have `/go/viator` waiting.

### 2. Civitatis (tours & activities)

- **Where**: civitatis.com → affiliates section.
- **Route**: direct, in-house panel; review reported within ~24 hours to
  2 working days.
- **Terms as researched**: 10% commission (highest headline rate of the
  four tour platforms), 30-day cookie, deep links by appending your
  affiliate ID to any URL; payout threshold reported ~€50 (single source —
  confirm in panel).
- **Note**: requires a live travel website (social-only applicants are
  rejected) — we qualify.

### 3. DiscoverCars (car hire)

- **Where**: discovercars.com/affiliate (their affiliate-conditions page is
  public).
- **Route**: direct.
- **Terms as researched**: 70% of DiscoverCars' profit per rental + 30% of
  Full Coverage revenue, **365-day cookie**; payout via PayPal/bank, one
  source cites $200 threshold. Their own terms cut rates to 58%/25% for
  business accounts **without a valid VAT/EIN or equivalent taxpayer
  number** — have yours ready. Bookings arriving via paid ads are excluded
  (we don't run any).
- **Why high priority**: our Renting a Car in Tuscany guide publishes
  18 August; a 365-day cookie means one click can pay out a year later.
  Needs a new `/go/discovercars` row when approved.

### 4. Airalo eSIM (via Impact)

- **Where**: airalo.com → partners/affiliate; applications run through the
  Impact network (impact.com) — you create an Impact publisher account as
  part of the flow.
- **Terms as researched**: 10% commission, 30-day cookie, ~$50 threshold,
  paid end of month after validation.
- **Fit**: `/go/airalo` already live on the Travel Deals page and packing
  checklist.

### 5. SafetyWing (travel insurance)

- **Where**: safetywing.com → Ambassador Program.
- **Route**: direct signup; approval reported within days even for small
  sites.
- **Terms as researched**: ~10% recurring for the customer's first
  364 days, 364-day cookie. Payout-threshold reports conflict — read the
  dashboard.
- **Fit**: entry-requirements and strike-survival articles are natural
  homes. Needs a new `/go/safetywing` row when approved.

### 6. Trainline (rail) — via Partnerize

- **Where**: thetrainline.com → affiliates (application runs on the
  Partnerize platform).
- **Terms as researched**: 3% on new-customer sales, 1% on existing
  customers (directories disagree wildly on this one — treat the dashboard
  as the only truth). Low entry bar.
- **Fit**: `/go/trainline` already live; Rome-to-Siena and
  Florence-to-Siena guides are high-intent rail pages.

### 7. Omio (multi-modal transport)

- **Where**: omio.com/affiliate.
- **Route**: direct (also listed on Impact and Travelpayouts).
- **Terms as researched**: performance-based 2–8%, 30-day cookie, **€100
  payout threshold** (stiff for a small site — expect a slow first payout),
  paid 30–60 days after invoice approval.
- **Fit**: `/go/omio` already live.

### 8. GetYourGuide (tours) — expect more scrutiny

- **Where**: partner.getyourguide.com (direct), or via Awin (~7%) /
  Travelpayouts (~8%) once you have those network accounts.
- **Terms as researched**: ~8%, 30/31-day cookie, monthly payout around the
  5th, ~$50/€50 bank threshold. The most selective of the tour platforms
  for new sites; review 1–5 business days.
- **Fallback**: if rejected direct, reapply through Travelpayouts — it
  approves faster and carries GYG, Viator and Tiqets under one roof.

### 9. Awin network account → Booking.com (and Trip.com)

- **Where**: awin.com publisher signup. Expect a **£5 refundable deposit**
  (bank-verification measure, returned with first commission). Fill the
  application completely — promotional URLs + method description;
  incomplete forms are the main rejection cause. Review ~1–2 working days.
- **Then**: inside Awin, apply to the **Booking.com** advertiser programme
  (and optionally Trip.com: ~5.5% hotels per their Awin profile).
  Booking.com approves publishers individually — network membership does
  not guarantee it, and small/new sites are often declined at first.
  If declined: keep publishing, reapply when monthly traffic is
  meaningfully higher. CJ (cj.com) hosts the same Booking.com programme if
  Awin declines the account itself.
- **Terms as researched**: ~4% of accommodation booking value, attribution
  largely **session-based** (the visitor must book in the same session for
  most placements) — expect lower conversion than the tour programmes.
- **Context**: Booking.com terminated its direct small-publisher programme
  in June 2025; the network route is now the only door for us. This is the
  strategic hotel programme, but it is the slowest to say yes — hence
  position 9, not 1.

### 10. Expedia Group (hotels fallback) — via Partnerize

- **Where**: signup.partnerize.com → Expedia Group programme (also branded
  Travel Creator Program at creator.expediagroup.com). You'll already have
  a Partnerize login from Trainline (#6).
- **Terms as researched**: ~3–6% hotels depending on product, 7-day cookie,
  commission paid only after the traveller **completes the stay**
  (60–150 days later), $50 threshold.
- **Take it as**: diversification if Booking declines us; not worth
  content changes on its own.

### Deliberately skipped (for now)

- **Stay22** (no traffic minimum, auto-monetising script): decided against
  — the Let Me Allez script is a third-party script injected site-wide,
  which costs page speed and privacy-policy complexity, and its 30% revenue
  split routes through an intermediary. Revisit only if Booking.com keeps
  declining us after several traffic milestones.
- **Agoda**: accessible approval but the cookie is **1 day** (verified
  against 2026 sources; the "30-day" figure in older directories is wrong).
  Weak fit for research-heavy readers who book days later.
- **Display ads** (AdSense/Journey/Raptive/Ezoic): not an application
  matter yet — Journey by Mediavine's bar is 1,000+ monthly sessions
  weighted to US/UK/CA/AU traffic, Raptive wants 25k pageviews with 50%
  premium-geo, Ezoic wants 250k users. Revisit at ~10k sessions/month, and
  budget a Google-certified consent-management platform (TCF v2.2) before
  any ad code ships to EU visitors.

## When an approval lands — what to send back

Paste into a Claude session, per programme:

1. The **affiliate ID / tracking link format** the dashboard gives you
   (e.g. the Awin deep-link format, the Viator `pid`, the Civitatis ID).
2. Whether the programme's terms require a specific disclosure wording.

The repo-side work is then one small PR per programme, same day:

- Point the `/go/{slug}` row in `frontend/public/_redirects` at the
  tracked destination (new slugs needed: `discovercars`, `safetywing`;
  the rest exist).
- Add the affiliate disclosure to pages that link that programme and
  switch those links `rel="nofollow"` → `rel="sponsored"` — CLAUDE.md
  requires both on the same day tracking goes live.
- Re-run `python tools/check_links_and_images.py` (it verifies /go/
  integrity and flags tracking parameters anywhere outside `_redirects`).

## Status

| # | Programme | Applied | Outcome | Tracking live in `_redirects` |
| --- | --- | --- | --- | --- |
| 1 | Viator |  |  |  |
| 2 | Civitatis |  |  |  |
| 3 | DiscoverCars |  |  |  |
| 4 | Airalo (Impact) |  |  |  |
| 5 | SafetyWing |  |  |  |
| 6 | Trainline (Partnerize) |  |  |  |
| 7 | Omio |  |  |  |
| 8 | GetYourGuide |  |  |  |
| 9 | Awin → Booking.com |  |  |  |
| 10 | Expedia (Partnerize) |  |  |  |
