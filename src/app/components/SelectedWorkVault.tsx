'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import type { ReactNode } from 'react';

// ── Project archive data ──────────────────────────────────────────

type PreviewKind = 'fintech' | 'commerce' | 'healthcare' | 'operations' | 'dashboard';

type Project = {
  index: string;
  category: string;
  title: string;
  tags: string[];
  slug: string;
  preview: PreviewKind;
  xray: string[];
};

const PROJECTS: Project[] = [
  {
    index: '01', category: 'FINTECH SYSTEM',
    title: 'Capital Dashboard Interface',
    tags: ['Dashboard UX', 'Mobile Flow', 'Design System'],
    slug: 'capital-dashboard-interface', preview: 'fintech',
    xray: ['DATA VIEW', 'TRANSACTION FLOW', 'RISK PANEL'],
  },
  {
    index: '02', category: 'COMMERCE PLATFORM',
    title: 'DTC Storefront Experience',
    tags: ['Commerce UX', 'Product Pages', 'Checkout Flow'],
    slug: 'dtc-storefront-experience', preview: 'commerce',
    xray: ['PRODUCT GRID', 'CHECKOUT FLOW', 'CMS CONTROL'],
  },
  {
    index: '03', category: 'HEALTHCARE INTERFACE',
    title: 'Patient App & Staff Dashboard',
    tags: ['Mobile App', 'Admin Tools', 'Accessibility'],
    slug: 'healthcare-interface-system', preview: 'healthcare',
    xray: ['PATIENT FLOW', 'STAFF DASHBOARD', 'ACCESSIBILITY LAYER'],
  },
  {
    index: '04', category: 'OPERATIONS SYSTEM',
    title: 'Logistics Command Platform',
    tags: ['Ops Dashboard', 'Workflow UX', 'Monitoring'],
    slug: 'logistics-command-platform', preview: 'operations',
    xray: ['ROUTE MAP', 'TASK QUEUE', 'ALERT STATE'],
  },
  {
    index: '05', category: 'EDTECH PRODUCT',
    title: 'Learning Platform Experience',
    tags: ['Course UX', 'Student Flow', 'Admin Panel'],
    slug: 'learning-platform-experience', preview: 'dashboard',
    xray: ['COURSE MAP', 'PROGRESS VIEW', 'CONTENT FLOW'],
  },
  {
    index: '06', category: 'REAL ESTATE PLATFORM',
    title: 'Property Discovery System',
    tags: ['Search UX', 'Listings', 'Lead Flow'],
    slug: 'property-discovery-system', preview: 'commerce',
    xray: ['LISTING GRID', 'FILTER FLOW', 'LEAD CAPTURE'],
  },
  {
    index: '07', category: 'SAAS INTERFACE',
    title: 'Analytics SaaS Dashboard',
    tags: ['SaaS UX', 'Reports', 'Data Views'],
    slug: 'analytics-saas-dashboard', preview: 'fintech',
    xray: ['REPORT VIEW', 'USER FLOW', 'DATA MODULE'],
  },
  {
    index: '08', category: 'TRAVEL PLATFORM',
    title: 'Booking Journey Interface',
    tags: ['Booking UX', 'Mobile Flow', 'Search'],
    slug: 'booking-journey-interface', preview: 'commerce',
    xray: ['SEARCH FLOW', 'BOOKING STEP', 'PAYMENT STATE'],
  },
  {
    index: '09', category: 'MEDIA SYSTEM',
    title: 'Content Publishing Interface',
    tags: ['CMS UX', 'Media Library', 'Workflow'],
    slug: 'content-publishing-interface', preview: 'operations',
    xray: ['CONTENT QUEUE', 'PUBLISH FLOW', 'ASSET PANEL'],
  },
  {
    index: '10', category: 'AUTOMOTIVE PLATFORM',
    title: 'Vehicle Marketplace System',
    tags: ['Marketplace', 'Search UX', 'Lead Flow'],
    slug: 'vehicle-marketplace-system', preview: 'commerce',
    xray: ['VEHICLE GRID', 'FILTER STATE', 'CONTACT FLOW'],
  },
];

// ── Small archive card previews ───────────────────────────────────

function FintechPreview(): ReactNode {
  return (
    <div className="mock mockFintech">
      <div className="mockStatRow">
        <span className="mockStat"><i /><b /></span>
        <span className="mockStat"><i /><b /></span>
        <span className="mockStat"><i /><b /></span>
      </div>
      <div className="mockChart">
        <svg viewBox="0 0 200 70" preserveAspectRatio="none" aria-hidden="true">
          <polyline points="0,52 28,40 52,46 80,24 108,32 140,14 170,22 200,8" />
          <line className="mockAxis" x1="0" y1="64" x2="200" y2="64" />
        </svg>
        <span className="mockBars">
          <i style={{ height: '40%' }} /><i style={{ height: '64%' }} />
          <i style={{ height: '52%' }} /><i style={{ height: '78%' }} />
          <i style={{ height: '46%' }} />
        </span>
      </div>
    </div>
  );
}

function CommercePreview(): ReactNode {
  return (
    <div className="mock mockCommerce">
      <div className="mockSidebar">
        <span /><span /><span /><span />
      </div>
      <div className="mockGrid">
        {Array.from({ length: 6 }).map((_, i) => (
          <span key={i} className="mockProduct">
            <i className="mockThumb" />
            <i className="mockLine" />
            <i className="mockLine short" />
          </span>
        ))}
      </div>
    </div>
  );
}

function HealthcarePreview(): ReactNode {
  return (
    <div className="mock mockHealthcare">
      <div className="mockPhone">
        <span className="mockNotch" />
        <i className="mockLine" />
        <i className="mockBlock" />
        <i className="mockLine" />
        <i className="mockLine short" />
      </div>
      <div className="mockStaff">
        <span className="mockTableHead" />
        {Array.from({ length: 5 }).map((_, i) => (
          <span key={i} className="mockTableRow">
            <i className="mockDot" />
            <i className="mockLine" />
            <i className="mockLine short" />
          </span>
        ))}
      </div>
    </div>
  );
}

function OperationsPreview(): ReactNode {
  return (
    <div className="mock mockOperations">
      <div className="mockMap">
        <svg viewBox="0 0 200 120" preserveAspectRatio="none" aria-hidden="true">
          <path className="mockRoute" d="M16,98 C60,70 70,40 120,44 S180,30 188,16" />
          <circle cx="16" cy="98" r="4" />
          <circle cx="120" cy="44" r="4" />
          <circle cx="188" cy="16" r="4" />
        </svg>
      </div>
      <div className="mockQueue">
        {Array.from({ length: 4 }).map((_, i) => (
          <span key={i} className="mockTask">
            <i className="mockTick" />
            <i className="mockLine" />
          </span>
        ))}
      </div>
    </div>
  );
}

function DashboardPreview(): ReactNode {
  return (
    <div className="mock mockDashboard">
      <div className="mockDashKpiRow">
        <span className="mockDashKpi"><i /><b /></span>
        <span className="mockDashKpi"><i /><b /></span>
      </div>
      <div className="mockDashBody">
        <span className="mockDashBars">
          {[55, 72, 40, 88, 62, 78, 50].map((h, idx) => (
            <i key={idx} style={{ height: `${h}%` }} />
          ))}
        </span>
        <span className="mockDashRows">
          <i className="mockLine" />
          <i className="mockLine short" />
          <i className="mockLine" />
        </span>
      </div>
    </div>
  );
}

const PREVIEWS: Record<PreviewKind, () => ReactNode> = {
  fintech: FintechPreview,
  commerce: CommercePreview,
  healthcare: HealthcarePreview,
  operations: OperationsPreview,
  dashboard: DashboardPreview,
};

// ── Featured card large previews ──────────────────────────────────

