import localFont from "next/font/local";
import "./orderbase/_lib/orderbase.css";

// Self-hosted to avoid a build-time Google Fonts fetch (the CI runner can't
// reach fonts.gstatic.com reliably). Files are the basic-latin woff2 subsets
// from the design source. Exposed as CSS vars the @theme `--font-ob-*` tokens
// reference; scoped to this route group only.
const jakarta = localFont({
  src: [
    { path: "./orderbase/_lib/fonts/jakarta-400.woff2", weight: "400", style: "normal" },
    { path: "./orderbase/_lib/fonts/jakarta-500.woff2", weight: "500", style: "normal" },
    { path: "./orderbase/_lib/fonts/jakarta-600.woff2", weight: "600", style: "normal" },
    { path: "./orderbase/_lib/fonts/jakarta-700.woff2", weight: "700", style: "normal" },
    { path: "./orderbase/_lib/fonts/jakarta-800.woff2", weight: "800", style: "normal" },
  ],
  variable: "--font-ob-jakarta",
  display: "swap",
});
const inter = localFont({
  src: [
    { path: "./orderbase/_lib/fonts/inter-400.woff2", weight: "400", style: "normal" },
    { path: "./orderbase/_lib/fonts/inter-500.woff2", weight: "500", style: "normal" },
    { path: "./orderbase/_lib/fonts/inter-600.woff2", weight: "600", style: "normal" },
    { path: "./orderbase/_lib/fonts/inter-700.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-ob-inter",
  display: "swap",
});

// Standalone layout: the Orderbase landing ships its own nav + footer, so it
// deliberately opts out of the site-wide Header/Footer (which live in the
// (marketing) group).
export default function OrderbaseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      data-ob
      className={`${jakarta.variable} ${inter.variable} min-h-dvh scroll-smooth bg-white`}
    >
      {children}
    </div>
  );
}
