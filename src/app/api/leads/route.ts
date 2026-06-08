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

    // Fire-and-forget Trello card — never block or fail the lead response on it.
    createTrelloCard(body?.data ?? {}).catch((err) =>
      console.error("Trello card error:", err),
    );

    return NextResponse.json(data, { status: 201 });
  } catch (err) {
    console.error("Lead proxy error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
