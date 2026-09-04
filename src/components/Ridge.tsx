// @ts-nocheck
'use client';
// Ported nearly verbatim from the original site's Home page (window.Ridge / `Ridge` function,
// window.* stripped). This is the largest single component: hero, stats, client wall,
// principles/method, deals marquee, mandates showcase, news, closing CTA.
import React from 'react';
import { WPP_GUTTER, WPP_LINK } from '@/lib/wpp/tokens';
import { WPP_useIsMobile, WPP_useIsNarrow, WPP_REDUCED_MOTION } from '@/lib/wpp/hooks';
import { WPP_DATA } from '@/lib/wpp/data';
import { Reveal as WPP_Reveal, CohortTeaser as WPP_CohortTeaser } from '@/lib/wpp/shared';
import { __R } from '@/lib/wpp/assets';
import { WPP_useSanityDeals, WPP_sanityConfigured, WPP_sanityFetch, WPP_t, WPP_img } from '@/lib/wpp/sanity-stub';

const ridgeTokens = {
  bg: '#ffffff',
  panel: '#f7f7f8',
  panelDeep: '#eef0f4',
  ink: '#0a0a0a',
  inkSoft: '#3a3a3c',
  mute: '#6b6b70',
  hair: 'rgba(10,10,10,0.10)',
  blue: '#253362',
  blueDeep: '#18223f',
  blueSoft: '#dfe3f1'
};
function Ridge({
  onNavigate
}) {
  const T = ridgeTokens;
  const G = WPP_GUTTER;
  const isMobile = WPP_useIsMobile();
  const isNarrow = WPP_useIsNarrow();
  const D = WPP_useSanityDeals(WPP_DATA);
  const nav = onNavigate || (() => {});
  const sans = '"Inter Tight", "Inter", system-ui, sans-serif';
  const mono = '"JetBrains Mono", ui-monospace, monospace';
  const serif = '"Newsreader", Georgia, serif';

  // ---- Inline stats block (matches About WPP, lighter blue) ----
  // CountUp is self-observing — it owns its IntersectionObserver so it survives
  // parent re-renders cleanly (e.g. when async news data lands).
  function CountUp({
    value,
    suffix = '',
    prefix = '',
    duration = 1600
  }) {
    const [n, setN] = React.useState(0);
    const ref = React.useRef(null);
    const startedRef = React.useRef(false);
    React.useEffect(() => {
      const el = ref.current;
      if (!el) return;
      const start = () => {
        if (startedRef.current) return;
        startedRef.current = true;
        let raf, t0;
        const tick = ts => {
          if (t0 == null) t0 = ts;
          const p = Math.min(1, (ts - t0) / duration);
          const eased = 1 - Math.pow(1 - p, 3);
          setN(Math.round(eased * value));
          if (p < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      };
      const obs = new IntersectionObserver(entries => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            start();
            obs.disconnect();
          }
        });
      }, {
        threshold: 0.35
      });
      obs.observe(el);
      return () => obs.disconnect();
    }, [value, duration]);
    return /*#__PURE__*/React.createElement("span", {
      ref: ref
    }, prefix, n, suffix);
  }
  const homeStats = [{
    value: 40,
    suffix: '+',
    label: 'Years combined deal experience'
  }, {
    value: 30,
    suffix: '+',
    label: 'Mandates closed'
  }, {
    value: 2,
    suffix: '',
    label: 'Offices: London, Barcelona'
  }];

  // ---- News / hand-picked reading ----
  // The article list is inlined into Website.html as <script id="wpp-news-data">
  // so it's present in the source HTML for SEO (search crawlers + link previews).
  // We prefer that inline data; fall back to fetching news.json for dev/standalone use.
  const [newsItems, setNewsItems] = React.useState(() => {
    try {
      const el = document.getElementById('wpp-news-data');
      if (el) {
        const data = JSON.parse(el.textContent || '[]');
        if (Array.isArray(data)) {
          return [...data].sort((a, b) => (b.date || '').localeCompare(a.date || '')).slice(0, 3);
        }
      }
    } catch (_) {}
    return [];
  });
  React.useEffect(() => {
    if (newsItems.length > 0) return; // already populated from inline data
    let alive = true;
    fetch('directions/news.json', {
      cache: 'no-store'
    }).then(r => r.ok ? r.json() : []).then(data => {
      if (!alive || !Array.isArray(data)) return;
      const sorted = [...data].sort((a, b) => (b.date || '').localeCompare(a.date || ''));
      setNewsItems(sorted.slice(0, 3));
    }).catch(() => {});
    return () => {
      alive = false;
    };
  }, []);
  // If Sanity is configured, its content takes priority over the inline/json
  // fallback above (team-edited news beats the hardcoded list).
  React.useEffect(() => {
    if (!WPP_sanityConfigured()) return;
    let alive = true;
    WPP_sanityFetch(
      '*[_type == "newsItem"] | order(date desc)[0...3]{title, source, blurb, url, date, company}'
    ).then(rows => {
      if (!alive || !Array.isArray(rows) || rows.length === 0) return;
      setNewsItems(rows);
    }).catch(() => {});
    return () => { alive = false; };
  }, []);
  const StatsBlock = () => /*#__PURE__*/React.createElement("div", {
    "data-wpp-reveal-from": "left",
    style: {
      position: 'relative',
      overflow: 'hidden',
      background: '#253362',
      backgroundImage: `radial-gradient(circle at 50% 50%, rgba(146, 161, 211, 0.30), transparent 70%)`,
      color: '#fff',
      padding: `90px ${G}`
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: '100%',
      maxWidth: 1320,
      margin: '0 auto',
      display: 'flex',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      rowGap: 56
    }
  }, homeStats.map((s, i) => {
    return /*#__PURE__*/React.createElement("div", {
      key: i,
      style: {
        paddingLeft: 'clamp(20px, 4vw, 48px)',
        paddingRight: 'clamp(12px, 3vw, 32px)',
        borderLeft: '1px solid rgba(255,255,255,0.28)'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: serif,
        fontSize: 'clamp(56px, 8vw, 96px)',
        fontWeight: 400,
        letterSpacing: -2,
        lineHeight: 1,
        color: '#fff'
      }
    }, /*#__PURE__*/React.createElement(CountUp, {
      value: s.value,
      suffix: s.suffix
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 18,
        fontSize: 15,
        color: 'rgba(255,255,255,0.9)',
        lineHeight: 1.45,
        maxWidth: 320
      }
    }, s.label));
  })));
  const Tag = ({
    children,
    color = T.mute
  }) => /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: mono,
      fontSize: 11,
      letterSpacing: 1.4,
      textTransform: 'uppercase',
      color
    }
  }, children);
  const Reveal = WPP_Reveal;
  const CohortTeaser = WPP_CohortTeaser;

  // Reusable simple ridge motif
  const Ridges = ({
    w = 600,
    h = 80,
    color = T.hair
  }) => /*#__PURE__*/React.createElement("svg", {
    width: w,
    height: h,
    viewBox: `0 0 ${w} ${h}`
  }, [8, 18, 30, 44, 60].map((y, i) => /*#__PURE__*/React.createElement("path", {
    key: i,
    d: `M0 ${y + Math.sin(i) * 2} Q ${w / 4} ${y - 4 - i * 1.5}, ${w / 2} ${y} T ${w} ${y - 2}`,
    stroke: color,
    strokeWidth: i === 4 ? 1.2 : 0.8,
    fill: "none",
    opacity: 1 - i * 0.12
  })));

  // Silent ambient video (item 3). The "ping-pong" is now baked into the file
  // itself (forward + reversed frames pre-rendered with ffmpeg), so we simply
  // loop natively — no per-frame currentTime seeking, no stutter, no CPU burn.
  // preload="metadata" + poster keeps the initial payload light; reduced-motion
  // users (item 7) get the still poster instead of autoplaying video.
  const Video = ({
    src,
    poster,
    style,
    children,
    overlay = 0.35
  }) => {
    const reduced = WPP_REDUCED_MOTION;
    const vref = React.useRef(null);
    React.useEffect(() => {
      if (reduced) return;
      const v = vref.current;
      if (!v) return;
      const safePlay = () => {
        const p = v.play();
        if (p && p.catch) p.catch(() => {});
      };
      const io = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting && !document.hidden) safePlay();else v.pause();
      }, {
        threshold: 0.05
      });
      io.observe(v);
      const onVis = () => {
        if (document.hidden) v.pause();
      };
      document.addEventListener('visibilitychange', onVis);
      return () => {
        io.disconnect();
        document.removeEventListener('visibilitychange', onVis);
      };
    }, [reduced]);
    return /*#__PURE__*/React.createElement("div", {
      "data-override-key": "homeHeroImage",
      style: {
        position: 'relative',
        overflow: 'hidden',
        background: '#000',
        ...style
      }
    }, reduced ? /*#__PURE__*/React.createElement("img", {
      src: poster,
      alt: "",
      "aria-hidden": "true",
      style: {
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        objectFit: 'cover'
      }
    }) : /*#__PURE__*/React.createElement("video", {
      ref: vref,
      src: src,
      poster: poster,
      autoPlay: true,
      muted: true,
      loop: true,
      playsInline: true,
      preload: "metadata",
      "aria-hidden": "true",
      style: {
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        objectFit: 'cover'
      }
    }), overlay > 0 && /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        inset: 0,
        background: `linear-gradient(180deg, rgba(10,15,40,${overlay * 0.5}) 0%, rgba(10,15,40,${overlay}) 100%)`
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'relative',
        height: '100%'
      }
    }, children));
  };

  // "Mountain journey" — drone-through-mountains aesthetic.
  // (The external Mixkit band-video URL was removed: it was unused dead code,
  // and third-party-hosted media can disappear or be blocked at any time.)
  const heroVideo = __R('assets/hero-mountain.mp4');

  // Logo + name lockup: small contained logo on the left, company name on the right.
  const DealLogo = ({
    label,
    logoFile,
    logoUrl,
    big = false
  }) => {
    const logoSize = big ? 56 : 40;
    const nameSize = big ? 28 : 18;
    return /*#__PURE__*/React.createElement("div", {
      style: {
        background: '#fff',
        border: `1px solid ${T.hair}`,
        borderRadius: 4,
        padding: big ? '18px 20px' : '12px 14px',
        display: 'flex',
        alignItems: 'center',
        gap: big ? 16 : 12,
        minHeight: big ? 96 : 64
      }
    }, (logoUrl || logoFile) ? /*#__PURE__*/React.createElement("div", {
      style: {
        width: logoSize,
        height: logoSize,
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }
    }, /*#__PURE__*/React.createElement("img", {
      src: logoUrl || __R(`assets/deal-logos/${logoFile}`),
      alt: label,
      style: {
        maxWidth: '100%',
        maxHeight: '100%',
        objectFit: 'contain',
        display: 'block'
      }
    })) : null, /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: sans,
        fontSize: nameSize,
        fontWeight: 600,
        letterSpacing: -0.3,
        color: T.ink,
        lineHeight: 1.15
      }
    }, label));
  };
  const Mark = () => /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 14
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: __R('assets/logo.png'),
    alt: "White Peak Partners",
    style: {
      height: 36,
      display: 'block'
    }
  }));
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: T.bg,
      color: T.ink,
      fontFamily: sans,
      fontFeatureSettings: '"ss01","cv11"'
    }
  }, /*#__PURE__*/React.createElement(Video, {
    src: heroVideo,
    poster: WPP_img('homeHeroImage', __R('assets/hero-mountain-poster.jpg')),
    overlay: 0.5,
    style: {
      height: 'min(820px, 100svh)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-end',
      padding: `0 ${G} 120px`,
      color: '#fff'
    }
  }, /*#__PURE__*/React.createElement("h1", {
    style: {
      fontSize: 'clamp(40px, 7.2vw, 92px)',
      lineHeight: 0.98,
      letterSpacing: -2.2,
      margin: 0,
      fontWeight: 500,
      maxWidth: 1240,
      textWrap: 'balance'
    }
  }, "Partners to the ", /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: serif,
      fontStyle: 'italic',
      fontWeight: 400,
      color: '#92a1d3'
    }
  }, "founders"), " and ", /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: serif,
      fontStyle: 'italic',
      fontWeight: 400,
      color: '#92a1d3'
    }
  }, "teams"), " building Europe's best technology companies", /*#__PURE__*/React.createElement("span", {
    style: {
      color: '#92a1d3'
    }
  }, ".")), /*#__PURE__*/React.createElement("div", {
    "data-override-key": "homeSubhead",
    style: {
      marginTop: 32,
      fontSize: 18,
      lineHeight: 1.55,
      maxWidth: 720,
      opacity: 0.9
    }
  }, WPP_t('homeSubhead', "We sit on your side of the table — through the fundraise, the sale, or the acquisition that defines the company.")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 16,
      marginTop: 40,
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement("a", {
    href: WPP_LINK('contact'),
    onClick: e => {
      e.preventDefault();
      nav('contact');
    },
    style: {
      padding: '18px 30px',
      background: T.blue,
      color: '#fff',
      borderRadius: 999,
      fontSize: 15,
      fontWeight: 600,
      textDecoration: 'none',
      boxShadow: '0 8px 24px rgba(29,78,216,0.4)',
      whiteSpace: 'nowrap'
    }
  }, "Get in touch →"), /*#__PURE__*/React.createElement("a", {
    href: WPP_LINK('what'),
    onClick: e => {
      e.preventDefault();
      nav('what');
    },
    style: {
      padding: '18px 30px',
      background: 'transparent',
      border: '1px solid rgba(255,255,255,0.5)',
      color: '#fff',
      borderRadius: 999,
      fontSize: 15,
      fontWeight: 600,
      textDecoration: 'none',
      whiteSpace: 'nowrap'
    }
  }, "What we do")), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 40
    }
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: `120px ${G} 100px`
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1180
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      fontFamily: serif,
      fontSize: 'clamp(34px, 5.4vw, 68px)',
      lineHeight: 1.08,
      letterSpacing: -1.6,
      fontWeight: 400,
      margin: 0,
      color: T.ink,
      textWrap: 'balance'
    }
  }, "A strategic and financial advisory boutique built around ", /*#__PURE__*/React.createElement("strong", {
    style: {
      fontWeight: 700,
      color: T.ink
    }
  }, "founders, technology and the long view", /*#__PURE__*/React.createElement("span", {
    style: {
      color: T.blue
    }
  }, "."))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
      gap: 'clamp(28px, 5vw, 64px)',
      marginTop: 56,
      maxWidth: 1080
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 17,
      lineHeight: 1.6,
      color: T.inkSoft
    }
  }, "Based in London and Barcelona, we work exclusively with technology-driven companies — helping European tech businesses unlock growth and generate value for their founders, investors and executives."), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 17,
      lineHeight: 1.6,
      color: T.inkSoft
    }
  }, "We are former senior operators, engineers, VC investors and bulge-bracket bankers. The client list is small, senior partners stay on every mandate, and we treat every engagement as if our own company depended on it.")))), /*#__PURE__*/React.createElement(StatsBlock, null), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: `60px ${G} 100px`
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 64
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      fontSize: 'clamp(28px, 4vw, 44px)',
      letterSpacing: -1,
      lineHeight: 1.1,
      margin: 0,
      fontWeight: 500,
      maxWidth: 900
    }
  }, "Strategic and corporate finance advisory — usually leading to a transaction", /*#__PURE__*/React.createElement("span", {
    style: {
      color: T.blue
    }
  }, "."))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: isMobile ? '1fr' : isNarrow ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)',
      gap: 16
    }
  }, [['Capital raise', 'Seed, Series A/B, growth equity. Investor curation across VC, PE, corporates and family offices.'], ['Sell-side M&A', 'Single-buyer or competitive — whichever protects value best. Full execution from mandate to close.'], ['Buy-side M&A', 'Targeted searches and disciplined execution. Acquisitions that compound the strategy, not distract from it.'], ['Secondary placements', 'Liquidity for founders and early investors without disrupting the company\u2019s trajectory.'], ['Dual-track processes', 'Sale and fundraise prepared in parallel. Optionality preserved until the moment it must collapse.'], ['Portfolio optimisation', 'Divestment, carve-outs, and corporate scouting & investment programmes.']].map(([k, v], i) => /*#__PURE__*/React.createElement(HomeServiceCard, {
    key: k,
    k: k,
    v: v,
    i: i,
    T: T,
    serif: serif,
    nav: nav
  })))), /*#__PURE__*/React.createElement("div", {
    "data-wpp-reveal-from": "right",
    style: {
      padding: `100px ${G}`,
      background: T.panel,
      borderTop: `1px solid ${T.hair}`,
      borderBottom: `1px solid ${T.hair}`
    }
  }, /*#__PURE__*/React.createElement(PrinciplesAndMethod, {
    T: T,
    mono: mono,
    serif: serif,
    sans: sans
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: `60px ${G} 80px`
    }
  }, /*#__PURE__*/React.createElement("div", {
    "data-override-key": "homeBandImage",
    style: {
      position: 'relative',
      minHeight: 560,
      borderRadius: 4,
      overflow: 'hidden',
      backgroundImage: `url('${WPP_img('homeBandImage', __R('directions/assets/peak-band.jpg'))}')`,
      backgroundSize: 'cover',
      backgroundPosition: 'center 75%'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      background: 'linear-gradient(180deg, rgba(0,0,0,0.05) 40%, rgba(0,0,0,0.55) 100%)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      minHeight: 560,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-end',
      padding: '60px 48px',
      color: '#fff'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: serif,
      fontSize: 'clamp(26px, 4vw, 44px)',
      fontStyle: 'italic',
      fontWeight: 400,
      letterSpacing: -0.6,
      maxWidth: 880,
      lineHeight: 1.25,
      color: '#fff',
      textShadow: '0 2px 24px rgba(0,0,0,0.5)'
    }
  }, "\"We work with a small number of mandates at a time so every client receives a premium, partner-led service.\"")))), /*#__PURE__*/React.createElement(ClientWall, {
    T: T,
    mono: mono,
    serif: serif,
    sans: sans
  }), /*#__PURE__*/React.createElement(MandatesShowcase, {
    D: D,
    T: T,
    mono: mono,
    serif: serif,
    sans: sans,
    DealLogo: DealLogo
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: `80px ${G} 100px`,
      background: '#ffffff',
      color: T.ink
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 48
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      fontSize: 'clamp(28px, 4vw, 44px)',
      letterSpacing: -1,
      margin: 0,
      fontWeight: 500,
      maxWidth: 800
    }
  }, "Hand-picked reading", /*#__PURE__*/React.createElement("span", {
    style: {
      color: T.blue
    }
  }, "."))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: isMobile ? '1fr' : isNarrow ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)',
      gap: 24
    }
  }, newsItems.map((item, i) => {
    // Pretty-print the publication date for display, but keep the ISO value
    // on the <time> element for crawlers and rich-result parsers.
    let prettyDate = '';
    if (item.date) {
      const d = new Date(item.date + 'T00:00:00Z');
      if (!isNaN(d)) {
        prettyDate = d.toLocaleDateString('en-GB', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
          timeZone: 'UTC'
        });
      }
    }
    const inner = /*#__PURE__*/React.createElement("article", {
      itemScope: true,
      itemType: "https://schema.org/NewsArticle"
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: mono,
        fontSize: 11,
        letterSpacing: 1.4,
        textTransform: 'uppercase',
        color: T.blue
      }
    }, "Source · ", /*#__PURE__*/React.createElement("span", {
      itemProp: "publisher",
      itemScope: true,
      itemType: "https://schema.org/Organization"
    }, /*#__PURE__*/React.createElement("span", {
      itemProp: "name"
    }, item.source))), /*#__PURE__*/React.createElement("h3", {
      itemProp: "headline",
      style: {
        fontSize: 22,
        letterSpacing: -0.4,
        fontWeight: 500,
        lineHeight: 1.25,
        margin: '14px 0 0',
        fontFamily: serif
      }
    }, item.title), /*#__PURE__*/React.createElement("p", {
      itemProp: "description",
      style: {
        fontSize: 14,
        color: T.inkSoft,
        margin: '14px 0 0',
        lineHeight: 1.55
      }
    }, item.blurb), /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 20,
        fontFamily: mono,
        fontSize: 12,
        color: T.ink,
        letterSpacing: 0.6,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 12
      }
    }, /*#__PURE__*/React.createElement("span", null, "READ MORE →"), prettyDate && /*#__PURE__*/React.createElement("time", {
      itemProp: "datePublished",
      dateTime: item.date,
      style: {
        color: T.inkSoft,
        letterSpacing: 0.4
      }
    }, prettyDate)), item.url && /*#__PURE__*/React.createElement("link", {
      itemProp: "url",
      href: item.url
    }));
    return item.url ? /*#__PURE__*/React.createElement("a", {
      key: i,
      href: item.url,
      target: "_blank",
      rel: "noopener",
      style: {
        display: 'block',
        color: 'inherit',
        textDecoration: 'none'
      }
    }, inner) : /*#__PURE__*/React.createElement("div", {
      key: i
    }, inner);
  }))), /*#__PURE__*/React.createElement("div", {
    "data-wpp-no-reveal": "1",
    style: {
      height: 140,
      background: 'linear-gradient(180deg, #ffffff 0%, #f5f5f5 18%, #b8b8b8 42%, #4a4a4a 70%, #1a1a1a 88%, #0a0a0a 100%)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    "data-wpp-no-reveal": "1",
    style: {
      padding: `96px ${G} 96px`,
      background: T.ink,
      color: '#fff'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: isMobile ? '1fr' : isNarrow ? 'repeat(2, 1fr)' : '1.4fr 1fr 1fr',
      gap: 'clamp(32px, 5vw, 64px)',
      alignItems: 'start'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h2", {
    style: {
      fontSize: 'clamp(34px, 5.4vw, 68px)',
      letterSpacing: -1.6,
      lineHeight: 1.02,
      margin: 0,
      fontWeight: 500,
      maxWidth: 520
    }
  }, "Tell us where your company is going", /*#__PURE__*/React.createElement("span", {
    style: {
      color: T.blue
    }
  }, ".")), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 16,
      lineHeight: 1.6,
      opacity: 0.7,
      marginTop: 24,
      maxWidth: 460
    }
  }, "First conversation is confidential and obligation-free. We come prepared.")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: mono,
      fontSize: 11,
      letterSpacing: 1.4,
      color: '#92a1d3',
      textTransform: 'uppercase',
      marginBottom: 18
    }
  }, "Contact"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 14,
      lineHeight: 1.7,
      opacity: 0.85,
      marginBottom: 18
    }
  }, "info@whitepeakpartners.com"), /*#__PURE__*/React.createElement("a", {
    href: "https://www.linkedin.com/company/white-peak-partners",
    target: "_blank",
    rel: "noreferrer",
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 10,
      padding: '10px 14px',
      border: '1px solid rgba(255,255,255,0.25)',
      borderRadius: 8,
      color: '#fff',
      textDecoration: 'none',
      fontSize: 13,
      fontWeight: 500,
      background: 'rgba(255,255,255,0.04)'
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "18",
    height: "18",
    viewBox: "0 0 24 24",
    fill: "currentColor",
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.13 1.45-2.13 2.94v5.67H9.36V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.38-1.85 3.61 0 4.28 2.38 4.28 5.47v6.27zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0z"
  })), /*#__PURE__*/React.createElement("span", null, "LinkedIn"))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: mono,
      fontSize: 11,
      letterSpacing: 1.4,
      color: '#92a1d3',
      textTransform: 'uppercase',
      marginBottom: 18
    }
  }, "Offices"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 14,
      lineHeight: 1.7,
      opacity: 0.85,
      marginBottom: 22
    }
  }, "London", /*#__PURE__*/React.createElement("br", null), "Barcelona"), /*#__PURE__*/React.createElement("a", {
    href: "https://whitepeakpartners.us13.list-manage.com/subscribe?u=9bad57db761ffe74716f06ed2&id=add5969a23",
    target: "_blank",
    rel: "noreferrer",
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 10,
      padding: '10px 14px',
      background: T.blue,
      color: '#fff',
      borderRadius: 999,
      fontSize: 13,
      fontWeight: 600,
      textDecoration: 'none'
    }
  }, "Subscribe to our newsletter")))));
}

