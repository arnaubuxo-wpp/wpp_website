import "server-only";
import { sql } from "./db";
import type { Category, Post, PostInput, PostStatus, PostSummary } from "./blog-types";

interface PostRow {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover_image: string | null;
  status: PostStatus;
  publish_at: Date | string | null;
  created_at: Date | string;
  updated_at: Date | string;
  category_id: number | null;
  category_name: string | null;
  author_id: number | null;
  author_name: string | null;
}

function toIso(v: Date | string | null): string | null {
  if (v === null) return null;
  return v instanceof Date ? v.toISOString() : new Date(v).toISOString();
}

function rowToSummary(r: PostRow): PostSummary {
  return {
    id: r.id,
    title: r.title,
    slug: r.slug,
    excerpt: r.excerpt,
    coverImage: r.cover_image,
    status: r.status,
    publishAt: toIso(r.publish_at),
    createdAt: toIso(r.created_at)!,
    updatedAt: toIso(r.updated_at)!,
    categoryId: r.category_id,
    categoryName: r.category_name,
    authorId: r.author_id,
    authorName: r.author_name,
  };
}

const SELECT_BASE = `
  SELECT p.id, p.title, p.slug, p.excerpt, p.content, p.cover_image, p.status,
         p.publish_at, p.created_at, p.updated_at,
         p.category_id, c.name AS category_name,
         p.author_id, u.name AS author_name
  FROM posts p
  LEFT JOIN categories c ON c.id = p.category_id
  LEFT JOIN users u ON u.id = p.author_id
`;

// A post is publicly visible once its publish_at has passed and it isn't a draft.
const VISIBLE_CLAUSE = `p.status != 'draft' AND p.publish_at IS NOT NULL AND p.publish_at <= now()`;

// These four queries compose SELECT_BASE with a variable WHERE/ORDER clause,
// so they go through sql().query(text, params) with plain $1/$2 placeholders
// rather than the tagged-template form (which is for fully-static shapes).

export async function getAllPosts(): Promise<PostSummary[]> {
  const rows = (await sql().query(`${SELECT_BASE} ORDER BY p.created_at DESC`)) as unknown as PostRow[];
  return rows.map(rowToSummary);
}

export async function getPostById(id: number): Promise<Post | null> {
  const rows = (await sql().query(`${SELECT_BASE} WHERE p.id = $1 LIMIT 1`, [id])) as unknown as PostRow[];
  if (rows.length === 0) return null;
  const r = rows[0];
  return { ...rowToSummary(r), content: r.content };
}

export async function getPublicPosts(): Promise<PostSummary[]> {
  const rows = (await sql().query(
    `${SELECT_BASE} WHERE ${VISIBLE_CLAUSE} ORDER BY p.publish_at DESC`
  )) as unknown as PostRow[];
  return rows.map(rowToSummary);
}

export async function getPublicPostBySlug(slug: string): Promise<Post | null> {
  const rows = (await sql().query(
    `${SELECT_BASE} WHERE p.slug = $1 AND ${VISIBLE_CLAUSE} LIMIT 1`,
    [slug]
  )) as unknown as PostRow[];
  if (rows.length === 0) return null;
  const r = rows[0];
  return { ...rowToSummary(r), content: r.content };
}

// ---- Categories ----

export async function getCategories(): Promise<Category[]> {
  const rows = (await sql()`SELECT id, name, slug FROM categories ORDER BY name`) as unknown as Category[];
  return rows;
}

export async function createCategory(name: string, slug: string): Promise<Category> {
  const rows = (await sql()`
    INSERT INTO categories (name, slug) VALUES (${name}, ${slug})
    ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name
    RETURNING id, name, slug
  `) as unknown as Category[];
  return rows[0];
}

export async function deleteCategory(id: number): Promise<void> {
  await sql()`DELETE FROM categories WHERE id = ${id}`;
}

// ---- Mutations ----

function resolvePublishAt(input: PostInput): string | null {
  if (input.status === "draft") return null;
  if (input.status === "published") return new Date().toISOString();
  // scheduled
  return input.publishAt;
}

export async function createPost(input: PostInput, authorId: number): Promise<number> {
  const publishAt = resolvePublishAt(input);
  const rows = (await sql()`
    INSERT INTO posts (title, slug, excerpt, content, cover_image, category_id, author_id, status, publish_at)
    VALUES (${input.title}, ${input.slug}, ${input.excerpt}, ${input.content}, ${input.coverImage},
            ${input.categoryId}, ${authorId}, ${input.status}, ${publishAt})
    RETURNING id
  `) as unknown as { id: number }[];
  return rows[0].id;
}

export async function updatePost(id: number, input: PostInput): Promise<void> {
  const publishAt = resolvePublishAt(input);
  await sql()`
    UPDATE posts SET
      title = ${input.title},
      slug = ${input.slug},
      excerpt = ${input.excerpt},
      content = ${input.content},
      cover_image = ${input.coverImage},
      category_id = ${input.categoryId},
      status = ${input.status},
      publish_at = ${publishAt},
      updated_at = now()
    WHERE id = ${id}
  `;
}

export async function deletePost(id: number): Promise<void> {
  await sql()`DELETE FROM posts WHERE id = ${id}`;
}

export async function slugExists(slug: string, excludeId?: number): Promise<boolean> {
  const rows = (await sql()`
    SELECT id FROM posts WHERE slug = ${slug} AND id != ${excludeId ?? -1} LIMIT 1
  `) as unknown as { id: number }[];
  return rows.length > 0;
}
