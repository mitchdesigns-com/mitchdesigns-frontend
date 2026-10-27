"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Media } from "@/components/ui/Media";
import { ChevronLeft } from "@/components/icons/ChevronLeft";
import { ChevronRight } from "@/components/icons/ChevronRight";
import { easeOutSoft } from "@/lib/motion";

export type SwitcherProject = {
  slug: string;
  title: string;
  image: { src: string; mime?: string | null; alt: string } | null;
};

type Props = { prev: SwitcherProject; next: SwitcherProject };

/**
 * Small pill pinned to the bottom centre of a case study: chevrons to the
 * previous / next project, each showing a thumbnail + name above the pill
 * while hovered or focused. It slips away once the Related Projects section
 * (or, without one, the footer) scrolls into view.
 */
export function ProjectSwitcher({ prev, next }: Props) {
  const [peek, setPeek] = useState<"prev" | "next" | null>(null);
  const reduced = useReducedMotion();
  const shown = peek === "prev" ? prev : peek === "next" ? next : null;

  // Hidden while the stop section is on screen or already scrolled past.
  const [away, setAway] = useState(false);
  useEffect(() => {
    const stop = document.querySelector("[data-switcher-stop]") ?? document.querySelector("footer");
    if (!stop) return;
    const check = () => {
      const gone = stop.getBoundingClientRect().top < window.innerHeight;
      setAway(gone);
      if (gone) setPeek(null);
    };
    check();
    window.addEventListener("scroll", check, { passive: true });
    window.addEventListener("resize", check);
    return () => {
      window.removeEventListener("scroll", check);
      window.removeEventListener("resize", check);
    };
  }, []);

  const arrow = (dir: "prev" | "next", project: SwitcherProject) => (
    <Link
      href={`/case-studies/${project.slug}`}
      aria-label={`${dir === "prev" ? "Previous" : "Next"} project: ${project.title}`}
      onMouseEnter={() => setPeek(dir)}
      onFocus={() => setPeek(dir)}
      onBlur={() => setPeek(null)}
      className="flex size-11 items-center justify-center rounded-pill text-white transition-colors hover:bg-white/10 focus-visible:bg-white/10 focus-visible:outline-none"
    >
      {dir === "prev" ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
    </Link>
  );

  return (
    <nav
      aria-label="More projects"
      className="fixed inset-x-0 bottom-6 z-40 flex justify-center pointer-events-none"
    >
      <motion.div
        className={`relative ${away ? "pointer-events-none" : "pointer-events-auto"}`}
        onMouseLeave={() => setPeek(null)}
        initial={false}
        animate={away ? { opacity: 0, y: reduced ? 0 : 16 } : { opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: easeOutSoft }}
        inert={away}
      >
        <AnimatePresence>
          {shown && (
            <motion.div
              key={peek}
              initial={reduced ? { opacity: 0 } : { opacity: 0, y: 8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={reduced ? { opacity: 0 } : { opacity: 0, y: 8, scale: 0.96 }}
              transition={{ duration: 0.25, ease: easeOutSoft }}
              className={`absolute bottom-full mb-3 w-60 overflow-hidden rounded-card-sm border border-white/10 bg-black/80 p-2 backdrop-blur-md ${
                peek === "prev" ? "right-1/2 origin-bottom-right" : "left-1/2 origin-bottom-left"
              }`}
              aria-hidden
            >
              <div className="relative w-full aspect-case-cover overflow-hidden rounded-xs bg-space-grey">
                {shown.image && (
                  <Media src={shown.image.src} mime={shown.image.mime} alt="" className="object-cover" sizes="240px" />
                )}
              </div>
              <p className="px-1 pt-2 text-xs uppercase tracking-1 text-fg-muted text-balance">
                {peek === "prev" ? "Previous" : "Next"}
              </p>
              <p className="px-1 pb-1 text-sm font-medium text-white text-balance">{shown.title}</p>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex items-center gap-1 rounded-pill border border-white/10 bg-black/80 p-1 backdrop-blur-md">
          {arrow("prev", prev)}
          <span className="h-5 w-px bg-white/15" aria-hidden />
          {arrow("next", next)}
        </div>
      </motion.div>
    </nav>
  );
}
