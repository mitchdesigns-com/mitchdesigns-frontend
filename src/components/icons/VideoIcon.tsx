type Props = { size?: number; className?: string };

export function VideoIcon({ size = 24, className }: Props) {
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
      <rect x="3" y="6" width="13" height="12" rx="2" />
      <path d="m22 8-6 4 6 4V8Z" />
    </svg>
  );
}
