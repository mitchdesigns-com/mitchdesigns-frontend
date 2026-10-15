"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { useReducedMotion, useScroll, useTransform } from "framer-motion";
import { Section } from "@/components/layout/Section";

// three.js only loads (client-side) for this section.
const MacbookScene = dynamic(() => import("./MacbookScene"), { ssr: false });

const VIDEO = {
  webm: "/images/media-buying/media-buying-video.webm",
  mp4: "/images/media-buying/media-buying-video.mp4",
};

/**
 * A realistic 3D MacBook Pro that opens as you scroll: the section pins with
 * the laptop closed at a three-quarter angle; scrolling lifts the lid and
 * swings it round to face you while the screen wakes up and plays our live
 * Ads Manager recording on a loop. Scrolling back up closes it again.
 * Reduced motion: the laptop rests open.
 */
export function MacbookVideoSection({ label = "Live Ads Manager results from our campaigns" }: { label?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  // Desktop pins the scene for a long scroll. Phones don't pin (no empty
  // scroll space): the laptop opens as it rides up the screen, fully open
  // by the time it reaches the middle.
  const [phone, setPhone] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const update = () => setPhone(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: phone ? ["start 0.95", "center 0.5"] : ["start start", "end end"],
  });
  const open = useTransform(scrollYProgress, (p) => (reduced ? 1 : p));

  return (
    <div ref={ref} className="relative h-laptop-frame md:h-scene-laptop">
      <Section theme="light" className="h-full overflow-hidden md:sticky md:top-0 md:h-svh">
        <div role="img" aria-label={label} className="absolute inset-0">
          <MacbookScene progress={open} src={VIDEO} />
        </div>
      </Section>
    </div>
  );
}
