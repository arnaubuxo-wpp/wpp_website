// Shared types for the "Hand-picked reading" press links on the homepage.
//
// Storage mirrors the announced-deals feature: a single JSON blob in the
// existing page_content table at page="home", key="pressLinks" (see
// press-server.ts), rather than a new table. The list is short, only ever
// written by a signed-in admin, and always replaced wholesale — so the
// read-modify-write race that made enquiries need a real table doesn't apply.

export interface PressLink {
  /** Stable id, used as the React key and for delete/reorder. */
  id: string;
  /** Publication name, e.g. "TechCrunch". */
  source: string;
  title: string;
  /** One-line summary shown under the title. */
  blurb: string;
  url: string;
  /** ISO date (YYYY-MM-DD). Shown on the card and used to sort the fallback list. */
  date: string;
  /** Client the article relates to — optional, shown as a tag. */
  company: string;
}

export interface PressLinkInput {
  source: string;
  title: string;
  blurb: string;
  url: string;
  date: string;
  company: string;
}

export function makePressLink(input: PressLinkInput): PressLink {
  return {
    id:
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `press-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    source: input.source.trim(),
    title: input.title.trim(),
    blurb: input.blurb.trim(),
    url: input.url.trim(),
    date: input.date.trim(),
    company: input.company.trim(),
  };
}

export function isValidPressList(value: unknown): value is PressLink[] {
  if (!Array.isArray(value)) return false;
  return value.every(
    (p) =>
      p &&
      typeof p === "object" &&
      typeof (p as PressLink).title === "string" &&
      typeof (p as PressLink).url === "string"
  );
}
