"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { StrapiImage } from "@/lib/cms/types";
import { staggerChildren, itemFadeUp, fadeUp } from "@/components/motion/variants";
import { useReveal } from "@/components/motion/useReveal";

type Props = {
  quote: string;
  author?: string;
  role?: string;
  avatar?: StrapiImage;
};

export function CenteredQuote({ quote, author, role }: Props) {
  const { ref, inView } = useReveal();
  const reduced = useReducedMotion();

  const words = quote.split(" ");
  const authorDelay = words.length * 0.04 + 0.2;

  if (reduced) {
    return (
      <div className="flex justify-center">
        <div className="max-w-4xl flex flex-col items-center gap-10">
          <blockquote className="text-blog-quote font-bold text-fg text-center text-balance">
            {quote}
          </blockquote>
          {author && (
            <div className="flex flex-col items-center gap-1">
              <p className="text-xl font-medium text-fg">{author}</p>
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
        className="max-w-4xl flex flex-col items-center gap-10"
        variants={staggerChildren(0.04, 0)}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
      >
        <blockquote className="text-blog-quote font-bold text-fg text-center text-balance">
          {words.map((word, i) => (
            <motion.span
              key={i}
              variants={itemFadeUp}
              style={{ display: "inline-block", marginRight: "0.25em" }}
            >
              {word}
            </motion.span>
          ))}
        </blockquote>

        {author && (
          <motion.div
            className="flex flex-col items-center gap-1"
            variants={fadeUp}
            transition={{ delay: authorDelay }}
          >
            <p className="text-xl font-medium text-fg">{author}</p>
            {role && <p className="text-base text-grey-200">{role}</p>}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
