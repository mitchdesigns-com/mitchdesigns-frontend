import Image from "next/image";
import { cn } from "@/lib/cn";
import { Section } from "@/components/layout/Section";
import { Reveal } from "@/components/motion";
import type { PrototypesProps } from "@/lib/cms/types";

export function PrototypesSection({
  image,
  imageAlt,
  backgroundColor = "bg-panel",
}: PrototypesProps) {
  return (
    <Section bleed className={cn("py-16 md:py-20", backgroundColor)}>
      <div className="container-page">
        <Reveal className="relative aspect-video overflow-hidden rounded-card">
          <Image
            src={image}
            alt={imageAlt ?? ""}
            fill
            className="object-cover"
            sizes="100vw"
          />
        </Reveal>
      </div>
    </Section>
  );
}
