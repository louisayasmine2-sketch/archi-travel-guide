export default function LazyImage({ src, alt = "", ratio = "16/9", className = "", eager = false }) {
  return (
    <div
      className={["overflow-hidden bg-[hsl(var(--ivory-2))]", className].join(" ")}
      style={{ aspectRatio: ratio }}
    >
      <img
        src={src}
        alt={alt}
        loading={eager ? "eager" : "lazy"}
        decoding="async"
        className="w-full h-full object-cover"
      />
    </div>
  );
}
