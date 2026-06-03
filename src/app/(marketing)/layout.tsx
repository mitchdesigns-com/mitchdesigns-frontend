import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { RevealFooter } from "@/components/layout/RevealFooter";
import { HeaderConfigProvider } from "@/context/HeaderConfigContext";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <HeaderConfigProvider>
      <RevealFooter footer={<Footer />}>
        <Header />
        <main id="main">{children}</main>
      </RevealFooter>
    </HeaderConfigProvider>
  );
}
