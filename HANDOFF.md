# Handoff — deferred integrations & next-agent context

## Context

Archi Travel Guide is a React 19 + FastAPI + MongoDB site. It ships as an
independent editorial travel platform with first pillar Italy / Tuscany /
Siena, plus full destination guides for Florence, Rome and Venice.

All P0 and P1 launch-readiness work is complete. Two integrations are
intentionally deferred and documented here.

---

## 1. Resend (contact form email delivery)

**Why deferred:** the brand mailbox `contact@affittacameregliarchi.com`
has not been provisioned yet. Product decision: keep DB persistence as the
source of truth, add outbound delivery once the mailbox is live.

**Current state:** `POST /api/contact` can persist submissions to the `contact_messages` MongoDB collection when `REACT_APP_BACKEND_URL` is configured. If the frontend is deployed before backend email/API wiring, the Contact page stays usable and shows the fallback email `contact@affittacameregliarchi.com`.

**To wire it later:**

1. Provision the API key: https://resend.com/api-keys.
2. Update `backend/.env`:
   ```
   RESEND_API_KEY=re_XXXXXXXXXXXX
   RESEND_FROM_EMAIL="Archi Travel Guide <hello@affittacameregliarchi.com>"
   RESEND_TO_EMAIL=contact@affittacameregliarchi.com
   ```
3. Install:
   ```
   pip install resend
   pip freeze > backend/requirements.txt
   ```
4. In `server.py > contact_submit`, after `insert_one`, add:
   ```python
   import resend
   resend.api_key = os.environ["RESEND_API_KEY"]
   try:
       resend.Emails.send({
           "from": os.environ["RESEND_FROM_EMAIL"],
           "to":   [os.environ["RESEND_TO_EMAIL"]],
           "subject": f"[Archi] {payload.subject}",
           "reply_to": payload.email,
           "text": (
               f"From: {payload.name} <{payload.email}>\n\n{payload.message}"
           ),
       })
   except Exception as e:
       logger.warning("Resend send failed (record persisted): %s", e)
   ```
5. Do not remove the DB insert. Never let email delivery block the response.

---

## 2. Google AdSense

Full playbook in [`MONETIZATION_CHECKLIST.md`](MONETIZATION_CHECKLIST.md).
Summary:

- Do not add the AdSense publisher script until approved for the domain.
- `AdPlaceholder` already labels every slot "Advertisement".
- Extend `AdPlaceholder` when wiring — do not remove the label.

---

## 3. Analytics (not started)

No analytics is wired in v1. If you add Plausible / Fathom / GA4 later:

- Add the script to `public/index.html`.
- Update `Cookie Policy` and cookie banner copy (see
  `src/components/layout/CookieConsent.jsx` and `src/pages/Legal.jsx > cookie`).
- Respect the "Decline non-essential" state stored in `localStorage`
  (`archi_cookie_consent`).

---

## 4. Content roadmap (not started)

Kept as future scope, per product decision:

- **France pillar** in Europe (Paris + Loire). All UI shows Q1 France on the
  editorial roadmap — no thin filler content.
- **Q2:** Spain (Barcelona + Andalucía).
- **Q3:** Switzerland.
- **Q4:** Greece.
- **Asia:** Japan → Indonesia → Thailand → Singapore.

Content lives in `frontend/src/data/`:
- `articles.js` — one `A(slug, title, category, region, excerpt, image, sections, faqs, updated)` call per article.
- `cities.js` — full city landing data (Florence/Rome/Venice pattern).
- `destinations.js` — hub-level cards.

New articles automatically appear in Blog listing + region filters. Run
`yarn sitemap` after editing.

---

## 5. Known limitations

| Item                                      | Impact                                                              | Mitigation                                                                 |
| ----------------------------------------- | ------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| Static `sitemap.xml`                       | Must run `yarn sitemap` after content edits (auto-run in `yarn build`). | Runs automatically at build; also documented in `DEPLOYMENT.md`.           |
| Uniform article `updated` date            | All 18 articles carry the helper's default date.                    | Set a per-article date in the `A(...)` call when editing that article.     |
| No admin / CMS                             | Editorial changes require a code deploy.                            | Acceptable for v1 velocity; add Notion / Sanity later if the pace grows.   |
| No auth / user accounts                   | Users can't save trips or checklists.                               | Acceptable for v1; the packing/itinerary tools are stateless by design.    |
| Open CORS in the preview `.env`           | Fine for preview, insecure for production.                          | Set `CORS_ORIGINS` at production launch (see `backend/.env.example`).      |
| Contact form: no rate limit / anti-spam   | Public form when backend is enabled.                                | Add a honeypot field + Cloudflare / rate-limit before high-traffic launch. |
| Deprecated `@app.on_event("shutdown")`    | FastAPI warning, no functional impact.                              | Migrate to lifespan context manager during the next backend refactor.      |

---

## 6. Test artefacts

Two automated E2E passes on file, both **100% pass** on backend and (after the
duplicate-tag fix) 100% on frontend:

- `/app/test_reports/iteration_1.json` — base MVP
- `/app/test_reports/iteration_2.json` — SEO + city expansion

Backend pytest at `/app/backend/tests/backend_test.py` covers all 8 endpoints
with validation + idempotency checks.

---

## 7. What the next Codex AI agent should do (in order)

1. **Do not** re-implement anything already listed as complete in
   `memory/PRD.md` — it will drift the app.
2. Read `README.md` and `DEPLOYMENT.md`, then set `REACT_APP_SITE_URL` on the
   deployment target.
3. If content changes were made, run `yarn sitemap` (or `yarn build` which
   chains it).
4. When ready, wire Resend using section 1 above. Add a smoke-test.
5. When AdSense is approved, follow section "To turn AdSense on later" in
   `MONETIZATION_CHECKLIST.md`.
6. Prioritise editorial expansion (France, Japan) over new tooling.

---

## 8. Public contact addresses

- General / editorial: **contact@affittacameregliarchi.com**
- Kept in sync in: Footer, Contact page, Privacy Policy, Editorial Policy.
