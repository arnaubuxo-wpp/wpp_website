'use client';
// Ported from window.WPP_REDUCED_MOTION / window.WPP_useMedia / WPP_useIsMobile / WPP_useIsNarrow.
import { useEffect, useState } from 'react';

export const WPP_REDUCED_MOTION = (() => {
  try {
    return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  } catch (_) {
    return false;
  }
})();

export function WPP_useMedia(query: string) {
  const get = () => {
    try {
      return typeof window !== 'undefined' && window.matchMedia(query).matches;
    } catch (_) {
      return false;
    }
  };
  const [matches, setMatches] = useState(get);
  useEffect(() => {
    let mql: MediaQueryList;
    try {
      mql = window.matchMedia(query);
    } catch (_) {
      return;
    }
    const onChange = () => setMatches(mql.matches);
    onChange();
    if (mql.addEventListener) mql.addEventListener('change', onChange);
    else mql.addListener(onChange);
    return () => {
      if (mql.removeEventListener) mql.removeEventListener('change', onChange);
      else mql.removeListener(onChange);
    };
  }, [query]);
  return matches;
}

export const WPP_useIsMobile = () => WPP_useMedia('(max-width: 760px)');
export const WPP_useIsNarrow = () => WPP_useMedia('(max-width: 1024px)');
