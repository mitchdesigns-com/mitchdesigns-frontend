import { getTrustReasons } from "@/lib/cms";
import { fixtureTrustReasons } from "@/lib/cms/fixtures";
import { strapiMedia } from "@/lib/cms/media";
import type { CmsLink } from "@/lib/cms/types";
import { ClientsTrust } from "./ClientsTrust";

type Props = {
  /** CMS heading; "{count}" becomes the number of reasons, newlines break lines. */
  heading?: string;
  intro?: string;
  cta?: CmsLink;
};

export async function ClientsTrustFetcher({ heading, intro, cta }: Props = {}) {
  let reasons;
  try {
    const data = await getTrustReasons();
    reasons = data && data.length ? data : fixtureTrustReasons;
  } catch {
    reasons = fixtureTrustReasons;
  }

  if (!reasons.length) return null;

  const cards = reasons.map((r) => ({
    image: r.image?.url ? (strapiMedia(r.image.url) ?? r.image.url) : null,
    title: r.title,
    body: r.body,
    icon: r.icon ?? null,
  }));

  const headingNode = heading
    ? heading
        .replace(/\{count\}/g, String(cards.length))
        .split("\n")
        .flatMap((line, i) => (i ? [<br key={i} />, line] : [line]))
    : undefined;

  return (
    <ClientsTrust
      reasons={cards}
      heading={headingNode}
      {...(intro ? { intro } : {})}
      {...(cta ? { cta } : {})}
    />
  );
}
