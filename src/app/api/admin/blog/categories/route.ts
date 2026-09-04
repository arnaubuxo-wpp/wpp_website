import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifySession, SESSION_COOKIE } from "@/lib/wpp/auth";
import { createCategory, deleteCategory } from "@/lib/wpp/blog-server";
import { slugify } from "@/lib/wpp/blog-types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const session = await verifySession(cookieStore.get(SESSION_COOKIE)?.value);
  if (!session) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const name = typeof (body as Record<string, unknown>)?.name === "string" ? (body as Record<string, unknown>).name as string : "";
  const trimmed = name.trim();
  if (!trimmed) {
    return NextResponse.json({ error: "Name is required." }, { status: 400 });
  }

  try {
    const category = await createCategory(trimmed, slugify(trimmed));
    return NextResponse.json({ ok: true, category });
  } catch (err) {
    console.error("Create category error:", err);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const cookieStore = await cookies();
  const session = await verifySession(cookieStore.get(SESSION_COOKIE)?.value);
  if (!session) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  const url = new URL(request.url);
  const idParam = url.searchParams.get("id");
  const id = idParam ? Number(idParam) : NaN;
  if (!Number.isInteger(id) || id <= 0) {
    return NextResponse.json({ error: "Invalid category id." }, { status: 400 });
  }

  try {
    await deleteCategory(id);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Delete category error:", err);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
