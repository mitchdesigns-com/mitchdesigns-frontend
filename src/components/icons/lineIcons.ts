import type { LineIconKey } from "@/lib/cms/types";
import { AtomIcon } from "./AtomIcon";
import { BellRingIcon } from "./BellRingIcon";
import { BoxIcon } from "./BoxIcon";
import { CardIcon } from "./CardIcon";
import { ChatIcon } from "./ChatIcon";
import { CloudSyncIcon } from "./CloudSyncIcon";
import { CodeIcon } from "./CodeIcon";
import { CompassIcon } from "./CompassIcon";
import { CursorClickIcon } from "./CursorClickIcon";
import { FunnelIcon } from "./FunnelIcon";
import { GaugeIcon } from "./GaugeIcon";
import { GlobeIcon } from "./GlobeIcon";
import { HeadsetIcon } from "./HeadsetIcon";
import { LayersIcon } from "./LayersIcon";
import { LifeBuoyIcon } from "./LifeBuoyIcon";
import { LinkIcon } from "./LinkIcon";
import { LockIcon } from "./LockIcon";
import { MonitorIcon } from "./MonitorIcon";
import { PenToolIcon } from "./PenToolIcon";
import { PhoneIcon } from "./PhoneIcon";
import { PresentationIcon } from "./PresentationIcon";
import { ProductGridIcon } from "./ProductGridIcon";
import { PulseIcon } from "./PulseIcon";
import { ReceiptIcon } from "./ReceiptIcon";
import { SearchIcon } from "./SearchIcon";
import { ServerIcon } from "./ServerIcon";
import { SparklesIcon } from "./SparklesIcon";
import { SplitTestIcon } from "./SplitTestIcon";
import { TabletIcon } from "./TabletIcon";
import { TagIcon } from "./TagIcon";
import { TargetIcon } from "./TargetIcon";
import { TeamIcon } from "./TeamIcon";
import { TrendLineIcon } from "./TrendLineIcon";

export type LineIcon = {
  Icon: typeof SearchIcon;
  /** Looping animation class (keyframes in globals.css → "Trust icon loops"). */
  loop: string;
};

const ic = (Icon: LineIcon["Icon"], loop: string): LineIcon => ({ Icon, loop: `icon-loop-${loop}` });

/** Every animated line icon an editor can pick from the CMS `icon` field. */
export const LINE_ICONS: Record<LineIconKey, LineIcon> = {
  compass: ic(CompassIcon, "compass"),
  layers: ic(LayersIcon, "layers"),
  link: ic(LinkIcon, "link"),
  pen: ic(PenToolIcon, "pen"),
  buoy: ic(LifeBuoyIcon, "buoy"),
  gauge: ic(GaugeIcon, "gauge"),
  grid: ic(ProductGridIcon, "grid"),
  board: ic(PresentationIcon, "board"),
  sparkle: ic(SparklesIcon, "sparkle"),
  sync: ic(CloudSyncIcon, "sync"),
  team: ic(TeamIcon, "team"),
  phone: ic(PhoneIcon, "phone"),
  target: ic(TargetIcon, "target"),
  click: ic(CursorClickIcon, "click"),
  funnel: ic(FunnelIcon, "funnel"),
  code: ic(CodeIcon, "code"),
  globe: ic(GlobeIcon, "globe"),
  search: ic(SearchIcon, "search"),
  receipt: ic(ReceiptIcon, "receipt"),
  card: ic(CardIcon, "card"),
  tag: ic(TagIcon, "tag"),
  box: ic(BoxIcon, "box"),
  lock: ic(LockIcon, "lock"),
  pulse: ic(PulseIcon, "pulse"),
  ab: ic(SplitTestIcon, "ab"),
  atom: ic(AtomIcon, "atom"),
  trend: ic(TrendLineIcon, "trend"),
  bell: ic(BellRingIcon, "bell"),
  headset: ic(HeadsetIcon, "headset"),
  chat: ic(ChatIcon, "chat"),
  server: ic(ServerIcon, "server"),
  monitor: ic(MonitorIcon, "monitor"),
  tablet: ic(TabletIcon, "tablet"),
};

/** The icon an editor picked, if it's a known key. */
export function pickedLineIcon(key: string | null | undefined): LineIcon | undefined {
  return key && key in LINE_ICONS ? LINE_ICONS[key as LineIconKey] : undefined;
}
