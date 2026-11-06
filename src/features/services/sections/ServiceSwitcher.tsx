"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/cn";
import { easeOutSoft } from "@/lib/motion";

export interface ServiceSwitcherItem {
  slug: string;
  label: string;
  href: string;
}

/**
 * Pill row at the top of a service page hero for jumping straight to another
 * service without opening the main menu. Once the hero's row scrolls away, the
 * same pills float at the top of the screen (a dark bar), so visitors can
 * switch service at any point on the page.
 */
export function ServiceSwitcher({
  items,
  current,
}: {
  items: ServiceSwitcherItem[];
  current: string;
}) {
  const ref = useRef<HTMLElement>(null);
  const [floating, setFloating] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // Float only once the hero row has gone off the top (not while it is below).
    const io = new IntersectionObserver(([e]) => setFloating(!e.isIntersecting && e.boundingClientRect.top < 0));
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <>
      {/* Phones: one row that scrolls sideways out to the screen edge.
          md+: wraps inside the hero's copy column. */}
      <nav
        ref={ref}
        aria-label="Services"
        className="-mx-(--container-padding) overflow-x-auto px-(--container-padding) scrollbar-none md:mx-0 md:overflow-visible md:px-0"
      >
        {/* No `w-max` here: in this theme it resolves to --container-max (1920px). */}
        <Pills items={items} current={current} className="md:flex-wrap" />
      </nav>

      {/* Floating copy while the page scrolls (below the menu overlay). */}
      <AnimatePresence>
        {floating && (
          <motion.nav
            aria-label="Switch service"
            className="pointer-events-none fixed inset-x-0 top-8 z-40 flex px-4 pr-24 md:justify-center md:px-28"
            initial={{ y: -80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -80, opacity: 0 }}
            transition={{ duration: 0.4, ease: easeOutSoft }}
          >
            <div
              // Phones: start the row scrolled to the current service.
              ref={(el) => {
                const on = el?.querySelector<HTMLElement>("[aria-current=page]");
                if (el && on) el.scrollLeft = on.offsetLeft - 8;
              }}
              className="pointer-events-auto max-w-full overflow-x-auto rounded-pill bg-black/85 p-1 shadow-soft-lg backdrop-blur-md scrollbar-none"
            >
              <Pills items={items} current={current} floating />
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </>
  );
}

function Pills({
  items,
  current,
  floating = false,
  className,
}: {
  items: ServiceSwitcherItem[];
  current: string;
  floating?: boolean;
  className?: string;
}) {
  return (
    <ul className={cn("flex gap-1", className)}>
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
                  : floating
                    ? "border-transparent text-white hover:border-white"
                    : "border-white/15 text-fg-muted hover:border-white hover:text-white",
              )}
            >
              {s.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
