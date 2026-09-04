"use client";

import SiteChrome from "@/components/SiteChrome";
import What from "@/components/What";
import { OverridesProvider } from "@/lib/wpp/overrides";

export default function WhatClient({ overrides }: { overrides: Record<string, string> }) {
  return (
    <OverridesProvider value={overrides}>
      <SiteChrome page="what">
        <What />
      </SiteChrome>
    </OverridesProvider>
  );
}
