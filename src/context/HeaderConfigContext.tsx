"use client";

import { createContext, useContext, useEffect, useState } from "react";

type HeaderConfigValue = {
  sticky: boolean;
  setSticky: (v: boolean) => void;
  showCta: boolean;
  setShowCta: (v: boolean) => void;
};

export const HeaderConfigContext = createContext<HeaderConfigValue>({
  sticky: true,
  setSticky: () => {},
  showCta: true,
  setShowCta: () => {},
});

export function HeaderConfigProvider({ children }: { children: React.ReactNode }) {
  const [sticky, setSticky] = useState(true);
  const [showCta, setShowCta] = useState(true);
  return (
    <HeaderConfigContext.Provider value={{ sticky, setSticky, showCta, setShowCta }}>
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
