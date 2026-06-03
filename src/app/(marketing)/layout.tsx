import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { HeaderConfigProvider } from "@/context/HeaderConfigContext";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <HeaderConfigProvider>
      <Header />
      <main id="main">
        {children}
      </main>
      <Footer />
    </HeaderConfigProvider>
  );
}
