"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { motion, useTransform, useScroll, MotionValue } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Section } from "@/components/layout/Section";
import { CountUp } from "@/components/ui/CountUp";
import { BellIcon } from "@/components/icons/BellIcon";
import { DashboardIcon } from "@/components/icons/DashboardIcon";
import { ScooterIcon } from "@/components/icons/ScooterIcon";
import { LayoutGridIcon } from "@/components/icons/LayoutGridIcon";
import type { HomeOrderbaseOverview, OrderbaseFeature } from "@/lib/cms/types";

const ICONS = {
  bell: BellIcon,
  dashboard: DashboardIcon,
  scooter: ScooterIcon,
  "layout-grid": LayoutGridIcon,
} as const;

function FeatureIcon({ name, size = 20 }: { name: OrderbaseFeature["icon"]; size?: number }) {
  const Icon = ICONS[name] ?? BellIcon;
  return <Icon size={size} />;
}

/** Wrap the highlight phrase within text in the Orderbase red accent. */
function withHighlight(text: string, highlight?: string) {
  if (!highlight || !text.includes(highlight)) return text;
  const [before, ...rest] = text.split(highlight);
  return (
    <>
      {before}
      <span className="text-orderbase-red">{highlight}</span>
      {rest.join(highlight)}
    </>
  );
}

const DEFAULT_CARDS: OrderbaseFeature[] = [
  { icon: "bell", title: "No More Stock Confusion", description: "Real-time inventory alerts so you never run out mid-service." },
  { icon: "dashboard", title: "All Orders in One Place", description: "Aggregate orders from every channel into one clean dashboard." },
  { icon: "scooter", title: "Delivery Under Control", description: "Track every rider, every order, every minute from dispatch to door." },
  { icon: "layout-grid", title: "Clear Operational Visibility", description: "Shift reports and live KPIs to keep your team aligned." },
];

// ── Per-item scroll-driven reveal ─────────────────────────────────────────────
// enter: progress value [0,1] at which item reaches the right edge of viewport
function useItemReveal(progress: MotionValue<number>, enter: number) {
  const fadeRange = 0.08;
  // Clamp so items already in view at progress=0 are immediately visible
  const from = Math.max(0, enter);
  const to = Math.min(1, from + fadeRange);
  const opacity = useTransform(progress, [from, to], [from <= 0 ? 1 : 0, 1]);
  const xAnim = useTransform(progress, [from, to], [from <= 0 ? 0 : 40, 0]);
  return { opacity, x: xAnim };
}

// ── Feature card ─────────────────────────────────────────────────────────────
interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  progress: MotionValue<number>;
  enter: number;
}

function FeatureCard({
  icon,
  title,
  description,
  progress,
  enter,
}: FeatureCardProps) {
  const { opacity, x } = useItemReveal(progress, enter);
  return (
    <motion.div
      className="flex shrink-0 flex-col justify-between rounded-xl bg-black/80"
      style={{
        width: "clamp(200px, 22dvw, 332px)",
        height: "100%",
        maxHeight: "clamp(160px, 28dvh, 244px)",
        padding: "clamp(1rem, 2dvh, 2rem)",
        gap: "clamp(0.75rem, 1.5dvh, 1.5rem)",
        opacity,
        x,
      }}
    >
      <div
        className="flex shrink-0 items-center justify-center rounded-full bg-orderbase-red text-white"
        style={{
          width: "clamp(1.75rem, 3dvh, 2.5rem)",
          height: "clamp(1.75rem, 3dvh, 2.5rem)",
        }}
      >
        {icon}
      </div>
      <div className="flex flex-col gap-1">
        <h3
          className="font-bold leading-snug text-orderbase-red"
          style={{ fontSize: "clamp(0.9rem, 1.8dvh, 1.5rem)" }}
        >
          {title}
        </h3>
        <p
          className="text-white/80 text-balance"
          style={{ fontSize: "clamp(0.7rem, 1.3dvh, 1rem)" }}
        >
          {description}
        </p>
      </div>
    </motion.div>
  );
}

