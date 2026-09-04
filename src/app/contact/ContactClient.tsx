"use client";

import SiteChrome from "@/components/SiteChrome";
import Contact from "@/components/Contact";
import { OverridesProvider } from "@/lib/wpp/overrides";

export default function ContactClient({ overrides }: { overrides: Record<string, string> }) {
  return (
    <OverridesProvider value={overrides}>
      <SiteChrome page="contact">
        <Contact />
      </SiteChrome>
    </OverridesProvider>
  );
}
