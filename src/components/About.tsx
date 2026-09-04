// @ts-nocheck
'use client';
// Ported nearly verbatim from the original site's PageAbout (window.* stripped),
// including its local helpers useInView and MandateTimelineSection.
import React from 'react';
import { WPP_T, WPP_FONTS, WPP_GUTTER } from '@/lib/wpp/tokens';
import { WPP_useIsNarrow, WPP_useMedia } from '@/lib/wpp/hooks';
import { Tag as WPP_Tag } from '@/lib/wpp/shared';
import { __R } from '@/lib/wpp/assets';
import { WPP_t } from '@/lib/wpp/sanity-stub';

export default function About() {
  const T = WPP_T,
    F = WPP_FONTS;
  const G = WPP_GUTTER;
  const isNarrow = WPP_useIsNarrow();
  const Tag = WPP_Tag;

  // Count-up animation, triggered when the stats block scrolls into view
  const statsRef = React.useRef(null);
  const [statsRun, setStatsRun] = React.useState(false);
  React.useEffect(() => {
    if (!statsRef.current) return;
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          setStatsRun(true);
          obs.disconnect();
        }
      });
    }, {
      threshold: 0.35
    });
    obs.observe(statsRef.current);
    return () => obs.disconnect();
  }, []);
  function CountUp({
    value,
    suffix = '',
    prefix = '',
    duration = 1600,
    run
  }) {
    const [n, setN] = React.useState(0);
    React.useEffect(() => {
      if (!run) return;
      const start = performance.now();
      let raf;
      const tick = now => {
        const t = Math.min(1, (now - start) / duration);
        const e = 1 - Math.pow(1 - t, 3);
        setN(value * e);
        if (t < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
      return () => cancelAnimationFrame(raf);
    }, [run, value, duration]);
    const isInt = Number.isInteger(value);
    const display = isInt ? Math.round(n) : n.toFixed(1);
    return /*#__PURE__*/React.createElement("span", null, prefix, display, suffix);
  }
  const stats = [{
    value: 40,
    suffix: '+',
    label: 'Years combined deal experience'
  }, {
    value: 4,
    suffix: '',
    label: 'Bulge-bracket banks: J.P. Morgan, BAML, HSBC, BNP Paribas'
  }, {
    value: 6,
    suffix: '',
    label: 'Sectors covered'
  }, {
    value: 100,
    suffix: '%',
    label: 'Senior partner involvement, every mandate'
  }, {
    value: 2,
    suffix: '',
    label: 'Offices: London, Barcelona'
  }, {
    value: 6,
    suffix: '',
    label: 'Languages spoken across the team'
  }];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: F.sans,
      color: T.ink
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: `120px ${G} 100px`,
      display: 'grid',
      gridTemplateColumns: isNarrow ? '1fr' : '1.4fr 1fr',
      gap: isNarrow ? 40 : 80,
      alignItems: isNarrow ? 'start' : 'end',
      borderBottom: `1px solid ${T.hair}`
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", {
    style: {
      fontSize: 'clamp(40px, 7.2vw, 92px)',
      letterSpacing: -2.4,
      lineHeight: 0.96,
      margin: 0,
      fontWeight: 500,
      textWrap: 'balance'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      whiteSpace: 'nowrap'
    }
  }, "A focused ", /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: F.serif,
      fontStyle: 'italic',
      fontWeight: 400,
      color: '#92a1d3'
    }
  }, "advisor"), ","), /*#__PURE__*/React.createElement("br", null), "by design", /*#__PURE__*/React.createElement("span", {
    style: {
      color: T.blue
    }
  }, "."))), /*#__PURE__*/React.createElement("div", {
    style: {
      paddingBottom: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: F.serif,
      fontStyle: 'italic',
      fontSize: 22,
      lineHeight: 1.4,
      color: T.inkSoft,
      borderLeft: `3px solid ${T.blue}`,
      paddingLeft: 24
    }
  }, WPP_t('aboutPullquote', "We work with a small number of clients at any one time — so each mandate gets the senior attention, sector depth and bespoke strategy it deserves.")))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: `100px ${G}`,
      background: T.panel,
      borderBottom: `1px solid ${T.hair}`
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: isNarrow ? '1fr' : '1fr 1fr',
      gap: 'clamp(32px, 5vw, 64px)',
      alignItems: 'stretch'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 19,
      lineHeight: 1.7,
      color: T.ink,
      fontFamily: F.serif
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '0 0 22px',
      fontSize: 'clamp(20px, 2.6vw, 26px)',
      lineHeight: 1.4,
      color: T.ink
    }
  }, "Most M&A advisors are organised around the deal. We organise around the company."), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '0 0 22px'
    }
  }, "The partners spent their early careers at ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: T.blue,
      fontWeight: 500
    }
  }, "J.P. Morgan"), ", ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: T.blue,
      fontWeight: 500
    }
  }, "Bank of America"), ", ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: T.blue,
      fontWeight: 500
    }
  }, "HSBC"), " and ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: T.blue,
      fontWeight: 500
    }
  }, "BNP Paribas"), ", working on transactions where the diligence was rigorous, the buyers were the right buyers, and the closing rate was high. Then they went and ran tech companies — as CFOs, as investors, as operators inside the businesses themselves."), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '0 0 22px'
    }
  }, "What they learned, on that side of the table, is that the technical excellence of a banker is necessary but not sufficient. The real difference is whether the advisor understands the business well enough to ", /*#__PURE__*/React.createElement("em", {
    style: {
      color: T.blue
    }
  }, "shape it"), " for the moment, not just to ", /*#__PURE__*/React.createElement("em", null, "price it"), "."), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '0 0 22px'
    }
  }, "That is the firm. Fewer mandates than we could take, more time per company than is profitable on paper, and an alignment structure that means we win only when the deal is succesful.")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      borderRadius: 4,
      overflow: 'hidden',
      minHeight: isNarrow ? 300 : 0
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: __R('assets/hero-mountain-poster.jpg'),
    alt: "The alpine landscape behind the White Peak Partners name",
    style: {
      width: '100%',
      height: '100%',
      minHeight: isNarrow ? 300 : 0,
      objectFit: 'cover',
      display: 'block',
      borderRadius: 4
    }
  })))), /*#__PURE__*/React.createElement(MandateTimelineSection, {
    T: T,
    F: F
  }));
}
function useInView(threshold = 0.15) {
  const ref = React.useRef(null);
  const [seen, setSeen] = React.useState(false);
  React.useEffect(() => {
    if (!ref.current || seen) return;
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          setSeen(true);
          io.disconnect();
        }
      });
    }, {
      threshold
    });
    io.observe(ref.current);
    return () => io.disconnect();
  }, [seen, threshold]);
  return [ref, seen];
}
function MandateTimelineSection({
  T,
  F
}) {
  const G = WPP_GUTTER;
  const isNarrow = WPP_useMedia('(max-width: 760px)');
  const [ref, inView] = useInView(0.12);
  const [active, setActive] = React.useState(0);
  const [paused, setPaused] = React.useState(false);
  const phases = [{
    n: '01',
    key: 'Immersion',
    weeks: 'Weeks 1\u20132',
    headline: 'We listen before we sell.',
    body: 'Hands-on preparation built around your business. Partners sit on-site with founders, board and key team to identify the real value drivers, define the KPIs that matter and carry out the analysis behind growth, retention and profitability initiatives. The goal is to improve both the perceived and the real value of the company before any external work begins.',
    facts: [['On-site days', '6\u201310 partner-days'], ['What we deliver', 'Rebuilt model, written positioning thesis'], ['Who owns it', 'Both partners, full-time']]
  }, {
    n: '02',
    key: 'Positioning',
    weeks: 'Weeks 3\u20135',
    headline: 'We build the story investors actually fund.',
    body: 'We help articulate a compelling equity story \u2014 driven by your unique vision and grounded in real product and service differentiation, an attractive business plan and an ambitious roadmap. The competitive landscape and counterparty universe are mapped, materials drafted and management coached. Every page is partner-written.',
    facts: [['Materials', 'CIM \u00b7 model \u00b7 management deck'], ['Counterparty universe', '40\u201380 names mapped and scored'], ['Authored by', 'Senior partners, not associates']]
  }, {
    n: '03',
    key: 'Engagement',
    weeks: 'Weeks 6\u20139',
    headline: 'We open the right doors, not all of them.',
    body: 'We design and manage a competitive process, leveraging our network of institutional, corporate and private investors \u2014 including family offices and high net worth individuals. Every introduction is made directly by a partner: no mass outreach, no generic teasers. The goal is to secure the most favourable terms for the company.',
    facts: [['Active counterparties', '8\u201315'], ['Channel', 'Partner-to-partner only'], ['Cadence', 'Weekly check-ins with founders']]
  }, {
    n: '04',
    key: 'Negotiation',
    weeks: 'Weeks 10\u201313',
    headline: 'We optimise for fit and terms, not just price.',
    body: 'From the first term-sheet conversation to the final contract, we run negotiation around strategic fit, governance and downside protection. IOIs are evaluated side-by-side, structuring runs in parallel with company, board and lawyers.',
    facts: [['IOIs evaluated', 'Side-by-side, structured grid'], ['Selection criteria', 'Price \u00b7 structure \u00b7 fit \u00b7 close certainty'], ['Lead', 'Senior partner at every call']]
  }, {
    n: '05',
    key: 'Close',
    weeks: 'Weeks 14\u201318',
    headline: 'We are present at every milestone, including the last.',
    body: 'Due-diligence managed to the end. Our role is to provide focused insights at every decision point and stay present through the moments that matter most. Aftercare is included \u2014 integration and shareholder support do not stop on the closing date.',
    facts: [['Closing presence', 'In-person, partner-led'], ['Post-close', '90 days of shareholder support'], ['Diligence', 'Managed end-to-end']]
  }];
  React.useEffect(() => {
    if (paused || !inView) return;
    const id = setInterval(() => {
      setActive(a => (a + 1) % phases.length);
    }, 5500);
    return () => clearInterval(id);
  }, [paused, inView, phases.length]);
  const ease = 'cubic-bezier(.7,.05,.2,1)';
  const current = phases[active];
  const progressPct = active / (phases.length - 1) * 100;
  return /*#__PURE__*/React.createElement("div", {
    ref: ref,
    onMouseEnter: () => setPaused(true),
    onMouseLeave: () => setPaused(false),
    style: {
      padding: `88px ${G} 96px`,
      background: T.panel,
      borderTop: `1px solid ${T.hair}`,
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-end',
      gap: 40,
      flexWrap: 'wrap',
      marginBottom: 28
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      display: 'inline-block'
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      fontSize: 'clamp(26px, 3.6vw, 38px)',
      letterSpacing: -0.9,
      margin: 0,
      fontWeight: 500,
      color: T.ink,
      maxWidth: 760,
      opacity: inView ? 1 : 0,
      transform: inView ? 'translateY(0)' : 'translateY(14px)',
      transition: `opacity .8s ${ease}, transform .8s ${ease}`
    }
  }, "Inside a ", /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: F.serif,
      fontStyle: 'italic',
      fontWeight: 400,
      color: '#92a1d3'
    }
  }, "White Peak Partners"), " mandate", /*#__PURE__*/React.createElement("span", {
    style: {
      color: T.blue
    }
  }, ".")), /*#__PURE__*/React.createElement("div", {
    "aria-hidden": true,
    style: {
      position: 'absolute',
      left: 0,
      bottom: -10,
      height: 2,
      background: T.blue,
      width: inView ? 64 : 0,
      transition: `width .9s ${ease} 250ms`
    }
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 720,
      fontSize: 17,
      lineHeight: 1.55,
      color: T.inkSoft,
      marginBottom: 64,
      marginTop: 20,
      opacity: inView ? 1 : 0,
      transform: inView ? 'translateY(0)' : 'translateY(10px)',
      transition: `opacity .8s ${ease} 120ms, transform .8s ${ease} 120ms`
    }
  }, "Our process is built on a holistic view of your business and its competitive context. Tailored to what each mandate actually needs. From boardroom immersion through to signing and the months that follow, every phase is partner-led."), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      marginBottom: 40,
      overflowX: isNarrow ? 'auto' : 'visible',
      WebkitOverflowScrolling: 'touch',
      opacity: inView ? 1 : 0,
      transform: inView ? 'translateY(0)' : 'translateY(10px)',
      transition: `opacity .9s ${ease} 220ms, transform .9s ${ease} 220ms`
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: 12,
      right: 12,
      top: 22,
      height: 1,
      background: T.hair
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: 12,
      top: 22,
      height: 1,
      background: T.blue,
      width: `calc((100% - 24px) * ${progressPct / 100})`,
      transition: `width .6s ${ease}`
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: `repeat(${phases.length}, minmax(${isNarrow ? '96px' : '0'}, 1fr))`,
      gap: 8,
      position: 'relative',
      overflowX: isNarrow ? 'auto' : 'visible'
    }
  }, phases.map((p, i) => {
    const isActive = i === active;
    const isPast = i < active;
    return /*#__PURE__*/React.createElement("button", {
      key: i,
      onClick: () => {
        setActive(i);
        setPaused(true);
      },
      "aria-label": `View phase ${p.n}: ${p.key}`,
      style: {
        background: 'transparent',
        border: 'none',
        cursor: 'pointer',
        padding: '0 0 4px',
        textAlign: 'left',
        outline: 'none',
        font: 'inherit',
        color: 'inherit'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        height: 44,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        width: 16,
        height: 16,
        borderRadius: 999,
        background: isActive || isPast ? T.blue : '#fff',
        border: `2px solid ${isActive || isPast ? T.blue : T.mute}`,
        transition: `background .35s ${ease}, transform .35s ${ease}, box-shadow .35s ${ease}`,
        transform: isActive ? 'scale(1.25)' : 'scale(1)',
        boxShadow: isActive ? `0 0 0 6px rgba(29, 78, 216, 0.10)` : 'none',
        display: 'inline-block',
        marginLeft: 4
      }
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 12
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 18,
        fontWeight: 500,
        color: isActive ? T.ink : T.inkSoft,
        letterSpacing: -0.2,
        transition: `color .3s ${ease}`
      }
    }, p.key)));
  }))), /*#__PURE__*/React.createElement("div", {
    key: active,
    style: {
      background: '#fff',
      border: `1px solid ${T.hair}`,
      borderLeft: `3px solid ${T.blue}`,
      borderRadius: 4,
      padding: isNarrow ? '24px 20px' : '36px 40px',
      animation: `wppPhaseIn .55s ${ease} both`
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: F.serif,
      fontStyle: 'italic',
      fontSize: isNarrow ? 24 : 30,
      lineHeight: 1.2,
      color: T.ink,
      marginBottom: 18,
      letterSpacing: -0.4
    }
  }, current.headline), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 16,
      lineHeight: 1.65,
      color: T.inkSoft
    }
  }, current.body))), /*#__PURE__*/React.createElement("style", null, `
        @keyframes wppPhaseIn {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `));
}
