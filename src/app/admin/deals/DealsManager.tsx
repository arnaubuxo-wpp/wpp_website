"use client";

import { useRef, useState } from "react";
import { WPP_T, WPP_FONTS } from "@/lib/wpp/tokens";
import { makeDeal, type AnnouncedDeal } from "@/lib/wpp/deals-types";

const inputStyle: React.CSSProperties = {
  width: "100%",
  boxSizing: "border-box",
  border: "1px solid #d9dde3",
  borderRadius: 8,
  padding: "10px 12px",
  fontSize: 14,
  fontFamily: WPP_FONTS.sans,
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

export default function DealsManager({ initialDeals }: { initialDeals: AnnouncedDeal[] }) {
  const [deals, setDeals] = useState<AnnouncedDeal[]>(initialDeals);
  const [name, setName] = useState("");
  const [summary, setSummary] = useState("");
  const [detail, setDetail] = useState("");
  const [sector, setSector] = useState("");
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  async function persist(next: AnnouncedDeal[]) {
    setSaving(true);
    setError(null);
    setSuccess(false);
    try {
      const res = await fetch("/api/admin/deals", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ deals: next }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong.");
        return false;
      }
      setDeals(next);
      setSuccess(true);
      return true;
    } catch {
      setError("Something went wrong. Please try again.");
      return false;
    } finally {
      setSaving(false);
    }
  }

  async function handleLogoSelected(file: File) {
    setUploading(true);
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
      setLogoUrl(data.url);
    } catch {
      setError("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) {
      setError("The company name is required.");
      return;
    }
    const deal = makeDeal({ name, summary, detail, sector, logoUrl });
    const ok = await persist([deal, ...deals]);
    if (ok) {
      setName("");
      setSummary("");
      setDetail("");
      setSector("");
      setLogoUrl(null);
    }
  }

  async function handleDelete(id: string) {
    if (!window.confirm("Delete this deal? This action cannot be undone.")) return;
    await persist(deals.filter((d) => d.id !== id));
  }

  async function handleMove(index: number, dir: -1 | 1) {
    const target = index + dir;
    if (target < 0 || target >= deals.length) return;
    const next = [...deals];
    [next[index], next[target]] = [next[target], next[index]];
    await persist(next);
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
        <h2 style={{ fontSize: 15, fontWeight: 600, color: WPP_T.ink, margin: 0 }}>
          Add a new deal
        </h2>

        <label style={{ display: "block" }}>
          <span style={{ display: "block", fontSize: 13, fontWeight: 600, color: WPP_T.ink, marginBottom: 4 }}>
            Company name
          </span>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Acme Robotics"
            style={inputStyle}
          />
        </label>

        <label style={{ display: "block" }}>
          <span style={{ display: "block", fontSize: 13, fontWeight: 600, color: WPP_T.ink, marginBottom: 4 }}>
            Logo
          </span>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            {logoUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={logoUrl}
                alt=""
                style={{
                  height: 40,
                  maxWidth: 140,
                  objectFit: "contain",
                  border: `1px solid ${WPP_T.hair}`,
                  borderRadius: 6,
                  padding: 4,
                  background: "#fff",
                }}
              />
            )}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              style={{ ...buttonStyle, cursor: uploading ? "default" : "pointer" }}
            >
              {uploading ? "Uploading…" : logoUrl ? "Change logo" : "Upload logo"}
            </button>
            {logoUrl && (
              <button
                type="button"
                onClick={() => setLogoUrl(null)}
                style={{ ...buttonStyle, color: "#b42318", borderColor: "#fecdca" }}
              >
                Remove
              </button>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleLogoSelected(file);
              e.target.value = "";
            }}
            style={{ display: "none" }}
          />
        </label>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <label style={{ display: "block" }}>
            <span style={{ display: "block", fontSize: 13, fontWeight: 600, color: WPP_T.ink, marginBottom: 4 }}>
              Deal type
            </span>
            <input
              type="text"
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="e.g. Fundraise, Sale to Acme Corp"
              style={inputStyle}
            />
          </label>
          <label style={{ display: "block" }}>
            <span style={{ display: "block", fontSize: 13, fontWeight: 600, color: WPP_T.ink, marginBottom: 4 }}>
              Amount
            </span>
            <input
              type="text"
              value={detail}
              onChange={(e) => setDetail(e.target.value)}
              placeholder="e.g. $10m, Confidential"
              style={inputStyle}
            />
          </label>
        </div>

        <label style={{ display: "block" }}>
          <span style={{ display: "block", fontSize: 13, fontWeight: 600, color: WPP_T.ink, marginBottom: 4 }}>
            Sector (optional, for internal reference only)
          </span>
          <input
            type="text"
            value={sector}
            onChange={(e) => setSector(e.target.value)}
            placeholder="e.g. Fintech · B2B SaaS"
            style={inputStyle}
          />
        </label>

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
            Saved. It&rsquo;s now live on the site.
          </div>
        )}

        <button
          type="submit"
          disabled={saving || uploading}
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
          {saving ? "Saving…" : "Add deal"}
        </button>
      </form>

      <div>
        <h2 style={{ fontSize: 15, fontWeight: 600, color: WPP_T.ink, margin: "0 0 12px" }}>
          Added deals ({deals.length})
        </h2>
        {deals.length === 0 ? (
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
            No deals have been added yet. The site&rsquo;s original deals keep
            showing as normal.
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
            {deals.map((deal, i) => (
              <div
                key={deal.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                  padding: "14px 20px",
                  borderTop: i === 0 ? "none" : `1px solid ${WPP_T.hair}`,
                }}
              >
                <div
                  style={{
                    width: 56,
                    height: 40,
                    flexShrink: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border: `1px solid ${WPP_T.hair}`,
                    borderRadius: 6,
                    background: WPP_T.panel,
                    overflow: "hidden",
                  }}
                >
                  {deal.logoUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={deal.logoUrl}
                      alt=""
                      style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }}
                    />
                  ) : (
                    <span style={{ fontSize: 10, color: WPP_T.mute }}>No logo</span>
                  )}
                </div>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: WPP_T.ink }}>{deal.name}</div>
                  <div style={{ fontSize: 12, color: WPP_T.mute, marginTop: 2 }}>
                    {[deal.summary, deal.detail, deal.sector].filter(Boolean).join(" · ") || "No details"}
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
                    disabled={i === deals.length - 1 || saving}
                    style={{ ...buttonStyle, opacity: i === deals.length - 1 ? 0.4 : 1 }}
                    aria-label="Move down"
                  >
                    ↓
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(deal.id)}
                    disabled={saving}
                    style={{ ...buttonStyle, color: "#b42318", borderColor: "#fecdca" }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
