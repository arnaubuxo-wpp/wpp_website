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
  /** Path of the live public page, for the "open the real page" links in /admin/paginas. */
  path: string;
  fields: OverrideField[];
}

export const OVERRIDE_PAGES: PageDef[] = [
  {
    slug: "home",
    label: "Home",
    path: "/",
    fields: [
      {
        key: "homeSubhead",
        label: "Hero subheading",
        type: "textarea",
        fallback:
          "We sit on your side of the table — through the fundraise, the sale, or the acquisition that defines the company.",
        helpText:
          "En la portada, justo debajo del titular grande (\"Partners to the founders...\"), al principio de la página.",
      },
      {
        key: "homeHeroImage",
        label: "Hero background image",
        type: "image",
        fallback: "/assets/hero-mountain-poster.jpg",
        helpText:
          "La foto de fondo detrás del titular grande, en la primera sección de la portada. Sube una imagen o pega una URL.",
      },
      {
        key: "homeBandImage",
        label: "Mid-page band background image",
        type: "image",
        fallback: "/assets/peak-band.jpg",
        helpText:
          "La franja con foto de fondo a mitad de la portada (entre las secciones de texto). Sube una imagen o pega una URL.",
      },
    ],
  },
  {
    slug: "about",
    label: "About us",
    path: "/about",
    fields: [
      {
        key: "aboutPullquote",
        label: "Pull quote",
        type: "textarea",
        fallback:
          "We work with a small number of clients at any one time — so each mandate gets the senior attention, sector depth and bespoke strategy it deserves.",
        helpText:
          "La cita destacada a la derecha del titular, arriba del todo en la página \"About us\".",
      },
    ],
  },
  {
    slug: "what",
    label: "What we do",
    path: "/what",
    fields: [
      {
        key: "whatHeroLine1",
        label: "Heading, first line",
        type: "text",
        fallback: "Six ways we help",
        helpText: "La primera línea del titular grande, arriba del todo en \"What we do\".",
      },
      {
        key: "whatHeroLine2",
        label: "Heading, second line (italic)",
        type: "text",
        fallback: "One operating model.",
        helpText:
          "La segunda línea del titular, en cursiva y color lila, justo debajo de la primera línea.",
      },
    ],
  },
  {
    slug: "contact",
    label: "Contact",
    path: "/contact",
    fields: [
      {
        key: "contactIntro",
        label: "Intro paragraph (dark panel, under the heading)",
        type: "textarea",
        fallback:
          "The first conversation is held by a partner and is fully confidential. We come prepared with views on your sector and ideas for your company.",
        helpText:
          "El párrafo bajo el titular, dentro del panel oscuro de la izquierda, arriba del todo en \"Contact\".",
      },
    ],
  },
  {
    slug: "privacy",
    label: "Privacy",
    path: "/privacy",
    fields: [
      {
        key: "privacyUpdated",
        label: "“Last updated” date",
        type: "text",
        fallback: "July 2026",
        helpText:
          "La fecha pequeña bajo el titular \"Privacy policy\", arriba del todo en la página.",
      },
    ],
  },
  {
    slug: "terms",
    label: "Terms",
    path: "/terms",
    fields: [
      {
        key: "termsUpdated",
        label: "“Last updated” date",
        type: "text",
        fallback: "July 2026",
        helpText:
          "La fecha pequeña bajo el titular \"Terms of use & legal notice\", arriba del todo en la página.",
      },
    ],
  },
];

export function getPageDef(slug: string): PageDef | undefined {
  return OVERRIDE_PAGES.find((p) => p.slug === slug);
}
