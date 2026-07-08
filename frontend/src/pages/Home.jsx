import React from "react";
import { Link } from "react-router-dom";
import SEO from "@/components/common/SEO";
import { ORGANIZATION_JSONLD, SITE_URL } from "@/lib/seo";

const quickLinks = [
  {
    label: "Siena Travel Guide",
    path: "/siena-travel-guide",
    text: "Start with the main Siena planning hub.",
  },
  {
    label: "Siena Day Trip from Florence",
    path: "/siena-day-trip-from-florence",
    text: "Plan a practical day route between Florence and Siena.",
  },
  {
    label: "Florence to Siena by Train or Bus",
    path: "/florence-to-siena-by-train-or-bus",
    text: "Compare transport options before booking.",
  },
  {
    label: "One Day in Siena",
    path: "/one-day-in-siena",
    text: "Use a focused itinerary for a short visit.",
  },
  {
    label: "Where to Stay in Siena",
    path: "/where-to-stay-in-siena",
    text: "Choose the right base by neighborhood and trip style.",
  },
  {
    label: "Things to Do in Siena",
    path: "/things-to-do-in-siena",
    text: "Find sights, viewpoints, food stops, and slow travel ideas.",
  },
  {
    label: "Tuscany Travel Guide",
    path: "/tuscany-travel-guide",
    text: "Connect Siena with wider Tuscany planning.",
  },
  {
    label: "Travel Budget Calculator",
    path: "/travel-budget-calculator",
    text: "Estimate trip costs before you commit.",
  },
];

const supportLinks = [
  { label: "Editorial Policy", path: "/editorial-policy" },
  { label: "About", path: "/about" },
  { label: "Contact", path: "/contact" },
];

const homeSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Archi Travel Guide",
  url: SITE_URL,
  description:
    "Practical travel guidance for Siena, Tuscany, and smarter independent trip planning.",
  potentialAction: {
    "@type": "SearchAction",
    target: `${SITE_URL}/search?q={search_term_string}`,
    "query-input": "required name=search_term_string",
  },
};

function SienaHeroArt() {
  return (
    <svg
      viewBox="0 0 1600 1000"
      role="img"
      aria-labelledby="siena-hero-title siena-hero-desc"
      style={styles.image}
    >
      <title id="siena-hero-title">Siena skyline and cathedral</title>
      <desc id="siena-hero-desc">
        An illustrated Siena skyline with cathedral-inspired architecture and
        Tuscan hills.
      </desc>
      <defs>
        <linearGradient id="homeSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f8efe5" />
          <stop offset="0.58" stopColor="#ead3bd" />
          <stop offset="1" stopColor="#c99468" />
        </linearGradient>
        <linearGradient id="homeHill" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#8f9a6b" />
          <stop offset="1" stopColor="#4f603f" />
        </linearGradient>
        <linearGradient id="homeRoof" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#c87050" />
          <stop offset="1" stopColor="#873d31" />
        </linearGradient>
      </defs>
      <rect width="1600" height="1000" fill="url(#homeSky)" />
      <circle cx="1250" cy="170" r="90" fill="#fff4d6" opacity="0.92" />
      <path
        d="M0 675 C240 560 390 675 590 590 C795 500 960 650 1185 560 C1380 480 1500 535 1600 500 L1600 1000 L0 1000 Z"
        fill="url(#homeHill)"
      />
      <path
        d="M0 780 C220 700 410 790 620 715 C830 640 1040 790 1280 700 C1430 645 1530 675 1600 650 L1600 1000 L0 1000 Z"
        fill="#3f513b"
        opacity="0.9"
      />
      <g transform="translate(225 340)">
        <rect x="0" y="230" width="1150" height="210" rx="12" fill="#f0dcc3" />
        <path
          d="M0 230 L72 162 L145 230 Z M162 230 L250 125 L342 230 Z M360 230 L455 148 L552 230 Z M575 230 L690 90 L812 230 Z M830 230 L930 150 L1032 230 Z M1045 230 L1120 145 L1150 230 Z"
          fill="url(#homeRoof)"
        />
        <rect x="675" y="50" width="98" height="390" rx="9" fill="#d8b18a" />
        <path d="M724 0 L787 50 L660 50 Z" fill="#7b362e" />
        <rect x="703" y="110" width="42" height="66" rx="21" fill="#6f493f" opacity="0.56" />
        <rect x="700" y="210" width="48" height="150" rx="24" fill="#765044" opacity="0.45" />
        <rect x="410" y="105" width="175" height="335" rx="10" fill="#ead0b4" />
        <path d="M498 30 L603 105 L392 105 Z" fill="#843c31" />
        <circle cx="498" cy="188" r="42" fill="#9d6f58" opacity="0.46" />
        <rect x="465" y="260" width="66" height="120" rx="33" fill="#765044" opacity="0.5" />
        <g fill="#dfbd98">
          <rect x="90" y="275" width="82" height="165" rx="8" />
          <rect x="210" y="265" width="82" height="175" rx="8" />
          <rect x="840" y="270" width="86" height="170" rx="8" />
          <rect x="988" y="280" width="76" height="160" rx="8" />
        </g>
        <g fill="#745046" opacity="0.52">
          <rect x="42" y="282" width="34" height="58" rx="17" />
          <rect x="228" y="300" width="31" height="56" rx="15" />
          <rect x="850" y="303" width="32" height="55" rx="16" />
          <rect x="1010" y="305" width="30" height="52" rx="15" />
        </g>
      </g>
      <rect width="1600" height="1000" fill="#22150f" opacity="0.13" />
    </svg>
  );
}

