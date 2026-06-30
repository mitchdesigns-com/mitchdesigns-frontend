import { getSiteSettings } from "@/lib/cms/queries";
import { Footer } from "./Footer";

/**
 * Server wrapper that loads global site settings (footer contact/social/taglines)
 * and feeds them into the presentational <Footer>. Falls back to built-in
 * defaults when Strapi is unreachable (handled inside getSiteSettings).
 */
export async function FooterFetcher({ hideTop = false }: { hideTop?: boolean }) {
  const settings = await getSiteSettings();
  return <Footer settings={settings} hideTop={hideTop} />;
}
