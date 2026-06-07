'use client';

import { useEffect, useLayoutEffect, useRef, useState, useCallback } from 'react';
import {
  motion,
  AnimatePresence,
  useReducedMotion,
  useMotionValue,
  animate as fmAnimate,
  type Variants,
} from 'framer-motion';

const useIsoEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

// ── Types & data ───────────────────────────────────────────────────────────────

type CoreRow = { label: string; value: string };

type SignalItem = {
  id: string;
  name: string;
  status: 'VERIFIED' | 'ACTIVE' | 'STABLE' | 'READY';
  text: string;
  riskRemoved: string;
  proofOutput: string;
  result: string;
  strength: number;
  coreReadout: CoreRow[];
};

const SIGNALS: SignalItem[] = [
  {
    id: '01', name: 'SYSTEM THINKING', status: 'VERIFIED',
    text: 'We design flows, states, permissions, components, and edge cases — not just isolated screens.',
    riskRemoved: 'Disconnected screens and weak product logic.',
    proofOutput: 'Flow maps / reusable patterns / state logic',
    result: 'A product that holds together at every layer.',
    strength: 94,
    coreReadout: [
      { label: 'TRUST INDEX',  value: '94%'      },
      { label: 'SYSTEM DEPTH', value: 'VERIFIED' },
      { label: 'BUILD RISK',   value: 'LOW'       },
    ],
  },
  {
    id: '02', name: 'PRODUCT CLARITY', status: 'ACTIVE',
    text: 'We convert scattered ideas and stakeholder noise into structured product decisions.',
    riskRemoved: 'Confusing requirements and slow decision-making.',
    proofOutput: 'Prioritized direction / screen architecture / decision model',
    result: 'Clear scope and faster team alignment.',
    strength: 88,
    coreReadout: [
      { label: 'CLARITY SIGNAL',  value: 'HIGH'   },
      { label: 'NOISE REDUCTION', value: 'ACTIVE' },
      { label: 'DECISION PATH',   value: 'MAPPED' },
    ],
  },
  {
    id: '03', name: 'BUILD-READY DESIGN', status: 'STABLE',
    text: 'Developers get clear specs, responsive rules, interaction states, and reusable components.',
    riskRemoved: 'Handoff confusion and implementation guesswork.',
    proofOutput: 'Component specs / responsive rules / interaction notes',
    result: 'Faster build with fewer assumptions.',
    strength: 97,
    coreReadout: [
      { label: 'HANDOFF QUALITY', value: 'VERIFIED' },
      { label: 'DEV GUESSWORK',   value: 'LOW'      },
      { label: 'SPEC DEPTH',      value: 'READY'    },
    ],
  },
  {
    id: '04', name: 'REAL-WORLD UX', status: 'VERIFIED',
    text: 'We design for mobile behavior, loading states, empty states, errors, and actual user decisions.',
    riskRemoved: 'Perfect Figma screens that break in real usage.',
    proofOutput: 'Mobile states / edge cases / failure states',
    result: 'Interfaces that survive contact with real users.',
    strength: 91,
    coreReadout: [
      { label: 'USAGE COVERAGE',   value: 'HIGH'   },
      { label: 'EDGE CASES',       value: 'MAPPED' },
      { label: 'MOBILE READINESS', value: 'STABLE' },
    ],
  },
  {
    id: '05', name: 'FAST EXECUTION', status: 'READY',
    text: 'Our process cuts unnecessary guesswork so teams can move from idea to launch faster.',
    riskRemoved: 'Long loops, repeated redesigns, and unclear next steps.',
    proofOutput: 'Faster decisions / cleaner iterations / reduced rework',
    result: 'Less time in review, more time shipping.',
    strength: 86,
    coreReadout: [
      { label: 'REWORK RISK',    value: 'REDUCED' },
      { label: 'DECISION SPEED', value: 'HIGH'    },
      { label: 'ITERATION LOOP', value: 'CLEAN'   },
    ],
  },
  {
    id: '06', name: 'BUSINESS ALIGNMENT', status: 'ACTIVE',
    text: 'Every design decision connects to trust, usability, conversion, speed, or operational clarity.',
    riskRemoved: 'Pretty interfaces that do not move the business.',
    proofOutput: 'Outcome-focused UX / clearer user journeys / measurable intent',
    result: 'Design that justifies itself on the bottom line.',
    strength: 92,
    coreReadout: [
      { label: 'OUTCOME LINK',    value: 'VERIFIED' },
      { label: 'UX INTENT',       value: 'CLEAR'    },
      { label: 'BUSINESS SIGNAL', value: 'ACTIVE'   },
    ],
  },
];

// Smooth, cinematic easing reused across the section.
const EASE_OUT = [0.22, 1, 0.36, 1] as const;

const containerV: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.09, delayChildren: 0.12 },
  },
};

