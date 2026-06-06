'use client';

import { useLayoutEffect, useRef } from 'react';
import type { CSSProperties } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

// ── Inline styles for section content ────────────────────────────
// Must be inline (not styled-jsx) because these components render
// inside StackedPanelSections where styled-jsx scope doesn't reach.

const contentStyle: CSSProperties = {
  textAlign: 'center',
  transform: 'translateY(-2vh)',
};

const tagStyle: CSSProperties = {
  display: 'block',
  marginBottom: '18px',
  color: 'rgba(255,255,255,0.45)',
  fontSize: '12px',
  letterSpacing: '0.14em',
  textTransform: 'uppercase',
  fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Courier New", monospace',
  fontWeight: 700,
};

const letterStyle: CSSProperties = {
  margin: 0,
  fontSize: 'clamp(76px, 14vw, 180px)',
  lineHeight: 0.9,
  fontWeight: 400,
  letterSpacing: '-0.08em',
  color: 'rgba(255,255,255,0.88)',
};

const descStyle: CSSProperties = {
  margin: '28px auto 0',
  maxWidth: '520px',
  color: 'rgba(255,255,255,0.65)',
  fontSize: '15px',
  lineHeight: 1.7,
};

// ── Section content components ────────────────────────────────────

export function SectionA() {
  return (
    <div style={contentStyle}>
      <span style={tagStyle}>Section A</span>
      <h2 style={letterStyle}>A</h2>
      <p style={descStyle}>Placeholder section A</p>
    </div>
  );
}

export function SectionB() {
  return (
    <div style={contentStyle}>
      <span style={tagStyle}>Section B</span>
      <h2 style={letterStyle}>B</h2>
      <p style={descStyle}>Placeholder section B</p>
    </div>
  );
}

export function SectionC() {
  return (
    <div style={contentStyle}>
      <span style={tagStyle}>Section C</span>
      <h2 style={letterStyle}>C</h2>
      <p style={descStyle}>Placeholder section C</p>
    </div>
  );
}

export function SectionD() {
  return (
    <div style={contentStyle}>
      <span style={tagStyle}>Section D</span>
      <h2 style={letterStyle}>D</h2>
      <p style={descStyle}>Placeholder section D</p>
    </div>
  );
}

// ── Panel data ────────────────────────────────────────────────────

const SECTIONS = [
  { Component: SectionA, key: 'a', label: 'Section A' },
  { Component: SectionB, key: 'b', label: 'Section B' },
  { Component: SectionC, key: 'c', label: 'Section C' },
  { Component: SectionD, key: 'd', label: 'Section D' },
];

// ── StackedPanelSections ──────────────────────────────────────────

export function StackedPanelSections() {
  const stackRef = useRef<HTMLElement | null>(null);
  const panelRefs = useRef<HTMLDivElement[]>([]);

  const setPanelRef = (element: HTMLDivElement | null, index: number) => {
    if (element) panelRefs.current[index] = element;
  };

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const panels = panelRefs.current;

      gsap.set(panels, {
        yPercent: 100,
        autoAlpha: 1,
        filter: 'blur(14px)',
      });

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: stackRef.current,
          start: 'top top',
          end: () => `+=${window.innerHeight * panels.length}`,
          scrub: 0.45,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      panels.forEach((panel, index) => {
        timeline.to(
          panel,
          {
            yPercent: 0,
            filter: 'blur(0px)',
            duration: 1,
            ease: 'none',
          },
          index,
        );
      });
    }, stackRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={stackRef} className="panelStack" aria-label="Portfolio sections">
      {SECTIONS.map(({ Component, key, label }, index) => (
        <div
          key={key}
          ref={(element) => setPanelRef(element, index)}
          className="panel"
          style={{ zIndex: index + 1 }}
          aria-label={label}
        >
          <Component />
        </div>
      ))}

      <style jsx>{`
        .panelStack {
          position: relative;
          height: 100vh;
          overflow: hidden;
          background: #050505;
        }

        .panel {
          position: absolute;
          inset: 0;
          height: 100vh;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #050505;
          color: white;
          border-top: 1px solid rgba(255, 255, 255, 0.10);
          will-change: transform, opacity, filter;
        }
      `}</style>
    </section>
  );
}
