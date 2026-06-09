'use client';

import Link from 'next/link';
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
import { WORK_CATEGORIES, type WorkCategory, type WorkProject } from '../../../public/workMegaMenuData';
import SiteHeader from '../components/SiteHeader';

const EASE_OUT = [0.22, 1, 0.36, 1] as const;
const CONTACT_HREF = `mailto:hello@mogt.studio?subject=Project%20Inquiry%20%E2%80%94%20MOGT`;
const TOTAL_PROJECTS = WORK_CATEGORIES.reduce((sum, c) => sum + c.projects.length, 0);

// ── Platform type normaliser ───────────────────────────────────────────────
function typeLabel(t: string): string {
  const m: Record<string, string> = {
    'web': 'Web',
    'mobile': 'Mobile',
    'web and mobile': 'Web + Mobile',
    'web & mobile': 'Web + Mobile',
  };
  return m[t.toLowerCase().trim()] ?? t;
}

// ── Monogram fallback ──────────────────────────────────────────────────────
// Projects without an installed logo get a tailored initials tile.
const MONO_STOP = new Set(['the', 'a', 'an', 'of', 'and', 'for', 'to', '&']);
function monogram(title: string): string {
  const words = title.split(/[\s\-/:&]+/).filter((w) => w && !MONO_STOP.has(w.toLowerCase()));
  if (words.length >= 2) return (words[0][0] + words[1][0]).toUpperCase();
  const w = words[0] || title;
  const caps = w.match(/[A-Z]/g);
  if (caps && caps.length >= 2) return (caps[0] + caps[1]).toUpperCase();
  return w.slice(0, 2).toUpperCase();
}

// ── Animated count-up ─────────────────────────────────────────────────────
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

// ── Animation variants ────────────────────────────────────────────────────
const gridStagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.045, delayChildren: 0.05 } },
};
const cardV: Variants = {
  hidden: { opacity: 0, y: 14, filter: 'blur(4px)' },
  show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.5, ease: EASE_OUT } },
};

// ── Platform type badge colours ───────────────────────────────────────────
function TypeBadge({ type }: { type: string }) {
  const label = typeLabel(type);
  return <span className={`wkTypeBadge wkType-${label.replace(/\s\+\s/g, '-').toLowerCase()}`}>{label}</span>;
}

