"use client";

import { useState } from "react";
import { WPP_T, WPP_FONTS } from "@/lib/wpp/tokens";
import { makePressLink, type PressLink } from "@/lib/wpp/press-types";

const inputStyle: React.CSSProperties = {
  width: "100%",
  boxSizing: "border-box",
  border: "1px solid #d9dde3",
  borderRadius: 8,
  padding: "10px 12px",
  fontSize: 14,
  fontFamily: WPP_FONTS.sans,
};

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: 13,
  fontWeight: 600,
  color: WPP_T.ink,
  marginBottom: 4,
};

const buttonStyle: React.CSSProperties = {
  fontSize: 13,
  fontWeight: 600,
  color: WPP_T.ink,
  border: `1px solid ${WPP_T.hair}`,
  background: "#fff",
  borderRadius: 8,
  padding: "6px 12px",
  cursor: "pointer",
  fontFamily: WPP_FONTS.sans,
};

type Draft = Omit<PressLink, "id">;

const EMPTY: Draft = { source: "", title: "", blurb: "", url: "", date: "", company: "" };

export default function PressManager({
  initialLinks,
  builtInLinks,
}: {
  initialLinks: PressLink[];
  builtInLinks: PressLink[];
}) {
  const [links, setLinks] = useState<PressLink[]>(initialLinks);
  const [draft, setDraft] = useState<Draft>(EMPTY);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editDraft, setEditDraft] = useState<Draft | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function persist(next: PressLink[]) {
    setSaving(true);
    setError(null);
    setSuccess(false);
    try {
      const res = await fetch("/api/admin/press", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ links: next }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong.");
        return false;
      }
      setLinks(data.links ?? next);
      setSuccess(true);
      return true;
    } catch {
      setError("Something went wrong. Please try again.");
      return false;
    } finally {
      setSaving(false);
    }
  }

  function validate(d: Draft): string | null {
    if (!d.title.trim()) return "The headline is required.";
    if (!d.url.trim()) return "The link is required.";
    try {
      const u = new URL(d.url.trim());
      if (u.protocol !== "http:" && u.protocol !== "https:") return "The link must start with http:// or https://";
    } catch {
      return "That doesn't look like a valid web address.";
    }
    return null;
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    const problem = validate(draft);
    if (problem) {
      setError(problem);
      return;
    }
    const ok = await persist([makePressLink(draft), ...links]);
    if (ok) setDraft(EMPTY);
  }

  async function handleDelete(id: string, title: string) {
    if (!window.confirm(`Remove "${title}" from the list?`)) return;
    await persist(links.filter((l) => l.id !== id));
  }

  async function handleMove(index: number, dir: -1 | 1) {
    const target = index + dir;
    if (target < 0 || target >= links.length) return;
    const next = [...links];
    [next[index], next[target]] = [next[target], next[index]];
    await persist(next);
  }

  async function saveEdit(id: string) {
    if (!editDraft) return;
    const problem = validate(editDraft);
    if (problem) {
      setError(problem);
      return;
    }
    const ok = await persist(links.map((l) => (l.id === id ? { ...l, ...editDraft } : l)));
    if (ok) {
      setEditingId(null);
      setEditDraft(null);
    }
  }

  /** Copies the built-in selection into the editor as a starting point. */
  async function seedFromBuiltIn() {
    if (
      !window.confirm(
        "Copy the site's original selection into this list so you can edit it? Nothing on the site changes until you save."
      )
    )
      return;
    await persist(builtInLinks.map((l) => makePressLink(l)));
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <form
        onSubmit={handleAdd}
        style={{
          background: "#fff",
          border: `1px solid ${WPP_T.hair}`,
          borderRadius: 10,
          padding: 24,
          display: "flex",
          flexDirection: "column",
          gap: 16,
        }}
      >
        <h2 style={{ fontSize: 15, fontWeight: 600, color: WPP_T.ink, margin: 0 }}>Add a link</h2>

        <label>
          <span style={labelStyle}>Headline</span>
          <input
            type="text"
            value={draft.title}
            onChange={(e) => setDraft({ ...draft, title: e.target.value })}
            placeholder="e.g. Open Cosmos raises $50M"
            style={inputStyle}
          />
        </label>

        <label>
          <span style={labelStyle}>Link</span>
          <input
            type="url"
            value={draft.url}
            onChange={(e) => setDraft({ ...draft, url: e.target.value })}
            placeholder="https://…"
            style={inputStyle}
          />
        </label>

        <label>
          <span style={labelStyle}>Summary</span>
          <textarea
            rows={2}
            value={draft.blurb}
            onChange={(e) => setDraft({ ...draft, blurb: e.target.value })}
            placeholder="One line explaining why it's worth reading."
            style={{ ...inputStyle, resize: "vertical", fontFamily: "inherit" }}
          />
        </label>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
          <label>
            <span style={labelStyle}>Publication</span>
            <input
              type="text"
              value={draft.source}
              onChange={(e) => setDraft({ ...draft, source: e.target.value })}
              placeholder="e.g. TechCrunch"
              style={inputStyle}
            />
          </label>
          <label>
            <span style={labelStyle}>Company</span>
            <input
              type="text"
              value={draft.company}
              onChange={(e) => setDraft({ ...draft, company: e.target.value })}
              placeholder="e.g. Open Cosmos"
              style={inputStyle}
            />
          </label>
          <label>
            <span style={labelStyle}>Date</span>
            <input
              type="date"
              value={draft.date}
              onChange={(e) => setDraft({ ...draft, date: e.target.value })}
              style={inputStyle}
            />
          </label>
        </div>

        {error && <Banner kind="error">{error}</Banner>}
        {success && <Banner kind="success">Saved. The homepage is updated.</Banner>}

        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
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
            {saving ? "Saving…" : "Add link"}
          </button>
          {links.length === 0 && builtInLinks.length > 0 && (
            <button type="button" onClick={seedFromBuiltIn} disabled={saving} style={buttonStyle}>
              Start from the current selection
            </button>
          )}
        </div>
      </form>

      <div>
        <h2 style={{ fontSize: 15, fontWeight: 600, color: WPP_T.ink, margin: "0 0 12px" }}>
          Your list ({links.length})
        </h2>

        {links.length === 0 ? (
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
            Nothing curated yet, so the homepage is showing the site&rsquo;s original selection
            of {builtInLinks.length} articles, newest first.
          </div>
        ) : (
          <div
            style={{
              background: "#fff",
              border: `1px solid ${WPP_T.hair}`,
              borderRadius: 10,
              overflow: "hidden",
            }}
          >
            {links.map((link, i) => (
              <div key={link.id} style={{ borderTop: i === 0 ? "none" : `1px solid ${WPP_T.hair}` }}>
                <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "14px 20px" }}>
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      color: i < 3 ? "#fff" : WPP_T.mute,
                      background: i < 3 ? WPP_T.blue : WPP_T.panel,
                      borderRadius: 999,
                      padding: "3px 9px",
                      flexShrink: 0,
                    }}
                    title={i < 3 ? "Shown on the homepage" : "Not currently shown — only the top three appear"}
                  >
                    {i + 1}
                  </span>
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: WPP_T.ink }}>{link.title}</div>
                    <div style={{ fontSize: 12, color: WPP_T.mute, marginTop: 2 }}>
                      {[link.source, link.company, link.date].filter(Boolean).join(" · ") || "No details"}
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                    <button
                      type="button"
                      onClick={() => handleMove(i, -1)}
                      disabled={i === 0 || saving}
                      style={{ ...buttonStyle, opacity: i === 0 ? 0.4 : 1 }}
                      aria-label="Move up"
                    >
                      ↑
                    </button>
                    <button
                      type="button"
                      onClick={() => handleMove(i, 1)}
                      disabled={i === links.length - 1 || saving}
                      style={{ ...buttonStyle, opacity: i === links.length - 1 ? 0.4 : 1 }}
                      aria-label="Move down"
                    >
                      ↓
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (editingId === link.id) {
                          setEditingId(null);
                          setEditDraft(null);
                        } else {
                          setEditingId(link.id);
                          setEditDraft({
                            source: link.source,
                            title: link.title,
                            blurb: link.blurb,
                            url: link.url,
                            date: link.date,
                            company: link.company,
                          });
                          setError(null);
                        }
                      }}
                      disabled={saving}
                      style={buttonStyle}
                    >
                      {editingId === link.id ? "Cancel" : "Edit"}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(link.id, link.title)}
                      disabled={saving}
                      style={{ ...buttonStyle, color: "#b42318", borderColor: "#fecdca" }}
                    >
                      Remove
                    </button>
                  </div>
                </div>

                {editingId === link.id && editDraft && (
                  <div
                    style={{
                      padding: "4px 20px 20px",
                      background: WPP_T.panel,
                      display: "flex",
                      flexDirection: "column",
                      gap: 14,
                    }}
                  >
                    <label>
                      <span style={labelStyle}>Headline</span>
                      <input
                        type="text"
                        value={editDraft.title}
                        onChange={(e) => setEditDraft({ ...editDraft, title: e.target.value })}
                        style={inputStyle}
                      />
                    </label>
                    <label>
                      <span style={labelStyle}>Link</span>
                      <input
                        type="url"
                        value={editDraft.url}
                        onChange={(e) => setEditDraft({ ...editDraft, url: e.target.value })}
                        style={inputStyle}
                      />
                    </label>
                    <label>
                      <span style={labelStyle}>Summary</span>
                      <textarea
                        rows={2}
                        value={editDraft.blurb}
                        onChange={(e) => setEditDraft({ ...editDraft, blurb: e.target.value })}
                        style={{ ...inputStyle, resize: "vertical", fontFamily: "inherit" }}
                      />
                    </label>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14 }}>
                      <label>
                        <span style={labelStyle}>Publication</span>
                        <input
                          type="text"
                          value={editDraft.source}
                          onChange={(e) => setEditDraft({ ...editDraft, source: e.target.value })}
                          style={inputStyle}
                        />
                      </label>
                      <label>
                        <span style={labelStyle}>Company</span>
                        <input
                          type="text"
                          value={editDraft.company}
                          onChange={(e) => setEditDraft({ ...editDraft, company: e.target.value })}
                          style={inputStyle}
                        />
                      </label>
                      <label>
                        <span style={labelStyle}>Date</span>
                        <input
                          type="date"
                          value={editDraft.date}
                          onChange={(e) => setEditDraft({ ...editDraft, date: e.target.value })}
                          style={inputStyle}
                        />
                      </label>
                    </div>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button
                        type="button"
                        onClick={() => saveEdit(link.id)}
                        disabled={saving}
                        style={{
                          ...buttonStyle,
                          background: WPP_T.ink,
                          color: "#fff",
                          borderColor: WPP_T.ink,
                          padding: "8px 18px",
                        }}
                      >
                        {saving ? "Saving…" : "Save changes"}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function Banner({ kind, children }: { kind: "error" | "success"; children: React.ReactNode }) {
  const styles =
    kind === "error"
      ? { color: "#b42318", background: "#fef3f2", border: "1px solid #fecdca" }
      : { color: "#067647", background: "#ecfdf3", border: "1px solid #abefc6" };
  return <div style={{ fontSize: 13, borderRadius: 8, padding: "8px 12px", ...styles }}>{children}</div>;
}
