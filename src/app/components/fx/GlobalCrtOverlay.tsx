export function GlobalCrtOverlay() {
  return (
    <div className="crt-overlay" aria-hidden="true">
      <div className="crt-depth-glow" />
      <div className="crt-grain" />
      <div className="crt-dust" />
      <div className="crt-scanlines" />
      <div className="crt-pixel-grid" />
      <div className="crt-top-light" />
      <div className="crt-vignette" />
      <div className="crt-edge-falloff" />

      {/* animation phase 1 */}
      <div className="crt-sweep-glitch" />

      {/* animation phase 2 */}
      <div className="crt-distortion-zone crt-distortion-top" />
      <div className="crt-distortion-zone crt-distortion-middle" />
      <div className="crt-distortion-zone crt-distortion-bottom" />
    </div>
  );
}
