import { UserIcon } from "@/components/icons/UserIcon";
import { ShoppingBagIcon } from "@/components/icons/ShoppingBagIcon";
import { ScooterIcon } from "@/components/icons/ScooterIcon";
import { BuildingIcon } from "@/components/icons/BuildingIcon";
import { BarChartIcon } from "@/components/icons/BarChartIcon";
import { MapPinIcon } from "@/components/icons/MapPinIcon";
import { DatabaseIcon } from "@/components/icons/DatabaseIcon";
import { TrendingUpIcon } from "@/components/icons/TrendingUpIcon";
import { RouteIcon } from "@/components/icons/RouteIcon";
import { AppWindowIcon } from "@/components/icons/AppWindowIcon";
import type { OrderbaseIconName } from "@/lib/cms/types";

const ICONS = {
  user: UserIcon,
  "shopping-bag": ShoppingBagIcon,
  scooter: ScooterIcon,
  building: BuildingIcon,
  "bar-chart": BarChartIcon,
  "map-pin": MapPinIcon,
  database: DatabaseIcon,
  "trending-up": TrendingUpIcon,
  route: RouteIcon,
  "app-window": AppWindowIcon,
} as const;

export function OrderbaseIcon({
  name,
  size = 24,
}: {
  name: OrderbaseIconName;
  size?: number;
}) {
  const Icon = ICONS[name] ?? ShoppingBagIcon;
  return <Icon size={size} />;
}
