import { Media } from "@/components/ui/Media";
import { strapiMedia } from "@/lib/cms/media";
import type { StrapiImage } from "@/lib/cms/types";

type Props = {
  image: StrapiImage;
};

export function SingleImageInRow({ image }: Props) {
  const src = strapiMedia(image.url);
  if (!src) return null;

  return (
    <div className="relative w-full aspect-case-photo overflow-hidden">
      <Media
        src={src}
        alt={image.alternativeText ?? ""}
        sizes="(max-width: 768px) 100vw, 1392px"
        className="object-cover"
      />
    </div>
  );
}
