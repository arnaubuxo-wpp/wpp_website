// Server-only: a change log for page_content edits.
//
// Page edits save straight to the live site with no staging step, so without this
// a mistaken overwrite of reviewed copy is unrecoverable — the only fallback is
// emptying the field to return to the original hardcoded text, which loses every
// edit made since. This records what a field said *before* each change, so any
// earlier wording can be put back.
//
// As with enquiries, there is no migration tooling here, so the table is created
// lazily and memoised per serverless instance.
import "server-only";
import { sql } from "./db";
import type { HistoryEntry } from "./history-types";

export type { HistoryEntry };

let ensured: Promise<void> | null = null;

function ensureTable(): Promise<void> {
  if (!ensured) {
    ensured = (async () => {
      await sql()`
        CREATE TABLE IF NOT EXISTS wpp_content_history (
          id             SERIAL PRIMARY KEY,
          page           TEXT NOT NULL,
          key            TEXT NOT NULL,
          previous_value TEXT,
          changed_by     TEXT,
          changed_at     TIMESTAMPTZ NOT NULL DEFAULT now()
        )
      `;
      await sql()`
        CREATE INDEX IF NOT EXISTS wpp_content_history_field_idx
        ON wpp_content_history (page, key, changed_at DESC)
      `;
    })().catch((err) => {
      ensured = null;
      throw err;
    });
  }
  return ensured;
}

interface HistoryRow {
  id: number;
  key: string;
  previous_value: string | null;
  changed_by: string | null;
  changed_at: Date | string;
}

function toEntry(r: HistoryRow): HistoryEntry {
  return {
    id: r.id,
    key: r.key,
    previousValue: r.previous_value,
    changedBy: r.changed_by,
    changedAt: r.changed_at instanceof Date ? r.changed_at.toISOString() : new Date(r.changed_at).toISOString(),
  };
}

/**
 * Records the value a field held before it was changed. Never throws: losing a
 * history entry is an acceptable outcome, failing the admin's save is not.
 */
export async function recordChange(
  page: string,
  key: string,
  previousValue: string | null,
  changedBy: string | null
): Promise<void> {
  try {
    await ensureTable();
    await sql()`
      INSERT INTO wpp_content_history (page, key, previous_value, changed_by)
      VALUES (${page}, ${key}, ${previousValue}, ${changedBy})
    `;
  } catch (err) {
    console.error("Failed to record content history:", err);
  }
}

/** Recent history for one page, newest first. Capped so the payload stays small. */
export async function getPageHistory(page: string, limit = 120): Promise<HistoryEntry[]> {
  try {
    await ensureTable();
    const rows = (await sql()`
      SELECT id, key, previous_value, changed_by, changed_at
      FROM wpp_content_history
      WHERE page = ${page}
      ORDER BY changed_at DESC
      LIMIT ${limit}
    `) as HistoryRow[];
    return rows.map(toEntry);
  } catch (err) {
    console.error("Failed to load content history:", err);
    return [];
  }
}
