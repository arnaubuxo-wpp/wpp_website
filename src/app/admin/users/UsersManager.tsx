"use client";

import { useCallback, useState } from "react";
import { WPP_T, WPP_FONTS } from "@/lib/wpp/tokens";
import type { AdminUser } from "@/lib/wpp/users-types";

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

export default function UsersManager({ initialUsers }: { initialUsers: AdminUser[] }) {
  const [users, setUsers] = useState<AdminUser[]>(initialUsers);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  /** A just-issued temporary password. Shown once; never retrievable again. */
  const [issued, setIssued] = useState<{ email: string; password: string } | null>(null);

  /** Refetch after a change, so the list reflects what's actually stored. */
  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/users");
      const data = await res.json();
      if (res.ok && Array.isArray(data.users)) setUsers(data.users);
    } catch {
      // Leave the list as-is; the mutation itself already reported any failure.
    }
  }, []);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    setIssued(null);
    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Couldn't create that account.");
        return;
      }
      setIssued({ email: data.email, password: data.password });
      setEmail("");
      setName("");
      await load();
    } catch {
      setError("Couldn't create that account.");
    } finally {
      setBusy(false);
    }
  }

  async function handleReset(user: AdminUser) {
    if (!window.confirm(`Reset the password for ${user.email}? Their current one stops working straight away.`))
      return;
    setBusy(true);
    setError(null);
    setIssued(null);
    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: user.id }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Couldn't reset that password.");
        return;
      }
      setIssued({ email: data.email, password: data.password });
    } catch {
      setError("Couldn't reset that password.");
    } finally {
      setBusy(false);
    }
  }

  async function handleDelete(user: AdminUser) {
    if (!window.confirm(`Remove ${user.email}? They will no longer be able to sign in.`)) return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/users", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: user.id }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Couldn't remove that account.");
        return;
      }
      await load();
    } catch {
      setError("Couldn't remove that account.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {issued && (
        <div
          style={{
            background: "#ecfdf3",
            border: "1px solid #abefc6",
            borderRadius: 10,
            padding: 20,
          }}
        >
          <div style={{ fontSize: 14, fontWeight: 600, color: "#067647", marginBottom: 8 }}>
            Temporary password for {issued.email}
          </div>
          <div
            style={{
              fontFamily: WPP_FONTS.mono,
              fontSize: 18,
              background: "#fff",
              border: "1px solid #abefc6",
              borderRadius: 8,
              padding: "12px 14px",
              letterSpacing: 1,
              userSelect: "all",
              marginBottom: 10,
            }}
          >
            {issued.password}
          </div>
          <div style={{ fontSize: 13, color: "#067647", lineHeight: 1.55 }}>
            Copy this now — it can&rsquo;t be shown again, only reset. Send it to them
            directly rather than by email where you can, and ask them to change it under
            Account once they&rsquo;re in.
          </div>
          <button
            type="button"
            onClick={() => setIssued(null)}
            style={{ ...buttonStyle, marginTop: 12 }}
          >
            Done
          </button>
        </div>
      )}

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
          Add someone
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <label>
            <span style={{ display: "block", fontSize: 13, fontWeight: 600, color: WPP_T.ink, marginBottom: 4 }}>
              Email
            </span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@whitepeakpartners.com"
              style={inputStyle}
            />
          </label>
          <label>
            <span style={{ display: "block", fontSize: 13, fontWeight: 600, color: WPP_T.ink, marginBottom: 4 }}>
              Name
            </span>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Optional"
              style={inputStyle}
            />
          </label>
        </div>

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

        <button
          type="submit"
          disabled={busy}
          style={{
            alignSelf: "flex-start",
            background: WPP_T.ink,
            color: "#fff",
            border: "none",
            borderRadius: 999,
            padding: "10px 20px",
            fontSize: 14,
            fontWeight: 600,
            cursor: busy ? "default" : "pointer",
            opacity: busy ? 0.7 : 1,
            fontFamily: WPP_FONTS.sans,
          }}
        >
          {busy ? "Working…" : "Create account"}
        </button>
      </form>

      <div>
        <h2 style={{ fontSize: 15, fontWeight: 600, color: WPP_T.ink, margin: "0 0 12px" }}>
          Accounts ({users.length})
        </h2>
        <div
            style={{
              background: "#fff",
              border: `1px solid ${WPP_T.hair}`,
              borderRadius: 10,
              overflow: "hidden",
            }}
          >
            {users.map((u, i) => (
              <div
                key={u.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 16,
                  padding: "14px 20px",
                  borderTop: i === 0 ? "none" : `1px solid ${WPP_T.hair}`,
                }}
              >
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: WPP_T.ink }}>
                    {u.name || u.email}
                    {u.isSelf && (
                      <span
                        style={{
                          fontSize: 11,
                          fontWeight: 600,
                          color: WPP_T.blue,
                          background: "#eef2ff",
                          borderRadius: 999,
                          padding: "2px 8px",
                          marginLeft: 8,
                        }}
                      >
                        You
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: 12, color: WPP_T.mute, marginTop: 2 }}>
                    {u.name ? `${u.email} · ` : ""}
                    {u.createdAt
                      ? `Added ${new Date(u.createdAt).toLocaleDateString("en-GB")}`
                      : ""}
                  </div>
                </div>
                <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                  <button
                    type="button"
                    onClick={() => handleReset(u)}
                    disabled={busy}
                    style={buttonStyle}
                  >
                    Reset password
                  </button>
                  {!u.isSelf && (
                    <button
                      type="button"
                      onClick={() => handleDelete(u)}
                      disabled={busy}
                      style={{ ...buttonStyle, color: "#b42318", borderColor: "#fecdca" }}
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
