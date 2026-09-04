import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifySession, SESSION_COOKIE } from "@/lib/wpp/auth";
import { updatePost, deletePost, slugExists, getPostById } from "@/lib/wpp/blog-server";
import { slugify } from "@/lib/wpp/blog-types";
import type { PostInput, PostStatus } from "@/lib/wpp/blog-types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function validate(body: unknown): { input: PostInput; error?: undefined } | { error: string } {
  if (typeof body !== "object" || body === null) return { error: "Invalid request." };
  const b = body as Record<string, unknown>;

  const title = typeof b.title === "string" ? b.title.trim() : "";
  if (!title) return { error: "Title is required." };

  const status: PostStatus = b.status === "published" || b.status === "scheduled" ? b.status : "draft";

  if (status === "scheduled") {
    const t = typeof b.publishAt === "string" ? new Date(b.publishAt).getTime() : NaN;
    if (!Number.isFinite(t)) return { error: "A valid date is required to schedule a post." };
  }

  const rawSlug = typeof b.slug === "string" && b.slug.trim() ? b.slug.trim() : title;

  return {
    input: {
      title,
      slug: slugify(rawSlug),
      excerpt: typeof b.excerpt === "string" ? b.excerpt.trim() : "",
      content: typeof b.content === "string" ? b.content : "",
      coverImage: typeof b.coverImage === "string" && b.coverImage.trim() ? b.coverImage.trim() : null,
      categoryId: typeof b.categoryId === "number" ? b.categoryId : null,
      status,
      publishAt: typeof b.publishAt === "string" ? b.publishAt : null,
    },
  };
}

function parseId(raw: string): number | null {
  const id = Number(raw);
  return Number.isInteger(id) && id > 0 ? id : null;
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const cookieStore = await cookies();
  const session = await verifySession(cookieStore.get(SESSION_COOKIE)?.value);
  if (!session) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  const { id: rawId } = await params;
  const id = parseId(rawId);
  if (!id) return NextResponse.json({ error: "Invalid post id." }, { status: 400 });

  const existing = await getPostById(id);
  if (!existing) return NextResponse.json({ error: "Post not found." }, { status: 404 });

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const result = validate(body);
  if ("error" in result) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  let slug = result.input.slug;
  if (!slug) slug = `post-${Date.now()}`;
  if (await slugExists(slug, id)) {
    slug = `${slug}-${Date.now().toString().slice(-5)}`;
  }

  try {
    await updatePost(id, { ...result.input, slug });
    return NextResponse.json({ ok: true, id, slug });
  } catch (err) {
    console.error("Update post error:", err);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const cookieStore = await cookies();
  const session = await verifySession(cookieStore.get(SESSION_COOKIE)?.value);
  if (!session) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  const { id: rawId } = await params;
  const id = parseId(rawId);
  if (!id) return NextResponse.json({ error: "Invalid post id." }, { status: 400 });

  try {
    await deletePost(id);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Delete post error:", err);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
