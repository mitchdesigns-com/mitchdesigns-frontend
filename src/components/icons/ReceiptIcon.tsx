type Props = { size?: number; className?: string };

export function ReceiptIcon({ size = 24, className }: Props) {
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
      <path d="M5.5 3h13v18l-2.2-1.5L14.2 21 12 19.5 9.8 21l-2.1-1.5L5.5 21V3Z" />
      <path data-part="lines" d="M8.5 7.5h7M8.5 11h7M8.5 14.5h4" />
    </svg>
  );
}
