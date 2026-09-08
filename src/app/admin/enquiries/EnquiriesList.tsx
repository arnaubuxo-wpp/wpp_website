"use client";

import { useMemo, useState } from "react";
import { WPP_T, WPP_FONTS } from "@/lib/wpp/tokens";
import type { Enquiry, EnquiryStatus } from "@/lib/wpp/enquiries-types";

const STATUS_STYLE: Record<EnquiryStatus, { bg: string; fg: string; label: string }> = {
  new: { bg: "#eef2ff", fg: "#3538cd", label: "New" },
  read: { bg: "#f2f4f7", fg: "#475467", label: "Read" },
  archived: { bg: "#f8f9fa", fg: "#98a2b3", label: "Archived" },
};

type Filter = "inbox" | "archived" | "all";

export default function EnquiriesList({ initialEnquiries }: { initialEnquiries: Enquiry[] }) {
  const [enquiries, setEnquiries] = useState<Enquiry[]>(initialEnquiries);
  const [openId, setOpenId] = useState<number | null>(null);
  const [filter, setFilter] = useState<Filter>("inbox");
  const [busyId, setBusyId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const visible = useMemo(() => {
    if (filter === "all") return enquiries;
    if (filter === "archived") return enquiries.filter((e) => e.status === "archived");
    return enquiries.filter((e) => e.status !== "archived");
  }, [enquiries, filter]);

  const newCount = enquiries.filter((e) => e.status === "new").length;

  async function patchStatus(id: number, status: EnquiryStatus) {
    setBusyId(id);
    setError(null);
    const previous = enquiries;
    setEnquiries((list) => list.map((e) => (e.id === id ? { ...e, status } : e)));
    try {
      const res = await fetch("/api/admin/enquiries", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      if (!res.ok) {
        setEnquiries(previous);
        setError("Couldn't update that enquiry.");
      }
    } catch {
      setEnquiries(previous);
      setError("Couldn't update that enquiry.");
    } finally {
      setBusyId(null);
    }
  }

  async function remove(id: number, name: string) {
    if (!window.confirm(`Delete the enquiry from ${name}? This action cannot be undone.`)) return;
    setBusyId(id);
    setError(null);
    const previous = enquiries;
    setEnquiries((list) => list.filter((e) => e.id !== id));
    try {
      const res = await fetch("/api/admin/enquiries", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) {
        setEnquiries(previous);
        setError("Couldn't delete that enquiry.");
      }
    } catch {
      setEnquiries(previous);
      setError("Couldn't delete that enquiry.");
    } finally {
      setBusyId(null);
    }
  }

  function toggleOpen(e: Enquiry) {
    const next = openId === e.id ? null : e.id;
    setOpenId(next);
    // Opening an unread enquiry marks it read — the same thing any mail client does.
    if (next !== null && e.status === "new") patchStatus(e.id, "read");
  }

  return (
    <div>
      <div style={{ display: "flex", gap: 8, marginBottom: 16, alignItems: "center" }}>
        {(["inbox", "archived", "all"] as Filter[]).map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            style={{
              border: `1px solid ${filter === f ? WPP_T.ink : WPP_T.hair}`,
              background: filter === f ? WPP_T.ink : "#fff",
              color: filter === f ? "#fff" : WPP_T.ink,
              borderRadius: 999,
              padding: "6px 14px",
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: WPP_FONTS.sans,
              textTransform: "capitalize",
            }}
          >
            {f}
          </button>
        ))}
        {newCount > 0 && (
          <span style={{ fontSize: 13, color: WPP_T.mute, marginLeft: 4 }}>
            {newCount} unread
          </span>
        )}
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
            marginBottom: 16,
          }}
        >
          {error}
        </div>
      )}

      {visible.length === 0 ? (
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
          {filter === "archived"
            ? "Nothing archived yet."
            : "No enquiries yet. Messages sent through the contact form on the website will appear here."}
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
          {visible.map((e, i) => {
            const open = openId === e.id;
            const status = STATUS_STYLE[e.status];
            return (
              <div key={e.id} style={{ borderTop: i === 0 ? "none" : `1px solid ${WPP_T.hair}` }}>
                <button
                  type="button"
                  onClick={() => toggleOpen(e)}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 16,
                    padding: "14px 20px",
                    background: open ? WPP_T.panel : "#fff",
                    border: "none",
                    textAlign: "left",
                    cursor: "pointer",
                    fontFamily: WPP_FONTS.sans,
                  }}
                >
                  <div style={{ minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <span
                        style={{
                          fontSize: 14,
                          fontWeight: e.status === "new" ? 700 : 600,
                          color: WPP_T.ink,
                        }}
                      >
                        {e.name}
                        {e.company ? ` · ${e.company}` : ""}
                      </span>
                      <span
                        style={{
                          fontSize: 10.5,
                          fontWeight: 600,
                          padding: "3px 8px",
                          borderRadius: 999,
                          background: status.bg,
                          color: status.fg,
                          textTransform: "uppercase",
                          letterSpacing: 0.4,
                        }}
                      >
                        {status.label}
                      </span>
                    </div>
                    <div
                      style={{
                        fontSize: 12.5,
                        color: WPP_T.mute,
                        marginTop: 3,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        maxWidth: 560,
                      }}
                    >
                      {e.message}
                    </div>
                  </div>
                  <span style={{ fontSize: 12, color: WPP_T.mute, flexShrink: 0 }}>
                    {new Date(e.createdAt).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                    })}
                  </span>
                </button>

                {open && (
                  <div style={{ padding: "4px 20px 20px", background: WPP_T.panel }}>
                    <dl
                      style={{
                        display: "grid",
                        gridTemplateColumns: "auto 1fr",
                        gap: "4px 14px",
                        margin: "0 0 14px",
                        fontSize: 13.5,
                      }}
                    >
                      <Meta label="Email">
                        <a href={`mailto:${e.email}`} style={{ color: WPP_T.blue }}>
                          {e.email}
                        </a>
                      </Meta>
                      {e.role && <Meta label="Role">{e.role}</Meta>}
                      {e.company && <Meta label="Company">{e.company}</Meta>}
                      <Meta label="Received">
                        {new Date(e.createdAt).toLocaleString("en-GB")}
                      </Meta>
                    </dl>

                    <div
                      style={{
                        background: "#fff",
                        border: `1px solid ${WPP_T.hair}`,
                        borderRadius: 8,
                        padding: "14px 16px",
                        fontSize: 14,
                        lineHeight: 1.65,
                        color: WPP_T.ink,
                        whiteSpace: "pre-wrap",
                        marginBottom: 14,
                      }}
                    >
                      {e.message}
                    </div>

                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                      <a
                        href={`mailto:${e.email}?subject=${encodeURIComponent(
                          "Re: your enquiry — White Peak Partners"
                        )}`}
                        style={{
                          fontSize: 13,
                          fontWeight: 600,
                          background: WPP_T.ink,
                          color: "#fff",
                          borderRadius: 8,
                          padding: "8px 16px",
                          textDecoration: "none",
                        }}
                      >
                        Reply by email
                      </a>
                      {e.status !== "archived" ? (
                        <ActionButton
                          disabled={busyId === e.id}
                          onClick={() => patchStatus(e.id, "archived")}
                        >
                          Archive
                        </ActionButton>
                      ) : (
                        <ActionButton
                          disabled={busyId === e.id}
                          onClick={() => patchStatus(e.id, "read")}
                        >
                          Move back to inbox
                        </ActionButton>
                      )}
                      <ActionButton
                        disabled={busyId === e.id}
                        danger
                        onClick={() => remove(e.id, e.name)}
                      >
                        Delete
                      </ActionButton>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function Meta({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <>
      <dt style={{ color: WPP_T.mute, fontWeight: 600 }}>{label}</dt>
      <dd style={{ margin: 0, color: WPP_T.ink }}>{children}</dd>
    </>
  );
}

function ActionButton({
  children,
  onClick,
  disabled,
  danger,
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  danger?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      style={{
        fontSize: 13,
        fontWeight: 600,
        color: danger ? "#b42318" : WPP_T.ink,
        border: `1px solid ${danger ? "#fecdca" : WPP_T.hair}`,
        background: "#fff",
        borderRadius: 8,
        padding: "8px 16px",
        cursor: disabled ? "default" : "pointer",
        opacity: disabled ? 0.6 : 1,
        fontFamily: WPP_FONTS.sans,
      }}
    >
      {children}
    </button>
  );
}
