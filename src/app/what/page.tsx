import type { Metadata } from "next";
import { getOverrides } from "@/lib/wpp/overrides-server";
import WhatClient from "./WhatClient";
import { WPP_META } from "@/lib/wpp/tokens";

// Field overrides can change at any time from /admin/paginas — always fetch
// fresh rather than caching a stale build-time snapshot.
export const dynamic = "force-dynamic";

// See the matching comment in app/about/page.tsx: this makes the per-page
// title/description part of the actual server-rendered HTML instead of a
// client-side-only document.title swap.
export const metadata: Metadata = {
  title: WPP_META.what.title,
  description: WPP_META.what.desc,
  alternates: { canonical: "/what" },
};

export default async function WhatPage() {
  const overrides = await getOverrides("what");
  return <WhatClient overrides={overrides} />;
}
