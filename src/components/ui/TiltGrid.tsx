"use client";

import { motion } from "framer-motion";
import { RevealStagger, useTilt } from "@/components/motion";

/**
 * A card grid in 3D perspective that leans toward the mouse (springy tilt)
 * and reveals its <RevealItem> children one by one. `className` is the grid
 * layout itself. Pair the cards with <GlowCard> for the pointer glow.
 */
export function TiltGrid({
  className,
  maxTilt = 8,
  children,
}: {
  className?: string;
  maxTilt?: number;
  children: React.ReactNode;
}) {
  const { rotateX, rotateY, handlers } = useTilt(maxTilt);
  return (
    <div className="relative perspective-midrange" {...handlers}>
      <motion.div className="transform-3d" style={{ rotateX, rotateY }}>
        <RevealStagger className={`transform-3d ${className ?? ""}`} stagger={0.08}>
          {children}
        </RevealStagger>
      </motion.div>
    </div>
  );
}
