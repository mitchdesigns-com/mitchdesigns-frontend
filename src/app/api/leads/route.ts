import { NextResponse } from "next/server";

import { createTrelloCard } from "@/lib/quote/createTrelloCard";

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL ?? "http://localhost:1337";
const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN;

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const res = await fetch(`${STRAPI_URL}/api/leads`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(STRAPI_TOKEN ? { Authorization: `Bearer ${STRAPI_TOKEN}` } : {}),
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json(data, { status: res.status });
    }

    // Await the card so the Worker isn't cancelled before it finishes (a bare
    // fire-and-forget / after() gets dropped on this runtime). The client
    // fire-and-forgets this request and soft-navigates, so the extra ~1s here
    // doesn't block the UI. Never let a Trello failure fail the lead response.
    const trello = await createTrelloCard(body?.data ?? {});

    const debug = new URL(request.url).searchParams.has("debugTrello");
    return NextResponse.json(debug ? { ...data, _trello: trello } : data, { status: 201 });
  } catch (err) {
    console.error("Lead proxy error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
