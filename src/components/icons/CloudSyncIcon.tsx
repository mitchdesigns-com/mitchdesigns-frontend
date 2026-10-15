type Props = { size?: number; className?: string };

export function CloudSyncIcon({ size = 24, className }: Props) {
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
      <path d="M7 18.5a4.5 4.5 0 0 1-.9-8.9 6 6 0 0 1 11.6 1.4A3.75 3.75 0 0 1 17.25 18.5" />
      <g data-part="sync">
        <path d="M9.5 15.5a2.5 2.5 0 0 1 4.3-1.7l.7.7" />
        <path d="M14.5 12.8v1.7h-1.7" />
        <path d="M14.5 18a2.5 2.5 0 0 1-4.3 1.7l-.7-.7" />
        <path d="M9.5 20.7V19h1.7" />
      </g>
    </svg>
  );
}
