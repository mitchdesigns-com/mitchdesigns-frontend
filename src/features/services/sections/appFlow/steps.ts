import type { ProcessSectionProps } from "@/lib/cms/types";
import { blocksToText } from "@/lib/cms/blocks";
import type { FlowStep } from "./screens";

/** Our app designs shown on the phone, one per step (they cycle if there are
 *  more steps). Figma exports at 428×926; padded exports are trimmed on load. */
export const APP_SCREENS = [1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) =>
  encodeURI(`/images/mobile-app/3d-mockup-screens/mobile mockup ${n}.webp`),
);

/** Default mobile-app flow, used when the CMS has no process steps. */
const DEFAULT_STEPS: FlowStep[] = [
  { title: "Discovery & Strategy", description: "We map your users, goals and the features that matter — before a single pixel." },
  { title: "UX Wireframes", description: "Flows and wireframes prove the journey works while it's still quick to change." },
  { title: "UI Design", description: "A polished, on-brand interface designed for both iOS and Android." },
  { title: "Interactive Prototype", description: "A clickable prototype to test the real flow with users before any code." },
  { title: "Development", description: "One React Native codebase with native performance on both platforms." },
  { title: "Testing & QA", description: "Real-device testing, crash monitoring and performance checks before launch." },
  { title: "App Store Launch", description: "Store listings, submission and approval on the App Store and Google Play." },
  { title: "Growth & Support", description: "Analytics-led updates, new features and monitoring long after launch." },
];

/** The app-flow scene tells the CMS process steps when there are any. */
export function appFlowSteps(process?: ProcessSectionProps): FlowStep[] {
  const cards = process?.processCards ?? [];
  if (!cards.length) return DEFAULT_STEPS;
  return cards.map((c) => ({ title: c.title, description: blocksToText(c.description) ?? "" }));
}
