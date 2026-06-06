export type LeadPayload = {
  firstName?: string;
  lastName?: string;
  email?: string;
  mobileNumber?: string;
  service?: string;
  companyName?: string;
  companyCountry?: string;
  companyStage?: unknown;
  industry?: string;
  websiteLanguages?: string;
  websitePurpose?: unknown;
  websiteSections?: unknown;
  specialFeatures?: unknown;
  hasSitemap?: string;
  additionalNotes?: string;
  budget?: string;
  timeline?: string;
  nextAction?: string;
  rawFormData?: unknown;
  source?: string;
  sitemapFileId?: number | null;
  companyProfileId?: number | null;
  briefFileId?: number | null;
};

export async function submitLead(payload: LeadPayload): Promise<void> {
  const { sitemapFileId, companyProfileId, briefFileId, ...rest } = payload;

  const body: Record<string, unknown> = { ...rest, source: "quote-form" };
  if (sitemapFileId)    body.sitemapFile    = sitemapFileId;
  if (companyProfileId) body.companyProfile = companyProfileId;
  if (briefFileId)      body.briefFile      = briefFileId;

  const res = await fetch("/api/leads", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ data: body }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => res.statusText);
    throw new Error(`Lead submission failed (${res.status}): ${text}`);
  }
}
