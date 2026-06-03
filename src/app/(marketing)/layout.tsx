import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { HeaderConfigProvider } from "@/context/HeaderConfigContext";
import { TransitionProvider } from "@/context/TransitionContext";
import { TransitionOverlay } from "@/components/motion/TransitionOverlay";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <TransitionProvider>
      <TransitionOverlay />
      <HeaderConfigProvider>
        <Header />
        <main id="main">
          {children}
        </main>
        <Footer />
      </HeaderConfigProvider>
    </TransitionProvider>
  );
}
