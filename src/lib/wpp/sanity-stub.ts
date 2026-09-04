'use client';
// The original site had an unconfigured Sanity CMS pilot (window.WPP_SANITY_PROJECT_ID
// stayed 'YOUR_PROJECT_ID'), so these always fell back to the hardcoded content. WPP_t /
// WPP_img are the field-override hooks ("override ?? current value") — they now read from
// the real Postgres-backed overrides table via OverridesContext (see overrides.tsx), fed
// by a server-side fetch per page (see overrides-server.ts) so there's no client-side DB
// round trip. The rest (WPP_sanityConfigured/WPP_useSanityDeals/WPP_sanityFetch) stay
// no-op fallbacks — nothing in the ported site actually uses live Sanity data.
export { WPP_t, WPP_img } from './overrides';

export function WPP_sanityConfigured() {
  return false;
}

export function WPP_useSanityDeals<T>(fallback: T): T {
  return fallback;
}

export async function WPP_sanityFetch(_query: string): Promise<any[]> {
  return [];
}
