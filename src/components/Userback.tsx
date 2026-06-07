"use client";

import { useEffect } from "react";
import Userback from "@userback/widget";

const USERBACK_TOKEN = "A-3b7phIarzFpeuGKMnPwVrvrdA";

export function UserbackWidget() {
  useEffect(() => {
    let destroy: (() => void) | undefined;
    let cancelled = false;

    // Defer init until the browser is idle — the widget is ~213 KiB of
    // 3rd-party JS/CSS and must not compete with LCP during initial load.
    const init = () => {
      if (cancelled) return;
      Userback(USERBACK_TOKEN)
        .then((ub) => {
          if (cancelled) return ub.destroy();
          destroy = () => ub.destroy();
        })
        .catch(() => {
          // Userback failed to load — non-critical, ignore.
        });
    };

    const supportsRic = typeof window.requestIdleCallback === "function";
    const handle = supportsRic
      ? window.requestIdleCallback(init, { timeout: 4000 })
      : window.setTimeout(init, 3000);

    return () => {
      cancelled = true;
      if (supportsRic) window.cancelIdleCallback(handle as number);
      else window.clearTimeout(handle as number);
      destroy?.();
    };
  }, []);

  return null;
}
