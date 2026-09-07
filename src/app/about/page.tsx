import type { Metadata } from "next";
import { getOverrides } from "@/lib/wpp/overrides-server";
import AboutClient from "./AboutClient";
import { WPP_META } from "@/lib/wpp/tokens";

// Field overrides can change at any time from /admin/paginas — always fetch
// fresh rather than caching a stale build-time snapshot.
export const dynamic = "force-dynamic";

// Server-rendered per-page metadata. Without this, the page inherits the
// root layout's (Home's) title/description in the actual HTML — the old
// client-side document.title swap in SiteChrome only fixes it up after JS
// runs, so crawlers and link-preview bots that don't execute JS always saw
// Home's metadata here regardless of which page they fetched.
export const metadata: Metadata = {
  title: WPP_META.about.title,
  description: WPP_META.about.desc,
  alternates: { canonical: "/about" },
};

export default async function AboutPage() {
  const overrides = await getOverrides("about");
  return <AboutClient overrides={overrides} />;
}
