import type { Metadata } from "next";
import { getOverrides } from "@/lib/wpp/overrides-server";
import PrivacyClient from "./PrivacyClient";
import { WPP_META } from "@/lib/wpp/tokens";

// Field overrides can change at any time from /admin/paginas — always fetch
// fresh rather than caching a stale build-time snapshot.
export const dynamic = "force-dynamic";

// See the matching comment in app/about/page.tsx: this makes the per-page
// title/description part of the actual server-rendered HTML instead of a
// client-side-only document.title swap.
export const metadata: Metadata = {
  title: WPP_META.privacy.title,
  description: WPP_META.privacy.desc,
  alternates: { canonical: "/privacy" },
};

export default async function PrivacyPage() {
  const overrides = await getOverrides("privacy");
  return <PrivacyClient overrides={overrides} />;
}
