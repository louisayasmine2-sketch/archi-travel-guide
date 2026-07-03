import { useEffect, useState } from "react";

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1646319514161-8fba0ebc3275?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NTYxOTJ8MHwxfHNlYXJjaHwyfHxzaWVuYSUyMGl0YWx5JTIwYXJjaGl0ZWN0dXJlfGVufDB8fHx8MTc4MzAwNDQ4Nnww&ixlib=rb-4.1.0&q=85";

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
