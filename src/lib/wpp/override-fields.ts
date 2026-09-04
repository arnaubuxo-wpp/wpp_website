// Registry of the editable fields per page, driving the /admin/paginas panel.
// Keys and fallbacks are the exact WPP_t()/WPP_img() calls already present in
// each ported component (see Ridge.tsx / About.tsx) — this file doesn't add
// new override points, it just describes the ones that already exist so the
// admin UI knows what to show, and what an empty field means ("use this
// original copy").
export type OverrideFieldType = "text" | "textarea" | "image";

export interface OverrideField {
  key: string;
  label: string;
  type: OverrideFieldType;
  fallback: string;
  helpText?: string;
}

export interface PageDef {
  slug: string;
  label: string;
  fields: OverrideField[];
}

export const OVERRIDE_PAGES: PageDef[] = [
  {
    slug: "home",
    label: "Home",
    fields: [
      {
        key: "homeSubhead",
        label: "Hero subheading",
        type: "textarea",
        fallback:
          "We sit on your side of the table — through the fundraise, the sale, or the acquisition that defines the company.",
      },
      {
        key: "homeHeroImage",
        label: "Hero background image",
        type: "image",
        fallback: "/assets/hero-mountain-poster.jpg",
        helpText: "Sube una imagen o pega una URL.",
      },
      {
        key: "homeBandImage",
        label: "Mid-page band background image",
        type: "image",
        fallback: "/assets/peak-band.jpg",
        helpText: "Sube una imagen o pega una URL.",
      },
    ],
  },
  {
    slug: "about",
    label: "About us",
    fields: [
      {
        key: "aboutPullquote",
        label: "Pull quote",
        type: "textarea",
        fallback:
          "We work with a small number of clients at any one time — so each mandate gets the senior attention, sector depth and bespoke strategy it deserves.",
      },
    ],
  },
  {
    slug: "what",
    label: "What we do",
    fields: [
      {
        key: "whatHeroLine1",
        label: "Heading, first line",
        type: "text",
        fallback: "Six ways we help",
      },
      {
        key: "whatHeroLine2",
        label: "Heading, second line (italic)",
        type: "text",
        fallback: "One operating model.",
      },
    ],
  },
  {
    slug: "contact",
    label: "Contact",
    fields: [
      {
        key: "contactIntro",
        label: "Intro paragraph (dark panel, under the heading)",
        type: "textarea",
        fallback:
          "The first conversation is held by a partner and is fully confidential. We come prepared with views on your sector and ideas for your company.",
      },
    ],
  },
  {
    slug: "privacy",
    label: "Privacy",
    fields: [
      {
        key: "privacyUpdated",
        label: "“Last updated” date",
        type: "text",
        fallback: "July 2026",
      },
    ],
  },
  {
    slug: "terms",
    label: "Terms",
    fields: [
      {
        key: "termsUpdated",
        label: "“Last updated” date",
        type: "text",
        fallback: "July 2026",
      },
    ],
  },
];

export function getPageDef(slug: string): PageDef | undefined {
  return OVERRIDE_PAGES.find((p) => p.slug === slug);
}
