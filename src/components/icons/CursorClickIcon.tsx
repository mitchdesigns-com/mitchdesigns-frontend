type Props = { size?: number; className?: string };

export function CursorClickIcon({ size = 24, className }: Props) {
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
      <circle data-part="ripple" cx="9" cy="9" r="3.5" />
      <path data-part="cursor" d="m9 9 10.5 4.2-4.3 1.8-1.9 4.3L9 9Z" />
    </svg>
  );
}
