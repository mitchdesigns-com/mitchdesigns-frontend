type Props = { size?: number; className?: string };

export function BoxIcon({ size = 24, className }: Props) {
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
      <path d="M4.5 9.5v9a1.5 1.5 0 0 0 1.5 1.5h12a1.5 1.5 0 0 0 1.5-1.5v-9" />
      <path d="M10 13.5h4" />
      <g data-part="lid">
        <rect x="3" y="5.5" width="18" height="4" rx="1" />
      </g>
    </svg>
  );
}
