"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { cameraShot, centreIn, fluidSvg } from "../dashboardBoard/board";

gsap.registerPlugin(ScrollTrigger);

/**
 * Media-buying hero: our three dashboard widgets (exported SVGs, inlined so
 * their parts can move) laid out like a live report. A camera tours them in
 * a loop — the category bar fills up, the segments donut fans open, then the
 * map: audience pins pop in and a wave of activity ripples out from Egypt —
 * before pulling back to the whole board. Pauses off-screen; reduced motion
 * shows the static board.
 */

/** Board size in design units; widgets are placed in these units. */
const W = 820;
const H = 460;

type Widget = { key: string; src: string; x: number; y: number; w: number; alt: string };

const dir = "/images/media-buying/";
const WIDGETS: Widget[] = [
  { key: "categories", src: `${dir}Widgets [Marketing & Sales] 3.svg`, x: 62, y: 48, w: 352, alt: "Product categories widget: 58% of goal" },
  { key: "segments", src: `${dir}Widgets [Marketing & Sales] 2.svg`, x: 47, y: 243, w: 352, alt: "Customer segments donut chart" },
  { key: "geo", src: `${dir}Widgets [Marketing & Sales] [1.1].svg`, x: 414, y: 33, w: 356, alt: "Audience geography map, focused on Egypt" },
];

const shot = cameraShot(W, H);
const OVERVIEW = shot(W / 2, H / 2, 1);
const ON_CATEGORIES = shot(238, 137, 1.6);
const ON_SEGMENTS = shot(223, 332, 1.6);
const ON_MAP = shot(592, 283, 1.7);

const YELLOW = "#FFDB00";
const BAR_OFF = "#333333";
/** Bars lit in the design (58%). */
const BARS_ON = 18;
/** Per-card tilt (deg) while the board is zoomed out: categories, segments, map. */
const SWAY = [
  { x: 4, y: 8, z: -1.5 },
  { x: -4, y: 6, z: 1 },
  { x: 3, y: -8, z: 1.5 },
];

/** The headline figure the lit bars stand for. */
const PCT = 58;
/** Egypt pin centre in the map widget's own units. */
const EGYPT = { x: 252, y: 255 };
/** Audience pins (map widget units), Egypt last. */
const PINS = [
  { x: 191, y: 152 },
  { x: 306, y: 202 },
  { x: 110, y: 214 },
  { x: 159, y: 271 },
  EGYPT,
];

