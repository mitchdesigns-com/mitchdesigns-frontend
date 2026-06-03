"use client";

import { motion, useReducedMotion } from "framer-motion";
import { staggerChildren, itemFadeUp } from "./variants";
import { useReveal } from "./useReveal";

type Props = {
  text: string;
  className?: string;
  as?: "p" | "h1" | "h2" | "h3" | "blockquote";
  delay?: number;
};

export function AnimatedText({ text, className, as = "p", delay = 0 }: Props) {
  const { ref, inView } = useReveal<HTMLElement>();
  const reduced = useReducedMotion();

  const words = text.split(" ");
  const Tag = as;

  if (reduced) {
    return (
      <Tag ref={ref as React.RefObject<never>} className={className}>
        {text}
      </Tag>
    );
  }

  const MotionTag = motion[as];

  return (
    <MotionTag
      ref={ref as React.RefObject<never>}
      className={className}
      variants={staggerChildren(0.03, delay)}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
    >
      {words.map((word, i) => (
        <motion.span
          key={i}
          variants={itemFadeUp}
          style={{ display: "inline-block", marginRight: "0.25em" }}
        >
          {word}
        </motion.span>
      ))}
    </MotionTag>
  );
}
