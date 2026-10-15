type Props = { size?: number; className?: string };

export function ProductGridIcon({ size = 24, className }: Props) {
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
      <rect data-part="c1" x="3.5" y="3.5" width="7" height="7" rx="1.5" />
      <rect data-part="c2" x="13.5" y="3.5" width="7" height="7" rx="1.5" />
      <rect data-part="c3" x="3.5" y="13.5" width="7" height="7" rx="1.5" />
      <rect data-part="c4" x="13.5" y="13.5" width="7" height="7" rx="1.5" />
    </svg>
  );
}
