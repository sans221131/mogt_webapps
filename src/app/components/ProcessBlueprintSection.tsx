'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';

const useIsoEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

// ── Process step data ──────────────────────────────────────────────────────────

const STEPS = [
  {
    id: '01', name: 'DECODE', mode: 'INTELLIGENCE GATHERING',
    desc: 'Understand the product, business model, users, constraints, and operational pressure before touching the interface.',
    input: ['BUSINESS GOALS', 'USER NEEDS', 'STAKEHOLDER NOISE', 'EXISTING GAPS'],
    output: ['CLEAR DIRECTION', 'PRODUCT PRIORITIES', 'PROBLEM FRAME'],
    status: 'ACTIVE',
  },
  {
    id: '02', name: 'MAP', mode: 'FLOW ARCHITECTURE',
    desc: 'Turn messy requirements into user flows, roles, permissions, screen states, and decision paths.',
    input: ['REQUIREMENTS', 'WORKFLOWS', 'EDGE CASES', 'ACCESS RULES'],
    output: ['FLOW MAP', 'SCREEN MAP', 'STATE LOGIC'],
    status: 'MAPPED',
  },
  {
    id: '03', name: 'PROTOTYPE', mode: 'INTERFACE MODELING',
    desc: 'Build fast interaction models to test structure before wasting time polishing pixels that may get deleted anyway.',
    input: ['MAPPED FLOWS', 'CORE SCREENS', 'PRODUCT ASSUMPTIONS'],
    output: ['CLICKABLE PROTOTYPE', 'INTERACTION DIRECTION', 'UX DECISIONS'],
    status: 'STABLE',
  },
  {
    id: '04', name: 'SYSTEMIZE', mode: 'COMPONENT ARCHITECTURE',
    desc: 'Convert screens into reusable components, patterns, layout rules, and visual systems.',
    input: ['APPROVED SCREENS', 'REPEATED PATTERNS', 'VISUAL RULES'],
    output: ['DESIGN SYSTEM', 'COMPONENT LIBRARY', 'RESPONSIVE LOGIC'],
    status: 'STABLE',
  },
  {
    id: '05', name: 'VALIDATE', mode: 'STRESS TEST',
    desc: 'Stress-test usability, hierarchy, mobile behavior, edge cases, and high-risk flows before handoff.',
    input: ['PROTOTYPE', 'SYSTEM RULES', 'REAL SCENARIOS'],
    output: ['FIXED GAPS', 'CLEARER DECISIONS', 'REDUCED DELIVERY RISK'],
    status: 'VERIFIED',
  },
  {
    id: '06', name: 'SHIP', mode: 'HANDOFF PROTOCOL',
    desc: 'Prepare developer-ready specs, responsive states, interaction notes, and iteration paths.',
    input: ['FINAL DESIGNS', 'COMPONENT RULES', 'VALIDATED FLOWS'],
    output: ['HANDOFF SPECS', 'BUILD-READY SYSTEM', 'ITERATION PLAN'],
    status: 'READY',
  },
] as const;

// ── Blueprint SVG — center visual ─────────────────────────────────────────────

