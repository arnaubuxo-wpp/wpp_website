import { getOverrides } from "@/lib/wpp/overrides-server";
import { getAnnouncedDeals } from "@/lib/wpp/deals-server";
import { getPressLinks } from "@/lib/wpp/press-server";
import HomeClient from "./HomeClient";

// Field overrides (and announced deals) can change at any time from the
// admin panel — always fetch fresh rather than caching a stale build-time
// snapshot.
export const dynamic = "force-dynamic";

export default async function Home() {
  const [overrides, announcedDeals, pressLinks] = await Promise.all([
    getOverrides("home"),
    getAnnouncedDeals(),
    getPressLinks(),
  ]);
  return (
    <HomeClient
      overrides={overrides}
      announcedDeals={announcedDeals}
      pressLinks={pressLinks}
    />
  );
}
