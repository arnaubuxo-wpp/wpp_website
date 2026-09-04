"use client";
// Standalone login screen — deliberately outside SiteChrome, so it renders
// with no site Nav/Footer, matching the spec ("admin panel con no site
// header/footer").
import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { WPP_T, WPP_FONTS } from "@/lib/wpp/tokens";

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Invalid email or password.");
        setLoading(false);
        return;
      }
      const next = params.get("next") || "/admin";
      router.push(next);
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: WPP_T.bg,
        fontFamily: WPP_FONTS.sans,
        padding: 24,
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          width: "100%",
          maxWidth: 380,
          background: "#fff",
          border: `1px solid ${WPP_T.hair}`,
          borderRadius: 12,
          padding: 32,
        }}
      >
        <div style={{ marginBottom: 24 }}>
          <div
            style={{
              fontSize: 13,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              color: WPP_T.mute,
              marginBottom: 6,
            }}
          >
            White Peak Partners
          </div>
          <h1 style={{ fontSize: 22, fontWeight: 600, margin: 0, color: WPP_T.ink }}>
            Admin sign in
          </h1>
        </div>

        <label style={{ display: "block", marginBottom: 14 }}>
          <span style={{ display: "block", fontSize: 13, color: WPP_T.mute, marginBottom: 6 }}>
            Email
          </span>
          <input
            type="email"
            required
            autoComplete="username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={inputStyle}
          />
        </label>

        <label style={{ display: "block", marginBottom: 20 }}>
          <span style={{ display: "block", fontSize: 13, color: WPP_T.mute, marginBottom: 6 }}>
            Password
          </span>
          <input
            type="password"
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </form>
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

export default function AdminLoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}
