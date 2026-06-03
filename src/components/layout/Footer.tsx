"use client";

import Link from "next/link";
import { NewsletterForm } from "@/components/layout/NewsletterForm";
import { Facebook } from "@/components/icons/Facebook";
import { Instagram } from "@/components/icons/Instagram";
import { LinkedIn } from "@/components/icons/LinkedIn";
import { YouTube } from "@/components/icons/YouTube";
import { WhatsApp } from "@/components/icons/WhatsApp";
import { COMPANY_LINKS, SERVICES, serviceHref } from "@/config/nav";

const SERVICE_LINKS = SERVICES.map((s) => ({
  label: s.footerLabel,
  href: serviceHref(s.slug),
}));

const SOCIAL = [
  { icon: Facebook, label: "Facebook", href: "https://facebook.com/mitchdesigns" },
  { icon: Instagram, label: "Instagram", href: "https://instagram.com/mitchdesigns" },
  { icon: LinkedIn, label: "LinkedIn", href: "https://linkedin.com/company/mitchdesigns" },
  { icon: YouTube, label: "YouTube", href: "https://youtube.com/@mitchdesigns" },
];

function NavCol({ title, links }: { title: string; links: { label: string; href: string; yellow?: boolean }[] }) {
  return (
    <div className="flex flex-col gap-5 lg:gap-8">
      <p className="text-lg font-bold text-white">{title}</p>
      <ul className="flex flex-col gap-4 lg:gap-6">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className={`text-base transition-opacity hover:opacity-80 lg:text-lg ${link.yellow ? "text-yellow" : "text-fg-muted"}`}
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-black pt-12 pb-8 lg:pt-20">
      {/* Dots pattern — bottom edge decoration (same as CreativeHero) */}
      <div
        className="dots-pattern pointer-events-none absolute inset-x-0 bottom-0 h-40 opacity-70"
        aria-hidden
      />
      <div className="container-page relative">

        {/* Top: link columns + contact cards */}
        <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">

          {/* Left: Company + Services columns */}
          <div className="flex justify-between gap-6 sm:justify-center sm:gap-12 lg:justify-start lg:gap-16">
            <NavCol
              title="Company"
              links={[
                ...COMPANY_LINKS,
                { label: "Get Detailed Proposal", href: "/quote", yellow: true },
              ]}
            />
            <NavCol title="Services" links={SERVICE_LINKS} />
          </div>

          {/* Right: WhatsApp + Newsletter cards */}
          <div className="flex flex-col gap-8 lg:w-[35rem] lg:shrink-0">

            {/* WhatsApp card */}
            <a
              href="https://wa.me/201014430669"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 rounded-card-md bg-space-grey px-6 py-5 transition-opacity hover:opacity-90 lg:gap-5 lg:px-9 lg:py-6"
            >
              <WhatsApp size={48} className="shrink-0 lg:hidden" />
              <WhatsApp size={80} className="hidden shrink-0 lg:block" />
              <div className="flex flex-col">
                <span className="text-lg text-white">We&rsquo;re on Whatsapp</span>
                <span className="text-2xl font-medium text-white">+201014430669</span>
              </div>
            </a>

            {/* Newsletter card */}
            <div className="rounded-xl bg-space-grey px-4 py-6">
              <p className="text-center text-lg font-bold text-white lg:text-left">Join Our Newsletter</p>
              <NewsletterForm />
              <div className="mt-8 flex justify-center gap-6 lg:justify-start">
                {SOCIAL.map(({ icon: Icon, label, href }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="text-yellow transition-opacity hover:opacity-70"
                  >
                    <Icon size={32} />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Divider + social links row */}
        <div className="mt-12 border-t border-space-grey pt-3 lg:mt-15">
          <div className="flex flex-wrap items-center justify-center gap-2 lg:justify-start">
            <a href="https://linkedin.com/company/mitchdesigns" target="_blank" rel="noopener noreferrer" className="text-lg text-fg-muted transition-opacity hover:opacity-80">LinkedIn</a>
            <span className="h-1 w-1 rounded-full bg-fg-muted" aria-hidden />
            <a href="https://instagram.com/mitchdesigns" target="_blank" rel="noopener noreferrer" className="text-lg text-fg-muted transition-opacity hover:opacity-80">Instagram</a>
            <span className="h-1 w-1 rounded-full bg-fg-muted" aria-hidden />
            <Link href="/privacy" className="text-lg text-fg-muted transition-opacity hover:opacity-80">Privacy Policy</Link>
          </div>
        </div>

        {/* Wordmark */}
        <div className="relative mt-12 lg:mt-20">
          <div className="footer-grid absolute inset-0" aria-hidden />
          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              {/* "Mitch" with signature overlay */}
              <div className="relative">
                <span
                  className="absolute left-4 -top-8 whitespace-nowrap font-signature text-wordmark-sm text-yellow lg:text-signature-lg leading-[47px]"
                  style={{ rotate: "-4deg", transformOrigin: "left center" }}
                  aria-hidden
                >
                  webdesign agency
                </span>
                <p className="font-wordmark text-wordmark-sm font-bold leading-none text-white lg:text-wordmark-lg uppercase">
                  Mitch
                </p>
              </div>
              <p className="font-wordmark text-wordmark-sm font-bold leading-none text-white lg:text-wordmark-lg uppercase">
                Designs
                <sup className="ml-1 align-super font-sans text-lg font-medium">
                  TM
                </sup>
              </p>
            </div>
            <p className="text-xl font-medium text-white lg:self-end">
              Design. Technology. Performance.
            </p>
          </div>
        </div>

        {/* Copyright */}
        <p className="mt-6 text-center text-xs font-medium text-grey-200 lg:text-right">
          © 2005-2026 Mitch Designs. All rights reserved.
        </p>

      </div>
    </footer>
  );
}
