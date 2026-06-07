'use client';

// ── Section F / Project Intake ───────────────────────────────────────────────
// Final conversion panel styled as a technical intake terminal. Strong CTA,
// a "what the intake covers" checklist, and the build categories MOGT takes on.
// Single reflowing DOM. No form yet — a sharp CTA is enough for now.

const SERVICES = [
  'Web Apps',
  'Dashboards',
  'SaaS Platforms',
  'ERP / Internal Tools',
  'Marketplaces',
  'Automation Systems',
];

const INTAKE_STEPS = [
  'Scope & success criteria',
  'Core user flows & screens',
  'Risk & edge-case map',
  'Build path & milestones',
];

export default function ProjectIntakeSection({ contactHref }: { contactHref: string }) {
  return (
    <div className="pi">
      {/* full-width background grid */}
      <div className="piBg" aria-hidden="true" />
      <span className="piBgWord" aria-hidden="true">INTAKE</span>

      <div className="piInner">
        <div className="piMain">
          {/* intro + CTA */}
          <div className="piIntro">
            <span className="piLabel">SECTION F / PROJECT INTAKE</span>
            <h2 className="piH2">READY TO TURN THE IDEA INTO A SYSTEM?</h2>
            <p className="piSub">
              Send the brief. We will help shape the scope, risks, screens, and build path
              before the first sprint burns money.
            </p>

            <div className="piActions">
              <a className="piBtn piBtnPrimary" href={contactHref}>
                Start a Project
              </a>
              <a className="piBtn piBtnGhost" href={contactHref}>
                Send Project Brief
              </a>
            </div>

            <p className="piNote">Typical response within one business day.</p>
          </div>

          {/* intake terminal */}
          <div className="piTerminal" role="group" aria-label="What the intake covers">
            <div className="piTermBar">
              <span className="piTermDot" aria-hidden="true" />
              <span className="piTermTitle">INTAKE.TERMINAL</span>
              <span className="piTermStatus">READY</span>
            </div>
            <div className="piTermBody">
              <p className="piTermLine piTermPrompt">&gt; mogt intake --new</p>
              <p className="piTermLine piTermMuted">scoping session covers:</p>
              <ul className="piChecklist">
                {INTAKE_STEPS.map((s) => (
                  <li key={s}>
                    <i aria-hidden="true">[✓]</i>
                    {s}
                  </li>
                ))}
              </ul>
              <p className="piTermLine piTermCursor">
                &gt; awaiting brief<span className="piBlink" aria-hidden="true">_</span>
              </p>
            </div>
          </div>
        </div>

        {/* build categories */}
        <div className="piServices" aria-label="What we build">
          <span className="piServicesLbl">WHAT WE BUILD</span>
          <div className="piChips">
            {SERVICES.map((s) => (
              <span key={s} className="piChip">{s}</span>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        .pi {
          position: relative;
          width: 100%;
          height: 100%;
          background: #060606;
          color: #ededed;
          overflow: hidden;
          pointer-events: all;
          font-family: var(--font-geist-mono, 'Courier New', monospace);
        }

        .piBg {
          position: absolute;
          inset: 0;
          pointer-events: none;
          background-image:
            linear-gradient(rgba(255, 255, 255, 0.022) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.022) 1px, transparent 1px);
          background-size: 46px 46px;
          mask-image: radial-gradient(circle at 50% 45%, #000 28%, transparent 76%);
          -webkit-mask-image: radial-gradient(circle at 50% 45%, #000 28%, transparent 76%);
        }

        .piBgWord {
          position: absolute;
          left: -2%;
          bottom: -8%;
          font-size: 210px;
          font-weight: 800;
          color: rgba(255, 255, 255, 0.012);
          pointer-events: none;
          user-select: none;
        }

        .piInner {
          position: relative;
          z-index: 1;
          width: min(calc(100% - 40px), 1200px);
          margin-inline: auto;
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: center;
          gap: clamp(22px, 4vh, 44px);
          padding: clamp(36px, 6vh, 76px) 0;
          box-sizing: border-box;
        }

        .piMain {
          display: grid;
          grid-template-columns: minmax(0, 1.1fr) minmax(0, 0.9fr);
          gap: clamp(24px, 4vw, 56px);
          align-items: center;
        }

        /* intro */
        .piLabel {
          display: block;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.22em;
          color: rgba(255, 255, 255, 0.42);
          text-transform: uppercase;
        }

        .piH2 {
          margin: 14px 0 0;
          font-size: clamp(24px, 3vw, 44px);
          line-height: 1.05;
          font-weight: 380;
          letter-spacing: -0.02em;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.96);
        }

        .piSub {
          margin: 16px 0 0;
          max-width: 460px;
          font-size: clamp(13px, 1vw, 15px);
          line-height: 1.65;
          color: rgba(255, 255, 255, 0.56);
          font-family: var(--font-geist-sans, sans-serif);
        }

        .piActions {
          display: flex;
          flex-wrap: wrap;
          gap: 14px;
          margin-top: 30px;
        }

        .piBtn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          height: 56px;
          min-width: 190px;
          padding: 0 26px;
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          text-decoration: none;
          border: 1px solid rgba(255, 255, 255, 0.36);
          transition: border-color 180ms ease, background 180ms ease, transform 180ms ease;
        }

        .piBtnPrimary {
          color: rgba(255, 255, 255, 0.95);
          background:
            linear-gradient(180deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.012)),
            rgba(0, 0, 0, 0.2);
        }

        .piBtnGhost {
          color: rgba(255, 255, 255, 0.8);
          background: transparent;
          border-color: rgba(255, 255, 255, 0.2);
        }

        .piBtn:hover {
          border-color: rgba(255, 255, 255, 0.62);
          background: rgba(255, 255, 255, 0.06);
          transform: translateY(-1px);
        }

        .piNote {
          margin: 18px 0 0;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.36);
        }

        /* terminal */
        .piTerminal {
          border: 1px solid rgba(255, 255, 255, 0.14);
          background:
            linear-gradient(180deg, rgba(255, 255, 255, 0.02), rgba(255, 255, 255, 0.004)),
            rgba(4, 4, 4, 0.7);
        }

        .piTermBar {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 11px 14px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .piTermDot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.6);
          box-shadow: 0 0 8px rgba(255, 255, 255, 0.4);
        }

        .piTermTitle {
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 0.16em;
          color: rgba(255, 255, 255, 0.6);
        }

        .piTermStatus {
          margin-left: auto;
          font-size: 9px;
          font-weight: 800;
          letter-spacing: 0.14em;
          color: rgba(255, 255, 255, 0.4);
          border: 1px solid rgba(255, 255, 255, 0.16);
          padding: 2px 7px;
        }

        .piTermBody {
          padding: 18px 18px 20px;
        }

        .piTermLine {
          margin: 0;
          font-size: 12px;
          line-height: 1.7;
          letter-spacing: 0.02em;
          color: rgba(255, 255, 255, 0.6);
        }

        .piTermPrompt {
          color: rgba(255, 255, 255, 0.9);
        }

        .piTermMuted {
          color: rgba(255, 255, 255, 0.4);
          margin-top: 6px;
        }

        .piChecklist {
          list-style: none;
          margin: 10px 0;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: 9px;
        }

        .piChecklist li {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 12.5px;
          letter-spacing: 0.01em;
          color: rgba(255, 255, 255, 0.78);
          font-family: var(--font-geist-sans, sans-serif);
        }

        .piChecklist i {
          font-style: normal;
          font-family: var(--font-geist-mono, monospace);
          font-size: 11px;
          color: rgba(255, 255, 255, 0.55);
        }

        .piTermCursor {
          margin-top: 8px;
          color: rgba(255, 255, 255, 0.7);
        }

        .piBlink {
          animation: piBlink 1.1s steps(1, end) infinite;
        }

        @keyframes piBlink {
          0%, 50% { opacity: 1; }
          50.01%, 100% { opacity: 0; }
        }

        /* services */
        .piServices {
          display: flex;
          align-items: center;
          gap: clamp(14px, 2vw, 26px);
          padding-top: clamp(18px, 3vh, 30px);
          border-top: 1px solid rgba(255, 255, 255, 0.08);
          flex-wrap: wrap;
        }

        .piServicesLbl {
          font-size: 9.5px;
          font-weight: 800;
          letter-spacing: 0.18em;
          color: rgba(255, 255, 255, 0.36);
          text-transform: uppercase;
          flex: none;
        }

        .piChips {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
        }

        .piChip {
          padding: 8px 14px;
          border: 1px solid rgba(255, 255, 255, 0.14);
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.05em;
          color: rgba(255, 255, 255, 0.66);
          text-transform: uppercase;
          transition: border-color 0.2s ease, color 0.2s ease;
        }

        .piChip:hover {
          border-color: rgba(255, 255, 255, 0.34);
          color: rgba(255, 255, 255, 0.92);
        }

        /* ── tablet ── */
        @media (max-width: 900px) {
          .piMain {
            grid-template-columns: 1fr;
            gap: 28px;
          }
        }

        /* ── mobile ── */
        @media (max-width: 768px) {
          .pi {
            height: auto;
          }
          .piInner {
            width: min(calc(100% - 32px), 1200px);
            height: auto;
            justify-content: flex-start;
            padding: 48px 0 56px;
            gap: 28px;
          }
          .piBgWord {
            display: none;
          }
          .piActions {
            margin-top: 24px;
          }
          .piBtn {
            flex: 1 1 auto;
            min-width: 0;
          }
          .piServices {
            flex-direction: column;
            align-items: flex-start;
            gap: 14px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .piBlink {
            animation: none;
          }
          .piBtn,
          .piChip {
            transition: none;
          }
        }
      `}</style>
    </div>
  );
}
