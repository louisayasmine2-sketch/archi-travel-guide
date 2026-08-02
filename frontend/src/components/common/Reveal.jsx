import { useEffect, useRef, useState } from "react";

// Staggered viewport reveal. Content starts VISIBLE (so prerendered HTML,
// crawlers and no-JS clients never see hidden content); after mount, elements
// still below the fold are softly hidden and revealed as they enter the
// viewport. With prefers-reduced-motion nothing ever moves.
export default function Reveal({ children, delay = 0, className = "" }) {
  const ref = useRef(null);
  const [phase, setPhase] = useState("static"); // static | hidden | in

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;
    // Above the fold at mount: leave it exactly as it is — no flash.
    if (el.getBoundingClientRect().top < window.innerHeight * 0.9) return undefined;

    setPhase("hidden");
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setPhase("in");
          io.disconnect();
        }
      },
      { threshold: 0.12 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
      className={[
        className,
        phase === "hidden" ? "reveal-hidden" : "",
        phase === "in" ? "reveal-hidden reveal-in" : "",
      ].join(" ").trim()}
    >
      {children}
    </div>
  );
}
