'use client';

import { motion, useReducedMotion, type Variants } from 'framer-motion';
import SiteHeader from '../../components/SiteHeader';
import type { Complexity, SolutionPreview } from '../../components/servicesMeta';
import { useProjectIntake } from '../../components/project-intake/ProjectIntakeProvider';

const EASE_OUT = [0.22, 1, 0.36, 1] as const;
const CONTACT_EMAIL = 'hello@mogt.studio';
const CONTACT_HREF = `mailto:${CONTACT_EMAIL}?subject=Project%20Inquiry%20%E2%80%94%20MOGT`;

export type RelatedItem = { slug: string; title: string; description: string };

export type DetailProps = {
  title: string;
  description: string;
  slug: string;
  industryName: string;
  industryId: string;
  industryDescription: string;
  industrySolutionCount: number;
  indexInIndustry: number;
  meta: SolutionPreview;
  related: RelatedItem[];
};

const PROCESS = [
  { k: 'DISCOVERY', t: 'Map the system', d: 'We map requirements, flows, permissions, and edge cases before a single line of code — so scope is clear and surprises are cheap.' },
  { k: 'ARCHITECTURE', t: 'Design before build', d: 'Data models, states, and component logic are designed as one coherent system, not a pile of disconnected screens.' },
  { k: 'BUILD', t: 'Engineer for production', d: 'Type-safe, tested, observable code — built to survive real users, real load, and real edge cases.' },
  { k: 'LAUNCH', t: 'Ship & iterate', d: 'We ship, monitor, and refine with a clean handoff, documentation, and a roadmap for what comes next.' },
];

const STANDARDS = [
  { t: 'Type-safe', d: 'End-to-end TypeScript' },
  { t: 'Tested', d: 'Critical paths covered' },
  { t: 'Observable', d: 'Logging & metrics built in' },
  { t: 'Scalable', d: 'Grows with your load' },
];

function moduleBlurb(name: string): string {
  const n = name.toLowerCase();
  if (n.includes('compliance') || n.includes('hipaa') || n.includes('risk')) return 'Audit-ready controls, policies, and reporting.';
  if (n.includes('payment') || n.includes('billing') || n.includes('ledger') || n.includes('gateway')) return 'Secure transactions, reconciliation, and webhooks.';
  if (n.includes('analytic') || n.includes('reporting') || n.includes('dashboard') || n.includes('visualization')) return 'Real-time insight from raw events to dashboards.';
  if (n.includes('auth') || n.includes('identity') || n.includes('access') || n.includes('verification')) return 'Authentication, roles, and granular access control.';
  if (n.includes('api') || n.includes('rest') || n.includes('graphql') || n.includes('integrat')) return 'Clean, documented interfaces for every consumer.';
  if (n.includes('notification') || n.includes('alert')) return 'Timely, multi-channel notifications and alerts.';
  if (n.includes('cdn') || n.includes('encoding') || n.includes('drm')) return 'Fast, resilient delivery at global scale.';
  if (n.includes('catalog') || n.includes('inventory') || n.includes('orders')) return 'Structured data, search, and lifecycle management.';
  return 'Designed, built, and integrated end-to-end.';
}

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 18, filter: 'blur(4px)' },
  show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.55, ease: EASE_OUT } },
};
const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06, delayChildren: 0.04 } },
};

