/** `size` in px, or a CSS length such as "0.8em" to follow the text size. */
type Props = { size?: number | string; className?: string };

/** Calendar with a tick: booking a meeting. */
export function CalendarCheckIcon({ size = 24, className }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className={className}
    >
      <rect x="3" y="4.5" width="18" height="16.5" rx="3" />
      <path d="M8 2.5v4M16 2.5v4M3 9.5h18" />
      <path d="m9 15 2 2 4-4" />
    </svg>
  );
}
