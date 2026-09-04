"use client";

import Link from "next/link";
import { WPP_T, WPP_FONTS, WPP_GUTTER } from "@/lib/wpp/tokens";
import { WPP_useIsMobile } from "@/lib/wpp/hooks";
import type { Post } from "@/lib/wpp/blog-types";

function formatDate(iso: string | null): string {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}

export default function BlogArticle({ post }: { post: Post }) {
  const isMobile = WPP_useIsMobile();
  const G = WPP_GUTTER;

  return (
    <article>
      <section style={{ padding: `${isMobile ? 48 : 80}px ${G} ${isMobile ? 28 : 40}px` }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <Link
            href="/blog"
            style={{
              display: "inline-block",
              fontFamily: WPP_FONTS.mono,
              fontSize: 12,
              letterSpacing: 1.2,
              textTransform: "uppercase",
              color: WPP_T.blue,
              textDecoration: "none",
              marginBottom: 20,
            }}
          >
            ← Blog
          </Link>
          {post.categoryName && (
            <div
              style={{
                fontFamily: WPP_FONTS.mono,
                fontSize: 11,
                letterSpacing: 1.2,
                textTransform: "uppercase",
                color: WPP_T.mute,
                marginBottom: 14,
              }}
            >
              {post.categoryName}
            </div>
          )}
          <h1
            style={{
              fontFamily: WPP_FONTS.serif,
              fontWeight: 500,
              fontSize: "clamp(28px, 4.5vw, 44px)",
              lineHeight: 1.2,
              margin: "0 0 18px",
              color: WPP_T.ink,
            }}
          >
            {post.title}
          </h1>
          <div style={{ fontSize: 13, color: WPP_T.mute, fontFamily: WPP_FONTS.mono }}>
            {formatDate(post.publishAt)}
            {post.authorName ? ` · ${post.authorName}` : ""}
          </div>
        </div>
      </section>

      {post.coverImage && (
        <section style={{ padding: `0 ${G}`, marginBottom: isMobile ? 32 : 48 }}>
          <div style={{ maxWidth: 900, margin: "0 auto" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={post.coverImage}
              alt=""
              style={{ width: "100%", borderRadius: 16, display: "block", objectFit: "cover", maxHeight: 480 }}
            />
          </div>
        </section>
      )}

      <section style={{ padding: `0 ${G} ${isMobile ? 64 : 100}px` }}>
        <div
          className="blog-content"
          style={{ maxWidth: 720, margin: "0 auto" }}
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </section>
    </article>
  );
}
