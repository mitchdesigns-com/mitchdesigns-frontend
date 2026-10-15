type Props = { size?: number; className?: string };

/** Arrow pointer — white fill, dark outline, tip at the top-left corner. */
export function CursorIcon({ size = 24, className }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      className={className}
    >
      <path
        d="M2 2l7.2 19.2 2.9-8.1 8.1-2.9L2 2z"
        fill="white"
        stroke="#07020d"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}
