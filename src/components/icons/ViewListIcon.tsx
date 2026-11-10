type Props = { size?: number; className?: string };

/** Rows view: two wide bars, each with an image block on the right. */
export function ViewListIcon({ size = 24, className }: Props) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden className={className}>
      <rect x="3" y="4" width="18" height="7" rx="1" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <rect x="3" y="13" width="18" height="7" rx="1" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path d="M11 4v7M11 13v7" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}
