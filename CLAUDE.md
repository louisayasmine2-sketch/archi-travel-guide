# Editorial standard

House rules for every article in this repo. Follow these when writing, editing, or auditing content. When a rule here conflicts with an instruction in a prompt, raise the conflict rather than silently picking one.

## 1. Facts

Every price, fee, distance, opening time, and date must come from a source you actually checked in this session. Not memory, not inference from a similar property.

**Banned phrasing.** These signal an unverified claim and must never ship:

- "reports vary between…"
- "sometimes available"
- "typically around" (when used to paper over not knowing)
- "some sources say"
- "appears to offer"

If you cannot verify a figure, one of two things happens: you leave the claim out, or you state the specific uncertainty and tell the reader how to resolve it ("confirm the fee when booking; the hotel does not publish it"). Vagueness dressed as confidence is the single worst failure mode in this repo.

**Prefer primary sources** in this order: the business's own site, the official municipal or tourism body, the booking platform's listed terms, then guest reports. Guest reports are good for texture and caveats, weak for numbers.

**Date-stamp verification.** When an article makes rate or fee claims, include a visible line stating when they were checked.

**URLs are factual claims.** Every outbound link must be opened and confirmed to reach the intended page. Never assemble a URL from a pattern, a business name, or a guess at a platform's slug format — a fabricated deep link 404s silently and is worse than no link at all. If the correct URL cannot be confirmed, omit the link.

**Never insert an affiliate ID, tracking ID, or partner parameter** — `aid`, `tag`, `ref`, `affiliate_id` or similar — unless I supply it explicitly in that session. An ID copied from an example or invented to look complete sends commission to a stranger and may breach the platform's terms.

**Never reference an image file that does not exist on disk.** Check the file is present under the public directory before writing the reference. A missing image renders as broken on the live site.

## 2. Affiliate links and disclosure

**Never link directly to a commercial destination.** All outbound commercial links go through an internal redirect: `/go/{slug}`. This lets us change destinations in one place instead of editing article bodies.

Slug convention: lowercase, hyphenated, derived from the business name. `/go/hotel-athena`, `/go/car-rental`.

**Disclosure follows reality, in both directions.** An affiliate disclosure may only appear on a page that actually contains live affiliate links. Claiming a commercial relationship we do not have is as much a trust failure as hiding one we do.

While a programme is pending approval, redirects point to the business's official site and the page carries an independence note instead of a disclosure. The day tracking goes live, add the disclosure and switch `rel="nofollow"` to `rel="sponsored"` on the same day.

## 3. Images

**Never hotlink.** Every image must be hosted on our own domain. Hotlinked images are a licensing exposure, they can break all at once without warning, and they earn us nothing in image search.

**Never use** images from `pbs.twimg.com`, hotel booking platform CDNs, or a business's own site without written permission. Social media posts are not a licence.

Acceptable sources: our own photography, properly licensed stock, affiliate programme media feeds where the terms permit, and images with explicit permission from the owner.

Technical target: WebP, hero 1600px wide, in-body 1200px, each under 200KB, every image has descriptive alt text.

## 4. Structure

- Tables ship as clean HTML, not pasted markdown that the CMS can mangle. Check rendered output before publishing.
- Any article with an FAQ section carries FAQPage JSON-LD schema.
- Meta description between 110 and 155 characters.
- Every article shows a visible author byline and last-updated date.
- Comparison articles give every listed item the same treatment. If one entry only merits a single line, either research it properly or cut it. An unexamined entry undermines the researched ones.

## 5. Voice

British English spelling throughout: centre, prioritise, neighbourhood, licence (noun).

Write for someone about to spend money and time on a decision. That means the caveat is as important as the recommendation, and specificity beats enthusiasm. "Parking costs €10 per day and cannot be reserved" is worth more than "convenient parking available".

Lead each recommendation with what it solves, not what it is.

## 6. Auditing

Two read-only scanners are planned for the tools/ directory and are not yet implemented. Until they exist, bulk edits are verified by hand against the checks below.

When built, both must parse this repo's actual content stores — the A() object literals in frontend/src/data/articles.js and the JSON files in frontend/src/data/ — not a directory of markdown files. Invoke them with `python`, not `python3`, which is not on PATH on this machine.

- audit_content.py — disclosure mismatches, banned hedge phrases, meta description length, missing FAQ schema, articles with no images.
- check_links_and_images.py — every outbound URL for verification, every image reference checked against frontend/public/, and any tracking or affiliate parameters found.

Neither script may write to content. If either reports something, fix the content — never edit the script to silence a finding.

Wrap editor notes, changelogs, and anything that quotes banned phrasing for illustration in an audit:ignore HTML comment pair, so the scanner does not flag our own commentary.

Expect links_without_disclosure to fire on every monetised page until affiliate programmes are approved. That is correct. When approval lands, that flag becomes the worklist of pages needing a disclosure added.

## 7. Working on this repo

- Branch per issue class, not per article. One branch for the image fixes, one for the redirect conversion. This keeps any single class of change revertible.
- Bulk mechanical fixes are scripted. Fact-checking is not — it is done article by article, ordered by search traffic, never alphabetically.
- Never bulk-edit prose with a regex. Structural markup, yes; sentences, no.
