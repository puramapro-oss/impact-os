import { useState, useEffect, useRef } from 'react';
import { useReducedMotion } from './useReducedMotion';

export function useAnimatedCounter(target, duration = 1500) {
  const reducedMotion = useReducedMotion();
  const finalValue = Number.isFinite(target) ? Math.round(target) : 0;
  const canAnimate = !reducedMotion && Number.isFinite(target)
    && Number.isFinite(duration) && duration > 0
    && typeof IntersectionObserver === 'function'
    && typeof requestAnimationFrame === 'function'
    && typeof cancelAnimationFrame === 'function';
  const [display, setDisplay] = useState(() => ({ animate: canAnimate, value: canAnimate ? 0 : finalValue }));
  const ref = useRef(null);
  const hasEntered = useRef(false);
  const previousValue = useRef(0);
  const previousMode = useRef(canAnimate);

  // Settle the display before paint when motion is disabled or re-enabled;
  // an old animation value must never reappear after a preference change.
  if (display.animate !== canAnimate) {
    setDisplay({ animate: canAnimate, value: finalValue });
  }

  useEffect(() => {
    const modeChanged = previousMode.current !== canAnimate;
    previousMode.current = canAnimate;
    if (!canAnimate || modeChanged) {
      previousValue.current = finalValue;
      return;
    }
    let active = true;
    let started = false;
    let frame = null;
    let observer;

    const start = () => {
      if (!active || started) return;
      started = true;
      hasEntered.current = true;
      observer?.disconnect();
      const from = previousValue.current;
      if (from === finalValue) return;
      const startTime = performance.now();
      const animate = now => {
        if (!active) return;
        frame = null;
        const progress = Math.max(0, Math.min((now - startTime) / duration, 1));
        const eased = 1 - Math.pow(1 - progress, 3);
        const value = Math.round(from + (finalValue - from) * eased);
        previousValue.current = value;
        setDisplay({ animate: true, value });
        if (progress < 1) frame = requestAnimationFrame(animate);
      };
      frame = requestAnimationFrame(animate);
    };

    if (hasEntered.current) {
      start();
    } else {
      observer = new IntersectionObserver(entries => {
        if (entries.some(entry => entry.isIntersecting)) start();
      }, { threshold: 0.1 });
      if (ref.current) observer.observe(ref.current);
    }
    return () => {
      active = false;
      observer?.disconnect();
      if (frame !== null) cancelAnimationFrame(frame);
    };
  }, [canAnimate, finalValue, duration]);

  return { count: canAnimate ? display.value : finalValue, ref };
}
