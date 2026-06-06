import Image from "next/image";

type ClientsTrustCardProps = {
  image?: string | null;
  title: string;
  body: string;
};

export function ClientsTrustCard({ image, title, body }: ClientsTrustCardProps) {
  return (
    <article className="flex h-full w-74.5 flex-col gap-4 rounded-card px-4 py-5">
      <div className="relative aspect-[298/200] overflow-hidden rounded-card-md">
        {image && <Image src={image} alt={title} fill className="object-cover" />}
      </div>
      <div className="flex flex-col gap-4">
        <h3 className="text-hero-5 font-bold text-fg leading-[110%]">{title}</h3>
        <p className="text-base text-fg-muted leading-[125%] text-balance">{body}</p>
      </div>
    </article>
  );
}
