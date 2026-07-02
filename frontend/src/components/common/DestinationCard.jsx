import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";

export default function DestinationCard({ to, name, blurb, tagline, image, size = "md", eager = false }) {
  const heightCls = size === "lg" ? "h-[420px] md:h-[520px]" : "h-[320px] md:h-[380px]";
  return (
    <Link
      to={to}
      className={`group relative block overflow-hidden rounded-2xl bg-[hsl(var(--ivory-2))] ${heightCls}`}
      data-testid={`dest-card-${name.toLowerCase().replace(/\s+/g, '-')}`}
    >
      <img
        src={image}
        alt={name}
        loading={eager ? "eager" : "lazy"}
        decoding="async"
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[hsl(var(--charcoal))]/85 via-[hsl(var(--charcoal))]/20 to-transparent" />
      <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-8 text-[hsl(var(--ivory))]">
        {tagline && (
          <p className="text-[11px] tracking-[0.24em] uppercase opacity-90 mb-2">{tagline}</p>
        )}
        <h3 className="font-serif text-3xl md:text-4xl leading-none">{name}</h3>
        {blurb && (
          <p className="mt-3 text-sm md:text-[15px] opacity-90 max-w-md leading-relaxed">{blurb}</p>
        )}
        <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium opacity-90 group-hover:opacity-100 group-hover:translate-x-1 transition-transform">
          Explore {name} <ArrowUpRight className="w-4 h-4" />
        </span>
      </div>
    </Link>
  );
}
