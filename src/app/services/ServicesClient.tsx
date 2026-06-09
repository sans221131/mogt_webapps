'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import {
  AnimatePresence,
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  animate as fmAnimate,
  type Variants,
} from 'framer-motion';
import { INDUSTRIES, type Industry, type Solution } from '../../../public/megaMenuData';
import { getSolutionPreview, type Complexity } from '../components/servicesMeta';
import SiteHeader from '../components/SiteHeader';
import { useProjectIntake } from '../components/project-intake/ProjectIntakeProvider';

const EASE_OUT = [0.22, 1, 0.36, 1] as const;
const CONTACT_EMAIL = 'hello@mogt.studio';
const CONTACT_HREF = `mailto:${CONTACT_EMAIL}?subject=Project%20Inquiry%20%E2%80%94%20MOGT`;

const TOTAL_SOLUTIONS = INDUSTRIES.reduce((sum, i) => sum + i.solutions.length, 0);
const AVG_PER_SECTOR = Math.round(TOTAL_SOLUTIONS / INDUSTRIES.length);

type SolutionWithIndustry = { solution: Solution; industry: Industry; index: number };

// ── Count-up number for the metrics strip ──────────────────────────────────
function CountUp({ to, suffix = '', duration = 1.1 }: { to: number; suffix?: string; duration?: number }) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  const prefersReduced = useReducedMotion();
  const mv = useMotionValue(0);
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    if (prefersReduced) { setDisplay(to); return; }
    const controls = fmAnimate(mv, to, {
      duration,
      ease: EASE_OUT,
      onUpdate: (v) => setDisplay(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, to, duration, prefersReduced, mv]);

  return <span ref={ref}>{display}{suffix}</span>;
}

const gridStagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.04, delayChildren: 0.05 } },
};
const cardV: Variants = {
  hidden: { opacity: 0, y: 14, filter: 'blur(4px)' },
  show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.5, ease: EASE_OUT } },
};

