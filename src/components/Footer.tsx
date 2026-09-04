// @ts-nocheck
'use client';
// Ported nearly verbatim from the original site's window.WPP_Footer (window.* stripped).
import React from 'react';
import { WPP_T, WPP_FONTS, WPP_GUTTER, WPP_LINK } from '@/lib/wpp/tokens';
import { WPP_useIsMobile, WPP_useIsNarrow } from '@/lib/wpp/hooks';

export default function Footer({
  onNavigate,
  variant = 'full'
}) {
  const T = WPP_T,
    F = WPP_FONTS;
  const G = WPP_GUTTER;
  const isMobile = WPP_useIsMobile();
  const isNarrow = WPP_useIsNarrow();
  const NEWSLETTER_URL = 'https://whitepeakpartners.us13.list-manage.com/subscribe?u=9bad57db761ffe74716f06ed2&id=add5969a23';

  // Legal strip — Privacy and Terms are now real pages (item 4).
  const LegalStrip = () => /*#__PURE__*/React.createElement("div", {
    style: {
      padding: `24px ${G}`,
      background: T.ink,
      color: 'rgba(255,255,255,0.45)',
      borderTop: '1px solid rgba(255,255,255,0.08)',
      display: 'flex',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: 12,
      fontFamily: F.mono,
      fontSize: 11,
      letterSpacing: 1.2,
      textTransform: 'uppercase'
    }
  }, /*#__PURE__*/React.createElement("span", null, "© White Peak Partners ", new Date().getFullYear()), /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      gap: 6
    }
  }, /*#__PURE__*/React.createElement("a", {
    href: WPP_LINK('privacy'),
    onClick: e => {
      e.preventDefault();
      onNavigate('privacy');
    },
    style: {
      color: 'inherit',
      textDecoration: 'none'
    }
  }, "Privacy"), /*#__PURE__*/React.createElement("span", {
    "aria-hidden": true
  }, "·"), /*#__PURE__*/React.createElement("a", {
    href: WPP_LINK('terms'),
    onClick: e => {
      e.preventDefault();
      onNavigate('terms');
    },
    style: {
      color: 'inherit',
      textDecoration: 'none'
    }
  }, "Terms of use")));

  // 'minimal' — used on the home page where Ridge already renders its own dark CTA + contact block.
  if (variant === 'minimal') {
    return /*#__PURE__*/React.createElement("footer", null, /*#__PURE__*/React.createElement(LegalStrip, null));
  }
  return /*#__PURE__*/React.createElement("footer", null, /*#__PURE__*/React.createElement("div", {
    style: {
      background: T.ink,
      color: '#fff',
      padding: `80px ${G} 60px`
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: isMobile ? '1fr' : isNarrow ? 'repeat(2, 1fr)' : '1.4fr 1fr 1fr 1fr',
      gap: 48
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      gridColumn: 'span 1'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: F.serif,
      fontSize: 'clamp(24px, 3vw, 30px)',
      fontStyle: 'italic',
      fontWeight: 400,
      lineHeight: 1.2,
      maxWidth: 360
    }
  }, "Partners to the founders and teams building Europe's best technology companies."), /*#__PURE__*/React.createElement("a", {
    href: WPP_LINK('contact'),
    onClick: e => {
      e.preventDefault();
      onNavigate('contact');
    },
    style: {
      display: 'inline-block',
      marginTop: 28,
      padding: '12px 20px',
      background: T.blue,
      color: '#fff',
      borderRadius: 999,
      fontFamily: F.sans,
      fontSize: 13,
      fontWeight: 600,
      textDecoration: 'none'
    }
  }, "Start a conversation →")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: F.mono,
      fontSize: 11,
      letterSpacing: 1.4,
      color: T.blueLight,
      textTransform: 'uppercase',
      marginBottom: 18
    }
  }, "Sitemap"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 10,
      fontFamily: F.sans,
      fontSize: 14
    }
  }, [['home', 'Home'], ['about', 'About us'], ['what', 'What we do'], ['contact', 'Contact']].map(([k, l]) => /*#__PURE__*/React.createElement("a", {
    key: k,
    href: WPP_LINK(k),
    onClick: e => {
      e.preventDefault();
      onNavigate(k);
    },
    style: {
      color: '#fff',
      textDecoration: 'none',
      opacity: 0.8
    }
  }, l)))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: F.mono,
      fontSize: 11,
      letterSpacing: 1.4,
      color: T.blueLight,
      textTransform: 'uppercase',
      marginBottom: 18
    }
  }, "Contact"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: F.sans,
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
      fontFamily: F.sans,
      fontSize: 13,
      fontWeight: 500,
      background: 'rgba(255,255,255,0.04)',
      transition: 'background 200ms ease, border-color 200ms ease'
    },
    onMouseEnter: e => {
      e.currentTarget.style.background = '#0a66c2';
      e.currentTarget.style.borderColor = '#0a66c2';
    },
    onMouseLeave: e => {
      e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
      e.currentTarget.style.borderColor = 'rgba(255,255,255,0.25)';
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
      fontFamily: F.mono,
      fontSize: 11,
      letterSpacing: 1.4,
      color: T.blueLight,
      textTransform: 'uppercase',
      marginBottom: 18
    }
  }, "Offices"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: F.sans,
      fontSize: 14,
      lineHeight: 1.7,
      opacity: 0.85,
      marginBottom: 22
    }
  }, "London", /*#__PURE__*/React.createElement("br", null), "Barcelona"), /*#__PURE__*/React.createElement("a", {
    href: NEWSLETTER_URL,
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
      fontFamily: F.sans,
      fontSize: 13,
      fontWeight: 600,
      textDecoration: 'none',
      transition: 'transform 200ms ease, box-shadow 200ms ease'
    },
    onMouseEnter: e => {
      e.currentTarget.style.transform = 'translateY(-1px)';
      e.currentTarget.style.boxShadow = '0 8px 20px rgba(33,89,162,0.35)';
    },
    onMouseLeave: e => {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.boxShadow = 'none';
    }
  }, "Subscribe to our newsletter")))), /*#__PURE__*/React.createElement(LegalStrip, null));
};

