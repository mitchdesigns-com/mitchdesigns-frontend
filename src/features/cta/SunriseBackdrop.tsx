/** Our yellow at a given strength, for the glow layers. */
const glow = (pct: number) => `color-mix(in oklab, var(--color-yellow) ${pct}%, transparent)`;

/** Where the sun breaks over the horizon (% of the banner), below the copy. */
const SUN = { x: 60, y: 86 };
/**
 * The planet as a huge ellipse centred far below the banner; its top edge
 * (radius RY above the centre) is the curved horizon at SUN.y.
 */
const RX = 170;
const RY = 240;
const PLANET_AT = `${SUN.x}% ${SUN.y + RY}%`;
const SIZE = `${RX}% ${RY}%`;
/** Horizontal fade, so the lit rim is strongest under the sun. */
const RIM_MASK = `linear-gradient(90deg, transparent 8%, black ${SUN.x - 14}%, black ${SUN.x + 6}%, transparent 94%)`;

/**
 * Sunrise over a dark planet, drawn with CSS gradients so it stays sharp at
 * any screen size (the old photo was small, compressed and blew up into
 * dots). A wide warm glow fills the sky, a crisp lit rim traces the horizon
 * and fades towards the sides, and a bright core sits where the sun breaks.
 */
export function SunriseBackdrop() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden bg-black">
      {/* Sky glow above the horizon */}
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(75% 70% at ${SUN.x}% ${SUN.y}%, ${glow(26)} 0%, ${glow(12)} 28%, ${glow(5)} 52%, ${glow(2)} 70%, transparent 88%)`,
        }}
      />
      {/* The planet, dark below the horizon */}
      <div
        className="absolute inset-0"
        style={{ background: `radial-gradient(${SIZE} at ${PLANET_AT}, var(--color-black) 99.7%, transparent 100%)` }}
      />
      {/* Lit rim of the horizon: a thin bright line and its haze */}
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(${SIZE} at ${PLANET_AT}, transparent 99.55%, ${glow(95)} 99.75%, ${glow(55)} 100%, ${glow(22)} 101%, ${glow(8)} 102.5%, transparent 105%)`,
          maskImage: RIM_MASK,
          WebkitMaskImage: RIM_MASK,
        }}
      />
      {/* The sun breaking through: a bright, slightly cool core on the rim */}
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(16% 3% at ${SUN.x}% ${SUN.y - 0.4}%, color-mix(in oklab, white 85%, var(--color-yellow)) 0%, ${glow(65)} 35%, ${glow(15)} 70%, transparent 100%)`,
        }}
      />
    </div>
  );
}
