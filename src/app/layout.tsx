import type { Metadata } from "next";
import Script from "next/script";
import { Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["700"],
  variable: "--font-poppins",
  display: "swap",
});
import { JsonLd } from "@/components/seo/JsonLd";
// import { UserbackWidget } from "@/components/Userback";

const SITE_URL = "https://mitchdesigns.com";
const SITE_NAME = "MitchDesigns";
const SITE_DESCRIPTION =
  "MitchDesigns is a website and mobile app design agency based in Egypt. We design, build, and grow premium digital products for ambitious brands across Egypt and the MENA region.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  manifest: "/site.webmanifest",
  title: {
    default: "MitchDesigns — Website & Mobile App Design Agency in Egypt",
    template: "%s · MitchDesigns",
  },
  description: SITE_DESCRIPTION,
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    locale: "en_US",
    url: SITE_URL,
    title: "MitchDesigns — Website & Mobile App Design Agency in Egypt",
    description: SITE_DESCRIPTION,
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: SITE_NAME }],
  },
  twitter: {
    card: "summary_large_image",
    site: "@mitchdesigns", // TODO: confirm handle
    creator: "@mitchdesigns",
    title: "MitchDesigns — Website & Mobile App Design Agency in Egypt",
    description: SITE_DESCRIPTION,
  },
  robots: process.env.NEXT_PUBLIC_INDEXABLE === "true"
    ? { index: true, follow: true }
    : { index: false, follow: false },
};

// Single @graph merges Organization + WebSite into one <script> tag instead of two
const siteGraph = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
      logo: `${SITE_URL}/logo.png`,
      description:
        "Website and mobile app design agency based in Egypt, building premium digital products for brands across the MENA region.",
      address: { "@type": "PostalAddress", addressCountry: "EG" },
      sameAs: [
        "https://www.linkedin.com/company/mitchdesigns",
        "https://twitter.com/mitchdesigns",
        // TODO: add Instagram, Behance, Dribbble URLs
      ],
    },
    {
      "@type": "WebSite",
      name: SITE_NAME,
      url: SITE_URL,
      potentialAction: {
        "@type": "SearchAction",
        target: `${SITE_URL}/case-studies?q={search_term_string}`,
        "query-input": "required name=search_term_string",
      },
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={poppins.variable}>
      <head>
        {/* Preload the LCP body/heading font so it isn't discovered late via CSS */}
        <link
          rel="preload"
          href="/fonts/Satoshi-Variable.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <Script
          src="https://feedback-widget.mitchdesigns.workers.dev/widget.js"
          data-ingest-key="pk_b9de74ec44ea8cd03eeedbe6438440e7"
          data-endpoint="https://caereguiqcqhfvmskxlu.supabase.co/functions/v1/ingest-feedback"
          strategy="lazyOnload"
          data-position="bottom-left"
          data-buttonText="Our Feedback"
        />
      </head>
      <body className="min-h-dvh antialiased">
        <JsonLd data={siteGraph} />
        {children}
        {/* <UserbackWidget /> */}
      </body>
    </html>
  );
}
