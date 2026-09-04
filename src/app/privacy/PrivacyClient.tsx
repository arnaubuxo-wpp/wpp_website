"use client";

import SiteChrome from "@/components/SiteChrome";
import { Privacy } from "@/components/Legal";
import { OverridesProvider } from "@/lib/wpp/overrides";

export default function PrivacyClient({ overrides }: { overrides: Record<string, string> }) {
  return (
    <OverridesProvider value={overrides}>
      <SiteChrome page="privacy">
        <Privacy />
      </SiteChrome>
    </OverridesProvider>
  );
}
