"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { ShoppingBagIcon } from "@/components/icons/ShoppingBagIcon";
import { easeInOutSoft, easeOutSoft } from "@/lib/motion";
import { BeatCursor, BeatFrame, WIDE, pct, useBeatSteps } from "./BeatFrame";

const SRC = "/images/services/ecommerce-beats";
/** Abu Auf's own palette: the card's dark green button. */
const GREEN = "#162e0b";
const BUTTON = { left: 6.14, top: 84.58, width: 87.19, height: 10.77 };
const BUTTON_CENTRE = { x: 49.7, y: 89.97 };
const PRODUCT = { x: 44.91, y: 49.45 };
const CART = { x: -34, y: 14 }; // beside the card (RTL store: cart on the left)
// 0 card · 1 camera + cursor to "اضف الى السلة" · 2 tap · 3 product flies to the cart · 4 cart pops · 5 zoom out
const AT = [0, 500, 1800, 2100, 2900, 3900];

/** Abu Auf's real product card: add to cart, the product drops into the cart. */
export function AbuAufCartBeat({ active }: { active: boolean }) {
  const step = useBeatSteps(active, AT);
  const camera =
    step === 1 || step === 2
      ? { ...BUTTON_CENTRE, y: BUTTON_CENTRE.y - 14, zoom: 1.45 }
      : step === 3 || step === 4
        ? { x: 6, y: 30, zoom: 1.3 }
        : WIDE;
  return (
    <BeatFrame backdrop="#1d1d1b" fit={{ w: 33.64, h: 90 }} camera={camera}>
      <Image src={`${SRC}/abu-auf-card.webp`} alt="" fill unoptimized className="object-contain" />

      {/* Press: the button dips and a ripple spreads from the tap. */}
      <div
        className="absolute overflow-hidden rounded-pill"
        style={{ left: pct(BUTTON.left), top: pct(BUTTON.top), width: pct(BUTTON.width), height: pct(BUTTON.height) }}
      >
        <motion.span
          className="absolute inset-0 bg-black"
          initial={false}
          animate={{ opacity: step === 2 ? [0, 0.25, 0] : 0 }}
          transition={{ duration: 0.5 }}
        />
        <motion.span
          className="absolute left-1/2 top-1/2 aspect-square w-1/3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white"
          initial={false}
          animate={step === 2 ? { scale: [0, 3.2], opacity: [0.35, 0] } : { scale: 0, opacity: 0 }}
          transition={{ duration: 0.6, ease: easeOutSoft }}
        />
      </div>

      {/* The product hops into the cart. */}
      <AnimatePresence>
        {step === 3 && (
          <motion.div
            className="absolute z-20 aspect-square w-1/4 -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-full ring-4 ring-white"
            initial={{ left: pct(PRODUCT.x), top: pct(PRODUCT.y), scale: 1, opacity: 1 }}
            animate={{
              left: [pct(PRODUCT.x), pct(4), pct(CART.x)],
              top: [pct(PRODUCT.y), pct(0), pct(CART.y)],
              scale: [1, 0.85, 0.3],
              opacity: [1, 1, 0],
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: easeInOutSoft, times: [0, 0.55, 1] }}
          >
            <Image src={`${SRC}/abu-auf-beans.webp`} alt="" fill unoptimized className="object-cover" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cart in Abu Auf's green; pops and counts the item. */}
      <motion.div
        className="absolute flex aspect-square w-1/3 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full text-white shadow-card-deep"
        style={{ left: pct(CART.x), top: pct(CART.y), backgroundColor: GREEN }}
        initial={false}
        animate={
          step === 4
            ? { scale: [1, 1.3, 0.92, 1], rotate: [0, -12, 6, 0], opacity: 1 }
            : { scale: 1, rotate: 0, opacity: step >= 1 ? 1 : 0 }
        }
        transition={{ duration: 0.55, ease: easeOutSoft }}
      >
        <ShoppingBagIcon className="size-1/2" />
        <AnimatePresence>
          {step >= 4 && (
            <motion.span
              className="absolute -right-1/12 -top-1/12 flex aspect-square w-2/5 items-center justify-center rounded-full bg-white text-sm font-bold"
              style={{ color: GREEN }}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              transition={{ type: "spring", stiffness: 520, damping: 16 }}
            >
              1
            </motion.span>
          )}
        </AnimatePresence>
      </motion.div>

      <BeatCursor
        at={step === 1 || step === 2 ? { x: BUTTON_CENTRE.x + 8, y: BUTTON_CENTRE.y - 1 } : null}
        click={step === 2}
        size={6}
      />
    </BeatFrame>
  );
}
