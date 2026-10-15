type Props = { size?: number; className?: string };

export function BellRingIcon({ size = 24, className }: Props) {
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
      <g data-part="bell">
        <path d="M18 9.5a6 6 0 0 0-12 0c0 6.5-2.5 8-2.5 8h17S18 16 18 9.5Z" />
        <path d="M13.7 20.5a2 2 0 0 1-3.4 0" />
      </g>
      <path data-part="wave" d="M20.5 4.5a8 8 0 0 1 1.5 4M3.5 4.5a8 8 0 0 0-1.5 4" />
    </svg>
  );
}
