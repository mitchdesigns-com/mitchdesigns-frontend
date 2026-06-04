import type { Metadata } from "next";
import { CareersHero } from "@/features/careers/CareersHero";
import { OurDrive } from "@/features/careers/OurDrive";
import { OpenPositions } from "@/features/careers/OpenPositions";
import { getCareers } from "@/lib/cms";

export const metadata: Metadata = {
  title: "Careers",
  description: "Open roles at MitchDesigns.",
  alternates: { canonical: "/careers" },
};

export default async function CareersIndexPage() {
  const jobs = await getCareers();

  return (
    <main>
      <CareersHero />
      <OurDrive />
      <OpenPositions jobs={jobs} />
    </main>
  );
}
