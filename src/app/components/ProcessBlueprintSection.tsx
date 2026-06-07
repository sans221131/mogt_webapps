'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { motion, AnimatePresence } from 'framer-motion';

const STEP_EASE = [0.22, 1, 0.36, 1] as const;

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
    id: '04', name: 'BUILD', mode: 'ENGINEERING BUILD',
    desc: 'Engineer the system into production — reusable components, responsive frontends, and the backend logic behind them.',
    input: ['APPROVED SCREENS', 'COMPONENT PATTERNS', 'DATA & STATE RULES'],
    output: ['DESIGN SYSTEM', 'FRONTEND BUILD', 'BACKEND LOGIC'],
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

function BlueprintSVG({ step, idSuffix = '' }: { step: number; idSuffix?: string }) {
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
        <pattern id={`bpGrid${idSuffix}`} width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M20 0L0 0 0 20" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" />
        </pattern>
        <marker id={`bpArrow${idSuffix}`} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto">
          <path d="M0,0 L10,5 L0,10 L3,5 Z" fill="rgba(255,255,255,0.65)" />
        </marker>
      </defs>

      {/* Background grid */}
      <rect width="480" height="340" fill={`url(#bpGrid${idSuffix})`} />
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
        <line x1="266" y1="162" x2="406" y2="162" stroke="rgba(255,255,255,0.68)" strokeWidth="1.5" markerEnd={`url(#bpArrow${idSuffix})`} />
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

// ── Main component ────────────────────────────────────────────────────────────

export default function ProcessBlueprintSection() {
  const [activeStep, setActiveStep] = useState(0);
  const [hasBooted, setHasBooted] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
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

  // Boot animation: trigger once when section enters viewport
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) { setHasBooted(true); return; }
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setHasBooted(true); io.disconnect(); } },
      { threshold: 0.3 }
    );
    io.observe(el);
    // Fallback: always boot after 4s so content never stays hidden
    const fallback = setTimeout(() => setHasBooted(true), 4000);
    return () => { io.disconnect(); clearTimeout(fallback); };
  }, []);

  const progressPct = (activeStep / STEPS.length) * 100;

  return (
    <div ref={sectionRef} className={`processBlueprint${hasBooted ? ' isBooted' : ''}`}>

      {/* ── Boot animation overlay ── */}
      <div className="bootLayer" aria-hidden="true">
        <div className="bootLine" />
        <div className="bootGlow" />
        <div className="bootFlicker" />
      </div>

      {/* ── Background: faint label ── */}
      <div className="processBg" aria-hidden="true">
        <span className="processBgText">ASSEMBLY</span>
      </div>

      <div className="processInner">

        {/* ── Header ── */}
        <header className="processHeader">
          <div className="processHeadMain">
            <span className="processSectionTag">SECTION C / SYSTEM ASSEMBLY</span>
            <h2 className="processHeading">FROM AMBIGUITY TO EXECUTION</h2>
            <p className="processSubtitle">
              A structured process for turning complex product requirements into clear,
              scalable, build-ready systems.
            </p>
          </div>
          <div className="processHeadAside" aria-hidden="true">
            <span className="processPhaseInd"><b>{step.id}</b><i>/ 06</i></span>
            <span className="processPhaseMode">{step.mode}</span>
          </div>
        </header>

        {/* ── Stepper rail ── */}
        <nav className="stepper" aria-label="Process steps">
          <span className="stepperRail" aria-hidden="true" />
          <span className="stepperFill" aria-hidden="true" style={{ width: `${progressPct}%` }} />
          {STEPS.map((s, i) => (
            <button
              key={s.id}
              type="button"
              className={`stepNode${activeStep === i ? ' isActive' : ''}${i < activeStep ? ' isDone' : ''}`}
              onClick={() => handleStepActivate(i)}
              onMouseEnter={() => handleStepActivate(i)}
              aria-current={activeStep === i ? 'step' : undefined}
            >
              <span className="stepNodeDot" aria-hidden="true" />
              <span className="stepNodeNum">{s.id}</span>
              <span className="stepNodeName">{s.name}</span>
            </button>
          ))}
        </nav>

        {/* ── Body: detail console + blueprint ── */}
        <div className="processBody">

          {/* Detail console */}
          <div className="detailCol">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeStep}
                className="detailInner"
                initial={{ opacity: 0, y: 14, filter: 'blur(6px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, y: -14, filter: 'blur(6px)' }}
                transition={{ duration: 0.42, ease: STEP_EASE }}
              >
                <div className="detailTop">
                  <span className="detailNum" aria-hidden="true">{step.id}</span>
                  <div className="detailTitleWrap">
                    <h3 className="detailName">{step.name}</h3>
                    <span className="detailMode">{step.mode}</span>
                  </div>
                  <span className="detailStatus">{step.status}</span>
                </div>

                <p className="detailDesc">{step.desc}</p>

                <div className="ioGrid">
                  <div className="ioBlock">
                    <span className="ioLabel">INPUT <i>// AMBIGUITY</i></span>
                    <ul className="ioList">
                      {step.input.map((item) => (
                        <li key={item}><span className="ioMark">+</span>{item}</li>
                      ))}
                    </ul>
                  </div>
                  <span className="ioArrow" aria-hidden="true">→</span>
                  <div className="ioBlock ioBlockOut">
                    <span className="ioLabel">OUTPUT <i>// EXECUTION</i></span>
                    <ul className="ioList">
                      {step.output.map((item) => (
                        <li key={item}><span className="ioMark ioMarkOk">✓</span>{item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Blueprint viewport */}
          <div className="blueprintCol">
            <div className="blueprintBar">
              <span>BLUEPRINT / PHASE {step.id}</span>
              <span className="blueprintBarName">{step.name}</span>
            </div>
            <div className="blueprintViewport">
              <BlueprintSVG step={activeStep} />
              <div className="blueprintScan" aria-hidden="true" />
              <span className="blueprintCoord" aria-hidden="true">SYS.C / {step.id}.0</span>
            </div>
          </div>
        </div>

      </div>{/* /processInner */}

      {/* ── Styles ── */}
      <style jsx>{`
        /* ── Root ─────────────────────────────────────────────────── */

        .processBlueprint {
          position: relative;
          width: 100%;
          height: 100%;
          background:
            radial-gradient(120% 80% at 50% 0%, rgba(255,255,255,0.028), transparent 60%),
            #050505;
          overflow: hidden;
          pointer-events: all;
          display: flex;
          flex-direction: column;
          box-sizing: border-box;
        }

        .processInner {
          position: relative;
          z-index: 1;
          width: min(calc(100% - 40px), 1200px);
          margin-inline: auto;
          display: flex;
          flex-direction: column;
          gap: clamp(14px, 2.2vh, 26px);
          padding-top: 78px;
          padding-bottom: clamp(18px, 3vh, 34px);
          flex: 1;
          min-height: 0;
          box-sizing: border-box;
        }

        /* ── Background ───────────────────────────────────────────── */

        .processBg {
          position: absolute;
          inset: 0;
          pointer-events: none;
          overflow: hidden;
        }

        .processBgText {
          position: absolute;
          bottom: -0.06em;
          right: -0.02em;
          font-size: clamp(80px, 16vw, 220px);
          font-weight: 800;
          letter-spacing: -0.06em;
          color: rgba(255, 255, 255, 0.018);
          text-transform: uppercase;
          line-height: 1;
          user-select: none;
          font-family: ui-monospace, monospace;
        }

        /* ── Header ───────────────────────────────────────────────── */

        .processHeader {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 28px;
          padding-bottom: clamp(12px, 2vh, 18px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.09);
          flex-shrink: 0;
        }

        .processHeadMain {
          min-width: 0;
        }

        .processSectionTag {
          display: block;
          font-family: ui-monospace, SFMono-Regular, monospace;
          font-size: 10.5px;
          font-weight: 700;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.34);
        }

        .processHeading {
          margin: 10px 0 0;
          font-size: clamp(22px, 2.6vw, 38px);
          font-weight: 380;
          letter-spacing: -0.025em;
          line-height: 1.04;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.94);
        }

        .processSubtitle {
          margin: 12px 0 0;
          max-width: 52ch;
          font-size: clamp(12.5px, 1vw, 14.5px);
          line-height: 1.6;
          font-weight: 360;
          color: rgba(255, 255, 255, 0.5);
        }

        .processHeadAside {
          flex-shrink: 0;
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 8px;
          text-align: right;
          padding-top: 2px;
        }

        .processPhaseInd {
          font-family: ui-monospace, monospace;
          display: inline-flex;
          align-items: baseline;
          gap: 7px;
          line-height: 1;
        }

        .processPhaseInd b {
          font-size: clamp(30px, 3.4vw, 46px);
          font-weight: 400;
          letter-spacing: 0.02em;
          color: rgba(255, 255, 255, 0.92);
        }

        .processPhaseInd i {
          font-style: normal;
          font-size: 13px;
          letter-spacing: 0.08em;
          color: rgba(255, 255, 255, 0.32);
        }

        .processPhaseMode {
          font-family: ui-monospace, monospace;
          font-size: 9px;
          font-weight: 700;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.42);
          border: 1px solid rgba(255, 255, 255, 0.14);
          padding: 4px 9px;
          white-space: nowrap;
        }

        /* ── Stepper rail ─────────────────────────────────────────── */

        .stepper {
          position: relative;
          display: grid;
          grid-template-columns: repeat(6, 1fr);
          align-items: start;
          flex-shrink: 0;
        }

        .stepperRail,
        .stepperFill {
          position: absolute;
          top: 5px;
          left: calc(100% / 12);
          height: 1px;
          pointer-events: none;
        }

        .stepperRail {
          right: calc(100% / 12);
          background: rgba(255, 255, 255, 0.12);
        }

        .stepperFill {
          background: rgba(255, 255, 255, 0.78);
          box-shadow: 0 0 9px rgba(255, 255, 255, 0.4);
          transition: width 0.55s cubic-bezier(0.22, 1, 0.36, 1);
        }

        .stepNode {
          position: relative;
          z-index: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 9px;
          padding: 0 4px;
          background: transparent;
          border: none;
          cursor: pointer;
          text-align: center;
        }

        .stepNodeDot {
          width: 11px;
          height: 11px;
          border-radius: 50%;
          background: #050505;
          border: 1px solid rgba(255, 255, 255, 0.28);
          transition: border-color 0.25s ease, background 0.25s ease, box-shadow 0.25s ease, transform 0.25s ease;
        }

        .stepNode.isDone .stepNodeDot {
          background: rgba(255, 255, 255, 0.45);
          border-color: rgba(255, 255, 255, 0.55);
        }

        .stepNode.isActive .stepNodeDot {
          background: rgba(255, 255, 255, 0.95);
          border-color: rgba(255, 255, 255, 0.95);
          box-shadow: 0 0 0 4px rgba(255, 255, 255, 0.08), 0 0 12px rgba(255, 255, 255, 0.45);
          transform: scale(1.1);
        }

        .stepNodeNum {
          font-family: ui-monospace, monospace;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.06em;
          color: rgba(255, 255, 255, 0.32);
          transition: color 0.25s ease;
        }

        .stepNode.isActive .stepNodeNum {
          color: rgba(255, 255, 255, 0.62);
        }

        .stepNodeName {
          font-family: ui-monospace, monospace;
          font-size: 10.5px;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.3);
          transition: color 0.25s ease;
          white-space: nowrap;
        }

        .stepNode:hover .stepNodeName {
          color: rgba(255, 255, 255, 0.6);
        }

        .stepNode.isActive .stepNodeName {
          color: rgba(255, 255, 255, 0.92);
        }

        /* ── Body ─────────────────────────────────────────────────── */

        .processBody {
          flex: 1;
          min-height: 0;
          display: grid;
          grid-template-columns: minmax(0, 1fr) minmax(0, 1.06fr);
          border: 1px solid rgba(255, 255, 255, 0.09);
          overflow: hidden;
        }

        /* ── Detail console ───────────────────────────────────────── */

        .detailCol {
          position: relative;
          display: flex;
          border-right: 1px solid rgba(255, 255, 255, 0.08);
          padding: clamp(18px, 2.6vh, 30px) clamp(18px, 2vw, 30px);
          min-height: 0;
          overflow: hidden;
        }

        /* :global — this element is a framer-motion node (motion.div), which
           styled-jsx does not scope, so a normal scoped rule would miss it. */
        :global(.detailInner) {
          display: flex;
          flex-direction: column;
          flex: 1;
          min-height: 0;
          gap: clamp(16px, 3vh, 30px);
        }

        .detailTop {
          display: flex;
          align-items: flex-start;
          gap: 16px;
        }

        .detailNum {
          font-family: ui-monospace, monospace;
          font-size: clamp(40px, 5vw, 68px);
          font-weight: 400;
          line-height: 0.82;
          letter-spacing: -0.02em;
          color: rgba(255, 255, 255, 0.9);
          flex-shrink: 0;
        }

        .detailTitleWrap {
          display: flex;
          flex-direction: column;
          gap: 6px;
          flex: 1;
          min-width: 0;
          padding-top: 2px;
        }

        .detailName {
          margin: 0;
          font-family: ui-monospace, monospace;
          font-size: clamp(20px, 2vw, 28px);
          font-weight: 700;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.95);
          line-height: 1;
        }

        .detailMode {
          font-family: ui-monospace, monospace;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.4);
        }

        .detailStatus {
          flex-shrink: 0;
          font-family: ui-monospace, monospace;
          font-size: 9px;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.72);
          border: 1px solid rgba(255, 255, 255, 0.24);
          padding: 4px 9px;
          white-space: nowrap;
        }

        .detailDesc {
          margin: 0;
          font-size: clamp(13.5px, 1.05vw, 15.5px);
          line-height: 1.72;
          font-weight: 360;
          color: rgba(255, 255, 255, 0.62);
          max-width: 56ch;
        }

        .ioGrid {
          display: grid;
          grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
          align-items: stretch;
          gap: clamp(10px, 1.4vw, 18px);
          margin-top: auto;
        }

        .ioBlock {
          display: flex;
          flex-direction: column;
          gap: 12px;
          padding: 14px 15px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          background: rgba(255, 255, 255, 0.012);
        }

        .ioBlockOut {
          border-color: rgba(255, 255, 255, 0.18);
          background: rgba(255, 255, 255, 0.03);
        }

        .ioLabel {
          font-family: ui-monospace, monospace;
          font-size: 9.5px;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.46);
        }

        .ioLabel i {
          font-style: normal;
          color: rgba(255, 255, 255, 0.24);
          letter-spacing: 0.08em;
        }

        .ioList {
          list-style: none;
          margin: 0;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .ioList li {
          display: flex;
          align-items: center;
          gap: 9px;
          font-family: ui-monospace, monospace;
          font-size: 11px;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.62);
          line-height: 1.3;
        }

        .ioMark {
          flex-shrink: 0;
          width: 14px;
          text-align: center;
          color: rgba(255, 255, 255, 0.3);
          font-weight: 700;
        }

        .ioMarkOk {
          color: rgba(255, 255, 255, 0.82);
        }

        .ioArrow {
          align-self: center;
          font-size: 22px;
          color: rgba(255, 255, 255, 0.4);
          line-height: 1;
        }

        /* ── Blueprint column ─────────────────────────────────────── */

        .blueprintCol {
          display: flex;
          flex-direction: column;
          min-height: 0;
          padding: clamp(10px, 1.4vh, 16px);
        }

        .blueprintBar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 8px 12px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-bottom: none;
          background: rgba(255, 255, 255, 0.015);
          flex-shrink: 0;
        }

        .blueprintBar span {
          font-family: ui-monospace, monospace;
          font-size: 9.5px;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.3);
        }

        .blueprintBarName {
          color: rgba(255, 255, 255, 0.55) !important;
        }

        .blueprintViewport {
          position: relative;
          flex: 1;
          min-height: 0;
          border: 1px solid rgba(255, 255, 255, 0.1);
          background:
            radial-gradient(120% 120% at 50% 40%, rgba(255,255,255,0.014), transparent 70%),
            #060606;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 10px;
        }

        .blueprintCoord {
          position: absolute;
          bottom: 8px;
          right: 10px;
          font-family: ui-monospace, monospace;
          font-size: 8.5px;
          letter-spacing: 0.12em;
          color: rgba(255, 255, 255, 0.26);
          pointer-events: none;
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

        /* ── Boot animation ───────────────────────────────────────── */

        .bootLayer {
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 20;
        }

        .processBlueprint:not(.isBooted) .bootLayer {
          display: none;
        }

        .bootLine {
          position: absolute;
          top: 50%;
          left: 0;
          width: 100%;
          height: 1px;
          background: rgba(255, 255, 255, 0.55);
          box-shadow: 0 0 10px rgba(255, 255, 255, 0.25), 0 0 22px rgba(255, 255, 255, 0.1);
          transform: scaleX(0);
          transform-origin: center;
        }

        .processBlueprint.isBooted .bootLine {
          animation: bootLineExpand 0.42s cubic-bezier(0.7, 0, 0.3, 1) 0.04s both;
        }

        @keyframes bootLineExpand {
          0%   { transform: scaleX(0); opacity: 1; }
          60%  { transform: scaleX(1); opacity: 0.85; }
          100% { transform: scaleX(1); opacity: 0; }
        }

        .bootGlow {
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse 90% 50% at 50% 50%, rgba(255, 255, 255, 0.05) 0%, transparent 70%);
          opacity: 0;
        }

        .processBlueprint.isBooted .bootGlow {
          animation: bootGlowPulse 0.65s ease 0.28s both;
        }

        @keyframes bootGlowPulse {
          0%   { opacity: 0; }
          35%  { opacity: 1; }
          100% { opacity: 0; }
        }

        .bootFlicker {
          position: absolute;
          inset: 0;
          background: rgba(255, 255, 255, 0.05);
          opacity: 0;
        }

        .processBlueprint.isBooted .bootFlicker {
          animation: bootFlicker 0.55s ease 0.32s both;
        }

        @keyframes bootFlicker {
          0%   { opacity: 0; }
          8%   { opacity: 0.07; }
          16%  { opacity: 0; }
          26%  { opacity: 0.05; }
          38%  { opacity: 0.01; }
          54%  { opacity: 0.04; }
          100% { opacity: 0; }
        }

        /* Content: hidden until boot, then staggered reveal */
        .processBlueprint:not(.isBooted) .processHeader,
        .processBlueprint:not(.isBooted) .stepper,
        .processBlueprint:not(.isBooted) .processBody {
          opacity: 0;
        }

        .processBlueprint.isBooted .processHeader {
          animation: bootReveal 0.5s ease 0.46s both;
        }

        .processBlueprint.isBooted .stepper {
          animation: bootReveal 0.5s ease 0.56s both;
        }

        .processBlueprint.isBooted .processBody {
          animation: bootReveal 0.55s ease 0.64s both;
        }

        @keyframes bootReveal {
          0%   { opacity: 0; transform: translateY(6px); }
          100% { opacity: 1; transform: translateY(0); }
        }

        /* ── Responsive ───────────────────────────────────────────── */

        /* Tablet: relax the two columns, smaller blueprint share */
        @media (max-width: 1080px) {
          .processBody {
            grid-template-columns: minmax(0, 1fr) minmax(0, 0.92fr);
          }
          .stepNodeName {
            font-size: 9.5px;
            letter-spacing: 0.04em;
          }
        }

        /* ── Stacked layout: detail console on top, blueprint fills below.
           The panel is pinned to the viewport on mobile and cannot scroll
           internally, so nothing may exceed ~100svh. The console keeps its
           natural (priority) height and the blueprint flexes into whatever
           space is left — guaranteeing no overflow and no dead gap. ── */
        @media (max-width: 860px) {
          .processInner {
            gap: 14px;
            padding-top: 70px;
            padding-bottom: 20px;
          }
          .processHeader {
            flex-direction: column;
            gap: 12px;
          }
          .processHeadAside {
            flex-direction: row;
            align-items: center;
            align-self: flex-start;
            gap: 12px;
          }
          /* Drop the subtitle on mobile to reclaim vertical room */
          .processSubtitle {
            display: none;
          }
          .processBody {
            display: flex;
            flex-direction: column;
          }
          .detailCol {
            border-right: none;
            border-bottom: 1px solid rgba(255, 255, 255, 0.08);
            flex: none;
            padding: 18px;
          }
          :global(.detailInner) {
            gap: 16px;
          }
          .ioGrid {
            margin-top: 2px;
          }
          /* Blueprint absorbs the remaining height; shrinks gracefully on
             short screens instead of pushing the console off-panel */
          .blueprintCol {
            flex: 1;
            min-height: 0;
          }
          /* Stepper: keep the rail, drop the labels so 6 nodes fit cleanly */
          .stepNodeName {
            display: none;
          }
        }

        @media (max-width: 560px) {
          .processInner {
            width: min(calc(100% - 32px), 1200px);
            padding-top: 66px;
          }
          .detailCol {
            padding: 16px 14px;
          }
          .detailTop {
            gap: 12px;
          }
          .detailStatus {
            display: none;
          }
          /* IO blocks stack with the arrow rotating to point down */
          .ioGrid {
            grid-template-columns: 1fr;
          }
          .ioArrow {
            transform: rotate(90deg);
            margin: -2px 0;
          }
        }

        /* ── Reduced motion ───────────────────────────────────────── */

        @media (prefers-reduced-motion: reduce) {
          .blueprintScan,
          .stepperFill {
            transition: none;
          }
          .blueprintScan {
            display: none;
          }
          .processBlueprint:not(.isBooted) .processHeader,
          .processBlueprint:not(.isBooted) .stepper,
          .processBlueprint:not(.isBooted) .processBody {
            opacity: 1;
          }
          .processBlueprint.isBooted .processHeader,
          .processBlueprint.isBooted .stepper,
          .processBlueprint.isBooted .processBody,
          .processBlueprint.isBooted .bootLine,
          .processBlueprint.isBooted .bootGlow,
          .processBlueprint.isBooted .bootFlicker {
            animation: none;
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
