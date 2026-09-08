import Link from "next/link";
import { getCuratedPressLinks, getFallbackPressLinks } from "@/lib/wpp/press-server";
import { WPP_T, WPP_FONTS } from "@/lib/wpp/tokens";
import PressManager from "./PressManager";

export const dynamic = "force-dynamic";

export default async function AdminPressPage() {
  const [curated, builtIn] = await Promise.all([
    getCuratedPressLinks(),
    Promise.resolve(getFallbackPressLinks()),
  ]);

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
          ← Back
        </Link>
      </header>

      <main style={{ padding: 32, maxWidth: 900 }}>
        <h1 style={{ fontSize: 22, fontWeight: 600, color: WPP_T.ink, margin: "0 0 4px" }}>
          Hand-picked reading
        </h1>
        <p style={{ fontSize: 14, color: WPP_T.mute, margin: "0 0 20px" }}>
          The press links in the &ldquo;Hand-picked reading&rdquo; section of the homepage.
          The top three in this list are the three that appear, in this order. Leave the
          list empty and the site falls back to its original built-in selection.
        </p>

        <PressManager initialLinks={curated} builtInLinks={builtIn} />
      </main>
    </div>
  );
}
