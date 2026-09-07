import Link from "next/link";
import { getAnnouncedDeals } from "@/lib/wpp/deals-server";
import { WPP_T, WPP_FONTS } from "@/lib/wpp/tokens";
import DealsManager from "./DealsManager";

export const dynamic = "force-dynamic";

export default async function AdminDealsPage() {
  const deals = await getAnnouncedDeals();

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

      <main style={{ padding: 32, maxWidth: 860 }}>
        <h1 style={{ fontSize: 22, fontWeight: 600, color: WPP_T.ink, margin: "0 0 4px" }}>
          Deals anunciados
        </h1>
        <p style={{ fontSize: 14, color: WPP_T.mute, margin: "0 0 20px" }}>
          Añade el logo de un cliente cada vez que se anuncie un nuevo deal.
          Aparecen en la portada, en la sección &ldquo;Selected mandates&rdquo;,
          justo antes de los deals existentes. Los cambios se publican al
          instante.
        </p>

        <DealsManager initialDeals={deals} />
      </main>
    </div>
  );
}
