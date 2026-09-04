// @ts-nocheck
'use client';
// Ported nearly verbatim from the original site's Tag / Reveal / CohortTeaser / DealLogo
// components. `window.` prefixes were stripped; WPP_T/WPP_FONTS/WPP_REDUCED_MOTION come
// from the compat modules below instead of being read off `window` at call time.
import React from 'react';
import { WPP_T, WPP_FONTS } from './tokens';
import { WPP_REDUCED_MOTION } from './hooks';

export function Tag({
  children,
  color
}) {
  const T = WPP_T,
    F = WPP_FONTS;
  return /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: F.mono,
      fontSize: 11,
      letterSpacing: 1.4,
      textTransform: 'uppercase',
      color: color || T.mute
    }
  }, children);
};

// Scroll-triggered fade-in. Wrap any block in <WPP_Reveal>...</WPP_Reveal>.
export function Reveal({
  children,
  as: As = 'div',
  delay = 0,
  y = 24,
  style = {}
}) {
  const ref = React.useRef(null);
  const reduced = WPP_REDUCED_MOTION;
  const [shown, setShown] = React.useState(reduced);
  React.useEffect(() => {
    if (reduced) return;
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        setShown(true);
        io.disconnect();
      }
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return /*#__PURE__*/React.createElement(As, {
    ref: ref,
    style: {
      ...style,
      opacity: shown ? 1 : 0,
      transform: shown ? 'translateY(0)' : `translateY(${y}px)`,
      transition: `opacity .9s ease ${delay}ms, transform .9s cubic-bezier(.2,.7,.2,1) ${delay}ms`,
      willChange: 'opacity, transform'
    }
  }, children);
};

// Cohort heatmap teaser — a tiny SaaS retention grid that animates in.
export function CohortTeaser({
  width = 320,
  height = 160
}) {
  const T = WPP_T;
  const ref = React.useRef(null);
  const [t, setT] = React.useState(WPP_REDUCED_MOTION ? 1 : 0);
  React.useEffect(() => {
    if (WPP_REDUCED_MOTION) return;
    const el = ref.current;
    if (!el) return;
    let raf, start;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        const tick = ts => {
          if (!start) start = ts;
          const p = Math.min(1, (ts - start) / 2400);
          setT(p);
          if (p < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
        io.disconnect();
      }
    }, {
      threshold: 0.3
    });
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, []);
  const rows = 6,
    cols = 10;
  const cellW = width / cols,
    cellH = height / rows;
  return /*#__PURE__*/React.createElement("svg", {
    ref: ref,
    width: width,
    height: height,
    viewBox: `0 0 ${width} ${height}`,
    style: {
      display: 'block'
    }
  }, Array.from({
    length: rows
  }).flatMap((_, r) => Array.from({
    length: cols
  }).map((__, c) => {
    // Retention curve: strong drop left → right (column = months since signup),
    // gentle drop top → bottom (cohort age) so rows still vary subtly.
    const colFalloff = 1 - c * 0.105; // first col 1.0 → last col ~-0.05
    const rowJitter = 1 - r * 0.03; // very subtle vertical
    const baseRetention = Math.max(0.06, colFalloff * rowJitter);
    // Stagger reveal left → right
    const cellDelay = c * 0.07 + r * 0.012;
    const local = Math.max(0, Math.min(1, (t - cellDelay) * 6));
    const opacity = baseRetention * local;
    return /*#__PURE__*/React.createElement("rect", {
      key: `${r}-${c}`,
      x: c * cellW + 1,
      y: r * cellH + 1,
      width: cellW - 2,
      height: cellH - 2,
      fill: T.blue,
      opacity: opacity,
      rx: 1
    });
  })), /*#__PURE__*/React.createElement("line", {
    x1: 0,
    y1: height,
    x2: width,
    y2: height,
    stroke: T.hair,
    strokeWidth: 0.5
  }));
};

export function DealLogo({
  label,
  big = false
}) {
  const T = WPP_T,
    F = WPP_FONTS;
  const initials = label.replace(/[^A-Za-z]/g, '').slice(0, 2).toUpperCase();
  return /*#__PURE__*/React.createElement("div", {
    style: {
      aspectRatio: big ? '16 / 9' : '5 / 3',
      background: '#fff',
      border: `1px solid ${T.hair}`,
      borderRadius: 4,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: F.sans,
      fontSize: big ? 36 : 24,
      fontWeight: 700,
      letterSpacing: -0.6,
      color: T.ink,
      textAlign: 'center',
      lineHeight: 1,
      padding: 16
    }
  }, label), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: 10,
      left: 10,
      fontFamily: F.mono,
      fontSize: 9,
      letterSpacing: 1.4,
      color: T.mute
    }
  }, initials));
};

