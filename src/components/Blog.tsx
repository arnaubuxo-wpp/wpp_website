"use client";

import Link from "next/link";
import { WPP_T, WPP_FONTS, WPP_GUTTER } from "@/lib/wpp/tokens";
import { WPP_useIsMobile, WPP_useIsNarrow } from "@/lib/wpp/hooks";
import type { Category, PostSummary } from "@/lib/wpp/blog-types";

function formatDate(iso: string | null): string {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}

function PostCard({ post }: { post: PostSummary }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      style={{
        display: "block",
        textDecoration: "none",
        color: "inherit",
        border: `1px solid ${WPP_T.hair}`,
        borderRadius: 14,
        overflow: "hidden",
        background: "#fff",
        transition: "transform 220ms ease, box-shadow 220ms ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-3px)";
        e.currentTarget.style.boxShadow = "0 16px 32px rgba(10,10,10,0.08)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      <div
        style={{
          aspectRatio: "16 / 9",
          background: post.coverImage ? `center / cover no-repeat url(${post.coverImage})` : WPP_T.panelDeep,
        }}
      />
      <div style={{ padding: 22 }}>
        {post.categoryName && (
          <div
            style={{
              fontFamily: WPP_FONTS.mono,
              fontSize: 11,
              letterSpacing: 1.2,
              textTransform: "uppercase",
              color: WPP_T.blue,
              marginBottom: 10,
            }}
          >
            {post.categoryName}
          </div>
        )}
        <h3
          style={{
            fontFamily: WPP_FONTS.serif,
            fontSize: 20,
            fontWeight: 500,
            lineHeight: 1.3,
            margin: "0 0 10px",
            color: WPP_T.ink,
          }}
        >
          {post.title}
        </h3>
        {post.excerpt && (
          <p style={{ fontSize: 14, lineHeight: 1.6, color: WPP_T.mute, margin: "0 0 14px" }}>
            {post.excerpt}
          </p>
        )}
        <div style={{ fontSize: 12, color: WPP_T.mute, fontFamily: WPP_FONTS.mono }}>
          {formatDate(post.publishAt)}
          {post.authorName ? ` · ${post.authorName}` : ""}
        </div>
      </div>
    </Link>
  );
}

export default function Blog({
  posts,
  categories,
  activeCategory,
}: {
  posts: PostSummary[];
  categories: Category[];
  activeCategory?: string;
}) {
  const isMobile = WPP_useIsMobile();
  const isNarrow = WPP_useIsNarrow();
  const G = WPP_GUTTER;

  return (
    <div>
      <section style={{ padding: `${isMobile ? 56 : 96}px ${G} ${isMobile ? 40 : 56}px` }}>
        <div
          style={{
            fontFamily: WPP_FONTS.mono,
            fontSize: 12,
            letterSpacing: 1.4,
            textTransform: "uppercase",
            color: WPP_T.blue,
            marginBottom: 16,
          }}
        >
          Insights
        </div>
        <h1
          style={{
            fontFamily: WPP_FONTS.sans,
            fontWeight: 500,
            fontSize: "clamp(32px, 5vw, 52px)",
            lineHeight: 1.15,
            letterSpacing: -1,
            margin: "0 0 16px",
            maxWidth: 720,
            color: WPP_T.ink,
          }}
        >
          Perspectives on European technology M&amp;A and{" "}
          <span
            style={{
              fontFamily: WPP_FONTS.serif,
              fontStyle: "italic",
              fontWeight: 400,
              color: "#92a1d3",
            }}
          >
            capital raising
          </span>
          <span style={{ color: "#92a1d3" }}>.</span>
        </h1>
        <p style={{ fontSize: 16, lineHeight: 1.6, color: WPP_T.mute, maxWidth: 560, margin: 0 }}>
          Notes from our partners on deal-making, fundraising and the technology sectors we work in.
        </p>

        {categories.length > 0 && (
          <nav style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 32 }}>
            <Link
              href="/blog"
              style={{
                fontSize: 13,
                fontWeight: 600,
                padding: "8px 16px",
                borderRadius: 999,
                textDecoration: "none",
                border: `1px solid ${!activeCategory ? WPP_T.ink : WPP_T.hair}`,
                background: !activeCategory ? WPP_T.ink : "#fff",
                color: !activeCategory ? "#fff" : WPP_T.ink,
              }}
            >
              All
            </Link>
            {categories.map((c) => {
              const active = activeCategory === c.slug;
              return (
                <Link
                  key={c.id}
                  href={`/blog?category=${c.slug}`}
                  style={{
                    fontSize: 13,
                    fontWeight: 600,
                    padding: "8px 16px",
                    borderRadius: 999,
                    textDecoration: "none",
                    border: `1px solid ${active ? WPP_T.ink : WPP_T.hair}`,
                    background: active ? WPP_T.ink : "#fff",
                    color: active ? "#fff" : WPP_T.ink,
                  }}
                >
                  {c.name}
                </Link>
              );
            })}
          </nav>
        )}
      </section>

      <section style={{ padding: `0 ${G} 96px` }}>
        {posts.length === 0 ? (
          <div
            style={{
              border: `1px solid ${WPP_T.hair}`,
              borderRadius: 14,
              padding: 48,
              textAlign: "center",
              color: WPP_T.mute,
              fontSize: 15,
            }}
          >
            New articles coming soon — check back shortly.
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: isMobile ? "1fr" : isNarrow ? "repeat(2, 1fr)" : "repeat(3, 1fr)",
              gap: 28,
            }}
          >
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
