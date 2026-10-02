type Props = { size?: number; className?: string };

/** Figma "cancel-01" — 1.5px stroke cross on a 24px grid. */
export function Cancel({ size = 24, className }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className={className}
    >
      <path d="M19 5L5 19M5 5l14 14" />
    </svg>
  );
}
