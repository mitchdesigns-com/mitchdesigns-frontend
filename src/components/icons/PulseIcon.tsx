type Props = { size?: number; className?: string };

export function PulseIcon({ size = 24, className }: Props) {
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
      <path data-part="pulse" d="M2 12h4l2.5-6 4 12 2.5-6H22" />
    </svg>
  );
}
