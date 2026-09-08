"use client";
// The enquiry form on /contact. Written as ordinary JSX (rather than the
// createElement style the ported page components use) because it's new code —
// Contact.tsx mounts it with a single call.
//
// A mailto: link stays visible underneath as a fallback: some people simply
// prefer their own mail client, and if the form ever fails they still have a
// way through.
import { useEffect, useRef, useState } from "react";
import { WPP_T, WPP_FONTS } from "@/lib/wpp/tokens";
import { ENQUIRY_LIMITS } from "@/lib/wpp/enquiries-types";

const CONTACT_EMAIL = "info@whitepeakpartners.com";

interface Fields {
  name: string;
  company: string;
  email: string;
  role: string;
  message: string;
}

const EMPTY: Fields = { name: "", company: "", email: "", role: "", message: "" };

export default function ContactForm() {
  const [fields, setFields] = useState<Fields>(EMPTY);
  const [honeypot, setHoneypot] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  // Set on mount rather than during render: calling Date.now() in a render pass is
  // impure and can drift across re-renders. 0 means "not measured yet", and the
  // server treats a missing elapsed time as a pass, so this can never wrongly
  // reject a real submission.
  const mountedAt = useRef<number>(0);
  useEffect(() => {
    mountedAt.current = Date.now();
  }, []);

  function update<K extends keyof Fields>(key: K, value: string) {
    setFields((f) => ({ ...f, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: "" }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSending(true);
    setFormError(null);
    setErrors({});

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...fields,
          website: honeypot,
          elapsedMs: mountedAt.current ? Date.now() - mountedAt.current : undefined,
        }),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        if (data.errors && typeof data.errors === "object") setErrors(data.errors);
        setFormError(data.error || "Something went wrong. Please try again.");
        setSending(false);
        return;
      }

      setSent(true);
      setSending(false);
      setFields(EMPTY);
    } catch {
      setFormError(
        `Something went wrong sending that. Please try again, or email us at ${CONTACT_EMAIL}.`
      );
      setSending(false);
    }
  }

  if (sent) {
    return (
      <div
        style={{
          border: `1px solid ${WPP_T.hair}`,
          borderRadius: 12,
          padding: "28px 26px",
          maxWidth: 520,
          fontFamily: WPP_FONTS.sans,
        }}
      >
        <div
          style={{
            fontFamily: WPP_FONTS.serif,
            fontSize: 24,
            color: WPP_T.ink,
            marginBottom: 10,
          }}
        >
          Thank you — your message is with us.
        </div>
        <p style={{ fontSize: 15, lineHeight: 1.6, color: WPP_T.inkSoft, margin: "0 0 18px" }}>
          A partner will read it personally and come back to you, usually within one working day.
        </p>
        <button
          type="button"
          onClick={() => {
            setSent(false);
            mountedAt.current = Date.now();
          }}
          style={{
            background: "none",
            border: "none",
            padding: 0,
            fontSize: 14,
            fontWeight: 600,
            color: WPP_T.blue,
            cursor: "pointer",
            fontFamily: WPP_FONTS.sans,
          }}
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 520, fontFamily: WPP_FONTS.sans }} noValidate>
      {/* auto-fit collapses this to a single column on narrow screens without
          needing a media query or a JS breakpoint hook. */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))",
          gap: 14,
        }}
      >
        <Field label="Name" error={errors.name} required>
          <input
            type="text"
            value={fields.name}
            onChange={(e) => update("name", e.target.value)}
            maxLength={ENQUIRY_LIMITS.name}
            autoComplete="name"
            style={inputStyle(!!errors.name)}
          />
        </Field>
        <Field label="Company" error={errors.company}>
          <input
            type="text"
            value={fields.company}
            onChange={(e) => update("company", e.target.value)}
            maxLength={ENQUIRY_LIMITS.company}
            autoComplete="organization"
            style={inputStyle(!!errors.company)}
          />
        </Field>
        <Field label="Email" error={errors.email} required>
          <input
            type="email"
            value={fields.email}
            onChange={(e) => update("email", e.target.value)}
            maxLength={ENQUIRY_LIMITS.email}
            autoComplete="email"
            style={inputStyle(!!errors.email)}
          />
        </Field>
        <Field label="Role" error={errors.role}>
          <input
            type="text"
            value={fields.role}
            onChange={(e) => update("role", e.target.value)}
            maxLength={ENQUIRY_LIMITS.role}
            placeholder="e.g. Founder, CFO"
            autoComplete="organization-title"
            style={inputStyle(!!errors.role)}
          />
        </Field>
      </div>

      <div style={{ marginTop: 14 }}>
        <Field label="How can we help?" error={errors.message} required>
          <textarea
            rows={5}
            value={fields.message}
            onChange={(e) => update("message", e.target.value)}
            maxLength={ENQUIRY_LIMITS.message}
            placeholder="A few lines about your company, the stage you're at, and what you're hoping to achieve."
            style={{ ...inputStyle(!!errors.message), resize: "vertical", fontFamily: "inherit" }}
          />
        </Field>
      </div>

      {/* Honeypot: invisible to people, irresistible to bots. Not display:none —
          some bots skip hidden fields — but positioned out of the flow. */}
      <div
        aria-hidden="true"
        style={{ position: "absolute", left: "-9999px", width: 1, height: 1, overflow: "hidden" }}
      >
        <label>
          Website
          <input
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={honeypot}
            onChange={(e) => setHoneypot(e.target.value)}
          />
        </label>
      </div>

      {formError && (
        <div
          role="alert"
          style={{
            marginTop: 16,
            fontSize: 14,
            color: "#b42318",
            background: "#fef3f2",
            border: "1px solid #fecdca",
            borderRadius: 8,
            padding: "10px 14px",
          }}
        >
          {formError}
        </div>
      )}

      <button
        type="submit"
        disabled={sending}
        style={{
          marginTop: 20,
          display: "inline-flex",
          alignItems: "center",
          gap: 10,
          padding: "16px 30px",
          background: WPP_T.blue,
          color: "#fff",
          border: "none",
          borderRadius: 999,
          fontSize: 16,
          fontWeight: 600,
          cursor: sending ? "default" : "pointer",
          opacity: sending ? 0.7 : 1,
          fontFamily: WPP_FONTS.sans,
          boxShadow: "0 8px 24px rgba(29,78,216,0.28)",
        }}
      >
        {sending ? "Sending…" : "Send message →"}
      </button>

      <div style={{ marginTop: 18, fontSize: 13.5, color: WPP_T.mute, lineHeight: 1.6 }}>
        Prefer email?{" "}
        <a href={`mailto:${CONTACT_EMAIL}`} style={{ color: WPP_T.blue, fontWeight: 600 }}>
          {CONTACT_EMAIL}
        </a>
      </div>
    </form>
  );
}

function Field({
  label,
  error,
  required,
  children,
}: {
  label: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label style={{ display: "block" }}>
      <span
        style={{
          display: "block",
          fontSize: 12.5,
          fontWeight: 600,
          letterSpacing: 0.02,
          color: WPP_T.inkSoft,
          marginBottom: 5,
        }}
      >
        {label}
        {required && <span style={{ color: WPP_T.blue }}> *</span>}
      </span>
      {children}
      {error && (
        <span style={{ display: "block", fontSize: 12.5, color: "#b42318", marginTop: 4 }}>
          {error}
        </span>
      )}
    </label>
  );
}

function inputStyle(invalid: boolean): React.CSSProperties {
  return {
    width: "100%",
    boxSizing: "border-box",
    border: `1px solid ${invalid ? "#fda29b" : "#d9dde3"}`,
    borderRadius: 8,
    padding: "11px 13px",
    fontSize: 15,
    color: WPP_T.ink,
    background: "#fff",
    fontFamily: WPP_FONTS.sans,
    outlineColor: WPP_T.blue,
  };
}
