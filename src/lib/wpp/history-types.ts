// Shared type for page-content history entries. Split out of history-server.ts
// (which is "server-only") so client components can import it — the same split
// enquiries-types.ts / enquiries-server.ts uses.

export interface HistoryEntry {
  id: number;
  key: string;
  previousValue: string | null;
  changedBy: string | null;
  changedAt: string;
}
