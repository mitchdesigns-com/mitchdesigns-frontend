/**
 * Short one-line summaries for the work-steps list (front-end only — the CMS
 * process steps carry bullet lists, too long for the open row). Matched by
 * step title; unmatched steps fall back to the CMS text as one sentence.
 */
import type { ProcessCard } from "@/lib/cms/types";

const SUMMARIES: Array<[RegExp, string]> = [
  // Corporate
  [/discovery|strategy/i, "We learn your business, goals and audience, then plan the site around them."],
  [/ux & information|information architecture/i, "We map every page and journey in wireframes before any design starts."],
  [/^ui design/i, "Your brand turned into polished, responsive designs for every screen."],
  [/^development$/i, "We build it fast and accessible, with demos every week so you see progress."],
  [/qa & performance/i, "Tested on every browser and device, tuned for speed and accessibility."],
  [/launch & handover/i, "We go live with zero downtime, train your team and watch it for 30 days."],
  // Custom platforms
  [/requirements|architecture/i, "We dig into your workflows and data, then choose the right architecture."],
  [/ux design & prototyping|prototyp/i, "A clickable prototype of every role and flow, validated before we build."],
  [/sprint/i, "Two-week sprints, each ending in a working demo you can try."],
  [/qa & security|security audit/i, "Functional, load and security testing so it holds up in the real world."],
  [/deployment|handover/i, "We set up the pipeline, ship it, and hand your team the keys and docs."],
];

/** Plain text from a CMS description (string, string list or rich-text blocks). */
function plainText(value: unknown): string {
  if (typeof value === "string") return value;
  if (Array.isArray(value)) return value.map(plainText).filter(Boolean).join(". ");
  if (value && typeof value === "object") {
    const node = value as { text?: string; children?: unknown };
    return node.text ?? plainText(node.children);
  }
  return "";
}

export function workStepSummary(card: Pick<ProcessCard, "title" | "description">): string {
  return SUMMARIES.find(([re]) => re.test(card.title))?.[1] ?? plainText(card.description);
}
