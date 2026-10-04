import { CardIcon } from "@/components/icons/CardIcon";
import { ChatIcon } from "@/components/icons/ChatIcon";
import { GaugeIcon } from "@/components/icons/GaugeIcon";
import { HeadsetIcon } from "@/components/icons/HeadsetIcon";
import { LifeBuoyIcon } from "@/components/icons/LifeBuoyIcon";
import { PresentationIcon } from "@/components/icons/PresentationIcon";
import { PulseIcon } from "@/components/icons/PulseIcon";
import { ServerIcon } from "@/components/icons/ServerIcon";

type SupportIcon = {
  Icon: typeof HeadsetIcon;
  /** Looping animation class (keyframes in globals.css → "Trust icon loops"). */
  loop: string;
};

/** Support cards come from the CMS (no icon field), so the icon is picked
 *  from the card title's meaning. Order matters: the first match wins. */
const RULES: Array<[RegExp, SupportIcon]> = [
  [/manager|lead|contact/i, { Icon: HeadsetIcon, loop: "icon-loop-headset" }],
  [/communicat|async|chat|update/i, { Icon: ChatIcon, loop: "icon-loop-chat" }],
  [/staging|server|environment|hosting/i, { Icon: ServerIcon, loop: "icon-loop-server" }],
  [/payment|gateway|checkout/i, { Icon: CardIcon, loop: "icon-loop-card" }],
  [/training|onboard|workshop/i, { Icon: PresentationIcon, loop: "icon-loop-board" }],
  [/monitor|performance|uptime/i, { Icon: PulseIcon, loop: "icon-loop-pulse" }],
  [/growth|sprint|scale/i, { Icon: GaugeIcon, loop: "icon-loop-gauge" }],
  [/retainer|support|partner|maintenance/i, { Icon: LifeBuoyIcon, loop: "icon-loop-buoy" }],
];

const FALLBACK = RULES.map(([, icon]) => icon);

export function supportIconFor(title: string, index: number): SupportIcon {
  return RULES.find(([re]) => re.test(title))?.[1] ?? FALLBACK[index % FALLBACK.length];
}
