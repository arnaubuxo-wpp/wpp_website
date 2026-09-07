import type { Metadata } from "next";
import { getOverrides } from "@/lib/wpp/overrides-server";
import ContactClient from "./ContactClient";
import { WPP_META } from "@/lib/wpp/tokens";

// Field overrides can change at any time from /admin/paginas — always fetch
// fresh rather than caching a stale build-time snapshot.
export const dynamic = "force-dynamic";

// See the matching comment in app/about/page.tsx: this makes the per-page
// title/description part of the actual server-rendered HTML instead of a
// client-side-only document.title swap.
export const metadata: Metadata = {
  title: WPP_META.contact.title,
  description: WPP_META.contact.desc,
  alternates: { canonical: "/contact" },
};

export default async function ContactPage() {
  const overrides = await getOverrides("contact");
  return <ContactClient overrides={overrides} />;
}
