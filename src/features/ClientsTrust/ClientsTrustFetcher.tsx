import { getTrustReasons } from "@/lib/cms";
import { fixtureTrustReasons } from "@/lib/cms/fixtures";
import { strapiMedia } from "@/lib/cms/media";
import { ClientsTrust } from "./ClientsTrust";

export async function ClientsTrustFetcher() {
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
  }));

  return <ClientsTrust reasons={cards} />;
}
