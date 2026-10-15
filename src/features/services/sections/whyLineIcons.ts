import { pickedLineIcon } from "@/components/icons/lineIcons";
import { AtomIcon } from "@/components/icons/AtomIcon";
import { BellRingIcon } from "@/components/icons/BellRingIcon";
import { BoxIcon } from "@/components/icons/BoxIcon";
import { CardIcon } from "@/components/icons/CardIcon";
import { CloudSyncIcon } from "@/components/icons/CloudSyncIcon";
import { CodeIcon } from "@/components/icons/CodeIcon";
import { CompassIcon } from "@/components/icons/CompassIcon";
import { CursorClickIcon } from "@/components/icons/CursorClickIcon";
import { FunnelIcon } from "@/components/icons/FunnelIcon";
import { GaugeIcon } from "@/components/icons/GaugeIcon";
import { GlobeIcon } from "@/components/icons/GlobeIcon";
import { LayersIcon } from "@/components/icons/LayersIcon";
import { LifeBuoyIcon } from "@/components/icons/LifeBuoyIcon";
import { LinkIcon } from "@/components/icons/LinkIcon";
import { LockIcon } from "@/components/icons/LockIcon";
import { PenToolIcon } from "@/components/icons/PenToolIcon";
import { PhoneIcon } from "@/components/icons/PhoneIcon";
import { PresentationIcon } from "@/components/icons/PresentationIcon";
import { ProductGridIcon } from "@/components/icons/ProductGridIcon";
import { PulseIcon } from "@/components/icons/PulseIcon";
import { ReceiptIcon } from "@/components/icons/ReceiptIcon";
import { SearchIcon } from "@/components/icons/SearchIcon";
import { SparklesIcon } from "@/components/icons/SparklesIcon";
import { SplitTestIcon } from "@/components/icons/SplitTestIcon";
import { TagIcon } from "@/components/icons/TagIcon";
import { TargetIcon } from "@/components/icons/TargetIcon";
import { TeamIcon } from "@/components/icons/TeamIcon";
import { TrendLineIcon } from "@/components/icons/TrendLineIcon";

type LineIcon = {
  Icon: typeof SearchIcon;
  /** Looping animation class (keyframes in globals.css → "Trust icon loops"). */
  loop: string;
};
const ic = (Icon: LineIcon["Icon"], loop: string): LineIcon => ({ Icon, loop: `icon-loop-${loop}` });

/** "Why Us" cards come from the CMS (unless an editor picks one in the `icon` field), each gets a flat
 *  outline icon picked from its title's meaning. Order matters: the first
 *  match wins, so the specific rules come before the general ones. */
const RULES: Array<[RegExp, LineIcon]> = [
  [/catalog/i, ic(ProductGridIcon, "grid")],
  [/report|analytic|attribution|progress/i, ic(PresentationIcon, "board")],
  [/performance|speed|fast/i, ic(GaugeIcon, "gauge")],
  [/template|bespoke/i, ic(PenToolIcon, "pen")],
  [/creative|\bai\b|citation/i, ic(SparklesIcon, "sparkle")],
  [/offline|sync/i, ic(CloudSyncIcon, "sync")],
  [/audience|persona/i, ic(TeamIcon, "team")],
  [/cms|headless/i, ic(LayersIcon, "layers")],
  [/mobile|checkout/i, ic(PhoneIcon, "phone")],
  [/landing|alignment|target/i, ic(TargetIcon, "target")],
  [/conversion|\bux\b/i, ic(CursorClickIcon, "click")],
  [/filter/i, ic(FunnelIcon, "funnel")],
  [/technical|code|developer/i, ic(CodeIcon, "code")],
  [/mena|market/i, ic(CompassIcon, "compass")],
  [/arabic|rtl|bilingual|language|global/i, ic(GlobeIcon, "globe")],
  [/keyword|search|seo/i, ic(SearchIcon, "search")],
  [/billing|invoice|transparent|pricing/i, ic(ReceiptIcon, "receipt")],
  [/payment|gateway|card/i, ic(CardIcon, "card")],
  [/promotion|discount|offer|coupon/i, ic(TagIcon, "tag")],
  [/inventory|order|stock/i, ic(BoxIcon, "box")],
  [/role|access|permission|security|lock/i, ic(LockIcon, "lock")],
  [/real-time|realtime|live/i, ic(PulseIcon, "pulse")],
  [/integration|\bapi\b|third-party/i, ic(LinkIcon, "link")],
  [/copy|testing|a\/b/i, ic(SplitTestIcon, "ab")],
  [/react|native|cross-platform/i, ic(AtomIcon, "atom")],
  [/app store|\baso\b|ranking/i, ic(TrendLineIcon, "trend")],
  [/push|notification|engage/i, ic(BellRingIcon, "bell")],
  [/partner|support|post-launch|maintenance/i, ic(LifeBuoyIcon, "buoy")],
];

const FALLBACK = RULES.map(([, icon]) => icon);

export function whyLineIconFor(title: string, index: number, picked?: string | null): LineIcon {
  return pickedLineIcon(picked) ?? RULES.find(([re]) => re.test(title))?.[1] ?? FALLBACK[index % FALLBACK.length];
}
