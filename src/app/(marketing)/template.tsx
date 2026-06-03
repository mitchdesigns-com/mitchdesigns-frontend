"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Logo } from "@/components/icons/Logo";

const COLUMNS = 5;
const EASE_CINEMA = [0.76, 0, 0.24, 1] as const;

export default function Template({ children }: { children: React.ReactNode }) {
  const reduced = useReducedMotion();

  if (reduced) return <>{children}</>;

  return (
    <>
      <div className="pointer-events-none fixed inset-0 z-[9999] flex overflow-hidden">
        {Array.from({ length: COLUMNS }).map((_, i) => (
          <motion.div
            key={i}
            className="h-full flex-1 bg-black"
            initial={{ y: "0%" }}
            animate={{ y: "-100%" }}
            transition={{ duration: 0.8, ease: EASE_CINEMA, delay: 0.25 + i * 0.07 }}
          />
        ))}

        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          initial={{ opacity: 1, scale: 1 }}
          animate={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.35, ease: EASE_CINEMA, delay: 0.15 }}
        >
          <Logo className="size-20" />
        </motion.div>
      </div>

      {children}
    </>
  );
}
