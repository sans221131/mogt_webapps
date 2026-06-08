import { type CSSProperties } from 'react';

const LOGO = '/Logo.svg';

// Each band is the FULL logo clipped to one vertical slice; together they
// reconstruct the whole mark. Each flies in from a direction (set via CSS
// custom props consumed by the `mogtBandIn` keyframe) on a staggered delay.
// Outer bands land first, the centre last. All animation is pure CSS
// (transform + opacity) so it runs on the compositor and stays smooth even
// while the main thread is busy decoding the 3D model.
const BANDS: Array<{ tx: string; ty: string; r: string; s: string; d: string; clip: string }> = [
  { tx: '-90px', ty: '6px',  r: '-5deg', s: '0.9',  d: '0s',    clip: 'inset(0% 81% 0% 0%)' },
  { tx: '0px',   ty: '-90px', r: '0deg', s: '0.92', d: '0.12s', clip: 'inset(0% 61% 0% 19%)' },
  { tx: '0px',   ty: '96px',  r: '0deg', s: '0.92', d: '0.2s',  clip: 'inset(0% 41% 0% 39%)' },
  { tx: '0px',   ty: '-90px', r: '0deg', s: '0.92', d: '0.14s', clip: 'inset(0% 21% 0% 59%)' },
  { tx: '90px',  ty: '6px',   r: '5deg', s: '0.9',  d: '0.04s', clip: 'inset(0% 0% 0% 79%)' },
];

export default function AnimatedMogtLogo() {
  return (
    <div className="mogtLogo" role="img" aria-label="MOGT">
      <span className="mogtGlow" aria-hidden />
      {BANDS.map((b, i) => (
        <img
          key={i}
          className="mogtBand"
          src={LOGO}
          alt=""
          aria-hidden
          draggable={false}
          style={
            {
              '--tx': b.tx,
              '--ty': b.ty,
              '--r': b.r,
              '--s': b.s,
              '--d': b.d,
              clipPath: b.clip,
              WebkitClipPath: b.clip,
            } as CSSProperties
          }
        />
      ))}
      <span className="mogtShineWrap" aria-hidden>
        <span className="mogtShine" />
      </span>
    </div>
  );
}
