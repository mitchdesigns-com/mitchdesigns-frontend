"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useRef, useEffect } from "react";
import type { Talk } from "@/lib/cms/types";
import { navigateWithTransition } from "@/lib/view-transition";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function TagPill({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center justify-center rounded-full bg-yellow px-4 py-2 text-sm font-bold uppercase tracking-1 text-black">
      {label}
    </span>
  );
}

function Meta({ date, readTime }: { date: string; readTime?: number }) {
  return (
    <div className="flex items-center gap-3 text-base tracking-1 text-grey-600">
      <span className="whitespace-nowrap">{formatDate(date)}</span>
      {readTime != null && (
        <>
          <span className="size-1 rounded-full bg-grey-600" aria-hidden />
          <span className="whitespace-nowrap">{readTime} min read</span>
        </>
      )}
    </div>
  );
}

export function TalkCard({
  talk,
  delay = 0,
  isLast = false,
  onLastDone,
}: {
  talk: Talk;
  delay?: number;
  isLast?: boolean;
  onLastDone?: () => void;
}) {
  const calledRef = useRef(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const router = useRouter();
  const href = `/talks/${talk.slug}`;

  useEffect(() => {
    imgRef.current?.style.setProperty("view-transition-name", `talk-image-${talk.slug}`);
    titleRef.current?.style.setProperty("view-transition-name", `talk-title-${talk.slug}`);
  }, [talk.slug]);

  function navigate(e: React.MouseEvent) {
    e.preventDefault();
    navigateWithTransition(() => router.push(href));
  }

  return (
    <motion.div
      className="group flex min-w-0 flex-1 flex-col gap-4"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -40% 0px" }}
      transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1], delay }}
      whileHover={{ y: -6, transition: { duration: 0.25, ease: "easeOut" } }}
      onViewportEnter={
        isLast
          ? () => {
              if (!calledRef.current) {
                calledRef.current = true;
                setTimeout(() => onLastDone?.(), (0.4 + delay) * 1000 + 50);
              }
            }
          : undefined
      }
    >
      <Link href={href} onClick={navigate} className="flex flex-col gap-4">
        <div className="relative aspect-4/3 w-full overflow-hidden rounded-2xs">
          {talk.cover?.url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              ref={imgRef}
              src={talk.cover.url}
              alt={talk.cover.alternativeText ?? talk.title}
              className="absolute inset-0 size-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
            />
          ) : (
            <div className="absolute inset-0 bg-img-placeholder" />
          )}
        </div>

        <div className="flex flex-col gap-8">
          <div className="flex items-center justify-between">
            <div className="flex flex-wrap gap-2">
              {talk.category
                ? <TagPill label={talk.category} />
                : talk.tags?.map((tag) => <TagPill key={tag} label={tag} />)
              }
            </div>
            <Meta date={(talk.publishedAt ?? talk.date) ?? ""} readTime={talk.readTime} />
          </div>

          <div className="flex flex-col gap-2.5">
            <h3
              ref={titleRef}
              className="text-lg font-medium tracking-1 text-black transition-opacity duration-200 group-hover:opacity-70"
            >
              {talk.title}
            </h3>
            <p className="text-base leading-6 tracking-1 text-grey-600 text-balance">
              {talk.excerpt}
            </p>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
