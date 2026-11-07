"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Section } from "@/components/layout/Section";
import { Reveal } from "@/components/motion";
import { RichText } from "@/components/ui/RichText";
import type { FeaturesSimplifiedProps } from "@/lib/cms/types";
import { cn } from "@/lib/cn";
import { armTickFeedback, buzz, tick } from "@/lib/tickFeedback";
import { noOrphan } from "@/lib/noOrphan";

gsap.registerPlugin(useGSAP);

const labelColors: Record<string, string> = {
  New: "bg-accent text-accent-fg",
  Popular: "bg-fg text-bg",
  Trending: "bg-fg-muted/20 text-fg",
};
/** The same badges on the open (dark) row, kept readable. */
const labelColorsOnDark: Record<string, string> = {
  New: "bg-accent text-accent-fg",
  Popular: "bg-accent text-accent-fg",
  Trending: "bg-bg/15 text-bg",
};

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * "Every feature" list. Desktop: a screen-tall section the page scrolls past
 * freely; the list is its own scroll box (wheel over it to move through the
 * features), with the row in its middle lit and a rolling counter and progress
 * bar following it. Rows are clickable to jump straight to one. Each step ticks
 * (once the visitor has interacted with the page). Phones get the full list
 * with the row crossing mid-screen lit up, ticking and buzzing (Android) as it
 * changes. Reduced motion: the plain list, silent.
 */
