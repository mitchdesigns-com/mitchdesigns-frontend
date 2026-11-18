"use client";

import Image from "next/image";
import { useState } from "react";
import { isOptimizableImage } from "@/config/site";

interface Props {
  url: string;
  alt: string;
  caption?: string | null;
}

export function BlockImage({ url, alt, caption }: Props) {
  const [errored, setErrored] = useState(false);
  // A host next/image cannot optimize would throw during render and take the
  // whole post with it, so treat it as a failed image up front.
  const unusable = errored || !isOptimizableImage(url);

  return (
    <figure className="flex flex-col items-center gap-2">
      {unusable ? (
        <div className="w-full aspect-video rounded-xs bg-img-placeholder" aria-label={alt} />
      ) : (
        <Image
          src={url}
          alt={alt}
          width={1200}
          height={800}
          className="w-full rounded-xs object-cover"
          style={{ height: "auto" }}
          onError={() => setErrored(true)}
        />
      )}
      {caption && (
        <figcaption className="text-base text-grey-500">{caption}</figcaption>
      )}
    </figure>
  );
}
