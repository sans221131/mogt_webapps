'use client';

// ── Section E / Client Proof ─────────────────────────────────────────────────
// A monochrome "verified build report" archive — not a generic testimonial
// slider. One featured proof card + a grid of compact outcome cards, framed
// like signed delivery notes. Single reflowing DOM (no desktop/mobile dupes).

type Testimonial = {
  quote: string;
  name: string;
  role: string;
  company: string;
  category: string;
  badge: string;
  outcomes: string[];
};

const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      'They turned a messy idea into a clear build plan. The final interface felt structured, fast, and ready for real users.',
    name: 'Aarav Mehta',
    role: 'Founder',
    company: 'RepairLink',
    category: 'WEB APP',
    badge: 'VERIFIED',
    outcomes: ['Scope clarified', 'Build risk reduced', 'Mobile UX improved'],
  },
  {
    quote:
      'The biggest win was clarity. We knew what to build, what to ignore, and how the user journey should actually work.',
    name: 'Priya Sharma',
    role: 'Operations Lead',
    company: 'ServiceDesk',
    category: 'OPERATIONS',
    badge: 'SHIPPED',
    outcomes: ['Flow simplified', 'Edge cases mapped', 'Faster handoff'],
  },
  {
    quote:
      'They did not just make screens. They thought through states, errors, and how the product would behave after launch.',
    name: 'Rohan Kapoor',
    role: 'Product Manager',
    company: 'FinCore',
    category: 'SAAS',
    badge: 'BUILD READY',
    outcomes: ['State logic defined', 'UX gaps fixed', 'Dev clarity improved'],
  },
  {
    quote:
      'The design looked sharp, but more importantly, it made the business process easier to understand.',
    name: 'Meera Iyer',
    role: 'Director',
    company: 'UrbanCart',
    category: 'ECOMMERCE',
    badge: 'UX FIXED',
    outcomes: ['Cleaner journey', 'Better conversion flow', 'Reduced confusion'],
  },
];

const PROOF_STATS = [
  { value: '40+', label: 'Systems shipped' },
  { value: '10', label: 'Industries' },
  { value: '100%', label: 'Build-ready handoffs' },
  { value: '0', label: 'Surprise rebuilds' },
];

