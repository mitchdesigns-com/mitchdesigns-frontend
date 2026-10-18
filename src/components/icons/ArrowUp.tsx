type Props = { size?: number; className?: string };

export function ArrowUp({ size = 20, className }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className={className}
    >
      <path d="M10 15.833V4.167M4.167 10 10 4.167 15.833 10" />
    </svg>
  );
}
