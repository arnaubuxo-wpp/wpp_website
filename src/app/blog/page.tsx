import type { Metadata } from "next";
import { getPublicPosts, getCategories } from "@/lib/wpp/blog-server";
import BlogClient from "./BlogClient";

// Posts can change (new publish, schedule crossing its publish_at) between
// requests — always fetch fresh rather than caching a stale build-time list.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Blog — White Peak Partners",
  description:
    "Perspectivas de nuestros socios sobre M&A tecnológico europeo, captación de capital y los sectores en los que trabajamos.",
  alternates: { canonical: "/blog" },
};

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const [allPosts, categories] = await Promise.all([getPublicPosts(), getCategories()]);
  const posts = category ? allPosts.filter((p) => p.categoryName && slugMatches(p, category, categories)) : allPosts;

  return <BlogClient posts={posts} categories={categories} activeCategory={category} />;
}

function slugMatches(
  post: { categoryId: number | null },
  categorySlug: string,
  categories: { id: number; slug: string }[]
): boolean {
  const match = categories.find((c) => c.slug === categorySlug);
  return !!match && post.categoryId === match.id;
}
