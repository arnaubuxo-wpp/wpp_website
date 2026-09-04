"use client";

import SiteChrome from "@/components/SiteChrome";
import { Terms } from "@/components/Legal";
import { OverridesProvider } from "@/lib/wpp/overrides";

export default function TermsClient({ overrides }: { overrides: Record<string, string> }) {
  return (
    <OverridesProvider value={overrides}>
      <SiteChrome page="terms">
        <Terms />
      </SiteChrome>
    </OverridesProvider>
  );
}
