import type { Metadata } from "next";
import { CareersHero } from "@/features/careers/CareersHero";
import { OurDrive } from "@/features/careers/OurDrive";
import { OpenPositions } from "@/features/careers/OpenPositions";
import { getCareers, getCareersPage } from "@/lib/cms";

export const metadata: Metadata = {
  title: "Careers",
  description: "Open roles at MitchDesigns.",
  alternates: { canonical: "/careers" },
};

export default async function CareersIndexPage() {
  const [jobs, page] = await Promise.all([getCareers(), getCareersPage()]);

  return (
    <main>
      <CareersHero {...page.hero} />
      <OurDrive drives={page.drives} />
      <OpenPositions jobs={jobs} />
    </main>
  );
}
