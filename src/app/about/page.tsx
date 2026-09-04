import { getOverrides } from "@/lib/wpp/overrides-server";
import AboutClient from "./AboutClient";

// Field overrides can change at any time from /admin/paginas — always fetch
// fresh rather than caching a stale build-time snapshot.
export const dynamic = "force-dynamic";

export default async function AboutPage() {
  const overrides = await getOverrides("about");
  return <AboutClient overrides={overrides} />;
}
