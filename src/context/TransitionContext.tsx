"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useRef,
  type ReactNode,
} from "react";
import { useRouter, usePathname } from "next/navigation";

type Phase = "idle" | "entering" | "navigating" | "exiting";

type TransitionContextType = {
  phase: Phase;
  startTransition: (href: string) => void;
  onEnterComplete: () => void;
  onExitComplete: () => void;
};

const TransitionContext = createContext<TransitionContextType>({
  phase: "idle",
  startTransition: () => {},
  onEnterComplete: () => {},
  onExitComplete: () => {},
});

export function useTransition() {
  return useContext(TransitionContext);
}

export function TransitionProvider({ children }: { children: ReactNode }) {
  const [phase, setPhase] = useState<Phase>("idle");
  const pendingHref = useRef<string | null>(null);
  const router = useRouter();
  const pathname = usePathname();
  const prevPathname = useRef(pathname);

  useEffect(() => {
    if (phase === "navigating" && pathname !== prevPathname.current) {
      setPhase("exiting");
    }
  }, [pathname, phase]);

  const startTransition = useCallback((href: string) => {
    if (phase !== "idle") return;
    prevPathname.current = pathname;
    pendingHref.current = href;
    setPhase("entering");
  }, [phase, pathname]);

  const onEnterComplete = useCallback(() => {
    if (pendingHref.current) {
      router.push(pendingHref.current);
      setPhase("navigating");
    }
  }, [router]);

  const onExitComplete = useCallback(() => {
    pendingHref.current = null;
    setPhase("idle");
  }, []);

  return (
    <TransitionContext.Provider value={{ phase, startTransition, onEnterComplete, onExitComplete }}>
      {children}
    </TransitionContext.Provider>
  );
}
