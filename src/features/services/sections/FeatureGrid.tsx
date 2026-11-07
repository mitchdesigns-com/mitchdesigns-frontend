import { Section } from "@/components/layout/Section";
import { RichText } from "@/components/ui/RichText";
import { Reveal, RevealItem, RevealStagger } from "@/components/motion";
import { HighlightTitle } from "./WeGotYouOrbit";
import { AppWindowIcon } from "@/components/icons/AppWindowIcon";
import { BellIcon } from "@/components/icons/BellIcon";
import { BellRingIcon } from "@/components/icons/BellRingIcon";
import { ChatIcon } from "@/components/icons/ChatIcon";
import { CheckmarkSquareIcon } from "@/components/icons/CheckmarkSquareIcon";
import { CompassIcon } from "@/components/icons/CompassIcon";
import { LifeBuoyIcon } from "@/components/icons/LifeBuoyIcon";
import { LinkIcon } from "@/components/icons/LinkIcon";
import { MonitorIcon } from "@/components/icons/MonitorIcon";
import { PulseIcon } from "@/components/icons/PulseIcon";
import { ReceiptIcon } from "@/components/icons/ReceiptIcon";
import { RouteIcon } from "@/components/icons/RouteIcon";
import { ShoppingBagIcon } from "@/components/icons/ShoppingBagIcon";
import { SparklesIcon } from "@/components/icons/SparklesIcon";
import { SplitTestIcon } from "@/components/icons/SplitTestIcon";
import { TargetIcon } from "@/components/icons/TargetIcon";
import { BarChartIcon } from "@/components/icons/BarChartIcon";
import { BoxIcon } from "@/components/icons/BoxIcon";
import { Briefcase } from "@/components/icons/Briefcase";
import { BuildingIcon } from "@/components/icons/BuildingIcon";
import { CalendarIcon } from "@/components/icons/CalendarIcon";
import { CardIcon } from "@/components/icons/CardIcon";
import { CloudSyncIcon } from "@/components/icons/CloudSyncIcon";
import { CoinsIcon } from "@/components/icons/CoinsIcon";
import { DashboardIcon } from "@/components/icons/DashboardIcon";
import { GiftIcon } from "@/components/icons/GiftIcon";
import { GlobeIcon } from "@/components/icons/GlobeIcon";
import { Heart } from "@/components/icons/Heart";
import { LayersIcon } from "@/components/icons/LayersIcon";
import { LayoutGridIcon } from "@/components/icons/LayoutGridIcon";
import { LockIcon } from "@/components/icons/LockIcon";
import { MapPinIcon } from "@/components/icons/MapPinIcon";
import { PenToolIcon } from "@/components/icons/PenToolIcon";
import { PercentIcon } from "@/components/icons/PercentIcon";
import { PhoneIcon } from "@/components/icons/PhoneIcon";
import { ProductGridIcon } from "@/components/icons/ProductGridIcon";
import { PuzzleIcon } from "@/components/icons/PuzzleIcon";
import { RepeatIcon } from "@/components/icons/RepeatIcon";
import { SearchIcon } from "@/components/icons/SearchIcon";
import { SlidersIcon } from "@/components/icons/SlidersIcon";
import { StoreIcon } from "@/components/icons/StoreIcon";
import { TagIcon } from "@/components/icons/TagIcon";
import { TeamIcon } from "@/components/icons/TeamIcon";
import { TimerIcon } from "@/components/icons/TimerIcon";
import { TrendLineIcon } from "@/components/icons/TrendLineIcon";
import { TrendingUpIcon } from "@/components/icons/TrendingUpIcon";
import { UserIcon } from "@/components/icons/UserIcon";
import { UserPlusIcon } from "@/components/icons/UserPlusIcon";
import { WalletIcon } from "@/components/icons/WalletIcon";
import { ZapIcon } from "@/components/icons/ZapIcon";
import { Star } from "@/components/icons/Star";
import { cn } from "@/lib/cn";
import type { FeaturesSimplifiedProps } from "@/lib/cms/types";

type Icon = (p: { size?: number; className?: string }) => React.ReactNode;

