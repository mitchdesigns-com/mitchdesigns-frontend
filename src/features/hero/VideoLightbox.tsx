"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { Close } from "@/components/icons/Close";

export function VideoLightbox({
  src,
  alt,
  onClose,
}: {
  src: string;
  alt: string;
  onClose: () => void;
}) {
  // Lock body scroll while the lightbox is open; restore on close/unmount.
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label={alt}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="fixed inset-0 z-100 flex items-center justify-center bg-black/90 p-4"
      onClick={onClose}
    >
      <button
        type="button"
        aria-label="Close video"
        onClick={onClose}
        className="absolute right-6 top-6 grid h-10 w-10 place-items-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
      >
        <Close size={20} />
      </button>

      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-5xl overflow-hidden rounded-[20px]"
        onClick={(e) => e.stopPropagation()}
      >
        <video
          src={src}
          controls
          autoPlay
          className="h-auto w-full"
          aria-label={alt}
        />
      </motion.div>
    </motion.div>
  );
}
