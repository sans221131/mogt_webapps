'use client';

import { useEffect, useState } from 'react';
import AnimatedMogtLogo from './AnimatedMogtLogo';

// Hold long enough for the assemble to play, but never trap the user.
const MIN_VISIBLE_MS = 2000;
const MAX_WAIT_MS = 8000;
const EXIT_MS = 650; // must match the .mogtLoader opacity/transform transition

export default function LoadingScreen() {
  const [render, setRender] = useState(true);
  const [exiting, setExiting] = useState(false);

  // Any back/forward navigation must do a clean, full reload — this heavy
  // WebGL/GSAP/Lenis page does not survive being resumed from a frozen state,
  // which leaves the loader (and the 3D scene) stuck mid-init. Two paths cover
  // every case, and neither can loop:
  //   1. bfcache restore (swipe-back) — scripts stay frozen, so the only thing
  //      that runs is a pre-registered `pageshow` listener (persisted=true).
  //   2. a fresh history-traversal load — scripts run, and the Navigation
  //      Timing type reports `back_forward`.
  // After a reload the type becomes `reload` and persisted is false, so a
  // reloaded page never re-triggers either path.
  useEffect(() => {
    const onPageShow = (event: PageTransitionEvent) => {
      if (event.persisted) window.location.reload();
    };
    window.addEventListener('pageshow', onPageShow);

    const navEntry = performance.getEntriesByType('navigation')[0] as
      | PerformanceNavigationTiming
      | undefined;
    if (navEntry?.type === 'back_forward') {
      window.location.reload();
    }

    return () => window.removeEventListener('pageshow', onPageShow);
  }, []);

  useEffect(() => {
    const startedAt = performance.now();
    let settled = false;
    let exitTimer: number | undefined;
    let removeTimer: number | undefined;

    const beginExit = () => {
      if (settled) return;
      settled = true;
      setExiting(true); // CSS handles the fade/scale-out + meter completing
      removeTimer = window.setTimeout(() => setRender(false), EXIT_MS);
    };

    const onReady = () => {
      const remaining = Math.max(MIN_VISIBLE_MS - (performance.now() - startedAt), 0);
      if (exitTimer) window.clearTimeout(exitTimer);
      exitTimer = window.setTimeout(beginExit, remaining);
    };

    // Routes with the heavy WebGL scene fire `mogt:ready` once it's up; every
    // other route just waits for the window load event. Either way the minimum
    // display time lets the assemble animation play and the cap prevents hangs.
    const needsScene = window.location.pathname === '/';

    if (needsScene) {
      if ((window as Window & { __mogtReady?: boolean }).__mogtReady) onReady();
      window.addEventListener('mogt:ready', onReady);
    } else if (document.readyState === 'complete') {
      onReady();
    } else {
      window.addEventListener('load', onReady, { once: true });
    }

    const cap = window.setTimeout(beginExit, MAX_WAIT_MS); // safety net

    return () => {
      window.removeEventListener('mogt:ready', onReady);
      window.removeEventListener('load', onReady);
      if (exitTimer) window.clearTimeout(exitTimer);
      if (removeTimer) window.clearTimeout(removeTimer);
      window.clearTimeout(cap);
    };
  }, []);

  // Lock scroll while the overlay is up.
  useEffect(() => {
    document.documentElement.style.overflow = render ? 'hidden' : '';
    return () => {
      document.documentElement.style.overflow = '';
    };
  }, [render]);

  if (!render) return null;

  return (
    <div className="mogtLoader" data-exit={exiting} aria-hidden>
      <span className="mogtCorner mogtCornerTL" />
      <span className="mogtCorner mogtCornerTR" />
      <span className="mogtCorner mogtCornerBL" />
      <span className="mogtCorner mogtCornerBR" />

      <AnimatedMogtLogo />

      <div className="mogtMeter">
        <div className="mogtMeterTrack">
          <span className="mogtMeterFill" />
        </div>
        <div className="mogtMeta">
          <span>Initializing Systems</span>
        </div>
      </div>
    </div>
  );
}
