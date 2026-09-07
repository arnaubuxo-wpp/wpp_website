// Registry of the editable fields per page, driving the /admin/paginas panel.
// Keys and fallbacks are the exact WPP_t()/WPP_img() calls already present in
// each ported component (see Ridge.tsx / About.tsx / What.tsx / Contact.tsx /
// Legal.tsx) — this file doesn't add new override points, it just describes
// the ones that already exist so the admin UI knows what to show, and what an
// empty field means ("use this original copy").
//
// Scope note: this covers one-off page copy (headings, paragraphs, CTAs,
// hero/band images). Repeated/list content — services, sectors, testimonials,
// deals, legal section bodies — is intentionally not editable yet; that needs
// its own add/remove/reorder admin UI and is a later pass.
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
        key: "homeHeroImage",
        label: "Hero background image",
        type: "image",
        fallback: "/assets/hero-mountain-poster.jpg",
        helpText:
          "La foto/póster de fondo detrás del titular grande, en la primera sección de la portada. Sube una imagen o pega una URL.",
      },
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
        key: "homeHeroCta1",
        label: "Hero button 1",
        type: "text",
        fallback: "Get in touch →",
        helpText: "El primer botón (azul), justo debajo del subtítulo de la portada.",
      },
      {
        key: "homeHeroCta2",
        label: "Hero button 2",
        type: "text",
        fallback: "What we do",
        helpText: "El segundo botón (contorno), al lado del primero en la portada.",
      },
      {
        key: "homeIntroPara1",
        label: "Intro paragraph 1",
        type: "textarea",
        fallback:
          "Based in London and Barcelona, we work exclusively with technology-driven companies — helping European tech businesses unlock growth and generate value for their founders, investors and executives.",
        helpText:
          "El primer párrafo de la sección de introducción, debajo de la portada.",
      },
      {
        key: "homeIntroPara2",
        label: "Intro paragraph 2",
        type: "textarea",
        fallback:
          "We are former senior operators, engineers, VC investors and bulge-bracket bankers. The client list is small, senior partners stay on every mandate, and we treat every engagement as if our own company depended on it.",
        helpText:
          "El segundo párrafo de la sección de introducción, justo debajo del primero.",
      },
      {
        key: "homeServicesHeading",
        label: "Services section heading",
        type: "text",
        fallback:
          "Strategic and corporate finance advisory — usually leading to a transaction",
        helpText:
          "El titular sobre la cuadrícula de servicios (Capital raise, Sell-side M&A, etc.).",
      },
      {
        key: "homeBandImage",
        label: "Mid-page band background image",
        type: "image",
        fallback: "/assets/peak-band.jpg",
        helpText:
          "La franja con foto de fondo a mitad de la portada (entre las secciones de texto). Sube una imagen o pega una URL.",
      },
      {
        key: "homeBandQuote",
        label: "Mid-page band quote",
        type: "textarea",
        fallback:
          "\"We work with a small number of mandates at a time so every client receives a premium, partner-led service.\"",
        helpText: "La cita en cursiva sobre la foto de la franja a mitad de la portada.",
      },
      {
        key: "homeNewsHeading",
        label: "News section heading",
        type: "text",
        fallback: "Hand-picked reading",
        helpText: "El titular sobre la sección de noticias/prensa (\"Hand-picked reading\").",
      },
      {
        key: "homeContactHeading",
        label: "Contact band heading",
        type: "text",
        fallback: "Tell us where your company is going",
        helpText:
          "El titular grande en el panel oscuro de contacto, al final de la portada.",
      },
      {
        key: "homeContactIntro",
        label: "Contact band intro",
        type: "textarea",
        fallback: "First conversation is confidential and obligation-free. We come prepared.",
        helpText:
          "El texto pequeño debajo del titular, en el panel oscuro de contacto al final de la portada.",
      },
      {
        key: "homeContactLabel",
        label: "\"Contact\" label",
        type: "text",
        fallback: "Contact",
        helpText: "La etiqueta pequeña en mayúsculas sobre el email, en el panel de contacto.",
      },
      {
        key: "homeContactEmail",
        label: "Contact email",
        type: "text",
        fallback: "info@whitepeakpartners.com",
        helpText: "El email mostrado en el panel de contacto, al final de la portada.",
      },
      {
        key: "homeLinkedinLabel",
        label: "LinkedIn button label",
        type: "text",
        fallback: "LinkedIn",
        helpText: "El texto del botón de LinkedIn, en el panel de contacto.",
      },
      {
        key: "homeOfficesLabel",
        label: "\"Offices\" label",
        type: "text",
        fallback: "Offices",
        helpText:
          "La etiqueta pequeña en mayúsculas sobre \"London / Barcelona\", en el panel de contacto.",
      },
      {
        key: "homeNewsletterCta",
        label: "Newsletter button",
        type: "text",
        fallback: "Subscribe to our newsletter",
        helpText: "El botón de suscripción a la newsletter, en el panel de contacto.",
      },
      {
        key: "homeClientsHeading",
        label: "Clients section heading",
        type: "text",
        fallback: "Selected companies we've worked with",
        helpText: "El titular sobre el muro de logos de clientes.",
      },
      {
        key: "homeValuesHeading",
        label: "Values section heading",
        type: "text",
        fallback: "Values and culture",
        helpText: "El titular de la sección \"Values and culture\".",
      },
      {
        key: "homeValuesKicker",
        label: "Values section kicker",
        type: "text",
        fallback: "What shapes our work",
        helpText:
          "La frase en cursiva bajo el titular de la sección \"Values and culture\".",
      },
      {
        key: "homeValuesIntro",
        label: "Values section intro",
        type: "textarea",
        fallback:
          "A well-defined set of values and culture characterise our approach — and the work we choose to take on.",
        helpText: "El párrafo introductorio de la sección \"Values and culture\".",
      },
      {
        key: "homeMandatesHeading",
        label: "Mandates section heading",
        type: "text",
        fallback: "Selected mandates",
        helpText: "El titular sobre la vitrina de mandatos/deals seleccionados.",
      },
    ],
  },
  {
    slug: "about",
    label: "About us",
    path: "/about",
    fields: [
      {
        key: "aboutHeroImage",
        label: "Hero background image",
        type: "image",
        fallback: "/assets/hero-mountain-poster.jpg",
        helpText:
          "La foto de fondo detrás del titular, arriba del todo en la página \"About us\". Sube una imagen o pega una URL.",
      },
      {
        key: "aboutHeroLine2",
        label: "Heading, second line",
        type: "text",
        fallback: "by design",
        helpText:
          "La segunda línea del titular grande (\"A focused advisor, by design.\"), arriba del todo en \"About us\".",
      },
      {
        key: "aboutPullquote",
        label: "Pull quote",
        type: "textarea",
        fallback:
          "We work with a small number of clients at any one time — so each mandate gets the senior attention, sector depth and bespoke strategy it deserves.",
        helpText:
          "La cita destacada a la derecha del titular, arriba del todo en la página \"About us\".",
      },
      {
        key: "aboutSectionIntro",
        label: "Section intro line",
        type: "textarea",
        fallback:
          "Most M&A advisors are organised around the deal. We organise around the company.",
        helpText:
          "La primera frase destacada de la sección de texto principal, debajo de la cita.",
      },
      {
        key: "aboutFirmOriginContinued",
        label: "Firm origin story (continued)",
        type: "textarea",
        fallback:
          ", working on transactions in the hundreds of millions. They then set out to build a firm that could bring that experience to the small- and mid-market — with closer collaboration with founders and investors than a bulge-bracket process allows.",
        helpText:
          "Continúa la frase que empieza \"The partners spent their early careers at J.P. Morgan, Bank of America, HSBC and BNP Paribas\" (los nombres de los bancos están fijos, esto es el resto de la frase).",
      },
      {
        key: "aboutDifferentiatorStatement",
        label: "Differentiator statement (opening)",
        type: "textarea",
        fallback:
          "What they learned in bulge-bracket M&A is that the technical excellence of a banker is necessary but not sufficient. The real difference is whether the advisor understands the business well enough to ",
        helpText:
          "El párrafo que empieza \"What they learned in bulge-bracket M&A is that...\". Termina con \"shape it for the moment, not just to price it.\" (ese final está fijo).",
      },
      {
        key: "aboutClosingStatement",
        label: "Closing statement",
        type: "textarea",
        fallback:
          "That is the firm. Fewer mandates than we could take, more time per company than is profitable on paper, and an alignment structure that means we win only when the deal is succesful.",
        helpText: "El último párrafo de la sección de texto principal (\"That is the firm...\").",
      },
      {
        key: "aboutTimelineIntro",
        label: "Timeline section intro",
        type: "textarea",
        fallback:
          "A well-defined set of values and culture characterise our approach — and the work we choose to take on.",
        helpText:
          "El párrafo introductorio justo antes de la línea de tiempo / hitos de la firma.",
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
      {
        key: "whatTestimonialsHeadingPre",
        label: "Testimonials heading (before emphasis)",
        type: "text",
        fallback: "What the ",
        helpText:
          "Primera parte del titular de la sección de testimonios: \"What the [founders] we worked with said.\"",
      },
      {
        key: "whatTestimonialsHeadingEmphasis",
        label: "Testimonials heading (emphasised word)",
        type: "text",
        fallback: "founders",
        helpText:
          "La palabra en cursiva/color lila del titular de testimonios (por defecto \"founders\").",
      },
      {
        key: "whatTestimonialsHeadingPost",
        label: "Testimonials heading (after emphasis)",
        type: "text",
        fallback: " we worked with said",
        helpText: "Última parte del titular de la sección de testimonios.",
      },
      {
        key: "whatSectorsHeading",
        label: "Sectors section heading",
        type: "text",
        fallback: "Tech-driven companies",
        helpText: "El titular sobre la sección de sectores, hacia el final de \"What we do\".",
      },
    ],
  },
  {
    slug: "contact",
    label: "Contact",
    path: "/contact",
    fields: [
      {
        key: "contactHeroHeadingLine1",
        label: "Heading, first line",
        type: "text",
        fallback: "Tell us where your",
        helpText: "La primera línea del titular grande, arriba del todo en \"Contact\".",
      },
      {
        key: "contactHeroHeadingItalic",
        label: "Heading, second line (italic)",
        type: "text",
        fallback: "company is going.",
        helpText:
          "La segunda línea del titular, en cursiva y color lila, justo debajo de la primera.",
      },
      {
        key: "contactIntro",
        label: "Intro paragraph (dark panel, under the heading)",
        type: "textarea",
        fallback:
          "The first conversation is held by a partner and is fully confidential. We come prepared with views on your sector and ideas for your company.",
        helpText:
          "El párrafo bajo el titular, dentro del panel oscuro de la izquierda, arriba del todo en \"Contact\".",
      },
      {
        key: "contactFormHeading",
        label: "Right-panel heading",
        type: "text",
        fallback: "Start the conversation",
        helpText: "El titular del panel derecho (blanco), junto al email de contacto.",
      },
      {
        key: "contactFormIntro",
        label: "Right-panel intro",
        type: "textarea",
        fallback:
          "Write to us with a few lines about your company, the stage you're at, and what you're hoping to achieve.",
        helpText: "El párrafo bajo el titular del panel derecho, antes del botón de email.",
      },
      {
        key: "contactConfidentialNote",
        label: "Confidentiality note (small print, right panel)",
        type: "text",
        fallback: "Anything you share is treated as confidential.",
        helpText: "El texto pequeño bajo el botón de email, en el panel derecho.",
      },
      {
        key: "contactConfidenceNote",
        label: "Confidence note (blue box)",
        type: "textarea",
        fallback:
          "Every conversation is held in confidence. We can countersign an NDA before the first meeting.",
        helpText: "El texto dentro de la caja azul, cerca del final de la página \"Contact\".",
      },
    ],
  },
  {
    slug: "privacy",
    label: "Privacy",
    path: "/privacy",
    fields: [
      {
        key: "privacyTitle",
        label: "Page title",
        type: "text",
        fallback: "Privacy policy",
        helpText: "El titular grande, arriba del todo en la página \"Privacy\".",
      },
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
        key: "termsTitle",
        label: "Page title",
        type: "text",
        fallback: "Terms of use & legal notice",
        helpText: "El titular grande, arriba del todo en la página \"Terms\".",
      },
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
