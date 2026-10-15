import { pickedLineIcon } from "@/components/icons/lineIcons";
import { CardIcon } from "@/components/icons/CardIcon";
import { ChatIcon } from "@/components/icons/ChatIcon";
import { GaugeIcon } from "@/components/icons/GaugeIcon";
import { HeadsetIcon } from "@/components/icons/HeadsetIcon";
import { MonitorIcon } from "@/components/icons/MonitorIcon";
import { PhoneIcon } from "@/components/icons/PhoneIcon";
import { TabletIcon } from "@/components/icons/TabletIcon";
import { LifeBuoyIcon } from "@/components/icons/LifeBuoyIcon";
import { PresentationIcon } from "@/components/icons/PresentationIcon";
import { PulseIcon } from "@/components/icons/PulseIcon";
import { ServerIcon } from "@/components/icons/ServerIcon";
import { TeamIcon } from "@/components/icons/TeamIcon";

type SupportIcon = {
  Icon: typeof HeadsetIcon;
  /** Looping animation class (keyframes in globals.css → "Trust icon loops"). */
  loop: string;
};

/** Support cards come from the CMS (unless an editor picks one in the `icon` field), the icon is picked
 *  from the card title's meaning. Order matters: the first match wins. */
const RULES: Array<[RegExp, SupportIcon]> = [
  [/manager|lead|contact/i, { Icon: HeadsetIcon, loop: "icon-loop-headset" }],
  [/communicat|async|chat|update/i, { Icon: ChatIcon, loop: "icon-loop-chat" }],
  [/staging|server|environment|hosting/i, { Icon: ServerIcon, loop: "icon-loop-server" }],
  [/payment|gateway|checkout/i, { Icon: CardIcon, loop: "icon-loop-card" }],
  [/training|onboard|workshop/i, { Icon: TeamIcon, loop: "icon-loop-team" }],
  [/monitor|performance|speed/i, { Icon: GaugeIcon, loop: "icon-loop-gauge" }],
  [/growth|sprint|scale/i, { Icon: PresentationIcon, loop: "icon-loop-board" }],
  [/uptime|health|alert/i, { Icon: PulseIcon, loop: "icon-loop-pulse" }],
  [/retainer|support|partner|maintenance/i, { Icon: LifeBuoyIcon, loop: "icon-loop-buoy" }],
  // Device cards ("Designs That Adapt")
  [/desktop|monitor|dashboard/i, { Icon: MonitorIcon, loop: "icon-loop-monitor" }],
  [/tablet/i, { Icon: TabletIcon, loop: "icon-loop-tablet" }],
  [/mobile|phone/i, { Icon: PhoneIcon, loop: "icon-loop-phone" }],
];

const FALLBACK = RULES.map(([, icon]) => icon);

export function supportIconFor(title: string, index: number, picked?: string | null): SupportIcon {
  return pickedLineIcon(picked) ?? RULES.find(([re]) => re.test(title))?.[1] ?? FALLBACK[index % FALLBACK.length];
}
