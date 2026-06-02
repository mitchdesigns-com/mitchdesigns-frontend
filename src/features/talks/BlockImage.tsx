"use client";

import Image from "next/image";
import { useState } from "react";

interface Props {
  url: string;
  alt: string;
  caption?: string | null;
}

export function BlockImage({ url, alt, caption }: Props) {
  const [errored, setErrored] = useState(false);

  return (
    <figure className="flex flex-col items-center gap-2">
      {errored ? (
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