export default function SolutionDetail(props: DetailProps) {
  const { openIntake } = useProjectIntake();
  const {
    title, description, industryName, industryId, industryDescription,
    industrySolutionCount, indexInIndustry, meta, related,
  } = props;
  const prefersReduced = useReducedMotion();

  const overview1 = `${title} is a ${industryName} solution built for ${meta.bestFor.toLowerCase()}. ${description} — engineered as a complete system, not a feature bolted onto a template.`;
  const overview2 = `We start by mapping the flows, states, and edge cases around ${meta.modules.slice(0, 3).join(', ')}, then build production-grade infrastructure that scales with your business. Expect a typical delivery window of ${meta.timeline}, on a ${meta.complexity.toLowerCase()}-complexity build profile.`;

  const reveal = (extra?: Record<string, unknown>) =>
    prefersReduced
      ? {}
      : { initial: 'hidden' as const, whileInView: 'show' as const, viewport: { once: true, margin: '-60px' }, ...extra };

  return (
    <div className="sd">
      <div className="sdBg" aria-hidden="true" />
      <div className="sdScan" aria-hidden="true" />

      <SiteHeader />

      {/* Breadcrumb */}
      <nav className="sdCrumb" aria-label="Breadcrumb">
        <a href="/">Home</a><span>/</span>
        <a href="/services">Services</a><span>/</span>
        <a href={`/services?industry=${industryId}`}>{industryName}</a><span>/</span>
        <em>{title}</em>
      </nav>

      {/* Hero */}
      <section className="sdHero">
        <motion.div
          className="sdHeroCopy"
          initial={prefersReduced ? false : 'hidden'}
          animate="show"
          variants={stagger}
        >
          <motion.span className="sdKicker" variants={fadeUp}>
            <span className="sdDot" /> SOLUTION / {industryName.toUpperCase()}
          </motion.span>
          <motion.h1 className="sdTitle" variants={fadeUp}>{title}</motion.h1>
          <motion.p className="sdLede" variants={fadeUp}>{description}</motion.p>

          <motion.div className="sdHeroChips" variants={fadeUp}>
            <ComplexityBadge level={meta.complexity} />
            <span className="sdChip">⌁ {meta.timeline}</span>
            <span className="sdChip">◇ {meta.bestFor}</span>
          </motion.div>

          <motion.div className="sdHeroCta" variants={fadeUp}>
            <a
              className="sdBtnPrimary"
              href={CONTACT_HREF}
              onClick={(event) => {
                event.preventDefault();
                openIntake({ intent: 'estimate', sourceButton: 'Estimate this build' });
              }}
            >
              Estimate this build
              <svg viewBox="0 0 14 10" aria-hidden="true"><path d="M1 5h11M8 1.5 12.5 5 8 8.5" fill="none" stroke="currentColor" strokeWidth="1.3" /></svg>
            </a>
            <a className="sdBtnGhost" href={`/services?industry=${industryId}`}>All {industryName} solutions</a>
          </motion.div>
        </motion.div>

        {/* Spec readout */}
        <motion.aside
          className="sdSpec"
          initial={prefersReduced ? false : { opacity: 0, y: 22, filter: 'blur(8px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.6, ease: EASE_OUT, delay: 0.12 }}
        >
          <i className="sdCorner tl" /><i className="sdCorner tr" /><i className="sdCorner bl" /><i className="sdCorner br" />
          <div className="sdSpecHead"><span>SPEC SHEET</span><b>{String(indexInIndustry + 1).padStart(2, '0')}/{String(industrySolutionCount).padStart(2, '0')}</b></div>
          <dl className="sdSpecList">
            <div><dt>SECTOR</dt><dd>{industryName}</dd></div>
            <div><dt>COMPLEXITY</dt><dd><ComplexityBadge level={meta.complexity} /></dd></div>
            <div><dt>TIMELINE</dt><dd>{meta.timeline}</dd></div>
            <div><dt>BEST FOR</dt><dd>{meta.bestFor}</dd></div>
            <div><dt>STATUS</dt><dd className="sdStatusOk">● AVAILABLE</dd></div>
          </dl>
        </motion.aside>
      </section>

      {/* Overview */}
      <motion.section className="sdSection sdOverview" {...reveal()} variants={stagger}>
        <motion.div className="sdSectionHead" variants={fadeUp}>
          <span className="sdSectionKicker">01 / OVERVIEW</span>
          <h2 className="sdSectionTitle">What we build</h2>
        </motion.div>
        <motion.div className="sdProse" variants={fadeUp}>
          <p>{overview1}</p>
          <p>{overview2}</p>
        </motion.div>
      </motion.section>

      {/* Modules */}
      <motion.section className="sdSection" {...reveal()} variants={stagger}>
        <motion.div className="sdSectionHead" variants={fadeUp}>
          <span className="sdSectionKicker">02 / SYSTEM MODULES</span>
          <h2 className="sdSectionTitle">What&rsquo;s inside</h2>
          <p className="sdSectionDesc">The core building blocks we design, engineer, and wire together for this solution.</p>
        </motion.div>
        <div className="sdModGrid">
          {meta.modules.map((m, i) => (
            <motion.div className="sdMod" key={m} variants={fadeUp}>
              <span className="sdModTop" aria-hidden="true" />
              <span className="sdModNum">M{String(i + 1).padStart(2, '0')}</span>
              <h3 className="sdModName">{m}</h3>
              <p className="sdModDesc">{moduleBlurb(m)}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Process */}
      <motion.section className="sdSection" {...reveal()} variants={stagger}>
        <motion.div className="sdSectionHead" variants={fadeUp}>
          <span className="sdSectionKicker">03 / HOW WE BUILD IT</span>
          <h2 className="sdSectionTitle">From idea to launch</h2>
        </motion.div>
        <div className="sdSteps">
          {PROCESS.map((s, i) => (
            <motion.div className="sdStep" key={s.k} variants={fadeUp}>
              <span className="sdStepNum">{String(i + 1).padStart(2, '0')}</span>
              <div className="sdStepBody">
                <span className="sdStepKicker">{s.k}</span>
                <h3 className="sdStepTitle">{s.t}</h3>
                <p className="sdStepDesc">{s.d}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Standards */}
      <motion.section className="sdSection" {...reveal()} variants={stagger}>
        <motion.div className="sdSectionHead" variants={fadeUp}>
          <span className="sdSectionKicker">04 / ENGINEERING STANDARDS</span>
          <h2 className="sdSectionTitle">Built to last</h2>
        </motion.div>
        <div className="sdStdGrid">
          {STANDARDS.map((s) => (
            <motion.div className="sdStd" key={s.t} variants={fadeUp}>
              <h3 className="sdStdTitle">{s.t}</h3>
              <p className="sdStdDesc">{s.d}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Related */}
      {related.length > 0 && (
        <motion.section className="sdSection" {...reveal()} variants={stagger}>
          <motion.div className="sdSectionHead" variants={fadeUp}>
            <span className="sdSectionKicker">05 / RELATED IN {industryName.toUpperCase()}</span>
            <h2 className="sdSectionTitle">More {industryName} solutions</h2>
          </motion.div>
          <div className="sdRelGrid">
            {related.map((r) => (
              <motion.a className="sdRel" key={r.slug} href={`/services/${r.slug}`} variants={fadeUp}>
                <span className="sdRelTop" aria-hidden="true" />
                <h3 className="sdRelTitle">{r.title}</h3>
                <p className="sdRelDesc">{r.description}</p>
                <span className="sdRelArrow">
                  View solution
                  <svg viewBox="0 0 14 10" aria-hidden="true"><path d="M1 5h11M8 1.5 12.5 5 8 8.5" fill="none" stroke="currentColor" strokeWidth="1.3" /></svg>
                </span>
              </motion.a>
            ))}
          </div>
        </motion.section>
      )}

      {/* CTA */}
      <section className="sdCta">
        <i className="sdCorner tl" /><i className="sdCorner tr" /><i className="sdCorner bl" /><i className="sdCorner br" />
        <span className="sdCtaKicker">// LET&rsquo;S BUILD IT</span>
        <h2 className="sdCtaTitle">Ready to scope {title}?</h2>
        <p className="sdCtaDesc">{industryDescription}. Tell us what you&rsquo;re building and we&rsquo;ll scope it from first principles — no templates.</p>
        <div className="sdCtaActions">
          <a
            className="sdBtnPrimary"
            href={CONTACT_HREF}
            onClick={(event) => {
              event.preventDefault();
              openIntake({ intent: 'estimate', sourceButton: 'Estimate a Project' });
            }}
          >
            Estimate a Project
            <svg viewBox="0 0 14 10" aria-hidden="true"><path d="M1 5h11M8 1.5 12.5 5 8 8.5" fill="none" stroke="currentColor" strokeWidth="1.3" /></svg>
          </a>
          <a className="sdBtnGhost" href="/services">Back to archive</a>
        </div>
      </section>

      <footer className="sdFooter">
        <span>MOGT — {industryName.toUpperCase()}</span>
        <span><a href="/services">SOLUTIONS ARCHIVE</a></span>
        <span>© {new Date().getFullYear()}</span>
      </footer>

      <style jsx global>{`
        .sd {
          position: relative; min-height: 100vh;
          background: linear-gradient(180deg, #0a0a0a 0%, #050505 52%, #030303 100%);
          color: rgba(255,255,255,0.92);
          font-family: var(--font-geist-sans, sans-serif);
          overflow-x: hidden;
        }
        .sdBg {
          position: fixed; inset: 0; z-index: 0; pointer-events: none;
          background-image:
            linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px);
          background-size: 58px 58px;
          mask-image: radial-gradient(ellipse 90% 55% at 50% 0%, #000 0%, transparent 80%);
          -webkit-mask-image: radial-gradient(ellipse 90% 55% at 50% 0%, #000 0%, transparent 80%);
        }
        .sdScan {
          position: fixed; inset: 0; z-index: 0; pointer-events: none;
          background: repeating-linear-gradient(to bottom, transparent 0, transparent 2px, rgba(255,255,255,0.012) 3px, transparent 4px);
        }
        .sd > section, .sd > nav, .sd > footer, .sd > header { position: relative; z-index: 1; }

        .sdCorner { position: absolute; width: 15px; height: 15px; pointer-events: none; }
        .sdCorner.tl { left: -1px; top: -1px; border-left: 1px solid rgba(255,255,255,0.5); border-top: 1px solid rgba(255,255,255,0.5); }
        .sdCorner.tr { right: -1px; top: -1px; border-right: 1px solid rgba(255,255,255,0.5); border-top: 1px solid rgba(255,255,255,0.5); }
        .sdCorner.bl { left: -1px; bottom: -1px; border-left: 1px solid rgba(255,255,255,0.3); border-bottom: 1px solid rgba(255,255,255,0.3); }
        .sdCorner.br { right: -1px; bottom: -1px; border-right: 1px solid rgba(255,255,255,0.3); border-bottom: 1px solid rgba(255,255,255,0.3); }

        /* Breadcrumb */
        .sdCrumb {
          display: flex; flex-wrap: wrap; align-items: center; gap: 8px;
          max-width: 1120px; margin: 0 auto; padding: 20px clamp(18px, 4vw, 40px) 0;
          color: rgba(255,255,255,0.4);
          font-family: var(--font-geist-mono, ui-monospace, monospace);
          font-size: 10.5px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase;
        }
        .sdCrumb a { color: rgba(255,255,255,0.55); text-decoration: none; transition: color 140ms ease; }
        .sdCrumb a:hover { color: #fff; }
        .sdCrumb em { color: rgba(255,255,255,0.9); font-style: normal; }
        .sdCrumb span { color: rgba(255,255,255,0.25); }

        /* Hero */
        .sdHero {
          display: grid; grid-template-columns: minmax(0,1fr) 320px; gap: 40px; align-items: start;
          max-width: 1120px; margin: 0 auto; padding: clamp(32px, 5vh, 56px) clamp(18px, 4vw, 40px) clamp(24px, 4vh, 44px);
        }
        .sdKicker {
          display: inline-flex; align-items: center; gap: 8px; color: rgba(255,255,255,0.5);
          font-family: var(--font-geist-mono, ui-monospace, monospace);
          font-size: 10px; font-weight: 800; letter-spacing: 0.2em; text-transform: uppercase;
        }
        .sdDot { width: 6px; height: 6px; border-radius: 50%; background: rgba(255,255,255,0.85); animation: sdPulse 2.4s ease-in-out infinite; }
        @keyframes sdPulse { 0%,100% { opacity: 1; } 50% { opacity: 0.3; } }
        .sdTitle {
          margin: 16px 0 0; color: #fff;
          font-family: var(--font-geist-mono, ui-monospace, monospace);
          font-size: clamp(30px, 5vw, 56px); font-weight: 400; line-height: 1.04; letter-spacing: -0.01em;
        }
        .sdLede { margin: 18px 0 0; max-width: 54ch; color: rgba(255,255,255,0.58); font-size: clamp(14px, 1.6vw, 17px); line-height: 1.6; }
        .sdHeroChips { display: flex; flex-wrap: wrap; gap: 8px; margin: 22px 0 0; }
        .sdChip {
          padding: 6px 11px; border: 1px solid rgba(255,255,255,0.14); background: rgba(255,255,255,0.02);
          color: rgba(255,255,255,0.66);
          font-family: var(--font-geist-mono, ui-monospace, monospace);
          font-size: 10.5px; font-weight: 600; letter-spacing: 0.04em;
        }
        .sdHeroCta { display: flex; flex-wrap: wrap; gap: 12px; margin: 26px 0 0; }

        .sdBtnPrimary {
          display: inline-flex; align-items: center; gap: 9px; padding: 12px 20px;
          background: #fff; color: #050505; text-decoration: none;
          font-family: var(--font-geist-mono, ui-monospace, monospace);
          font-size: 11px; font-weight: 800; letter-spacing: 0.1em; text-transform: uppercase;
          transition: opacity 160ms ease;
        }
        .sdBtnPrimary svg { width: 14px; height: 10px; transition: transform 200ms ease; }
        .sdBtnPrimary:hover { opacity: 0.88; }
        .sdBtnPrimary:hover svg { transform: translateX(4px); }
        .sdBtnGhost {
          display: inline-flex; align-items: center; padding: 12px 20px;
          border: 1px solid rgba(255,255,255,0.2); color: rgba(255,255,255,0.82); text-decoration: none;
          font-family: var(--font-geist-mono, ui-monospace, monospace);
          font-size: 11px; font-weight: 800; letter-spacing: 0.1em; text-transform: uppercase;
          transition: border-color 160ms ease, background 160ms ease;
        }
        .sdBtnGhost:hover { border-color: rgba(255,255,255,0.5); background: rgba(255,255,255,0.05); }

        /* Spec sheet */
        .sdSpec {
          position: relative; padding: 20px;
          border: 1px solid rgba(255,255,255,0.12);
          background: linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0.005));
        }
        .sdSpecHead {
          display: flex; align-items: center; justify-content: space-between;
          padding-bottom: 12px; margin-bottom: 4px; border-bottom: 1px solid rgba(255,255,255,0.1);
          color: rgba(255,255,255,0.4);
          font-family: var(--font-geist-mono, ui-monospace, monospace);
          font-size: 9.5px; font-weight: 800; letter-spacing: 0.18em;
        }
        .sdSpecHead b { color: rgba(255,255,255,0.8); }
        .sdSpecList { display: flex; flex-direction: column; }
        .sdSpecList > div {
          display: grid; grid-template-columns: 92px 1fr; gap: 10px; align-items: center;
          padding: 11px 0; border-bottom: 1px solid rgba(255,255,255,0.06);
        }
        .sdSpecList > div:last-child { border-bottom: none; }
        .sdSpecList dt {
          color: rgba(255,255,255,0.36);
          font-family: var(--font-geist-mono, ui-monospace, monospace);
          font-size: 9px; font-weight: 800; letter-spacing: 0.14em; text-transform: uppercase;
        }
        .sdSpecList dd {
          margin: 0; color: rgba(255,255,255,0.82);
          font-family: var(--font-geist-mono, ui-monospace, monospace);
          font-size: 11px; font-weight: 600; letter-spacing: 0.02em; line-height: 1.4;
        }
        .sdStatusOk { color: rgba(255,255,255,0.9) !important; }

        /* Sections */
        .sdSection { max-width: 1120px; margin: 0 auto; padding: clamp(30px, 5vh, 56px) clamp(18px, 4vw, 40px); border-top: 1px solid rgba(255,255,255,0.07); }
        .sdSectionHead { margin-bottom: clamp(20px, 3vh, 32px); }
        .sdSectionKicker {
          display: block; color: rgba(255,255,255,0.4);
          font-family: var(--font-geist-mono, ui-monospace, monospace);
          font-size: 10px; font-weight: 800; letter-spacing: 0.2em; text-transform: uppercase;
        }
        .sdSectionTitle {
          margin: 10px 0 0; color: #fff;
          font-family: var(--font-geist-mono, ui-monospace, monospace);
          font-size: clamp(22px, 3.4vw, 34px); font-weight: 400; letter-spacing: 0.01em; line-height: 1.06;
        }
        .sdSectionDesc { margin: 10px 0 0; max-width: 62ch; color: rgba(255,255,255,0.5); font-size: 14px; line-height: 1.55; }

        .sdProse { max-width: 72ch; }
        .sdProse p { margin: 0 0 16px; color: rgba(255,255,255,0.66); font-size: clamp(14px, 1.5vw, 16px); line-height: 1.7; }
        .sdProse p:last-child { margin-bottom: 0; }

        /* Modules */
        .sdModGrid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 10px; }
        .sdMod {
          position: relative; padding: 18px; overflow: hidden;
          border: 1px solid rgba(255,255,255,0.1);
          background: linear-gradient(180deg, rgba(255,255,255,0.022), rgba(255,255,255,0.004));
        }
        .sdModTop { position: absolute; left: 0; top: 0; width: 36px; height: 1px; background: rgba(255,255,255,0.5); }
        .sdModNum { color: rgba(255,255,255,0.34); font-family: var(--font-geist-mono, ui-monospace, monospace); font-size: 10px; font-weight: 800; letter-spacing: 0.1em; }
        .sdModName {
          margin: 14px 0 0; color: #fff;
          font-family: var(--font-geist-mono, ui-monospace, monospace);
          font-size: 15px; font-weight: 700; letter-spacing: 0.01em;
        }
        .sdModDesc { margin: 8px 0 0; color: rgba(255,255,255,0.5); font-size: 12.5px; line-height: 1.5; }

        /* Steps */
        .sdSteps { display: grid; gap: 1px; border: 1px solid rgba(255,255,255,0.1); background: rgba(255,255,255,0.06); }
        .sdStep { display: grid; grid-template-columns: 64px 1fr; gap: 16px; padding: 20px clamp(16px, 2.5vw, 28px); background: #070707; }
        .sdStepNum {
          color: rgba(255,255,255,0.28);
          font-family: var(--font-geist-mono, ui-monospace, monospace);
          font-size: clamp(24px, 3vw, 34px); font-weight: 400; line-height: 1;
        }
        .sdStepKicker { color: rgba(255,255,255,0.42); font-family: var(--font-geist-mono, ui-monospace, monospace); font-size: 9.5px; font-weight: 800; letter-spacing: 0.16em; text-transform: uppercase; }
        .sdStepTitle { margin: 7px 0 0; color: #fff; font-family: var(--font-geist-mono, ui-monospace, monospace); font-size: 17px; font-weight: 400; letter-spacing: 0.01em; }
        .sdStepDesc { margin: 8px 0 0; max-width: 70ch; color: rgba(255,255,255,0.54); font-size: 13.5px; line-height: 1.6; }

        /* Standards */
        .sdStdGrid { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 10px; }
        .sdStd { padding: 18px; border: 1px solid rgba(255,255,255,0.1); background: rgba(255,255,255,0.014); }
        .sdStdTitle { margin: 0; color: #fff; font-family: var(--font-geist-mono, ui-monospace, monospace); font-size: 15px; font-weight: 700; }
        .sdStdDesc { margin: 7px 0 0; color: rgba(255,255,255,0.48); font-size: 12.5px; line-height: 1.5; }

        /* Related */
        .sdRelGrid { display: grid; grid-template-columns: repeat(auto-fill, minmax(248px, 1fr)); gap: 10px; }
        .sdRel {
          position: relative; display: flex; flex-direction: column; padding: 18px; overflow: hidden;
          text-decoration: none; color: inherit;
          border: 1px solid rgba(255,255,255,0.09);
          background: linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.004));
          transition: border-color 180ms ease, background 180ms ease, transform 180ms ease;
        }
        .sdRelTop { position: absolute; left: 0; top: 0; width: 0; height: 1px; background: linear-gradient(90deg, rgba(255,255,255,0.7), transparent); transition: width 300ms ${cssEase(EASE_OUT)}; }
        .sdRel:hover { border-color: rgba(255,255,255,0.3); background: linear-gradient(180deg, rgba(255,255,255,0.05), rgba(255,255,255,0.008)); transform: translateY(-2px); }
        .sdRel:hover .sdRelTop { width: 100%; }
        .sdRelTitle { margin: 0; color: rgba(255,255,255,0.94); font-family: var(--font-geist-mono, ui-monospace, monospace); font-size: 15px; font-weight: 700; line-height: 1.25; }
        .sdRel:hover .sdRelTitle { color: #fff; }
        .sdRelDesc { margin: 8px 0 0; color: rgba(255,255,255,0.46); font-size: 12.5px; line-height: 1.45; }
        .sdRelArrow {
          display: inline-flex; align-items: center; gap: 8px; margin-top: 16px; padding-top: 14px;
          border-top: 1px solid rgba(255,255,255,0.07);
          color: rgba(255,255,255,0.6);
          font-family: var(--font-geist-mono, ui-monospace, monospace);
          font-size: 10px; font-weight: 800; letter-spacing: 0.1em; text-transform: uppercase;
        }
        .sdRelArrow svg { width: 13px; height: 9px; transition: transform 200ms ease; }
        .sdRel:hover .sdRelArrow { color: #fff; }
        .sdRel:hover .sdRelArrow svg { transform: translateX(4px); }

        /* Complexity badge */
        .sdCx { display: inline-block; padding: 3px 8px; font-family: var(--font-geist-mono, ui-monospace, monospace); font-size: 9px; font-weight: 800; letter-spacing: 0.1em; text-transform: uppercase; border: 1px solid rgba(255,255,255,0.16); }
        .sdCx-low { color: rgba(255,255,255,0.62); }
        .sdCx-medium { color: rgba(255,255,255,0.82); }
        .sdCx-high { color: #fff; border-color: rgba(255,255,255,0.36); }
        .sdCx-critical { color: #fff; border-color: rgba(255,255,255,0.55); background: rgba(255,255,255,0.07); }

        /* CTA */
        .sdCta {
          position: relative; max-width: 1120px; margin: clamp(30px, 5vh, 56px) auto clamp(40px, 6vh, 72px);
          padding: clamp(40px, 6vw, 72px) clamp(24px, 5vw, 64px); text-align: center;
          border: 1px solid rgba(255,255,255,0.12);
          background: linear-gradient(180deg, rgba(255,255,255,0.035), rgba(255,255,255,0.004));
        }
        .sdCta .sdCorner { width: 16px; height: 16px; }
        .sdCtaKicker { color: rgba(255,255,255,0.4); font-family: var(--font-geist-mono, ui-monospace, monospace); font-size: 10px; font-weight: 800; letter-spacing: 0.2em; }
        .sdCtaTitle { margin: 16px 0 0; color: #fff; font-family: var(--font-geist-mono, ui-monospace, monospace); font-size: clamp(22px, 4vw, 38px); font-weight: 400; line-height: 1.1; }
        .sdCtaDesc { margin: 14px auto 0; max-width: 54ch; color: rgba(255,255,255,0.54); font-size: 14px; line-height: 1.6; }
        .sdCtaActions { display: flex; flex-wrap: wrap; gap: 12px; justify-content: center; margin-top: 26px; }

        /* Footer */
        .sdFooter {
          display: flex; flex-wrap: wrap; gap: 10px; align-items: center; justify-content: space-between;
          max-width: 1120px; margin: 0 auto; padding: 22px clamp(18px, 4vw, 40px) 44px;
          border-top: 1px solid rgba(255,255,255,0.08);
          color: rgba(255,255,255,0.34);
          font-family: var(--font-geist-mono, ui-monospace, monospace);
          font-size: 10px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase;
        }
        .sdFooter a { color: inherit; text-decoration: none; transition: color 140ms ease; }
        .sdFooter a:hover { color: #fff; }

        /* Responsive */
        @media (max-width: 820px) {
          .sdHero { grid-template-columns: 1fr; gap: 28px; }
          .sdSpec { order: -1; }
        }
        @media (max-width: 480px) {
          .sdStep { grid-template-columns: 1fr; gap: 6px; }
        }
        @media (prefers-reduced-motion: reduce) {
          .sdDot, .sdRelTop, .sdRelArrow svg, .sdBtnPrimary svg { animation: none !important; transition: none !important; }
        }
      `}</style>
    </div>
  );
}

function ComplexityBadge({ level }: { level: Complexity }) {
  return <span className={`sdCx sdCx-${level.toLowerCase()}`}>{level}</span>;
}

function cssEase([a, b, c, d]: readonly [number, number, number, number]) {
  return `cubic-bezier(${a}, ${b}, ${c}, ${d})`;
}
