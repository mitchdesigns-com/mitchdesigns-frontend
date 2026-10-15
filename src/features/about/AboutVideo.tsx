"use client";

import { useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Play } from "@/components/icons/Play";
import { easeOutSoft } from "@/lib/motion";

/**
 * The company film, shown frozen on an early frame (it never autoplays)
 * with a yellow play circle over it; clicking plays it right in the frame,
 * with sound and controls.
 */
export function AboutVideo({ src, title }: { src: string; title: string }) {
  const video = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const reduced = useReducedMotion();

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
        src={`${src}#t=1`}
        preload="metadata"
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
