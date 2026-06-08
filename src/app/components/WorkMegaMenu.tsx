'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { WORK_CATEGORIES, type WorkCategory, type WorkProject } from '../../../public/workMegaMenuData';

const EASE_OUT = [0.22, 1, 0.36, 1] as const;
const HEADER_OFFSET = 66;

function cssEase([a, b, c, d]: readonly [number, number, number, number]) {
  return `cubic-bezier(${a}, ${b}, ${c}, ${d})`;
}

const TYPE_LABEL: Record<string, string> = {
  'web': 'WEB',
  'mobile': 'MOBILE',
  'web and mobile': 'WEB + MOBILE',
  'web & mobile': 'WEB + MOBILE',
};

function normalizeType(t: string): string {
  return TYPE_LABEL[t.toLowerCase().trim()] ?? t.toUpperCase();
}

export default function WorkMegaMenu() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [hoveredProject, setHoveredProject] = useState<WorkProject | null>(null);
  const closeTimer = useRef<number | undefined>(undefined);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => setMounted(true), []);

  const active: WorkCategory = WORK_CATEGORIES[activeIndex];

  const cancelClose = useCallback(() => {
    if (closeTimer.current !== undefined) {
      window.clearTimeout(closeTimer.current);
      closeTimer.current = undefined;
    }
  }, []);

  const openMenu = useCallback(() => {
    cancelClose();
    setOpen(true);
  }, [cancelClose]);

  const scheduleClose = useCallback(() => {
    cancelClose();
    closeTimer.current = window.setTimeout(() => setOpen(false), 150);
  }, [cancelClose]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  useEffect(() => () => cancelClose(), [cancelClose]);

  const handleCategoryChange = (index: number) => {
    setActiveIndex(index);
    setHoveredProject(null);
  };

  const totalProjects = WORK_CATEGORIES.reduce((a, c) => a + c.projects.length, 0);

  return (
    <div
      className="wmmRoot"
      onMouseEnter={openMenu}
      onMouseLeave={scheduleClose}
    >
      <button
        type="button"
        className={`wmmTrigger${open ? ' isOpen' : ''}`}
        aria-haspopup="true"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        onFocus={openMenu}
      >
        Work
        <svg className="wmmChevron" viewBox="0 0 12 8" aria-hidden="true">
          <path d="M1 1.5 6 6.5 11 1.5" fill="none" stroke="currentColor" strokeWidth="1.4" />
        </svg>
      </button>

      {mounted && createPortal(
        <AnimatePresence>
          {open && (
            <>
              <motion.div
                key="wmm-backdrop"
                className="wmmBackdrop"
                aria-hidden="true"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                onClick={() => setOpen(false)}
                onMouseEnter={scheduleClose}
              />

              <motion.div
                key="wmm-panel"
                className="wmmPanel"
                role="dialog"
                aria-label="Work mega menu"
                initial={prefersReducedMotion
                  ? { opacity: 0, x: '-50%' }
                  : { opacity: 0, x: '-50%', y: -18, filter: 'blur(12px)', scaleY: 0.96 }}
                animate={{ opacity: 1, x: '-50%', y: 0, filter: 'blur(0px)', scaleY: 1 }}
                exit={prefersReducedMotion
                  ? { opacity: 0, x: '-50%' }
                  : { opacity: 0, x: '-50%', y: -10, filter: 'blur(8px)', scaleY: 0.98 }}
                transition={{ duration: 0.44, ease: EASE_OUT }}
                onMouseEnter={cancelClose}
                onMouseLeave={scheduleClose}
                onWheel={(e) => e.stopPropagation()}
              >
                <div className="wmmBg" aria-hidden="true" />
                <div className="wmmScanlines" aria-hidden="true" />
                <span className="wmmTopBorder" aria-hidden="true" />
                <i className="wmmCorner wmmCornerTL" aria-hidden="true" />
                <i className="wmmCorner wmmCornerTR" aria-hidden="true" />
                <i className="wmmCorner wmmCornerBL" aria-hidden="true" />
                <i className="wmmCorner wmmCornerBR" aria-hidden="true" />

                <div className="wmmStatusBar" aria-hidden="true">
                  <span>SYS // WORK ARCHIVE</span>
                  <span>
                    CATEGORIES: {String(WORK_CATEGORIES.length).padStart(2, '0')} &nbsp;/&nbsp;
                    PROJECTS: {String(totalProjects).padStart(3, '0')}
                  </span>
                  <span>STATUS: ONLINE</span>
                </div>

                <div className="wmmBody">
                  {/* Left: Category rail */}
                  <aside className="wmmRail">
                    <div className="wmmRailHead">
                      <span className="wmmRailHeadLabel">CATEGORIES</span>
                    </div>
                    <div className="wmmRailList">
                      {WORK_CATEGORIES.map((cat, index) => {
                        const isActive = index === activeIndex;
                        return (
                          <button
                            key={cat.id}
                            type="button"
                            className={`wmmRailItem${isActive ? ' isActive' : ''}`}
                            onMouseEnter={() => handleCategoryChange(index)}
                            onFocus={() => handleCategoryChange(index)}
                            aria-pressed={isActive}
                          >
                            <span className="wmmRailNum">{String(index + 1).padStart(2, '0')}</span>
                            <span className="wmmRailName">{cat.name}</span>
                            <span className="wmmRailCount">{cat.projects.length}</span>
                          </button>
                        );
                      })}
                    </div>
                  </aside>

                  {/* Center: Project grid */}
                  <section className="wmmCenter">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={active.id}
                        className="wmmCenterInner"
                        initial={prefersReducedMotion ? false : { opacity: 0, x: 20, filter: 'blur(6px)' }}
                        animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                        exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, x: -16, filter: 'blur(4px)' }}
                        transition={{ duration: 0.28, ease: EASE_OUT }}
                      >
                        <div className="wmmCenterHead">
                          <div>
                            <span className="wmmKicker">WORK / {active.name.toUpperCase()}</span>
                            <h3 className="wmmCenterTitle">{active.name}</h3>
                            <p className="wmmCenterDesc">{active.description}</p>
                          </div>
                          <a href="/work" className="wmmViewAll">
                            View All Work
                            <svg viewBox="0 0 14 10" aria-hidden="true">
                              <path d="M1 5h11M8 1.5 12.5 5 8 8.5" fill="none" stroke="currentColor" strokeWidth="1.3" />
                            </svg>
                          </a>
                        </div>

                        <div className="wmmGridWrap">
                          <div className="wmmGrid">
                            {active.projects.map((project, index) => (
                              <a
                                key={project.slug}
                                className={`wmmCard${hoveredProject?.slug === project.slug ? ' isActive' : ''}`}
                                href={`/work/${project.slug}`}
                                role="menuitem"
                                onMouseEnter={() => setHoveredProject(project)}
                                onMouseLeave={() => setHoveredProject(null)}
                                onFocus={() => setHoveredProject(project)}
                              >
                                <span className="wmmCardIndex">{String(index + 1).padStart(2, '0')}</span>
                                <span className="wmmCardTitle">{project.title}</span>
                                <span className="wmmCardDesc">{project.description}</span>
                                <span className="wmmCardType">{normalizeType(project.type)}</span>
                              </a>
                            ))}
                          </div>
                          <div className="wmmGridFade" aria-hidden="true" />
                        </div>
                      </motion.div>
                    </AnimatePresence>
                  </section>

                  {/* Right: Preview / overview panel */}
                  <aside className="wmmPreview">
                    <AnimatePresence mode="wait">
                      {hoveredProject ? (
                        <motion.div
                          key={hoveredProject.slug}
                          className="wmmPreviewContent"
                          initial={prefersReducedMotion ? false : { opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -6 }}
                          transition={{ duration: 0.2, ease: EASE_OUT }}
                        >
                          <span className="wmmPreviewKicker">PROJECT BRIEF</span>
                          <h4 className="wmmPreviewTitle">{hoveredProject.title}</h4>
                          <p className="wmmPreviewDesc">{hoveredProject.description}</p>

                          <dl className="wmmPreviewMeta">
                            <div className="wmmPreviewMetaRow">
                              <dt>PLATFORM</dt>
                              <dd>{normalizeType(hoveredProject.type)}</dd>
                            </div>
                            <div className="wmmPreviewMetaRow">
                              <dt>SECTOR</dt>
                              <dd>{active.name}</dd>
                            </div>
                          </dl>

                          <a href={`/work/${hoveredProject.slug}`} className="wmmPreviewCta">
                            View Project
                            <svg viewBox="0 0 14 10" aria-hidden="true">
                              <path d="M1 5h11M8 1.5 12.5 5 8 8.5" fill="none" stroke="currentColor" strokeWidth="1.3" />
                            </svg>
                          </a>
                        </motion.div>
                      ) : (
                        <motion.div
                          key={`overview-${active.id}`}
                          className="wmmPreviewContent wmmPreviewOverview"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.18 }}
                        >
                          <span className="wmmPreviewKicker">CATEGORY OVERVIEW</span>
                          <h4 className="wmmPreviewTitle wmmPreviewTitleLg">{active.name}</h4>
                          <p className="wmmPreviewDesc">{active.description}</p>

                          <div className="wmmOverviewStat">
                            <span className="wmmOverviewNum">{String(active.projects.length).padStart(2, '0')}</span>
                            <span className="wmmOverviewLabel">Projects in this category</span>
                          </div>

                          <p className="wmmOverviewHint">Hover any project to see its brief →</p>

                          <a href={`/work?category=${active.id}`} className="wmmPreviewCta">
                            Explore {active.name}
                            <svg viewBox="0 0 14 10" aria-hidden="true">
                              <path d="M1 5h11M8 1.5 12.5 5 8 8.5" fill="none" stroke="currentColor" strokeWidth="1.3" />
                            </svg>
                          </a>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </aside>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>,
        document.body,
      )}

      <style jsx global>{`
        /* Desktop-only trigger wrapper */
        .wmmRoot { display: none; }
        @media (min-width: 1024px) {
          .wmmRoot { position: relative; display: inline-flex; align-items: center; }
        }

        /* Trigger */
        .wmmTrigger {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 0; border: 0; background: transparent;
          color: rgba(255,255,255,0.72);
          font: inherit; letter-spacing: inherit; text-transform: inherit;
          cursor: pointer; transition: color 140ms ease;
        }
        .wmmTrigger:hover, .wmmTrigger.isOpen, .wmmTrigger:focus-visible {
          color: #fff; outline: none;
        }
        .wmmChevron { width: 9px; height: 6px; transition: transform 240ms ${cssEase(EASE_OUT)}; }
        .wmmTrigger.isOpen .wmmChevron { transform: rotate(180deg); }

        /* Backdrop */
        .wmmBackdrop {
          position: fixed; inset: 0; top: ${HEADER_OFFSET}px;
          z-index: 58;
          background: rgba(0,0,0,0.52); backdrop-filter: blur(3px);
        }

        /* Panel */
        .wmmPanel {
          position: fixed; left: 50%; top: ${HEADER_OFFSET + 8}px; z-index: 60;
          width: min(calc(100vw - 40px), 1400px);
          height: min(72vh, 720px);
          display: flex; flex-direction: column;
          border: 1px solid rgba(255,255,255,0.11);
          background: linear-gradient(160deg, rgba(14,14,14,0.97) 0%, rgba(6,6,6,0.98) 100%);
          box-shadow: 0 54px 160px rgba(0,0,0,0.75), inset 0 1px 0 rgba(255,255,255,0.07);
          backdrop-filter: blur(22px);
          overflow: hidden; transform-origin: top center;
          will-change: transform, opacity, filter;
        }

        /* Blueprint grid bg */
        .wmmBg {
          position: absolute; inset: 0; z-index: 0; pointer-events: none;
          background-image:
            linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px);
          background-size: 54px 54px;
          mask-image: radial-gradient(ellipse 75% 55% at 80% 85%, #000 0%, transparent 82%);
          -webkit-mask-image: radial-gradient(ellipse 75% 55% at 80% 85%, #000 0%, transparent 82%);
        }

        /* Scanlines */
        .wmmScanlines {
          position: absolute; inset: 0; z-index: 1; pointer-events: none;
          background: repeating-linear-gradient(
            to bottom, transparent 0, transparent 2px,
            rgba(255,255,255,0.016) 3px, transparent 4px
          );
          opacity: 0.65;
        }

        /* Top border draw */
        .wmmTopBorder {
          position: absolute; left: 0; right: 0; top: 0; z-index: 2; height: 1px; pointer-events: none;
          background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.65) 25%, rgba(255,255,255,0.65) 75%, transparent 100%);
          animation: wmmBorderDraw 0.5s ${cssEase(EASE_OUT)} both;
        }
        @keyframes wmmBorderDraw {
          from { clip-path: inset(0 100% 0 0); }
          to   { clip-path: inset(0 0 0 0); }
        }

        /* Corners */
        .wmmCorner { position: absolute; z-index: 3; width: 16px; height: 16px; pointer-events: none; }
        .wmmCornerTL { left: -1px; top: -1px; border-left: 1px solid rgba(255,255,255,0.62); border-top: 1px solid rgba(255,255,255,0.62); }
        .wmmCornerTR { right: -1px; top: -1px; border-right: 1px solid rgba(255,255,255,0.62); border-top: 1px solid rgba(255,255,255,0.62); }
        .wmmCornerBL { left: -1px; bottom: -1px; border-left: 1px solid rgba(255,255,255,0.28); border-bottom: 1px solid rgba(255,255,255,0.28); }
        .wmmCornerBR { right: -1px; bottom: -1px; border-right: 1px solid rgba(255,255,255,0.28); border-bottom: 1px solid rgba(255,255,255,0.28); }

        /* Status bar */
        .wmmStatusBar {
          position: relative; z-index: 4; flex-shrink: 0;
          display: flex; align-items: center; justify-content: space-between;
          padding: 7px 22px;
          border-bottom: 1px solid rgba(255,255,255,0.07);
          background: rgba(255,255,255,0.016);
          color: rgba(255,255,255,0.26);
          font-family: var(--font-geist-mono, ui-monospace, monospace);
          font-size: 8.5px; font-weight: 800; letter-spacing: 0.2em; text-transform: uppercase;
        }

        /* 3-column body */
        .wmmBody {
          position: relative; z-index: 4;
          flex: 1; min-height: 0;
          display: grid;
          grid-template-columns: 218px minmax(0,1fr) 282px;
        }

        /* ── Rail ── */
        .wmmRail {
          display: flex; flex-direction: column;
          border-right: 1px solid rgba(255,255,255,0.07);
          background: rgba(255,255,255,0.01);
          overflow: hidden;
        }
        .wmmRailHead {
          flex-shrink: 0; padding: 14px 18px 10px;
          border-bottom: 1px solid rgba(255,255,255,0.06);
        }
        .wmmRailHeadLabel {
          color: rgba(255,255,255,0.3);
          font-family: var(--font-geist-mono, ui-monospace, monospace);
          font-size: 8.5px; font-weight: 800; letter-spacing: 0.24em; text-transform: uppercase;
        }
        .wmmRailList {
          flex: 1; min-height: 0; display: flex; flex-direction: column;
          padding: 8px 0; overflow-y: auto; overscroll-behavior: contain;
          scrollbar-width: thin; scrollbar-color: rgba(255,255,255,0.09) transparent;
        }
        .wmmRailItem {
          position: relative;
          display: grid; grid-template-columns: 26px 1fr 24px; align-items: center; gap: 8px;
          width: 100%; padding: 9px 14px 9px 18px;
          border: none; background: transparent;
          color: rgba(255,255,255,0.5);
          font: inherit; text-align: left; cursor: pointer;
          transition: color 150ms ease, background 150ms ease;
        }
        .wmmRailItem:hover, .wmmRailItem:focus-visible {
          color: rgba(255,255,255,0.88); background: rgba(255,255,255,0.034); outline: none;
        }
        .wmmRailItem.isActive { color: #fff; background: rgba(255,255,255,0.052); }
        .wmmRailItem.isActive::before {
          content: ''; position: absolute; left: 0; top: 0; bottom: 0;
          width: 2px; background: #fff;
        }
        .wmmRailNum {
          color: rgba(255,255,255,0.26);
          font-family: var(--font-geist-mono, ui-monospace, monospace);
          font-size: 9.5px; font-weight: 800; letter-spacing: 0.06em;
        }
        .wmmRailItem.isActive .wmmRailNum { color: rgba(255,255,255,0.52); }
        .wmmRailName {
          font-family: var(--font-geist-mono, ui-monospace, monospace);
          font-size: 11px; font-weight: 700; letter-spacing: 0.04em; text-transform: uppercase;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }
        .wmmRailCount {
          flex-shrink: 0; display: inline-flex; align-items: center; justify-content: center;
          width: 22px; height: 16px;
          border: 1px solid rgba(255,255,255,0.12); background: rgba(255,255,255,0.034);
          color: rgba(255,255,255,0.42);
          font-family: var(--font-geist-mono, ui-monospace, monospace);
          font-size: 8px; font-weight: 800; letter-spacing: 0.04em;
          opacity: 0; transition: opacity 150ms ease;
        }
        .wmmRailItem:hover .wmmRailCount, .wmmRailItem.isActive .wmmRailCount { opacity: 1; }

        /* ── Center ── */
        .wmmCenter {
          display: flex; flex-direction: column;
          min-width: 0; min-height: 0;
          border-right: 1px solid rgba(255,255,255,0.07);
          overflow: hidden;
        }
        .wmmCenterInner {
          display: flex; flex-direction: column; height: 100%; min-height: 0;
          will-change: transform, opacity, filter;
        }
        .wmmCenterHead {
          flex-shrink: 0;
          display: flex; align-items: flex-start; justify-content: space-between; gap: 16px;
          padding: 18px 22px 14px;
          border-bottom: 1px solid rgba(255,255,255,0.07);
        }
        .wmmKicker {
          display: block; color: rgba(255,255,255,0.28);
          font-family: var(--font-geist-mono, ui-monospace, monospace);
          font-size: 8.5px; font-weight: 800; letter-spacing: 0.22em; text-transform: uppercase;
        }
        .wmmCenterTitle {
          margin: 6px 0 0; color: rgba(255,255,255,0.97);
          font-family: var(--font-geist-mono, ui-monospace, monospace);
          font-size: 20px; font-weight: 400; letter-spacing: 0.02em; line-height: 1; text-transform: uppercase;
        }
        .wmmCenterDesc {
          margin: 6px 0 0; color: rgba(255,255,255,0.44);
          font-family: var(--font-geist-sans, sans-serif);
          font-size: 12.5px; line-height: 1.45;
        }
        .wmmViewAll {
          flex-shrink: 0; display: inline-flex; align-items: center; gap: 8px;
          padding: 7px 13px;
          border: 1px solid rgba(255,255,255,0.18); background: transparent;
          color: rgba(255,255,255,0.7);
          font-family: var(--font-geist-mono, ui-monospace, monospace);
          font-size: 9.5px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase;
          text-decoration: none; white-space: nowrap;
          transition: color 160ms ease, border-color 160ms ease, background 160ms ease;
        }
        .wmmViewAll svg { width: 13px; height: 9px; transition: transform 200ms ease; }
        .wmmViewAll:hover { color: #fff; border-color: rgba(255,255,255,0.52); background: rgba(255,255,255,0.055); }
        .wmmViewAll:hover svg { transform: translateX(3px); }

        /* Grid area */
        .wmmGridWrap { position: relative; flex: 1; min-height: 0; overflow: hidden; }
        .wmmGrid {
          height: 100%;
          display: grid; grid-template-columns: repeat(3, minmax(0,1fr));
          grid-auto-rows: max-content; gap: 7px;
          padding: 16px 22px 40px;
          overflow-y: auto; overscroll-behavior: contain;
          scrollbar-width: thin; scrollbar-color: rgba(255,255,255,0.12) transparent;
        }
        .wmmGrid::-webkit-scrollbar { width: 4px; }
        .wmmGrid::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.12); border-radius: 4px; }
        .wmmGridFade {
          position: absolute; left: 0; right: 6px; bottom: 0; height: 44px; pointer-events: none;
          background: linear-gradient(to top, rgba(8,8,8,0.92) 0%, transparent 100%);
        }

        /* Project card */
        .wmmCard {
          position: relative; display: flex; flex-direction: column; gap: 4px;
          padding: 11px 12px 30px;
          border: 1px solid rgba(255,255,255,0.07);
          background: rgba(255,255,255,0.016);
          color: inherit; text-decoration: none; overflow: hidden;
          transition: border-color 170ms ease, background 170ms ease;
        }
        .wmmCard:hover, .wmmCard:focus-visible, .wmmCard.isActive {
          border-color: rgba(255,255,255,0.28); background: rgba(255,255,255,0.05); outline: none;
        }
        .wmmCard::before {
          content: ''; position: absolute; left: 0; top: 0;
          width: 0; height: 1px;
          background: linear-gradient(90deg, rgba(255,255,255,0.7), transparent);
          transition: width 260ms ${cssEase(EASE_OUT)};
        }
        .wmmCard:hover::before, .wmmCard:focus-visible::before, .wmmCard.isActive::before { width: 100%; }
        .wmmCard.isActive::after {
          content: ''; position: absolute; right: 5px; bottom: 5px;
          width: 8px; height: 8px;
          border-right: 1px solid rgba(255,255,255,0.45);
          border-bottom: 1px solid rgba(255,255,255,0.45);
        }
        .wmmCardIndex {
          color: rgba(255,255,255,0.24);
          font-family: var(--font-geist-mono, ui-monospace, monospace);
          font-size: 8.5px; font-weight: 800; letter-spacing: 0.1em;
        }
        .wmmCardTitle {
          color: rgba(255,255,255,0.86);
          font-family: var(--font-geist-mono, ui-monospace, monospace);
          font-size: 11px; font-weight: 700; letter-spacing: 0.02em; line-height: 1.3;
        }
        .wmmCard:hover .wmmCardTitle, .wmmCard.isActive .wmmCardTitle { color: #fff; }
        .wmmCardDesc {
          color: rgba(255,255,255,0.38);
          font-family: var(--font-geist-sans, sans-serif);
          font-size: 10.5px; line-height: 1.35;
          overflow: hidden; display: -webkit-box;
          -webkit-line-clamp: 2; -webkit-box-orient: vertical;
        }
        .wmmCardType {
          position: absolute; bottom: 8px; left: 12px;
          color: rgba(255,255,255,0.22);
          font-family: var(--font-geist-mono, ui-monospace, monospace);
          font-size: 7.5px; font-weight: 800; letter-spacing: 0.14em;
        }

        /* ── Preview ── */
        .wmmPreview {
          display: flex; flex-direction: column;
          min-width: 0; min-height: 0;
          background: rgba(255,255,255,0.008);
          overflow: hidden;
        }
        .wmmPreviewContent {
          display: flex; flex-direction: column; height: 100%;
          padding: 22px 20px 20px;
          overflow-y: auto; overscroll-behavior: contain;
          scrollbar-width: thin; scrollbar-color: rgba(255,255,255,0.07) transparent;
        }
        .wmmPreviewKicker {
          display: block; color: rgba(255,255,255,0.28);
          font-family: var(--font-geist-mono, ui-monospace, monospace);
          font-size: 8.5px; font-weight: 800; letter-spacing: 0.22em; text-transform: uppercase;
          margin-bottom: 10px;
        }
        .wmmPreviewTitle {
          margin: 0 0 9px; color: #fff;
          font-family: var(--font-geist-mono, ui-monospace, monospace);
          font-size: 15px; font-weight: 700; letter-spacing: 0.02em; line-height: 1.3; text-transform: uppercase;
        }
        .wmmPreviewTitleLg { font-size: 19px; }
        .wmmPreviewDesc {
          margin: 0 0 18px; color: rgba(255,255,255,0.52);
          font-family: var(--font-geist-sans, sans-serif);
          font-size: 12.5px; line-height: 1.55;
        }
        .wmmPreviewMeta {
          display: flex; flex-direction: column; gap: 0;
          margin: 0 0 18px;
          border: 1px solid rgba(255,255,255,0.08);
        }
        .wmmPreviewMetaRow {
          display: grid; grid-template-columns: 80px 1fr;
          padding: 8px 12px;
          border-bottom: 1px solid rgba(255,255,255,0.06);
        }
        .wmmPreviewMetaRow:last-child { border-bottom: none; }
        .wmmPreviewMetaRow dt {
          color: rgba(255,255,255,0.26);
          font-family: var(--font-geist-mono, ui-monospace, monospace);
          font-size: 8.5px; font-weight: 800; letter-spacing: 0.16em; text-transform: uppercase;
          align-self: center;
        }
        .wmmPreviewMetaRow dd {
          margin: 0; color: rgba(255,255,255,0.78);
          font-family: var(--font-geist-mono, ui-monospace, monospace);
          font-size: 11px; font-weight: 600; letter-spacing: 0.02em;
        }

        .wmmPreviewCta {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 9px 14px;
          border: 1px solid rgba(255,255,255,0.2); background: transparent;
          color: rgba(255,255,255,0.78);
          font-family: var(--font-geist-mono, ui-monospace, monospace);
          font-size: 10px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase;
          text-decoration: none; margin-top: auto;
          transition: color 160ms ease, border-color 160ms ease, background 160ms ease;
        }
        .wmmPreviewCta svg { width: 13px; height: 9px; transition: transform 200ms ease; }
        .wmmPreviewCta:hover { color: #fff; border-color: rgba(255,255,255,0.56); background: rgba(255,255,255,0.055); }
        .wmmPreviewCta:hover svg { transform: translateX(3px); }

        /* Overview state */
        .wmmOverviewStat {
          display: flex; align-items: baseline; gap: 10px;
          margin: 0 0 14px; padding: 16px;
          border: 1px solid rgba(255,255,255,0.08); background: rgba(255,255,255,0.016);
        }
        .wmmOverviewNum {
          color: #fff;
          font-family: var(--font-geist-mono, ui-monospace, monospace);
          font-size: 38px; font-weight: 400; letter-spacing: -0.02em; line-height: 1;
        }
        .wmmOverviewLabel {
          color: rgba(255,255,255,0.42);
          font-family: var(--font-geist-mono, ui-monospace, monospace);
          font-size: 10px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase;
        }
        .wmmOverviewHint {
          margin: 0 0 auto; color: rgba(255,255,255,0.24);
          font-family: var(--font-geist-sans, sans-serif);
          font-size: 11.5px; line-height: 1.5;
        }

        /* Desktop-only: guard portaled overlay */
        @media (max-width: 1023px) {
          .wmmBackdrop, .wmmPanel { display: none !important; }
        }

        @media (prefers-reduced-motion: reduce) {
          .wmmTopBorder, .wmmChevron, .wmmCard, .wmmCard::before,
          .wmmViewAll svg, .wmmPreviewCta svg { animation: none !important; transition: none !important; }
        }
      `}</style>
    </div>
  );
}
