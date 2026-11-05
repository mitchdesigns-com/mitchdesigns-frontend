"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useInView, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { Section } from "@/components/layout/Section";
import { cn } from "@/lib/cn";
import type { FlowStep } from "./appFlow/screens";

/** Real screens from our eCommerce customer app (Orderbase), front-end only. */
const PHONE = { src: "/images/orderbase/landing/pay-phone.webp", alt: "Checkout in a branded eCommerce app with Apple Pay, card, cash on delivery and wallet" };
const WALLET = "/images/orderbase/landing/pay-wallet.webp";
const CARD = "/images/orderbase/landing/pay-credit.webp";

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * eCommerce: "your store comes with an app". The real checkout screen of our
 * customer app floats on the right while its wallet and saved-card pieces
 * drift around it; on the left, the reasons an app keeps customers coming
 * back light up one by one as you scroll past them (copy from the CMS).
 */
export function AppLoopSection({
  eyebrow,
  title,
  steps,
  closingTitle,
  closingText,
}: {
  eyebrow?: string;
  title: string;
  steps: FlowStep[];
  closingTitle?: string;
  closingText?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const walletY = useTransform(scrollYProgress, [0, 1], reduced ? [0, 0] : [80, -80]);
  const cardY = useTransform(scrollYProgress, [0, 1], reduced ? [0, 0] : [-60, 100]);
  const phoneY = useTransform(scrollYProgress, [0, 1], reduced ? [0, 0] : [30, -30]);

  return (
    <Section theme="dark" className="overflow-hidden py-20 md:py-28">
      <div ref={ref} className="grid gap-16 md:grid-cols-2 md:gap-12 lg:gap-20">
        {/* Copy: the reasons, one lit at a time */}
        <div className="flex flex-col gap-10">
          <div className="flex flex-col gap-4">
            {eyebrow && <p className="text-sm font-medium uppercase tracking-1 text-yellow">{eyebrow}</p>}
            <h2 className="text-hero-3 text-left font-bold text-balance md:text-hero-2">{title}</h2>
          </div>
          <ol className="flex flex-col">
            {steps.map((s, i) => (
              <Reason key={s.title} index={i} step={s} />
            ))}
          </ol>
          {(closingTitle || closingText) && (
            <div className="rounded-card bg-yellow p-6 text-black">
              {closingTitle && <p className="text-xl font-bold text-balance">{closingTitle}</p>}
              {closingText && <p className="mt-2 text-base text-black/75 text-balance">{closingText}</p>}
            </div>
          )}
        </div>

        {/* The app: real checkout, with its wallet and card pieces around it */}
        <div className="relative order-first md:order-none md:sticky md:top-24 md:self-start">
          <div className="relative mx-auto aspect-3/4 w-full max-w-md">
            <motion.div style={{ y: phoneY }} className="absolute inset-0">
              <Image src={PHONE.src} alt={PHONE.alt} fill className="object-contain drop-shadow-2xl" sizes="(max-width: 768px) 90vw, 28rem" />
            </motion.div>
            <motion.div style={{ y: walletY }} className="absolute top-1/4 -left-6 w-3/5 md:-left-16" aria-hidden>
              <div className="relative aspect-2/1">
                <Image src={WALLET} alt="" fill className="object-contain" sizes="16rem" />
              </div>
            </motion.div>
            <motion.div style={{ y: cardY }} className="absolute -right-4 bottom-8 w-1/2 md:-right-12" aria-hidden>
              <div className="relative aspect-square">
                <Image src={CARD} alt="" fill className="object-contain" sizes="14rem" />
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </Section>
  );
}

function Reason({ step, index }: { step: FlowStep; index: number }) {
  const ref = useRef<HTMLLIElement>(null);
  // Lit while it crosses the middle of the screen.
  const lit = useInView(ref, { margin: "-40% 0px -40% 0px" });
  return (
    <li
      ref={ref}
      className={cn(
        "flex gap-5 border-t border-white/10 py-6 transition-opacity duration-500 last:border-b",
        lit ? "opacity-100" : "opacity-40",
      )}
    >
      <span className={cn("pt-1 text-sm font-semibold tabular-nums transition-colors duration-500", lit ? "text-yellow" : "text-grey-500")}>
        {pad(index + 1)}
      </span>
      <div className="flex flex-col gap-2">
        <h3 className="text-xl font-semibold text-balance md:text-2xl">{step.title}</h3>
        <p className="text-base text-grey-500 text-balance md:text-lg">{step.description}</p>
      </div>
    </li>
  );
}
