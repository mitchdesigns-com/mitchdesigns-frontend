import Image from "next/image";

type Props = {
  src: string;
  alt?: string;
  sizes?: string;
  className?: string;
};

export function Media({ src, alt = "", sizes, className }: Props) {
  if (src.endsWith(".mp4")) {
    return (
      <video
        src={src}
        autoPlay
        muted
        loop
        playsInline
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
    />
  );
}
