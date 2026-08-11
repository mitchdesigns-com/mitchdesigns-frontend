"use client";

import { useEffect, useState } from "react";
import type { OrderbasePageData } from "@/lib/cms/types";
import { OrderbaseWordmark } from "../_lib/OrderbaseWordmark";
import { Container, Btn } from "./ui";

export function OrderbaseNav({
  nav,
}: {
  nav: NonNullable<OrderbasePageData["nav"]>;
}) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed inset-x-0 top-0 z-[100] transition-all duration-300 ${
        scrolled
          ? "bg-white/[0.86] py-[11px] shadow-[0_1px_0_var(--color-ob-line)] backdrop-blur-[14px]"
          : "py-[18px]"
      }`}
    >
      <Container className="flex items-center justify-between gap-6">
        <a
          href="#top"
          aria-label="Orderbase"
          className={scrolled ? "text-ob-ink" : "text-white"}
        >
          <OrderbaseWordmark className="ob-logo inline-flex h-[20px] items-center sm:h-[34px]" />
        </a>

        {/* desktop links */}
        <div className="hidden items-center gap-[30px] lg:flex">
          {nav.links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className={`group relative text-[0.93rem] font-semibold transition-colors ${
                scrolled ? "text-ob-ink" : "text-[#f4f4f5]"
              }`}
            >
              {l.label}
              <span className="absolute -bottom-[5px] left-0 h-[2px] w-0 bg-ob-red transition-all duration-200 group-hover:w-full" />
            </a>
          ))}
        </div>

        <div className="flex items-center gap-3">
          {nav.ctaLabel && (
            <Btn
              variant="red"
              href={nav.ctaHref ?? "#contact"}
              target={nav.ctaHref?.startsWith("http") ? "_blank" : undefined}
              rel="noopener"
              className="max-lg:px-4"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="size-[1.05em]" aria-hidden="true">
                <path d="M17.5 14.4c-.3-.2-1.7-.8-2-.9-.3-.1-.5-.2-.7.2-.2.3-.7.9-.9 1.1-.2.2-.3.2-.6.1-1.7-.9-2.9-1.6-4-3.6-.3-.5.3-.5.8-1.5.1-.2 0-.4 0-.5 0-.2-.7-1.6-.9-2.2-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1.1 2.9 1.2 3.1c.2.2 2.2 3.3 5.3 4.6 2 .8 2.7.9 3.7.8.6-.1 1.7-.7 2-1.4.2-.7.2-1.2.2-1.4-.1-.1-.3-.2-.6-.3M12 2a10 10 0 0 0-8.6 15l-1.1 4.1 4.2-1.1A10 10 0 1 0 12 2" />
              </svg>
              <span className="max-sm:hidden">{nav.ctaLabel}</span>
            </Btn>
          )}
          <button
            type="button"
            aria-label="Menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="flex flex-col gap-[5px] p-2 lg:hidden"
          >
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className={`h-[2px] w-6 rounded-full transition-colors ${
                  scrolled || open ? "bg-ob-ink" : "bg-white"
                }`}
              />
            ))}
          </button>
        </div>
      </Container>

      {/* mobile menu */}
      {open && (
        <div className="absolute right-[4vw] top-16 flex flex-col gap-[18px] rounded-[18px] bg-white p-6 shadow-ob lg:hidden">
          {nav.links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="font-semibold text-ob-ink"
            >
              {l.label}
            </a>
          ))}
        </div>
      )}
    </nav>
  );
}