// ---- Home "What we do" card ----
// Extracted into a proper component (item 6): the previous code called
// React.useState inside a .map() callback — a Rules of Hooks violation that
// only worked because the array was static. Hooks now live in a real component.
function HomeServiceCard({
  k,
  v,
  i,
  T,
  serif,
  nav
}) {
  const [hover, setHover] = React.useState(false);
  // Map home-page labels to PageWhat service keys (one diff: "Dual-track processes" → "Dual-track")
  const keyMap = {
    'Dual-track processes': 'Dual-track'
  };
  const targetKey = keyMap[k] || k;
  const serviceSlug = targetKey.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  return /*#__PURE__*/React.createElement("a", {
    href: `?page=what&service=${serviceSlug}`,
    onClick: e => {
      e.preventDefault();
      nav('what', {
        params: {
          service: serviceSlug
        }
      });
    },
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    onFocus: () => setHover(true),
    onBlur: () => setHover(false),
    style: {
      background: hover ? T.blue : T.bg,
      border: `1px solid ${hover ? T.blue : T.hair}`,
      borderRadius: 4,
      padding: '24px 22px 22px',
      minHeight: 180,
      display: 'flex',
      flexDirection: 'column',
      transition: 'background 280ms ease, border-color 280ms ease, transform 380ms cubic-bezier(.7,.05,.2,1)',
      cursor: 'pointer',
      textDecoration: 'none',
      transform: hover ? 'translateY(-2px)' : 'translateY(0)',
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'baseline',
      gap: 14,
      marginBottom: 12
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: serif,
      fontSize: 38,
      fontStyle: 'italic',
      color: hover ? '#fff' : T.blue,
      lineHeight: 1,
      letterSpacing: -0.5,
      transition: 'color 280ms ease'
    }
  }, i + 1), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 21,
      letterSpacing: -0.4,
      fontWeight: 500,
      lineHeight: 1.2,
      color: hover ? '#fff' : T.ink,
      transition: 'color 280ms ease'
    }
  }, k)), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 15.5,
      lineHeight: 1.6,
      color: hover ? 'rgba(255,255,255,0.92)' : T.inkSoft,
      flex: 1,
      transition: 'color 280ms ease'
    }
  }, v), /*#__PURE__*/React.createElement("span", {
    "aria-hidden": true,
    style: {
      position: 'absolute',
      top: 18,
      right: 18,
      width: 28,
      height: 28,
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: hover ? '#fff' : T.blue,
      opacity: hover ? 1 : 0.4,
      transform: hover ? 'translate(2px,-2px)' : 'translate(0,0)',
      transition: 'transform 380ms cubic-bezier(.7,.05,.2,1), opacity 280ms ease, color 280ms ease'
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "16",
    height: "16",
    viewBox: "0 0 20 20",
    fill: "none"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M5 15L15 5",
    stroke: "currentColor",
    strokeWidth: "1.5",
    strokeLinecap: "round"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M7 5H15V13",
    stroke: "currentColor",
    strokeWidth: "1.5",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }))));
}

