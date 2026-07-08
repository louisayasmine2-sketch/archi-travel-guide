import React from "react";
import { Link } from "react-router-dom";
import SEO from "@/components/common/SEO";
import {
  canonical,
  DEFAULT_DESCRIPTION,
  DEFAULT_OG_IMAGE,
  SITE_NAME,
  TWITTER_HANDLE,
  ORGANIZATION_JSONLD,
  websiteSchema,
} from "@/lib/seo";

const QUICK_LINKS = [
  { href: "/siena-travel-guide", label: "Siena Travel Guide" },
  { href: "/siena-day-trip-from-florence", label: "Siena Day Trip from Florence" },
  {
    href: "/florence-to-siena-by-train-or-bus",
    label: "Florence to Siena by Train or Bus",
  },
  { href: "/one-day-in-siena", label: "One Day in Siena" },
  { href: "/where-to-stay-in-siena", label: "Where to Stay in Siena" },
  { href: "/things-to-do-in-siena", label: "Things to Do in Siena" },
  { href: "/tuscany-travel-guide", label: "Tuscany Travel Guide" },
  { href: "/travel-budget-calculator", label: "Travel Budget Calculator" },
  { href: "/editorial-policy", label: "Editorial Policy" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function Home() {
  return (
    <main>
      <SEO
        title="Archi Travel Guide | Siena, Tuscany & Practical Travel Planning"
        description={`Plan practical, reliable trips with ${SITE_NAME}. Discover places, transport options, day plans, and practical travel tools for Siena and Tuscany.`}
        canonical={canonical("/")}
        image={DEFAULT_OG_IMAGE}
        twitterHandle={TWITTER_HANDLE}
        schema={[websiteSchema(), ORGANIZATION_JSONLD]}
      />

      <section>
        <img
          src="https://images.unsplash.com/photo-1518635017480-f6d7e1d3f7f2?auto=format&fit=crop&w=1800&q=80"
          alt="Siena skyline and cathedral"
          width={1600}
          height={900}
          decoding="async"
          loading="eager"
          fetchPriority="high"
          style={{ width: "100%", height: "auto", display: "block" }}
        />
      </section>

      <section>
        <h1>{`Archi Travel Guide | Siena, Tuscany & Practical Travel Planning`}</h1>
        <p>{DEFAULT_DESCRIPTION}</p>
      </section>

      <section>
        <h2>Key planning pages</h2>
        <ul>
          {QUICK_LINKS.map((link) => (
            <li key={link.href}>
              <Link to={link.href}>{link.label}</Link>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
