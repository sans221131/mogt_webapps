'use client';

import { useEffect, useLayoutEffect, useRef, useState, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

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

  // 6 node positions, evenly spaced on r=138
  const nodes = SIGNALS.map((_, i) => {
    const angle = (i / SIGNALS.length) * 2 * Math.PI - Math.PI / 2;
    return { x: cx + 138 * Math.cos(angle), y: cy + 138 * Math.sin(angle) };
  });

  // 36 tick marks on r=155
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

      {/* ambient glow */}
      <circle cx={cx} cy={cy} r="185" fill="url(#tcGlow)" />

      {/* static outer rings */}
      <circle cx={cx} cy={cy} r="170" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
      <circle cx={cx} cy={cy} r="155" fill="none" stroke="rgba(255,255,255,0.09)" strokeWidth="1" />
      <circle cx={cx} cy={cy} r="147" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="0.5" strokeDasharray="4 6" />

      {/* rotating ring 1 */}
      <circle cx={cx} cy={cy} r="124" fill="none" stroke="rgba(255,255,255,0.11)" strokeWidth="0.5" strokeDasharray="8 7">
        {anim('16s')}
      </circle>

      {/* mid ring */}
      <circle cx={cx} cy={cy} r="108" fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="1" />
      <circle cx={cx} cy={cy} r="90"  fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" strokeDasharray="3 4" />

      {/* rotating ring 2 (counter) */}
      <circle cx={cx} cy={cy} r="75" fill="none" stroke="rgba(255,255,255,0.13)" strokeWidth="0.5" strokeDasharray="6 5">
        {anim('22s', -1)}
      </circle>

      {/* cross-hairs */}
      <line x1={cx} y1="20" x2={cx} y2="380" stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" />
      <line x1="20" y1={cy} x2="380" y2={cy} stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" />
      <line x1="68" y1="68" x2="332" y2="332" stroke="rgba(255,255,255,0.02)" strokeWidth="0.5" />
      <line x1="332" y1="68" x2="68" y2="332" stroke="rgba(255,255,255,0.02)" strokeWidth="0.5" />

      {/* radar sweep */}
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
          {/* sweep trail — static arc approximation */}
          <path
            d={`M${cx},${cy} L${cx},${cy - 155} A155,155 0 0,0 ${cx + 155 * Math.sin(0.35)},${cy - 155 * Math.cos(0.35)} Z`}
            fill="rgba(255,255,255,0.04)"
          />
        </g>
      </g>

      {/* tick marks */}
      {ticks.map((t, i) => (
        <line key={i} x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2}
          stroke="rgba(255,255,255,0.2)" strokeWidth={t.sw} />
      ))}

      {/* signal nodes + connectors */}
      {nodes.map(({ x, y }, i) => {
        const active = i === activeIndex;
        return (
          <g key={i}>
            <line x1={x} y1={y} x2={cx} y2={cy}
              stroke={active ? 'rgba(255,255,255,0.22)' : 'rgba(255,255,255,0.05)'}
              strokeWidth={active ? 1 : 0.5}
              strokeDasharray={active ? undefined : '3 4'} />
            {active && <circle cx={x} cy={y} r="9" fill="none" stroke="rgba(255,255,255,0.22)" strokeWidth="1" />}
            <circle cx={x} cy={y} r={active ? 5 : 3}
              fill={active ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.22)'} />
          </g>
        );
      })}

      {/* inner disc */}
      <circle cx={cx} cy={cy} r="56" fill="rgba(10,10,10,0.88)" stroke="rgba(255,255,255,0.18)" strokeWidth="1" />
      <circle cx={cx} cy={cy} r="50" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" />

      {/* center text */}
      <text x={cx} y={cy - 13} textAnchor="middle" fill="rgba(255,255,255,0.28)" fontSize="6.5" fontFamily="monospace" letterSpacing="0.14em">TRUST ENGINE</text>
      <text x={cx} y={cy + 7}  textAnchor="middle" fill="rgba(255,255,255,0.94)" fontSize="20"  fontFamily="monospace" fontWeight="700" letterSpacing="0.03em">{sig.strength}%</text>
      <text x={cx} y={cy + 21} textAnchor="middle" fill="rgba(255,255,255,0.32)" fontSize="6.5" fontFamily="monospace" letterSpacing="0.12em">SIG {sig.id}</text>

      {/* cardinals */}
      <text x={cx}   y="13"    textAnchor="middle" fill="rgba(255,255,255,0.16)" fontSize="7" fontFamily="monospace">N</text>
      <text x="390"  y={cy+3}  textAnchor="middle" fill="rgba(255,255,255,0.16)" fontSize="7" fontFamily="monospace">E</text>
      <text x={cx}   y="392"   textAnchor="middle" fill="rgba(255,255,255,0.16)" fontSize="7" fontFamily="monospace">S</text>
      <text x="10"   y={cy+3}  textAnchor="middle" fill="rgba(255,255,255,0.16)" fontSize="7" fontFamily="monospace">W</text>

      {/* corner coords */}
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
  const [reducedMotion, setReducedMotion] = useState(false);

  const sectionRef   = useRef<HTMLDivElement>(null);
  const rowRefs      = useRef<(HTMLDivElement | null)[]>([]);
  const coreRef      = useRef<HTMLDivElement>(null);
  const matrixRef    = useRef<HTMLDivElement>(null);
  const mobileRefs   = useRef<(HTMLDivElement | null)[]>([]);

  const sig = SIGNALS[activeIndex];

  // client-only boot
  useIsoEffect(() => {
    setIsMounted(true);
    setReducedMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }, []);

  // scroll-driven signal: CoinScene dispatches 'trustSignal' with detail = 0-5
  useIsoEffect(() => {
    if (!isMounted) return;
    const handler = (e: Event) => {
      const idx = (e as CustomEvent<number>).detail;
      if (lockedIndex === null) setActiveIndex(idx);
    };
    window.addEventListener('trustSignal', handler);
    return () => window.removeEventListener('trustSignal', handler);
  }, [isMounted, lockedIndex]);

  // scroll reveal
  useIsoEffect(() => {
    if (!isMounted || reducedMotion) return;
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const st = { trigger: sectionRef.current, start: 'top 76%', once: true };

      gsap.fromTo(rowRefs.current.filter(Boolean), { opacity: 0, x: -14, filter: 'blur(3px)' }, {
        opacity: 1, x: 0, filter: 'blur(0px)', duration: 0.45, stagger: 0.07,
        ease: 'power2.out', scrollTrigger: st,
      });

      if (coreRef.current) {
        gsap.fromTo(coreRef.current, { opacity: 0, scale: 0.96 }, {
          opacity: 1, scale: 1, duration: 0.55, delay: 0.15,
          ease: 'power2.out', scrollTrigger: st,
        });
      }

      if (matrixRef.current) {
        gsap.fromTo(matrixRef.current, { opacity: 0, x: 14, filter: 'blur(3px)' }, {
          opacity: 1, x: 0, filter: 'blur(0px)', duration: 0.5, delay: 0.25,
          ease: 'power2.out', scrollTrigger: st,
        });
      }

      gsap.fromTo(mobileRefs.current.filter(Boolean), { opacity: 0, y: 10, filter: 'blur(2px)' }, {
        opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.38, stagger: 0.09,
        ease: 'power2.out', scrollTrigger: st,
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [isMounted, reducedMotion]);

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

  return (
    <div ref={sectionRef} className="te">
      {/* background grid */}
      <div className="teBg" aria-hidden="true" />
      {/* faint bg words */}
      <span className="teBgW teBgW1" aria-hidden="true">TRUST</span>
      <span className="teBgW teBgW2" aria-hidden="true">SIGNAL</span>
      <span className="teBgW teBgW3" aria-hidden="true">MATRIX</span>

      {/* ── header ──────────────────────────────────────────────────── */}
      <header className="teHead">
        <span className="teLabel">SECTION D / TRUST ENGINE</span>
        <h2 className="teH2">WHY TEAMS CHOOSE US</h2>
        <p className="teSub">
          We turn messy product ideas into clear, scalable systems built for users,
          developers, and business outcomes.
        </p>
        <div className="teMeta">
          <span className="teMetaChip">TRUST INDEX: {sig.strength}%</span>
          <span className="teMetaChip">BUILD RISK: LOW</span>
          <span className="teMetaChip">STATUS: VERIFIED</span>
          <span className="teMetaChip">MODE: RISK REDUCTION</span>
        </div>
      </header>

      {/* ── desktop 3-col ───────────────────────────────────────────── */}
      <div className="teGrid">

        {/* LEFT */}
        <div className="teLeft">
          <div className="teColLbl">CORE SIGNALS</div>
          {SIGNALS.map((s, i) => {
            const active = activeIndex === i;
            const locked = lockedIndex === i;
            return (
              <div
                key={s.id}
                ref={el => { rowRefs.current[i] = el; }}
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
                {active && <span className="teCnx"  aria-hidden="true" />}

                <div className="teRowTop">
                  <span className="teNum">{s.id}</span>
                  <span className="teName">{s.name}</span>
                  <span className={`teChip teChip-${s.status.toLowerCase()}`}>{s.status}</span>
                </div>

                {active && <p className="teRowTxt">{s.text}</p>}

                <div className="teMeter">
                  <div className="teMeterT">
                    <div className="teMeterF" style={{ width: `${active ? s.strength : Math.round(s.strength * 0.2)}%` }} />
                  </div>
                  <span className="teMeterN">{s.strength}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* CENTER */}
        <div ref={coreRef} className="teCenter">
          <b className="tcBr tcBrTL" aria-hidden="true" /><b className="tcBr tcBrTR" aria-hidden="true" />
          <b className="tcBr tcBrBL" aria-hidden="true" /><b className="tcBr tcBrBR" aria-hidden="true" />

          <div className="tcHdr">DECISION ENGINE</div>

          <div className="tcVis">
            {isMounted && <TrustCoreSVG activeIndex={activeIndex} reducedMotion={reducedMotion} />}
          </div>

          <div className="tcReadout">
            {sig.coreReadout.map((r, i) => (
              <div key={i} className="tcRRow">
                <span className="tcRKey">{r.label}</span>
                <span className="tcRVal">{r.value}</span>
              </div>
            ))}
          </div>

          <div className="tcFoot">
            <span>MODE: RISK REDUCTION</span>
            <span>SIG: {sig.id}/06</span>
          </div>
        </div>

        {/* RIGHT */}
        <div ref={matrixRef} className="teRight">
          <div className="tmHdr">
            <span className="tmHdrTxt">RISK REDUCTION MATRIX</span>
            <div className="tmLive"><span className="tmDot" aria-hidden="true" /><span>LIVE</span></div>
          </div>

          <div className="tmBody">
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
        </div>

      </div>

      {/* ── mobile stacked ──────────────────────────────────────────── */}
      <div className="teMob">
        {/* compact trust index panel */}
        <div className="tmiTop">
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
        </div>

        {SIGNALS.map((s, i) => (
          <div
            key={s.id}
            ref={el => { mobileRefs.current[i] = el; }}
            className={`tmiCard${activeIndex === i ? ' tmiCardOn' : ''}`}
            onClick={() => setActiveIndex(activeIndex === i ? 0 : i)}
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
                <div className="teMeterF" style={{ width: `${s.strength}%` }} />
              </div>
              <span className="teMeterN">{s.strength}</span>
            </div>
          </div>
        ))}
      </div>

      {/* ── styles ──────────────────────────────────────────────────── */}
      <style jsx>{`
        /* root */
        .te {
          position: relative;
          width: 100%;
          background: #0a0a0a;
          color: #ededed;
          padding: 52px 44px 64px;
          overflow: hidden;
          font-family: var(--font-geist-mono, 'Courier New', monospace);
        }

        /* background grid */
        .teBg {
          position: absolute; inset: 0; z-index: 0; pointer-events: none;
          background-image:
            linear-gradient(rgba(255,255,255,0.022) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.022) 1px, transparent 1px);
          background-size: 44px 44px;
        }

        /* faint bg words */
        .teBgW {
          position: absolute; pointer-events: none; user-select: none; z-index: 0;
          font-weight: 900; letter-spacing: 0.22em; white-space: nowrap;
          font-family: var(--font-geist-mono, monospace);
        }
        .teBgW1 { font-size: 220px; color: rgba(255,255,255,0.017); top: 28%; left: 50%; transform: translate(-50%, -50%); }
        .teBgW2 { font-size: 130px; color: rgba(255,255,255,0.012); bottom: 8%;  right: -4%; }
        .teBgW3 { font-size: 100px; color: rgba(255,255,255,0.009); top: 5%;     left: -2%; }

        /* header */
        .teHead { position: relative; z-index: 2; margin-bottom: 36px; }

        .teLabel {
          display: block; font-size: 9px; letter-spacing: 0.2em;
          color: rgba(255,255,255,0.38); text-transform: uppercase; margin-bottom: 14px;
        }

        .teH2 {
          font-size: clamp(20px, 2.4vw, 36px); font-weight: 700;
          letter-spacing: 0.07em; text-transform: uppercase;
          margin: 0 0 12px; color: rgba(255,255,255,0.96);
          font-family: var(--font-geist-mono, monospace); line-height: 1.05;
        }

        .teSub {
          font-size: 12px; line-height: 1.62; color: rgba(255,255,255,0.47);
          max-width: 460px; margin: 0 0 16px;
          font-family: var(--font-geist-sans, sans-serif);
        }

        .teMeta { display: flex; gap: 8px; flex-wrap: wrap; }

        .teMetaChip {
          font-size: 7.5px; letter-spacing: 0.11em; color: rgba(255,255,255,0.4);
          border: 1px solid rgba(255,255,255,0.12); padding: 3px 8px;
          font-family: var(--font-geist-mono, monospace); text-transform: uppercase;
        }

        /* 3-col grid */
        .teGrid {
          position: relative; z-index: 2;
          display: grid; grid-template-columns: 1fr 246px 1fr;
          gap: 16px; align-items: start;
        }

        .teColLbl {
          font-size: 7.5px; letter-spacing: 0.18em; color: rgba(255,255,255,0.24);
          text-transform: uppercase; margin-bottom: 8px;
          font-family: var(--font-geist-mono, monospace);
        }

        /* signal rows */
        .teLeft { display: flex; flex-direction: column; gap: 2px; }

        .teRow {
          position: relative; border: 1px solid rgba(255,255,255,0.09);
          padding: 9px 12px; cursor: pointer; overflow: hidden;
          opacity: 0.48; user-select: none; outline: none;
          transition: border-color 0.2s ease, background 0.2s ease, opacity 0.2s ease;
        }
        .teRow:focus-visible { outline: 1px solid rgba(255,255,255,0.36); outline-offset: 2px; }
        .teRow:hover  { border-color: rgba(255,255,255,0.24); opacity: 0.82; background: rgba(255,255,255,0.022); }
        .teRowOn      { border-color: rgba(255,255,255,0.34) !important; opacity: 1 !important; background: rgba(255,255,255,0.028) !important; }
        .teRowLocked  { border-color: rgba(255,255,255,0.52) !important; }

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

        /* connector line pointing right toward center col */
        .teCnx {
          position: absolute; top: 50%; right: 0;
          width: 26px; height: 1px;
          background: linear-gradient(90deg, rgba(255,255,255,0.38), transparent);
          pointer-events: none;
        }

        .teRowTop { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }

        .teNum  { font-size: 9px; letter-spacing: 0.1em; color: rgba(255,255,255,0.33); font-family: var(--font-geist-mono, monospace); min-width: 18px; }
        .teName { font-size: 10.5px; letter-spacing: 0.1em; color: rgba(255,255,255,0.9); text-transform: uppercase; flex: 1; font-family: var(--font-geist-mono, monospace); }

        /* status chips */
        .teChip {
          font-size: 7.5px; letter-spacing: 0.1em; padding: 2px 7px;
          border: 1px solid; text-transform: uppercase; white-space: nowrap;
          font-family: var(--font-geist-mono, monospace);
        }
        .teChip-verified { color: rgba(255,255,255,0.8);  border-color: rgba(255,255,255,0.28); }
        .teChip-active   { color: rgba(255,255,255,0.92); border-color: rgba(255,255,255,0.4);  }
        .teChip-stable   { color: rgba(255,255,255,0.6);  border-color: rgba(255,255,255,0.19); }
        .teChip-ready    { color: rgba(255,255,255,0.7);  border-color: rgba(255,255,255,0.24); }

        .teRowTxt {
          font-size: 10.5px; line-height: 1.55; color: rgba(255,255,255,0.5);
          margin: 7px 0 6px; font-family: var(--font-geist-sans, sans-serif);
        }

        .teMeter { display: flex; align-items: center; gap: 8px; margin-top: 8px; }
        .teMeterT { flex: 1; height: 2px; background: rgba(255,255,255,0.08); overflow: hidden; }
        .teMeterTFull { flex: 1; height: 2px; background: rgba(255,255,255,0.08); overflow: hidden; }
        .teMeterF { height: 100%; background: rgba(255,255,255,0.62); transition: width 0.55s cubic-bezier(0.4,0,0.2,1); }
        .teMeterN { font-size: 8px; color: rgba(255,255,255,0.35); font-family: var(--font-geist-mono, monospace); min-width: 22px; text-align: right; }

        /* center col */
        .teCenter {
          position: relative; border: 1px solid rgba(255,255,255,0.12);
          padding: 12px 10px 10px;
          display: flex; flex-direction: column; align-items: center;
        }

        /* corner brackets */
        .tcBr { position: absolute; width: 11px; height: 11px; border-style: solid; border-color: rgba(255,255,255,0.34); display: block; }
        .tcBrTL { top: -1px;    left: -1px;  border-width: 1.5px 0 0 1.5px; }
        .tcBrTR { top: -1px;    right: -1px; border-width: 1.5px 1.5px 0 0; }
        .tcBrBL { bottom: -1px; left: -1px;  border-width: 0 0 1.5px 1.5px; }
        .tcBrBR { bottom: -1px; right: -1px; border-width: 0 1.5px 1.5px 0; }

        .tcHdr {
          font-size: 7.5px; letter-spacing: 0.2em; color: rgba(255,255,255,0.26);
          text-transform: uppercase; font-family: var(--font-geist-mono, monospace);
          margin-bottom: 6px;
        }

        .tcVis { width: 100%; aspect-ratio: 1; }

        .tcReadout {
          width: 100%; border-top: 1px solid rgba(255,255,255,0.08);
          margin-top: 8px; padding-top: 8px;
          display: flex; flex-direction: column; gap: 5px;
        }

        .tcRRow { display: flex; justify-content: space-between; align-items: center; }
        .tcRKey { font-size: 7.5px; letter-spacing: 0.1em; color: rgba(255,255,255,0.28); text-transform: uppercase; font-family: var(--font-geist-mono, monospace); }
        .tcRVal { font-size: 8.5px; letter-spacing: 0.08em; color: rgba(255,255,255,0.85); text-transform: uppercase; font-family: var(--font-geist-mono, monospace); }

        .tcFoot {
          width: 100%; display: flex; justify-content: space-between;
          margin-top: 10px; padding-top: 8px; border-top: 1px solid rgba(255,255,255,0.06);
          font-size: 7px; letter-spacing: 0.1em; color: rgba(255,255,255,0.18);
          text-transform: uppercase; font-family: var(--font-geist-mono, monospace);
        }

        /* right matrix */
        .teRight {
          border: 1px solid rgba(255,255,255,0.12); padding: 14px 16px;
          display: flex; flex-direction: column;
        }

        .tmHdr {
          display: flex; justify-content: space-between; align-items: center;
          margin-bottom: 12px; padding-bottom: 8px;
          border-bottom: 1px solid rgba(255,255,255,0.07);
        }
        .tmHdrTxt {
          font-size: 8.5px; letter-spacing: 0.16em; color: rgba(255,255,255,0.43);
          text-transform: uppercase; font-family: var(--font-geist-mono, monospace);
        }
        .tmLive {
          display: flex; align-items: center; gap: 6px;
          font-size: 7.5px; letter-spacing: 0.1em; color: rgba(255,255,255,0.36);
          font-family: var(--font-geist-mono, monospace);
        }

        .tmDot {
          display: inline-block; width: 5px; height: 5px; border-radius: 50%;
          background: rgba(255,255,255,0.52); animation: tmBlink 2s ease-in-out infinite;
        }
        @keyframes tmBlink { 0%, 100% { opacity: 1; } 50% { opacity: 0.15; } }

        .tmBody { display: flex; flex-direction: column; flex: 1; }

        .tmRow { display: flex; flex-direction: column; gap: 5px; padding: 9px 0; }
        .tmDiv { height: 1px; background: rgba(255,255,255,0.06); }

        .tmKey {
          font-size: 7.5px; letter-spacing: 0.14em; color: rgba(255,255,255,0.3);
          text-transform: uppercase; font-family: var(--font-geist-mono, monospace);
        }
        .tmVal {
          font-size: 11px; letter-spacing: 0.07em; color: rgba(255,255,255,0.9);
          text-transform: uppercase; font-family: var(--font-geist-mono, monospace);
          line-height: 1.3; transition: all 0.22s ease;
        }
        .tmValB {
          font-size: 12px; color: rgba(255,255,255,0.63); text-transform: none;
          font-family: var(--font-geist-sans, sans-serif); letter-spacing: 0;
          line-height: 1.55; transition: all 0.22s ease;
        }

        .tmMeta {
          margin-top: 12px; padding: 9px 12px;
          background: rgba(255,255,255,0.024); border: 1px solid rgba(255,255,255,0.07);
          display: flex; flex-direction: column; gap: 6px;
        }
        .tmMetaRow { display: flex; justify-content: space-between; align-items: center; }
        .tmMK { font-size: 7.5px; letter-spacing: 0.1em; color: rgba(255,255,255,0.26); text-transform: uppercase; font-family: var(--font-geist-mono, monospace); }
        .tmMV { font-size: 8px;   letter-spacing: 0.08em; color: rgba(255,255,255,0.7);  text-transform: uppercase; font-family: var(--font-geist-mono, monospace); }

        .tmFoot {
          display: flex; justify-content: space-between; margin-top: 10px;
          font-size: 7px; letter-spacing: 0.1em; color: rgba(255,255,255,0.17);
          font-family: var(--font-geist-mono, monospace);
        }

        /* mobile */
        .teMob { display: none; position: relative; z-index: 2; }

        .tmiTop {
          border: 1px solid rgba(255,255,255,0.14); padding: 14px 16px; margin-bottom: 18px;
        }
        .tmiTopHdr {
          display: flex; justify-content: space-between; align-items: center;
          margin-bottom: 10px; padding-bottom: 8px; border-bottom: 1px solid rgba(255,255,255,0.07);
          font-size: 8.5px; letter-spacing: 0.16em; color: rgba(255,255,255,0.36);
          text-transform: uppercase; font-family: var(--font-geist-mono, monospace);
        }
        .tmiTopRow {
          display: flex; justify-content: space-between; padding: 5px 0;
          font-size: 8.5px; letter-spacing: 0.08em; text-transform: uppercase;
          font-family: var(--font-geist-mono, monospace); border-bottom: 1px solid rgba(255,255,255,0.04);
        }
        .tmiTK { color: rgba(255,255,255,0.3); }
        .tmiTV { color: rgba(255,255,255,0.85); }

        .tmiCard {
          border: 1px solid rgba(255,255,255,0.09); padding: 14px 15px;
          margin-bottom: 6px; transition: border-color 0.2s; cursor: pointer;
        }
        .tmiCardOn { border-color: rgba(255,255,255,0.28) !important; background: rgba(255,255,255,0.02); }

        .tmiCardTop { display: flex; align-items: center; gap: 10px; margin-bottom: 10px; flex-wrap: wrap; }
        .tmiNum  { font-size: 9px;   letter-spacing: 0.1em; color: rgba(255,255,255,0.33); font-family: var(--font-geist-mono, monospace); }
        .tmiName { font-size: 10.5px; letter-spacing: 0.09em; color: rgba(255,255,255,0.9); text-transform: uppercase; flex: 1; font-family: var(--font-geist-mono, monospace); }

        .tmiTxt { font-size: 12px; line-height: 1.55; color: rgba(255,255,255,0.5); margin: 0 0 12px; font-family: var(--font-geist-sans, sans-serif); }

        .tmiRow2 { display: flex; flex-direction: column; gap: 4px; padding: 8px 0; border-top: 1px solid rgba(255,255,255,0.05); }
        .tmiVal2 { font-size: 11.5px; color: rgba(255,255,255,0.6); line-height: 1.48; font-family: var(--font-geist-sans, sans-serif); }

        .tmiMeter { display: flex; align-items: center; gap: 8px; margin-top: 12px; padding-top: 10px; border-top: 1px solid rgba(255,255,255,0.05); }

        /* responsive */
        @media (max-width: 1100px) {
          .teGrid { grid-template-columns: 1fr 224px 1fr; gap: 14px; }
        }
        @media (max-width: 900px) {
          .te { padding: 44px 28px 56px; }
          .teGrid { grid-template-columns: 1fr 204px 1fr; gap: 10px; }
        }
        @media (max-width: 768px) {
          .te     { padding: 44px 18px 56px; }
          .teGrid { display: none; }
          .teMob  { display: block; }
          .teBgW1 { font-size: 60px; }
          .teBgW2 { font-size: 44px; }
          .teBgW3 { font-size: 36px; }
        }

        /* reduced motion */
        @media (prefers-reduced-motion: reduce) {
          .teScan { animation: none; }
          .tmDot  { animation: none; }
        }
      `}</style>
    </div>
  );
}
