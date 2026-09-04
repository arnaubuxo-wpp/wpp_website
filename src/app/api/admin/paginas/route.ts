import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { sql } from "@/lib/wpp/db";
import { verifySession, SESSION_COOKIE } from "@/lib/wpp/auth";
import { getPageDef } from "@/lib/wpp/override-fields";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface Body {
  page?: string;
  values?: Record<string, string>;
}

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const session = await verifySession(cookieStore.get(SESSION_COOKIE)?.value);
  if (!session) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  let body: Body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const pageSlug = body.page || "";
  const pageDef = getPageDef(pageSlug);
  if (!pageDef) {
    return NextResponse.json({ error: "Unknown page." }, { status: 400 });
  }

  const values = body.values || {};
  const fieldByKey = new Map(pageDef.fields.map((f) => [f.key, f]));

  try {
    for (const [key, rawValue] of Object.entries(values)) {
      const field = fieldByKey.get(key);
      if (!field) continue; // ignore keys not registered for this page

      const value = (rawValue ?? "").toString();

      if (value.trim() === "") {
        // Empty = revert to the original hardcoded copy.
        await sql()`DELETE FROM page_content WHERE page = ${pageSlug} AND key = ${key}`;
      } else {
        await sql()`
          INSERT INTO page_content (page, key, value, type, updated_at)
          VALUES (${pageSlug}, ${key}, ${value}, ${field.type}, now())
          ON CONFLICT (page, key)
          DO UPDATE SET value = EXCLUDED.value, type = EXCLUDED.type, updated_at = now()
        `;
      }
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Save page content error:", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
