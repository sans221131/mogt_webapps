
'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js';
import SelectedWorkVault from './SelectedWorkVault';
import ProcessBlueprintSection from './ProcessBlueprintSection';
import TrustEngineSection from './TrustEngineSection';
import TestimonialsSection from './TestimonialsSection';
import ProjectIntakeSection from './ProjectIntakeSection';
import ServicesMegaMenu from './ServicesMegaMenu';
import WorkMegaMenu from './WorkMegaMenu';
import MobileNav from './MobileNav';
import { useProjectIntake } from './project-intake/ProjectIntakeProvider';

const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect;

type Industry =
  | 'fintech'
  | 'healthcare'
  | 'ecommerce'
  | 'edtech'
  | 'logistics'
  | 'realEstate'
  | 'automotive'
  | 'travel'
  | 'media'
  | 'saas';

type LayoutSettings = {
  orbitRadiusX: number;
  orbitRadiusY: number;
  coinScale: number;
  worldDiameter: number;
  coverage: number;
  opacityMin: number;
  opacityMax: number;
};

type PortalPanelStage = 'idle' | 'deep' | 'approach' | 'focus' | 'exit';

type PortalPanelEventDetail = {
  index: number;
  variant: string;
  label: string;
  stage: PortalPanelStage;
  focusProgress: number;
};

type CoinUserData = {
  baseAngle: number;
  index: number;
  industry: Industry;
  isFlipping: boolean;
  flipStartTime: number;
  flipStartY: number;
  flipEndY: number;
  targetScale: number;
  currentScale: number;
  token: THREE.Group;
  materials: THREE.Material[];
  lastOpacity: number;
  hoverFlipAngle: number;
  hoverFlipStartTime: number;
  hoverFlipActive: boolean;
  hoverRecoilAngle: number;
  hoverRecoilVelocity: number;
  hoverRecoilActive: boolean;
};

type CoinGroup = THREE.Group & {
  userData: CoinUserData;
};

const INDUSTRIES: Industry[] = [
  'fintech',
  'healthcare',
  'ecommerce',
  'edtech',
  'logistics',
  'realEstate',
  'automotive',
  'travel',
  'media',
  'saas',
];

const FLIP_DURATION_MS = 850;

const coinSvg = (body: string) => `
<svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <filter id="coinIconGlow" x="-35%" y="-35%" width="170%" height="170%">
      <feGaussianBlur stdDeviation="4" result="blur"/>
      <feMerge>
        <feMergeNode in="blur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>
  <g fill="none" stroke="#f5f5f5" stroke-width="22" stroke-linecap="round" stroke-linejoin="round" opacity="0.88" filter="url(#coinIconGlow)">
    ${body}
  </g>
</svg>`;

const COIN_SVG_BY_INDUSTRY: Record<Industry, string> = {
  fintech: coinSvg(`
    <path d="M162 318H350"/>
    <path d="M184 318L246 252L292 292L356 196"/>
    <path d="M318 196H356V234"/>
    <circle cx="246" cy="252" r="14" fill="#f5f5f5" stroke="none"/>
    <circle cx="292" cy="292" r="14" fill="#f5f5f5" stroke="none"/>
  `),
  healthcare: coinSvg(`
    <path d="M256 144V368"/>
    <path d="M144 256H368"/>
    <path d="M156 320C118 282 120 224 158 188C196 152 232 172 256 208C280 172 316 152 354 188C392 224 394 282 356 320L256 400L156 320Z"/>
  `),
  ecommerce: coinSvg(`
    <path d="M176 206H336L320 354H192L176 206Z"/>
    <path d="M210 206C210 154 302 154 302 206"/>
    <path d="M224 278H288"/>
  `),
  edtech: coinSvg(`
    <path d="M124 234L256 166L388 234L256 302L124 234Z"/>
    <path d="M184 268V328C214 368 298 368 328 328V268"/>
    <path d="M388 234V332"/>
    <circle cx="388" cy="358" r="10" fill="#f5f5f5" stroke="none"/>
  `),
  logistics: coinSvg(`
    <path d="M126 216H292V322H126V216Z"/>
    <path d="M292 254H354L390 292V322H292V254Z"/>
    <circle cx="184" cy="350" r="24"/>
    <circle cx="342" cy="350" r="24"/>
    <path d="M82 248H126"/>
    <path d="M62 288H126"/>
  `),
  realEstate: coinSvg(`
    <path d="M150 368V230L242 166V368"/>
    <path d="M242 220L362 282V368"/>
    <path d="M112 368H400"/>
    <path d="M188 262H212"/>
    <path d="M188 312H212"/>
    <path d="M294 308H326"/>
  `),
  automotive: coinSvg(`
    <path d="M142 296L174 226C184 206 204 198 230 198H286C312 198 332 206 342 226L374 296"/>
    <path d="M120 292H392V356H120V292Z"/>
    <path d="M184 248H328"/>
    <path d="M162 326H212"/>
    <path d="M300 326H350"/>
  `),
  travel: coinSvg(`
    <path d="M116 246L402 126L310 394L252 286L116 246Z"/>
    <path d="M252 286L402 126"/>
  `),
  media: coinSvg(`
    <path d="M150 180H362V324H150V180Z"/>
    <path d="M236 222L310 252L236 282V222Z"/>
    <path d="M204 370H308"/>
    <path d="M226 324L204 370"/>
    <path d="M286 324L308 370"/>
  `),
  saas: coinSvg(`
    <path d="M188 314H158C126 314 104 292 104 262C104 230 130 204 166 204C188 142 332 134 356 224C392 232 410 254 410 284C410 306 394 314 364 314H330"/>
    <path d="M206 258H306V374H206V258Z"/>
    <path d="M232 304H280"/>
    <path d="M232 342H280"/>
  `),
};

const OVERLAY_PANELS: Array<{ label: string; title: string; text: string; variant?: string }> = [
  {
    label: 'A',
    title: 'Interface Systems Index',
    text: 'Digital products for high-trust, data-heavy, operational industries.',
    variant: 'systemsIndex',
  },
  { label: 'B', title: 'Selected Work', text: 'Curated project archive.', variant: 'selectedWork' },
  { label: 'C', title: 'System Assembly', text: 'Blueprint process sequence.', variant: 'process' },
  { label: 'D', title: 'Trust Engine', text: 'Why teams choose us.', variant: 'trustEngine' },
  { label: 'E', title: 'Client Proof', text: 'Verified build reports.', variant: 'testimonials' },
  { label: 'F', title: 'Project Intake', text: 'Start a project.', variant: 'projectIntake' },
];

type IndustryInsight = {
  id: string;
  index: string;
  label: string;
  title: string;
  summary: string;
  services: string[];
  interfaceTypes: string[];
  metrics: Array<{ label: string; value: string; bar: number }>;
  signal: string;
};

const SYSTEM_INDUSTRIES: IndustryInsight[] = [
  {
    id: 'fintech',
    index: '01',
    label: 'Financial Systems',
    title: 'Fintech Interface Systems',
    summary: 'Interfaces for capital movement, risk visibility, trading workflows, subscriptions, and trust-heavy financial decisions.',
    services: ['Neo banking UX', 'Trading dashboards', 'Investment workflows', 'KYC onboarding'],
    interfaceTypes: ['Mobile banking', 'Broker dashboards', 'Portfolio views'],
    metrics: [
      { label: 'Trust-critical flows', value: 'High', bar: 92 },
      { label: 'Data density', value: 'Very High', bar: 88 },
      { label: 'Decision speed', value: 'Fast', bar: 82 },
    ],
    signal: 'Designed for clarity under risk, regulation, and fast user decisions.',
  },
  {
    id: 'healthcare',
    index: '02',
    label: 'Health Infrastructure',
    title: 'Healthcare Interface Systems',
    summary: 'Patient, provider, and operations interfaces where accessibility, clarity, and low-friction task completion matter.',
    services: ['Patient portals', 'Appointment flows', 'Clinical dashboards', 'Care admin tools'],
    interfaceTypes: ['Patient apps', 'Staff dashboards', 'Booking systems'],
    metrics: [
      { label: 'Accessibility need', value: 'Critical', bar: 95 },
      { label: 'Task sensitivity', value: 'High', bar: 86 },
      { label: 'Admin complexity', value: 'High', bar: 80 },
    ],
    signal: 'Designed for trust, comprehension, accessibility, and reduced operational friction.',
  },
  {
    id: 'ecommerce',
    index: '03',
    label: 'Commerce Platforms',
    title: 'Commerce Interface Systems',
    summary: 'Conversion-focused product experiences with clean discovery, checkout, account, and seller-side operations.',
    services: ['Product discovery', 'Checkout UX', 'Seller dashboards', 'Retention flows'],
    interfaceTypes: ['Storefronts', 'Checkout systems', 'Merchant tools'],
    metrics: [
      { label: 'Conversion pressure', value: 'High', bar: 90 },
      { label: 'Journey complexity', value: 'Medium', bar: 72 },
      { label: 'Optimization potential', value: 'High', bar: 87 },
    ],
    signal: 'Designed for speed, confidence, and fewer dead ends across the buying journey.',
  },
  {
    id: 'edtech',
    index: '04',
    label: 'Learning Systems',
    title: 'EdTech Interface Systems',
    summary: 'Learning platforms, dashboards, and course experiences that make progress, content, and outcomes easier to understand.',
    services: ['Learning apps', 'Course dashboards', 'Student portals', 'Assessment flows'],
    interfaceTypes: ['LMS interfaces', 'Progress dashboards', 'Content platforms'],
    metrics: [
      { label: 'Engagement need', value: 'High', bar: 84 },
      { label: 'Progress visibility', value: 'Critical', bar: 91 },
      { label: 'Content structure', value: 'High', bar: 79 },
    ],
    signal: 'Designed to make learning paths clear, measurable, and less exhausting.',
  },
  {
    id: 'logistics',
    index: '05',
    label: 'Logistics Ops',
    title: 'Logistics Interface Systems',
    summary: 'Operational dashboards and tracking interfaces for fleets, routing, delivery visibility, and real-time coordination.',
    services: ['Fleet dashboards', 'Tracking systems', 'Ops panels', 'Route planning UX'],
    interfaceTypes: ['Control rooms', 'Driver apps', 'Shipment dashboards'],
    metrics: [
      { label: 'Real-time pressure', value: 'Very High', bar: 93 },
      { label: 'Operational density', value: 'High', bar: 88 },
      { label: 'Error cost', value: 'High', bar: 85 },
    ],
    signal: 'Designed for live decisions, fewer blind spots, and operational control.',
  },
  {
    id: 'realEstate',
    index: '06',
    label: 'Property Platforms',
    title: 'Real Estate Interface Systems',
    summary: 'Property search, broker tools, listing workflows, lead systems, and dashboards for high-intent property decisions.',
    services: ['Listing UX', 'Broker dashboards', 'Lead flows', 'Property comparison'],
    interfaceTypes: ['Marketplace UX', 'CRM dashboards', 'Listing platforms'],
    metrics: [
      { label: 'Search complexity', value: 'High', bar: 82 },
      { label: 'Lead quality need', value: 'High', bar: 86 },
      { label: 'Trust requirement', value: 'High', bar: 78 },
    ],
    signal: 'Designed for considered decisions, comparison, trust, and lead conversion.',
  },
  {
    id: 'automotive',
    index: '07',
    label: 'Mobility Interfaces',
    title: 'Automotive Interface Systems',
    summary: 'Booking, dealership, vehicle management, and mobility service interfaces across web and mobile products.',
    services: ['Booking flows', 'Dealer dashboards', 'Vehicle apps', 'Service UX'],
    interfaceTypes: ['Mobility apps', 'Dealer systems', 'Service platforms'],
    metrics: [
      { label: 'Process complexity', value: 'High', bar: 81 },
      { label: 'Mobile usage', value: 'High', bar: 84 },
      { label: 'Service dependency', value: 'Medium', bar: 70 },
    ],
    signal: 'Designed for smooth ownership, booking, and service journeys.',
  },
  {
    id: 'travel',
    index: '08',
    label: 'Travel Infrastructure',
    title: 'Travel Interface Systems',
    summary: 'Booking, itinerary, vendor, and operations interfaces where timing, trust, and clarity shape the full journey.',
    services: ['Booking systems', 'Itinerary UX', 'Vendor dashboards', 'Search flows'],
    interfaceTypes: ['Travel apps', 'Booking engines', 'Partner portals'],
    metrics: [
      { label: 'Decision anxiety', value: 'High', bar: 80 },
      { label: 'Search depth', value: 'High', bar: 87 },
      { label: 'Timing sensitivity', value: 'High', bar: 83 },
    ],
    signal: 'Designed for confident planning, clean comparison, and fewer booking doubts.',
  },
  {
    id: 'media',
    index: '09',
    label: 'Content Systems',
    title: 'Media Interface Systems',
    summary: 'Creator tools, publishing systems, asset workflows, editorial dashboards, and monetization-focused content platforms.',
    services: ['Creator tools', 'Publishing workflows', 'Asset dashboards', 'Content ops UX'],
    interfaceTypes: ['CMS interfaces', 'Media libraries', 'Creator dashboards'],
    metrics: [
      { label: 'Workflow volume', value: 'High', bar: 86 },
      { label: 'Asset complexity', value: 'High', bar: 88 },
      { label: 'Publishing speed', value: 'Fast', bar: 79 },
    ],
    signal: 'Designed for content velocity, asset clarity, and editorial control.',
  },
  {
    id: 'saas',
    index: '10',
    label: 'Software Platforms',
    title: 'SaaS Interface Systems',
    summary: 'Product dashboards, onboarding flows, admin systems, design systems, and complex web app interfaces.',
    services: ['SaaS dashboards', 'Onboarding flows', 'Admin panels', 'Design systems'],
    interfaceTypes: ['Web apps', 'Admin consoles', 'Analytics dashboards'],
    metrics: [
      { label: 'Feature complexity', value: 'Very High', bar: 90 },
      { label: 'Onboarding impact', value: 'High', bar: 84 },
      { label: 'System scalability', value: 'Critical', bar: 92 },
    ],
    signal: 'Designed for clarity, adoption, scalability, and long-term product growth.',
  },
];

