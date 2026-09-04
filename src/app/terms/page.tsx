import { getOverrides } from "@/lib/wpp/overrides-server";
import TermsClient from "./TermsClient";

// Field overrides can change at any time from /admin/paginas — always fetch
// fresh rather than caching a stale build-time snapshot.
export const dynamic = "force-dynamic";

export default async function TermsPage() {
  const overrides = await getOverrides("terms");
  return <TermsClient overrides={overrides} />;
}
