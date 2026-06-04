import Image from "next/image";
import Link from "next/link";
import { Section } from "@/components/layout/Section";
import { Button } from "@/components/ui/Button";
import { ArrowUpRight } from "@/components/icons/ArrowUpRight";

export default function NotFound() {
  return (
    <Section
      as="div"
      theme="dark"
      className="flex min-h-[640px] items-center py-20"
    >
      <div className="flex flex-col items-center gap-10 text-center lg:flex-row lg:justify-center lg:gap-15 lg:text-left">
        {/* Illustration — drop the exported asset at public/images/404.webp */}
        <div className="relative aspect-[399/367] w-full max-w-[399px] shrink-0">
          <Image
            src="/images/404.webp"
            alt=""
            fill
            className="object-contain"
            priority
          />
        </div>

        <div className="flex max-w-[605px] flex-col items-center gap-6 lg:items-start">
          <h1 className="text-hero-3 font-bold text-fg text-balance">
            The page you&rsquo;re looking for doesn&rsquo;t exist.
          </h1>
          <p className="text-xl text-fg text-balance">
            But good design always leads somewhere better.
          </p>
          <Button
            asChild
            size="lg"
            className="mt-2 bg-space-grey text-fg hover:bg-space-grey/90"
          >
            <Link href="/">
              Go To Homepage
              <ArrowUpRight size={20} />
            </Link>
          </Button>
        </div>
      </div>
    </Section>
  );
}
