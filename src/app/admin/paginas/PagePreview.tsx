"use client";

import { useEffect, useRef, useState } from "react";
import { WPP_T, WPP_FONTS } from "@/lib/wpp/tokens";

export default function PagePreview({
  path,
  label,
  activeKey,
}: {
  path: string;
  label: string;
  activeKey?: string | null;
}) {
  const [reloadKey, setReloadKey] = useState(0);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const highlightedRef = useRef<HTMLElement | null>(null);

  // The admin panel and the public pages are served from the same Next.js
  // app, so the iframe is same-origin: we can reach into its document and
  // scroll to / highlight the exact element a field controls, identified by
  // the matching data-override-key attribute placed on that element.
  useEffect(() => {
    if (highlightedRef.current) {
      highlightedRef.current.style.outline = "";
      highlightedRef.current.style.outlineOffset = "";
      highlightedRef.current.style.borderRadius = "";
      highlightedRef.current = null;
    }
    if (!activeKey) return;

    let cancelled = false;
    const tryHighlight = () => {
      if (cancelled) return;
      const iframe = iframeRef.current;
      if (!iframe) return;
      try {
        const doc = iframe.contentWindow?.document;
        if (!doc) return;
        const el = doc.querySelector<HTMLElement>(`[data-override-key="${activeKey}"]`);
        if (!el) return;
        el.scrollIntoView({ block: "center", behavior: "smooth" });
        el.style.outline = "3px solid #3b6fe5";
        el.style.outlineOffset = "3px";
        el.style.borderRadius = el.style.borderRadius || "2px";
        highlightedRef.current = el;
      } catch {
        // Cross-origin or the iframe hasn't finished loading yet — ignore.
      }
    };

    // The iframe may still be loading right after a reload, so give it a
    // moment and retry once.
    tryHighlight();
    const t = setTimeout(tryHighlight, 400);
    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, [activeKey, reloadKey]);

  return (
    <div
      style={{
        background: "#fff",
        border: `1px solid ${WPP_T.hair}`,
        borderRadius: 10,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        height: "100%",
        minHeight: 480,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 8,
          padding: "10px 14px",
          borderBottom: `1px solid ${WPP_T.hair}`,
          background: WPP_T.panel,
        }}
      >
        <span style={{ fontSize: 12, fontWeight: 600, color: WPP_T.ink, fontFamily: WPP_FONTS.sans }}>
          Vista previa en vivo — {label}
        </span>
        <div style={{ display: "flex", gap: 8 }}>
          <button
            type="button"
            onClick={() => setReloadKey((k) => k + 1)}
            style={{
              fontSize: 12,
              fontWeight: 600,
              color: WPP_T.ink,
              background: "#fff",
              border: `1px solid ${WPP_T.hair}`,
              borderRadius: 999,
              padding: "4px 10px",
              cursor: "pointer",
              fontFamily: WPP_FONTS.sans,
            }}
          >
            Actualizar
          </button>
          <a
            href={path}
            target="_blank"
            rel="noreferrer"
            style={{
              fontSize: 12,
              fontWeight: 600,
              color: WPP_T.ink,
              background: "#fff",
              border: `1px solid ${WPP_T.hair}`,
              borderRadius: 999,
              padding: "4px 10px",
              textDecoration: "none",
              fontFamily: WPP_FONTS.sans,
            }}
          >
            Abrir en pestaña nueva ↗
          </a>
        </div>
      </div>
      <div style={{ flex: 1, position: "relative" }}>
        <iframe
          key={reloadKey}
          ref={iframeRef}
          src={path}
          title={`Vista previa de ${label}`}
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: "none" }}
        />
      </div>
      <div
        style={{
          padding: "6px 14px",
          fontSize: 11,
          color: WPP_T.mute,
          borderTop: `1px solid ${WPP_T.hair}`,
          fontFamily: WPP_FONTS.sans,
        }}
      >
        Esto es la página real. Al hacer clic o pasar el ratón por un campo del
        formulario, aquí se resalta con un borde azul exactamente qué parte de
        la web edita ese campo. Si el panel es estrecho puede verse en formato
        móvil — usa &quot;Abrir en pestaña nueva&quot; para verla a tamaño
        completo. Después de guardar, pulsa &quot;Actualizar&quot; para ver el
        cambio aquí.
      </div>
    </div>
  );
}
