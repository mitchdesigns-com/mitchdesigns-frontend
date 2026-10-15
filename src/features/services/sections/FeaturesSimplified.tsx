"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Section } from "@/components/layout/Section";
import { RichText } from "@/components/ui/RichText";
import type { FeaturesSimplifiedProps } from "@/lib/cms/types";
import { cn } from "@/lib/cn";
import { armTickFeedback, buzz, tick } from "@/lib/tickFeedback";

gsap.registerPlugin(ScrollTrigger, useGSAP);

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

/** Scroll distance per feature while pinned, as a share of the viewport. */
const STEP = 0.42;

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * "Every feature" list as a pinned scroll scene (≥768px, GSAP ScrollTrigger):
 * the section holds while each feature in turn opens up — its description
 * and badge slide out, the list glides to keep it centred, a rolling counter
 * and progress bar track the way through, and the scroll snaps to every
 * feature. Rows are clickable to jump straight to one. Each step ticks
 * (once the visitor has interacted with the page). Phones get the full list
 * with the row crossing mid-screen lit up, ticking and buzzing (Android) as
 * it changes. Reduced motion: the plain list, silent.
 */
export function FeaturesSimplified({
  title,
  description,
  featureCards,
}: FeaturesSimplifiedProps) {
  const root = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLOListElement>(null);
  const windowRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<ScrollTrigger | null>(null);
  const [active, setActive] = useState(0);
  const [scene, setScene] = useState(false);
  const [follow, setFollow] = useState(false);
  const total = featureCards.length;

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
        setScene(true);
        const st = ScrollTrigger.create({
          trigger: root.current,
          start: "top top",
          end: () => `+=${window.innerHeight * STEP * (total - 1)}`,
          pin: true,
          scrub: true,
          snap: {
            snapTo: 1 / Math.max(total - 1, 1),
            duration: { min: 0.2, max: 0.5 },
            ease: "power2.inOut",
          },
          onUpdate: (self) => {
            setActive(Math.round(self.progress * (total - 1)));
            gsap.set("[data-progress]", { scaleX: self.progress });
          },
        });
        triggerRef.current = st;
        return () => {
          setScene(false);
          triggerRef.current = null;
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
    { scope: root, dependencies: [total] },
  );

  // Tick on every step (and buzz on phones); not on first paint.
  useEffect(() => armTickFeedback(), []);
  const lastTick = useRef<number | null>(null);
  useEffect(() => {
    if (!scene && !follow) return;
    if (lastTick.current !== null && lastTick.current !== active) {
      tick();
      if (follow) buzz();
    }
    lastTick.current = active;
  }, [active, scene, follow]);

  // Glide the list so the open feature sits in the middle of the window.
  useGSAP(
    () => {
      const list = listRef.current;
      const win = windowRef.current;
      const row = list?.children[active] as HTMLElement | undefined;
      if (!scene || !list || !win || !row) return;
      const target = win.clientHeight / 2 - (row.offsetTop + row.offsetHeight / 2);
      gsap.to(list, { y: target, duration: 0.7, ease: "power3.out", overwrite: true });
    },
    { dependencies: [active, scene], scope: root },
  );

  const jumpTo = (i: number) => {
    const st = triggerRef.current;
    if (!st) return;
    window.scrollTo({ top: st.start + (st.end - st.start) * (i / Math.max(total - 1, 1)), behavior: "smooth" });
  };

  return (
    <div ref={root}>
      <Section className={cn("bg-bg", scene ? "flex h-svh items-center" : "py-20 md:py-28")}>
        <div className="flex flex-col gap-12 md:flex-row md:items-center md:gap-20">
          {/* Heading, rolling counter and progress */}
          <div className="flex flex-col gap-8 md:w-2/5 md:shrink-0">
            <div className="flex flex-col gap-4">
              <h2 className="text-hero-4 font-bold text-balance md:text-hero-3">{title}</h2>
              {description ? (
                <RichText content={description} className="text-lg text-fg-muted" />
              ) : null}
            </div>
            {scene && (
              <div className="flex flex-col gap-4">
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
              </div>
            )}
          </div>

          {/* Feature list: one open at a time while pinned */}
          <div
            ref={windowRef}
            className={cn("relative flex-1", scene && "h-svh overflow-hidden")}
            style={
              scene
                ? { maskImage: "linear-gradient(to bottom, transparent, black 18%, black 82%, transparent)" }
                : undefined
            }
          >
            <ol ref={listRef} className="flex flex-col gap-3">
              {featureCards.map((card, i) => {
                const open = !scene || i === active;
                const lit = i === active && (scene || follow);
                return (
                  <li key={card.title}>
                    <button
                      type="button"
                      onClick={() => jumpTo(i)}
                      disabled={!scene}
                      aria-expanded={open}
                      className={cn(
                        "flex w-full flex-col gap-0 rounded-card-sm border p-5 text-left transition duration-500 ease-out-soft",
                        lit
                          ? "scale-100 border-fg bg-fg text-bg"
                          : "border-border bg-bg text-fg",
                        scene && !open && "scale-95 opacity-70 hover:opacity-100",
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
                            // Grows only in the pinned scene; on phones a size change would
                            // shift the rows below and throw off their scroll markers.
                            lit && scene ? "text-2xl" : "text-base",
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
          </div>
        </div>
      </Section>
    </div>
  );
}
