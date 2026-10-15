"use client";

import { createContext, useContext } from "react";
import { SITE_SETTINGS_FALLBACK } from "@/lib/cms/siteDefaults";
import type { SiteSettings } from "@/lib/cms/types";

const SiteSettingsContext = createContext<SiteSettings>(SITE_SETTINGS_FALLBACK);

/** Global CMS settings (CTA label, legal links, shared headings) for client
 *  components; loaded once in the root layout. */
export function SiteSettingsProvider({
  settings,
  children,
}: {
  settings: SiteSettings;
  children: React.ReactNode;
}) {
  return <SiteSettingsContext.Provider value={settings}>{children}</SiteSettingsContext.Provider>;
}

export const useSiteSettings = () => useContext(SiteSettingsContext);
