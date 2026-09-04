"use client";

import SiteChrome from "@/components/SiteChrome";
import Ridge from "@/components/Ridge";
import { OverridesProvider } from "@/lib/wpp/overrides";

export default function HomeClient({ overrides }: { overrides: Record<string, string> }) {
  return (
    <OverridesProvider value={overrides}>
      <SiteChrome page="home">
        <Ridge onNavigate={() => {}} />
      </SiteChrome>
    </OverridesProvider>
  );
}
