import { ExternalLink } from "lucide-react";

export default function AffiliateCard({ title, provider, description, ctaLabel = "Compare options", href = "", tag }) {
  const normalizedHref = typeof href === "string" ? href.trim() : "";
  const isPlaceholderLink = !normalizedHref || normalizedHref === "#" || normalizedHref.includes("utm_source=archi");
  const hasLiveLink = normalizedHref.startsWith("http") && !isPlaceholderLink;

  return (
    <article className="card-editorial p-6 flex flex-col">
      <div className="flex items-center justify-between mb-3">
        <span className="overline">{provider}</span>
        {tag && (
          <span className="text-[10px] uppercase tracking-[0.15em] px-2 py-1 rounded-full bg-[hsl(var(--ivory-2))] text-[hsl(var(--charcoal-soft))]">
            {tag}
          </span>
        )}
      </div>
      <h3 className="font-serif text-2xl leading-tight">{title}</h3>
      <p className="text-sm text-[hsl(var(--charcoal-soft))] mt-3 leading-relaxed flex-1">{description}</p>
      <p className="mt-4 text-[11px] text-[hsl(var(--charcoal-soft))]/80">
        Affiliate link — Archi may earn a commission at no extra cost to you.
      </p>
      {hasLiveLink ? (
        <a
          href={href}
          target="_blank"
          rel="sponsored noopener noreferrer"
          className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-[hsl(var(--terracotta))] hover:text-[hsl(var(--terracotta-2))]"
        >
          {ctaLabel} <ExternalLink className="w-3.5 h-3.5" />
        </a>
      ) : (
        <span className="mt-3 inline-flex items-center text-sm font-medium text-[hsl(var(--charcoal-soft))]">
          Partner link coming soon
        </span>
      )}
    </article>
  );
}
