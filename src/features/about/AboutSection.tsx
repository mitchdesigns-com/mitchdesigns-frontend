"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import {
  motion,
  useTransform,
  useMotionValue,
  useInView,
  animate,
  MotionValue,
} from "framer-motion";
import { Section } from "@/components/layout/Section";
import type { HomeAboutSection } from "@/lib/cms/types";

const DEFAULT_STATS = [
  { value: "20+", unit: "Years", label: "Years of experience," },
  { value: "400+", unit: "Projects", label: "Delivered with Impact" },
  { value: "30+", unit: "Experts", label: "Dedicated Team Members" },
];

const DEFAULT_BODY =
  "Since 2005, I've built Mitch Designs in Egypt with one belief, businesses deserve more than templates. As a website design company in Egypt, we craft custom design that turns into results. From mobile app development to e-commerce solutions, from custom platforms to booking systems, every project is built for conversions.\n\nWe don’t chase “pretty” — we chase performance marketing, SEO, and measurable success. For us, it’s always about the user, the customer, and their experience. That’s why Mitch Designs has become the partner businesses trust when growth can’t wait.";

const DEFAULT_SIGNATURE = "Mitch";

// How much of the 0-1 scroll range a single character takes to transition
const CHAR_WINDOW = 0.08;

function AnimatedChar({
  char,
  progress,
  start,
}: {
  char: string;
  progress: MotionValue<number>;
  start: number;
}) {
  const color = useTransform(
    progress,
    [start, start + CHAR_WINDOW],
    ["#414141", "#ffffff"],
  );
  if (char === "\n") return <br />;
  return <motion.span style={{ color }}>{char}</motion.span>;
}

export function AboutSection({
  stats = DEFAULT_STATS,
  body = DEFAULT_BODY,
  signature = DEFAULT_SIGNATURE,
  cta = { label: "About Us", href: "/about" },
}: Partial<HomeAboutSection> = {}) {
  const ref = useRef<HTMLDivElement>(null);
  // Play the reveal once the block scrolls into view — runs on its own from
  // then on, decoupled from scroll position.
  const inView = useInView(ref, { once: true, amount: 0.4 });

  const animProgress = useMotionValue(0);
  useEffect(() => {
    if (!inView) return;
    const controls = animate(animProgress, 1, { duration: 2, ease: "linear" });
    return () => controls.stop();
  }, [inView, animProgress]);

  const grayChars = (body ?? "").split("");
  const sigChars = (signature ?? "").split("");
  const total = grayChars.length + sigChars.length;

  // Signature chars start after all gray text chars, with a small gap
  const sigOffset = grayChars.length / total + 0.04;

  return (
    <Section theme="dark" bleed>
      <div className="container-page flex flex-col-reverse items-center gap-14 bg-black py-14 lg:flex-row lg:items-start lg:justify-between lg:gap-16">
        {/* Left — stats + CTA */}
        <div className="flex w-full shrink-0 flex-col items-center justify-between gap-11 lg:w-auto lg:self-stretch">
          <ul className="flex flex-col gap-11">
            {stats.map(({ value, unit, label }) => (
              <li key={value} className="flex flex-col items-center">
                <div className="flex items-baseline gap-2.5">
                  <span className="font-bold text-[3.5rem] leading-none text-white sm:text-[4rem]">
                    {value}
                  </span>
                  <span className="font-light text-xl text-white">{unit}</span>
                </div>
                <span className="text-[13px] tracking-[0.01em] text-fg-muted">
                  {label}
                </span>
              </li>
            ))}
          </ul>

          <Link
            href={cta?.href ?? "/about"}
            className="flex w-full items-center justify-center gap-2 whitespace-nowrap rounded-full bg-[#373737] px-9 py-4 text-sm font-medium text-white transition-colors hover:bg-[#444] lg:inline-flex lg:w-auto"
          >
            {cta?.label ?? "About Us"}
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              aria-hidden
            >
              <path
                d="M4.167 10h11.666M10 4.167 15.833 10 10 15.833"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>
        </div>

        {/* Right — body copy + signature */}
        <div
          ref={ref}
          className="flex max-w-[895px] flex-col items-center gap-10 text-center lg:items-start lg:text-left"
        >
          <p className="text-[1.5rem] leading-normal tracking-[0.01em] sm:text-[1.75rem] lg:text-[2rem]">
            {grayChars.map((char, i) => (
              <AnimatedChar
                key={i}
                char={char}
                progress={animProgress}
                start={i / total}
              />
            ))}
          </p>

          <span
            className="font-signature"
            style={{ fontSize: "clamp(5rem, 10vw, 10rem)", lineHeight: "52px" }}
            aria-hidden
          >
            {sigChars.map((char, i) => (
              <AnimatedChar
                key={i}
                char={char}
                progress={animProgress}
                start={
                  sigOffset +
                  (i / sigChars.length) * (1 - sigOffset - CHAR_WINDOW)
                }
              />
            ))}
          </span>
        </div>
      </div>
    </Section>
  );
}
