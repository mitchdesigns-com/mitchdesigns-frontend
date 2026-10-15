type Props = { size?: number; className?: string };

export function CodeIcon({ size = 24, className }: Props) {
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
      <path data-part="l" d="M8 7 3 12l5 5" />
      <path data-part="r" d="m16 7 5 5-5 5" />
      <path data-part="slash" d="m13.5 5-3 14" />
    </svg>
  );
}
