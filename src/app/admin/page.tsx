import { cookies } from "next/headers";
import Link from "next/link";
import { verifySession, SESSION_COOKIE } from "@/lib/wpp/auth";
import { WPP_T, WPP_FONTS } from "@/lib/wpp/tokens";
import LogoutButton from "./LogoutButton";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const cookieStore = await cookies();
  const session = await verifySession(cookieStore.get(SESSION_COOKIE)?.value);

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
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <span style={{ fontSize: 13, color: WPP_T.mute }}>{session?.email}</span>
          <Link href="/admin/paginas" style={{ fontSize: 13, color: WPP_T.ink }}>
            Páginas
          </Link>
          <Link href="/admin/account" style={{ fontSize: 13, color: WPP_T.ink }}>
            Account
          </Link>
          <LogoutButton />
        </div>
      </header>

      <main style={{ padding: 32, maxWidth: 720 }}>
        <h1 style={{ fontSize: 24, fontWeight: 600, color: WPP_T.ink, margin: "0 0 8px" }}>
          Welcome{session?.name ? `, ${session.name}` : ""}.
        </h1>
        <p style={{ fontSize: 15, color: WPP_T.mute, margin: "0 0 24px" }}>
          You&rsquo;re signed in.
        </p>
        <Link
          href="/admin/paginas"
          style={{
            display: "block",
            background: "#fff",
            border: `1px solid ${WPP_T.hair}`,
            borderRadius: 10,
            padding: 20,
            fontSize: 14,
            color: WPP_T.ink,
            textDecoration: "none",
          }}
        >
          <strong>Editar contenido de las páginas →</strong>
          <div style={{ color: WPP_T.mute, marginTop: 4 }}>
            Cambia textos e imágenes de la web, página por página.
          </div>
        </Link>
      </main>
    </div>
  );
}