// ---- Client wall ----
// Grid of all client logos shown grayscale, fading to color on hover.
// Logos reveal in a staggered cascade as the section enters view.
function ClientWall({
  T,
  mono,
  serif,
  sans
}) {
  const G = WPP_GUTTER;
  const isMobile = WPP_useIsMobile();
  const isNarrow = WPP_useIsNarrow();
  const rootRef = React.useRef(null);
  const [shown, setShown] = React.useState(false);
  React.useEffect(() => {
    if (!rootRef.current) return;
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          setShown(true);
          obs.disconnect();
        }
      });
    }, {
      threshold: 0.08,
      rootMargin: '0px 0px -8% 0px'
    });
    obs.observe(rootRef.current);
    return () => obs.disconnect();
  }, []);

  // ordered for visual rhythm — wide logos balanced against tall ones
  const logos = [{
    name: 'Open Cosmos',
    src: 'assets/clients/open-cosmos.png'
  }, {
    name: 'Carto',
    src: 'assets/clients/carto-mark.png'
  }, {
    name: 'Typeform',
    src: 'assets/clients/typeform.png'
  }, {
    name: 'Addvolt',
    src: 'assets/clients/addvolt-mark.png'
  }, {
    name: 'PromoFarma',
    src: 'assets/clients/promofarma.png'
  }, {
    name: 'Housfy',
    src: 'assets/clients/housfy.png'
  }, {
    name: 'Stayforlong',
    src: 'assets/clients/stayforlong.png'
  }, {
    name: 'GTMotive',
    src: 'assets/clients/gtmotive-mark.png'
  }, {
    name: 'Walmeric',
    src: 'assets/clients/walmeric-mark.png'
  }, {
    name: 'Nearby Computing',
    src: 'assets/clients/nearby-computing.png',
    boost: true
  }, {
    name: 'Incapto',
    src: 'assets/clients/incapto.png'
  }, {
    name: 'Lucera',
    src: 'assets/clients/lucera.png'
  }, {
    name: 'Unnax',
    src: 'assets/clients/unnax.png'
  }, {
    name: 'Fintonic',
    src: 'assets/clients/fintonic.png'
  }, {
    name: 'Blueliv',
    src: 'assets/clients/blueliv.png'
  }, {
    name: 'ABA English',
    src: 'assets/clients/aba-english.png'
  }, {
    name: 'iContainers',
    src: 'assets/clients/icontainers.png'
  }, {
    name: 'Electronic ID',
    src: 'assets/clients/electronic-id.png',
    boost: true
  }, {
    name: 'Coconut',
    src: 'assets/clients/coconut.png'
  }, {
    name: 'Datumize',
    src: 'assets/clients/datumize.png'
  }, {
    name: 'Ticketea',
    src: 'assets/clients/ticketea.png'
  }, {
    name: 'Minube',
    src: 'assets/clients/minube.png'
  }, {
    name: 'MailTrack',
    src: 'assets/clients/mailtrack.png',
    boost: true
  }, {
    name: 'Adglow',
    src: 'assets/clients/adglow.png'
  }];
  const stagger = (i, base = 0) => ({
    opacity: shown ? 1 : 0,
    transform: shown ? 'translateY(0)' : 'translateY(14px)',
    transition: `opacity 700ms cubic-bezier(.2,.7,.2,1) ${base + i * 50}ms, transform 700ms cubic-bezier(.2,.7,.2,1) ${base + i * 50}ms`
  });
  return /*#__PURE__*/React.createElement("div", {
    ref: rootRef,
    style: {
      padding: `90px ${G} 30px`,
      background: '#ffffff'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 40,
      paddingBottom: 22,
      borderBottom: `1px solid ${T.hair}`,
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      fontSize: 'clamp(28px, 4vw, 44px)',
      letterSpacing: -1.2,
      margin: 0,
      fontWeight: 500,
      lineHeight: 1,
      ...stagger(1)
    }
  }, "Selected companies we've worked with", /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: serif,
      fontStyle: 'italic',
      fontWeight: 400,
      color: '#92a1d3'
    }
  }, ".")), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
      height: 1,
      background: T.hair,
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      background: `linear-gradient(90deg, ${T.ink} 0%, ${T.ink} 40%, ${T.blue} 80%, ${T.blue} 100%)`,
      transformOrigin: 'left center',
      transform: shown ? 'scaleX(1)' : 'scaleX(0)',
      transition: 'transform 1400ms cubic-bezier(.2,.7,.2,1) 250ms'
    }
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: isMobile ? 'repeat(3, 1fr)' : isNarrow ? 'repeat(4, 1fr)' : 'repeat(6, 1fr)',
      gridAutoRows: '108px',
      borderTop: `1px solid ${T.hair}`,
      borderLeft: `1px solid ${T.hair}`
    }
  }, logos.map((logo, i) => /*#__PURE__*/React.createElement("div", {
    key: logo.name,
    className: "wpp-client-cell",
    title: logo.name,
    style: {
      borderRight: `1px solid ${T.hair}`,
      borderBottom: `1px solid ${T.hair}`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px 24px',
      position: 'relative',
      overflow: 'hidden',
      ...stagger(i, 150)
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: __R(logo.src),
    alt: logo.name,
    loading: "lazy",
    className: "wpp-client-mark",
    style: {
      maxWidth: logo.boost ? '92%' : '78%',
      maxHeight: logo.boost ? '78%' : '64%',
      objectFit: 'contain',
      display: 'block'
    }
  }), /*#__PURE__*/React.createElement("span", {
    className: "wpp-client-hover",
    "aria-hidden": "true"
  })))));
}

