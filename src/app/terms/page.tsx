import type { Metadata } from "next";
import { getOverrides } from "@/lib/wpp/overrides-server";
import TermsClient from "./TermsClient";
import { WPP_META } from "@/lib/wpp/tokens";

// Field overrides can change at any time from /admin/paginas — always fetch
// fresh rather than caching a stale build-time snapshot.
export const dynamic = "force-dynamic";

// See the matching comment in app/about/page.tsx: this makes the per-page
// title/description part of the actual server-rendered HTML instead of a
// client-side-only document.title swap.
export const metadata: Metadata = {
  title: WPP_META.terms.title,
  description: WPP_META.terms.desc,
  alternates: { canonical: "/terms" },
};

export default async function TermsPage() {
  const overrides = await getOverrides("terms");
  return <TermsClient overrides={overrides} />;
}
