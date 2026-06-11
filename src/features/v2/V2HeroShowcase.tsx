"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { CreativeHero, HeroSectionWrapper } from "@/features/hero";
import { SpotlightHero } from "./heroes/SpotlightHero";
import { EditorialHero } from "./heroes/EditorialHero";
import { AuroraHero } from "./heroes/AuroraHero";

type HeroProps = {
  eyebrow?: string;
  headline?: string;
  rotatingWords?: string[];
};

type HeroId = "spotlight" | "editorial" | "aurora" | "deck" | "original";

const OPTIONS: Array<{ id: HeroId; label: string }> = [
  { id: "spotlight", label: "Spotlight" },
  { id: "editorial", label: "Editorial" },
  { id: "aurora", label: "Aurora" },
  { id: "deck", label: "Scroll Deck" },
  { id: "original", label: "V1 Original" },
];

const STORAGE_KEY = "md-v2-hero";

function isHeroId(v: string | null): v is HeroId {
  return OPTIONS.some((o) => o.id === v);
}

export function V2HeroShowcase(props: HeroProps) {
  const [hero, setHero] = useState<HeroId>("spotlight");

  // Restore the last previewed hero — URL param wins over localStorage.
  useEffect(() => {
    const fromUrl = new URLSearchParams(window.location.search).get("hero");
    const fromStorage = window.localStorage.getItem(STORAGE_KEY);
    if (isHeroId(fromUrl)) setHero(fromUrl);
    else if (isHeroId(fromStorage)) setHero(fromStorage);
  }, []);

  const select = (id: HeroId) => {
    setHero(id);
    window.localStorage.setItem(STORAGE_KEY, id);
    const url = new URL(window.location.href);
    url.searchParams.set("hero", id);
    window.history.replaceState(null, "", url.toString());
  };

  return (
    <div className="relative">
      {/* Instant swap with a short fade-in — no exit phase, so the new hero
          mounts immediately even if animation frames are throttled. */}
      <motion.div
        key={hero}
        initial={{ opacity: 0.001 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {hero === "spotlight" && <SpotlightHero {...props} />}
        {hero === "editorial" && <EditorialHero {...props} />}
        {hero === "aurora" && <AuroraHero {...props} />}
        {hero === "deck" && <HeroSectionWrapper {...props} />}
        {hero === "original" && <CreativeHero {...props} />}
      </motion.div>

      {/* ---- Hero version switcher ---- */}
      <div className="fixed inset-x-0 bottom-5 z-50 flex justify-center px-4">
        <div className="flex flex-wrap items-center gap-1 rounded-full border border-white/15 bg-black/80 p-1.5 shadow-lg backdrop-blur-md">
          <span className="hidden px-3 text-xs font-bold uppercase tracking-1 text-white/50 sm:block">
            Hero
          </span>
          {OPTIONS.map((option, i) => (
            <button
              key={option.id}
              type="button"
              onClick={() => select(option.id)}
              aria-pressed={hero === option.id}
              className={`rounded-full px-4 py-2 text-xs font-bold uppercase tracking-1 transition-colors ${
                hero === option.id
                  ? "bg-yellow text-black"
                  : "text-white/70 hover:text-white"
              }`}
            >
              <span className="sm:hidden">{String(i + 1).padStart(2, "0")}</span>
              <span className="hidden sm:inline">{option.label}</span>
            </button>
          ))}
          <span aria-hidden className="mx-1 h-5 w-px bg-white/15" />
          <Link
            href="/"
            className="rounded-full px-4 py-2 text-xs font-bold uppercase tracking-1 text-white/70 hover:text-white"
          >
            Exit V2
          </Link>
        </div>
      </div>
    </div>
  );
}
