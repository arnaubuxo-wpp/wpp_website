import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { randomBytes } from "crypto";
import bcrypt from "bcryptjs";
import { sql } from "@/lib/wpp/db";
import { verifySession, SESSION_COOKIE } from "@/lib/wpp/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Every admin is equal here — there are no roles, so any signed-in admin can add
// or reset another. That matches how the panel already works (anyone who can sign
// in can change any content) and is the point of the feature: removing the need
// for direct database access just to add a colleague.

async function requireSession() {
  const cookieStore = await cookies();
  return verifySession(cookieStore.get(SESSION_COOKIE)?.value);
}

interface UserRow {
  id: number;
  email: string;
  name: string | null;
  created_at: Date | string | null;
}

/**
 * A readable temporary password — this gets passed to a colleague out-of-band,
 * so awkward characters cause more support than they prevent. It is shown once,
 * stored only as a bcrypt hash, and meant to be changed on first sign-in.
 */
function tempPassword(): string {
  const alphabet = "abcdefghijkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const bytes = randomBytes(16);
  let out = "";
  for (let i = 0; i < 16; i++) out += alphabet[bytes[i] % alphabet.length];
  return `${out.slice(0, 4)}-${out.slice(4, 8)}-${out.slice(8, 12)}-${out.slice(12, 16)}`;
}

export async function GET() {
  const session = await requireSession();
  if (!session) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  try {
    const rows = (await sql()`
      SELECT id, email, name, created_at FROM users ORDER BY id ASC
    `) as UserRow[];
    return NextResponse.json({
      users: rows.map((r) => ({
        id: r.id,
        email: r.email,
        name: r.name,
        createdAt: r.created_at
          ? r.created_at instanceof Date
            ? r.created_at.toISOString()
            : new Date(r.created_at).toISOString()
          : null,
        isSelf: String(r.id) === String(session.sub),
      })),
    });
  } catch (err) {
    console.error("List users error:", err);
    return NextResponse.json({ error: "Couldn't load the user list." }, { status: 500 });
  }
}

/** Create a new admin, returning a one-time temporary password. */
export async function POST(request: Request) {
  const session = await requireSession();
  if (!session) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  let body: { email?: string; name?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const email = (body.email || "").trim().toLowerCase();
  const name = (body.name || "").trim();

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
  }

  try {
    const existing = (await sql()`
      SELECT id FROM users WHERE email = ${email} LIMIT 1
    `) as { id: number }[];
    if (existing.length > 0) {
      return NextResponse.json(
        { error: "There's already an account with that email." },
        { status: 409 }
      );
    }

    const password = tempPassword();
    const hash = await bcrypt.hash(password, 12);
    await sql()`
      INSERT INTO users (email, password_hash, name)
      VALUES (${email}, ${hash}, ${name || null})
    `;

    // Returned exactly once — it is not recoverable afterwards, only resettable.
    return NextResponse.json({ ok: true, email, password });
  } catch (err) {
    console.error("Create user error:", err);
    return NextResponse.json({ error: "Couldn't create that account." }, { status: 500 });
  }
}

/** Reset another admin's password, returning a one-time temporary password. */
export async function PATCH(request: Request) {
  const session = await requireSession();
  if (!session) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  let body: { id?: unknown };
  try {
    body = (await request.json()) as { id?: unknown };
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const id = Number(body.id);
  if (!Number.isInteger(id) || id <= 0) {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  try {
    const rows = (await sql()`SELECT id, email FROM users WHERE id = ${id} LIMIT 1`) as {
      id: number;
      email: string;
    }[];
    if (rows.length === 0) {
      return NextResponse.json({ error: "That account no longer exists." }, { status: 404 });
    }

    const password = tempPassword();
    const hash = await bcrypt.hash(password, 12);
    await sql()`UPDATE users SET password_hash = ${hash} WHERE id = ${id}`;

    return NextResponse.json({ ok: true, email: rows[0].email, password });
  } catch (err) {
    console.error("Reset password error:", err);
    return NextResponse.json({ error: "Couldn't reset that password." }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const session = await requireSession();
  if (!session) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  let body: { id?: unknown };
  try {
    body = (await request.json()) as { id?: unknown };
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const id = Number(body.id);
  if (!Number.isInteger(id) || id <= 0) {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  // Two guards, both about not locking everyone out: you can't remove the account
  // you're signed in with, and you can't remove the last one standing.
  if (String(id) === String(session.sub)) {
    return NextResponse.json(
      { error: "You can't remove the account you're signed in with." },
      { status: 400 }
    );
  }

  try {
    const countRows = (await sql()`SELECT COUNT(*)::int AS n FROM users`) as { n: number }[];
    if ((countRows[0]?.n ?? 0) <= 1) {
      return NextResponse.json(
        { error: "This is the only admin account — it can't be removed." },
        { status: 400 }
      );
    }

    await sql()`DELETE FROM users WHERE id = ${id}`;
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Delete user error:", err);
    return NextResponse.json(
      {
        error:
          "Couldn't remove that account. If they've written blog posts, those may need reassigning first.",
      },
      { status: 500 }
    );
  }
}
