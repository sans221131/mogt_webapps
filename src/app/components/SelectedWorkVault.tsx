'use client';

import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { CSSProperties, PointerEvent as ReactPointerEvent, ReactNode } from 'react';

type ArchitectureSegment = {
  label: string;
  value: number;
};

type Project = {
  index: string;
  name: string;
  slug: string;
  category: string;
  platform: string;
  description: string;
  logo: string | null;
  architectureMix: [ArchitectureSegment, ArchitectureSegment, ArchitectureSegment, ArchitectureSegment];
};

const PROJECTS: Project[] = [
  {
    slug: 'resmedx',
    index: '01',
    name: 'ResMedX',
    category: 'HEALTHCARE',
    platform: 'WEB APP',
    logo: '/logos/resmedx-ehr.png',
    description: 'An EHR-style healthcare platform for clinical workflows, patient records, and admin operations.',
    architectureMix: [
      { label: 'Patient Records', value: 35 },
      { label: 'Clinical Workflows', value: 30 },
      { label: 'Admin/RBAC', value: 20 },
      { label: 'Reporting Layer', value: 15 },
    ],
  },
  {
    slug: 'lee-county-ems',
    index: '02',
    name: 'Lee County EMS',
    category: 'EMERGENCY',
    platform: 'WEB SYSTEM',
    logo: '/logos/lee-county-ems.png',
    description: 'An emergency medical operations system focused on response workflows, dispatch visibility, and field coordination.',
    architectureMix: [
      { label: 'Dispatch Flow', value: 30 },
      { label: 'Field Response', value: 28 },
      { label: 'Incident Records', value: 24 },
      { label: 'Ops Dashboard', value: 18 },
    ],
  },
  {
    slug: 'streax',
    index: '03',
    name: 'Streax',
    category: 'DATING',
    platform: 'WEB + MOBILE',
    logo: '/logos/streax.png',
    description: 'A social dating platform built around profiles, matching, messaging, and engagement loops.',
    architectureMix: [
      { label: 'Matching Engine', value: 30 },
      { label: 'User Profiles', value: 25 },
      { label: 'Messaging System', value: 25 },
      { label: 'Safety/Admin Layer', value: 20 },
    ],
  },
  {
    slug: 'plan-the-knot',
    index: '04',
    name: 'Plan The Knot',
    category: 'EVENTS',
    platform: 'WEB PLATFORM',
    logo: '/logos/plan-the-knot.png',
    description: 'A wedding planning platform connecting event planning, vendor discovery, and booking workflows.',
    architectureMix: [
      { label: 'Vendor Marketplace', value: 30 },
      { label: 'Planning Tools', value: 28 },
      { label: 'Booking Flow', value: 24 },
      { label: 'Client Dashboard', value: 18 },
    ],
  },
  {
    slug: 'talzent',
    index: '05',
    name: 'Talzent',
    category: 'AI + SAAS',
    platform: 'WEB APP',
    logo: '/logos/talzent.png',
    description: 'An AI-powered hiring platform designed for candidate screening, recruitment workflows, and hiring pipelines.',
    architectureMix: [
      { label: 'Candidate Pipeline', value: 32 },
      { label: 'AI Screening', value: 28 },
      { label: 'Employer/School CRM', value: 22 },
      { label: 'Reporting Layer', value: 18 },
    ],
  },
  {
    slug: 'rane-global',
    index: '06',
    name: 'Rane Global',
    category: 'LOGISTICS',
    platform: 'IOT + WEB',
    logo: null,
    description: 'An operations-focused platform for logistics visibility, IoT signals, and enterprise workflow tracking.',
    architectureMix: [
      { label: 'Fleet/Ops Dashboard', value: 30 },
      { label: 'IoT Signals', value: 28 },
      { label: 'Tracking/Alerts', value: 25 },
      { label: 'Admin Controls', value: 17 },
    ],
  },
  {
    slug: 'zvilo',
    index: '07',
    name: 'Zvilo',
    category: 'FINTECH',
    platform: 'WEB APP',
    logo: '/logos/zvilo.png',
    description: 'A finance platform built around secure business workflows, financial visibility, and dashboard-led operations.',
    architectureMix: [
      { label: 'Business Finance Flow', value: 35 },
      { label: 'Account Security', value: 25 },
      { label: 'Dashboard UX', value: 22 },
      { label: 'Compliance/Ops', value: 18 },
    ],
  },
  {
    slug: 'myassets',
    index: '08',
    name: 'MyAssets',
    category: 'FINANCE',
    platform: 'WEB DASHBOARD',
    logo: '/logos/myassets.png',
    description: 'An asset management dashboard for tracking, organizing, and reviewing portfolio-style financial data.',
    architectureMix: [
      { label: 'Portfolio Tracking', value: 34 },
      { label: 'Asset Records', value: 26 },
      { label: 'Insights Dashboard', value: 24 },
      { label: 'Secure Access', value: 16 },
    ],
  },
];

const DEFAULT_SLUG = 'streax';
const EASE_OUT = [0.22, 1, 0.36, 1] as const;
const MONO_STOP = new Set(['the', 'a', 'an', 'of', 'and', 'for']);
const DONUT_STROKES = [
  'rgba(255,255,255,0.94)',
  'rgba(255,255,255,0.68)',
  'rgba(255,255,255,0.44)',
  'rgba(255,255,255,0.24)',
];

type ProjectLink = {
  href: string;
  label: string;
};

const PROJECT_LINKS: Record<string, ProjectLink[]> = {
  'resmedx': [
    { href: 'https://resmedxweb.appdeft.in/#/', label: 'LIVE SITE' },
    { href: 'https://resmedxadmin.appdeft.in/#/admin-dashboard', label: 'ADMIN PREVIEW' },
    { href: 'https://www.figma.com/design/PAecgvJNiFJ18N3s9IDWuK/ResMedX?node-id=511-427&p=f', label: 'FIGMA' },
  ],
  'lee-county-ems': [
    { href: 'https://apps.apple.com/us/app/ems-protocols-to-go/id6502596495', label: 'APP STORE' },
    { href: 'https://www.figma.com/design/eXAHxHvAgpZPNRO3ueS3U0/Lee-County-EMS?node-id=139-2&t=rip3pM7SAf6NcKzK-0', label: 'FIGMA' },
  ],
  'streax': [
    { href: 'https://www.streax.date', label: 'LIVE SITE' },
    { href: 'https://apps.apple.com/in/app/streax-stories-streaks-date/id6654905433', label: 'APP STORE' },
    { href: 'https://play.google.com/store/apps/details?id=com.nextmedia.streax', label: 'PLAY STORE' },
    { href: 'https://www.figma.com/design/bmpyj8ZCqVqlX5j09O6Yhr/Streax--Dating-App?node-id=0-1&p=f&t=ie8KAm5v1MuZlF5R-0', label: 'FIGMA' },
  ],
  'plan-the-knot': [
    { href: 'https://plantheknot.com/', label: 'LIVE SITE' },
    { href: 'https://admin.plantheknot.com/#/dashboard', label: 'ADMIN PREVIEW' },
    { href: 'https://www.figma.com/file/8fD8fDeYyinkUrMpAfPKfG/PlanTheKnot?type=design&node-id=224-586&mode=design&t=KpeHjKkUDQoF6HkF-0', label: 'FIGMA' },
  ],
  'talzent': [
    { href: 'https://talzent.com/', label: 'LIVE SITE' },
    { href: 'https://www.figma.com/design/jjjoyuUVzr2mH5pf4HQaop/Talzent?node-id=0-1&node-type=canvas&t=77Y1WleQiBqJZBfO-0', label: 'FIGMA' },
  ],
  'rane-global': [
    { href: 'https://raneglobal.appdeft.in/', label: 'LIVE SITE' },
    { href: 'https://www.figma.com/design/22SYEzkSsMf9eSr7noIwJu/Rane-Global?node-id=0-1&node-type=canvas&t=bth2wOsYJlW6uBcW-0', label: 'FIGMA' },
  ],
  'zvilo': [
    { href: 'https://www.zvilo.com/', label: 'LIVE SITE' },
  ],
  'myassets': [
    { href: 'https://register.myassetsreg.com/', label: 'LIVE SITE' },
    { href: 'https://www.figma.com/design/hSnEvNLAQLCbj1vDCpQNlQ/bond-101?node-id=2-2&t=FS1w0G103y7oEvLF-0', label: 'FIGMA' },
  ],
};

