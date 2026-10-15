type Props = { size?: number; className?: string };

export function SplitTestIcon({ size = 24, className }: Props) {
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
      <g data-part="a">
        <rect x="2.5" y="6" width="9" height="12" rx="1.5" />
        <path d="m5 15 2-5.5 2 5.5M5.7 13h2.6" />
      </g>
      <g data-part="b">
        <rect x="12.5" y="6" width="9" height="12" rx="1.5" />
        <path d="M15.5 9.5h2.2a1.3 1.3 0 0 1 0 2.6h-2.2V9.5Zm0 2.6h2.5a1.4 1.4 0 0 1 0 2.9h-2.5v-2.9Z" />
      </g>
    </svg>
  );
}
