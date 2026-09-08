// Server-only storage for contact-form enquiries.
//
// Unlike announced deals (a short list kept as a single JSON blob in page_content),
// enquiries need a real table: the list grows without bound and writes arrive from
// the public internet, so concurrent submissions would race and silently overwrite
// each other in a read-modify-write blob.
//
// There is no migration tooling in this project, so the table is created lazily on
// first use and the result memoised per serverless instance. CREATE TABLE IF NOT
// EXISTS is idempotent and cheap, and this keeps the feature self-contained — no
// manual step in the Neon console before it works.
import "server-only";
import { createHash } from "crypto";
import { sql } from "./db";
import type { Enquiry, EnquiryInput, EnquiryStatus } from "./enquiries-types";

let ensured: Promise<void> | null = null;

function ensureTable(): Promise<void> {
  if (!ensured) {
    ensured = (async () => {
      await sql()`
        CREATE TABLE IF NOT EXISTS wpp_enquiries (
          id         SERIAL PRIMARY KEY,
          name       TEXT NOT NULL,
          company    TEXT NOT NULL DEFAULT '',
          email      TEXT NOT NULL,
          role       TEXT NOT NULL DEFAULT '',
          message    TEXT NOT NULL,
          status     TEXT NOT NULL DEFAULT 'new',
          ip_hash    TEXT,
          created_at TIMESTAMPTZ NOT NULL DEFAULT now()
        )
      `;
      await sql()`
        CREATE INDEX IF NOT EXISTS wpp_enquiries_created_idx
        ON wpp_enquiries (created_at DESC)
      `;
    })().catch((err) => {
      // Don't cache a failure — the next request should retry.
      ensured = null;
      throw err;
    });
  }
  return ensured;
}

interface EnquiryRow {
  id: number;
  name: string;
  company: string;
  email: string;
  role: string;
  message: string;
  status: EnquiryStatus;
  created_at: Date | string;
}

function rowToEnquiry(r: EnquiryRow): Enquiry {
  return {
    id: r.id,
    name: r.name,
    company: r.company,
    email: r.email,
    role: r.role,
    message: r.message,
    status: r.status,
    createdAt: r.created_at instanceof Date ? r.created_at.toISOString() : new Date(r.created_at).toISOString(),
  };
}

/**
 * Hashes the submitter's IP for rate limiting. We never store the raw address:
 * a salted one-way hash is enough to spot repeat submissions from one source,
 * and keeps the stored data non-identifying.
 */
export function hashIp(ip: string): string {
  const salt = process.env.JWT_SECRET || "wpp-fallback-salt";
  return createHash("sha256").update(`${salt}:${ip}`).digest("hex").slice(0, 32);
}

/** How many enquiries this IP hash has submitted in the last hour. */
export async function recentCountForIp(ipHash: string): Promise<number> {
  await ensureTable();
  const rows = (await sql()`
    SELECT COUNT(*)::int AS n FROM wpp_enquiries
    WHERE ip_hash = ${ipHash} AND created_at > now() - interval '1 hour'
  `) as { n: number }[];
  return rows[0]?.n ?? 0;
}

export async function createEnquiry(input: EnquiryInput, ipHash: string | null): Promise<void> {
  await ensureTable();
  await sql()`
    INSERT INTO wpp_enquiries (name, company, email, role, message, ip_hash)
    VALUES (
      ${input.name.trim()},
      ${input.company.trim()},
      ${input.email.trim()},
      ${input.role.trim()},
      ${input.message.trim()},
      ${ipHash}
    )
  `;
}

export async function listEnquiries(): Promise<Enquiry[]> {
  try {
    await ensureTable();
    const rows = (await sql()`
      SELECT id, name, company, email, role, message, status, created_at
      FROM wpp_enquiries
      ORDER BY created_at DESC
      LIMIT 500
    `) as EnquiryRow[];
    return rows.map(rowToEnquiry);
  } catch (err) {
    // Fail soft: an admin screen that renders empty beats one that 500s.
    console.error("Failed to load enquiries:", err);
    return [];
  }
}

export async function countNewEnquiries(): Promise<number> {
  try {
    await ensureTable();
    const rows = (await sql()`
      SELECT COUNT(*)::int AS n FROM wpp_enquiries WHERE status = 'new'
    `) as { n: number }[];
    return rows[0]?.n ?? 0;
  } catch (err) {
    console.error("Failed to count new enquiries:", err);
    return 0;
  }
}

export async function setEnquiryStatus(id: number, status: EnquiryStatus): Promise<void> {
  await ensureTable();
  await sql()`UPDATE wpp_enquiries SET status = ${status} WHERE id = ${id}`;
}

export async function deleteEnquiry(id: number): Promise<void> {
  await ensureTable();
  await sql()`DELETE FROM wpp_enquiries WHERE id = ${id}`;
}