function initials(name: string) {
  const words = name.split(/\s+/).filter((word) => word && !MONO_STOP.has(word.toLowerCase()));
  if (words.length >= 2) return `${words[0][0]}${words[1][0]}`.toUpperCase();
  return name.slice(0, 2).toUpperCase();
}

function buildDonutSegments(architectureMix: Project['architectureMix']) {
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const total = architectureMix.reduce((sum, segment) => sum + segment.value, 0);
  const gap = 2.8;
  let offset = 0;

  return architectureMix.map((segment, index) => {
    const rawLength = (segment.value / total) * circumference;
    const dash = Math.max(0, rawLength - gap);
    const donutSegment = {
      ...segment,
      dash,
      offset,
      circumference,
      stroke: DONUT_STROKES[index % DONUT_STROKES.length],
    };
    offset += rawLength;
    return donutSegment;
  });
}

function renderProjectMark(project: Project, variant: 'featured' | 'selector', decorative = false): ReactNode {
  if (project.logo) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        className={variant === 'featured' ? 'projectLogo projectLogoFeatured' : 'projectLogo projectLogoSelector'}
        src={project.logo}
        alt={decorative ? '' : `${project.name} logo`}
        draggable={false}
        loading="lazy"
      />
    );
  }

  return (
    <span className={variant === 'featured' ? 'projectWordmark projectWordmarkFeatured' : 'projectWordmark projectWordmarkSelector'} aria-hidden={decorative}>
      <span>{initials(project.name)}</span>
      <b>{project.name}</b>
    </span>
  );
}

function renderProductSignals(project: Project, reduceMotion: boolean): ReactNode {
  const segments = buildDonutSegments(project.architectureMix);

  return (
    <aside className="signalPanel">
      <div className="signalHead">
        <span className="signalTitle">PRODUCT ARCHITECTURE</span>
        <span className="statusBadge" aria-label="Live project">
          <i aria-hidden="true" />
          LIVE
        </span>
      </div>

      <div className="donutFrame" aria-label={`${project.name} product architecture mix`}>
        <svg viewBox="0 0 148 148" role="img" aria-label="Product architecture mix donut chart">
          <circle className="donutOuter" cx="74" cy="74" r="66" />
          <circle className="donutTrack" cx="74" cy="74" r="54" />
          {segments.map((segment, index) => (
            <motion.circle
              key={`${project.slug}-${segment.label}`}
              className="donutSegment"
              cx="74"
              cy="74"
              r="54"
              stroke={segment.stroke}
              strokeDasharray={`${segment.dash} ${segment.circumference - segment.dash}`}
              strokeDashoffset={-segment.offset}
              initial={reduceMotion ? false : { strokeDasharray: `0 ${segment.circumference}`, opacity: 0 }}
              animate={{
                strokeDasharray: `${segment.dash} ${segment.circumference - segment.dash}`,
                opacity: 1,
              }}
              transition={{ duration: reduceMotion ? 0 : 0.72, delay: reduceMotion ? 0 : index * 0.12, ease: EASE_OUT }}
            />
          ))}
        </svg>
        <div className="chartScanner" aria-hidden="true" />
      </div>

      <div className="capabilityStack">
        {segments.map((segment, index) => (
          <div className="capabilityRow" key={segment.label}>
            <span className="capabilityLabel">
              <i style={{ backgroundColor: segment.stroke }} aria-hidden="true" />
              {segment.label}
            </span>
            <span className="capabilityValue">{segment.value}%</span>
            <span className="capabilityTrack" role="meter" aria-label={`${segment.label} architecture share`} aria-valuemin={0} aria-valuemax={100} aria-valuenow={segment.value}>
              <motion.i
                key={`${project.slug}-${segment.label}`}
                style={{ background: segment.stroke }}
                initial={reduceMotion ? false : { width: 0 }}
                animate={{ width: `${segment.value}%` }}
                transition={{ duration: reduceMotion ? 0 : 0.72, delay: reduceMotion ? 0 : 0.08 + index * 0.08, ease: EASE_OUT }}
              />
            </span>
          </div>
        ))}
      </div>
    </aside>
  );
}

