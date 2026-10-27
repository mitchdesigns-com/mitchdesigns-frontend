"use client";

import { useEffect, useRef, useState } from "react";
import type { TocItem } from "./TalkContent";
import { noOrphan } from "@/lib/noOrphan";

export function TocSidebar({ items }: { items: TocItem[] }) {
  const [activeId, setActiveId] = useState<string>("");
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    if (!items.length) return;

    const ids = items.map((item) => item.href.slice(1));

    observerRef.current = new IntersectionObserver(
      (entries) => {
        // Pick the topmost intersecting heading
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

        if (visible.length > 0) {
          setActiveId(visible[0]!.target.id);
        }
      },
      { rootMargin: "0px 0px -60% 0px", threshold: 0 },
    );

    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observerRef.current!.observe(el);
    });

    return () => observerRef.current?.disconnect();
  }, [items]);

  if (!items.length) return null;

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const id = href.slice(1);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setActiveId(id);
  };

  return (
    <div className="flex gap-5">
      <div className="w-1 shrink-0 rounded-full bg-bej" />
      <ul className="flex flex-col gap-5 py-1.5">
        {items.map((item) => {
          const id = item.href.slice(1);
          const isActive = activeId === id || (!activeId && items[0]!.href.slice(1) === id);
          return (
            <li key={item.href}>
              <a
                href={item.href}
                onClick={(e) => handleClick(e, item.href)}
                className={
                  isActive
                    ? "text-[14px] font-medium leading-[1.3] text-black"
                    : "text-[14px] leading-[1.3] text-[#575757] transition-colors hover:text-black"
                }
              >
                {noOrphan(item.label, 32)}
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
