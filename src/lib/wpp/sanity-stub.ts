'use client';
// The original site had an unconfigured Sanity CMS pilot (window.WPP_SANITY_PROJECT_ID
// stayed 'YOUR_PROJECT_ID'), so these always fell back to the hardcoded content. We're
// building the custom Postgres-backed field-override system instead (per spec), but the
// Home page still calls these functions, so keep them as no-op fallbacks for now.
// WPP_t / WPP_img are the eventual field-override hooks ("override ?? current value") —
// wiring them to the real overrides table is a later step; today they just return the
// current site copy unchanged, which is exactly what "current value" means.
export function WPP_sanityConfigured() {
  return false;
}

export function WPP_useSanityDeals<T>(fallback: T): T {
  return fallback;
}

export async function WPP_sanityFetch(_query: string): Promise<any[]> {
  return [];
}

export function WPP_t(_key: string, fallback: string): string {
  return fallback;
}

export function WPP_img(_key: string, fallback: string): string {
  return fallback;
}
