# Developer handoff — deferred integrations

## Resend (contact form email delivery)

The contact form (`POST /api/contact` in `backend/server.py`) currently persists
submissions to the `contact_messages` MongoDB collection. Email delivery has
been deferred by product decision — the UX and the persistence layer are
launch-ready.

### To connect Resend later

1. Provision a Resend API key at https://resend.com/api-keys.
2. Add to `backend/.env`:
   ```
   RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxx
   RESEND_FROM_EMAIL="Archi Travel Guide <hello@archi.travel>"
   RESEND_TO_EMAIL=hello@archi.travel
   ```
3. Install: `pip install resend` and add to `backend/requirements.txt`.
4. In `contact_submit` (server.py), after persisting the record, add a call to
   `resend.Emails.send({ from, to, subject, html })`. Wrap in try/except so
   an email delivery failure does not block the API response — the DB write
   remains the source of truth.
5. Existing tests will continue to pass (no signature change).

## Google AdSense

`AdPlaceholder` components are placed at low density throughout the site.
When AdSense is approved:

1. Add publisher script to `frontend/public/index.html` inside `<head>`.
2. Extend `AdPlaceholder.jsx` to render actual `<ins class="adsbygoogle">`
   slots when a `data-ad-slot` prop is provided. Keep the "Advertisement"
   label visible in all cases.
3. Never remove the label. Never place ads inside the header or the mobile
   menu. Never place more than one ad per fold.

## SITE_URL

Canonical URLs are built from `REACT_APP_SITE_URL` (see `frontend/src/lib/seo.js`)
with a fallback to `https://affittacameregliarchi.com`. Set the env var at
build time on the deployment platform.
