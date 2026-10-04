import { CompassIcon } from "@/components/icons/CompassIcon";
import { GaugeIcon } from "@/components/icons/GaugeIcon";
import { LayersIcon } from "@/components/icons/LayersIcon";
import { LifeBuoyIcon } from "@/components/icons/LifeBuoyIcon";
import { LinkIcon } from "@/components/icons/LinkIcon";
import { PenToolIcon } from "@/components/icons/PenToolIcon";

type TrustIcon = {
  Icon: typeof CompassIcon;
  /** Looping animation class (keyframes in globals.css → "Trust icon loops"). */
  loop: string;
};

/** Card titles come from the CMS (no icon field), so the icon is picked from
 *  the title's meaning. Order matters: the first match wins. */
const RULES: Array<[RegExp, TrustIcon]> = [
  [/founder|decision|expert/i, { Icon: CompassIcon, loop: "icon-loop-compass" }],
  [/tailor|custom|cookie/i, { Icon: LayersIcon, loop: "icon-loop-layers" }],
  [/integrat|tech/i, { Icon: LinkIcon, loop: "icon-loop-link" }],
  [/design/i, { Icon: PenToolIcon, loop: "icon-loop-pen" }],
  [/partner|launch|long-term|support/i, { Icon: LifeBuoyIcon, loop: "icon-loop-buoy" }],
  [/perform|impact|growth|result/i, { Icon: GaugeIcon, loop: "icon-loop-gauge" }],
];

const FALLBACK = RULES.map(([, icon]) => icon);

export function trustIconFor(title: string, index: number): TrustIcon {
  return RULES.find(([re]) => re.test(title))?.[1] ?? FALLBACK[index % FALLBACK.length];
}
