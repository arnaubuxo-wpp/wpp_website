import Link from "next/link";
import { listEnquiries } from "@/lib/wpp/enquiries-server";
import { WPP_T, WPP_FONTS } from "@/lib/wpp/tokens";
import EnquiriesList from "./EnquiriesList";

export const dynamic = "force-dynamic";

export default async function AdminEnquiriesPage() {
  const enquiries = await listEnquiries();

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
          Enquiries
        </h1>
        <p style={{ fontSize: 14, color: WPP_T.mute, margin: "0 0 20px" }}>
          Everything sent through the contact form on the website. Click one to read it
          in full and reply by email. Marking an enquiry as archived keeps it here but
          out of the way.
        </p>

        <EnquiriesList initialEnquiries={enquiries} />
      </main>
    </div>
  );
}
