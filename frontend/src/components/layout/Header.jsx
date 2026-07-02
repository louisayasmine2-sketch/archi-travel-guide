import { useEffect, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, Search } from "lucide-react";
import { NAV } from "@/constants/testIds";
import MobileMenu from "./MobileMenu";

const NAV_LINKS = [
  { to: "/destinations", label: "Destinations", tid: NAV.linkDestinations },
  { to: "/italy",        label: "Italy",        tid: NAV.linkItaly },
  { to: "/europe",       label: "Europe",       tid: NAV.linkEurope },
  { to: "/asia",         label: "Asia",         tid: NAV.linkAsia },
  { to: "/travel-tools", label: "Travel Tools", tid: NAV.linkTravelTools },
  { to: "/travel-deals", label: "Deals & Resources", tid: NAV.linkTravelDeals },
  { to: "/blog",         label: "Blog",         tid: NAV.linkBlog },
  { to: "/about",        label: "About",        tid: NAV.linkAbout },
  { to: "/contact",      label: "Contact",      tid: NAV.linkContact },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [q, setQ] = useState("");
  const navigate = useNavigate();
  const { pathname } = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setMobileOpen(false); }, [pathname]);

  const onSearch = (e) => {
    e.preventDefault();
    if (!q.trim()) return;
    navigate(`/blog?q=${encodeURIComponent(q.trim())}`);
    setQ("");
  };

  return (
    <>
      <header
        className={[
          "sticky top-0 z-40 transition-all duration-300",
          scrolled
            ? "backdrop-blur-xl bg-[hsl(var(--ivory))]/85 border-b border-[hsl(var(--stone-border))]"
            : "bg-[hsl(var(--ivory))] border-b border-transparent",
        ].join(" ")}
      >
        <div className="container-editorial flex items-center gap-6 h-16 lg:h-20">
          <Link
            to="/"
            data-testid={NAV.logo}
            className="flex items-center gap-2 shrink-0 group"
            aria-label="Archi Travel Guide — home"
          >
            <span className="w-8 h-8 rounded-full bg-[hsl(var(--terracotta))] text-[hsl(var(--ivory))] grid place-items-center font-serif text-lg leading-none">A</span>
            <span className="font-serif text-xl lg:text-2xl leading-none tracking-tight group-hover:text-[hsl(var(--terracotta))] transition-colors">
              Archi <span className="text-[hsl(var(--charcoal-soft))]">Travel Guide</span>
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-5 xl:gap-7 flex-1 justify-center">
            {NAV_LINKS.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                data-testid={l.tid}
                className={({ isActive }) =>
                  [
                    "text-[13px] font-medium tracking-wide transition-colors",
                    isActive
                      ? "text-[hsl(var(--terracotta))]"
                      : "text-[hsl(var(--charcoal))] hover:text-[hsl(var(--terracotta))]",
                  ].join(" ")
                }
              >
                {l.label}
              </NavLink>
            ))}
          </nav>

          <form
            onSubmit={onSearch}
            className="hidden md:flex items-center gap-2 rounded-full border border-[hsl(var(--stone-border))] bg-[hsl(var(--ivory-2))] pl-4 pr-1 py-1 focus-within:border-[hsl(var(--terracotta))]"
          >
            <Search className="w-4 h-4 text-[hsl(var(--charcoal-soft))]" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search guides"
              className="bg-transparent outline-none text-sm w-32 lg:w-40 placeholder:text-[hsl(var(--charcoal-soft))]"
              data-testid={NAV.searchInput}
              aria-label="Search guides"
            />
            <button
              type="submit"
              data-testid={NAV.searchSubmit}
              className="text-xs font-medium bg-[hsl(var(--charcoal))] text-[hsl(var(--ivory))] rounded-full px-3 py-1.5 hover:bg-[hsl(var(--terracotta))] transition-colors"
            >
              Go
            </button>
          </form>

          <button
            type="button"
            aria-label="Open menu"
            data-testid={NAV.mobileMenuButton}
            className="lg:hidden ml-auto p-2 rounded-full border border-[hsl(var(--stone-border))] hover:border-[hsl(var(--terracotta))] transition-colors"
            onClick={() => setMobileOpen(true)}
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </header>

      <MobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} links={NAV_LINKS} />
    </>
  );
}
