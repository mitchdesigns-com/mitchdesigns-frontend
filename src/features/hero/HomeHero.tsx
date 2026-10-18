"use client";

import { useContext, useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { HeaderConfigContext } from "@/context/HeaderConfigContext";
import { Play } from "@/components/icons/Play";
import { Cancel } from "@/components/icons/Cancel";
import { easeInOutSoft, easeOutSoft } from "@/lib/motion";
import { MicroSlats } from "@/components/ui/micro-slats/MicroSlats";
import { RotatingWord } from "./RotatingWord";
import { VideoHero } from "./VideoHero";

const HERO_VIDEO = "/videos/Mitch_Showreel_2026_Final_25MB.webm";
const ease = [0.65, 0, 0.35, 1] as const;

type Props = {
  eyebrow?: string;
  headline?: string;
  rotatingWords?: string[];
  video?: string;
  videoPoster?: string;
};

/** Muted looping reel; `sound` unmutes it in place. */
function Reel({ src, poster, sound, className }: { src: string; poster?: string; sound?: boolean; className?: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    v.muted = !sound;
    if (sound) v.volume = 1;
    void v.play().catch(() => {});
  }, [sound]);
  return (
    <video
      ref={ref}
      src={src}
      poster={poster}
      autoPlay
      muted
      loop
      playsInline
      preload="auto"
      aria-hidden
      tabIndex={-1}
      className={className}
    />
  );
}

function Headline({ eyebrow, headline, rotatingWords }: Props) {
  return (
    <div className="flex flex-col gap-6 text-white">
      {eyebrow ? <p className="text-sm uppercase tracking-1 text-balance">{eyebrow}</p> : null}
      <h1 className="text-hero-video text-balance">
        {headline}{" "}
        <RotatingWord compact interval={1700} words={rotatingWords && rotatingWords.length ? rotatingWords : undefined} />
      </h1>
    </div>
  );
}

/**
 * Desktop homepage hero — headline on clean black; the reel is a full-content-width 16:9
 * card with only its top half on screen. First scroll down: it opens to full
 * screen under a black veil (plus a fade under the header), with a play
 * cursor; clicking plays it with sound, hides the header and clears the veil;
 * clicking again stops and brings them back. Next
 * scroll down: sound stops and the page carries on. Scrolling back up at the
 * top collapses it to the half-visible card again.
 */