function ArrowIcon(): ReactNode {
  return (
    <svg viewBox="0 0 16 10" aria-hidden="true" focusable="false">
      <path d="M1 5h12M9.5 1.5 13.5 5l-4 3.5" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function SelectedWorkVault() {
  const reduceMotion = Boolean(useReducedMotion());
  const reduceMotionRef = useRef(reduceMotion);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [selectedSlug, setSelectedSlug] = useState(DEFAULT_SLUG);
  const [booted, setBooted] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [shine, setShine] = useState({ x: 50, y: 45 });
  const [cardHover, setCardHover] = useState(false);

  useEffect(() => {
    reduceMotionRef.current = reduceMotion;
    if (reduceMotion) setBooted(true);
  }, [reduceMotion]);

  useEffect(() => {
    if (reduceMotion) return;
    const handleBoot = () => setBooted(true);
    window.addEventListener('vaultBoot', handleBoot);
    return () => window.removeEventListener('vaultBoot', handleBoot);
  }, [reduceMotion]);

  const selectedIndex = PROJECTS.findIndex((project) => project.slug === selectedSlug);
  const activeIndex = selectedIndex >= 0 ? selectedIndex : PROJECTS.findIndex((project) => project.slug === DEFAULT_SLUG);
  const selectedProject = PROJECTS[activeIndex];
  const selectorProjects = useMemo(() => [...PROJECTS, ...PROJECTS], []);

  const selectProject = useCallback((slug: string) => {
    setSelectedSlug((current) => (current === slug ? current : slug));
  }, []);

  const handlePointerMove = useCallback((event: ReactPointerEvent<HTMLDivElement>) => {
    if (reduceMotionRef.current || event.pointerType !== 'mouse') return;
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    if (rect.width < 720) return;
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;
    setTilt({
      x: (y - 0.5) * -5,
      y: (x - 0.5) * 6,
    });
    setShine({
      x: x * 100,
      y: y * 100,
    });
  }, []);

  const handlePointerEnter = useCallback((event: ReactPointerEvent<HTMLDivElement>) => {
    if (reduceMotionRef.current || event.pointerType !== 'mouse') return;
    setCardHover(true);
  }, []);

  const handlePointerLeave = useCallback(() => {
    setCardHover(false);
    setTilt({ x: 0, y: 0 });
  }, []);

  return (
    <section
      className={`vault${reduceMotion ? '' : ' vaultArmed'}${booted ? ' isBooted' : ''}`}
      aria-labelledby="selected-work-title"
    >
      <div className="vaultFx" aria-hidden="true">
        <span className="vaultGrid" />
        <span className="vaultSweep" />
        <span className="vaultNoise" />
      </div>

      <div className="vaultInner">
        <header className="vaultHeader vaultReveal">
          <span className="sectionKicker">SECTION B / SELECTED WORK</span>
          <h2 id="selected-work-title">Selected Work</h2>
          <p>Eight shipped product systems, presented as a focused control panel.</p>
        </header>

        <div className="featuredWrap vaultReveal">
          <div
            ref={cardRef}
            className={`featuredCard${cardHover ? ' isHovering' : ''}`}
            onPointerMove={handlePointerMove}
            onPointerEnter={handlePointerEnter}
            onPointerLeave={handlePointerLeave}
            style={{
              '--tilt-x': `${tilt.x}deg`,
              '--tilt-y': `${tilt.y}deg`,
              '--shine-x': `${shine.x}%`,
              '--shine-y': `${shine.y}%`,
            } as CSSProperties}
          >
            <span className="corner cornerTl" aria-hidden="true" />
            <span className="corner cornerBr" aria-hidden="true" />
            <span className="cardShine" aria-hidden="true" />

            <motion.div
              key={selectedProject.slug}
              className="featuredGrid"
              initial={reduceMotion ? false : { opacity: 0, y: 16, filter: 'blur(8px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: reduceMotion ? 0 : 0.46, ease: EASE_OUT }}
            >
              <div className="projectInfo">
                <div className="markStage">
                  {renderProjectMark(selectedProject, 'featured')}
                </div>
                <span className="projectMeta">
                  {selectedProject.index} / {selectedProject.category} / {selectedProject.platform}
                </span>
                <h3>{selectedProject.name}</h3>
                <p>{selectedProject.description}</p>
                <div className="ctaGroup">
                  <Link
                    href={`/work/${selectedProject.slug}`}
                    className="ctaBtn ctaBtnPrimary"
                    aria-label={`Open ${selectedProject.name} case study`}
                  >
                    OPEN PROJECT
                    {ArrowIcon()}
                  </Link>
                  {(PROJECT_LINKS[selectedProject.slug] ?? []).map((link) => (
                    <a
                      key={link.href}
                      href={link.href}
                      className="ctaBtn"
                      target="_blank"
                      rel="noreferrer"
                      aria-label={`${link.label} for ${selectedProject.name} (opens in new tab)`}
                    >
                      {link.label} ↗
                    </a>
                  ))}
                </div>
              </div>

              {renderProductSignals(selectedProject, reduceMotion)}
            </motion.div>
          </div>
        </div>

        <div className="selectorShell vaultReveal" aria-label="Project selector">
          <div className="selectorViewport">
            <div className="selectorTrack">
              {selectorProjects.map((project, index) => {
                const clone = index >= PROJECTS.length;
                const isActive = project.slug === selectedProject.slug;
                return (
                  <button
                    key={`${project.slug}-${index}`}
                    type="button"
                    className={`selectorCard${isActive ? ' isActive' : ''}${clone ? ' selectorClone' : ''}`}
                    aria-label={clone ? undefined : `Show ${project.name}`}
                    aria-hidden={clone || undefined}
                    aria-pressed={clone ? undefined : isActive}
                    tabIndex={clone ? -1 : 0}
                    onPointerEnter={(event) => {
                      if (event.pointerType === 'mouse') selectProject(project.slug);
                    }}
                    onFocus={() => {
                      if (!clone) selectProject(project.slug);
                    }}
                    onClick={() => selectProject(project.slug)}
                  >
                    <span className="selectorTop">
                      <span>{project.index}</span>
                      <span>{project.platform}</span>
                    </span>
                    <span className="selectorMark">
                      {renderProjectMark(project, 'selector', true)}
                    </span>
                    <span className="selectorBottom">
                      <b>{project.name}</b>
                      <span>{project.category}</span>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── Mobile layout — hidden above 767px ── */}
        <div className="mobileLayout vaultReveal" aria-label="Selected Work projects">
          {/* Single featured card — switches when a selector card is tapped */}
          <div className="mobileCard">
            <motion.div
              key={selectedProject.slug}
              className="mobileCardInner"
              initial={reduceMotion ? false : { opacity: 0, y: 10, filter: 'blur(6px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: reduceMotion ? 0 : 0.38, ease: EASE_OUT }}
            >
              <div className="mobileCardTop">
                {selectedProject.logo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    className="mobileCardLogo"
                    src={selectedProject.logo}
                    alt=""
                    draggable={false}
                    loading="lazy"
                  />
                ) : (
                  <span className="mobileCardMark" aria-hidden="true">
                    {initials(selectedProject.name)}
                  </span>
                )}
                <div className="mobileCardTopRight">
                  <span className="mobileMeta">
                    {selectedProject.index} / {selectedProject.category} / {selectedProject.platform}
                  </span>
                  <h3 className="mobileTitle">{selectedProject.name}</h3>
                </div>
              </div>

              <p className="mobileDesc">{selectedProject.description}</p>

              <div className="mobileCtaRow">
                <Link
                  href={`/work/${selectedProject.slug}`}
                  className="ctaBtn ctaBtnPrimary"
                  aria-label={`Open ${selectedProject.name} case study`}
                >
                  OPEN PROJECT
                  {ArrowIcon()}
                </Link>
                {(PROJECT_LINKS[selectedProject.slug] ?? []).map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    className="ctaBtn"
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`${link.label} for ${selectedProject.name} (opens in new tab)`}
                  >
                    {link.label} ↗
                  </a>
                ))}
              </div>

              <div className="mobileArch">
                <div className="mobileArchHead">
                  <span className="signalTitle">PRODUCT ARCHITECTURE</span>
                  <span className="statusBadge" aria-label="Live project">
                    <i aria-hidden="true" />
                    LIVE
                  </span>
                </div>
                <div className="mobileArchBody">
                  <div className="mobileDonutFrame" aria-label={`${selectedProject.name} architecture mix`}>
                    <svg viewBox="0 0 148 148" role="img" aria-hidden="true">
                      <circle className="donutOuter" cx="74" cy="74" r="66" />
                      <circle className="donutTrack" cx="74" cy="74" r="54" />
                      {buildDonutSegments(selectedProject.architectureMix).map((seg) => (
                        <motion.circle
                          key={`${selectedProject.slug}-mob-${seg.label}`}
                          className="donutSegment"
                          cx="74"
                          cy="74"
                          r="54"
                          stroke={seg.stroke}
                          strokeDasharray={`${seg.dash} ${seg.circumference - seg.dash}`}
                          strokeDashoffset={-seg.offset}
                          initial={reduceMotion ? false : { strokeDasharray: `0 ${seg.circumference}`, opacity: 0 }}
                          animate={{ strokeDasharray: `${seg.dash} ${seg.circumference - seg.dash}`, opacity: 1 }}
                          transition={{ duration: reduceMotion ? 0 : 0.6, ease: EASE_OUT }}
                        />
                      ))}
                    </svg>
                  </div>
                  <div className="mobileCapStack">
                    {buildDonutSegments(selectedProject.architectureMix).map((seg, idx) => (
                      <div key={seg.label} className="mobileCapRow">
                        <div className="mobileCapMeta">
                          <span className="mobileCapLabel">
                            <i style={{ backgroundColor: seg.stroke }} aria-hidden="true" />
                            {seg.label}
                          </span>
                          <span className="mobileCapValue">{seg.value}%</span>
                        </div>
                        <span className="mobileCapTrack">
                          <motion.i
                            key={`${selectedProject.slug}-mob-bar-${seg.label}`}
                            style={{ background: seg.stroke }}
                            initial={reduceMotion ? false : { width: 0 }}
                            animate={{ width: `${seg.value}%` }}
                            transition={{ duration: reduceMotion ? 0 : 0.6, delay: reduceMotion ? 0 : idx * 0.06, ease: EASE_OUT }}
                          />
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Horizontal project selector row */}
          <div className="mobileSelectorShell" aria-label="Project selector">
            <div className="mobileSelectorViewport">
              <div className="mobileSelectorTrack">
                {selectorProjects.map((project, index) => {
                  const clone = index >= PROJECTS.length;
                  const isActive = project.slug === selectedProject.slug;
                  return (
                    <button
                      key={`mob-${project.slug}-${index}`}
                      type="button"
                      className={`mobileSelectorCard${isActive ? ' isActive' : ''}${clone ? ' mobileSelectorClone' : ''}`}
                      aria-label={clone ? undefined : `Show ${project.name}`}
                      aria-hidden={clone || undefined}
                      aria-pressed={clone ? undefined : isActive}
                      tabIndex={clone ? -1 : 0}
                      onClick={() => selectProject(project.slug)}
                    >
                      <span className="mobileSelectorTop">
                        <span>{project.index}</span>
                        <span>{project.platform}</span>
                      </span>
                      <span className="mobileSelectorMark">
                        {renderProjectMark(project, 'selector', true)}
                      </span>
                      <span className="mobileSelectorBottom">
                        <b>{project.name}</b>
                        <span>{project.category}</span>
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .vault {
          position: relative;
          z-index: 1;
          width: 100%;
          overflow-x: clip;
          pointer-events: none;
          font-family: var(--font-geist-sans, sans-serif);
        }

        .vaultInner {
          position: relative;
          z-index: 1;
          width: min(calc(100vw - 44px), 1180px);
          margin-inline: auto;
          display: flex;
          flex-direction: column;
          gap: clamp(10px, 1.4vh, 16px);
        }

        .vaultFx,
        .vaultGrid,
        .vaultSweep,
        .vaultNoise {
          position: absolute;
          inset: 0;
          pointer-events: none;
        }

        .vaultGrid {
          background-image:
            linear-gradient(rgba(255,255,255,0.022) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.018) 1px, transparent 1px);
          background-size: 42px 42px;
          mask-image: radial-gradient(ellipse 78% 62% at 50% 48%, #000 0%, transparent 76%);
          -webkit-mask-image: radial-gradient(ellipse 78% 62% at 50% 48%, #000 0%, transparent 76%);
          opacity: 0.72;
        }

        .vaultSweep {
          opacity: 0;
          height: 42%;
          background: linear-gradient(180deg, transparent 0%, rgba(255,255,255,0.07) 48%, transparent 100%);
        }

        .vaultNoise {
          opacity: 0.12;
          background-image:
            repeating-radial-gradient(circle at 18% 22%, rgba(255,255,255,0.14) 0 1px, transparent 1px 4px),
            repeating-radial-gradient(circle at 82% 58%, rgba(255,255,255,0.1) 0 1px, transparent 1px 5px);
          background-size: 120px 120px, 160px 160px;
          mix-blend-mode: screen;
        }

        .vault.vaultArmed.isBooted .vaultSweep {
          animation: vaultSweep 1.05s ease-out both;
        }

        @keyframes vaultSweep {
          0% { opacity: 0; transform: translateY(-120%); }
          14% { opacity: 1; }
          100% { opacity: 0; transform: translateY(330%); }
        }

        .vaultHeader {
          display: grid;
          gap: 8px;
          justify-items: center;
          text-align: center;
          will-change: opacity, transform, filter;
        }

        .sectionKicker,
        .projectMeta,
        .signalTitle,
        .statusBadge,
        .capabilityLabel,
        .selectorTop,
        .selectorBottom span {
          font-family: var(--font-geist-mono, ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace);
          text-transform: uppercase;
        }

        .sectionKicker {
          color: rgba(255,255,255,0.42);
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 0.24em;
        }

        .vaultHeader h2 {
          margin: 0;
          color: rgba(255,255,255,0.96);
          font-family: var(--font-geist-mono, ui-monospace, monospace);
          font-size: clamp(28px, 5vw, 58px);
          line-height: 0.95;
          font-weight: 400;
          letter-spacing: 0;
          text-transform: uppercase;
        }

        .vaultHeader p {
          width: min(88vw, 520px);
          margin: 0;
          color: rgba(255,255,255,0.52);
          font-size: clamp(12px, 1vw, 14px);
          line-height: 1.55;
          font-weight: 360;
        }

        .featuredWrap {
          display: flex;
          justify-content: center;
          perspective: 1600px;
          will-change: opacity, transform, filter;
        }

        .featuredCard {
          position: relative;
          display: block;
          width: min(100%, 1060px);
          min-height: clamp(340px, 40vh, 440px);
          color: rgba(255,255,255,0.9);
          text-decoration: none;
          pointer-events: auto;
          overflow: hidden;
          border: 1px solid rgba(255,255,255,0.18);
          background:
            linear-gradient(180deg, rgba(255,255,255,0.038), rgba(255,255,255,0.006)),
            radial-gradient(circle at 18% 20%, rgba(255,255,255,0.052), transparent 35%),
            rgba(3,3,3,0.78);
          box-shadow:
            0 0 0 1px rgba(255,255,255,0.035),
            0 22px 80px rgba(0,0,0,0.7);
          transform: rotateX(var(--tilt-x)) rotateY(var(--tilt-y));
          transform-style: preserve-3d;
          transition: border-color 240ms ease, box-shadow 240ms ease, transform 620ms cubic-bezier(0.16,1,0.3,1);
        }

        .featuredCard::before {
          content: '';
          position: absolute;
          inset: 0;
          background:
            repeating-linear-gradient(to bottom, transparent 0, transparent 3px, rgba(255,255,255,0.018) 4px, transparent 5px),
            linear-gradient(90deg, transparent, rgba(255,255,255,0.04), transparent);
          opacity: 0.42;
          pointer-events: none;
        }

        .featuredCard:hover,
        .featuredCard:focus-visible,
        .featuredCard.isHovering {
          border-color: rgba(255,255,255,0.34);
          box-shadow:
            0 0 0 1px rgba(255,255,255,0.06),
            0 28px 96px rgba(0,0,0,0.82),
            0 0 70px rgba(255,255,255,0.04);
          outline: none;
        }

        .cardShine {
          position: absolute;
          inset: 0;
          z-index: 4;
          opacity: 0;
          pointer-events: none;
          background: radial-gradient(circle at var(--shine-x) var(--shine-y), rgba(255,255,255,0.1), transparent 44%);
          transition: opacity 220ms ease;
        }

        .featuredCard.isHovering .cardShine,
        .featuredCard:focus-visible .cardShine {
          opacity: 1;
        }

        .corner {
          position: absolute;
          z-index: 5;
          width: 18px;
          height: 18px;
          pointer-events: none;
          transition: border-color 180ms ease;
        }

        .cornerTl {
          top: 12px;
          left: 12px;
          border-top: 1px solid rgba(255,255,255,0.62);
          border-left: 1px solid rgba(255,255,255,0.62);
        }

        .cornerBr {
          right: 12px;
          bottom: 12px;
          border-right: 1px solid rgba(255,255,255,0.38);
          border-bottom: 1px solid rgba(255,255,255,0.38);
        }

        .featuredCard:hover .corner,
        .featuredCard:focus-visible .corner {
          border-color: rgba(255,255,255,0.86);
        }

        .featuredGrid {
          position: relative;
          z-index: 2;
          display: grid;
          grid-template-columns: minmax(0, 1.03fr) minmax(320px, 0.97fr);
          min-height: inherit;
        }

        .projectInfo,
        .signalPanel {
          min-width: 0;
          padding: clamp(18px, 2.4vw, 32px);
        }

        .projectInfo {
          display: flex;
          flex-direction: column;
          justify-content: center;
          gap: clamp(9px, 1.1vh, 13px);
        }

        .markStage {
          display: flex;
          align-items: center;
          min-height: 58px;
        }

        .projectLogo {
          display: block;
          object-fit: contain;
          user-select: none;
        }

        .projectLogoFeatured {
          max-width: min(70%, 240px);
          max-height: 64px;
          filter: grayscale(1) brightness(1.4) contrast(1.05) drop-shadow(0 16px 34px rgba(0,0,0,0.58));
        }

        .projectWordmark {
          display: inline-flex;
          align-items: center;
          gap: 12px;
        }

        .projectWordmark span {
          display: inline-grid;
          place-items: center;
          border: 1px solid rgba(255,255,255,0.28);
          color: rgba(255,255,255,0.92);
          font-family: var(--font-geist-mono, ui-monospace, monospace);
          font-weight: 500;
          letter-spacing: 0;
        }

        .projectWordmark b {
          color: rgba(255,255,255,0.92);
          font-family: var(--font-geist-mono, ui-monospace, monospace);
          font-weight: 400;
          letter-spacing: 0;
          text-transform: uppercase;
        }

        .projectWordmarkFeatured span {
          width: 62px;
          height: 62px;
          font-size: 22px;
        }

        .projectWordmarkFeatured b {
          font-size: clamp(24px, 3vw, 42px);
          line-height: 1;
        }

        .projectMeta {
          color: rgba(255,255,255,0.44);
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 0.14em;
        }

        .projectInfo h3 {
          margin: 0;
          color: rgba(255,255,255,0.96);
          font-family: var(--font-geist-mono, ui-monospace, monospace);
          font-size: clamp(24px, 2.5vw, 38px);
          line-height: 1;
          font-weight: 400;
          letter-spacing: 0;
          max-width: 100%;
          overflow: hidden;
          text-transform: uppercase;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .projectInfo p {
          max-width: 45ch;
          margin: 0;
          color: rgba(255,255,255,0.58);
          font-size: clamp(13px, 1.06vw, 15px);
          line-height: 1.65;
          font-weight: 360;
        }

        .ctaGroup {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 8px;
          margin-top: 4px;
        }

        .ctaBtn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          height: 28px;
          padding: 0 11px;
          border: 1px solid rgba(255,255,255,0.18);
          background: transparent;
          color: rgba(255,255,255,0.7);
          font-family: var(--font-geist-mono, ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace);
          font-size: 9.5px;
          font-weight: 800;
          letter-spacing: 0.14em;
          text-decoration: none;
          text-transform: uppercase;
          white-space: nowrap;
          cursor: pointer;
          transition: background 160ms ease, border-color 160ms ease, color 160ms ease;
        }

        .ctaBtn:hover,
        .ctaBtn:focus-visible {
          background: rgba(255,255,255,0.07);
          border-color: rgba(255,255,255,0.32);
          color: rgba(255,255,255,0.96);
          outline: none;
        }

        .ctaBtn:focus-visible {
          outline: 1px solid rgba(255,255,255,0.44);
          outline-offset: 2px;
        }

        .ctaBtnPrimary {
          border-color: rgba(255,255,255,0.30);
          color: rgba(255,255,255,0.88);
        }

        .ctaBtnPrimary svg {
          width: 15px;
          height: 9px;
          transition: transform 160ms ease;
        }

        .featuredCard:hover .ctaBtnPrimary svg,
        .ctaBtnPrimary:hover svg,
        .ctaBtnPrimary:focus-visible svg {
          transform: translateX(3px);
        }

        .signalPanel {
          position: relative;
          display: flex;
          flex-direction: column;
          justify-content: center;
          gap: 11px;
          border-left: 1px solid rgba(255,255,255,0.11);
          background:
            linear-gradient(180deg, rgba(255,255,255,0.026), rgba(255,255,255,0.004)),
            rgba(255,255,255,0.01);
        }

        .signalPanel::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(255,255,255,0.024) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.018) 1px, transparent 1px);
          background-size: 28px 28px;
          opacity: 0.42;
          pointer-events: none;
        }

        .signalHead,
        .donutFrame,
        .capabilityStack {
          position: relative;
          z-index: 1;
        }

        .signalHead {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
        }

        .signalTitle {
          color: rgba(255,255,255,0.62);
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 0.22em;
        }

        .statusBadge {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          min-height: 26px;
          padding: 0 10px;
          border: 1px solid rgba(255,255,255,0.14);
          background: rgba(255,255,255,0.035);
          color: rgba(255,255,255,0.72);
          font-size: 8.5px;
          font-weight: 800;
          letter-spacing: 0.16em;
        }

        .statusBadge i {
          width: 6px;
          height: 6px;
          border-radius: 999px;
          background: rgba(255,255,255,0.9);
          box-shadow: 0 0 12px rgba(255,255,255,0.42);
          animation: livePulse 2.5s ease-in-out infinite;
        }

        @keyframes livePulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.38; transform: scale(0.76); }
        }

        .donutFrame {
          position: relative;
          display: grid;
          place-items: center;
          height: clamp(166px, 21vh, 204px);
          overflow: hidden;
          border: 1px solid rgba(255,255,255,0.1);
          background:
            radial-gradient(circle at 50% 50%, rgba(255,255,255,0.055), transparent 58%),
            linear-gradient(180deg, rgba(255,255,255,0.026), transparent),
            rgba(0,0,0,0.22);
        }

        .donutFrame svg {
          position: relative;
          z-index: 1;
          width: min(68%, 188px);
          height: min(86%, 188px);
          overflow: visible;
        }

        .donutOuter,
        .donutTrack,
        .donutSegment {
          fill: none;
          transform-box: fill-box;
          transform-origin: center;
        }

        .donutOuter {
          stroke: rgba(255,255,255,0.08);
          stroke-width: 1;
          vector-effect: non-scaling-stroke;
        }

        .donutTrack {
          stroke: rgba(255,255,255,0.075);
          stroke-width: 15;
        }

        .donutSegment {
          stroke-width: 15;
          stroke-linecap: butt;
          transform: rotate(-90deg);
          filter: drop-shadow(0 0 8px rgba(255,255,255,0.13));
        }

.chartScanner {
          position: absolute;
          inset: 0;
          opacity: 0.52;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.07), transparent);
          transform: translateX(-120%);
          animation: chartScan 3.7s ease-in-out infinite;
        }

        @keyframes chartScan {
          0% { transform: translateX(-120%); }
          55%, 100% { transform: translateX(120%); }
        }

        .capabilityStack {
          display: grid;
          gap: 6px;
        }

        .capabilityRow {
          display: grid;
          grid-template-columns: minmax(104px, 1fr) auto;
          align-items: center;
          gap: 12px;
        }

        .capabilityLabel {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          min-width: 0;
          overflow: hidden;
          color: rgba(255,255,255,0.58);
          font-size: 8.8px;
          font-weight: 760;
          letter-spacing: 0.1em;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .capabilityLabel i {
          flex: 0 0 auto;
          width: 7px;
          height: 7px;
          border: 1px solid rgba(255,255,255,0.18);
          box-shadow: 0 0 10px rgba(255,255,255,0.08);
        }

        .capabilityValue {
          color: rgba(255,255,255,0.72);
          font-family: var(--font-geist-mono, ui-monospace, monospace);
          font-size: 9.5px;
          font-weight: 800;
          letter-spacing: 0.06em;
        }

        .capabilityTrack {
          grid-column: 1 / -1;
          display: block;
          height: 6px;
          overflow: hidden;
          border: 1px solid rgba(255,255,255,0.1);
          background: rgba(255,255,255,0.055);
        }

        .capabilityTrack i {
          display: block;
          height: 100%;
          box-shadow: 0 0 16px rgba(255,255,255,0.16);
        }

        .mobileLayout {
          display: none;
        }

        .selectorShell {
          position: relative;
          left: 50%;
          width: 100vw;
          transform: translateX(-50%);
          pointer-events: none;
          will-change: opacity, transform, filter;
          -webkit-mask-image: linear-gradient(to right, transparent 0%, #000 8%, #000 92%, transparent 100%);
          mask-image: linear-gradient(to right, transparent 0%, #000 8%, #000 92%, transparent 100%);
        }

        .selectorViewport {
          overflow: hidden;
          width: 100%;
        }

        .selectorTrack {
          display: flex;
          gap: 12px;
          width: max-content;
          padding: 5px 12px 12px;
          animation: selectedWorkMarquee 42s linear infinite;
          will-change: transform;
        }

        .selectorShell:hover .selectorTrack,
        .selectorShell:focus-within .selectorTrack {
          animation-play-state: paused;
        }

        @keyframes selectedWorkMarquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }

        .selectorCard {
          position: relative;
          flex: 0 0 auto;
          display: grid;
          grid-template-rows: auto 1fr auto;
          width: 216px;
          height: 146px;
          padding: 12px;
          overflow: hidden;
          border: 1px solid rgba(255,255,255,0.1);
          background:
            linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.004)),
            rgba(5,5,5,0.72);
          color: rgba(255,255,255,0.78);
          text-align: left;
          cursor: pointer;
          pointer-events: auto;
          opacity: 0.72;
          font: inherit;
          transition: transform 260ms cubic-bezier(0.16,1,0.3,1), border-color 220ms ease, box-shadow 220ms ease, opacity 180ms ease, background 180ms ease;
        }

        .selectorCard::before,
        .selectorCard::after {
          content: '';
          position: absolute;
          width: 9px;
          height: 9px;
          pointer-events: none;
          transition: border-color 180ms ease;
        }

        .selectorCard::before {
          top: 5px;
          left: 5px;
          border-top: 1px solid rgba(255,255,255,0.22);
          border-left: 1px solid rgba(255,255,255,0.22);
        }

        .selectorCard::after {
          right: 5px;
          bottom: 5px;
          border-right: 1px solid rgba(255,255,255,0.22);
          border-bottom: 1px solid rgba(255,255,255,0.22);
        }

        .selectorCard:hover,
        .selectorCard:focus-visible,
        .selectorCard.isActive {
          opacity: 1;
          border-color: rgba(255,255,255,0.48);
          background:
            linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.008)),
            rgba(8,8,8,0.86);
          box-shadow:
            0 0 0 1px rgba(255,255,255,0.08),
            0 12px 36px rgba(0,0,0,0.62),
            0 0 30px rgba(255,255,255,0.045);
          transform: translateY(-4px);
          outline: none;
          z-index: 2;
        }

        .selectorCard:hover::before,
        .selectorCard:hover::after,
        .selectorCard:focus-visible::before,
        .selectorCard:focus-visible::after,
        .selectorCard.isActive::before,
        .selectorCard.isActive::after {
          border-color: rgba(255,255,255,0.72);
        }

        .selectorTop {
          display: flex;
          justify-content: space-between;
          gap: 10px;
          color: rgba(255,255,255,0.42);
          font-size: 8.5px;
          font-weight: 800;
          letter-spacing: 0.1em;
        }

        .selectorTop span:last-child {
          min-width: 0;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .selectorMark {
          display: grid;
          place-items: center;
          min-height: 0;
          padding: 10px 4px;
        }

        .projectLogoSelector {
          max-width: 118px;
          max-height: 42px;
          filter: grayscale(1) brightness(1.28) opacity(0.72);
          transition: filter 220ms ease, transform 260ms ease;
        }

        .selectorCard:hover .projectLogoSelector,
        .selectorCard:focus-visible .projectLogoSelector,
        .selectorCard.isActive .projectLogoSelector {
          filter: grayscale(0) brightness(1.08) opacity(1);
          transform: scale(1.04);
        }

        .projectWordmarkSelector {
          flex-direction: column;
          gap: 6px;
          text-align: center;
        }

        .projectWordmarkSelector span {
          width: 36px;
          height: 30px;
          font-size: 12px;
        }

        .projectWordmarkSelector b {
          max-width: 132px;
          overflow: hidden;
          font-size: 12px;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .selectorBottom {
          display: grid;
          gap: 4px;
          min-width: 0;
        }

        .selectorBottom b {
          min-width: 0;
          overflow: hidden;
          color: rgba(255,255,255,0.9);
          font-family: var(--font-geist-mono, ui-monospace, monospace);
          font-size: 12px;
          font-weight: 500;
          letter-spacing: 0;
          text-transform: uppercase;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .selectorBottom span {
          min-width: 0;
          overflow: hidden;
          color: rgba(255,255,255,0.42);
          font-size: 8.5px;
          font-weight: 800;
          letter-spacing: 0.12em;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        @media (max-width: 767px) {
          .featuredWrap,
          .selectorShell {
            display: none !important;
          }

          .mobileLayout {
            display: flex;
            flex-direction: column;
            gap: 10px;
            width: 100%;
            pointer-events: auto;
          }

          .mobileCard {
            position: relative;
            overflow: hidden;
            border: 1px solid rgba(255,255,255,0.16);
            background:
              linear-gradient(180deg, rgba(255,255,255,0.036), rgba(255,255,255,0.005)),
              radial-gradient(circle at 20% 18%, rgba(255,255,255,0.048), transparent 42%),
              rgba(3,3,3,0.82);
            box-shadow: 0 14px 52px rgba(0,0,0,0.6);
            pointer-events: auto;
          }

          .mobileCard::before {
            content: '';
            position: absolute;
            inset: 0;
            background:
              repeating-linear-gradient(to bottom, transparent 0, transparent 3px, rgba(255,255,255,0.013) 4px, transparent 5px);
            opacity: 0.36;
            pointer-events: none;
          }

          .mobileCard::after {
            content: '';
            position: absolute;
            top: 9px;
            left: 9px;
            width: 13px;
            height: 13px;
            border-top: 1px solid rgba(255,255,255,0.48);
            border-left: 1px solid rgba(255,255,255,0.48);
            pointer-events: none;
          }

          .mobileCardInner {
            position: relative;
            z-index: 1;
            display: flex;
            flex-direction: column;
            gap: 14px;
            padding: 18px 16px;
          }

          .mobileCardTop {
            display: flex;
            align-items: center;
            gap: 12px;
          }

          .mobileCardLogo {
            flex: 0 0 auto;
            display: block;
            width: 50px;
            height: 50px;
            object-fit: contain;
            filter: grayscale(1) brightness(1.4) contrast(1.05);
          }

          .mobileCardMark {
            flex: 0 0 auto;
            display: inline-grid;
            place-items: center;
            width: 50px;
            height: 50px;
            border: 1px solid rgba(255,255,255,0.24);
            color: rgba(255,255,255,0.88);
            font-family: var(--font-geist-mono, ui-monospace, monospace);
            font-size: 15px;
            font-weight: 500;
          }

          .mobileCardTopRight {
            min-width: 0;
            display: flex;
            flex-direction: column;
            gap: 5px;
          }

          .mobileMeta {
            font-family: var(--font-geist-mono, ui-monospace, monospace);
            color: rgba(255,255,255,0.42);
            font-size: 9px;
            font-weight: 800;
            letter-spacing: 0.14em;
            text-transform: uppercase;
          }

          .mobileTitle {
            margin: 0;
            color: rgba(255,255,255,0.96);
            font-family: var(--font-geist-mono, ui-monospace, monospace);
            font-size: clamp(20px, 7vw, 28px);
            font-weight: 400;
            line-height: 1;
            letter-spacing: 0;
            text-transform: uppercase;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }

          .mobileDesc {
            margin: 0;
            color: rgba(255,255,255,0.54);
            font-size: 13px;
            line-height: 1.55;
            font-weight: 360;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }

          .mobileCtaRow {
            display: flex;
            flex-wrap: nowrap;
            gap: 6px;
            overflow-x: auto;
            scrollbar-width: none;
            -webkit-overflow-scrolling: touch;
            padding-bottom: 2px;
          }

          .mobileCtaRow::-webkit-scrollbar {
            display: none;
          }

          .mobileCtaRow .ctaBtn {
            flex: 0 0 auto;
            height: 25px;
            padding: 0 9px;
            font-size: 8px;
            gap: 5px;
          }

          .mobileCtaRow .ctaBtnPrimary svg {
            width: 12px;
            height: 7px;
          }

          .mobileArch {
            position: relative;
            display: flex;
            flex-direction: column;
            gap: 10px;
            padding: 11px;
            border: 1px solid rgba(255,255,255,0.1);
            background:
              linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.003)),
              rgba(0,0,0,0.18);
            overflow: hidden;
          }

          .mobileArch::before {
            content: '';
            position: absolute;
            inset: 0;
            background-image:
              linear-gradient(rgba(255,255,255,0.018) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.014) 1px, transparent 1px);
            background-size: 22px 22px;
            opacity: 0.42;
            pointer-events: none;
          }

          .mobileArchHead {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 10px;
            position: relative;
            z-index: 1;
          }

          .mobileArchBody {
            display: grid;
            grid-template-columns: 100px 1fr;
            gap: 11px;
            align-items: center;
            position: relative;
            z-index: 1;
          }

          .mobileDonutFrame {
            width: 100px;
            height: 100px;
            display: grid;
            place-items: center;
            overflow: hidden;
            border: 1px solid rgba(255,255,255,0.08);
            background:
              radial-gradient(circle at 50% 50%, rgba(255,255,255,0.038), transparent 58%),
              rgba(0,0,0,0.14);
          }

          .mobileDonutFrame svg {
            width: 82px;
            height: 82px;
            overflow: visible;
          }

          .mobileCapStack {
            display: flex;
            flex-direction: column;
            gap: 5px;
          }

          .mobileCapRow {
            display: flex;
            flex-direction: column;
            gap: 2px;
          }

          .mobileCapMeta {
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 4px;
          }

          .mobileCapLabel {
            display: inline-flex;
            align-items: center;
            gap: 5px;
            min-width: 0;
            overflow: hidden;
            color: rgba(255,255,255,0.52);
            font-family: var(--font-geist-mono, ui-monospace, monospace);
            font-size: 7.5px;
            font-weight: 760;
            letter-spacing: 0.08em;
            text-transform: uppercase;
            text-overflow: ellipsis;
            white-space: nowrap;
          }

          .mobileCapLabel i {
            flex: 0 0 auto;
            width: 5px;
            height: 5px;
            border: 1px solid rgba(255,255,255,0.16);
          }

          .mobileCapValue {
            flex: 0 0 auto;
            color: rgba(255,255,255,0.66);
            font-family: var(--font-geist-mono, ui-monospace, monospace);
            font-size: 8px;
            font-weight: 800;
            letter-spacing: 0.04em;
          }

          .mobileCapTrack {
            display: block;
            height: 3px;
            overflow: hidden;
            border: 1px solid rgba(255,255,255,0.08);
            background: rgba(255,255,255,0.042);
          }

          .mobileCapTrack i {
            display: block;
            height: 100%;
            box-shadow: 0 0 8px rgba(255,255,255,0.14);
          }

          /* ── Mobile selector row ── */
          .mobileSelectorShell {
            position: relative;
            left: 50%;
            width: 100vw;
            transform: translateX(-50%);
            pointer-events: none;
            -webkit-mask-image: linear-gradient(to right, transparent 0%, #000 6%, #000 94%, transparent 100%);
            mask-image: linear-gradient(to right, transparent 0%, #000 6%, #000 94%, transparent 100%);
          }

          .mobileSelectorViewport {
            overflow: hidden;
            width: 100%;
          }

          .mobileSelectorTrack {
            display: flex;
            gap: 8px;
            width: max-content;
            padding: 4px 10px 10px;
            animation: selectedWorkMarquee 36s linear infinite;
            will-change: transform;
          }

          .mobileSelectorCard {
            position: relative;
            flex: 0 0 auto;
            display: grid;
            grid-template-rows: auto 1fr auto;
            width: 128px;
            height: 108px;
            padding: 9px;
            overflow: hidden;
            border: 1px solid rgba(255,255,255,0.1);
            background:
              linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.004)),
              rgba(5,5,5,0.72);
            color: rgba(255,255,255,0.78);
            text-align: left;
            cursor: pointer;
            pointer-events: auto;
            opacity: 0.7;
            font: inherit;
            transition: border-color 220ms ease, box-shadow 220ms ease, opacity 180ms ease, background 180ms ease;
          }

          .mobileSelectorCard::before,
          .mobileSelectorCard::after {
            content: '';
            position: absolute;
            width: 7px;
            height: 7px;
            pointer-events: none;
            transition: border-color 180ms ease;
          }

          .mobileSelectorCard::before {
            top: 4px;
            left: 4px;
            border-top: 1px solid rgba(255,255,255,0.2);
            border-left: 1px solid rgba(255,255,255,0.2);
          }

          .mobileSelectorCard::after {
            right: 4px;
            bottom: 4px;
            border-right: 1px solid rgba(255,255,255,0.2);
            border-bottom: 1px solid rgba(255,255,255,0.2);
          }

          .mobileSelectorCard.isActive,
          .mobileSelectorCard:focus-visible {
            opacity: 1;
            border-color: rgba(255,255,255,0.52);
            background:
              linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.008)),
              rgba(8,8,8,0.86);
            box-shadow:
              0 0 0 1px rgba(255,255,255,0.1),
              0 8px 24px rgba(0,0,0,0.5),
              0 0 20px rgba(255,255,255,0.04);
            outline: none;
            z-index: 2;
          }

          .mobileSelectorCard.isActive::before,
          .mobileSelectorCard.isActive::after,
          .mobileSelectorCard:focus-visible::before,
          .mobileSelectorCard:focus-visible::after {
            border-color: rgba(255,255,255,0.72);
          }

          .mobileSelectorTop {
            display: flex;
            justify-content: space-between;
            gap: 6px;
            color: rgba(255,255,255,0.4);
            font-family: var(--font-geist-mono, ui-monospace, monospace);
            font-size: 7.5px;
            font-weight: 800;
            letter-spacing: 0.1em;
            text-transform: uppercase;
          }

          .mobileSelectorTop span:last-child {
            min-width: 0;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }

          .mobileSelectorMark {
            display: grid;
            place-items: center;
            min-height: 0;
            padding: 5px 2px;
          }

          .mobileSelectorBottom {
            display: grid;
            gap: 2px;
            min-width: 0;
          }

          .mobileSelectorBottom b {
            min-width: 0;
            overflow: hidden;
            color: rgba(255,255,255,0.9);
            font-family: var(--font-geist-mono, ui-monospace, monospace);
            font-size: 10px;
            font-weight: 500;
            letter-spacing: 0;
            text-transform: uppercase;
            text-overflow: ellipsis;
            white-space: nowrap;
          }

          .mobileSelectorBottom span {
            min-width: 0;
            overflow: hidden;
            color: rgba(255,255,255,0.4);
            font-family: var(--font-geist-mono, ui-monospace, monospace);
            font-size: 7.5px;
            font-weight: 800;
            letter-spacing: 0.1em;
            text-transform: uppercase;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        }

        @media (max-width: 900px) {
          .vaultInner {
            width: min(calc(100vw - 32px), 760px);
          }

          .featuredCard {
            min-height: auto;
          }

          .featuredGrid {
            grid-template-columns: 1fr;
          }

          .signalPanel {
            border-left: 0;
            border-top: 1px solid rgba(255,255,255,0.11);
          }

          .projectInfo,
          .signalPanel {
            padding: clamp(20px, 4.5vw, 34px);
          }

          .projectInfo h3 {
            font-size: clamp(28px, 5vw, 42px);
          }

          .selectorShell {
            left: 50%;
            width: 100vw;
          }
        }

        @media (max-width: 640px) {
          .vaultInner {
            width: min(calc(100vw - 28px), 520px);
            gap: 12px;
          }

          .vaultHeader {
            gap: 6px;
            padding-top: 54px;
          }

          .vaultHeader h2 {
            font-size: clamp(25px, 8vw, 38px);
          }

          .vaultHeader p {
            font-size: 12px;
          }

          .featuredCard {
            width: 100%;
          }

          .markStage {
            min-height: 48px;
          }

          .projectLogoFeatured {
            max-width: min(76%, 200px);
            max-height: 48px;
          }

          .projectWordmarkFeatured span {
            width: 48px;
            height: 48px;
            font-size: 17px;
          }

          .projectWordmarkFeatured b {
            font-size: clamp(20px, 6vw, 30px);
          }

          .projectMeta {
            font-size: 8.5px;
            line-height: 1.45;
          }

          .projectInfo p {
            font-size: 12.5px;
            line-height: 1.55;
          }

          .projectInfo h3 {
            font-size: clamp(25px, 8.4vw, 38px);
            line-height: 1;
            overflow: visible;
            text-overflow: clip;
            text-wrap: balance;
            white-space: normal;
          }

          .signalHead {
            align-items: flex-start;
          }

          .donutFrame {
            height: 148px;
          }

          .capabilityRow {
            grid-template-columns: minmax(0, 1fr) auto;
            gap: 6px;
          }

          .selectorShell {
            left: 0;
            width: 100%;
            transform: none;
            -webkit-mask-image: none;
            mask-image: none;
          }

          .selectorViewport {
            overflow-x: auto;
            overflow-y: visible;
            scroll-snap-type: x mandatory;
            scrollbar-width: none;
            -webkit-overflow-scrolling: touch;
          }

          .selectorViewport::-webkit-scrollbar {
            display: none;
          }

          .selectorTrack {
            width: max-content;
            animation: none;
            padding: 4px 2px 8px;
          }

          .selectorClone {
            display: none;
          }

          .selectorCard {
            width: min(72vw, 226px);
            height: 142px;
            scroll-snap-align: start;
          }

          .selectorCard:hover,
          .selectorCard:focus-visible,
          .selectorCard.isActive {
            transform: none;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .vaultSweep,
          .chartScanner,
          .statusBadge i {
            animation: none !important;
          }

          .selectorTrack {
            animation: none !important;
            flex-wrap: wrap;
            width: 100%;
            justify-content: center;
          }

          .selectorShell {
            left: 0;
            width: 100%;
            transform: none;
            -webkit-mask-image: none;
            mask-image: none;
          }

          .selectorViewport {
            overflow: visible;
          }

          .selectorClone {
            display: none;
          }

          .featuredCard,
          .selectorCard,
          .mobileSelectorCard,
          .ctaBtn,
          .ctaBtnPrimary svg,
          .projectLogoSelector,
          .corner,
          .cardShine {
            transition: none !important;
          }

          .mobileSelectorTrack {
            animation: none !important;
          }

          .featuredCard,
          .selectorCard:hover,
          .selectorCard:focus-visible,
          .selectorCard.isActive {
            transform: none !important;
          }
        }
      `}</style>
    </section>
  );
}
