/**
 * front-edit session handler — app/api/edit/route.ts
 *
 *   /api/edit?token=MAGIC  -> exchange magic token for a 24h session,
 *                             enable draft mode, set edit cookies, redirect /orderbase
 *   /api/edit?reenter=1    -> re-enable draft mode for an existing fe_session
 *                             (draft cookie is session-scoped; ours lasts 24h)
 *   /api/edit?exit=1       -> disable draft mode, clear cookies
 *
 * Uses NEXT_PUBLIC_STRAPI_URL (the CMS origin).
 */
import { draftMode, cookies } from "next/headers";
import { NextResponse } from "next/server";

const STRAPI = process.env.NEXT_PUBLIC_STRAPI_URL ?? "http://localhost:1337";
const HOME = "/orderbase";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const dm = await draftMode();

  if (url.searchParams.get("exit")) {
    dm.disable();
    const res = NextResponse.redirect(new URL(HOME, url));
    res.cookies.set("fe_session", "", { maxAge: 0, path: "/" });
    res.cookies.set("fe_name", "", { maxAge: 0, path: "/" });
    return res;
  }

  // re-enter: an edit session exists but draft mode lapsed — just re-enable
  if (url.searchParams.get("reenter")) {
    const hasSession = (await cookies()).has("fe_session");
    if (hasSession) dm.enable();
    return NextResponse.redirect(new URL(HOME, url));
  }

  const token = url.searchParams.get("token");
  if (!token) return NextResponse.redirect(new URL(HOME, url));

  const r = await fetch(`${STRAPI}/api/front-edit/session`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token }),
    cache: "no-store",
  });
  if (!r.ok) {
    return new NextResponse(
      "This edit link is no longer valid — ask your agency for a new one.",
      { status: 401 },
    );
  }
  const session = (await r.json()) as {
    sessionToken: string;
    editorName: string;
    expiresAt: string;
  };
  const maxAge = Math.max(
    60,
    Math.floor((new Date(session.expiresAt).getTime() - Date.now()) / 1000),
  );

  dm.enable();
  const res = NextResponse.redirect(new URL(HOME, url));
  // NOT httpOnly: the overlay reads it to call the front-edit API. It is a 24h
  // session token (revocable server-side), never the magic link itself.
  res.cookies.set("fe_session", session.sessionToken, {
    maxAge,
    path: "/",
    sameSite: "lax",
  });
  res.cookies.set("fe_name", session.editorName, {
    maxAge,
    path: "/",
    sameSite: "lax",
  });
  return res;
}
