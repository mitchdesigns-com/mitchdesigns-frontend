"use client";

import { motion, useTransform, type MotionValue } from "framer-motion";

/** Laptop progress over which the words come in (the lid is almost open). */
const IN: [number, number] = [0.45, 0.78];

/** One letter: rises into place a beat after the one before it. */
function Letter({ char, i, progress, from }: { char: string; i: number; progress: MotionValue<number>; from: 1 | -1 }) {
  const start = IN[0] + i * 0.035;
  const end = start + 0.16;
  const y = useTransform(progress, [start, end], ["110%", "0%"]);
  const rotate = useTransform(progress, [start, end], [from * 12, 0]);
  const opacity = useTransform(progress, [start, start + 0.06], [0, 1]);
  return (
    <motion.span className="inline-block" style={{ y, rotate, opacity }}>
      {char}
    </motion.span>
  );
}

/** A word that slides in from its side of the screen, letters rising in turn. */
function Word({ text, progress, from }: { text: string; progress: MotionValue<number>; from: 1 | -1 }) {
  const x = useTransform(progress, IN, [`${from * 40}%`, "0%"]);
  const letters = text.split("");
  return (
    <motion.span className="inline-flex overflow-hidden" style={{ x }}>
      {letters.map((c, i) => (
        // Letters nearest the laptop arrive first.
        <Letter key={i} char={c} i={from === -1 ? letters.length - 1 - i : i} progress={progress} from={from} />
      ))}
    </motion.span>
  );
}

/**
 * "HIGH ROAS" in big solid yellow behind the laptop: HIGH on the left, ROAS
 * on the right, each tucked under the edge of the open screen. They come in
 * as the lid opens and leave as it closes.
 */
export function RoasWords({ progress }: { progress: MotionValue<number> }) {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 flex items-center justify-center">
      <div className="flex -translate-y-1/4 items-center gap-roas-gap-phone font-black uppercase leading-none tracking-tight text-roas-phone text-yellow md:gap-roas-gap md:text-roas">
        <Word text="High" progress={progress} from={-1} />
        <Word text="ROAS" progress={progress} from={1} />
      </div>
    </div>
  );
}
