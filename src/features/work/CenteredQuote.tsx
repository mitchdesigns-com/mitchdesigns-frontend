"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { StrapiImage } from "@/lib/cms/types";
import { staggerChildren, itemFadeUp, fadeUp } from "@/components/motion/variants";
import { useReveal } from "@/components/motion/useReveal";
import { noOrphan } from "@/lib/noOrphan";

type Props = {
  quote: string;
  author?: string;
  role?: string;
  avatar?: StrapiImage;
};

export function CenteredQuote({ quote: rawQuote, author, role }: Props) {
  // Long client reviews come with blank-line paragraph breaks — keep them.
  const paragraphs = rawQuote
    .split(/\n\s*\n/)
    .map((para) => noOrphan(para.replace(/\s+/g, " ").trim(), 32))
    .filter(Boolean);
  const quote = paragraphs.join(" ");
  const { ref, inView } = useReveal();
  const reduced = useReducedMotion();

  const words = quote.split(" ");
  // Long reviews would take seconds to type in word by word — cap the whole reveal at ~1.6s.
  const stagger = Math.min(0.04, 1.6 / Math.max(words.length, 1));
  const authorDelay = words.length * stagger + 0.2;

  if (reduced) {
    return (
      <div className="flex justify-center">
        <div className="max-w-3xl flex flex-col items-center gap-8">
          <blockquote className="flex flex-col gap-4 text-case-quote text-fg text-center">
            {paragraphs.map((para, i) => (
              <p key={i} className="text-balance">{para}</p>
            ))}
          </blockquote>
          {author && (
            <div className="flex flex-col items-center gap-1">
              <p className="text-lg font-semibold text-fg">{author}</p>
              {role && <p className="text-base text-grey-200">{role}</p>}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div ref={ref} className="flex justify-center">
      <motion.div
        className="max-w-3xl flex flex-col items-center gap-8"
        variants={staggerChildren(stagger, 0)}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
      >
        <blockquote className="flex flex-col gap-4 text-case-quote text-fg text-center">
          {paragraphs.map((para, p) => (
            <p key={p} className="text-balance">
              {para.split(" ").map((word, i) => (
                <motion.span
                  key={i}
                  variants={itemFadeUp}
                  style={{ display: "inline-block", marginRight: "0.25em" }}
                >
                  {word}
                </motion.span>
              ))}
            </p>
          ))}
        </blockquote>

        {author && (
          <motion.div
            className="flex flex-col items-center gap-1"
            variants={fadeUp}
            transition={{ delay: authorDelay }}
          >
            <p className="text-lg font-semibold text-fg">{author}</p>
            {role && <p className="text-base text-grey-200">{role}</p>}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
