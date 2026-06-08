'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { INDUSTRIES, type Solution } from '../../../public/megaMenuData';
import { getSolutionPreview } from './servicesMeta';

const EASE_OUT = [0.22, 1, 0.36, 1] as const;
const HEADER_OFFSET = 66;

export default function ServicesMegaMenu() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [hoveredSolution, setHoveredSolution] = useState<Solution | null>(null);
  const closeTimer = useRef<number | undefined>(undefined);
  const prefersReducedMotion = useReducedMotion();

  // Portal target only exists on the client.
  useEffect(() => setMounted(true), []);

  const active = INDUSTRIES[activeIndex];

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

  const handleIndustryChange = (index: number) => {
    setActiveIndex(index);
    setHoveredSolution(null);
  };

  const preview = hoveredSolution ? getSolutionPreview(hoveredSolution, active) : null;

  return (
    <div
      className="smmRoot"
      onMouseEnter={openMenu}
      onMouseLeave={scheduleClose}
    >
      <button
        type="button"
        className={`smmTrigger${open ? ' isOpen' : ''}`}
        aria-haspopup="true"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        onFocus={openMenu}
      >
        Services
        <svg className="smmChevron" viewBox="0 0 12 8" aria-hidden="true">
          <path d="M1 1.5 6 6.5 11 1.5" fill="none" stroke="currentColor" strokeWidth="1.4" />
        </svg>
      </button>

      {mounted && createPortal(
        <AnimatePresence>
        {open && (
          <>
            <motion.div
              key="smm-backdrop"
              className="smmBackdrop"
              aria-hidden="true"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setOpen(false)}
              onMouseEnter={scheduleClose}
            />

            <motion.div
              key="smm-panel"
              className="smmPanel"
              role="dialog"
              aria-label="Services mega menu"
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
              <div className="smmBg" aria-hidden="true" />
              <div className="smmScanlines" aria-hidden="true" />
              <span className="smmTopBorder" aria-hidden="true" />
              <i className="smmCorner smmCornerTL" aria-hidden="true" />
              <i className="smmCorner smmCornerTR" aria-hidden="true" />
              <i className="smmCorner smmCornerBL" aria-hidden="true" />
              <i className="smmCorner smmCornerBR" aria-hidden="true" />

              <div className="smmStatusBar" aria-hidden="true">
                <span>SYS // MISSION CONTROL</span>
                <span>
                  INDUSTRIES: {String(INDUSTRIES.length).padStart(2, '0')} &nbsp;/&nbsp;
                  SOLUTIONS: {String(INDUSTRIES.reduce((a, i) => a + i.solutions.length, 0)).padStart(3, '0')}
                </span>
                <span>STATUS: ONLINE</span>
              </div>

              <div className="smmBody">
                {/* Left: Industry rail */}
                <aside className="smmRail">
                  <div className="smmRailHead">
                    <span className="smmRailHeadLabel">SECTORS</span>
                  </div>
                  <div className="smmRailList">
                    {INDUSTRIES.map((industry, index) => {
                      const isActive = index === activeIndex;
                      return (
                        <button
                          key={industry.id}
                          type="button"
                          className={`smmRailItem${isActive ? ' isActive' : ''}`}
                          onMouseEnter={() => handleIndustryChange(index)}
                          onFocus={() => handleIndustryChange(index)}
                          aria-pressed={isActive}
                        >
                          <span className="smmRailNum">{String(index + 1).padStart(2, '0')}</span>
                          <span className="smmRailName">{industry.name}</span>
                          <span className="smmRailCount">{industry.solutions.length}</span>
                        </button>
                      );
                    })}
                  </div>
                </aside>

                {/* Center: Solution grid */}
                <section className="smmCenter">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={active.id}
                      className="smmCenterInner"
                      initial={prefersReducedMotion ? false : { opacity: 0, x: 20, filter: 'blur(6px)' }}
                      animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                      exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, x: -16, filter: 'blur(4px)' }}
                      transition={{ duration: 0.28, ease: EASE_OUT }}
                    >
                      <div className="smmCenterHead">
                        <div>
                          <span className="smmKicker">SERVICES / {active.name.toUpperCase()}</span>
                          <h3 className="smmCenterTitle">{active.name}</h3>
                          <p className="smmCenterDesc">{active.description}</p>
                        </div>
                        <a href="/services" className="smmViewAll">
                          View All Solutions
                          <svg viewBox="0 0 14 10" aria-hidden="true">
                            <path d="M1 5h11M8 1.5 12.5 5 8 8.5" fill="none" stroke="currentColor" strokeWidth="1.3" />
                          </svg>
                        </a>
                      </div>

                      <div className="smmGridWrap">
                        <div className="smmGrid">
                          {active.solutions.map((solution, index) => (
                            <a
                              key={solution.href}
                              className={`smmCard${hoveredSolution?.href === solution.href ? ' isActive' : ''}`}
                              href={solution.href}
                              role="menuitem"
                              onMouseEnter={() => setHoveredSolution(solution)}
                              onMouseLeave={() => setHoveredSolution(null)}
                              onFocus={() => setHoveredSolution(solution)}
                            >
                              <span className="smmCardIndex">{String(index + 1).padStart(2, '0')}</span>
                              <span className="smmCardTitle">{solution.title}</span>
                              <span className="smmCardDesc">{solution.description}</span>
                            </a>
                          ))}
                        </div>
                        <div className="smmGridFade" aria-hidden="true" />
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </section>

                {/* Right: Preview panel */}
                <aside className="smmPreview">
                  <AnimatePresence mode="wait">
                    {hoveredSolution && preview ? (
                      <motion.div
                        key={hoveredSolution.href}
                        className="smmPreviewContent"
                        initial={prefersReducedMotion ? false : { opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.2, ease: EASE_OUT }}
                      >
                        <span className="smmPreviewKicker">SOLUTION BRIEF</span>
                        <h4 className="smmPreviewTitle">{hoveredSolution.title}</h4>
                        <p className="smmPreviewDesc">{hoveredSolution.description}</p>

                        <dl className="smmPreviewMeta">
                          <div className="smmPreviewMetaRow">
                            <dt>BEST FOR</dt>
                            <dd>{preview.bestFor}</dd>
                          </div>
                          <div className="smmPreviewMetaRow">
                            <dt>TIMELINE</dt>
                            <dd>{preview.timeline}</dd>
                          </div>
                          <div className="smmPreviewMetaRow">
                            <dt>COMPLEXITY</dt>
                            <dd>
                              <span className={`smmComplexity smmC-${preview.complexity.toLowerCase()}`}>
                                {preview.complexity}
                              </span>
                            </dd>
                          </div>
                        </dl>

                        <div className="smmPreviewModules">
                          <span className="smmPreviewModulesLabel">CORE MODULES</span>
                          <div className="smmPreviewTags">
                            {preview.modules.map((tag) => (
                              <span key={tag} className="smmTag">{tag}</span>
                            ))}
                          </div>
                        </div>

                        <a href={hoveredSolution.href} className="smmPreviewCta">
                          View Solution
                          <svg viewBox="0 0 14 10" aria-hidden="true">
                            <path d="M1 5h11M8 1.5 12.5 5 8 8.5" fill="none" stroke="currentColor" strokeWidth="1.3" />
                          </svg>
                        </a>
                      </motion.div>
                    ) : (
                      <motion.div
                        key={`overview-${active.id}`}
                        className="smmPreviewContent smmPreviewOverview"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.18 }}
                      >
                        <span className="smmPreviewKicker">SECTOR OVERVIEW</span>
                        <h4 className="smmPreviewTitle smmPreviewTitleLg">{active.name}</h4>
                        <p className="smmPreviewDesc">{active.description}</p>

                        <div className="smmOverviewStat">
                          <span className="smmOverviewNum">{String(active.solutions.length).padStart(2, '0')}</span>
                          <span className="smmOverviewLabel">Available Solutions</span>
                        </div>

                        <p className="smmOverviewHint">Hover any solution to see its brief →</p>

                        <a href={`/services?industry=${active.id}`} className="smmPreviewCta">
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
        /* Desktop-only */
        .smmRoot { display: none; }
        @media (min-width: 1024px) {
          .smmRoot { position: relative; display: inline-flex; align-items: center; }
        }

        /* Trigger */
        .smmTrigger {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 0; border: 0; background: transparent;
          color: rgba(255,255,255,0.72);
          font: inherit; letter-spacing: inherit; text-transform: inherit;
          cursor: pointer; transition: color 140ms ease;
        }
        .smmTrigger:hover, .smmTrigger.isOpen, .smmTrigger:focus-visible {
          color: #fff; outline: none;
        }
        .smmChevron { width: 9px; height: 6px; transition: transform 240ms ${cssEase(EASE_OUT)}; }
        .smmTrigger.isOpen .smmChevron { transform: rotate(180deg); }

        /* Backdrop */
        .smmBackdrop {
          position: fixed; inset: 0; top: ${HEADER_OFFSET}px;
          z-index: 58;
          background: rgba(0,0,0,0.52); backdrop-filter: blur(3px);
        }

        /* Panel */
        .smmPanel {
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

        /* Blueprint grid */
        .smmBg {
          position: absolute; inset: 0; z-index: 0; pointer-events: none;
          background-image:
            linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px);
          background-size: 54px 54px;
          mask-image: radial-gradient(ellipse 75% 55% at 20% 15%, #000 0%, transparent 82%);
          -webkit-mask-image: radial-gradient(ellipse 75% 55% at 20% 15%, #000 0%, transparent 82%);
        }

        /* Scanlines */
        .smmScanlines {
          position: absolute; inset: 0; z-index: 1; pointer-events: none;
          background: repeating-linear-gradient(
            to bottom, transparent 0, transparent 2px,
            rgba(255,255,255,0.016) 3px, transparent 4px
          );
          opacity: 0.65;
        }

        /* Top border draw */
        .smmTopBorder {
          position: absolute; left: 0; right: 0; top: 0; z-index: 2; height: 1px; pointer-events: none;
          background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.65) 25%, rgba(255,255,255,0.65) 75%, transparent 100%);
          animation: smmBorderDraw 0.5s ${cssEase(EASE_OUT)} both;
        }
        @keyframes smmBorderDraw {
          from { clip-path: inset(0 100% 0 0); }
          to   { clip-path: inset(0 0 0 0); }
        }

        /* Corners */
        .smmCorner { position: absolute; z-index: 3; width: 16px; height: 16px; pointer-events: none; }
        .smmCornerTL { left: -1px; top: -1px; border-left: 1px solid rgba(255,255,255,0.62); border-top: 1px solid rgba(255,255,255,0.62); }
        .smmCornerTR { right: -1px; top: -1px; border-right: 1px solid rgba(255,255,255,0.62); border-top: 1px solid rgba(255,255,255,0.62); }
        .smmCornerBL { left: -1px; bottom: -1px; border-left: 1px solid rgba(255,255,255,0.28); border-bottom: 1px solid rgba(255,255,255,0.28); }
        .smmCornerBR { right: -1px; bottom: -1px; border-right: 1px solid rgba(255,255,255,0.28); border-bottom: 1px solid rgba(255,255,255,0.28); }

        /* Status bar */
        .smmStatusBar {
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
        .smmBody {
          position: relative; z-index: 4;
          flex: 1; min-height: 0;
          display: grid;
          grid-template-columns: 208px minmax(0,1fr) 282px;
        }

        /* ── Rail ── */
        .smmRail {
          display: flex; flex-direction: column;
          border-right: 1px solid rgba(255,255,255,0.07);
          background: rgba(255,255,255,0.01);
          overflow: hidden;
        }
        .smmRailHead {
          flex-shrink: 0; padding: 14px 18px 10px;
          border-bottom: 1px solid rgba(255,255,255,0.06);
        }
        .smmRailHeadLabel {
          color: rgba(255,255,255,0.3);
          font-family: var(--font-geist-mono, ui-monospace, monospace);
          font-size: 8.5px; font-weight: 800; letter-spacing: 0.24em; text-transform: uppercase;
        }
        .smmRailList {
          flex: 1; min-height: 0; display: flex; flex-direction: column;
          padding: 8px 0; overflow-y: auto; overscroll-behavior: contain;
          scrollbar-width: thin; scrollbar-color: rgba(255,255,255,0.09) transparent;
        }
        .smmRailItem {
          position: relative;
          display: grid; grid-template-columns: 26px 1fr 24px; align-items: center; gap: 8px;
          width: 100%; padding: 9px 14px 9px 18px;
          border: none; background: transparent;
          color: rgba(255,255,255,0.5);
          font: inherit; text-align: left; cursor: pointer;
          transition: color 150ms ease, background 150ms ease;
        }
        .smmRailItem:hover, .smmRailItem:focus-visible {
          color: rgba(255,255,255,0.88); background: rgba(255,255,255,0.034); outline: none;
        }
        .smmRailItem.isActive { color: #fff; background: rgba(255,255,255,0.052); }
        .smmRailItem.isActive::before {
          content: ''; position: absolute; left: 0; top: 0; bottom: 0;
          width: 2px; background: #fff;
        }
        .smmRailNum {
          color: rgba(255,255,255,0.26);
          font-family: var(--font-geist-mono, ui-monospace, monospace);
          font-size: 9.5px; font-weight: 800; letter-spacing: 0.06em;
        }
        .smmRailItem.isActive .smmRailNum { color: rgba(255,255,255,0.52); }
        .smmRailName {
          font-family: var(--font-geist-mono, ui-monospace, monospace);
          font-size: 12px; font-weight: 700; letter-spacing: 0.04em; text-transform: uppercase;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }
        .smmRailCount {
          flex-shrink: 0; display: inline-flex; align-items: center; justify-content: center;
          width: 22px; height: 16px;
          border: 1px solid rgba(255,255,255,0.12); background: rgba(255,255,255,0.034);
          color: rgba(255,255,255,0.42);
          font-family: var(--font-geist-mono, ui-monospace, monospace);
          font-size: 8px; font-weight: 800; letter-spacing: 0.04em;
          opacity: 0; transition: opacity 150ms ease;
        }
        .smmRailItem:hover .smmRailCount, .smmRailItem.isActive .smmRailCount { opacity: 1; }

        /* ── Center ── */
        .smmCenter {
          display: flex; flex-direction: column;
          min-width: 0; min-height: 0;
          border-right: 1px solid rgba(255,255,255,0.07);
          overflow: hidden;
        }
        .smmCenterInner {
          display: flex; flex-direction: column; height: 100%; min-height: 0;
          will-change: transform, opacity, filter;
        }
        .smmCenterHead {
          flex-shrink: 0;
          display: flex; align-items: flex-start; justify-content: space-between; gap: 16px;
          padding: 18px 22px 14px;
          border-bottom: 1px solid rgba(255,255,255,0.07);
        }
        .smmKicker {
          display: block; color: rgba(255,255,255,0.28);
          font-family: var(--font-geist-mono, ui-monospace, monospace);
          font-size: 8.5px; font-weight: 800; letter-spacing: 0.22em; text-transform: uppercase;
        }
        .smmCenterTitle {
          margin: 6px 0 0; color: rgba(255,255,255,0.97);
          font-family: var(--font-geist-mono, ui-monospace, monospace);
          font-size: 22px; font-weight: 400; letter-spacing: 0.02em; line-height: 1; text-transform: uppercase;
        }
        .smmCenterDesc {
          margin: 6px 0 0; color: rgba(255,255,255,0.44);
          font-family: var(--font-geist-sans, sans-serif);
          font-size: 12.5px; line-height: 1.45;
        }
        .smmViewAll {
          flex-shrink: 0; display: inline-flex; align-items: center; gap: 8px;
          padding: 7px 13px;
          border: 1px solid rgba(255,255,255,0.18); background: transparent;
          color: rgba(255,255,255,0.7);
          font-family: var(--font-geist-mono, ui-monospace, monospace);
          font-size: 9.5px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase;
          text-decoration: none; white-space: nowrap;
          transition: color 160ms ease, border-color 160ms ease, background 160ms ease;
        }
        .smmViewAll svg { width: 13px; height: 9px; transition: transform 200ms ease; }
        .smmViewAll:hover { color: #fff; border-color: rgba(255,255,255,0.52); background: rgba(255,255,255,0.055); }
        .smmViewAll:hover svg { transform: translateX(3px); }

        /* Grid area */
        .smmGridWrap { position: relative; flex: 1; min-height: 0; overflow: hidden; }
        .smmGrid {
          height: 100%;
          display: grid; grid-template-columns: repeat(3, minmax(0,1fr));
          grid-auto-rows: max-content; gap: 7px;
          padding: 16px 22px 40px;
          overflow-y: auto; overscroll-behavior: contain;
          scrollbar-width: thin; scrollbar-color: rgba(255,255,255,0.12) transparent;
        }
        .smmGrid::-webkit-scrollbar { width: 4px; }
        .smmGrid::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.12); border-radius: 4px; }
        .smmGridFade {
          position: absolute; left: 0; right: 6px; bottom: 0; height: 44px; pointer-events: none;
          background: linear-gradient(to top, rgba(8,8,8,0.92) 0%, transparent 100%);
        }

        /* Solution card */
        .smmCard {
          position: relative; display: flex; flex-direction: column; gap: 4px;
          padding: 11px 12px 12px;
          border: 1px solid rgba(255,255,255,0.07);
          background: rgba(255,255,255,0.016);
          color: inherit; text-decoration: none; overflow: hidden;
          transition: border-color 170ms ease, background 170ms ease;
        }
        .smmCard:hover, .smmCard:focus-visible, .smmCard.isActive {
          border-color: rgba(255,255,255,0.28); background: rgba(255,255,255,0.05); outline: none;
        }
        .smmCard::before {
          content: ''; position: absolute; left: 0; top: 0;
          width: 0; height: 1px;
          background: linear-gradient(90deg, rgba(255,255,255,0.7), transparent);
          transition: width 260ms ${cssEase(EASE_OUT)};
        }
        .smmCard:hover::before, .smmCard:focus-visible::before, .smmCard.isActive::before { width: 100%; }
        .smmCard.isActive::after {
          content: ''; position: absolute; right: 5px; bottom: 5px;
          width: 8px; height: 8px;
          border-right: 1px solid rgba(255,255,255,0.45);
          border-bottom: 1px solid rgba(255,255,255,0.45);
        }
        .smmCardIndex {
          color: rgba(255,255,255,0.24);
          font-family: var(--font-geist-mono, ui-monospace, monospace);
          font-size: 8.5px; font-weight: 800; letter-spacing: 0.1em;
        }
        .smmCardTitle {
          color: rgba(255,255,255,0.86);
          font-family: var(--font-geist-mono, ui-monospace, monospace);
          font-size: 11.5px; font-weight: 700; letter-spacing: 0.02em; line-height: 1.3;
        }
        .smmCard:hover .smmCardTitle, .smmCard.isActive .smmCardTitle { color: #fff; }
        .smmCardDesc {
          color: rgba(255,255,255,0.38);
          font-family: var(--font-geist-sans, sans-serif);
          font-size: 10.5px; line-height: 1.35;
          overflow: hidden; display: -webkit-box;
          -webkit-line-clamp: 2; -webkit-box-orient: vertical;
        }

        /* ── Preview ── */
        .smmPreview {
          display: flex; flex-direction: column;
          min-width: 0; min-height: 0;
          background: rgba(255,255,255,0.008);
          overflow: hidden;
        }
        .smmPreviewContent {
          display: flex; flex-direction: column; height: 100%;
          padding: 22px 20px 20px;
          overflow-y: auto; overscroll-behavior: contain;
          scrollbar-width: thin; scrollbar-color: rgba(255,255,255,0.07) transparent;
        }
        .smmPreviewKicker {
          display: block; color: rgba(255,255,255,0.28);
          font-family: var(--font-geist-mono, ui-monospace, monospace);
          font-size: 8.5px; font-weight: 800; letter-spacing: 0.22em; text-transform: uppercase;
          margin-bottom: 10px;
        }
        .smmPreviewTitle {
          margin: 0 0 9px; color: #fff;
          font-family: var(--font-geist-mono, ui-monospace, monospace);
          font-size: 15px; font-weight: 700; letter-spacing: 0.02em; line-height: 1.3; text-transform: uppercase;
        }
        .smmPreviewTitleLg { font-size: 20px; }
        .smmPreviewDesc {
          margin: 0 0 18px; color: rgba(255,255,255,0.52);
          font-family: var(--font-geist-sans, sans-serif);
          font-size: 12.5px; line-height: 1.55;
        }
        .smmPreviewMeta {
          display: flex; flex-direction: column; gap: 0;
          margin: 0 0 18px;
          border: 1px solid rgba(255,255,255,0.08);
        }
        .smmPreviewMetaRow {
          display: grid; grid-template-columns: 88px 1fr;
          padding: 8px 12px;
          border-bottom: 1px solid rgba(255,255,255,0.06);
        }
        .smmPreviewMetaRow:last-child { border-bottom: none; }
        .smmPreviewMetaRow dt {
          color: rgba(255,255,255,0.26);
          font-family: var(--font-geist-mono, ui-monospace, monospace);
          font-size: 8.5px; font-weight: 800; letter-spacing: 0.16em; text-transform: uppercase;
          align-self: center;
        }
        .smmPreviewMetaRow dd {
          margin: 0; color: rgba(255,255,255,0.78);
          font-family: var(--font-geist-mono, ui-monospace, monospace);
          font-size: 11px; font-weight: 600; letter-spacing: 0.02em;
        }
        .smmComplexity {
          display: inline-block; padding: 2px 7px;
          font-size: 9px; font-weight: 800; letter-spacing: 0.12em; text-transform: uppercase;
          border: 1px solid rgba(255,255,255,0.16);
        }
        .smmC-low     { color: rgba(255,255,255,0.65); }
        .smmC-medium  { color: rgba(255,255,255,0.82); }
        .smmC-high    { color: rgba(255,255,255,1); border-color: rgba(255,255,255,0.38); }
        .smmC-critical{ color: #fff; border-color: rgba(255,255,255,0.56); background: rgba(255,255,255,0.07); }

        .smmPreviewModules { margin-bottom: 20px; }
        .smmPreviewModulesLabel {
          display: block; color: rgba(255,255,255,0.26);
          font-family: var(--font-geist-mono, ui-monospace, monospace);
          font-size: 8.5px; font-weight: 800; letter-spacing: 0.22em; text-transform: uppercase;
          margin-bottom: 8px;
        }
        .smmPreviewTags { display: flex; flex-wrap: wrap; gap: 5px; }
        .smmTag {
          display: inline-flex; padding: 4px 9px;
          border: 1px solid rgba(255,255,255,0.13); background: rgba(255,255,255,0.028);
          color: rgba(255,255,255,0.62);
          font-family: var(--font-geist-mono, ui-monospace, monospace);
          font-size: 9.5px; font-weight: 700; letter-spacing: 0.06em;
        }
        .smmPreviewCta {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 9px 14px;
          border: 1px solid rgba(255,255,255,0.2); background: transparent;
          color: rgba(255,255,255,0.78);
          font-family: var(--font-geist-mono, ui-monospace, monospace);
          font-size: 10px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase;
          text-decoration: none; margin-top: auto;
          transition: color 160ms ease, border-color 160ms ease, background 160ms ease;
        }
        .smmPreviewCta svg { width: 13px; height: 9px; transition: transform 200ms ease; }
        .smmPreviewCta:hover { color: #fff; border-color: rgba(255,255,255,0.56); background: rgba(255,255,255,0.055); }
        .smmPreviewCta:hover svg { transform: translateX(3px); }

        /* Overview state */
        .smmOverviewStat {
          display: flex; align-items: baseline; gap: 10px;
          margin: 0 0 14px; padding: 16px;
          border: 1px solid rgba(255,255,255,0.08); background: rgba(255,255,255,0.016);
        }
        .smmOverviewNum {
          color: #fff;
          font-family: var(--font-geist-mono, ui-monospace, monospace);
          font-size: 38px; font-weight: 400; letter-spacing: -0.02em; line-height: 1;
        }
        .smmOverviewLabel {
          color: rgba(255,255,255,0.42);
          font-family: var(--font-geist-mono, ui-monospace, monospace);
          font-size: 10px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase;
        }
        .smmOverviewHint {
          margin: 0 0 auto; color: rgba(255,255,255,0.24);
          font-family: var(--font-geist-sans, sans-serif);
          font-size: 11.5px; line-height: 1.5;
        }

        /* Desktop-only: the overlay is portaled to body, so guard it directly too. */
        @media (max-width: 1023px) {
          .smmBackdrop, .smmPanel { display: none !important; }
        }

        @media (prefers-reduced-motion: reduce) {
          .smmTopBorder, .smmChevron, .smmCard, .smmCard::before,
          .smmViewAll svg, .smmPreviewCta svg { animation: none !important; transition: none !important; }
        }
      `}</style>
    </div>
  );
}

function cssEase([a, b, c, d]: readonly [number, number, number, number]) {
  return `cubic-bezier(${a}, ${b}, ${c}, ${d})`;
}
