type Props = { size?: number; className?: string };

export function LockIcon({ size = 24, className }: Props) {
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
      <rect x="4.5" y="10.5" width="15" height="10" rx="2" />
      <path d="M12 14.5v2.5" />
      <path data-part="shackle" d="M8 10.5V7.5a4 4 0 0 1 8 0v3" />
    </svg>
  );
}
