import type { Metadata } from "next";
import { Hero } from "./_components/Hero";
import { TrustedBrands } from "./_components/TrustedBrands";
import { MeetSection } from "./_components/MeetSection";
import { MoreAbout } from "./_components/MoreAbout";
import { ChallengeSection } from "./_components/ChallengeSection";
import { Journey } from "./_components/Journey";
import { DeliveryOperations } from "./_components/DeliveryOperations";
import { Pricing } from "./_components/Pricing";
import { SinceFrom } from "./_components/SinceFrom";
import { ReadyToOwn } from "./_components/ReadyToOwn";
import { getOrderbasePage } from "@/lib/cms";

export const metadata: Metadata = {
  title: "Orderbase — Case Study",
  description: "How we built and launched Orderbase.",
};

export default async function OrderbasePage() {
  const data = await getOrderbasePage();

  return (
    <div className="min-h-dvh">
      <Hero {...data.hero} title={data.hero?.title ?? ""} />
      <TrustedBrands brands={data.brands} />
      <MeetSection {...data.meet} />
      <ChallengeSection
        label={data.challenge?.label}
        title={data.challenge?.title}
        features={data.challenge?.items}
      />
      <MoreAbout {...data.moreAbout} />
      <Journey {...data.journey} />
      <DeliveryOperations {...data.delivery} />
      <Pricing {...data.pricing} />
      <SinceFrom {...data.sinceFrom} />
      <ReadyToOwn {...data.readyToOwn} />
    </div>
  );
}
