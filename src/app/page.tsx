import { getOverrides } from "@/lib/wpp/overrides-server";
import HomeClient from "./HomeClient";

// Field overrides can change at any time from /admin/paginas — always fetch
// fresh rather than caching a stale build-time snapshot.
export const dynamic = "force-dynamic";

export default async function Home() {
  const overrides = await getOverrides("home");
  return <HomeClient overrides={overrides} />;
}