// ---- Values and culture ----
// Single-column composition: scroll-driven blue trail draws downward as the user reads.
// Each dot lights up when the viewport "scan line" reaches it, and a glowing leading edge
// traces along the line for a subtle but sophisticated touch.
function PrinciplesAndMethod({
  T,
  mono,
  serif,
  sans
}) {
  const isNarrow = WPP_useIsNarrow();
  const rootRef = React.useRef(null);
  const listRef = React.useRef(null);
  const dotRefs = React.useRef([]);
  const [shown, setShown] = React.useState(false);
  const [progress, setProgress] = React.useState(0); // 0..1 — fraction of the list passed by the scan line
  const [activeIdx, setActiveIdx] = React.useState(-1);

  // First-time reveal of the static header content
  React.useEffect(() => {
    if (!rootRef.current) return;
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          setShown(true);
          obs.disconnect();
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -8% 0px'
    });
    obs.observe(rootRef.current);
    return () => obs.disconnect();
  }, []);

  // Scroll-driven progress + active-dot tracking
  React.useEffect(() => {
    let raf = 0;
    let active = false;
    const update = () => {
      raf = 0;
      const list = listRef.current;
      if (!list) return;
      const rect = list.getBoundingClientRect();
      const vh = innerHeight || document.documentElement.clientHeight;
      const scan = vh * 0.58; // scan line slightly below center
      const p = (scan - rect.top) / Math.max(1, rect.height);
      setProgress(Math.max(0, Math.min(1, p)));
      // Active index — last dot whose center has passed the scan line
      let last = -1;
      for (let i = 0; i < dotRefs.current.length; i++) {
        const el = dotRefs.current[i];
        if (!el) continue;
        const r = el.getBoundingClientRect();
        if (r.top + r.height / 2 <= scan) last = i;
      }
      setActiveIdx(last);
    };
    // Only do this work while the section is near the viewport. Running
    // getBoundingClientRect + setState on every scroll frame across the whole
    // page (even when this section is far away) is what made scrolling heavy.
    const onScroll = () => {
      if (active && !raf) raf = requestAnimationFrame(update);
    };
    const io = new IntersectionObserver(entries => {
      active = entries[0].isIntersecting;
      if (active) update();
    }, {
      rootMargin: '25% 0px 25% 0px'
    });
    if (rootRef.current) io.observe(rootRef.current);
    addEventListener('scroll', onScroll, {
      passive: true
    });
    addEventListener('resize', onScroll);
    update();
    return () => {
      io.disconnect();
      removeEventListener('scroll', onScroll);
      removeEventListener('resize', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);
  const stagger = (i, base = 0, dy = 18) => ({
    opacity: shown ? 1 : 0,
    transform: shown ? 'translateY(0)' : `translateY(${dy}px)`,
    transition: `opacity 800ms cubic-bezier(.2,.7,.2,1) ${base + i * 90}ms, transform 800ms cubic-bezier(.2,.7,.2,1) ${base + i * 90}ms`
  });

  // Brand copy from the firm's existing materials.
  const valueItems = [['Hands-on', "We dig deep into our clients' opportunities, challenges and metrics — including our own analytical tools for cohorts — to present a compelling narrative."], ['Holistic', 'Advice not only on financial matters but on the strategic issues that enhance the final outcome — anticipating questions from acquirers and investors before they raise them.'], ['Experts', 'We work only in tech sectors where we bring real expertise and can add tangible value to our clients.'], ['Results-driven and fully committed', 'Fully aligned with the success of the transaction and the main strategic objectives of the company.'], ['Aligned with shareholders and founders', 'Focused on positive results for the company and all stakeholders.']];
  return /*#__PURE__*/React.createElement("div", {
    ref: rootRef,
    style: {
      maxWidth: 1240,
      margin: '0 auto'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: isNarrow ? '1fr' : '0.92fr 1.08fr',
      gap: isNarrow ? 48 : 88,
      alignItems: 'start'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: isNarrow ? 'static' : 'sticky',
      top: 120,
      alignSelf: 'start'
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      fontSize: 'clamp(32px, 4.6vw, 56px)',
      letterSpacing: -1.6,
      margin: 0,
      fontWeight: 500,
      lineHeight: 1,
      ...stagger(1)
    }
  }, "Values and culture", /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: serif,
      fontStyle: 'italic',
      fontWeight: 400,
      color: '#92a1d3'
    }
  }, ".")), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      height: 1,
      background: T.hair,
      overflow: 'hidden',
      margin: '30px 0 30px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      background: `linear-gradient(90deg, ${T.ink} 0%, ${T.ink} 40%, ${T.blue} 80%, ${T.blue} 100%)`,
      transformOrigin: 'left center',
      transform: shown ? 'scaleX(1)' : 'scaleX(0)',
      transition: 'transform 1400ms cubic-bezier(.2,.7,.2,1) 250ms'
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: serif,
      fontStyle: 'italic',
      fontSize: 30,
      color: '#92a1d3',
      fontWeight: 400,
      letterSpacing: -0.6,
      lineHeight: 1.12,
      marginBottom: 20,
      ...stagger(2, 100)
    }
  }, "What shapes our work"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 18,
      color: T.inkSoft,
      lineHeight: 1.55,
      maxWidth: 400,
      ...stagger(3, 100)
    }
  }, "A well-defined set of values and culture characterise our approach — and the work we choose to take on.")), /*#__PURE__*/React.createElement("div", {
    ref: listRef,
    style: {
      position: 'relative',
      paddingTop: 4
    }
  }, /*#__PURE__*/React.createElement("div", {
    "aria-hidden": "true",
    style: {
      position: 'absolute',
      left: 11.5,
      top: 14,
      bottom: 14,
      width: 1,
      background: T.hair
    }
  }), /*#__PURE__*/React.createElement("div", {
    "aria-hidden": "true",
    style: {
      position: 'absolute',
      left: 11.5,
      top: 14,
      width: 1,
      height: `calc((100% - 28px) * ${progress})`,
      background: T.blue,
      willChange: 'height'
    }
  }), /*#__PURE__*/React.createElement("div", {
    "aria-hidden": "true",
    style: {
      position: 'absolute',
      left: 12,
      top: `calc(14px + (100% - 28px) * ${progress})`,
      transform: 'translate(-50%, -50%)',
      width: 9,
      height: 9,
      borderRadius: '50%',
      background: T.blue,
      opacity: progress > 0.001 && progress < 0.999 ? 1 : 0,
      boxShadow: `0 0 0 4px rgba(29,78,216,0.16), 0 0 14px 2px rgba(29,78,216,0.45)`,
      transition: 'opacity 400ms ease',
      pointerEvents: 'none',
      willChange: 'top'
    }
  }), valueItems.map(([name, body], dotIdx) => {
    const isActive = dotIdx <= activeIdx;
    return /*#__PURE__*/React.createElement("div", {
      key: name,
      style: {
        display: 'grid',
        gridTemplateColumns: '24px 1fr',
        columnGap: 24,
        paddingBottom: dotIdx < valueItems.length - 1 ? 44 : 0,
        position: 'relative',
        ...stagger(3 + dotIdx, 150, 14)
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        justifyContent: 'center',
        paddingTop: 14,
        position: 'relative'
      }
    }, /*#__PURE__*/React.createElement("div", {
      ref: el => {
        dotRefs.current[dotIdx] = el;
      },
      className: "wpp-val-dot",
      "data-active": isActive ? '1' : '0',
      style: {
        position: 'relative'
      }
    })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 24,
        fontWeight: 500,
        letterSpacing: -0.4,
        color: isActive ? T.ink : '#a0a0a8',
        lineHeight: 1.2,
        marginBottom: 10,
        fontFamily: sans,
        transition: 'color 550ms cubic-bezier(.2,.7,.2,1)'
      }
    }, name), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 16.5,
        color: isActive ? T.inkSoft : '#b8b8be',
        lineHeight: 1.6,
        maxWidth: 580,
        transition: 'color 550ms cubic-bezier(.2,.7,.2,1)'
      }
    }, body)));
  }))));
}

