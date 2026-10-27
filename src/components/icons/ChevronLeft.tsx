type Props = { size?: number; className?: string };

export function ChevronLeft({ size = 18, className }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 18 18"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className={className}
    >
      <path d="M11.25 4.5 6.75 9l4.5 4.5" />
    </svg>
  );
}
