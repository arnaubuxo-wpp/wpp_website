import Link from "next/link";
import { OVERRIDE_PAGES, getPageDef } from "@/lib/wpp/override-fields";
import { getOverrides } from "@/lib/wpp/overrides-server";
import { WPP_T, WPP_FONTS } from "@/lib/wpp/tokens";
import PaginasEditor from "./PaginasEditor";

export const dynamic = "force-dynamic";

export default async function PaginasPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const params = await searchParams;
  const slug = params.page && getPageDef(params.page) ? params.page : "home";
  const pageDef = getPageDef(slug)!;
  const overrides = await getOverrides(slug);

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
          ← Volver
        </Link>
      </header>

      <main style={{ padding: 32, maxWidth: 1400 }}>
        <h1 style={{ fontSize: 22, fontWeight: 600, color: WPP_T.ink, margin: "0 0 4px" }}>
          Contenido de las páginas
        </h1>
        <p style={{ fontSize: 14, color: WPP_T.mute, margin: "0 0 20px" }}>
          Edita textos e imágenes de la web página por página. Los cambios se
          publican al instante. A la derecha tienes la página real para
          ubicar cada campo.
        </p>

        <nav style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 24 }}>
          {OVERRIDE_PAGES.map((p) => {
            const active = p.slug === slug;
            return (
              <Link
                key={p.slug}
                href={`/admin/paginas?page=${p.slug}`}
                style={{
                  fontSize: 13,
                  padding: "6px 14px",
                  borderRadius: 999,
                  border: `1px solid ${active ? WPP_T.ink : WPP_T.hair}`,
                  background: active ? WPP_T.ink : "#fff",
                  color: active ? "#fff" : WPP_T.ink,
                  textDecoration: "none",
                }}
              >
                {p.label}
              </Link>
            );
          })}
        </nav>

        <PaginasEditor pageDef={pageDef} initialValues={overrides} />
      </main>
    </div>
  );
}
