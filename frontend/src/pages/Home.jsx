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

const proofPoints = ["Siena-first planning", "Honest routes", "Budget tools"];

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
    <img
      src="/images/siena-hero.svg"
      alt="Illustrated Siena skyline with cathedral-inspired architecture and Tuscan hills"
      width="1600"
      height="900"
      loading="eager"
      decoding="async"
      fetchPriority="high"
      style={styles.image}
    />
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
    gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 360px), 1fr))",
    gap: "clamp(22px, 5vw, 72px)",
    alignItems: "center",
    maxWidth: 1180,
    margin: "0 auto",
    padding: "clamp(42px, 7vw, 86px) 20px clamp(30px, 6vw, 72px)",
  },
  heroCopy: {
    minWidth: 0,
    width: "100%",
    maxWidth: 760,
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
    marginTop: 26,
  },
  proofRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 18,
  },
  proofPill: {
    display: "inline-flex",
    alignItems: "center",
    minHeight: 32,
    padding: "0 12px",
    borderRadius: 999,
    background: "#fff3ea",
    border: "1px solid #ead5c8",
    color: "#7f4d39",
    fontSize: 13,
    fontWeight: 800,
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
    width: "100%",
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
    contentVisibility: "auto",
    containIntrinsicSize: "720px",
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
        <section className="home-hero-shell" style={styles.hero} aria-labelledby="homepage-title">
          <div style={styles.heroCopy}>
            <p style={styles.eyebrow}>Siena, Tuscany & practical planning</p>
            <h1 id="homepage-title" className="home-hero-title" style={styles.title}>
              Plan smarter trips around Siena and Tuscany.
            </h1>
            <p style={styles.intro}>
              Archi Travel Guide helps independent travelers choose better
              routes, stays, day trips, and budgets without getting lost in
              generic travel advice.
            </p>
            <div className="home-proof-row" style={styles.proofRow}>
              {proofPoints.map((point) => (
                <span key={point} style={styles.proofPill}>
                  {point}
                </span>
              ))}
            </div>
            <div className="home-actions" style={styles.actions}>
              <Link to="/siena-travel-guide" className="home-action-link" style={styles.primary}>
                Start with Siena
              </Link>
              <Link to="/travel-budget-calculator" className="home-action-link" style={styles.secondary}>
                Estimate a Trip Budget
              </Link>
            </div>
          </div>

          <div className="home-hero-image" style={styles.imageWrap}>
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
                Start with the guides that answer the first real planning
                questions: where to stay, how to move around, what to do, and
                how much the trip may cost.
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
