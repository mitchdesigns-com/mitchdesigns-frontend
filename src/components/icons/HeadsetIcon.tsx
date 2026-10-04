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
      <circle cx="11" cy="8" r="3.5" />
      <path d="M4 20c0-3.9 3.1-7 7-7 1.4 0 2.7.4 3.8 1.1" />
      <path d="M6.5 8a4.5 4.5 0 0 1 9 0v1.5" />
      <path d="M15.5 9.5a2 2 0 0 1-2 2H12" />
      <g data-part="badge">
        <circle cx="18" cy="17.5" r="3.5" />
        <path d="m16.4 17.6 1.1 1.1 2.1-2.3" />
      </g>
    </svg>
  );
}
