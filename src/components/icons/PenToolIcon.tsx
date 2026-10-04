type Props = { size?: number; className?: string };

export function PenToolIcon({ size = 24, className }: Props) {
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
      <g data-part="pen">
        <path d="m12 19 7-7 3 3-7 7-3-3Z" />
        <path d="m18 13-1.5-7.5L2 2l3.5 14.5L13 18l5-5Z" />
        <path d="m2 2 7.59 7.59" />
        <circle cx="11" cy="11" r="2" />
      </g>
    </svg>
  );
}
