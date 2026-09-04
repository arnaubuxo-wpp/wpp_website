import Link from "next/link";
import { getAllPosts } from "@/lib/wpp/blog-server";
import { WPP_T, WPP_FONTS } from "@/lib/wpp/tokens";
import BlogList from "./BlogList";

export const dynamic = "force-dynamic";

export default async function AdminBlogPage() {
  const posts = await getAllPosts();

  return (
    <div style={{ minHeight: "100vh", background: WPP_T.panel, fontFamily: WPP_FONTS.sans }}>
      <header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "18px 28px",
          background: "#fff",
          borderBottom: `1px solid ${WPP_T.hair}`,
        }}
      >
        <div style={{ fontSize: 14, fontWeight: 600, color: WPP_T.ink }}>
          White Peak Partners — Admin
        </div>
        <Link href="/admin" style={{ fontSize: 13, color: WPP_T.ink }}>
          ← Volver
        </Link>
      </header>

      <main style={{ padding: 32, maxWidth: 860 }}>
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: 16,
            marginBottom: 20,
          }}
        >
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 600, color: WPP_T.ink, margin: "0 0 4px" }}>
              Blog
            </h1>
            <p style={{ fontSize: 14, color: WPP_T.mute, margin: 0 }}>
              Crea, edita, programa y publica artículos del blog.
            </p>
          </div>
          <Link
            href="/admin/blog/new"
            style={{
              flexShrink: 0,
              background: WPP_T.ink,
              color: "#fff",
              borderRadius: 999,
              padding: "10px 20px",
              fontSize: 14,
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            + Nuevo artículo
          </Link>
        </div>

        <BlogList posts={posts} />
      </main>
    </div>
  );
}
