type Props = { size?: number; className?: string };

export function TabletIcon({ size = 24, className }: Props) {
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
      <g data-part="device">
        <rect x="5.5" y="2.5" width="13" height="19" rx="2" />
        <path d="M11 18.5h2" />
      </g>
    </svg>
  );
}
