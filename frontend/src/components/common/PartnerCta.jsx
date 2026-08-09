import { ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import { PARTNER_CTA } from "@/constants/testIds";
import { partnersForArticle, getPartner, partnerRel, isProgrammeLive } from "@/lib/monetisation";
import { trackPartnerClick } from "@/lib/analytics";

/**
 * The booking hand-off at the end of an article.
 *
 * Renders nothing when no partner matches the article's intent — a reader
 * halfway through a seasonal explainer is not at a booking decision, and a CTA
 * there is noise that costs trust for no click.
 *
 * The note underneath tracks reality in both directions (CLAUDE.md §2): while
 * programmes are pending it states plainly that we earn nothing, because
 * claiming a commercial relationship we do not have is as much a trust failure
 * as hiding one we do.
 *
 * Pages that are not articles — a city landing page, say — can name their
 * partners directly with `partnerIds` rather than relying on slug routing.
 */
export default function PartnerCta({ article, partnerIds, className = "" }) {
  const partners = partnerIds
    ? partnerIds.map(getPartner).filter(Boolean).slice(0, 2)
    : partnersForArticle(article);
  if (partners.length === 0) return null;

  const onClick = (partner) => {
    trackPartnerClick({
      partner: partner.id,
      partner_kind: partner.kind,
      article_slug: article?.slug || "",
      programme_status: isProgrammeLive ? "live" : "pending",
    });
  };

  return (
    <section
      id="booking-next-step"
      data-testid={PARTNER_CTA.block}
      className={`mt-14 scroll-mt-28 rounded-2xl border border-[hsl(var(--stone-border))] bg-[hsl(var(--ivory-2))] p-6 ${className}`}
    >
      <p className="overline">When you are ready to book</p>
      <h2 className="font-serif mt-2 text-2xl leading-snug">Where to do it</h2>

      <div className="mt-5 space-y-5">
        {partners.map((partner) => (
          <div
            key={partner.id}
            className="rounded-xl border border-[hsl(var(--stone-border))] bg-[hsl(var(--ivory))] p-5"
          >
            <p className="text-[15px] font-medium text-[hsl(var(--charcoal))] leading-snug">
              {partner.solves}
            </p>
            <p className="mt-2 text-sm text-[hsl(var(--charcoal-soft))] leading-relaxed">
              {partner.caveat}
            </p>
            <a
              href={partner.slug}
              target="_blank"
              rel={partnerRel}
              data-testid={PARTNER_CTA.link}
              onClick={() => onClick(partner)}
              className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[hsl(var(--terracotta))] hover:underline"
            >
              <ExternalLink className="w-4 h-4" />
              Open {partner.name}
            </a>
          </div>
        ))}
      </div>

      <p
        data-testid={PARTNER_CTA.note}
        className="mt-5 text-xs text-[hsl(var(--charcoal-soft))] leading-relaxed"
      >
        {isProgrammeLive ? (
          <>
            These are affiliate links: if you book through one, we may earn a commission at no extra
            cost to you. Commercial relationships never decide what we recommend — see our{" "}
            <Link to="/editorial-policy" className="link-terra">
              editorial policy
            </Link>
            .
          </>
        ) : (
          <>
            We have no commercial relationship with these platforms and earn nothing whether you book
            or not. These links carry no tracking or affiliate parameters. We list them because we use
            them ourselves — see our{" "}
            <Link to="/editorial-policy" className="link-terra">
              editorial policy
            </Link>
            .
          </>
        )}
      </p>
    </section>
  );
}