const riseV: Variants = {
  hidden: { opacity: 0, y: 34, filter: 'blur(12px)' },
  show: {
    opacity: 1, y: 0, filter: 'blur(0px)',
    transition: { duration: 0.95, ease: EASE_OUT },
  },
};

const riseLeftV: Variants = {
  hidden: { opacity: 0, x: -40, filter: 'blur(10px)' },
  show: {
    opacity: 1, x: 0, filter: 'blur(0px)',
    transition: { duration: 0.85, ease: EASE_OUT },
  },
};

const riseRightV: Variants = {
  hidden: { opacity: 0, x: 40, filter: 'blur(10px)' },
  show: {
    opacity: 1, x: 0, filter: 'blur(0px)',
    transition: { duration: 0.85, ease: EASE_OUT },
  },
};

const scaleInV: Variants = {
  hidden: { opacity: 0, scale: 0.9, filter: 'blur(14px)' },
  show: {
    opacity: 1, scale: 1, filter: 'blur(0px)',
    transition: { duration: 1.1, ease: EASE_OUT },
  },
};

// ── Animated number counter ──────────────────────────────────────────────────

function Counter({ value, animate }: { value: number; animate: boolean }) {
  const mv = useMotionValue(0);
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    if (!animate) { setDisplay(value); return; }
    mv.set(0);
    const controls = fmAnimate(mv, value, {
      duration: 1.2,
      ease: EASE_OUT,
      onUpdate: (v) => setDisplay(Math.round(v)),
    });
    return () => controls.stop();
  }, [value, animate, mv]);

  return <>{display}</>;
}

// ── Trust Core SVG ─────────────────────────────────────────────────────────────