function ReelExpandHero(p: Props) {
  const [expanded, setExpanded] = useState(false);
  const [sound, setSound] = useState(false);
  const [hover, setHover] = useState(false);
  const busy = useRef(false);
  const expandedRef = useRef(false);
  expandedRef.current = expanded;

  // Playing with sound: the header steps aside (and comes back on stop).
  const { setImmersive } = useContext(HeaderConfigContext);
  useEffect(() => {
    setImmersive(sound);
  }, [sound, setImmersive]);
  useEffect(() => () => setImmersive(false), [setImmersive]);

  // Card = content width (page width minus the side gutters), 16:9, its top
  // edge placed so half of it shows above the fold — or lower, so it never
  // crowds the headline.
  const sectionRef = useRef<HTMLElement>(null);
  const headRef = useRef<HTMLDivElement>(null);
  const [box, setBox] = useState({ w: 0, h: 0, left: 0, top: 0, cardW: 0, cardH: 0 });
  useEffect(() => {
    const measure = () => {
      const sec = sectionRef.current?.getBoundingClientRect();
      const headEl = headRef.current;
      if (!sec || !headEl) return;
      const head = headEl.getBoundingClientRect();
      const pad = parseFloat(getComputedStyle(headEl).paddingLeft) || 0;
      const cardW = sec.width - pad * 2;
      const cardH = (cardW * 9) / 16;
      // Breathing room under the headline grows with the screen height.
      const gap = Math.max(72, sec.height * 0.09);
      const top = Math.max(sec.height - cardH / 2, head.bottom - sec.top + gap);
      setBox({ w: sec.width, h: sec.height, left: pad, top, cardW, cardH });
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (sectionRef.current) ro.observe(sectionRef.current);
    if (headRef.current) ro.observe(headRef.current);
    return () => ro.disconnect();
  }, []);

  // One gesture, one step: the swipe that opens (or closes) the reel is used
  // up whole — trackpad momentum included — so the page only moves on to the
  // next section with a fresh scroll once the reel is full screen.
  useEffect(() => {
    let consumed = false;
    let lastWheel = 0;
    const lock = () => {
      busy.current = true;
      consumed = true;
      window.setTimeout(() => (busy.current = false), 1000);
    };
    const block = (e: Event) => {
      e.preventDefault();
      e.stopPropagation();
    };
    const step = (down: boolean, e: Event) => {
      if (window.scrollY > 2) return;
      if (busy.current || consumed) return block(e);
      if (down && !expandedRef.current) {
        block(e);
        lock();
        setExpanded(true);
      } else if (down && expandedRef.current) {
        setSound(false); // let the page carry on to the next section
      } else if (!down && expandedRef.current) {
        block(e);
        lock();
        setSound(false);
        setExpanded(false);
      }
    };
    const onWheel = (e: WheelEvent) => {
      const now = performance.now();
      // A pause between wheel events means a new gesture has started.
      if (now - lastWheel > 200) consumed = false;
      lastWheel = now;
      step(e.deltaY > 0, e);
    };
    let touchY = 0;
    const onTouchStart = (e: TouchEvent) => {
      consumed = false;
      touchY = e.touches[0].clientY;
    };
    const onTouchMove = (e: TouchEvent) => {
      const dy = touchY - e.touches[0].clientY;
      if (Math.abs(dy) > 20) step(dy > 0, e);
    };
    // Once the next section has covered the hero, fold the reel back into its
    // card out of sight — scrolling back up then lands on the headline in one
    // step instead of on the full-screen reel.
    const onScroll = () => {
      if (expandedRef.current && window.scrollY >= window.innerHeight * 0.9) {
        setSound(false);
        setExpanded(false);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("wheel", onWheel, { passive: false, capture: true });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: false, capture: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("wheel", onWheel, { capture: true });
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove, { capture: true });
    };
  }, []);

  // Speaker cursor follows the mouse while the reel is full screen.
  const cx = useMotionValue(0);
  const cy = useMotionValue(0);
  const curX = useSpring(cx, { stiffness: 500, damping: 38, mass: 0.5 });
  const curY = useSpring(cy, { stiffness: 500, damping: 38, mass: 0.5 });
  const onMove = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    const r = sectionRef.current!.getBoundingClientRect();
    cx.set(e.clientX - r.left);
    cy.set(e.clientY - r.top);
    if (!hover) {
      curX.jump(e.clientX - r.left);
      curY.jump(e.clientY - r.top);
      setHover(true);
    }
  };

  return (
    <section
      ref={sectionRef}
      data-theme="dark"
      className="relative h-svh overflow-hidden bg-black"
      onPointerMove={onMove}
      onPointerLeave={() => setHover(false)}
    >
      {/* Rolling slat sea behind the headline; the cursor stirs it */}
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <MicroSlats
          preset="swell"
          color="#242424"
          glintColor="#674f05"
          backgroundColor="transparent"
          slatWidth={16}
          slatHeight={25}
          gap={5}
          roundness={0}
          interactive
          cursorStrength={1}
          cursorSize={75}
          swirl={0}
          trail={1.4}
          lean={0}
          intro
          scale={1.6}
          speed={0.15}
          direction={194}
          stretch={0.45}
          glint={0.9}
          perspective={0.75}
          introDuration={2.1}
        />
      </div>

      {/* Headline — steps up and away as the reel takes the screen */}
      <motion.div
        ref={headRef}
        className="container-page absolute inset-x-0 top-header pt-8"
        initial={false}
        animate={expanded ? { opacity: 0, y: -40 } : { opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease }}
      >
        <Headline {...p} />
      </motion.div>

      {/* The reel: half-visible content-width card → the whole screen */}
      <motion.button
        type="button"
        onClick={() => (expanded ? setSound((s) => !s) : setExpanded(true))}
        aria-label={expanded ? (sound ? "Stop video" : "Play video with sound") : "Open showreel"}
        className="absolute overflow-hidden bg-black"
        // Inline so it beats the site-wide `button { cursor: pointer }` rule:
        // full screen shows only the yellow play/stop cursor.
        style={expanded ? { cursor: "none" } : undefined}
        initial={false}
        animate={
          expanded
            ? { top: 0, left: 0, width: box.w, height: box.h, borderRadius: 0 }
            : { top: box.top, left: box.left, width: box.cardW, height: box.cardH, borderRadius: 24 }
        }
        transition={{ duration: 1, ease }}
      >
        {/* Contained: the whole frame always shows, never cropped */}
        <Reel src={p.video ?? HERO_VIDEO} poster={p.videoPoster} sound={sound} className="absolute inset-x-0 top-1/2 h-auto w-full -translate-y-1/2" />

        {/* Full screen, before play: a black veil over the reel plus a deeper
            fade under the header so it stays readable. Both clear on play. */}
        <motion.span
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-black/50"
          initial={false}
          animate={{ opacity: expanded && !sound ? 1 : 0 }}
          transition={{ duration: 0.8, ease: easeInOutSoft }}
        />
        <motion.span
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-60 bg-linear-to-b from-black/80 to-transparent"
          initial={false}
          animate={{ opacity: expanded && !sound ? 1 : 0 }}
          transition={{ duration: 0.8, ease: easeInOutSoft }}
        />
      </motion.button>

      {/* Play / stop cursor (full screen only) */}
      <motion.div aria-hidden className="pointer-events-none absolute top-0 left-0 z-30" style={{ x: curX, y: curY }}>
        <motion.span
          className="flex size-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-yellow text-black"
          initial={false}
          animate={{ scale: expanded && hover ? 1 : 0, opacity: expanded && hover ? 1 : 0 }}
          transition={{ duration: 0.25, ease: easeOutSoft }}
        >
          {sound ? <Cancel /> : <Play size={30} />}
        </motion.span>
      </motion.div>
    </section>
  );
}

/**
 * Homepage hero. Laptop / desktop (lg+): the expanding reel hero above.
 * Phones and tablets: VideoHero's mobile layout (copy, then the reel with a
 * play button that rotates it into a full-screen player). Until the screen
 * size is known (first paint) a plain black hero holds the space.
 */
export function HomeHero(props: Props) {
  const [desktop, setDesktop] = useState<boolean | null>(null);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const sync = () => setDesktop(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  if (desktop === null) return <section data-theme="dark" className="h-svh bg-black" />;
  return desktop ? <ReelExpandHero {...props} /> : <VideoHero {...props} />;
}
