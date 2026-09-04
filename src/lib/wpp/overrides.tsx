'use client';
// Field-override system: OverridesProvider carries a { key: value } map for the
// current page (fetched server-side, see overrides-server.ts, and passed down
// as a plain prop by each page's Server Component wrapper — no client DB call).
// WPP_t/WPP_img read from it; called with no override present they return the
// same fallback the original hand-authored copy used, so a page with no rows
// in page_content renders identically to before this system existed.
import { createContext, useContext } from "react";

const OverridesContext = createContext<Record<string, string>>({});

export function OverridesProvider({
  value,
  children,
}: {
  value: Record<string, string>;
  children: React.ReactNode;
}) {
  return (
    <OverridesContext.Provider value={value}>{children}</OverridesContext.Provider>
  );
}

export function WPP_t(key: string, fallback: string): string {
  const overrides = useContext(OverridesContext);
  return overrides[key] ?? fallback;
}

export function WPP_img(key: string, fallback: string): string {
  const overrides = useContext(OverridesContext);
  return overrides[key] ?? fallback;
}
