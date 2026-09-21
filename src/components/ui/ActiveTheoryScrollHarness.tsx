import React, { useEffect, useRef, useState } from 'react';

interface ActiveTheoryScrollHarnessProps {
  children: React.ReactNode;
}

export const ActiveTheoryScrollHarness: React.FC<ActiveTheoryScrollHarnessProps> = ({ children }) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [scrollVelocity, setScrollVelocity] = useState<number>(0);
  const [aberrationOffset, setAberrationOffset] = useState<number>(0);
  const [displacementScale, setDisplacementScale] = useState<number>(0);
  const [frequency, setFrequency] = useState<number>(0.012);

  useEffect(() => {
    let lastScrollY = window.scrollY;
    let targetVelocity = 0;
    let currentVelocity = 0;
    let animId: number;

    const onScroll = () => {
      const currentY = window.scrollY;
      const dy = currentY - lastScrollY;
      lastScrollY = currentY;

      // Calculate instantaneous scroll velocity
      targetVelocity = dy * 0.45;
    };

    const onWheel = (e: WheelEvent) => {
      // Direct wheel delta capture for extra responsiveness
      targetVelocity = e.deltaY * 0.12;
    };

    const updateLoop = () => {
      // Smooth kinetic lerp decay
      currentVelocity += (targetVelocity - currentVelocity) * 0.1;
      targetVelocity *= 0.86; // Quick fluid dampening

      const absVel = Math.abs(currentVelocity);

      if (absVel < 0.05) {
        currentVelocity = 0;
      }

      setScrollVelocity(currentVelocity);

      // 1. Dynamic Liquid Displacement scale based on scroll speed (capped at 16px to maintain legibility)
      const liquidScale = Math.min(16, absVel * 1.8);
      setDisplacementScale(liquidScale);

      // 2. Chromatic aberration RGB split offset (0 to 3.5px during fast scrolls)
      const chroma = Math.min(3.5, absVel * 0.35);
      setAberrationOffset(chroma);

      // 3. Fluid frequency turbulence wave oscillation
      const time = performance.now() * 0.002;
      setFrequency(0.01 + Math.sin(time) * 0.003);

      animId = requestAnimationFrame(updateLoop);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('wheel', onWheel, { passive: true });
    animId = requestAnimationFrame(updateLoop);

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('wheel', onWheel);
      cancelAnimationFrame(animId);
    };
  }, []);

  // Compute 3D pitch tilt based on scroll velocity (max ±4.5 deg)
  const pitchTilt = Math.max(-4.5, Math.min(4.5, -scrollVelocity * 0.22));

  return (
    <>
      {/* SVG Filters: Liquid Displacement + Chromatic Aberration */}
      <svg className="fixed top-0 left-0 w-0 h-0 pointer-events-none opacity-0 z-[-1]" aria-hidden="true">
        <defs>
          {/* Active Theory Fluid Turbulence Map */}
          <filter id="active-theory-liquid-distortion" x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency={`${frequency} ${frequency * 1.4}`}
              numOctaves="2"
              result="noise"
              seed="7"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale={displacementScale}
              xChannelSelector="R"
              yChannelSelector="G"
              result="displaced"
            />
          </filter>

          {/* Active Theory Chromatic Aberration RGB Offset */}
          <filter id="active-theory-chromatic-aberration" x="-10%" y="-10%" width="120%" height="120%">
            {/* Red Channel Shift */}
            <feOffset in="SourceGraphic" dx={aberrationOffset} dy={0} result="redShift" />
            <feColorMatrix
              in="redShift"
              type="matrix"
              values="1 0 0 0 0
                      0 0 0 0 0
                      0 0 0 0 0
                      0 0 0 1 0"
              result="redOnly"
            />

            {/* Cyan/Blue Channel Shift */}
            <feOffset in="SourceGraphic" dx={-aberrationOffset} dy={0} result="cyanShift" />
            <feColorMatrix
              in="cyanShift"
              type="matrix"
              values="0 0 0 0 0
                      0 1 0 0 0
                      0 0 1 0 0
                      0 0 0 1 0"
              result="cyanOnly"
            />

            {/* Merge Channels */}
            <feBlend in="redOnly" in2="cyanOnly" mode="screen" result="blended" />
            <feBlend in="blended" in2="SourceGraphic" mode="multiply" />
          </filter>
        </defs>
      </svg>

      {/* Main Kinetic Spatial Wrapper with 3D Pitch Incline & Liquid Shaders */}
      <div
        ref={contentRef}
        style={{
          transform: Math.abs(pitchTilt) > 0.05 ? `perspective(1200px) rotateX(${pitchTilt}deg)` : 'none',
          transformOrigin: '50% 50%',
          filter: displacementScale > 0.8 ? 'url(#active-theory-liquid-distortion)' : 'none',
          transition: 'transform 0.15s ease-out',
          willChange: 'transform, filter',
        }}
        className="w-full relative"
      >
        {children}
      </div>
    </>
  );
};
