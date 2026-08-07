import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { X, Search } from "lucide-react";
import { NAV } from "@/constants/testIds";

export default function MobileMenu({ open, onClose, links }) {
  const [q, setQ] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const onSearch = (e) => {
    e.preventDefault();
    if (!q.trim()) return;
    navigate(`/blog?q=${encodeURIComponent(q.trim())}`);
    setQ("");
    onClose();
  };

  return (
    <div
      aria-hidden={!open}
      className={[
        "fixed inset-0 z-50 lg:hidden transition-opacity duration-300",
        open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none",
      ].join(" ")}
    >
      <div className="absolute inset-0 bg-[hsl(var(--charcoal))]/40" onClick={onClose} />
      <aside
        data-testid={NAV.mobileMenuPanel}
        className={[
          "absolute top-0 right-0 h-full w-[85%] max-w-sm bg-[hsl(var(--ivory))] shadow-2xl",
          "transition-transform duration-300",
          open ? "translate-x-0" : "translate-x-full",
        ].join(" ")}
      >
        <div className="flex items-center justify-between px-6 h-16 border-b border-[hsl(var(--stone-border))]">
          <span className="font-serif text-lg">Menu</span>
          <button
            data-testid={NAV.mobileMenuClose}
            onClick={onClose}
            className="p-2 rounded-full hover:bg-[hsl(var(--ivory-2))]"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={onSearch} className="px-6 pt-4 flex items-center gap-2">
          <input
            data-testid="mobile-search-input"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search guides…"
            aria-label="Search guides"
            className="flex-1 px-4 py-2.5 rounded-full border border-[hsl(var(--stone-border))] bg-white text-sm focus:outline-none focus:border-[hsl(var(--terracotta))]"
          />
          <button
            type="submit"
            data-testid="mobile-search-submit"
            aria-label="Submit search"
            className="w-10 h-10 rounded-full bg-[hsl(var(--terracotta))] text-white flex items-center justify-center shrink-0"
          >
            <Search className="w-4 h-4" />
          </button>
        </form>
        <nav className="flex flex-col px-6 py-4">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              data-testid={`${l.tid}-mobile`}
              className={({ isActive }) =>
                [
                  "py-3 border-b border-[hsl(var(--stone-border))]/60 font-medium text-base",
                  isActive ? "text-[hsl(var(--terracotta))]" : "text-[hsl(var(--charcoal))]",
                ].join(" ")
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>
      </aside>
    </div>
  );
}
