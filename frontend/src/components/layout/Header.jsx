import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, Search, Globe, ChevronDown, HeartHandshake, Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";
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
            <span className="w-10 h-10 rounded-full bg-[#C65A3A] text-white grid place-items-center font-serif text-2xl leading-none group-hover:scale-105 transition-transform duration-300 shadow-md">A</span>
            <span className="font-serif text-xl lg:text-2xl leading-none tracking-tight group-hover:text-[#C65A3A] transition-colors duration-300">
              Archi <span className="text-[#8A9A5B]">Travel Guide</span>
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
                      ? "text-[#C65A3A]"
                      : "text-[#2C211B] hover:text-[#C65A3A]",
                  ].join(" ")
                }
              >
                {l.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#C65A3A] transition-all duration-300 group-hover:w-full"></span>
              </NavLink>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-4">
            {/* Multi-language switcher prominent */}
            <div className="relative group flex items-center gap-1.5 cursor-pointer text-sm font-medium text-[#2C211B] hover:text-[#C65A3A] transition-colors">
              <Globe className="w-4 h-4" />
              <span>EN</span>
              <ChevronDown className="w-3 h-3" />
              <div className="absolute top-full right-0 mt-2 w-32 bg-white border border-[#F5EDE3] rounded-2xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 overflow-hidden">
                <div className="py-2 flex flex-col">
                  <button className="px-4 py-2 text-left text-sm hover:bg-[#F5EDE3] hover:text-[#C65A3A] transition-colors font-medium">English</button>
                  <button className="px-4 py-2 text-left text-sm hover:bg-[#F5EDE3] hover:text-[#C65A3A] transition-colors font-medium">Italiano</button>
                  <button className="px-4 py-2 text-left text-sm hover:bg-[#F5EDE3] hover:text-[#C65A3A] transition-colors font-medium">Bahasa ID</button>
                </div>
              </div>
            </div>

            {/* Become Affiliate CTA */}
            <Link to="/travel-deals" className="flex items-center gap-2 bg-[#F5EDE3] text-[#2C211B] hover:bg-[#C65A3A] hover:text-white border border-[#C65A3A]/20 transition-colors duration-300 px-4 py-2 rounded-full text-sm font-bold shadow-sm">
              <HeartHandshake className="w-4 h-4" />
              Become Affiliate
            </Link>
            
            {/* Search */}
            <button className="w-10 h-10 rounded-full border border-[#F5EDE3] flex items-center justify-center hover:border-[#C65A3A] hover:text-[#C65A3A] hover:bg-white transition-all shadow-sm">
              <Search className="w-4 h-4" />
            </button>

            {/* Theme Toggle */}
            {mounted && (
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="w-10 h-10 rounded-full border border-[#F5EDE3] flex items-center justify-center hover:border-[#C65A3A] hover:text-[#C65A3A] hover:bg-white transition-all shadow-sm"
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
