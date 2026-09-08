// Server-only read/write for the homepage "Hand-picked reading" links.
//
// When an admin has curated a list, that list wins, in the order they arranged it.
// When they haven't, the original hardcoded WPP_NEWS_DATA is returned sorted newest
// first — so the section keeps working exactly as before until someone edits it,
// and emptying the list in the admin restores that original behaviour.
import "server-only";
import { sql } from "./db";
import { WPP_NEWS_DATA } from "./news-data";
import { isValidPressList, type PressLink } from "./press-types";

const PAGE = "home";
const KEY = "pressLinks";

/** The original hardcoded list, shaped as PressLink and sorted newest first. */
function fallbackLinks(): PressLink[] {
  return [...WPP_NEWS_DATA]
    .sort((a, b) => (b.date || "").localeCompare(a.date || ""))
    .map((n, i) => ({
      id: `builtin-${i}`,
      source: n.source ?? "",
      title: n.title ?? "",
      blurb: n.blurb ?? "",
      url: n.url ?? "",
      date: n.date ?? "",
      company: n.company ?? "",
    }));
}

/** What the admin has curated, or [] if they haven't. */
export async function getCuratedPressLinks(): Promise<PressLink[]> {
  try {
    const rows = (await sql()`
      SELECT value FROM page_content WHERE page = ${PAGE} AND key = ${KEY} LIMIT 1
    `) as { value: string }[];
    if (rows.length === 0) return [];
    const parsed = JSON.parse(rows[0].value);
    return isValidPressList(parsed) ? parsed : [];
  } catch (err) {
    console.error("Failed to load press links:", err);
    return [];
  }
}

/** What the homepage should actually render: curated if present, else the built-in list. */
export async function getPressLinks(): Promise<PressLink[]> {
  const curated = await getCuratedPressLinks();
  return curated.length > 0 ? curated : fallbackLinks();
}

/** The built-in list, exposed so the admin can seed the editor from it. */
export function getFallbackPressLinks(): PressLink[] {
  return fallbackLinks();
}

export async function savePressLinks(links: PressLink[]): Promise<void> {
  const value = JSON.stringify(links);
  await sql()`
    INSERT INTO page_content (page, key, value, type, updated_at)
    VALUES (${PAGE}, ${KEY}, ${value}, 'json', now())
    ON CONFLICT (page, key)
    DO UPDATE SET value = EXCLUDED.value, type = EXCLUDED.type, updated_at = now()
  `;
}
