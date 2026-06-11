"use client";

import { HeroSection } from "./HeroSection";
import { Hero } from "./Hero";


type Props = {
  eyebrow?: string;
  headline?: string;
  rotatingWords?: string[];
};

export function HeroSectionWrapper(props: Props) {
  return (
    <>


      <div>
        <Hero
          eyebrow={props.eyebrow}
          headline={props.headline ?? 'Design. Build. Repeat.'}
          rotatingWords={
            props.rotatingWords && props.rotatingWords.length ? props.rotatingWords : undefined
          }
        />
      </div>
      <HeroSection />
    </>
  );
}
