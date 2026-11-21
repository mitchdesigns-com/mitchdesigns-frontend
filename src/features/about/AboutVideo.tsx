"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Play } from "@/components/icons/Play";
import { easeOutSoft } from "@/lib/motion";

/**
 * The company film, shown frozen on an early frame (it never autoplays)
 * with a yellow play circle over it; clicking plays it right in the frame,
 * with sound and controls.
 */
export function AboutVideo({
  src,
  title,
  poster,
  phoneSrc,
  phonePoster,
}: {
  src: string;
  title: string;
  /** Portrait cut for the portrait frame on phones (mp4, so iPhones play it). */
  phoneSrc?: string;
  phonePoster?: string;
  /** Still shown before play; without one the frame at 1s is used. */
  poster?: string;
}) {
  const video = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const reduced = useReducedMotion();
  // Phones show the frame in portrait (4:5): use the portrait cut there.
  const [phone, setPhone] = useState(false);
  useEffect(() => {
    if (!phoneSrc) return;
    const mq = window.matchMedia("(max-width: 639px)");
    const sync = () => setPhone(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, [phoneSrc]);
  const film = phone && phoneSrc ? phoneSrc : src;
  const still = phone && phoneSrc ? (phonePoster ?? poster) : poster;

  const play = () => {
    const v = video.current;
    if (!v) return;
    setPlaying(true);
    v.currentTime = 0;
    void v.play();
  };

  return (
    <div className="relative aspect-4/5 bg-black sm:aspect-video">
      {/* "#t=1" makes the browser load and show the frame at 1s as a still. */}
      <video
        ref={video}
        key={film}
        src={still ? film : `${film}#t=1`}
        poster={still}
        preload={still ? "none" : "metadata"}
        playsInline
        controls={playing}
        onEnded={() => setPlaying(false)}
        className="absolute inset-0 size-full object-cover"
        aria-label={title}
      >
        <track kind="captions" />
      </video>

      {!playing && (
        <button
          type="button"
          onClick={play}
          aria-label={`Play ${title}`}
          className="group absolute inset-0 flex items-center justify-center bg-black/20"
        >
          <motion.span
            initial={reduced ? false : { scale: 0.6, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.6, ease: easeOutSoft }}
            className="relative flex size-24 items-center justify-center rounded-full bg-yellow text-black transition-transform duration-500 ease-out-soft group-hover:scale-110 md:size-28"
          >
            {/* Soft pulse ring inviting the click */}
            <span className="absolute inset-0 animate-ping rounded-full bg-yellow/40" aria-hidden />
            <Play size={36} className="relative" />
          </motion.span>
        </button>
      )}
    </div>
  );
}