// ---- Selected deals marquee ----
// Drag-to-scroll horizontal carousel with infinite wrap and auto-flow when idle.
// Auto-scroll pauses on hover or while the user is dragging.
function DealsMarquee({
  deals,
  wrapStyle
}) {
  const wrapRef = React.useRef(null);
  const trackRef = React.useRef(null);
  // Mutable, frame-loop state. Kept in a ref to avoid re-renders.
  const s = React.useRef({
    x: 0,
    halfWidth: 0,
    hovering: false,
    dragging: false,
    dragStartX: 0,
    dragStartOffset: 0,
    moved: 0,
    last: 0,
    pointerId: null,
    vx: -60 // px/sec auto-scroll speed
  });
  // Render twice so we can wrap seamlessly.
  const items = React.useMemo(() => [...deals, ...deals], [deals]);
  React.useEffect(() => {
    const wrap = wrapRef.current;
    const track = trackRef.current;
    if (!wrap || !track) return;
    const recalc = () => {
      // halfWidth = width of one copy of the deals list.
      s.current.halfWidth = track.scrollWidth / 2;
    };
    recalc();
    const ro = new ResizeObserver(recalc);
    ro.observe(track);
    let raf = 0;
    let visible = false;
    const tick = ts => {
      const st = s.current;
      const dt = st.last ? Math.min(0.05, (ts - st.last) / 1000) : 0;
      st.last = ts;
      if (!st.dragging && !st.hovering && st.halfWidth > 0) {
        st.x += st.vx * dt;
        // wrap
        if (st.x <= -st.halfWidth) st.x += st.halfWidth;else if (st.x > 0) st.x -= st.halfWidth;
        track.style.transform = `translate3d(${st.x}px, 0, 0)`;
      }
      raf = requestAnimationFrame(tick);
    };
    const startLoop = () => {
      if (!raf) {
        s.current.last = 0;
        raf = requestAnimationFrame(tick);
      }
    };
    const stopLoop = () => {
      if (raf) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
    };

    // A transform loop running while the marquee is scrolled off-screen keeps the
    // compositor busy for no reason and makes the rest of the page scroll roughly.
    // Only animate while it's actually visible, and pause on a hidden tab.
    const io = new IntersectionObserver(entries => {
      visible = entries[0].isIntersecting;
      if (visible && !document.hidden) startLoop();else stopLoop();
    }, {
      rootMargin: '120px 0px 120px 0px'
    });
    io.observe(wrap);
    const onVis = () => {
      if (document.hidden) stopLoop();else if (visible) startLoop();
    };
    document.addEventListener('visibilitychange', onVis);
    return () => {
      stopLoop();
      ro.disconnect();
      io.disconnect();
      document.removeEventListener('visibilitychange', onVis);
    };
  }, []);
  const onPointerDown = e => {
    const st = s.current;
    st.dragging = true;
    st.dragStartX = e.clientX;
    st.dragStartOffset = st.x;
    st.moved = 0;
    st.pointerId = e.pointerId;
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {}
  };
  const onPointerMove = e => {
    const st = s.current;
    if (!st.dragging) return;
    const dx = e.clientX - st.dragStartX;
    st.moved = Math.abs(dx);
    let nx = st.dragStartOffset + dx;
    if (st.halfWidth > 0) {
      while (nx <= -st.halfWidth) nx += st.halfWidth;
      while (nx > 0) nx -= st.halfWidth;
    }
    st.x = nx;
    if (trackRef.current) trackRef.current.style.transform = `translate3d(${nx}px, 0, 0)`;
  };
  const endDrag = e => {
    const st = s.current;
    if (!st.dragging) return;
    st.dragging = false;
    st.last = 0; // reset dt accumulator so the next frame doesn't jump
    try {
      if (e && st.pointerId != null) e.currentTarget.releasePointerCapture(st.pointerId);
    } catch {}
    st.pointerId = null;
  };
  // Suppress click after a drag so card clicks don't fire accidentally.
  const onClickCapture = e => {
    if (s.current.moved > 5) {
      e.preventDefault();
      e.stopPropagation();
    }
  };
  // Hover-pause: only when the mouse is actually over a card, not over the
  // strip's padding/fade area. Handlers are bound per-card below.
  const onCardEnter = () => {
    s.current.hovering = true;
    s.current.last = 0;
  };
  const onCardLeave = () => {
    s.current.hovering = false;
  };
  return /*#__PURE__*/React.createElement("div", {
    ref: wrapRef,
    className: "wpp-marquee",
    style: {
      position: 'relative',
      overflow: 'hidden',
      marginTop: 24,
      paddingTop: 24,
      paddingBottom: 50,
      ...wrapStyle
    },
    onPointerDown: onPointerDown,
    onPointerMove: onPointerMove,
    onPointerUp: endDrag,
    onPointerCancel: endDrag,
    onClickCapture: onClickCapture
  }, /*#__PURE__*/React.createElement("div", {
    ref: trackRef,
    className: "wpp-marquee-track",
    style: {
      display: 'flex',
      gap: 18,
      width: 'max-content',
      paddingBottom: 12,
      willChange: 'transform'
    }
  }, items.map((d, i) => /*#__PURE__*/React.createElement("article", {
    key: i,
    className: "wpp-deal-card",
    "aria-label": d.name,
    onMouseEnter: onCardEnter,
    onMouseLeave: onCardLeave
  }, /*#__PURE__*/React.createElement("div", {
    className: "wpp-deal-logo-frame"
  }, (d.logoUrl || d.logoFile) ? /*#__PURE__*/React.createElement("img", {
    src: d.logoUrl || __R(`assets/deal-logos/${d.logoFile}`),
    alt: d.name,
    loading: "lazy",
    draggable: false
  }) : null), /*#__PURE__*/React.createElement("div", {
    className: "wpp-deal-meta"
  }, /*#__PURE__*/React.createElement("div", {
    className: "wpp-deal-name"
  }, d.name)), /*#__PURE__*/React.createElement("div", {
    className: "wpp-deal-footer"
  }, /*#__PURE__*/React.createElement("div", {
    className: "wpp-deal-summary"
  }, d.summary), /*#__PURE__*/React.createElement("div", {
    className: "wpp-deal-detail"
  }, (d.detail || '').toUpperCase()))))), /*#__PURE__*/React.createElement("div", {
    className: "wpp-marquee-fade wpp-marquee-fade-l",
    "aria-hidden": "true"
  }), /*#__PURE__*/React.createElement("div", {
    className: "wpp-marquee-fade wpp-marquee-fade-r",
    "aria-hidden": "true"
  }));
}

