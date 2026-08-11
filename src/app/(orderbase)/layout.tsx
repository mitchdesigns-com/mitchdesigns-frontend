import { Plus_Jakarta_Sans, Inter } from "next/font/google";
import "./orderbase/_lib/orderbase.css";

// Bespoke type pairing for the Orderbase microsite. Exposed as CSS vars that the
// @theme `--font-ob-*` tokens reference; scoped to this route group only.
const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-ob-jakarta",
  display: "swap",
});
const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
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
