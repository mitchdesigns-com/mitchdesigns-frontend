import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { submitLead } from "./submitLead";

describe("submitLead", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn(async () => new Response(JSON.stringify({ data: { id: 1 } }), { status: 201 })));
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("POSTs the lead to /api/leads wrapped in { data } with source", async () => {
    await submitLead({ firstName: "Sarah", lastName: "Mitchell", email: "sarah@acme.com", service: "corporate-website" });

    expect(fetch).toHaveBeenCalledTimes(1);
    const [url, init] = (fetch as ReturnType<typeof vi.fn>).mock.calls[0];
    expect(url).toBe("/api/leads");
    expect(init.method).toBe("POST");
    expect(init.headers).toMatchObject({ "Content-Type": "application/json" });

    const body = JSON.parse(init.body);
    expect(body).toEqual({
      data: {
        firstName: "Sarah",
        lastName: "Mitchell",
        email: "sarah@acme.com",
        service: "corporate-website",
        source: "quote-form",
      },
    });
  });

  it("maps file ids to relation fields and drops the *Id keys", async () => {
    await submitLead({
      firstName: "Sarah",
      email: "sarah@acme.com",
      sitemapFileId: 11,
      companyProfileId: 22,
      briefFileId: 33,
    });

    const body = JSON.parse((fetch as ReturnType<typeof vi.fn>).mock.calls[0][1].body);
    expect(body.data).toMatchObject({ sitemapFile: 11, companyProfile: 22, briefFile: 33 });
    expect(body.data).not.toHaveProperty("sitemapFileId");
    expect(body.data).not.toHaveProperty("companyProfileId");
    expect(body.data).not.toHaveProperty("briefFileId");
  });

  it("throws when the API responds with a non-ok status", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => new Response("nope", { status: 500 })));

    await expect(submitLead({ firstName: "X", email: "x@y.com" })).rejects.toThrow(/Lead submission failed \(500\)/);
  });
});
