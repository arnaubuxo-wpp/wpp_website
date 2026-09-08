// Server-only read of the admin account list, so /admin/users renders with its
// data already in place — the same shape every other admin screen uses, and it
// avoids a fetch-on-mount that only exists to fill an empty page.
import "server-only";
import { sql } from "./db";
import type { AdminUser } from "./users-types";

interface UserRow {
  id: number;
  email: string;
  name: string | null;
  created_at: Date | string | null;
}

export async function listAdminUsers(currentUserId: string | number): Promise<AdminUser[]> {
  try {
    const rows = (await sql()`
      SELECT id, email, name, created_at FROM users ORDER BY id ASC
    `) as UserRow[];
    return rows.map((r) => ({
      id: r.id,
      email: r.email,
      name: r.name,
      createdAt: r.created_at
        ? r.created_at instanceof Date
          ? r.created_at.toISOString()
          : new Date(r.created_at).toISOString()
        : null,
      isSelf: String(r.id) === String(currentUserId),
    }));
  } catch (err) {
    console.error("Failed to list admin users:", err);
    return [];
  }
}
