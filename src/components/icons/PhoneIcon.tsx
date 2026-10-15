type Props = { size?: number; className?: string };

export function PhoneIcon({ size = 24, className }: Props) {
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
      <rect x="6.5" y="2.5" width="11" height="19" rx="2.5" />
      <path d="M10.5 5h3" />
      <path data-part="feed" d="M9.5 10h5M9.5 13h5M9.5 16h3" />
      <g data-part="badge">
        <circle cx="17.5" cy="5.5" r="3" fill="currentColor" />
      </g>
    </svg>
  );
}
