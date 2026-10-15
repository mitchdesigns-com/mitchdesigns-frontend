"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cameraShot } from "../dashboardBoard/board";

gsap.registerPlugin(ScrollTrigger);

/**
 * SEO hero: our "Total Organic Clicks" widget (rebuilt as live SVG from the
 * design in public/images/SEO/SEO.svg — the export is a flat bitmap, so its
 * parts couldn't move). It starts blank; a camera closes in and follows the
 * yellow line as it draws through the week, each tooltip pops in as the line
 * reaches it, the total counts up — then the camera pulls back to the whole
 * card, which sways, and the chart clears for the next round. Pauses
 * off-screen; reduced motion shows the finished chart.
 */

/** Board size in design units; the card is placed in these units. */
const W = 820;
const H = 460;
const CARD = { x: 60, y: 70, w: 700, h: 294 };
/** The card's resting tilt (deg). */
const TILT = -3;
const shot = cameraShot(W, H);
const OVERVIEW = shot(W / 2, H / 2, 1);
/** Card-local x → board point, for the camera to follow the line. */
const onCard = (x: number, y: number) => ({ x: CARD.x + x, y: CARD.y + y });

const TOTAL = 14564;
const fmt = (n: number) => Math.round(n).toLocaleString("en-US");

// Chart geometry (card units, traced from the design).
const GRID_Y = [96, 135, 173, 212, 250];
const Y_LABELS = ["10K", "7.5K", "5K", "2.5K", "0"];
const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const DAY_X = [68, 155, 242, 329, 415, 502, 589];
const LINE = [
  [31, 208], [47, 191], [62, 203], [78, 176], [93, 180], [109, 152], [124, 223], [140, 181], [155, 189],
  [171, 163], [187, 171], [203, 134], [218, 184], [234, 184], [250, 203], [265, 176], [281, 180], [297, 150],
  [313, 159], [328, 156], [344, 185], [360, 151], [376, 167], [390, 116], [407, 155], [422, 150], [439, 168],
  [454, 175], [470, 193], [485, 173], [500, 153], [517, 122], [523, 156], [533, 188], [548, 151], [563, 167],
  [579, 151], [595, 174], [611, 156], [627, 172],
];
const LINE_D = "M" + LINE.map(([x, y]) => `${x} ${y}`).join(" L");
/** The two highlighted points (Thu, Sat) and where along the line they sit. */
const PEAK = { x: 390, y: 116, at: (390 - 31) / (627 - 31) };
const DIP = { x: 523, y: 156, at: (523 - 31) / (627 - 31) };

const MUTED = "#a4a4a4";
const LINE_COLOR = "#ffdb00";

