"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { useReducedMotion, useScroll, useTransform } from "framer-motion";
import { Section } from "@/components/layout/Section";

// three.js only loads (client-side) for this section.
const TabletScene = dynamic(() => import("./TabletScene"), { ssr: false });

const VIDEO = {
  webm: encodeURI("/images/google ads/google-ads-video.webm"),
  mp4: encodeURI("/images/google ads/google-ads-video.mp4"),
};

/**
 * A realistic 3D wide tablet that rises off the desk as you scroll: the section
 * pins with the tablet lying face down; scrolling lifts it and swings it up
 * to stand facing you while the screen wakes and plays our Google Ads
 * recording on a loop. Scrolling back up lays it down again. Phones don't
 * pin — it rises as it rides up the screen. Reduced motion: it rests upright.
 */
export function TabletVideoSection({ label = "Live Google Ads results from our campaigns" }: { label?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  // Desktop pins the scene for a long scroll. Phones don't pin (no empty
  // scroll space): the tablet rises as it rides up the screen, fully up
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
          <TabletScene progress={open} src={VIDEO} />
        </div>
      </Section>
    </div>
  );
}
