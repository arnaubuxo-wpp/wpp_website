// Shared shape for an admin account row, so the client component can type its
// props without importing the "server-only" module that produces them.

export interface AdminUser {
  id: number;
  email: string;
  name: string | null;
  createdAt: string | null;
  /** True for the account the viewer is signed in with — it can't remove itself. */
  isSelf: boolean;
}
