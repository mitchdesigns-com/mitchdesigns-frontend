import { ClientsTrust, type TrustReasonCard } from "@/features/ClientsTrust/ClientsTrust";

// Shared across all role pages — same UI as the homepage ClientsTrust slider.
// TODO: supply card images (designs use a photo per card); null renders an
// empty space-grey panel for now.
const EXPERIENCE_CARDS: TrustReasonCard[] = [
  {
    image: null,
    title: "Work Directly With Decision Makers",
    body: "You won’t be buried under layers of management. You’ll collaborate closely with leadership, contribute ideas that matter, and see your work influence real business outcomes.",
  },
  {
    image: null,
    title: "Build Custom, Not Cookie-Cutter",
    body: "We don’t do templates. You’ll design and develop platforms built from the ground up — giving you real problem-solving challenges and portfolio-worthy projects.",
  },
  {
    image: null,
    title: "Work With Modern, Scalable Tech",
    body: "From APIs and CRMs to eCommerce infrastructure, you’ll gain hands-on experience integrating systems that power real businesses — not mock projects.",
  },
  {
    image: null,
    title: "Long-Term Projects, Not One-Off Jobs",
    body: "We build lasting relationships with clients — and we want to build one with you too. Expect ongoing collaboration, iteration, and growth instead of short-term churn.",
  },
  {
    image: null,
    title: "Create Work That Actually Performs",
    body: "Your designs won’t just look good — they’ll drive measurable growth. You’ll see the impact of your work in conversions, revenue, and performance metrics.",
  },
];

export function CareerExperience({
  heading = "What You’ll Experience at MitchDesigns",
  cards,
}: {
  heading?: string;
  cards?: TrustReasonCard[];
} = {}) {
  return (
    <ClientsTrust
      reasons={cards && cards.length ? cards : EXPERIENCE_CARDS}
      heading={heading}
      intro={null}
      cta={null}
    />
  );
}
