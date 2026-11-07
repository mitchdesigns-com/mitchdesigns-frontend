"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

/** How long the bar may run before it gives up (ms). */
const MAX_RUN = 12000;

/**
 * A thin yellow bar along the top of the screen while the next page loads, so
 * a click never feels ignored. Starts on any click on a link to another page
 * of this site (or Back/Forward), creeps toward 90% while waiting, then fills
 * and fades once the new page's path is in place.
 */
export function RouteProgress() {
  const pathname = usePathname();
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);
  const running = useRef(false);
  const timers = useRef<number[]>([]);

  const clear = () => {
    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current = [];
  };

  const finish = () => {
    if (!running.current) return;
    running.current = false;
    clear();
    setProgress(1);
    timers.current.push(window.setTimeout(() => setVisible(false), 250));
    timers.current.push(window.setTimeout(() => setProgress(0), 600));
  };

  const start = () => {
    if (running.current) return;
    running.current = true;
    clear();
    setVisible(true);
    setProgress(0.08);
    // Creep toward 90%: quick at first, slower as it goes.
    const tick = () => {
      setProgress((p) => Math.min(0.9, p + (0.9 - p) * 0.12));
      timers.current.push(window.setTimeout(tick, 180));
    };
    timers.current.push(window.setTimeout(tick, 120));
    timers.current.push(window.setTimeout(finish, MAX_RUN));
  };

  // A new path means the next page has arrived.
  useEffect(() => {
    finish();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element | null)?.closest?.("a");
      if (!a || !a.href || a.target === "_blank" || a.hasAttribute("download")) return;
      const url = new URL(a.href, window.location.href);
      if (url.origin !== window.location.origin) return;
      if (url.pathname === window.location.pathname) return; // same page (or just a #hash)
      start();
    };
    const onPop = () => start();
    document.addEventListener("click", onClick, true);
    window.addEventListener("popstate", onPop);
    return () => {
      document.removeEventListener("click", onClick, true);
      window.removeEventListener("popstate", onPop);
      clear();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-x-0 top-0 z-100 h-0.75 transition-opacity duration-300"
      style={{ opacity: visible ? 1 : 0 }}
    >
      <div
        className="h-full origin-left bg-yellow transition-transform duration-200 ease-out"
        style={{ transform: `scaleX(${progress})` }}
      />
    </div>
  );
}
