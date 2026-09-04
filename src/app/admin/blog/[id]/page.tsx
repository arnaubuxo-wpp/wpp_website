import Link from "next/link";
import { notFound } from "next/navigation";
import { getCategories, getPostById } from "@/lib/wpp/blog-server";
import { WPP_T, WPP_FONTS } from "@/lib/wpp/tokens";
import PostEditor from "../PostEditor";

export const dynamic = "force-dynamic";

export default async function EditBlogPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: rawId } = await params;
  const id = Number(rawId);
  if (!Number.isInteger(id) || id <= 0) notFound();

  const [post, categories] = await Promise.all([getPostById(id), getCategories()]);
  if (!post) notFound();

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
        <Link href="/admin/blog" style={{ fontSize: 13, color: WPP_T.ink }}>
          ← Volver al blog
        </Link>
      </header>

      <main style={{ padding: 32, maxWidth: 780 }}>
        <h1 style={{ fontSize: 22, fontWeight: 600, color: WPP_T.ink, margin: "0 0 4px" }}>
          Editar artículo
        </h1>
        <p style={{ fontSize: 14, color: WPP_T.mute, margin: "0 0 20px" }}>
          {post.title}
        </p>

        <PostEditor post={post} categories={categories} />
      </main>
    </div>
  );
}
