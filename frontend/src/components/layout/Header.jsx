import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { Menu, Search, Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";
import { NAV } from "@/constants/testIds";
import { searchSite } from "@/lib/searchIndex";
import MobileMenu from "./MobileMenu";
import TripChip from "./TripChip";

const NAV_LINKS = [
  { to: "/siena",                label: "Siena",        tid: NAV.linkSiena },
  { to: "/tuscany-travel-guide", label: "Tuscany",      tid: NAV.linkTuscany },
  { to: "/travel-tools",         label: "Travel Tools", tid: NAV.linkTravelTools },
  { to: "/blog",                 label: "Blog",         tid: NAV.linkBlog },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => { setMounted(true); }, []);
  const [q, setQ] = useState("");
  const scrolledRef = useRef(false);
  const navigate = useNavigate();
  const { pathname } = useLocation();

  useEffect(() => {
    let frame = 0;

    const updateScrolled = () => {
      frame = 0;
      const nextScrolled = window.scrollY > 16;
      if (scrolledRef.current !== nextScrolled) {
        scrolledRef.current = nextScrolled;
        setScrolled(nextScrolled);
      }
    };

    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(updateScrolled);
    };

    updateScrolled();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(() => { setMobileOpen(false); }, [pathname]);

  const [searchOpen, setSearchOpen] = useState(false);
  const [activeIdx, setActiveIdx] = useState(-1);
  const results = q.trim() ? searchSite(q.trim()) : [];

  const goTo = (path) => {
    navigate(path);
    setQ("");
    setSearchOpen(false);
    setActiveIdx(-1);
  };

  // Enter submits the full /blog?q= listing; a suggestion is only opened
  // when the user has explicitly highlighted it with the arrow keys.
  const onSearch = (e) => {
    e.preventDefault();
    if (activeIdx >= 0 && results[activeIdx]) return goTo(results[activeIdx].path);
    if (!q.trim()) return;
    goTo(`/blog?q=${encodeURIComponent(q.trim())}`);
  };

  const onSearchKey = (e) => {
    if (e.key === "Escape") { setSearchOpen(false); setActiveIdx(-1); }
    else if (e.key === "ArrowDown" && results.length) {
      e.preventDefault();
      setActiveIdx((i) => (i + 1) % results.length);
    } else if (e.key === "ArrowUp" && results.length) {
      e.preventDefault();
      setActiveIdx((i) => (i <= 0 ? results.length - 1 : i - 1));
    }
  };

  return (
    <>
      <header
        className={[
          "sticky top-0 z-50 transition-all duration-500",
          scrolled
            ? "backdrop-blur-xl bg-white/80 border-b border-[#F5EDE3] shadow-sm py-2"
            : "bg-[#FAF7F2] border-b border-transparent py-4",
        ].join(" ")}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center gap-6 h-14 lg:h-16">
          <Link
            to="/"
            data-testid={NAV.logo}
            className="flex items-center gap-3 shrink-0 group"
            aria-label="Archi Travel Guide — home"
          >
            <span className="w-10 h-10 rounded-full bg-[#A84A2E] text-white grid place-items-center font-serif text-2xl leading-none group-hover:scale-105 transition-transform duration-300 shadow-md">A</span>
            <span className="font-serif text-xl lg:text-2xl leading-none tracking-tight group-hover:text-[#A84A2E] transition-colors duration-300">
              Archi <span className="text-[#657143]">Travel Guide</span>
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-6 flex-1 justify-center">
            {NAV_LINKS.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                data-testid={l.tid}
                className={({ isActive }) =>
                  [
                    "text-sm font-medium tracking-wide transition-colors duration-300 relative group",
                    isActive
                      ? "text-[#A84A2E]"
                      : "text-[#2C211B] hover:text-[#A84A2E]",
                  ].join(" ")
                }
              >
                {l.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#A84A2E] transition-all duration-300 group-hover:w-full"></span>
              </NavLink>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-4">
            {/* My Trip chip — appears once a plan is saved */}
            <TripChip />

            {/* Search — live suggestions from the published-content index;
                Enter opens the highlighted (or first) result, or falls back
                to the filtered /blog?q= listing. */}
            {searchOpen ? (
              <form onSubmit={onSearch} className="relative flex items-center gap-2">
                <input
                  autoFocus
                  data-testid={NAV.searchInput}
                  value={q}
                  onChange={(e) => { setQ(e.target.value); setActiveIdx(-1); }}
                  onKeyDown={onSearchKey}
                  onBlur={() => { if (!q.trim()) setSearchOpen(false); }}
                  placeholder="Search guides…"
                  aria-label="Search guides"
                  role="combobox"
                  aria-expanded={results.length > 0}
                  aria-controls="nav-search-listbox"
                  aria-autocomplete="list"
                  className="w-56 px-4 py-2 rounded-full border border-[#C65A3A]/50 bg-white text-sm focus:outline-none focus:border-[#C65A3A]"
                />
                <button
                  type="submit"
                  data-testid={NAV.searchSubmit}
                  aria-label="Submit search"
                  className="w-10 h-10 rounded-full bg-[#A84A2E] text-white flex items-center justify-center hover:bg-[#8F3E26] transition-all shadow-sm shrink-0"
                >
                  <Search className="w-4 h-4" />
                </button>
                {results.length > 0 && (
                  <ul
                    id="nav-search-listbox"
                    role="listbox"
                    data-testid="nav-search-suggestions"
                    className="absolute right-0 top-full mt-2 w-80 rounded-2xl border border-[#F5EDE3] bg-white shadow-xl overflow-hidden z-50"
                  >
                    {results.map((r, i) => (
                      <li key={r.path} role="option" aria-selected={i === activeIdx}>
                        <button
                          type="button"
                          data-testid="nav-search-suggestion"
                          onMouseDown={(e) => { e.preventDefault(); goTo(r.path); }}
                          className={[
                            "w-full text-left px-4 py-3 flex items-start gap-3 transition-colors",
                            i === activeIdx ? "bg-[#FAF7F2]" : "hover:bg-[#FAF7F2]",
                          ].join(" ")}
                        >
                          <span className="mt-0.5 text-[10px] font-bold uppercase tracking-wider text-[#657143] bg-[#F5EDE3] rounded-full px-2 py-0.5 shrink-0">
                            {r.type}
                          </span>
                          <span className="text-sm text-[#2C211B] leading-snug line-clamp-2">{r.title}</span>
                        </button>
                      </li>
                    ))}
                    <li className="border-t border-[#F5EDE3]">
                      <button
                        type="button"
                        data-testid="nav-search-see-all"
                        onMouseDown={(e) => { e.preventDefault(); goTo(`/blog?q=${encodeURIComponent(q.trim())}`); }}
                        className="w-full text-left px-4 py-2.5 text-xs text-[#657143] hover:bg-[#FAF7F2]"
                      >
                        See all results for “{q.trim()}” →
                      </button>
                    </li>
                  </ul>
                )}
              </form>
            ) : (
              <button
                type="button"
                onClick={() => setSearchOpen(true)}
                aria-label="Search the site"
                aria-expanded={searchOpen}
                className="w-10 h-10 rounded-full border border-[#F5EDE3] flex items-center justify-center hover:border-[#C65A3A] hover:text-[#A84A2E] hover:bg-white transition-all shadow-sm"
              >
                <Search className="w-4 h-4" />
              </button>
            )}

            {/* Theme Toggle */}
            {mounted && (
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="w-10 h-10 rounded-full border border-[#F5EDE3] flex items-center justify-center hover:border-[#C65A3A] hover:text-[#A84A2E] hover:bg-white transition-all shadow-sm"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>
            )}
          </div>

          <button
            type="button"
            aria-label="Open menu"
            data-testid={NAV.mobileMenuButton}
            className="lg:hidden ml-auto p-2 rounded-full border border-[#F5EDE3] hover:border-[#C65A3A] transition-colors"
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
