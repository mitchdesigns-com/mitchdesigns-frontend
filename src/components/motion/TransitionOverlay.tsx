"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Logo } from "@/components/icons/Logo";
import { useTransition } from "@/context/TransitionContext";

const EASE_LUXE = [0.16, 1, 0.3, 1] as const;

export function TransitionOverlay() {
  const { phase, onEnterComplete, onExitComplete } = useTransition();

  const visible = phase === "entering" || phase === "navigating";

  return (
    <AnimatePresence onExitComplete={onExitComplete}>
      {visible && (
        <motion.div
          key="transition-overlay"
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black"
          initial={{ y: "100%" }}
          animate={{ y: "0%" }}
          exit={{ y: "-100%" }}
          transition={{ duration: 0.6, ease: EASE_LUXE }}
          onAnimationComplete={(definition) => {
            if (definition === "animate") {
              onEnterComplete();
            }
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.4, ease: EASE_LUXE, delay: 0.1 }}
          >
            <Logo className="size-20" />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
