import { Header } from "@/components/layout/Header";
import { FooterFetcher } from "@/components/layout/FooterFetcher";
import { HeaderConfigProvider } from "@/context/HeaderConfigContext";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <HeaderConfigProvider>
      <Header />
      <main id="main">{children}</main>
      <FooterFetcher />
    </HeaderConfigProvider>
  );
}