export default function TestimonialsSection() {
  const featured = TESTIMONIALS[0];
  const rest = TESTIMONIALS.slice(1);

  return (
    <div className="cp">
      {/* full-width background grid */}
      <div className="cpBg" aria-hidden="true" />
      <span className="cpBgWord" aria-hidden="true">PROOF</span>

      <div className="cpInner">
        {/* header */}
        <header className="cpHead">
          <div className="cpHeadText">
            <span className="cpLabel">SECTION E / CLIENT PROOF</span>
            <h2 className="cpH2">WHAT CLIENTS SAY AFTER THE SYSTEM SHIPS</h2>
            <p className="cpSub">Clearer builds. Fewer surprises. Better handoffs.</p>
          </div>

          <dl className="cpStats" aria-label="Delivery record">
            {PROOF_STATS.map((s) => (
              <div key={s.label} className="cpStat">
                <dt className="cpStatVal">{s.value}</dt>
                <dd className="cpStatLbl">{s.label}</dd>
              </div>
            ))}
          </dl>
        </header>

        {/* proof grid */}
        <div className="cpGrid">
          {/* featured report */}
          <figure className="cpReport cpReportFeat">
            <b className="cpBr cpBrTL" aria-hidden="true" />
            <b className="cpBr cpBrBR" aria-hidden="true" />
            <div className="cpReportTop">
              <span className="cpFile">REPORT / {featured.company.toUpperCase()}</span>
              <span className="cpBadge">{featured.badge}</span>
            </div>
            <blockquote className="cpQuote">“{featured.quote}”</blockquote>
            <ul className="cpOutcomes" aria-label="Outcomes">
              {featured.outcomes.map((o) => (
                <li key={o}>
                  <i aria-hidden="true">✓</i>
                  {o}
                </li>
              ))}
            </ul>
            <figcaption className="cpMeta">
              <span className="cpName">{featured.name}</span>
              <span className="cpRole">
                {featured.role} · {featured.company}
              </span>
              <span className="cpCat">{featured.category}</span>
            </figcaption>
          </figure>

          {/* compact reports */}
          <div className="cpMini">
            {rest.map((t) => (
              <figure key={t.company} className="cpReport cpReportMini">
                <div className="cpReportTop">
                  <span className="cpFile">REPORT / {t.company.toUpperCase()}</span>
                  <span className="cpBadge">{t.badge}</span>
                </div>
                <blockquote className="cpQuote">“{t.quote}”</blockquote>
                <figcaption className="cpMeta">
                  <span className="cpName">{t.name}</span>
                  <span className="cpRole">
                    {t.role} · {t.company}
                  </span>
                  <span className="cpCat">{t.category}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        .cp {
          position: relative;
          width: 100%;
          height: 100%;
          background: #070707;
          color: #ededed;
          overflow: hidden;
          pointer-events: all;
          font-family: var(--font-geist-mono, 'Courier New', monospace);
        }

        /* full-width background grid + faint word */
        .cpBg {
          position: absolute;
          inset: 0;
          pointer-events: none;
          background-image:
            linear-gradient(rgba(255, 255, 255, 0.022) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.022) 1px, transparent 1px);
          background-size: 46px 46px;
          mask-image: radial-gradient(circle at 50% 42%, #000 30%, transparent 78%);
          -webkit-mask-image: radial-gradient(circle at 50% 42%, #000 30%, transparent 78%);
        }

        .cpBgWord {
          position: absolute;
          right: -2%;
          bottom: -6%;
          font-size: 200px;
          font-weight: 800;
          letter-spacing: 0.02em;
          color: rgba(255, 255, 255, 0.012);
          pointer-events: none;
          user-select: none;
        }

        .cpInner {
          position: relative;
          z-index: 1;
          width: min(calc(100% - 40px), 1200px);
          margin-inline: auto;
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: center;
          gap: clamp(20px, 3vh, 38px);
          padding: clamp(36px, 6vh, 76px) 0;
          box-sizing: border-box;
        }

        /* header */
        .cpHead {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 32px;
          flex-wrap: wrap;
        }

        .cpHeadText {
          min-width: 0;
        }

        .cpLabel {
          display: block;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.22em;
          color: rgba(255, 255, 255, 0.42);
          text-transform: uppercase;
        }

        .cpH2 {
          margin: 12px 0 0;
          font-size: clamp(20px, 2.4vw, 34px);
          line-height: 1.08;
          font-weight: 380;
          letter-spacing: -0.01em;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.95);
        }

        .cpSub {
          margin: 12px 0 0;
          font-size: clamp(12px, 0.95vw, 14px);
          line-height: 1.6;
          color: rgba(255, 255, 255, 0.54);
          font-family: var(--font-geist-sans, sans-serif);
        }

        /* stats */
        .cpStats {
          display: flex;
          gap: 0;
          margin: 0;
          flex: none;
        }

        .cpStat {
          padding: 0 clamp(14px, 1.6vw, 22px);
          border-left: 1px solid rgba(255, 255, 255, 0.1);
        }

        .cpStat:first-child {
          padding-left: 0;
          border-left: none;
        }

        .cpStatVal {
          margin: 0;
          font-size: clamp(22px, 2.2vw, 30px);
          font-weight: 420;
          letter-spacing: -0.02em;
          color: rgba(255, 255, 255, 0.95);
        }

        .cpStatLbl {
          margin: 6px 0 0;
          font-size: 9px;
          font-weight: 800;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.4);
          white-space: nowrap;
        }

        /* grid */
        .cpGrid {
          display: grid;
          grid-template-columns: minmax(0, 1.05fr) minmax(0, 1fr);
          gap: 16px;
          min-height: 0;
        }

        /* report cards */
        .cpReport {
          position: relative;
          display: flex;
          flex-direction: column;
          border: 1px solid rgba(255, 255, 255, 0.12);
          background:
            linear-gradient(180deg, rgba(255, 255, 255, 0.018), rgba(255, 255, 255, 0.003)),
            rgba(5, 5, 5, 0.6);
          transition: border-color 0.25s ease, background 0.25s ease;
        }

        .cpReport:hover {
          border-color: rgba(255, 255, 255, 0.26);
        }

        .cpReportFeat {
          padding: clamp(20px, 2vw, 30px);
          gap: 18px;
          justify-content: space-between;
        }

        .cpBr {
          position: absolute;
          width: 12px;
          height: 12px;
          pointer-events: none;
        }
        .cpBrTL { top: -1px; left: -1px; border-top: 1.5px solid rgba(255,255,255,0.4); border-left: 1.5px solid rgba(255,255,255,0.4); }
        .cpBrBR { bottom: -1px; right: -1px; border-bottom: 1.5px solid rgba(255,255,255,0.4); border-right: 1.5px solid rgba(255,255,255,0.4); }

        .cpReportTop {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
        }

        .cpFile {
          font-size: 9.5px;
          font-weight: 800;
          letter-spacing: 0.14em;
          color: rgba(255, 255, 255, 0.4);
          text-transform: uppercase;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .cpBadge {
          flex: none;
          padding: 3px 8px;
          border: 1px solid rgba(255, 255, 255, 0.22);
          font-size: 8.5px;
          font-weight: 800;
          letter-spacing: 0.1em;
          color: rgba(255, 255, 255, 0.78);
          text-transform: uppercase;
        }

        .cpQuote {
          margin: 0;
          font-family: var(--font-geist-sans, sans-serif);
          color: rgba(255, 255, 255, 0.86);
          letter-spacing: -0.005em;
        }

        .cpReportFeat .cpQuote {
          font-size: clamp(15px, 1.4vw, 19px);
          line-height: 1.5;
          font-weight: 400;
        }

        .cpReportMini .cpQuote {
          font-size: 12.5px;
          line-height: 1.55;
          color: rgba(255, 255, 255, 0.72);
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .cpOutcomes {
          list-style: none;
          margin: 0;
          padding: 0;
          display: flex;
          flex-wrap: wrap;
          gap: 8px 18px;
        }

        .cpOutcomes li {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          font-size: 11px;
          letter-spacing: 0.04em;
          color: rgba(255, 255, 255, 0.6);
          text-transform: uppercase;
        }

        .cpOutcomes i {
          font-style: normal;
          color: rgba(255, 255, 255, 0.82);
          font-size: 10px;
        }

        .cpMeta {
          display: flex;
          flex-direction: column;
          gap: 3px;
          padding-top: 14px;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
        }

        .cpName {
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.04em;
          color: rgba(255, 255, 255, 0.92);
          text-transform: uppercase;
        }

        .cpRole {
          font-size: 10.5px;
          letter-spacing: 0.03em;
          color: rgba(255, 255, 255, 0.46);
          font-family: var(--font-geist-sans, sans-serif);
          text-transform: none;
        }

        .cpCat {
          margin-top: 6px;
          font-size: 8.5px;
          font-weight: 800;
          letter-spacing: 0.16em;
          color: rgba(255, 255, 255, 0.34);
        }

        /* mini stack */
        .cpMini {
          display: grid;
          grid-template-rows: repeat(3, minmax(0, 1fr));
          gap: 12px;
          min-height: 0;
        }

        .cpReportMini {
          padding: 14px 16px;
          gap: 10px;
          justify-content: space-between;
        }

        .cpReportMini .cpMeta {
          flex-direction: row;
          align-items: baseline;
          gap: 10px;
          flex-wrap: wrap;
          padding-top: 10px;
        }

        .cpReportMini .cpCat {
          margin-top: 0;
          margin-left: auto;
        }

        /* ── tablet ── */
        @media (max-width: 1000px) {
          .cpGrid {
            grid-template-columns: 1fr;
          }
          .cpMini {
            grid-template-rows: none;
            grid-template-columns: repeat(3, 1fr);
          }
          .cpReportMini .cpQuote {
            -webkit-line-clamp: 4;
          }
        }

        /* ── mobile ── */
        @media (max-width: 768px) {
          .cp {
            height: auto;
          }
          .cpInner {
            width: min(calc(100% - 32px), 1200px);
            height: auto;
            justify-content: flex-start;
            padding: 48px 0 56px;
            gap: 24px;
          }
          .cpBgWord {
            display: none;
          }
          .cpHead {
            flex-direction: column;
            align-items: flex-start;
            gap: 20px;
          }
          .cpStats {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 14px;
            width: 100%;
          }
          .cpStat {
            padding: 12px 14px;
            border: 1px solid rgba(255, 255, 255, 0.1);
          }
          .cpStat:first-child {
            padding: 12px 14px;
          }
          .cpStatLbl {
            white-space: normal;
          }
          .cpMini {
            grid-template-columns: 1fr;
          }
          .cpReportMini .cpQuote {
            -webkit-line-clamp: unset;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .cpReport {
            transition: none;
          }
        }
      `}</style>
    </div>
  );
}
