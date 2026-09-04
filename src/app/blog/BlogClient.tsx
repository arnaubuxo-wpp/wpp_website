"use client";

import SiteChrome from "@/components/SiteChrome";
import Blog from "@/components/Blog";
import type { Category, PostSummary } from "@/lib/wpp/blog-types";

export default function BlogClient({
  posts,
  categories,
  activeCategory,
}: {
  posts: PostSummary[];
  categories: Category[];
  activeCategory?: string;
}) {
  return (
    <SiteChrome page="blog">
      <Blog posts={posts} categories={categories} activeCategory={activeCategory} />
    </SiteChrome>
  );
}
