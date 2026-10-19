"use client";

import { useContext, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence, animate, useMotionTemplate, useMotionValue } from "framer-motion";
import { cn } from "@/lib/cn";
import { useSectionTheme } from "@/hooks/useSectionTheme";
import { HeaderConfigContext } from "@/context/HeaderConfigContext";
import { useSiteSettings } from "@/context/SiteSettingsContext";
import { FullScreenMenuNav } from "./FullScreenMenuNav";

const EASE = [0.22, 1, 0.36, 1] as const;
const HEADER_HEIGHT = 108;
// How far to scroll before the sticky floating menu button appears.
const FAB_SHOW_AFTER = 1300;
// The footer lists every link, so the floating menu button steps aside once
// the footer's top passes this fraction of the viewport height.
const FAB_HIDE_IN_FOOTER = 0.6;

export function Header() {
  const { sticky, showCta, ctaInView, immersive } = useContext(HeaderConfigContext);
  const { primaryCta } = useSiteSettings();
  const sectionTheme = useSectionTheme(HEADER_HEIGHT);
  const [visible, setVisible] = useState(true);
  // Distance each bar travels to meet in the middle as an X (bars sit
  // 15px apart on phones, 22px from lg up).
  const [barShift, setBarShift] = useState(11);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const sync = () => setBarShift(mq.matches ? 11 : 7.5);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);
  const [atTop, setAtTop] = useState(true);
  const [scrolledPast, setScrolledPast] = useState(false);
  const [inFooter, setInFooter] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  // The menu grows as a circle out of the button that opened it and shrinks
  // back into it; it stays mounted until the closing circle has finished.
  const [menuMounted, setMenuMounted] = useState(false);
  const revealR = useMotionValue(0);
  const revealX = useMotionValue(0);
  const revealY = useMotionValue(HEADER_HEIGHT / 2);
  const revealClip = useMotionTemplate`circle(${revealR}px at ${revealX}px ${revealY}px)`;

  useEffect(() => {
    let lastY = window.scrollY;

    const onScroll = () => {
      const y = window.scrollY;
      setAtTop(y < 8);
      setScrolledPast(y > FAB_SHOW_AFTER);
      const footer = document.querySelector("footer");
      setInFooter(
        !!footer && footer.getBoundingClientRect().top < window.innerHeight * FAB_HIDE_IN_FOOTER,
      );
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
    void animate(revealR, 0, { duration: 0.5, ease: [0.65, 0, 0.35, 1] }).then(() => {
      if (revealR.get() === 0) setMenuMounted(false);
    });
  }

  function openMenu(e: React.MouseEvent<HTMLElement>) {
    const b = e.currentTarget.getBoundingClientRect();
    const x = b.left + b.width / 2;
    const y = b.top + b.height / 2;
    const r = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));
    revealX.set(x);
    revealY.set(y);
    setMenuMounted(true);
    setMenuOpen(true);
    void animate(revealR, r, { duration: 0.6, ease: [0.65, 0, 0.35, 1] });
  }

  const isDark = sectionTheme === "dark";
  const logoSrc = isDark
    ? "/images/logo-white.webp"
    : "/images/logo-black.webp";

  // Sticky floating menu button: shown once scrolled (and the inline header
  // menu isn't already on screen), hidden over the footer (which lists every
  // link). While the menu is open it's always the close (X) — one black
  // circle in one place, however the menu was opened.
  const fabShown =
    menuOpen || (scrolledPast && !inFooter && (sticky ? !visible : true));

  return (
    <>
      <motion.header
        animate={{
          y: immersive || (sticky && !visible) ? -HEADER_HEIGHT : 0,
          opacity: immersive ? 0 : 1,
        }}
        // Non-sticky headers only ever move for the immersive hero, so they get
        // the slower, cinematic timing; sticky scroll-hide keeps its snappy one.
        transition={{ duration: sticky ? 0.35 : 0.7, ease: EASE }}
        inert={immersive}
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
              className="h-14 w-auto"
              priority
            />
          </Link>

          <div className="flex items-center gap-6">
            {showCta && (
              <Link
                href={primaryCta.href}
                className={cn(
                  "hidden whitespace-nowrap rounded-pill bg-yellow px-6 py-3 text-sm font-semibold text-black transition-opacity duration-300 hover:opacity-80 sm:inline-flex",
                  (menuOpen || ctaInView) && "opacity-0 pointer-events-none",
                )}
              >
                {primaryCta.label}
              </Link>
            )}

            <button
              type="button"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              onClick={(e) => (menuOpen ? closeAll() : openMenu(e))}
              // Phones: a smaller 48×28 icon; lg+: the full 75×40.
              className={cn(
                "relative flex h-7 w-12 flex-col items-start justify-center transition-opacity hover:opacity-70 lg:h-10 lg:w-18.75",
                fabShown && "pointer-events-none opacity-0",
              )}
            >
              <motion.span
                animate={menuOpen ? { y: barShift, rotate: 45 } : { y: 0, rotate: 0 }}
                transition={{ duration: 0.35, ease: EASE }}
                className={cn(
                  "absolute top-1.25 block h-0.75 w-full rounded-pill transform lg:top-1.75 lg:h-1",
                  menuOpen ? "bg-black" : isDark ? "bg-white" : "bg-black",
                )}
              />
              <motion.span
                animate={
                  menuOpen ? { y: -barShift, rotate: -45 } : { y: 0, rotate: 0 }
                }
                transition={{ duration: 0.35, ease: EASE }}
                className={cn(
                  "absolute top-5 block h-0.75 w-full rounded-pill transform lg:top-7.25 lg:h-1",
                  menuOpen ? "bg-black" : isDark ? "bg-white" : "bg-black",
                )}
              />
            </button>
          </div>
        </div>
      </motion.header>

      {/* Sticky floating menu toggle — centred exactly on the header's menu
          icon (same row height, same right-edge slot), so the menu icon and
          the close (X) always sit in one spot. Above the overlay (z-60). */}
      <div
        className="pointer-events-none fixed inset-x-0 top-0 z-60 flex items-center"
        style={{ height: HEADER_HEIGHT }}
      >
        <div className="container-page flex w-full justify-end">
          <div className="flex w-12 justify-center lg:w-18.75">
          <AnimatePresence>
            {fabShown && (
              <motion.button
                key="menu-fab"
                type="button"
                aria-label={menuOpen ? "Close menu" : "Open menu"}
                aria-expanded={menuOpen}
                onClick={(e) => (menuOpen ? closeAll() : openMenu(e))}
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.6 }}
                transition={{ duration: 0.25, ease: EASE }}
                className={cn(
                  "pointer-events-auto flex size-14 shrink-0 items-center justify-center rounded-full shadow-lg transition-colors hover:scale-105 md:size-18",
                  menuOpen ? "bg-black" : "bg-yellow",
                )}
              >
                {/* The header's two long bars, scaled down */}
                <span className="relative block h-3.5 w-8 md:w-9">
                  <motion.span
                    animate={menuOpen ? { y: 5, rotate: 45 } : { y: 0, rotate: 0 }}
                    transition={{ duration: 0.35, ease: EASE }}
                    className={cn(
                      "absolute inset-x-0 top-0 block h-1 rounded-pill",
                      menuOpen ? "bg-white" : "bg-black",
                    )}
                  />
                  <motion.span
                    animate={menuOpen ? { y: -5, rotate: -45 } : { y: 0, rotate: 0 }}
                    transition={{ duration: 0.35, ease: EASE }}
                    className={cn(
                      "absolute inset-x-0 bottom-0 block h-1 rounded-pill",
                      menuOpen ? "bg-white" : "bg-black",
                    )}
                  />
                </span>
              </motion.button>
            )}
          </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Full-screen yellow menu */}
      {menuMounted && (
        <motion.div
          key="fullscreen-menu"
          className="fixed inset-0 z-50 flex flex-col overflow-y-auto bg-yellow"
          style={{ clipPath: revealClip }}
          inert={!menuOpen}
        >
          {/* First item level with the close button; items spread to 3/4 height. */}
          <FullScreenMenuNav onNavigate={closeAll} anchorY={HEADER_HEIGHT / 2} />
        </motion.div>
      )}
    </>
  );
}
