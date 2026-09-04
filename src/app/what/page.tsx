import { getOverrides } from "@/lib/wpp/overrides-server";
import WhatClient from "./WhatClient";

// Field overrides can change at any time from /admin/paginas — always fetch
// fresh rather than caching a stale build-time snapshot.
export const dynamic = "force-dynamic";

export default async function WhatPage() {
  const overrides = await getOverrides("what");
  return <WhatClient overrides={overrides} />;
}
