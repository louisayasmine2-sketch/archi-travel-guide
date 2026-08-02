import { useEffect, useRef, useState } from "react";

// Elegant 3D tilt: the card leans towards the pointer by at most MAX_DEG,
// with a soft sheen following the cursor. Depth, not drama.
//
// Renders a plain div (no listeners, no extra nodes) when the visitor uses a
// coarse pointer or prefers reduced motion — those users get the exact
// pre-existing experience.
const MAX_DEG = 4;

export default function TiltCard({ children, className = "", ...rest }) {
  const ref = useRef(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    setEnabled(
      window.matchMedia("(pointer: fine)").matches &&
      window.matchMedia("(prefers-reduced-motion: no-preference)").matches
    );
  }, []);

  if (!enabled) {
    return <div className={className} {...rest}>{children}</div>;
  }

  const onMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform =
      `perspective(900px) rotateX(${(-py * MAX_DEG).toFixed(2)}deg) rotateY(${(px * MAX_DEG).toFixed(2)}deg)`;
    el.style.setProperty("--sheen-x", `${((px + 0.5) * 100).toFixed(1)}%`);
    el.style.setProperty("--sheen-y", `${((py + 0.5) * 100).toFixed(1)}%`);
  };

  const onLeave = () => {
    const el = ref.current;
    if (el) el.style.transform = "";
  };

  return (
    <div ref={ref} onMouseMove={onMove} onMouseLeave={onLeave} className={`tilt-card ${className}`} {...rest}>
      {children}
      <span aria-hidden="true" className="tilt-sheen" />
    </div>
  );
}
