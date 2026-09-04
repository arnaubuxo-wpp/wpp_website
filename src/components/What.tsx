// @ts-nocheck
'use client';
// Ported nearly verbatim from the original site's PageWhat (window.* stripped),
// including its local helpers TestimonialCard, SectorRow and ServiceTab.
import React from 'react';
import { WPP_T, WPP_FONTS, WPP_GUTTER } from '@/lib/wpp/tokens';
import { WPP_useIsMobile, WPP_useIsNarrow } from '@/lib/wpp/hooks';
import { Tag as WPP_Tag } from '@/lib/wpp/shared';

function TestimonialCard({
  t,
  T,
  F
}) {
  const [hover, setHover] = React.useState(false);
  return /*#__PURE__*/React.createElement("div", {
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      position: 'relative',
      overflow: 'hidden',
      background: '#fff',
      padding: '40px 36px 36px',
      display: 'flex',
      flexDirection: 'column',
      borderTop: `2px solid ${hover ? T.blue : 'transparent'}`,
      boxShadow: hover ? '0 18px 40px -28px rgba(10,30,80,0.35)' : '0 0 0 rgba(0,0,0,0)',
      transform: hover ? 'translateY(-4px)' : 'translateY(0)',
      transition: 'transform 800ms cubic-bezier(.2,.7,.2,1), box-shadow 800ms cubic-bezier(.2,.7,.2,1), border-color 700ms cubic-bezier(.2,.7,.2,1)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    "aria-hidden": true,
    style: {
      position: 'absolute',
      inset: 0,
      pointerEvents: 'none',
      background: 'radial-gradient(circle at 15% 0%, rgba(59,111,229,0.08), transparent 55%)',
      opacity: hover ? 1 : 0,
      transition: 'opacity 900ms cubic-bezier(.2,.7,.2,1)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      fontFamily: F.serif,
      fontSize: 72,
      lineHeight: 0.6,
      color: T.blue,
      marginBottom: 20,
      height: 36,
      transform: hover ? 'translateY(-2px) scale(1.06)' : 'translateY(0) scale(1)',
      transformOrigin: 'left top',
      transition: 'transform 900ms cubic-bezier(.2,.7,.2,1)'
    }
  }, "“"), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      fontFamily: F.serif,
      fontSize: 21,
      lineHeight: 1.45,
      color: T.ink,
      fontWeight: 400,
      letterSpacing: -0.2,
      flex: 1,
      textWrap: 'pretty'
    }
  }, t.quote), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      marginTop: 32,
      paddingTop: 20,
      borderTop: `1px solid ${T.hair}`
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 15,
      fontWeight: 600,
      color: hover ? T.blue : T.ink,
      letterSpacing: -0.1,
      transform: hover ? 'translateX(4px)' : 'translateX(0)',
      transition: 'color 700ms ease, transform 800ms cubic-bezier(.2,.7,.2,1)'
    }
  }, t.name), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: T.inkSoft,
      marginTop: 3
    }
  }, t.role, ", ", t.company)));
}
function SectorRow({
  s,
  i,
  open,
  onToggle,
  T,
  F
}) {
  const [hover, setHover] = React.useState(false);
  const isNarrow = WPP_useIsNarrow();
  const isMobile = WPP_useIsMobile();
  return /*#__PURE__*/React.createElement("div", {
    style: {
      borderBottom: `1px solid ${T.hair}`
    }
  }, /*#__PURE__*/React.createElement("div", {
    onClick: onToggle,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      position: 'relative',
      overflow: 'hidden',
      display: 'grid',
      gridTemplateColumns: isNarrow ? "1fr 40px" : "1.4fr 2fr 56px",
      gap: 24,
      padding: '28px 24px',
      alignItems: 'baseline',
      cursor: 'pointer',
      background: open ? 'rgba(59,111,229,0.05)' : hover ? 'rgba(59,111,229,0.05)' : 'transparent',
      borderLeft: open ? `3px solid ${T.blue}` : '3px solid transparent',
      transition: 'background 700ms cubic-bezier(.2,.7,.2,1), border-color 700ms cubic-bezier(.2,.7,.2,1)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: F.serif,
      fontSize: 'clamp(24px, 3.4vw, 36px)',
      fontStyle: 'italic',
      fontWeight: 400,
      letterSpacing: -0.6,
      color: open || hover ? T.blue : T.ink,
      lineHeight: 1,
      transform: hover && !open ? 'translateX(4px)' : 'translateX(0)',
      transition: 'color 700ms ease, transform 800ms cubic-bezier(.2,.7,.2,1)'
    }
  }, s.k), !isNarrow && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 15,
      color: T.inkSoft,
      lineHeight: 1.55
    }
  }, s.v), /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'relative',
      width: 22,
      height: 22,
      justifySelf: 'end',
      alignSelf: 'center',
      color: T.blue,
      opacity: open ? 1 : hover ? 1 : 0,
      transform: hover && !open ? 'translateY(0)' : open ? 'translateY(2px)' : 'translateY(-4px)',
      transition: 'opacity 1200ms cubic-bezier(.2,.7,.2,1), transform 1300ms cubic-bezier(.2,.7,.2,1)',
      display: 'inline-block'
    }
  }, /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 32 32",
    width: "22",
    height: "22",
    "aria-hidden": "true",
    style: {
      position: 'absolute',
      inset: 0,
      opacity: open ? 0 : 1,
      transform: open ? 'rotate(135deg) scale(0.85)' : 'rotate(0deg) scale(1)',
      transformOrigin: 'center',
      transition: 'opacity 1400ms cubic-bezier(.4,0,.2,1), transform 1400ms cubic-bezier(.4,0,.2,1)'
    }
  }, /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("line", {
    x1: "16",
    y1: "6",
    x2: "16",
    y2: "26",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "square"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "6",
    y1: "16",
    x2: "26",
    y2: "16",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "square"
  }))), /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 32 32",
    width: "22",
    height: "22",
    "aria-hidden": "true",
    style: {
      position: 'absolute',
      inset: 0,
      opacity: open ? 1 : 0,
      transform: open ? 'rotate(0deg) scale(1)' : 'rotate(-135deg) scale(0.85)',
      transformOrigin: 'center',
      transition: 'opacity 1400ms cubic-bezier(.4,0,.2,1) 120ms, transform 1400ms cubic-bezier(.4,0,.2,1) 120ms'
    }
  }, /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("line", {
    x1: "6",
    y1: "6",
    x2: "26",
    y2: "26",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "square"
  }), /*#__PURE__*/React.createElement("polyline", {
    points: "26,14 26,26 14,26",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "square",
    strokeLinejoin: "miter"
  }))))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: isNarrow ? "1fr" : "1.4fr 2fr 56px",
      gap: 24,
      maxHeight: open ? 600 : 0,
      opacity: open ? 1 : 0,
      overflow: 'hidden',
      transition: 'max-height .45s ease, opacity .35s ease, padding .45s ease',
      paddingTop: open ? 20 : 0,
      paddingBottom: open ? 32 : 0,
      paddingLeft: 24,
      paddingRight: 24
    }
  }, /*#__PURE__*/React.createElement("div", null), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 15.5,
      lineHeight: 1.65,
      color: T.ink,
      paddingLeft: 20,
      borderLeft: `2px solid ${T.blue}`,
      maxWidth: 720
    }
  }, s.long), /*#__PURE__*/React.createElement("div", null)));
}
function ServiceTab({
  s,
  i,
  isActive,
  isLast,
  onSelect,
  T
}) {
  const [hover, setHover] = React.useState(false);
  return /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: onSelect,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    onFocus: () => setHover(true),
    onBlur: () => setHover(false),
    "aria-pressed": isActive,
    style: {
      position: 'relative',
      overflow: 'hidden',
      flex: 1,
      padding: '22px 24px',
      cursor: 'pointer',
      textAlign: 'left',
      font: 'inherit',
      width: '100%',
      border: 'none',
      borderBottom: !isLast ? `1px solid ${T.hair}` : 'none',
      background: isActive ? T.bg : hover ? 'rgba(59,111,229,0.05)' : 'transparent',
      borderLeft: isActive ? `3px solid ${T.blue}` : '3px solid transparent',
      display: 'flex',
      gap: 16,
      alignItems: 'center',
      color: 'inherit',
      transition: 'background 700ms cubic-bezier(.2,.7,.2,1), border-color 700ms cubic-bezier(.2,.7,.2,1)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 24,
      fontWeight: isActive ? 600 : 500,
      color: T.ink,
      letterSpacing: -0.3,
      transform: hover && !isActive ? 'translateX(4px)' : 'translateX(0)',
      transition: 'transform 700ms cubic-bezier(.2,.7,.2,1)'
    }
  }, s.key)), /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 32 32",
    width: "22",
    height: "22",
    "aria-hidden": "true",
    style: {
      flexShrink: 0,
      alignSelf: 'center',
      color: T.blue,
      opacity: isActive ? 1 : hover ? 1 : 0,
      transform: isActive ? 'translate(0, 0)' : hover ? 'translate(2px, -2px)' : 'translate(-6px, 6px)',
      transition: 'opacity 800ms cubic-bezier(.2,.7,.2,1), transform 900ms cubic-bezier(.2,.7,.2,1)'
    }
  }, /*#__PURE__*/React.createElement("line", {
    x1: "6",
    y1: "26",
    x2: "26",
    y2: "6",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "square"
  }), /*#__PURE__*/React.createElement("polyline", {
    points: "14,6 26,6 26,18",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "square",
    strokeLinejoin: "miter"
  })));
}
export default function What() {
  const T = WPP_T,
    F = WPP_FONTS;
  const G = WPP_GUTTER;
  const isNarrow = WPP_useIsNarrow();
  const isMobile = WPP_useIsMobile();
  const Tag = WPP_Tag;
  const [active, setActive] = React.useState(0);
  const [openSector, setOpenSector] = React.useState(null);
  const servicesRef = React.useRef(null);
  const services = [{
    key: 'Capital raise',
    n: '1',
    pitch: 'Series A, B, growth equity or strategic capital \u2014 raised on your terms.',
    detail: 'Series A, B, growth equity or strategic capital \u2014 we run focused processes across VC, corporates and family offices, with a narrative built on the metrics that matter and terms designed to protect the company across the next round and beyond.',
    delivers: ['Investor curation', 'Pitch & narrative work', 'Term-sheet negotiation', 'Closing through legal'],
    length: '3\u20136 months'
  }, {
    key: 'Sell-side M&A',
    n: '2',
    pitch: 'You only sell your company once. We make sure it\u2019s done right.',
    detail: 'We help founders decide whether to sell, when and to whom \u2014 then run the process end-to-end. Bilateral or competitive, the approach is tailored to what matters: valuation, terms, cultural fit and your role post-close. We sit on your side of the table from the first NDA to the final signature.',
    delivers: ['Buyer mapping & sequencing', 'Information memorandum', 'Dataroom & diligence support', 'Negotiation through SPA'],
    length: '6\u20139 months'
  }, {
    key: 'Buy-side M&A',
    n: '3',
    pitch: 'When growth needs to come from acquisition.',
    detail: 'We help acquirers source targets that fit the strategy, structure deals that hold up post-close and negotiate terms designed to protect downside while preserving upside. Wether it is a single transaction or a programmatic roll-up, we bring our expertise to any scenario to make the most out of the deal.',
    delivers: ['Target origination', 'Strategic fit analysis', 'Valuation & deal structuring', 'Negotiation & integration support'],
    length: '4\u201312 months'
  }, {
    key: 'Secondary placements',
    n: '4',
    pitch: 'Liquidity for founders and early backers without disrupting the cap table.',
    detail: 'We help founders and early backers access partial liquidity ahead of an exit through founder secondaries, LP secondaries and tender offers. The process is designed to be discreet and the structure tailored to leave the cap table, and the next round, in good shape.',
    delivers: ['Counterparty curation', 'Pricing & structuring', 'Board & shareholder alignment', 'Execution & legal'],
    length: '2\u20134 months'
  }, {
    key: 'Dual-track',
    n: '5',
    pitch: 'When sell and raise are both on the table.',
    detail: 'Some boards know they want to transact but aren’t sure whether a sale or a fundraise delivers more value. Running both in parallel — a sell-side M&A process and a capital raise on the same timeline — surfaces the real answer faster than choosing first and discovering later. We design the dual-track, run both processes and take a decision when the data is clear.',
    delivers: ['Parallel process design', 'Decision framework', 'Buyer/investor outreach', 'Execution on the chosen path'],
    length: '6\u20139 months'
  }, {
    key: 'Portfolio optimisation',
    n: '6',
    pitch: 'Sharper portfolios. Better capital allocation.',
    detail: 'We work with corporates and groups on the full portfolio lifecycle: reviewing what’s owned, designing carve-outs and divestments, building scouting and investment programmes for new acquisitions and running each transaction end-to-end. One mandate or an ongoing programme.',
    delivers: ['Portfolio review', 'Carve-out & divestment design', 'Corporate scouting & investment programmes', 'Transaction execution'],
    length: 'Programme'
  }];
  const A = services[active];
  const slug = k => k.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

  // Read service param on mount/popstate and activate matching service
  React.useEffect(() => {
    const sync = () => {
      const param = new URLSearchParams(location.search).get('service');
      if (!param) return;
      const idx = services.findIndex(s => slug(s.key) === param);
      if (idx >= 0) {
        setActive(idx);
        // Defer scroll until after layout
        requestAnimationFrame(() => {
          const el = servicesRef.current;
          if (el) {
            const top = el.getBoundingClientRect().top + scrollY - 90;
            scrollTo({
              top,
              behavior: 'smooth'
            });
          }
        });
      }
    };
    sync();
    addEventListener('popstate', sync);
    return () => removeEventListener('popstate', sync);
  }, []);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: F.sans,
      color: T.ink
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: `120px ${G} 60px`
    }
  }, /*#__PURE__*/React.createElement("h1", {
    style: {
      fontSize: 'clamp(40px, 7.5vw, 96px)',
      letterSpacing: -2.6,
      lineHeight: 0.94,
      margin: 0,
      fontWeight: 500,
      maxWidth: 1300,
      textWrap: 'balance'
    }
  }, "Six ways we help", /*#__PURE__*/React.createElement("span", {
    style: {
      color: T.blue
    }
  }, "."), " ", /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: F.serif,
      fontStyle: 'italic',
      fontWeight: 400,
      color: '#92a1d3'
    }
  }, "One operating model."))), /*#__PURE__*/React.createElement("div", {
    ref: servicesRef,
    style: {
      padding: `40px ${G} 100px`
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: isNarrow ? '1fr' : '380px 1fr',
      gap: 0,
      border: `1px solid ${T.hair}`,
      borderRadius: 4,
      overflow: 'hidden',
      background: T.bg
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: T.panel,
      borderRight: isNarrow ? 'none' : `1px solid ${T.hair}`,
      borderBottom: isNarrow ? `1px solid ${T.hair}` : 'none',
      display: 'flex',
      flexDirection: 'column'
    }
  }, services.map((s, i) => /*#__PURE__*/React.createElement(ServiceTab, {
    key: s.key,
    s: s,
    i: i,
    isActive: i === active,
    isLast: i === services.length - 1,
    onSelect: () => setActive(i),
    T: T
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 'clamp(28px, 4vw, 48px)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      fontSize: 'clamp(30px, 4.5vw, 48px)',
      letterSpacing: -1.2,
      margin: '0 0 20px',
      fontWeight: 500,
      lineHeight: 1.05
    }
  }, A.key), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: F.serif,
      fontSize: 22,
      fontStyle: 'italic',
      color: T.inkSoft,
      lineHeight: 1.35,
      marginBottom: 24
    }
  }, A.pitch), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 16,
      lineHeight: 1.6,
      color: T.ink,
      maxWidth: 640
    }
  }, A.detail), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 36,
      paddingTop: 24,
      borderTop: `1px solid ${T.hair}`
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
      gap: 16
    }
  }, A.delivers.map(d => /*#__PURE__*/React.createElement("div", {
    key: d,
    style: {
      display: 'grid',
      gridTemplateColumns: '24px 1fr',
      gap: 12,
      fontSize: 18,
      lineHeight: 1.5,
      color: T.ink
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: T.blue,
      fontFamily: F.mono,
      fontSize: 14,
      marginTop: 4
    }
  }, "▲"), /*#__PURE__*/React.createElement("span", null, d)))))))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: `120px ${G} 100px`,
      borderTop: `1px solid ${T.hair}`
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'baseline',
      marginBottom: 64,
      flexWrap: 'wrap',
      gap: 24
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      fontSize: 'clamp(28px, 4vw, 44px)',
      letterSpacing: -1,
      lineHeight: 1.1,
      margin: 0,
      fontWeight: 500,
      maxWidth: 760
    }
  }, "What the ", /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: F.serif,
      fontStyle: 'italic',
      fontWeight: 400,
      color: '#92a1d3'
    }
  }, "founders"), " we worked with said", /*#__PURE__*/React.createElement("span", {
    style: {
      color: T.blue
    }
  }, "."))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: isMobile ? '1fr' : isNarrow ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)',
      gap: 1,
      background: T.hair,
      border: `1px solid ${T.hair}`,
      borderRadius: 4,
      overflow: 'hidden'
    }
  }, [{
    quote: 'They were key to help us negotiate an efficient and balanced deal with a very impressive line-up of investors. We are absolutely thrilled with their support.',
    name: 'Rafel Jordà',
    role: 'Founder & CEO',
    company: 'Open Cosmos',
    deal: '$50m Series B',
    year: 'Sep 2022'
  }, {
    quote: 'Their commitment and expertise in complex situations was instrumental for the success of this transaction. Their personal approach and hard work, always going the extra mile across all work streams, set them apart.',
    name: 'Bruno Azevedo',
    role: 'Founder & CEO',
    company: 'Addvolt',
    deal: 'Cross-border sale to Carrier',
    year: 'May 2025'
  }, {
    quote: 'They advised us on all essential aspects at each stage, demonstrating great knowledge, analytical skills, and the ability to explain complex issues clearly — all delivered with genuine care and a warm, personal approach.',
    name: 'Josep Martí',
    role: 'CEO',
    company: 'Nearby Computing',
    deal: '€6.5m Series A',
    year: '2023'
  }].map((t, i) => /*#__PURE__*/React.createElement(TestimonialCard, {
    key: i,
    t: t,
    T: T,
    F: F
  })))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: `100px ${G}`
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 40
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      fontSize: 'clamp(28px, 4vw, 44px)',
      letterSpacing: -1,
      margin: 0,
      fontWeight: 500
    }
  }, "Tech-driven companies", /*#__PURE__*/React.createElement("span", {
    style: {
      color: T.blue
    }
  }, "."))), /*#__PURE__*/React.createElement("div", {
    style: {
      borderTop: `1px solid ${T.ink}`
    }
  }, [{
    k: 'B2B SaaS',
    v: 'Cohort dynamics, retention, expansion mechanics — from scale-up to growth-stage assets.',
    long: 'We work with European B2B SaaS businesses across vertical software, horizontal platforms and infrastructure layers. Diligence centres on cohort retention, NRR and expansion levers — the metrics that determine whether the multiple holds through process.'
  }, {
    k: 'Vertical & applied AI',
    v: 'Foundation-model native software, infrastructure, the tooling layer.',
    long: 'AI-native businesses where the model is the product, not the marketing. We work with applied-AI companies in verticalised workflows, AI infrastructure, and the tooling layer between models and applications.'
  }, {
    k: 'Climatetech',
    v: 'Energy transition, decarbonisation in heavy industry, grid software, advanced materials.',
    long: 'Climatetech across both energy transition (storage, grid software, distributed generation, financing structures) and industrial decarbonisation (emissions tracking, advanced materials, circular-economy platforms, supply-chain visibility). These mandates require comfort with capex, regulatory dependence, project finance and the timelines that come with all three.'
  }, {
    k: 'Deeptech',
    v: 'Hardware-software systems, frontier compute, robotics, novel manufacturing.',
    long: 'Deeptech businesses commercialising frontier science — semiconductors and compute, robotics and automation, photonics, novel manufacturing, space and quantum-adjacent infrastructure. We help frame the technical moat in terms investors and acquirers can underwrite, and structure mandates around the long capital-intensity profiles these businesses require.'
  }, {
    k: 'Fintech & insurtech',
    v: 'B2B and embedded plays. Regulatory complexity priced into the work, not the surprise.',
    long: 'B2B fintech, embedded finance, payments infrastructure and insurtech platforms. Regulatory perimeter, capital requirements and licence transferability are first-order issues in these mandates.'
  }, {
    k: 'Marketplace & platforms',
    v: 'Two-sided dynamics, network effects, take-rate evolution over time.',
    long: 'Two-sided marketplaces and multi-sided platforms across B2B and consumer. Diligence focuses on liquidity by cohort, take-rate trajectory, supply concentration, and the durability of network effects.'
  }].map((s, i) => /*#__PURE__*/React.createElement(SectorRow, {
    key: i,
    s: s,
    i: i,
    open: openSector === i,
    onToggle: () => setOpenSector(openSector === i ? null : i),
    T: T,
    F: F
  })))));
}
