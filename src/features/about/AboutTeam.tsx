import { Section } from "@/components/layout/Section";
import { Reveal } from "@/components/motion";
import type { AboutContent } from "@/lib/cms/types";
import { AboutVideo } from "./AboutVideo";
import { Eyebrow } from "./Eyebrow";

/** The short company film. Until it's ready, the 2026 showreel plays here —
 *  drop the film in public/videos/ and point this at it. */
const ABOUT_FILM = "/videos/Mitch_Showreel_2026_Final_25MB.webm";

/** Short line under the film (front-end only). */
const FILM_CAPTION =
  "Step inside our studio — meet the designers, developers and strategists who turn bold ideas into digital products people love to use, and see how we work, day in and day out.";

/**
 * Team: the belief statement centred over the company film, shown frozen
 * with a yellow play circle; click to play it in place.
 */
export function AboutTeam({ team }: { team: AboutContent["team"] }) {
  return (
    <Section theme="dark" className="py-24 md:py-32">
      <Reveal className="mx-auto flex max-w-4xl flex-col items-center text-center">
        <Eyebrow className="mb-4">{team.badge}</Eyebrow>
        <h2 className="text-hero-3 font-bold text-fg text-balance">{team.heading}</h2>
      </Reveal>

      {/* The company film (front-end only), frozen until played. */}
      <div className="mt-14 md:mt-20">
        <AboutVideo src={ABOUT_FILM} title="the MitchDesigns company film" />
      </div>
      <Reveal className="mx-auto mt-10 max-w-2xl text-center md:mt-14">
        <p className="text-xl text-fg-muted text-balance">{FILM_CAPTION}</p>
      </Reveal>
    </Section>
  );
}