export function MediaBuyingScene() {
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
      const cat = svgOf("categories");
      const seg = svgOf("segments");
      const geo = svgOf("geo");
      if (!cat || !seg || !geo) return;
      [cat, seg, geo].forEach(fluidSvg);
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      // Parts to animate, found by their design attributes.
      const bars = Array.from(cat.querySelectorAll('rect[width="5.51351"]'));
      const segments = ["#E16614", "#FFDB00", "#1DAF9C"].flatMap((fill) => {
        const part = seg.querySelector(`:scope > path[fill="${fill}"]`);
        return part ? [[part, part.nextElementSibling].filter(Boolean) as Element[]] : [];
      });
      // The "58%" headline is outlined text in the export: swap it for live
      // text (same spot, size and colour) so it counts with the bar.
      const pctShape = cat.querySelector(':scope > path[fill="white"]');
      const pct = document.createElementNS("http://www.w3.org/2000/svg", "text");
      Object.entries({ x: 20.5, y: 69.3, fill: "white", "font-size": 24.5, "font-weight": 500 }).forEach(([k, v]) =>
        pct.setAttribute(k, String(v)),
      );
      pct.style.fontVariantNumeric = "tabular-nums";
      pct.textContent = `${PCT}%`;
      if (pctShape) {
        pctShape.after(pct);
        pctShape.setAttribute("visibility", "hidden");
      }
      const counter = { value: PCT };
      const showPct = () => {
        pct.textContent = `${Math.round(counter.value)}%`;
      };
      const legendDots = Array.from(seg.querySelectorAll('circle[cx="144"][r="6"]'));
      const dots = Array.from(geo.querySelectorAll('path[fill="#5C5C5C"]'));

      // Group each map pin's pieces (blur disc, ring, dot) so it pops as one.
      const pinParts = Array.from(geo.querySelectorAll("foreignObject, rect[rx='9'], rect[rx='8'], circle[r='4']"));
      const pins = PINS.map((p) => {
        const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
        const mine = pinParts.filter((el) => {
          const c = centreIn(geo, el);
          return Math.hypot(c.x - p.x, c.y - p.y) < 14;
        });
        if (mine[0]) mine[0].before(g);
        mine.forEach((el) => g.appendChild(el));
        return g;
      });
      // A pulse ring around Egypt.
      const ring = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      Object.entries({ cx: EGYPT.x, cy: EGYPT.y, r: 9, fill: "none", stroke: YELLOW, "stroke-width": 2 }).forEach(([k, v]) =>
        ring.setAttribute(k, String(v)),
      );
      pins[pins.length - 1].before(ring);

      // Ripple delay per dot: distance from Egypt.
      const dist = dots.map((d) => {
        const c = centreIn(geo, d);
        return Math.hypot(c.x - EGYPT.x, c.y - EGYPT.y);
      });

      ctx = gsap.context(() => {
        gsap.set(camera.current, { ...OVERVIEW, transformOrigin: "0 0" });
        gsap.set(ring, { svgOrigin: `${EGYPT.x} ${EGYPT.y}`, scale: 1, opacity: 0 });

        gsap.set(Object.values(slots.current), { transformPerspective: 900 });

        // Board builds in once: each card pops up from small, tilted,
        // overshoots a touch and settles flat.
        const intro = gsap.timeline({ delay: 0.3 });
        intro.from(Object.values(slots.current), {
          opacity: 0,
          scale: 0.5,
          y: 30,
          rotationX: 25,
          rotationY: (i: number) => -SWAY[i].y * 2,
          rotation: (i: number) => SWAY[i].z * 3,
          duration: 0.85,
          stagger: 0.2,
          ease: "back.out(1.8)",
        });

        const loop = gsap.timeline({ repeat: -1, paused: true, defaults: { ease: "power2.inOut" } });

        // 1 — Categories: the bar empties as we close in, then fills up.
        loop
          .to(camera.current, { ...ON_CATEGORIES, duration: 1.1 }, 0.3)
          .to(bars, { fill: BAR_OFF, duration: 0.2, stagger: { each: 0.01, from: "end" } }, 0.4)
          .to(counter, { value: 0, duration: 0.57, ease: "none", onUpdate: showPct }, 0.4)
          .to(bars.slice(0, BARS_ON), { fill: YELLOW, duration: 0.12, stagger: 0.06, ease: "none" }, 1.4)
          // The figure counts up with the bar, segment by segment.
          .to(counter, { value: PCT, duration: (BARS_ON - 1) * 0.06 + 0.12, ease: "none", onUpdate: showPct }, 1.4)
          // The bar edge peeks ahead (+2.1%), then settles — the figure with it.
          .add("peek", ">-0.05")
          .to(bars.slice(BARS_ON, BARS_ON + 2), { fill: YELLOW, duration: 0.15, stagger: 0.08, yoyo: true, repeat: 3 }, "peek")
          .fromTo(
            counter,
            { value: PCT },
            { value: PCT + 2.1, duration: 0.23, yoyo: true, repeat: 3, ease: "none", immediateRender: false, onUpdate: showPct },
            "peek+=0.05",
          );

        // 2 — Segments: the donut fans open slice by slice, legend dots pop.
        loop
          .add("segments", ">+0.4")
          .to(camera.current, { ...ON_SEGMENTS, duration: 1 }, "segments")
          .to(segments.flat(), { opacity: 0, duration: 0.2 }, "segments")
          .addLabel("fan", "segments+=0.8");
        segments.forEach((part, i) => {
          loop.fromTo(
            part,
            { opacity: 0, rotation: -70, scale: 0.7, svgOrigin: "69 109" },
            { opacity: 1, rotation: 0, scale: 1, svgOrigin: "69 109", duration: 0.7, immediateRender: false, ease: "back.out(1.6)" },
            `fan+=${i * 0.35}`,
          );
        });
        legendDots.forEach((dot, i) => {
          const cy = dot.getAttribute("cy");
          loop.fromTo(
            dot,
            { scale: 0.2, svgOrigin: `144 ${cy}` },
            { scale: 1, svgOrigin: `144 ${cy}`, duration: 0.5, immediateRender: false, ease: "back.out(3)" },
            `fan+=${i * 0.35 + 0.2}`,
          );
        });

        // 3 — Map: pins pop in, Egypt pulses, activity ripples out from it.
        loop
          .add("map", ">+0.8")
          .to(camera.current, { ...ON_MAP, duration: 1.2 }, "map")
          .to(pins, { opacity: 0, duration: 0.2 }, "map");
        pins.forEach((pin, i) => {
          const p = PINS[i];
          loop.fromTo(
            pin,
            { opacity: 0, scale: 0.3, svgOrigin: `${p.x} ${p.y}` },
            { opacity: 1, scale: 1, svgOrigin: `${p.x} ${p.y}`, duration: 0.45, immediateRender: false, ease: "back.out(2.4)" },
            `map+=${1 + i * 0.22}`,
          );
        });
        loop
          .fromTo(ring, { scale: 1, opacity: 0.9 }, { scale: 4, opacity: 0, duration: 1.1, immediateRender: false, ease: "power2.out", repeat: 2 }, "map+=2.2")
          .to(
            dots,
            {
              keyframes: [{ fill: YELLOW, duration: 0.18 }, { fill: "#5C5C5C", duration: 0.5 }],
              ease: "none",
              stagger: (i: number) => dist[i] * 0.006,
            },
            "map+=2.3",
          );

        // 4 — Pull back to the whole board; while it holds, each card sways
        // in 3D (its own direction), then settles flat before the next tour.
        const cards = Object.values(slots.current);
        loop
          .to(camera.current, { ...OVERVIEW, duration: 1.3 }, ">-0.6")
          .add("sway", ">-0.3")
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

        intro.eventCallback("onComplete", () => {
          loop.play(0);
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