function TrustCoreSVG({
  activeIndex,
  reducedMotion,
}: {
  activeIndex: number;
  reducedMotion: boolean;
}) {
  const cx = 200, cy = 200;
  const sig = SIGNALS[activeIndex];

  const nodes = SIGNALS.map((_, i) => {
    const angle = (i / SIGNALS.length) * 2 * Math.PI - Math.PI / 2;
    return { x: cx + 138 * Math.cos(angle), y: cy + 138 * Math.sin(angle) };
  });

  const ticks = Array.from({ length: 36 }, (_, i) => {
    const a = (i / 36) * 2 * Math.PI;
    const major = i % 9 === 0;
    const med   = i % 3 === 0;
    const r2 = major ? 143 : med ? 149 : 152;
    return {
      x1: cx + 155 * Math.cos(a), y1: cy + 155 * Math.sin(a),
      x2: cx + r2  * Math.cos(a), y2: cy + r2  * Math.sin(a),
      sw: major ? 1.5 : 0.75,
    };
  });

  const anim = (dur: string, dir: 1 | -1 = 1) =>
    reducedMotion ? undefined : (
      <animateTransform
        attributeName="transform"
        type="rotate"
        from={`${dir === 1 ? 0 : 360} ${cx} ${cy}`}
        to={`${dir === 1 ? 360 : 0} ${cx} ${cy}`}
        dur={dur}
        repeatCount="indefinite"
      />
    );

  return (
    <svg viewBox="0 0 400 400" width="100%" height="100%" aria-hidden="true" style={{ display: 'block' }}>
      <defs>
        <radialGradient id="tcGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%"   stopColor="rgba(255,255,255,0.05)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0)"    />
        </radialGradient>
        <clipPath id="tcClip">
          <circle cx={cx} cy={cy} r="155" />
        </clipPath>
      </defs>

      <circle cx={cx} cy={cy} r="185" fill="url(#tcGlow)" />

      <circle cx={cx} cy={cy} r="170" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
      <circle cx={cx} cy={cy} r="155" fill="none" stroke="rgba(255,255,255,0.09)" strokeWidth="1" />
      <circle cx={cx} cy={cy} r="147" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="0.5" strokeDasharray="4 6" />

      <circle cx={cx} cy={cy} r="124" fill="none" stroke="rgba(255,255,255,0.11)" strokeWidth="0.5" strokeDasharray="8 7">
        {anim('16s')}
      </circle>

      <circle cx={cx} cy={cy} r="108" fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="1" />
      <circle cx={cx} cy={cy} r="90"  fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" strokeDasharray="3 4" />

      <circle cx={cx} cy={cy} r="75" fill="none" stroke="rgba(255,255,255,0.13)" strokeWidth="0.5" strokeDasharray="6 5">
        {anim('22s', -1)}
      </circle>

      <line x1={cx} y1="20" x2={cx} y2="380" stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" />
      <line x1="20" y1={cy} x2="380" y2={cy} stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" />
      <line x1="68" y1="68" x2="332" y2="332" stroke="rgba(255,255,255,0.02)" strokeWidth="0.5" />
      <line x1="332" y1="68" x2="68" y2="332" stroke="rgba(255,255,255,0.02)" strokeWidth="0.5" />

      <g clipPath="url(#tcClip)">
        <g>
          {!reducedMotion && (
            <animateTransform
              attributeName="transform"
              type="rotate"
              from={`0 ${cx} ${cy}`}
              to={`360 ${cx} ${cy}`}
              dur="4s"
              repeatCount="indefinite"
            />
          )}
          <line x1={cx} y1={cy} x2={cx} y2={cy - 155} stroke="rgba(255,255,255,0.5)" strokeWidth="1" />
          <path
            d={`M${cx},${cy} L${cx},${cy - 155} A155,155 0 0,0 ${cx + 155 * Math.sin(0.35)},${cy - 155 * Math.cos(0.35)} Z`}
            fill="rgba(255,255,255,0.04)"
          />
        </g>
      </g>

      {ticks.map((t, i) => (
        <line key={i} x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2}
          stroke="rgba(255,255,255,0.2)" strokeWidth={t.sw} />
      ))}

      {nodes.map(({ x, y }, i) => {
        const active = i === activeIndex;
        return (
          <g key={i}>
            <motion.line
              x1={x} y1={y} x2={cx} y2={cy}
              animate={{
                stroke: active ? 'rgba(255,255,255,0.32)' : 'rgba(255,255,255,0.05)',
                strokeWidth: active ? 1.2 : 0.5,
              }}
              transition={{ duration: 0.6, ease: EASE_OUT }}
              strokeDasharray={active ? undefined : '3 4'}
            />
            {active && (
              <motion.circle
                cx={x} cy={y}
                initial={{ r: 4, opacity: 0 }}
                animate={{ r: 9, opacity: 1 }}
                transition={{ duration: 0.6, ease: EASE_OUT }}
                fill="none" stroke="rgba(255,255,255,0.28)" strokeWidth="1"
              />
            )}
            <motion.circle
              cx={x} cy={y}
              animate={{ r: active ? 5.5 : 3, fill: active ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.22)' }}
              transition={{ duration: 0.5, ease: EASE_OUT }}
            />
          </g>
        );
      })}

      <circle cx={cx} cy={cy} r="56" fill="rgba(10,10,10,0.88)" stroke="rgba(255,255,255,0.18)" strokeWidth="1" />
      <circle cx={cx} cy={cy} r="50" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" />

      <text x={cx} y={cy - 13} textAnchor="middle" fill="rgba(255,255,255,0.28)" fontSize="6.5" fontFamily="monospace" letterSpacing="0.14em">TRUST ENGINE</text>
      <text x={cx} y={cy + 7}  textAnchor="middle" fill="rgba(255,255,255,0.94)" fontSize="20"  fontFamily="monospace" fontWeight="700" letterSpacing="0.03em">{sig.strength}%</text>
      <text x={cx} y={cy + 21} textAnchor="middle" fill="rgba(255,255,255,0.32)" fontSize="6.5" fontFamily="monospace" letterSpacing="0.12em">SIG {sig.id}</text>

      <text x={cx}   y="13"    textAnchor="middle" fill="rgba(255,255,255,0.16)" fontSize="7" fontFamily="monospace">N</text>
      <text x="390"  y={cy+3}  textAnchor="middle" fill="rgba(255,255,255,0.16)" fontSize="7" fontFamily="monospace">E</text>
      <text x={cx}   y="392"   textAnchor="middle" fill="rgba(255,255,255,0.16)" fontSize="7" fontFamily="monospace">S</text>
      <text x="10"   y={cy+3}  textAnchor="middle" fill="rgba(255,255,255,0.16)" fontSize="7" fontFamily="monospace">W</text>

      <text x="8"   y="13"  fill="rgba(255,255,255,0.11)" fontSize="6" fontFamily="monospace">X:042</text>
      <text x="8"   y="393" fill="rgba(255,255,255,0.11)" fontSize="6" fontFamily="monospace">Y:118</text>
      <text x="308" y="13"  fill="rgba(255,255,255,0.11)" fontSize="6" fontFamily="monospace">Z:{sig.strength}%</text>
      <text x="314" y="393" fill="rgba(255,255,255,0.11)" fontSize="6" fontFamily="monospace">SIG:{sig.id}</text>
    </svg>
  );
}

// ── Main component ─────────────────────────────────────────────────────────────

