"use client";

import {
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "framer-motion";
import { Cancel } from "@/components/icons/Cancel";
import { Play } from "@/components/icons/Play";
import { HeaderConfigContext } from "@/context/HeaderConfigContext";
import { cn } from "@/lib/cn";
import { easeInOutSoft, easeOutSoft } from "@/lib/motion";
import { RotatingWord } from "./RotatingWord";

const HERO_VIDEO = "/videos/Mitch%20Showreel%202026%201080p.webm";
const VOLUME_FADE_MS = 600;

type VideoHeroProps = {
  eyebrow?: string;
  headline?: string;
  rotatingWords?: string[];
};

/**
 * Homepage hero: a muted reel loops behind a 60% black overlay. Clicking
 * anywhere unmutes it in place (no restart) — the header slides up, the copy
 * drops away and the overlay fades out. Clicking again ("Stop") mutes it and
 * brings everything back while the reel keeps playing.
 */
export function VideoHero({
  eyebrow = "MitchDesigns — Website & Mobile App Design Company Based in Egypt",
  headline = "Start Building Digital Experiences that",
  rotatingWords,
}: VideoHeroProps = {}) {
  const sectionRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const volumeFrame = useRef(0);
  const fadeFallback = useRef<number | undefined>(undefined);
  const lastPointer = useRef<{ x: number; y: number } | null>(null);
  const { setImmersive } = useContext(HeaderConfigContext);
  const reducedMotion = useReducedMotion();

  const [playing, setPlaying] = useState(false);
  const [canHover, setCanHover] = useState(true);
  const [pointerInside, setPointerInside] = useState(false);
  const [focusVisible, setFocusVisible] = useState(false);

  // Cursor-follow pill position, section-relative.
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const pillX = useSpring(pointerX, { stiffness: 400, damping: 34, mass: 0.6 });
  const pillY = useSpring(pointerY, { stiffness: 400, damping: 34, mass: 0.6 });

  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    const sync = () => setCanHover(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  // Background loop: muted autoplay, or a still first frame for reduced motion.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = true;
    if (reducedMotion) video.pause();
    else void video.play().catch(() => {});
  }, [reducedMotion]);

  const fadeVolume = useCallback((to: number, onDone?: () => void) => {
    const video = videoRef.current;
    if (!video) return;
    cancelAnimationFrame(volumeFrame.current);
    window.clearTimeout(fadeFallback.current);
    const from = video.volume;
    const start = performance.now();
    const finish = () => {
      cancelAnimationFrame(volumeFrame.current);
      window.clearTimeout(fadeFallback.current);
      video.volume = to;
      onDone?.();
    };
    const step = (now: number) => {
      // rAF timestamps can predate `start`; clamp so volume never leaves
      // [0, 1] (out-of-range throws and would strand the fade half-way).
      const t = Math.min(1, Math.max(0, (now - start) / VOLUME_FADE_MS));
      video.volume = Math.min(1, Math.max(0, from + (to - from) * t));
      if (t < 1) volumeFrame.current = requestAnimationFrame(step);
      else finish();
    };
    volumeFrame.current = requestAnimationFrame(step);
    // rAF pauses in background tabs — make sure the fade still lands.
    fadeFallback.current = window.setTimeout(finish, VOLUME_FADE_MS + 150);
  }, []);

  const playWithSound = useCallback(() => {
    const video = videoRef.current;
    setPlaying(true);
    if (!video) return;
    // Keep currentTime — the reel continues from where the loop already is.
    video.volume = 0;
    video.muted = false;
    if (video.paused) void video.play().catch(() => {});
    fadeVolume(1);
  }, [fadeVolume]);

  const stopSound = useCallback(() => {
    const video = videoRef.current;
    setPlaying(false);
    if (!video) return;
    fadeVolume(0, () => {
      video.muted = true;
      if (reducedMotion) video.pause();
    });
  }, [fadeVolume, reducedMotion]);

  useEffect(
    () => () => {
      cancelAnimationFrame(volumeFrame.current);
      window.clearTimeout(fadeFallback.current);
    },
    [],
  );

  // Header + floating CTAs step aside while the reel is full-screen.
  useEffect(() => {
    setImmersive(playing);
  }, [playing, setImmersive]);
  useEffect(() => () => setImmersive(false), [setImmersive]);

  // While playing: Esc stops, and so does starting to scroll on (the hero is
  // pinned while the next section opens over it, so visibility can't tell).
  useEffect(() => {
    if (!playing) return;
    const startY = window.scrollY;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") stopSound();
    };
    const onScroll = () => {
      if (Math.abs(window.scrollY - startY) > 80) stopSound();
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("scroll", onScroll);
    };
  }, [playing, stopSound]);

  const placePill = useCallback(
    (clientX: number, clientY: number, jump = false) => {
      const rect = sectionRef.current?.getBoundingClientRect();
      if (!rect) return;
      pointerX.set(clientX - rect.left);
      pointerY.set(clientY - rect.top);
      if (jump) {
        pillX.jump(clientX - rect.left);
        pillY.jump(clientY - rect.top);
      }
    },
    [pointerX, pointerY, pillX, pillY],
  );

  // Page scroll moves the section under a still mouse — keep the pill on it.
  useEffect(() => {
    if (!pointerInside) return;
    const onScroll = () => {
      if (lastPointer.current) placePill(lastPointer.current.x, lastPointer.current.y);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [pointerInside, placePill]);

  function onPointerEnter(e: React.PointerEvent) {
    if (e.pointerType !== "mouse") return;
    lastPointer.current = { x: e.clientX, y: e.clientY };
    placePill(e.clientX, e.clientY, true);
    setPointerInside(true);
  }

  function onPointerMove(e: React.PointerEvent) {
    if (e.pointerType !== "mouse") return;
    lastPointer.current = { x: e.clientX, y: e.clientY };
    placePill(e.clientX, e.clientY, !pointerInside);
    if (!pointerInside) setPointerInside(true);
  }

  function onFocus(e: React.FocusEvent<HTMLButtonElement>) {
    if (!e.currentTarget.matches(":focus-visible")) return;
    setFocusVisible(true);
    if (!pointerInside) {
      const rect = e.currentTarget.getBoundingClientRect();
      placePill(rect.left + rect.width / 2, rect.top + rect.height / 2, true);
    }
  }

  // Two-line rule. The type token already sizes the default headline to fit
  // on two lines at any width; this safety net shrinks it further if other
  // copy (e.g. a longer CMS headline) would still wrap onto a third line.
  useLayoutEffect(() => {
    const h1 = headlineRef.current;
    const box = h1?.parentElement;
    if (!h1 || !box) return;
    let lastWidth = -1;
    const fit = (force = false) => {
      const width = box.clientWidth;
      if (!force && width === lastWidth) return;
      lastWidth = width;
      h1.style.fontSize = "";
      for (let i = 0; i < 12; i++) {
        const lineHeight = parseFloat(getComputedStyle(h1).lineHeight);
        if (h1.getBoundingClientRect().height <= lineHeight * 2 + 1) break;
        h1.style.fontSize = `${parseFloat(getComputedStyle(h1).fontSize) * 0.94}px`;
      }
    };
    fit(true);
    const ro = new ResizeObserver(() => fit());
    ro.observe(box);
    // Re-check once the display font has loaded (metrics change the wrap).
    void document.fonts?.ready.then(() => fit(true));
    return () => ro.disconnect();
  }, [headline]);

  const pillShown = pointerInside || focusVisible;

  return (
    <section
      ref={sectionRef}
      data-theme="dark"
      className="relative isolate h-svh overflow-hidden bg-black"
      onPointerEnter={onPointerEnter}
      onPointerMove={onPointerMove}
      onPointerLeave={() => setPointerInside(false)}
    >
      <video
        ref={videoRef}
        src={HERO_VIDEO}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        disablePictureInPicture
        disableRemotePlayback
        aria-hidden
        tabIndex={-1}
        // Below lg: fills the hero as a cropped, centred background.
        // lg+: full width, frame ratio kept (16:9 → height 56.25vw). When the
        // frame is taller than the hero, nudge it up by up to 5vw so a little
        // of the cut-off bottom shows; it never lifts past the hero's bottom
        // edge, so no black gap opens where the whole frame already fits.
        // (On small screens that clamp resolves to 0, i.e. top-aligned.)
        className="absolute inset-x-0 size-full object-cover lg:h-auto"
        style={{ top: "clamp(-5vw, calc(100% - 56.25vw), 0px)" }}
      />

      <motion.div
        aria-hidden
        // 70% black at the top and bottom edges, 60% through the middle; the
        // whole layer fades out while the reel plays with sound.
        className="pointer-events-none absolute inset-0 bg-linear-to-b from-black/70 via-black/60 to-black/70"
        initial={false}
        animate={{ opacity: playing ? 0 : 1 }}
        transition={{ duration: 0.9, ease: easeInOutSoft }}
      />

      {/* Whole-hero hit area. The pill below is its visible label. */}
      <button
        type="button"
        aria-pressed={playing}
        aria-label={playing ? "Stop video sound" : "Play video with sound"}
        onClick={playing ? stopSound : playWithSound}
        onFocus={onFocus}
        onBlur={() => setFocusVisible(false)}
        className={cn(
          "absolute inset-0 z-10 outline-none",
          canHover && "cursor-none",
        )}
      />

      <motion.div
        className="pointer-events-none absolute inset-x-0 bottom-0 z-20"
        initial={false}
        animate={playing ? { y: 64, opacity: 0 } : { y: 0, opacity: 1 }}
        transition={{
          duration: playing ? 0.6 : 0.8,
          delay: playing ? 0 : 0.15,
          ease: easeInOutSoft,
        }}
        inert={playing}
      >
        <div className="container-page pb-10 lg:pb-15">
          <div className="flex flex-col gap-4 text-white lg:gap-6">
            {eyebrow ? (
              <p className="text-sm uppercase tracking-1 text-balance">{eyebrow}</p>
            ) : null}
            <h1 ref={headlineRef} className="text-hero-video text-balance">
              {headline}{" "}
              <RotatingWord
                compact
                interval={1700}
                words={rotatingWords && rotatingWords.length ? rotatingWords : undefined}
              />
            </h1>
          </div>
        </div>
      </motion.div>

      {canHover ? (
        <motion.div
          aria-hidden
          className="pointer-events-none absolute left-0 top-0 z-30"
          style={{ x: pillX, y: pillY }}
        >
          <motion.div
            className="-translate-x-1/2 -translate-y-1/2"
            initial={false}
            animate={{ scale: pillShown ? 1 : 0.5, opacity: pillShown ? 1 : 0 }}
            transition={{ duration: 0.25, ease: easeOutSoft }}
          >
            <VideoPill playing={playing} />
          </motion.div>
        </motion.div>
      ) : (
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-1/2 z-30 -translate-x-1/2 -translate-y-1/2"
        >
          <VideoPill playing={playing} />
        </div>
      )}
    </section>
  );
}

function VideoPill({ playing }: { playing: boolean }) {
  return (
    <span className="flex overflow-hidden rounded-pill bg-yellow px-6 py-3 text-lg font-medium tracking-1 text-black">
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={playing ? "stop" : "play"}
          className="flex items-center gap-2 whitespace-nowrap"
          initial={{ y: 12, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -12, opacity: 0 }}
          transition={{ duration: 0.2, ease: easeOutSoft }}
        >
          {playing ? "Stop" : "Play Video"}
          {playing ? <Cancel /> : <Play />}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
