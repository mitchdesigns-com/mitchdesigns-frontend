import Link from "next/link";

/**
 * Floating switch on the classic homepage that links to the cinematic
 * V2 experience. Server component — pure markup.
 */
export function V2FloatButton() {
  return (
    <Link
      href="/v2"
      className="fixed bottom-6 right-6 z-50 inline-flex h-12 items-center gap-2 rounded-full bg-yellow px-5 font-medium text-black shadow-lg transition-transform duration-200 hover:-translate-y-0.5"
    >
      <span aria-hidden className="animate-pulse">✦</span>
      Try the V2 experience
    </Link>
  );
}
