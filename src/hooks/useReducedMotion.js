import { useSyncExternalStore } from 'react';

const query = '(prefers-reduced-motion: reduce)';
const mediaQuery = () => typeof window !== 'undefined' && typeof window.matchMedia === 'function'
  ? window.matchMedia(query) : null;

function subscribe(listener) {
  const media = mediaQuery();
  if (!media) return () => {};
  if (typeof media.addEventListener === 'function') {
    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }
  // Older embedded browsers expose the original MediaQueryList listener API.
  if (typeof media.addListener === 'function') {
    media.addListener(listener);
    return () => media.removeListener(listener);
  }
  return () => {};
}

export function useReducedMotion() {
  return useSyncExternalStore(subscribe, () => mediaQuery()?.matches ?? false, () => true);
}
