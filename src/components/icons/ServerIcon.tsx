type Props = { size?: number; className?: string };

export function ServerIcon({ size = 24, className }: Props) {
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
      <rect x="3" y="4" width="18" height="7" rx="2" />
      <rect x="3" y="13" width="18" height="7" rx="2" />
      <path d="M11 7.5h6M11 16.5h6" />
      <circle data-part="led1" cx="7" cy="7.5" r="1" fill="currentColor" />
      <circle data-part="led2" cx="7" cy="16.5" r="1" fill="currentColor" />
    </svg>
  );
}
