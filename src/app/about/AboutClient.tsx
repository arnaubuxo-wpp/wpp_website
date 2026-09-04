"use client";

import SiteChrome from "@/components/SiteChrome";
import About from "@/components/About";
import { OverridesProvider } from "@/lib/wpp/overrides";

export default function AboutClient({ overrides }: { overrides: Record<string, string> }) {
  return (
    <OverridesProvider value={overrides}>
      <SiteChrome page="about">
        <About />
      </SiteChrome>
    </OverridesProvider>
  );
}