const styles = {
  page: {
    background: "#fbf8f4",
    color: "#261f1a",
    minHeight: "100vh",
  },
  hero: {
    display: "grid",
    gridTemplateColumns: "minmax(0, 1.02fr) minmax(320px, 0.98fr)",
    gap: "clamp(28px, 5vw, 72px)",
    alignItems: "center",
    maxWidth: 1180,
    margin: "0 auto",
    padding: "clamp(42px, 7vw, 86px) 20px clamp(30px, 6vw, 72px)",
  },
  eyebrow: {
    fontSize: 13,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    color: "#9a634b",
    fontWeight: 700,
    marginBottom: 14,
  },
  title: {
    fontSize: "clamp(40px, 6vw, 76px)",
    lineHeight: 1.02,
    letterSpacing: 0,
    margin: 0,
    maxWidth: 760,
  },
  intro: {
    fontSize: "clamp(17px, 2vw, 21px)",
    lineHeight: 1.65,
    color: "#5c5047",
    maxWidth: 700,
    margin: "22px 0 0",
  },
  actions: {
    display: "flex",
    flexWrap: "wrap",
    gap: 12,
    marginTop: 30,
  },
  primary: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: 46,
    padding: "0 20px",
    borderRadius: 8,
    background: "#22201e",
    color: "#fff",
    textDecoration: "none",
    fontWeight: 700,
  },
  secondary: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: 46,
    padding: "0 18px",
    borderRadius: 8,
    border: "1px solid #d7c7b8",
    color: "#2c2621",
    background: "#fffaf5",
    textDecoration: "none",
    fontWeight: 700,
  },
  imageWrap: {
    borderRadius: 18,
    overflow: "hidden",
    border: "1px solid #eadccf",
    boxShadow: "0 24px 70px rgba(74, 45, 28, 0.18)",
    background: "#ead7c2",
  },
  image: {
    width: "100%",
    height: "auto",
    display: "block",
    aspectRatio: "16 / 10",
    objectFit: "cover",
  },
  section: {
    maxWidth: 1180,
    margin: "0 auto",
    padding: "28px 20px 76px",
  },
  sectionHeader: {
    display: "flex",
    alignItems: "end",
    justifyContent: "space-between",
    gap: 18,
    marginBottom: 22,
  },
  h2: {
    fontSize: "clamp(28px, 3.6vw, 42px)",
    lineHeight: 1.15,
    margin: 0,
  },
  sectionText: {
    maxWidth: 620,
    color: "#6d6058",
    lineHeight: 1.65,
    margin: "8px 0 0",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: 16,
  },
  card: {
    display: "block",
    minHeight: 154,
    padding: 20,
    borderRadius: 8,
    background: "#ffffff",
    border: "1px solid #eadfd5",
    textDecoration: "none",
    color: "#261f1a",
    boxShadow: "0 10px 28px rgba(52, 40, 31, 0.06)",
  },
  cardTitle: {
    fontSize: 18,
    lineHeight: 1.25,
    margin: "0 0 10px",
    fontWeight: 800,
  },
  cardText: {
    color: "#665a52",
    lineHeight: 1.55,
    margin: 0,
  },
  support: {
    display: "flex",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 22,
  },
  supportLink: {
    color: "#8d563f",
    fontWeight: 700,
    textDecoration: "none",
    borderBottom: "1px solid rgba(141, 86, 63, 0.32)",
  },
};

export default function Home() {
  const schema = [ORGANIZATION_JSONLD, homeSchema].filter(Boolean);

  return (
    <>
      <SEO
        title="Archi Travel Guide | Siena, Tuscany & Practical Travel Planning"
        description="Discover practical travel guidance for Siena and Tuscany: where to stay, what to do, how to plan transport, and budget-friendly trip planning."
        path="/"
        image="/images/siena-hero.svg"
        schema={schema}
      />
      <main style={styles.page}>
        <section style={styles.hero} aria-labelledby="homepage-title">
          <div>
            <p style={styles.eyebrow}>Siena, Tuscany & practical planning</p>
            <h1 id="homepage-title" style={styles.title}>
              Plan smarter trips around Siena and Tuscany.
            </h1>
            <p style={styles.intro}>
              Archi Travel Guide helps independent travelers choose better
              routes, stays, day trips, and budgets without getting lost in
              generic travel advice.
            </p>
            <div style={styles.actions}>
              <Link to="/siena-travel-guide" style={styles.primary}>
                Start with Siena
              </Link>
              <Link to="/travel-budget-calculator" style={styles.secondary}>
                Estimate a Trip Budget
              </Link>
            </div>
          </div>

          <div style={styles.imageWrap}>
            <SienaHeroArt />
          </div>
        </section>

        <section style={styles.section} aria-labelledby="planning-pages-title">
          <div style={styles.sectionHeader}>
            <div>
              <p style={styles.eyebrow}>Key planning pages</p>
              <h2 id="planning-pages-title" style={styles.h2}>
                Main travel guides
              </h2>
              <p style={styles.sectionText}>
                These are the pages we want Google and visitors to understand
                first. Each link points to the canonical route we want to keep.
              </p>
            </div>
          </div>

          <div style={styles.grid}>
            {quickLinks.map((link) => (
              <Link key={link.path} to={link.path} style={styles.card}>
                <h3 style={styles.cardTitle}>{link.label}</h3>
                <p style={styles.cardText}>{link.text}</p>
              </Link>
            ))}
          </div>

          <nav aria-label="Project information" style={styles.support}>
            {supportLinks.map((link) => (
              <Link key={link.path} to={link.path} style={styles.supportLink}>
                {link.label}
              </Link>
            ))}
          </nav>
        </section>
      </main>
    </>
  );
}
