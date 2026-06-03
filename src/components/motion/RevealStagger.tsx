"use client";

import { motion, useReducedMotion } from "framer-motion";
import { staggerChildren, itemFadeUp } from "./variants";
import { useReveal } from "./useReveal";

const TAGS = {
  div: motion.div,
  ul: motion.ul,
  ol: motion.ol,
  li: motion.li,
  dl: motion.dl,
  dt: motion.dt,
  dd: motion.dd,
  article: motion.article,
  section: motion.section,
} as const;

type Tag = keyof typeof TAGS;

type StaggerProps = {
  children: React.ReactNode;
  className?: string;
  as?: Tag;
  /** Seconds between each child's reveal. */
  stagger?: number;
  /** Delay before the first child reveals. */
  delay?: number;
};

/** Container that reveals its <RevealItem> children one-by-one once scrolled
 *  into view. Can BE the grid/flex row itself via `className`. */
export function RevealStagger({
  children,
  className,
  as = "div",
  stagger = 0.12,
  delay = 0,
}: StaggerProps) {
  const { ref, inView } = useReveal<HTMLElement>();
  const reduced = useReducedMotion();
  const MotionTag = TAGS[as];

  return (
    <MotionTag
      ref={ref as React.Ref<never>}
      className={className}
      variants={staggerChildren(stagger, delay)}
      initial={reduced ? "visible" : "hidden"}
      animate={inView || reduced ? "visible" : "hidden"}
    >
      {children}
    </MotionTag>
  );
}

type ItemProps = {
  children: React.ReactNode;
  className?: string;
  as?: Tag;
};

/** A single staggered child. Must live inside a <RevealStagger>. */
export function RevealItem({ children, className, as = "div" }: ItemProps) {
  const MotionTag = TAGS[as];
  return (
    <MotionTag className={className} variants={itemFadeUp}>
      {children}
    </MotionTag>
  );
}
