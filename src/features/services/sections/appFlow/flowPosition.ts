/**
 * Where the scroll is in the app-flow scene. There are `n` steps plus a
 * closing stop (index n: the phone lying on its back). Each stretch first
 * holds on its step, then turns to the next one over the second part.
 */
const HOLD = 0.45;

export function flowPosition(p: number, n: number) {
  const raw = Math.min(1, Math.max(0, p)) * n;
  const from = Math.min(Math.floor(raw), n - 1);
  const f = raw - from;
  const t = Math.min(1, Math.max(0, (f - HOLD) / (1 - HOLD)));
  const to = from + 1;
  const index = t >= 0.5 ? to : from;
  // 0 → 1 as the phone lays itself down for the closing screen.
  const end = to === n ? t * t * (3 - 2 * t) : 0;
  return { from, to, t, index, end };
}
