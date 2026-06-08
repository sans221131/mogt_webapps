'use client';

import { type CSSProperties, useRef, useState } from 'react';
import { AnimatePresence, motion, type Variants, useInView, useReducedMotion } from 'framer-motion';

type Testimonial = {
  id: string;
  quote: string;
  name: string;
  role: string;
  company: string;
  category: string;
  badge: string;
  projectType: string;
  before: string;
  after: string;
  outcomes: string[];
};

const TESTIMONIALS: Testimonial[] = [
  {
    id: 'REC-01',
    quote:
      'They turned a messy idea into a clear build plan. The final interface felt structured, fast, and ready for real users.',
    name: 'Aarav Mehta',
    role: 'Founder',
    company: 'RepairLink',
    category: 'WEB APP',
    badge: 'VERIFIED',
    projectType: 'Doorstep service platform',
    before: 'Scattered idea and unclear booking flow',
    after: 'Build-ready web app structure',
    outcomes: ['Scope clarified', 'Build risk reduced', 'Mobile UX improved', 'Cleaner handoff'],
  },
  {
    id: 'REC-02',
    quote:
      'The biggest win was clarity. We knew what to build, what to ignore, and how the user journey should actually work.',
    name: 'Priya Sharma',
    role: 'Operations Lead',
    company: 'ServiceDesk',
    category: 'OPERATIONS',
    badge: 'SHIPPED',
    projectType: 'Internal workflow system',
    before: 'Too many manual decisions and scattered steps',
    after: 'Structured operational workflow',
    outcomes: ['Flow simplified', 'Edge cases mapped', 'Faster handoff', 'Team alignment improved'],
  },
  {
    id: 'REC-03',
    quote:
      'They did not just make screens. They thought through states, errors, and how the product would behave after launch.',
    name: 'Rohan Kapoor',
    role: 'Product Manager',
    company: 'FinCore',
    category: 'SAAS',
    badge: 'BUILD READY',
    projectType: 'Financial SaaS dashboard',
    before: 'Static screens with missing product states',
    after: 'State-aware dashboard system',
    outcomes: ['State logic defined', 'UX gaps fixed', 'Dev clarity improved', 'Risk areas exposed'],
  },
  {
    id: 'REC-04',
    quote:
      'The design looked sharp, but more importantly, it made the business process easier to understand.',
    name: 'Meera Iyer',
    role: 'Director',
    company: 'UrbanCart',
    category: 'ECOMMERCE',
    badge: 'UX FIXED',
    projectType: 'Commerce workflow redesign',
    before: 'Confusing customer journey',
    after: 'Cleaner conversion path',
    outcomes: ['Journey cleaned', 'Decision points reduced', 'Mobile flow improved', 'Conversion friction lowered'],
  },
];

const PROOF_METRICS = [
  { value: '91%', label: 'Clarity signal' },
  { value: '100%', label: 'On-time delivery' },
  { value: 'LOW', label: 'Build risk' },
  { value: '14D', label: 'Sprint window' },
];

const CONNECTOR_ROW_START = 188;
const CONNECTOR_ROW_GAP = 43;

