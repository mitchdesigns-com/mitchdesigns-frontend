"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/cn";
import { ArrowRight } from "@/components/icons/ArrowRight";
import { NAV_LINKS, SERVICES, serviceHref } from "@/config/nav";

const EASE = [0.22, 1, 0.36, 1] as const;

function SlideLabel({ label }: { label: string }) {
  return (
    <span
      className="relative inline-block overflow-hidden leading-none"
      style={{ height: "1em" }}
    >
      <span className="flex flex-col transition-transform duration-350 ease-out-soft group-hover:-translate-y-1/2">
        <span className="block">{label}</span>
        <span className="block" aria-hidden>
          {label}
        </span>
      </span>
    </span>
  );
}

/**
 * The full-screen yellow menu body — primary nav on the left, with the
 * "Our Services" item expanding into a two-column split: the other nav items
 * dim to 40% while the service list slides in on the right. Shared verbatim by
 * `Header` and `HeaderMinimal`; `onNavigate` closes the overlay on selection.
 */
export function FullScreenMenuNav({ onNavigate }: { onNavigate: () => void }) {
  const [showServices, setShowServices] = useState(false);

  return (
    <nav className="flex flex-1 flex-col justify-center pb-16">
      <div className="container-page flex flex-col md:flex-row md:items-center md:gap-8">
        {/* Left — primary nav */}
        <ul
          className={cn(
            "flex w-full flex-col transition-[width] duration-500 ease-out-soft",
            showServices ? "md:w-1/2" : "md:w-full",
          )}
        >
          {NAV_LINKS.map((item, i) => {
            const isServices = item.href === null;
            const dimmed = showServices && !isServices;
            return (
              <motion.li
                key={item.label}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.05 + i * 0.04, ease: EASE }}
              >
                {item.href ? (
                  <Link
                    href={item.href}
                    onClick={onNavigate}
                    className={cn(
                      "group relative flex w-full overflow-hidden transition-opacity duration-300 ease-out-soft",
                      dimmed && "opacity-40 hover:opacity-100",
                    )}
                  >
                    <span
                      aria-hidden
                      className={cn(
                        "absolute inset-y-0 origin-center scale-x-0 bg-white transition-transform duration-300 ease-out group-hover:scale-x-100",
                        showServices ? "inset-x-0" : "bleed-x",
                      )}
                    />
                    <div className="relative flex items-center py-2">
                      <span className="text-display font-light uppercase leading-none tracking-[-0.01em] text-black">
                        <SlideLabel label={item.label} />
                      </span>
                    </div>
                  </Link>
                ) : (
                  <button
                    type="button"
                    aria-expanded={showServices}
                    onClick={() => setShowServices((v) => !v)}
                    className="group relative flex w-full overflow-hidden text-left"
                  >
                    <span
                      aria-hidden
                      className={cn(
                        "absolute inset-y-0 origin-center scale-x-0 bg-white transition-transform duration-300 ease-out group-hover:scale-x-100",
                        showServices ? "inset-x-0" : "bleed-x",
                      )}
                    />
                    <div className="relative flex items-center gap-4 py-2">
                      <span className="text-display font-light uppercase leading-none tracking-[-0.01em] text-black">
                        <SlideLabel label={item.label} />
                      </span>
                      <motion.span
                        animate={{ x: showServices ? 8 : 0 }}
                        transition={{ duration: 0.3, ease: EASE }}
                        className="shrink-0 text-black"
                      >
                        <ArrowRight size={40} />
                      </motion.span>
                    </div>
                  </button>
                )}
              </motion.li>
            );
          })}
        </ul>

        {/* Right — services submenu, revealed when "Our Services" is active */}
        <AnimatePresence>
          {showServices && (
            <motion.ul
              key="services-panel"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 40 }}
              transition={{ duration: 0.4, ease: EASE }}
              className="flex w-full flex-col justify-center gap-1 pt-8 md:w-1/2 md:pl-16 md:pt-0"
            >
              {SERVICES.map((s, i) => (
                <motion.li
                  key={s.slug}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.35,
                    delay: 0.1 + i * 0.05,
                    ease: EASE,
                  }}
                >
                  <Link
                    href={serviceHref(s.slug)}
                    onClick={onNavigate}
                    className="group relative inline-flex items-center py-2"
                  >
                    <span
                      aria-hidden
                      className="absolute right-full mr-5 hidden h-0.5 w-11 origin-right scale-x-0 bg-black transition-transform duration-300 ease-out-soft group-hover:scale-x-100 md:block"
                    />
                    <span className="text-hero-5 font-light leading-tight text-black md:text-card-title">
                      {s.title}
                    </span>
                  </Link>
                </motion.li>
              ))}
            </motion.ul>
          )}
        </AnimatePresence>
      </div>

      {/* Mobile-only quote CTA (inline header CTA is hidden on small screens) */}
      <div className="container-page mt-10 sm:hidden">
        <Link
          href="/quote"
          onClick={onNavigate}
          className="inline-flex whitespace-nowrap rounded-pill bg-black px-6 py-3 text-sm font-semibold text-yellow"
        >
          Get Detailed Proposal
        </Link>
      </div>
    </nav>
  );
}
