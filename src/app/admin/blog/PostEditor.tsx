"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { WPP_T, WPP_FONTS } from "@/lib/wpp/tokens";
import { slugify } from "@/lib/wpp/blog-types";
import type { Category, Post, PostStatus } from "@/lib/wpp/blog-types";
import RichTextEditor from "@/components/admin/RichTextEditor";

async function uploadImage(file: File): Promise<string> {
  const body = new FormData();
  body.append("file", file);
  const res = await fetch("/api/admin/upload", { method: "POST", body });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Upload failed.");
  return data.url as string;
}

function toLocalInputValue(iso: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export default function PostEditor({
  post,
  categories,
}: {
  post?: Post;
  categories: Category[];
}) {
  const router = useRouter();
  const isNew = !post;

  const [title, setTitle] = useState(post?.title ?? "");
  const [slug, setSlug] = useState(post?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(!isNew);
  const [excerpt, setExcerpt] = useState(post?.excerpt ?? "");
  const [content, setContent] = useState(post?.content ?? "");
  const [coverImage, setCoverImage] = useState<string>(post?.coverImage ?? "");
  const [categoryId, setCategoryId] = useState<number | "">(post?.categoryId ?? "");
  const [status, setStatus] = useState<PostStatus>(post?.status ?? "draft");
  const [publishAt, setPublishAt] = useState(toLocalInputValue(post?.publishAt ?? null));

  const [uploadingCover, setUploadingCover] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const coverInputRef = useRef<HTMLInputElement | null>(null);

  function handleTitleChange(val: string) {
    setTitle(val);
    if (!slugTouched) setSlug(slugify(val));
  }

  async function handleCoverSelected(file: File) {
    setUploadingCover(true);
    setError(null);
    try {
      const url = await uploadImage(file);
      setCoverImage(url);
    } catch {
      setError("No se ha podido subir la imagen de portada.");
    } finally {
      setUploadingCover(false);
    }
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(false);

    if (status === "scheduled" && !publishAt) {
      setError("Elige una fecha para programar la publicación.");
      setSaving(false);
      return;
    }

    const payload = {
      title,
      slug,
      excerpt,
      content,
      coverImage: coverImage || null,
      categoryId: categoryId === "" ? null : categoryId,
      status,
      publishAt: status === "scheduled" && publishAt ? new Date(publishAt).toISOString() : null,
    };

    try {
      const url = isNew ? "/api/admin/blog/posts" : `/api/admin/blog/posts/${post!.id}`;
      const method = isNew ? "POST" : "PUT";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Algo ha salido mal.");
        setSaving(false);
        return;
      }
      setSuccess(true);
      setSaving(false);
      if (isNew) {
        router.push(`/admin/blog/${data.id}`);
      } else {
        router.refresh();
      }
    } catch {
      setError("Algo ha salido mal. Inténtalo de nuevo.");
      setSaving(false);
    }
  }

  return (
    <form
      onSubmit={handleSave}
      style={{
        background: "#fff",
        border: `1px solid ${WPP_T.hair}`,
        borderRadius: 10,
        padding: 24,
        display: "flex",
        flexDirection: "column",
        gap: 20,
      }}
    >
      <Field label="Título">
        <input
          type="text"
          value={title}
          onChange={(e) => handleTitleChange(e.target.value)}
          placeholder="Título del artículo"
          style={inputStyle}
        />
      </Field>

      <Field label="Slug (URL)" help={`Se publicará en /blog/${slug || "..."}`}>
        <input
          type="text"
          value={slug}
          onChange={(e) => {
            setSlugTouched(true);
            setSlug(slugify(e.target.value));
          }}
          placeholder="titulo-del-articulo"
          style={inputStyle}
        />
      </Field>

      <Field label="Extracto" help="Resumen breve que aparece en el listado del blog.">
        <textarea
          rows={2}
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
          style={{ ...inputStyle, resize: "vertical", fontFamily: "inherit" }}
        />
      </Field>

      <Field label="Imagen de portada">
        <div>
          {coverImage && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={coverImage}
              alt=""
              style={{
                display: "block",
                maxWidth: "100%",
                maxHeight: 180,
                borderRadius: 8,
                border: `1px solid ${WPP_T.hair}`,
                marginBottom: 8,
                objectFit: "cover",
              }}
            />
          )}
          <div style={{ display: "flex", gap: 8 }}>
            <input
              type="text"
              value={coverImage}
              onChange={(e) => setCoverImage(e.target.value)}
              placeholder="https://…"
              style={{ ...inputStyle, flex: 1 }}
            />
            <button
              type="button"
              onClick={() => coverInputRef.current?.click()}
              disabled={uploadingCover}
              style={secondaryButtonStyle}
            >
              {uploadingCover ? "Subiendo…" : "Subir imagen"}
            </button>
          </div>
          <input
            ref={coverInputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleCoverSelected(file);
              e.target.value = "";
            }}
            style={{ display: "none" }}
          />
        </div>
      </Field>

      <Field label="Categoría">
        <select
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value ? Number(e.target.value) : "")}
          style={inputStyle}
        >
          <option value="">Sin categoría</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Contenido">
        <RichTextEditor value={content} onChange={setContent} onUploadImage={uploadImage} />
      </Field>

      <Field label="Estado">
        <div style={{ display: "flex", gap: 8, marginBottom: status === "scheduled" ? 10 : 0 }}>
          {(["draft", "published", "scheduled"] as PostStatus[]).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setStatus(s)}
              style={{
                border: `1px solid ${status === s ? WPP_T.ink : WPP_T.hair}`,
                background: status === s ? WPP_T.ink : "#fff",
                color: status === s ? "#fff" : WPP_T.ink,
                borderRadius: 999,
                padding: "8px 16px",
                fontSize: 13,
                fontWeight: 600,
                cursor: "pointer",
                fontFamily: WPP_FONTS.sans,
              }}
            >
              {s === "draft" ? "Borrador" : s === "published" ? "Publicar ahora" : "Programar"}
            </button>
          ))}
        </div>
        {status === "scheduled" && (
          <input
            type="datetime-local"
            value={publishAt}
            onChange={(e) => setPublishAt(e.target.value)}
            style={{ ...inputStyle, maxWidth: 260 }}
          />
        )}
      </Field>

      {error && <Banner kind="error">{error}</Banner>}
      {success && <Banner kind="success">Guardado correctamente.</Banner>}

      <button
        type="submit"
        disabled={saving}
        style={{
          alignSelf: "flex-start",
          background: WPP_T.ink,
          color: "#fff",
          border: "none",
          borderRadius: 999,
          padding: "10px 20px",
          fontSize: 14,
          fontWeight: 600,
          cursor: saving ? "default" : "pointer",
          opacity: saving ? 0.7 : 1,
          fontFamily: WPP_FONTS.sans,
        }}
      >
        {saving ? "Guardando…" : isNew ? "Crear artículo" : "Guardar cambios"}
      </button>
    </form>
  );
}

