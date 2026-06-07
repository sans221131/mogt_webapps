'use client';

// TEMPORARY visual-debug route for TrustEngineSection. Delete after review.
import { useEffect } from 'react';
import TrustEngineSection from '../components/TrustEngineSection';

export default function TestTrust() {
  useEffect(() => {
    const fire = () => window.dispatchEvent(new CustomEvent('trustSignal', { detail: 4 }));
    fire();
    const id = setInterval(fire, 150);
    const stop = setTimeout(() => clearInterval(id), 1500);
    return () => { clearInterval(id); clearTimeout(stop); };
  }, []);

  return (
    <div style={{ width: '100%', height: '100vh', background: '#050505', overflow: 'hidden' }}>
      {/* Force the framer entrance state visible for a static headless screenshot.
          display:none (mobile core hide) still wins over forced opacity. */}
      <style>{`
        .te .teHead > *, .te .teHeadRow > *, .te .teSignals, .te .teCore,
        .te .teDetail, .te .tcReadoutInner, .te .tmBodyInner, .te .teRow {
          opacity: 1 !important; filter: none !important; transform: none !important;
        }
      `}</style>
      <TrustEngineSection />
    </div>
  );
}
