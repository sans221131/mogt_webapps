
'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

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


export default function CoinOrbitHero() {
  const canvasContainerRef = useRef<HTMLDivElement | null>(null);
  const sectionRef = useRef<HTMLElement | null>(null);
  const heroContentRef = useRef<HTMLDivElement | null>(null);
  const brandMarkRef = useRef<HTMLDivElement | null>(null);
  const headingRef = useRef<HTMLHeadingElement | null>(null);
  const subtitleRef = useRef<HTMLParagraphElement | null>(null);
  const ctaRef = useRef<HTMLAnchorElement | null>(null);
  const specializationRef = useRef<HTMLDivElement | null>(null);
  const specializationInnerRef = useRef<HTMLDivElement | null>(null);
  const specializationKickerRef = useRef<HTMLDivElement | null>(null);
  const specializationHeadingRef = useRef<HTMLHeadingElement | null>(null);
  const specializationTextRef = useRef<HTMLParagraphElement | null>(null);
  const specializationActionsRef = useRef<HTMLDivElement | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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
          orbitRadiusX: 2.35,
          orbitRadiusY: 3.95,
          coinScale: 1.75,
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

    const onPointerMove = (event: PointerEvent) => {
      const hitCoin = getIntersectedCoin(event);
      if (hitCoin !== hoveredCoin) {
        if (hoveredCoin) hoveredCoin.userData.targetScale = 1;
        hoveredCoin = hitCoin;

        if (hoveredCoin) {
          hoveredCoin.userData.targetScale = 1.13;
          flipCoin(hoveredCoin);
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

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const now = performance.now();

      const delta = lastFrameTime === 0 ? 0 : now - lastFrameTime;
      lastFrameTime = now;

      const smoothing = 0.085;
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
        const baseZ = THREE.MathUtils.lerp(-scrollState.depthSpread * 0.55, scrollState.depthSpread, depth);
        const forwardZ = scrollState.forwardPush * scrollState.progress * THREE.MathUtils.lerp(0.35, 1, depth);
        const unclampedZ = baseZ + forwardZ;
        const nearPadding = isMobileLayout() ? 0.48 : 0.72;
        const safeMaxZ = Math.max(0, camera.position.z - nearPadding);
        const z = Math.min(unclampedZ, safeMaxZ);

        const zoomOpacityBoost = THREE.MathUtils.lerp(0, 0.08, scrollState.progress);
        const baseOpacity = THREE.MathUtils.clamp(
          THREE.MathUtils.lerp(layout.opacityMin, layout.opacityMax, depth) + zoomOpacityBoost,
          0,
          0.96,
        );
        const opacity = THREE.MathUtils.clamp(
          baseOpacity * (1 - scrollState.coinFade),
          0,
          0.96,
        );

        coin.position.set(x, y, z);
        coin.userData.currentScale += (coin.userData.targetScale - coin.userData.currentScale) * 0.12;

        const depthScale = isMobileLayout()
          ? THREE.MathUtils.lerp(0.90, 1.34, depth)
          : THREE.MathUtils.lerp(0.94, 1.12, depth);
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
        token.rotation.x = 0;
        token.rotation.z = 0;

        if (coin.userData.isFlipping) {
          const elapsed = now - coin.userData.flipStartTime;
          const progress = Math.min(elapsed / FLIP_DURATION_MS, 1);
          const eased = easeInOutCubic(progress);
          token.rotation.y = coin.userData.flipStartY + (coin.userData.flipEndY - coin.userData.flipStartY) * eased;

          if (progress >= 1) {
            coin.userData.isFlipping = false;
            token.rotation.y %= Math.PI * 2;
          }
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
      requestAnimationFrame(() => {
        ScrollTrigger.refresh();
      });
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
      const scrollStart = isMobile ? 0 : 'top top';
      const scrollEnd = isMobile
        ? () => `+=${Math.round(window.innerHeight * 2.1)}`
        : () => `+=${Math.round(window.innerHeight * 2.6)}`;
      const revealBlur = isMobile ? 'blur(8px)' : 'blur(22px)';

      const transitionEnd = useMobileScrollTuning ? 0.64 : 0.66;
      const canvasFadeStart = useMobileScrollTuning ? 0.64 : 0.52;
      const canvasFadeDuration = useMobileScrollTuning ? 0.16 : 0.18;
      const specializationRevealStart = useMobileScrollTuning ? 0.72 : 0.68;

      const mobileTransitionTargets = {
        progress: 0.68, radiusBoost: 1.08, coinScaleBoost: 1.85, cameraPush: 0.70,
        orbitSpeedBoost: 0.18, depthSpread: 0.52, forwardPush: 0.92, faceForward: 0.82,
        exitSpread: 0.06, coinFade: 0,
      };

      const mobileFinalTargets = {
        progress: 1, radiusBoost: 1.16, coinScaleBoost: 2.28, cameraPush: 0.64,
        orbitSpeedBoost: 0.10, depthSpread: 0.72, forwardPush: 1.28, faceForward: 0.92,
        exitSpread: 0.18, coinFade: 1,
      };

      const desktopTransitionTargets = {
        progress: 0.72, radiusBoost: 1.16, coinScaleBoost: 1.55, cameraPush: 0.74,
        orbitSpeedBoost: 0.24, depthSpread: 0.38, forwardPush: 0.68, faceForward: 0.72, exitSpread: 0.12,
      };

      const desktopFinalTargets = {
        progress: 1, radiusBoost: 1.22, coinScaleBoost: 1.55, cameraPush: 0.76,
        orbitSpeedBoost: 0.14, depthSpread: 0.28, forwardPush: 0.42, faceForward: 0.78, exitSpread: 0.18,
      };

      const transitionTargets = useMobileScrollTuning ? mobileTransitionTargets : desktopTransitionTargets;
      const finalTargets = useMobileScrollTuning ? mobileFinalTargets : desktopFinalTargets;

      if (process.env.NODE_ENV === 'development') {
        console.log('Coin scroll tuning', { isMobile, isTouchDevice, useMobileScrollTuning, transitionTargets, finalTargets });
      }

      gsapCtx = gsap.context(() => {
        gsap.set(specializationInnerRef.current, {
          autoAlpha: 0,
          y: isMobile ? 44 : 72,
          scale: 0.975,
          filter: revealBlur,
          pointerEvents: 'none',
        });

        gsap.set([
          specializationKickerRef.current,
          specializationHeadingRef.current,
          specializationTextRef.current,
          specializationActionsRef.current,
        ], { autoAlpha: 0, y: isMobile ? 18 : 26 });

        gsap.set(specializationActionsRef.current, { pointerEvents: 'none' });

        scrollTimeline = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: scrollStart,
            end: scrollEnd,
            scrub: isMobile ? 0.55 : 0.9,
            pin: shouldPin,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            fastScrollEnd: true,
          },
        });

        scrollTimeline
          // Coin zoom: two-stage
          .to(scrollStateTarget, { ...transitionTargets, ease: 'none', duration: transitionEnd }, 0)
          .to(scrollStateTarget, { ...finalTargets, ease: 'none', duration: 1 - transitionEnd }, transitionEnd)

          // Canvas container fade (mobile: 64%→80%, desktop: 52%→70%)
          .to(canvasContainerRef.current, { opacity: 0, pointerEvents: 'none', ease: 'none', duration: canvasFadeDuration }, canvasFadeStart)

          // Original hero fade
          .to(ctaRef.current, { opacity: 0, y: -12, scale: 0.96, pointerEvents: 'none', duration: 0.18, ease: 'none' }, 0.08)
          .to(subtitleRef.current, { opacity: 0, y: -16, scale: 0.97, duration: 0.22, ease: 'none' }, 0.18)
          .to(headingRef.current, { opacity: 0, y: -22, scale: 0.975, duration: 0.28, ease: 'none' }, 0.28)
          .to(brandMarkRef.current, { opacity: 0, y: -18, scale: 0.96, duration: 0.24, ease: 'none' }, 0.34)

          // Specialization reveal
          .to(specializationInnerRef.current, { autoAlpha: 1, y: 0, scale: 1, filter: 'blur(0px)', pointerEvents: 'auto', duration: 0.30, ease: 'none' }, specializationRevealStart)
          .to(specializationKickerRef.current, { autoAlpha: 1, y: 0, duration: 0.14, ease: 'none' }, specializationRevealStart + 0.02)
          .to(specializationHeadingRef.current, { autoAlpha: 1, y: 0, duration: 0.22, ease: 'none' }, specializationRevealStart + 0.06)
          .to(specializationTextRef.current, { autoAlpha: 1, y: 0, duration: 0.18, ease: 'none' }, specializationRevealStart + 0.16)
          .to(specializationActionsRef.current, { autoAlpha: 1, y: 0, pointerEvents: 'auto', duration: 0.16, ease: 'none' }, specializationRevealStart + 0.23);

        // Desktop-only explicit coin fade; mobile uses coinFade baked into mobileFinalTargets
        if (!useMobileScrollTuning) {
          scrollTimeline.to(scrollStateTarget, { coinFade: 1, ease: 'none', duration: 0.16 }, 0.48);
        }
      }, sectionRef);

      requestAnimationFrame(() => {
        ScrollTrigger.refresh();
      });
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

  return (
    <section ref={sectionRef} className="coinHero" aria-label="Product design hero section">
      <div
        ref={canvasContainerRef}
        className="canvasContainer"
        role="img"
        aria-label="Ten large monochrome industry medallions arranged around product design copy."
      />

      {isLoading ? <div className="loading">Loading coins</div> : null}

      <header className="portfolioHeader" aria-label="Portfolio navigation">
        <div className="portfolioBrand">
          <span className="brandGlyph">
            <i />
            <i />
            <i />
          </span>
          <span>Matvey An</span>
          <span className="soundGlyph" aria-hidden="true" />
        </div>
        <nav className="portfolioNav">
          <a href="/cv">CV</a>
          <a href="https://behance.net/" target="_blank" rel="noreferrer">Behance</a>
          <a href="https://dribbble.com/" target="_blank" rel="noreferrer">Dribbble</a>
          <a href="https://linkedin.com/" target="_blank" rel="noreferrer">LinkedIn</a>
          <a href="mailto:hello@example.com">Mail</a>
        </nav>
      </header>

      <div ref={heroContentRef} className="heroContent">
        <div ref={brandMarkRef} className="brandMark" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>

        <h1 ref={headingRef}>
          Product Design for Capital,
          <br />
          Data &amp; Control
        </h1>

        <p ref={subtitleRef}>
          I design fintech platforms, data-heavy dashboards, and operational systems
          for teams making high-stakes decisions.
        </p>

        <a ref={ctaRef} className="telegramButton" href="https://t.me/" target="_blank" rel="noreferrer">
          Write to Telegram
        </a>
      </div>

      <div ref={specializationRef} className="specializationContent" aria-label="Specialization summary">
        <div ref={specializationInnerRef} className="specializationInner">
          <div ref={specializationKickerRef} className="specializationKicker">
            Neo Banking <span>/</span> Brokerage <span>/</span> Trading <span>/</span> Investment <span>/</span> Crypto
          </div>

          <h2 ref={specializationHeadingRef}>
            I specialize in mobile app design, design-system development, and complex web interfaces for financial products
          </h2>

          <p ref={specializationTextRef}>
            I&apos;m currently open to full-time Senior / Lead Product Designer roles in fintech,
            investment, or infrastructure products. I&apos;m also available for selected high-impact contract work.
          </p>

          <div ref={specializationActionsRef} className="specializationActions">
            <a className="telegramButton" href="https://t.me/" target="_blank" rel="noreferrer">
              Write to Telegram
            </a>
            <a className="secondaryButton" href="/cv">
              Download CV
            </a>
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
        <div className="sideBracket sideBracketLeft" />
        <div className="telemetryPanel">
          <span>Cursor X:</span><b>1652</b>
          <span>Cursor Y:</span><b>630</b>
          <span>Scroll:</span><b>0.115</b>
          <span>Time:</span><b>44450.0s</b>
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
          width: min(100vw, 100vw);
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
          opacity: 0;
          visibility: hidden;
          pointer-events: none;
          transform: translateY(72px) scale(0.975);
          filter: blur(22px);
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
        .heroContent h1,
        .heroContent p,
        .telegramButton,
        .specializationKicker,
        .specializationContent h2,
        .specializationContent p,
        .specializationActions {
          will-change: opacity, transform;
        }

        .specializationKicker,
        .specializationContent h2,
        .specializationContent p,
        .specializationActions {
          opacity: 0;
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

        .sideBracketLeft {
          position: absolute;
          left: 14px;
          top: 34%;
          width: 1px;
          height: 255px;
          border-left: 1px solid rgba(255, 255, 255, 0.16);
        }

        .sideBracketLeft::before,
        .sideBracketLeft::after {
          content: '';
          position: absolute;
          left: 0;
          width: 22px;
          height: 1px;
          background: rgba(255, 255, 255, 0.16);
        }

        .sideBracketLeft::before { top: 0; }
        .sideBracketLeft::after { bottom: 0; }

        .telemetryPanel {
          position: absolute;
          right: 0;
          bottom: 0;
          width: 330px;
          height: 58px;
          padding: 12px 18px;
          display: grid;
          grid-template-columns: auto 1fr auto 1fr;
          gap: 6px 18px;
          align-items: center;
          border-top: 1px solid rgba(255, 255, 255, 0.12);
          border-left: 1px solid rgba(255, 255, 255, 0.12);
          color: rgba(255, 255, 255, 0.54);
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 0.055em;
          text-transform: uppercase;
        }

        .telemetryPanel b {
          color: rgba(255, 255, 255, 0.88);
          font-weight: 800;
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

          .telemetryPanel {
            display: none;
          }

          .sideBracketLeft {
            display: none;
          }

          .specializationContent {
            top: 50%;
            width: min(90vw, 430px);
          }

          .specializationInner {
            transform: translateY(44px) scale(0.975);
            filter: blur(8px);
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

        }
      `}</style>
    </section>
  );
}
