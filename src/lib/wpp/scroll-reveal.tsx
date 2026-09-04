// @ts-nocheck
'use client';
// Ported verbatim from the original site's installScrollReveal() IIFE (window.* stripped,
// module-load-once guard dropped since a React effect with an empty dep array already runs
// exactly once for the lifetime of the mounted layout).
// Animates each top-level section of the mounted page into view as the user scrolls, by
// watching #site-root for its (currently) biggest non-fixed/sticky direct child and
// observing that child's own children with an IntersectionObserver.
import { useEffect } from 'react';
import { WPP_REDUCED_MOTION } from './hooks';

export default function ScrollRevealInstaller() {
  useEffect(() => {
    if (WPP_REDUCED_MOTION) return; // item 7: no scroll animation for reduced-motion users

  const REVEAL_DUR = 650; // ms — quick enough to keep up with scroll, slow enough to read
  const REVEAL_DIST = 24; // px (vertical)
  const REVEAL_DIST_X = 48; // px (horizontal)
  const EASE = 'cubic-bezier(.2,.7,.2,1)';
  const animateIn = el => {
    const dir = el.dataset.wppRevealFrom || 'bottom'; // 'left' | 'right' | 'bottom'
    // Promote to its own layer only for the duration of the animation.
    el.style.willChange = 'transform, opacity';
    // Force the start frame, then transition to identity on the next frame.
    requestAnimationFrame(() => {
      el.style.transition = `transform ${REVEAL_DUR}ms ${EASE}, opacity ${REVEAL_DUR}ms ease`;
      el.style.transform = 'translate3d(0,0,0)';
      el.style.opacity = '1';
      const clear = () => {
        el.style.transition = '';
        el.style.transform = '';
        el.style.opacity = '';
        el.style.willChange = '';
        el.removeEventListener('transitionend', clear);
      };
      el.addEventListener('transitionend', clear);
      // Safety: clear even if transitionend never fires (e.g. tab hidden)
      setTimeout(clear, REVEAL_DUR + 200);
    });
  };
  const prime = el => {
    const dir = el.dataset.wppRevealFrom || 'bottom';
    el.style.opacity = '0.001';
    if (dir === 'left') el.style.transform = `translate3d(${-REVEAL_DIST_X}px,0,0)`;else if (dir === 'right') el.style.transform = `translate3d(${REVEAL_DIST_X}px,0,0)`;else el.style.transform = `translate3d(0,${REVEAL_DIST}px,0)`;
  };
  const observed = new WeakSet();
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        animateIn(e.target);
        io.unobserve(e.target);
      }
    });
    // Trigger as the element's top enters the bottom of the viewport (not the middle),
    // so content is already visible by the time you scroll to it.
  }, {
    threshold: 0,
    rootMargin: '0px 0px -8% 0px'
  });
  function scan() {
    const root = document.getElementById('site-root');
    if (!root) return;
    const page = root.firstElementChild;
    if (!page) return;
    const directKids = Array.from(page.children);
    let target = page;
    if (directKids.length > 0) {
      let best = null,
        bestH = 0;
      for (const k of directKids) {
        const cs = getComputedStyle(k);
        if (cs.position === 'sticky' || cs.position === 'fixed') continue;
        if (k.offsetHeight > bestH) {
          bestH = k.offsetHeight;
          best = k;
        }
      }
      if (best && best.children.length >= 3) target = best;
    }
    Array.from(target.children).forEach(row => {
      const cs = getComputedStyle(row);
      if (cs.position === 'sticky' || cs.position === 'fixed') return;
      if (row.dataset.wppNoReveal === '1') return;
      if (observed.has(row)) return;
      observed.add(row);
      // For elements ALREADY in view at load time, leave them as-is (no animation).
      const r = row.getBoundingClientRect();
      const inViewNow = r.top < innerHeight && r.bottom > 0;
      if (inViewNow) return;
      prime(row);
      io.observe(row);
    });
  }
  let scheduled = false;
  const schedule = () => {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        scheduled = false;
        scan();
      });
    });
  };
  const mo = new MutationObserver(schedule);
  const start = () => {
    const root = document.getElementById('site-root');
    if (!root) {
      setTimeout(start, 50);
      return;
    }
    mo.observe(root, {
      childList: true,
      subtree: false
    });
    schedule();
  };
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
  }, []);
  return null;
}
