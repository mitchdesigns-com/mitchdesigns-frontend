type Props = { size?: number; className?: string };

export function LifeBuoyIcon({ size = 24, className }: Props) {
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
      <g data-part="ring">
        <circle cx="12" cy="12" r="9" />
        <circle cx="12" cy="12" r="4" />
        <path d="m5.64 5.64 3.53 3.53M14.83 14.83l3.53 3.53M14.83 9.17l3.53-3.53M9.17 14.83l-3.53 3.53" />
      </g>
    </svg>
  );
}
