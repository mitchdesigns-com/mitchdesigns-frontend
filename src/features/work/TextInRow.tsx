import type { CaseStudyChallenge } from "@/lib/cms/types";

type Props = {
  heading: string;
  items: CaseStudyChallenge[];
};

export function TextInRow({ heading, items }: Props) {
  if (!items.length) return null;

  return (
    <div className="flex flex-col items-end">
      <div className="w-1/2 flex flex-col gap-10">
        <h2 className="text-hero-3 font-bold text-fg">{heading}</h2>

        {items.map((item) => (
          <div key={item.title} className="flex flex-col gap-2">
            <p className="text-lg font-medium text-fg">{item.title}</p>
            <p className="text-lg text-grey-200 text-balance">{item.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
