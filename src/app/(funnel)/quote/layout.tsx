import type { Metadata } from "next";
import { HeaderMinimal } from "@/components/layout/HeaderMinimal";
import { Footer } from "@/components/layout/Footer";

// Thin, multi-step funnel URLs shouldn't be indexed — keep them out of the
// crawl but let equity flow through their links.
export const metadata: Metadata = {
  robots: { index: false, follow: true },
};

export default function QuoteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-dvh flex-col">
      <HeaderMinimal />
      <main className="flex-1">{children}</main>
      <Footer hideTop />
    </div>
  );
}
