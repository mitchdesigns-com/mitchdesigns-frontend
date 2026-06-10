"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/cn";
import { Logo } from "../icons/Logo";
import { FullScreenMenuNav } from "./FullScreenMenuNav";

const EASE = [0.22, 1, 0.36, 1] as const;
const HEADER_HEIGHT = 108;

export function HeaderMinimal() {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  function closeAll() {
    setMenuOpen(false);
  }

  return (
    <>
      <header
        className={cn(
          "inset-x-0 top-0 z-60 border-b transition-colors duration-300",
          menuOpen
            ? "border-transparent bg-yellow"
            : "border-white/10 bg-black",
        )}
        style={{ height: HEADER_HEIGHT }}
      >
        <div className="container-page flex h-full items-center justify-between">
          <Link
            href="/"
            aria-label="MitchDesigns home"
            className={cn(
              "shrink-0 transition-opacity duration-300",
              menuOpen && "opacity-0 pointer-events-none",
            )}
          >
            <Image
              src={menuOpen ? "/images/logo-black.webp" : "/images/logo-white.webp"}
              alt="MitchDesigns"
              width={180}
              height={40}
              className="h-10 w-auto"
              priority
            />
          </Link>

          <button
            type="button"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            onClick={() => (menuOpen ? closeAll() : setMenuOpen(true))}
            className="relative flex flex-col items-start justify-center transition-opacity hover:opacity-70"
            style={{ width: 75, height: 40 }}
          >
            <motion.span
              animate={menuOpen ? { y: 11, rotate: 45 } : { y: 0, rotate: 0 }}
              transition={{ duration: 0.35, ease: EASE }}
              className={cn(
                "absolute block w-full rounded-pill transform",
                menuOpen ? "bg-black" : "bg-white",
              )}
              style={{ height: 4, top: 7 }}
            />
            <motion.span
              animate={menuOpen ? { y: -11, rotate: -45 } : { y: 0, rotate: 0 }}
              transition={{ duration: 0.35, ease: EASE }}
              className={cn(
                "absolute block w-full rounded-pill transform",
                menuOpen ? "bg-black" : "bg-white",
              )}
              style={{ height: 4, top: 29 }}
            />
          </button>
        </div>
      </header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            key="fullscreen-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: EASE }}
            className="fixed inset-0 z-50 flex flex-col overflow-y-auto bg-yellow"
          >
            <div
              className="flex w-full items-center justify-center"
              style={{ height: HEADER_HEIGHT }}
            >
              <Logo />
            </div>

            <FullScreenMenuNav onNavigate={closeAll} />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
