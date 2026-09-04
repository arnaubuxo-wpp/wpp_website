"use client";

import { useState } from "react";
import Link from "next/link";
import { WPP_T, WPP_FONTS } from "@/lib/wpp/tokens";

export default function AccountPage() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (newPassword !== confirmPassword) {
      setError("New passwords don't match.");
      return;
    }
    if (newPassword.length < 8) {
      setError("New password must be at least 8 characters.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/admin/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong.");
        setLoading(false);
        return;
      }
      setSuccess(true);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setLoading(false);
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

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
          ← Back
        </Link>
      </header>

      <main style={{ padding: 32, maxWidth: 420 }}>
        <h1 style={{ fontSize: 22, fontWeight: 600, color: WPP_T.ink, margin: "0 0 20px" }}>
          Change password
        </h1>

        <form
          onSubmit={handleSubmit}
          style={{
            background: "#fff",
            border: `1px solid ${WPP_T.hair}`,
            borderRadius: 10,
            padding: 24,
          }}
        >
          <label style={{ display: "block", marginBottom: 14 }}>
            <span style={{ display: "block", fontSize: 13, color: WPP_T.mute, marginBottom: 6 }}>
              Current password
            </span>
            <input
              type="password"
              required
              autoComplete="current-password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              style={inputStyle}
            />
          </label>

          <label style={{ display: "block", marginBottom: 14 }}>
            <span style={{ display: "block", fontSize: 13, color: WPP_T.mute, marginBottom: 6 }}>
              New password
            </span>
            <input
              type="password"
              required
              autoComplete="new-password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              style={inputStyle}
            />
          </label>

          <label style={{ display: "block", marginBottom: 20 }}>
            <span style={{ display: "block", fontSize: 13, color: WPP_T.mute, marginBottom: 6 }}>
              Confirm new password
            </span>
            <input
              type="password"
              required
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              style={inputStyle}
            />
          </label>

          {error && (
            <div
              style={{
                marginBottom: 16,
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
                marginBottom: 16,
                fontSize: 13,
                color: "#067647",
                background: "#ecfdf3",
                border: "1px solid #abefc6",
                borderRadius: 8,
                padding: "8px 12px",
              }}
            >
              Password updated.
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              background: WPP_T.ink,
              color: "#fff",
              border: "none",
              borderRadius: 999,
              padding: "12px 16px",
              fontSize: 15,
              fontWeight: 600,
              cursor: loading ? "default" : "pointer",
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? "Saving…" : "Update password"}
          </button>
        </form>
      </main>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  boxSizing: "border-box",
  border: "1px solid #d9dde3",
  borderRadius: 8,
  padding: "10px 12px",
  fontSize: 15,
  fontFamily: "inherit",
};