function FeatFintechPreview(): ReactNode {
  return (
    <div className="fmock fmockFintech">
      <div className="fmockSidebar">
        <span className="fmockSidebarLogo" />
        <span className="fmockNavSep" />
        {[1, 2, 3, 4, 5].map(i => (
          <span key={i} className={`fmockNavItem${i === 2 ? ' fmockNavActive' : ''}`} />
        ))}
        <span className="fmockNavSep" style={{ marginTop: 'auto' }} />
        <span className="fmockNavItem" />
      </div>
      <div className="fmockMain">
        <div className="fmockTopBar">
          <span className="fmockTopTitle" />
          <div className="fmockTopActions">
            <span /><span /><span />
          </div>
        </div>
        <div className="fmockKpiRow">
          {[0, 1, 2, 3].map(i => (
            <div key={i} className="fmockKpi">
              <span className="fmockKpiLabel" />
              <span className="fmockKpiVal" />
              <span className="fmockKpiTrend" />
            </div>
          ))}
        </div>
        <div className="fmockChartPanel">
          <div className="fmockChartHeader">
            <span className="fmockChartTitle" />
            <div className="fmockChartLegend"><i /><i /></div>
          </div>
          <div className="fmockChartBody">
            <svg viewBox="0 0 360 80" preserveAspectRatio="none" aria-hidden="true">
              <path
                fill="rgba(255,255,255,0.07)"
                d="M0,68 C45,55 90,40 135,26 S190,14 240,10 S310,7 360,5 L360,80 L0,80 Z"
              />
              <polyline
                fill="none"
                stroke="rgba(255,255,255,0.55)"
                strokeWidth="1.5"
                vectorEffect="non-scaling-stroke"
                points="0,68 45,55 90,40 135,26 180,20 225,14 270,10 315,7 360,5"
              />
              <line x1="0" y1="26" x2="360" y2="26" stroke="rgba(255,255,255,0.07)" strokeWidth="1" vectorEffect="non-scaling-stroke" />
              <line x1="0" y1="53" x2="360" y2="53" stroke="rgba(255,255,255,0.07)" strokeWidth="1" vectorEffect="non-scaling-stroke" />
              <circle cx="180" cy="20" r="3" fill="rgba(255,255,255,0.8)" />
            </svg>
            <div className="fmockBarCluster">
              {[42, 65, 38, 80, 55, 70, 48, 88, 60, 74, 44, 82].map((h, i) => (
                <span key={i} className="fmockBarB" style={{ height: `${h}%` }} />
              ))}
            </div>
          </div>
        </div>
        <div className="fmockTablePanel">
          <div className="fmockTHead">
            <span /><span /><span /><span /><span />
          </div>
          {[0, 1, 2, 3].map(i => (
            <div key={i} className="fmockTRow">
              <span className="fmockDotG" />
              <span className="fmockCell lg" />
              <span className="fmockCell md" />
              <span className="fmockCell sm" />
              <span className="fmockPill" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function FeatCommercePreview(): ReactNode {
  return (
    <div className="fmock fmockCommerce">
      <div className="fmockStoreHeader">
        <span className="fmockStoreLogo" />
        <div className="fmockSearchBar"><i /><span /></div>
        <div className="fmockStoreNav"><span /><span /><span /><span /></div>
      </div>
      <div className="fmockStoreBody">
        <div className="fmockFilterPanel">
          <span className="fmockFilterTitle" />
          <span className="fmockFilterSep" />
          {[0, 1, 2, 3, 4, 5].map(i => (
            <div key={i} className="fmockFilterItem">
              <i className="fmockCheckbox" /><i />
            </div>
          ))}
          <span className="fmockFilterSep" />
          {[0, 1, 2].map(i => (
            <div key={i} className="fmockFilterItem">
              <i className="fmockCheckbox" /><i />
            </div>
          ))}
        </div>
        <div className="fmockProductArea">
          <div className="fmockProductSubHeader">
            <span /><span className="fmockSubShort" />
          </div>
          <div className="fmockProductGrid">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="fmockProductCard">
                <div className="fmockProductImg" />
                <span className="fmockProductLine" />
                <span className="fmockProductLine short" />
                <span className="fmockProductPrice" />
              </div>
            ))}
          </div>
          <div className="fmockPagination">
            {[0, 1, 2, 3, 4].map(i => (
              <span key={i} className={`fmockPageDot${i === 1 ? ' fmockPageActive' : ''}`} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function FeatHealthcarePreview(): ReactNode {
  return (
    <div className="fmock fmockHealthcare">
      <div className="fmockPhoneWrap">
        <div className="fmockPhoneFrame">
          <span className="fmockPhoneNotch" />
          <div className="fmockPhoneScreen">
            <span className="fmockPhoneHeader" />
            <div className="fmockPhoneCard">
              <span className="fmockPhoneCardLine" />
              <span className="fmockPhoneCardVal" />
            </div>
            <div className="fmockPhoneMiniChart">
              <svg viewBox="0 0 80 30" preserveAspectRatio="none" aria-hidden="true">
                <polyline
                  fill="none"
                  stroke="rgba(255,255,255,0.5)"
                  strokeWidth="1.5"
                  vectorEffect="non-scaling-stroke"
                  points="0,22 10,18 20,20 30,10 40,14 50,8 60,12 70,6 80,9"
                />
              </svg>
            </div>
            {[0, 1, 2, 3].map(i => (
              <div key={i} className="fmockPhoneListItem">
                <span className="fmockPhoneDot" /><span /><span className="fmockPhoneShort" />
              </div>
            ))}
            <div className="fmockPhoneTabBar">
              <span /><span className="fmockTabActive" /><span />
            </div>
          </div>
        </div>
      </div>
      <div className="fmockStaffPanel">
        <div className="fmockStaffHeader">
          <span className="fmockStaffTitle" />
          <div className="fmockStaffActions"><span /><span /></div>
        </div>
        <div className="fmockStaffStatRow">
          {[0, 1, 2].map(i => (
            <div key={i} className="fmockStatCard">
              <span /><b />
            </div>
          ))}
        </div>
        <div className="fmockPatientTable">
          <div className="fmockPTHead">
            <span /><span /><span /><span /><span />
          </div>
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="fmockPTRow">
              <span className="fmockPDot" />
              <span className="fmockPCell lg" />
              <span className="fmockPCell md" />
              <span className="fmockPCell sm" />
              <span className={`fmockStatus${i % 3 === 0 ? ' fmockStatusActive' : ''}`} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function FeatOperationsPreview(): ReactNode {
  return (
    <div className="fmock fmockOperations">
      <div className="fmockMapPanel">
        <div className="fmockMapHeader">
          <span /><span className="fmockMapShort" />
        </div>
        <div className="fmockMapBody">
          <svg viewBox="0 0 260 160" preserveAspectRatio="none" aria-hidden="true">
            <line x1="0" y1="40" x2="260" y2="40" stroke="rgba(255,255,255,0.05)" strokeWidth="1" vectorEffect="non-scaling-stroke" />
            <line x1="0" y1="80" x2="260" y2="80" stroke="rgba(255,255,255,0.05)" strokeWidth="1" vectorEffect="non-scaling-stroke" />
            <line x1="0" y1="120" x2="260" y2="120" stroke="rgba(255,255,255,0.05)" strokeWidth="1" vectorEffect="non-scaling-stroke" />
            <line x1="65" y1="0" x2="65" y2="160" stroke="rgba(255,255,255,0.05)" strokeWidth="1" vectorEffect="non-scaling-stroke" />
            <line x1="130" y1="0" x2="130" y2="160" stroke="rgba(255,255,255,0.05)" strokeWidth="1" vectorEffect="non-scaling-stroke" />
            <line x1="195" y1="0" x2="195" y2="160" stroke="rgba(255,255,255,0.05)" strokeWidth="1" vectorEffect="non-scaling-stroke" />
            <path
              fill="none"
              stroke="rgba(255,255,255,0.45)"
              strokeWidth="1.5"
              strokeDasharray="5 4"
              vectorEffect="non-scaling-stroke"
              d="M20,138 C50,110 80,85 120,70 S180,46 240,22"
            />
            <path
              fill="none"
              stroke="rgba(255,255,255,0.2)"
              strokeWidth="1"
              strokeDasharray="3 5"
              vectorEffect="non-scaling-stroke"
              d="M20,138 C40,120 70,115 100,105 S160,90 240,80"
            />
            <circle cx="20" cy="138" r="4" fill="#080808" stroke="rgba(255,255,255,0.7)" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
            <circle cx="120" cy="70" r="4" fill="#080808" stroke="rgba(255,255,255,0.55)" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
            <circle cx="240" cy="22" r="4" fill="#080808" stroke="rgba(255,255,255,0.7)" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
            <circle cx="100" cy="105" r="3" fill="#080808" stroke="rgba(255,255,255,0.38)" strokeWidth="1" vectorEffect="non-scaling-stroke" />
            <circle cx="240" cy="80" r="3" fill="#080808" stroke="rgba(255,255,255,0.38)" strokeWidth="1" vectorEffect="non-scaling-stroke" />
          </svg>
        </div>
      </div>
      <div className="fmockOpsRight">
        <div className="fmockAlertPanel">
          <div className="fmockAlertHeader"><span /></div>
          {[0, 1, 2].map(i => (
            <div key={i} className="fmockAlertRow">
              <span className={`fmockAlertDot${i === 0 ? ' fmockAlertWarn' : ''}`} />
              <span className="fmockAlertLine" />
            </div>
          ))}
        </div>
        <div className="fmockQueuePanel">
          <div className="fmockQueueHeader"><span /></div>
          {[0, 1, 2, 3, 4, 5].map(i => (
            <div key={i} className="fmockQueueItem">
              <span className={`fmockQTick${i < 3 ? ' fmockQDone' : ''}`} />
              <span className="fmockQLine" />
              <span className="fmockQBadge" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function FeatDashboardPreview(): ReactNode {
  return (
    <div className="fmock fmockDashboard">
      <div className="fmockDashTopBar">
        <span className="fmockDashBarTitle" />
        <div className="fmockDashControls"><span /><span /><span /></div>
      </div>
      <div className="fmockDashKpiRow">
        {[72, 88, 55, 64].map((w, i) => (
          <div key={i} className="fmockDashKpi">
            <span className="fmockDashKpiLabel" />
            <span className="fmockDashKpiNum" />
            <div className="fmockDashKpiBar">
              <span style={{ width: `${w}%` }} />
            </div>
          </div>
        ))}
      </div>
      <div className="fmockDashBody">
        <div className="fmockDashChartArea">
          <div className="fmockDashChartTitle"><span /></div>
          <svg viewBox="0 0 280 80" preserveAspectRatio="none" aria-hidden="true">
            <path fill="rgba(255,255,255,0.06)" d="M0,65 C35,55 70,45 105,35 S175,20 210,15 S255,12 280,10 L280,80 L0,80Z" />
            <polyline fill="none" stroke="rgba(255,255,255,0.55)" strokeWidth="1.5" vectorEffect="non-scaling-stroke"
              points="0,65 35,55 70,45 105,35 140,28 175,20 210,15 245,12 280,10" />
            {([35, 70, 105, 140, 175, 210] as number[]).map((x, i) => (
              <circle key={i} cx={x} cy={([55, 45, 35, 28, 20, 15] as number[])[i]} r="2.5" fill="rgba(255,255,255,0.65)" />
            ))}
            <line x1="0" y1="26" x2="280" y2="26" stroke="rgba(255,255,255,0.06)" strokeWidth="1" vectorEffect="non-scaling-stroke" />
            <line x1="0" y1="52" x2="280" y2="52" stroke="rgba(255,255,255,0.06)" strokeWidth="1" vectorEffect="non-scaling-stroke" />
          </svg>
          <div className="fmockDashMiniTable">
            <div className="fmockDMHead"><span /><span /><span /></div>
            {[0, 1, 2, 3].map(i => (
              <div key={i} className="fmockDMRow">
                <span className="fmockDMCell lg" />
                <span className="fmockDMCell md" />
                <span className="fmockDMCell sm" />
              </div>
            ))}
          </div>
        </div>
        <div className="fmockDashSidePanel">
          <div className="fmockDonut">
            <svg viewBox="0 0 70 70" aria-hidden="true">
              <circle cx="35" cy="35" r="26" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="8" />
              <circle cx="35" cy="35" r="26" fill="none" stroke="rgba(255,255,255,0.45)" strokeWidth="8"
                strokeDasharray="100 64" strokeDashoffset="-8" />
              <circle cx="35" cy="35" r="26" fill="none" stroke="rgba(255,255,255,0.22)" strokeWidth="8"
                strokeDasharray="40 124" strokeDashoffset="-108" />
            </svg>
          </div>
          <div className="fmockDonutLegend">
            {[0, 1, 2].map(i => (
              <div key={i} className="fmockLegendItem">
                <span className="fmockLegendDot" /><span />
              </div>
            ))}
          </div>
          <div className="fmockSideStats">
            {[0, 1, 2, 3].map(i => (
              <div key={i} className="fmockSideStat">
                <span /><span className="fmockSideVal" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const FEAT_PREVIEWS: Record<PreviewKind, () => ReactNode> = {
  fintech: FeatFintechPreview,
  commerce: FeatCommercePreview,
  healthcare: FeatHealthcarePreview,
  operations: FeatOperationsPreview,
  dashboard: FeatDashboardPreview,
};

// ── Decode text ───────────────────────────────────────────────────
// Lightweight "decoding" reveal: scrambles glyphs then settles left→right.
// Renders the final string on the server / before `run` so there is no layout
// shift and the text stays accessible. Used for the SECTION B eyebrow, the
// readout values and the CTA — short monospace strings only.

const DECODE_GLYPHS = '#%&/0123456789<>=*+-▓▒░';

function Decode({
  text,
  run,
  delay = 0,
  duration = 420,
  className,
}: {
  text: string;
  run: boolean;
  delay?: number;
  duration?: number;
  className?: string;
}): ReactNode {
  const [display, setDisplay] = useState(text);

  // Keep display synced to text whenever the animation isn't running.
  useEffect(() => {
    if (!run) setDisplay(text);
  }, [text, run]);

  useEffect(() => {
    if (!run) return;
    let raf = 0;
    let start = 0;
    const tick = (ts: number) => {
      if (!start) start = ts;
      const t = ts - start;
      const settled = Math.floor((t / duration) * text.length);
      let out = '';
      for (let i = 0; i < text.length; i++) {
        if (i < settled || text[i] === ' ') out += text[i];
        else out += DECODE_GLYPHS[(Math.random() * DECODE_GLYPHS.length) | 0];
      }
      setDisplay(out);
      if (t < duration) raf = requestAnimationFrame(tick);
      else setDisplay(text);
    };
    const timer = window.setTimeout(() => {
      raf = requestAnimationFrame(tick);
    }, delay);
    // Do NOT call setDisplay in cleanup — that can fire setState on an
    // unmounting component or during a sibling reconciliation pass.
    return () => {
      window.clearTimeout(timer);
      cancelAnimationFrame(raf);
    };
  }, [run, text, delay, duration]);

  return <span className={className} aria-label={text}>{display}</span>;
}

// ── Archive row config ────────────────────────────────────────────

const ARCHIVE_ROWS = [
  { items: PROJECTS, dir: 'rtl' as const, duration: 55 },
];

// ── Component ─────────────────────────────────────────────────────

export default function SelectedWorkVault() {
  const [featIdx, setFeatIdx] = useState(0);
  const featured = PROJECTS[featIdx];
  const FeatPreview = FEAT_PREVIEWS[featured.preview];

  // ── Mouse-tracking 3D tilt ────────────────────────────────────
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [shine, setShine] = useState({ x: 50, y: 50 });
  const [isHovering, setIsHovering] = useState(false);
  const featCardRef = useRef<HTMLAnchorElement>(null);
  const reducedMotion = useRef(false);

  // ── Archive boot sequence ─────────────────────────────────────
  // armed  → JS is alive + motion allowed → boot-children start hidden
  // booted → Section B reached (CoinScene dispatches 'vaultBoot') → play once
  const vaultRef = useRef<HTMLDivElement>(null);
  const [armed, setArmed] = useState(false);
  const [booted, setBooted] = useState(false);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const apply = (m: boolean) => {
      reducedMotion.current = m;
      setReduced(m);
      if (m) {
        // Reduced motion: skip the choreography, show everything at rest.
        setArmed(false);
        setBooted(true);
      } else {
        setArmed(true);
      }
    };
    apply(mq.matches);
    const onChange = (e: MediaQueryListEvent) => apply(e.matches);
    mq.addEventListener('change', onChange);

    // CoinScene fires this once, the first time Section B scrolls into view.
    const onBoot = () => setBooted(true);
    window.addEventListener('vaultBoot', onBoot);

    return () => {
      mq.removeEventListener('change', onChange);
      window.removeEventListener('vaultBoot', onBoot);
    };
  }, []);

  // Desktop-only idle pointer parallax → CSS vars consumed by the featured card.
  useEffect(() => {
    if (reduced) return;
    if (window.matchMedia('(max-width: 640px)').matches) return;
    if (window.matchMedia('(pointer: coarse)').matches) return;
    const el = vaultRef.current;
    if (!el) return;
    let raf = 0;
    let px = 0;
    let py = 0;
    const onMove = (e: PointerEvent) => {
      px = (e.clientX - window.innerWidth / 2) / (window.innerWidth / 2);
      py = (e.clientY - window.innerHeight / 2) / (window.innerHeight / 2);
      if (!raf) {
        raf = requestAnimationFrame(() => {
          raf = 0;
          el.style.setProperty('--vpx', px.toFixed(3));
          el.style.setProperty('--vpy', py.toFixed(3));
        });
      }
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => {
      window.removeEventListener('pointermove', onMove);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [reduced]);

  const decodeRun = booted && armed;

  // Re-run the wireframe clip-reveal when the featured project swaps,
  // without keying the element (which causes React/GSAP DOM conflicts).
  const previewInnerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!booted || !armed) return;
    const el = previewInnerRef.current;
    if (!el) return;
    el.classList.remove('featPreviewReveal');
    // One rAF gives the browser a chance to flush the class removal before re-adding.
    const id = requestAnimationFrame(() => el.classList.add('featPreviewReveal'));
    return () => cancelAnimationFrame(id);
  }, [featIdx, booted, armed]);

  const handleFeatMouseMove = useCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
    if (reducedMotion.current) return;
    const card = featCardRef.current;
    if (!card) return;
    const r = card.getBoundingClientRect();
    // skip tilt on narrow screens (touch layout)
    if (r.width < 500) return;
    const dx = (e.clientX - (r.left + r.width  / 2)) / (r.width  / 2); // −1 … 1
    const dy = (e.clientY - (r.top  + r.height / 2)) / (r.height / 2); // −1 … 1
    setTilt({ x: dy * -5, y: dx * 6 });
    setShine({ x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 });
  }, []);

  const handleFeatEnter = useCallback(() => { if (!reducedMotion.current) setIsHovering(true); }, []);
  const handleFeatLeave = useCallback(() => { setIsHovering(false); setTilt({ x: 0, y: 0 }); }, []);

  return (
    <div
      ref={vaultRef}
      className={`vault${armed ? ' vaultArmed' : ''}${booted ? ' isBooted' : ''}`}
      aria-label="Selected work archive"
    >

      {/* Archive boot FX — CRT flicker, scan sweep, corner glow, grain burst */}
      <div className="vaultBootFx" aria-hidden="true">
        <span className="vaultGrainBurst" />
        <span className="vaultScanSweep" />
        <span className="vaultFlicker" />
        <span className="vaultGlow" />
      </div>

      <div className="vaultInner">

      {/* Section heading */}
      <div className="vaultHead vaultReveal">
        <span className="vaultEyebrow">
          <Decode text="SECTION B" run={decodeRun} />
        </span>
        <h2 className="vaultHeading">
          <span className="vaultHeadingInner">Selected Work</span>
        </h2>
        <p className="vaultSub">
          A curated archive of product interfaces, operational systems, and digital platforms.
        </p>
      </div>

      {/* Featured card */}
      <div className="featWrap vaultReveal">
        <a
          ref={featCardRef}
          className={`featCard${isHovering ? ' featCardHover' : ''}`}
          href={`/projects/${featured.slug}`}
          aria-label={`${featured.title} — ${featured.category}. Open project.`}
          style={{
            transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale(${isHovering ? 1.012 : 1})`,
            transition: isHovering
              ? 'transform 80ms linear, border-color 350ms ease, box-shadow 350ms ease'
              : 'transform 650ms cubic-bezier(0.16, 1, 0.3, 1), border-color 350ms ease, box-shadow 350ms ease',
          }}
          onMouseMove={handleFeatMouseMove}
          onMouseEnter={handleFeatEnter}
          onMouseLeave={handleFeatLeave}
        >
          <span className="featBracketTL" aria-hidden="true" />
          <span className="featBracketBR" aria-hidden="true" />
          <span className="featBootBorder" aria-hidden="true" />
          <div
            className="featShine"
            style={{
              background: `radial-gradient(circle at ${shine.x}% ${shine.y}%, rgba(255,255,255,0.08) 0%, transparent 55%)`,
              opacity: isHovering ? 1 : 0,
              transition: isHovering ? 'opacity 120ms ease' : 'opacity 500ms ease',
            }}
            aria-hidden="true"
          />

          <div className="featPreview">
            <div ref={previewInnerRef} className="featPreviewInner">
              <FeatPreview />
            </div>
            <span className="featBootScan" aria-hidden="true" />
            <span className="featScanline" aria-hidden="true" />
            <div className="featXray" aria-hidden="true">
              {featured.xray.map((label, li) => (
                <span key={label} className="featXrayNode" data-xpos={li}>
                  <i className="featXrayDot" />
                  <i className="featXrayLine" />
                  <b className="featXrayLabel">{label}</b>
                </span>
              ))}
            </div>
            <div className="featReadout" aria-hidden="true">
              <span><em>ARCHIVE COUNT </em><Decode text={String(PROJECTS.length).padStart(2, '0')} run={decodeRun} delay={900} /></span>
              <span><em>ACTIVE FILE   </em><Decode text={featured.index} run={decodeRun} delay={980} /></span>
              <span><em>MODE          </em><Decode text="SELECTED WORK" run={decodeRun} delay={1060} /></span>
              <span><em>STATUS        </em><Decode text="VIEWABLE" run={decodeRun} delay={1140} /></span>
            </div>
          </div>

          <div className="featMeta">
            <div className="featMetaLeft">
              <span className="featIndexRow">
                {featured.index}<em> / </em>{featured.category}
              </span>
              <span className="featTitle"><span className="featTitleInner">{featured.title}</span></span>
              <span className="featTags">
                {featured.tags.map(tag => (
                  <span key={tag}>{tag}</span>
                ))}
              </span>
            </div>
            <div className="featMetaRight">
              <span className="featCta" aria-hidden="true">OPEN PROJECT <em>→</em></span>
            </div>
          </div>
        </a>
      </div>

      {/* Archive rows */}
      <div className="archiveConveyor">
        {ARCHIVE_ROWS.map((row, rowIdx) => {
          const doubled = [...row.items, ...row.items];
          return (
            <div
              key={rowIdx}
              className="archiveRow"
              data-dir={row.dir}
              data-rowid={rowIdx}
            >
              <div
                className="archiveTrack"
                style={{ animationDuration: `${row.duration}s` }}
              >
                {doubled.map((project, cardIdx) => {
                  const isClone = cardIdx >= row.items.length;
                  const origIdx = PROJECTS.findIndex(p => p.slug === project.slug);
                  const Preview = PREVIEWS[project.preview];
                  return (
                    <a
                      key={`${rowIdx}-${project.slug}-${cardIdx}`}
                      className="archiveCard"
                      style={{ '--ai': cardIdx } as React.CSSProperties}
                      href={`/projects/${project.slug}`}
                      aria-label={isClone ? undefined : `${project.title} — ${project.category}. Open project.`}
                      aria-hidden={isClone ? true : undefined}
                      tabIndex={isClone ? -1 : 0}
                      onMouseEnter={() => { if (origIdx !== -1) setFeatIdx(origIdx); }}
                      onFocus={() => { if (origIdx !== -1) setFeatIdx(origIdx); }}
                    >
                      <span className="archivePreview">
                        <Preview />
                        <span className="archiveScanline" aria-hidden="true" />
                      </span>
                      <span className="archiveMeta">
                        <span className="archiveIndexRow">
                          {project.index}<em> / </em>{project.category}
                        </span>
                        <span className="archiveTitle">{project.title}</span>
                        <span className="archiveOpen" aria-hidden="true">OPEN <em>→</em></span>
                      </span>
                    </a>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom CTA */}
      <div className="vaultCta vaultReveal">
        <a className="vaultCtaLink" href="/projects">
          <Decode text="VIEW COMPLETE ARCHIVE" run={decodeRun} delay={1200} /> <em>→</em>
        </a>
      </div>

      </div>{/* /vaultInner */}

      <style jsx>{`
        /* ── Vault container ──────────────────────────────────────── */
        .vault {
          position: relative;
          z-index: 1;
          width: 100%;
          pointer-events: none;
          overflow-x: clip;
        }

        .vaultInner {
          width: min(calc(100% - 40px), 1200px);
          margin-inline: auto;
          display: flex;
          flex-direction: column;
          gap: clamp(14px, 2.1vh, 28px);
          text-align: left;
        }

        /* ── Heading ──────────────────────────────────────────────── */
        .vaultHead {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          will-change: opacity, transform, filter;
        }

        .vaultEyebrow {
          color: rgba(255,255,255,0.4);
          font-family: ui-monospace, 'Courier New', monospace;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.24em;
          text-transform: uppercase;
        }

        .vaultHeading {
          margin: 12px 0 0;
          color: rgba(255,255,255,0.94);
          font-size: clamp(24px, 2.8vw, 42px);
          line-height: 1.02;
          font-weight: 380;
          letter-spacing: -0.04em;
          text-transform: uppercase;
        }

        .vaultSub {
          width: min(86vw, 520px);
          margin: 14px auto 0;
          color: rgba(255,255,255,0.52);
          font-size: clamp(12px, 0.95vw, 14px);
          line-height: 1.6;
          font-weight: 360;
        }

        /* ── Featured wrap ────────────────────────────────────────── */
        .featWrap {
          display: flex;
          justify-content: center;
          pointer-events: none;
          will-change: opacity, transform, filter;
          perspective: 1400px;
        }

        /* ── Featured card ────────────────────────────────────────── */
        .featCard {
          position: relative;
          display: flex;
          flex-direction: column;
          width: clamp(320px, 70vw, 980px);
          background:
            linear-gradient(180deg, rgba(255,255,255,0.022), rgba(255,255,255,0.004)),
            rgba(4,4,4,0.72);
          border: 1px solid rgba(255,255,255,0.18);
          color: rgba(255,255,255,0.9);
          text-decoration: none;
          pointer-events: auto;
          overflow: hidden;
          box-shadow:
            0 0 0 1px rgba(255,255,255,0.04),
            0 8px 48px rgba(0,0,0,0.7),
            0 0 64px rgba(255,255,255,0.02);
          /* Entrance (opacity/scale/blur) handled by GSAP on .featWrap.
             Layered "assembly" handled by the boot sequence below.
             transform + transition handled by inline style (mouse-tracking tilt) */
        }

        /* Idle border "breathing" glow — only after the boot completes */
        .vault.vaultArmed.isBooted .featCard::after {
          content: '';
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 1;
          box-shadow: inset 0 0 0 1px rgba(255,255,255,0);
          animation: featBreath 6s ease-in-out 1.6s infinite;
        }

        @keyframes featBreath {
          0%, 100% { box-shadow: inset 0 0 0 1px rgba(255,255,255,0.02), 0 0 36px rgba(255,255,255,0.012); }
          50%      { box-shadow: inset 0 0 0 1px rgba(255,255,255,0.06), 0 0 52px rgba(255,255,255,0.03); }
        }

        .featCard:hover,
        .featCardHover,
        .featCard:focus-visible {
          border-color: rgba(255,255,255,0.32);
          box-shadow:
            0 0 0 1px rgba(255,255,255,0.06),
            0 24px 80px rgba(0,0,0,0.85),
            0 0 80px rgba(255,255,255,0.04);
          outline: none;
        }

        /* ── Shine overlay ────────────────────────────────────────── */
        .featShine {
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 6;
        }

        /* Corner bracket — top-left */
        .featBracketTL {
          position: absolute;
          top: 10px;
          left: 10px;
          width: 14px;
          height: 14px;
          border-top: 1px solid rgba(255,255,255,0.38);
          border-left: 1px solid rgba(255,255,255,0.38);
          pointer-events: none;
          z-index: 10;
          transition: border-color 280ms ease;
        }

        /* Corner bracket — bottom-right */
        .featBracketBR {
          position: absolute;
          bottom: 10px;
          right: 10px;
          width: 14px;
          height: 14px;
          border-bottom: 1px solid rgba(255,255,255,0.38);
          border-right: 1px solid rgba(255,255,255,0.38);
          pointer-events: none;
          z-index: 10;
          transition: border-color 280ms ease;
        }

        .featCard:hover .featBracketTL,
        .featCard:focus-visible .featBracketTL,
        .featCard:hover .featBracketBR,
        .featCard:focus-visible .featBracketBR {
          border-color: rgba(255,255,255,0.7);
        }

        /* ── Featured preview area ────────────────────────────────── */
        .featPreview {
          position: relative;
          flex: 1;
          min-height: clamp(200px, 28vh, 310px);
          border-bottom: 1px solid rgba(255,255,255,0.1);
          background: #060606;
          overflow: hidden;
          filter: grayscale(1) brightness(0.78) contrast(1.08);
          transition: filter 350ms ease, border-color 350ms ease;
        }

        /* CRT grid overlay */
        .featPreview::before {
          content: '';
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 3;
          background-image:
            linear-gradient(rgba(255,255,255,0.028) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.028) 1px, transparent 1px);
          background-size: 26px 26px;
        }

        /* Static scanline texture */
        .featPreview::after {
          content: '';
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 3;
          background: repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(0,0,0,0.14) 2px,
            rgba(0,0,0,0.14) 3px
          );
        }

        .featCard:hover .featPreview,
        .featCard:focus-visible .featPreview {
          filter: grayscale(0.45) brightness(1.08) contrast(1.14);
          border-color: rgba(255,255,255,0.2);
        }

        /* ── Featured scanner line (always on) ───────────────────── */
        .featScanline {
          position: absolute;
          left: 0;
          right: 0;
          top: 0;
          height: 16%;
          pointer-events: none;
          z-index: 4;
          background: linear-gradient(
            180deg,
            transparent,
            rgba(255,255,255,0.09) 50%,
            transparent
          );
          animation: featScan 3.2s linear infinite;
        }

        @keyframes featScan {
          0%   { transform: translateY(-120%); }
          100% { transform: translateY(750%); }
        }

        /* ── Featured x-ray labels (on hover) ────────────────────── */
        .featXray {
          position: absolute;
          inset: 0;
          pointer-events: none;
          opacity: 0;
          z-index: 5;
          transition: opacity 380ms ease;
        }

        .featCard:hover .featXray,
        .featCard:focus-visible .featXray {
          opacity: 1;
        }

        .featXrayNode {
          position: absolute;
          display: flex;
          align-items: center;
          gap: 5px;
          transform: translateY(-50%);
        }

        .featXrayNode[data-xpos='0'] { top: 22%; left: 6%;  }
        .featXrayNode[data-xpos='1'] { top: 58%; left: 38%; }
        .featXrayNode[data-xpos='2'] { top: 36%; left: 64%; }

        .featXrayDot {
          display: block;
          width: 5px;
          height: 5px;
          flex: none;
          border-radius: 50%;
          background: rgba(255,255,255,0.9);
          box-shadow: 0 0 7px rgba(255,255,255,0.5);
        }

        .featXrayLine {
          display: block;
          width: 18px;
          height: 1px;
          flex: none;
          background: rgba(255,255,255,0.38);
        }

        .featXrayLabel {
          color: rgba(255,255,255,0.78);
          font-family: ui-monospace, 'Courier New', monospace;
          font-size: 8px;
          font-weight: 800;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          white-space: nowrap;
        }

        /* ── Featured readout module ──────────────────────────────── */
        .featReadout {
          position: absolute;
          bottom: 10px;
          right: 12px;
          display: flex;
          flex-direction: column;
          gap: 3px;
          padding: 8px 11px;
          border: 1px solid rgba(255,255,255,0.12);
          background: rgba(0,0,0,0.62);
          z-index: 5;
          pointer-events: none;
        }

        .featReadout span {
          display: block;
          font-family: ui-monospace, 'Courier New', monospace;
          font-size: 7.5px;
          font-weight: 800;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.7);
          white-space: pre;
        }

        .featReadout em {
          color: rgba(255,255,255,0.32);
          font-style: normal;
        }

        /* ── Featured meta ────────────────────────────────────────── */
        .featMeta {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          flex: none;
          padding: clamp(12px, 1.4vh, 18px) clamp(14px, 2vw, 24px);
        }

        .featMetaLeft {
          display: flex;
          flex-direction: column;
          gap: 6px;
          min-width: 0;
        }

        .featIndexRow {
          color: rgba(255,255,255,0.4);
          font-family: ui-monospace, 'Courier New', monospace;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          white-space: nowrap;
        }

        .featIndexRow em {
          color: rgba(255,255,255,0.2);
          font-style: normal;
        }

        .featTitle {
          display: block;
          color: rgba(255,255,255,0.95);
          font-size: clamp(16px, 1.8vw, 24px);
          line-height: 1.18;
          font-weight: 420;
          letter-spacing: -0.025em;
          text-transform: uppercase;
        }

        .featTags {
          display: flex;
          flex-wrap: wrap;
          gap: 5px;
        }

        .featTags span {
          display: inline-flex;
          align-items: center;
          height: 20px;
          padding: 0 8px;
          border: 1px solid rgba(255,255,255,0.14);
          color: rgba(255,255,255,0.5);
          font-family: ui-monospace, 'Courier New', monospace;
          font-size: 8px;
          font-weight: 800;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          white-space: nowrap;
        }

        .featMetaRight {
          flex: none;
        }

        .featCta {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          height: 34px;
          padding: 0 18px;
          border: 1px solid rgba(255,255,255,0.22);
          color: rgba(255,255,255,0.82);
          font-family: ui-monospace, 'Courier New', monospace;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          opacity: 0;
          transform: translateY(4px);
          transition: opacity 260ms ease, transform 260ms ease, border-color 180ms ease;
        }

        .featCta em { font-style: normal; }

        .featCard:hover .featCta,
        .featCard:focus-visible .featCta {
          opacity: 1;
          transform: translateY(0);
          border-color: rgba(255,255,255,0.4);
        }

        /* ── Archive conveyor ─────────────────────────────────────── */
        .archiveConveyor {
          position: relative;
          left: 50%;
          transform: translateX(-50%);
          width: 100vw;
          display: flex;
          flex-direction: column;
          gap: 8px;
          pointer-events: none;
          flex: none;
          perspective: 2600px;
          perspective-origin: 50% 50%;
          -webkit-mask-image: linear-gradient(
            to right,
            transparent 0%,
            #000 6%,
            #000 94%,
            transparent 100%
          );
          mask-image: linear-gradient(
            to right,
            transparent 0%,
            #000 6%,
            #000 94%,
            transparent 100%
          );
        }

        /* ── Archive row ──────────────────────────────────────────── */
        .archiveRow {
          overflow: hidden;
          width: 100%;
          height: clamp(148px, 19vh, 190px);
          flex: none;
          transform-origin: center center;
        }

        .archiveRow[data-rowid='0'] { transform: rotateX(2.5deg); }

        /* ── Archive track ────────────────────────────────────────── */
        .archiveTrack {
          display: flex;
          gap: 10px;
          width: max-content;
          height: 100%;
          will-change: transform;
          padding: 3px 0;
        }

        .archiveRow[data-dir='rtl'] .archiveTrack {
          animation: marqueeRTL linear infinite;
        }

        .archiveRow[data-dir='ltr'] .archiveTrack {
          animation: marqueeLTR linear infinite;
        }

        /* Hovering a row pauses its animation */
        .archiveRow:hover .archiveTrack {
          animation-play-state: paused;
        }

        @keyframes marqueeRTL {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }

        @keyframes marqueeLTR {
          from { transform: translateX(-50%); }
          to   { transform: translateX(0); }
        }

        /* ── Archive card ─────────────────────────────────────────── */
        .archiveCard {
          position: relative;
          flex: none;
          display: flex;
          flex-direction: column;
          width: 218px;
          background:
            linear-gradient(180deg, rgba(255,255,255,0.012), rgba(255,255,255,0.002)),
            rgba(4,4,4,0.52);
          border: 1px solid rgba(255,255,255,0.09);
          color: rgba(255,255,255,0.75);
          text-decoration: none;
          pointer-events: auto;
          overflow: hidden;
          opacity: 0.72;
          box-shadow: 0 3px 14px rgba(0,0,0,0.4);
          transition:
            border-color 320ms ease,
            opacity 300ms ease,
            transform 380ms cubic-bezier(0.16, 1, 0.3, 1),
            box-shadow 320ms ease;
        }

        .archiveCard::before {
          content: '';
          position: absolute;
          top: 5px;
          left: 5px;
          width: 7px;
          height: 7px;
          border-top: 1px solid rgba(255,255,255,0.24);
          border-left: 1px solid rgba(255,255,255,0.24);
          pointer-events: none;
          z-index: 5;
          transition: border-color 250ms ease;
        }

        .archiveCard::after {
          content: '';
          position: absolute;
          bottom: 5px;
          right: 5px;
          width: 7px;
          height: 7px;
          border-bottom: 1px solid rgba(255,255,255,0.24);
          border-right: 1px solid rgba(255,255,255,0.24);
          pointer-events: none;
          z-index: 5;
          transition: border-color 250ms ease;
        }

        .archiveCard:hover,
        .archiveCard:focus-visible {
          border-color: rgba(255,255,255,0.32);
          opacity: 1;
          transform: translateY(-5px) scale(1.025);
          box-shadow:
            0 18px 52px rgba(0,0,0,0.68),
            0 0 28px rgba(255,255,255,0.025);
          z-index: 10;
          outline: none;
        }

        .archiveCard:hover::before,
        .archiveCard:focus-visible::before,
        .archiveCard:hover::after,
        .archiveCard:focus-visible::after {
          border-color: rgba(255,255,255,0.55);
        }

        .archiveCard:focus-visible {
          border-color: rgba(255,255,255,0.6);
        }

        /* ── Archive preview ──────────────────────────────────────── */
        .archivePreview {
          position: relative;
          flex: 1;
          min-height: 50px;
          border-bottom: 1px solid rgba(255,255,255,0.07);
          background: #060606;
          overflow: hidden;
          filter: grayscale(1) brightness(0.68) contrast(1.04);
          transition: filter 300ms ease;
        }

        .archivePreview::before {
          content: '';
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 1;
          background-image:
            linear-gradient(rgba(255,255,255,0.032) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.032) 1px, transparent 1px);
          background-size: 20px 20px;
        }

        .archivePreview::after {
          content: '';
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 1;
          background: repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(0,0,0,0.16) 2px,
            rgba(0,0,0,0.16) 3px
          );
        }

        .archiveCard:hover .archivePreview,
        .archiveCard:focus-visible .archivePreview {
          filter: grayscale(0.5) brightness(1.0) contrast(1.1);
          border-color: rgba(255,255,255,0.18);
        }

        /* ── Archive scanline (on hover) ──────────────────────────── */
        .archiveScanline {
          position: absolute;
          left: 0;
          right: 0;
          top: 0;
          height: 20%;
          pointer-events: none;
          opacity: 0;
          z-index: 3;
          background: linear-gradient(
            180deg,
            transparent,
            rgba(255,255,255,0.1) 50%,
            transparent
          );
        }

        .archiveCard:hover .archiveScanline,
        .archiveCard:focus-visible .archiveScanline {
          opacity: 1;
          animation: archiveScan 1.8s linear infinite;
        }

        @keyframes archiveScan {
          0%   { transform: translateY(-120%); }
          100% { transform: translateY(560%); }
        }

        /* ── Archive meta ─────────────────────────────────────────── */
        .archiveMeta {
          display: flex;
          flex-direction: column;
          gap: 4px;
          flex: none;
          padding: 8px 10px 22px;
          min-width: 0;
        }

        .archiveIndexRow {
          color: rgba(255,255,255,0.36);
          font-family: ui-monospace, 'Courier New', monospace;
          font-size: 8.5px;
          font-weight: 800;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .archiveIndexRow em {
          color: rgba(255,255,255,0.18);
          font-style: normal;
        }

        .archiveTitle {
          color: rgba(255,255,255,0.86);
          font-size: 12.5px;
          line-height: 1.24;
          font-weight: 420;
          letter-spacing: -0.01em;
          text-transform: uppercase;
          overflow: hidden;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }

        .archiveOpen {
          position: absolute;
          bottom: 7px;
          right: 9px;
          display: inline-flex;
          align-items: center;
          gap: 4px;
          color: rgba(255,255,255,0.82);
          font-family: ui-monospace, 'Courier New', monospace;
          font-size: 8px;
          font-weight: 800;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          opacity: 0;
          transform: translateY(3px);
          transition: opacity 240ms ease, transform 240ms ease;
        }

        .archiveOpen em { font-style: normal; }

        .archiveCard:hover .archiveOpen,
        .archiveCard:focus-visible .archiveOpen {
          opacity: 1;
          transform: translateY(0);
        }

        /* ── Bottom CTA ───────────────────────────────────────────── */
        .vaultCta {
          display: flex;
          justify-content: center;
          will-change: opacity, transform, filter;
        }

        .vaultCtaLink {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          height: 36px;
          padding: 0 22px;
          border: 1px solid rgba(255,255,255,0.26);
          color: rgba(255,255,255,0.82);
          background:
            linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0.006)),
            rgba(0,0,0,0.18);
          font-family: ui-monospace, 'Courier New', monospace;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          text-decoration: none;
          pointer-events: auto;
          transition:
            border-color 180ms ease,
            background 180ms ease,
            transform 180ms ease,
            color 180ms ease;
        }

        .vaultCtaLink em { font-style: normal; }

        .vaultCtaLink:hover,
        .vaultCtaLink:focus-visible {
          color: rgba(255,255,255,0.98);
          border-color: rgba(255,255,255,0.5);
          background: rgba(255,255,255,0.05);
          transform: translateY(-1px);
          outline: none;
        }

        /* ── Archive card mock primitives ─────────────────────────── */
        :global(.mock) {
          position: relative;
          z-index: 2;
          width: 100%;
          height: 100%;
          padding: 8px;
          display: flex;
          gap: 7px;
        }

        :global(.mockLine) {
          display: block;
          height: 5px;
          width: 100%;
          background: rgba(255,255,255,0.2);
        }

        :global(.mockLine.short) { width: 58%; }

        :global(.mockFintech) { flex-direction: column; }

        :global(.mockStatRow) { display: flex; gap: 5px; }

        :global(.mockStat) {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 4px;
          padding: 5px;
          border: 1px solid rgba(255,255,255,0.12);
        }
        :global(.mockStat i) {
          display: block;
          height: 3px;
          width: 55%;
          background: rgba(255,255,255,0.26);
        }
        :global(.mockStat b) {
          display: block;
          height: 7px;
          width: 78%;
          background: rgba(255,255,255,0.44);
        }

        :global(.mockChart) {
          position: relative;
          flex: 1;
          border: 1px solid rgba(255,255,255,0.12);
          overflow: hidden;
        }
        :global(.mockChart svg) {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
        }
        :global(.mockChart polyline) {
          fill: none;
          stroke: rgba(255,255,255,0.55);
          stroke-width: 1.4;
          vector-effect: non-scaling-stroke;
        }
        :global(.mockAxis) {
          stroke: rgba(255,255,255,0.18);
          stroke-width: 1;
          vector-effect: non-scaling-stroke;
        }

        :global(.mockBars) {
          position: absolute;
          left: 0; right: 0; bottom: 0;
          height: 42%;
          display: flex;
          align-items: flex-end;
          gap: 5px;
          padding: 0 7px;
          opacity: 0.5;
        }
        :global(.mockBars i) {
          display: block;
          flex: 1;
          background: rgba(255,255,255,0.22);
        }

        :global(.mockSidebar) {
          display: flex;
          flex-direction: column;
          gap: 5px;
          width: 20%;
          padding-right: 6px;
          border-right: 1px solid rgba(255,255,255,0.12);
        }
        :global(.mockSidebar span) {
          display: block;
          height: 5px;
          background: rgba(255,255,255,0.18);
        }

        :global(.mockGrid) {
          flex: 1;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          grid-auto-rows: 1fr;
          gap: 5px;
        }
        :global(.mockProduct) {
          display: flex;
          flex-direction: column;
          gap: 3px;
          padding: 3px;
          border: 1px solid rgba(255,255,255,0.1);
        }
        :global(.mockThumb) {
          display: block;
          flex: 1;
          min-height: 10px;
          background: rgba(255,255,255,0.12);
        }

        :global(.mockHealthcare) { align-items: stretch; }
        :global(.mockPhone) {
          position: relative;
          width: 32%;
          display: flex;
          flex-direction: column;
          gap: 5px;
          padding: 12px 7px 7px;
          border: 1px solid rgba(255,255,255,0.2);
          border-radius: 8px;
        }
        :global(.mockNotch) {
          position: absolute;
          top: 4px;
          left: 50%;
          width: 24%;
          height: 3px;
          transform: translateX(-50%);
          border-radius: 3px;
          background: rgba(255,255,255,0.22);
        }
        :global(.mockBlock) {
          display: block;
          height: 22px;
          background: rgba(255,255,255,0.1);
          border: 1px solid rgba(255,255,255,0.12);
        }
        :global(.mockStaff) {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 5px;
          padding-left: 4px;
        }
        :global(.mockTableHead) {
          display: block;
          height: 6px;
          width: 38%;
          background: rgba(255,255,255,0.3);
        }
        :global(.mockTableRow) { display: flex; align-items: center; gap: 5px; }
        :global(.mockDot) {
          display: block;
          width: 5px;
          height: 5px;
          flex: none;
          border-radius: 50%;
          border: 1px solid rgba(255,255,255,0.3);
        }

        :global(.mockOperations) { align-items: stretch; }
        :global(.mockMap) {
          position: relative;
          flex: 1.3;
          border: 1px solid rgba(255,255,255,0.12);
          overflow: hidden;
        }
        :global(.mockMap svg) {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
        }
        :global(.mockRoute) {
          fill: none;
          stroke: rgba(255,255,255,0.5);
          stroke-width: 1.4;
          stroke-dasharray: 4 4;
          vector-effect: non-scaling-stroke;
        }
        :global(.mockMap circle) {
          fill: #060606;
          stroke: rgba(255,255,255,0.6);
          stroke-width: 1.2;
          vector-effect: non-scaling-stroke;
        }
        :global(.mockQueue) {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 6px;
          padding-left: 4px;
        }
        :global(.mockTask) { display: flex; align-items: center; gap: 5px; }
        :global(.mockTick) {
          display: block;
          width: 7px;
          height: 7px;
          flex: none;
          border: 1px solid rgba(255,255,255,0.32);
        }

        :global(.mockDashboard) { flex-direction: column; }
        :global(.mockDashKpiRow) { display: flex; gap: 5px; }
        :global(.mockDashKpi) {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 3px;
          padding: 5px;
          border: 1px solid rgba(255,255,255,0.12);
        }
        :global(.mockDashKpi i) {
          display: block;
          height: 3px;
          width: 50%;
          background: rgba(255,255,255,0.24);
        }
        :global(.mockDashKpi b) {
          display: block;
          height: 9px;
          width: 75%;
          background: rgba(255,255,255,0.44);
        }
        :global(.mockDashBody) { flex: 1; display: flex; gap: 6px; }
        :global(.mockDashBars) {
          flex: 1;
          display: flex;
          align-items: flex-end;
          gap: 3px;
          border-bottom: 1px solid rgba(255,255,255,0.14);
          padding-bottom: 2px;
        }
        :global(.mockDashBars i) {
          display: block;
          flex: 1;
          background: rgba(255,255,255,0.22);
        }
        :global(.mockDashRows) {
          display: flex;
          flex-direction: column;
          justify-content: center;
          gap: 5px;
          width: 36%;
        }

        /* ── Featured preview fmock primitives ───────────────────── */
        :global(.fmock) {
          position: relative;
          z-index: 2;
          width: 100%;
          height: 100%;
          overflow: hidden;
        }

        /* Fintech featured */
        :global(.fmockFintech) { display: flex; }

        :global(.fmockSidebar) {
          width: 48px;
          flex: none;
          border-right: 1px solid rgba(255,255,255,0.07);
          display: flex;
          flex-direction: column;
          gap: 7px;
          padding: 12px 9px;
        }

        :global(.fmockSidebarLogo) {
          display: block;
          height: 16px;
          width: 22px;
          background: rgba(255,255,255,0.3);
          margin-bottom: 4px;
        }

        :global(.fmockNavSep) {
          display: block;
          height: 1px;
          background: rgba(255,255,255,0.07);
          margin: 2px 0;
        }

        :global(.fmockNavItem) {
          display: block;
          height: 5px;
          width: 100%;
          background: rgba(255,255,255,0.14);
        }

        :global(.fmockNavActive) {
          background: rgba(255,255,255,0.38);
        }

        :global(.fmockMain) {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 6px;
          padding: 9px 11px;
          min-width: 0;
        }

        :global(.fmockTopBar) {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-bottom: 7px;
          border-bottom: 1px solid rgba(255,255,255,0.06);
          flex: none;
        }

        :global(.fmockTopTitle) {
          display: block;
          height: 7px;
          width: 110px;
          background: rgba(255,255,255,0.32);
        }

        :global(.fmockTopActions) { display: flex; gap: 5px; }
        :global(.fmockTopActions span) {
          display: block;
          height: 18px;
          width: 46px;
          border: 1px solid rgba(255,255,255,0.14);
        }

        :global(.fmockKpiRow) {
          display: flex;
          gap: 6px;
          flex: none;
        }

        :global(.fmockKpi) {
          flex: 1;
          border: 1px solid rgba(255,255,255,0.1);
          padding: 7px 8px;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        :global(.fmockKpiLabel) {
          display: block;
          height: 4px;
          width: 55%;
          background: rgba(255,255,255,0.2);
        }

        :global(.fmockKpiVal) {
          display: block;
          height: 11px;
          width: 72%;
          background: rgba(255,255,255,0.48);
        }

        :global(.fmockKpiTrend) {
          display: block;
          height: 3px;
          width: 38%;
          background: rgba(255,255,255,0.18);
        }

        :global(.fmockChartPanel) {
          flex: 1;
          border: 1px solid rgba(255,255,255,0.1);
          overflow: hidden;
          display: flex;
          flex-direction: column;
          min-height: 0;
        }

        :global(.fmockChartHeader) {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 6px 8px;
          border-bottom: 1px solid rgba(255,255,255,0.07);
          flex: none;
        }

        :global(.fmockChartTitle) {
          display: block;
          height: 5px;
          width: 80px;
          background: rgba(255,255,255,0.26);
        }

        :global(.fmockChartLegend) { display: flex; gap: 7px; }
        :global(.fmockChartLegend i) {
          display: block;
          height: 4px;
          width: 28px;
          background: rgba(255,255,255,0.16);
        }

        :global(.fmockChartBody) {
          flex: 1;
          position: relative;
          overflow: hidden;
          min-height: 0;
        }

        :global(.fmockChartBody svg) {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 62%;
        }

        :global(.fmockBarCluster) {
          position: absolute;
          left: 0; right: 0; bottom: 0;
          height: 40%;
          display: flex;
          align-items: flex-end;
          gap: 3px;
          padding: 0 10px;
        }

        :global(.fmockBarB) {
          display: block;
          flex: 1;
          background: rgba(255,255,255,0.16);
        }

        :global(.fmockTablePanel) {
          flex: none;
          border: 1px solid rgba(255,255,255,0.1);
          overflow: hidden;
        }

        :global(.fmockTHead) {
          display: flex;
          gap: 8px;
          padding: 5px 8px;
          border-bottom: 1px solid rgba(255,255,255,0.07);
          background: rgba(255,255,255,0.022);
        }

        :global(.fmockTHead span) {
          display: block;
          height: 4px;
          flex: 1;
          background: rgba(255,255,255,0.22);
        }

        :global(.fmockTHead span:first-child) { flex: 2; }

        :global(.fmockTRow) {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 5px 8px;
          border-bottom: 1px solid rgba(255,255,255,0.04);
        }

        :global(.fmockDotG) {
          display: block;
          width: 5px;
          height: 5px;
          flex: none;
          border-radius: 50%;
          border: 1px solid rgba(255,255,255,0.38);
        }

        :global(.fmockCell) {
          display: block;
          height: 5px;
          background: rgba(255,255,255,0.16);
          flex: 1;
        }

        :global(.fmockCell.lg) { flex: 2; }
        :global(.fmockCell.md) { flex: 1.4; }
        :global(.fmockCell.sm) { flex: 0.7; }

        :global(.fmockPill) {
          display: block;
          height: 13px;
          width: 38px;
          flex: none;
          border: 1px solid rgba(255,255,255,0.18);
        }

        /* Commerce featured */
        :global(.fmockCommerce) { display: flex; flex-direction: column; }

        :global(.fmockStoreHeader) {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 8px 12px;
          border-bottom: 1px solid rgba(255,255,255,0.07);
          flex: none;
        }

        :global(.fmockStoreLogo) {
          display: block;
          height: 10px;
          width: 52px;
          background: rgba(255,255,255,0.36);
          flex: none;
        }

        :global(.fmockSearchBar) {
          flex: 1;
          height: 20px;
          border: 1px solid rgba(255,255,255,0.12);
          display: flex;
          align-items: center;
          gap: 5px;
          padding: 0 7px;
        }

        :global(.fmockSearchBar i) {
          display: block;
          width: 7px;
          height: 7px;
          border-radius: 50%;
          border: 1px solid rgba(255,255,255,0.25);
          flex: none;
        }

        :global(.fmockSearchBar span) {
          display: block;
          height: 4px;
          width: 70px;
          background: rgba(255,255,255,0.14);
        }

        :global(.fmockStoreNav) { display: flex; gap: 8px; flex: none; }
        :global(.fmockStoreNav span) {
          display: block;
          height: 5px;
          width: 34px;
          background: rgba(255,255,255,0.16);
        }

        :global(.fmockStoreBody) {
          flex: 1;
          display: flex;
          overflow: hidden;
          min-height: 0;
        }

        :global(.fmockFilterPanel) {
          width: 110px;
          flex: none;
          border-right: 1px solid rgba(255,255,255,0.07);
          padding: 9px 10px;
          display: flex;
          flex-direction: column;
          gap: 5px;
          overflow: hidden;
        }

        :global(.fmockFilterTitle) {
          display: block;
          height: 5px;
          width: 65%;
          background: rgba(255,255,255,0.3);
        }

        :global(.fmockFilterSep) {
          display: block;
          height: 1px;
          background: rgba(255,255,255,0.07);
          margin: 2px 0;
        }

        :global(.fmockFilterItem) {
          display: flex;
          align-items: center;
          gap: 5px;
        }

        :global(.fmockCheckbox) {
          display: block;
          width: 7px;
          height: 7px;
          flex: none;
          border: 1px solid rgba(255,255,255,0.22);
        }

        :global(.fmockFilterItem i:last-child) {
          display: block;
          height: 4px;
          flex: 1;
          background: rgba(255,255,255,0.16);
        }

        :global(.fmockProductArea) {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 6px;
          padding: 9px 10px;
          overflow: hidden;
          min-width: 0;
        }

        :global(.fmockProductSubHeader) {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex: none;
        }

        :global(.fmockProductSubHeader span) {
          display: block;
          height: 5px;
          width: 80px;
          background: rgba(255,255,255,0.24);
        }

        :global(.fmockSubShort) {
          display: block;
          height: 5px;
          width: 44px !important;
          background: rgba(255,255,255,0.14) !important;
        }

        :global(.fmockProductGrid) {
          flex: 1;
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          grid-template-rows: repeat(2, 1fr);
          gap: 6px;
          overflow: hidden;
        }

        :global(.fmockProductCard) {
          display: flex;
          flex-direction: column;
          gap: 3px;
          padding: 4px;
          border: 1px solid rgba(255,255,255,0.09);
          overflow: hidden;
        }

        :global(.fmockProductImg) {
          flex: 1;
          min-height: 14px;
          background: rgba(255,255,255,0.1);
        }

        :global(.fmockProductLine) {
          display: block;
          height: 4px;
          width: 100%;
          background: rgba(255,255,255,0.16);
        }

        :global(.fmockProductLine.short) { width: 60%; }

        :global(.fmockProductPrice) {
          display: block;
          height: 6px;
          width: 50%;
          background: rgba(255,255,255,0.28);
        }

        :global(.fmockPagination) {
          display: flex;
          justify-content: center;
          gap: 5px;
          flex: none;
        }

        :global(.fmockPageDot) {
          display: block;
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: rgba(255,255,255,0.16);
        }

        :global(.fmockPageActive) { background: rgba(255,255,255,0.5) !important; }

        /* Healthcare featured */
        :global(.fmockHealthcare) {
          display: flex;
          gap: 0;
        }

        :global(.fmockPhoneWrap) {
          width: 120px;
          flex: none;
          display: flex;
          align-items: center;
          justify-content: center;
          border-right: 1px solid rgba(255,255,255,0.07);
          padding: 10px;
        }

        :global(.fmockPhoneFrame) {
          position: relative;
          width: 70px;
          height: calc(100% - 4px);
          max-height: 230px;
          border: 1.5px solid rgba(255,255,255,0.22);
          border-radius: 10px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }

        :global(.fmockPhoneNotch) {
          position: absolute;
          top: 5px;
          left: 50%;
          transform: translateX(-50%);
          width: 24px;
          height: 3px;
          border-radius: 3px;
          background: rgba(255,255,255,0.24);
          z-index: 2;
        }

        :global(.fmockPhoneScreen) {
          flex: 1;
          padding: 14px 5px 5px;
          display: flex;
          flex-direction: column;
          gap: 5px;
          background: rgba(255,255,255,0.03);
        }

        :global(.fmockPhoneHeader) {
          display: block;
          height: 6px;
          width: 65%;
          background: rgba(255,255,255,0.32);
          flex: none;
        }

        :global(.fmockPhoneCard) {
          border: 1px solid rgba(255,255,255,0.14);
          padding: 5px;
          display: flex;
          flex-direction: column;
          gap: 3px;
          flex: none;
        }

        :global(.fmockPhoneCardLine) {
          display: block;
          height: 4px;
          width: 75%;
          background: rgba(255,255,255,0.2);
        }

        :global(.fmockPhoneCardVal) {
          display: block;
          height: 8px;
          width: 55%;
          background: rgba(255,255,255,0.4);
        }

        :global(.fmockPhoneMiniChart) {
          flex: none;
          height: 24px;
          overflow: hidden;
        }

        :global(.fmockPhoneMiniChart svg) {
          width: 100%;
          height: 100%;
        }

        :global(.fmockPhoneListItem) {
          display: flex;
          align-items: center;
          gap: 4px;
        }

        :global(.fmockPhoneDot) {
          display: block;
          width: 4px;
          height: 4px;
          flex: none;
          border-radius: 50%;
          border: 1px solid rgba(255,255,255,0.3);
        }

        :global(.fmockPhoneListItem span:nth-child(2)) {
          display: block;
          height: 4px;
          flex: 1;
          background: rgba(255,255,255,0.15);
        }

        :global(.fmockPhoneShort) {
          display: block !important;
          height: 4px !important;
          width: 28px !important;
          background: rgba(255,255,255,0.1) !important;
        }

        :global(.fmockPhoneTabBar) {
          display: flex;
          gap: 3px;
          margin-top: auto;
          border-top: 1px solid rgba(255,255,255,0.1);
          padding-top: 4px;
        }

        :global(.fmockPhoneTabBar span) {
          display: block;
          flex: 1;
          height: 5px;
          background: rgba(255,255,255,0.12);
        }

        :global(.fmockTabActive) { background: rgba(255,255,255,0.38) !important; }

        :global(.fmockStaffPanel) {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 6px;
          padding: 9px 11px;
          overflow: hidden;
          min-width: 0;
        }

        :global(.fmockStaffHeader) {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex: none;
          padding-bottom: 6px;
          border-bottom: 1px solid rgba(255,255,255,0.06);
        }

        :global(.fmockStaffTitle) {
          display: block;
          height: 6px;
          width: 100px;
          background: rgba(255,255,255,0.3);
        }

        :global(.fmockStaffActions) { display: flex; gap: 5px; }
        :global(.fmockStaffActions span) {
          display: block;
          width: 40px;
          height: 16px;
          border: 1px solid rgba(255,255,255,0.13);
        }

        :global(.fmockStaffStatRow) { display: flex; gap: 6px; flex: none; }

        :global(.fmockStatCard) {
          flex: 1;
          border: 1px solid rgba(255,255,255,0.1);
          padding: 6px 8px;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        :global(.fmockStatCard span) {
          display: block;
          height: 4px;
          width: 55%;
          background: rgba(255,255,255,0.2);
        }

        :global(.fmockStatCard b) {
          display: block;
          height: 10px;
          width: 70%;
          background: rgba(255,255,255,0.44);
        }

        :global(.fmockPatientTable) {
          flex: 1;
          border: 1px solid rgba(255,255,255,0.1);
          overflow: hidden;
        }

        :global(.fmockPTHead) {
          display: flex;
          gap: 7px;
          padding: 5px 8px;
          border-bottom: 1px solid rgba(255,255,255,0.07);
          background: rgba(255,255,255,0.02);
        }

        :global(.fmockPTHead span) {
          display: block;
          height: 4px;
          flex: 1;
          background: rgba(255,255,255,0.22);
        }

        :global(.fmockPTRow) {
          display: flex;
          align-items: center;
          gap: 7px;
          padding: 4px 8px;
          border-bottom: 1px solid rgba(255,255,255,0.04);
        }

        :global(.fmockPDot) {
          display: block;
          width: 5px;
          height: 5px;
          flex: none;
          border-radius: 50%;
          border: 1px solid rgba(255,255,255,0.32);
        }

        :global(.fmockPCell) {
          display: block;
          height: 4px;
          background: rgba(255,255,255,0.15);
          flex: 1;
        }

        :global(.fmockPCell.lg) { flex: 2; }
        :global(.fmockPCell.md) { flex: 1.3; }
        :global(.fmockPCell.sm) { flex: 0.6; }

        :global(.fmockStatus) {
          display: block;
          height: 12px;
          width: 32px;
          flex: none;
          border: 1px solid rgba(255,255,255,0.15);
        }

        :global(.fmockStatusActive) { border-color: rgba(255,255,255,0.35); }

        /* Operations featured */
        :global(.fmockOperations) { display: flex; }

        :global(.fmockMapPanel) {
          flex: 1.4;
          display: flex;
          flex-direction: column;
          border-right: 1px solid rgba(255,255,255,0.07);
          overflow: hidden;
        }

        :global(.fmockMapHeader) {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 7px 10px;
          border-bottom: 1px solid rgba(255,255,255,0.07);
          flex: none;
        }

        :global(.fmockMapHeader span:first-child) {
          display: block;
          height: 5px;
          width: 80px;
          background: rgba(255,255,255,0.28);
        }

        :global(.fmockMapShort) {
          display: block !important;
          height: 5px !important;
          width: 44px !important;
          background: rgba(255,255,255,0.16) !important;
        }

        :global(.fmockMapBody) {
          flex: 1;
          position: relative;
          overflow: hidden;
        }

        :global(.fmockMapBody svg) {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
        }

        :global(.fmockOpsRight) {
          width: 160px;
          flex: none;
          display: flex;
          flex-direction: column;
          gap: 0;
        }

        :global(.fmockAlertPanel) {
          border-bottom: 1px solid rgba(255,255,255,0.07);
          padding: 8px 10px;
          display: flex;
          flex-direction: column;
          gap: 5px;
          flex: none;
        }

        :global(.fmockAlertHeader) { margin-bottom: 2px; }
        :global(.fmockAlertHeader span) {
          display: block;
          height: 5px;
          width: 70px;
          background: rgba(255,255,255,0.28);
        }

        :global(.fmockAlertRow) { display: flex; align-items: center; gap: 6px; }

        :global(.fmockAlertDot) {
          display: block;
          width: 5px;
          height: 5px;
          flex: none;
          border-radius: 50%;
          border: 1px solid rgba(255,255,255,0.3);
        }

        :global(.fmockAlertWarn) {
          background: rgba(255,255,255,0.55);
          border-color: rgba(255,255,255,0.55);
        }

        :global(.fmockAlertLine) {
          display: block;
          height: 4px;
          flex: 1;
          background: rgba(255,255,255,0.15);
        }

        :global(.fmockQueuePanel) {
          flex: 1;
          padding: 8px 10px;
          display: flex;
          flex-direction: column;
          gap: 5px;
          overflow: hidden;
        }

        :global(.fmockQueueHeader) { margin-bottom: 2px; }
        :global(.fmockQueueHeader span) {
          display: block;
          height: 5px;
          width: 65px;
          background: rgba(255,255,255,0.28);
        }

        :global(.fmockQueueItem) { display: flex; align-items: center; gap: 6px; }

        :global(.fmockQTick) {
          display: block;
          width: 7px;
          height: 7px;
          flex: none;
          border: 1px solid rgba(255,255,255,0.28);
        }

        :global(.fmockQDone) { background: rgba(255,255,255,0.22); }

        :global(.fmockQLine) {
          display: block;
          flex: 1;
          height: 4px;
          background: rgba(255,255,255,0.14);
        }

        :global(.fmockQBadge) {
          display: block;
          width: 20px;
          height: 10px;
          flex: none;
          border: 1px solid rgba(255,255,255,0.15);
        }

        /* Dashboard featured */
        :global(.fmockDashboard) {
          display: flex;
          flex-direction: column;
        }

        :global(.fmockDashTopBar) {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 8px 12px;
          border-bottom: 1px solid rgba(255,255,255,0.07);
          flex: none;
        }

        :global(.fmockDashBarTitle) {
          display: block;
          height: 7px;
          width: 100px;
          background: rgba(255,255,255,0.3);
        }

        :global(.fmockDashControls) { display: flex; gap: 5px; }
        :global(.fmockDashControls span) {
          display: block;
          width: 44px;
          height: 18px;
          border: 1px solid rgba(255,255,255,0.13);
        }

        :global(.fmockDashKpiRow) {
          display: flex;
          gap: 6px;
          padding: 8px 12px;
          flex: none;
          border-bottom: 1px solid rgba(255,255,255,0.06);
        }

        :global(.fmockDashKpi) {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        :global(.fmockDashKpiLabel) {
          display: block;
          height: 4px;
          width: 55%;
          background: rgba(255,255,255,0.2);
        }

        :global(.fmockDashKpiNum) {
          display: block;
          height: 11px;
          width: 70%;
          background: rgba(255,255,255,0.46);
        }

        :global(.fmockDashKpiBar) {
          height: 3px;
          background: rgba(255,255,255,0.1);
          overflow: hidden;
        }

        :global(.fmockDashKpiBar span) {
          display: block;
          height: 100%;
          background: rgba(255,255,255,0.4);
        }

        :global(.fmockDashBody) {
          flex: 1;
          display: flex;
          gap: 0;
          overflow: hidden;
          min-height: 0;
        }

        :global(.fmockDashChartArea) {
          flex: 1;
          display: flex;
          flex-direction: column;
          border-right: 1px solid rgba(255,255,255,0.07);
          overflow: hidden;
          min-width: 0;
        }

        :global(.fmockDashChartTitle) {
          padding: 7px 12px;
          border-bottom: 1px solid rgba(255,255,255,0.06);
          flex: none;
        }

        :global(.fmockDashChartTitle span) {
          display: block;
          height: 5px;
          width: 90px;
          background: rgba(255,255,255,0.26);
        }

        :global(.fmockDashChartArea svg) {
          width: 100%;
          height: 70px;
          flex: none;
          display: block;
          padding: 6px 10px 0;
        }

        :global(.fmockDashMiniTable) {
          flex: 1;
          overflow: hidden;
          padding: 0 0 2px;
        }

        :global(.fmockDMHead) {
          display: flex;
          gap: 8px;
          padding: 5px 10px;
          border-bottom: 1px solid rgba(255,255,255,0.06);
          background: rgba(255,255,255,0.018);
        }

        :global(.fmockDMHead span) {
          display: block;
          height: 4px;
          flex: 1;
          background: rgba(255,255,255,0.2);
        }

        :global(.fmockDMRow) {
          display: flex;
          gap: 8px;
          padding: 5px 10px;
          border-bottom: 1px solid rgba(255,255,255,0.04);
          align-items: center;
        }

        :global(.fmockDMCell) {
          display: block;
          height: 4px;
          flex: 1;
          background: rgba(255,255,255,0.14);
        }

        :global(.fmockDMCell.lg) { flex: 2; }
        :global(.fmockDMCell.md) { flex: 1.3; }
        :global(.fmockDMCell.sm) { flex: 0.6; }

        :global(.fmockDashSidePanel) {
          width: 130px;
          flex: none;
          display: flex;
          flex-direction: column;
          gap: 6px;
          padding: 10px;
          overflow: hidden;
        }

        :global(.fmockDonut) {
          flex: none;
          display: flex;
          justify-content: center;
        }

        :global(.fmockDonut svg) { width: 60px; height: 60px; }

        :global(.fmockDonutLegend) {
          display: flex;
          flex-direction: column;
          gap: 4px;
          flex: none;
        }

        :global(.fmockLegendItem) {
          display: flex;
          align-items: center;
          gap: 5px;
        }

        :global(.fmockLegendDot) {
          display: block;
          width: 5px;
          height: 5px;
          flex: none;
          border-radius: 50%;
          border: 1px solid rgba(255,255,255,0.32);
        }

        :global(.fmockLegendItem span:last-child) {
          display: block;
          height: 4px;
          flex: 1;
          background: rgba(255,255,255,0.16);
        }

        :global(.fmockSideStats) {
          display: flex;
          flex-direction: column;
          gap: 5px;
          border-top: 1px solid rgba(255,255,255,0.07);
          padding-top: 6px;
        }

        :global(.fmockSideStat) {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 6px;
        }

        :global(.fmockSideStat span:first-child) {
          display: block;
          height: 4px;
          width: 48px;
          background: rgba(255,255,255,0.16);
        }

        :global(.fmockSideVal) {
          display: block !important;
          height: 6px !important;
          width: 28px !important;
          background: rgba(255,255,255,0.32) !important;
        }

        /* ══════════════════════════════════════════════════════════════
           ARCHIVE BOOT SEQUENCE
           - .vaultArmed       : JS alive + motion allowed → boot-children hide
           - .vaultArmed.isBooted : Section B reached → play the sequence once
           Reduced motion never sets .vaultArmed, so all of this stays inert
           and the section renders fully visible & static.
           ══════════════════════════════════════════════════════════════ */

        /* ── Section boot FX overlay (flicker / sweep / grain / glow) ── */
        .vaultBootFx {
          position: absolute;
          inset: 0;
          z-index: 40;
          pointer-events: none;
          overflow: hidden;
        }

        .vaultBootFx span {
          position: absolute;
          inset: 0;
          display: block;
          opacity: 0;
        }

        .vaultFlicker {
          background: #fff;
          mix-blend-mode: overlay;
        }

        .vaultGrainBurst {
          background: repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(255,255,255,0.05) 2px,
            rgba(255,255,255,0.05) 3px
          );
        }

        .vaultBootFx .vaultScanSweep {
          inset: 0 0 auto 0;
          height: 32%;
          background: linear-gradient(
            180deg,
            transparent,
            rgba(255,255,255,0.05) 50%,
            transparent
          );
        }

        .vaultGlow {
          box-shadow: inset 0 0 0 1px rgba(255,255,255,0);
        }

        .vault.vaultArmed.isBooted .vaultFlicker  { animation: vaultFlicker 0.42s steps(1, end) both; }
        .vault.vaultArmed.isBooted .vaultGrainBurst { animation: vaultGrain 0.45s ease-out both; }
        .vault.vaultArmed.isBooted .vaultScanSweep { animation: vaultSweep 0.95s ease-out both; }
        .vault.vaultArmed.isBooted .vaultGlow      { animation: vaultGlowPulse 0.85s ease-out both; }

        @keyframes vaultFlicker {
          0% { opacity: 0; } 8% { opacity: 0.06; } 12% { opacity: 0.01; }
          20% { opacity: 0.05; } 28% { opacity: 0; } 40% { opacity: 0.04; }
          52% { opacity: 0; } 100% { opacity: 0; }
        }
        @keyframes vaultGrain {
          0% { opacity: 0.45; } 100% { opacity: 0; }
        }
        @keyframes vaultSweep {
          0%   { opacity: 0; transform: translateY(-45%); }
          15%  { opacity: 1; }
          85%  { opacity: 1; }
          100% { opacity: 0; transform: translateY(360%); }
        }
        @keyframes vaultGlowPulse {
          0%   { box-shadow: inset 0 0 0 1px rgba(255,255,255,0), inset 0 0 0 0 rgba(255,255,255,0); }
          40%  { box-shadow: inset 0 0 0 1px rgba(255,255,255,0.10), inset 0 0 60px 0 rgba(255,255,255,0.05); }
          100% { box-shadow: inset 0 0 0 1px rgba(255,255,255,0), inset 0 0 0 0 rgba(255,255,255,0); }
        }

        /* ── Heading reveal ──────────────────────────────────────── */
        .vaultHeadingInner { display: inline-block; }

        .vault.vaultArmed:not(.isBooted) .vaultEyebrow { opacity: 0; }
        .vault.vaultArmed:not(.isBooted) .vaultHeadingInner { clip-path: inset(0 100% 0 0); }
        .vault.vaultArmed:not(.isBooted) .vaultSub { opacity: 0; }

        .vault.vaultArmed.isBooted .vaultEyebrow {
          animation: vaultEyebrowGlitch 0.45s steps(2, end) 0.05s 1 both;
        }
        .vault.vaultArmed.isBooted .vaultHeadingInner {
          animation: vaultWipe 0.6s cubic-bezier(0.7, 0, 0.2, 1) 0.12s both;
        }
        .vault.vaultArmed.isBooted .vaultSub {
          animation: vaultFadeIn 0.5s ease 0.32s both;
        }

        @keyframes vaultEyebrowGlitch {
          0%   { opacity: 0; transform: translateX(-2px); }
          30%  { opacity: 1; transform: translateX(1px); }
          60%  { transform: translateX(-1px); }
          100% { opacity: 1; transform: translateX(0); }
        }
        @keyframes vaultWipe {
          from { clip-path: inset(0 100% 0 0); }
          to   { clip-path: inset(0 0 0 0); }
        }
        @keyframes vaultFadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes vaultFadeUp {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* ── Featured card parallax (desktop idle pointer) ───────── */
        .featPreviewInner {
          position: absolute;
          inset: 0;
          transform: scale(1.03)
            translate3d(calc(var(--vpx, 0) * 2px), calc(var(--vpy, 0) * 2px), 0);
          transition: transform 220ms ease-out;
          will-change: transform;
        }
        .featReadout {
          transform: translate3d(calc(var(--vpx, 0) * -2px), calc(var(--vpy, 0) * -2px), 0);
          transition: transform 220ms ease-out;
        }

        /* ── Featured card assembly ──────────────────────────────── */
        .featBootBorder {
          position: absolute;
          inset: 0;
          z-index: 9;
          pointer-events: none;
          border: 1px solid rgba(255,255,255,0.45);
          opacity: 0;
          clip-path: inset(0 100% 100% 0);
        }
        .vault.vaultArmed.isBooted .featBootBorder {
          animation: featBorderDraw 0.7s cubic-bezier(0.7, 0, 0.2, 1) 0.15s both;
        }
        @keyframes featBorderDraw {
          0%   { opacity: 0; clip-path: inset(0 100% 100% 0); }
          12%  { opacity: 1; }
          70%  { opacity: 1; clip-path: inset(0 0 0 0); }
          100% { opacity: 0; clip-path: inset(0 0 0 0); }
        }

        .featBracketTL { transform-origin: top left; }
        .featBracketBR { transform-origin: bottom right; }
        .vault.vaultArmed:not(.isBooted) .featBracketTL,
        .vault.vaultArmed:not(.isBooted) .featBracketBR { opacity: 0; }
        /* 'backwards' (not 'both') so the resting transform reverts to base
           after the boot — keeps the hover bracket-lift below working. */
        .vault.vaultArmed.isBooted .featBracketTL {
          animation: featBracketIn 0.4s ease 0.55s backwards;
        }
        .vault.vaultArmed.isBooted .featBracketBR {
          animation: featBracketIn 0.4s ease 0.66s backwards;
        }
        @keyframes featBracketIn {
          from { opacity: 0; transform: scale(0.3); }
          to   { opacity: 1; transform: scale(1); }
        }

        /* ── Hover polish (restrained) ───────────────────────────── */
        .featBracketTL, .featBracketBR { transition: border-color 280ms ease, transform 240ms ease; }
        .featCard:hover .featBracketTL,
        .featCard:focus-visible .featBracketTL,
        .featCard:hover .featBracketBR,
        .featCard:focus-visible .featBracketBR { transform: scale(1.16); }

        .featCta em,
        .vaultCtaLink em,
        .archiveOpen em { transition: transform 200ms ease; }
        .featCard:hover .featCta em,
        .featCard:focus-visible .featCta em,
        .vaultCtaLink:hover em,
        .vaultCtaLink:focus-visible em { transform: translateX(3px); }
        .archiveCard:hover .archiveOpen em,
        .archiveCard:focus-visible .archiveOpen em { transform: translateX(2px); }

        .featBootScan {
          position: absolute;
          inset: 0 0 auto 0;
          height: 24%;
          z-index: 4;
          pointer-events: none;
          opacity: 0;
          background: linear-gradient(
            180deg,
            transparent,
            rgba(255,255,255,0.14) 50%,
            transparent
          );
        }
        .vault.vaultArmed.isBooted .featBootScan {
          animation: featBootScanMove 0.8s ease-out 0.35s both;
        }
        @keyframes featBootScanMove {
          0%   { opacity: 0; transform: translateY(-60%); }
          12%  { opacity: 1; }
          88%  { opacity: 1; }
          100% { opacity: 0; transform: translateY(420%); }
        }

        /* Wireframe / dashboard draws in (clip-path is independent of the
           parallax transform on the same element) */
        /* Clip hidden until boot JS adds .featPreviewReveal (initial boot + hover swap) */
        .vault.vaultArmed .featPreviewInner:not(.featPreviewReveal) { clip-path: inset(0 0 100% 0); }
        .featPreviewInner.featPreviewReveal {
          animation: featWireReveal 0.55s cubic-bezier(0.7, 0, 0.2, 1) both;
        }
        @keyframes featWireReveal {
          from { clip-path: inset(0 0 100% 0); }
          to   { clip-path: inset(0 0 0 0); }
        }

        .vault.vaultArmed:not(.isBooted) .featMeta { opacity: 0; }
        .vault.vaultArmed.isBooted .featMeta {
          animation: vaultFadeUp 0.5s ease 0.7s both;
        }

        .featTitleInner { display: inline-block; }
        .vault.vaultArmed:not(.isBooted) .featTitleInner { clip-path: inset(0 100% 0 0); }
        .vault.vaultArmed.isBooted .featTitleInner {
          animation: vaultWipe 0.55s cubic-bezier(0.7, 0, 0.2, 1) 0.9s both;
        }

        .vault.vaultArmed:not(.isBooted) .featReadout { opacity: 0; }
        .vault.vaultArmed.isBooted .featReadout {
          animation: vaultFadeIn 0.5s ease 0.85s both;
        }

        /* ── Lower archive cards (loading like search results) ───── */
        .vault.vaultArmed:not(.isBooted) .archiveConveyor { opacity: 0; }
        .vault.vaultArmed.isBooted .archiveConveyor {
          animation: vaultFadeIn 0.6s ease 0.55s both;
        }

        .vault.vaultArmed:not(.isBooted) .archiveCard { opacity: 0; }
        .vault.vaultArmed.isBooted .archiveCard {
          animation: archiveBoot 0.6s ease
            calc(0.65s + min(var(--ai, 0), 7) * 0.07s) backwards;
        }
        @keyframes archiveBoot {
          0%   { opacity: 0;    transform: translateY(14px); }
          22%  { opacity: 0.16; }
          38%  { opacity: 0.5;  }
          48%  { opacity: 0.12; }
          62%  { opacity: 0.72; }
          74%  { opacity: 0.32; }
          100% { opacity: 0.72; transform: translateY(0); }
        }

        .vault.vaultArmed:not(.isBooted) .archivePreview :global(.mock) {
          clip-path: inset(0 0 100% 0);
        }
        .vault.vaultArmed.isBooted .archivePreview :global(.mock) {
          animation: featWireReveal 0.5s ease
            calc(0.78s + min(var(--ai, 0), 7) * 0.07s) both;
        }

        /* ── Bottom CTA (after the cards) ────────────────────────── */
        .vault.vaultArmed:not(.isBooted) .vaultCtaLink { opacity: 0; }
        .vault.vaultArmed.isBooted .vaultCtaLink {
          animation: vaultFadeIn 0.5s ease 1.15s both;
        }

        /* ── Mobile ───────────────────────────────────────────────── */
        @media (max-width: 640px) {
          .vault {
            width: 100%;
          }

          .vaultInner {
            width: min(calc(100% - 32px), 1200px);
            gap: 12px;
          }

          .vaultHead { margin-bottom: 2px; }

          .vaultHeading {
            font-size: clamp(22px, 6.5vw, 32px);
            margin-top: 6px;
          }

          .vaultSub {
            font-size: 11px;
            margin-top: 8px;
          }

          .featWrap {
            perspective: none;
          }

          .featCard {
            width: 92vw;
          }

          .featPreview {
            min-height: clamp(160px, 38vw, 220px);
          }

          .featMeta {
            flex-direction: column;
            align-items: flex-start;
            gap: 8px;
          }

          .featTitle {
            font-size: clamp(14px, 4.5vw, 20px);
          }

          .featReadout { display: none; }

          /* Archive conveyor on mobile: full-bleed single row, no 3D */
          .archiveConveyor {
            position: static;
            transform: none;
            width: 100%;
            overflow: hidden;
            flex: none;
            perspective: none;
            -webkit-mask-image: none;
            mask-image: none;
          }

          .archiveRow {
            transform: none;
            height: clamp(140px, 36vw, 175px);
          }

          .archiveCard {
            width: min(72vw, 230px);
          }

          .archiveCard:hover,
          .archiveCard:focus-visible {
            transform: translateY(-3px) scale(1.015);
          }

          .vaultCtaLink {
            height: 38px;
            font-size: 10px;
            padding: 0 20px;
          }

          /* Boot: lighter + faster on mobile. Keep heading + card reveals
             and a minimal flicker; drop parallax, sweep and corner glow. */
          .featPreviewInner {
            transform: none;
            will-change: auto;
          }
          .featReadout { transform: none; }
          .vaultScanSweep,
          .vaultGlow,
          .featBootScan,
          .featBootBorder {
            display: none;
          }
          .featPreviewInner.featPreviewReveal {
            animation-duration: 0.5s;
            animation-delay: 0;
          }
          .vault.vaultArmed.isBooted .featMeta { animation-delay: 0.45s; }
          .vault.vaultArmed.isBooted .featTitleInner { animation-delay: 0.55s; }
          .vault.vaultArmed.isBooted .featReadout { animation-delay: 0.5s; }
          .vault.vaultArmed.isBooted .archiveConveyor { animation-delay: 0.35s; }
          .vault.vaultArmed.isBooted .archiveCard {
            animation-delay: calc(0.45s + min(var(--ai, 0), 6) * 0.06s);
          }
          .vault.vaultArmed.isBooted .featCard::after { animation: none; }
        }

        /* ── Reduced motion ───────────────────────────────────────── */
        @media (prefers-reduced-motion: reduce) {
          .featCard {
            animation: none;
          }

          .featScanline {
            animation: none;
            opacity: 0;
          }

          .archiveTrack {
            animation: none !important;
          }

          .archiveRow[data-dir='ltr'] .archiveTrack {
            transform: translateX(0) !important;
          }

          .archiveConveyor {
            position: static;
            transform: none;
            width: 100%;
            perspective: none;
            -webkit-mask-image: none;
            mask-image: none;
          }

          .archiveRow {
            transform: none;
            height: auto;
          }

          .archiveRow[data-rowid='0'] { overflow: visible; }

          .archiveRow[data-rowid='0'] .archiveTrack {
            flex-wrap: wrap;
            width: 100%;
            height: auto;
            gap: 10px;
          }

          .archiveRow[data-rowid='0'] .archiveTrack a[aria-hidden='true'] {
            display: none;
          }

          .archiveRow[data-rowid='0'] .archiveTrack a {
            width: calc((100% - 20px) / 3);
          }

          .archivePreview { flex: none; height: 120px; }
          .archiveMeta    { flex: 1; }

          .archiveCard:hover,
          .archiveCard:focus-visible {
            transform: none;
          }

          .archiveCard,
          .archivePreview,
          .archiveOpen,
          .vaultCtaLink,
          .featCard,
          .featPreview,
          .featCta,
          .featXray,
          .featBracketTL,
          .featBracketBR {
            transition: none;
          }

          .archiveScanline,
          .archiveCard:hover .archiveScanline,
          .archiveCard:focus-visible .archiveScanline {
            animation: none;
            opacity: 0;
          }

          /* Boot sequence fully neutralised — render static & visible. */
          .vaultBootFx { display: none; }
          .vaultHeadingInner,
          .featTitleInner,
          .featPreviewInner,
          .featPreviewInner.featPreviewReveal,
          .archivePreview :global(.mock) {
            clip-path: none !important;
            animation: none !important;
          }
          .featPreviewInner,
          .featReadout { transform: none; }
          .vaultEyebrow,
          .vaultSub,
          .featMeta,
          .featReadout,
          .featBracketTL,
          .featBracketBR,
          .archiveConveyor,
          .archiveCard,
          .vaultCtaLink {
            opacity: 1;
            animation: none;
          }
          .featCard::after { animation: none; content: none; }
        }

        @media (prefers-reduced-motion: reduce) and (max-width: 640px) {
          .archiveRow[data-rowid='0'] .archiveTrack a {
            width: calc((100% - 12px) / 2);
          }
        }
      `}</style>
    </div>
  );
}
