import { useEffect } from "react";
import { NavLink } from "react-router-dom";
import { X } from "lucide-react";
import { NAV } from "@/constants/testIds";

export default function MobileMenu({ open, onClose, links }) {
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

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
