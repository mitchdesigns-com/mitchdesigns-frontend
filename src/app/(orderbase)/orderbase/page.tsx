import type { Metadata } from "next";
import { getOrderbasePage } from "@/lib/cms/queries";
import { OrbIconDefs } from "./_lib/OrbIcon";
import { OrderbaseNav } from "./_components/OrderbaseNav";
import { Hero } from "./_components/Hero";
import { Ribbon } from "./_components/Ribbon";
import { Audience } from "./_components/Audience";
import { Challenges } from "./_components/Challenges";
import { Opportunity } from "./_components/Opportunity";
import { Platform } from "./_components/Platform";
import { Showcase } from "./_components/Showcase";
import { CoreFeatures } from "./_components/CoreFeatures";
import { FeatureTabs } from "./_components/FeatureTabs";
import { Payments } from "./_components/Payments";
import { Integrations } from "./_components/Integrations";
import { WhyMitch } from "./_components/WhyMitch";
import { Pricing } from "./_components/Pricing";
import { Contact } from "./_components/Contact";
import { Footer } from "./_components/Footer";

export async function generateMetadata(): Promise<Metadata> {
  const data = await getOrderbasePage();
  return {
    title: data.meta?.title ?? "Orderbase — eCommerce for Food Brands",
    description: data.meta?.description,
  };
}

export default async function OrderbasePage() {
  const data = await getOrderbasePage();

  return (
    <>
      <OrbIconDefs />
      {data.nav && <OrderbaseNav nav={data.nav} />}
      {data.hero && <Hero data={data.hero} />}
      {data.ribbon?.length > 0 && <Ribbon words={data.ribbon} />}
      {data.audience && <Audience data={data.audience} />}
      {data.challenges && <Challenges data={data.challenges} />}
      {data.opportunity && <Opportunity data={data.opportunity} />}
      {data.platform && <Platform data={data.platform} />}
      {data.showcase && <Showcase data={data.showcase} />}
      {data.core && <CoreFeatures data={data.core} />}
      {data.featureTabs && <FeatureTabs data={data.featureTabs} />}
      {data.payments && <Payments data={data.payments} />}
      {data.integrations && <Integrations data={data.integrations} />}
      {data.why && <WhyMitch data={data.why} />}
      {data.pricing && <Pricing data={data.pricing} />}
      {data.contact && <Contact data={data.contact} />}
      {data.footer && <Footer data={data.footer} />}
    </>
  );
}
