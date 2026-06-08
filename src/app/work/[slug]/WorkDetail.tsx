'use client';

import { motion, useReducedMotion, type Variants } from 'framer-motion';
import SiteHeader from '../../components/SiteHeader';
import type { Project } from '../../../../public/portfolio';

const EASE_OUT = [0.22, 1, 0.36, 1] as const;
const CONTACT_HREF = `mailto:hello@mogt.studio?subject=Project%20Inquiry%20%E2%80%94%20MOGT`;

type RelatedItem = { slug: string; title: string; description: string; type: string };

type Props = {
  project: Project;
  slug: string;
  categoryName: string;
  categoryId: string;
  related: RelatedItem[];
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 18, filter: 'blur(4px)' },
  show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.55, ease: EASE_OUT } },
};
const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.04 } },
};

function parseLiveLinks(raw: string): { label: string; href: string }[] {
  const links: { label: string; href: string }[] = [];
  const urlRegex = /https?:\/\/[^\s,;]+/g;
  const matches = raw.match(urlRegex) ?? [];
  const seen = new Set<string>();
  matches.forEach((href, i) => {
    if (seen.has(href)) return;
    seen.add(href);
    // Derive a short label from the URL
    try {
      const host = new URL(href).hostname.replace(/^www\./, '');
      links.push({ label: i === 0 ? 'Live Site' : host, href });
    } catch {
      links.push({ label: `Link ${i + 1}`, href });
    }
  });
  return links;
}

function typeLabel(t: string): string {
  const m: Record<string, string> = {
    'web': 'Web App',
    'mobile': 'Mobile App',
    'web and mobile': 'Web + Mobile',
    'web & mobile': 'Web + Mobile',
  };
  return m[t.toLowerCase().trim()] ?? t;
}

