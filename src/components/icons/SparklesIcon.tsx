type Props = { size?: number; className?: string };

export function SparklesIcon({ size = 24, className }: Props) {
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
      <path data-part="s0" d="M11 3.5c.6 3.6 2.4 5.4 6 6-3.6.6-5.4 2.4-6 6-.6-3.6-2.4-5.4-6-6 3.6-.6 5.4-2.4 6-6Z" />
      <path data-part="s1" d="M18.5 14.5c.3 1.6 1 2.3 2.5 2.5-1.5.2-2.2.9-2.5 2.5-.3-1.6-1-2.3-2.5-2.5 1.5-.2 2.2-.9 2.5-2.5Z" />
      <path data-part="s2" d="M5.5 15.5c.25 1.3.8 1.85 2 2-1.2.15-1.75.7-2 2-.25-1.3-.8-1.85-2-2 1.2-.15 1.75-.7 2-2Z" />
    </svg>
  );
}
