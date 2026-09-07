import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifySession, SESSION_COOKIE } from "@/lib/wpp/auth";
import { getAnnouncedDeals, saveAnnouncedDeals } from "@/lib/wpp/deals-server";
import type { AnnouncedDeal } from "@/lib/wpp/deals-types";

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
  const deals = await getAnnouncedDeals();
  return NextResponse.json({ deals });
}

// Replaces the whole list — the admin UI keeps the array in client state
// (add/delete/reorder are all local edits) and PUTs the full, resulting
// array back on every change. Simpler and safer than per-item endpoints
// since there's only ever one row to keep consistent.
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

  const deals = (body as { deals?: unknown })?.deals;
  if (!Array.isArray(deals)) {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  // Validate + sanitize each entry rather than trusting the client wholesale.
  const clean: AnnouncedDeal[] = [];
  for (const raw of deals) {
    if (typeof raw !== "object" || raw === null) continue;
    const d = raw as Record<string, unknown>;
    const name = typeof d.name === "string" ? d.name.trim() : "";
    const id = typeof d.id === "string" && d.id ? d.id : "";
    if (!name || !id) continue;
    clean.push({
      id,
      name,
      logoUrl: typeof d.logoUrl === "string" && d.logoUrl.trim() ? d.logoUrl.trim() : null,
      summary: typeof d.summary === "string" ? d.summary.trim() : "",
      detail: typeof d.detail === "string" ? d.detail.trim() : "",
      sector: typeof d.sector === "string" ? d.sector.trim() : "",
      createdAt: typeof d.createdAt === "string" ? d.createdAt : new Date().toISOString(),
    });
  }

  try {
    await saveAnnouncedDeals(clean);
    return NextResponse.json({ ok: true, deals: clean });
  } catch (err) {
    console.error("Save announced deals error:", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
