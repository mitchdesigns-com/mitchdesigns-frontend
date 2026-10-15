/**
 * Hover label roll (the nav menu's style): the text slides up out of view as
 * an identical copy slides in from below. Needs a `group` ancestor.
 * `line` is the line height (em) — raise it for text with descenders
 * (g, y, p) so they aren't clipped; the menu's capitals use 1.
 */
export function SlideLabel({ label, line = 1 }: { label: string; line?: number }) {
  return (
    <span className="relative inline-block overflow-hidden align-bottom" style={{ height: `${line}em`, lineHeight: line }}>
      <span className="flex flex-col transition-transform duration-350 ease-out-soft group-hover:-translate-y-1/2">
        <span className="block">{label}</span>
        <span className="block" aria-hidden>
          {label}
        </span>
      </span>
    </span>
  );
}
