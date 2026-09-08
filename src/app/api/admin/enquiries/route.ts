import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifySession, SESSION_COOKIE } from "@/lib/wpp/auth";
import { deleteEnquiry, listEnquiries, setEnquiryStatus } from "@/lib/wpp/enquiries-server";
import { isEnquiryStatus } from "@/lib/wpp/enquiries-types";

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
  const enquiries = await listEnquiries();
  return NextResponse.json({ enquiries });
}

/** Update one enquiry's status (new / read / archived). */
export async function PATCH(request: Request) {
  const session = await requireSession();
  if (!session) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const id = Number(body.id);
  const status = body.status;
  if (!Number.isInteger(id) || id <= 0 || !isEnquiryStatus(status)) {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  try {
    await setEnquiryStatus(id, status);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Update enquiry status error:", err);
    return NextResponse.json({ error: "Couldn't update that enquiry." }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const session = await requireSession();
  if (!session) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const id = Number(body.id);
  if (!Number.isInteger(id) || id <= 0) {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  try {
    await deleteEnquiry(id);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Delete enquiry error:", err);
    return NextResponse.json({ error: "Couldn't delete that enquiry." }, { status: 500 });
  }
}
