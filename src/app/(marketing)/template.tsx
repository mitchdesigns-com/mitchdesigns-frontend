"use client";

import { useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Logo } from "@/components/icons/Logo";

const COLUMNS = 5;
const EASE_CINEMA = [0.76, 0, 0.24, 1] as const;

// The logo only shows on the first load of the site; page-to-page
// navigations get the column wipe alone, so the logo never flashes on a
// menu click. Set after mount so server and first client render agree.
let introPlayed = false;

export default function Template({ children }: { children: React.ReactNode }) {
  const reduced = useReducedMotion();
  const showLogo = !introPlayed;
  useEffect(() => {
    introPlayed = true;
  }, []);

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

        {showLogo && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 1, scale: 1 }}
            animate={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.35, ease: EASE_CINEMA, delay: 0.15 }}
          >
            <Logo className="size-20" />
          </motion.div>
        )}
      </div>

      {children}
    </>
  );
}
