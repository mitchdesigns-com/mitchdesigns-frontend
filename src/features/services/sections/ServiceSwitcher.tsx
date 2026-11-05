import Link from "next/link";
import { cn } from "@/lib/cn";

export interface ServiceSwitcherItem {
  slug: string;
  label: string;
  href: string;
}

/**
 * Pill row at the top of a service page hero for jumping straight to another
 * service without opening the main menu. Wraps to a second row when narrow.
 */
export function ServiceSwitcher({
  items,
  current,
}: {
  items: ServiceSwitcherItem[];
  current: string;
}) {
  return (
    <nav aria-label="Services">
      <ul className="flex flex-wrap gap-1">
        {items.map((s) => {
          const active = s.slug === current;
          return (
            <li key={s.slug}>
              <Link
                href={s.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "inline-flex whitespace-nowrap rounded-pill border px-3 py-2 text-sm font-medium transition-colors duration-200",
                  active
                    ? "border-yellow bg-yellow text-black"
                    : "border-white/15 text-fg-muted hover:border-white/40 hover:text-white",
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
