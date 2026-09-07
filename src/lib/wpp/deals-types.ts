// Shared types for the "announced deals" feature — lets an admin add a new
// deal (with its logo) to the "Selected mandates" marquee on the home page
// whenever a new deal is announced, without touching code.
//
// Storage note: these are NOT stored in their own table. They reuse the
// existing page_content table (see overrides-server.ts / page_content
// schema) as a single JSON blob at page="home", key="announcedDeals" — see
// deals-server.ts. That table already exists and is already reachable from
// this app, so this avoids a schema migration; the field-override registry
// (override-fields.ts) is untouched since this isn't a simple text field.

export interface AnnouncedDeal {
  /** Stable id (crypto.randomUUID()), used as the React key and for delete/reorder. */
  id: string;
  name: string;
  /** Absolute URL to the uploaded logo (Vercel Blob), or null if none was uploaded. */
  logoUrl: string | null;
  /** Short label shown on the card, e.g. "Fundraise", "Sale to Acme Corp". */
  summary: string;
  /** Shown uppercased on the card, e.g. "$10m" or "Confidential". */
  detail: string;
  /** Optional, for the admin's own reference — not rendered on the public site. */
  sector: string;
  createdAt: string; // ISO
}

export interface AnnouncedDealInput {
  name: string;
  logoUrl: string | null;
  summary: string;
  detail: string;
  sector: string;
}

export function makeDeal(input: AnnouncedDealInput): AnnouncedDeal {
  return {
    id:
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `deal-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    name: input.name.trim(),
    logoUrl: input.logoUrl?.trim() || null,
    summary: input.summary.trim(),
    detail: input.detail.trim(),
    sector: input.sector.trim(),
    createdAt: new Date().toISOString(),
  };
}

export function isValidDealList(value: unknown): value is AnnouncedDeal[] {
  if (!Array.isArray(value)) return false;
  return value.every(
    (d) =>
      d &&
      typeof d === "object" &&
      typeof (d as AnnouncedDeal).id === "string" &&
      typeof (d as AnnouncedDeal).name === "string"
  );
}
