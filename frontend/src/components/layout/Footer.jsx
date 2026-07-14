import { Link } from "react-router-dom";
import { Mail } from "lucide-react";

const cols = [
  {
    title: "Destinations",
    links: [
      { to: "/italy", label: "Italy" },
      { to: "/tuscany-travel-guide", label: "Tuscany" },
      { to: "/siena", label: "Siena" },
      { to: "/europe", label: "Europe" },
      { to: "/asia", label: "Asia" },
      { to: "/destinations", label: "All destinations" },
    ],
  },
  {
    title: "Travel Tools",
    links: [
      { to: "/travel-budget-calculator", label: "Budget calculator" },
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
      { to: "/terms-of-service", label: "Terms of service" },
      { to: "/terms-of-use", label: "Terms of use" },
      { to: "/affiliate-disclosure", label: "Affiliate disclosure" },
      { to: "/editorial-policy", label: "Editorial policy" },
      { to: "/disclaimer", label: "Disclaimer" },
    ],
  },
];

const IgIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
  </svg>
);
const TkIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
  </svg>
);
const YtIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
    <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
);
const FbIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);
const XIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);
const PinIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
    <path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 01.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z"/>
  </svg>
);

const SOCIALS = [
  { label: "Instagram", href: "https://instagram.com/archituscany", Icon: IgIcon },
  { label: "TikTok", href: "https://tiktok.com/@archituscany", Icon: TkIcon },
  { label: "YouTube", href: "https://youtube.com/@ArchiTuscany", Icon: YtIcon },
  { label: "Facebook", href: "https://facebook.com/ArchiTuscanyTravelsGuide", Icon: FbIcon },
  { label: "X", href: "https://x.com/ArchiTuscany", Icon: XIcon },
  { label: "Pinterest", href: "https://pinterest.com/ArchiTuscany", Icon: PinIcon },
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

            <div className="mt-6">
              <p className="text-xs tracking-[0.15em] uppercase text-[hsl(var(--ivory))]/50 mb-3">Follow us</p>
              <div className="flex items-center gap-2 flex-wrap">
                {SOCIALS.map(({ label, href, Icon }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="w-9 h-9 grid place-items-center rounded-full border border-[hsl(var(--ivory))]/20 hover:border-[hsl(var(--terracotta))] hover:text-[hsl(var(--terracotta))] hover:bg-[hsl(var(--terracotta))]/10 transition-all duration-200"
                  >
                    <Icon />
                  </a>
                ))}
                <a
                  href="mailto:contact@affittacameregliarchi.com"
                  aria-label="Email Archi Travel Guide"
                  className="w-9 h-9 grid place-items-center rounded-full border border-[hsl(var(--ivory))]/20 hover:border-[hsl(var(--terracotta))] hover:text-[hsl(var(--terracotta))] hover:bg-[hsl(var(--terracotta))]/10 transition-all duration-200"
                >
                  <Mail className="w-4 h-4" />
                </a>
              </div>
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
