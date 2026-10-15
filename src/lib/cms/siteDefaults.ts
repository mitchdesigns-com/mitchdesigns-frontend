/**
 * Site-settings defaults — what shows while Strapi is empty or unreachable.
 * Pure data (no server-only imports), so client components can use it too.
 */
import { LEADS_URL } from "@/config/nav";
import type { SiteSettings } from "./types";

/** Defaults match the values previously hardcoded in the Footer. */
export const SITE_SETTINGS_FALLBACK: SiteSettings = {
  contactEmail: undefined,
  contactPhone: undefined,
  whatsappNumber: "+201014430669",
  whatsappLabel: "We’re on Whatsapp",
  newsletterTitle: "Join Our Newsletter",
  signatureText: "webdesign agency",
  tagline: "Design. Technology. Performance.",
  copyright: "© 2005-2026 Mitch Designs. All rights reserved.",
  socialLinks: [
    { platform: "facebook", url: "https://facebook.com/mitchdesigns" },
    { platform: "instagram", url: "https://instagram.com/mitchdesigns" },
    { platform: "linkedin", url: "https://linkedin.com/company/mitchdesigns" },
    { platform: "youtube", url: "https://youtube.com/@mitchdesigns" },
  ],
  primaryCta: { label: "Get Detailed Proposal", href: LEADS_URL },
  legalLinks: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
  ],
  testimonialsHeading: "Loved By Clients",
  testimonialsIntro:
    "Hear it from the brands and people who trusted us — genuine feedback that tells our story better than we can.",
};
