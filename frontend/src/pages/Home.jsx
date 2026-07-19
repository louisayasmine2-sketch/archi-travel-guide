import { Link } from "react-router-dom";
import {
  ParkingCircle,
  ShieldAlert,
  Ticket,
  TrainFront,
  CheckCircle2,
  CalendarCheck,
  Ban,
  ArrowRight,
} from "lucide-react";
import SEO from "@/components/common/SEO";
import { ORGANIZATION_JSONLD } from "@/lib/seo";
import { articles, getArticle } from "@/data/articles";

// Every pillar and every "recently updated" card is resolved from articles.js.
// Nothing here hardcodes a title, path or date — the only literals are the four
// curated pillar slugs, and an unresolved slug is dropped rather than rendered,
// so this page cannot show an article that does not exist.
const PILLARS = [
  { slug: "florence-to-siena-transport", Icon: TrainFront },
  { slug: "siena-parking-and-transfer-guide", Icon: ParkingCircle },
  { slug: "best-siena-hotels-with-parking", Icon: ShieldAlert },
  { slug: "how-much-siena-trip-costs", Icon: Ticket },
];
const PILLAR_SLUGS = new Set(PILLARS.map((p) => p.slug));

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

// Timezone-safe: parse the ISO date prefix directly instead of new Date(),
// so an evening +07:00 timestamp never renders as the previous day.
// Returns "" when there is no usable date — the caller shows nothing rather
// than a made-up value.
function formatDisplayDate(iso) {
  if (!iso) return "";
  const [year, month, day] = String(iso).slice(0, 10).split("-").map(Number);
  if (!year || !month || !day) return "";
  return `${MONTHS[month - 1]} ${day}, ${year}`;
}

// The article's real route: an explicit canonicalPath when it has one,
// otherwise /blog/<slug>, always normalized to a trailing slash.
function articlePath(article) {
  const path = article.canonicalPath || `/blog/${article.slug}`;
  return path.endsWith("/") ? path : `${path}/`;
}

export default function HomePage() {
  const pillars = PILLARS
    .map((pillar) => ({ ...pillar, article: getArticle(pillar.slug) }))
    .filter((pillar) => pillar.article);

  const recentlyUpdated = [...articles]
    .filter((article) => !PILLAR_SLUGS.has(article.slug))
    .sort((a, b) => new Date(b.updated) - new Date(a.updated))
    .slice(0, 3);

  return (
    <>
      <SEO
        title="Archi Travel Guide — The Practical Side of Tuscany"
        description="Parking, ZTL permits, tickets and transport for Siena and Tuscany, traced to official sources and dated so you can see how current each guide is."
        path="/"
        schema={ORGANIZATION_JSONLD}
      />

      <div className="bg-[#F5EDE3] text-[#4f4842] font-sans antialiased">
        {/* Hero */}
        <section className="px-4 py-16 sm:px-6 sm:py-24">
          <div className="mx-auto max-w-3xl">
            <h1 className="font-serif text-4xl font-medium leading-tight text-[#2C211B] sm:text-5xl">
              The practical side of Tuscany
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-[#4f4842] sm:text-xl">
              Parking, ZTL permits, tickets and transport for Siena and
              Tuscany — traced to official sources, and dated so you know how
              current they are.
            </p>
            <div className="mt-10">
              <Link
                to="/siena/"
                className="inline-flex items-center gap-2 rounded-md bg-[#C65A3A] px-6 py-3 text-base font-medium text-white transition-colors hover:bg-[#a45d49] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C65A3A]"
              >
                Start with Siena
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </section>

        {/* Pillar cards — one resolved article per slot */}
        <section className="px-4 py-12 sm:px-6 sm:py-16">
          <div className="mx-auto max-w-6xl">
            <h2 className="font-serif text-2xl font-medium text-[#2C211B] sm:text-3xl">
              Essential guides
            </h2>
            <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {pillars.map(({ slug, Icon, article }) => {
                const checked = formatDisplayDate(article.updated);
                return (
                  <Link
                    key={slug}
                    to={articlePath(article)}
                    className="group flex flex-col rounded-lg border border-[#e8dfd4] bg-white p-6 transition-colors hover:border-[#C65A3A]/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C65A3A]"
                  >
                    <Icon className="h-6 w-6 text-[#C65A3A]" strokeWidth={1.5} aria-hidden="true" />
                    <h3 className="mt-4 font-serif text-lg font-medium text-[#2C211B]">
                      {article.title}
                    </h3>
                    <p className="mt-2 flex-1 text-sm leading-relaxed">
                      {article.excerpt}
                    </p>
                    {checked && (
                      <p className="mt-4 flex items-center gap-1.5 text-xs text-[#a45d49]">
                        <CalendarCheck className="h-3.5 w-3.5" aria-hidden="true" />
                        Updated {checked}
                      </p>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* How we check things */}
        <section className="border-y border-[#e8dfd4] bg-white/50 px-4 py-16 sm:px-6 sm:py-20">
          <div className="mx-auto max-w-6xl">
            <h2 className="font-serif text-2xl font-medium text-[#2C211B] sm:text-3xl">
              How we check things
            </h2>
            <div className="mt-10 grid grid-cols-1 gap-10 md:grid-cols-3">
              <div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-[#C65A3A]" strokeWidth={1.5} aria-hidden="true" />
                  <h3 className="font-serif text-lg font-medium text-[#2C211B]">
                    Official sources first
                  </h3>
                </div>
                <p className="mt-3 text-sm leading-relaxed">
                  We begin with municipal sites, transport operators and
                  regional authorities.
                </p>
              </div>
              <div>
                <div className="flex items-center gap-3">
                  <CalendarCheck className="h-5 w-5 shrink-0 text-[#C65A3A]" strokeWidth={1.5} aria-hidden="true" />
                  <h3 className="font-serif text-lg font-medium text-[#2C211B]">
                    Every figure dated
                  </h3>
                </div>
                <p className="mt-3 text-sm leading-relaxed">
                  Every number or rule shows the date we last verified it.
                </p>
              </div>
              <div>
                <div className="flex items-center gap-3">
                  <Ban className="h-5 w-5 shrink-0 text-[#C65A3A]" strokeWidth={1.5} aria-hidden="true" />
                  <h3 className="font-serif text-lg font-medium text-[#2C211B]">
                    Nobody pays to be listed
                  </h3>
                </div>
                <p className="mt-3 text-sm leading-relaxed">
                  There are no affiliate relationships or paid placements.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Recently updated — three most recent, pillars excluded */}
        <section className="px-4 py-16 sm:px-6 sm:py-20">
          <div className="mx-auto max-w-6xl">
            <h2 className="font-serif text-2xl font-medium text-[#2C211B] sm:text-3xl">
              Recently updated guides
            </h2>
            <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
              {recentlyUpdated.map((article) => {
                const updated = formatDisplayDate(article.updated);
                return (
                  <Link
                    key={article.slug}
                    to={articlePath(article)}
                    className="group flex flex-col rounded-lg border border-[#e8dfd4] bg-white p-6 transition-colors hover:border-[#C65A3A]/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C65A3A]"
                  >
                    <h3 className="font-serif text-lg font-medium text-[#2C211B] group-hover:text-[#C65A3A]">
                      {article.title}
                    </h3>
                    <p className="mt-2 flex-1 text-sm leading-relaxed">
                      {article.excerpt}
                    </p>
                    {updated && (
                      <p className="mt-4 flex items-center gap-1.5 text-xs text-[#a45d49]">
                        <CalendarCheck className="h-3.5 w-3.5" aria-hidden="true" />
                        Updated {updated}
                      </p>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
