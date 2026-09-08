"use client";

import SiteChrome from "@/components/SiteChrome";
import Ridge from "@/components/Ridge";
import { OverridesProvider } from "@/lib/wpp/overrides";
import type { AnnouncedDeal } from "@/lib/wpp/deals-types";
import type { PressLink } from "@/lib/wpp/press-types";

export default function HomeClient({
  overrides,
  announcedDeals,
  pressLinks,
}: {
  overrides: Record<string, string>;
  announcedDeals: AnnouncedDeal[];
  pressLinks: PressLink[];
}) {
  return (
    <OverridesProvider value={overrides}>
      <SiteChrome page="home">
        <Ridge onNavigate={() => {}} announcedDeals={announcedDeals} pressLinks={pressLinks} />
      </SiteChrome>
    </OverridesProvider>
  );
}
