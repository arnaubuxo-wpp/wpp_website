"use client";

import { useState } from "react";
import type { PageDef } from "@/lib/wpp/override-fields";
import PaginasForm from "./PaginasForm";
import PagePreview from "./PagePreview";

// Lifts the "which field is the user touching right now" state so the form
// and the live preview can stay in sync: hovering/focusing a field in
// PaginasForm sets activeKey, and PagePreview reacts by scrolling to and
// highlighting the matching [data-override-key] element in the real page.
export default function PaginasEditor({
  pageDef,
  initialValues,
}: {
  pageDef: PageDef;
  initialValues: Record<string, string>;
}) {
  const [activeKey, setActiveKey] = useState<string | null>(null);

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))",
        gap: 24,
        alignItems: "start",
      }}
    >
      <PaginasForm
        pageDef={pageDef}
        initialValues={initialValues}
        onFieldActivate={setActiveKey}
      />
      <div style={{ height: "calc(100vh - 220px)", minHeight: 480, position: "sticky", top: 32 }}>
        <PagePreview path={pageDef.path} label={pageDef.label} activeKey={activeKey} />
      </div>
    </div>
  );
}
