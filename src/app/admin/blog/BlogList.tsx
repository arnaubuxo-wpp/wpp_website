"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { WPP_T, WPP_FONTS } from "@/lib/wpp/tokens";
import type { PostSummary } from "@/lib/wpp/blog-types";

const STATUS_LABEL: Record<string, string> = {
  draft: "Draft",
  scheduled: "Scheduled",
  published: "Published",
};

const STATUS_COLOR: Record<string, { bg: string; fg: string }> = {
  draft: { bg: "#f2f4f7", fg: "#475467" },
  scheduled: { bg: "#fff6ed", fg: "#b93815" },
  published: { bg: "#ecfdf3", fg: "#067647" },
};

export default function BlogList({ posts }: { posts: PostSummary[] }) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleDelete(id: number, title: string) {
    if (!window.confirm(`Delete the article "${title}"? This action cannot be undone.`)) return;
    setDeletingId(id);
    setError(null);
    try {
      const res = await fetch(`/api/admin/blog/posts/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Couldn't delete the article.");
        return;
      }
      router.refresh();
    } catch {
      setError("Couldn't delete the article.");
    } finally {
      setDeletingId(null);
    }
  }

  if (posts.length === 0) {
    return (
      <div
        style={{
          background: "#fff",
          border: `1px solid ${WPP_T.hair}`,
          borderRadius: 10,
          padding: 32,
          textAlign: "center",
          color: WPP_T.mute,
          fontSize: 14,
        }}
      >
        There are no articles yet. Create your first one with &ldquo;New article&rdquo;.
      </div>
    );
  }

  return (
    <div>
      {error && (
        <div
          style={{
            fontSize: 13,
            color: "#b42318",
            background: "#fef3f2",
            border: "1px solid #fecdca",
            borderRadius: 8,
            padding: "8px 12px",
            marginBottom: 16,
          }}
        >
          {error}
        </div>
      )}
      <div
        style={{
          background: "#fff",
          border: `1px solid ${WPP_T.hair}`,
          borderRadius: 10,
          overflow: "hidden",
        }}
      >
        {posts.map((post, i) => {
          const status = STATUS_COLOR[post.status] ?? STATUS_COLOR.draft;
          return (
            <div
              key={post.id}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 16,
                padding: "16px 20px",
                borderTop: i === 0 ? "none" : `1px solid ${WPP_T.hair}`,
              }}
            >
              <div style={{ minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontSize: 14, fontWeight: 600, color: WPP_T.ink }}>{post.title}</span>
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 600,
                      padding: "3px 9px",
                      borderRadius: 999,
                      background: status.bg,
                      color: status.fg,
                      textTransform: "uppercase",
                      letterSpacing: 0.4,
                    }}
                  >
                    {STATUS_LABEL[post.status] ?? post.status}
                  </span>
                </div>
                <div style={{ fontSize: 12, color: WPP_T.mute, marginTop: 4 }}>
                  {post.categoryName ? `${post.categoryName} · ` : ""}
                  {post.authorName ? `${post.authorName} · ` : ""}
                  {post.status === "scheduled" && post.publishAt
                    ? `Scheduled for ${new Date(post.publishAt).toLocaleString("en-GB")}`
                    : post.status === "published" && post.publishAt
                    ? `Published on ${new Date(post.publishAt).toLocaleDateString("en-GB")}`
                    : `Updated ${new Date(post.updatedAt).toLocaleDateString("en-GB")}`}
                </div>
              </div>
              <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                <Link
                  href={`/admin/blog/${post.id}`}
                  style={{
                    fontSize: 13,
                    fontWeight: 600,
                    color: WPP_T.ink,
                    border: `1px solid ${WPP_T.hair}`,
                    borderRadius: 8,
                    padding: "6px 14px",
                    textDecoration: "none",
                    fontFamily: WPP_FONTS.sans,
                  }}
                >
                  Edit
                </Link>
                <button
                  type="button"
                  onClick={() => handleDelete(post.id, post.title)}
                  disabled={deletingId === post.id}
                  style={{
                    fontSize: 13,
                    fontWeight: 600,
                    color: "#b42318",
                    border: "1px solid #fecdca",
                    background: "#fff",
                    borderRadius: 8,
                    padding: "6px 14px",
                    cursor: deletingId === post.id ? "default" : "pointer",
                    fontFamily: WPP_FONTS.sans,
                  }}
                >
                  {deletingId === post.id ? "Deleting…" : "Delete"}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
