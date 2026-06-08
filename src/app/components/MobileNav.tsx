'use client';

import { useCallback, useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion, type Variants } from 'framer-motion';
import { INDUSTRIES } from '../../../public/megaMenuData';
import { WORK_CATEGORIES } from '../../../public/workMegaMenuData';

const EASE_OUT = [0.22, 1, 0.36, 1] as const;

type Props = {
  contactHref: string;
  workHref?: string;
};

export default function MobileNav({ contactHref, workHref = '#work' }: Props) {
  const [open, setOpen] = useState(false);
  const [view, setView] = useState<'root' | 'work' | 'work-category' | 'industries'>('root');
  const [industry, setIndustry] = useState<number | null>(null);
  const [workCategory, setWorkCategory] = useState<number | null>(null);
  const [direction, setDirection] = useState(1);
  const prefersReducedMotion = useReducedMotion();

  const close = useCallback(() => setOpen(false), []);

  // Lock body scroll while the drawer is open.
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  // Escape closes.
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  // Reset back to the root view once the close animation has played.
  useEffect(() => {
    if (open) return;
    const timer = window.setTimeout(() => {
      setView('root');
      setIndustry(null);
      setWorkCategory(null);
      setDirection(1);
    }, 340);
    return () => window.clearTimeout(timer);
  }, [open]);

  const openWork = () => {
    setDirection(1);
    setView('work');
  };

  const openWorkCategory = (index: number) => {
    setDirection(1);
    setWorkCategory(index);
    setView('work-category');
  };

  const openIndustries = () => {
    setDirection(1);
    setView('industries');
  };

  const openSolutions = (index: number) => {
    setDirection(1);
    setIndustry(index);
  };

  const goBack = () => {
    setDirection(-1);
    if (industry !== null) {
      setIndustry(null);
    } else if (view === 'work-category') {
      setWorkCategory(null);
      setView('work');
    } else {
      setView('root');
    }
  };

  const screenKey =
    industry !== null ? `sol-${industry}` :
    view === 'work-category' && workCategory !== null ? `wc-${workCategory}` :
    view;
  const activeIndustry = industry !== null ? INDUSTRIES[industry] : null;
  const activeWorkCategory = workCategory !== null ? WORK_CATEGORIES[workCategory] : null;

  const screenVariants: Variants = prefersReducedMotion
    ? {
        enter: { opacity: 0 },
        center: { opacity: 1 },
        exit: { opacity: 0 },
      }
    : {
        enter: (dir: number) => ({ x: dir > 0 ? '24%' : '-24%', opacity: 0 }),
        center: { x: 0, opacity: 1 },
        exit: (dir: number) => ({ x: dir > 0 ? '-24%' : '24%', opacity: 0 }),
      };

  return (
    <>
      <button
        type="button"
        className={`mnBtn${open ? ' isOpen' : ''}`}
        aria-label={open ? 'Close menu' : 'Open menu'}
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        <span className="mnBtnBox" aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            key="mn-drawer"
            className="mnDrawer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
            <div className="mnBg" aria-hidden="true" />
            <div className="mnScanlines" aria-hidden="true" />

            <div className="mnTopbar">
              <span className="mnBrand">
                <span className="mnBrandGlyph" aria-hidden="true">
                  <i />
                  <i />
                  <i />
                </span>
                MOGT
              </span>
            </div>

            <div className="mnViewport">
              <AnimatePresence mode="wait" custom={direction} initial={false}>
                <motion.div
                  key={screenKey}
                  className="mnScreen"
                  custom={direction}
                  variants={screenVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.32, ease: EASE_OUT }}
                >
                  {view === 'root' && industry === null && workCategory === null && (
                    <div className="mnList">
                      <span className="mnSectionLabel">NAVIGATION</span>
                      <button type="button" className="mnRow" onClick={openWork}>
                        <span className="mnRowNum">01</span>
                        <span className="mnRowName">Work</span>
                        <span className="mnRowMeta">{WORK_CATEGORIES.length} CATEGORIES</span>
                        <svg className="mnRowArrow isStatic" viewBox="0 0 16 12" aria-hidden="true">
                          <path d="M1 6h12M9 1.5 14 6 9 10.5" fill="none" stroke="currentColor" strokeWidth="1.4" />
                        </svg>
                      </button>
                      <button type="button" className="mnRow" onClick={openIndustries}>
                        <span className="mnRowNum">02</span>
                        <span className="mnRowName">Services</span>
                        <span className="mnRowMeta">{INDUSTRIES.length} INDUSTRIES</span>
                        <svg className="mnRowArrow isStatic" viewBox="0 0 16 12" aria-hidden="true">
                          <path d="M1 6h12M9 1.5 14 6 9 10.5" fill="none" stroke="currentColor" strokeWidth="1.4" />
                        </svg>
                      </button>

                      <a className="mnCta" href={contactHref} onClick={close}>
                        Estimate a Project
                      </a>
                    </div>
                  )}

                  {view === 'work' && workCategory === null && (
                    <div className="mnList">
                      <button type="button" className="mnBack" onClick={goBack}>
                        <svg viewBox="0 0 16 12" aria-hidden="true">
                          <path d="M15 6H3M7 1.5 2 6l5 4.5" fill="none" stroke="currentColor" strokeWidth="1.4" />
                        </svg>
                        <span>WORK</span>
                      </button>
                      <span className="mnSectionLabel">CATEGORIES / {String(WORK_CATEGORIES.length).padStart(2, '0')}</span>
                      {WORK_CATEGORIES.map((cat, index) => (
                        <button
                          key={cat.id}
                          type="button"
                          className="mnRow"
                          onClick={() => openWorkCategory(index)}
                        >
                          <span className="mnRowNum">{String(index + 1).padStart(2, '0')}</span>
                          <span className="mnRowName">{cat.name}</span>
                          <span className="mnRowMeta">{cat.projects.length}</span>
                          <svg className="mnRowArrow isStatic" viewBox="0 0 16 12" aria-hidden="true">
                            <path d="M1 6h12M9 1.5 14 6 9 10.5" fill="none" stroke="currentColor" strokeWidth="1.4" />
                          </svg>
                        </button>
                      ))}
                    </div>
                  )}

                  {view === 'work-category' && activeWorkCategory && (
                    <div className="mnList">
                      <button type="button" className="mnBack" onClick={goBack}>
                        <svg viewBox="0 0 16 12" aria-hidden="true">
                          <path d="M15 6H3M7 1.5 2 6l5 4.5" fill="none" stroke="currentColor" strokeWidth="1.4" />
                        </svg>
                        <span>CATEGORIES</span>
                      </button>

                      <div className="mnSolHead">
                        <span className="mnSectionLabel">WORK / {activeWorkCategory.name.toUpperCase()}</span>
                        <h3>{activeWorkCategory.name}</h3>
                        <p>{activeWorkCategory.description}</p>
                        <span className="mnSolCount">
                          {String(activeWorkCategory.projects.length).padStart(2, '0')} PROJECTS
                        </span>
                      </div>

                      {activeWorkCategory.projects.map((project, index) => (
                        <a
                          key={project.slug}
                          className="mnRow mnRowSol"
                          href={`/work/${project.slug}`}
                          onClick={close}
                        >
                          <span className="mnRowNum">{String(index + 1).padStart(2, '0')}</span>
                          <span className="mnSolCopy">
                            <span className="mnRowName">{project.title}</span>
                            <span className="mnSolDesc">{project.description}</span>
                          </span>
                          <svg className="mnRowArrow" viewBox="0 0 16 12" aria-hidden="true">
                            <path d="M1 6h12M9 1.5 14 6 9 10.5" fill="none" stroke="currentColor" strokeWidth="1.4" />
                          </svg>
                        </a>
                      ))}
                    </div>
                  )}

                  {view === 'industries' && industry === null && (
                    <div className="mnList">
                      <button type="button" className="mnBack" onClick={goBack}>
                        <svg viewBox="0 0 16 12" aria-hidden="true">
                          <path d="M15 6H3M7 1.5 2 6l5 4.5" fill="none" stroke="currentColor" strokeWidth="1.4" />
                        </svg>
                        <span>SERVICES</span>
                      </button>
                      <span className="mnSectionLabel">INDUSTRIES / {String(INDUSTRIES.length).padStart(2, '0')}</span>
                      {INDUSTRIES.map((item, index) => (
                        <button
                          key={item.id}
                          type="button"
                          className="mnRow"
                          onClick={() => openSolutions(index)}
                        >
                          <span className="mnRowNum">{String(index + 1).padStart(2, '0')}</span>
                          <span className="mnRowName">{item.name}</span>
                          <span className="mnRowMeta">{item.solutions.length}</span>
                          <svg className="mnRowArrow isStatic" viewBox="0 0 16 12" aria-hidden="true">
                            <path d="M1 6h12M9 1.5 14 6 9 10.5" fill="none" stroke="currentColor" strokeWidth="1.4" />
                          </svg>
                        </button>
                      ))}
                    </div>
                  )}

                  {activeIndustry && (
                    <div className="mnList">
                      <button type="button" className="mnBack" onClick={goBack}>
                        <svg viewBox="0 0 16 12" aria-hidden="true">
                          <path d="M15 6H3M7 1.5 2 6l5 4.5" fill="none" stroke="currentColor" strokeWidth="1.4" />
                        </svg>
                        <span>INDUSTRIES</span>
                      </button>

                      <div className="mnSolHead">
                        <span className="mnSectionLabel">SERVICES / {activeIndustry.name.toUpperCase()}</span>
                        <h3>{activeIndustry.name}</h3>
                        <p>{activeIndustry.description}</p>
                        <span className="mnSolCount">
                          {String(activeIndustry.solutions.length).padStart(2, '0')} SOLUTIONS
                        </span>
                      </div>

                      {activeIndustry.solutions.map((solution, index) => (
                        <a
                          key={solution.href}
                          className="mnRow mnRowSol"
                          href={solution.href}
                          onClick={close}
                        >
                          <span className="mnRowNum">{String(index + 1).padStart(2, '0')}</span>
                          <span className="mnSolCopy">
                            <span className="mnRowName">{solution.title}</span>
                            <span className="mnSolDesc">{solution.description}</span>
                          </span>
                          <svg className="mnRowArrow" viewBox="0 0 16 12" aria-hidden="true">
                            <path d="M1 6h12M9 1.5 14 6 9 10.5" fill="none" stroke="currentColor" strokeWidth="1.4" />
                          </svg>
                        </a>
                      ))}
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        .mnBtn {
          display: none;
          width: 40px;
          height: 40px;
          padding: 0;
          border: 1px solid rgba(255, 255, 255, 0.16);
          background: rgba(255, 255, 255, 0.03);
          color: rgba(255, 255, 255, 0.92);
          cursor: pointer;
          align-items: center;
          justify-content: center;
          transition: border-color 160ms ease, background 160ms ease;
          /* sits above the drawer so it can act as the close affordance too */
          position: relative;
          z-index: 210;
        }

        .mnBtn:hover,
        .mnBtn:focus-visible {
          border-color: rgba(255, 255, 255, 0.4);
          background: rgba(255, 255, 255, 0.07);
          outline: none;
        }

        .mnBtnBox {
          position: relative;
          display: block;
          width: 18px;
          height: 12px;
        }

        .mnBtnBox i {
          position: absolute;
          left: 0;
          width: 100%;
          height: 1.5px;
          background: currentColor;
          transition: transform 280ms cubic-bezier(0.22, 1, 0.36, 1), opacity 180ms ease;
        }
        .mnBtnBox i:nth-child(1) { top: 0; }
        .mnBtnBox i:nth-child(2) { top: 50%; transform: translateY(-50%); }
        .mnBtnBox i:nth-child(3) { bottom: 0; }

        .mnBtn.isOpen .mnBtnBox i:nth-child(1) { transform: translateY(5.25px) rotate(45deg); }
        .mnBtn.isOpen .mnBtnBox i:nth-child(2) { opacity: 0; }
        .mnBtn.isOpen .mnBtnBox i:nth-child(3) { transform: translateY(-5.25px) rotate(-45deg); }

        .mnDrawer {
          position: fixed;
          inset: 0;
          z-index: 200;
          display: flex;
          flex-direction: column;
          background:
            radial-gradient(circle at 50% 0%, rgba(255, 255, 255, 0.05), transparent 38%),
            linear-gradient(180deg, #0a0a0a 0%, #050505 60%, #030303 100%);
          color: rgba(255, 255, 255, 0.92);
          font-family: var(--font-geist-mono, ui-monospace, monospace);
          overscroll-behavior: contain;
        }

        .mnBg,
        .mnScanlines {
          position: absolute;
          inset: 0;
          pointer-events: none;
        }

        .mnBg {
          z-index: 0;
          background-image:
            linear-gradient(rgba(255, 255, 255, 0.022) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.022) 1px, transparent 1px);
          background-size: 40px 40px;
          mask-image: radial-gradient(circle at 50% 18%, #000 0 52%, transparent 86%);
          -webkit-mask-image: radial-gradient(circle at 50% 18%, #000 0 52%, transparent 86%);
        }

        .mnScanlines {
          z-index: 1;
          background: repeating-linear-gradient(
            to bottom,
            transparent 0,
            transparent 2px,
            rgba(255, 255, 255, 0.02) 3px,
            transparent 4px
          );
          opacity: 0.5;
        }

        .mnTopbar {
          position: relative;
          z-index: 3;
          flex-shrink: 0;
          height: 58px;
          padding: 0 18px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .mnBrand {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          font-size: 13px;
          font-weight: 800;
          letter-spacing: 0.08em;
        }

        .mnBrandGlyph {
          display: inline-flex;
          gap: 3px;
        }

        .mnBrandGlyph i {
          width: 5px;
          height: 14px;
          background: rgba(255, 255, 255, 0.82);
        }
        .mnBrandGlyph i:nth-child(2) { opacity: 0.6; }
        .mnBrandGlyph i:nth-child(3) { opacity: 0.32; }

        .mnViewport {
          position: relative;
          z-index: 2;
          flex: 1;
          min-height: 0;
          overflow: hidden;
        }

        .mnScreen {
          position: absolute;
          inset: 0;
          overflow-y: auto;
          overflow-x: hidden;
          -webkit-overflow-scrolling: touch;
          scrollbar-width: none;
          will-change: transform, opacity;
        }
        .mnScreen::-webkit-scrollbar { display: none; }

        .mnList {
          display: flex;
          flex-direction: column;
          gap: 8px;
          padding: 18px 18px calc(28px + env(safe-area-inset-bottom, 0px));
        }

        .mnSectionLabel {
          margin: 6px 2px 2px;
          color: rgba(255, 255, 255, 0.4);
          font-size: 9.5px;
          font-weight: 800;
          letter-spacing: 0.2em;
          text-transform: uppercase;
        }

        .mnBack {
          display: inline-flex;
          align-items: center;
          gap: 9px;
          align-self: flex-start;
          margin-bottom: 4px;
          padding: 9px 12px;
          border: 1px solid rgba(255, 255, 255, 0.14);
          background: rgba(255, 255, 255, 0.03);
          color: rgba(255, 255, 255, 0.74);
          font: inherit;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 0.14em;
          cursor: pointer;
          transition: border-color 160ms ease, color 160ms ease;
        }
        .mnBack:hover,
        .mnBack:focus-visible {
          border-color: rgba(255, 255, 255, 0.36);
          color: rgba(255, 255, 255, 1);
          outline: none;
        }
        .mnBack svg { width: 14px; height: 11px; }

        .mnRow {
          position: relative;
          display: grid;
          grid-template-columns: 26px minmax(0, 1fr) auto auto;
          align-items: center;
          gap: 12px;
          width: 100%;
          min-height: 56px;
          padding: 12px 14px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          background:
            linear-gradient(180deg, rgba(255, 255, 255, 0.03), rgba(255, 255, 255, 0.004)),
            rgba(0, 0, 0, 0.14);
          color: rgba(255, 255, 255, 0.9);
          font: inherit;
          text-align: left;
          text-decoration: none;
          cursor: pointer;
          transition: border-color 160ms ease, background 160ms ease;
          -webkit-tap-highlight-color: transparent;
        }

        .mnRow:active {
          border-color: rgba(255, 255, 255, 0.34);
          background:
            linear-gradient(180deg, rgba(255, 255, 255, 0.06), rgba(255, 255, 255, 0.012)),
            rgba(0, 0, 0, 0.18);
        }

        .mnRow::before {
          content: '';
          position: absolute;
          left: -1px;
          top: 0;
          bottom: 0;
          width: 2px;
          background: rgba(255, 255, 255, 0.85);
          transform: scaleY(0);
          transform-origin: center;
          transition: transform 180ms ease;
        }
        .mnRow:active::before { transform: scaleY(1); }

        .mnRowNum {
          color: rgba(255, 255, 255, 0.34);
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 0.06em;
        }

        .mnRowName {
          min-width: 0;
          overflow: hidden;
          font-size: 15px;
          font-weight: 700;
          letter-spacing: 0.02em;
          text-overflow: ellipsis;
          text-transform: uppercase;
          white-space: nowrap;
        }

        .mnRowMeta {
          color: rgba(255, 255, 255, 0.4);
          font-size: 9px;
          font-weight: 800;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          white-space: nowrap;
        }

        .mnRowArrow {
          width: 16px;
          height: 12px;
          color: rgba(255, 255, 255, 0.66);
        }
        .mnRowArrow.isStatic { color: rgba(255, 255, 255, 0.44); }

        /* Solution rows: two-line copy (title + description) */
        .mnRowSol {
          grid-template-columns: 26px minmax(0, 1fr) auto;
          align-items: start;
        }

        .mnSolCopy {
          min-width: 0;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .mnRowSol .mnRowName {
          font-size: 13px;
          white-space: normal;
        }

        .mnSolDesc {
          color: rgba(255, 255, 255, 0.46);
          font-family: var(--font-geist-sans, sans-serif);
          font-size: 11px;
          font-weight: 400;
          line-height: 1.4;
          letter-spacing: 0;
          text-transform: none;
        }

        .mnRowSol .mnRowArrow { margin-top: 2px; }

        /* Solutions header block */
        .mnSolHead {
          margin: 2px 0 6px;
          padding-bottom: 14px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .mnSolHead h3 {
          margin: 8px 0 0;
          color: rgba(255, 255, 255, 0.97);
          font-size: 24px;
          font-weight: 400;
          letter-spacing: 0.02em;
          line-height: 1;
          text-transform: uppercase;
        }

        .mnSolHead p {
          margin: 9px 0 0;
          color: rgba(255, 255, 255, 0.56);
          font-family: var(--font-geist-sans, sans-serif);
          font-size: 13px;
          line-height: 1.5;
        }

        .mnSolCount {
          display: inline-block;
          margin-top: 12px;
          padding: 6px 10px;
          border: 1px solid rgba(255, 255, 255, 0.16);
          background: rgba(255, 255, 255, 0.024);
          color: rgba(255, 255, 255, 0.7);
          font-size: 9px;
          font-weight: 800;
          letter-spacing: 0.12em;
        }

        .mnCta {
          margin-top: 10px;
          min-height: 54px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid rgba(255, 255, 255, 0.32);
          background: rgba(255, 255, 255, 0.05);
          color: rgba(255, 255, 255, 0.96);
          font-size: 13px;
          font-weight: 800;
          letter-spacing: 0.08em;
          text-decoration: none;
          text-transform: uppercase;
          transition: border-color 160ms ease, background 160ms ease;
        }
        .mnCta:active {
          border-color: rgba(255, 255, 255, 0.6);
          background: rgba(255, 255, 255, 0.09);
        }

        @media (max-width: 640px) {
          .mnBtn { display: inline-flex; }
        }

        @media (prefers-reduced-motion: reduce) {
          .mnBtnBox i,
          .mnRow,
          .mnRow::before { transition: none !important; }
        }
      `}</style>
    </>
  );
}
