type Props = { size?: number; className?: string };

export function ChatIcon({ size = 24, className }: Props) {
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
        <path d="M4 4h10a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2H8.5L5.5 16v-3H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z" />
        <path d="M5.5 7.5h7M5.5 10h4" />
      </g>
      <path data-part="b" d="M18.5 9H20a2 2 0 0 1 2 2v4.5a2 2 0 0 1-2 2h-1V20l-3-2.5h-3.5a2 2 0 0 1-2-2V15" />
    </svg>
  );
}
