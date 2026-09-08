"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { PageDef } from "@/lib/wpp/override-fields";
import type { HistoryEntry } from "@/lib/wpp/history-types";
import { WPP_T, WPP_FONTS } from "@/lib/wpp/tokens";

export default function PaginasForm({
  pageDef,
  initialValues,
  onFieldActivate,
}: {
  pageDef: PageDef;
  initialValues: Record<string, string>;
  /** Called with a field's key on focus/hover, and with null when it's no longer active. */
  onFieldActivate?: (key: string | null) => void;
}) {
  const router = useRouter();
  const [values, setValues] = useState<Record<string, string>>(initialValues);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [uploadingKey, setUploadingKey] = useState<string | null>(null);
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  // Previous wording per field, loaded on demand the first time someone opens a
  // field's history. Page edits go live immediately with no staging step, so this
  // is the way back from an overwrite of copy that had already been signed off.
  const [history, setHistory] = useState<HistoryEntry[] | null>(null);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [openHistoryKey, setOpenHistoryKey] = useState<string | null>(null);

  async function toggleHistory(key: string) {
    if (openHistoryKey === key) {
      setOpenHistoryKey(null);
      return;
    }
    setOpenHistoryKey(key);
    if (history !== null || historyLoading) return;
    setHistoryLoading(true);
    try {
      const res = await fetch(
        `/api/admin/paginas/history?page=${encodeURIComponent(pageDef.slug)}`
      );
      const data = await res.json();
      setHistory(Array.isArray(data.history) ? data.history : []);
    } catch {
      setHistory([]);
    } finally {
      setHistoryLoading(false);
    }
  }

  function update(key: string, val: string) {
    setValues((prev) => ({ ...prev, [key]: val }));
    setSuccess(false);
  }

  async function handleFileSelected(key: string, file: File) {
    setUploadingKey(key);
    setError(null);
    try {
      const body = new FormData();
      body.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Upload failed.");
        return;
      }
      update(key, data.url);
    } catch {
      setError("Upload failed. Please try again.");
    } finally {
      setUploadingKey(null);
    }
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
        There are no editable fields for {pageDef.label} yet.
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
        <label
          key={field.key}
          style={{ display: "block" }}
        >
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
              onFocus={() => onFieldActivate?.(field.key)}
              onBlur={() => onFieldActivate?.(null)}
              style={{ ...inputStyle, resize: "vertical", fontFamily: "inherit" }}
            />
          ) : field.type === "image" ? (
            <div>
              {values[field.key] && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={values[field.key]}
                  alt=""
                  style={{
                    display: "block",
                    maxWidth: "100%",
                    maxHeight: 160,
                    borderRadius: 8,
                    border: `1px solid ${WPP_T.hair}`,
                    marginBottom: 8,
                    objectFit: "cover",
                  }}
                />
              )}
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <input
                  type="text"
                  value={values[field.key] ?? ""}
                  placeholder={field.fallback}
                  onChange={(e) => update(field.key, e.target.value)}
                  onFocus={() => onFieldActivate?.(field.key)}
                  onBlur={() => onFieldActivate?.(null)}
                  style={{ ...inputStyle, flex: 1 }}
                />
                <button
                  type="button"
                  onClick={() => fileInputRefs.current[field.key]?.click()}
                  disabled={uploadingKey === field.key}
                  style={{
                    flexShrink: 0,
                    border: `1px solid ${WPP_T.hair}`,
                    background: "#fff",
                    borderRadius: 8,
                    padding: "10px 14px",
                    fontSize: 13,
                    fontWeight: 600,
                    color: WPP_T.ink,
                    cursor: uploadingKey === field.key ? "default" : "pointer",
                    fontFamily: WPP_FONTS.sans,
                  }}
                >
                  {uploadingKey === field.key ? "Uploading…" : "Upload image"}
                </button>
              </div>
              <input
                ref={(el) => {
                  fileInputRefs.current[field.key] = el;
                }}
                type="file"
                accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileSelected(field.key, file);
                  e.target.value = "";
                }}
                style={{ display: "none" }}
              />
            </div>
          ) : (
            <input
              type="text"
              value={values[field.key] ?? ""}
              placeholder={field.fallback}
              onChange={(e) => update(field.key, e.target.value)}
              onFocus={() => onFieldActivate?.(field.key)}
              onBlur={() => onFieldActivate?.(null)}
              style={inputStyle}
            />
          )}
          {!values[field.key] && (
            <span style={{ display: "block", fontSize: 12, color: WPP_T.mute, marginTop: 4 }}>
              Empty = use the site&rsquo;s original text.
            </span>
          )}

          <button
            type="button"
            onClick={() => toggleHistory(field.key)}
            style={{
              background: "none",
              border: "none",
              padding: 0,
              marginTop: 6,
              fontSize: 12,
              color: WPP_T.mute,
              cursor: "pointer",
              fontFamily: WPP_FONTS.sans,
              textDecoration: "underline",
            }}
          >
            {openHistoryKey === field.key ? "Hide previous versions" : "Previous versions"}
          </button>

          {openHistoryKey === field.key && (
            <div
              style={{
                marginTop: 8,
                border: `1px solid ${WPP_T.hair}`,
                borderRadius: 8,
                background: WPP_T.panel,
                padding: 12,
              }}
            >
              {historyLoading ? (
                <div style={{ fontSize: 12.5, color: WPP_T.mute }}>Loading…</div>
              ) : (
                (() => {
                  const entries = (history ?? []).filter((h) => h.key === field.key);
                  if (entries.length === 0) {
                    return (
                      <div style={{ fontSize: 12.5, color: WPP_T.mute }}>
                        No earlier versions — this field hasn&rsquo;t been changed yet.
                      </div>
                    );
                  }
                  return (
                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                      {entries.slice(0, 8).map((h) => (
                        <div key={h.id} style={{ fontSize: 12.5 }}>
                          <div style={{ color: WPP_T.mute, marginBottom: 3 }}>
                            {new Date(h.changedAt).toLocaleString("en-GB")}
                            {h.changedBy ? ` · ${h.changedBy}` : ""}
                          </div>
                          <div
                            style={{
                              background: "#fff",
                              border: `1px solid ${WPP_T.hair}`,
                              borderRadius: 6,
                              padding: "7px 9px",
                              color: WPP_T.ink,
                              whiteSpace: "pre-wrap",
                              wordBreak: "break-word",
                            }}
                          >
                            {h.previousValue === null || h.previousValue === "" ? (
                              <em style={{ color: WPP_T.mute }}>
                                (empty — was showing the original text)
                              </em>
                            ) : (
                              h.previousValue
                            )}
                          </div>
                          <button
                            type="button"
                            onClick={() => update(field.key, h.previousValue ?? "")}
                            style={{
                              marginTop: 5,
                              border: `1px solid ${WPP_T.hair}`,
                              background: "#fff",
                              borderRadius: 6,
                              padding: "4px 10px",
                              fontSize: 12,
                              fontWeight: 600,
                              color: WPP_T.ink,
                              cursor: "pointer",
                              fontFamily: WPP_FONTS.sans,
                            }}
                          >
                            Put this back
                          </button>
                        </div>
                      ))}
                      <div style={{ fontSize: 11.5, color: WPP_T.mute }}>
                        Putting a version back only fills the box — press{" "}
                        <strong>Save changes</strong> to publish it.
                      </div>
                    </div>
                  );
                })()
              )}
            </div>
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
          Saved. The changes are now live on the site.
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
        {saving ? "Saving…" : "Save changes"}
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
