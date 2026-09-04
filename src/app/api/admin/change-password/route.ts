import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { sql } from "@/lib/wpp/db";
import { verifySession, SESSION_COOKIE } from "@/lib/wpp/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface UserRow {
  id: number;
  password_hash: string;
}

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const session = await verifySession(cookieStore.get(SESSION_COOKIE)?.value);
  if (!session) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  let body: { currentPassword?: string; newPassword?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const currentPassword = body.currentPassword || "";
  const newPassword = body.newPassword || "";

  if (!currentPassword || !newPassword) {
    return NextResponse.json(
      { error: "Current and new password are required." },
      { status: 400 }
    );
  }
  if (newPassword.length < 8) {
    return NextResponse.json(
      { error: "New password must be at least 8 characters." },
      { status: 400 }
    );
  }

  try {
    const rows = (await sql()`
      SELECT id, password_hash FROM users WHERE id = ${session.sub} LIMIT 1
    `) as UserRow[];
    const user = rows[0];
    if (!user) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    const ok = await bcrypt.compare(currentPassword, user.password_hash);
    if (!ok) {
      return NextResponse.json(
        { error: "Current password is incorrect." },
        { status: 401 }
      );
    }

    const newHash = await bcrypt.hash(newPassword, 12);
    await sql()`UPDATE users SET password_hash = ${newHash} WHERE id = ${user.id}`;

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Change password error:", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
