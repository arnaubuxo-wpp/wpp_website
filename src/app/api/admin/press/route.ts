import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifySession, SESSION_COOKIE } from "@/lib/wpp/auth";
import { getCuratedPressLinks, savePressLinks } from "@/lib/wpp/press-server";
import type { PressLink } from "@/lib/wpp/press-types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function requireSession() {
  const cookieStore = await cookies();
  return verifySession(cookieStore.get(SESSION_COOKIE)?.value);
}

export async function GET() {
  const session = await requireSession();
  if (!session) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }
  return NextResponse.json({ links: await getCuratedPressLinks() });
}

/**
 * Replaces the whole list. Like the deals endpoint, the admin UI keeps the array
 * in client state and PUTs the resulting array on every change — one row to keep
 * consistent, so per-item endpoints would only add ways to get it out of sync.
 */
export async function PUT(request: Request) {
  const session = await requireSession();
  if (!session) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const links = (body as { links?: unknown })?.links;
  if (!Array.isArray(links)) {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const clean: PressLink[] = [];
  for (const raw of links) {
    if (typeof raw !== "object" || raw === null) continue;
    const p = raw as Record<string, unknown>;
    const title = typeof p.title === "string" ? p.title.trim() : "";
    const url = typeof p.url === "string" ? p.url.trim() : "";
    const id = typeof p.id === "string" && p.id ? p.id : "";
    if (!title || !url || !id) continue;

    // Only http(s) links get through — this list renders as anchors on the
    // public homepage, so javascript:/data: URLs must never reach it.
    let safeUrl: string;
    try {
      const parsed = new URL(url);
      if (parsed.protocol !== "http:" && parsed.protocol !== "https:") continue;
      safeUrl = parsed.toString();
    } catch {
      continue;
    }

    clean.push({
      id,
      source: typeof p.source === "string" ? p.source.trim() : "",
      title,
      blurb: typeof p.blurb === "string" ? p.blurb.trim() : "",
      url: safeUrl,
      date: typeof p.date === "string" ? p.date.trim() : "",
      company: typeof p.company === "string" ? p.company.trim() : "",
    });
  }

  try {
    await savePressLinks(clean);
    return NextResponse.json({ ok: true, links: clean });
  } catch (err) {
    console.error("Save press links error:", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