export default function WorkDetail({ project, slug, categoryName, categoryId, related }: Props) {
  const prefersReduced = useReducedMotion();

  const liveLinks = project.liveLink ? parseLiveLinks(project.liveLink) : [];

  const reveal = (extra?: Record<string, unknown>) =>
    prefersReduced
      ? {}
      : { initial: 'hidden' as const, whileInView: 'show' as const, viewport: { once: true, margin: '-60px' }, ...extra };

  return (
    <div className="wd">
      <div className="wdBg" aria-hidden="true" />
      <div className="wdScan" aria-hidden="true" />

      <SiteHeader />

      <main className="wdMain">

        {/* ── Hero ── */}
        <motion.section
          className="wdHero"
          variants={stagger}
          {...reveal()}
        >
          <motion.nav className="wdBreadcrumb" variants={fadeUp}>
            <a href="/">HOME</a>
            <span aria-hidden="true">/</span>
            <a href="/work">WORK</a>
            <span aria-hidden="true">/</span>
            {categoryId && <a href={`/work?category=${categoryId}`}>{categoryName.toUpperCase()}</a>}
            {categoryId && <span aria-hidden="true">/</span>}
            <span aria-current="page">{project.name.replace(/:.*/,'').replace(/,\s*\w+$/, '').toUpperCase()}</span>
          </motion.nav>

          <motion.div className="wdHeroBody" variants={fadeUp}>
            <div className="wdHeroLeft">
              <span className="wdEyebrow">
                {categoryName.toUpperCase()} &nbsp;/&nbsp; {typeLabel(project.type).toUpperCase()}
              </span>
              <h1 className="wdTitle">{project.name.replace(/:.*/, '').replace(/,\s*\w+$/, '').trim()}</h1>
              {project.name.includes(':') && (
                <p className="wdSubtitle">{project.name.split(':').slice(1).join(':').trim()}</p>
              )}
              <p className="wdTagline">{project.tagline}</p>

              <div className="wdHeroMeta">
                {project.industry && (
                  <div className="wdMetaChip">
                    <span className="wdMetaLabel">INDUSTRY</span>
                    <span className="wdMetaVal">{project.industry}</span>
                  </div>
                )}
                {project.ticketSize && project.ticketSize.trim() && (
                  <div className="wdMetaChip">
                    <span className="wdMetaLabel">TICKET SIZE</span>
                    <span className="wdMetaVal">${project.ticketSize.replace(/[^0-9\-,k]/gi, '')}</span>
                  </div>
                )}
              </div>

              <div className="wdHeroActions">
                {liveLinks.length > 0 && liveLinks.map(({ label, href }) => (
                  <a
                    key={href}
                    href={href}
                    className="wdActionBtn wdActionPrimary"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {label}
                    <svg viewBox="0 0 14 10" aria-hidden="true">
                      <path d="M1 5h11M8 1.5 12.5 5 8 8.5" fill="none" stroke="currentColor" strokeWidth="1.3" />
                    </svg>
                  </a>
                ))}
                {project.figma && project.figma.includes('figma.com') && (
                  <a
                    href={project.figma}
                    className="wdActionBtn wdActionSecondary"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View Figma
                    <svg viewBox="0 0 14 10" aria-hidden="true">
                      <path d="M1 5h11M8 1.5 12.5 5 8 8.5" fill="none" stroke="currentColor" strokeWidth="1.3" />
                    </svg>
                  </a>
                )}
              </div>
            </div>

            <div className="wdHeroRight" aria-hidden="true">
              <div className="wdHeroCard">
                <i className="wdHeroCornerTL" />
                <i className="wdHeroCornerBR" />
                <div className="wdHeroCardBg" />
                <div className="wdHeroCardScan" />
                <div className="wdHeroCardContent">
                  <span className="wdHeroCardEyebrow">PROJECT / {String(project.id).padStart(2, '0')}</span>
                  <span className="wdHeroCardType">{typeLabel(project.type).toUpperCase()}</span>
                  <div className="wdHeroCardDivider" />
                  <div className="wdHeroCardTags">
                    {project.tags.slice(0, 6).map(tag => (
                      <span key={tag} className="wdHeroCardTag">{tag}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.section>

        {/* ── Brief ── */}
        {project.brief && (
          <motion.section
            className="wdSection"
            variants={stagger}
            {...reveal()}
          >
            <motion.div className="wdSectionHead" variants={fadeUp}>
              <span className="wdSectionKicker">PROJECT BRIEF</span>
            </motion.div>
            <motion.p className="wdBrief" variants={fadeUp}>
              {project.brief}
            </motion.p>
          </motion.section>
        )}

        {/* ── Features ── */}
        <motion.section
          className="wdSection"
          variants={stagger}
          {...reveal()}
        >
          <motion.div className="wdSectionHead" variants={fadeUp}>
            <span className="wdSectionKicker">CORE FEATURES</span>
            <h2 className="wdSectionTitle">What We Built</h2>
          </motion.div>

          <motion.div className="wdFeaturesGrid" variants={stagger}>
            {project.features.map((feat, i) => (
              <motion.div key={feat.title} className="wdFeatureCard" variants={fadeUp}>
                <span className="wdFeatureNum">{String(i + 1).padStart(2, '0')}</span>
                <h3 className="wdFeatureTitle">{feat.title}</h3>
                <p className="wdFeatureDesc">{feat.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.section>

        {/* ── Buyer Signals ── */}
        <motion.section
          className="wdSection"
          variants={stagger}
          {...reveal()}
        >
          <motion.div className="wdSectionHead" variants={fadeUp}>
            <span className="wdSectionKicker">BUY SIGNALS</span>
            <h2 className="wdSectionTitle">Who This Is For</h2>
            <p className="wdSectionSub">
              Organisations that match these signals are the ideal fit for this kind of build.
            </p>
          </motion.div>

          <motion.div className="wdSignalsGrid" variants={stagger}>
            {project.signals.map((sig, i) => (
              <motion.div key={sig.title} className="wdSignalCard" variants={fadeUp}>
                <span className="wdSignalNum">{String(i + 1).padStart(2, '0')}</span>
                <div>
                  <h3 className="wdSignalTitle">{sig.title}</h3>
                  <p className="wdSignalDesc">{sig.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.section>

        {/* ── Target Industries ── */}
        <motion.section
          className="wdSection"
          variants={stagger}
          {...reveal()}
        >
          <motion.div className="wdSectionHead" variants={fadeUp}>
            <span className="wdSectionKicker">TARGET INDUSTRIES</span>
          </motion.div>
          <motion.div className="wdIndustriesRow" variants={stagger}>
            {project.targetIndustries.map((ind) => (
              <motion.span key={ind} className="wdIndustryTag" variants={fadeUp}>{ind}</motion.span>
            ))}
          </motion.div>
        </motion.section>

        {/* ── Related Work ── */}
        {related.length > 0 && (
          <motion.section
            className="wdSection"
            variants={stagger}
            {...reveal()}
          >
            <motion.div className="wdSectionHead" variants={fadeUp}>
              <span className="wdSectionKicker">RELATED WORK</span>
              <h2 className="wdSectionTitle">More in {categoryName}</h2>
            </motion.div>

            <motion.div className="wdRelatedGrid" variants={stagger}>
              {related.map((item) => (
                <motion.a
                  key={item.slug}
                  className="wdRelatedCard"
                  href={`/work/${item.slug}`}
                  variants={fadeUp}
                >
                  <span className="wdRelatedType">{typeLabel(item.type).toUpperCase()}</span>
                  <span className="wdRelatedTitle">{item.title}</span>
                  <span className="wdRelatedDesc">{item.description}</span>
                  <span className="wdRelatedCta" aria-hidden="true">VIEW PROJECT →</span>
                </motion.a>
              ))}
            </motion.div>
          </motion.section>
        )}

        {/* ── CTA ── */}
        <motion.section
          className="wdCtaSection"
          variants={stagger}
          {...reveal()}
        >
          <motion.span className="wdCtaKicker" variants={fadeUp}>READY TO BUILD?</motion.span>
          <motion.h2 className="wdCtaTitle" variants={fadeUp}>
            Let&apos;s ship something like this for you.
          </motion.h2>
          <motion.p className="wdCtaSub" variants={fadeUp}>
            We design and engineer production-grade platforms. Tell us what you need.
          </motion.p>
          <motion.a className="wdCtaBtn" href={CONTACT_HREF} variants={fadeUp}>
            Estimate a Project
            <svg viewBox="0 0 14 10" aria-hidden="true">
              <path d="M1 5h11M8 1.5 12.5 5 8 8.5" fill="none" stroke="currentColor" strokeWidth="1.3" />
            </svg>
          </motion.a>
        </motion.section>

      </main>

      <style jsx global>{`
        /* ── Page shell ── */
        .wd {
          position: relative;
          min-height: 100vh;
          background: #050505;
          color: rgba(255,255,255,0.88);
          font-family: var(--font-geist-sans, sans-serif);
        }

        .wdBg {
          position: fixed; inset: 0; z-index: 0; pointer-events: none;
          background-image:
            linear-gradient(rgba(255,255,255,0.018) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.018) 1px, transparent 1px);
          background-size: 60px 60px;
          mask-image: radial-gradient(ellipse 80% 60% at 50% 0%, #000 0%, transparent 80%);
          -webkit-mask-image: radial-gradient(ellipse 80% 60% at 50% 0%, #000 0%, transparent 80%);
        }

        .wdScan {
          position: fixed; inset: 0; z-index: 0; pointer-events: none;
          background: repeating-linear-gradient(
            to bottom, transparent 0, transparent 2px,
            rgba(255,255,255,0.012) 3px, transparent 4px
          );
          opacity: 0.5;
        }

        .wdMain {
          position: relative; z-index: 1;
          width: min(calc(100% - 40px), 1100px);
          margin-inline: auto;
          padding: clamp(40px, 6vh, 80px) 0 clamp(60px, 8vh, 100px);
          display: flex;
          flex-direction: column;
          gap: clamp(48px, 7vh, 80px);
        }

        /* ── Breadcrumb ── */
        .wdBreadcrumb {
          display: flex; align-items: center; gap: 8px; flex-wrap: wrap;
          margin-bottom: 28px;
          color: rgba(255,255,255,0.3);
          font-family: var(--font-geist-mono, ui-monospace, monospace);
          font-size: 9px; font-weight: 800; letter-spacing: 0.18em; text-transform: uppercase;
        }
        .wdBreadcrumb a {
          color: inherit; text-decoration: none;
          transition: color 140ms ease;
        }
        .wdBreadcrumb a:hover { color: rgba(255,255,255,0.7); }
        .wdBreadcrumb [aria-current="page"] { color: rgba(255,255,255,0.62); }
        .wdBreadcrumb span[aria-hidden] { color: rgba(255,255,255,0.16); }

        /* ── Hero ── */
        .wdHero { display: flex; flex-direction: column; }

        .wdHeroBody {
          display: grid;
          grid-template-columns: 1fr auto;
          gap: clamp(24px, 4vw, 64px);
          align-items: start;
        }

        .wdHeroLeft { display: flex; flex-direction: column; gap: 16px; }

        .wdEyebrow {
          color: rgba(255,255,255,0.32);
          font-family: var(--font-geist-mono, ui-monospace, monospace);
          font-size: 9.5px; font-weight: 800; letter-spacing: 0.22em; text-transform: uppercase;
        }

        .wdTitle {
          margin: 0;
          color: rgba(255,255,255,0.97);
          font-family: var(--font-geist-mono, ui-monospace, monospace);
          font-size: clamp(26px, 3.5vw, 52px);
          font-weight: 400; letter-spacing: -0.01em; line-height: 1.06; text-transform: uppercase;
        }

        .wdSubtitle {
          margin: -8px 0 0;
          color: rgba(255,255,255,0.42);
          font-family: var(--font-geist-mono, ui-monospace, monospace);
          font-size: clamp(13px, 1.2vw, 17px);
          font-weight: 400; letter-spacing: 0.04em; line-height: 1.3; text-transform: uppercase;
        }

        .wdTagline {
          margin: 0;
          color: rgba(255,255,255,0.56);
          font-size: clamp(14px, 1.1vw, 17px);
          line-height: 1.6; font-weight: 360;
        }

        .wdHeroMeta {
          display: flex; flex-wrap: wrap; gap: 10px;
          margin-top: 4px;
        }

        .wdMetaChip {
          display: flex; flex-direction: column; gap: 3px;
          padding: 9px 14px;
          border: 1px solid rgba(255,255,255,0.1);
          background: rgba(255,255,255,0.016);
        }

        .wdMetaLabel {
          color: rgba(255,255,255,0.26);
          font-family: var(--font-geist-mono, ui-monospace, monospace);
          font-size: 7.5px; font-weight: 800; letter-spacing: 0.2em; text-transform: uppercase;
        }

        .wdMetaVal {
          color: rgba(255,255,255,0.78);
          font-family: var(--font-geist-mono, ui-monospace, monospace);
          font-size: 11px; font-weight: 700; letter-spacing: 0.04em;
        }

        .wdHeroActions { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 8px; }

        .wdActionBtn {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 10px 18px;
          font-family: var(--font-geist-mono, ui-monospace, monospace);
          font-size: 10.5px; font-weight: 800; letter-spacing: 0.1em; text-transform: uppercase;
          text-decoration: none;
          transition: color 160ms ease, border-color 160ms ease, background 160ms ease;
        }
        .wdActionBtn svg { width: 13px; height: 9px; transition: transform 200ms ease; }
        .wdActionBtn:hover svg { transform: translateX(3px); }

        .wdActionPrimary {
          border: 1px solid rgba(255,255,255,0.32);
          color: rgba(255,255,255,0.9);
          background: rgba(255,255,255,0.04);
        }
        .wdActionPrimary:hover {
          border-color: rgba(255,255,255,0.65);
          background: rgba(255,255,255,0.08);
          color: #fff;
        }

        .wdActionSecondary {
          border: 1px solid rgba(255,255,255,0.14);
          color: rgba(255,255,255,0.6);
          background: transparent;
        }
        .wdActionSecondary:hover {
          border-color: rgba(255,255,255,0.38);
          color: rgba(255,255,255,0.88);
        }

        /* Hero right card */
        .wdHeroRight {
          flex-shrink: 0;
        }

        .wdHeroCard {
          position: relative;
          width: clamp(180px, 20vw, 260px);
          padding: 20px;
          border: 1px solid rgba(255,255,255,0.12);
          background:
            linear-gradient(160deg, rgba(255,255,255,0.028) 0%, rgba(255,255,255,0.004) 100%),
            rgba(0,0,0,0.4);
          overflow: hidden;
        }

        .wdHeroCornerTL {
          position: absolute; top: -1px; left: -1px;
          width: 14px; height: 14px;
          border-top: 1px solid rgba(255,255,255,0.55);
          border-left: 1px solid rgba(255,255,255,0.55);
          pointer-events: none;
        }
        .wdHeroCornerBR {
          position: absolute; bottom: -1px; right: -1px;
          width: 14px; height: 14px;
          border-bottom: 1px solid rgba(255,255,255,0.3);
          border-right: 1px solid rgba(255,255,255,0.3);
          pointer-events: none;
        }

        .wdHeroCardBg {
          position: absolute; inset: 0; pointer-events: none;
          background-image:
            linear-gradient(rgba(255,255,255,0.022) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.022) 1px, transparent 1px);
          background-size: 24px 24px;
        }

        .wdHeroCardScan {
          position: absolute; inset: 0; pointer-events: none;
          background: repeating-linear-gradient(
            to bottom, transparent 0, transparent 2px,
            rgba(0,0,0,0.18) 2px, rgba(0,0,0,0.18) 3px
          );
        }

        .wdHeroCardContent {
          position: relative; z-index: 1;
          display: flex; flex-direction: column; gap: 12px;
        }

        .wdHeroCardEyebrow {
          color: rgba(255,255,255,0.28);
          font-family: var(--font-geist-mono, ui-monospace, monospace);
          font-size: 8px; font-weight: 800; letter-spacing: 0.2em;
        }

        .wdHeroCardType {
          color: rgba(255,255,255,0.82);
          font-family: var(--font-geist-mono, ui-monospace, monospace);
          font-size: 11px; font-weight: 700; letter-spacing: 0.08em;
        }

        .wdHeroCardDivider {
          height: 1px; background: rgba(255,255,255,0.1);
        }

        .wdHeroCardTags {
          display: flex; flex-wrap: wrap; gap: 5px;
        }

        .wdHeroCardTag {
          display: inline-flex; padding: 3px 7px;
          border: 1px solid rgba(255,255,255,0.1);
          background: rgba(255,255,255,0.024);
          color: rgba(255,255,255,0.52);
          font-family: var(--font-geist-mono, ui-monospace, monospace);
          font-size: 7.5px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase;
        }

        /* ── Section shared ── */
        .wdSection { display: flex; flex-direction: column; gap: 24px; }

        .wdSectionHead { display: flex; flex-direction: column; gap: 6px; }

        .wdSectionKicker {
          color: rgba(255,255,255,0.28);
          font-family: var(--font-geist-mono, ui-monospace, monospace);
          font-size: 9px; font-weight: 800; letter-spacing: 0.24em; text-transform: uppercase;
        }

        .wdSectionTitle {
          margin: 0;
          color: rgba(255,255,255,0.94);
          font-family: var(--font-geist-mono, ui-monospace, monospace);
          font-size: clamp(18px, 2vw, 26px);
          font-weight: 400; letter-spacing: -0.01em; line-height: 1.1; text-transform: uppercase;
        }

        .wdSectionSub {
          margin: 4px 0 0;
          color: rgba(255,255,255,0.44);
          font-size: clamp(12px, 0.95vw, 14px); line-height: 1.6;
          max-width: 560px;
        }

        /* ── Brief ── */
        .wdBrief {
          margin: 0;
          color: rgba(255,255,255,0.62);
          font-size: clamp(14px, 1.1vw, 17px);
          line-height: 1.7; font-weight: 360;
          padding: 20px 24px;
          border: 1px solid rgba(255,255,255,0.08);
          background: rgba(255,255,255,0.012);
          border-left: 2px solid rgba(255,255,255,0.28);
          max-width: 820px;
        }

        /* ── Features grid ── */
        .wdFeaturesGrid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
          gap: 10px;
        }

        .wdFeatureCard {
          display: flex; flex-direction: column; gap: 10px;
          padding: 18px 20px 20px;
          border: 1px solid rgba(255,255,255,0.08);
          background: rgba(255,255,255,0.016);
          position: relative;
          transition: border-color 200ms ease, background 200ms ease;
        }

        .wdFeatureCard::before {
          content: '';
          position: absolute; left: 0; top: 0;
          width: 0; height: 2px;
          background: rgba(255,255,255,0.5);
          transition: width 320ms cubic-bezier(0.22, 1, 0.36, 1);
        }

        .wdFeatureCard:hover {
          border-color: rgba(255,255,255,0.2);
          background: rgba(255,255,255,0.028);
        }

        .wdFeatureCard:hover::before { width: 100%; }

        .wdFeatureNum {
          color: rgba(255,255,255,0.22);
          font-family: var(--font-geist-mono, ui-monospace, monospace);
          font-size: 9px; font-weight: 800; letter-spacing: 0.1em;
        }

        .wdFeatureTitle {
          margin: 0;
          color: rgba(255,255,255,0.9);
          font-family: var(--font-geist-mono, ui-monospace, monospace);
          font-size: 13px; font-weight: 700; letter-spacing: 0.02em; line-height: 1.3;
        }

        .wdFeatureDesc {
          margin: 0;
          color: rgba(255,255,255,0.5);
          font-size: 13px; line-height: 1.55;
        }

        /* ── Signals ── */
        .wdSignalsGrid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 10px;
        }

        .wdSignalCard {
          display: flex; gap: 16px; align-items: flex-start;
          padding: 18px 20px;
          border: 1px solid rgba(255,255,255,0.08);
          background: rgba(255,255,255,0.012);
          transition: border-color 200ms ease;
        }

        .wdSignalCard:hover { border-color: rgba(255,255,255,0.18); }

        .wdSignalNum {
          flex-shrink: 0; margin-top: 2px;
          color: rgba(255,255,255,0.2);
          font-family: var(--font-geist-mono, ui-monospace, monospace);
          font-size: 9px; font-weight: 800; letter-spacing: 0.1em;
        }

        .wdSignalTitle {
          margin: 0 0 6px;
          color: rgba(255,255,255,0.88);
          font-family: var(--font-geist-mono, ui-monospace, monospace);
          font-size: 12px; font-weight: 700; letter-spacing: 0.04em; text-transform: uppercase;
        }

        .wdSignalDesc {
          margin: 0;
          color: rgba(255,255,255,0.48);
          font-size: 13px; line-height: 1.5;
        }

        /* ── Industries ── */
        .wdIndustriesRow { display: flex; flex-wrap: wrap; gap: 8px; }

        .wdIndustryTag {
          display: inline-flex; padding: 7px 14px;
          border: 1px solid rgba(255,255,255,0.14);
          background: rgba(255,255,255,0.028);
          color: rgba(255,255,255,0.7);
          font-family: var(--font-geist-mono, ui-monospace, monospace);
          font-size: 10px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase;
          transition: border-color 180ms ease, color 180ms ease;
        }
        .wdIndustryTag:hover { border-color: rgba(255,255,255,0.38); color: #fff; }

        /* ── Related ── */
        .wdRelatedGrid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
          gap: 10px;
        }

        .wdRelatedCard {
          display: flex; flex-direction: column; gap: 8px;
          padding: 16px 18px 40px;
          border: 1px solid rgba(255,255,255,0.08);
          background: rgba(255,255,255,0.012);
          color: inherit; text-decoration: none;
          position: relative; overflow: hidden;
          transition: border-color 170ms ease, background 170ms ease;
        }

        .wdRelatedCard::before {
          content: '';
          position: absolute; left: 0; top: 0;
          width: 0; height: 1px;
          background: linear-gradient(90deg, rgba(255,255,255,0.7), transparent);
          transition: width 280ms cubic-bezier(0.22, 1, 0.36, 1);
        }

        .wdRelatedCard:hover {
          border-color: rgba(255,255,255,0.22);
          background: rgba(255,255,255,0.032);
          outline: none;
        }

        .wdRelatedCard:hover::before { width: 100%; }

        .wdRelatedType {
          color: rgba(255,255,255,0.24);
          font-family: var(--font-geist-mono, ui-monospace, monospace);
          font-size: 8px; font-weight: 800; letter-spacing: 0.14em;
        }

        .wdRelatedTitle {
          color: rgba(255,255,255,0.88);
          font-family: var(--font-geist-mono, ui-monospace, monospace);
          font-size: 12px; font-weight: 700; letter-spacing: 0.02em; line-height: 1.3;
        }

        .wdRelatedDesc {
          color: rgba(255,255,255,0.42);
          font-size: 11.5px; line-height: 1.4;
          overflow: hidden; display: -webkit-box;
          -webkit-line-clamp: 2; -webkit-box-orient: vertical;
        }

        .wdRelatedCta {
          position: absolute; bottom: 10px; right: 12px;
          color: rgba(255,255,255,0.7);
          font-family: var(--font-geist-mono, ui-monospace, monospace);
          font-size: 7.5px; font-weight: 800; letter-spacing: 0.1em;
          opacity: 0; transform: translateY(3px);
          transition: opacity 220ms ease, transform 220ms ease;
        }

        .wdRelatedCard:hover .wdRelatedCta { opacity: 1; transform: translateY(0); }

        /* ── CTA section ── */
        .wdCtaSection {
          display: flex; flex-direction: column; align-items: center; text-align: center;
          gap: 14px; padding: clamp(32px, 5vh, 60px) clamp(20px, 4vw, 60px);
          border: 1px solid rgba(255,255,255,0.1);
          background:
            linear-gradient(160deg, rgba(255,255,255,0.018) 0%, rgba(255,255,255,0.004) 100%),
            rgba(0,0,0,0.24);
          position: relative; overflow: hidden;
        }

        .wdCtaSection::before {
          content: '';
          position: absolute; left: 0; right: 0; top: 0; height: 1px;
          background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.5) 40%, rgba(255,255,255,0.5) 60%, transparent 100%);
        }

        .wdCtaKicker {
          color: rgba(255,255,255,0.3);
          font-family: var(--font-geist-mono, ui-monospace, monospace);
          font-size: 9px; font-weight: 800; letter-spacing: 0.26em; text-transform: uppercase;
        }

        .wdCtaTitle {
          margin: 0;
          color: rgba(255,255,255,0.94);
          font-family: var(--font-geist-mono, ui-monospace, monospace);
          font-size: clamp(18px, 2.2vw, 28px);
          font-weight: 400; letter-spacing: -0.01em; text-transform: uppercase;
        }

        .wdCtaSub {
          margin: 0;
          color: rgba(255,255,255,0.48);
          font-size: clamp(12px, 1vw, 15px); line-height: 1.6;
          max-width: 440px;
        }

        .wdCtaBtn {
          display: inline-flex; align-items: center; gap: 10px;
          margin-top: 8px; padding: 12px 28px;
          border: 1px solid rgba(255,255,255,0.28);
          background: rgba(255,255,255,0.04);
          color: rgba(255,255,255,0.88);
          font-family: var(--font-geist-mono, ui-monospace, monospace);
          font-size: 11px; font-weight: 800; letter-spacing: 0.1em; text-transform: uppercase;
          text-decoration: none;
          transition: color 160ms ease, border-color 160ms ease, background 160ms ease;
        }
        .wdCtaBtn svg { width: 13px; height: 9px; transition: transform 200ms ease; }
        .wdCtaBtn:hover {
          color: #fff; border-color: rgba(255,255,255,0.62);
          background: rgba(255,255,255,0.07);
        }
        .wdCtaBtn:hover svg { transform: translateX(3px); }

        /* ── Responsive ── */
        @media (max-width: 768px) {
          .wdHeroBody {
            grid-template-columns: 1fr;
          }
          .wdHeroRight { display: none; }
          .wdFeaturesGrid { grid-template-columns: 1fr; }
          .wdSignalsGrid { grid-template-columns: 1fr; }
          .wdRelatedGrid { grid-template-columns: 1fr 1fr; }
        }

        @media (max-width: 480px) {
          .wdRelatedGrid { grid-template-columns: 1fr; }
          .wdBrief { padding: 14px 16px; }
        }

        @media (prefers-reduced-motion: reduce) {
          .wdFeatureCard::before, .wdRelatedCard::before,
          .wdActionBtn svg, .wdCtaBtn svg { transition: none !important; animation: none !important; }
        }
      `}</style>
    </div>
  );
}
