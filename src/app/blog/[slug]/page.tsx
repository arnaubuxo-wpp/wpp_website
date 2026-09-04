import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPublicPostBySlug } from "@/lib/wpp/blog-server";
import BlogArticleClient from "./BlogArticleClient";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPublicPostBySlug(slug);
  if (!post) return { title: "White Peak Partners" };

  const description = post.excerpt || "White Peak Partners — Blog.";
  return {
    title: `${post.title} — White Peak Partners`,
    description,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      title: post.title,
      description,
      url: `https://www.whitepeakpartners.com/blog/${post.slug}`,
      images: post.coverImage ? [{ url: post.coverImage }] : undefined,
    },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPublicPostBySlug(slug);
  if (!post) notFound();

  return <BlogArticleClient post={post} />;
}
