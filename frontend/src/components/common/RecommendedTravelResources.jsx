import { ExternalLink } from "lucide-react";
import { getAffiliateResources } from "@/data/affiliateResources";
import { trackAffiliateClick } from "@/lib/analytics";

const contextLabels = {
  "siena-travel-guide": {
    title: "Recommended travel resources for Siena",
    intro:
      "Use these only after you know your route and stay style. They are practical next steps, not generic ads.",
  },
  "where-to-stay-in-siena": {
    title: "Turn the area decision into a booking shortlist",
    intro:
      "Once the neighborhood feels right, compare stays and logistics in the same planning session.",
  },
  "siena-accommodation-guide": {
    title: "Useful tools before confirming a stay",
    intro:
      "Check the stay, arrival setup and backup options before you commit to non-refundable dates.",
  },
  "travel-budget-calculator": {
    title: "Turn the estimate into real trip decisions",
    intro:
      "After the calculator gives you a range, these are the categories that usually change the final cost.",
  },
};

export default function RecommendedTravelResources({
  context = "default",
  title,
  intro,
  className = "",
}) {
  const resources = getAffiliateResources(context);
  if (!resources.length) return null;

  const copy = contextLabels[context] || contextLabels["siena-travel-guide"];

  const handleClick = (resource, index) => {
    trackAffiliateClick({
      affiliate_partner: resource.partner,
      affiliate_context: context,
      link_position: `${context}_${index + 1}`,
      destination_type: resource.type,
      outbound_url: resource.href,
    });
  };

  return (
    <section className={`section-y affiliate-resource-section ${className}`}>
      <div className="container-editorial">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div className="max-w-2xl">
            <p className="overline">Recommended resources</p>
            <h2 className="mt-2 font-serif text-3xl md:text-4xl leading-tight">
              {title || copy.title}
            </h2>
            <p className="mt-4 text-[hsl(var(--charcoal-soft))] leading-relaxed">
              {intro || copy.intro}
            </p>
          </div>
          <p className="max-w-sm text-xs leading-relaxed text-[hsl(var(--charcoal-soft))]">
            Some outbound links may be affiliate links. We may earn a commission
            at no extra cost to you, and recommendations remain editorial.
          </p>
        </div>

        <div className="mt-7 grid grid-cols-1 md:grid-cols-3 gap-5">
          {resources.map((resource, index) => (
            <article
              key={resource.id}
              className="rounded-xl border border-[hsl(var(--stone-border))] bg-[hsl(var(--ivory))] p-5 shadow-[0_14px_36px_rgba(52,40,31,0.06)]"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.18em] font-semibold text-[hsl(var(--terracotta))]">
                    {resource.category}
                  </p>
                  <p className="mt-1 text-xs text-[hsl(var(--charcoal-soft))]">
                    {resource.partner}
                  </p>
                </div>
                <span className="shrink-0 rounded-full bg-[hsl(var(--ivory-2))] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-[hsl(var(--charcoal-soft))]">
                  {resource.bestFor}
                </span>
              </div>

              <h3 className="mt-4 font-serif text-2xl leading-tight">
                {resource.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-[hsl(var(--charcoal-soft))]">
                {resource.description}
              </p>

              <a
                href={resource.href}
                target="_blank"
                rel="sponsored noopener noreferrer"
                onClick={() => handleClick(resource, index)}
                className="mt-5 inline-flex min-h-10 items-center gap-2 rounded-lg bg-[hsl(var(--charcoal))] px-4 text-sm font-semibold text-[hsl(var(--ivory))] transition hover:bg-[hsl(var(--terracotta))]"
              >
                {resource.ctaLabel}
                <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
