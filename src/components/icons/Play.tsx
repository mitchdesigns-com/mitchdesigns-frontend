type Props = { size?: number; className?: string };

export function Play({ size = 24, className }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinejoin="round"
      aria-hidden
      className={className}
    >
      <path d="M18.89 12.85c-.35 1.34-2.02 2.29-5.36 4.19-3.23 1.83-4.85 2.75-6.15 2.38a3.2 3.2 0 0 1-1.42-.84C5 17.61 5 15.74 5 12s0-5.61.96-6.58c.4-.4.89-.69 1.42-.84 1.3-.37 2.92.55 6.15 2.38 3.34 1.9 5.01 2.85 5.36 4.19.15.56.15 1.14 0 1.7Z" />
    </svg>
  );
}
