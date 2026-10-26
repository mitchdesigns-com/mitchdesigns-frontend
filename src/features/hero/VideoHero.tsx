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
import { Close } from "@/components/icons/Close";
import { Play } from "@/components/icons/Play";
import { HeaderConfigContext } from "@/context/HeaderConfigContext";
import { cn } from "@/lib/cn";
import { easeInOutSoft, easeOutSoft } from "@/lib/motion";
import { RotatingWord } from "./RotatingWord";

const HERO_VIDEO = "/videos/Mitch_Showreel_2026_Final_25MB.webm";
const VOLUME_FADE_MS = 600;
/** Mobile: how long the reel takes to rotate into / out of full screen. */
const EXPAND_MS = 650;
const EXPAND_EASE = "cubic-bezier(0.65, 0, 0.35, 1)";

/** Mobile full-screen player: inline → opening ("from" frame) → open → closing. */
type ReelPhase = "inline" | "from" | "open" | "closing";

/** Optional browser APIs (Android Chrome); absent on iOS Safari. */
type LockableOrientation = ScreenOrientation & {
  lock?: (orientation: "landscape") => Promise<void>;
};

type VideoHeroProps = {
  eyebrow?: string;
  headline?: string;
  rotatingWords?: string[];
  /** CMS showreel; falls back to the bundled webm. */
  video?: string;
  videoPoster?: string;
  playLabel?: string;
  stopLabel?: string;
};

/**
 * Homepage hero: a muted reel loops behind a 60% black overlay. Clicking
 * anywhere unmutes it in place (no restart) — the header slides up, the copy
 * drops away and the overlay fades out. Clicking again ("Stop") mutes it and
 * brings everything back while the reel keeps playing.
 *
 * Below lg the copy sits under the header on 3 lines and the reel fills the
 * rest of the screen at full width (cropping its sides on tall screens),
 * with a yellow play button straddling its top edge. Tapping it rotates the reel into a full-screen
 * landscape player with sound (real fullscreen + orientation lock where the
 * browser allows it, a CSS-rotated frame everywhere else).
 */
