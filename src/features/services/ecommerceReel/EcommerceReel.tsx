"use client";

import { ShotReel, type ReelItem } from "@/components/ui/ShotReel";
import { ECOMMERCE_SHOTS as S } from "@/config/serviceReels";
import { AbuAufCartBeat } from "./AbuAufCartBeat";
import { AbuAufTrackerBeat } from "./AbuAufTrackerBeat";
import { ExceptionTabsBeat } from "./ExceptionTabsBeat";
import { SallyHelmyCardsBeat } from "./SallyHelmyCardsBeat";

/**
 * eCommerce service hero reel: each project's own widgets, never mixed —
 * fast static shots between animated beats where a real widget is used
 * (cards fan out, add to cart, tabs switch, an order moves on), with the
 * camera zooming in on the action. Interleaved so no project repeats.
 */
const ITEMS: ReelItem[] = [
  { key: "sally-cards", label: "Sally Helmy", backdrop: "#1d1d1b", ms: 4800, Beat: SallyHelmyCardsBeat },
  S.fregys1,
  S.kouider1,
  { key: "abu-auf-cart", label: "Abu Auf", backdrop: "#1d1d1b", ms: 5000, Beat: AbuAufCartBeat },
  S.saleSucre1,
  S.exception2,
  S.kouider2,
  { key: "exception-tabs", label: "Exception", backdrop: "#f3f3f5", ms: 5000, Beat: ExceptionTabsBeat },
  S.sallyHelmy2,
  S.fregys2,
  { key: "abu-auf-tracker", label: "Abu Auf", backdrop: "#1d1d1b", ms: 6000, Beat: AbuAufTrackerBeat },
  S.saleSucre2,
];

export function EcommerceReel() {
  return <ShotReel shots={ITEMS} sizes="(max-width: 768px) 100vw, 50vw" />;
}
