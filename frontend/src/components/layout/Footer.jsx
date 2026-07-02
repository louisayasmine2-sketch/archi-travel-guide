import { Link } from "react-router-dom";
import { Instagram, Youtube, Mail } from "lucide-react";

const cols = [
  {
    title: "Destinations",
    links: [
      { to: "/italy", label: "Italy" },
      { to: "/tuscany", label: "Tuscany" },
      { to: "/siena", label: "Siena" },
      { to: "/europe", label: "Europe" },
      { to: "/asia", label: "Asia" },
      { to: "/destinations", label: "All destinations" },
    ],
  },
  {
    title: "Travel Tools",
    links: [
      { to: "/travel-tools/budget-calculator", label: "Budget calculator" },
      { to: "/travel-tools/itinerary-generator", label: "Itinerary generator" },
      { to: "/travel-tools/area-finder", label: "Best area to stay" },
      { to: "/travel-tools/packing-checklist", label: "Packing checklist" },
      { to: "/travel-tools/best-time-to-visit", label: "Best time to visit" },
      { to: "/travel-tools/transport-guide", label: "Transport guide" },
    ],
  },
  {
    title: "Resources",
    links: [
      { to: "/travel-deals", label: "Travel deals & resources" },
      { to: "/blog", label: "Blog" },
      { to: "/about", label: "About" },
      { to: "/contact", label: "Contact" },
    ],
  },
  {
    title: "Legal",
    links: [
      { to: "/privacy-policy", label: "Privacy policy" },
      { to: "/cookie-policy", label: "Cookie policy" },
      { to: "/terms-of-use", label: "Terms of use" },
      { to: "/affiliate-disclosure", label: "Affiliate disclosure" },
      { to: "/editorial-policy", label: "Editorial policy" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="mt-24 bg-[hsl(var(--charcoal))] text-[hsl(var(--ivory))]">
      <div className="container-editorial py-16 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
          <div className="lg:col-span-4">
            <div className="flex items-center gap-2 mb-5">
              <span className="w-9 h-9 rounded-full bg-[hsl(var(--terracotta))] text-[hsl(var(--ivory))] grid place-items-center font-serif text-xl leading-none">A</span>
              <span className="font-serif text-2xl">Archi Travel Guide</span>
            </div>
            <p className="text-[hsl(var(--ivory))]/70 max-w-sm leading-relaxed">
              A professional, independent travel guide for smart travelers. Practical itineraries, honest recommendations, no clickbait.
            </p>
            <p className="mt-6 text-xs tracking-[0.2em] uppercase text-[hsl(var(--ivory))]/50">
              First pillar · Italy · Tuscany · Siena
            </p>
            <div className="flex items-center gap-3 mt-6">
              <a href="mailto:contact@affittacameregliarchi.com" aria-label="Email" className="w-9 h-9 grid place-items-center rounded-full border border-[hsl(var(--ivory))]/20 hover:border-[hsl(var(--terracotta))] hover:text-[hsl(var(--terracotta))] transition-colors">
                <Mail className="w-4 h-4" />
              </a>
              <a href="#" aria-label="Instagram" className="w-9 h-9 grid place-items-center rounded-full border border-[hsl(var(--ivory))]/20 hover:border-[hsl(var(--terracotta))] hover:text-[hsl(var(--terracotta))] transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" aria-label="YouTube" className="w-9 h-9 grid place-items-center rounded-full border border-[hsl(var(--ivory))]/20 hover:border-[hsl(var(--terracotta))] hover:text-[hsl(var(--terracotta))] transition-colors">
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>

          <div className="lg:col-span-8 grid grid-cols-2 md:grid-cols-4 gap-8">
            {cols.map((c) => (
              <div key={c.title}>
                <h4 className="font-serif text-lg mb-4">{c.title}</h4>
                <ul className="space-y-2.5">
                  {c.links.map((l) => (
                    <li key={l.to}>
                      <Link to={l.to} className="text-sm text-[hsl(var(--ivory))]/70 hover:text-[hsl(var(--terracotta))] transition-colors">
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-14 pt-8 border-t border-[hsl(var(--ivory))]/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-xs text-[hsl(var(--ivory))]/60">
          <p>© {new Date().getFullYear()} Archi Travel Guide. Independent editorial publication.</p>
          <p className="max-w-xl md:text-right">
            This site may earn a commission from carefully selected affiliate partners at no extra cost to you. Editorial decisions remain independent — see our{" "}
            <Link to="/editorial-policy" className="underline underline-offset-4 hover:text-[hsl(var(--terracotta))]">editorial policy</Link>.
          </p>
        </div>
      </div>
    </footer>
  );
}
