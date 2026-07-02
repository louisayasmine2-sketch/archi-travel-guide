import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export default function ToolCard({ to, name, blurb, icon: Icon }) {
  return (
    <Link
      to={to}
      className="group card-editorial p-7 flex flex-col justify-between min-h-[220px]"
      data-testid={`tool-card-${name.toLowerCase().replace(/\s+/g, '-')}`}
    >
      <div>
        {Icon && (
          <div className="w-11 h-11 rounded-full bg-[hsl(var(--ivory-2))] grid place-items-center text-[hsl(var(--terracotta))] mb-5 group-hover:bg-[hsl(var(--terracotta))] group-hover:text-[hsl(var(--ivory))] transition-colors">
            <Icon className="w-5 h-5" />
          </div>
        )}
        <h3 className="font-serif text-2xl leading-tight">{name}</h3>
        <p className="text-sm text-[hsl(var(--charcoal-soft))] mt-3 leading-relaxed">{blurb}</p>
      </div>
      <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-[hsl(var(--terracotta))] group-hover:gap-2.5 transition-all">
        Use tool <ArrowRight className="w-4 h-4" />
      </span>
    </Link>
  );
}