export function FeaturesSimplified({
  title,
  description,
  featureCards,
  pageScroll = false,
}: FeaturesSimplifiedProps & {
  /**
   * Desktop without the scroll box: the whole list shows and the page scrolls
   * it, the heading and counter stay in view beside it, and the row crossing
   * the middle of the screen lights up. For short lists (work steps).
   */
  pageScroll?: boolean;
}) {
  const root = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLOListElement>(null);
  const windowRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [scene, setScene] = useState(false);
  const [follow, setFollow] = useState(false);
  const [paged, setPaged] = useState(false);
  const total = featureCards.length;

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
        if (pageScroll) {
          // The page scrolls the list; the row crossing the middle lights up.
          setPaged(true);
          let frame = 0;
          const update = () => {
            frame = 0;
            const line = window.innerHeight * 0.5;
            const rows = Array.from(listRef.current?.children ?? []);
            let best = 0;
            let dist = Infinity;
            rows.forEach((row, i) => {
              const r = row.getBoundingClientRect();
              const d = Math.abs(r.top + r.height / 2 - line);
              if (d < dist) {
                dist = d;
                best = i;
              }
            });
            setActive(best);
            gsap.set("[data-progress]", { scaleX: total > 1 ? best / (total - 1) : 1 });
          };
          const onScroll = () => {
            if (!frame) frame = requestAnimationFrame(update);
          };
          window.addEventListener("scroll", onScroll, { passive: true });
          update();
          return () => {
            window.removeEventListener("scroll", onScroll);
            cancelAnimationFrame(frame);
            setPaged(false);
          };
        }
        setScene(true);
        // No pin: the page scrolls past freely. The list is its own scroll box,
        // so the wheel moves through the features only while the cursor is on it
        // (and carries on down the page at its end). The row in the middle of
        // the box is the open one; counter and progress follow its scroll.
        const win = windowRef.current;
        let frame = 0;
        const update = () => {
          frame = 0;
          if (!win || !listRef.current) return;
          const mid = win.scrollTop + win.clientHeight / 2;
          let best = 0;
          let dist = Infinity;
          Array.from(listRef.current.children).forEach((row, i) => {
            const el = row as HTMLElement;
            const d = Math.abs(el.offsetTop + el.offsetHeight / 2 - mid);
            if (d < dist) {
              dist = d;
              best = i;
            }
          });
          setActive(best);
          const max = win.scrollHeight - win.clientHeight;
          gsap.set("[data-progress]", { scaleX: max > 0 ? win.scrollTop / max : 0 });
        };
        const onScroll = () => {
          if (!frame) frame = requestAnimationFrame(update);
        };
        win?.addEventListener("scroll", onScroll, { passive: true });
        update();
        return () => {
          win?.removeEventListener("scroll", onScroll);
          cancelAnimationFrame(frame);
          setScene(false);
        };
      });
      // Phones: light up the row crossing the middle of the screen.
      // Measured live on each scroll frame (not cached markers), so content
      // settling above — loader, images, pinned scenes — can't skew it.
      mm.add("(max-width: 767px) and (prefers-reduced-motion: no-preference)", () => {
        setFollow(true);
        let frame = 0;
        const update = () => {
          frame = 0;
          const line = window.innerHeight * 0.55;
          const rows = Array.from(listRef.current?.children ?? []);
          const i = rows.findIndex((row) => {
            const r = row.getBoundingClientRect();
            return r.top <= line && r.bottom >= line;
          });
          if (i >= 0) setActive(i);
        };
        const onScroll = () => {
          if (!frame) frame = requestAnimationFrame(update);
        };
        window.addEventListener("scroll", onScroll, { passive: true });
        update();
        return () => {
          window.removeEventListener("scroll", onScroll);
          cancelAnimationFrame(frame);
          setFollow(false);
        };
      });
      return () => mm.revert();
    },
    { scope: root, dependencies: [total, pageScroll] },
  );

  // Tick on every step (and buzz on phones); not on first paint.
  useEffect(() => armTickFeedback(), []);
  const lastTick = useRef<number | null>(null);
  useEffect(() => {
    if (!scene && !follow && !paged) return;
    if (lastTick.current !== null && lastTick.current !== active) {
      tick();
      if (follow) buzz();
    }
    lastTick.current = active;
  }, [active, scene, follow, paged]);

  const jumpTo = (i: number) => {
    const win = windowRef.current;
    const row = listRef.current?.children[i] as HTMLElement | undefined;
    if (paged && row) {
      const r = row.getBoundingClientRect();
      window.scrollTo({ top: window.scrollY + r.top + r.height / 2 - window.innerHeight / 2, behavior: "smooth" });
      return;
    }
    if (!win || !row) return;
    win.scrollTo({ top: row.offsetTop + row.offsetHeight / 2 - win.clientHeight / 2, behavior: "smooth" });
  };

  return (
    <div ref={root}>
      <Section className={cn("bg-bg max-md:overflow-x-clip", scene ? "flex min-h-svh items-center py-16" : "py-20 md:py-28")}>
        <div className={cn("flex flex-col gap-12 md:flex-row md:gap-20", paged ? "md:items-start" : "md:items-center")}>
          {/* Heading, rolling counter and progress */}
          <div className={cn("flex flex-col gap-8 md:w-2/5 md:shrink-0", paged && "md:sticky md:top-32")}>
            <Reveal className="flex flex-col gap-4">
              <h2 className="text-hero-4 font-bold text-balance md:text-hero-3">{noOrphan(title)}</h2>
              {description ? (
                <RichText content={description} className="text-lg text-fg-muted" />
              ) : null}
            </Reveal>
            {(scene || paged) && (
              <Reveal className="flex flex-col gap-4" delay={0.15}>
                <div className="flex items-end gap-3 font-bold">
                  <span className="relative overflow-hidden text-hero-2 leading-none tabular-nums">
                    <span className="invisible">{pad(total)}</span>
                    <span
                      className="absolute inset-x-0 top-0 flex flex-col transition-transform duration-500 ease-out-soft"
                      style={{ transform: `translateY(-${(active * 100) / total}%)` }}
                    >
                      {featureCards.map((_, i) => (
                        <span key={i}>{pad(i + 1)}</span>
                      ))}
                    </span>
                  </span>
                  <span className="pb-1 text-xl text-fg-muted">/ {pad(total)}</span>
                </div>
                <div className="h-1 w-full overflow-hidden rounded-pill bg-border">
                  <div data-progress className="h-full origin-left scale-x-0 rounded-pill bg-accent" />
                </div>
              </Reveal>
            )}
          </div>

          {/* Feature list: one open at a time while pinned */}
          <div
            ref={windowRef}
            className={cn("relative flex-1", scene && "overflow-y-auto scrollbar-none")}
            style={
              scene
                ? {
                    height: "75svh",
                    maskImage: "linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)",
                  }
                : undefined
            }
          >
            <Reveal delay={0.2}>
            <ol
              ref={listRef}
              className="flex flex-col gap-3"
              style={scene ? { paddingBlock: "calc(37.5svh - 2.5rem)" } : undefined}
            >
              {featureCards.map((card, i) => {
                // Every row stays open: rows that grow as they light up would shift the
                // list under the scroll position.
                const open = true;
                const lit = i === active && (scene || follow || paged);
                return (
                  <li key={card.title}>
                    <button
                      type="button"
                      onClick={() => jumpTo(i)}
                      disabled={!scene && !paged}
                      aria-expanded={open}
                      className={cn(
                        "flex w-full flex-col gap-0 rounded-card-sm border p-5 text-left transition duration-500 ease-out-soft",
                        lit
                          ? "scale-100 border-fg bg-fg text-bg"
                          : "border-border bg-bg text-fg",
                        scene && !lit && "opacity-70 hover:opacity-100",
                      )}
                    >
                      <span className="flex items-center gap-4">
                        <span
                          className={cn(
                            "text-sm font-semibold tabular-nums transition-colors duration-500",
                            lit ? "text-accent" : "text-fg-muted",
                          )}
                        >
                          {pad(i + 1)}
                        </span>
                        <span
                          className={cn(
                            "font-semibold transition-all duration-500 ease-out-soft",
                            "text-base",
                          )}
                        >
                          {card.title}
                        </span>
                        {card.label && (
                          <span
                            className={cn(
                              "rounded-pill px-2.5 py-0.5 text-xs font-medium",
                              (lit ? labelColorsOnDark : labelColors)[card.label],
                            )}
                          >
                            {card.label}
                          </span>
                        )}
                      </span>
                      {/* Description slides open (0fr → 1fr rows) */}
                      <span
                        className={cn(
                          "grid transition-all duration-500 ease-out-soft",
                          open ? "mt-3 opacity-100" : "mt-0 opacity-0",
                        )}
                        style={{ gridTemplateRows: open ? "1fr" : "0fr" }}
                      >
                        <span className="overflow-hidden pl-9">
                          <RichText
                            content={card.description}
                            className={cn("text-base", lit ? "text-bg/70" : "text-fg-muted")}
                          />
                        </span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ol>
            </Reveal>
          </div>
        </div>
      </Section>
    </div>
  );
}
