import "server-only";

import type { LeadPayload } from "./submitLead";

// New MD Leads hides its *pre-existing* lists/cards from API tokens, but the API
// can still CREATE cards. So we skip list lookup (which returns empty) and post
// straight to a hardcoded list id captured from the board once.
const API_KEY = process.env.TRELLO_API_KEY;
const TOKEN = process.env.TRELLO_TOKEN;
const LIST_ID = process.env.TRELLO_LIST_ID; // id of "Lead Received & Discovery Meeting Scheduled"

export async function createTrelloCard(lead: LeadPayload): Promise<void> {
  if (!API_KEY || !TOKEN || !LIST_ID) {
    console.warn("Trello not configured (TRELLO_API_KEY / TRELLO_TOKEN / TRELLO_LIST_ID), skipping card creation");
    return;
  }

  const fullName = `${lead.firstName ?? ""} ${lead.lastName ?? ""}`.replace(/\s+/g, " ").trim();
  const name = [fullName, lead.companyName, lead.service ?? "Quote"]
    .filter(Boolean)
    .join(" - ");

  const url = new URL("https://api.trello.com/1/cards");
  url.searchParams.set("key", API_KEY);
  url.searchParams.set("token", TOKEN);
  url.searchParams.set("idList", LIST_ID);
  url.searchParams.set("pos", "bottom");
  url.searchParams.set("name", name);
  url.searchParams.set("desc", formatCardDescription(lead));

  try {
    const res = await fetch(url, { method: "POST" });
    if (!res.ok) {
      console.error(`Trello card creation failed (${res.status}): ${await res.text().catch(() => res.statusText)}`);
    }
  } catch (err) {
    console.error("Trello card creation error:", err);
  }
}

function formatCardDescription(lead: LeadPayload): string {
  const lines: string[] = [];

  if (lead.email) lines.push(`**Email:** ${lead.email}`);
  if (lead.mobileNumber) lines.push(`**Phone:** ${lead.mobileNumber}`);
  if (lead.companyName) lines.push(`**Company:** ${lead.companyName}`);

  lines.push(""); // blank line

  const details: Record<string, unknown> = {
    "Company Country": lead.companyCountry,
    "Company Stage": lead.companyStage,
    Industry: lead.industry,
    "Website Languages": lead.websiteLanguages,
    "Website Purpose": lead.websitePurpose,
    "Website Sections": lead.websiteSections,
    "Special Features": lead.specialFeatures,
    "Has Sitemap": lead.hasSitemap,
    Budget: lead.budget,
    Timeline: lead.timeline,
    "Next Action": lead.nextAction,
    "Additional Notes": lead.additionalNotes,
  };

  for (const [key, value] of Object.entries(details)) {
    if (value) lines.push(`**${key}:** ${String(value)}`);
  }

  return lines.join("\n");
}
