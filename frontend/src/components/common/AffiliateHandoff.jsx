import { Link } from "react-router-dom";
import { ExternalLink } from "lucide-react";

// The one commercial element the planning tools carry: a contextual handoff
// shown ONLY when the tool itself has just recommended the thing the link
// books. A comparator that answers "take a guided tour" makes a tour
// marketplace link the honest next step; the same link beside the train
// card would be an ad. Never render this unconditionally.
//
// House rules embodied here (CLAUDE.md §2):
// - /go/ shortcuts only, as real <a> requests — the redirects live at the
//   CDN, not in the SPA router.
// - rel="sponsored" because both slugs are live programmes. Keep in sync
//   with frontend/public/_redirects and the SPONSORED_GO_SLUGS copies in
//   Article.jsx and generate-static-html.js.
// - The disclosure travels with the link, in the same box, every time.
const VARIANTS = {
  tour: {
    href: "/go/viator",
    cta: "Compare guided day tours on Viator",
    line:
      "The product page lists operator, group size, meeting point and cancellation window — read those four fields before you compare prices.",
    followUp: { to: "/blog/siena-day-trips-without-a-car/", label: "Which trips actually need a tour →" },
  },
  car: {
    href: "/go/discovercars-italy",
    cta: "Compare rental prices on DiscoverCars",
    line:
      "Judge the insurance excess as hard as the daily rate — and know Siena's ZTL camera rules before you drive in.",
    followUp: { to: "/blog/siena-ztl-fines-how-to-avoid/", label: "The ZTL rules that catch drivers →" },
  },
};

export default function AffiliateHandoff({ variant, className = "" }) {
  const v = VARIANTS[variant];
  if (!v) return null;

  return (
    <div
      data-testid={`affiliate-handoff-${variant}`}
      className={["mt-4 rounded-2xl border border-[#C65A3A]/30 bg-[#FAF7F2] p-4 text-sm", className].join(" ")}
    >
      <a
        href={v.href}
        target="_blank"
        rel="sponsored noopener noreferrer"
        className="inline-flex items-center gap-1.5 font-medium text-[#A84A2E] hover:underline"
      >
        {v.cta} <ExternalLink className="w-3.5 h-3.5" />
      </a>
      <p className="mt-1.5 text-[#657143] leading-relaxed">{v.line}</p>
      <p className="mt-2 text-xs text-[#657143]/80">
        Affiliate link — booking through it may earn us a commission, at no extra cost to you.{" "}
        <Link to={v.followUp.to} className="underline hover:text-[#A84A2E]">
          {v.followUp.label}
        </Link>
      </p>
    </div>
  );
}
