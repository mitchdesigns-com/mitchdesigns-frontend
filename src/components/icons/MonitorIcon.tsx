type Props = { size?: number; className?: string };

export function MonitorIcon({ size = 24, className }: Props) {
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
      <rect x="2.5" y="3.5" width="19" height="13" rx="2" />
      <path d="M12 16.5V20M8 20.5h8" />
      <path data-part="bar1" d="M8 13.5v-3" />
      <path data-part="bar2" d="M12 13.5v-6" />
      <path data-part="bar3" d="M16 13.5v-4" />
    </svg>
  );
}
