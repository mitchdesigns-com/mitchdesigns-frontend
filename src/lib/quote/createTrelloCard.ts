import "server-only";

import type { LeadPayload } from "./submitLead";

// New MD Leads hides its *pre-existing* lists/cards from API tokens, but the API
// can still CREATE cards. So we skip list lookup (which returns empty) and post
// straight to a hardcoded list id captured from the board once.
const API_KEY = process.env.TRELLO_API_KEY;
const TOKEN = process.env.TRELLO_TOKEN;
const LIST_ID = process.env.TRELLO_LIST_ID; // id of the "🌐 New Leads" list on New MD Leads
const TEMPLATE_CARD_ID = process.env.TRELLO_TEMPLATE_CARD_ID; // "Card Template (Don't Delete)"

const TRELLO = "https://api.trello.com/1";
const SITEMAP_ITEM = "Sales | Sitemap Created";

export type TrelloResult = { ok: boolean; cardId?: string; error?: string };

export async function createTrelloCard(lead: LeadPayload): Promise<TrelloResult> {
  const missing = [
    !API_KEY && "TRELLO_API_KEY",
    !TOKEN && "TRELLO_TOKEN",
    !LIST_ID && "TRELLO_LIST_ID",
    !TEMPLATE_CARD_ID && "TRELLO_TEMPLATE_CARD_ID",
  ].filter(Boolean);
  if (missing.length) {
    const error = `Trello not configured: missing ${missing.join(", ")}`;
    console.warn(error);
    return { ok: false, error };
  }

  const fullName = `${lead.firstName ?? ""} ${lead.lastName ?? ""}`.replace(/\s+/g, " ").trim();
  const name = [fullName, lead.companyName, lead.service ?? "Quote"]
    .filter(Boolean)
    .join(" - ");

  // Copy the template card (brings its "Todos" checklist along), then override
  // name/desc with this lead's data.
  const url = new URL(`${TRELLO}/cards`);
  url.searchParams.set("key", API_KEY!);
  url.searchParams.set("token", TOKEN!);
  url.searchParams.set("idList", LIST_ID!);
  url.searchParams.set("idCardSource", TEMPLATE_CARD_ID!);
  url.searchParams.set("keepFromSource", "checklists");
  url.searchParams.set("pos", "bottom");
  url.searchParams.set("name", name);
  url.searchParams.set("desc", formatCardDescription(lead));

  try {
    const res = await fetch(url, { method: "POST" });
    if (!res.ok) {
      const error = `Trello card POST ${res.status}: ${await res.text().catch(() => res.statusText)}`;
      console.error(error);
      return { ok: false, error };
    }
    const card = (await res.json()) as { id: string };

    // If the lead already has a sitemap, tick that checklist item on the copy.
    if (String(lead.hasSitemap ?? "").toLowerCase() === "yes") {
      await checkSitemapItem(card.id);
    }
    return { ok: true, cardId: card.id };
  } catch (err) {
    const error = `Trello card error: ${err instanceof Error ? err.message : String(err)}`;
    console.error(error);
    return { ok: false, error };
  }
}

async function checkSitemapItem(cardId: string): Promise<void> {
  try {
    const checklists = (await (
      await fetch(`${TRELLO}/cards/${cardId}/checklists?key=${API_KEY}&token=${TOKEN}`)
    ).json()) as Array<{ checkItems: Array<{ id: string; name: string }> }>;

    const item = checklists.flatMap((l) => l.checkItems ?? []).find((i) => i.name === SITEMAP_ITEM);
    if (!item) return;

    await fetch(
      `${TRELLO}/cards/${cardId}/checkItem/${item.id}?state=complete&key=${API_KEY}&token=${TOKEN}`,
      { method: "PUT" },
    );
  } catch (err) {
    console.error("Trello sitemap check error:", err);
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
