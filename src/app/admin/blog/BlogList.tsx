"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { WPP_T, WPP_FONTS } from "@/lib/wpp/tokens";
import type { PostSummary } from "@/lib/wpp/blog-types";

const STATUS_LABEL: Record<string, string> = {
  draft: "Borrador",
  scheduled: "Programado",
  published: "Publicado",
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
    if (!window.confirm(`¿Eliminar el artículo "${title}"? Esta acción no se puede deshacer.`)) return;
    setDeletingId(id);
    setError(null);
    try {
      const res = await fetch(`/api/admin/blog/posts/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "No se ha podido eliminar el artículo.");
        return;
      }
      router.refresh();
    } catch {
      setError("No se ha podido eliminar el artículo.");
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
        Todavía no hay artículos. Crea el primero con &ldquo;Nuevo artículo&rdquo;.
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
                    ? `Programado para ${new Date(post.publishAt).toLocaleString("es-ES")}`
                    : post.status === "published" && post.publishAt
                    ? `Publicado el ${new Date(post.publishAt).toLocaleDateString("es-ES")}`
                    : `Actualizado ${new Date(post.updatedAt).toLocaleDateString("es-ES")}`}
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
                  Editar
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
                  {deletingId === post.id ? "Eliminando…" : "Eliminar"}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
