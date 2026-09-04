"use client";
// Replaces the original site's Site() router component. That component rendered
// <div><Nav/>{spacer if !home}<main>{Cur}</main><Footer/></div> straight into #site-root
// and swapped `Cur`/`page` on client-side ?page= navigation. Real Next.js routes now own
// that navigation, but this wrapper preserves the exact DOM shape the scroll-reveal
// IIFE depends on (root.firstElementChild -> this outer <div>).
import React from "react";
import { useRouter } from "next/navigation";
import Nav from "./Nav";
import Footer from "./Footer";
import { WPP_LINK } from "@/lib/wpp/tokens";

type WppPage = "home" | "what" | "about" | "contact" | "privacy" | "terms";

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

  return (
    <div>
      <Nav current={page} onNavigate={onNavigate} />
      {page !== "home" && <div style={{ height: 76 }} aria-hidden="true" />}
      <main>{React.cloneElement(children, { onNavigate })}</main>
      <Footer onNavigate={onNavigate} variant={page === "home" ? "minimal" : "full"} />
    </div>
  );
}
