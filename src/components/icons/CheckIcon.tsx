type Props = { size?: number; className?: string };

/** A plain tick, for check lists. */
export function CheckIcon({ size = 24, className }: Props) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden className={className}>
      <path d="M4.5 12.5l5 5 10-11" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
