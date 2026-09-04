// Shared types for the blog system — safe to import from client components
// (the editor, the post list) as well as server code. DB access itself lives
// in blog-server.ts, which is "server-only".

export type PostStatus = "draft" | "published" | "scheduled";

export interface Category {
  id: number;
  name: string;
  slug: string;
}

export interface PostSummary {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  coverImage: string | null;
  status: PostStatus;
  publishAt: string | null; // ISO string, or null for drafts
  createdAt: string;
  updatedAt: string;
  categoryId: number | null;
  categoryName: string | null;
  authorId: number | null;
  authorName: string | null;
}

export interface Post extends PostSummary {
  content: string; // HTML produced by the TipTap editor
}

export interface PostInput {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string | null;
  categoryId: number | null;
  status: PostStatus;
  publishAt: string | null; // required for "scheduled", ignored/derived for the others
}

// A post is publicly visible once its publish_at has passed, regardless of
// whether it's still labelled "scheduled" or was published outright — this
// is the single source of truth both the DB queries and any client-side
// preview logic should agree with.
export function isVisible(publishAt: string | null, status: PostStatus): boolean {
  if (status === "draft") return false;
  if (!publishAt) return false;
  return new Date(publishAt).getTime() <= Date.now();
}

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // strip accents (post-NFD combining marks)
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 96);
}
