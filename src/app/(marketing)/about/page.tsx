import type { Metadata } from "next";
import { AboutHero } from "@/features/about/AboutHero";
import { AboutMetrics } from "@/features/about/AboutMetrics";
import { AboutApproach } from "@/features/about/AboutApproach";
import { InnovateMarquee } from "@/features/about/InnovateMarquee";
import { AboutTeam } from "@/features/about/AboutTeam";
import { AboutStory } from "@/features/about/AboutStory";
import { CTABanner } from "@/features/cta";
import { getAboutPage, getTeam } from "@/lib/cms";

export const metadata: Metadata = {
  title: "About MitchDesigns — Egyptian Design Studio",
  description:
    "MitchDesigns is an Egyptian design studio that has shipped digital products for brands like El Gouna, Lychee, Mountain View, and GoBus. Meet the team behind the work.",
  openGraph: {
    title: "About MitchDesigns — Egyptian Design Studio",
    description:
      "MitchDesigns is an Egyptian design studio that has shipped digital products for brands like El Gouna, Lychee, Mountain View, and GoBus.",
    url: "https://mitchdesigns.com/about",
  },
  alternates: { canonical: "/about" },
};

export default async function AboutPage() {
  const [about, team] = await Promise.all([getAboutPage(), getTeam()]);

  return (
    <>
      <AboutHero hero={about.hero} />
      <AboutMetrics metrics={about.metrics} />
      <AboutApproach approach={about.approach} />
      <InnovateMarquee innovate={about.innovate} />
      <AboutTeam team={about.team} members={team} />
      <AboutStory story={about.story} />
      <CTABanner />
    </>
  );
}
