'use client';

import ServicesMegaMenu from './ServicesMegaMenu';
import WorkMegaMenu from './WorkMegaMenu';
import MobileNav from './MobileNav';

const CONTACT_EMAIL = 'hello@mogt.studio';
const CONTACT_HREF = `mailto:${CONTACT_EMAIL}?subject=Project%20Inquiry%20%E2%80%94%20MOGT`;

/**
 * Shared sticky header for sub-pages (/services, /services/[slug]).
 * Mirrors the homepage nav: brand + Work + Services mega menu + Estimate CTA,
 * with the MobileNav drawer on small screens. 64px tall — keep sticky offsets
 * on consuming pages in sync with this height.
 */
export default function SiteHeader() {
  return (
    <header className="shHeader">
      <a className="shBrand" href="/">
        <span className="shBrandGlyph"><i /><i /><i /></span>
        <span>MOGT</span>
      </a>

      <nav className="shNav">
        <WorkMegaMenu />
        <ServicesMegaMenu />
        <a className="shNavCta" href={CONTACT_HREF}>Estimate a Project</a>
      </nav>

      <MobileNav contactHref={CONTACT_HREF} workHref="/#work" />

      <style jsx global>{`
        .shHeader {
          position: sticky; top: 0; z-index: 40;
          display: flex; align-items: center; justify-content: space-between;
          height: 64px; padding: 0 clamp(18px, 4vw, 40px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          background: rgba(6, 6, 6, 0.78); backdrop-filter: blur(14px);
        }
        .shBrand {
          display: inline-flex; align-items: center; gap: 10px;
          color: rgba(255, 255, 255, 0.92); text-decoration: none;
          font-family: var(--font-geist-mono, ui-monospace, monospace);
          font-size: 13px; font-weight: 800; letter-spacing: 0.06em;
        }
        .shBrandGlyph { display: inline-flex; gap: 3px; }
        .shBrandGlyph i { width: 5px; height: 14px; display: block; background: rgba(255, 255, 255, 0.9); transform: skewY(23deg); }
        .shNav {
          display: flex; align-items: center; gap: clamp(16px, 3vw, 28px);
          font-family: var(--font-geist-mono, ui-monospace, monospace);
          font-size: 11px; font-weight: 800; letter-spacing: 0.05em; text-transform: uppercase;
        }
        .shNav a { color: rgba(255, 255, 255, 0.66); text-decoration: none; transition: color 140ms ease; }
        .shNav a:hover { color: #fff; }
        .shNavCta {
          padding: 8px 14px; border: 1px solid rgba(255, 255, 255, 0.2);
          color: rgba(255, 255, 255, 0.86) !important;
          transition: border-color 160ms ease, background 160ms ease !important;
        }
        .shNavCta:hover { border-color: rgba(255, 255, 255, 0.55); background: rgba(255, 255, 255, 0.06); }

        @media (max-width: 640px) {
          .shNav { display: none; }
        }
      `}</style>
    </header>
  );
}