// ── Orderbase logo ────────────────────────────────────────────────────────────
function OrderbaseLogo() {
  return (
    <Image
      src="/images/orderbase/logo.webp"
      alt="Orderbase"
      width={240}
      height={64}
      className="h-16 w-auto object-contain me-auto"
    />
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export function OrderbaseOverview({
  heading = "A Platform to Manage Your Food Business Operation",
  description = "OrderBase brings everything into one connected system giving you full control, real-time visibility, and smoother operations from kitchen to customer.",
  descriptionHighlight = "OrderBase",
  countValue = "+5",
  countLabel = "Active Well-known food businesses in Egypt already run on Orderbase",
  cta = { label: "Know More", href: "/orderbase" },
  cards = DEFAULT_CARDS,
}: Partial<HomeOrderbaseOverview> = {}) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [trackWidth, setTrackWidth] = useState(0);
  const [isDesktop, setIsDesktop] = useState(false);
  // enter[i] = scrollYProgress value when item i reaches the viewport right edge
  const [enters, setEnters] = useState([0, 0, 0, 0, 0, 0]);

  useEffect(() => {
    const check = () => setIsDesktop(window.innerWidth >= 1024);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const measure = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const totalW = track.scrollWidth;
    const vw = window.innerWidth;
    const dist = totalW - vw; // how far the track scrolls (positive)
    setTrackWidth(totalW);

    const trackRect = track.getBoundingClientRect();

    // track x goes from 0 to -dist as progress goes 0→1
    // item's viewport x = itemLeft + trackX = itemLeft - dist*progress
    // item enters right edge when: itemLeft - dist*progress = vw
    // → progress_enter = (itemLeft - vw) / dist
    const corrected = itemRefs.current.map((el) => {
      if (!el) return 0;
      const rect = el.getBoundingClientRect();
      const itemLeft = rect.left - trackRect.left;
      if (dist <= 0) return 0;
      return Math.max(0, (itemLeft - vw) / dist);
    });

    setEnters(corrected);
  }, []);

  useEffect(() => {
    // measure after layout
    const t = setTimeout(measure, 100);
    window.addEventListener("resize", measure);
    return () => {
      clearTimeout(t);
      window.removeEventListener("resize", measure);
    };
  }, [measure]);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  const vw = typeof window !== "undefined" ? window.innerWidth : 1512;
  const xDistance = -(trackWidth - vw);

  const x = useTransform(
    scrollYProgress,
    [0, 1],
    isDesktop ? [0, xDistance] : [0, 0],
  );

  // Per-item reveal derived from computed enters
  const ipadReveal = useItemReveal(scrollYProgress, enters[0]);
  const iphoneReveal = useItemReveal(scrollYProgress, enters[3]);

  return (
    <div
      ref={sectionRef}
      style={isDesktop ? { height: `${trackWidth}px` } : undefined}
    >
      <Section
        theme="space-grey"
        bleed
        className={isDesktop ? "sticky top-0" : ""}
      >
        <div style={{ paddingBlock: "clamp(1.5rem, 4dvh, 5rem)" }}>
          {/* Header */}
          <div
            className="container-page flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between lg:gap-8"
            style={{ marginBottom: "clamp(1.5rem, 3dvh, 3rem)" }}
          >
            <div className="flex flex-col gap-3">
              <OrderbaseLogo />
              <h2
                className="font-bold leading-tight text-white"
                style={{ fontSize: "clamp(1.5rem, 2.5dvh, 2.25rem)" }}
              >
                {heading}
              </h2>
              <p
                className="text-white/60 text-balance"
                style={{
                  fontSize: "clamp(0.8rem, 1.5dvh, 1rem)",
                  maxWidth: "36rem",
                }}
              >
                {withHighlight(description ?? "", descriptionHighlight)}
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-4">
              <CountUp
                value={countValue ?? "+5"}
                className="font-bold text-orderbase-red"
                style={{ fontSize: "clamp(3rem, 7dvh, 4.5rem)" }}
              />
              <p
                className="text-white/70 text-balance"
                style={{
                  fontSize: "clamp(0.7rem, 1.3dvh, 0.875rem)",
                  maxWidth: "10rem",
                }}
              >
                {countLabel}
              </p>
            </div>
          </div>

          {/* Desktop horizontal scroll gallery */}
          <div
            className="hidden overflow-hidden lg:block"
            style={{
              height:
                "calc(100dvh - clamp(1.5rem, 4dvh, 5rem) * 2 - clamp(1.5rem, 3dvh, 3rem) - clamp(8rem, 15dvh, 12rem))",
              minHeight: "280px",
            }}
          >
            <motion.div
              ref={trackRef}
              className="flex h-full items-center gap-4 pb-4"
              style={{
                x,
                paddingInlineStart:
                  "max(1.5rem, calc((100vw - 1392px) / 2 + 1.5rem))",
                paddingInlineEnd:
                  "max(1.5rem, calc((100vw - 1392px) / 2 + 1.5rem))",
                width: "max-content",
              }}
            >
              {/* iPad */}
              <motion.div
                ref={(el) => {
                  itemRefs.current[0] = el;
                }}
                className="relative shrink-0 overflow-hidden rounded-xl h-full w-auto aspect-716/740"
                style={{ opacity: ipadReveal.opacity, x: ipadReveal.x }}
              >
                <Image
                  src="/images/orderbase/ipad-mockup.webp"
                  alt="Orderbase dashboard on iPad"
                  fill
                  className="object-cover"
                />
              </motion.div>

              <div
                ref={(el) => {
                  itemRefs.current[1] = el;
                }}
                className="contents"
              >
                <FeatureCard
                  icon={<FeatureIcon name={cards[0]?.icon ?? "bell"} />}
                  title={cards[0]?.title ?? ""}
                  description={cards[0]?.description ?? ""}
                  progress={scrollYProgress}
                  enter={enters[1]}
                />
              </div>

              <div
                ref={(el) => {
                  itemRefs.current[2] = el;
                }}
                className="contents"
              >
                <FeatureCard
                  icon={<FeatureIcon name={cards[1]?.icon ?? "dashboard"} />}
                  title={cards[1]?.title ?? ""}
                  description={cards[1]?.description ?? ""}
                  progress={scrollYProgress}
                  enter={enters[2]}
                />
              </div>

              {/* iPhone */}
              <motion.div
                ref={(el) => {
                  itemRefs.current[3] = el;
                }}
                className="relative shrink-0 overflow-hidden rounded-xl h-full w-auto aspect-926/968"
                style={{ opacity: iphoneReveal.opacity, x: iphoneReveal.x }}
              >
                <Image
                  src="/images/orderbase/iphone-mockup.webp"
                  alt="Orderbase order management on iPhone"
                  fill
                  className="object-cover"
                />
              </motion.div>

              <div
                ref={(el) => {
                  itemRefs.current[4] = el;
                }}
                className="contents"
              >
                <FeatureCard
                  icon={<FeatureIcon name={cards[2]?.icon ?? "scooter"} />}
                  title={cards[2]?.title ?? ""}
                  description={cards[2]?.description ?? ""}
                  progress={scrollYProgress}
                  enter={enters[4]}
                />
              </div>

              <div
                ref={(el) => {
                  itemRefs.current[5] = el;
                }}
                className="contents"
              >
                <FeatureCard
                  icon={<FeatureIcon name={cards[3]?.icon ?? "layout-grid"} />}
                  title={cards[3]?.title ?? ""}
                  description={cards[3]?.description ?? ""}
                  progress={scrollYProgress}
                  enter={enters[5]}
                />
              </div>
            </motion.div>
          </div>

          {/* Mobile overflow scroll */}
          <div
            className="flex gap-4 overflow-x-auto pb-4 lg:hidden"
            style={{
              paddingInlineStart: "1rem",
              paddingInlineEnd: "1rem",
              scrollSnapType: "x mandatory",
            }}
          >
            <div
              className="relative shrink-0 overflow-hidden rounded-xl"
              style={{ width: "80vw", height: "60vw" }}
            >
              <Image
                src="/images/orderbase/ipad-mockup.webp"
                alt="Orderbase dashboard on iPad"
                fill
                className="object-cover"
              />
            </div>
            {cards.slice(0, 2).map((card) => (
              <div
                key={card.title}
                className="flex shrink-0 flex-col gap-6 rounded-xl bg-black/80 p-8"
                style={{ width: "332px", height: "244px" }}
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orderbase-red text-white">
                  <FeatureIcon name={card.icon} />
                </div>
                <div className="flex flex-col gap-2">
                  <h3 className="text-2xl font-bold leading-snug text-orderbase-red">
                    {card.title}
                  </h3>
                  <p className="text-base text-white/80 text-balance">
                    {card.description}
                  </p>
                </div>
              </div>
            ))}
            <div
              className="relative shrink-0 overflow-hidden rounded-xl"
              style={{ width: "50vw", height: "60vw" }}
            >
              <Image
                src="/images/orderbase/iphone-mockup.webp"
                alt="Orderbase order management on iPhone"
                fill
                className="object-cover"
              />
            </div>
            {cards.slice(2, 4).map((card) => (
              <div
                key={card.title}
                className="flex shrink-0 flex-col gap-6 rounded-xl bg-black/80 p-8"
                style={{ width: "332px", height: "244px" }}
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orderbase-red text-white">
                  <FeatureIcon name={card.icon} />
                </div>
                <div className="flex flex-col gap-2">
                  <h3 className="text-2xl font-bold leading-snug text-orderbase-red">
                    {card.title}
                  </h3>
                  <p className="text-base text-white/80 text-balance">
                    {card.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-10 flex justify-center px-4 lg:px-0">
            <Link
              href={cta?.href ?? "/orderbase"}
              className="whitespace-nowrap rounded-full bg-yellow px-8 py-3 text-center text-base font-semibold text-black transition-opacity hover:opacity-90 max-md:w-full"
            >
              {cta?.label ?? "Know More"} →
            </Link>
          </div>
        </div>
      </Section>
    </div>
  );
}
