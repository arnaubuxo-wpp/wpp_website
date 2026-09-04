import { getOverrides } from "@/lib/wpp/overrides-server";
import PrivacyClient from "./PrivacyClient";

// Field overrides can change at any time from /admin/paginas — always fetch
// fresh rather than caching a stale build-time snapshot.
export const dynamic = "force-dynamic";

export default async function PrivacyPage() {
  const overrides = await getOverrides("privacy");
  return <PrivacyClient overrides={overrides} />;
}