// ---- Mandates showcase ----
// Editorial layout: animated header, featured cards with staggered slide-up reveal,
// recent deals as a refined ledger with row-by-row reveal + hover highlight.
function MandatesShowcase({
  D,
  T,
  mono,
  serif,
  sans,
  DealLogo
}) {
  const G = WPP_GUTTER;
  const rootRef = React.useRef(null);
  const [shown, setShown] = React.useState(false);

  // Combined deal set used by the marquee. Featured first, then recent.
  const allDeals = React.useMemo(() => [...(D.featured || []), ...(D.recentDeals || [])], [D]);
  React.useEffect(() => {
    if (!rootRef.current) return;
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          setShown(true);
          obs.disconnect();
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -10% 0px'
    });
    obs.observe(rootRef.current);
    return () => obs.disconnect();
  }, []);
  const stagger = (i, base = 0, dy = 28) => ({
    opacity: shown ? 1 : 0,
    transform: shown ? 'translateY(0)' : `translateY(${dy}px)`,
    transition: `opacity 900ms cubic-bezier(.2,.7,.2,1) ${base + i * 110}ms, transform 900ms cubic-bezier(.2,.7,.2,1) ${base + i * 110}ms`
  });
  return /*#__PURE__*/React.createElement("div", {
    ref: rootRef,
    style: {
      padding: `60px ${G} 100px`
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      paddingBottom: 28,
      marginBottom: 56,
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      fontSize: 'clamp(32px, 4.6vw, 56px)',
      letterSpacing: -1.6,
      margin: 0,
      fontWeight: 500,
      lineHeight: 1,
      ...stagger(1)
    }
  }, "Selected mandates", /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: serif,
      fontStyle: 'italic',
      fontWeight: 400,
      color: '#92a1d3'
    }
  }, ".")), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
      height: 1,
      background: T.hair,
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: 0,
      top: 0,
      height: '100%',
      width: '100%',
      background: `linear-gradient(90deg, ${T.ink} 0%, ${T.ink} 30%, ${T.blue} 70%, ${T.blue} 100%)`,
      transformOrigin: 'left center',
      transform: shown ? 'scaleX(1)' : 'scaleX(0)',
      transition: 'transform 1400ms cubic-bezier(.2,.7,.2,1) 250ms'
    }
  }))), /*#__PURE__*/React.createElement(DealsMarquee, {
    deals: allDeals,
    wrapStyle: stagger(3, 250, 24)
  }));
}

