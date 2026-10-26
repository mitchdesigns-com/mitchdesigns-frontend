type Props = { size?: number; className?: string };

export function HeadsetIcon({ size = 24, className }: Props) {
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
      {/* A person with a check badge; the shoulders stop short of the badge
          so the two never touch, even while it pulses. */}
      <circle cx="11" cy="7.5" r="3.5" />
      <path d="M4 20c0-3.9 3.1-7 7-7 1 0 1.9.2 2.8.55" />
      <g data-part="badge">
        <circle cx="18" cy="17.5" r="3.5" />
        <path d="m16.4 17.6 1.1 1.1 2.1-2.3" />
      </g>
    </svg>
  );
}
