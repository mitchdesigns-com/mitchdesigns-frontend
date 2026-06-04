import Image from "next/image";

export interface ChallengeFeature {
  image?: string;
  title: string;
  description?: string;
}

export interface ChallengeSectionProps {
  label?: string;
  title?: string;
  features?: ChallengeFeature[];
}

export function ChallengeSection({
  label = "The Challenge",
  title = "Running Your Own Ordering\nSystem Isn't Simple.",
  features = [],
}: ChallengeSectionProps) {
  return (
    <section data-theme="dark" className="bg-black py-24">
      <div className="mx-auto max-w-[var(--container-max)] px-[3.75rem] flex flex-col gap-[2.5rem]">

        {/* Header — pill overlaps title via negative margin */}
        <div className="flex flex-col items-start gap-0">
          {/* Rotated label pill */}
          <div
            className="relative z-10 -mb-[11px] inline-flex items-center justify-center rounded-pill bg-orderbase-red border border-black px-2 py-1 text-base font-bold text-white"
            style={{ transform: "rotate(4deg)", transformOrigin: "left center" }}
          >
            {label}
          </div>

          <h2 className="text-hero-3 font-bold text-white text-balance leading-[1.1] whitespace-pre-line">
            {title}
          </h2>
        </div>

        {/* 4-up card row — gap-5 (20px) */}
        <div className="grid grid-cols-4 gap-5">
          {features.length > 0
            ? features.map((feature, i) => (
                <ChallengeCard key={i} {...feature} />
              ))
            : Array.from({ length: 4 }).map((_, i) => (
                <ChallengeCard key={i} title={`Challenge ${i + 1}`} description="Description placeholder." />
              ))}
        </div>
      </div>
    </section>
  );
}

function ChallengeCard({ image, title, description }: ChallengeFeature) {
  return (
    <div className="flex flex-col gap-3 rounded-[20px] bg-card px-3 py-5">
      {/* Illustration / image area */}
      <div className="w-full aspect-[309/242] rounded-[12px] overflow-hidden bg-white/5">
        {image ? (
          <Image src={image} alt={title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-xs text-white/20">Image</span>
          </div>
        )}
      </div>

      {/* Text */}
      <div className="flex flex-col gap-1 px-0">
        <p className="text-xl font-bold text-white">{title}</p>
        <p className="text-base font-medium text-grey-200 text-balance">{description}</p>
      </div>
    </div>
  );
}
