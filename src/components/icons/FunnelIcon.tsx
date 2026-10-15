type Props = { size?: number; className?: string };

export function FunnelIcon({ size = 24, className }: Props) {
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
      <path d="M3.5 4h17l-6.5 8v5.5l-4 2.5v-8L3.5 4Z" />
      <circle data-part="drop1" cx="12" cy="1.8" r="0.9" fill="currentColor" stroke="none" />
      <circle data-part="drop2" cx="9" cy="1.8" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  );
}
