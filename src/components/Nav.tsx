// @ts-nocheck
'use client';
// Ported nearly verbatim from the original site's NavRail + window.WPP_Nav (window.* stripped).
import React from 'react';
import { WPP_T, WPP_FONTS, WPP_GUTTER, WPP_LINK } from '@/lib/wpp/tokens';
import { WPP_useIsNarrow, WPP_REDUCED_MOTION } from '@/lib/wpp/hooks';
import { __R } from '@/lib/wpp/assets';

function NavRail({
  items,
  current,
  onNavigate,
  T,
  F
}) {
  const containerRef = React.useRef(null);
  const itemRefs = React.useRef({});
  const [hoverKey, setHoverKey] = React.useState(null);
  const [indicator, setIndicator] = React.useState({
    left: 0,
    width: 0,
    opacity: 0
  });
  const [activeRect, setActiveRect] = React.useState({
    left: 0,
    width: 0
  });

  // Measure the active item's position so the active underline animates between pages too
  const measure = React.useCallback(() => {
    const el = itemRefs.current[current];
    const container = containerRef.current;
    if (el && container) {
      const cRect = container.getBoundingClientRect();
      const eRect = el.getBoundingClientRect();
      setActiveRect({
        left: eRect.left - cRect.left,
        width: eRect.width
      });
    }
  }, [current]);
  React.useLayoutEffect(() => {
    measure();
  }, [measure]);
  React.useEffect(() => {
    const onResize = () => measure();
    addEventListener('resize', onResize);
    return () => removeEventListener('resize', onResize);
  }, [measure]);

  // Hover indicator
  const handleEnter = k => {
    const el = itemRefs.current[k];
    const container = containerRef.current;
    if (!el || !container) return;
    const cRect = container.getBoundingClientRect();
    const eRect = el.getBoundingClientRect();
    setHoverKey(k);
    setIndicator({
      left: eRect.left - cRect.left,
      width: eRect.width,
      opacity: 1
    });
  };
  const handleLeave = () => {
    setHoverKey(null);
    setIndicator(s => ({
      ...s,
      opacity: 0
    }));
  };
  return /*#__PURE__*/React.createElement("div", {
    ref: containerRef,
    onMouseLeave: handleLeave,
    style: {
      display: 'flex',
      gap: 28,
      fontFamily: F.sans,
      fontSize: 14,
      color: T.ink,
      whiteSpace: 'nowrap',
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement("div", {
    "aria-hidden": true,
    style: {
      position: 'absolute',
      left: indicator.left - 14,
      top: '50%',
      transform: 'translateY(-50%)',
      width: indicator.width + 28,
      height: 32,
      background: T.blueLight || 'rgba(33,89,162,0.08)',
      borderRadius: 999,
      opacity: indicator.opacity * 0.55,
      transition: 'left .42s cubic-bezier(.7,.05,.2,1), width .42s cubic-bezier(.7,.05,.2,1), opacity .28s ease',
      pointerEvents: 'none',
      zIndex: 0
    }
  }), /*#__PURE__*/React.createElement("div", {
    "aria-hidden": true,
    style: {
      position: 'absolute',
      left: activeRect.left,
      bottom: -2,
      width: activeRect.width,
      height: 2,
      background: T.blue,
      transition: 'left .5s cubic-bezier(.7,.05,.2,1), width .5s cubic-bezier(.7,.05,.2,1)',
      pointerEvents: 'none',
      zIndex: 1
    }
  }), items.map(([k, l]) => {
    const isCurrent = current === k;
    const isHovered = hoverKey === k;
    return /*#__PURE__*/React.createElement("a", {
      key: k,
      ref: el => {
        itemRefs.current[k] = el;
      },
      href: WPP_LINK(k),
      onClick: e => {
        e.preventDefault();
        onNavigate(k);
      },
      onMouseEnter: () => handleEnter(k),
      style: {
        textDecoration: 'none',
        color: isCurrent ? T.blue : isHovered ? T.blue : T.ink,
        fontWeight: isCurrent ? 600 : 400,
        paddingBottom: 4,
        position: 'relative',
        zIndex: 2,
        transition: 'color .28s ease, letter-spacing .42s cubic-bezier(.7,.05,.2,1)',
        letterSpacing: isHovered && !isCurrent ? '0.012em' : '0'
      }
    }, l);
  }));
}
export default function Nav({
  current,
  onNavigate
}) {
  const T = WPP_T,
    F = WPP_FONTS;
  const G = WPP_GUTTER;
  const isNarrow = WPP_useIsNarrow();
  const [scrolled, setScrolled] = React.useState(false);
  const [menuOpen, setMenuOpen] = React.useState(false);
  React.useEffect(() => {
    const onScroll = () => setScrolled(scrollY > 24);
    onScroll();
    addEventListener('scroll', onScroll, {
      passive: true
    });
    return () => removeEventListener('scroll', onScroll);
  }, []);
  // Close the mobile menu on navigation or when leaving narrow layout
  React.useEffect(() => {
    setMenuOpen(false);
  }, [current]);
  React.useEffect(() => {
    if (!isNarrow) setMenuOpen(false);
  }, [isNarrow]);
  // Lock body scroll while the menu is open
  React.useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);
  const items = [['home', 'Home'], ['what', 'What we do'], ['about', 'About us'], ['blog', 'Blog'], ['contact', 'Contact']];
  const go = k => e => {
    e.preventDefault();
    setMenuOpen(false);
    onNavigate(k);
  };
  return /*#__PURE__*/React.createElement("header", null, /*#__PURE__*/React.createElement("nav", {
    "aria-label": "Main",
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 16,
      padding: scrolled ? `12px ${G}` : `20px ${G}`,
      borderBottom: `1px solid ${scrolled ? T.hair : 'transparent'}`,
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      background: scrolled ? 'rgba(255,255,255,0.92)' : 'rgba(255,255,255,0.98)',
      backdropFilter: 'blur(10px)',
      zIndex: 50,
      boxShadow: scrolled ? '0 4px 20px rgba(10,10,10,0.04)' : 'none',
      transition: 'padding .28s ease, background .28s ease, box-shadow .28s ease, border-color .28s ease'
    }
  }, /*#__PURE__*/React.createElement("a", {
    href: WPP_LINK('home'),
    onClick: go('home'),
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 14,
      textDecoration: 'none'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: __R ? __R('assets/logo-navy.png') : 'assets/logo-navy.png?v=6',
    alt: "White Peak Partners — home",
    style: {
      height: isNarrow ? 42 : scrolled ? 48 : 60,
      display: 'block',
      transition: 'height .28s ease'
    }
  })), !isNarrow && /*#__PURE__*/React.createElement(NavRail, {
    items: items,
    current: current,
    onNavigate: onNavigate,
    T: T,
    F: F
  }), !isNarrow && /*#__PURE__*/React.createElement("a", {
    href: WPP_LINK('contact'),
    onClick: go('contact'),
    style: {
      padding: scrolled ? '8px 16px' : '10px 18px',
      background: T.blue,
      color: '#fff',
      borderRadius: 999,
      fontSize: 13,
      fontWeight: 500,
      textDecoration: 'none',
      transition: 'padding .28s ease',
      whiteSpace: 'nowrap'
    }
  }, "Get in touch →"), isNarrow && /*#__PURE__*/React.createElement("button", {
    "aria-label": menuOpen ? 'Close menu' : 'Open menu',
    "aria-expanded": menuOpen,
    "aria-controls": "wpp-mobile-menu",
    onClick: () => setMenuOpen(o => !o),
    style: {
      background: 'transparent',
      border: `1px solid ${T.hair}`,
      borderRadius: 8,
      width: 44,
      height: 44,
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      color: T.ink,
      padding: 0
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "20",
    height: "20",
    viewBox: "0 0 20 20",
    fill: "none",
    "aria-hidden": "true"
  }, menuOpen ? /*#__PURE__*/React.createElement("path", {
    d: "M4 4L16 16M16 4L4 16",
    stroke: "currentColor",
    strokeWidth: "1.6",
    strokeLinecap: "round"
  }) : /*#__PURE__*/React.createElement("path", {
    d: "M3 5.5H17M3 10H17M3 14.5H17",
    stroke: "currentColor",
    strokeWidth: "1.6",
    strokeLinecap: "round"
  })))), isNarrow && /*#__PURE__*/React.createElement("div", {
    id: "wpp-mobile-menu",
    style: {
      position: 'fixed',
      inset: 0,
      zIndex: 49,
      background: 'rgba(255,255,255,0.98)',
      backdropFilter: 'blur(12px)',
      paddingTop: 96,
      display: 'flex',
      flexDirection: 'column',
      opacity: menuOpen ? 1 : 0,
      pointerEvents: menuOpen ? 'auto' : 'none',
      transition: WPP_REDUCED_MOTION ? 'none' : 'opacity .25s ease'
    },
    "aria-hidden": !menuOpen
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      padding: `8px ${G}`
    }
  }, items.map(([k, l]) => /*#__PURE__*/React.createElement("a", {
    key: k,
    href: WPP_LINK(k),
    onClick: go(k),
    tabIndex: menuOpen ? 0 : -1,
    style: {
      fontFamily: F.sans,
      fontSize: 28,
      fontWeight: current === k ? 600 : 500,
      letterSpacing: -0.6,
      color: current === k ? T.blue : T.ink,
      textDecoration: 'none',
      padding: '18px 0',
      borderBottom: `1px solid ${T.hair}`
    }
  }, l)), /*#__PURE__*/React.createElement("a", {
    href: WPP_LINK('contact'),
    onClick: go('contact'),
    tabIndex: menuOpen ? 0 : -1,
    style: {
      marginTop: 28,
      alignSelf: 'flex-start',
      padding: '14px 24px',
      background: T.blue,
      color: '#fff',
      borderRadius: 999,
      fontSize: 15,
      fontWeight: 600,
      textDecoration: 'none',
      fontFamily: F.sans
    }
  }, "Get in touch →"))));
};