export function SeoScene() {
  const stage = useRef<HTMLDivElement>(null);
  const camera = useRef<HTMLDivElement>(null);
  const card = useRef<HTMLDivElement>(null);
  const svg = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const root = svg.current;
    if (!root) return;
    const $ = (sel: string) => root.querySelector(sel);
    const line = $("[data-line]") as SVGPathElement;
    const total = $("[data-total]") as SVGTextElement;
    const badge = $("[data-badge]");
    const tip1 = $("[data-tip='1']");
    const tip2 = $("[data-tip='2']");
    const dot1 = $("[data-dot='1']");
    const dot2 = $("[data-dot='2']");
    const len = line.getTotalLength();
    const counter = { value: TOTAL };
    const show = () => {
      total.textContent = fmt(counter.value);
    };
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      gsap.set(camera.current, { ...OVERVIEW, transformOrigin: "0 0" });
      gsap.set(card.current, { transformPerspective: 900, rotation: TILT });
      gsap.set(line, { strokeDasharray: len });
      // Blank to begin with.
      const blank = () => {
        gsap.set(line, { strokeDashoffset: len });
        gsap.set([tip1, tip2, dot1, dot2, badge], { opacity: 0 });
        counter.value = 0;
        show();
      };
      blank();

      // The card pops in once.
      const intro = gsap.timeline({ delay: 0.3 });
      intro.from(card.current, { opacity: 0, scale: 0.6, y: 30, rotationX: 22, rotationY: -14, duration: 0.9, ease: "back.out(1.7)" });

      const loop = gsap.timeline({ repeat: -1, paused: true, defaults: { ease: "power2.inOut" } });
      const DRAW = 4.2;
      const start = onCard(150, 170);
      const end = onCard(560, 160);

      // 0 — Clear back to blank while zoomed out (repeats only).
      loop
        .fromTo(line, { strokeDashoffset: 0 }, { strokeDashoffset: len, duration: 0.4, ease: "power1.in", immediateRender: false }, 0)
        .fromTo([tip1, tip2, dot1, dot2, badge], { opacity: 1 }, { opacity: 0, duration: 0.3, immediateRender: false }, 0)
        .fromTo(counter, { value: TOTAL }, { value: 0, duration: 0.4, ease: "none", onUpdate: show, immediateRender: false }, 0);

      // 1 — Close in on the start of the week, then follow the line as it draws.
      loop
        .to(camera.current, { ...shot(start.x, start.y, 1.45), duration: 0.9 }, 0.6)
        .to(line, { strokeDashoffset: 0, duration: DRAW, ease: "none" }, 1.5)
        .to(camera.current, { ...shot(end.x, end.y, 1.45), duration: DRAW, ease: "none" }, 1.5)
        .fromTo(dot1, { opacity: 1, scale: 0, svgOrigin: `${PEAK.x} ${PEAK.y}` }, { scale: 1, svgOrigin: `${PEAK.x} ${PEAK.y}`, duration: 0.45, ease: "back.out(3)", immediateRender: false }, 1.5 + DRAW * PEAK.at)
        .fromTo(tip1, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.45, ease: "back.out(2)", immediateRender: false }, 1.6 + DRAW * PEAK.at)
        .fromTo(dot2, { opacity: 1, scale: 0, svgOrigin: `${DIP.x} ${DIP.y}` }, { scale: 1, svgOrigin: `${DIP.x} ${DIP.y}`, duration: 0.45, ease: "back.out(3)", immediateRender: false }, 1.5 + DRAW * DIP.at)
        .fromTo(tip2, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.45, ease: "back.out(2)", immediateRender: false }, 1.6 + DRAW * DIP.at);

      // 2 — Over to the headline: the total counts up, the badge pops.
      const head = onCard(120, 50);
      loop
        .add("total", 1.5 + DRAW + 0.2)
        .to(camera.current, { ...shot(head.x + 60, head.y + 40, 1.45), duration: 0.8 }, "total")
        .to(counter, { value: TOTAL, duration: 1.4, ease: "power2.out", onUpdate: show }, "total+=0.4")
        .fromTo(badge, { opacity: 0, scale: 0.4, svgOrigin: "125 56" }, { opacity: 1, scale: 1, svgOrigin: "125 56", duration: 0.5, ease: "back.out(3)", immediateRender: false }, "total+=1.6");

      // 3 — Pull back to the whole card; it sways, then settles.
      loop
        .to(camera.current, { ...OVERVIEW, duration: 0.9 }, "total+=2.4")
        .to(
          card.current,
          {
            keyframes: [
              { rotationY: 8, rotationX: 4, rotation: -4.5, duration: 1.2, ease: "sine.inOut" },
              { rotationY: 0, rotationX: 0, rotation: TILT, duration: 1.2, ease: "sine.inOut" },
            ],
          },
          "total+=3.2",
        )
        .to({}, { duration: 0.3 });

      // First run skips the clear step (the chart starts blank).
      intro.eventCallback("onComplete", () => {
        loop.play(0.45, false);
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
    return () => ctx.revert();
  }, []);

  return (
    <div ref={stage} className="absolute inset-0 flex items-center justify-center overflow-hidden">
      <div className="relative w-full" style={{ aspectRatio: `${W} / ${H}` }}>
        <div ref={camera} className="absolute inset-0 will-change-transform">
          <div
            ref={card}
            role="img"
            aria-label={`Total organic clicks this week: ${fmt(TOTAL)}, up 2.1% on last week`}
            className="absolute"
            style={{
              left: `${(CARD.x / W) * 100}%`,
              top: `${(CARD.y / H) * 100}%`,
              width: `${(CARD.w / W) * 100}%`,
            }}
          >
            <svg ref={svg} viewBox={`0 0 ${CARD.w} ${CARD.h}`} className="block h-auto w-full overflow-visible" aria-hidden>
              <rect width={CARD.w} height={CARD.h} rx="16" fill="#1c1c1c" stroke="#262626" />
              {/* Headline */}
              <text x="20" y="34" fill={MUTED} fontSize="13">Total Organic Clicks</text>
              <text data-total x="20" y="66" fill="#fff" fontSize="22" fontWeight="500" style={{ fontVariantNumeric: "tabular-nums" }}>
                {fmt(TOTAL)}
              </text>
              <g data-badge>
                <rect x="102" y="49" width="46" height="19" rx="9.5" fill="#173323" />
                <text x="125" y="62.5" fill="#1fc16b" fontSize="10.5" textAnchor="middle">+2.1%</text>
              </g>
              <text x="156" y="62.5" fill={MUTED} fontSize="11.5">vs last week</text>
              {/* Weekly picker */}
              <rect x="596" y="33" width="84" height="27" rx="6" fill="#181818" stroke="#2a2a2a" />
              <text x="610" y="51" fill={MUTED} fontSize="12.5">Weekly</text>
              <path d="M663 44.5l3.5 3.5 3.5-3.5" stroke={MUTED} strokeWidth="1.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              {/* Grid */}
              {GRID_Y.map((y, i) => (
                <g key={y}>
                  <line x1="19" x2="641" y1={y} y2={y} stroke="#2a2a2a" />
                  <text x="653" y={y + 4} fill={MUTED} fontSize="11">{Y_LABELS[i]}</text>
                </g>
              ))}
              {DAY_X.map((x, i) => (
                <g key={x}>
                  <line x1={x} x2={x} y1="96" y2="250" stroke="#2e2e2e" strokeDasharray="3 3" />
                  <text x={x} y="270" fill={MUTED} fontSize="11.5" textAnchor="middle">{DAYS[i]}</text>
                </g>
              ))}
              {/* The week's line */}
              <path data-line d={LINE_D} fill="none" stroke={LINE_COLOR} strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round" />
              {/* Tooltips + their dots */}
              <g data-tip="1">
                <rect x="286" y="85" width="86" height="63" rx="9" fill="#191919" stroke="#2a2a2a" />
                <path d="M372 112l5 4-5 4" fill="#191919" stroke="#2a2a2a" />
                <text x="298" y="107" fill={MUTED} fontSize="11">Thu, Jan 8</text>
                <text x="298" y="132" fill="#fff" fontSize="17" fontWeight="500">5K</text>
                <text x="322" y="132" fill={MUTED} fontSize="11.5">Views</text>
              </g>
              <circle data-dot="1" cx={PEAK.x} cy={PEAK.y} r="4" fill={LINE_COLOR} stroke="#1c1c1c" strokeWidth="1.5" />
              <g data-tip="2">
                <rect x="418" y="124" width="86" height="63" rx="9" fill="#191919" stroke="#2a2a2a" />
                <path d="M504 152l5 4-5 4" fill="#191919" stroke="#2a2a2a" />
                <text x="430" y="146" fill={MUTED} fontSize="11">Sat, Jan 8</text>
                <text x="430" y="171" fill="#fff" fontSize="17" fontWeight="500">3K</text>
                <text x="454" y="171" fill={MUTED} fontSize="11.5">Views</text>
              </g>
              <circle data-dot="2" cx={DIP.x} cy={DIP.y} r="4" fill={LINE_COLOR} stroke="#1c1c1c" strokeWidth="1.5" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
