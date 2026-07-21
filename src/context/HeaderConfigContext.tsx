"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

type HeaderConfigValue = {
  sticky: boolean;
  setSticky: (v: boolean) => void;
  showCta: boolean;
  setShowCta: (v: boolean) => void;
  /** True while at least one page-level CTA is within the viewport. */
  ctaInView: boolean;
  /** CTA sentinels report their viewport visibility here, keyed by a stable id. */
  reportCtaInView: (id: string, visible: boolean) => void;
};

export const HeaderConfigContext = createContext<HeaderConfigValue>({
  sticky: true,
  setSticky: () => {},
  showCta: true,
  setShowCta: () => {},
  ctaInView: false,
  reportCtaInView: () => {},
});

export function HeaderConfigProvider({ children }: { children: React.ReactNode }) {
  const [sticky, setSticky] = useState(true);
  const [showCta, setShowCta] = useState(true);
  const [ctaInView, setCtaInView] = useState(false);
  // Ref-counted set of on-screen CTAs — the header hides its own CTA while any
  // page-level CTA is visible, so we track them all rather than a single flag.
  const visibleCtas = useRef<Set<string>>(new Set());

  const reportCtaInView = useCallback((id: string, visible: boolean) => {
    const set = visibleCtas.current;
    if (visible) set.add(id);
    else set.delete(id);
    setCtaInView(set.size > 0);
  }, []);

  return (
    <HeaderConfigContext.Provider
      value={{
        sticky,
        setSticky,
        showCta,
        setShowCta,
        ctaInView,
        reportCtaInView,
      }}
    >
      {children}
    </HeaderConfigContext.Provider>
  );
}

export function HeaderConfig({
  sticky = true,
  showCta = true,
}: {
  sticky?: boolean;
  showCta?: boolean;
}) {
  const { setSticky, setShowCta } = useContext(HeaderConfigContext);
  useEffect(() => {
    setSticky(sticky);
    setShowCta(showCta);
    return () => {
      setSticky(true);
      setShowCta(true);
    };
  }, [sticky, showCta, setSticky, setShowCta]);
  return null;
}
