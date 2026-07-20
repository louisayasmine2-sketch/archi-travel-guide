import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  ParkingCircle,
  ShieldAlert,
  Ticket,
  TrainFront,
  CheckCircle2,
  CalendarCheck,
  Ban,
} from "lucide-react";
import SEO from "@/components/common/SEO";
import { ORGANIZATION_JSONLD } from "@/lib/seo";
import { articles, getArticle } from "@/data/articles";
import { HOME } from "@/constants/testIds";

// Hero assets are served as plain static files from /public/images — never
// inlined as base64 (the design mockup only embedded them for preview).
const HERO_POSTER = "/images/archi-hero-poster.jpg";
const HERO_VIDEO = "/images/archi-hero-loop.mp4";
// Marcellus + Instrument Sans are homepage-only (the approved hero design);
// display=swap is set in the URL. Preconnects to fonts.googleapis.com /
// fonts.gstatic.com already exist globally in public/index.html.
const HERO_FONTS_URL =
  "https://fonts.googleapis.com/css2?family=Marcellus&family=Instrument+Sans:ital,wght@0,400;0,500;0,600;1,400&display=swap";

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
  const videoRef = useRef(null);
  const bgRef = useRef(null);

  // Robust autoplay for the hero video (ported from the approved mockup):
  // muted autoplay + retry on visibilitychange/load, with a pointerdown
  // fallback for browsers that only allow playback after a user gesture.
  // With prefers-reduced-motion the video never starts — poster only.
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return undefined;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      v.removeAttribute("autoplay");
      v.pause();
      return undefined;
    }

    v.defaultMuted = true;
    v.muted = true; // required for autoplay in all browsers
    const tryPlay = () => {
      const p = v.play();
      if (p) p.catch(() => {});
    };
    const onVisibility = () => {
      if (!document.hidden && v.paused) tryPlay();
    };
    // last-resort: some browsers only allow play after a user gesture
    const kick = () => {
      if (v.paused) tryPlay();
      document.removeEventListener("pointerdown", kick);
    };

    tryPlay();
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("load", tryPlay);
    document.addEventListener("pointerdown", kick);
    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("load", tryPlay);
      document.removeEventListener("pointerdown", kick);
    };
  }, []);

  // Subtle "4D" parallax on the background — desktop pointers only,
  // respects reduced motion.
  useEffect(() => {
    const bg = bgRef.current;
    if (!bg) return undefined;
    const fine = window.matchMedia("(pointer:fine)").matches;
    const motionOK = window.matchMedia("(prefers-reduced-motion: no-preference)").matches;
    if (!fine || !motionOK) return undefined;

    let tx = 0;
    let ty = 0;
    let cx = 0;
    let cy = 0;
    let raf = null;

    const step = () => {
      cx += (tx - cx) * 0.08;
      cy += (ty - cy) * 0.08;
      bg.style.transform = `translate(${cx.toFixed(2)}px, ${cy.toFixed(2)}px) scale(1.02)`;
      raf = Math.abs(tx - cx) > 0.05 || Math.abs(ty - cy) > 0.05 ? requestAnimationFrame(step) : null;
    };
    const onMove = (e) => {
      tx = (e.clientX / window.innerWidth - 0.5) * -10; // max ±5px
      ty = (e.clientY / window.innerHeight - 0.5) * -6;
      if (!raf) raf = requestAnimationFrame(step);
    };

    window.addEventListener("mousemove", onMove);
    return () => {
      window.removeEventListener("mousemove", onMove);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

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

      {/* Homepage-only performance hints: the poster is the LCP element.
          The same links are also injected into the prerendered static HTML
          for "/" by scripts/generate-static-html.js so they help first paint;
          this Helmet copy covers client-side navigation and `yarn start`. */}
      <Helmet>
        <link rel="preload" as="image" href={HERO_POSTER} />
        <link rel="preload" as="style" href={HERO_FONTS_URL} />
        <link rel="stylesheet" href={HERO_FONTS_URL} />
      </Helmet>

      <div className="bg-[#F5EDE3] text-[#4f4842] font-sans antialiased">
        {/* Hero — approved video design (mockup: archi-hero-video.html).
            Styles live in src/index.css under "Homepage video hero". */}
        <section className="home-hero" data-testid={HOME.hero}>
          <div className="home-hero-bg" ref={bgRef}>
            <video
              ref={videoRef}
              className="home-hero-video"
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              poster={HERO_POSTER}
              aria-label="Aerial view of Piazza del Campo and Torre del Mangia in Siena at golden hour, gently moving"
              data-testid={HOME.heroVideo}
            >
              <source src={HERO_VIDEO} type="video/mp4" />
            </video>
          </div>

          <div className="home-hero-content">
            <span className="home-hero-eyebrow rise d2">
              Independent travel guides · Siena &amp; beyond
            </span>
            <h1 className="rise d3">
              Plan <span className="home-hero-accent">smarter</span> trips around the world
            </h1>
            <p className="home-hero-lede rise d4">
              Practical, independent guides for Siena, Tuscany, Italy, Europe
              and Asia — with real itineraries, budget tools and honest
              recommendations. No fluff, no hidden ads.
            </p>

            <div className="home-hero-cta-row rise d4">
              <Link
                to="/siena-travel-guide"
                className="home-hero-btn home-hero-btn-primary"
                data-testid={HOME.heroCtaPrimary}
              >
                Explore the Siena guide
              </Link>
              <Link
                to="/travel-budget-calculator"
                className="home-hero-btn home-hero-btn-glass"
                data-testid={HOME.heroCtaSecondary}
              >
                Try the budget calculator
              </Link>
            </div>

            <nav className="home-hero-chips rise d5" aria-label="Popular guides" data-testid={HOME.heroChips}>
              <span className="home-hero-chips-label">Start here</span>
              <Link className="home-hero-chip" to="/florence-to-siena-by-train-or-bus">
                <span className="home-hero-chip-kicker">Transport</span>
                <span className="home-hero-chip-title">Florence → Siena by train or bus</span>
              </Link>
              <Link className="home-hero-chip" to="/where-to-stay-in-siena">
                <span className="home-hero-chip-kicker">Stay</span>
                <span className="home-hero-chip-title">Where to stay in Siena</span>
              </Link>
              <Link className="home-hero-chip" to="/tuscany-travel-guide">
                <span className="home-hero-chip-kicker">Region</span>
                <span className="home-hero-chip-title">Tuscany travel guide</span>
              </Link>
            </nav>
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
