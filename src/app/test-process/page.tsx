'use client';

// TEMPORARY visual-debug route for ProcessBlueprintSection. Delete after review.
import { useEffect } from 'react';
import ProcessBlueprintSection from '../components/ProcessBlueprintSection';

export default function TestProcess() {
  useEffect(() => {
    const fire = () => window.dispatchEvent(new CustomEvent('blueprintStep', { detail: 0 }));
    fire();
    const id = setInterval(fire, 200);
    const stop = setTimeout(() => clearInterval(id), 1500);
    return () => { clearInterval(id); clearTimeout(stop); };
  }, []);

  return (
    <div style={{ width: '100%', height: '100vh', background: '#050505', overflow: 'hidden' }}>
      {/* Force past the boot-reveal gate for a static headless screenshot. */}
      <style>{`
        .processHeader, .stepper, .processBody, .detailInner {
          opacity: 1 !important; animation: none !important;
          transform: none !important; filter: none !important;
        }
      `}</style>
      <ProcessBlueprintSection />
    </div>
  );
}
