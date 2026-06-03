import { Reveal, RevealStagger, RevealItem } from "@/components/motion";

type Props = {
  items: Array<{ title: string; body: string }>;
};

export function Challenges({ items }: Props) {
  if (!items.length) return null;

  return (
    <div className="flex flex-col items-end">
      <div className="w-1/2 flex flex-col gap-10">
        <Reveal>
          <h2 className="text-hero-3 font-bold text-fg">Challenge</h2>
        </Reveal>

        <RevealStagger className="flex flex-col gap-10" stagger={0.1}>
          {items.map((item) => (
            <RevealItem key={item.title} className="flex flex-col gap-2">
              <p className="text-lg font-medium text-fg">{item.title}</p>
              <p className="text-lg text-grey-200 text-balance">{item.body}</p>
            </RevealItem>
          ))}
        </RevealStagger>
      </div>
    </div>
  );
}
