import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

export default function Breadcrumbs({ items = [] }) {
  return (
    <nav aria-label="Breadcrumb" className="text-xs text-[hsl(var(--charcoal-soft))]">
      <ol className="flex flex-wrap items-center gap-1.5">
        {items.map((it, i) => {
          const last = i === items.length - 1;
          return (
            <li key={i} className="flex items-center gap-1.5">
              {it.to && !last ? (
                <Link to={it.to} className="hover:text-[hsl(var(--terracotta))]">{it.label}</Link>
              ) : (
                <span className={last ? "text-[hsl(var(--charcoal))]" : ""}>{it.label}</span>
              )}
              {!last && <ChevronRight className="w-3 h-3" />}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
