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

    if ((window as Window & { __mogtReady?: boolean }).__mogtReady) onReady();
    window.addEventListener('mogt:ready', onReady);
    const cap = window.setTimeout(beginExit, MAX_WAIT_MS); // safety net

    return () => {
      window.removeEventListener('mogt:ready', onReady);
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
