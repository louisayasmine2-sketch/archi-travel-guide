import { useEffect, useState } from "react";

const FALLBACK_IMAGE = "/images/siena/08-siena-cityscape.webp";

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
