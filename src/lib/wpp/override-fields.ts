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
          "The photo/poster behind the big headline, in the first section of the homepage. Upload an image or paste a URL.",
      },
      {
        key: "homeSubhead",
        label: "Hero subheading",
        type: "textarea",
        fallback:
          "We sit on your side of the table — through the fundraise, the sale, or the acquisition that defines the company.",
        helpText:
          "On the homepage, right below the big headline (\"Partners to the founders...\"), near the top of the page.",
      },
      {
        key: "homeHeroCta1",
        label: "Hero button 1",
        type: "text",
        fallback: "Get in touch →",
        helpText: "The first button (blue), right below the homepage subheading.",
      },
      {
        key: "homeHeroCta2",
        label: "Hero button 2",
        type: "text",
        fallback: "What we do",
        helpText: "The second button (outline), next to the first one on the homepage.",
      },
      {
        key: "homeIntroPara1",
        label: "Intro paragraph 1",
        type: "textarea",
        fallback:
          "Based in London and Barcelona, we work exclusively with technology-driven companies — helping European tech businesses unlock growth and generate value for their founders, investors and executives.",
        helpText: "The first paragraph of the intro section, below the hero.",
      },
      {
        key: "homeIntroPara2",
        label: "Intro paragraph 2",
        type: "textarea",
        fallback:
          "We are former senior operators, engineers, VC investors and bulge-bracket bankers. The client list is small, senior partners stay on every mandate, and we treat every engagement as if our own company depended on it.",
        helpText: "The second paragraph of the intro section, right below the first.",
      },
      {
        key: "homeStat1Value",
        label: "Stat 1 — figure",
        type: "text",
        fallback: "40+",
        helpText:
          "The first big number in the blue band below the intro. Type it exactly as it should appear (\"40+\", \"€25bn+\"). It counts up on screen automatically.",
      },
      {
        key: "homeStat1Label",
        label: "Stat 1 — caption",
        type: "text",
        fallback: "Years combined deal experience",
        helpText: "The wording under the first big number, in the blue band.",
      },
      {
        key: "homeStat2Value",
        label: "Stat 2 — figure",
        type: "text",
        fallback: "30+",
        helpText: "The second big number in the blue band. Type it exactly as it should appear.",
      },
      {
        key: "homeStat2Label",
        label: "Stat 2 — caption",
        type: "text",
        fallback: "Mandates closed",
        helpText: "The wording under the second big number, in the blue band.",
      },
      {
        key: "homeStat3Value",
        label: "Stat 3 — figure",
        type: "text",
        fallback: "2",
        helpText: "The third big number in the blue band. Type it exactly as it should appear.",
      },
      {
        key: "homeStat3Label",
        label: "Stat 3 — caption",
        type: "text",
        fallback: "Offices: London, Barcelona",
        helpText: "The wording under the third big number, in the blue band.",
      },
      {
        key: "homeServicesHeading",
        label: "Services section heading",
        type: "text",
        fallback:
          "Strategic and corporate finance advisory — usually leading to a transaction",
        helpText:
          "The heading above the services grid (Capital raise, Sell-side M&A, etc.).",
      },
      {
        key: "homeBandImage",
        label: "Mid-page band background image",
        type: "image",
        fallback: "/assets/peak-band.jpg",
        helpText:
          "The photo band midway down the homepage (between the text sections). Upload an image or paste a URL.",
      },
      {
        key: "homeBandQuote",
        label: "Mid-page band quote",
        type: "textarea",
        fallback:
          "\"We work with a small number of mandates at a time so every client receives a premium, partner-led service.\"",
        helpText: "The italic quote over the band photo midway down the homepage.",
      },
      {
        key: "homeNewsHeading",
        label: "News section heading",
        type: "text",
        fallback: "Hand-picked reading",
        helpText: "The heading above the news/press section (\"Hand-picked reading\").",
      },
      {
        key: "homeContactHeading",
        label: "Contact band heading",
        type: "text",
        fallback: "Tell us where your company is going",
        helpText: "The big heading in the dark contact panel, at the bottom of the homepage.",
      },
      {
        key: "homeContactIntro",
        label: "Contact band intro",
        type: "textarea",
        fallback: "First conversation is confidential and obligation-free. We come prepared.",
        helpText:
          "The small text below the heading, in the dark contact panel at the bottom of the homepage.",
      },
      {
        key: "homeContactLabel",
        label: "\"Contact\" label",
        type: "text",
        fallback: "Contact",
        helpText: "The small uppercase label above the email, in the contact panel.",
      },
      {
        key: "homeContactEmail",
        label: "Contact email",
        type: "text",
        fallback: "info@whitepeakpartners.com",
        helpText: "The email shown in the contact panel, at the bottom of the homepage.",
      },
      {
        key: "homeLinkedinLabel",
        label: "LinkedIn button label",
        type: "text",
        fallback: "LinkedIn",
        helpText: "The text on the LinkedIn button, in the contact panel.",
      },
      {
        key: "homeOfficesLabel",
        label: "\"Offices\" label",
        type: "text",
        fallback: "Offices",
        helpText:
          "The small uppercase label above \"London / Barcelona\", in the contact panel.",
      },
      {
        key: "homeNewsletterCta",
        label: "Newsletter button",
        type: "text",
        fallback: "Subscribe to our newsletter",
        helpText: "The newsletter sign-up button, in the contact panel.",
      },
      {
        key: "homeClientsHeading",
        label: "Clients section heading",
        type: "text",
        fallback: "Selected companies we've worked with",
        helpText: "The heading above the client logo wall.",
      },
      {
        key: "homeValuesHeading",
        label: "Values section heading",
        type: "text",
        fallback: "Values and culture",
        helpText: "The heading of the \"Values and culture\" section.",
      },
      {
        key: "homeValuesKicker",
        label: "Values section kicker",
        type: "text",
        fallback: "What shapes our work",
        helpText: "The italic line under the heading of the \"Values and culture\" section.",
      },
      {
        key: "homeValuesIntro",
        label: "Values section intro",
        type: "textarea",
        fallback:
          "A well-defined set of values and culture characterise our approach — and the work we choose to take on.",
        helpText: "The intro paragraph of the \"Values and culture\" section.",
      },
      {
        key: "homeMandatesHeading",
        label: "Mandates section heading",
        type: "text",
        fallback: "Selected mandates",
        helpText: "The heading above the selected mandates/deals showcase.",
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
          "The background photo behind the heading, at the top of the \"About us\" page. Upload an image or paste a URL.",
      },
      {
        key: "aboutHeroLine2",
        label: "Heading, second line",
        type: "text",
        fallback: "by design",
        helpText:
          "The second line of the big heading (\"A focused advisor, by design.\"), at the top of \"About us\".",
      },
      {
        key: "aboutPullquote",
        label: "Pull quote",
        type: "textarea",
        fallback:
          "We work with a small number of clients at any one time — so each mandate gets the senior attention, sector depth and bespoke strategy it deserves.",
        helpText:
          "The pull quote to the right of the heading, at the top of the \"About us\" page.",
      },
      {
        key: "aboutSectionIntro",
        label: "Section intro line",
        type: "textarea",
        fallback:
          "Most M&A advisors are organised around the deal. We organise around the company.",
        helpText:
          "The first highlighted sentence of the main text section, below the quote.",
      },
      {
        key: "aboutFirmOriginContinued",
        label: "Firm origin story (continued)",
        type: "textarea",
        fallback:
          ", working on transactions in the hundreds of millions. They then set out to build a firm that could bring that experience to the small- and mid-market — with closer collaboration with founders and investors than a bulge-bracket process allows.",
        helpText:
          "Continues the sentence that starts \"The partners spent their early careers at J.P. Morgan, Bank of America, HSBC and BNP Paribas\" (the bank names are fixed — this is the rest of the sentence).",
      },
      {
        key: "aboutDifferentiatorStatement",
        label: "Differentiator statement (opening)",
        type: "textarea",
        fallback:
          "What they learned in bulge-bracket M&A is that the technical excellence of a banker is necessary but not sufficient. The real difference is whether the advisor understands the business well enough to ",
        helpText:
          "The paragraph that starts \"What they learned in bulge-bracket M&A is that...\". It ends with \"shape it for the moment, not just to price it.\" (that ending is fixed).",
      },
      {
        key: "aboutClosingStatement",
        label: "Closing statement",
        type: "textarea",
        fallback:
          "That is the firm. Fewer mandates than we could take, more time per company than is profitable on paper, and an alignment structure that means we win only when the deal is succesful.",
        helpText: "The last paragraph of the main text section (\"That is the firm...\").",
      },
      {
        key: "aboutTimelineIntro",
        label: "Timeline section intro",
        type: "textarea",
        fallback:
          "A well-defined set of values and culture characterise our approach — and the work we choose to take on.",
        helpText: "The intro paragraph just before the firm's timeline/milestones.",
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
        helpText: "The first line of the big heading, at the top of \"What we do\".",
      },
      {
        key: "whatHeroLine2",
        label: "Heading, second line (italic)",
        type: "text",
        fallback: "One operating model.",
        helpText: "The second line of the heading, in italic lilac, right below the first line.",
      },
      {
        key: "whatTestimonialsHeadingPre",
        label: "Testimonials heading (before emphasis)",
        type: "text",
        fallback: "What the ",
        helpText:
          "First part of the testimonials section heading: \"What the [founders] we worked with said.\"",
      },
      {
        key: "whatTestimonialsHeadingEmphasis",
        label: "Testimonials heading (emphasised word)",
        type: "text",
        fallback: "founders",
        helpText: "The italic lilac word in the testimonials heading (default \"founders\").",
      },
      {
        key: "whatTestimonialsHeadingPost",
        label: "Testimonials heading (after emphasis)",
        type: "text",
        fallback: " we worked with said",
        helpText: "Last part of the testimonials section heading.",
      },
      {
        key: "whatSectorsHeading",
        label: "Sectors section heading",
        type: "text",
        fallback: "Tech-driven companies",
        helpText: "The heading above the sectors section, near the end of \"What we do\".",
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
        helpText: "The first line of the big heading, at the top of \"Contact\".",
      },
      {
        key: "contactHeroHeadingItalic",
        label: "Heading, second line (italic)",
        type: "text",
        fallback: "company is going.",
        helpText: "The second line of the heading, in italic lilac, right below the first.",
      },
      {
        key: "contactIntro",
        label: "Intro paragraph (dark panel, under the heading)",
        type: "textarea",
        fallback:
          "The first conversation is held by a partner and is fully confidential. We come prepared with views on your sector and ideas for your company.",
        helpText:
          "The paragraph under the heading, inside the dark panel on the left, at the top of \"Contact\".",
      },
      {
        key: "contactFormHeading",
        label: "Right-panel heading",
        type: "text",
        fallback: "Start the conversation",
        helpText: "The heading of the right-hand (white) panel, next to the contact email.",
      },
      {
        key: "contactFormIntro",
        label: "Right-panel intro",
        type: "textarea",
        fallback:
          "Write to us with a few lines about your company, the stage you're at, and what you're hoping to achieve.",
        helpText: "The paragraph under the right-panel heading, before the email button.",
      },
      {
        key: "contactConfidentialNote",
        label: "Confidentiality note (small print, right panel)",
        type: "text",
        fallback: "Anything you share is treated as confidential.",
        helpText: "The small text below the email button, in the right panel.",
      },
      {
        key: "contactConfidenceNote",
        label: "Confidence note (blue box)",
        type: "textarea",
        fallback:
          "Every conversation is held in confidence. We can countersign an NDA before the first meeting.",
        helpText: "The text inside the blue box, near the bottom of the \"Contact\" page.",
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
        helpText: "The big heading, at the top of the \"Privacy\" page.",
      },
      {
        key: "privacyUpdated",
        label: "“Last updated” date",
        type: "text",
        fallback: "July 2026",
        helpText: "The small date under the \"Privacy policy\" heading, at the top of the page.",
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
        helpText: "The big heading, at the top of the \"Terms\" page.",
      },
      {
        key: "termsUpdated",
        label: "“Last updated” date",
        type: "text",
        fallback: "July 2026",
        helpText:
          "The small date under the \"Terms of use & legal notice\" heading, at the top of the page.",
      },
    ],
  },
];

export function getPageDef(slug: string): PageDef | undefined {
  return OVERRIDE_PAGES.find((p) => p.slug === slug);
}
