type Props = { size?: number; className?: string };

export function SearchIcon({ size = 24, className }: Props) {
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
      <g data-part="lens">
        <circle cx="10.5" cy="10.5" r="6" />
        <path d="m15 15 5.5 5.5" />
        <path d="M8 8.5a3 3 0 0 1 2.5-1.5" />
      </g>
    </svg>
  );
}