function BlueprintSVG({ step }: { step: number }) {
  const lineGroupRef = useRef<SVGGElement>(null);
  const prevStep = useRef<number>(-1);
  const reducedRef = useRef(false);

  useIsoEffect(() => {
    reducedRef.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);

  useIsoEffect(() => {
    if (reducedRef.current || !lineGroupRef.current) {
      prevStep.current = step;
      return;
    }
    if (step === 1 && prevStep.current !== 1) {
      const lines = Array.from(lineGroupRef.current.querySelectorAll('line'));
      lines.forEach((line, i) => {
        gsap.fromTo(
          line,
          { strokeDashoffset: 220 },
          { strokeDashoffset: 0, duration: 0.55, delay: i * 0.09, ease: 'power2.out' },
        );
      });
    }
    prevStep.current = step;
  }, [step]);

  // Phase layer opacities
  const p0 = step === 0 ? 1 : step === 1 ? 0.18 : 0;
  const p1 = step === 1 ? 1 : step === 2 ? 0.12 : 0;
  const p2 = step >= 2 ? 1 : 0;
  const p3 = step >= 3 ? 1 : 0;
  const p4 = step >= 4 ? 1 : 0;
  const p5 = step === 5 ? 1 : 0;

  const T = 'opacity 0.45s ease';

  return (
    <svg
      viewBox="0 0 480 340"
      width="100%"
      height="100%"
      style={{ display: 'block' }}
      aria-hidden="true"
    >
      <defs>
        <pattern id="bpGrid" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M20 0L0 0 0 20" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" />
        </pattern>
        <marker id="bpArrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto">
          <path d="M0,0 L10,5 L0,10 L3,5 Z" fill="rgba(255,255,255,0.65)" />
        </marker>
      </defs>

      {/* Background grid */}
      <rect width="480" height="340" fill="url(#bpGrid)" />
      <rect x="1" y="1" width="478" height="338" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />

      {/* Static corner brackets */}
      {[
        'M8,1 L1,1 L1,8',
        'M472,1 L479,1 L479,8',
        'M8,339 L1,339 L1,332',
        'M472,339 L479,339 L479,332',
      ].map((d, i) => (
        <path key={i} d={d} fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="1.5" />
      ))}

      {/* ── PHASE 0: DECODE — Scattered requirement blocks ─────────── */}
      <g style={{ opacity: p0, transition: T }}>
        {[
          { x: 18, y: 32, w: 118, label: 'BUSINESS GOALS' },
          { x: 182, y: 14, w: 100, label: 'USER NEEDS' },
          { x: 344, y: 44, w: 112, label: 'CONSTRAINTS' },
          { x: 22, y: 188, w: 130, label: 'STAKEHOLDER NOISE' },
          { x: 292, y: 200, w: 106, label: 'PRODUCT GAPS' },
          { x: 162, y: 284, w: 116, label: 'MARKET SIGNAL' },
        ].map(({ x, y, w, label }, i) => (
          <g key={i}>
            <rect
              x={x} y={y} width={w} height={28}
              fill="rgba(255,255,255,0.025)"
              stroke="rgba(255,255,255,0.26)"
              strokeWidth="1"
              strokeDasharray="4 2"
            />
            <text
              x={x + w / 2} y={y + 18}
              textAnchor="middle"
              fill="rgba(255,255,255,0.62)"
              fontSize="7.5"
              fontFamily="monospace"
              letterSpacing="0.07em"
            >{label}</text>
          </g>
        ))}
        {/* Noise scatter dots */}
        {[[65, 106], [148, 148], [330, 128], [415, 165], [98, 250], [376, 288]].map(([cx, cy], i) => (
          <circle key={i} cx={cx} cy={cy} r="2" fill="rgba(255,255,255,0.1)" />
        ))}
        <text x="240" y="170" textAnchor="middle" fill="rgba(255,255,255,0.045)" fontSize="30" fontFamily="monospace" fontWeight="700" letterSpacing="0.1em">DECODE</text>
      </g>

      {/* ── PHASE 1: MAP — Flow connections ──────────────────────────── */}
      <g ref={lineGroupRef} style={{ opacity: p1, transition: T }}>
        {/* Hub */}
        <circle cx="240" cy="162" r="26" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.56)" strokeWidth="1.5" />
        <circle cx="240" cy="162" r="19" fill="none" stroke="rgba(255,255,255,0.16)" strokeWidth="0.5" strokeDasharray="3 2.5" />
        <text x="240" y="158" textAnchor="middle" fill="rgba(255,255,255,0.85)" fontSize="7" fontFamily="monospace" letterSpacing="0.05em">DECISION</text>
        <text x="240" y="170" textAnchor="middle" fill="rgba(255,255,255,0.85)" fontSize="7" fontFamily="monospace" letterSpacing="0.05em">HUB</text>

        {/* Connector lines (animated by GSAP on entry) */}
        <line x1="136" y1="46" x2="214" y2="148" stroke="rgba(255,255,255,0.48)" strokeWidth="1" strokeDasharray="220" />
        <line x1="232" y1="42" x2="239" y2="136" stroke="rgba(255,255,255,0.48)" strokeWidth="1" strokeDasharray="220" />
        <line x1="344" y1="58" x2="268" y2="148" stroke="rgba(255,255,255,0.48)" strokeWidth="1" strokeDasharray="220" />
        <line x1="152" y1="202" x2="214" y2="172" stroke="rgba(255,255,255,0.48)" strokeWidth="1" strokeDasharray="220" />
        <line x1="292" y1="214" x2="267" y2="174" stroke="rgba(255,255,255,0.48)" strokeWidth="1" strokeDasharray="220" />
        <line x1="220" y1="284" x2="240" y2="188" stroke="rgba(255,255,255,0.48)" strokeWidth="1" strokeDasharray="220" />

        {/* Midpoint dots */}
        {[[175, 97], [235, 89], [306, 103], [183, 187], [279, 194], [230, 236]].map(([cx, cy], i) => (
          <circle key={i} cx={cx} cy={cy} r="2.5" fill="rgba(255,255,255,0.82)" />
        ))}

        {/* Output arrow */}
        <line x1="266" y1="162" x2="406" y2="162" stroke="rgba(255,255,255,0.68)" strokeWidth="1.5" markerEnd="url(#bpArrow)" />
        <rect x="406" y="150" width="66" height="24" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.48)" strokeWidth="1" />
        <text x="439" y="165" textAnchor="middle" fill="rgba(255,255,255,0.85)" fontSize="7.5" fontFamily="monospace" letterSpacing="0.05em">FLOW MAP</text>
      </g>

      {/* ── PHASE 2+: PROTOTYPE — Wireframe UI ──────────────────────── */}
      <g style={{ opacity: p2, transition: T }}>
        {/* Nav bar */}
        <rect x="8" y="8" width="464" height="28" fill="rgba(255,255,255,0.022)" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
        <rect x="14" y="14" width="38" height="16" fill="rgba(255,255,255,0.06)" />
        {[80, 120, 158, 196].map((x, i) => (
          <rect key={i} x={x} y="15" width="28" height="12" rx="1" fill="rgba(255,255,255,0.04)" />
        ))}
        <rect x="418" y="12" width="46" height="20" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.28)" strokeWidth="1" />

        {/* Filter / tab bar */}
        <rect x="8" y="44" width="464" height="20" fill="rgba(255,255,255,0.012)" stroke="rgba(255,255,255,0.14)" strokeWidth="1" />
        {[14, 72, 126, 180, 234].map((x, i) => (
          <rect key={i} x={x} y="49" width={i === 0 ? 50 : 44} height="10" rx="1" fill="rgba(255,255,255,0.05)" />
        ))}

        {/* Left sidebar */}
        <rect x="8" y="72" width="116" height="260" fill="rgba(255,255,255,0.012)" stroke="rgba(255,255,255,0.18)" strokeWidth="1" />
        {[86, 106, 126, 146, 164, 182].map((y, i) => (
          <rect key={i} x="16" y={y} width={i === 0 ? 94 : 70} height="10" rx="1" fill="rgba(255,255,255,0.05)" />
        ))}

        {/* 3 cards */}
        {[132, 240, 352].map((x, i) => (
          <g key={i}>
            <rect x={x} y="72" width="100" height="80" fill="rgba(255,255,255,0.012)" stroke="rgba(255,255,255,0.18)" strokeWidth="1" />
            <rect x={x + 8} y="82" width="60" height="8" rx="1" fill="rgba(255,255,255,0.07)" />
            <rect x={x + 8} y="96" width="82" height="6" rx="1" fill="rgba(255,255,255,0.04)" />
            <rect x={x + 8} y="106" width="68" height="6" rx="1" fill="rgba(255,255,255,0.04)" />
            <rect x={x + 8} y="118" width="38" height="14" rx="1" fill="rgba(255,255,255,0.055)" stroke="rgba(255,255,255,0.14)" strokeWidth="0.5" />
          </g>
        ))}

        {/* Main content area */}
        <rect x="132" y="160" width="320" height="172" fill="rgba(255,255,255,0.008)" stroke="rgba(255,255,255,0.16)" strokeWidth="1" />
        {[176, 194, 210, 226, 244].map((y, i) => (
          <rect key={i} x="146" y={y} width={i % 2 === 0 ? 256 : 196} height="8" rx="1" fill="rgba(255,255,255,0.04)" />
        ))}
        <rect x="146" y="300" width="78" height="20" fill="rgba(255,255,255,0.065)" stroke="rgba(255,255,255,0.26)" strokeWidth="1" />
        <rect x="234" y="300" width="58" height="20" fill="rgba(255,255,255,0.028)" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />

        {/* Footer strip */}
        <rect x="8" y="322" width="464" height="12" fill="rgba(255,255,255,0.012)" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
      </g>

      {/* ── PHASE 3+: SYSTEMIZE — Component labels ──────────────────── */}
      <g style={{ opacity: p3, transition: T }}>
        <rect x="8" y="8" width="24" height="12" fill="rgba(0,0,0,0.78)" />
        <text x="20" y="18" textAnchor="middle" fill="rgba(255,255,255,0.68)" fontSize="7" fontFamily="monospace" letterSpacing="0.04em">NAV</text>

        <rect x="8" y="44" width="34" height="12" fill="rgba(0,0,0,0.78)" />
        <text x="25" y="54" textAnchor="middle" fill="rgba(255,255,255,0.68)" fontSize="7" fontFamily="monospace" letterSpacing="0.04em">FILTER</text>

        <rect x="8" y="72" width="42" height="12" fill="rgba(0,0,0,0.78)" />
        <text x="29" y="82" textAnchor="middle" fill="rgba(255,255,255,0.68)" fontSize="7" fontFamily="monospace" letterSpacing="0.04em">SIDEBAR</text>

        {[132, 240, 352].map((x, i) => (
          <g key={i}>
            <rect x={x} y="72" width="28" height="12" fill="rgba(0,0,0,0.78)" />
            <text x={x + 14} y="82" textAnchor="middle" fill="rgba(255,255,255,0.68)" fontSize="7" fontFamily="monospace" letterSpacing="0.04em">CARD</text>
          </g>
        ))}

        <rect x="146" y="300" width="36" height="12" fill="rgba(0,0,0,0.78)" />
        <text x="164" y="310" textAnchor="middle" fill="rgba(255,255,255,0.68)" fontSize="7" fontFamily="monospace" letterSpacing="0.04em">BUTTON</text>

        <rect x="234" y="300" width="34" height="12" fill="rgba(0,0,0,0.78)" />
        <text x="251" y="310" textAnchor="middle" fill="rgba(255,255,255,0.68)" fontSize="7" fontFamily="monospace" letterSpacing="0.04em">GHOST</text>

        <rect x="132" y="160" width="44" height="12" fill="rgba(0,0,0,0.78)" />
        <text x="154" y="170" textAnchor="middle" fill="rgba(255,255,255,0.68)" fontSize="7" fontFamily="monospace" letterSpacing="0.04em">CONTENT</text>

        {/* MODAL badge */}
        <rect x="406" y="92" width="30" height="16" fill="rgba(255,255,255,0.07)" stroke="rgba(255,255,255,0.38)" strokeWidth="1" />
        <text x="421" y="104" textAnchor="middle" fill="rgba(255,255,255,0.88)" fontSize="6.5" fontFamily="monospace" letterSpacing="0.05em">MODAL</text>

        {/* Card group bracket */}
        <path d="M130,70 L124,70 L124,152 L130,152" fill="none" stroke="rgba(255,255,255,0.26)" strokeWidth="0.75" />
        <text
          x="118" y="111"
          textAnchor="middle"
          fill="rgba(255,255,255,0.32)"
          fontSize="6"
          fontFamily="monospace"
          transform="rotate(-90 118 111)"
          letterSpacing="0.06em"
        >CARDS</text>
      </g>

      {/* ── PHASE 4+: VALIDATE — Validation markers ─────────────────── */}
      <g style={{ opacity: p4, transition: T }}>
        {[132, 240, 352].map((x, i) => (
          <g key={i}>
            <circle cx={x + 88} cy="84" r="8" fill="rgba(255,255,255,0.045)" stroke="rgba(255,255,255,0.48)" strokeWidth="1" />
            <path
              d={`M${x + 83},84 L${x + 87},89 L${x + 93},79`}
              fill="none"
              stroke="rgba(255,255,255,0.9)"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <rect x={x + 72} y="124" width="28" height="10" fill="rgba(255,255,255,0.045)" stroke="rgba(255,255,255,0.28)" strokeWidth="0.5" />
            <text x={x + 86} y="132" textAnchor="middle" fill="rgba(255,255,255,0.72)" fontSize="6" fontFamily="monospace" letterSpacing="0.04em">PASS</text>
          </g>
        ))}
        <rect x="394" y="160" width="58" height="14" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.28)" strokeWidth="0.5" />
        <text x="423" y="170" textAnchor="middle" fill="rgba(255,255,255,0.68)" fontSize="6.5" fontFamily="monospace" letterSpacing="0.04em">VERIFIED</text>

        <rect x="334" y="300" width="62" height="20" fill="rgba(255,255,255,0.045)" stroke="rgba(255,255,255,0.28)" strokeWidth="0.75" />
        <text x="365" y="313" textAnchor="middle" fill="rgba(255,255,255,0.72)" fontSize="7" fontFamily="monospace" letterSpacing="0.04em">MOBILE ✓</text>
      </g>

      {/* ── PHASE 5: SHIP — Final locked state ──────────────────────── */}
      <g style={{ opacity: p5, transition: T }}>
        {/* Bright locking corner brackets */}
        {[
          'M20,1 L1,1 L1,20',
          'M460,1 L479,1 L479,20',
          'M20,339 L1,339 L1,320',
          'M460,339 L479,339 L479,320',
        ].map((d, i) => (
          <path key={i} d={d} fill="none" stroke="rgba(255,255,255,0.88)" strokeWidth="2" />
        ))}

        {/* SYSTEM STABLE banner */}
        <rect x="98" y="140" width="284" height="60" fill="rgba(0,0,0,0.92)" stroke="rgba(255,255,255,0.58)" strokeWidth="1.5" />
        <line x1="98" y1="158" x2="382" y2="158" stroke="rgba(255,255,255,0.12)" strokeWidth="0.5" />
        <text x="240" y="153" textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="7.5" fontFamily="monospace" letterSpacing="0.2em">BUILD HANDOFF</text>
        <text x="240" y="184" textAnchor="middle" fill="rgba(255,255,255,0.94)" fontSize="16" fontFamily="monospace" fontWeight="700" letterSpacing="0.1em">SYSTEM STABLE</text>

        {/* READY FOR BUILD strip */}
        <rect x="158" y="313" width="164" height="18" fill="rgba(255,255,255,0.045)" stroke="rgba(255,255,255,0.34)" strokeWidth="1" />
        <text x="240" y="325" textAnchor="middle" fill="rgba(255,255,255,0.68)" fontSize="8" fontFamily="monospace" letterSpacing="0.14em">READY FOR BUILD</text>
      </g>
    </svg>
  );
}