function Field({ label, help, children }: { label: string; help?: string; children: React.ReactNode }) {
  return (
    <label style={{ display: "block" }}>
      <span style={{ display: "block", fontSize: 13, fontWeight: 600, color: WPP_T.ink, marginBottom: 4 }}>
        {label}
      </span>
      {help && (
        <span style={{ display: "block", fontSize: 12, color: WPP_T.mute, marginBottom: 6 }}>{help}</span>
      )}
      {children}
    </label>
  );
}

function Banner({ kind, children }: { kind: "error" | "success"; children: React.ReactNode }) {
  const styles =
    kind === "error"
      ? { color: "#b42318", background: "#fef3f2", border: "1px solid #fecdca" }
      : { color: "#067647", background: "#ecfdf3", border: "1px solid #abefc6" };
  return (
    <div style={{ fontSize: 13, borderRadius: 8, padding: "8px 12px", ...styles }}>{children}</div>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  boxSizing: "border-box",
  border: "1px solid #d9dde3",
  borderRadius: 8,
  padding: "10px 12px",
  fontSize: 14,
  fontFamily: WPP_FONTS.sans,
};

const secondaryButtonStyle: React.CSSProperties = {
  flexShrink: 0,
  border: "1px solid #d9dde3",
  background: "#fff",
  borderRadius: 8,
  padding: "10px 14px",
  fontSize: 13,
  fontWeight: 600,
  color: WPP_T.ink,
  cursor: "pointer",
  fontFamily: WPP_FONTS.sans,
};
