type Props = { size?: number; className?: string };

/** "→" drawn from 2×2 pixels on a 5×5 grid. */
const PIXELS: Array<[col: number, row: number]> = [
  [2, 0],
  [3, 1],
  [0, 2],
  [1, 2],
  [2, 2],
  [3, 2],
  [4, 2],
  [3, 3],
  [2, 4],
];

export function PixelArrowIcon({ size = 20, className }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 10 10"
      fill="currentColor"
      shapeRendering="crispEdges"
      aria-hidden
      className={className}
    >
      {PIXELS.map(([col, row]) => (
        <rect key={`${col}-${row}`} x={col * 2} y={row * 2} width="2" height="2" />
      ))}
    </svg>
  );
}