// ── Tiny blueprint thumbnail — mobile preview ──────────────────────────────────

function MiniBlueprintThumb({ step }: { step: number }) {
  return (
    <svg viewBox="0 0 120 84" width="120" height="84" aria-hidden="true">
      <rect width="120" height="84" fill="rgba(255,255,255,0.015)" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />

      {step === 0 && (
        <g>
          {[[4, 8, 28, 9], [38, 4, 24, 9], [84, 10, 28, 9], [4, 42, 32, 9], [70, 46, 26, 9], [38, 68, 30, 9]].map(([x, y, w, h], i) => (
            <rect key={i} x={x} y={y} width={w} height={h} fill="none" stroke="rgba(255,255,255,0.24)" strokeWidth="0.5" strokeDasharray="3 1.5" />
          ))}
        </g>
      )}

      {step === 1 && (
        <g>
          <circle cx="60" cy="42" r="10" fill="none" stroke="rgba(255,255,255,0.44)" strokeWidth="0.75" />
          {[[16, 12, 52, 34], [50, 8, 57, 35], [96, 18, 62, 38], [16, 50, 52, 44], [76, 52, 57, 44], [44, 70, 59, 56]].map(([x1, y1, x2, y2], i) => (
            <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(255,255,255,0.28)" strokeWidth="0.5" />
          ))}
        </g>
      )}

      {step >= 2 && (
        <g>
          <rect x="2" y="2" width="116" height="10" fill="none" stroke="rgba(255,255,255,0.24)" strokeWidth="0.5" />
          <rect x="2" y="14" width="28" height="66" fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="0.5" />
          {[32, 60, 90].map((x, i) => (
            <rect key={i} x={x} y="14" width="26" height="26" fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="0.5" />
          ))}
          <rect x="32" y="42" width="86" height="38" fill="none" stroke="rgba(255,255,255,0.14)" strokeWidth="0.5" />
          {step >= 4 && (
            <>
              {[32, 60, 90].map((x, i) => (
                <g key={i}>
                  <circle cx={x + 20} cy="22" r="5" fill="none" stroke="rgba(255,255,255,0.44)" strokeWidth="0.5" />
                  <path d={`M${x + 17},22 L${x + 19.5},25 L${x + 23},19`} fill="none" stroke="rgba(255,255,255,0.85)" strokeWidth="0.75" strokeLinecap="round" />
                </g>
              ))}
            </>
          )}
          {step === 5 && (
            <g>
              <rect x="20" y="28" width="80" height="24" fill="rgba(0,0,0,0.88)" stroke="rgba(255,255,255,0.52)" strokeWidth="0.75" />
              <text x="60" y="42" textAnchor="middle" fill="rgba(255,255,255,0.85)" fontSize="5.5" fontFamily="monospace" letterSpacing="0.06em">SYSTEM STABLE</text>
            </g>
          )}
        </g>
      )}
    </svg>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function ProcessBlueprintSection() {
  const [activeStep, setActiveStep] = useState(0);
  const reducedMotionRef = useRef(false);
  const userOverrideRef = useRef(false);
  const overrideResetRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const autoTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const step = STEPS[activeStep];

  useIsoEffect(() => {
    reducedMotionRef.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);

  // Scroll-driven step from CoinScene via custom event
  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<number>).detail;
      if (typeof detail === 'number' && !userOverrideRef.current) {
        setActiveStep(Math.max(0, Math.min(5, detail)));
      }
    };
    window.addEventListener('blueprintStep', handler);
    return () => window.removeEventListener('blueprintStep', handler);
  }, []);

  // Auto-cycle when no user interaction
  useEffect(() => {
    if (reducedMotionRef.current) return;
    autoTimerRef.current = setInterval(() => {
      if (!userOverrideRef.current) {
        setActiveStep((prev) => (prev < 5 ? prev + 1 : 0));
      }
    }, 2800);
    return () => {
      if (autoTimerRef.current) clearInterval(autoTimerRef.current);
    };
  }, []);

  const handleStepActivate = (index: number) => {
    setActiveStep(index);
    userOverrideRef.current = true;
    if (overrideResetRef.current) clearTimeout(overrideResetRef.current);
    overrideResetRef.current = setTimeout(() => {
      userOverrideRef.current = false;
    }, 5000);
  };

  // Coordinate values for the metadata panel
  const coordX = String(activeStep * 14 + 28).padStart(3, '0');
  const coordY = String(activeStep * 22 + 96).padStart(3, '0');

  return (
    <div className="processBlueprint">

      {/* ── Background: faint text + corner coordinates ── */}
      <div className="processBg" aria-hidden="true">
        <span className="processBgText">ASSEMBLY</span>
        <span className="processCoordTL">X:{coordX} / Y:{coordY}</span>
        <span className="processCoordBR">SYS.C / {step.id}.0</span>
      </div>

      {/* ── Section header ── */}
      <header className="processHeader">
        <span className="processSectionTag">SECTION C / SYSTEM ASSEMBLY</span>
        <h2 className="processHeading">FROM AMBIGUITY TO OPERATING INTERFACE</h2>
        <p className="processSubtitle">
          A structured process for turning complex product requirements into clear, scalable, decision-ready systems.
        </p>
      </header>

      {/* ── Desktop: 3-column grid ── */}
      <div className="processGrid">

        {/* Left: step list */}
        <nav className="stepsCol" aria-label="Process steps">
          {STEPS.map((s, i) => (
            <button
              key={s.id}
              className={`stepItem${activeStep === i ? ' isActive' : ''}`}
              onClick={() => handleStepActivate(i)}
              onMouseEnter={() => handleStepActivate(i)}
              aria-current={activeStep === i ? 'step' : undefined}
            >
              <span className="stepNum">{s.id} /</span>
              <span className="stepName">{s.name}</span>
              {activeStep === i && (
                <span className="stepStatusChip">{s.status}</span>
              )}
            </button>
          ))}
        </nav>

        {/* Center: blueprint SVG */}
        <div className="blueprintCol">
          <div className="blueprintFrame">
            <div className="blueprintBar">
              <span>BLUEPRINT / PHASE {step.id}</span>
              <span>{step.name}</span>
            </div>
            <div className="blueprintSvgWrap">
              <BlueprintSVG step={activeStep} />
            </div>
            <div className="blueprintScan" aria-hidden="true" />
          </div>
        </div>

        {/* Right: metadata console panel */}
        <aside className="metaCol" aria-label="Phase status">
          <div className="metaPanel">
            <div className="metaPanelHeader">
              <span className="metaPanelTitle">SYS / SECTION.C</span>
              <span className="metaDots">
                <span className="metaDot" />
                <span className="metaDot" />
                <span className={`metaDot${activeStep === 5 ? ' metaDotLit' : ''}`} />
              </span>
            </div>

            <div className="metaPanelBody">
              <div className="metaRow">
                <span className="metaLabel">ACTIVE PHASE</span>
                <span className="metaValLarge">{step.id}</span>
              </div>
              <div className="metaSep" />
              <div className="metaRow metaRowWrap">
                <span className="metaLabel">MODE</span>
                <span className="metaVal">{step.mode}</span>
              </div>
              <div className="metaSep" />

              <div className="metaSection">
                <span className="metaSectionLabel">INPUT</span>
                {step.input.map((item, i) => (
                  <div key={i} className="metaListRow">
                    <span className="metaBullet">·</span>
                    <span className="metaListItem">{item}</span>
                  </div>
                ))}
              </div>

              <div className="metaSep" />

              <div className="metaSection">
                <span className="metaSectionLabel">OUTPUT</span>
                {step.output.map((item, i) => (
                  <div key={i} className="metaListRow">
                    <span className="metaBullet">·</span>
                    <span className="metaListItem">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="metaPanelFooter">
              <div className="metaRow">
                <span className="metaLabel">STATUS</span>
                <span className="metaStatusChip">{step.status}</span>
              </div>
            </div>

            <div className="metaCoords">
              <span>X:{coordX}</span>
              <span className="metaCoordsSlash">/</span>
              <span>Y:{coordY}</span>
            </div>
          </div>
        </aside>
      </div>

      {/* ── Mobile: step pill nav ── */}
      <div className="mobileStepNav" aria-label="Select process step">
        {STEPS.map((s, i) => (
          <button
            key={s.id}
            className={`mobileStepPill${activeStep === i ? ' isActive' : ''}`}
            onClick={() => handleStepActivate(i)}
            aria-label={`Step ${s.id}: ${s.name}`}
            aria-pressed={activeStep === i}
          >
            {s.id}
          </button>
        ))}
      </div>

      {/* ── Mobile: active step card ── */}
      <div className="mobileStepCard">
        <div className="mobileCardHead">
          <span className="mobileStepId">{step.id}</span>
          <span className="mobileStepTitle">{step.name}</span>
          <span className="mobileStepChip">{step.status}</span>
        </div>
        <p className="mobileStepDesc">{step.desc}</p>
        <div className="mobileStepMeta">
          <div className="mobileMetaBlock">
            <span className="mobileMetaLabel">INPUT</span>
            {step.input.map((item, i) => (
              <span key={i} className="mobileMetaItem">{item}</span>
            ))}
          </div>
          <div className="mobileMetaBlock">
            <span className="mobileMetaLabel">OUTPUT</span>
            {step.output.map((item, i) => (
              <span key={i} className="mobileMetaItem">{item}</span>
            ))}
          </div>
        </div>
        <div className="mobileThumb">
          <MiniBlueprintThumb step={activeStep} />
        </div>
      </div>

      {/* ── Styles ── */}
      <style jsx>{`
        /* ── Root ─────────────────────────────────────────────────── */

        .processBlueprint {
          position: relative;
          width: 100%;
          height: 100%;
          background: #050505;
          overflow: hidden;
          pointer-events: all;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 66px max(16px, 2.2vw) 0;
          box-sizing: border-box;
        }

        /* ── Background decorations ───────────────────────────────── */

        .processBg {
          position: absolute;
          inset: 0;
          pointer-events: none;
          overflow: hidden;
        }

        .processBgText {
          position: absolute;
          bottom: -0.04em;
          right: -0.02em;
          font-size: clamp(80px, 16vw, 210px);
          font-weight: 800;
          letter-spacing: -0.06em;
          color: rgba(255, 255, 255, 0.016);
          text-transform: uppercase;
          line-height: 1;
          user-select: none;
          font-family: ui-monospace, monospace;
        }

        .processCoordTL {
          position: absolute;
          top: 14px;
          left: 18px;
          font-size: 9px;
          font-family: ui-monospace, monospace;
          color: rgba(255, 255, 255, 0.2);
          letter-spacing: 0.1em;
          transition: opacity 0.35s ease;
        }

        .processCoordBR {
          position: absolute;
          bottom: 14px;
          right: 18px;
          font-size: 9px;
          font-family: ui-monospace, monospace;
          color: rgba(255, 255, 255, 0.2);
          letter-spacing: 0.1em;
          transition: opacity 0.35s ease;
        }

        /* ── Header ───────────────────────────────────────────────── */

        .processHeader {
          width: 100%;
          max-width: 1200px;
          padding-top: 10px;
          padding-bottom: 8px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          margin-bottom: 8px;
          flex-shrink: 0;
          display: flex;
          align-items: baseline;
          gap: 24px;
          flex-wrap: wrap;
        }

        .processSectionTag {
          font-family: ui-monospace, SFMono-Regular, monospace;
          font-size: 9px;
          font-weight: 700;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.32);
          white-space: nowrap;
          flex-shrink: 0;
        }

        .processHeading {
          margin: 0;
          font-size: clamp(13px, 1.4vw, 20px);
          font-weight: 380;
          letter-spacing: -0.03em;
          line-height: 1;
          color: rgba(255, 255, 255, 0.9);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          flex: 1;
          min-width: 0;
        }

        .processSubtitle {
          display: none;
        }

        /* ── 3-column grid ────────────────────────────────────────── */

        .processGrid {
          display: grid;
          grid-template-columns: 176px 1fr 240px;
          width: 100%;
          max-width: 1200px;
          flex: 1;
          min-height: 0;
          border: 1px solid rgba(255, 255, 255, 0.08);
          overflow: hidden;
        }

        /* ── Step list column ─────────────────────────────────────── */

        .stepsCol {
          border-right: 1px solid rgba(255, 255, 255, 0.07);
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        .stepItem {
          display: flex;
          align-items: center;
          gap: 7px;
          padding: 0 11px;
          flex: 1;
          min-height: 0;
          background: transparent;
          border: none;
          border-bottom: 1px solid rgba(255, 255, 255, 0.055);
          cursor: pointer;
          text-align: left;
          transition: background 0.22s ease;
          position: relative;
          overflow: hidden;
        }

        .stepItem:last-child {
          border-bottom: none;
        }

        .stepItem::before {
          content: '';
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          width: 2px;
          background: transparent;
          transition: background 0.22s ease;
        }

        .stepItem.isActive::before {
          background: rgba(255, 255, 255, 0.68);
        }

        .stepItem.isActive {
          background: rgba(255, 255, 255, 0.035);
        }

        .stepItem:hover:not(.isActive) {
          background: rgba(255, 255, 255, 0.018);
        }

        .stepNum {
          font-family: ui-monospace, monospace;
          font-size: 8.5px;
          letter-spacing: 0.05em;
          color: rgba(255, 255, 255, 0.24);
          flex-shrink: 0;
          transition: color 0.22s ease;
        }

        .stepItem.isActive .stepNum {
          color: rgba(255, 255, 255, 0.5);
        }

        .stepName {
          font-family: ui-monospace, monospace;
          font-size: 9.5px;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.28);
          flex: 1;
          transition: color 0.22s ease;
        }

        .stepItem.isActive .stepName {
          color: rgba(255, 255, 255, 0.9);
        }

        .stepStatusChip {
          font-family: ui-monospace, monospace;
          font-size: 6.5px;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.55);
          border: 1px solid rgba(255, 255, 255, 0.2);
          padding: 2px 5px;
          flex-shrink: 0;
          white-space: nowrap;
        }

        /* ── Blueprint center column ──────────────────────────────── */

        .blueprintCol {
          display: flex;
          align-items: stretch;
          border-right: 1px solid rgba(255, 255, 255, 0.07);
          padding: 8px;
          min-height: 0;
          overflow: hidden;
        }

        .blueprintFrame {
          position: relative;
          width: 100%;
          display: flex;
          flex-direction: column;
          min-height: 0;
        }

        .blueprintBar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 3px 7px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.07);
          margin-bottom: 6px;
          flex-shrink: 0;
        }

        .blueprintBar span {
          font-family: ui-monospace, monospace;
          font-size: 8px;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.28);
        }

        .blueprintBar span:last-child {
          color: rgba(255, 255, 255, 0.52);
        }

        .blueprintSvgWrap {
          flex: 1;
          min-height: 0;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .blueprintScan {
          position: absolute;
          inset: 0;
          pointer-events: none;
          background: linear-gradient(
            to bottom,
            transparent 0%,
            rgba(255, 255, 255, 0.022) 50%,
            transparent 100%
          );
          background-size: 100% 200%;
          animation: bpScan 5s linear infinite;
        }

        @keyframes bpScan {
          0% { background-position: 0 -100%; }
          100% { background-position: 0 200%; }
        }

        /* ── Metadata panel column ────────────────────────────────── */

        .metaCol {
          display: flex;
          flex-direction: column;
          padding: 8px;
          min-height: 0;
          overflow: hidden;
        }

        .metaPanel {
          display: flex;
          flex-direction: column;
          height: 100%;
          border: 1px solid rgba(255, 255, 255, 0.11);
          overflow: hidden;
          font-family: ui-monospace, SFMono-Regular, monospace;
        }

        .metaPanelHeader {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 6px 10px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.09);
          background: rgba(255, 255, 255, 0.025);
          flex-shrink: 0;
        }

        .metaPanelTitle {
          font-size: 8px;
          font-weight: 700;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.4);
        }

        .metaDots {
          display: flex;
          gap: 4px;
        }

        .metaDot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.14);
        }

        .metaDotLit {
          background: rgba(255, 255, 255, 0.72);
        }

        .metaPanelBody {
          flex: 1;
          padding: 8px 10px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }

        .metaRow {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          gap: 6px;
          padding: 2px 0;
        }

        .metaRowWrap {
          align-items: flex-start;
        }

        .metaLabel {
          font-size: 7.5px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.28);
          flex-shrink: 0;
        }

        .metaVal {
          font-size: 8px;
          letter-spacing: 0.05em;
          color: rgba(255, 255, 255, 0.6);
          text-align: right;
          line-height: 1.45;
        }

        .metaValLarge {
          font-size: 18px;
          font-weight: 700;
          color: rgba(255, 255, 255, 0.9);
          letter-spacing: 0.04em;
          line-height: 1;
        }

        .metaSep {
          height: 1px;
          background: rgba(255, 255, 255, 0.055);
          margin: 4px 0;
          flex-shrink: 0;
        }

        .metaSection {
          display: flex;
          flex-direction: column;
          gap: 1px;
          padding: 2px 0;
        }

        .metaSectionLabel {
          font-size: 7px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.26);
          margin-bottom: 3px;
        }

        .metaListRow {
          display: flex;
          align-items: center;
          gap: 5px;
        }

        .metaBullet {
          color: rgba(255, 255, 255, 0.28);
          font-size: 11px;
          line-height: 1;
          flex-shrink: 0;
        }

        .metaListItem {
          font-size: 7.5px;
          letter-spacing: 0.05em;
          color: rgba(255, 255, 255, 0.52);
          line-height: 1.5;
        }

        .metaPanelFooter {
          padding: 6px 10px;
          border-top: 1px solid rgba(255, 255, 255, 0.09);
          flex-shrink: 0;
        }

        .metaStatusChip {
          font-size: 7.5px;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          padding: 2px 6px;
          border: 1px solid rgba(255, 255, 255, 0.22);
          color: rgba(255, 255, 255, 0.7);
        }

        .metaCoords {
          display: flex;
          gap: 5px;
          padding: 4px 10px;
          border-top: 1px solid rgba(255, 255, 255, 0.055);
          background: rgba(255, 255, 255, 0.012);
          flex-shrink: 0;
        }

        .metaCoords span {
          font-size: 7.5px;
          letter-spacing: 0.1em;
          color: rgba(255, 255, 255, 0.2);
        }

        .metaCoordsSlash {
          color: rgba(255, 255, 255, 0.12) !important;
        }

        /* ── Mobile elements (hidden on desktop) ──────────────────── */

        .mobileStepNav,
        .mobileStepCard {
          display: none;
        }

        /* ── Responsive ───────────────────────────────────────────── */

        @media (max-width: 1080px) {
          .processGrid {
            grid-template-columns: 152px 1fr;
          }
          .metaCol {
            display: none;
          }
          .blueprintCol {
            border-right: none;
          }
        }

        @media (max-width: 768px) {
          .processBlueprint {
            padding: 58px 14px 0;
          }
          .processGrid {
            display: none;
          }
          .processHeader {
            padding-top: 18px;
            padding-bottom: 10px;
            margin-bottom: 10px;
          }
          .processHeading {
            font-size: clamp(13px, 4.2vw, 22px);
          }
          .processSubtitle {
            display: none;
          }

          .mobileStepNav {
            display: flex;
            gap: 5px;
            flex-wrap: wrap;
            width: 100%;
            max-width: 1200px;
            margin-bottom: 10px;
            flex-shrink: 0;
          }

          .mobileStepPill {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 36px;
            height: 28px;
            border: 1px solid rgba(255, 255, 255, 0.13);
            background: transparent;
            cursor: pointer;
            font-family: ui-monospace, monospace;
            font-size: 9px;
            font-weight: 700;
            letter-spacing: 0.06em;
            color: rgba(255, 255, 255, 0.32);
            transition: border-color 0.2s ease, color 0.2s ease, background 0.2s ease;
          }

          .mobileStepPill.isActive {
            border-color: rgba(255, 255, 255, 0.52);
            color: rgba(255, 255, 255, 0.88);
            background: rgba(255, 255, 255, 0.04);
          }

          .mobileStepCard {
            display: flex;
            flex-direction: column;
            gap: 10px;
            width: 100%;
            max-width: 1200px;
            border: 1px solid rgba(255, 255, 255, 0.09);
            padding: 14px;
            box-sizing: border-box;
            flex: 1;
            overflow: hidden;
            min-height: 0;
          }

          .mobileCardHead {
            display: flex;
            align-items: center;
            gap: 9px;
            flex-shrink: 0;
          }

          .mobileStepId {
            font-family: ui-monospace, monospace;
            font-size: 10px;
            font-weight: 700;
            letter-spacing: 0.06em;
            color: rgba(255, 255, 255, 0.38);
          }

          .mobileStepTitle {
            font-family: ui-monospace, monospace;
            font-size: 14px;
            font-weight: 700;
            letter-spacing: 0.12em;
            text-transform: uppercase;
            color: rgba(255, 255, 255, 0.88);
            flex: 1;
          }

          .mobileStepChip {
            font-family: ui-monospace, monospace;
            font-size: 7px;
            font-weight: 700;
            letter-spacing: 0.1em;
            text-transform: uppercase;
            border: 1px solid rgba(255, 255, 255, 0.22);
            color: rgba(255, 255, 255, 0.52);
            padding: 2px 6px;
            flex-shrink: 0;
          }

          .mobileStepDesc {
            margin: 0;
            font-size: 12px;
            line-height: 1.65;
            color: rgba(255, 255, 255, 0.5);
            flex-shrink: 0;
          }

          .mobileStepMeta {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 10px;
            flex-shrink: 0;
          }

          .mobileMetaBlock {
            display: flex;
            flex-direction: column;
            gap: 4px;
          }

          .mobileMetaLabel {
            font-family: ui-monospace, monospace;
            font-size: 7.5px;
            font-weight: 700;
            letter-spacing: 0.14em;
            text-transform: uppercase;
            color: rgba(255, 255, 255, 0.26);
            margin-bottom: 3px;
          }

          .mobileMetaItem {
            font-family: ui-monospace, monospace;
            font-size: 8px;
            letter-spacing: 0.05em;
            color: rgba(255, 255, 255, 0.48);
            line-height: 1.5;
          }

          .mobileThumb {
            display: flex;
            justify-content: flex-end;
            align-items: flex-end;
            flex: 1;
            min-height: 0;
            opacity: 0.55;
          }
        }

        /* ── Reduced motion ───────────────────────────────────────── */

        @media (prefers-reduced-motion: reduce) {
          .blueprintScan {
            display: none;
          }
          .stepItem,
          .stepItem::before,
          .stepNum,
          .stepName,
          .mobileStepPill {
            transition: none !important;
          }
        }
      `}</style>
    </div>
  );
}
