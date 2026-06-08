import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// Mock the Trello module so we never import "server-only" or hit the network,
// and can assert the route triggers it. vi.hoisted lets the (hoisted) factory
// reference the mock fn safely.
const { createTrelloCard } = vi.hoisted(() => ({ createTrelloCard: vi.fn(async () => {}) }));
vi.mock("@/lib/quote/createTrelloCard", () => ({ createTrelloCard }));

import { POST } from "./route";

const leadData = { firstName: "Sarah", email: "sarah@acme.com", service: "corporate-website", source: "quote-form" };

function leadRequest(data: unknown = leadData) {
  return new Request("http://localhost/api/leads", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ data }),
  });
}

describe("POST /api/leads", () => {
  beforeEach(() => {
    createTrelloCard.mockClear();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("forwards the lead to Strapi and fires the Trello card on success", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => new Response(JSON.stringify({ data: { id: 7 } }), { status: 201 })));

    const res = await POST(leadRequest());

    // forwarded to Strapi
    const [strapiUrl, init] = (fetch as ReturnType<typeof vi.fn>).mock.calls[0];
    expect(String(strapiUrl)).toContain("/api/leads");
    expect(JSON.parse(init.body)).toEqual({ data: leadData });

    // Trello fired with the lead payload
    expect(createTrelloCard).toHaveBeenCalledTimes(1);
    expect(createTrelloCard).toHaveBeenCalledWith(leadData);

    // response surfaced to the client
    expect(res.status).toBe(201);
    expect(await res.json()).toEqual({ data: { id: 7 } });
  });

  it("returns Strapi's error and does NOT create a Trello card when Strapi fails", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => new Response(JSON.stringify({ error: "bad" }), { status: 400 })));

    const res = await POST(leadRequest());

    expect(res.status).toBe(400);
    expect(createTrelloCard).not.toHaveBeenCalled();
  });

  it("returns 500 when the request body is not valid JSON", async () => {
    vi.stubGlobal("fetch", vi.fn());
    const badReq = new Request("http://localhost/api/leads", { method: "POST", body: "not-json" });

    const res = await POST(badReq);

    expect(res.status).toBe(500);
    expect(fetch).not.toHaveBeenCalled();
  });
});
