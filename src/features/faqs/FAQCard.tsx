"use client";

import { AnimatePresence, motion } from "framer-motion";
import { RichText } from "@/components/ui/RichText";
import { cn } from "@/lib/cn";
import { easeOutSoft } from "@/lib/motion";
import { ChevronRight } from "@/components/icons/ChevronRight";
import type { FAQ } from "@/lib/cms/types";

type FAQCardProps = {
  faq: FAQ & { id: number };
  isOpen: boolean;
  onToggle: () => void;
  variant?: "arrow" | "plus";
};

export function FAQCard({ faq, isOpen, onToggle, variant = "arrow" }: FAQCardProps) {
  return (
    <div key={faq.id} className="rounded-card-sm bg-space-grey">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={`faq-${faq.id}`}
        className="flex w-full items-center gap-4 px-6 py-5 text-left"
      >
        <span
          className={cn(
            "shrink-0 transition-transform duration-300",
            variant === "plus"
              ? "grid h-10 w-10 place-items-center rounded-full border border-white/20 text-sm text-white/70"
              : "text-fg-muted",
            isOpen && (variant === "plus" ? "rotate-45" : "rotate-90"),
          )}
        >
          {variant === "plus" ? <span className="text-base">&#43;</span> : <ChevronRight />}
        </span>

        <span className="text-base font-medium text-white">{faq.question}</span>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            id={`faq-${faq.id}`}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: easeOutSoft }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6 pl-14">
              <RichText content={faq.answer} className="text-sm leading-relaxed text-fg-muted" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
