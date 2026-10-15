"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cameraShot, centreIn, fluidSvg } from "../dashboardBoard/board";

gsap.registerPlugin(ScrollTrigger);

/**
 * Google Ads hero: our dashboard widgets (exported SVGs, inlined so their
 * parts can move) with the Google Ads mark, laid out like a live report. A
 * Google Ads mark draws itself once (green circle first) and stays; the
 * charts start blank and a camera tours them in a loop — the emotions radar
 * grows out from its centre and breathes, the retention cohorts light up in
 * a diagonal wave while the figure counts up — then pulls back to the whole
 * board, where the charts clear for the next round. Pauses off-screen; reduced motion shows the static board.
 */

/** Board size in design units; widgets are placed in these units. */
const W = 820;
const H = 460;

type Widget = { key: string; src: string; x: number; y: number; w: number; alt: string; tilt: number };

const dir = "/images/google ads/";
const WIDGETS: Widget[] = [
  // As sketched: the radar large at top-left in front, the retention card
  // tucked behind its bottom-right corner, and the Google Ads mark filling
  // the gap above the retention card. (DOM order = stacking order.)
  { key: "retention", src: `${dir}google ads 2.svg`, x: 500, y: 196, w: 244, alt: "User retention cohort chart: 24%", tilt: -4 },
  { key: "radar", src: `${dir}google ads 1.svg`, x: 120, y: 36, w: 372, alt: "Audience emotions radar chart", tilt: -4 },
  { key: "logo", src: `${dir}google ads 3.svg`, x: 556, y: 22, w: 150, alt: "Google Ads", tilt: 0 },
];

const shot = cameraShot(W, H);
const OVERVIEW = shot(W / 2, H / 2, 1);
// Gentle close-ups, so most of the board stays in view.
const ON_RADAR = shot(330, 190, 1.25);
const ON_RETENTION = shot(612, 320, 1.25);

/** Per-card tilt (deg) while the board is zoomed out: retention, radar, mark. */
const SWAY = [
  { x: -3, y: -8, z: 1.5 },
  { x: 4, y: 8, z: -1.5 },
  { x: 5, y: 10, z: 3 },
];

/** Radar centre, in the radar widget's own units. */
const RADAR_C = { x: 176, y: 132 };
/** The retention headline figure. */
const PCT = 24;

