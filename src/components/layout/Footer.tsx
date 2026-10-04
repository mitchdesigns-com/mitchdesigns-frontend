"use client";

import { useRef, type ComponentType } from "react";
import {
  motion,
  useInView,
  useScroll,
  useTransform,
  useReducedMotion,
  type Variants,
} from "framer-motion";
import Link from "next/link";
import { NewsletterForm } from "@/components/layout/NewsletterForm";
import { Facebook } from "@/components/icons/Facebook";
import { Instagram } from "@/components/icons/Instagram";
import { LinkedIn } from "@/components/icons/LinkedIn";
import { YouTube } from "@/components/icons/YouTube";
import { WhatsApp } from "@/components/icons/WhatsApp";
import { COMPANY_LINKS, SERVICES, serviceHref, LEADS_URL } from "@/config/nav";
import type { SiteSettings, SocialPlatform } from "@/lib/cms/types";
import { easeInOutSoft, easeOutSoft } from "@/lib/motion";

const SERVICE_LINKS = SERVICES.map((s) => ({
  label: s.footerLabel,
  href: serviceHref(s.slug),
}));

const SOCIAL_ICONS: Record<
  SocialPlatform,
  ComponentType<{ size?: number; className?: string }>
> = { facebook: Facebook, instagram: Instagram, linkedin: LinkedIn, youtube: YouTube };

const SOCIAL_LABELS: Record<SocialPlatform, string> = {
  facebook: "Facebook",
  instagram: "Instagram",
  linkedin: "LinkedIn",
  youtube: "YouTube",
};

const DEFAULT_SOCIAL: SiteSettings["socialLinks"] = [
  { platform: "facebook", url: "https://facebook.com/mitchdesigns" },
  { platform: "instagram", url: "https://instagram.com/mitchdesigns" },
  { platform: "linkedin", url: "https://linkedin.com/company/mitchdesigns" },
  { platform: "youtube", url: "https://youtube.com/@mitchdesigns" },
];

/* ---------------------------------------------------------------
 * Entrance choreography. Every part has a "hidden" and a "visible"
 * state; the footer flips between them as it enters / leaves the
 * viewport, so scrolling back up resets it and each visit replays it.
 * Leaving is quicker than entering so the reset never feels sluggish.
 * --------------------------------------------------------------- */
const listStagger: Variants = {
  hidden: { transition: { staggerChildren: 0.015, staggerDirection: -1 } },
  visible: { transition: { staggerChildren: 0.05, delayChildren: 0.05 } },
};

const riseIn: Variants = {
  hidden: { opacity: 0, y: 28, transition: { duration: 0.25, ease: easeInOutSoft } },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: easeOutSoft } },
};

/** Wordmark letters slide up out of a mask, one after another. */
const LETTER_STAGGER = 0.035;
const letterRise: Variants = {
  hidden: { y: "105%", transition: { duration: 0.3, ease: easeInOutSoft } },
  visible: (delay: number) => ({
    y: "0%",
    transition: { duration: 0.8, ease: easeOutSoft, delay },
  }),
};

/** Handwritten line is "written" left to right once the letters land. */
const SIGNATURE_DELAY = 0.75;
const signatureWrite: Variants = {
  hidden: {
    clipPath: "inset(-40% 100% -40% -5%)",
    transition: { duration: 0.25, ease: easeInOutSoft },
  },
  visible: {
    clipPath: "inset(-40% -5% -40% -5%)",
    transition: { duration: 1.1, ease: easeInOutSoft, delay: SIGNATURE_DELAY },
  },
};

const fadeLate: Variants = {
  hidden: { opacity: 0, y: 12, transition: { duration: 0.2 } },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: easeOutSoft, delay: 1.1 } },
};

function WordmarkLine({ text, delay }: { text: string; delay: number }) {
  return (
    <span aria-hidden className="flex overflow-hidden py-1">
      {Array.from(text).map((char, i) => (
        <motion.span
          key={i}
          variants={letterRise}
          custom={delay + i * LETTER_STAGGER}
          className="inline-block"
        >
          {char}
        </motion.span>
      ))}
    </span>
  );
}