export default function ServicesClient() {
  const { openIntake } = useProjectIntake();
  const prefersReduced = useReducedMotion();

  const [activeId, setActiveId] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const contentTopRef = useRef<HTMLDivElement | null>(null);

  // Deep-link support: /services?industry=fintech opens that sector directly.
  // Read from the URL on mount so the overview still renders in static HTML.
  useEffect(() => {
    const param = new URLSearchParams(window.location.search).get('industry');
    if (param && INDUSTRIES.some((i) => i.id === param)) {
      setActiveId(param);
    }
  }, []);

  const activeIndustry = activeId ? INDUSTRIES.find((i) => i.id === activeId) ?? null : null;
  const isSearching = query.trim().length > 0;
  const q = query.trim().toLowerCase();

  // Flat, filtered solution list for the grid views.
  const results: SolutionWithIndustry[] = useMemo(() => {
    const scope = activeIndustry ? [activeIndustry] : INDUSTRIES;
    const out: SolutionWithIndustry[] = [];
    scope.forEach((industry) => {
      industry.solutions.forEach((solution, index) => {
        if (
          !q ||
          solution.title.toLowerCase().includes(q) ||
          solution.description.toLowerCase().includes(q) ||
          industry.name.toLowerCase().includes(q)
        ) {
          out.push({ solution, industry, index });
        }
      });
    });
    return out;
  }, [activeIndustry, q]);

  const showOverview = !activeIndustry && !isSearching;

  const selectIndustry = (id: string | null) => {
    setActiveId(id);
    // Keep URL shareable without triggering a route navigation / scroll reset.
    if (typeof window !== 'undefined') {
      const url = id ? `/services?industry=${id}` : '/services';
      window.history.replaceState(null, '', url);
    }
    requestAnimationFrame(() => {
      contentTopRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  };

  return (
    <div className="svc">
      <div className="svcBg" aria-hidden="true" />
      <div className="svcScan" aria-hidden="true" />

      {/* ── Nav ── */}
      <SiteHeader />

      {/* ── Hero ── */}
      <section className="svcHero">
        <div className="svcHeroFrame" aria-hidden="true">
          <i className="svcCorner tl" /><i className="svcCorner tr" />
          <i className="svcCorner bl" /><i className="svcCorner br" />
        </div>

        <motion.div
          className="svcHeroInner"
          initial={prefersReduced ? false : 'hidden'}
          animate="show"
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } } }}
        >
          <motion.span className="svcEyebrow" variants={cardV}>
            <span className="svcDot" /> SOLUTIONS ARCHIVE / FULL INDEX
          </motion.span>

          <motion.h1 className="svcTitle" variants={cardV}>
            Everything we<br />engineer, indexed.
          </motion.h1>

          <motion.p className="svcLede" variants={cardV}>
            {INDUSTRIES.length} industries. {TOTAL_SOLUTIONS} production-grade solutions. One
            studio that designs the system before writing the code — then ships it.
          </motion.p>

          <motion.dl className="svcMetrics" variants={cardV}>
            <div className="svcMetric">
              <dt><CountUp to={INDUSTRIES.length} /></dt>
              <dd>Industries</dd>
            </div>
            <div className="svcMetric">
              <dt><CountUp to={TOTAL_SOLUTIONS} /></dt>
              <dd>Solutions</dd>
            </div>
            <div className="svcMetric">
              <dt><CountUp to={AVG_PER_SECTOR} /></dt>
              <dd>Avg / Sector</dd>
            </div>
            <div className="svcMetric">
              <dt><CountUp to={100} suffix="%" /></dt>
              <dd>Custom-built</dd>
            </div>
          </motion.dl>
        </motion.div>
      </section>

      {/* ── Sticky control bar ── */}
      <div className="svcControls" ref={contentTopRef}>
        <div className="svcControlsInner">
          <div className="svcSearch">
            <svg className="svcSearchIcon" viewBox="0 0 16 16" aria-hidden="true">
              <circle cx="7" cy="7" r="5" fill="none" stroke="currentColor" strokeWidth="1.4" />
              <path d="M11 11 14.5 14.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
            </svg>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={activeIndustry ? `Search ${activeIndustry.name}…` : 'Search all solutions…'}
              aria-label="Search solutions"
            />
            {query && (
              <button type="button" className="svcSearchClear" onClick={() => setQuery('')} aria-label="Clear search">×</button>
            )}
          </div>

          <div className="svcChips" role="tablist" aria-label="Filter by industry">
            <button
              type="button"
              role="tab"
              aria-selected={!activeIndustry}
              className={`svcChip${!activeIndustry ? ' isActive' : ''}`}
              onClick={() => selectIndustry(null)}
            >
              All <b>{INDUSTRIES.length}</b>
            </button>
            {INDUSTRIES.map((industry) => (
              <button
                key={industry.id}
                type="button"
                role="tab"
                aria-selected={activeId === industry.id}
                className={`svcChip${activeId === industry.id ? ' isActive' : ''}`}
                onClick={() => selectIndustry(industry.id)}
              >
                {industry.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Content ── */}
      <main className="svcMain">
        <AnimatePresence mode="wait">
          {showOverview ? (
            // ===== OVERVIEW: all industries =====
            <motion.section
              key="overview"
              className="svcOverview"
              initial={prefersReduced ? false : 'hidden'}
              animate="show"
              exit={{ opacity: 0, y: -8, transition: { duration: 0.18 } }}
              variants={gridStagger}
            >
              <div className="svcSectionHead">
                <span className="svcSectionKicker">INDEX / 10 SECTORS</span>
                <h2 className="svcSectionTitle">Browse by industry</h2>
                <p className="svcSectionDesc">Select a sector to open its full solution set, or search across the entire archive.</p>
              </div>

              <div className="svcIndGrid">
                {INDUSTRIES.map((industry, i) => (
                  <motion.button
                    type="button"
                    key={industry.id}
                    className="svcIndCard"
                    variants={cardV}
                    onClick={() => selectIndustry(industry.id)}
                  >
                    <span className="svcIndTopBorder" aria-hidden="true" />
                    <div className="svcIndCardHead">
                      <span className="svcIndNum">{String(i + 1).padStart(2, '0')}</span>
                      <span className="svcIndCount">{industry.solutions.length} SOLUTIONS</span>
                    </div>
                    <h3 className="svcIndName">{industry.name}</h3>
                    <p className="svcIndDesc">{industry.description}</p>
                    <div className="svcIndSamples">
                      {industry.solutions.slice(0, 3).map((s) => (
                        <span key={s.href} className="svcIndSample">{s.title}</span>
                      ))}
                      <span className="svcIndSampleMore">+{industry.solutions.length - 3} more</span>
                    </div>
                    <span className="svcIndOpen">
                      Open sector
                      <svg viewBox="0 0 14 10" aria-hidden="true">
                        <path d="M1 5h11M8 1.5 12.5 5 8 8.5" fill="none" stroke="currentColor" strokeWidth="1.3" />
                      </svg>
                    </span>
                  </motion.button>
                ))}
              </div>
            </motion.section>
          ) : (
            // ===== SOLUTION GRID: single industry OR search results =====
            <motion.section
              key={`grid-${activeId ?? 'all'}-${isSearching ? 'q' : 'n'}`}
              className="svcGridSection"
              initial={prefersReduced ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3, ease: EASE_OUT }}
            >
              <div className="svcSectionHead">
                {activeIndustry ? (
                  <>
                    <span className="svcSectionKicker">SECTOR / {activeIndustry.name.toUpperCase()}</span>
                    <h2 className="svcSectionTitle">{activeIndustry.name}</h2>
                    <p className="svcSectionDesc">{activeIndustry.description}</p>
                  </>
                ) : (
                  <>
                    <span className="svcSectionKicker">SEARCH / ALL SECTORS</span>
                    <h2 className="svcSectionTitle">Search results</h2>
                    <p className="svcSectionDesc">Matching “{query.trim()}” across the full archive.</p>
                  </>
                )}
                <span className="svcResultCount">{String(results.length).padStart(2, '0')} {results.length === 1 ? 'RESULT' : 'RESULTS'}</span>
              </div>

              {results.length === 0 ? (
                <div className="svcEmpty">
                  <span className="svcEmptyMark">∅</span>
                  <p>No solutions match “{query.trim()}”.</p>
                  <button type="button" className="svcEmptyReset" onClick={() => setQuery('')}>Clear search</button>
                </div>
              ) : (
                <div className="svcSolGrid">
                  {results.map(({ solution, industry, index }) => {
                    const meta = getSolutionPreview(solution, industry);
                    return (
                      <a key={`${industry.id}-${solution.href}`} className="svcSol" href={solution.href}>
                        <span className="svcSolTopBorder" aria-hidden="true" />
                        <div className="svcSolHead">
                          <span className="svcSolNum">{String(index + 1).padStart(2, '0')}</span>
                          <ComplexityBadge level={meta.complexity} />
                        </div>
                        <h3 className="svcSolTitle">{solution.title}</h3>
                        <p className="svcSolDesc">{solution.description}</p>
                        <div className="svcSolTags">
                          {meta.modules.slice(0, 3).map((m) => (
                            <span key={m} className="svcSolTag">{m}</span>
                          ))}
                        </div>
                        <div className="svcSolFoot">
                          {!activeIndustry && <span className="svcSolIndustry">{industry.name}</span>}
                          <span className="svcSolTimeline">{meta.timeline}</span>
                          <svg className="svcSolArrow" viewBox="0 0 14 10" aria-hidden="true">
                            <path d="M1 5h11M8 1.5 12.5 5 8 8.5" fill="none" stroke="currentColor" strokeWidth="1.3" />
                          </svg>
                        </div>
                      </a>
                    );
                  })}
                </div>
              )}
            </motion.section>
          )}
        </AnimatePresence>
      </main>

      {/* ── CTA footer ── */}
      <section className="svcCta">
        <i className="svcCorner tl" /><i className="svcCorner tr" />
        <i className="svcCorner bl" /><i className="svcCorner br" />
        <span className="svcCtaKicker">// READY WHEN YOU ARE</span>
        <h2 className="svcCtaTitle">Don’t see your exact build?</h2>
        <p className="svcCtaDesc">
          Every solution here is a starting point, not a template. Tell us what you’re building
          and we’ll scope it from first principles.
        </p>
        <div className="svcCtaActions">
          <a
            className="svcCtaPrimary"
            href={CONTACT_HREF}
            onClick={(event) => {
              event.preventDefault();
              openIntake({ intent: 'estimate', sourceButton: 'Estimate a Project' });
            }}
          >
            Estimate a Project
            <svg viewBox="0 0 14 10" aria-hidden="true">
              <path d="M1 5h11M8 1.5 12.5 5 8 8.5" fill="none" stroke="currentColor" strokeWidth="1.3" />
            </svg>
          </a>
          <a className="svcCtaSecondary" href="/">Back to home</a>
        </div>
      </section>

      <footer className="svcFooter">
        <span>MOGT — SOLUTIONS ARCHIVE</span>
        <span>{INDUSTRIES.length} SECTORS / {TOTAL_SOLUTIONS} SOLUTIONS</span>
        <span>© {new Date().getFullYear()}</span>
      </footer>

      <style jsx global>{`
        .svc {
          position: relative;
          min-height: 100vh;
          background: linear-gradient(180deg, #0a0a0a 0%, #050505 52%, #030303 100%);
          color: rgba(255, 255, 255, 0.92);
          font-family: var(--font-geist-sans, sans-serif);
          overflow-x: hidden;
        }
        .svcBg {
          position: fixed; inset: 0; z-index: 0; pointer-events: none;
          background-image:
            linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px);
          background-size: 58px 58px;
          mask-image: radial-gradient(ellipse 90% 60% at 50% 0%, #000 0%, transparent 80%);
          -webkit-mask-image: radial-gradient(ellipse 90% 60% at 50% 0%, #000 0%, transparent 80%);
        }
        .svcScan {
          position: fixed; inset: 0; z-index: 0; pointer-events: none;
          background: repeating-linear-gradient(to bottom, transparent 0, transparent 2px, rgba(255,255,255,0.012) 3px, transparent 4px);
        }
        .svc > section, .svc > main, .svc > header, .svc > footer, .svc > .svcControls { position: relative; z-index: 1; }

        /* Shared corner brackets */
        .svcCorner { position: absolute; width: 14px; height: 14px; pointer-events: none; }
        .svcCorner.tl { left: -1px; top: -1px; border-left: 1px solid rgba(255,255,255,0.5); border-top: 1px solid rgba(255,255,255,0.5); }
        .svcCorner.tr { right: -1px; top: -1px; border-right: 1px solid rgba(255,255,255,0.5); border-top: 1px solid rgba(255,255,255,0.5); }
        .svcCorner.bl { left: -1px; bottom: -1px; border-left: 1px solid rgba(255,255,255,0.32); border-bottom: 1px solid rgba(255,255,255,0.32); }
        .svcCorner.br { right: -1px; bottom: -1px; border-right: 1px solid rgba(255,255,255,0.32); border-bottom: 1px solid rgba(255,255,255,0.32); }

        /* ── Hero ── */
        .svcHero { padding: clamp(48px, 8vh, 96px) clamp(18px, 4vw, 40px) clamp(32px, 5vh, 56px); }
        .svcHeroInner { position: relative; max-width: 1180px; margin: 0 auto; }
        .svcHeroFrame { display: none; }
        .svcEyebrow {
          display: inline-flex; align-items: center; gap: 8px;
          color: rgba(255,255,255,0.5);
          font-family: var(--font-geist-mono, ui-monospace, monospace);
          font-size: 10px; font-weight: 800; letter-spacing: 0.22em; text-transform: uppercase;
        }
        .svcDot { width: 6px; height: 6px; background: rgba(255,255,255,0.85); border-radius: 50%; animation: svcPulse 2.4s ease-in-out infinite; }
        @keyframes svcPulse { 0%,100% { opacity: 1; } 50% { opacity: 0.3; } }
        .svcTitle {
          margin: 18px 0 0; max-width: 16ch;
          color: #fff;
          font-family: var(--font-geist-mono, ui-monospace, monospace);
          font-size: clamp(34px, 6vw, 72px); font-weight: 400; line-height: 1.02; letter-spacing: -0.01em;
        }
        .svcLede {
          margin: 20px 0 0; max-width: 56ch;
          color: rgba(255,255,255,0.56);
          font-size: clamp(14px, 1.6vw, 17px); line-height: 1.6;
        }
        .svcMetrics {
          display: grid; grid-template-columns: repeat(4, minmax(0,1fr)); gap: 1px;
          margin: clamp(28px, 4vh, 44px) 0 0;
          border: 1px solid rgba(255,255,255,0.1);
          background: rgba(255,255,255,0.06);
        }
        .svcMetric { padding: clamp(16px, 2.4vw, 24px); background: #070707; }
        .svcMetric dt {
          color: #fff;
          font-family: var(--font-geist-mono, ui-monospace, monospace);
          font-size: clamp(28px, 4.5vw, 48px); font-weight: 400; line-height: 1; letter-spacing: -0.02em;
        }
        .svcMetric dd {
          margin: 8px 0 0; color: rgba(255,255,255,0.42);
          font-family: var(--font-geist-mono, ui-monospace, monospace);
          font-size: 10px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase;
        }

        /* ── Sticky controls ── */
        .svcControls {
          position: sticky; top: 64px; z-index: 30;
          border-top: 1px solid rgba(255,255,255,0.08);
          border-bottom: 1px solid rgba(255,255,255,0.08);
          background: rgba(6,6,6,0.86); backdrop-filter: blur(14px);
          scroll-margin-top: 64px;
        }
        .svcControlsInner {
          display: flex; align-items: center; gap: 16px;
          max-width: 1180px; margin: 0 auto; padding: 12px clamp(18px, 4vw, 40px);
        }
        .svcSearch {
          position: relative; flex-shrink: 0; width: clamp(180px, 24vw, 280px);
          display: flex; align-items: center;
        }
        .svcSearchIcon { position: absolute; left: 11px; width: 14px; height: 14px; color: rgba(255,255,255,0.4); pointer-events: none; }
        .svcSearch input {
          width: 100%; padding: 9px 30px 9px 32px;
          border: 1px solid rgba(255,255,255,0.14); background: rgba(255,255,255,0.02);
          color: #fff; font-family: var(--font-geist-mono, ui-monospace, monospace);
          font-size: 12px; letter-spacing: 0.02em; outline: none;
          transition: border-color 150ms ease, background 150ms ease;
        }
        .svcSearch input::placeholder { color: rgba(255,255,255,0.34); }
        .svcSearch input:focus { border-color: rgba(255,255,255,0.4); background: rgba(255,255,255,0.045); }
        .svcSearchClear {
          position: absolute; right: 8px; width: 18px; height: 18px;
          border: none; background: transparent; color: rgba(255,255,255,0.5);
          font-size: 16px; line-height: 1; cursor: pointer; transition: color 140ms ease;
        }
        .svcSearchClear:hover { color: #fff; }
        .svcChips {
          display: flex; align-items: center; gap: 6px;
          overflow-x: auto; padding-bottom: 2px;
          scrollbar-width: none;
        }
        .svcChips::-webkit-scrollbar { display: none; }
        .svcChip {
          flex-shrink: 0; padding: 7px 12px;
          border: 1px solid rgba(255,255,255,0.12); background: transparent;
          color: rgba(255,255,255,0.58);
          font-family: var(--font-geist-mono, ui-monospace, monospace);
          font-size: 10.5px; font-weight: 700; letter-spacing: 0.04em; text-transform: uppercase;
          white-space: nowrap; cursor: pointer;
          transition: color 150ms ease, border-color 150ms ease, background 150ms ease;
        }
        .svcChip b { color: rgba(255,255,255,0.4); font-weight: 800; }
        .svcChip:hover { color: rgba(255,255,255,0.9); border-color: rgba(255,255,255,0.26); }
        .svcChip.isActive { color: #050505; background: #fff; border-color: #fff; }
        .svcChip.isActive b { color: rgba(0,0,0,0.5); }

        /* ── Main ── */
        .svcMain { max-width: 1180px; margin: 0 auto; padding: clamp(32px, 5vh, 56px) clamp(18px, 4vw, 40px) clamp(40px, 6vh, 72px); }

        .svcSectionHead { position: relative; margin-bottom: clamp(22px, 3.5vh, 36px); }
        .svcSectionKicker {
          display: block; color: rgba(255,255,255,0.4);
          font-family: var(--font-geist-mono, ui-monospace, monospace);
          font-size: 10px; font-weight: 800; letter-spacing: 0.2em; text-transform: uppercase;
        }
        .svcSectionTitle {
          margin: 10px 0 0; color: #fff;
          font-family: var(--font-geist-mono, ui-monospace, monospace);
          font-size: clamp(22px, 3.5vw, 34px); font-weight: 400; letter-spacing: 0.01em; line-height: 1.05;
        }
        .svcSectionDesc { margin: 10px 0 0; max-width: 60ch; color: rgba(255,255,255,0.5); font-size: 14px; line-height: 1.55; }
        .svcResultCount {
          position: absolute; right: 0; top: 0;
          padding: 6px 11px; border: 1px solid rgba(255,255,255,0.16); background: rgba(255,255,255,0.02);
          color: rgba(255,255,255,0.66);
          font-family: var(--font-geist-mono, ui-monospace, monospace);
          font-size: 10px; font-weight: 800; letter-spacing: 0.1em;
        }

        /* ── Overview: industry cards ── */
        .svcIndGrid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 12px; }
        .svcIndCard {
          position: relative; display: flex; flex-direction: column; text-align: left;
          padding: 20px; min-height: 240px;
          border: 1px solid rgba(255,255,255,0.1);
          background: linear-gradient(180deg, rgba(255,255,255,0.022), rgba(255,255,255,0.004));
          color: inherit; cursor: pointer; overflow: hidden;
          transition: border-color 200ms ease, background 200ms ease, transform 200ms ease;
        }
        .svcIndTopBorder { position: absolute; left: 0; top: 0; width: 0; height: 1px; background: linear-gradient(90deg, rgba(255,255,255,0.7), transparent); transition: width 320ms ${cssEase(EASE_OUT)}; }
        .svcIndCard:hover { border-color: rgba(255,255,255,0.3); background: linear-gradient(180deg, rgba(255,255,255,0.05), rgba(255,255,255,0.01)); transform: translateY(-2px); }
        .svcIndCard:hover .svcIndTopBorder { width: 100%; }
        .svcIndCardHead { display: flex; align-items: center; justify-content: space-between; }
        .svcIndNum { color: rgba(255,255,255,0.32); font-family: var(--font-geist-mono, ui-monospace, monospace); font-size: 12px; font-weight: 800; letter-spacing: 0.08em; }
        .svcIndCount { color: rgba(255,255,255,0.4); font-family: var(--font-geist-mono, ui-monospace, monospace); font-size: 9px; font-weight: 800; letter-spacing: 0.12em; }
        .svcIndName {
          margin: 16px 0 0; color: #fff;
          font-family: var(--font-geist-mono, ui-monospace, monospace);
          font-size: 21px; font-weight: 400; letter-spacing: 0.01em; text-transform: uppercase;
        }
        .svcIndDesc { margin: 8px 0 0; color: rgba(255,255,255,0.5); font-size: 13px; line-height: 1.5; }
        .svcIndSamples { display: flex; flex-wrap: wrap; gap: 5px; margin: 16px 0 0; }
        .svcIndSample {
          padding: 4px 8px; border: 1px solid rgba(255,255,255,0.1); background: rgba(255,255,255,0.02);
          color: rgba(255,255,255,0.56);
          font-family: var(--font-geist-mono, ui-monospace, monospace);
          font-size: 9.5px; font-weight: 600; letter-spacing: 0.02em;
        }
        .svcIndSampleMore {
          padding: 4px 8px; color: rgba(255,255,255,0.34);
          font-family: var(--font-geist-mono, ui-monospace, monospace);
          font-size: 9.5px; font-weight: 700; letter-spacing: 0.04em;
        }
        .svcIndOpen {
          display: inline-flex; align-items: center; gap: 8px; margin-top: auto; padding-top: 18px;
          color: rgba(255,255,255,0.7);
          font-family: var(--font-geist-mono, ui-monospace, monospace);
          font-size: 10px; font-weight: 800; letter-spacing: 0.12em; text-transform: uppercase;
        }
        .svcIndOpen svg { width: 14px; height: 10px; transition: transform 200ms ease; }
        .svcIndCard:hover .svcIndOpen { color: #fff; }
        .svcIndCard:hover .svcIndOpen svg { transform: translateX(4px); }

        /* ── Solution grid ── */
        .svcSolGrid { display: grid; grid-template-columns: repeat(auto-fill, minmax(264px, 1fr)); gap: 10px; }
        .svcSol {
          position: relative; display: flex; flex-direction: column;
          padding: 16px; overflow: hidden; text-decoration: none; color: inherit;
          border: 1px solid rgba(255,255,255,0.09);
          background: linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.003));
          transition: border-color 180ms ease, background 180ms ease, transform 180ms ease;
        }
        .svcSolTopBorder { position: absolute; left: 0; top: 0; width: 0; height: 1px; background: linear-gradient(90deg, rgba(255,255,255,0.7), transparent); transition: width 300ms ${cssEase(EASE_OUT)}; }
        .svcSol:hover { border-color: rgba(255,255,255,0.3); background: linear-gradient(180deg, rgba(255,255,255,0.05), rgba(255,255,255,0.008)); transform: translateY(-2px); }
        .svcSol:hover .svcSolTopBorder { width: 100%; }
        .svcSolHead { display: flex; align-items: center; justify-content: space-between; }
        .svcSolNum { color: rgba(255,255,255,0.3); font-family: var(--font-geist-mono, ui-monospace, monospace); font-size: 10px; font-weight: 800; letter-spacing: 0.08em; }
        .svcSolTitle {
          margin: 14px 0 0; color: rgba(255,255,255,0.94);
          font-family: var(--font-geist-mono, ui-monospace, monospace);
          font-size: 14px; font-weight: 700; letter-spacing: 0.01em; line-height: 1.25;
        }
        .svcSol:hover .svcSolTitle { color: #fff; }
        .svcSolDesc { margin: 7px 0 0; color: rgba(255,255,255,0.46); font-size: 12px; line-height: 1.45; }
        .svcSolTags { display: flex; flex-wrap: wrap; gap: 4px; margin: 13px 0 0; }
        .svcSolTag {
          padding: 3px 7px; border: 1px solid rgba(255,255,255,0.1); background: rgba(255,255,255,0.02);
          color: rgba(255,255,255,0.5);
          font-family: var(--font-geist-mono, ui-monospace, monospace);
          font-size: 9px; font-weight: 700; letter-spacing: 0.04em;
        }
        .svcSolFoot {
          display: flex; align-items: center; gap: 10px; margin-top: 14px; padding-top: 12px;
          border-top: 1px solid rgba(255,255,255,0.07);
        }
        .svcSolIndustry {
          color: rgba(255,255,255,0.6);
          font-family: var(--font-geist-mono, ui-monospace, monospace);
          font-size: 9px; font-weight: 800; letter-spacing: 0.08em; text-transform: uppercase;
        }
        .svcSolTimeline {
          margin-left: auto; color: rgba(255,255,255,0.4);
          font-family: var(--font-geist-mono, ui-monospace, monospace);
          font-size: 9.5px; font-weight: 600; letter-spacing: 0.04em;
        }
        .svcSolArrow { width: 13px; height: 9px; color: rgba(255,255,255,0.6); opacity: 0; transform: translateX(-4px); transition: opacity 180ms ease, transform 180ms ease; }
        .svcSol:hover .svcSolArrow { opacity: 1; transform: translateX(0); }

        /* Complexity badge */
        .svcCx { padding: 3px 7px; font-family: var(--font-geist-mono, ui-monospace, monospace); font-size: 8.5px; font-weight: 800; letter-spacing: 0.1em; text-transform: uppercase; border: 1px solid rgba(255,255,255,0.16); }
        .svcCx-low { color: rgba(255,255,255,0.62); }
        .svcCx-medium { color: rgba(255,255,255,0.82); }
        .svcCx-high { color: #fff; border-color: rgba(255,255,255,0.36); }
        .svcCx-critical { color: #fff; border-color: rgba(255,255,255,0.55); background: rgba(255,255,255,0.07); }

        /* Empty state */
        .svcEmpty { display: flex; flex-direction: column; align-items: center; gap: 14px; padding: 64px 0; text-align: center; }
        .svcEmptyMark { font-size: 38px; color: rgba(255,255,255,0.2); font-family: var(--font-geist-mono, ui-monospace, monospace); }
        .svcEmpty p { color: rgba(255,255,255,0.5); font-size: 14px; }
        .svcEmptyReset { padding: 9px 16px; border: 1px solid rgba(255,255,255,0.2); background: transparent; color: rgba(255,255,255,0.8);
          font-family: var(--font-geist-mono, ui-monospace, monospace); font-size: 11px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; cursor: pointer; transition: border-color 150ms ease, background 150ms ease; }
        .svcEmptyReset:hover { border-color: rgba(255,255,255,0.5); background: rgba(255,255,255,0.05); }

        /* ── CTA ── */
        .svcCta {
          position: relative; max-width: 1180px; margin: 0 auto clamp(40px, 6vh, 72px);
          padding: clamp(40px, 6vw, 72px) clamp(24px, 5vw, 64px); text-align: center;
          border: 1px solid rgba(255,255,255,0.12);
          background: linear-gradient(180deg, rgba(255,255,255,0.035), rgba(255,255,255,0.004));
        }
        .svcCta .svcCorner { width: 16px; height: 16px; }
        .svcCtaKicker { color: rgba(255,255,255,0.4); font-family: var(--font-geist-mono, ui-monospace, monospace); font-size: 10px; font-weight: 800; letter-spacing: 0.2em; }
        .svcCtaTitle {
          margin: 16px 0 0; color: #fff;
          font-family: var(--font-geist-mono, ui-monospace, monospace);
          font-size: clamp(24px, 4vw, 40px); font-weight: 400; line-height: 1.1;
        }
        .svcCtaDesc { margin: 14px auto 0; max-width: 52ch; color: rgba(255,255,255,0.54); font-size: 14px; line-height: 1.6; }
        .svcCtaActions { display: flex; flex-wrap: wrap; gap: 12px; justify-content: center; margin-top: 28px; }
        .svcCtaPrimary {
          display: inline-flex; align-items: center; gap: 9px; padding: 13px 22px;
          background: #fff; color: #050505; text-decoration: none;
          font-family: var(--font-geist-mono, ui-monospace, monospace);
          font-size: 11px; font-weight: 800; letter-spacing: 0.1em; text-transform: uppercase;
          transition: opacity 160ms ease, transform 160ms ease;
        }
        .svcCtaPrimary svg { width: 14px; height: 10px; transition: transform 200ms ease; }
        .svcCtaPrimary:hover { opacity: 0.88; }
        .svcCtaPrimary:hover svg { transform: translateX(4px); }
        .svcCtaSecondary {
          display: inline-flex; align-items: center; padding: 13px 22px;
          border: 1px solid rgba(255,255,255,0.2); color: rgba(255,255,255,0.82); text-decoration: none;
          font-family: var(--font-geist-mono, ui-monospace, monospace);
          font-size: 11px; font-weight: 800; letter-spacing: 0.1em; text-transform: uppercase;
          transition: border-color 160ms ease, background 160ms ease;
        }
        .svcCtaSecondary:hover { border-color: rgba(255,255,255,0.5); background: rgba(255,255,255,0.05); }

        /* ── Footer ── */
        .svcFooter {
          display: flex; flex-wrap: wrap; gap: 10px; align-items: center; justify-content: space-between;
          max-width: 1180px; margin: 0 auto; padding: 22px clamp(18px, 4vw, 40px) 40px;
          border-top: 1px solid rgba(255,255,255,0.08);
          color: rgba(255,255,255,0.34);
          font-family: var(--font-geist-mono, ui-monospace, monospace);
          font-size: 10px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase;
        }

        /* ── Responsive ── */
        @media (max-width: 860px) {
          .svcMetrics { grid-template-columns: repeat(2, 1fr); }
          .svcControlsInner { flex-direction: column; align-items: stretch; gap: 10px; }
          .svcSearch { width: 100%; }
          .svcControls { top: 64px; }
        }
        @media (max-width: 520px) {
          .svcIndGrid, .svcSolGrid { grid-template-columns: 1fr; }
        }

        @media (prefers-reduced-motion: reduce) {
          .svcDot, .svcIndTopBorder, .svcSolTopBorder, .svcSolArrow,
          .svcIndOpen svg, .svcCtaPrimary svg { animation: none !important; transition: none !important; }
        }
      `}</style>
    </div>
  );
}

function ComplexityBadge({ level }: { level: Complexity }) {
  return <span className={`svcCx svcCx-${level.toLowerCase()}`}>{level}</span>;
}

function cssEase([a, b, c, d]: readonly [number, number, number, number]) {
  return `cubic-bezier(${a}, ${b}, ${c}, ${d})`;
}
