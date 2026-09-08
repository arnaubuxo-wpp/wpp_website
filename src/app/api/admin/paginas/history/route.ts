import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifySession, SESSION_COOKIE } from "@/lib/wpp/auth";
import { getPageDef } from "@/lib/wpp/override-fields";
import { getPageHistory } from "@/lib/wpp/history-server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const cookieStore = await cookies();
  const session = await verifySession(cookieStore.get(SESSION_COOKIE)?.value);
  if (!session) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  const page = new URL(request.url).searchParams.get("page") || "";
  if (!getPageDef(page)) {
    return NextResponse.json({ error: "Unknown page." }, { status: 400 });
  }

  return NextResponse.json({ history: await getPageHistory(page) });
}