/** Line icon per feature, matched on the (CMS) title; first match wins. */
const ICONS: [RegExp, Icon][] = [
  // Mobile app page
  [/sign up|social login/i, UserPlusIcon],
  [/face id|fingerprint/i, LockIcon],
  [/otp/i, CheckmarkSquareIcon],
  [/onboarding/i, CompassIcon],
  [/profile/i, UserIcon],
  [/push/i, BellRingIcon],
  [/in app message/i, AppWindowIcon],
  [/live chat/i, ChatIcon],
  [/ai assistant/i, SparklesIcon],
  [/recommendation/i, TargetIcon],
  [/cart/i, ShoppingBagIcon],
  [/in app purchase|order history/i, ReceiptIcon],
  [/referral/i, TeamIcon],
  [/booking/i, CalendarIcon],
  [/reminder/i, BellIcon],
  [/maps|location/i, MapPinIcon],
  [/real time tracking/i, RouteIcon],
  [/rating/i, (p) => <Star size={p.size} className={p.className} />],
  [/qr|barcode/i, PhoneIcon],
  [/photo|video/i, LayersIcon],
  [/sharing|deep link/i, LinkIcon],
  [/offline/i, CloudSyncIcon],
  [/dark mode/i, MonitorIcon],
  [/widget/i, LayoutGridIcon],
  [/watch|wearable/i, TimerIcon],
  [/health|fitness/i, PulseIcon],
  [/split test/i, SplitTestIcon],
  [/crash/i, LifeBuoyIcon],
  [/admin dashboard/i, DashboardIcon],
  // eCommerce page
  [/mobile app|website/i, PhoneIcon],
  [/ui design|custom ui/i, PenToolIcon],
  [/catalog/i, ProductGridIcon],
  [/variant/i, SlidersIcon],
  [/add-on|bundle/i, LayersIcon],
  [/build your own/i, PuzzleIcon],
  [/collection/i, LayoutGridIcon],
  [/search|filter/i, SearchIcon],
  [/fast checkout/i, ZapIcon],
  [/guest/i, UserPlusIcon],
  [/gateway/i, CardIcon],
  [/apple pay|saved card/i, LockIcon],
  [/inventory|branch/i, BuildingIcon],
  [/zone|rate/i, MapPinIcon],
  [/pickup/i, StoreIcon],
  [/scheduled/i, CalendarIcon],
  [/order management/i, DashboardIcon],
  [/promo/i, TagIcon],
  [/automatic discount/i, PercentIcon],
  [/flash/i, TimerIcon],
  [/gift|voucher/i, GiftIcon],
  [/loyalty|points/i, (p) => <Star size={p.size} className={p.className} />],
  [/wallet/i, WalletIcon],
  [/upsell|cross-sell/i, TrendingUpIcon],
  [/wishlist|reorder/i, Heart],
  [/customer accounts?$/i, UserIcon],
  [/bulk/i, BoxIcon],
  [/tier|segment/i, TeamIcon],
  [/pricing/i, BarChartIcon],
  [/subscription/i, RepeatIcon],
  [/company/i, Briefcase],
  [/arabic|english|language/i, GlobeIcon],
  [/currenc|market/i, CoinsIcon],
  [/erp|pos/i, CloudSyncIcon],
  [/report|analytic/i, TrendLineIcon],
  [/staff|role|permission/i, LockIcon],
];
const iconFor = (title: string): Icon => ICONS.find(([re]) => re.test(title))?.[1] ?? TagIcon;

const LABEL: Record<string, string> = {
  New: "bg-yellow text-black",
  Popular: "bg-black text-white",
  Trending: "bg-panel text-black",
};

/**
 * Every platform feature as a plain grid the page scrolls past: a thin
 * dark-grey line icon, the name and one line each (phones: icon and name), with the CMS label
 * (New / Popular / Trending) as a small badge. Cards rise in as the grid
 * arrives. Copy from the CMS `featuresSimplified` section.
 */
export function FeatureGrid({ title, titleHighlights, description, featureCards }: FeaturesSimplifiedProps) {
  return (
    <Section className="py-20 md:py-28">
      <div className="flex flex-col gap-12 md:gap-16">
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-4 text-center">
          <HighlightTitle title={title} highlights={titleHighlights} Tag="h2" />
          {description ? (
            <Reveal delay={0.2}>
              <RichText content={description} className="text-lg text-black text-balance md:text-xl" />
            </Reveal>
          ) : null}
        </div>

        <RevealStagger as="ul" stagger={0.03} className="grid grid-cols-2 gap-2 sm:gap-3 lg:grid-cols-3 xl:grid-cols-4">
          {featureCards.map((card) => {
            const Icon = iconFor(card.title);
            return (
              <RevealItem
                as="li"
                key={card.title}
                className="group flex flex-col gap-3 rounded-card-sm border border-border bg-white p-4 transition-colors sm:gap-4 sm:p-5 duration-300 hover:border-black"
              >
                <div className="flex items-start justify-between gap-3">
                  <Icon size={26} className="text-grey-700 transition-transform duration-300 group-hover:-translate-y-0.5" />
                  {card.label && (
                    <span className={cn("rounded-pill px-2.5 py-0.5 text-xs font-semibold", LABEL[card.label] ?? LABEL.Trending)}>
                      {card.label}
                    </span>
                  )}
                </div>
                <div className="flex flex-col gap-1.5">
                  <h3 className="text-sm font-semibold text-black text-balance sm:text-base">{card.title}</h3>
                  {/* Phones: icon and name only, two a row, so the list stays short. */}
                  <RichText content={card.description} className="hidden text-sm text-grey-600 text-balance sm:block" />
                </div>
              </RevealItem>
            );
          })}
        </RevealStagger>
      </div>
    </Section>
  );
}
