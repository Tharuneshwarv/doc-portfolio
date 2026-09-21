import React, { useEffect, useRef, useState } from 'react';

interface LiquidDistortionFilterProps {
  children?: React.ReactNode;
}

export const LiquidDistortionFilter: React.FC<LiquidDistortionFilterProps> = ({ children }) => {
  const [scale, setScale] = useState(0);
  const [frequency, setFrequency] = useState(0.012);
  const animFrameRef = useRef<number | null>(null);

  useEffect(() => {
    let lastScrollY = window.scrollY;
    let lastTime = performance.now();
    let targetScale = 0;
    let currentScale = 0;

    const onScroll = () => {
      const now = performance.now();
      const dt = Math.max(1, now - lastTime);
      const dy = window.scrollY - lastScrollY;
      lastScrollY = window.scrollY;
      lastTime = now;

      // Compute scroll velocity (pixels per millisecond)
      const velocity = Math.abs(dy) / dt;
      // Active Theory smooth liquid wave intensity
      targetScale = Math.min(22, velocity * 14.0);
    };

    const onClick = () => {
      // Impulse ripple shockwave on click
      targetScale = Math.max(targetScale, 18);
    };

    const updateLoop = () => {
      // Silkier cinematic lerp decay for liquid relaxation
      currentScale += (targetScale - currentScale) * 0.08;
      targetScale *= 0.88; // Gentle fluid dampening

      if (currentScale < 0.08) {
        currentScale = 0;
      }

      setScale(currentScale);

      // Organic fluid frequency oscillation
      const time = performance.now() * 0.0015;
      setFrequency(0.012 + Math.sin(time) * 0.002);

      animFrameRef.current = requestAnimationFrame(updateLoop);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('click', onClick);
    animFrameRef.current = requestAnimationFrame(updateLoop);

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('click', onClick);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  return (
    <>
      {/* Dynamic SVG Liquid Displacement Shader Filter */}
      <svg className="fixed top-0 left-0 w-0 h-0 pointer-events-none opacity-0 z-[-1]" aria-hidden="true">
        <defs>
          <filter id="active-theory-liquid-distortion" x="-20%" y="-20%" width="140%" height="140%" filterUnits="objectBoundingBox">
            <feTurbulence
              type="fractalNoise"
              baseFrequency={`${frequency} ${frequency * 1.5}`}
              numOctaves="2"
              result="noise"
              seed="5"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale={scale}
              xChannelSelector="R"
              yChannelSelector="G"
              result="displaced"
            />
          </filter>
        </defs>
      </svg>

      {children}
    </>
  );
};
