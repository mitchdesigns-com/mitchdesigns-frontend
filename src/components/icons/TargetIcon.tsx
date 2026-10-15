type Props = { size?: number; className?: string };

export function TargetIcon({ size = 24, className }: Props) {
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
      <circle cx="11" cy="13" r="8" />
      <circle cx="11" cy="13" r="4.5" />
      <circle cx="11" cy="13" r="1" fill="currentColor" />
      <g data-part="arrow">
        <path d="m11 13 9.5-9.5" />
        <path d="M17.5 3.5h3v3" />
      </g>
    </svg>
  );
}
