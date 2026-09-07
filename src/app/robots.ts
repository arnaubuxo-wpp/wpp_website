import type { MetadataRoute } from "next";

// Explicitly welcomes both classic search crawlers and the AI answer-engine
// crawlers that ChatGPT / Perplexity / Claude / Gemini use to build their
// citations and shortlists (see the SEO/GEO playbook: OAI-SearchBot,
// PerplexityBot, ClaudeBot, Google-Extended, GPTBot, etc. all match "*"
// here). /admin and /api are kept out — the CMS login and content editor,
// and the backend routes, have no business being crawled or indexed.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/api"],
      },
    ],
    sitemap: "https://www.whitepeakpartners.com/sitemap.xml",
  };
}
