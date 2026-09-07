// Server-only read/write for the "announced deals" list. Reuses the existing
// page_content table (page, key, value) as a single JSON blob rather than a
// new table — see deals-types.ts for why. Fails soft on read (returns [])
// so a DB hiccup never breaks the public home page; it just shows the
// original hardcoded deals with no admin-added ones on top.
import "server-only";
import { sql } from "./db";
import { isValidDealList, type AnnouncedDeal } from "./deals-types";

const PAGE = "home";
const KEY = "announcedDeals";

export async function getAnnouncedDeals(): Promise<AnnouncedDeal[]> {
  try {
    const rows = (await sql()`
      SELECT value FROM page_content WHERE page = ${PAGE} AND key = ${KEY} LIMIT 1
    `) as { value: string }[];
    if (rows.length === 0) return [];
    const parsed = JSON.parse(rows[0].value);
    return isValidDealList(parsed) ? parsed : [];
  } catch (err) {
    console.error("Failed to load announced deals:", err);
    return [];
  }
}

export async function saveAnnouncedDeals(deals: AnnouncedDeal[]): Promise<void> {
  const value = JSON.stringify(deals);
  await sql()`
    INSERT INTO page_content (page, key, value, type, updated_at)
    VALUES (${PAGE}, ${KEY}, ${value}, 'json', now())
    ON CONFLICT (page, key)
    DO UPDATE SET value = EXCLUDED.value, type = EXCLUDED.type, updated_at = now()
  `;
}
