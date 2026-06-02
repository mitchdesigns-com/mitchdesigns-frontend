import type { CaseStudyTestimonial } from "@/lib/cms/types";

type Props = {
  testimonial: CaseStudyTestimonial;
};

export function CenteredQuote({ testimonial }: Props) {
  return (
    <div className="flex justify-center">
      <div className="max-w-4xl flex flex-col items-center gap-10">
        <blockquote className="text-blog-quote font-bold text-fg text-center text-balance">
          {testimonial.quote}
        </blockquote>

        <div className="flex flex-col items-center gap-1">
          <p className="text-xl font-medium text-fg">{testimonial.author}</p>
          <p className="text-base text-grey-200">{testimonial.role}</p>
        </div>
      </div>
    </div>
  );
}
