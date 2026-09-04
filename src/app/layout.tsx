import type { Metadata } from "next";
import { Inter_Tight, JetBrains_Mono, Newsreader } from "next/font/google";
import "./globals.css";
import { WPP_META } from "@/lib/wpp/tokens";
import { WPP_NEWS_DATA } from "@/lib/wpp/news-data";
import ScrollRevealInstaller from "@/lib/wpp/scroll-reveal";

// Same three typefaces the original site self-hosted (subsetted @font-face files),
// now loaded via next/font/google. See src/lib/wpp/tokens.ts for how components
// reference them (CSS custom properties instead of literal font-family names).
const interTight = Inter_Tight({
  variable: "--font-inter-tight",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  style: ["normal"],
  display: "swap",
});

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.whitepeakpartners.com"),
  title: WPP_META.home.title,
  description: WPP_META.home.desc,
  alternates: { canonical: "/" },
  icons: {
    icon: "/favicon.png",
    apple: "/favicon.png",
  },
  openGraph: {
    title: WPP_META.home.title,
    description: WPP_META.home.desc,
    url: "https://www.whitepeakpartners.com/",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/og-image.png"],
  },
};

export function generateViewport() {
  return { themeColor: "#0f2647" };
}

const ORGANIZATION_JSONLD = {
  "@context": "https://schema.org",
  "@type": ["FinancialService", "ProfessionalService"],
  "@id": "https://www.whitepeakpartners.com/#organization",
  name: "White Peak Partners",
  legalName: "White Peak Partners S.L.",
  url: "https://www.whitepeakpartners.com/",
  foundingDate: "2018",
  description:
    "Boutique M&A and capital-raising advisory firm for European technology companies. Sell-side and buy-side M&A, fundraising, secondary placements, dual-track processes and portfolio optimisation, led by former bulge-bracket bankers, operators and investors.",
  slogan: "A focused advisor, by design.",
  knowsAbout: [
    "Sell-side M&A advisory",
    "Buy-side M&A advisory",
    "Capital raising and fundraising advisory",
    "Secondary placements",
    "Dual-track processes",
    "Portfolio optimisation, divestitures and carve-outs",
    "Technology M&A",
    "Spacetech",
    "Climatetech",
    "Geospatial and location data",
    "SaaS",
    "Consumer subscription",
    "Edge computing",
    "Telecommunications",
    "Martech",
  ],
};

const FAQ_JSONLD = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What does White Peak Partners do?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "White Peak Partners is a boutique M&A and capital advisory firm for European technology companies. It advises founders, boards and investors on sell-side and buy-side M&A, capital raising, secondary placements, dual-track processes and portfolio optimisation.",
      },
    },
    {
      "@type": "Question",
      name: "Who does White Peak Partners work with?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The firm works with founders, management teams, boards and investors of European technology companies, taking on a small number of mandates at any one time so that each is led directly by a partner.",
      },
    },
    {
      "@type": "Question",
      name: "What sectors does White Peak Partners cover?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "White Peak Partners advises technology companies across sectors including spacetech, climatetech, geospatial and location data, SaaS, consumer subscription, edge computing, telecommunications, martech, automotive software and energy.",
      },
    },
    {
      "@type": "Question",
      name: "Where is White Peak Partners based?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "White Peak Partners operates from London, United Kingdom and Barcelona, Spain. The registered entity is White Peak Partners S.L., based in Barcelona.",
      },
    },
    {
      "@type": "Question",
      name: "What deals has White Peak Partners advised on?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Recent White Peak Partners mandates include Open Cosmos ($50m financing round), Carto (a financing round above $80m), the sale of Addvolt to Carrier Global, Incapto (EUR 10m), Nearby Computing (EUR 6.5m), and the sales of Walmeric to Globant and GTMotive to Allianz X. The team has also advised on landmark transactions earlier in their careers at bulge-bracket banks, including GVT (EUR 7.5bn) and Jazztel (EUR 3.4bn).",
      },
    },
    {
      "@type": "Question",
      name: "How is a boutique M&A advisor different from a bulge-bracket bank?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "A boutique M&A advisor offers senior, conflict-free attention on a small number of mandates, with partners directly involved throughout, whereas a bulge-bracket bank typically runs a larger volume of transactions with more junior day-to-day staffing. White Peak Partners pairs bulge-bracket experience with boutique focus.",
      },
    },
    {
      "@type": "Question",
      name: "What is a dual-track process?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "A dual-track process runs a company sale and a fundraising (or IPO) in parallel, keeping both options open until the point a decision must be made. It preserves optionality and can improve terms by maintaining competitive tension between routes.",
      },
    },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${interTight.variable} ${jetbrainsMono.variable} ${newsreader.variable}`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(ORGANIZATION_JSONLD) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_JSONLD) }}
        />
        {/* Hand-picked reading list, inlined for SEO/crawlers — Ridge reads this by id
            instead of fetching, exactly like the original site. */}
        <script
          type="application/json"
          id="wpp-news-data"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(WPP_NEWS_DATA) }}
        />
      </head>
      <body>
        <div id="site-root">{children}</div>
        <ScrollRevealInstaller />
      </body>
    </html>
  );
}