export default function TrustEngineSection() {
  const [activeIndex, setActiveIndex]   = useState(0);
  const [lockedIndex, setLockedIndex]   = useState<number | null>(null);
  const [isMounted,   setIsMounted]     = useState(false);
  const [entered,     setEntered]       = useState(false);
  const reduce = useReducedMotion();
  const reducedMotion = !!reduce;

  const sig = SIGNALS[activeIndex];

  // client-only boot
  useIsoEffect(() => {
    setIsMounted(true);
  }, []);

  // Reduced motion → reveal immediately (no scroll-driven entrance to wait for).
  useEffect(() => {
    if (reducedMotion) setEntered(true);
  }, [reducedMotion]);

  // scroll-driven signal: CoinScene dispatches 'trustSignal' with detail = 0-5.
  // First receipt = panel reached → trigger the cinematic entrance.
  useIsoEffect(() => {
    if (!isMounted) return;
    const handler = (e: Event) => {
      setEntered(true);
      const idx = (e as CustomEvent<number>).detail;
      if (lockedIndex === null) setActiveIndex(idx);
    };
    window.addEventListener('trustSignal', handler);
    return () => window.removeEventListener('trustSignal', handler);
  }, [isMounted, lockedIndex]);

  const handleHover = useCallback((i: number) => {
    if (lockedIndex === null) setActiveIndex(i);
  }, [lockedIndex]);

  const handleLeave = useCallback(() => {
    setActiveIndex(lockedIndex ?? 0);
  }, [lockedIndex]);

  const handleClick = useCallback((i: number) => {
    if (lockedIndex === i) { setLockedIndex(null); }
    else { setLockedIndex(i); setActiveIndex(i); }
  }, [lockedIndex]);

  const show = entered ? 'show' : 'hidden';

  return (
    <motion.div
      className="te"
      variants={containerV}
      initial="hidden"
      animate={show}
    >
      {/* background grid */}
      <div className="teBg" aria-hidden="true" />
      <span className="teBgW teBgW1" aria-hidden="true">TRUST</span>
      <span className="teBgW teBgW2" aria-hidden="true">SIGNAL</span>
      <span className="teBgW teBgW3" aria-hidden="true">MATRIX</span>

      {/* ── header ──────────────────────────────────────────────────── */}
      <header className="teHead">
        <motion.span className="teLabel" variants={riseV}>SECTION D / TRUST ENGINE</motion.span>
        <motion.h2 className="teH2" variants={riseV}>WHY TEAMS CHOOSE US</motion.h2>
        <motion.p className="teSub" variants={riseV}>
          We turn messy product ideas into clear, scalable systems built for users,
          developers, and business outcomes.
        </motion.p>
        <motion.div className="teMeta" variants={riseV}>
          <span className="teMetaChip">TRUST INDEX: <Counter value={sig.strength} animate={entered} />%</span>
          <span className="teMetaChip">BUILD RISK: LOW</span>
          <span className="teMetaChip">STATUS: VERIFIED</span>
          <span className="teMetaChip">MODE: RISK REDUCTION</span>
        </motion.div>
      </header>

      {/* ── desktop 3-col ───────────────────────────────────────────── */}
      <div className="teGrid">

        {/* LEFT */}
        <motion.div className="teLeft" variants={riseLeftV}>
          <div className="teColLbl">CORE SIGNALS</div>
          {SIGNALS.map((s, i) => {
            const active = activeIndex === i;
            const locked = lockedIndex === i;
            return (
              <motion.div
                key={s.id}
                className={`teRow${active ? ' teRowOn' : ''}${locked ? ' teRowLocked' : ''}`}
                onMouseEnter={() => handleHover(i)}
                onMouseLeave={handleLeave}
                onClick={() => handleClick(i)}
                role="button" tabIndex={0}
                onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') handleClick(i); }}
                aria-pressed={locked}
                aria-label={`Signal ${s.id}: ${s.name}`}
                whileHover={reducedMotion ? undefined : { x: 6 }}
                transition={{ type: 'spring', stiffness: 320, damping: 30 }}
              >
                {active && <span className="teScan" aria-hidden="true" />}
                {active && <span className="teCnx"  aria-hidden="true" />}

                <div className="teRowTop">
                  <span className="teNum">{s.id}</span>
                  <span className="teName">{s.name}</span>
                  <span className={`teChip teChip-${s.status.toLowerCase()}`}>{s.status}</span>
                </div>

                <AnimatePresence initial={false}>
                  {active && (
                    <motion.p
                      className="teRowTxt"
                      initial={{ opacity: 0, height: 0, marginTop: 0, marginBottom: 0 }}
                      animate={{ opacity: 1, height: 'auto', marginTop: 10, marginBottom: 8 }}
                      exit={{ opacity: 0, height: 0, marginTop: 0, marginBottom: 0 }}
                      transition={{ duration: 0.5, ease: EASE_OUT }}
                    >
                      {s.text}
                    </motion.p>
                  )}
                </AnimatePresence>

                <div className="teMeter">
                  <div className="teMeterT">
                    <motion.div
                      className="teMeterF"
                      animate={{ width: `${active ? s.strength : Math.round(s.strength * 0.2)}%` }}
                      transition={{ duration: 0.8, ease: EASE_OUT }}
                    />
                  </div>
                  <span className="teMeterN">{s.strength}</span>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* CENTER */}
        <motion.div className="teCenter" variants={scaleInV}>
          <b className="tcBr tcBrTL" aria-hidden="true" /><b className="tcBr tcBrTR" aria-hidden="true" />
          <b className="tcBr tcBrBL" aria-hidden="true" /><b className="tcBr tcBrBR" aria-hidden="true" />

          <div className="tcHdr">DECISION ENGINE</div>

          <div className="tcVis">
            {isMounted && <TrustCoreSVG activeIndex={activeIndex} reducedMotion={reducedMotion} />}
          </div>

          <div className="tcReadout">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                className="tcReadoutInner"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4, ease: EASE_OUT }}
              >
                {sig.coreReadout.map((r, i) => (
                  <div key={i} className="tcRRow">
                    <span className="tcRKey">{r.label}</span>
                    <span className="tcRVal">{r.value}</span>
                  </div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="tcFoot">
            <span>MODE: RISK REDUCTION</span>
            <span>SIG: {sig.id}/06</span>
          </div>
        </motion.div>

        {/* RIGHT */}
        <motion.div className="teRight" variants={riseRightV}>
          <div className="tmHdr">
            <span className="tmHdrTxt">RISK REDUCTION MATRIX</span>
            <div className="tmLive"><span className="tmDot" aria-hidden="true" /><span>LIVE</span></div>
          </div>

          <div className="tmBody">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0, x: 18, filter: 'blur(6px)' }}
                animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, x: -18, filter: 'blur(6px)' }}
                transition={{ duration: 0.45, ease: EASE_OUT }}
              >
                <div className="tmRow">
                  <span className="tmKey">ACTIVE SIGNAL</span>
                  <span className="tmVal">{sig.name}</span>
                </div>
                <div className="tmDiv" />
                <div className="tmRow">
                  <span className="tmKey">RISK REMOVED</span>
                  <span className="tmValB">{sig.riskRemoved}</span>
                </div>
                <div className="tmDiv" />
                <div className="tmRow">
                  <span className="tmKey">PROOF OUTPUT</span>
                  <span className="tmValB">{sig.proofOutput}</span>
                </div>
                <div className="tmDiv" />
                <div className="tmRow">
                  <span className="tmKey">RESULT</span>
                  <span className="tmValB">{sig.result}</span>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="tmMeta">
            {([
              ['STATUS',          'VERIFIED'       ],
              ['MODE',            'RISK REDUCTION'  ],
              ['CONFIDENCE',      'HIGH'            ],
              ['SIGNAL STRENGTH', `${sig.strength}%`],
            ] as [string, string][]).map(([k, v]) => (
              <div key={k} className="tmMetaRow">
                <span className="tmMK">{k}</span>
                <span className="tmMV">{v}</span>
              </div>
            ))}
          </div>

          <div className="tmFoot">
            <span>X:042</span><span>Y:118</span><span>REF: TRE-{sig.id}</span>
          </div>
        </motion.div>

      </div>

      {/* ── mobile stacked ──────────────────────────────────────────── */}
      <div className="teMob">
        <motion.div className="tmiTop" variants={riseV}>
          <div className="tmiTopHdr">
            <span>TRUST ENGINE</span>
            <span className="tmDot" aria-hidden="true" />
          </div>
          {sig.coreReadout.map((r, i) => (
            <div key={i} className="tmiTopRow">
              <span className="tmiTK">{r.label}</span>
              <span className="tmiTV">{r.value}</span>
            </div>
          ))}
        </motion.div>

        {SIGNALS.map((s, i) => (
          <motion.div
            key={s.id}
            className={`tmiCard${activeIndex === i ? ' tmiCardOn' : ''}`}
            onClick={() => setActiveIndex(activeIndex === i ? 0 : i)}
            variants={riseV}
            whileTap={reducedMotion ? undefined : { scale: 0.985 }}
          >
            <div className="tmiCardTop">
              <span className="tmiNum">{s.id}</span>
              <span className="tmiName">{s.name}</span>
              <span className={`teChip teChip-${s.status.toLowerCase()}`}>{s.status}</span>
            </div>
            <p className="tmiTxt">{s.text}</p>
            <div className="tmiRow2">
              <span className="tmKey">RISK REMOVED</span>
              <span className="tmiVal2">{s.riskRemoved}</span>
            </div>
            <div className="tmiRow2">
              <span className="tmKey">PROOF OUTPUT</span>
              <span className="tmiVal2">{s.proofOutput}</span>
            </div>
            <div className="tmiMeter">
              <div className="teMeterT teMeterTFull">
                <motion.div
                  className="teMeterF"
                  initial={{ width: 0 }}
                  animate={{ width: entered ? `${s.strength}%` : 0 }}
                  transition={{ duration: 0.9, ease: EASE_OUT, delay: 0.1 + i * 0.05 }}
                />
              </div>
              <span className="teMeterN">{s.strength}</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* ── styles ──────────────────────────────────────────────────── */}
      <style jsx>{`
        /* root */
        .te {
          position: relative;
          width: 100%;
          max-width: 1320px;
          height: 100%;
          margin: 0 auto;
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          justify-content: center;
          background: #0a0a0a;
          color: #ededed;
          padding: clamp(36px, 6vh, 76px) clamp(28px, 4vw, 72px);
          overflow: hidden;
          font-family: var(--font-geist-mono, 'Courier New', monospace);
        }

        /* background grid */
        .teBg {
          position: absolute; inset: 0; z-index: 0; pointer-events: none;
          background-image:
            linear-gradient(rgba(255,255,255,0.022) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.022) 1px, transparent 1px);
          background-size: 56px 56px;
        }

        /* faint bg words */
        .teBgW {
          position: absolute; pointer-events: none; user-select: none; z-index: 0;
          font-weight: 900; letter-spacing: 0.22em; white-space: nowrap;
          font-family: var(--font-geist-mono, monospace);
        }
        .teBgW1 { font-size: 240px; color: rgba(255,255,255,0.017); top: 26%; left: 50%; transform: translate(-50%, -50%); }
        .teBgW2 { font-size: 140px; color: rgba(255,255,255,0.012); bottom: 6%;  right: -4%; }
        .teBgW3 { font-size: 110px; color: rgba(255,255,255,0.009); top: 4%;     left: -2%; }

        /* header */
        .teHead { position: relative; z-index: 2; margin-bottom: clamp(24px, 4vh, 52px); }

        .teLabel {
          display: block; font-size: 11px; letter-spacing: 0.26em;
          color: rgba(255,255,255,0.4); text-transform: uppercase; margin-bottom: 22px;
        }

        .teH2 {
          font-size: clamp(30px, 3.4vw, 52px); font-weight: 700;
          letter-spacing: 0.06em; text-transform: uppercase;
          margin: 0 0 22px; color: rgba(255,255,255,0.97);
          font-family: var(--font-geist-mono, monospace); line-height: 1.04;
        }

        .teSub {
          font-size: 15px; line-height: 1.74; color: rgba(255,255,255,0.5);
          max-width: 560px; margin: 0 0 28px;
          font-family: var(--font-geist-sans, sans-serif);
        }

        .teMeta { display: flex; gap: 12px; flex-wrap: wrap; }

        .teMetaChip {
          font-size: 9.5px; letter-spacing: 0.13em; color: rgba(255,255,255,0.42);
          border: 1px solid rgba(255,255,255,0.13); padding: 6px 12px;
          font-family: var(--font-geist-mono, monospace); text-transform: uppercase;
        }

        /* 3-col grid */
        .teGrid {
          position: relative; z-index: 2;
          display: grid; grid-template-columns: 1fr 320px 1fr;
          gap: 32px; align-items: start;
        }

        .teColLbl {
          font-size: 9.5px; letter-spacing: 0.2em; color: rgba(255,255,255,0.26);
          text-transform: uppercase; margin-bottom: 16px;
          font-family: var(--font-geist-mono, monospace);
        }

        /* signal rows */
        .teLeft { display: flex; flex-direction: column; gap: 10px; }

        .teRow {
          position: relative; border: 1px solid rgba(255,255,255,0.09);
          padding: 18px 20px; cursor: pointer; overflow: hidden;
          opacity: 0.5; user-select: none; outline: none;
          transition: border-color 0.25s ease, background 0.25s ease, opacity 0.25s ease;
        }
        .teRow:focus-visible { outline: 1px solid rgba(255,255,255,0.36); outline-offset: 2px; }
        .teRow:hover  { border-color: rgba(255,255,255,0.24); opacity: 0.85; background: rgba(255,255,255,0.022); }
        .teRowOn      { border-color: rgba(255,255,255,0.34) !important; opacity: 1 !important; background: rgba(255,255,255,0.03) !important; }
        .teRowLocked  { border-color: rgba(255,255,255,0.55) !important; }

        /* scanline pass */
        .teScan {
          position: absolute; inset: 0; pointer-events: none;
          background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.05) 45%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.05) 55%, transparent 100%);
          animation: scanPass 2.4s ease-in-out infinite;
        }
        @keyframes scanPass {
          0%   { transform: translateX(-100%); }
          100% { transform: translateX(100%);  }
        }

        .teCnx {
          position: absolute; top: 50%; right: 0;
          width: 32px; height: 1px;
          background: linear-gradient(90deg, rgba(255,255,255,0.38), transparent);
          pointer-events: none;
        }

        .teRowTop { display: flex; align-items: center; gap: 14px; flex-wrap: wrap; }

        .teNum  { font-size: 11px; letter-spacing: 0.1em; color: rgba(255,255,255,0.34); font-family: var(--font-geist-mono, monospace); min-width: 22px; }
        .teName { font-size: 13px; letter-spacing: 0.09em; color: rgba(255,255,255,0.92); text-transform: uppercase; flex: 1; font-family: var(--font-geist-mono, monospace); }

        /* status chips */
        .teChip {
          font-size: 9px; letter-spacing: 0.1em; padding: 4px 9px;
          border: 1px solid; text-transform: uppercase; white-space: nowrap;
          font-family: var(--font-geist-mono, monospace);
        }
        .teChip-verified { color: rgba(255,255,255,0.8);  border-color: rgba(255,255,255,0.28); }
        .teChip-active   { color: rgba(255,255,255,0.92); border-color: rgba(255,255,255,0.4);  }
        .teChip-stable   { color: rgba(255,255,255,0.6);  border-color: rgba(255,255,255,0.19); }
        .teChip-ready    { color: rgba(255,255,255,0.7);  border-color: rgba(255,255,255,0.24); }

        .teRowTxt {
          font-size: 13px; line-height: 1.62; color: rgba(255,255,255,0.55);
          overflow: hidden; font-family: var(--font-geist-sans, sans-serif);
        }

        .teMeter { display: flex; align-items: center; gap: 12px; margin-top: 14px; }
        .teMeterT { flex: 1; height: 3px; background: rgba(255,255,255,0.08); overflow: hidden; }
        .teMeterTFull { flex: 1; height: 3px; background: rgba(255,255,255,0.08); overflow: hidden; }
        .teMeterF { height: 100%; background: rgba(255,255,255,0.66); }
        .teMeterN { font-size: 10px; color: rgba(255,255,255,0.38); font-family: var(--font-geist-mono, monospace); min-width: 26px; text-align: right; }

        /* center col */
        .teCenter {
          position: relative; border: 1px solid rgba(255,255,255,0.12);
          padding: 24px 22px 20px;
          display: flex; flex-direction: column; align-items: center;
        }

        /* corner brackets */
        .tcBr { position: absolute; width: 14px; height: 14px; border-style: solid; border-color: rgba(255,255,255,0.34); display: block; }
        .tcBrTL { top: -1px;    left: -1px;  border-width: 1.5px 0 0 1.5px; }
        .tcBrTR { top: -1px;    right: -1px; border-width: 1.5px 1.5px 0 0; }
        .tcBrBL { bottom: -1px; left: -1px;  border-width: 0 0 1.5px 1.5px; }
        .tcBrBR { bottom: -1px; right: -1px; border-width: 0 1.5px 1.5px 0; }

        .tcHdr {
          font-size: 9.5px; letter-spacing: 0.22em; color: rgba(255,255,255,0.28);
          text-transform: uppercase; font-family: var(--font-geist-mono, monospace);
          margin-bottom: 14px;
        }

        .tcVis { width: 100%; aspect-ratio: 1; }

        .tcReadout {
          width: 100%; border-top: 1px solid rgba(255,255,255,0.08);
          margin-top: 16px; padding-top: 16px;
        }
        .tcReadoutInner { display: flex; flex-direction: column; gap: 10px; }

        .tcRRow { display: flex; justify-content: space-between; align-items: center; }
        .tcRKey { font-size: 9.5px; letter-spacing: 0.1em; color: rgba(255,255,255,0.3); text-transform: uppercase; font-family: var(--font-geist-mono, monospace); }
        .tcRVal { font-size: 10.5px; letter-spacing: 0.08em; color: rgba(255,255,255,0.86); text-transform: uppercase; font-family: var(--font-geist-mono, monospace); }

        .tcFoot {
          width: 100%; display: flex; justify-content: space-between;
          margin-top: 18px; padding-top: 14px; border-top: 1px solid rgba(255,255,255,0.06);
          font-size: 9px; letter-spacing: 0.1em; color: rgba(255,255,255,0.2);
          text-transform: uppercase; font-family: var(--font-geist-mono, monospace);
        }

        /* right matrix */
        .teRight {
          border: 1px solid rgba(255,255,255,0.12); padding: 24px 26px;
          display: flex; flex-direction: column;
        }

        .tmHdr {
          display: flex; justify-content: space-between; align-items: center;
          margin-bottom: 18px; padding-bottom: 14px;
          border-bottom: 1px solid rgba(255,255,255,0.07);
        }
        .tmHdrTxt {
          font-size: 10.5px; letter-spacing: 0.16em; color: rgba(255,255,255,0.45);
          text-transform: uppercase; font-family: var(--font-geist-mono, monospace);
        }
        .tmLive {
          display: flex; align-items: center; gap: 8px;
          font-size: 9.5px; letter-spacing: 0.1em; color: rgba(255,255,255,0.38);
          font-family: var(--font-geist-mono, monospace);
        }

        .tmDot {
          display: inline-block; width: 6px; height: 6px; border-radius: 50%;
          background: rgba(255,255,255,0.52); animation: tmBlink 2s ease-in-out infinite;
        }
        @keyframes tmBlink { 0%, 100% { opacity: 1; } 50% { opacity: 0.15; } }

        .tmBody { display: flex; flex-direction: column; flex: 1; }

        .tmRow { display: flex; flex-direction: column; gap: 8px; padding: 14px 0; }
        .tmDiv { height: 1px; background: rgba(255,255,255,0.06); }

        .tmKey {
          font-size: 9.5px; letter-spacing: 0.14em; color: rgba(255,255,255,0.32);
          text-transform: uppercase; font-family: var(--font-geist-mono, monospace);
        }
        .tmVal {
          font-size: 14px; letter-spacing: 0.06em; color: rgba(255,255,255,0.92);
          text-transform: uppercase; font-family: var(--font-geist-mono, monospace);
          line-height: 1.3;
        }
        .tmValB {
          font-size: 14px; color: rgba(255,255,255,0.66); text-transform: none;
          font-family: var(--font-geist-sans, sans-serif); letter-spacing: 0;
          line-height: 1.6;
        }

        .tmMeta {
          margin-top: 18px; padding: 16px 18px;
          background: rgba(255,255,255,0.024); border: 1px solid rgba(255,255,255,0.07);
          display: flex; flex-direction: column; gap: 10px;
        }
        .tmMetaRow { display: flex; justify-content: space-between; align-items: center; }
        .tmMK { font-size: 9.5px; letter-spacing: 0.1em; color: rgba(255,255,255,0.28); text-transform: uppercase; font-family: var(--font-geist-mono, monospace); }
        .tmMV { font-size: 10px;  letter-spacing: 0.08em; color: rgba(255,255,255,0.72); text-transform: uppercase; font-family: var(--font-geist-mono, monospace); }

        .tmFoot {
          display: flex; justify-content: space-between; margin-top: 16px;
          font-size: 9px; letter-spacing: 0.1em; color: rgba(255,255,255,0.18);
          font-family: var(--font-geist-mono, monospace);
        }

        /* mobile */
        .teMob { display: none; position: relative; z-index: 2; }

        .tmiTop {
          border: 1px solid rgba(255,255,255,0.14); padding: 20px 20px; margin-bottom: 24px;
        }
        .tmiTopHdr {
          display: flex; justify-content: space-between; align-items: center;
          margin-bottom: 14px; padding-bottom: 12px; border-bottom: 1px solid rgba(255,255,255,0.07);
          font-size: 10px; letter-spacing: 0.16em; color: rgba(255,255,255,0.38);
          text-transform: uppercase; font-family: var(--font-geist-mono, monospace);
        }
        .tmiTopRow {
          display: flex; justify-content: space-between; padding: 9px 0;
          font-size: 10px; letter-spacing: 0.08em; text-transform: uppercase;
          font-family: var(--font-geist-mono, monospace); border-bottom: 1px solid rgba(255,255,255,0.04);
        }
        .tmiTK { color: rgba(255,255,255,0.32); }
        .tmiTV { color: rgba(255,255,255,0.86); }

        .tmiCard {
          border: 1px solid rgba(255,255,255,0.09); padding: 20px 20px;
          margin-bottom: 12px; transition: border-color 0.2s; cursor: pointer;
        }
        .tmiCardOn { border-color: rgba(255,255,255,0.28) !important; background: rgba(255,255,255,0.02); }

        .tmiCardTop { display: flex; align-items: center; gap: 12px; margin-bottom: 14px; flex-wrap: wrap; }
        .tmiNum  { font-size: 11px;  letter-spacing: 0.1em; color: rgba(255,255,255,0.34); font-family: var(--font-geist-mono, monospace); }
        .tmiName { font-size: 13px; letter-spacing: 0.08em; color: rgba(255,255,255,0.92); text-transform: uppercase; flex: 1; font-family: var(--font-geist-mono, monospace); }

        .tmiTxt { font-size: 14px; line-height: 1.62; color: rgba(255,255,255,0.55); margin: 0 0 16px; font-family: var(--font-geist-sans, sans-serif); }

        .tmiRow2 { display: flex; flex-direction: column; gap: 6px; padding: 12px 0; border-top: 1px solid rgba(255,255,255,0.05); }
        .tmiVal2 { font-size: 13.5px; color: rgba(255,255,255,0.64); line-height: 1.55; font-family: var(--font-geist-sans, sans-serif); }

        .tmiMeter { display: flex; align-items: center; gap: 12px; margin-top: 16px; padding-top: 14px; border-top: 1px solid rgba(255,255,255,0.05); }

        /* responsive */
        @media (max-width: 1100px) {
          .te { padding: 80px 48px 88px; }
          .teGrid { grid-template-columns: 1fr 280px 1fr; gap: 24px; }
        }
        @media (max-width: 900px) {
          .te { padding: 72px 36px 80px; }
          .teGrid { grid-template-columns: 1fr 250px 1fr; gap: 18px; }
        }
        @media (max-width: 768px) {
          .te     { padding: 64px 22px 72px; height: auto; display: block; justify-content: flex-start; }
          .teGrid { display: none; }
          .teMob  { display: block; }
          .teHead { margin-bottom: 40px; }
          .teBgW1 { font-size: 72px; }
          .teBgW2 { font-size: 52px; }
          .teBgW3 { font-size: 42px; }
        }

        /* reduced motion */
        @media (prefers-reduced-motion: reduce) {
          .teScan { animation: none; }
          .tmDot  { animation: none; }
        }
      `}</style>
    </motion.div>
  );
}
