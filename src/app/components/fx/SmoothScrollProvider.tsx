'use client';

import { ReactNode, useEffect } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

type SmoothScrollProviderProps = {
  children: ReactNode;
};

export function SmoothScrollProvider({ children }: SmoothScrollProviderProps) {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;

    gsap.registerPlugin(ScrollTrigger);

    let lenis: Lenis | null = null;
    let firstFrame = 0;
    let secondFrame = 0;
    let postLoaderRefreshScheduled = false;

    const refreshAfterLoaderComplete = () => {
      if (postLoaderRefreshScheduled) return;
      postLoaderRefreshScheduled = true;

      if (process.env.NODE_ENV === 'development') {
        console.log('[mogt] loader-complete received', {
          triggersBeforeRefresh: ScrollTrigger.getAll().length,
        });
      }

      firstFrame = requestAnimationFrame(() => {
        secondFrame = requestAnimationFrame(() => {
          (lenis as (Lenis & { resize?: () => void }) | null)?.resize?.();
          ScrollTrigger.refresh(true);

          if (process.env.NODE_ENV === 'development') {
            console.log('[mogt] post-loader ScrollTrigger refresh complete', {
              triggersAfterRefresh: ScrollTrigger.getAll().length,
            });
          }
        });
      });
    };

    window.addEventListener('mogt:loader-complete', refreshAfterLoaderComplete);

    // On touch/mobile devices, let ScrollTrigger use native scroll.
    // Lenis touch smoothing interferes with pinned ScrollTrigger sections.
    const useNativeScroll = prefersReducedMotion || isTouchDevice;

    if (!useNativeScroll) {
      lenis = new Lenis({
        duration: 1.0,
        easing: (t) => 1 - Math.pow(1 - t, 3),
        smoothWheel: true,
        syncTouch: false,
        wheelMultiplier: 0.85,
      });

      lenis.on('scroll', ScrollTrigger.update);
    }

    const update = (time: number) => {
      lenis?.raf(time * 1000);
    };

    if (lenis) {
      gsap.ticker.add(update);
      gsap.ticker.lagSmoothing(0);
    }

    // Early mount refreshes remain as safeguards; the authoritative refresh
    // after the global loader unlocks scroll is handled by mogt:loader-complete.
    requestAnimationFrame(() => ScrollTrigger.refresh());

    if ((window as Window & { __mogtLoaderComplete?: boolean }).__mogtLoaderComplete) {
      refreshAfterLoaderComplete();
    }

    return () => {
      window.removeEventListener('mogt:loader-complete', refreshAfterLoaderComplete);
      if (firstFrame) cancelAnimationFrame(firstFrame);
      if (secondFrame) cancelAnimationFrame(secondFrame);
      if (lenis) {
        lenis.off('scroll', ScrollTrigger.update);
        gsap.ticker.remove(update);
        lenis.destroy();
      }
    };
  }, []);

  return <>{children}</>;
}
