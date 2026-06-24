"use client";

import { useContext, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/cn";
import { useSectionTheme } from "@/hooks/useSectionTheme";
import { HeaderConfigContext } from "@/context/HeaderConfigContext";
import { Logo } from "../icons/Logo";
import { FullScreenMenuNav } from "./FullScreenMenuNav";
import { LEADS_URL } from "@/config/nav";

const EASE = [0.22, 1, 0.36, 1] as const;
const HEADER_HEIGHT = 108;
// How far to scroll before the sticky floating menu button appears.
const FAB_SHOW_AFTER = 1300;

export function Header() {
  const { sticky, showCta } = useContext(HeaderConfigContext);
  const sectionTheme = useSectionTheme(HEADER_HEIGHT);
  const [visible, setVisible] = useState(true);
  const [atTop, setAtTop] = useState(true);
  const [scrolledPast, setScrolledPast] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    let lastY = window.scrollY;

    const onScroll = () => {
      const y = window.scrollY;
      setAtTop(y < 8);
      setScrolledPast(y > FAB_SHOW_AFTER);
      if (!sticky) {
        setVisible(true);
      } else if (y < 8) {
        setVisible(true);
      } else if (y > lastY) {
        setVisible(false);
      } else {
        setVisible(true);
      }
      lastY = y;
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [sticky]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  function closeAll() {
    setMenuOpen(false);
  }

  function openMenu() {
    setMenuOpen(true);
  }

  const isDark = sectionTheme === "dark";
  const logoSrc = isDark
    ? "/images/logo-white.webp"
    : "/images/logo-black.webp";

  // Sticky floating menu button: shown once scrolled (and the inline header
  // menu isn't already on screen), and kept on as the close (X) while the menu
  // is open so there's always a visible way to dismiss it.
  const fabShown = scrolledPast && (menuOpen || (sticky ? !visible : true));

  return (
    <>
      <motion.header
        animate={{ y: sticky && !visible ? -HEADER_HEIGHT : 0 }}
        transition={{ duration: 0.35, ease: EASE }}
        className={cn(
          "inset-x-0 top-0 z-60 transition-colors duration-300 ease-out-soft",
          sticky ? "fixed" : "absolute",
          // The blurred/opaque background only makes sense for a sticky header
          // that stays fixed on screen. Non-sticky headers (e.g. /orderbase)
          // are an absolute overlay that scrolls away with the page, so keep
          // them transparent — otherwise a tiny scroll paints the blur over
          // the hero content beneath.
          menuOpen || atTop || !sticky
            ? "border-b border-transparent bg-transparent"
            : isDark
              ? "border-b border-white/10 bg-black/80 backdrop-blur-md"
              : "border-b border-black/10 bg-white/80 backdrop-blur-md",
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
              src={logoSrc}
              alt="MitchDesigns"
              width={180}
              height={40}
              className="h-10 w-auto"
              priority
            />
          </Link>

          <div className="flex items-center gap-6">
            {showCta && (
              <Link
                href={LEADS_URL}
                className={cn(
                  "hidden whitespace-nowrap rounded-pill bg-yellow px-6 py-3 text-sm font-semibold text-black transition-opacity duration-300 hover:opacity-80 sm:inline-flex",
                  menuOpen && "opacity-0 pointer-events-none",
                )}
              >
                Get Detailed Proposal
              </Link>
            )}

            <button
              type="button"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              onClick={() => (menuOpen ? closeAll() : openMenu())}
              className={cn(
                "relative flex flex-col items-start justify-center transition-opacity hover:opacity-70",
                fabShown && "pointer-events-none opacity-0",
              )}
              style={{ width: 75, height: 40 }}
            >
              <motion.span
                animate={menuOpen ? { y: 11, rotate: 45 } : { y: 0, rotate: 0 }}
                transition={{ duration: 0.35, ease: EASE }}
                className={cn(
                  "absolute block w-full rounded-pill transform",
                  menuOpen ? "bg-black" : isDark ? "bg-white" : "bg-black",
                )}
                style={{ height: 4, top: 7 }}
              />
              <motion.span
                animate={
                  menuOpen ? { y: -11, rotate: -45 } : { y: 0, rotate: 0 }
                }
                transition={{ duration: 0.35, ease: EASE }}
                className={cn(
                  "absolute block w-full rounded-pill transform",
                  menuOpen ? "bg-black" : isDark ? "bg-white" : "bg-black",
                )}
                style={{ height: 4, top: 29 }}
              />
            </button>
          </div>
        </div>
      </motion.header>

      {/* Sticky floating menu toggle — aligned to the container's right edge.
          Becomes a close (X) while the menu is open, and sits above the menu
          overlay (z-60) so it can always dismiss it. */}
      <div className="pointer-events-none fixed inset-x-0 top-5 z-60 md:top-8">
        <div className="container-page flex justify-end">
          <AnimatePresence>
            {fabShown && (
              <motion.button
                key="menu-fab"
                type="button"
                aria-label={menuOpen ? "Close menu" : "Open menu"}
                aria-expanded={menuOpen}
                onClick={() => (menuOpen ? closeAll() : openMenu())}
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.6 }}
                transition={{ duration: 0.25, ease: EASE }}
                className={cn(
                  "pointer-events-auto flex size-16 items-center justify-center rounded-full shadow-lg transition-colors hover:scale-105 md:size-25",
                  menuOpen ? "bg-black" : "bg-yellow",
                )}
              >
                <span className="relative block h-6 w-11">
                  <motion.span
                    animate={menuOpen ? { y: 6, rotate: 45 } : { y: 0, rotate: 0 }}
                    transition={{ duration: 0.3, ease: EASE }}
                    className={cn(
                      "absolute left-0 block h-1 w-full rounded-pill",
                      menuOpen ? "bg-white" : "bg-black",
                    )}
                    style={{ top: 4 }}
                  />
                  <motion.span
                    animate={menuOpen ? { y: -6, rotate: -45 } : { y: 0, rotate: 0 }}
                    transition={{ duration: 0.3, ease: EASE }}
                    className={cn(
                      "absolute left-0 block h-1 w-full rounded-pill",
                      menuOpen ? "bg-white" : "bg-black",
                    )}
                    style={{ top: 16 }}
                  />
                </span>
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Full-screen yellow menu */}
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
            {/* Logo row */}
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
