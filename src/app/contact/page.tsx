import { getOverrides } from "@/lib/wpp/overrides-server";
import ContactClient from "./ContactClient";

// Field overrides can change at any time from /admin/paginas — always fetch
// fresh rather than caching a stale build-time snapshot.
export const dynamic = "force-dynamic";

export default async function ContactPage() {
  const overrides = await getOverrides("contact");
  return <ContactClient overrides={overrides} />;
}
