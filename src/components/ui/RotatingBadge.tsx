import { Logo } from "@/components/icons/Logo";
import { cn } from "@/lib/cn";

/**
 * Round yellow badge: a line of text running around the rim, slowly turning,
 * with the Mitch mark still in the middle.
 */
export function RotatingBadge({ text, className }: { text: string; className?: string }) {
  return (
    <div className={cn("relative grid aspect-square place-items-center rounded-full bg-yellow text-black", className)}>
      <svg
        viewBox="0 0 100 100"
        aria-hidden
        className="absolute inset-0 size-full animate-spin-slow motion-reduce:animate-none"
      >
        <defs>
          <path id="rotating-badge-rim" d="M50 50m-37 0a37 37 0 1 1 74 0a37 37 0 1 1-74 0" />
        </defs>
        <text fontSize="8.5" className="fill-current font-bold uppercase">
          <textPath href="#rotating-badge-rim" textLength="232" lengthAdjust="spacing">
            {/* SVG collapses edge whitespace, which glued the last "•" to the
                first word where the loop closes. Non breaking spaces keep it. */}
            {text.replace(/ /g, "\u00A0")}
          </textPath>
        </text>
      </svg>
      <span className="sr-only">{text}</span>
      <Logo className="size-1/3" />
    </div>
  );
}
