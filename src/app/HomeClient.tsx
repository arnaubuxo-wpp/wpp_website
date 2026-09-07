"use client";

import SiteChrome from "@/components/SiteChrome";
import Ridge from "@/components/Ridge";
import { OverridesProvider } from "@/lib/wpp/overrides";
import type { AnnouncedDeal } from "@/lib/wpp/deals-types";

export default function HomeClient({
  overrides,
  announcedDeals,
}: {
  overrides: Record<string, string>;
  announcedDeals: AnnouncedDeal[];
}) {
  return (
    <OverridesProvider value={overrides}>
      <SiteChrome page="home">
        <Ridge onNavigate={() => {}} announcedDeals={announcedDeals} />
      </SiteChrome>
    </OverridesProvider>
  );
}
