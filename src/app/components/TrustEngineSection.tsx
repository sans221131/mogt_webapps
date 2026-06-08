'use client';

import { useEffect, useLayoutEffect, useState, useCallback } from 'react';
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

      <circle cx={cx} cy={cy} r="155" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
      <circle cx={cx} cy={cy} r="147" fill="none" stroke="rgba(255,255,255,0.025)" strokeWidth="0.5" strokeDasharray="4 6" />

      <circle cx={cx} cy={cy} r="124" fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="0.5" strokeDasharray="8 7">
        {anim('16s')}
      </circle>

      <circle cx={cx} cy={cy} r="108" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
      <circle cx={cx} cy={cy} r="90"  fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" strokeDasharray="3 4" />

      <circle cx={cx} cy={cy} r="75" fill="none" stroke="rgba(255,255,255,0.09)" strokeWidth="0.5" strokeDasharray="6 5">
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

      {nodes.map(({ x, y }, i) => {
        const active = i === activeIndex;
        return (
          <g key={i}>
            <motion.line
              x1={x} y1={y} x2={cx} y2={cy}
              initial={{ stroke: 'rgba(255,255,255,0.05)', strokeWidth: 0.5 }}
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
              initial={{ r: 3, fill: 'rgba(255,255,255,0.22)' }}
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

      <text x={cx}   y="13"    textAnchor="middle" fill="rgba(255,255,255,0.1)" fontSize="7" fontFamily="monospace">N</text>
      <text x="390"  y={cy+3}  textAnchor="middle" fill="rgba(255,255,255,0.1)" fontSize="7" fontFamily="monospace">E</text>
      <text x={cx}   y="392"   textAnchor="middle" fill="rgba(255,255,255,0.1)" fontSize="7" fontFamily="monospace">S</text>
      <text x="10"   y={cy+3}  textAnchor="middle" fill="rgba(255,255,255,0.1)" fontSize="7" fontFamily="monospace">W</text>

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
      {/* background grid + faint words */}
      <div className="teBg" aria-hidden="true" />
      <span className="teBgW teBgW1" aria-hidden="true">TRUST</span>
      <span className="teBgW teBgW2" aria-hidden="true">SIGNAL</span>

      <div className="teInner">

        {/* ── header ──────────────────────────────────────────────────── */}
        <header className="teHead">
          <motion.span className="teLabel" variants={riseV}>SECTION D / TRUST ENGINE</motion.span>
          <div className="teHeadRow">
            <motion.h2 className="teH2" variants={riseV}>WHY TEAMS CHOOSE US</motion.h2>
            <motion.div className="teMeta" variants={riseV}>
              <span className="teMetaChip"><i>TRUST INDEX</i><b><Counter value={sig.strength} animate={entered} />%</b></span>
              <span className="teMetaChip"><i>BUILD RISK</i><b>LOW</b></span>
              <span className="teMetaChip"><i>STATUS</i><b>VERIFIED</b></span>
            </motion.div>
          </div>
          <motion.p className="teSub" variants={riseV}>
            Clearer decisions. Lower build risk. Interfaces that survive real users.
          </motion.p>
        </header>

        {/* ── body: signals · core · detail ───────────────────────────── */}
        <div className="teBody">

          {/* LEFT — core signals selector */}
          <motion.div className="teSignals" variants={riseLeftV}>
            <div className="teColLbl">CORE SIGNALS</div>
            <div className="teList">
              {SIGNALS.map((s, i) => {
                const active = activeIndex === i;
                const locked = lockedIndex === i;
                return (
                  <div
                    key={s.id}
                    className={`teRow${active ? ' teRowOn' : ''}${locked ? ' teRowLocked' : ''}`}
                    onMouseEnter={() => handleHover(i)}
                    onMouseLeave={handleLeave}
                    onClick={() => handleClick(i)}
                    role="button" tabIndex={0}
                    onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') handleClick(i); }}
                    aria-pressed={locked}
                    aria-label={`Signal ${s.id}: ${s.name}`}
                  >
                    {active && <span className="teScan" aria-hidden="true" />}
                    {active && <span className="teCnx" aria-hidden="true" />}
                    <div className="teRowTop">
                      <span className="teNum">{s.id}</span>
                      <span className="teName">{s.name}</span>
                      <span className={`teChip teChip-${s.status.toLowerCase()}`}>{s.status}</span>
                    </div>
                    <div className="teMeter">
                      <div className="teMeterT">
                        <motion.div
                          className="teMeterF"
                          animate={{ width: `${active ? s.strength : Math.round(s.strength * 0.22)}%` }}
                          transition={{ duration: 0.8, ease: EASE_OUT }}
                        />
                      </div>
                      <span className="teMeterN">{s.strength}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* CENTER — trust core */}
          <motion.div className="teCore" variants={scaleInV}>
            <b className="tcBr tcBrTL" aria-hidden="true" /><b className="tcBr tcBrTR" aria-hidden="true" />
            <b className="tcBr tcBrBL" aria-hidden="true" /><b className="tcBr tcBrBR" aria-hidden="true" />

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
              <span>SIGNAL {sig.id} / 06</span>
              <span>{sig.status}</span>
            </div>
          </motion.div>

          {/* RIGHT — active signal detail */}
          <motion.div className="teDetail" variants={riseRightV}>
            <div className="tmHdr">
              <span className="tmHdrTxt">ACTIVE SIGNAL</span>
              <div className="tmLive"><span className="tmDot" aria-hidden="true" /><span>LIVE</span></div>
            </div>

            <div className="tmBody">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeIndex}
                  className="tmBodyInner"
                  initial={{ opacity: 0, x: 18, filter: 'blur(6px)' }}
                  animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, x: -18, filter: 'blur(6px)' }}
                  transition={{ duration: 0.45, ease: EASE_OUT }}
                >
                  <div className="tmRow tmRowHead">
                    <span className="tmKey">SIGNAL {sig.id}</span>
                    <span className="tmVal">{sig.name}</span>
                  </div>
                  <p className="tmDesc">{sig.text}</p>
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
          </motion.div>

        </div>

      </div>{/* /teInner */}

      {/* ── styles ──────────────────────────────────────────────────────
          NOTE: `global` is required — several layout elements here are
          framer-motion components (motion.div/span/h2/p). styled-jsx only
          adds its scoping class to native host elements, so scoped rules
          silently miss every motion.* node (e.g. .teCore display:none on
          mobile, panel borders). All class names are uniquely te/tm/tc-
          prefixed, so global scope is safe here. */}
      <style jsx global>{`
        /* root */
        .te {
          position: relative;
          width: 100%;
          height: 100%;
          background:
            radial-gradient(120% 90% at 50% -10%, rgba(255,255,255,0.03), transparent 55%),
            #0a0a0a;
          color: #ededed;
          overflow: hidden;
          font-family: var(--font-geist-mono, 'Courier New', monospace);
        }

        .teInner {
          position: relative;
          z-index: 2;
          width: min(calc(100% - 40px), 1200px);
          margin-inline: auto;
          display: flex;
          flex-direction: column;
          gap: clamp(16px, 2.6vh, 30px);
          padding-top: 84px;
          padding-bottom: clamp(20px, 3vh, 38px);
          height: 100%;
          box-sizing: border-box;
        }

        /* background grid */
        .teBg {
          position: absolute; inset: 0; z-index: 0; pointer-events: none;
          background-image:
            linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px);
          background-size: 56px 56px;
          mask-image: radial-gradient(circle at 50% 40%, #000 35%, transparent 80%);
          -webkit-mask-image: radial-gradient(circle at 50% 40%, #000 35%, transparent 80%);
        }

        /* faint bg words */
        .teBgW {
          position: absolute; pointer-events: none; user-select: none; z-index: 0;
          font-weight: 900; letter-spacing: 0.22em; white-space: nowrap;
          font-family: var(--font-geist-mono, monospace);
        }
        .teBgW1 { font-size: clamp(120px, 18vw, 210px); color: rgba(255,255,255,0.011); top: 40%; left: 50%; transform: translate(-50%, -50%); }
        .teBgW2 { font-size: clamp(80px, 11vw, 130px); color: rgba(255,255,255,0.008); bottom: 4%; right: -3%; }

        /* ── header ──────────────────────────────────────────────────── */
        .teHead { position: relative; z-index: 2; flex-shrink: 0; }

        .teLabel {
          display: block; font-size: 11px; letter-spacing: 0.26em;
          color: rgba(255,255,255,0.4); text-transform: uppercase; margin-bottom: 16px;
        }

        .teHeadRow {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 24px;
          flex-wrap: wrap;
        }

        .teH2 {
          font-size: clamp(26px, 3vw, 46px); font-weight: 700;
          letter-spacing: 0.05em; text-transform: uppercase;
          margin: 0; color: rgba(255,255,255,0.97);
          font-family: var(--font-geist-mono, monospace); line-height: 1.02;
        }

        .teSub {
          font-size: clamp(13px, 1.05vw, 15px); line-height: 1.6; color: rgba(255,255,255,0.5);
          max-width: 620px; margin: 14px 0 0;
          font-family: var(--font-geist-sans, sans-serif);
        }

        .teMeta { display: flex; gap: 10px; flex-wrap: wrap; }

        .teMetaChip {
          display: inline-flex; align-items: center; gap: 8px;
          font-size: 9.5px; letter-spacing: 0.12em; color: rgba(255,255,255,0.42);
          border: 1px solid rgba(255,255,255,0.13); padding: 6px 11px;
          font-family: var(--font-geist-mono, monospace); text-transform: uppercase;
        }
        .teMetaChip i { font-style: normal; color: rgba(255,255,255,0.34); }
        .teMetaChip b { font-weight: 700; color: rgba(255,255,255,0.78); }

        /* ── body: three separated instrument panels ─────────────────── */
        .teBody {
          position: relative; z-index: 2;
          flex: 1; min-height: 0;
          display: grid;
          grid-template-columns: minmax(0, 1fr) minmax(0, 300px) minmax(0, 1fr);
          gap: clamp(12px, 1.4vw, 20px);
        }

        /* ── LEFT: signals selector ──────────────────────────────────── */
        .teSignals {
          display: flex; flex-direction: column;
          border: 1px solid rgba(255,255,255,0.1);
          padding: clamp(14px, 2vh, 20px) clamp(14px, 1.6vw, 20px);
          min-width: 0; min-height: 0;
          overflow: hidden;
        }

        .teColLbl {
          font-size: 9.5px; letter-spacing: 0.2em; color: rgba(255,255,255,0.28);
          text-transform: uppercase; margin-bottom: 12px; flex-shrink: 0;
          font-family: var(--font-geist-mono, monospace);
        }

        .teList { flex: 1; min-height: 0; display: flex; flex-direction: column; }

        .teRow {
          position: relative; flex: 1; min-height: 0;
          display: flex; flex-direction: column; justify-content: center; gap: 11px;
          padding: 10px 14px;
          border: 1px solid transparent;
          border-bottom: 1px solid rgba(255,255,255,0.06);
          cursor: pointer; overflow: hidden;
          opacity: 0.55; user-select: none; outline: none;
          transition: border-color 0.25s ease, background 0.25s ease, opacity 0.25s ease;
        }
        .teRow:last-child { border-bottom: 1px solid transparent; }
        .teRow:focus-visible { outline: 1px solid rgba(255,255,255,0.36); outline-offset: -2px; }
        .teRow:hover { opacity: 0.85; background: rgba(255,255,255,0.02); }
        .teRowOn {
          opacity: 1 !important;
          background: rgba(255,255,255,0.035) !important;
          border-color: rgba(255,255,255,0.16) !important;
        }
        .teRowOn::before {
          content: ''; position: absolute; left: 0; top: 0; bottom: 0; width: 2px;
          background: rgba(255,255,255,0.7);
        }
        .teRowLocked { border-color: rgba(255,255,255,0.4) !important; }

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
          position: absolute; top: 50%; right: 0; width: 22px; height: 1px;
          background: linear-gradient(90deg, rgba(255,255,255,0.38), transparent);
          pointer-events: none; display: none;
        }

        .teRowTop { display: flex; align-items: center; gap: 12px; }

        .teNum  { font-size: 11px; letter-spacing: 0.1em; color: rgba(255,255,255,0.34); font-family: var(--font-geist-mono, monospace); min-width: 20px; }
        .teName { font-size: 12.5px; letter-spacing: 0.07em; color: rgba(255,255,255,0.9); text-transform: uppercase; flex: 1; min-width: 0; font-family: var(--font-geist-mono, monospace); }

        .teChip {
          font-size: 8.5px; letter-spacing: 0.1em; padding: 4px 8px;
          border: 1px solid; text-transform: uppercase; white-space: nowrap;
          font-family: var(--font-geist-mono, monospace);
        }
        .teChip-verified { color: rgba(255,255,255,0.8);  border-color: rgba(255,255,255,0.28); }
        .teChip-active   { color: rgba(255,255,255,0.92); border-color: rgba(255,255,255,0.4);  }
        .teChip-stable   { color: rgba(255,255,255,0.6);  border-color: rgba(255,255,255,0.19); }
        .teChip-ready    { color: rgba(255,255,255,0.7);  border-color: rgba(255,255,255,0.24); }

        .teMeter { display: flex; align-items: center; gap: 11px; }
        .teMeterT { flex: 1; height: 3px; background: rgba(255,255,255,0.08); overflow: hidden; }
        .teMeterTFull { flex: 1; height: 3px; background: rgba(255,255,255,0.08); overflow: hidden; }
        .teMeterF { height: 100%; background: rgba(255,255,255,0.66); }
        .teMeterN { font-size: 10px; color: rgba(255,255,255,0.4); font-family: var(--font-geist-mono, monospace); min-width: 24px; text-align: right; }

        /* ── CENTER: core ────────────────────────────────────────────── */
        .teCore {
          position: relative;
          border: 1px solid rgba(255,255,255,0.1);
          padding: clamp(16px, 2.4vh, 26px) clamp(16px, 1.8vw, 24px);
          display: flex; flex-direction: column; min-width: 0; min-height: 0;
          overflow: hidden;
        }

        .tcBr { position: absolute; width: 13px; height: 13px; border-style: solid; border-color: rgba(255,255,255,0.34); display: block; }
        .tcBrTL { top: 8px;    left: 8px;   border-width: 1.5px 0 0 1.5px; }
        .tcBrTR { top: 8px;    right: 8px;  border-width: 1.5px 1.5px 0 0; }
        .tcBrBL { bottom: 8px; left: 8px;   border-width: 0 0 1.5px 1.5px; }
        .tcBrBR { bottom: 8px; right: 8px;  border-width: 0 1.5px 1.5px 0; }

        .tcVis {
          flex: 1; min-height: 0;
          display: flex; align-items: center; justify-content: center;
        }

        .tcReadout {
          width: 100%; border-top: 1px solid rgba(255,255,255,0.08);
          margin-top: 14px; padding-top: 14px; flex-shrink: 0;
        }
        .tcReadoutInner { display: flex; flex-direction: column; gap: 9px; }

        .tcRRow { display: flex; justify-content: space-between; align-items: center; }
        .tcRKey { font-size: 9.5px; letter-spacing: 0.1em; color: rgba(255,255,255,0.3); text-transform: uppercase; font-family: var(--font-geist-mono, monospace); }
        .tcRVal { font-size: 10.5px; letter-spacing: 0.08em; color: rgba(255,255,255,0.86); text-transform: uppercase; font-family: var(--font-geist-mono, monospace); }

        .tcFoot {
          width: 100%; display: flex; justify-content: space-between;
          margin-top: 14px; padding-top: 12px; border-top: 1px solid rgba(255,255,255,0.06);
          font-size: 9px; letter-spacing: 0.1em; color: rgba(255,255,255,0.24);
          text-transform: uppercase; font-family: var(--font-geist-mono, monospace);
          flex-shrink: 0;
        }

        /* ── RIGHT: active signal detail ─────────────────────────────── */
        .teDetail {
          border: 1px solid rgba(255,255,255,0.1);
          padding: clamp(16px, 2.4vh, 24px) clamp(16px, 1.8vw, 26px);
          display: flex; flex-direction: column; min-width: 0; min-height: 0;
          overflow: hidden;
        }

        .tmHdr {
          display: flex; justify-content: space-between; align-items: center;
          margin-bottom: 16px; padding-bottom: 13px;
          border-bottom: 1px solid rgba(255,255,255,0.08); flex-shrink: 0;
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

        .tmBody { flex: 1; min-height: 0; display: flex; }
        .tmBodyInner {
          flex: 1; min-height: 0;
          display: flex; flex-direction: column; justify-content: space-between;
        }

        .tmRow { display: flex; flex-direction: column; gap: 8px; }
        .tmRowHead { gap: 6px; }
        .tmDiv { height: 1px; background: rgba(255,255,255,0.06); }

        .tmKey {
          font-size: 9.5px; letter-spacing: 0.14em; color: rgba(255,255,255,0.32);
          text-transform: uppercase; font-family: var(--font-geist-mono, monospace);
        }
        .tmVal {
          font-size: clamp(16px, 1.5vw, 20px); letter-spacing: 0.05em; color: rgba(255,255,255,0.95);
          text-transform: uppercase; font-family: var(--font-geist-mono, monospace);
          line-height: 1.2;
        }
        .tmDesc {
          margin: 0; font-size: clamp(13px, 1vw, 14.5px); color: rgba(255,255,255,0.6);
          font-family: var(--font-geist-sans, sans-serif); line-height: 1.62;
        }
        .tmValB {
          font-size: clamp(13px, 1vw, 14.5px); color: rgba(255,255,255,0.66); text-transform: none;
          font-family: var(--font-geist-sans, sans-serif); letter-spacing: 0;
          line-height: 1.55;
        }

        /* ── Responsive ──────────────────────────────────────────────── */

        /* Tablet: narrow the core column */
        @media (max-width: 1080px) {
          .teBody { grid-template-columns: minmax(0, 1fr) minmax(0, 260px) minmax(0, 1fr); }
        }

        /* Stacked: drop the radial core, show detail then the selector list.
           As the panel scrubs, the detail panel updates live and stays in view;
           the list below mirrors / re-selects the active signal. */
        @media (max-width: 920px) {
          .te { height: auto; }
          .teInner {
            width: min(calc(100% - 32px), 1200px);
            height: auto;
            padding-top: 72px;
            padding-bottom: 40px;
            gap: 18px;
          }
          .teBgW { display: none; }

          .teHeadRow { align-items: flex-start; flex-direction: column; gap: 14px; }

          .teBody {
            display: flex;
            flex-direction: column;
          }
          .teCore { display: none !important; }

          .teDetail { order: 1; }
          .tmBodyInner { gap: 14px; }
          .tmBodyInner .tmRow { gap: 6px; }

          .teSignals { order: 2; }
          /* Natural-height rows on mobile (no flex:1 fight without a fixed parent) */
          .teList { flex: none; }
          .teRow {
            flex: none;
            min-height: 0;
            padding: 14px;
            gap: 10px;
          }
          .teScan { display: none; }
        }

        @media (max-width: 560px) {
          .teName { font-size: 12px; }
          .teMetaChip { font-size: 9px; padding: 5px 9px; gap: 6px; }
          .tmHdr { margin-bottom: 12px; padding-bottom: 11px; }
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
