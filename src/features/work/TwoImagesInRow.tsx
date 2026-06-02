import { Media } from "@/components/ui/Media";
import { strapiMedia } from "@/lib/cms/media";
import type { StrapiImage } from "@/lib/cms/types";

type Props = {
  left: StrapiImage;
  right: StrapiImage;
};

export function TwoImagesInRow({ left, right }: Props) {
  return (
    <div className="flex gap-10">
      {[left, right].map((img) => {
        const src = strapiMedia(img.url);
        if (!src) return null;
        return (
          <div key={img.url} className="relative flex-1 aspect-case-photo overflow-hidden">
            <Media
              src={src}
              alt={img.alternativeText ?? ""}
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        );
      })}
    </div>
  );
}