const SYSTEM_CAPABILITIES = [
  'Product Strategy',
  'UX / UI Design',
  'Web App Engineering',
  'Data Dashboards',
  'Design Systems',
];

// Public contact endpoint — placeholder, swap for the real inbox when ready.
const CONTACT_EMAIL = 'hello@mogt.studio';
const CONTACT_HREF = `mailto:${CONTACT_EMAIL}?subject=Project%20Inquiry%20%E2%80%94%20MOGT`;

export default function CoinOrbitHero() {
  const { openIntake } = useProjectIntake();
  const canvasContainerRef = useRef<HTMLDivElement | null>(null);
  const sectionRef = useRef<HTMLElement | null>(null);
  const heroContentRef = useRef<HTMLDivElement | null>(null);
  const brandMarkRef = useRef<HTMLDivElement | null>(null);
  const headingRef = useRef<HTMLHeadingElement | null>(null);
  const subtitleRef = useRef<HTMLParagraphElement | null>(null);
  const heroEyebrowRef = useRef<HTMLSpanElement | null>(null);
  const heroTrustlineRef = useRef<HTMLParagraphElement | null>(null);
  const ctaRef = useRef<HTMLDivElement | null>(null);
  const specializationRef = useRef<HTMLDivElement | null>(null);
  const specializationInnerRef = useRef<HTMLDivElement | null>(null);
  const specializationKickerRef = useRef<HTMLDivElement | null>(null);
  const specializationHeadingRef = useRef<HTMLHeadingElement | null>(null);
  const specializationTextRef = useRef<HTMLParagraphElement | null>(null);
  const specializationActionsRef = useRef<HTMLDivElement | null>(null);
  const specializationHeadingLineRefs = useRef<HTMLSpanElement[]>([]);
  const overlayPanelRefs = useRef<HTMLDivElement[]>([]);
  const sideProgressFillRef = useRef<HTMLSpanElement | null>(null);
  const sideProgressTickRefs = useRef<HTMLSpanElement[]>([]);
  const systemsIntroRef = useRef<HTMLDivElement | null>(null);
  const systemsIndustryMatrixRef = useRef<HTMLDivElement | null>(null);
  const systemsCapabilitiesRef = useRef<HTMLDivElement | null>(null);
  const systemsIndexLogoRef = useRef<HTMLDivElement | null>(null);
  const systemsInsightPanelRef = useRef<HTMLDivElement | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeIndustryId, setActiveIndustryId] = useState<string | null>(null);
  const [isIndustryOverlayOpen, setIsIndustryOverlayOpen] = useState(false);
  const activeIndustry = SYSTEM_INDUSTRIES.find((industry) => industry.id === activeIndustryId) ?? null;

  const openIndustryOverlay = (industryId: string) => {
    setActiveIndustryId(industryId);
    setIsIndustryOverlayOpen(true);
  };

  const closeIndustryOverlay = () => {
    setIsIndustryOverlayOpen(false);
  };

  const setSpecializationHeadingLineRef = (element: HTMLSpanElement | null, index: number) => {
    if (element) specializationHeadingLineRefs.current[index] = element;
  };

  const setOverlayPanelRef = (element: HTMLDivElement | null, index: number) => {
    if (element) overlayPanelRefs.current[index] = element;
  };

  const setSideProgressTickRef = (element: HTMLSpanElement | null, index: number) => {
    if (element) sideProgressTickRefs.current[index] = element;
  };

  const progressStages = [
    { key: 'hero', label: 'Hero' },
    { key: 'specialization', label: 'Specialization' },
    ...OVERLAY_PANELS.map((panel) => ({ key: panel.label, label: panel.title })),
  ];

  useIsomorphicLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }

    const container = canvasContainerRef.current;
    if (!container) return;

    let scene: THREE.Scene;
    let camera: THREE.PerspectiveCamera;
    let renderer: THREE.WebGLRenderer;
    let animationFrameId = 0;
    let resizeObserver: ResizeObserver | null = null;
    let loadingTimer: ReturnType<typeof setTimeout> | null = null;
    let glowSprite: THREE.Sprite | null = null;
    let baseCameraDistance = 0;
    let orbitTime = 0;
    let lastFrameTime = 0;
    let scrollTimeline: gsap.core.Timeline | null = null;
    let gsapCtx: gsap.Context | null = null;
    let systemsLogoModel: THREE.Group | null = null;
    let systemsLogoModelOpacity = 0;
    let systemsLogoModelVisible = false;
    let systemsLogoMaterials: THREE.Material[] = [];

    const scrollStateTarget = {
      progress: 0,
      radiusBoost: 1,
      coinScaleBoost: 1,
      cameraPush: 1,
      orbitSpeedBoost: 1,
      depthSpread: 0,
      forwardPush: 0,
      faceForward: 0,
      exitSpread: 0,
      coinFade: 0,
    };

    const scrollState = { ...scrollStateTarget };

    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    const coins: CoinGroup[] = [];
    let hoveredCoin: CoinGroup | null = null;

    const orbitSpeed = 0.000058;
    const coinRadius = 0.46;
    const coinThickness = 0.010;

    // Base 3D viewing angle of every token.
    // coinSideTilt shows the edge. coinPitchTilt gives the general face lean.
    const coinSideTilt = 0.60;
    const coinPitchTilt = -0.50;

    // Motion-flap controls.
    // This makes the FRONT / leading face dip downward as the token travels,
    // instead of keeping every token locked at one stiff angle.
    const frontFaceDropStrength = 0.58;
    const frontFaceSideFollow = 0.18;
    const frontFaceRollFollow = 0.1;
    const frontFaceDropDirection = 1;

    const isMobileLayout = () => window.matchMedia('(max-width: 640px)').matches;

    const getLayoutSettings = (): LayoutSettings => {
      if (isMobileLayout()) {
        return {
          orbitRadiusX: 4,
          orbitRadiusY: 4,
          coinScale: 2,
          worldDiameter: 5.55,
          coverage: 0.78,
          opacityMin: 0.42,
          opacityMax: 0.92,
        };
      }

      return {
        orbitRadiusX: 1.72,
        orbitRadiusY: 1.78,
        coinScale: .8,
        worldDiameter: 7.55,
        coverage: 0.84,
        opacityMin: 0.38,
        opacityMax: 0.92,
      };
    };

    const updateCameraPosition = () => {
      const layout = getLayoutSettings();
      const fovRad = (camera.fov * Math.PI) / 180;
      const aspect = camera.aspect;

      let distance: number;
      if (aspect >= 1) {
        distance = layout.worldDiameter / (layout.coverage * 2 * Math.tan(fovRad / 2));
      } else {
        const hFov = 2 * Math.atan(Math.tan(fovRad / 2) * aspect);
        distance = layout.worldDiameter / (layout.coverage * 2 * Math.tan(hFov / 2));
      }

      baseCameraDistance = distance * 1.05;
      camera.position.set(0, 0, baseCameraDistance);
      camera.lookAt(0, 0, 0);
    };

    const createRadialTexture = (colorStops: Array<[number, string]>) => {
      const size = 512;
      const canvas = document.createElement('canvas');
      canvas.width = size;
      canvas.height = size;

      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Canvas 2D context is unavailable.');

      const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
      colorStops.forEach(([stop, color]) => gradient.addColorStop(stop, color));
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, size, size);

      return new THREE.CanvasTexture(canvas);
    };

    const createBackgroundGlow = () => {
      const glowTexture = createRadialTexture([
        [0, 'rgba(255,255,255,0.18)'],
        [0.34, 'rgba(255,255,255,0.075)'],
        [0.72, 'rgba(255,255,255,0.025)'],
        [1, 'rgba(255,255,255,0)'],
      ]);

      const glow = new THREE.Sprite(
        new THREE.SpriteMaterial({
          map: glowTexture,
          transparent: true,
          opacity: 0.2,
          depthWrite: false,
          blending: THREE.AdditiveBlending,
        }),
      );

      glow.position.set(0, 0, -0.4);
      glow.scale.set(7.6, 7.6, 1);
      glowSprite = glow;
      scene.add(glow);
    };

    const drawRingTexture = (ctx: CanvasRenderingContext2D, size: number) => {
      ctx.strokeStyle = 'rgba(255,255,255,0.38)';
      ctx.lineWidth = size * 0.0065;
      ctx.beginPath();
      ctx.arc(0, 0, size * 0.425, 0, Math.PI * 2);
      ctx.stroke();

      ctx.strokeStyle = 'rgba(255,255,255,0.16)';
      ctx.lineWidth = size * 0.0035;
      ctx.beginPath();
      ctx.arc(0, 0, size * 0.305, 0, Math.PI * 2);
      ctx.stroke();

      ctx.strokeStyle = 'rgba(255,255,255,0.24)';
      ctx.lineWidth = size * 0.004;
      ctx.beginPath();
      ctx.arc(0, 0, size * 0.455, Math.PI * 0.08, Math.PI * 0.78);
      ctx.stroke();
    };

    const setupIconStroke = (ctx: CanvasRenderingContext2D, size: number) => {
      ctx.strokeStyle = 'rgba(245,245,245,0.88)';
      ctx.fillStyle = 'rgba(245,245,245,0.88)';
      ctx.lineWidth = size * 0.024;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
    };

    const drawIcon = (ctx: CanvasRenderingContext2D, type: Industry, size: number) => {
      setupIconStroke(ctx, size);
      const s = size / 512;
      ctx.scale(s, s);

      const line = (...points: Array<[number, number]>) => {
        ctx.beginPath();
        ctx.moveTo(points[0][0], points[0][1]);
        for (let i = 1; i < points.length; i += 1) ctx.lineTo(points[i][0], points[i][1]);
        ctx.stroke();
      };

      const circle = (x: number, y: number, r: number, fill = false) => {
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        fill ? ctx.fill() : ctx.stroke();
      };

      const rect = (x: number, y: number, w: number, h: number, r = 18) => {
        ctx.beginPath();
        ctx.moveTo(x + r, y);
        ctx.lineTo(x + w - r, y);
        ctx.quadraticCurveTo(x + w, y, x + w, y + r);
        ctx.lineTo(x + w, y + h - r);
        ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
        ctx.lineTo(x + r, y + h);
        ctx.quadraticCurveTo(x, y + h, x, y + h - r);
        ctx.lineTo(x, y + r);
        ctx.quadraticCurveTo(x, y, x + r, y);
        ctx.stroke();
      };

      switch (type) {
        case 'fintech':
          line([150, 300], [218, 238], [266, 282], [368, 176]);
          line([326, 176], [368, 176], [368, 218]);
          line([148, 344], [376, 344]);
          circle(218, 238, 13, true);
          circle(266, 282, 13, true);
          break;

        case 'healthcare':
          line([256, 144], [256, 368]);
          line([144, 256], [368, 256]);
          ctx.beginPath();
          ctx.moveTo(186, 326);
          ctx.bezierCurveTo(142, 286, 140, 232, 174, 196);
          ctx.bezierCurveTo(206, 164, 240, 178, 256, 206);
          ctx.bezierCurveTo(272, 178, 306, 164, 338, 196);
          ctx.bezierCurveTo(372, 232, 370, 286, 326, 326);
          ctx.lineTo(256, 390);
          ctx.closePath();
          ctx.stroke();
          break;

        case 'ecommerce':
          rect(168, 188, 176, 150, 18);
          ctx.beginPath();
          ctx.moveTo(206, 188);
          ctx.bezierCurveTo(206, 142, 306, 142, 306, 188);
          ctx.stroke();
          line([222, 260], [290, 260]);
          break;

        case 'edtech':
          line([128, 234], [256, 166], [384, 234], [256, 302], [128, 234]);
          line([184, 270], [184, 328]);
          ctx.beginPath();
          ctx.moveTo(184, 328);
          ctx.bezierCurveTo(210, 374, 302, 374, 328, 328);
          ctx.lineTo(328, 270);
          ctx.stroke();
          line([384, 234], [384, 330]);
          circle(384, 358, 12, true);
          break;

        case 'logistics':
          rect(142, 202, 162, 118, 8);
          ctx.beginPath();
          ctx.moveTo(304, 244);
          ctx.lineTo(354, 244);
          ctx.lineTo(386, 284);
          ctx.lineTo(386, 320);
          ctx.lineTo(304, 320);
          ctx.closePath();
          ctx.stroke();
          circle(196, 350, 24);
          circle(342, 350, 24);
          line([100, 238], [142, 238]);
          line([82, 282], [142, 282]);
          break;

        case 'realEstate':
          line([156, 360], [156, 232], [242, 174], [242, 360]);
          line([242, 220], [362, 278], [362, 360]);
          line([114, 360], [398, 360]);
          line([190, 260], [210, 260]);
          line([190, 310], [210, 310]);
          line([292, 304], [324, 304]);
          break;

        case 'automotive':
          ctx.beginPath();
          ctx.moveTo(142, 296);
          ctx.lineTo(174, 228);
          ctx.quadraticCurveTo(184, 204, 216, 204);
          ctx.lineTo(296, 204);
          ctx.quadraticCurveTo(328, 204, 338, 228);
          ctx.lineTo(370, 296);
          ctx.stroke();
          rect(124, 288, 264, 72, 18);
          line([184, 250], [328, 250]);
          line([166, 326], [214, 326]);
          line([298, 326], [346, 326]);
          break;

        case 'travel':
          ctx.beginPath();
          ctx.moveTo(256, 388);
          ctx.bezierCurveTo(256, 388, 350, 302, 350, 232);
          ctx.bezierCurveTo(350, 178, 308, 140, 256, 140);
          ctx.bezierCurveTo(204, 140, 162, 178, 162, 232);
          ctx.bezierCurveTo(162, 302, 256, 388, 256, 388);
          ctx.stroke();
          circle(256, 232, 33);
          line([342, 158], [382, 118]);
          line([366, 158], [404, 158]);
          line([342, 134], [342, 96]);
          break;

        case 'media':
          rect(150, 172, 212, 152, 28);
          ctx.beginPath();
          ctx.moveTo(238, 220);
          ctx.lineTo(310, 248);
          ctx.lineTo(238, 276);
          ctx.closePath();
          ctx.stroke();
          line([206, 368], [306, 368]);
          line([224, 324], [206, 368]);
          line([288, 324], [306, 368]);
          break;

        case 'saas':
          ctx.beginPath();
          ctx.moveTo(190, 314);
          ctx.lineTo(162, 314);
          ctx.bezierCurveTo(126, 314, 106, 292, 106, 260);
          ctx.bezierCurveTo(106, 228, 130, 204, 166, 204);
          ctx.bezierCurveTo(184, 146, 332, 132, 356, 224);
          ctx.bezierCurveTo(392, 230, 410, 254, 410, 284);
          ctx.bezierCurveTo(410, 304, 394, 314, 366, 314);
          ctx.lineTo(330, 314);
          ctx.stroke();
          rect(206, 258, 100, 116, 8);
          line([232, 304], [280, 304]);
          line([232, 342], [280, 342]);
          break;
      }

      ctx.setTransform(1, 0, 0, 1, 0, 0);
    };

    const drawSvgIconOnTexture = (
      ctx: CanvasRenderingContext2D,
      texture: THREE.CanvasTexture,
      industry: Industry,
      size: number,
      isBack: boolean,
    ) => {
      const image = new Image();
      const svg = COIN_SVG_BY_INDUSTRY[industry];
      const iconSize = size * (isBack ? 0.39 : 0.43);
      const iconX = (size - iconSize) / 2;
      const iconY = (size - iconSize) / 2;

      image.onload = () => {
        ctx.save();
        ctx.globalAlpha = isBack ? 0.28 : 0.38;
        ctx.filter = 'blur(9px)';
        ctx.drawImage(image, iconX, iconY, iconSize, iconSize);
        ctx.restore();

        ctx.save();
        ctx.globalAlpha = isBack ? 0.70 : 0.92;
        ctx.shadowColor = 'rgba(255,255,255,0.24)';
        ctx.shadowBlur = size * 0.018;
        ctx.drawImage(image, iconX, iconY, iconSize, iconSize);
        ctx.restore();

        texture.needsUpdate = true;
      };

      image.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
    };

    const createFaceTexture = (industry: Industry, isBack: boolean) => {
      const size = 512;
      const canvas = document.createElement('canvas');
      canvas.width = size;
      canvas.height = size;

      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Canvas 2D context is unavailable.');

      const radial = ctx.createRadialGradient(size * 0.38, size * 0.26, size * 0.03, size / 2, size / 2, size * 0.56);
      radial.addColorStop(0, '#3a3a3a');
      radial.addColorStop(0.38, isBack ? '#202020' : '#2c2c2c');
      radial.addColorStop(0.74, '#161616');
      radial.addColorStop(1, '#050505');
      ctx.fillStyle = radial;
      ctx.fillRect(0, 0, size, size);

      ctx.save();
      ctx.translate(size / 2, size / 2);
      drawRingTexture(ctx, size);
      ctx.globalAlpha = isBack ? 0.14 : 0.18;
      drawIcon(ctx, industry, size);
      ctx.restore();

      const texture = new THREE.CanvasTexture(canvas);
      texture.anisotropy = 8;
      texture.colorSpace = THREE.SRGBColorSpace;
      drawSvgIconOnTexture(ctx, texture, industry, size, isBack);
      return texture;
    };

    const createFace = (industry: Industry, z: number, isBack: boolean) => {
      const geometry = new THREE.CircleGeometry(coinRadius * 0.965, 96);
      const material = new THREE.MeshStandardMaterial({
        map: createFaceTexture(industry, isBack),
        metalness: 0.88,
        roughness: 0.34,
        side: THREE.FrontSide,
      });

      const face = new THREE.Mesh(geometry, material);
      face.position.z = z;
      if (isBack) face.rotation.y = Math.PI;
      return face;
    };

    const createEdge = () => {
      const geometry = new THREE.CylinderGeometry(coinRadius, coinRadius, coinThickness, 96, 1, true);
      const material = new THREE.MeshStandardMaterial({
        color: 0x0f0f0f,
        metalness: 1,
        roughness: 0.28,
        side: THREE.FrontSide,
      });

      const edge = new THREE.Mesh(geometry, material);
      edge.rotation.x = Math.PI / 2;
      return edge;
    };

    const createCoin = (industry: Industry) => {
      const group = new THREE.Group();
      const faceZ = coinThickness / 2;
      group.add(createFace(industry, faceZ, false));
      group.add(createFace(industry, -faceZ, true));
      group.add(createEdge());
      return group;
    };

    const createCoins = () => {
      INDUSTRIES.forEach((industry, index) => {
        const baseAngle = (index / INDUSTRIES.length) * Math.PI * 2 - Math.PI / 2;
        const wrapper = new THREE.Group() as CoinGroup;
        const token = createCoin(industry);

        const materials: THREE.Material[] = [];
        token.traverse((child) => {
          const mesh = child as THREE.Mesh;
          if (!mesh.material) return;
          const meshMaterials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
          meshMaterials.forEach((material) => {
            material.transparent = true;
            materials.push(material);
          });
        });

        wrapper.userData = {
          baseAngle,
          index,
          industry,
          isFlipping: false,
          flipStartTime: 0,
          flipStartY: 0,
          flipEndY: 0,
          targetScale: 1,
          currentScale: 1,
          token,
          materials,
          lastOpacity: -1,
          hoverFlipAngle: 0,
          hoverFlipStartTime: 0,
          hoverFlipActive: false,
          hoverRecoilAngle: 0,
          hoverRecoilVelocity: 0,
          hoverRecoilActive: false,
        };

        token.rotation.x = 0;
        token.rotation.z = 0;
        wrapper.add(token);

        scene.add(wrapper);
        coins.push(wrapper);
      });
    };

    const updatePointer = (event: PointerEvent | MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    };

    const getIntersectedCoin = (event: PointerEvent | MouseEvent) => {
      updatePointer(event);
      raycaster.setFromCamera(pointer, camera);

      const targets: THREE.Object3D[] = [];
      coins.forEach((coin) => {
        coin.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) targets.push(child);
        });
      });

      const hits = raycaster.intersectObjects(targets, false);
      if (!hits.length) return null;

      let object: THREE.Object3D | null = hits[0].object;
      while (object && !coins.includes(object as CoinGroup)) object = object.parent;
      return (object as CoinGroup | null) ?? null;
    };

    const flipCoin = (coin: CoinGroup | null) => {
      if (!coin || coin.userData.isFlipping) return;

      coin.userData.isFlipping = true;
      coin.userData.flipStartTime = performance.now();
      coin.userData.flipStartY = coin.userData.token.rotation.y;
      coin.userData.flipEndY = coin.userData.token.rotation.y + Math.PI;
    };

    const applyHoverSpinForce = (coin: CoinGroup | null) => {
      if (!coin) return;
      coin.userData.targetScale = 1;
      if (coin.userData.hoverFlipActive) return;
      coin.userData.hoverFlipAngle = 0;
      coin.userData.hoverFlipStartTime = performance.now();
      coin.userData.hoverFlipActive = true;
      coin.userData.hoverRecoilAngle = 0;
      coin.userData.hoverRecoilVelocity = 0;
      coin.userData.hoverRecoilActive = false;
    };

    const onPointerMove = (event: PointerEvent) => {
      const hitCoin = getIntersectedCoin(event);
      if (hitCoin !== hoveredCoin) {
        if (hoveredCoin) hoveredCoin.userData.targetScale = 1;
        hoveredCoin = hitCoin;
        if (hoveredCoin) {
          hoveredCoin.userData.targetScale = 1;
          applyHoverSpinForce(hoveredCoin);
        }
      }
    };

    const onPointerLeave = () => {
      if (hoveredCoin) hoveredCoin.userData.targetScale = 1;
      hoveredCoin = null;
    };

    const onClick = (event: MouseEvent) => {
      flipCoin(getIntersectedCoin(event));
    };

    const onResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
      updateCameraPosition();
    };

    const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
    const easeInOutSine = (t: number) => -(Math.cos(Math.PI * t) - 1) / 2;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const now = performance.now();

      const delta = lastFrameTime === 0 ? 0 : now - lastFrameTime;
      lastFrameTime = now;

      const smoothing = isMobileLayout() ? 0.18 : 0.14;
      scrollState.progress += (scrollStateTarget.progress - scrollState.progress) * smoothing;
      scrollState.radiusBoost += (scrollStateTarget.radiusBoost - scrollState.radiusBoost) * smoothing;
      scrollState.coinScaleBoost += (scrollStateTarget.coinScaleBoost - scrollState.coinScaleBoost) * smoothing;
      scrollState.cameraPush += (scrollStateTarget.cameraPush - scrollState.cameraPush) * smoothing;
      scrollState.orbitSpeedBoost += (scrollStateTarget.orbitSpeedBoost - scrollState.orbitSpeedBoost) * smoothing;
      scrollState.depthSpread += (scrollStateTarget.depthSpread - scrollState.depthSpread) * smoothing;
      scrollState.forwardPush += (scrollStateTarget.forwardPush - scrollState.forwardPush) * smoothing;
      scrollState.faceForward += (scrollStateTarget.faceForward - scrollState.faceForward) * smoothing;
      scrollState.exitSpread += (scrollStateTarget.exitSpread - scrollState.exitSpread) * smoothing;
      scrollState.coinFade += (scrollStateTarget.coinFade - scrollState.coinFade) * smoothing;

      orbitTime -= delta * orbitSpeed * scrollState.orbitSpeedBoost;

      const layout = getLayoutSettings();

      coins.forEach((coin) => {
        const angle = coin.userData.baseAngle + orbitTime;

        const zoomRadiusX = layout.orbitRadiusX * scrollState.radiusBoost;
        const zoomRadiusY = layout.orbitRadiusY * scrollState.radiusBoost;

        const exitMultiplier = 1 + scrollState.exitSpread * scrollState.progress;
        const x = Math.cos(angle) * zoomRadiusX * exitMultiplier;
        const y = Math.sin(angle) * zoomRadiusY * exitMultiplier;
        const depth = (Math.sin(angle) + 1) / 2;
        const baseZ = THREE.MathUtils.lerp(-scrollState.depthSpread * 0.45, scrollState.depthSpread, depth);
        const forwardZ = scrollState.forwardPush * scrollState.progress * THREE.MathUtils.lerp(0.35, 1, depth);
        const unclampedZ = baseZ + forwardZ;
        const nearPadding = isMobileLayout() ? 0.48 : 0.62;
        const safeMaxZ = Math.max(0, camera.position.z - nearPadding);
        const z = Math.min(unclampedZ, safeMaxZ);

        const zoomOpacityBoost = THREE.MathUtils.lerp(0, 0.10, scrollState.progress);
        const opacity = THREE.MathUtils.clamp(
          THREE.MathUtils.lerp(layout.opacityMin, layout.opacityMax, depth) + zoomOpacityBoost,
          0.28,
          0.98,
        );

        coin.position.set(x, y, z);
        coin.userData.currentScale += (coin.userData.targetScale - coin.userData.currentScale) * 0.12;

        const depthScale = isMobileLayout()
          ? THREE.MathUtils.lerp(0.90, 1.34, depth)
          : THREE.MathUtils.lerp(0.92, 1.24, depth);
        coin.scale.setScalar(coin.userData.currentScale * layout.coinScale * scrollState.coinScaleBoost * depthScale);

        // Tangent = direction the token is moving along the orbit.
        // Using this makes the token behave like a flying flat rock: the
        // leading/front face drops as it moves instead of staying fixed.
        const tangentX = -Math.sin(angle) * zoomRadiusX;
        const tangentY = Math.cos(angle) * zoomRadiusY;
        const tangentLength = Math.hypot(tangentX, tangentY) || 1;
        const tangentNX = tangentX / tangentLength;
        const tangentNY = tangentY / tangentLength;

        coin.rotation.set(
          coinPitchTilt + tangentNY * frontFaceDropStrength * frontFaceDropDirection,
          coinSideTilt + tangentNX * frontFaceSideFollow,
          -tangentNX * frontFaceRollFollow,
        );

        if (Math.abs(opacity - coin.userData.lastOpacity) > 0.01) {
          coin.userData.materials.forEach((material) => {
            material.opacity = opacity;
          });
          coin.userData.lastOpacity = opacity;
        }

        const token = coin.userData.token;

        const hoverFlipTarget = Math.PI * 1;
        const hoverFlipDurationMs = 800;

        if (coin.userData.hoverFlipActive && !coin.userData.isFlipping) {
          const elapsed = now - coin.userData.hoverFlipStartTime;
          const progress = Math.min(elapsed / hoverFlipDurationMs, 1);
          const eased = easeInOutSine(progress);

          coin.userData.hoverFlipAngle = hoverFlipTarget * eased;

          if (progress >= 1) {
            coin.userData.hoverFlipActive = false;
            coin.userData.hoverFlipAngle = 0;
            coin.userData.hoverRecoilAngle = -0.16;
            coin.userData.hoverRecoilVelocity = 0.018;
            coin.userData.hoverRecoilActive = true;
          }
        }

        if (coin.userData.hoverRecoilActive && !coin.userData.isFlipping) {
          const recoilSpringStrength = 0.045;
          const recoilDamping = 0.84;

          const returnForce = -coin.userData.hoverRecoilAngle * recoilSpringStrength;
          coin.userData.hoverRecoilVelocity += returnForce;
          coin.userData.hoverRecoilVelocity *= recoilDamping;
          coin.userData.hoverRecoilAngle += coin.userData.hoverRecoilVelocity;

          if (
            Math.abs(coin.userData.hoverRecoilVelocity) < 0.0008 &&
            Math.abs(coin.userData.hoverRecoilAngle) < 0.0008
          ) {
            coin.userData.hoverRecoilVelocity = 0;
            coin.userData.hoverRecoilAngle = 0;
            coin.userData.hoverRecoilActive = false;
          }
        }

        token.rotation.x = coin.userData.hoverRecoilAngle;
        token.rotation.z = 0;

        if (coin.userData.isFlipping) {
          const elapsed = now - coin.userData.flipStartTime;
          const progress = Math.min(elapsed / FLIP_DURATION_MS, 1);
          const eased = easeInOutCubic(progress);

          const baseFlipY =
            coin.userData.flipStartY +
            (coin.userData.flipEndY - coin.userData.flipStartY) * eased;

          token.rotation.y = baseFlipY + coin.userData.hoverFlipAngle;

          if (progress >= 1) {
            coin.userData.isFlipping = false;
            token.rotation.y %= Math.PI * 2;
          }
        } else {
          token.rotation.y = coin.userData.hoverFlipAngle;
        }
      });

      if (baseCameraDistance > 0) {
        const targetZ = baseCameraDistance * scrollState.cameraPush;
        camera.position.z += (targetZ - camera.position.z) * 0.08;
        camera.lookAt(0, 0, 0);
      }

      if (glowSprite) {
        const targetOpacity = THREE.MathUtils.lerp(0.2, 0.34, scrollState.progress);
        const targetGlowScale = THREE.MathUtils.lerp(7.6, 9.2, scrollState.progress);
        glowSprite.material.opacity += (targetOpacity - glowSprite.material.opacity) * 0.06;
        const cs = glowSprite.scale.x;
        const ns = cs + (targetGlowScale - cs) * 0.06;
        glowSprite.scale.set(ns, ns, 1);
      }

      if (systemsLogoModel) {
        const logoTarget = systemsLogoModelVisible ? 0.18 : 0;
        systemsLogoModelOpacity += (logoTarget - systemsLogoModelOpacity) * 0.04;
        if (
          systemsLogoMaterials.length > 0 &&
          Math.abs(systemsLogoModelOpacity - systemsLogoMaterials[0].opacity) > 0.001
        ) {
          systemsLogoMaterials.forEach((m) => { m.opacity = systemsLogoModelOpacity; });
        }
        systemsLogoModel.visible = systemsLogoModelOpacity > 0.005;
        if (systemsLogoModel.visible) {
          systemsLogoModel.rotation.y += delta * 0.0003;
        }
      }

      renderer.render(scene, camera);
    };

    scene = new THREE.Scene();
    scene.background = null;

    camera = new THREE.PerspectiveCamera(42, container.clientWidth / container.clientHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    const maxPixelRatio = window.matchMedia('(max-width: 640px)').matches ? 1.25 : 1.5;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, maxPixelRatio));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.appendChild(renderer.domElement);

    scene.add(new THREE.AmbientLight(0xffffff, 0.52));

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.15);
    keyLight.position.set(2.8, 3.4, 5.2);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0xffffff, 1.05);
    rimLight.position.set(-3.6, 1.8, 3.4);
    scene.add(rimLight);

    const softLight = new THREE.PointLight(0xffffff, 0.52, 7);
    softLight.position.set(0, 0, 2.4);
    scene.add(softLight);

    updateCameraPosition();
    createBackgroundGlow();
    createCoins();

    // Tell the loading screen the heavy scene (Three.js + the GLB logo model)
    // is ready. Idempotent + sets a global flag so the loader still resolves if
    // it happens to mount after this fires.
    let readySignalled = false;
    const signalReady = () => {
      if (readySignalled) return;
      readySignalled = true;
      (window as Window & { __mogtReady?: boolean }).__mogtReady = true;
      window.dispatchEvent(new Event('mogt:ready'));
    };

    const logoLoader = new GLTFLoader();
    logoLoader.setMeshoptDecoder(MeshoptDecoder);
    logoLoader.load(
      '/3Dlogo.glb',
      (gltf) => {
        systemsLogoModel = gltf.scene;
        systemsLogoModel.scale.setScalar(isMobileLayout() ? 1.008 : 0.648);
        systemsLogoModel.position.set(0, 0, -0.2);
        systemsLogoMaterials = [];
        systemsLogoModel.traverse((child) => {
          const mesh = child as THREE.Mesh;
          if (!mesh.material) return;
          const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
          mats.forEach((material) => {
            material.transparent = true;
            material.opacity = 0;
            systemsLogoMaterials.push(material);
          });
        });
        scene.add(systemsLogoModel);
        // One frame so the model's first render is committed before the curtain lifts.
        requestAnimationFrame(signalReady);
      },
      undefined,
      // Never trap the user behind the loader if the model fails to load.
      signalReady,
    );

    renderer.domElement.addEventListener('click', onClick);
    renderer.domElement.addEventListener('pointermove', onPointerMove);
    renderer.domElement.addEventListener('pointerleave', onPointerLeave);

    if ('ResizeObserver' in window) {
      resizeObserver = new ResizeObserver(onResize);
      resizeObserver.observe(container);
    } else {
      (window as Window).addEventListener('resize', onResize);
    }

    loadingTimer = setTimeout(() => {
      setIsLoading(false);
      // Authoritative ScrollTrigger.refresh runs from SmoothScrollProvider after
      // mogt:loader-complete, so no refresh is triggered here.
    }, 180);

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobile = window.matchMedia('(max-width: 640px)').matches;
    const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;
    const useMobileScrollTuning = isMobile || (isTouchDevice && window.innerWidth < 900);
    const shouldPin = !prefersReducedMotion;

    if (isMobile && !prefersReducedMotion) {
      ScrollTrigger.normalizeScroll(true);
    }

    if (!prefersReducedMotion && sectionRef.current) {
      const mobileScrollTargets = {
        progress: 1,
        radiusBoost: 1.62,
        coinScaleBoost: 1.74,
        cameraPush: 0.82,
        orbitSpeedBoost: 0.1,
        depthSpread: 0.44,
        forwardPush: 0.52,
        faceForward: 0.88,
        exitSpread: 0.26,
        coinFade: 0,
      };

      const desktopScrollTargets = {
        progress: 1,
        radiusBoost: 1.78,
        coinScaleBoost: 2.05,
        cameraPush: 0.68,
        orbitSpeedBoost: 0.10,
        depthSpread: 0.62,
        forwardPush: 0.95,
        faceForward: 0.88,
        exitSpread: 0.30,
        coinFade: 0,
      };

      const scrollTargets = useMobileScrollTuning ? mobileScrollTargets : desktopScrollTargets;

      if (process.env.NODE_ENV === 'development') {
        console.log('Coin scroll tuning', { isMobile, isTouchDevice, useMobileScrollTuning, scrollTargets });
      }

      gsapCtx = gsap.context(() => {
        gsap.set(specializationInnerRef.current, {
          autoAlpha: 0,
          y: () => window.innerHeight * (isMobile ? 0.58 : 0.62),
          scale: 0.94,
          filter: isMobile ? 'blur(22px)' : 'blur(34px)',
          pointerEvents: 'none',
          transformOrigin: '50% 50%',
        });

        gsap.set(specializationHeadingRef.current, { autoAlpha: 1 });

        gsap.set(specializationHeadingLineRefs.current, {
          autoAlpha: 0,
          y: isMobile ? 18 : 26,
          filter: isMobile ? 'blur(12px)' : 'blur(18px)',
        });

        gsap.set([
          specializationKickerRef.current,
          specializationTextRef.current,
          specializationActionsRef.current,
        ], {
          autoAlpha: 0,
          y: isMobile ? 18 : 26,
          filter: isMobile ? 'blur(10px)' : 'blur(16px)',
        });

        gsap.set(specializationActionsRef.current, { pointerEvents: 'none' });

        const isPortalCompact = window.matchMedia('(max-width: 768px)').matches || useMobileScrollTuning;
        const portalSettings = {
          // Far/deep: the FULL component is visible but faint, small and dim — it
          // reads as "the next section, far away," never an empty frame. Less deep
          // and larger than before so its details are legible at a distance.
          farAlpha: isPortalCompact ? 0.32 : 0.26,
          approachAlpha: isPortalCompact ? 0.8 : 0.84,
          farScale: isPortalCompact ? 0.82 : 0.76,
          approachScale: isPortalCompact ? 0.9 : 0.92,
          exitScale: isPortalCompact ? 1.18 : 1.22,
          farYPercent: isPortalCompact ? 5 : 7,
          approachYPercent: isPortalCompact ? 2 : 2.5,
          exitYPercent: isPortalCompact ? -5 : -7,
          farBrightness: 0.84,
          approachBrightness: 0.96,
          exitBrightness: 1.08,
          farZ: isPortalCompact ? -260 : -380,
          approachZ: isPortalCompact ? -100 : -150,
          exitZ: isPortalCompact ? 110 : 180,
          transformPerspective: isPortalCompact ? 900 : 1250,
        };

        // Portal depth is conveyed via opacity / yPercent / z / scale only.
        // Blur was removed from the scrubbed timeline (GPU repaint per frame on
        // 6 composited layers). Light brightness shift is cheap and stable.
        const portalFilter = (brightness: number) =>
          `brightness(${brightness})`;

        const setPortalPanelInitialState = (panel: HTMLDivElement) => {
          panel.classList.remove('isAshExiting');
          gsap.set(panel, {
            autoAlpha: 0,
            yPercent: portalSettings.farYPercent,
            z: portalSettings.farZ,
            scale: portalSettings.farScale,
            transformPerspective: portalSettings.transformPerspective,
            transformOrigin: '50% 50%',
            clipPath: 'inset(0% 0% 0% 0%)',
            filter: portalFilter(portalSettings.farBrightness),
            pointerEvents: 'none',
          });
        };

        overlayPanelRefs.current.forEach(setPortalPanelInitialState);

        gsap.set(systemsIndexLogoRef.current, {
          autoAlpha: 1,
          scale: 1,
          filter: 'blur(0px)',
        });

        gsap.set(systemsIntroRef.current, {
          autoAlpha: 1,
          y: 0,
          filter: 'blur(0px)',
        });

        gsap.set(systemsIndustryMatrixRef.current, {
          autoAlpha: 1,
          y: 0,
          filter: 'blur(0px)',
        });

        gsap.set(systemsCapabilitiesRef.current, {
          autoAlpha: 1,
          y: 0,
          filter: 'blur(0px)',
        });

        // Section B (Selected Work vault) — heading + cards stagger in.
        gsap.set('.vaultReveal', {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          filter: 'blur(0px)',
          transformOrigin: '50% 50%',
        });

        gsap.set(sideProgressFillRef.current, {
          scaleY: 0,
          transformOrigin: 'top',
        });

        sideProgressTickRefs.current.forEach((tick) => {
          tick.classList.remove('isActive');
        });

        const sectionAEnterAt = 1.18;
        const sectionAHoldUntil = sectionAEnterAt + 1.9;
        const sectionBEnterAt = sectionAHoldUntil + 0.25;
        // Spacing between consecutive portal panels. The readable focus window
        // is intentionally longer than approach/exit so child components only
        // animate after the portal panel is sharp and full-screen.
        const panelStep = 2.45;
        // Approach is long and overlaps the focus tween so deep → readable reads
        // as one continuous zoom rather than two segmented motions. The exit
        // connects into the next panel's approach (no hard stop).
        const portalApproachDuration = 0.78;
        const portalFocusOffset = 0.50;
        const portalFocusDuration = 0.62;
        const portalExitOffset = 2.25;
        const portalExitDuration = 0.66;

        // Continuous focus drift: during the readable hold the carrier keeps
        // creeping subtly toward the viewer so it never goes visually dead-still.
        const portalFocusDriftZ = isPortalCompact ? 18 : 28;
        const portalFocusDriftScale = isPortalCompact ? 1.012 : 1.02;
        const portalFocusDriftYPercent = isPortalCompact ? -0.55 : -0.9;

        // Uniform spacing → a continuous zoom conveyor. Each panel enters ~0.20
        // after the previous starts exiting and ~0.46 before it fully leaves, so
        // the next full component is already visible (far / faint / small) while
        // the previous exits. No empty portal frame, no large dead gap before
        // ProjectIntake.
        const getPanelEnterAt = (index: number) =>
          index === 0 ? sectionAEnterAt : sectionBEnterAt + (index - 1) * panelStep;

        const getPanelFocusStartAt = (index: number) =>
          getPanelEnterAt(index) + portalFocusOffset + portalFocusDuration;

        const getPanelExitStartAt = (index: number) =>
          getPanelEnterAt(index) + portalExitOffset;

        const getPanelFocusEndAt = (index: number) =>
          getPanelExitStartAt(index);

        const getPanelExitEndAt = (index: number) =>
          getPanelExitStartAt(index) + portalExitDuration;

        const getPortalPanelTiming = (index: number) => {
          const enterAt = getPanelEnterAt(index);
          return {
            enterAt,
            focusAt: enterAt + portalFocusOffset,
            focusStartAt: getPanelFocusStartAt(index),
            focusEndAt: getPanelFocusEndAt(index),
            exitAt: getPanelExitStartAt(index),
            exitEndAt: getPanelExitEndAt(index),
          };
        };

        const getPortalPanelStage = (index: number, timePos: number): PortalPanelStage => {
          const timing = getPortalPanelTiming(index);
          if (timePos < timing.enterAt) return 'deep';
          if (timePos < timing.focusStartAt) return 'approach';
          if (timePos < timing.focusEndAt) return 'focus';
          if (timePos < timing.exitEndAt) return 'exit';
          return 'idle';
        };

        const getPanelFocusProgress = (index: number, timePos: number) => {
          const focusStartAt = getPanelFocusStartAt(index);
          const focusEndAt = getPanelFocusEndAt(index);
          const focusDuration = Math.max(focusEndAt - focusStartAt, 0.001);
          return Math.max(0, Math.min(1, (timePos - focusStartAt) / focusDuration));
        };

        const getPortalPanelDetail = (
          index: number,
          stage: PortalPanelStage,
          focusProgress: number,
        ): PortalPanelEventDetail => {
          const panel = OVERLAY_PANELS[index];
          return {
            index,
            variant: panel?.variant ?? '',
            label: panel?.label ?? '',
            stage,
            focusProgress,
          };
        };

        const getActivePortalPanel = (timePos: number): PortalPanelEventDetail => {
          for (let index = 0; index < OVERLAY_PANELS.length; index += 1) {
            const stage = getPortalPanelStage(index, timePos);
            if (stage !== 'idle') {
              const focusProgress = stage === 'focus' ? getPanelFocusProgress(index, timePos) : 0;
              return getPortalPanelDetail(index, stage, focusProgress);
            }
          }

          return {
            index: -1,
            variant: '',
            label: '',
            stage: 'idle',
            focusProgress: 0,
          };
        };

        // Softer exit for the final cluster so testimonials does not balloon in
        // scale/z and sit on top of projectIntake during the handoff.
        const getPortalExitSettings = (index: number) => {
          const isFinalCluster = index >= 4;
          return {
            exitScale: isFinalCluster
              ? (isPortalCompact ? 1.14 : 1.22)
              : portalSettings.exitScale,
            exitZ: isFinalCluster
              ? (isPortalCompact ? 70 : 150)
              : portalSettings.exitZ,
            exitYPercent: isFinalCluster
              ? (isPortalCompact ? -5 : -7)
              : portalSettings.exitYPercent,
          };
        };

        const animatePortalPanel = (tl: gsap.core.Timeline, panel: HTMLDivElement, index: number) => {
          const timing = getPortalPanelTiming(index);
          const exitSettings = getPortalExitSettings(index);

          tl.set(panel, {
            autoAlpha: portalSettings.farAlpha,
            yPercent: portalSettings.farYPercent,
            z: portalSettings.farZ,
            scale: portalSettings.farScale,
            clipPath: 'inset(0% 0% 0% 0%)',
            filter: portalFilter(portalSettings.farBrightness),
            pointerEvents: 'none',
          }, timing.enterAt)
            .to(panel, {
              autoAlpha: portalSettings.approachAlpha,
              yPercent: portalSettings.approachYPercent,
              z: portalSettings.approachZ,
              scale: portalSettings.approachScale,
              clipPath: 'inset(0% 0% 0% 0%)',
              filter: portalFilter(portalSettings.approachBrightness),
              duration: portalApproachDuration,
              ease: 'power2.out',
            }, timing.enterAt)
            .to(panel, {
              autoAlpha: 1,
              yPercent: 0,
              z: 0,
              scale: 1,
              clipPath: 'inset(0% 0% 0% 0%)',
              filter: portalFilter(1),
              duration: portalFocusDuration,
              ease: 'power2.out',
            }, timing.focusAt)
            // Continuous focus drift: linear creep through the readable hold so
            // the panel never stops dead between focus and exit. Hands off to the
            // exit tween from the drifted state for a seamless transition.
            .to(panel, {
              z: portalFocusDriftZ,
              scale: portalFocusDriftScale,
              yPercent: portalFocusDriftYPercent,
              duration: timing.exitAt - timing.focusStartAt,
              ease: 'none',
            }, timing.focusStartAt)
            .set(panel, { pointerEvents: 'auto' }, timing.focusStartAt)
            .set(panel, { pointerEvents: 'none' }, timing.exitAt)
            .to(panel, {
              autoAlpha: 0,
              yPercent: exitSettings.exitYPercent,
              z: exitSettings.exitZ,
              scale: exitSettings.exitScale,
              clipPath: 'inset(0% 0% 0% 0%)',
              filter: portalFilter(portalSettings.exitBrightness),
              duration: portalExitDuration,
              ease: 'power2.inOut',
              onStart: () => panel.classList.add('isAshExiting'),
              onComplete: () => panel.classList.remove('isAshExiting'),
              onReverseComplete: () => panel.classList.remove('isAshExiting'),
            }, timing.exitAt);
        };

        const dispatchPortalPanelEvent = (eventName: string, detail: PortalPanelEventDetail) => {
          window.dispatchEvent(new CustomEvent(eventName, { detail }));
          if (process.env.NODE_ENV === 'development') {
            console.log(`[mogt] ${eventName}`, detail);
          }
        };

        const dispatchLegacyPortalEvent = <T,>(eventName: string, detail?: T) => {
          window.dispatchEvent(new CustomEvent(eventName, detail === undefined ? undefined : { detail }));
          if (process.env.NODE_ENV === 'development') {
            console.log(`[mogt] ${eventName}`, detail ?? {});
          }
        };

        const logPortalVisualState = (detail: PortalPanelEventDetail) => {
          if (process.env.NODE_ENV !== 'development') return;
          if (detail.stage !== 'approach' && detail.stage !== 'focus') return;

          const panel = overlayPanelRefs.current[detail.index];
          if (!panel) return;

          const panelStyle = window.getComputedStyle(panel);
          const child = panel.firstElementChild as HTMLElement | null;
          const childStyle = child ? window.getComputedStyle(child) : null;

          console.log('[mogt] portal visual state', {
            variant: detail.variant,
            stage: detail.stage,
            opacity: panelStyle.opacity,
            filter: panelStyle.filter,
            transform: panelStyle.transform,
            childVisible: childStyle
              ? childStyle.display !== 'none' &&
                childStyle.visibility !== 'hidden' &&
                Number(childStyle.opacity || 1) > 0
              : false,
          });
        };

        let lastStageIndex = -2;
        let lastStage: PortalPanelStage = 'idle';
        let focusedPanelIndex = -1;
        let lastFocusProgressIndex = -1;
        let lastFocusProgressBucket = -1;
        let vaultBooted = false;
        let lastBlueprintStep = -1;
        let lastTrustSignal = -1;

        const onScrollUpdate = (self: ScrollTrigger) => {
          const timePos = self.animation?.time() ?? 0;
          systemsLogoModelVisible =
            timePos >= getPanelFocusStartAt(0) && timePos <= getPanelFocusEndAt(0);
          const progress = self.progress;
          if (sideProgressFillRef.current) {
            gsap.set(sideProgressFillRef.current, { scaleY: progress });
          }
          const ticks = sideProgressTickRefs.current;
          const totalTicks = ticks.length;
          ticks.forEach((tick, index) => {
            const tickProgress = totalTicks <= 1 ? 0 : index / (totalTicks - 1);
            if (progress >= tickProgress) tick.classList.add('isActive');
            else tick.classList.remove('isActive');
          });

          const activePortalPanel = getActivePortalPanel(timePos);
          if (activePortalPanel.index !== lastStageIndex || activePortalPanel.stage !== lastStage) {
            dispatchPortalPanelEvent('portalPanelStageChange', activePortalPanel);
            logPortalVisualState(activePortalPanel);
            lastStageIndex = activePortalPanel.index;
            lastStage = activePortalPanel.stage;
          }

          const nextFocusedPanelIndex = activePortalPanel.stage === 'focus' ? activePortalPanel.index : -1;
          if (nextFocusedPanelIndex !== focusedPanelIndex) {
            if (focusedPanelIndex >= 0) {
              const exitStage = getPortalPanelStage(focusedPanelIndex, timePos);
              dispatchPortalPanelEvent(
                'portalPanelFocusEnd',
                getPortalPanelDetail(focusedPanelIndex, exitStage, 1),
              );
            }

            if (nextFocusedPanelIndex >= 0) {
              dispatchPortalPanelEvent('portalPanelFocusStart', activePortalPanel);
            }

            focusedPanelIndex = nextFocusedPanelIndex;
            lastFocusProgressIndex = -1;
            lastFocusProgressBucket = -1;
          }

          if (activePortalPanel.stage === 'focus') {
            const focusProgressBucket = Math.round(activePortalPanel.focusProgress * 50);
            if (
              activePortalPanel.index !== lastFocusProgressIndex ||
              focusProgressBucket !== lastFocusProgressBucket
            ) {
              dispatchPortalPanelEvent('portalPanelFocusProgress', activePortalPanel);
              lastFocusProgressIndex = activePortalPanel.index;
              lastFocusProgressBucket = focusProgressBucket;
            }

            if (activePortalPanel.variant === 'selectedWork' && !vaultBooted) {
              vaultBooted = true;
              dispatchLegacyPortalEvent('vaultBoot');
            }

            if (activePortalPanel.variant === 'process') {
              const bpStep = Math.min(5, Math.floor(activePortalPanel.focusProgress * 6));
              if (bpStep !== lastBlueprintStep) {
                lastBlueprintStep = bpStep;
                dispatchLegacyPortalEvent('blueprintStep', bpStep);
              }
            }

            if (activePortalPanel.variant === 'trustEngine') {
              const sigIdx = Math.min(5, Math.floor(activePortalPanel.focusProgress * 6));
              if (sigIdx !== lastTrustSignal) {
                lastTrustSignal = sigIdx;
                dispatchLegacyPortalEvent('trustSignal', sigIdx);
              }
            }
          }
        };

        const buildTimeline = (tl: gsap.core.Timeline) => {
          tl
            .to(scrollStateTarget, { ...scrollTargets, ease: 'none', duration: 1 }, 0)
            .to(heroTrustlineRef.current, {
              opacity: 0, y: -10, duration: 0.10, ease: 'none',
            }, 0.02)
            .to(ctaRef.current, {
              opacity: 0, y: -12, scale: 0.96, pointerEvents: 'none', duration: 0.12, ease: 'none',
            }, 0.04)
            .to(subtitleRef.current, {
              opacity: 0, y: -14, scale: 0.97, duration: 0.14, ease: 'none',
            }, 0.10)
            .to(headingRef.current, {
              opacity: 0, y: -18, scale: 0.975, duration: 0.16, ease: 'none',
            }, 0.16)
            .to(heroEyebrowRef.current, {
              opacity: 0, y: -12, duration: 0.12, ease: 'none',
            }, 0.18)
            .to(brandMarkRef.current, {
              opacity: 0, y: -14, scale: 0.96, duration: 0.14, ease: 'none',
            }, 0.20)
            .to(specializationInnerRef.current, {
              autoAlpha: 1, y: 0, scale: 1, filter: 'blur(0px)', pointerEvents: 'auto', duration: 0.72, ease: 'power2.out',
            }, 0.34)
            .to(specializationKickerRef.current, {
              autoAlpha: 1, y: 0, filter: 'blur(0px)', duration: 0.32, ease: 'power2.out',
            }, 0.42)
            .to(specializationHeadingLineRefs.current, {
              autoAlpha: 1, y: 0, filter: 'blur(0px)', duration: 0.54, stagger: 0.075, ease: 'power3.out',
            }, 0.48)
            .to(specializationTextRef.current, {
              autoAlpha: 1, y: 0, filter: 'blur(0px)', duration: 0.42, ease: 'power2.out',
            }, 0.76)
            .to(specializationActionsRef.current, {
              autoAlpha: 1, y: 0, filter: 'blur(0px)', pointerEvents: 'auto', duration: 0.38, ease: 'power2.out',
            }, 0.88)
            .to(specializationInnerRef.current, {
              autoAlpha: 0,
              y: -window.innerHeight * 0.18,
              scale: 1.05,
              filter: 'blur(24px)',
              pointerEvents: 'none',
              duration: 0.42,
              ease: 'power2.in',
            }, 1.05);

          overlayPanelRefs.current.forEach((panel, index) => {
            animatePortalPanel(tl, panel, index);
          });

          // Child content reveals only inside the readable focus windows.
          tl.to('.vaultReveal', {
            autoAlpha: 1, y: 0, scale: 1, filter: 'blur(0px)',
            duration: 0.7, stagger: 0.1, ease: 'power3.out',
          }, getPanelFocusStartAt(1) + 0.04)
            .to(systemsIndexLogoRef.current, {
              autoAlpha: 1, scale: 1, filter: 'blur(0px)', duration: 0.6, ease: 'power2.out',
            }, getPanelFocusStartAt(0))
            .to(systemsIntroRef.current, {
              autoAlpha: 1, y: 0, filter: 'blur(0px)', duration: 0.6, ease: 'power3.out',
            }, getPanelFocusStartAt(0) + 0.08)
            .to(systemsIndustryMatrixRef.current, {
              autoAlpha: 1, y: 0, filter: 'blur(0px)', duration: 0.65, ease: 'power3.out',
            }, getPanelFocusStartAt(0) + 0.34)
            .to(systemsCapabilitiesRef.current, {
              autoAlpha: 1, y: 0, filter: 'blur(0px)', duration: 0.6, ease: 'power2.out',
            }, getPanelFocusStartAt(0) + 0.58);
        };

        const mm = gsap.matchMedia();

        // Desktop/tablet: pin from the moment the hero fills the viewport, then
        // scroll drives the whole timeline. The scroll length is viewport-
        // relative and sized to the number of panels so every reveal gets a
        // consistent, generous slice of travel (≈ continuous cinematic motion
        // rather than discrete section jumps). A tighter scrub keeps the panels
        // physically locked to the wheel.
        mm.add('(min-width: 769px)', () => {
          scrollTimeline = gsap.timeline({
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top top',
              end: () => '+=' + Math.round(window.innerHeight * 8.2),
              // Higher scrub = the long cinematic timeline eases toward the wheel
              // position instead of snapping in chunks. fastScrollEnd disabled so
              // fast wheel flicks don't jump to the nearest finished state.
              scrub: 0.85,
              pin: shouldPin,
              pinSpacing: true,
              anticipatePin: 1,
              fastScrollEnd: false,
              invalidateOnRefresh: true,
              onUpdate: onScrollUpdate,
            },
          });
          buildTimeline(scrollTimeline);
        });

        // Mobile: section may be taller than viewport, so pin when the top of
        // the section reaches the top of the viewport instead.
        mm.add('(max-width: 768px)', () => {
          scrollTimeline = gsap.timeline({
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top top',
              // Same panel sequence, lighter travel per panel so mobile does not
              // become a long scroll trap while still keeping the overlay reveal.
              end: () => '+=' + Math.round(window.innerHeight * 6.1),
              scrub: 0.35,
              pin: shouldPin,
              pinSpacing: true,
              anticipatePin: 1,
              fastScrollEnd: false,
              invalidateOnRefresh: true,
              onUpdate: onScrollUpdate,
            },
          });
          buildTimeline(scrollTimeline);
        });

      }, sectionRef);

      // ScrollTrigger.refresh is owned by SmoothScrollProvider's authoritative
      // post-loader handler (mogt:loader-complete). No duplicate refresh here.
    }

    lastFrameTime = performance.now();
    animate();

    return () => {
      if (loadingTimer) clearTimeout(loadingTimer);
      cancelAnimationFrame(animationFrameId);

      renderer.domElement.removeEventListener('click', onClick);
      renderer.domElement.removeEventListener('pointermove', onPointerMove);
      renderer.domElement.removeEventListener('pointerleave', onPointerLeave);

      if (resizeObserver) resizeObserver.disconnect();
      else window.removeEventListener('resize', onResize);

      coins.forEach((coin) => {
        coin.traverse((child) => {
          const mesh = child as THREE.Mesh;
          if (mesh.geometry) mesh.geometry.dispose();
          if (mesh.material) {
            const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
            materials.forEach((material) => {
              const maybeMap = (material as THREE.MeshStandardMaterial | THREE.SpriteMaterial).map;
              if (maybeMap) maybeMap.dispose();
              material.dispose();
            });
          }
        });
      });

      scene.traverse((child) => {
        const sprite = child as THREE.Sprite;
        if (sprite.isSprite && sprite.material) {
          const material = sprite.material as THREE.SpriteMaterial;
          if (material.map) material.map.dispose();
          material.dispose();
        }
      });

      if (systemsLogoModel) {
        systemsLogoModel.traverse((child) => {
          const mesh = child as THREE.Mesh;
          if (mesh.geometry) mesh.geometry.dispose();
        });
        systemsLogoMaterials.forEach((m) => m.dispose());
        systemsLogoMaterials = [];
      }

      renderer.dispose();
      renderer.forceContextLoss();
      renderer.domElement.remove();

      if (gsapCtx) {
        gsapCtx.revert();
      } else if (scrollTimeline) {
        scrollTimeline.scrollTrigger?.kill();
        scrollTimeline.kill();
      }
    };
  }, []);

  useEffect(() => {
    if (!systemsInsightPanelRef.current || !isIndustryOverlayOpen) return;
    const panel = systemsInsightPanelRef.current;
    gsap.timeline()
      .set(panel, { autoAlpha: 1, scaleY: 0.014, filter: 'brightness(18) blur(0px)' })
      .to(panel, { scaleY: 1, duration: 0.32, ease: 'expo.out' })
      .to(panel, { filter: 'brightness(1) blur(0px)', duration: 0.26, ease: 'power2.inOut' }, '-=0.20');
  }, [activeIndustryId, isIndustryOverlayOpen]);

  return (
    <section ref={sectionRef} className="coinHero" aria-label="MOGT agency hero section">
      <div
        ref={canvasContainerRef}
        className="canvasContainer"
        role="img"
        aria-label="Ten large monochrome industry medallions arranged around the MOGT agency headline."
      />

      {isLoading ? <div className="loading">Loading coins</div> : null}

      <header className="portfolioHeader" aria-label="Primary navigation">
        <div className="portfolioBrand">
          <span className="brandGlyph">
            <i />
            <i />
            <i />
          </span>
          <span>MOGT</span>
          <span className="soundGlyph" aria-hidden="true" />
        </div>
        <nav className="portfolioNav">
          <WorkMegaMenu />
          <ServicesMegaMenu />
          <a
            className="navCta"
            href={CONTACT_HREF}
            onClick={(event) => {
              event.preventDefault();
              openIntake({ intent: 'estimate', sourceButton: 'Estimate a Project' });
            }}
          >
            Estimate a Project
          </a>
        </nav>
        <MobileNav contactHref={CONTACT_HREF} workHref="#work" />
      </header>

      <div ref={heroContentRef} className="heroContent">
        <div ref={brandMarkRef} className="brandMark" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>

        <span ref={heroEyebrowRef} className="heroEyebrow">
          Web Apps / Systems / Product Engineering
        </span>

        <h1 ref={headingRef}>
          We turn complex ideas into
          <br />
          build-ready digital systems.
        </h1>

        <p ref={subtitleRef}>
          MOGT designs and builds web apps, dashboards, SaaS platforms, marketplaces,
          and operational tools for teams that need clarity before code and speed after launch.
        </p>

        <div ref={ctaRef} className="heroActions">
          <a
            className="telegramButton"
            href={CONTACT_HREF}
            onClick={(event) => {
              event.preventDefault();
              openIntake({ intent: 'start_project', sourceButton: 'Start a Project' });
            }}
          >
            Start a Project
          </a>
          <a className="secondaryButton" href="#work">
            View Selected Work
          </a>
        </div>

        <p ref={heroTrustlineRef} className="heroTrustline">
          Strategy. UX. Frontend. Backend. Deployment.
        </p>
      </div>

      <div ref={specializationRef} className="specializationContent" aria-label="Specialization summary">
        <div ref={specializationInnerRef} className="specializationInner">
          <div ref={specializationKickerRef} className="specializationKicker">
            Product Strategy <span>/</span> UX <span>/</span> Frontend <span>/</span> Backend <span>/</span> Deployment
          </div>

          <h2 ref={specializationHeadingRef}>
            {[
              'We design and build web apps,',
              'dashboards, SaaS platforms,',
              'and operational systems for teams',
              'that need clarity before code.',
            ].map((line, index) => (
              <span
                key={line}
                ref={(element) => setSpecializationHeadingLineRef(element, index)}
                className="specializationHeadingLine"
              >
                {line}
              </span>
            ))}
          </h2>

          <p ref={specializationTextRef}>
            MOGT partners with founders and product teams to turn complex, ambiguous requirements
            into structured, build-ready systems — then ships them with engineering that scales.
          </p>

          <div ref={specializationActionsRef} className="specializationActions">
            <a
              className="telegramButton"
              href={CONTACT_HREF}
              onClick={(event) => {
                event.preventDefault();
                openIntake({ intent: 'start_project', sourceButton: 'Start a Project' });
              }}
            >
              Start a Project
            </a>
            <a className="secondaryButton" href="#work">
              View Selected Work
            </a>
          </div>
        </div>
      </div>

      <div className="overlayPanelStack" aria-label="Agency sections">
        <div className="portalJourney">
          <div className="portalMask" aria-hidden="true" />
          <div className="portalDepth">
            {OVERLAY_PANELS.map((panel, index) => (
              <div
                key={panel.label}
                ref={(element) => setOverlayPanelRef(element, index)}
                className="overlayPanel portalPanel"
                style={{ zIndex: 20 + index }}
              >
                {/* Content layer — the full child component, kept visible through
                    approach/focus/exit and governed only by the carrier transform. */}
                <div className="portalContent">
                {panel.variant === 'systemsIndex' ? (
                  <div className="systemsIndexPanel">
                    <div ref={systemsIndexLogoRef} className="systemsIndexLogo" aria-hidden="true" />
                    <div ref={systemsIntroRef} className="systemsIndexIntro">
                      <span className="systemsIndexEyebrow">Section A / Operating Fields</span>
                      <h2>Interface Systems Index</h2>
                      <p>We build across product categories where reliability, workflows, and user behavior matter.</p>
                    </div>
                    <div ref={systemsIndustryMatrixRef} className="systemsIndustryMatrix">
                      {SYSTEM_INDUSTRIES.map((industry) => (
                        <button
                          key={industry.id}
                          type="button"
                          className={`systemsIndustryItem ${activeIndustryId === industry.id && isIndustryOverlayOpen ? 'isActive' : ''}`}
                          onMouseEnter={() => openIndustryOverlay(industry.id)}
                          onFocus={() => openIndustryOverlay(industry.id)}
                          onClick={() => openIndustryOverlay(industry.id)}
                          aria-expanded={activeIndustryId === industry.id && isIndustryOverlayOpen}
                        >
                          <b>{industry.index}</b>
                          {industry.label}
                        </button>
                      ))}
                    </div>
                    {activeIndustry && isIndustryOverlayOpen ? (
                      <div
                        ref={systemsInsightPanelRef}
                        className="systemsInsightFloatingPanel"
                        onMouseEnter={() => setIsIndustryOverlayOpen(true)}
                        onMouseLeave={closeIndustryOverlay}
                        role="dialog"
                        aria-label={activeIndustry.title}
                      >
                        <button
                          type="button"
                          className="systemsInsightClose"
                          onClick={closeIndustryOverlay}
                          aria-label="Close industry details"
                        >
                          ×
                        </button>
                        <div className="systemsInsightHeader">
                          <span>{activeIndustry.index} / 10</span>
                          <h3>{activeIndustry.title}</h3>
                          <p>{activeIndustry.summary}</p>
                        </div>
                        <div className="systemsInsightGrid">
                          <div className="systemsInsightBlock">
                            <span className="systemsInsightLabel">Interface Types</span>
                            <div className="systemsInsightTags">
                              {activeIndustry.interfaceTypes.map((item) => (
                                <span key={item}>{item}</span>
                              ))}
                            </div>
                          </div>
                          <div className="systemsInsightBlock">
                            <span className="systemsInsightLabel">Services</span>
                            <div className="systemsInsightTags">
                              {activeIndustry.services.map((item) => (
                                <span key={item}>{item}</span>
                              ))}
                            </div>
                          </div>
                          <div className="systemsInsightBlock systemsInsightMetrics">
                            <span className="systemsInsightLabel">Design Pressure Map</span>
                            {activeIndustry.metrics.map((metric) => (
                              <div key={metric.label} className="systemsMetricRow">
                                <div className="systemsMetricTop">
                                  <span>{metric.label}</span>
                                  <b>{metric.value}</b>
                                </div>
                                <div className="systemsMetricTrack">
                                  <span style={{ width: `${metric.bar}%` }} />
                                </div>
                              </div>
                            ))}
                          </div>
                          <div className="systemsInsightSignal">
                            <span className="systemsInsightLabel">Signal</span>
                            <p>{activeIndustry.signal}</p>
                          </div>
                        </div>
                      </div>
                    ) : null}
                    <div ref={systemsCapabilitiesRef} className="systemsCapabilities">
                      {SYSTEM_CAPABILITIES.map((capability) => (
                        <span key={capability}>{capability}</span>
                      ))}
                    </div>
                  </div>
                ) : panel.variant === 'selectedWork' ? (
                  <SelectedWorkVault portalMode />
                ) : panel.variant === 'process' ? (
                  <ProcessBlueprintSection portalMode />
                ) : panel.variant === 'trustEngine' ? (
                  <TrustEngineSection portalMode />
                ) : panel.variant === 'testimonials' ? (
                  <TestimonialsSection portalMode />
                ) : panel.variant === 'projectIntake' ? (
                  <ProjectIntakeSection contactHref={CONTACT_HREF} />
                ) : (
                  <div className="overlayPanelContent">
                    <span>{panel.title}</span>
                    <h2>{panel.label}</h2>
                    <p>{panel.text}</p>
                  </div>
                )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="portfolioFrame" aria-hidden="true">
        <div className="frameLine frameLineTop" />
        <div className="frameLine frameLineBottom" />
        <div className="frameLine frameLineLeft" />
        <div className="frameLine frameLineRight" />
        <span className="frameCorner frameCornerTopLeft">+</span>
        <span className="frameCorner frameCornerTopRight">+</span>
        <span className="frameCorner frameCornerBottomLeft">+</span>
        <span className="frameCorner frameCornerBottomRight">+</span>
        <div className="sideProgress" aria-label="Section scroll progress">
          <span className="sideProgressRail" />
          <span ref={sideProgressFillRef} className="sideProgressFill" />
          <div className="sideProgressTicks">
            {progressStages.map((stage, index) => (
              <span
                key={stage.key}
                ref={(element) => setSideProgressTickRef(element, index)}
                className="sideProgressTick"
                aria-label={stage.label}
                style={{
                  top: progressStages.length === 1
                    ? '0%'
                    : `${(index / (progressStages.length - 1)) * 100}%`,
                }}
              />
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        .coinHero {
          position: relative;
          width: 100%;
          height: 100vh;
          min-height: 620px;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          isolation: isolate;
          background:
            radial-gradient(circle at 50% 38%, rgba(255, 255, 255, 0.075), transparent 24%),
            radial-gradient(circle at 50% 56%, rgba(255, 255, 255, 0.028), transparent 48%),
            radial-gradient(circle at 18% 70%, rgba(255, 255, 255, 0.022), transparent 38%),
            linear-gradient(180deg, #0a0a0a 0%, #050505 52%, #030303 100%);
        }

        .coinHero::before {
          content: '';
          position: absolute;
          width: min(86vw, 860px);
          height: min(86vw, 860px);
          border-radius: 50%;
          background: radial-gradient(
            circle,
            rgba(255, 255, 255, 0.065),
            rgba(255, 255, 255, 0.022) 36%,
            transparent 70%
          );
          filter: blur(22px);
          z-index: -1;
        }

        .coinHero::after {
          content: '';
          position: absolute;
          inset: 0;
          pointer-events: none;
          opacity: 0.28;
          z-index: 6;
          background-image:
            url("data:image/svg+xml,%3Csvg viewBox='0 0 180 180' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.95' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='180' height='180' filter='url(%23n)' opacity='0.55'/%3E%3C/svg%3E"),
            radial-gradient(circle at 45% 20%, rgba(255,255,255,0.06), transparent 28%),
            linear-gradient(90deg, transparent, rgba(255,255,255,0.022), transparent);
          background-size: 180px 180px, 100% 100%, 100% 100%;
          mix-blend-mode: overlay;
        }

        .canvasContainer {
          position: absolute;
          inset: 50% auto auto 50%;
          width: 100%;
          aspect-ratio: 1 / 1;
          transform: translate(-50%, -50%);
          cursor: pointer;
          overflow: visible;
          filter:
            drop-shadow(1.8px 0 rgba(255, 60, 20, 0.22))
            drop-shadow(-1.8px 0 rgba(0, 120, 255, 0.20))
            drop-shadow(0 0 32px rgba(255, 255, 255, 0.13));
          z-index: 1;
        }

        .heroContent {
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, calc(-50% - 2px));
          z-index: 4;
          width: min(92vw, 660px);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          pointer-events: none;
        }

        .specializationContent {
          position: absolute;
          left: 50%;
          top: 47%;
          z-index: 8;
          width: min(92vw, 1040px);
          transform: translate(-50%, -50%);
          text-align: center;
          pointer-events: none;
          color: rgba(255, 255, 255, 0.94);
        }

        .specializationInner {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          will-change: opacity, transform, filter;
          pointer-events: none;
        }

        .brandMark {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 4px;
          margin-bottom: 22px;
          filter: drop-shadow(0 0 12px rgba(255, 255, 255, 0.24));
        }

        .brandMark span {
          width: 7px;
          height: 22px;
          display: block;
          background: rgba(255, 255, 255, 0.92);
          transform: skewY(23deg);
        }

        .heroContent h1 {
          margin: 0;
          color: rgba(255, 255, 255, 0.95);
          font-size: clamp(26px, 2.85vw, 36px);
          line-height: 1.16;
          font-weight: 360;
          letter-spacing: 0.095em;
          text-transform: uppercase;
          text-wrap: balance;
          text-shadow:
            1px 0 rgba(255, 64, 24, 0.24),
            -1px 0 rgba(40, 120, 255, 0.2),
            0 0 20px rgba(255, 255, 255, 0.11);
        }

        .heroContent p {
          width: min(92vw, 520px);
          margin: 24px 0 0;
          color: rgba(255, 255, 255, 0.78);
          font-size: clamp(12px, 1.18vw, 15px);
          line-height: 1.72;
          font-weight: 360;
          letter-spacing: -0.015em;
          text-shadow: 0 0 14px rgba(0, 0, 0, 0.78);
        }

        .heroEyebrow {
          display: inline-block;
          margin-bottom: 18px;
          color: rgba(255, 255, 255, 0.56);
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.26em;
          text-transform: uppercase;
          text-shadow: 0 0 14px rgba(0, 0, 0, 0.7);
        }

        .heroActions {
          display: flex;
          align-items: center;
          gap: 14px;
          margin-top: 34px;
          flex-wrap: wrap;
        }

        .heroActions .telegramButton {
          margin-top: 0;
          min-width: 200px;
        }

        .heroActions .secondaryButton {
          height: 60px;
          min-width: 200px;
        }

        .heroTrustline {
          margin: 20px 0 0;
          color: rgba(255, 255, 255, 0.4);
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
          font-size: 10.5px;
          font-weight: 700;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          text-shadow: 0 0 12px rgba(0, 0, 0, 0.7);
        }

        .navCta {
          padding: 7px 14px;
          border: 1px solid rgba(255, 255, 255, 0.3);
          color: rgba(255, 255, 255, 0.92) !important;
          background: rgba(255, 255, 255, 0.03);
          transition: border-color 160ms ease, background 160ms ease;
        }

        .navCta:hover {
          border-color: rgba(255, 255, 255, 0.6);
          background: rgba(255, 255, 255, 0.07);
        }

        .telegramButton {
          position: relative;
          margin-top: 34px;
          min-width: 246px;
          height: 60px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          color: rgba(255, 255, 255, 0.9);
          border: 1px solid rgba(255, 255, 255, 0.36);
          background:
            linear-gradient(180deg, rgba(255, 255, 255, 0.045), rgba(255, 255, 255, 0.012)),
            rgba(0, 0, 0, 0.12);
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.065em;
          text-transform: uppercase;
          text-decoration: none;
          backdrop-filter: blur(10px);
          pointer-events: auto;
          transition:
            border-color 180ms ease,
            background 180ms ease,
            transform 180ms ease;
        }

        .telegramButton::before,
        .telegramButton::after {
          content: '+';
          position: absolute;
          top: -10px;
          color: rgba(255, 255, 255, 0.72);
          font-size: 12px;
          font-weight: 300;
        }

        .telegramButton::before {
          left: -9px;
        }

        .telegramButton::after {
          right: -9px;
        }

        .telegramButton:hover {
          border-color: rgba(255, 255, 255, 0.62);
          background: rgba(255, 255, 255, 0.065);
          transform: translateY(-1px);
        }

        .loading {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 180px;
          height: 180px;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.035);
          border: 1px solid rgba(255, 255, 255, 0.08);
          display: flex;
          justify-content: center;
          align-items: center;
          color: rgba(255, 255, 255, 0.78);
          font-size: 13px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          backdrop-filter: blur(10px);
          z-index: 3;
        }

        .canvasContainer {
          opacity: 1;
          will-change: transform;
        }

        .brandMark,
        .heroEyebrow,
        .heroContent h1,
        .heroContent p,
        .heroActions,
        .heroTrustline,
        .telegramButton,
        .specializationKicker,
        .specializationContent h2,
        .specializationContent p,
        .specializationActions {
          will-change: opacity, transform;
        }

        .specializationKicker,
        .specializationContent p,
        .specializationActions {
          opacity: 0;
        }

        .specializationHeadingLine {
          display: block;
          will-change: opacity, transform, filter;
        }

        .specializationKicker {
          margin-bottom: 28px;
          color: rgba(255, 255, 255, 0.48);
          font-size: 13px;
          line-height: 1.2;
          font-weight: 500;
          letter-spacing: 0.075em;
          text-transform: uppercase;
        }

        .specializationKicker span {
          margin: 0 10px;
          color: rgba(255, 255, 255, 0.32);
        }

        .specializationContent h2 {
          margin: 0 auto;
          max-width: 1040px;
          color: rgba(255, 255, 255, 0.94);
          font-size: clamp(32px, 3.4vw, 58px);
          line-height: 1.18;
          font-weight: 380;
          letter-spacing: -0.055em;
          text-transform: uppercase;
          text-wrap: balance;
          text-shadow:
            1px 0 rgba(255, 64, 24, 0.16),
            -1px 0 rgba(40, 120, 255, 0.14),
            0 0 18px rgba(255, 255, 255, 0.08);
        }

        .specializationContent p {
          width: min(86vw, 760px);
          margin: 30px auto 0;
          color: rgba(255, 255, 255, 0.78);
          font-size: clamp(14px, 1.16vw, 17px);
          line-height: 1.65;
          font-weight: 360;
          letter-spacing: -0.018em;
        }

        .specializationActions {
          margin-top: 38px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 18px;
          pointer-events: auto;
        }

        .specializationActions .telegramButton {
          min-width: 178px;
          height: 58px;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.055em;
          color: rgba(255, 255, 255, 0.82);
          border-color: rgba(255, 255, 255, 0.24);
          background:
            linear-gradient(180deg, rgba(255, 255, 255, 0.035), rgba(255, 255, 255, 0.008)),
            rgba(0, 0, 0, 0.16);
        }

        .secondaryButton {
          position: relative;
          min-width: 178px;
          height: 58px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          color: rgba(255, 255, 255, 0.82);
          border: 1px solid rgba(255, 255, 255, 0.24);
          background:
            linear-gradient(180deg, rgba(255, 255, 255, 0.035), rgba(255, 255, 255, 0.008)),
            rgba(0, 0, 0, 0.16);
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.055em;
          text-transform: uppercase;
          text-decoration: none;
          backdrop-filter: blur(10px);
          transition:
            border-color 180ms ease,
            color 180ms ease,
            background 180ms ease,
            transform 180ms ease;
        }

        .secondaryButton::before,
        .secondaryButton::after {
          content: '+';
          position: absolute;
          top: -10px;
          color: rgba(255, 255, 255, 0.62);
          font-size: 12px;
          font-weight: 300;
        }

        .secondaryButton::before {
          left: -8px;
        }

        .secondaryButton::after {
          right: -8px;
        }

        .secondaryButton:hover {
          color: rgba(255, 255, 255, 0.9);
          border-color: rgba(255, 255, 255, 0.34);
          background: rgba(255, 255, 255, 0.05);
          transform: translateY(-1px);
        }

        .portfolioHeader {
          position: absolute;
          left: 0;
          top: 0;
          z-index: 12;
          width: 100%;
          height: 66px;
          padding: 0 34px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid rgba(255, 255, 255, 0.10);
          pointer-events: auto;
        }

        .portfolioBrand,
        .portfolioNav {
          display: flex;
          align-items: center;
          gap: 22px;
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.045em;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.82);
        }

        .portfolioNav a {
          color: rgba(255, 255, 255, 0.72);
          text-decoration: none;
          transition: color 140ms ease;
        }

        .portfolioNav a:hover {
          color: rgba(255, 255, 255, 1);
        }

        .brandGlyph {
          display: inline-flex;
          gap: 3px;
        }

        .brandGlyph i {
          width: 6px;
          height: 16px;
          display: block;
          background: rgba(255, 255, 255, 0.9);
          transform: skewY(23deg);
          font-style: normal;
        }

        .soundGlyph {
          width: 28px;
          height: 16px;
          opacity: 0.28;
          background:
            repeating-linear-gradient(
              90deg,
              rgba(255, 255, 255, 0.65) 0 2px,
              transparent 2px 5px
            );
        }

        .portfolioFrame {
          position: absolute;
          inset: 8px;
          z-index: 10;
          pointer-events: none;
        }

        .frameLine {
          position: absolute;
          background: rgba(255, 255, 255, 0.11);
        }

        .frameLineTop,
        .frameLineBottom {
          left: 0;
          right: 0;
          height: 1px;
        }

        .frameLineTop { top: 0; }
        .frameLineBottom { bottom: 0; }

        .frameLineLeft,
        .frameLineRight {
          top: 0;
          bottom: 0;
          width: 1px;
        }

        .frameLineLeft { left: 0; }
        .frameLineRight { right: 0; }

        .frameCorner {
          position: absolute;
          color: rgba(255, 255, 255, 0.58);
          font-size: 12px;
          line-height: 1;
        }

        .frameCornerTopLeft { top: -5px; left: -4px; }
        .frameCornerTopRight { top: -5px; right: -4px; }
        .frameCornerBottomLeft { bottom: -5px; left: -4px; }
        .frameCornerBottomRight { bottom: -5px; right: -4px; }

        .sideProgress {
          position: absolute;
          left: 18px;
          top: 34%;
          width: 34px;
          height: 255px;
          z-index: 11;
          pointer-events: none;
        }

        .sideProgressRail {
          position: absolute;
          left: 0;
          top: 0;
          width: 1px;
          height: 100%;
          display: block;
          background: rgba(255, 255, 255, 0.14);
        }

        .sideProgressFill {
          position: absolute;
          left: 0;
          top: 0;
          width: 1px;
          height: 100%;
          display: block;
          background: rgba(255, 255, 255, 0.92);
          transform: scaleY(0);
          transform-origin: top;
          will-change: transform;
          box-shadow: 0 0 10px rgba(255, 255, 255, 0.22);
        }

        .sideProgressTicks {
          position: absolute;
          inset: 0;
        }

        .sideProgressTick {
          position: absolute;
          left: 0;
          width: 26px;
          height: 1px;
          display: block;
          background: rgba(255, 255, 255, 0.24);
          transform: translateY(-0.5px);
          will-change: background, box-shadow;
        }

        .sideProgressTick::before {
          content: '';
          position: absolute;
          left: 0;
          top: -2px;
          width: 1px;
          height: 5px;
          background: rgba(255, 255, 255, 0.18);
        }

        .sideProgressTick.isActive {
          background: rgba(255, 255, 255, 0.92);
          box-shadow: 0 0 10px rgba(255, 255, 255, 0.24);
        }

        .overlayPanelStack {
          position: absolute;
          inset: 0;
          z-index: 8;
          pointer-events: none;
          overflow: hidden;
          perspective: 1200px;
          transform-style: preserve-3d;
          isolation: isolate;
        }

        .portalJourney {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          pointer-events: none;
          /* Perspective lives on .overlayPanelStack only — a single 3D context
             avoids nested-perspective compositing bugs (notably Safari). */
          transform-style: preserve-3d;
          isolation: isolate;
        }

        .portalJourney::before {
          content: '';
          position: absolute;
          left: 50%;
          top: 50%;
          width: min(76vw, 920px);
          height: min(76vw, 920px);
          border-radius: 50%;
          transform: translate(-50%, -50%);
          background:
            radial-gradient(circle, rgba(0, 0, 0, 0.12) 0 27%, rgba(255, 255, 255, 0.10) 36%, rgba(255, 255, 255, 0.032) 50%, transparent 70%),
            radial-gradient(circle, transparent 0 32%, rgba(255, 255, 255, 0.05) 43%, transparent 62%);
          box-shadow:
            inset 0 0 74px rgba(255, 255, 255, 0.055),
            0 0 92px rgba(255, 255, 255, 0.05);
          opacity: 0.72;
          z-index: 0;
          pointer-events: none;
        }

        .portalJourney::after {
          content: '';
          position: absolute;
          inset: -8%;
          z-index: 2;
          pointer-events: none;
          opacity: 0.08;
          mix-blend-mode: screen;
          background-image:
            url("data:image/svg+xml,%3Csvg viewBox='0 0 180 180' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.25' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='180' height='180' filter='url(%23n)' opacity='0.42'/%3E%3C/svg%3E"),
            radial-gradient(circle at 50% 50%, transparent 0 34%, rgba(0, 0, 0, 0.34) 62%, rgba(0, 0, 0, 0.86) 100%);
          background-size: 180px 180px, 100% 100%;
        }

        .portalMask {
          position: absolute;
          inset: 0;
          z-index: 0;
          pointer-events: none;
          background:
            radial-gradient(circle at 50% 50%, transparent 0 45%, rgba(0, 0, 0, 0.16) 66%, rgba(0, 0, 0, 0.58) 100%),
            linear-gradient(180deg, rgba(0, 0, 0, 0.16), transparent 34%, transparent 66%, rgba(0, 0, 0, 0.22));
        }

        .portalDepth {
          position: absolute;
          inset: 0;
          z-index: 1;
          pointer-events: none;
          transform-style: preserve-3d;
        }

        .overlayPanel {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: transparent;
          color: rgba(255, 255, 255, 0.94);
          will-change: transform, opacity;
          pointer-events: none;
        }

        .portalPanel {
          transform-origin: 50% 50%;
          transform-style: preserve-3d;
          backface-visibility: hidden;
        }

        /* Content layer — the full child component. It is governed only by the
           carrier's opacity/scale/z, so it stays visible (faint + small) during
           approach. No independent hiding, so there is never an empty portal frame. */
        .portalContent {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          height: 100%;
        }

        .overlayPanel::before {
          content: none;
        }

        .portalPanel::after {
          content: '';
          position: absolute;
          inset: -4%;
          z-index: 20;
          pointer-events: none;
          opacity: 0;
          transform: scale(0.96);
          mix-blend-mode: screen;
          background-image:
            url("data:image/svg+xml,%3Csvg viewBox='0 0 180 180' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.45' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='180' height='180' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E"),
            linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.22), transparent);
          background-size: 160px 160px, 100% 100%;
          -webkit-mask-image: radial-gradient(circle at 50% 46%, rgba(0, 0, 0, 0.95), rgba(0, 0, 0, 0.48) 42%, transparent 72%);
          mask-image: radial-gradient(circle at 50% 46%, rgba(0, 0, 0, 0.95), rgba(0, 0, 0, 0.48) 42%, transparent 72%);
        }

        .portalPanel.isAshExiting::after {
          animation: portalAshDrift 620ms ease-out both;
        }

        @keyframes portalAshDrift {
          0% {
            opacity: 0;
            transform: scale(0.96) translateY(0);
          }

          34% {
            opacity: 0.18;
          }

          100% {
            opacity: 0;
            transform: scale(1.08) translateY(-1.5%);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .portalPanel.isAshExiting::after {
            animation: none;
            opacity: 0;
          }
        }

        .overlayPanelContent {
          position: relative;
          z-index: 1;
          text-align: center;
          transform: translateY(-2vh);
          will-change: opacity, transform, filter;
        }

        .overlayPanelContent span {
          display: block;
          margin-bottom: 20px;
          color: rgba(255, 255, 255, 0.48);
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 0.14em;
          text-transform: uppercase;
        }

        .overlayPanelContent h2 {
          margin: 0;
          color: rgba(255, 255, 255, 0.96);
          font-size: clamp(82px, 15vw, 190px);
          line-height: 0.9;
          font-weight: 380;
          letter-spacing: -0.08em;
        }

        .overlayPanelContent p {
          width: min(84vw, 520px);
          margin: 30px auto 0;
          color: rgba(255, 255, 255, 0.68);
          font-size: 15px;
          line-height: 1.7;
        }

        .systemsIndexPanel {
          position: relative;
          width: min(92vw, 1180px);
          min-height: 68vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          color: rgba(255, 255, 255, 0.94);
          overflow: visible;
        }

        .systemsIndexLogo {
          position: absolute;
          left: 50%;
          top: 46%;
          width: min(26.4vw, 312px);
          height: min(26.4vw, 312px);
          transform: translate(-50%, -50%);
          opacity: 0.16;
          filter: blur(1px) drop-shadow(0 0 44px rgba(255, 255, 255, 0.12));
          pointer-events: none;
          z-index: 0;
        }

        .systemsIndexIntro,
        .systemsIndustryMatrix,
        .systemsCapabilities {
          position: relative;
          z-index: 1;
          will-change: opacity, transform, filter;
        }

        .systemsIndexEyebrow {
          display: block;
          margin-bottom: 18px;
          color: rgba(255, 255, 255, 0.44);
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.14em;
          text-transform: uppercase;
        }

        .systemsIndexIntro h2 {
          margin: 0;
          color: rgba(255, 255, 255, 0.94);
          font-size: clamp(42px, 5.6vw, 88px);
          line-height: 0.95;
          font-weight: 380;
          letter-spacing: -0.065em;
          text-transform: uppercase;
          text-wrap: balance;
        }

        .systemsIndexIntro p {
          width: min(84vw, 640px);
          margin: 26px auto 0;
          color: rgba(255, 255, 255, 0.68);
          font-size: clamp(14px, 1.2vw, 17px);
          line-height: 1.65;
        }

        .systemsIndustryMatrix {
          width: min(92vw, 980px);
          margin-top: 46px;
          display: grid;
          grid-template-columns: repeat(5, minmax(0, 1fr));
          gap: 12px;
        }

        .systemsIndustryItem {
          min-height: 52px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          border: 1px solid rgba(255, 255, 255, 0.13);
          background: rgba(255, 255, 255, 0.025);
          color: rgba(255, 255, 255, 0.72);
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.045em;
          text-transform: uppercase;
          backdrop-filter: blur(8px);
          cursor: pointer;
          pointer-events: auto;
          transition:
            border-color 180ms ease,
            background 180ms ease,
            color 180ms ease,
            transform 180ms ease;
        }

        .systemsIndustryItem:hover,
        .systemsIndustryItem:focus-visible,
        .systemsIndustryItem.isActive {
          color: rgba(255, 255, 255, 0.96);
          border-color: rgba(255, 255, 255, 0.42);
          background: rgba(255, 255, 255, 0.07);
          transform: translateY(-1px);
          outline: none;
        }

        .systemsIndustryItem b {
          color: rgba(255, 255, 255, 0.36);
          font-weight: 800;
        }

        .systemsIndustryItem.isActive b {
          color: rgba(255, 255, 255, 0.88);
        }

        .systemsCapabilities {
          margin-top: 34px;
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 10px;
        }

        .systemsCapabilities span {
          min-height: 38px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 0 18px;
          border-left: 1px solid rgba(255, 255, 255, 0.18);
          border-right: 1px solid rgba(255, 255, 255, 0.18);
          color: rgba(255, 255, 255, 0.62);
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.055em;
          text-transform: uppercase;
        }

        .systemsInsightFloatingPanel {
          position: absolute;
          left: 50%;
          top: 50%;
          z-index: 8;
          width: min(90vw, 880px);
          transform: translate(-50%, -50%);
          transform-origin: center center;
          padding: 22px 24px 20px;
          border: 1px solid rgba(255, 255, 255, 0.22);
          background: #0b0b0b;
          box-shadow:
            0 0 0 1px rgba(255, 255, 255, 0.08),
            0 36px 110px rgba(0, 0, 0, 0.82);
          color: rgba(255, 255, 255, 0.94);
          will-change: transform, filter;
          pointer-events: auto;
        }

.systemsInsightClose {
          position: absolute;
          top: 10px;
          right: 12px;
          z-index: 3;
          width: 28px;
          height: 28px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid rgba(255, 255, 255, 0.18);
          background: rgba(0, 0, 0, 0.28);
          color: rgba(255, 255, 255, 0.72);
          font-size: 18px;
          line-height: 1;
          cursor: pointer;
          transition:
            color 140ms ease,
            border-color 140ms ease;
        }

        .systemsInsightClose:hover,
        .systemsInsightClose:focus-visible {
          color: rgba(255, 255, 255, 0.96);
          border-color: rgba(255, 255, 255, 0.42);
          outline: none;
        }

        .systemsInsightHeader {
          display: grid;
          grid-template-columns: auto 1fr;
          gap: 6px 18px;
          align-items: baseline;
          text-align: left;
        }

        .systemsInsightHeader span,
        .systemsInsightLabel {
          color: rgba(255, 255, 255, 0.52);
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }

        .systemsInsightHeader h3 {
          margin: 0;
          color: rgba(255, 255, 255, 0.97);
          font-size: clamp(20px, 2vw, 30px);
          line-height: 1.1;
          font-weight: 500;
          letter-spacing: -0.03em;
          text-transform: uppercase;
        }

        .systemsInsightHeader p {
          grid-column: 2;
          margin: 6px 0 0;
          color: rgba(255, 255, 255, 0.78);
          font-size: 13px;
          line-height: 1.58;
        }

        .systemsInsightGrid {
          margin-top: 18px;
          display: grid;
          grid-template-columns: 1fr 1fr 1.15fr;
          gap: 14px;
          text-align: left;
        }

        .systemsInsightBlock,
        .systemsInsightSignal {
          min-height: 112px;
          padding: 14px;
          border: 1px solid rgba(255, 255, 255, 0.14);
          background: rgba(255, 255, 255, 0.04);
        }

        .systemsInsightTags {
          margin-top: 12px;
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .systemsInsightTags span {
          min-height: 28px;
          display: inline-flex;
          align-items: center;
          padding: 0 10px;
          border-left: 1px solid rgba(255, 255, 255, 0.24);
          border-right: 1px solid rgba(255, 255, 255, 0.24);
          color: rgba(255, 255, 255, 0.88);
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 0.045em;
          text-transform: uppercase;
        }

        .systemsInsightSignal {
          grid-column: 1 / -1;
          min-height: auto;
        }

        .systemsInsightSignal p {
          margin: 10px 0 0;
          color: rgba(255, 255, 255, 0.84);
          font-size: 13px;
          line-height: 1.58;
        }

        .systemsMetricRow {
          margin-top: 12px;
        }

        .systemsMetricTop {
          display: flex;
          justify-content: space-between;
          gap: 14px;
          color: rgba(255, 255, 255, 0.82);
          font-size: 11px;
          line-height: 1.2;
        }

        .systemsMetricTop b {
          color: rgba(255, 255, 255, 0.97);
          font-weight: 800;
        }

        .systemsMetricTrack {
          position: relative;
          margin-top: 7px;
          height: 2px;
          background: rgba(255, 255, 255, 0.18);
          overflow: hidden;
        }

        .systemsMetricTrack span {
          position: absolute;
          left: 0;
          top: 0;
          height: 2px;
          display: block;
          background: rgba(255, 255, 255, 0.92);
          box-shadow: 0 0 8px rgba(255, 255, 255, 0.38);
        }

        @media (max-width: 640px) {
          .coinHero {
            height: 100svh;
            min-height: 100svh;
            overflow: hidden;
            align-items: stretch;
          }

          .coinHero::before {
            width: 125vw;
            height: 125vw;
            opacity: 0.72;
            filter: blur(22px);
          }

          .overlayPanelStack,
          .portalJourney {
            perspective: 900px;
          }

          .portalJourney::before {
            width: 112vw;
            height: 112vw;
            opacity: 0.58;
          }

          .portalJourney::after {
            opacity: 0.07;
          }

          .canvasContainer {
            inset: 0;
            width: 100%;
            height: 100%;
            max-width: none;
            aspect-ratio: auto;
            transform: none;
            overflow: visible;
          }

          .heroContent {
            width: min(88vw, 420px);
            transform: translate(-50%, calc(-50% - 5px));
          }

          .portfolioHeader {
            height: 58px;
            padding: 0 18px;
          }

          .portfolioNav {
            display: none;
          }

          .portfolioFrame {
            inset: 6px;
          }

          .sideProgress {
            display: none;
          }

          .specializationContent {
            top: 50%;
            width: min(90vw, 430px);
          }

          .specializationInner {
            pointer-events: none;
          }

          .specializationKicker {
            margin-bottom: 18px;
            font-size: 10px;
            line-height: 1.6;
            letter-spacing: 0.075em;
          }

          .specializationKicker span {
            margin: 0 5px;
          }

          .specializationContent h2 {
            max-width: 390px;
            font-size: clamp(25px, 7.6vw, 36px);
            line-height: 1.2;
            letter-spacing: -0.045em;
          }

          .specializationContent p {
            width: min(86vw, 350px);
            margin-top: 20px;
            font-size: 13px;
            line-height: 1.58;
          }

          .specializationActions {
            margin-top: 26px;
            flex-direction: column;
            gap: 12px;
          }

          .specializationActions .telegramButton,
          .secondaryButton {
            min-width: 220px;
            height: 54px;
            font-size: 11px;
          }

          .brandMark {
            margin-bottom: 18px;
          }

          .brandMark span {
            width: 6px;
            height: 18px;
          }

          .heroContent h1 {
            font-size: clamp(24px, 8.1vw, 34px);
            line-height: 1.17;
            letter-spacing: 0.062em;
          }

          .heroContent p {
            width: min(84vw, 350px);
            margin-top: 18px;
            font-size: 13px;
            line-height: 1.6;
          }

          .heroEyebrow {
            margin-bottom: 14px;
            font-size: 9.5px;
            letter-spacing: 0.2em;
          }

          .heroActions {
            flex-direction: column;
            gap: 12px;
            margin-top: 26px;
            width: min(84vw, 320px);
          }

          .heroActions .telegramButton,
          .heroActions .secondaryButton {
            min-width: 0;
            width: 100%;
            height: 54px;
          }

          .heroTrustline {
            margin-top: 16px;
            font-size: 9px;
            letter-spacing: 0.1em;
          }

          .telegramButton {
            min-width: 210px;
            height: 54px;
            margin-top: 28px;
            font-size: 11px;
          }

          .loading {
            width: 132px;
            height: 132px;
            font-size: 10px;
          }

          .systemsIndexPanel {
            width: min(90vw, 430px);
            min-height: 70vh;
            justify-content: center;
          }

          .systemsIndexLogo {
            width: 56.4vw;
            height: 56.4vw;
            top: 48%;
            opacity: 0.10;
            filter: blur(2px) drop-shadow(0 0 28px rgba(255, 255, 255, 0.10));
          }

          .systemsIndexEyebrow {
            margin-bottom: 14px;
            font-size: 9px;
            line-height: 1.5;
          }

          .systemsIndexIntro h2 {
            font-size: clamp(34px, 11vw, 48px);
            line-height: 1;
            letter-spacing: -0.06em;
          }

          .systemsIndexIntro p {
            width: min(84vw, 340px);
            margin-top: 18px;
            font-size: 13px;
            line-height: 1.55;
          }

          .systemsIndustryMatrix {
            width: min(90vw, 390px);
            margin-top: 24px;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 8px;
          }

          .systemsIndustryItem {
            min-height: 42px;
            gap: 6px;
            padding: 0 8px;
            font-size: 8.5px;
            line-height: 1.22;
            letter-spacing: 0.025em;
          }

          .systemsInsightFloatingPanel {
            top: 50%;
            bottom: auto;
            left: 50%;
            width: min(94vw, 420px);
            transform: translate(-50%, -50%);
            padding: 14px 14px 12px;
            border-color: rgba(255, 255, 255, 0.2);
          }

          .systemsInsightHeader {
            display: block;
            text-align: left;
          }

          .systemsInsightHeader h3 {
            margin-top: 6px;
            font-size: 16px;
            line-height: 1.1;
          }

          .systemsInsightHeader p {
            margin-top: 6px;
            font-size: 11px;
            line-height: 1.45;
          }

          .systemsInsightGrid {
            margin-top: 10px;
            grid-template-columns: 1fr 1fr;
            gap: 8px;
          }

          .systemsInsightBlock,
          .systemsInsightSignal {
            min-height: auto;
            padding: 10px;
          }

          .systemsInsightSignal,
          .systemsInsightMetrics {
            grid-column: 1 / -1;
          }

          .systemsInsightTags {
            margin-top: 8px;
            gap: 6px;
          }

          .systemsInsightTags span {
            min-height: 24px;
            font-size: 8.5px;
            padding: 0 7px;
          }

          .systemsMetricRow {
            margin-top: 8px;
          }

          .systemsMetricTop {
            font-size: 10px;
          }

          .systemsCapabilities {
            width: min(90vw, 390px);
            margin-top: 24px;
            gap: 8px;
          }

          .systemsCapabilities span {
            min-height: 34px;
            padding: 0 12px;
            font-size: 9px;
            letter-spacing: 0.04em;
          }

        }
      `}</style>
    </section>
  );
}
