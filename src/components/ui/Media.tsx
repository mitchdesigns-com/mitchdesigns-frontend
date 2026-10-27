import Image from "next/image";

type Props = {
  src: string;
  alt?: string;
  sizes?: string;
  className?: string;
  /** Strapi mime type; wins over the file-extension check when present. */
  mime?: string | null;
  /** Still frame shown before a video loads. */
  poster?: string | null;
  /** Images only: load eagerly (above-the-fold hero). */
  priority?: boolean;
  /** Images only: optimizer quality; must be listed in next.config `images.qualities`. */
  quality?: number;
  /** Reports the file's intrinsic size once known (client components only). */
  onSize?: (width: number, height: number) => void;
};

const VIDEO_EXT = /\.(mp4|webm|mov|m4v)(\?|#|$)/i;

export function isVideo(src: string, mime?: string | null) {
  return mime ? mime.startsWith("video/") : VIDEO_EXT.test(src);
}

export function Media({ src, alt = "", sizes, className, mime, poster, priority, quality, onSize }: Props) {
  if (isVideo(src, mime)) {
    return (
      <video
        src={src}
        poster={poster ?? undefined}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        onLoadedMetadata={onSize ? (e) => onSize(e.currentTarget.videoWidth, e.currentTarget.videoHeight) : undefined}
        aria-label={alt || undefined}
        className={`absolute inset-0 w-full h-full ${className ?? ""}`}
      />
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      className={className}
      sizes={sizes}
      priority={priority}
      quality={quality}
      onLoad={onSize ? (e) => onSize(e.currentTarget.naturalWidth, e.currentTarget.naturalHeight) : undefined}
    />
  );
}
