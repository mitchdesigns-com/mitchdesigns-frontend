type Props = { size?: number; className?: string };

export function TrendLineIcon({ size = 24, className }: Props) {
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
      <path d="M3 3v18h18" />
      <path data-part="line" d="m6.5 15.5 4-4 3 3 6-6.5" />
      <path data-part="tip" d="M16 8h3.5v3.5" />
    </svg>
  );
}
