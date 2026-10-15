type Props = { size?: number; className?: string };

export function GlobeIcon({ size = 24, className }: Props) {
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
      <path d="M3 12h18" />
      <path d="M4.5 7.5h15M4.5 16.5h15" opacity="0.5" />
      <ellipse data-part="meridian" cx="12" cy="12" rx="4" ry="9" />
    </svg>
  );
}
