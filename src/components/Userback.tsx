"use client";

import { useEffect } from "react";
import Userback from "@userback/widget";

const USERBACK_TOKEN = "A-3b7phIarzFpeuGKMnPwVrvrdA";

export function UserbackWidget() {
  useEffect(() => {
    let destroy: (() => void) | undefined;

    Userback(USERBACK_TOKEN)
      .then((ub) => {
        destroy = () => ub.destroy();
      })
      .catch(() => {
        // Userback failed to load — non-critical, ignore.
      });

    return () => destroy?.();
  }, []);

  return null;
}
