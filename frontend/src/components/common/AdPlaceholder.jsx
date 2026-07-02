export default function AdPlaceholder({ label = "Advertisement", variant = "banner", className = "" }) {
  const dims =
    variant === "square"
      ? "h-48 md:h-64"
      : variant === "sidebar"
      ? "h-72"
      : "h-24 md:h-28";
  return (
    <aside
      role="complementary"
      aria-label="Advertisement placeholder"
      className={["not-prose w-full", className].join(" ")}
    >
      <span className="ad-label">{label}</span>
      <div
        className={[
          "w-full rounded-lg border border-dashed border-[hsl(var(--stone-border))] bg-[hsl(var(--ivory-2))]",
          "grid place-items-center text-xs uppercase tracking-[0.2em] text-[hsl(var(--charcoal-soft))]",
          dims,
        ].join(" ")}
      >
        Ad slot · reserved
      </div>
    </aside>
  );
}
