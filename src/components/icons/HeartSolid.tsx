type Props = { size?: number; className?: string };

/** Filled heart traced from the outline heart on Sally Helmy's product card
 *  (rounder lobes, soft point), so the favourite fills exactly over it. */
export function HeartSolid({ size = 24, className }: Props) {
  return (
    <svg
      width={size}
      height={(size * 29.4) / 33}
      viewBox="0 0 33 29.4"
      fill="currentColor"
      aria-hidden
      className={className}
    >
      <path d="M16.5 2.3C18.7.4 21.2-.1 23.6.1 29 .6 33 4.6 33 10c0 3.8-2 7-4.6 9.9l-10.2 8.2q-1.7 1.3-3.4 0L4.6 19.9C2 17 0 13.8 0 10 0 4.6 4 .6 9.4.1c2.4-.2 4.9.3 7.1 2.2Z" />
    </svg>
  );
}
