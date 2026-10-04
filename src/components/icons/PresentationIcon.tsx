type Props = { size?: number; className?: string };

export function PresentationIcon({ size = 24, className }: Props) {
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
      <rect x="3" y="3.5" width="18" height="12" rx="1.5" />
      <path d="M12 15.5v3.5M8.5 21l3.5-2 3.5 2" />
      <path data-part="chart" d="m6.5 12 3-3 2.5 2 5-4.5" />
    </svg>
  );
}
