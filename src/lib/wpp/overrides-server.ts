// Server-only: fetches this page's field overrides from Postgres. Called from
// each route's Server Component (page.tsx) so the value is already resolved
// by the time the client component renders — no loading flash, no client-side
// DB round trip. Fails soft (returns {}) so a DB hiccup never breaks the
// public site — pages just render their original hardcoded copy.
import "server-only";
import { sql } from "./db";

export async function getOverrides(page: string): Promise<Record<string, string>> {
  try {
    const rows = (await sql()`
      SELECT key, value FROM page_content WHERE page = ${page}
    `) as { key: string; value: string }[];

    const map: Record<string, string> = {};
    for (const row of rows) {
      map[row.key] = row.value;
    }
    return map;
  } catch (err) {
    console.error(`Failed to load overrides for page "${page}":`, err);
    return {};
  }
}