export default function TestimonialsSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const sectionRef = useRef<HTMLElement | null>(null);
  const prefersReducedMotion = useReducedMotion();
  const isInView = useInView(sectionRef, { once: true, amount: 0.32 });
  const active = TESTIMONIALS[activeIndex];
  const connectorY = CONNECTOR_ROW_START + activeIndex * CONNECTOR_ROW_GAP;
  const connectorStyle = { '--proof-active-row': activeIndex } as CSSProperties;
  const initialState = prefersReducedMotion ? false : 'hidden';
  const animateState = prefersReducedMotion || isInView ? 'visible' : 'hidden';

  const sectionMotion: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.25,
        staggerChildren: 0.08,
        delayChildren: 0.08,
      },
    },
  };

  const itemMotion: Variants = {
    hidden: { opacity: 0, y: 16, filter: 'blur(8px)' },
    visible: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: { duration: 0.48, ease: 'easeOut' },
    },
  };

  const recordMotion: Variants = {
    hidden: { opacity: 0, y: 12, clipPath: 'inset(12% 0% 0% 0%)' },
    visible: {
      opacity: 1,
      y: 0,
      clipPath: 'inset(0% 0% 0% 0%)',
      transition: { duration: 0.42, ease: 'easeOut' },
    },
    exit: {
      opacity: 0,
      y: -8,
      clipPath: 'inset(0% 0% 18% 0%)',
      transition: { duration: 0.18, ease: 'easeIn' },
    },
  };

  return (
    <motion.section
      ref={sectionRef}
      className="testimonials"
      aria-labelledby="testimonials-title"
      data-lenis-prevent
      initial={initialState}
      animate={animateState}
      variants={sectionMotion}
    >
      <motion.div className="testimonialsBg" aria-hidden="true" variants={itemMotion} />
      <div className="testimonialsScanlines" aria-hidden="true" />
      <div className="testimonialsNoise" aria-hidden="true" />
      <span className="testimonialsBgWord" aria-hidden="true">
        PROOF ARCHIVE
      </span>

      <div className="testimonialsInner">
        <motion.div className="proofShell" variants={itemMotion}>
          <header className="testimonialsHeader">
            <div className="testimonialsHeaderCopy">
              <motion.span className="testimonialsLabel" variants={itemMotion}>
                SECTION E / CLIENT PROOF
              </motion.span>
              <motion.h2 id="testimonials-title" className="testimonialsTitle" variants={itemMotion}>
                PROOF FROM THE OTHER SIDE OF DELIVERY
              </motion.h2>
              <motion.p className="testimonialsSubtitle" variants={itemMotion}>
                Verified notes from teams who needed clearer scope, sharper interfaces, and fewer surprises during build.
              </motion.p>
            </div>

            <motion.div className="archiveStatus" variants={itemMotion} aria-label="Archive status">
              <span>CLIENT PROOF ARCHIVE</span>
              <b>SYNCED</b>
            </motion.div>

            <motion.span
              className="archiveScanLine"
              aria-hidden="true"
              initial={prefersReducedMotion ? false : { scaleX: 0, opacity: 0 }}
              animate={prefersReducedMotion || isInView ? { scaleX: 1, opacity: 1 } : { scaleX: 0, opacity: 0 }}
              transition={{ duration: 0.64, ease: 'easeOut', delay: 0.15 }}
            />
          </header>

          <div className="proofConsole" style={connectorStyle}>
            <motion.aside className="proofIndex" variants={itemMotion}>
              <div className="proofPanelTop">
                <span>PROOF INDEX</span>
                <b>04 RECORDS</b>
              </div>

              <dl className="proofMetrics" aria-label="Proof archive metrics">
                {PROOF_METRICS.map((stat) => (
                  <div key={stat.label} className="proofMetric">
                    <dt>{stat.value}</dt>
                    <dd>{stat.label}</dd>
                  </div>
                ))}
              </dl>

              <div className="proofRecordList" aria-label="Client proof records">
                <span className="proofListLabel">RECORD LIST</span>
                {TESTIMONIALS.map((testimonial, index) => {
                  const isActive = index === activeIndex;

                  return (
                    <button
                      key={testimonial.id}
                      type="button"
                      className={`proofRecordButton${isActive ? ' isActive' : ''}`}
                      aria-pressed={isActive}
                      onClick={() => setActiveIndex(index)}
                      onPointerEnter={(event) => {
                        if (event.pointerType === 'mouse') setActiveIndex(index);
                      }}
                    >
                      <span>{testimonial.id.replace('REC-', '')}</span>
                      <strong>{testimonial.company}</strong>
                      <em>{testimonial.category}</em>
                    </button>
                  );
                })}
              </div>
            </motion.aside>

            <svg className="proofConnector" viewBox="0 0 72 420" aria-hidden="true">
              <path className="proofConnectorRail" d="M16 20 V400" />
              {TESTIMONIALS.map((testimonial, index) => (
                <circle
                  key={testimonial.id}
                  className={index === activeIndex ? 'isActive' : ''}
                  cx="16"
                  cy={CONNECTOR_ROW_START + index * CONNECTOR_ROW_GAP}
                  r="3.5"
                />
              ))}
              <AnimatePresence mode="wait">
                <motion.path
                  key={active.id}
                  className="proofConnectorActive"
                  d={`M16 ${connectorY} H66`}
                  initial={prefersReducedMotion ? false : { pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.34, ease: 'easeOut' }}
                />
              </AnimatePresence>
            </svg>

            <main className="proofWorkspace">
              <AnimatePresence mode="wait">
                <motion.article
                  key={active.id}
                  className="proofRecord"
                  variants={recordMotion}
                  initial={prefersReducedMotion ? false : 'hidden'}
                  animate="visible"
                  exit={prefersReducedMotion ? undefined : 'exit'}
                >
                  <i className="proofCorner proofCornerTL" aria-hidden="true" />
                  <i className="proofCorner proofCornerTR" aria-hidden="true" />
                  <i className="proofCorner proofCornerBL" aria-hidden="true" />
                  <i className="proofCorner proofCornerBR" aria-hidden="true" />

                  <div className="proofRecordTop">
                    <span>{active.id}</span>
                    <span>{active.category}</span>
                    <b>{active.badge}</b>
                  </div>

                  <blockquote className="proofQuote">&quot;{active.quote}&quot;</blockquote>

                  <div className="proofClient">
                    <div>
                      <strong>{active.name}</strong>
                      <span>{active.role}</span>
                    </div>
                    <p>{active.company}</p>
                  </div>

                  <div className="proofProject">
                    <span>PROJECT TYPE</span>
                    <p>{active.projectType}</p>
                  </div>

                  <div className="proofBeforeAfter" aria-label="Before and after delivery signal">
                    <div>
                      <span>BEFORE</span>
                      <p>{active.before}</p>
                    </div>
                    <b aria-hidden="true">-&gt;</b>
                    <div>
                      <span>AFTER</span>
                      <p>{active.after}</p>
                    </div>
                  </div>
                </motion.article>
              </AnimatePresence>

              <section className="proofSignals" aria-label="Delivery signals">
                <div className="proofPanelTop">
                  <span>DELIVERY SIGNALS</span>
                  <b>VERIFIED OUTPUT</b>
                </div>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={`${active.id}-signals`}
                    className="proofOutcomeGrid"
                    initial={prefersReducedMotion ? false : 'hidden'}
                    animate="visible"
                    exit={prefersReducedMotion ? undefined : 'exit'}
                    variants={{
                      hidden: { opacity: 0 },
                      visible: {
                        opacity: 1,
                        transition: { staggerChildren: 0.055, delayChildren: 0.05 },
                      },
                      exit: { opacity: 0, transition: { duration: 0.12 } },
                    }}
                  >
                    {active.outcomes.map((outcome) => (
                      <motion.span
                        key={outcome}
                        className="proofOutcome"
                        variants={{
                          hidden: { opacity: 0, y: 10, clipPath: 'inset(0% 100% 0% 0%)' },
                          visible: {
                            opacity: 1,
                            y: 0,
                            clipPath: 'inset(0% 0% 0% 0%)',
                            transition: { duration: 0.26, ease: 'easeOut' },
                          },
                        }}
                      >
                        {outcome}
                      </motion.span>
                    ))}
                  </motion.div>
                </AnimatePresence>
              </section>
            </main>
          </div>
        </motion.div>
      </div>

      <style jsx global>{`
        .testimonials {
          position: relative;
          width: 100%;
          height: 100%;
          background:
            radial-gradient(circle at 50% 0%, rgba(255, 255, 255, 0.055), transparent 34%),
            linear-gradient(180deg, #090909 0%, #050505 52%, #030303 100%);
          color: rgba(255, 255, 255, 0.92);
          font-family: var(--font-geist-mono, 'Courier New', monospace);
          overflow: hidden;
          pointer-events: all;
          isolation: isolate;
        }

        .testimonialsBg,
        .testimonialsScanlines,
        .testimonialsNoise,
        .testimonialsBgWord {
          position: absolute;
          pointer-events: none;
        }

        .testimonialsBg {
          inset: -80px;
          z-index: 0;
          background-image:
            linear-gradient(rgba(255, 255, 255, 0.026) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.026) 1px, transparent 1px),
            linear-gradient(135deg, transparent 0 48%, rgba(255, 255, 255, 0.024) 49% 51%, transparent 52% 100%);
          background-size: 46px 46px, 46px 46px, 184px 184px;
          mask-image: radial-gradient(circle at 50% 42%, #000 0 48%, transparent 80%);
          -webkit-mask-image: radial-gradient(circle at 50% 42%, #000 0 48%, transparent 80%);
          animation: testimonialsGridDrift 20s linear infinite;
        }

        .testimonialsScanlines {
          inset: 0;
          z-index: 1;
          background: repeating-linear-gradient(
            to bottom,
            transparent 0,
            transparent 2px,
            rgba(255, 255, 255, 0.032) 3px,
            transparent 4px
          );
          opacity: 0.48;
        }

        .testimonialsNoise {
          inset: -60%;
          z-index: 2;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 180 180' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.88' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='180' height='180' filter='url(%23n)' opacity='0.58'/%3E%3C/svg%3E");
          background-size: 180px 180px;
          mix-blend-mode: overlay;
          opacity: 0.12;
          animation: testimonialsNoise 1.1s steps(8, end) infinite;
        }

        .testimonialsBgWord {
          right: -14px;
          bottom: -18px;
          z-index: 0;
          color: rgba(255, 255, 255, 0.018);
          font-size: 156px;
          font-weight: 800;
          line-height: 0.78;
          text-transform: uppercase;
          user-select: none;
        }

        .testimonialsInner {
          position: relative;
          z-index: 4;
          width: min(calc(100% - 40px), 1200px);
          height: 100%;
          margin-inline: auto;
          display: flex;
          flex-direction: column;
          gap: clamp(12px, 2vh, 24px);
          padding-top: 84px;
          padding-bottom: clamp(20px, 3vh, 36px);
          box-sizing: border-box;
        }

        .proofShell {
          position: relative;
          flex: 1;
          min-height: 0;
          display: flex;
          flex-direction: column;
          border: 1px solid rgba(255, 255, 255, 0.14);
          background:
            linear-gradient(180deg, rgba(255, 255, 255, 0.036), rgba(255, 255, 255, 0.008)),
            rgba(7, 7, 7, 0.72);
          box-shadow:
            inset 0 1px 0 rgba(255, 255, 255, 0.08),
            0 40px 120px rgba(0, 0, 0, 0.55);
          backdrop-filter: blur(12px);
          overflow: hidden;
        }

        .proofShell::before,
        .proofShell::after {
          content: '';
          position: absolute;
          pointer-events: none;
        }

        .proofShell::before {
          inset: 0;
          background:
            linear-gradient(to right, rgba(255, 255, 255, 0.055), transparent 22%, transparent 78%, rgba(255, 255, 255, 0.04)),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.03), transparent 28%, transparent 72%, rgba(0, 0, 0, 0.22));
          opacity: 0.72;
        }

        .proofShell::after {
          left: 0;
          right: 0;
          top: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.58), transparent);
          animation: archiveLinePass 4.4s ease-in-out infinite;
        }

        .testimonialsHeader {
          position: relative;
          z-index: 1;
          flex-shrink: 0;
          display: grid;
          grid-template-columns: minmax(0, 1fr) 210px;
          gap: 28px;
          padding: clamp(18px, 2.2vh, 26px) 30px clamp(16px, 2vh, 22px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.12);
        }

        .testimonialsLabel,
        .archiveStatus span,
        .proofPanelTop span,
        .proofListLabel,
        .proofRecordTop span,
        .proofProject span,
        .proofBeforeAfter span {
          color: rgba(255, 255, 255, 0.46);
          font-size: 10px;
          font-weight: 800;
          line-height: 1.35;
          text-transform: uppercase;
        }

        .testimonialsTitle {
          max-width: 820px;
          margin: 10px 0 0;
          color: rgba(255, 255, 255, 0.96);
          font-size: clamp(26px, 3.2vw, 46px);
          font-weight: 360;
          line-height: 0.98;
          text-transform: uppercase;
          text-shadow:
            1px 0 rgba(255, 255, 255, 0.12),
            0 0 32px rgba(255, 255, 255, 0.08);
        }

        .testimonialsSubtitle {
          max-width: 650px;
          margin: 10px 0 0;
          color: rgba(255, 255, 255, 0.62);
          font-family: var(--font-geist-sans, sans-serif);
          font-size: clamp(12px, 1vw, 14px);
          font-weight: 360;
          line-height: 1.58;
        }

        .archiveStatus {
          align-self: end;
          min-height: 0;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          gap: 8px;
          padding: 10px 12px;
          border: 1px solid rgba(255, 255, 255, 0.12);
          background: rgba(255, 255, 255, 0.024);
        }

        .archiveStatus b,
        .proofPanelTop b,
        .proofRecordTop b {
          color: rgba(255, 255, 255, 0.82);
          font-size: 10px;
          font-weight: 800;
          line-height: 1.35;
          text-transform: uppercase;
        }

        .archiveScanLine {
          position: absolute;
          left: 30px;
          right: 30px;
          bottom: -1px;
          height: 1px;
          display: block;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.72), transparent);
          transform-origin: center;
        }

        .proofConsole {
          position: relative;
          z-index: 1;
          flex: 1;
          min-height: 0;
          display: grid;
          grid-template-columns: 264px 64px minmax(0, 1fr);
        }

        .proofIndex {
          display: grid;
          grid-template-rows: auto auto 1fr;
          gap: clamp(8px, 1.4vh, 14px);
          min-width: 0;
          min-height: 0;
          overflow: hidden;
          padding: clamp(12px, 1.8vh, 16px) 16px clamp(12px, 1.8vh, 16px);
          border-right: 1px solid rgba(255, 255, 255, 0.12);
          background: rgba(255, 255, 255, 0.015);
        }

        .proofPanelTop {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 14px;
        }

        .proofMetrics {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 6px;
          margin: 0;
        }

        .proofMetric {
          position: relative;
          min-height: 0;
          padding: 6px 8px 7px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          background:
            linear-gradient(180deg, rgba(255, 255, 255, 0.04), rgba(255, 255, 255, 0.006)),
            rgba(0, 0, 0, 0.18);
          overflow: hidden;
        }

        .proofMetric::before {
          content: '';
          position: absolute;
          right: -1px;
          top: -1px;
          width: 10px;
          height: 10px;
          border-top: 1px solid rgba(255, 255, 255, 0.38);
          border-right: 1px solid rgba(255, 255, 255, 0.38);
          pointer-events: none;
        }

        .proofMetric dt {
          margin: 0;
          color: rgba(255, 255, 255, 0.96);
          font-size: clamp(17px, 1.7vw, 22px);
          font-weight: 420;
          line-height: 1.1;
        }

        .proofMetric dd {
          margin: 3px 0 0;
          color: rgba(255, 255, 255, 0.44);
          font-size: 8px;
          font-weight: 800;
          letter-spacing: 0.04em;
          line-height: 1.2;
          text-transform: uppercase;
        }

        .proofRecordList {
          min-width: 0;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .proofListLabel {
          margin-bottom: 2px;
        }

        .proofRecordButton {
          width: 100%;
          min-height: 35px;
          display: grid;
          grid-template-columns: 28px minmax(0, 1fr) auto;
          align-items: center;
          gap: 10px;
          padding: 0 10px;
          border: 1px solid rgba(255, 255, 255, 0.08);
          background: rgba(255, 255, 255, 0.012);
          color: rgba(255, 255, 255, 0.5);
          font: inherit;
          text-align: left;
          cursor: pointer;
          transition:
            border-color 180ms ease,
            background 180ms ease,
            color 180ms ease,
            transform 180ms ease;
        }

        .proofRecordButton:hover,
        .proofRecordButton:focus-visible,
        .proofRecordButton.isActive {
          color: rgba(255, 255, 255, 0.92);
          border-color: rgba(255, 255, 255, 0.3);
          background: rgba(255, 255, 255, 0.05);
          outline: none;
        }

        .proofRecordButton.isActive {
          box-shadow: inset 2px 0 0 rgba(255, 255, 255, 0.78);
        }

        .proofRecordButton span,
        .proofRecordButton em {
          color: rgba(255, 255, 255, 0.38);
          font-size: 9px;
          font-style: normal;
          font-weight: 800;
          line-height: 1;
          text-transform: uppercase;
        }

        .proofRecordButton strong {
          min-width: 0;
          overflow: hidden;
          font-size: 11px;
          font-weight: 800;
          line-height: 1;
          text-overflow: ellipsis;
          text-transform: uppercase;
          white-space: nowrap;
        }

        .proofConnector {
          width: 72px;
          height: 100%;
          color: rgba(255, 255, 255, 0.34);
          border-right: 1px solid rgba(255, 255, 255, 0.1);
          overflow: visible;
        }

        .proofConnectorRail,
        .proofConnectorActive {
          fill: none;
          stroke: currentColor;
          stroke-width: 1;
          vector-effect: non-scaling-stroke;
        }

        .proofConnectorRail {
          opacity: 0.42;
          stroke-dasharray: 5 8;
        }

        .proofConnector circle {
          fill: #080808;
          stroke: rgba(255, 255, 255, 0.26);
          stroke-width: 1;
        }

        .proofConnector circle.isActive {
          fill: rgba(255, 255, 255, 0.86);
          stroke: rgba(255, 255, 255, 0.9);
        }

        .proofConnectorActive {
          color: rgba(255, 255, 255, 0.82);
          filter: drop-shadow(0 0 8px rgba(255, 255, 255, 0.22));
        }

        .proofWorkspace {
          min-width: 0;
          min-height: 0;
          overflow: hidden;
          display: grid;
          grid-template-rows: minmax(0, 1fr) auto;
        }

        .proofRecord {
          position: relative;
          min-width: 0;
          display: grid;
          grid-template-rows: auto 1fr auto auto auto;
          gap: clamp(8px, 1.2vh, 13px);
          padding: clamp(14px, 1.8vh, 20px) clamp(14px, 1.6vw, 22px) clamp(12px, 1.6vh, 18px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.12);
          background:
            linear-gradient(145deg, rgba(255, 255, 255, 0.048), rgba(255, 255, 255, 0.008) 52%, rgba(255, 255, 255, 0.028)),
            rgba(9, 9, 9, 0.52);
          overflow: hidden;
        }

        .proofRecord::before {
          content: '';
          position: absolute;
          inset: 0;
          background:
            linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.045), transparent),
            repeating-linear-gradient(to bottom, transparent 0 11px, rgba(255, 255, 255, 0.018) 12px, transparent 13px);
          opacity: 0.44;
          pointer-events: none;
        }

        .proofCorner {
          position: absolute;
          width: 16px;
          height: 16px;
          pointer-events: none;
          z-index: 2;
        }

        .proofCornerTL {
          left: -1px;
          top: -1px;
          border-left: 1px solid rgba(255, 255, 255, 0.58);
          border-top: 1px solid rgba(255, 255, 255, 0.58);
        }

        .proofCornerTR {
          right: -1px;
          top: -1px;
          border-right: 1px solid rgba(255, 255, 255, 0.32);
          border-top: 1px solid rgba(255, 255, 255, 0.32);
        }

        .proofCornerBL {
          left: -1px;
          bottom: -1px;
          border-left: 1px solid rgba(255, 255, 255, 0.32);
          border-bottom: 1px solid rgba(255, 255, 255, 0.32);
        }

        .proofCornerBR {
          right: -1px;
          bottom: -1px;
          border-right: 1px solid rgba(255, 255, 255, 0.58);
          border-bottom: 1px solid rgba(255, 255, 255, 0.58);
        }

        .proofRecordTop,
        .proofQuote,
        .proofClient,
        .proofProject,
        .proofBeforeAfter,
        .proofSignals {
          position: relative;
          z-index: 1;
        }

        .proofRecordTop {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-wrap: wrap;
        }

        .proofRecordTop span,
        .proofRecordTop b {
          min-height: 27px;
          display: inline-flex;
          align-items: center;
          padding: 0 10px;
          border: 1px solid rgba(255, 255, 255, 0.14);
          background: rgba(255, 255, 255, 0.028);
        }

        .proofRecordTop b {
          margin-left: auto;
          border-color: rgba(255, 255, 255, 0.26);
        }

        .proofQuote {
          max-width: 760px;
          margin: 0;
          color: rgba(255, 255, 255, 0.91);
          font-family: var(--font-geist-sans, sans-serif);
          font-size: clamp(16px, 1.7vw, 24px);
          font-weight: 380;
          line-height: 1.3;
        }

        .proofClient {
          display: flex;
          align-items: end;
          justify-content: space-between;
          gap: 20px;
          padding-top: clamp(10px, 1.4vh, 14px);
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }

        .proofClient div {
          display: flex;
          align-items: baseline;
          gap: 12px;
          flex-wrap: wrap;
        }

        .proofClient strong {
          color: rgba(255, 255, 255, 0.94);
          font-size: 14px;
          font-weight: 800;
          text-transform: uppercase;
        }

        .proofClient span,
        .proofClient p,
        .proofProject p,
        .proofBeforeAfter p {
          margin: 0;
          color: rgba(255, 255, 255, 0.56);
          font-family: var(--font-geist-sans, sans-serif);
          font-size: 12px;
          line-height: 1.45;
        }

        .proofClient p {
          color: rgba(255, 255, 255, 0.36);
          font-family: var(--font-geist-mono, 'Courier New', monospace);
          font-weight: 800;
          text-transform: uppercase;
        }

        .proofProject {
          display: flex;
          align-items: baseline;
          gap: 14px;
        }

        .proofProject p {
          color: rgba(255, 255, 255, 0.72);
        }

        .proofBeforeAfter {
          display: grid;
          grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
          align-items: stretch;
          gap: 10px;
        }

        .proofBeforeAfter div {
          min-width: 0;
          padding: clamp(8px, 1.2vh, 11px) 10px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          background: rgba(255, 255, 255, 0.024);
        }

        .proofBeforeAfter b {
          width: 38px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: rgba(255, 255, 255, 0.7);
          border-block: 1px solid rgba(255, 255, 255, 0.1);
          font-size: 14px;
          font-weight: 800;
        }

        .proofBeforeAfter p {
          margin-top: 6px;
        }

        .proofSignals {
          padding: clamp(10px, 1.4vh, 14px) clamp(14px, 1.6vw, 20px) clamp(10px, 1.4vh, 14px);
          background: rgba(255, 255, 255, 0.012);
        }

        .proofOutcomeGrid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 7px;
          margin-top: 9px;
        }

        .proofOutcome {
          min-height: clamp(32px, 4.8vh, 42px);
          display: flex;
          align-items: center;
          padding: 0 10px;
          border: 1px solid rgba(255, 255, 255, 0.11);
          background:
            linear-gradient(180deg, rgba(255, 255, 255, 0.038), rgba(255, 255, 255, 0.01)),
            rgba(0, 0, 0, 0.18);
          color: rgba(255, 255, 255, 0.72);
          font-size: 10px;
          font-weight: 800;
          line-height: 1.25;
          text-transform: uppercase;
        }

        @keyframes testimonialsGridDrift {
          to {
            transform: translate3d(46px, 46px, 0);
          }
        }

        @keyframes testimonialsNoise {
          0% { transform: translate3d(0, 0, 0); }
          20% { transform: translate3d(-2%, 1%, 0); }
          40% { transform: translate3d(1%, -2%, 0); }
          60% { transform: translate3d(-1%, 2%, 0); }
          80% { transform: translate3d(2%, -1%, 0); }
        }

        @keyframes archiveLinePass {
          0%, 30% {
            transform: translateX(-100%);
          }
          70%, 100% {
            transform: translateX(100%);
          }
        }

        @media (max-width: 1120px) {
          .proofConsole {
            grid-template-columns: 240px 52px minmax(0, 1fr);
          }

          .proofConnector {
            width: 52px;
          }

          .proofOutcomeGrid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 768px) {
          .testimonials {
            height: 100%;
            overflow-y: auto;
            overflow-x: hidden;
            overscroll-behavior: contain;
            scrollbar-width: none;
          }

          .testimonials::-webkit-scrollbar {
            display: none;
          }

          .testimonialsInner {
            width: min(calc(100% - 32px), 1200px);
            height: auto;
            min-height: 100%;
            display: flex;
            flex-direction: column;
            gap: 16px;
            padding-top: 72px;
            padding-bottom: 38px;
          }

          .testimonialsBg {
            inset: -48px;
            background-size: 34px 34px, 34px 34px, 136px 136px;
            opacity: 0.78;
          }

          .testimonialsBgWord {
            right: -8px;
            bottom: 8px;
            font-size: 58px;
            opacity: 0.62;
          }

          .proofShell {
            flex: none;
            overflow: visible;
          }

          .testimonialsHeader {
            display: block;
            padding: 20px 18px 18px;
          }

          .testimonialsLabel,
          .archiveStatus span,
          .proofPanelTop span,
          .proofListLabel,
          .proofRecordTop span,
          .proofProject span,
          .proofBeforeAfter span {
            font-size: 9px;
          }

          .testimonialsTitle {
            margin-top: 10px;
            font-size: clamp(26px, 8vw, 34px);
            line-height: 1.04;
          }

          .testimonialsSubtitle {
            margin-top: 12px;
            font-size: 13px;
            line-height: 1.5;
          }

          .archiveStatus {
            min-height: 0;
            flex-direction: row;
            align-items: center;
            margin-top: 16px;
            padding: 10px 11px;
          }

          .archiveScanLine {
            left: 18px;
            right: 18px;
          }

          .proofConsole {
            display: grid;
            grid-template-columns: 1fr;
            min-height: 0;
          }

          .proofIndex {
            gap: 14px;
            padding: 18px;
            border-right: 0;
            border-bottom: 1px solid rgba(255, 255, 255, 0.12);
          }

          .proofMetrics {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .proofRecordList {
            display: grid;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 8px;
          }

          .proofListLabel {
            grid-column: 1 / -1;
          }

          .proofRecordButton {
            min-height: 54px;
            grid-template-columns: auto 1fr;
            grid-template-areas:
              "num name"
              "cat cat";
            gap: 5px 8px;
            padding: 9px;
          }

          .proofRecordButton span {
            grid-area: num;
          }

          .proofRecordButton strong {
            grid-area: name;
            font-size: 10px;
          }

          .proofRecordButton em {
            grid-area: cat;
          }

          .proofConnector {
            display: none;
          }

          .proofWorkspace {
            display: block;
          }

          .proofRecord {
            display: block;
            padding: 16px 18px;
          }

          .proofRecordTop {
            gap: 8px;
          }

          .proofRecordTop span,
          .proofRecordTop b {
            min-height: 25px;
            padding: 0 8px;
          }

          .proofRecordTop b {
            margin-left: 0;
          }

          .proofQuote {
            margin-top: 18px;
            font-size: 22px;
            line-height: 1.32;
          }

          .proofClient {
            display: block;
            margin-top: 18px;
            padding-top: 14px;
          }

          .proofClient div {
            gap: 7px;
          }

          .proofClient p {
            margin-top: 5px;
          }

          .proofProject {
            display: block;
            margin-top: 16px;
          }

          .proofProject p {
            margin-top: 6px;
          }

          .proofBeforeAfter {
            grid-template-columns: 1fr;
            gap: 8px;
            margin-top: 14px;
          }

          .proofBeforeAfter b {
            width: auto;
            min-height: 26px;
            border: 1px solid rgba(255, 255, 255, 0.1);
          }

          .proofSignals {
            padding: 17px 18px 18px;
          }

          .proofOutcomeGrid {
            grid-template-columns: 1fr 1fr;
          }

          .proofOutcome {
            min-height: 42px;
            padding: 0 10px;
            font-size: 9px;
          }
        }

        @media (max-width: 430px) {
          .testimonialsInner {
            width: min(calc(100% - 26px), 1200px);
            padding-top: 70px;
          }

          .proofRecordList,
          .proofOutcomeGrid {
            grid-template-columns: 1fr;
          }

          .proofMetrics {
            gap: 7px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .testimonials,
          .testimonials *,
          .proofShell::after {
            animation: none !important;
            transition: none !important;
          }
        }
      `}</style>
    </motion.section>
  );
}