export function VideoHero({
  eyebrow = "MitchDesigns — Website & Mobile App Design Company Based in Egypt",
  headline = "Start Building Digital Experiences that",
  rotatingWords,
  video = HERO_VIDEO,
  videoPoster,
  playLabel = "Play Video",
  stopLabel = "Stop",
}: VideoHeroProps = {}) {
  const sectionRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const closeFallback = useRef<number | undefined>(undefined);
  const volumeFrame = useRef(0);
  const fadeFallback = useRef<number | undefined>(undefined);
  const lastPointer = useRef<{ x: number; y: number } | null>(null);
  const { setImmersive } = useContext(HeaderConfigContext);
  const reducedMotion = useReducedMotion();

  const [playing, setPlaying] = useState(false);
  const [canHover, setCanHover] = useState(true);
  const [pointerInside, setPointerInside] = useState(false);
  const [focusVisible, setFocusVisible] = useState(false);
  const [phase, setPhase] = useState<ReelPhase>("inline");
  const [frameRect, setFrameRect] = useState<DOMRect | null>(null);
  const [viewport, setViewport] = useState({ w: 0, h: 0 });

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
      window.clearTimeout(closeFallback.current);
    },
    [],
  );

  // Mobile: lift the reel out of its frame and rotate it to fill the screen.
  const openReel = useCallback(() => {
    const frame = frameRef.current;
    if (!frame) return;
    setFrameRect(frame.getBoundingClientRect());
    setViewport({ w: window.innerWidth, h: window.innerHeight });
    setPhase("from");
    // Two frames so the "from" box paints before the transition starts.
    requestAnimationFrame(() => requestAnimationFrame(() => setPhase("open")));
    playWithSound();
    // Where supported, go truly full screen and turn the device to landscape;
    // the CSS rotation drops by itself once the viewport is landscape.
    const root = document.documentElement;
    if (root.requestFullscreen && !document.fullscreenElement) {
      root
        .requestFullscreen({ navigationUI: "hide" })
        .then(() => (screen.orientation as LockableOrientation).lock?.("landscape"))
        .catch(() => {});
    }
  }, [playWithSound]);

  const closeReel = useCallback(() => {
    const frame = frameRef.current;
    if (frame) setFrameRect(frame.getBoundingClientRect());
    setPhase("closing");
    stopSound();
    if (document.fullscreenElement) {
      screen.orientation?.unlock?.();
      void document.exitFullscreen().catch(() => {});
    }
    window.clearTimeout(closeFallback.current);
    closeFallback.current = window.setTimeout(() => setPhase("inline"), EXPAND_MS + 100);
  }, [stopSound]);

  const expanded = phase !== "inline";
  const stop = expanded ? closeReel : stopSound;

  // Keep the open player sized to the screen (rotation, fullscreen, URL bar).
  useEffect(() => {
    if (!expanded) return;
    const sync = () => setViewport({ w: window.innerWidth, h: window.innerHeight });
    // Leaving real fullscreen (e.g. Android back gesture) closes the player.
    const onFullscreen = () => {
      if (!document.fullscreenElement && phase === "open") closeReel();
    };
    window.addEventListener("resize", sync);
    document.addEventListener("fullscreenchange", onFullscreen);
    return () => {
      window.removeEventListener("resize", sync);
      document.removeEventListener("fullscreenchange", onFullscreen);
    };
  }, [expanded, phase, closeReel]);

  // Re-measure the frame after a rotation so closing lands back on it.
  useEffect(() => {
    if (phase !== "closing") return;
    const frame = frameRef.current;
    if (frame) setFrameRect(frame.getBoundingClientRect());
  }, [phase, viewport]);

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
      if (e.key === "Escape") stop();
    };
    const onScroll = () => {
      if (Math.abs(window.scrollY - startY) > 80) stop();
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("scroll", onScroll);
    };
  }, [playing, stop]);

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

  // Line cap: two lines at lg+, three below. The type tokens already size the
  // default headline to fit; this safety net shrinks it further if other
  // copy (e.g. a longer CMS headline) would still wrap past the cap, or —
  // below lg — if the copy would squeeze the reel under its minimum height.
  useLayoutEffect(() => {
    const h1 = headlineRef.current;
    const box = h1?.parentElement;
    const section = sectionRef.current;
    if (!h1 || !box || !section) return;
    let lastSize = "";
    const fit = (force = false) => {
      const size = `${box.clientWidth}x${section.clientHeight}`;
      if (!force && size === lastSize) return;
      lastSize = size;
      h1.style.fontSize = "";
      const desktop = window.matchMedia("(min-width: 1024px)").matches;
      const maxLines = desktop ? 2 : 3;
      for (let i = 0; i < 12; i++) {
        const lineHeight = parseFloat(getComputedStyle(h1).lineHeight);
        const fitsLines = h1.getBoundingClientRect().height <= lineHeight * maxLines + 1;
        const fitsScreen = desktop || section.scrollHeight <= section.clientHeight + 1;
        if (fitsLines && fitsScreen) break;
        h1.style.fontSize = `${parseFloat(getComputedStyle(h1).fontSize) * 0.94}px`;
      }
    };
    fit(true);
    const ro = new ResizeObserver(() => fit());
    ro.observe(box);
    ro.observe(section);
    // Re-check once the display font has loaded (metrics change the wrap).
    void document.fonts?.ready.then(() => fit(true));
    return () => ro.disconnect();
  }, [headline]);

  const pillShown = pointerInside || focusVisible;

  // Below lg the headline breaks into three set lines: everything but its
  // last two words / the last two words / the rotating word.
  const words = headline.trim().split(/\s+/);
  const lead = words.length > 2 ? words.slice(0, -2).join(" ") : "";
  const tail = words.slice(-2).join(" ");

  // The moving player box. "from"/"closing" sit exactly on the inline frame;
  // "open" fills the screen, turned 90° while the viewport is portrait.
  const portrait = viewport.h > viewport.w;
  const transition = `left ${EXPAND_MS}ms ${EXPAND_EASE}, top ${EXPAND_MS}ms ${EXPAND_EASE}, width ${EXPAND_MS}ms ${EXPAND_EASE}, height ${EXPAND_MS}ms ${EXPAND_EASE}, transform ${EXPAND_MS}ms ${EXPAND_EASE}`;
  let playerStyle: React.CSSProperties | undefined;
  if (phase === "open") {
    playerStyle = {
      left: viewport.w / 2,
      top: viewport.h / 2,
      width: portrait ? viewport.h : viewport.w,
      height: portrait ? viewport.w : viewport.h,
      transform: `translate(-50%, -50%) rotate(${portrait ? 90 : 0}deg)`,
      transition,
    };
  } else if (expanded && frameRect) {
    playerStyle = {
      left: frameRect.left + frameRect.width / 2,
      top: frameRect.top + frameRect.height / 2,
      width: frameRect.width,
      height: frameRect.height,
      transform: "translate(-50%, -50%) rotate(0deg)",
      transition: phase === "closing" ? transition : "none",
    };
  }

  return (
    <section
      ref={sectionRef}
      data-theme="dark"
      // Below lg: copy under the header, the reel filling the rest down to the
      // bottom edge (cropped to fill, so no black band on any phone height).
      className="relative isolate flex h-svh flex-col justify-end overflow-hidden bg-black pt-header lg:block lg:p-0"
      onPointerEnter={onPointerEnter}
      onPointerMove={onPointerMove}
      onPointerLeave={() => setPointerInside(false)}
    >
      {/* Mobile: 16:9 frame holding the reel's place; lg+: the whole hero. */}
      <div
        ref={frameRef}
        className="relative order-2 min-h-reel-min w-full flex-1 lg:absolute lg:inset-0 lg:min-h-0"
      >
        <div
          className={cn(
            expanded ? "fixed z-50 touch-none overflow-hidden bg-black" : "absolute inset-0",
          )}
          style={playerStyle}
          onTransitionEnd={(e) => {
            if (e.target === e.currentTarget && e.propertyName === "transform" && phase === "closing") {
              window.clearTimeout(closeFallback.current);
              setPhase("inline");
            }
          }}
        >
          <video
            ref={videoRef}
            src={video}
            poster={videoPoster}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            disablePictureInPicture
            disableRemotePlayback
            aria-hidden
            tabIndex={-1}
            // Below lg: covers the frame, centred (whole frame, contained, once
            // full screen). lg+: full width, frame ratio kept (16:9 → height
            // 56.25vw). When the frame is taller than the hero, nudge it up by
            // up to 5vw so a little of the cut-off bottom shows; it never lifts
            // past the hero's bottom edge, so no black gap opens where the
            // whole frame already fits.
            className={cn(
              "absolute inset-x-0 top-0 size-full lg:top-reel-lift lg:h-auto",
              expanded ? "object-contain" : "object-cover",
            )}
          />

          {/* Mobile tap target + label; the full-screen player gets a close button. */}
          {expanded ? (
            <button
              type="button"
              aria-label="Close video"
              onClick={closeReel}
              className={cn(
                "absolute right-4 top-4 flex size-11 items-center justify-center rounded-full bg-black/50 text-white transition-opacity duration-300",
                phase === "open" ? "opacity-100" : "opacity-0",
              )}
            >
              <Close />
            </button>
          ) : (
            <button
              type="button"
              aria-label="Play video full screen with sound"
              onClick={openReel}
              className="absolute inset-0 outline-none lg:hidden"
            >
              {/* Half above the reel, half on it, aligned to the page gutter. */}
              <span
                aria-hidden
                className="absolute right-4 top-0 flex size-16 -translate-y-1/2 items-center justify-center rounded-full bg-yellow text-black"
              >
                <Play size={28} />
              </span>
            </button>
          )}
        </div>
      </div>

      <motion.div
        aria-hidden
        // 70% black at the top and bottom edges, 60% through the middle; the
        // whole layer fades out while the reel plays with sound.
        className="pointer-events-none absolute inset-0 hidden bg-linear-to-b from-black/70 via-black/60 to-black/70 lg:block"
        initial={false}
        animate={{ opacity: playing ? 0 : 1 }}
        transition={{ duration: 0.9, ease: easeInOutSoft }}
      />

      {/* Whole-hero hit area (lg+). The pill below is its visible label. */}
      <button
        type="button"
        aria-pressed={playing}
        aria-label={playing ? "Stop video sound" : "Play video with sound"}
        onClick={playing ? stopSound : playWithSound}
        onFocus={onFocus}
        onBlur={() => setFocusVisible(false)}
        className={cn(
          "absolute inset-0 z-10 hidden outline-none lg:block",
          canHover && "cursor-none",
        )}
      />

      <motion.div
        className="pointer-events-none order-1 shrink-0 pb-hero-gap lg:absolute lg:inset-x-0 lg:bottom-0 lg:z-20 lg:pb-0"
        initial={false}
        animate={playing ? { y: 64, opacity: 0 } : { y: 0, opacity: 1 }}
        transition={{
          duration: playing ? 0.6 : 0.8,
          delay: playing ? 0 : 0.15,
          ease: easeInOutSoft,
        }}
        inert={playing}
      >
        <div className="container-page w-full lg:pb-15">
          <div className="flex flex-col gap-4 text-white lg:gap-6">
            {eyebrow ? (
              <p className="text-base font-medium uppercase tracking-1 text-balance md:text-lg">{eyebrow}</p>
            ) : null}
            <h1 ref={headlineRef} className="text-hero-mobile text-balance lg:text-hero-video">
              {lead ? (
                <>
                  {lead}{" "}
                  <br className="lg:hidden" />
                </>
              ) : null}
              {tail}{" "}
              <br className="lg:hidden" />
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
          className="pointer-events-none absolute left-0 top-0 z-30 hidden lg:block"
          style={{ x: pillX, y: pillY }}
        >
          <motion.div
            className="-translate-x-1/2 -translate-y-1/2"
            initial={false}
            animate={{ scale: pillShown ? 1 : 0.5, opacity: pillShown ? 1 : 0 }}
            transition={{ duration: 0.25, ease: easeOutSoft }}
          >
            <VideoPill playing={playing} playLabel={playLabel} stopLabel={stopLabel} />
          </motion.div>
        </motion.div>
      ) : (
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-1/2 z-30 hidden -translate-x-1/2 -translate-y-1/2 lg:block"
        >
          <VideoPill playing={playing} playLabel={playLabel} stopLabel={stopLabel} />
        </div>
      )}
    </section>
  );
}

function VideoPill({
  playing,
  playLabel,
  stopLabel,
}: {
  playing: boolean;
  playLabel: string;
  stopLabel: string;
}) {
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
          {playing ? stopLabel : playLabel}
          {playing ? <Cancel /> : <Play />}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
