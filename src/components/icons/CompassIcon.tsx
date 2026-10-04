type Props = { size?: number; className?: string };

export function CompassIcon({ size = 24, className }: Props) {
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
      <circle cx="12" cy="12" r="9" />
      <path data-part="needle" d="m15.5 8.5-2 5-5 2 2-5 5-2Z" />
    </svg>
  );
}
