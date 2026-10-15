type Props = { size?: number; className?: string };

/** Two avatars — each tagged as a data-part so a loop can orbit them. */
export function TeamIcon({ size = 24, className }: Props) {
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
      <g data-part="a">
        <circle cx="12" cy="8.5" r="3" />
        <path d="M6.5 19c.8-3 3-4.5 5.5-4.5s4.7 1.5 5.5 4.5" />
      </g>
      <g data-part="b">
        <circle cx="12" cy="8.5" r="3" />
        <path d="M6.5 19c.8-3 3-4.5 5.5-4.5s4.7 1.5 5.5 4.5" />
      </g>
    </svg>
  );
}
