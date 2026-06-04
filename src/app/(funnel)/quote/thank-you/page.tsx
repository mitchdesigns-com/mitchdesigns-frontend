import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Thank you — MitchDesigns",
  robots: { index: false, follow: false },
};

export default function ThankYouPage() {
  return (
    <section className="container-page flex min-h-[calc(100dvh-6rem)] items-center justify-center py-12">
      <div className="w-full max-w-[780px] rounded-[10px] border border-border bg-white p-10 shadow-sm">

        {/* Illustration + text */}
        <div className="flex flex-col items-center gap-4">

          {/* Illustration — swap src when asset is ready */}
          <div className="flex h-52 w-52 items-center justify-center relative">
            <Image src="/images/thank-you.webp" fill alt="thank-you"/>
          </div>

          {/* Heading + body */}
          <div className="mt-2 flex flex-col gap-3 text-center">
            <h1 className="text-[32px] font-bold leading-[1.1] text-black">
              You’re all set. Thanks!
            </h1>
            <p className="text-xl font-medium leading-[1.3] text-black text-balance">
              Your estimate is on its way. Our team is shaping it around what you
              shared, and we’ll be in touch within 48 hours.
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-10">
          <Link
            href="/"
            className="flex h-[68px] w-full items-center justify-center gap-2 rounded-pill bg-yellow px-9 text-base font-medium text-black transition-opacity hover:opacity-80"
          >
            Back to Homepage
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
              <path d="M4 10h12M11 5l5 5-5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>

      </div>
    </section>
  );
}
