import Link from "next/link";
import { cn } from "@/lib/cn";

export interface ServiceSwitcherItem {
  slug: string;
  label: string;
  href: string;
}

/**
 * Pill row at the top of a service page hero for jumping straight to another
 * service without opening the main menu.
 */
export function ServiceSwitcher({
  items,
  current,
}: {
  items: ServiceSwitcherItem[];
  current: string;
}) {
  return (
    // Phones: one row that scrolls sideways out to the screen edge.
    // md+: wraps inside the hero's copy column.
    <nav
      aria-label="Services"
      className="-mx-(--container-padding) overflow-x-auto px-(--container-padding) scrollbar-none md:mx-0 md:overflow-visible md:px-0"
    >
      {/* No `w-max` here: in this theme it resolves to --container-max (1920px). */}
      <ul className="flex gap-1 md:flex-wrap">
        {items.map((s) => {
          const active = s.slug === current;
          return (
            <li key={s.slug} className="shrink-0">
              <Link
                href={s.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "inline-flex whitespace-nowrap rounded-pill border-2 px-3 py-1.5 text-sm font-medium transition-colors duration-200",
                  active
                    ? "border-yellow bg-yellow text-black"
                    : "border-white/15 text-fg-muted hover:border-white hover:text-white",
                )}
              >
                {s.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