function NavCol({ title, links }: { title: string; links: { label: string; href: string; yellow?: boolean }[] }) {
  return (
    <motion.div variants={listStagger} className="flex flex-col gap-5 lg:gap-footer-list">
      <motion.p variants={riseIn} className="text-lg font-bold text-white">{title}</motion.p>
      <motion.ul variants={listStagger} className="flex flex-col gap-4 lg:gap-footer-list">
        {links.map((link) => (
          <motion.li key={link.href} variants={riseIn}>
            <Link
              href={link.href}
              className={`text-base transition-opacity hover:opacity-80 lg:text-lg lg:short:text-base ${link.yellow ? "text-yellow" : "text-fg-muted"}`}
            >
              {link.label}
            </Link>
          </motion.li>
        ))}
      </motion.ul>
    </motion.div>
  );
}

export function Footer({
  hideTop = false,
  settings,
}: {
  hideTop?: boolean;
  settings?: SiteSettings;
}) {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  const social = settings?.socialLinks?.length ? settings.socialLinks : DEFAULT_SOCIAL;
  const urlFor = (p: SocialPlatform, fallback: string) =>
    social.find((s) => s.platform === p)?.url ?? fallback;
  const waNumber = settings?.whatsappNumber ?? "+201014430669";
  const waDigits = waNumber.replace(/[^\d]/g, "");
  const waLabel = settings?.whatsappLabel ?? "We’re on Whatsapp";
  const newsletterTitle = settings?.newsletterTitle ?? "Join Our Newsletter";
  const signatureText = settings?.signatureText ?? "webdesign agency";
  const tagline = settings?.tagline ?? "Design. Technology. Performance.";
  const copyright =
    settings?.copyright ?? "© 2005-2026 Mitch Designs. All rights reserved.";
  // Parallax reveal (à la whatmattersagency.com): as the footer scrolls in, its
  // content drifts up from -25% to its resting position while a dark overlay
  // lifts from 0.5 → 0 — both scrubbed to scroll progress over the window from
  // "footer's top enters the viewport bottom" to "footer's top reaches the top".
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "start start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], reduced ? ["0%", "0%"] : ["-25%", "0%"]);
  const overlay = useTransform(scrollYProgress, [0, 1], reduced ? [0, 0] : [0.5, 0]);

  // Entrance triggers — not "once", so leaving resets them for the next visit.
  const topRef = useRef<HTMLDivElement>(null);
  const markRef = useRef<HTMLDivElement>(null);
  const topInView = useInView(topRef, { amount: 0.25 });
  const markInView = useInView(markRef, { amount: 0.5 });
  const topState = reduced || topInView ? "visible" : "hidden";
  const markState = reduced || markInView ? "visible" : "hidden";
  const initial = reduced ? "visible" : "hidden";

  return (
    <footer
      ref={ref}
      className="relative overflow-hidden bg-black pt-12 pb-8 lg:flex lg:min-h-svh lg:flex-col lg:pt-footer-y lg:short:pb-5"
    >
      {/* Dots pattern — bottom edge decoration (same as CreativeHero) */}
      <div
        className="dots-pattern pointer-events-none absolute inset-x-0 bottom-0 h-40 opacity-70"
        aria-hidden
      />
      <motion.div style={{ y }} className="container-page relative lg:flex lg:flex-1 lg:flex-col">

        {/* Top: link columns + contact cards */}
        <motion.div
          ref={topRef}
          variants={listStagger}
          initial={initial}
          animate={topState}
        >
        {!hideTop && (
          <motion.div
            variants={listStagger}
            className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between"
          >

            {/* Left: Company + Services columns */}
            <motion.div
              variants={listStagger}
              className="flex justify-between gap-6 sm:justify-center sm:gap-12 lg:justify-start lg:gap-16"
            >
              <NavCol
                title="Company"
                links={[
                  ...COMPANY_LINKS,
                  { label: "Get Detailed Proposal", href: LEADS_URL, yellow: true },
                ]}
              />
              <NavCol title="Services" links={SERVICE_LINKS} />
            </motion.div>

            {/* Right: WhatsApp + Newsletter cards */}
            <motion.div
              variants={listStagger}
              className="flex flex-col gap-8 lg:w-[35rem] lg:shrink-0 lg:gap-footer-list"
            >

              {/* WhatsApp card */}
              <motion.a
                variants={riseIn}
                href={`https://wa.me/${waDigits}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 rounded-card-md bg-space-grey px-6 py-5 transition-opacity hover:opacity-90 lg:gap-5 lg:px-9 lg:py-6 lg:short:py-4"
              >
                <WhatsApp size={48} className="shrink-0 lg:hidden" />
                <WhatsApp size={80} className="hidden shrink-0 lg:block lg:short:size-14" />
                <div className="flex flex-col">
                  <span className="text-lg text-white">{waLabel}</span>
                  <span className="text-2xl font-medium text-white">{waNumber}</span>
                </div>
              </motion.a>

              {/* Newsletter card */}
              <motion.div variants={riseIn} className="rounded-xl bg-space-grey px-4 py-6 lg:short:py-4">
                <p className="text-center text-lg font-bold text-white lg:text-left">{newsletterTitle}</p>
                <NewsletterForm />
                <div className="mt-8 flex justify-center gap-6 lg:justify-start lg:short:mt-4">
                  {social.map(({ platform, url }) => {
                    const Icon = SOCIAL_ICONS[platform];
                    return (
                      <a
                        key={platform}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={SOCIAL_LABELS[platform]}
                        className="text-yellow transition-opacity hover:opacity-70"
                      >
                        <Icon size={32} />
                      </a>
                    );
                  })}
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        )}

        {/* Divider + social links row */}
        <motion.div
          variants={riseIn}
          className={`border-t border-space-grey pt-3 ${hideTop ? "" : "mt-12 lg:mt-footer-y"}`}
        >
          <div className="flex flex-wrap items-center justify-center gap-2 lg:justify-start">
            <a href={urlFor("linkedin", "https://linkedin.com/company/mitchdesigns")} target="_blank" rel="noopener noreferrer" className="text-lg text-fg-muted transition-opacity hover:opacity-80">LinkedIn</a>
            <span className="h-1 w-1 rounded-full bg-fg-muted" aria-hidden />
            <a href={urlFor("instagram", "https://instagram.com/mitchdesigns")} target="_blank" rel="noopener noreferrer" className="text-lg text-fg-muted transition-opacity hover:opacity-80">Instagram</a>
            <span className="h-1 w-1 rounded-full bg-fg-muted" aria-hidden />
            <Link href="/privacy" className="text-lg text-fg-muted transition-opacity hover:opacity-80">Privacy Policy</Link>
            <span className="h-1 w-1 rounded-full bg-fg-muted" aria-hidden />
            <Link href="/terms" className="text-lg text-fg-muted transition-opacity hover:opacity-80">Terms of Service</Link>
          </div>
        </motion.div>
        </motion.div>

        {/* Wordmark */}
        <motion.div
          ref={markRef}
          initial={initial}
          animate={markState}
          className="pointer-events-none relative mt-12 lg:mt-auto lg:pt-footer-y"
        >
          <div className="footer-grid absolute inset-0" aria-hidden />
          <div className="relative flex flex-col gap-6 lg:flex-row lg:flex-wrap lg:items-end lg:justify-between">
            <div className="min-w-0">
              {/* "Mitch" with signature overlay */}
              <div className="relative">
                <motion.span
                  variants={signatureWrite}
                  className="absolute left-4 -top-8 z-10 whitespace-nowrap font-signature text-signature text-yellow leading-[47px] lg:text-signature-fit"
                  style={{ rotate: "-4deg", transformOrigin: "left center" }}
                  aria-hidden
                >
                  {signatureText}
                </motion.span>
                <p className="font-wordmark text-wordmark font-bold leading-none text-white uppercase lg:text-wordmark-fit">
                  <span className="sr-only">Mitch</span>
                  <WordmarkLine text="Mitch" delay={0} />
                </p>
              </div>
              <p className="flex items-start font-wordmark text-wordmark font-bold leading-none text-white uppercase lg:text-wordmark-fit">
                <span className="sr-only">Designs</span>
                <WordmarkLine text="Designs" delay={0.12} />
                <motion.sup
                  variants={fadeLate}
                  className="ml-1 font-sans text-lg font-medium"
                >
                  TM
                </motion.sup>
              </p>
            </div>
            <motion.p
              variants={fadeLate}
              className="text-xl font-medium text-white lg:self-end whitespace-nowrap"
            >
              {tagline}
            </motion.p>
          </div>

          {/* Copyright */}
          <motion.p
            variants={fadeLate}
            className="mt-6 text-center text-xs font-medium text-grey-200 lg:text-right lg:short:mt-3"
          >
            {copyright}
          </motion.p>
        </motion.div>

      </motion.div>

      {/* Dark overlay — dims the footer on entry, lifts to fully clear as it
          settles into view (matches the source site's parallax). */}
      <motion.div
        style={{ opacity: overlay }}
        className="pointer-events-none absolute inset-0 bg-black"
        aria-hidden
      />
    </footer>
  );
}
