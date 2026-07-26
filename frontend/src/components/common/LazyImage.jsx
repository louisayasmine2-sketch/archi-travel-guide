import { useEffect, useState } from "react";

// Self-hosted: a fallback that lives on someone else's CDN can break at the
// exact moment it is needed, and hotlinking is against the house rules anyway.
const FALLBACK_IMAGE = "/images/siena/01-hero-palazzo-pubblico-torre-del-mangia.webp";

export default function LazyImage({ src, alt = "", ratio = "16/9", className = "", eager = false }) {
  const [imageSrc, setImageSrc] = useState(src);

  useEffect(() => {
    setImageSrc(src);
  }, [src]);

  return (
    <div
      className={["overflow-hidden bg-[hsl(var(--ivory-2))]", className].join(" ")}
      style={{ aspectRatio: ratio }}
    >
      <img
        src={imageSrc}
        alt={alt}
        loading={eager ? "eager" : "lazy"}
        decoding="async"
        onError={() => {
          if (imageSrc !== FALLBACK_IMAGE) setImageSrc(FALLBACK_IMAGE);
        }}
        className="w-full h-full object-cover"
      />
    </div>
  );
}
