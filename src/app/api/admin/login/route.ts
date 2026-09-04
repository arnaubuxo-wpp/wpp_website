import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { sql } from "@/lib/wpp/db";
import { signSession, SESSION_COOKIE } from "@/lib/wpp/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface UserRow {
  id: number;
  email: string;
  password_hash: string;
  name: string | null;
}

export async function POST(request: Request) {
  let body: { email?: string; password?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const email = (body.email || "").trim().toLowerCase();
  const password = body.password || "";

  if (!email || !password) {
    return NextResponse.json(
      { error: "Email and password are required." },
      { status: 400 }
    );
  }

  // Generic error message on every failure path below — never reveal
  // whether the email exists.
  const invalid = () =>
    NextResponse.json({ error: "Invalid email or password." }, { status: 401 });

  try {
    const rows = (await sql()`
      SELECT id, email, password_hash, name FROM users WHERE email = ${email} LIMIT 1
    `) as UserRow[];

    const user = rows[0];
    if (!user) return invalid();

    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) return invalid();

    const token = await signSession({
      sub: String(user.id),
      email: user.email,
      name: user.name,
    });

    const response = NextResponse.json({ ok: true });
    response.cookies.set(SESSION_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });
    return response;
  } catch (err) {
    console.error("Login error:", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
