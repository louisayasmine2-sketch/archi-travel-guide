// Decorative Tuscan landscape illustrations for the tool cards — flat,
// stylised shapes in the site palette. Deliberately NOT photorealistic and
// not a depiction of any real place, so they can never be mistaken for a
// photograph (see CLAUDE.md §3 on image honesty). Purely presentational:
// rendered aria-hidden, no external assets, deterministic per variant.

const SKIES = ["#FAF7F2", "#F7F0E4", "#F5EDE3"];
const SUNS = ["#E3A857", "#D98E4A", "#C65A3A"];
const FAR_HILLS = ["#B9C49A", "#C2BC93", "#AEB98F"];
const MID_HILLS = ["#8A9A5B", "#94A063", "#7F9157"];
const FRONT_HILLS = ["#C08552", "#B98A6A", "#C65A3A"];
const CYPRESS = "#4C5B3F";

export default function TuscanScene({ variant = 0, className = "" }) {
  const v = ((variant % 9) + 9) % 9;
  const sunX = 50 + ((v * 47) % 300);
  const sky = SKIES[v % SKIES.length];
  const sun = SUNS[v % SUNS.length];
  const far = FAR_HILLS[(v + 1) % FAR_HILLS.length];
  const mid = MID_HILLS[v % MID_HILLS.length];
  const front = FRONT_HILLS[(v + 2) % FRONT_HILLS.length];
  // Hill curvature and cypress placement shift per variant.
  const w1 = 20 + (v * 11) % 30;
  const w2 = 15 + (v * 7) % 25;
  const cypresses = [70 + ((v * 53) % 90), 210 + ((v * 31) % 60), 320 + ((v * 17) % 50)];

  return (
    <svg
      viewBox="0 0 400 120"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      focusable="false"
      className={`tuscan-scene ${className}`}
    >
      <rect width="400" height="120" fill={sky} />
      <circle cx={sunX} cy="34" r="16" fill={sun} opacity="0.85" />
      <path d={`M0,${62 + w2 / 3} Q100,${40 + w1} 200,${60 + w2 / 2} T400,${55 + w1 / 2} L400,120 L0,120 Z`} fill={far} opacity="0.7" />
      <path d={`M0,${78 - w2 / 4} Q120,${52 + w2} 240,${74 - w1 / 3} T400,${72 + w2 / 3} L400,120 L0,120 Z`} fill={mid} opacity="0.85" />
      <path d={`M0,${96 + w1 / 6} Q140,${76 - w2 / 2} 280,${92 + w1 / 4} T400,${88 + w2 / 4} L400,120 L0,120 Z`} fill={front} opacity="0.9" />
      {cypresses.map((x, i) => (
        <ellipse key={i} cx={x} cy={92 - (i % 2) * 6} rx="3.2" ry={11 + (i % 2) * 3} fill={CYPRESS} />
      ))}
    </svg>
  );
}
