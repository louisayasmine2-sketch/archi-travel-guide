import { Link } from "react-router-dom";
import LazyImage from "./LazyImage";

export default function ArticleCard({ article, variant = "default" }) {
  const to = article.canonicalPath || `/blog/${article.slug}`;
  if (variant === "compact") {
    return (
      <Link to={to} className="group flex gap-4 items-start">
        <LazyImage src={article.image} alt={article.title} ratio="4/3" className="w-24 h-24 rounded-lg shrink-0" />
        <div className="min-w-0">
          <p className="overline">{article.category}</p>
          <h4 className="font-serif text-lg leading-snug mt-1 group-hover:text-[hsl(var(--terracotta))] transition-colors">
            {article.title}
          </h4>
        </div>
      </Link>
    );
  }
  return (
    <Link to={to} className="group block card-editorial overflow-hidden">
      <LazyImage src={article.image} alt={article.title} ratio="16/10" className="rounded-t-2xl" />
      <div className="p-6">
        <div className="flex items-center gap-3 text-[11px] tracking-[0.18em] uppercase text-[hsl(var(--charcoal-soft))]">
          <span>{article.category}</span>
          <span className="w-1 h-1 rounded-full bg-[hsl(var(--stone-border))]" />
          <span>{article.region}</span>
        </div>
        <h3 className="font-serif text-2xl leading-tight mt-3 group-hover:text-[hsl(var(--terracotta))] transition-colors">
          {article.title}
        </h3>
        <p className="text-sm text-[hsl(var(--charcoal-soft))] mt-3 leading-relaxed line-clamp-3">{article.excerpt}</p>
        <p className="mt-5 text-xs text-[hsl(var(--charcoal-soft))]">{article.readMinutes} min read · Updated {article.updated}</p>
      </div>
    </Link>
  );
}
