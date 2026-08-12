import type { Metadata } from "next";
import { draftMode } from "next/headers";
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
  // draftMode keeps this page static for the public; only editors (who entered
  // via /api/edit, which enables draft mode) render dynamically with data-fe.
  const { isEnabled: editMode } = await draftMode();
  const data = await getOrderbasePage({ draft: editMode });
  const edit = { mode: editMode, documentId: data.documentId };
  const strapi = process.env.NEXT_PUBLIC_STRAPI_URL ?? "";

  return (
    <>
      <OrbIconDefs />
      {data.nav && <OrderbaseNav nav={data.nav} />}
      {data.hero && <Hero data={data.hero} edit={edit} />}
      {data.ribbon?.length > 0 && <Ribbon words={data.ribbon} />}
      {data.audience && <Audience data={data.audience} edit={edit} />}
      {data.challenges && <Challenges data={data.challenges} edit={edit} />}
      {data.opportunity && <Opportunity data={data.opportunity} edit={edit} />}
      {data.platform && <Platform data={data.platform} edit={edit} />}
      {data.showcase && <Showcase data={data.showcase} edit={edit} />}
      {data.core && <CoreFeatures data={data.core} edit={edit} />}
      {data.featureTabs && <FeatureTabs data={data.featureTabs} edit={edit} />}
      {data.payments && <Payments data={data.payments} edit={edit} />}
      {data.integrations && <Integrations data={data.integrations} edit={edit} />}
      {data.why && <WhyMitch data={data.why} edit={edit} />}
      {data.pricing && <Pricing data={data.pricing} edit={edit} />}
      {data.contact && <Contact data={data.contact} edit={edit} />}
      {data.footer && <Footer data={data.footer} edit={edit} />}
      {editMode && strapi && (
        <script src={`${strapi}/api/front-edit/overlay.js`} defer />
      )}
    </>
  );
}
