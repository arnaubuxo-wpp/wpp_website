"use client";
// Replaces the original site's Site() router component. That component rendered
// <div><Nav/>{spacer if !home}<main>{Cur}</main><Footer/></div> straight into #site-root
// and swapped `Cur`/`page` on client-side ?page= navigation. Real Next.js routes now own
// that navigation, but this wrapper preserves the exact DOM shape the scroll-reveal
// IIFE depends on (root.firstElementChild -> this outer <div>).
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import Nav from "./Nav";
import Footer from "./Footer";
import { WPP_LINK, WPP_META } from "@/lib/wpp/tokens";

type WppPage = "home" | "what" | "about" | "contact" | "privacy" | "terms" | "blog";

export default function SiteChrome({
  page,
  children,
}: {
  page: WppPage;
  children: React.ReactElement<{ onNavigate?: (key: string) => void }>;
}) {
  const router = useRouter();
  const onNavigate = (key: string) => {
    router.push(WPP_LINK(key));
  };

  // Ported from the original site's WPP_APPLY_META: the root layout's <title>/<meta
  // description> only cover Home (the App Router default-metadata route), so client
  // routes update them the same way the original SPA did on ?page= navigation.
  useEffect(() => {
    // Blog pages manage their own <title>/<meta description> via Next.js's
    // generateMetadata (server-rendered, and correctly unique per post) — skip
    // the legacy client-side override so it doesn't stomp on that.
    const m = WPP_META[page];
    if (!m) return;
    document.title = m.title;
    const d = document.querySelector('meta[name="description"]');
    if (d) d.setAttribute("content", m.desc);
  }, [page]);

  return (
    <div>
      <Nav current={page} onNavigate={onNavigate} />
      {page !== "home" && <div style={{ height: 76 }} aria-hidden="true" />}
      <main>{React.cloneElement(children, { onNavigate })}</main>
      <Footer onNavigate={onNavigate} variant={page === "home" ? "minimal" : "full"} />
    </div>
  );
}
