"use client";

import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { staggerChildren, itemFadeUp } from "@/components/motion/variants";

type Props = {
  heading: string;
  items: Array<{ title: string; body: string }>;
};

export function TextInRow({ heading, items }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  const reduced = useReducedMotion();

  if (!items.length) return null;

  return (
    <motion.div
      ref={ref}
      className="flex flex-col items-end"
      variants={staggerChildren(0.1)}
      initial={reduced ? "visible" : "hidden"}
      animate={inView || reduced ? "visible" : "hidden"}
    >
      <div className="w-full flex flex-col gap-10 lg:w-1/2">
        <motion.h2 variants={itemFadeUp} className="text-hero-3 font-bold text-fg">
          {heading}
        </motion.h2>

        {items.map((item) => (
          <motion.div key={item.title} variants={itemFadeUp} className="flex flex-col gap-2">
            <p className="text-lg font-medium text-fg">{item.title}</p>
            <p className="text-lg text-grey-200 text-balance">{item.body}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
