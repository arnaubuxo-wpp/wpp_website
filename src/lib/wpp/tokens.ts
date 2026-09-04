// Design tokens ported verbatim from the original site (window.WPP_T / window.WPP_FONTS /
// window.WPP_GUTTER / window.WPP_LINK / window.WPP_META).
export const WPP_T = {
  bg: '#ffffff',
  panel: '#f7f7f8',
  panelDeep: '#eef0f4',
  ink: '#0a0a0a',
  inkSoft: '#3a3a3c',
  mute: '#6b6b70',
  hair: 'rgba(10,10,10,0.10)',
  blue: '#253362',
  blueDeep: '#18223f',
  blueSoft: '#dfe3f1',
  blueLight: '#92a1d3',
};

// The original site self-hosted subsetted @font-face files under these literal family
// names. We now load the same three typefaces via next/font/google (see layout.tsx),
// which registers them as CSS custom properties on <html> instead of literal names —
// these tokens reference those variables so every inline `fontFamily: F.sans` etc. still
// resolves to the same real webfont, just without re-hosting/subsetting the font files.
export const WPP_FONTS = {
  sans: 'var(--font-inter-tight), "Inter", system-ui, sans-serif',
  mono: 'var(--font-jetbrains-mono), ui-monospace, monospace',
  serif: 'var(--font-newsreader), Georgia, serif',
};

// Fluid horizontal page gutter: 20px on phones → 56px on desktop.
export const WPP_GUTTER = 'clamp(20px, 5vw, 56px)';

// Original was `?page=${page}` (single SPA route). Now real Next.js routes.
export const WPP_LINK = (page: string) => (page === 'home' ? '/' : `/${page}`);

// Per-page <title>/<meta description> (used by generateMetadata in each route).
export const WPP_META: Record<string, { title: string; desc: string }> = {
  home: {
    title: 'White Peak Partners — M&A and Capital Advisory for European Technology',
    desc: 'Boutique M&A and capital-raising advisory for European technology companies — sell-side and buy-side M&A, fundraising, secondaries and dual-track processes, led by former bulge-bracket bankers in London and Barcelona.',
  },
  what: {
    title: 'Technology M&A and Capital Raising — White Peak Partners',
    desc: 'Sell-side and buy-side M&A, capital raising, secondary placements, dual-track processes and portfolio optimisation for European technology companies.',
  },
  about: {
    title: 'About — Former Bulge-Bracket Bankers & Operators | White Peak Partners',
    desc: '40+ years of combined experience and €25bn+ in deal value. A boutique that takes a small number of technology mandates at a time, each led directly by a partner.',
  },
  contact: {
    title: 'Contact White Peak Partners — M&A & Capital Advisory, London & Barcelona',
    desc: 'Start a confidential conversation with a partner about M&A or capital raising for your technology company.',
  },
  privacy: {
    title: 'Privacy policy — White Peak Partners',
    desc: 'How White Peak Partners collects, uses and protects personal data.',
  },
  terms: {
    title: 'Terms of use & legal notice — White Peak Partners',
    desc: 'Terms of use and legal notice for the White Peak Partners website.',
  },
};
