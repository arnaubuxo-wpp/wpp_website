"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { PageDef } from "@/lib/wpp/override-fields";
import { WPP_T, WPP_FONTS } from "@/lib/wpp/tokens";

export default function PaginasForm({
  pageDef,
  initialValues,
}: {
  pageDef: PageDef;
  initialValues: Record<string, string>;
}) {
  const router = useRouter();
  const [values, setValues] = useState<Record<string, string>>(initialValues);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  function update(key: string, val: string) {
    setValues((prev) => ({ ...prev, [key]: val }));
    setSuccess(false);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(false);
    try {
      const res = await fetch("/api/admin/paginas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ page: pageDef.slug, values }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong.");
        setSaving(false);
        return;
      }
      setSuccess(true);
      setSaving(false);
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
      setSaving(false);
    }
  }

  if (pageDef.fields.length === 0) {
    return (
      <div
        style={{
          background: "#fff",
          border: `1px solid ${WPP_T.hair}`,
          borderRadius: 10,
          padding: 20,
          fontSize: 14,
          color: WPP_T.mute,
        }}
      >
        Todavía no hay campos editables para {pageDef.label}.
      </div>
    );
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
      {pageDef.fields.map((field) => (
        <label key={field.key} style={{ display: "block" }}>
          <span
            style={{
              display: "block",
              fontSize: 13,
              fontWeight: 600,
              color: WPP_T.ink,
              marginBottom: 4,
            }}
          >
            {field.label}
          </span>
          {field.helpText && (
            <span
              style={{
                display: "block",
                fontSize: 12,
                color: WPP_T.mute,
                marginBottom: 6,
              }}
            >
              {field.helpText}
            </span>
          )}
          {field.type === "textarea" ? (
            <textarea
              rows={3}
              value={values[field.key] ?? ""}
              placeholder={field.fallback}
              onChange={(e) => update(field.key, e.target.value)}
              style={{ ...inputStyle, resize: "vertical", fontFamily: "inherit" }}
            />
          ) : (
            <input
              type="text"
              value={values[field.key] ?? ""}
              placeholder={field.fallback}
              onChange={(e) => update(field.key, e.target.value)}
              style={inputStyle}
            />
          )}
          {!values[field.key] && (
            <span style={{ display: "block", fontSize: 12, color: WPP_T.mute, marginTop: 4 }}>
              Vacío = usar el texto original de la web.
            </span>
          )}
        </label>
      ))}

      {error && (
        <div
          style={{
            fontSize: 13,
            color: "#b42318",
            background: "#fef3f2",
            border: "1px solid #fecdca",
            borderRadius: 8,
            padding: "8px 12px",
          }}
        >
          {error}
        </div>
      )}

      {success && (
        <div
          style={{
            fontSize: 13,
            color: "#067647",
            background: "#ecfdf3",
            border: "1px solid #abefc6",
            borderRadius: 8,
            padding: "8px 12px",
          }}
        >
          Guardado. Los cambios ya están visibles en la web.
        </div>
      )}

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
        {saving ? "Guardando…" : "Guardar cambios"}
      </button>
    </form>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  boxSizing: "border-box",
  border: "1px solid #d9dde3",
  borderRadius: 8,
  padding: "10px 12px",
  fontSize: 14,
};
