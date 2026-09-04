"use client";

import SiteChrome from "@/components/SiteChrome";
import BlogArticle from "@/components/BlogArticle";
import type { Post } from "@/lib/wpp/blog-types";

export default function BlogArticleClient({ post }: { post: Post }) {
  return (
    <SiteChrome page="blog">
      <BlogArticle post={post} />
    </SiteChrome>
  );
}