export default function WorkClient() {
  const prefersReduced = useReducedMotion();

  const [activeId, setActiveId] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const contentTopRef = useRef<HTMLDivElement | null>(null);

  // Deep-link: /work?category=healthcare
  useEffect(() => {
    const param = new URLSearchParams(window.location.search).get('category');
    if (param && WORK_CATEGORIES.some((c) => c.id === param)) {
      setActiveId(param);
    }
  }, []);

  const activeCategory = activeId ? WORK_CATEGORIES.find((c) => c.id === activeId) ?? null : null;
  const isSearching = query.trim().length > 0;
  const q = query.trim().toLowerCase();

  // Flat filtered list when searching or inside a category
  type ProjectWithCategory = { project: WorkProject; category: WorkCategory };
  const results: ProjectWithCategory[] = useMemo(() => {
    const scope = activeCategory ? [activeCategory] : WORK_CATEGORIES;
    const out: ProjectWithCategory[] = [];
    scope.forEach((category) => {
      category.projects.forEach((project) => {
        if (
          !q ||
          project.title.toLowerCase().includes(q) ||
          project.description.toLowerCase().includes(q) ||
          category.name.toLowerCase().includes(q) ||
          project.type.toLowerCase().includes(q)
        ) {
          out.push({ project, category });
        }
      });
    });
    return out;
  }, [activeCategory, q]);

  const showOverview = !activeCategory && !isSearching;

  const selectCategory = (id: string | null) => {
    setActiveId(id);
    setQuery('');
    if (typeof window !== 'undefined') {
      const url = id ? `/work?category=${id}` : '/work';
      window.history.replaceState(null, '', url);
    }
    requestAnimationFrame(() => {
      contentTopRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  };

  return (
    <div className="wk">
      <div className="wkBg" aria-hidden="true" />
      <div className="wkScan" aria-hidden="true" />

      <SiteHeader />

      {/* ── Hero ── */}
      <section className="wkHero">
        <div className="wkHeroFrame" aria-hidden="true">
          <i className="wkCorner tl" /><i className="wkCorner tr" />
          <i className="wkCorner bl" /><i className="wkCorner br" />
        </div>

        <motion.div
          className="wkHeroInner"
          initial={prefersReduced ? false : 'hidden'}
          animate="show"
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } } }}
        >
          <motion.span className="wkEyebrow" variants={cardV}>
            <span className="wkDot" /> WORK ARCHIVE / FULL INDEX
          </motion.span>

          <motion.h1 className="wkHeroTitle" variants={cardV}>
            Real projects.<br />Shipped systems.
          </motion.h1>

          <motion.p className="wkLede" variants={cardV}>
            {WORK_CATEGORIES.length} categories. {TOTAL_PROJECTS} live products.
            Designed, engineered, and deployed by MOGT.
          </motion.p>

          <motion.dl className="wkMetrics" variants={cardV}>
            <div className="wkMetric">
              <dt><CountUp to={TOTAL_PROJECTS} /></dt>
              <dd>Projects</dd>
            </div>
            <div className="wkMetric">
              <dt><CountUp to={WORK_CATEGORIES.length} /></dt>
              <dd>Categories</dd>
            </div>
            <div className="wkMetric">
              <dt><CountUp to={7} /></dt>
              <dd>Years Active</dd>
            </div>
            <div className="wkMetric">
              <dt><CountUp to={100} suffix="%" /></dt>
              <dd>Custom-built</dd>
            </div>
          </motion.dl>
        </motion.div>
      </section>

      {/* ── Controls ── */}
      <div className="wkControls" ref={contentTopRef}>
        <div className="wkControlsInner">
          <div className="wkSearch">
            <svg className="wkSearchIcon" viewBox="0 0 16 16" aria-hidden="true">
              <circle cx="7" cy="7" r="5" fill="none" stroke="currentColor" strokeWidth="1.4" />
              <path d="M11 11 14.5 14.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
            </svg>
            <input
              type="text"
              value={query}
              onChange={(e) => { setQuery(e.target.value); setActiveId(null); }}
              placeholder={activeCategory ? `Search ${activeCategory.name}…` : 'Search all projects…'}
              aria-label="Search projects"
            />
            {query && (
              <button type="button" className="wkSearchClear" onClick={() => setQuery('')} aria-label="Clear search">×</button>
            )}
          </div>

          <div className="wkChips" role="tablist" aria-label="Filter by category">
            <button
              type="button" role="tab"
              aria-selected={!activeCategory && !isSearching}
              className={`wkChip${!activeCategory && !isSearching ? ' isActive' : ''}`}
              onClick={() => selectCategory(null)}
            >
              All <b>{WORK_CATEGORIES.length}</b>
            </button>
            {WORK_CATEGORIES.map((cat) => (
              <button
                key={cat.id} type="button" role="tab"
                aria-selected={activeId === cat.id}
                className={`wkChip${activeId === cat.id ? ' isActive' : ''}`}
                onClick={() => selectCategory(cat.id)}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Content ── */}
      <main className="wkMain">
        <AnimatePresence mode="wait">
          {showOverview ? (
            /* ── OVERVIEW: all categories ── */
            <motion.section
              key="overview"
              className="wkOverview"
              initial={prefersReduced ? false : 'hidden'}
              animate="show"
              exit={{ opacity: 0, y: -8, transition: { duration: 0.18 } }}
              variants={gridStagger}
            >
              <div className="wkSectionHead">
                <span className="wkSectionKicker">INDEX / {WORK_CATEGORIES.length} CATEGORIES</span>
                <h2 className="wkSectionTitle">Browse by category</h2>
                <p className="wkSectionDesc">Select a category to see its projects, or search across the full archive.</p>
              </div>

              <div className="wkCatGrid">
                {WORK_CATEGORIES.map((cat, i) => (
                  <motion.button
                    type="button"
                    key={cat.id}
                    className="wkCatCard"
                    variants={cardV}
                    onClick={() => selectCategory(cat.id)}
                  >
                    <span className="wkCatTopBorder" aria-hidden="true" />
                    <div className="wkCatCardHead">
                      <span className="wkCatNum">{String(i + 1).padStart(2, '0')}</span>
                      <span className="wkCatCount">{cat.projects.length} PROJECTS</span>
                    </div>
                    <h3 className="wkCatName">{cat.name}</h3>
                    <p className="wkCatDesc">{cat.description}</p>
                    <div className="wkCatSamples">
                      {cat.projects.slice(0, 3).map((p) => (
                        <span key={p.slug} className="wkCatSample">{p.title}</span>
                      ))}
                      {cat.projects.length > 3 && (
                        <span className="wkCatSampleMore">+{cat.projects.length - 3} more</span>
                      )}
                    </div>
                    <span className="wkCatOpen">
                      Open category
                      <svg viewBox="0 0 14 10" aria-hidden="true">
                        <path d="M1 5h11M8 1.5 12.5 5 8 8.5" fill="none" stroke="currentColor" strokeWidth="1.3" />
                      </svg>
                    </span>
                  </motion.button>
                ))}
              </div>
            </motion.section>
          ) : (
            /* ── PROJECT GRID: single category or search ── */
            <motion.section
              key={`grid-${activeId ?? 'all'}-${isSearching ? 'q' : 'n'}`}
              className="wkGridSection"
              initial={prefersReduced ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3, ease: EASE_OUT }}
            >
              <div className="wkSectionHead">
                {activeCategory ? (
                  <>
                    <span className="wkSectionKicker">CATEGORY / {activeCategory.name.toUpperCase()}</span>
                    <h2 className="wkSectionTitle">{activeCategory.name}</h2>
                    <p className="wkSectionDesc">{activeCategory.description}</p>
                  </>
                ) : (
                  <>
                    <span className="wkSectionKicker">SEARCH / ALL CATEGORIES</span>
                    <h2 className="wkSectionTitle">Search results</h2>
                    <p className="wkSectionDesc">Matching &ldquo;{query.trim()}&rdquo; across the full archive.</p>
                  </>
                )}
                <span className="wkResultCount">
                  {String(results.length).padStart(2, '0')} {results.length === 1 ? 'PROJECT' : 'PROJECTS'}
                </span>
              </div>

              {results.length === 0 ? (
                <div className="wkEmpty">
                  <span className="wkEmptyMark">∅</span>
                  <p>No projects match &ldquo;{query.trim()}&rdquo;.</p>
                  <button type="button" className="wkEmptyReset" onClick={() => setQuery('')}>Clear search</button>
                </div>
              ) : (
                <motion.div
                  className="wkProjGrid"
                  initial={prefersReduced ? false : 'hidden'}
                  animate="show"
                  variants={gridStagger}
                >
                  {results.map(({ project, category }) => (
                    <Link key={project.slug} href={`/work/${project.slug}`} passHref legacyBehavior>
                      <motion.a
                        className="wkProjCard"
                        variants={cardV}
                      >
                        <span className="wkProjTopBorder" aria-hidden="true" />
                        <i className="wkProjCornerTL" aria-hidden="true" />
                        <i className="wkProjCornerBR" aria-hidden="true" />

                        <span className="wkProjLogo" aria-hidden="true">
                          {project.logo ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img className="wkProjLogoImg" src={project.logo} alt="" loading="lazy" draggable={false} />
                          ) : (
                            <span className="wkProjLogoMono">{monogram(project.title)}</span>
                          )}
                        </span>

                        <div className="wkProjCardHead">
                          <TypeBadge type={project.type} />
                          {!activeCategory && (
                            <span className="wkProjCat">{category.name}</span>
                          )}
                        </div>

                        <h3 className="wkProjTitle">{project.title}</h3>
                        <p className="wkProjDesc">{project.description}</p>

                        <span className="wkProjCta" aria-hidden="true">
                          View Project
                          <svg viewBox="0 0 14 10" aria-hidden="true">
                            <path d="M1 5h11M8 1.5 12.5 5 8 8.5" fill="none" stroke="currentColor" strokeWidth="1.3" />
                          </svg>
                        </span>
                      </motion.a>
                    </Link>
                  ))}
                </motion.div>
              )}
            </motion.section>
          )}
        </AnimatePresence>
      </main>

      {/* ── Footer CTA ── */}
      <section className="wkCtaBar">
        <span className="wkCtaBarKicker">SEEN ENOUGH?</span>
        <p className="wkCtaBarText">Tell us what you need to build.</p>
        <a className="wkCtaBarBtn" href={CONTACT_HREF}>
          Estimate a Project
          <svg viewBox="0 0 14 10" aria-hidden="true">
            <path d="M1 5h11M8 1.5 12.5 5 8 8.5" fill="none" stroke="currentColor" strokeWidth="1.3" />
          </svg>
        </a>
      </section>

      {/* ── Styles ── */}
      <style jsx global>{`
        /* ── Page shell ── */
        .wk {
          position: relative; min-height: 100vh;
          background: #050505;
          color: rgba(255,255,255,0.88);
          font-family: var(--font-geist-sans, sans-serif);
        }

        .wkBg {
          position: fixed; inset: 0; z-index: 0; pointer-events: none;
          background-image:
            linear-gradient(rgba(255,255,255,0.018) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.018) 1px, transparent 1px);
          background-size: 60px 60px;
          mask-image: radial-gradient(ellipse 90% 55% at 50% 0%, #000 0%, transparent 75%);
          -webkit-mask-image: radial-gradient(ellipse 90% 55% at 50% 0%, #000 0%, transparent 75%);
        }

        .wkScan {
          position: fixed; inset: 0; z-index: 0; pointer-events: none;
          background: repeating-linear-gradient(
            to bottom, transparent 0, transparent 2px,
            rgba(255,255,255,0.012) 3px, transparent 4px
          );
          opacity: 0.5;
        }

        /* ── Hero ── */
        .wkHero {
          position: relative; z-index: 1;
          padding: clamp(48px, 8vh, 100px) clamp(20px, 5vw, 80px) clamp(40px, 6vh, 72px);
          max-width: 1200px; margin-inline: auto;
        }

        .wkHeroFrame {
          position: absolute; inset: 20px clamp(10px, 3vw, 40px);
          pointer-events: none;
        }

        .wkCorner {
          position: absolute; width: 18px; height: 18px;
        }
        .wkCorner.tl { top: 0; left: 0; border-top: 1px solid rgba(255,255,255,0.3); border-left: 1px solid rgba(255,255,255,0.3); }
        .wkCorner.tr { top: 0; right: 0; border-top: 1px solid rgba(255,255,255,0.3); border-right: 1px solid rgba(255,255,255,0.3); }
        .wkCorner.bl { bottom: 0; left: 0; border-bottom: 1px solid rgba(255,255,255,0.16); border-left: 1px solid rgba(255,255,255,0.16); }
        .wkCorner.br { bottom: 0; right: 0; border-bottom: 1px solid rgba(255,255,255,0.16); border-right: 1px solid rgba(255,255,255,0.16); }

        .wkHeroInner {
          display: flex; flex-direction: column; gap: 20px;
          max-width: 700px;
        }

        .wkEyebrow {
          display: inline-flex; align-items: center; gap: 10px;
          color: rgba(255,255,255,0.3);
          font-family: var(--font-geist-mono, ui-monospace, monospace);
          font-size: 9.5px; font-weight: 800; letter-spacing: 0.22em; text-transform: uppercase;
        }

        .wkDot {
          display: inline-block; width: 5px; height: 5px;
          border-radius: 50%; background: rgba(255,255,255,0.55);
        }

        .wkHeroTitle {
          margin: 0;
          color: rgba(255,255,255,0.97);
          font-family: var(--font-geist-mono, ui-monospace, monospace);
          font-size: clamp(32px, 5vw, 62px);
          font-weight: 400; letter-spacing: -0.02em; line-height: 1.04; text-transform: uppercase;
        }

        .wkLede {
          margin: 0; max-width: 520px;
          color: rgba(255,255,255,0.5);
          font-size: clamp(13px, 1.05vw, 16px); line-height: 1.65; font-weight: 360;
        }

        .wkMetrics {
          display: flex; flex-wrap: wrap; gap: 0;
          margin: 8px 0 0;
          border: 1px solid rgba(255,255,255,0.1);
          width: fit-content;
        }

        .wkMetric {
          display: flex; flex-direction: column; gap: 4px;
          padding: 14px 24px;
          border-right: 1px solid rgba(255,255,255,0.08);
          min-width: 80px;
        }
        .wkMetric:last-child { border-right: none; }

        .wkMetric dt {
          color: rgba(255,255,255,0.95);
          font-family: var(--font-geist-mono, ui-monospace, monospace);
          font-size: clamp(20px, 2.2vw, 30px); font-weight: 400; letter-spacing: -0.02em; line-height: 1;
        }

        .wkMetric dd {
          margin: 0; color: rgba(255,255,255,0.36);
          font-family: var(--font-geist-mono, ui-monospace, monospace);
          font-size: 8.5px; font-weight: 800; letter-spacing: 0.14em; text-transform: uppercase;
        }

        /* ── Controls bar ── */
        .wkControls {
          position: sticky; top: 64px; z-index: 30;
          border-top: 1px solid rgba(255,255,255,0.07);
          border-bottom: 1px solid rgba(255,255,255,0.07);
          background: rgba(5,5,5,0.88); backdrop-filter: blur(14px);
          scroll-margin-top: 64px;
        }

        .wkControlsInner {
          display: flex; flex-direction: column; gap: 0;
          max-width: 1200px; margin-inline: auto;
        }

        /* Search row */
        .wkSearch {
          position: relative; display: flex; align-items: center;
          padding: 0 clamp(16px, 3vw, 32px);
          border-bottom: 1px solid rgba(255,255,255,0.06);
        }

        .wkSearchIcon {
          flex-shrink: 0; width: 14px; height: 14px;
          color: rgba(255,255,255,0.3);
        }

        .wkSearch input {
          flex: 1; padding: 14px 12px;
          border: none; background: transparent;
          color: rgba(255,255,255,0.88);
          font-family: var(--font-geist-mono, ui-monospace, monospace);
          font-size: 12px; font-weight: 600; letter-spacing: 0.04em;
          outline: none;
        }

        .wkSearch input::placeholder { color: rgba(255,255,255,0.24); }

        .wkSearchClear {
          flex-shrink: 0; padding: 4px 8px;
          border: none; background: transparent;
          color: rgba(255,255,255,0.4);
          font-size: 16px; cursor: pointer;
          transition: color 140ms ease;
        }
        .wkSearchClear:hover { color: rgba(255,255,255,0.8); }

        /* Category chips */
        .wkChips {
          display: flex; align-items: center; justify-content: center; flex-wrap: wrap; gap: 4px;
          padding: 10px clamp(16px, 3vw, 32px);
        }

        .wkChip {
          flex-shrink: 0;
          display: inline-flex; align-items: center; gap: 5px;
          padding: 5px 12px; height: 28px;
          border: 1px solid rgba(255,255,255,0.1);
          background: transparent;
          color: rgba(255,255,255,0.52);
          font-family: var(--font-geist-mono, ui-monospace, monospace);
          font-size: 9.5px; font-weight: 800; letter-spacing: 0.08em; text-transform: uppercase;
          cursor: pointer; white-space: nowrap;
          transition: color 140ms ease, border-color 140ms ease, background 140ms ease;
        }
        .wkChip b { font-weight: 800; color: rgba(255,255,255,0.28); }
        .wkChip:hover { color: rgba(255,255,255,0.86); border-color: rgba(255,255,255,0.28); }
        .wkChip.isActive {
          color: #fff; border-color: rgba(255,255,255,0.48);
          background: rgba(255,255,255,0.06);
        }
        .wkChip.isActive b { color: rgba(255,255,255,0.6); }

        /* ── Main content ── */
        .wkMain {
          position: relative; z-index: 1;
          max-width: 1200px; margin-inline: auto;
          padding: clamp(32px, 5vh, 56px) clamp(20px, 5vw, 80px) clamp(48px, 7vh, 80px);
          min-height: 60vh;
        }

        /* Section head */
        .wkSectionHead {
          display: flex; flex-direction: column; gap: 6px;
          margin-bottom: 28px;
        }

        .wkSectionKicker {
          color: rgba(255,255,255,0.28);
          font-family: var(--font-geist-mono, ui-monospace, monospace);
          font-size: 9px; font-weight: 800; letter-spacing: 0.26em; text-transform: uppercase;
        }

        .wkSectionTitle {
          margin: 0;
          color: rgba(255,255,255,0.94);
          font-family: var(--font-geist-mono, ui-monospace, monospace);
          font-size: clamp(20px, 2.4vw, 30px);
          font-weight: 400; letter-spacing: -0.01em; text-transform: uppercase;
        }

        .wkSectionDesc {
          margin: 2px 0 0; color: rgba(255,255,255,0.44);
          font-size: clamp(12px, 0.95vw, 14px); line-height: 1.6; max-width: 560px;
        }

        .wkResultCount {
          margin-top: 6px;
          color: rgba(255,255,255,0.3);
          font-family: var(--font-geist-mono, ui-monospace, monospace);
          font-size: 9px; font-weight: 800; letter-spacing: 0.2em;
        }

        /* ── Category overview grid ── */
        .wkCatGrid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
          gap: 10px;
        }

        .wkCatCard {
          position: relative; display: flex; flex-direction: column; gap: 10px;
          padding: 18px 20px 48px;
          border: 1px solid rgba(255,255,255,0.08);
          background: rgba(255,255,255,0.014);
          text-align: left; cursor: pointer;
          transition: border-color 200ms ease, background 200ms ease;
          overflow: hidden;
        }

        .wkCatTopBorder {
          position: absolute; left: 0; right: 0; top: 0; height: 1px;
          background: linear-gradient(90deg, rgba(255,255,255,0.5) 0%, transparent 70%);
          transform: scaleX(0); transform-origin: left;
          transition: transform 300ms cubic-bezier(0.22, 1, 0.36, 1);
        }

        .wkCatCard:hover .wkCatTopBorder { transform: scaleX(1); }
        .wkCatCard:hover { border-color: rgba(255,255,255,0.22); background: rgba(255,255,255,0.028); }

        .wkCatCardHead {
          display: flex; align-items: center; justify-content: space-between;
        }

        .wkCatNum {
          color: rgba(255,255,255,0.22);
          font-family: var(--font-geist-mono, ui-monospace, monospace);
          font-size: 9px; font-weight: 800; letter-spacing: 0.1em;
        }

        .wkCatCount {
          color: rgba(255,255,255,0.32);
          font-family: var(--font-geist-mono, ui-monospace, monospace);
          font-size: 8px; font-weight: 800; letter-spacing: 0.12em;
          padding: 3px 8px;
          border: 1px solid rgba(255,255,255,0.1);
        }

        .wkCatName {
          margin: 0;
          color: rgba(255,255,255,0.9);
          font-family: var(--font-geist-mono, ui-monospace, monospace);
          font-size: clamp(14px, 1.3vw, 17px); font-weight: 700; letter-spacing: 0.02em;
          text-transform: uppercase; line-height: 1.2;
        }

        .wkCatDesc {
          margin: 0; color: rgba(255,255,255,0.44);
          font-size: 12.5px; line-height: 1.5;
          display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .wkCatSamples {
          display: flex; flex-wrap: wrap; gap: 5px;
          margin-top: 4px;
        }

        .wkCatSample {
          display: inline-flex; padding: 3px 8px;
          border: 1px solid rgba(255,255,255,0.09);
          background: rgba(255,255,255,0.018);
          color: rgba(255,255,255,0.48);
          font-family: var(--font-geist-mono, ui-monospace, monospace);
          font-size: 8.5px; font-weight: 700; letter-spacing: 0.06em;
          white-space: nowrap;
        }

        .wkCatSampleMore {
          display: inline-flex; padding: 3px 8px;
          color: rgba(255,255,255,0.26);
          font-family: var(--font-geist-mono, ui-monospace, monospace);
          font-size: 8.5px; font-weight: 700; letter-spacing: 0.06em;
        }

        .wkCatOpen {
          position: absolute; bottom: 16px; left: 20px;
          display: inline-flex; align-items: center; gap: 8px;
          color: rgba(255,255,255,0.6);
          font-family: var(--font-geist-mono, ui-monospace, monospace);
          font-size: 9px; font-weight: 800; letter-spacing: 0.1em; text-transform: uppercase;
          opacity: 0; transform: translateY(4px);
          transition: opacity 200ms ease, transform 200ms ease;
        }
        .wkCatOpen svg { width: 12px; height: 9px; }
        .wkCatCard:hover .wkCatOpen { opacity: 1; transform: translateY(0); }

        /* ── Project grid ── */
        .wkProjGrid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
          gap: 10px;
        }

        .wkProjCard {
          position: relative; display: flex; flex-direction: column; gap: 10px;
          padding: 16px 18px 48px;
          border: 1px solid rgba(255,255,255,0.08);
          background: rgba(255,255,255,0.014);
          color: inherit; text-decoration: none; overflow: hidden;
          transition: border-color 200ms ease, background 200ms ease;
        }

        .wkProjTopBorder {
          position: absolute; left: 0; right: 0; top: 0; height: 1px;
          background: linear-gradient(90deg, rgba(255,255,255,0.65) 0%, transparent 65%);
          transform: scaleX(0); transform-origin: left;
          transition: transform 280ms cubic-bezier(0.22, 1, 0.36, 1);
        }
        .wkProjCard:hover .wkProjTopBorder { transform: scaleX(1); }
        .wkProjCard:hover { border-color: rgba(255,255,255,0.22); background: rgba(255,255,255,0.032); }

        .wkProjCornerTL {
          position: absolute; top: 6px; left: 6px;
          width: 8px; height: 8px;
          border-top: 1px solid rgba(255,255,255,0.2);
          border-left: 1px solid rgba(255,255,255,0.2);
          pointer-events: none;
          transition: border-color 200ms ease;
        }
        .wkProjCornerBR {
          position: absolute; bottom: 6px; right: 6px;
          width: 8px; height: 8px;
          border-bottom: 1px solid rgba(255,255,255,0.2);
          border-right: 1px solid rgba(255,255,255,0.2);
          pointer-events: none;
          transition: border-color 200ms ease;
        }
        .wkProjCard:hover .wkProjCornerTL,
        .wkProjCard:hover .wkProjCornerBR { border-color: rgba(255,255,255,0.5); }

        /* Project logo / monogram tile */
        .wkProjLogo {
          display: flex; align-items: center; justify-content: center;
          width: 60px; height: 60px; flex: none;
          border: 1px solid rgba(255,255,255,0.1);
          background:
            radial-gradient(circle at 50% 38%, rgba(255,255,255,0.05), transparent 70%),
            rgba(255,255,255,0.015);
          overflow: hidden;
          transition: border-color 200ms ease;
        }
        .wkProjCard:hover .wkProjLogo { border-color: rgba(255,255,255,0.22); }
        .wkProjLogoImg {
          max-width: 72%; max-height: 72%; object-fit: contain;
          filter: grayscale(1) brightness(1.12) opacity(0.7);
          transition: filter 220ms ease, transform 220ms ease;
        }
        .wkProjCard:hover .wkProjLogoImg { filter: grayscale(0) brightness(1) opacity(1); transform: scale(1.05); }
        .wkProjLogoMono {
          font-family: var(--font-geist-mono, ui-monospace, monospace);
          font-size: 19px; font-weight: 800; letter-spacing: 0.04em;
          color: rgba(255,255,255,0.52);
          transition: color 220ms ease;
        }
        .wkProjCard:hover .wkProjLogoMono { color: rgba(255,255,255,0.9); }

        .wkProjCardHead {
          display: flex; align-items: center; justify-content: space-between; gap: 8px;
          flex-wrap: wrap;
        }

        /* Platform type badge */
        .wkTypeBadge {
          display: inline-flex; align-items: center;
          height: 20px; padding: 0 8px;
          border: 1px solid rgba(255,255,255,0.12);
          background: rgba(255,255,255,0.028);
          color: rgba(255,255,255,0.52);
          font-family: var(--font-geist-mono, ui-monospace, monospace);
          font-size: 8px; font-weight: 800; letter-spacing: 0.1em; text-transform: uppercase;
        }

        .wkProjCat {
          color: rgba(255,255,255,0.28);
          font-family: var(--font-geist-mono, ui-monospace, monospace);
          font-size: 8px; font-weight: 800; letter-spacing: 0.1em; text-transform: uppercase;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }

        .wkProjTitle {
          margin: 0;
          color: rgba(255,255,255,0.92);
          font-family: var(--font-geist-mono, ui-monospace, monospace);
          font-size: clamp(13px, 1.1vw, 15px); font-weight: 700; letter-spacing: 0.02em; line-height: 1.3;
          text-transform: uppercase;
        }

        .wkProjDesc {
          margin: 0; color: rgba(255,255,255,0.46);
          font-size: 12.5px; line-height: 1.5;
          display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .wkProjCta {
          position: absolute; bottom: 14px; left: 18px;
          display: inline-flex; align-items: center; gap: 7px;
          color: rgba(255,255,255,0.62);
          font-family: var(--font-geist-mono, ui-monospace, monospace);
          font-size: 8.5px; font-weight: 800; letter-spacing: 0.1em; text-transform: uppercase;
          opacity: 0; transform: translateY(3px);
          transition: opacity 200ms ease, transform 200ms ease;
        }
        .wkProjCta svg { width: 11px; height: 8px; }
        .wkProjCard:hover .wkProjCta { opacity: 1; transform: translateY(0); }

        /* ── Empty state ── */
        .wkEmpty {
          display: flex; flex-direction: column; align-items: center;
          gap: 12px; padding: 64px 20px;
          border: 1px solid rgba(255,255,255,0.07);
          text-align: center;
        }

        .wkEmptyMark {
          color: rgba(255,255,255,0.14);
          font-size: 40px; line-height: 1;
        }

        .wkEmpty p {
          margin: 0; color: rgba(255,255,255,0.44);
          font-family: var(--font-geist-mono, ui-monospace, monospace);
          font-size: 12px; font-weight: 600; letter-spacing: 0.04em;
        }

        .wkEmptyReset {
          padding: 8px 18px;
          border: 1px solid rgba(255,255,255,0.2);
          background: transparent; color: rgba(255,255,255,0.68);
          font-family: var(--font-geist-mono, ui-monospace, monospace);
          font-size: 10px; font-weight: 800; letter-spacing: 0.1em; text-transform: uppercase;
          cursor: pointer;
          transition: border-color 160ms ease, color 160ms ease;
        }
        .wkEmptyReset:hover { border-color: rgba(255,255,255,0.44); color: #fff; }

        /* ── Footer CTA bar ── */
        .wkCtaBar {
          position: relative; z-index: 1;
          display: flex; align-items: center; justify-content: space-between;
          flex-wrap: wrap; gap: 16px;
          max-width: 1200px; margin-inline: auto;
          padding: clamp(24px, 4vh, 40px) clamp(20px, 5vw, 80px) clamp(40px, 6vh, 64px);
          border-top: 1px solid rgba(255,255,255,0.07);
        }

        .wkCtaBarKicker {
          color: rgba(255,255,255,0.24);
          font-family: var(--font-geist-mono, ui-monospace, monospace);
          font-size: 9px; font-weight: 800; letter-spacing: 0.24em; text-transform: uppercase;
        }

        .wkCtaBarText {
          margin: 0; flex: 1; min-width: 160px;
          color: rgba(255,255,255,0.72);
          font-family: var(--font-geist-mono, ui-monospace, monospace);
          font-size: clamp(14px, 1.5vw, 19px); font-weight: 400; letter-spacing: -0.01em;
          text-transform: uppercase;
        }

        .wkCtaBarBtn {
          display: inline-flex; align-items: center; gap: 10px;
          padding: 11px 24px;
          border: 1px solid rgba(255,255,255,0.28);
          background: rgba(255,255,255,0.04);
          color: rgba(255,255,255,0.88);
          font-family: var(--font-geist-mono, ui-monospace, monospace);
          font-size: 10.5px; font-weight: 800; letter-spacing: 0.1em; text-transform: uppercase;
          text-decoration: none; white-space: nowrap;
          transition: color 160ms ease, border-color 160ms ease, background 160ms ease;
        }
        .wkCtaBarBtn svg { width: 12px; height: 9px; transition: transform 200ms ease; }
        .wkCtaBarBtn:hover {
          color: #fff; border-color: rgba(255,255,255,0.62);
          background: rgba(255,255,255,0.07);
        }
        .wkCtaBarBtn:hover svg { transform: translateX(3px); }

        /* ── Responsive ── */
        @media (max-width: 640px) {
          .wkHeroTitle { letter-spacing: -0.015em; }
          .wkMetrics { width: 100%; }
          .wkMetric { flex: 1; min-width: 0; padding: 12px 16px; }
          .wkCatGrid, .wkProjGrid { grid-template-columns: 1fr; }
          .wkCtaBar { flex-direction: column; align-items: flex-start; }
        }

        @media (max-width: 900px) {
          .wkCatGrid, .wkProjGrid { grid-template-columns: repeat(2, 1fr); }
        }

        @media (prefers-reduced-motion: reduce) {
          .wkCatTopBorder, .wkProjTopBorder,
          .wkCatOpen, .wkProjCta { transition: none !important; animation: none !important; }
        }
      `}</style>
    </div>
  );
}
