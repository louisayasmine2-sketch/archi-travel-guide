import { PlayCircle } from "lucide-react";

export default function VideoThumb({ src, alt = "", title, provider = "External CDN", ratio = "16/9" }) {
  return (
    <figure className="rounded-2xl overflow-hidden border border-[hsl(var(--stone-border))] bg-[hsl(var(--ivory-2))]">
      <div className="relative" style={{ aspectRatio: ratio }}>
        <img src={src} alt={alt} loading="lazy" decoding="async" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[hsl(var(--charcoal))]/70 via-[hsl(var(--charcoal))]/10 to-transparent" />
        <button
          type="button"
          aria-label={`Play video: ${title || alt}`}
          className="absolute inset-0 grid place-items-center text-[hsl(var(--ivory))] hover:scale-105 transition-transform"
        >
          <PlayCircle className="w-16 h-16 drop-shadow-lg" strokeWidth={1.25} />
        </button>
        {title && (
          <figcaption className="absolute bottom-4 left-4 right-4 text-[hsl(var(--ivory))]">
            <p className="text-xs uppercase tracking-[0.2em] opacity-80">{provider}</p>
            <p className="font-serif text-xl leading-tight mt-1">{title}</p>
          </figcaption>
        )}
      </div>
    </figure>
  );
}