export function GoogleAdsScene() {
  const stage = useRef<HTMLDivElement>(null);
  const camera = useRef<HTMLDivElement>(null);
  const slots = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    let ctx: gsap.Context | undefined;
    let cancelled = false;

    Promise.all(WIDGETS.map((w) => fetch(encodeURI(w.src)).then((r) => r.text()))).then((svgs) => {
      if (cancelled) return;
      WIDGETS.forEach((w, i) => {
        const slot = slots.current[w.key];
        if (slot) slot.innerHTML = svgs[i];
      });
      const svgOf = (key: string) => slots.current[key]?.querySelector("svg") ?? null;
      const radar = svgOf("radar");
      const ret = svgOf("retention");
      const logo = svgOf("logo");
      if (!radar || !ret || !logo) return;
      [radar, ret, logo].forEach(fluidSvg);
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        WIDGETS.forEach((w) => {
          const svg = svgOf(w.key);
          if (svg && w.tilt) svg.style.transform = `rotate(${w.tilt}deg)`;
        });
        return;
      }
      const NS = "http://www.w3.org/2000/svg";

      // Radar: the two data shapes and their corner dots (each dot wrapped
      // in a group so it can travel with its shape).
      const shapes = Array.from(radar.querySelectorAll('path[fill-opacity="0.1"]'));
      const [greenShape, yellowShape] = shapes;
      const dotsOf = (stroke: string) =>
        Array.from(radar.querySelectorAll(`circle[stroke="${stroke}"]`)).map((c) => {
          const at = centreIn(radar, c);
          const g = document.createElementNS(NS, "g");
          c.before(g);
          g.appendChild(c);
          return { g, at };
        });
      const greenDots = dotsOf("#1DAF61");
      const yellowDots = dotsOf("#FFDB00");

      // Retention: every cohort cell with its grid position (for the wave).
      const cells = Array.from(ret.querySelectorAll('rect[fill="#FFDB00"]')).map((el) => {
        const at = centreIn(ret, el);
        return { el, wave: Math.round((at.x - 34) / 27) + Math.round((at.y - 104) / 16) };
      });
      // "24%" is outlined text in the export: swap it for live text in the
      // same spot and size so it can count.
      const pctShape = ret.querySelector('path[fill="white"]') as SVGGraphicsElement | null;
      const pct = document.createElementNS(NS, "text");
      if (pctShape) {
        const b = pctShape.getBBox();
        Object.entries({ x: b.x, y: b.y + b.height, fill: "white", "font-size": b.height / 0.72, "font-weight": 500 }).forEach(([k, v]) =>
          pct.setAttribute(k, String(v)),
        );
        pct.style.fontVariantNumeric = "tabular-nums";
        pct.textContent = `${PCT}%`;
        pctShape.after(pct);
        pctShape.setAttribute("visibility", "hidden");
      }
      const counter = { value: PCT };
      const showPct = () => {
        pct.textContent = `${Math.round(counter.value)}%`;
      };

      // Google Ads mark: its three pieces.
      const [bar, blade, dot] = ["#FBBC04", "#4285F4", "#34A853"].map((c) => logo.querySelector(`path[fill="${c}"]`));

      // The sketch's slight resting tilt, on the artwork (GSAP owns the
      // slots) — applied after the parts above were measured.
      const tilt = () =>
        WIDGETS.forEach((w) => {
          const svg = svgOf(w.key);
          if (svg && w.tilt) svg.style.transform = `rotate(${w.tilt}deg)`;
        });

      tilt();
      ctx = gsap.context(() => {
        const cards = Object.values(slots.current);
        gsap.set(camera.current, { ...OVERVIEW, transformOrigin: "0 0" });
        gsap.set(cards, { transformPerspective: 900 });
        gsap.set(shapes, { svgOrigin: `${RADAR_C.x} ${RADAR_C.y}` });

        // The charts start blank — they only fill in once the camera zooms in.
        const radarParts = [...shapes, ...greenDots.map((d) => d.g), ...yellowDots.map((d) => d.g)];
        const cellEls = cells.map((c) => c.el);
        gsap.set(radarParts, { opacity: 0 });
        gsap.set(cellEls, { opacity: 0.08 });
        counter.value = 0;
        showPct();

        // Board builds in once: the two charts pop up, tilted, and settle;
        // then the Google Ads mark draws itself — green circle, yellow bar
        // rising out of it, blue blade sweeping down — and stays.
        gsap.set([bar, blade, dot], { opacity: 0 });
        const intro = gsap.timeline({ delay: 0.3 });
        intro
          .from(cards.slice(0, 2), {
            opacity: 0,
            scale: 0.5,
            y: 30,
            rotationX: 25,
            rotationY: (i: number) => -SWAY[i].y * 2,
            rotation: (i: number) => SWAY[i].z * 3,
            duration: 0.85,
            stagger: 0.2,
            ease: "back.out(1.8)",
          })
          .fromTo(dot, { scale: 0, opacity: 1, svgOrigin: "67.5 297" }, { scale: 1, svgOrigin: "67.5 297", duration: 0.55, ease: "back.out(3)" }, ">-0.1")
          .fromTo(bar, { scaleX: 0, scaleY: 0, opacity: 1, svgOrigin: "67.5 297" }, { scaleX: 1, scaleY: 1, svgOrigin: "67.5 297", duration: 0.6, ease: "power3.out" }, ">-0.15")
          .fromTo(blade, { scaleX: 0, scaleY: 0, opacity: 1, svgOrigin: "202 68" }, { scaleX: 1, scaleY: 1, svgOrigin: "202 68", duration: 0.65, ease: "power3.out" }, ">-0.2");

        // The loop tours the two charts only.
        const loop = gsap.timeline({ repeat: -1, paused: true, defaults: { ease: "power2.inOut" } });

        // Grow a radar shape out of the centre, its dots riding the corners.
        const grow = (shape: Element | undefined, dots: typeof greenDots, at: string) => {
          if (!shape) return;
          loop.fromTo(shape, { scale: 0, opacity: 1 }, { scale: 1, opacity: 1, duration: 0.9, ease: "back.out(1.4)", immediateRender: false }, at);
          dots.forEach(({ g, at: p }) => {
            loop.fromTo(
              g,
              { x: RADAR_C.x - p.x, y: RADAR_C.y - p.y, opacity: 0 },
              { x: 0, y: 0, opacity: 1, duration: 0.9, ease: "back.out(1.4)", immediateRender: false },
              at,
            );
          });
        };
        // Breathe: a shape swells / shrinks about the centre and back.
        const breathe = (shape: Element | undefined, dots: typeof greenDots, s: number, at: string) => {
          if (!shape) return;
          loop.to(shape, { scale: s, duration: 0.7, yoyo: true, repeat: 1, ease: "sine.inOut" }, at);
          dots.forEach(({ g, at: p }) => {
            loop.to(g, { x: (p.x - RADAR_C.x) * (s - 1), y: (p.y - RADAR_C.y) * (s - 1), duration: 0.7, yoyo: true, repeat: 1, ease: "sine.inOut" }, at);
          });
        };

        // 0 — While zoomed out, both charts clear back to blank (on repeats;
        // the first run starts blank already).
        loop
          .fromTo(radarParts, { opacity: 1 }, { opacity: 0, duration: 0.3, immediateRender: false }, 0)
          .fromTo(cellEls, { opacity: 1 }, { opacity: 0.08, duration: 0.3, immediateRender: false }, 0)
          .fromTo(counter, { value: PCT }, { value: 0, duration: 0.3, ease: "none", onUpdate: showPct, immediateRender: false }, 0);

        // 1 — Radar: zoom in, the shapes grow out of the centre and breathe.
        loop.add("radar", 0.6).to(camera.current, { ...ON_RADAR, duration: 0.8 }, "radar");
        grow(greenShape, greenDots, "radar+=0.7");
        grow(yellowShape, yellowDots, "radar+=1.05");
        breathe(yellowShape, yellowDots, 0.9, "radar+=2.2");
        breathe(greenShape, greenDots, 1.08, "radar+=2.2");

        // 2 — Retention: zoom in, cohorts light up in a diagonal wave while
        // the figure counts up.
        loop.add("ret", "radar+=3.9").to(camera.current, { ...ON_RETENTION, duration: 0.8 }, "ret");
        cells.forEach((c) => {
          loop.to(c.el, { opacity: 1, duration: 0.35, ease: "power1.out" }, `ret+=${0.8 + c.wave * 0.07}`);
        });
        loop.to(counter, { value: PCT, duration: 22 * 0.07 + 0.35, ease: "none", onUpdate: showPct }, "ret+=0.8");

        // 4 — Pull back to the whole board; each card sways, then settles.
        loop
          .to(camera.current, { ...OVERVIEW, duration: 0.9 }, "ret+=2.9")
          .add("sway", "ret+=3.9")
          .to(
            cards,
            {
              keyframes: [
                {
                  rotationY: (i: number) => SWAY[i].y,
                  rotationX: (i: number) => SWAY[i].x,
                  rotation: (i: number) => SWAY[i].z,
                  duration: 1.2,
                  ease: "sine.inOut",
                },
                { rotationY: 0, rotationX: 0, rotation: 0, duration: 1.2, ease: "sine.inOut" },
              ],
              stagger: 0.15,
            },
            "sway",
          )
          .to({}, { duration: 0.3 });

        // First run skips the clear step (the charts start blank).
        intro.eventCallback("onComplete", () => {
          loop.play(0.35, false); // (don't suppress updates, so the figure stays in sync)
        });

        // Only run while the hero is on screen.
        ScrollTrigger.create({
          trigger: stage.current,
          start: "top bottom",
          end: "bottom top",
          onToggle: (self) => {
            if (self.isActive) {
              if (intro.progress() === 1) loop.resume();
            } else loop.pause();
          },
        });
      }, stage);
    });

    return () => {
      cancelled = true;
      ctx?.revert();
    };
  }, []);

  return (
    <div ref={stage} className="absolute inset-0 flex items-center justify-center overflow-hidden">
      <div className="relative w-full" style={{ aspectRatio: `${W} / ${H}` }}>
        <div ref={camera} className="absolute inset-0 will-change-transform">
          {WIDGETS.map((w) => (
            <div
              key={w.key}
              ref={(el) => {
                slots.current[w.key] = el;
              }}
              role="img"
              aria-label={w.alt}
              className="absolute"
              style={{ left: `${(w.x / W) * 100}%`, top: `${(w.y / H) * 100}%`, width: `${(w.w / W) * 100}%` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