// Hover lift styles for featured cards + ledger rows
if (typeof document !== 'undefined' && !document.getElementById('wpp-ridge-styles')) {
  const s = document.createElement('style');
  s.id = 'wpp-ridge-styles';
  s.textContent = `
    .wpp-featured-card { transition: transform .55s cubic-bezier(.2,.7,.2,1), box-shadow .55s cubic-bezier(.2,.7,.2,1), border-color .4s ease; }
    .wpp-featured-card:hover { transform: translateY(-6px); box-shadow: 0 28px 60px rgba(10,30,80,0.12); border-color: rgba(29,78,216,0.45) !important; }
    .wpp-featured-glow {
      position: absolute; inset: 0; pointer-events: none; opacity: 0;
      background: radial-gradient(120% 80% at 90% 100%, rgba(29,78,216,0.12) 0%, rgba(29,78,216,0) 60%);
      transition: opacity .6s ease;
    }
    .wpp-featured-card:hover .wpp-featured-glow { opacity: 1; }
    .wpp-featured-edge {
      position: absolute; left: 0; top: 0; right: 0; height: 2px;
      background: linear-gradient(90deg, transparent, #253362, transparent);
      transform: scaleX(0); transform-origin: left center;
      transition: transform .8s cubic-bezier(.2,.7,.2,1);
    }
    .wpp-featured-card:hover .wpp-featured-edge { transform: scaleX(1); }

    .wpp-ledger-row { transition: padding-left .4s cubic-bezier(.2,.7,.2,1); }
    .wpp-ledger-row .wpp-ledger-sweep {
      position: absolute; inset: 0;
      background: linear-gradient(90deg, rgba(29,78,216,0.06) 0%, rgba(29,78,216,0) 70%);
      opacity: 0; pointer-events: none;
      transition: opacity .5s ease;
    }
    .wpp-ledger-row:hover { padding-left: 14px !important; }
    .wpp-ledger-row:hover .wpp-ledger-sweep { opacity: 1; }
    .wpp-ledger-row::after {
      content: ''; position: absolute; left: 0; bottom: -1px; height: 1px; width: 100%;
      background: #253362; transform: scaleX(0); transform-origin: left center;
      transition: transform .55s cubic-bezier(.2,.7,.2,1);
    }
    .wpp-ledger-row:hover::after { transform: scaleX(1); }
    /* Ledger row text colour shift on hover — name + detail go to blue */
    .wpp-ledger-row > div { transition: color .35s ease; }
    .wpp-ledger-row:hover > div:nth-child(3) { color: #253362 !important; }
    .wpp-ledger-row:hover > div:nth-child(6) { color: #253362 !important; }

    /* Client logo wall — grayscale → color on hover */
    .wpp-client-cell { transition: background .35s ease; }
    .wpp-client-cell .wpp-client-mark {
      filter: grayscale(1) contrast(0.92) opacity(0.55);
      transition: filter .5s ease, transform .5s cubic-bezier(.2,.7,.2,1);
      transform: scale(0.96);
    }
    .wpp-client-cell:hover { background: #f7f7f8; }
    .wpp-client-cell:hover .wpp-client-mark {
      filter: grayscale(0) contrast(1) opacity(1);
      transform: scale(1);
    }
    .wpp-client-hover {
      position: absolute; left: 0; right: 0; bottom: 0; height: 2px;
      background: #253362; transform: scaleX(0); transform-origin: left center;
      transition: transform .5s cubic-bezier(.2,.7,.2,1);
    }
    .wpp-client-cell:hover .wpp-client-hover { transform: scaleX(1); }

    /* Selected deals — drag-to-scroll horizontal marquee */
    .wpp-marquee {
      position: relative;
      cursor: grab;
      touch-action: pan-y;
      user-select: none;
      -webkit-user-select: none;
    }
    .wpp-marquee:active { cursor: grabbing; }
    .wpp-marquee-track {
      will-change: transform;
    }
    .wpp-marquee-track img { pointer-events: none; -webkit-user-drag: none; }
    .wpp-marquee-fade {
      position: absolute; top: 0; bottom: 0; width: 90px; pointer-events: none; z-index: 2;
    }
    .wpp-marquee-fade-l { left: 0;  background: linear-gradient(90deg, #ffffff 0%, rgba(255,255,255,0) 100%); }
    .wpp-marquee-fade-r { right: 0; background: linear-gradient(-90deg, #ffffff 0%, rgba(255,255,255,0) 100%); }

    .wpp-deal-card {
      box-sizing: border-box;
      flex: 0 0 310px;
      width: 310px;
      height: 290px;
      background: #fafbfc;
      border: 1px solid rgba(10,10,10,0.06);
      border-radius: 14px;
      padding: 22px;
      display: flex;
      flex-direction: column;
      gap: 18px;
      transition: background .45s cubic-bezier(.2,.7,.2,1), border-color .45s ease, transform .45s cubic-bezier(.2,.7,.2,1), box-shadow .45s ease;
      cursor: inherit;
      position: relative;
      overflow: hidden;
    }
    .wpp-deal-card:hover {
      background: #253362;
      border-color: #253362;
      transform: translateY(-6px);
      box-shadow: 0 24px 50px rgba(10,30,80,0.18);
    }
    .wpp-deal-logo-frame {
      height: 110px;
      background: transparent;
      border: none;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 14px;
      transition: background .45s ease, border-color .45s ease;
    }
    .wpp-deal-logo-frame img {
      max-width: 78%;
      max-height: 70%;
      object-fit: contain;
      display: block;
    }
    /* On hover the card turns dark blue; most logos are dark, so give the
       logo frame a white chip so they stay visible against the dark ground. */
    .wpp-deal-card:hover .wpp-deal-logo-frame {
      background: #ffffff;
      border: 1px solid rgba(255,255,255,0.15);
      box-shadow: 0 8px 20px rgba(10,30,80,0.22);
    }
    .wpp-deal-meta { display: flex; flex-direction: column; gap: 6px; }
    .wpp-deal-name {
      font-family: "Inter Tight","Inter",system-ui,sans-serif;
      font-size: 19px; font-weight: 600; letter-spacing: -0.3px; color: #0a0a0a;
      transition: color .35s ease;
    }
    .wpp-deal-footer {
      margin-top: auto;
      padding-top: 0;
      display: flex; flex-direction: column; gap: 8px;
    }
    .wpp-deal-summary {
      font-family: "Inter Tight","Inter",system-ui,sans-serif;
      font-size: 14.5px; font-weight: 500; color: #253362;
      transition: color .35s ease;
    }
    .wpp-deal-detail {
      font-family: "JetBrains Mono",ui-monospace,monospace;
      font-size: 11px; letter-spacing: 0.8px; color: #0a0a0a;
      transition: color .35s ease;
    }
    .wpp-deal-card:hover .wpp-deal-name    { color: #ffffff; }
    .wpp-deal-card:hover .wpp-deal-summary { color: #ffffff; }
    .wpp-deal-card:hover .wpp-deal-detail  { color: rgba(255,255,255,0.85); }

    /* Principles — value rows (no hover state) */

    /* Values — scroll-driven dots */
    .wpp-val-dot {
      width: 10px; height: 10px; border-radius: 50%;
      background: #d6d6dc;
      box-shadow: 0 0 0 4px #f5f3ee;
      transition: background 520ms cubic-bezier(.2,.7,.2,1);
    }
    .wpp-val-dot[data-active="1"] {
      background: #253362;
    }

    /* Methodology — step dot (no hover state) */
  `;
  document.head.appendChild(s);
}


export default Ridge;
