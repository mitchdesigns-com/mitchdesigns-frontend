import type { StrapiImage } from "@/lib/cms/types";

type Props = {
  quote: string;
  author?: string;
  role?: string;
  avatar?: StrapiImage;
};

export function CenteredQuote({ quote, author, role }: Props) {
  return (
    <div className="flex justify-center">
      <div className="max-w-4xl flex flex-col items-center gap-10">
        <blockquote className="text-blog-quote font-bold text-fg text-center text-balance">
          {quote}
        </blockquote>

        {author && (
          <div className="flex flex-col items-center gap-1">
            <p className="text-xl font-medium text-fg">{author}</p>
            {role && <p className="text-base text-grey-200">{role}</p>}
          </div>
        )}
      </div>
    </div>
  );
}
