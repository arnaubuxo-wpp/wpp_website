// @ts-nocheck
'use client';
// Ported nearly verbatim from the original site's PageContact (window.* stripped),
// including its local helper ContactRow.
import React from 'react';
import { WPP_T, WPP_FONTS, WPP_GUTTER } from '@/lib/wpp/tokens';
import { WPP_useIsMobile, WPP_useIsNarrow } from '@/lib/wpp/hooks';
import { Tag as WPP_Tag } from '@/lib/wpp/shared';
import { WPP_t } from '@/lib/wpp/sanity-stub';

function ContactRow({
  row,
  T,
  F
}) {
  const [hover, setHover] = React.useState(false);
  const [copied, setCopied] = React.useState(false);
  const disabled = !row.href;
  const isCopy = !!row.copy;
  const handleClick = e => {
    if (disabled) {
      e.preventDefault();
      return;
    }
    if (isCopy) {
      e.preventDefault();
      const text = row.copy;
      const done = () => {
        setCopied(true);
        setTimeout(() => setCopied(false), 1800);
      };
      const fallback = () => {
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        try {
          document.execCommand('copy');
        } catch (_) {}
        document.body.removeChild(ta);
        done();
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done).catch(fallback);
      } else {
        fallback();
      }
    }
  };
  return /*#__PURE__*/React.createElement("a", {
    href: row.href || '#',
    target: row.href && !isCopy && row.href.startsWith('http') ? '_blank' : undefined,
    rel: "noreferrer",
    onMouseEnter: () => !disabled && setHover(true),
    onMouseLeave: () => setHover(false),
    onClick: handleClick,
    title: isCopy ? copied ? 'Copied!' : `Click to copy ${row.copy}` : undefined,
    style: {
      position: 'relative',
      display: 'grid',
      gridTemplateColumns: '1fr auto',
      gap: 32,
      padding: '44px 32px',
      borderBottom: `1px solid ${T.hair}`,
      alignItems: 'center',
      textDecoration: 'none',
      color: T.ink,
      opacity: disabled ? 0.5 : 1,
      cursor: disabled ? 'default' : 'pointer',
      overflow: 'hidden',
      transition: 'padding-left .55s cubic-bezier(.7,.05,.2,1)',
      paddingLeft: hover ? 56 : 32
    }
  }, /*#__PURE__*/React.createElement("div", {
    "aria-hidden": true,
    style: {
      position: 'absolute',
      inset: 0,
      background: `linear-gradient(90deg, ${T.blueLight || 'rgba(33,89,162,0.08)'} 0%, rgba(33,89,162,0) 70%)`,
      transform: hover ? 'translateX(0)' : 'translateX(-100%)',
      transition: 'transform .8s cubic-bezier(.7,.05,.2,1)',
      pointerEvents: 'none'
    }
  }), /*#__PURE__*/React.createElement("div", {
    "aria-hidden": true,
    style: {
      position: 'absolute',
      left: 0,
      top: '20%',
      bottom: '20%',
      width: 2,
      background: T.blue,
      transform: hover ? 'scaleY(1)' : 'scaleY(0)',
      transformOrigin: 'center',
      transition: 'transform .55s cubic-bezier(.7,.05,.2,1)'
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'relative',
      fontFamily: F.serif,
      fontStyle: 'italic',
      fontWeight: 400,
      fontSize: 'clamp(34px, 6vw, 64px)',
      letterSpacing: -1.2,
      lineHeight: 1,
      color: hover ? T.blue : T.ink,
      transform: hover ? 'translateX(8px)' : 'translateX(0)',
      transition: 'color .42s ease, transform .55s cubic-bezier(.7,.05,.2,1)'
    }
  }, row.label), /*#__PURE__*/React.createElement("span", {
    "aria-hidden": true,
    style: {
      position: 'relative',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: 56,
      height: 56,
      borderRadius: 999,
      border: `1px solid ${copied ? T.blue : hover ? T.blue : T.hair}`,
      background: copied ? T.blue : 'transparent',
      color: copied ? '#fff' : hover ? T.blue : T.ink,
      transition: 'border-color .42s ease, color .42s ease, background .42s ease, transform .55s cubic-bezier(.7,.05,.2,1)',
      transform: hover && !copied ? 'translate(4px, -4px)' : 'translate(0, 0)'
    }
  }, isCopy ? copied ? /*#__PURE__*/React.createElement("svg", {
    width: "20",
    height: "20",
    viewBox: "0 0 20 20",
    fill: "none"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M5 10.5L8.5 14L15 6.5",
    stroke: "currentColor",
    strokeWidth: "1.8",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  })) : /*#__PURE__*/React.createElement("svg", {
    width: "20",
    height: "20",
    viewBox: "0 0 20 20",
    fill: "none"
  }, /*#__PURE__*/React.createElement("rect", {
    x: "6.5",
    y: "6.5",
    width: "9.5",
    height: "9.5",
    rx: "1.5",
    stroke: "currentColor",
    strokeWidth: "1.5"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M4 13.5V5C4 4.17 4.67 3.5 5.5 3.5H13",
    stroke: "currentColor",
    strokeWidth: "1.5",
    strokeLinecap: "round"
  })) : /*#__PURE__*/React.createElement("svg", {
    width: "20",
    height: "20",
    viewBox: "0 0 20 20",
    fill: "none",
    style: {
      transition: 'transform .55s cubic-bezier(.7,.05,.2,1)',
      transform: hover ? 'translate(2px, -2px)' : 'translate(0, 0)'
    }
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
export default function Contact() {
  const T = WPP_T,
    F = WPP_FONTS;
  const G = WPP_GUTTER;
  const GV = 'clamp(28px, 6vw, 64px)';
  const isNarrow = WPP_useIsNarrow();
  const isMobile = WPP_useIsMobile();
  const Tag = WPP_Tag;
  const CONTACT_EMAIL = 'info@whitepeakpartners.com';
  const MAILTO = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent('Enquiry — White Peak Partners')}`;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: F.sans,
      color: T.ink
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: isNarrow ? '1fr' : '1fr 1fr',
      minHeight: isNarrow ? 0 : 720
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: T.ink,
      color: '#fff',
      padding: `100px ${GV}`,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", {
    style: {
      fontSize: 'clamp(38px, 6.5vw, 84px)',
      letterSpacing: -2.2,
      lineHeight: 0.94,
      margin: 0,
      fontWeight: 500,
      textWrap: 'balance'
    }
  }, "Tell us where your", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: F.serif,
      fontStyle: 'italic',
      fontWeight: 400,
      color: '#92a1d3'
    }
  }, "company is going.")), /*#__PURE__*/React.createElement("div", {
    "data-override-key": "contactIntro",
    style: {
      marginTop: 32,
      fontSize: 18,
      lineHeight: 1.55,
      opacity: 0.85,
      maxWidth: 480
    }
  }, WPP_t('contactIntro', "The first conversation is held by a partner and is fully confidential. We come prepared with views on your sector and ideas for your company.")))), /*#__PURE__*/React.createElement("div", {
    style: {
      background: '#fff',
      padding: `100px ${GV}`,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      fontSize: 'clamp(26px, 3.6vw, 36px)',
      letterSpacing: -0.8,
      margin: '0 0 20px',
      fontWeight: 500
    }
  }, "Start the conversation", /*#__PURE__*/React.createElement("span", {
    style: {
      color: T.blue
    }
  }, ".")), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 18,
      lineHeight: 1.6,
      color: T.inkSoft,
      margin: '0 0 36px',
      maxWidth: 460
    }
  }, "Write to us with a few lines about your company, the stage you're at, and what you're hoping to achieve. A partner will read it and reply, usually within one business day."), /*#__PURE__*/React.createElement("a", {
    href: MAILTO,
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 10,
      alignSelf: 'flex-start',
      padding: '18px 30px',
      background: T.blue,
      color: '#fff',
      borderRadius: 999,
      fontSize: 16,
      fontWeight: 600,
      textDecoration: 'none',
      boxShadow: '0 8px 24px rgba(29,78,216,0.35)'
    }
  }, CONTACT_EMAIL, " →"), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 20,
      fontSize: 13,
      color: T.mute,
      lineHeight: 1.55,
      maxWidth: 460
    }
  }, "Anything you share is treated as confidential."))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: `80px ${G}`,
      borderTop: `1px solid ${T.hair}`
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      borderTop: `1px solid ${T.ink}`
    }
  }, [{
    label: 'Email',
    value: 'info@whitepeakpartners.com',
    href: 'mailto:info@whitepeakpartners.com',
    copy: 'info@whitepeakpartners.com'
  }, {
    label: 'LinkedIn',
    value: '/company/white-peak-partners',
    href: 'https://www.linkedin.com/company/white-peak-partners'
  }].map((row, i) => /*#__PURE__*/React.createElement(ContactRow, {
    key: i,
    row: row,
    T: T,
    F: F
  })))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: `0 ${G} 100px`,
      display: 'grid',
      gridTemplateColumns: isNarrow ? '1fr' : '2fr 1fr',
      gap: 24
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
      gap: 16
    }
  }, [['LONDON', 'United Kingdom'], ['BARCELONA', 'Spain']].map(([c, country], i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      padding: 36,
      background: T.panel,
      border: `1px solid ${T.hair}`,
      borderRadius: 4
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: F.serif,
      fontSize: 22,
      fontStyle: 'italic',
      fontWeight: 400,
      color: '#92a1d3',
      letterSpacing: -0.2
    }
  }, c), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 28,
      fontWeight: 500,
      marginTop: 8,
      letterSpacing: -0.4
    }
  }, country), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 24,
      fontFamily: F.mono,
      fontSize: 11,
      letterSpacing: 0.6,
      color: T.mute
    }
  })))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 36,
      background: T.blue,
      color: '#fff',
      borderRadius: 4,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      justifyContent: 'center',
      textAlign: 'left'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: F.mono,
      fontSize: 11,
      letterSpacing: 1.4,
      opacity: 0.85,
      textTransform: 'uppercase'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 18,
      fontWeight: 500,
      marginTop: 12,
      lineHeight: 1.45
    }
  }, "Every conversation is held in confidence. We can countersign an NDA before the first meeting."))));
}
