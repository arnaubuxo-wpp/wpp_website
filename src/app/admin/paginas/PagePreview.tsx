"use client";

import { useState } from "react";
import { WPP_T, WPP_FONTS } from "@/lib/wpp/tokens";

export default function PagePreview({ path, label }: { path: string; label: string }) {
  const [reloadKey, setReloadKey] = useState(0);

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
        Esto es la página real. Si el panel es estrecho puede verse en formato móvil — usa
        &quot;Abrir en pestaña nueva&quot; para verla a tamaño completo. Después de guardar,
        pulsa &quot;Actualizar&quot; para ver el cambio aquí.
      </div>
    </div>
  );
}
