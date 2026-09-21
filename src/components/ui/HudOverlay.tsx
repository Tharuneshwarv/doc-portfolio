import React, { useEffect, useState } from 'react';

export const HudOverlay: React.FC = () => {
  const [fps, setFps] = useState(60);
  const [scrollPercent, setScrollPercent] = useState(0);

  useEffect(() => {
    let frameCount = 0;
    let lastTime = performance.now();
    let animId: number;

    const calcFps = (now: number) => {
      frameCount++;
      if (now - lastTime >= 1000) {
        setFps(Math.round((frameCount * 1000) / (now - lastTime)));
        frameCount = 0;
        lastTime = now;
      }
      animId = requestAnimationFrame(calcFps);
    };
    animId = requestAnimationFrame(calcFps);

    const onScroll = () => {
      const total = document.body.scrollHeight - window.innerHeight || 1;
      setScrollPercent(Math.round((window.scrollY / total) * 100));
    };

    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-30 select-none">
      {/* Top Left Active Theory Telemetry */}
      <div className="absolute top-20 left-6 hidden xl:flex items-center gap-2 font-mono text-[10px] text-teal-800/80 tracking-wider bg-white/80 backdrop-blur-md px-3 py-1 rounded-full border border-teal-200/80 shadow-sm">
        <span className="text-brand-teal font-bold">[ + ]</span>
        <span>LAT: 28.6139° N // LON: 77.2090° E [NEW DELHI HQ]</span>
      </div>

      {/* Top Right System Status */}
      <div className="absolute top-20 right-6 hidden xl:flex items-center gap-2 font-mono text-[10px] text-teal-800/80 tracking-wider bg-white/80 backdrop-blur-md px-3 py-1 rounded-full border border-teal-200/80 shadow-sm">
        <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping"></span>
        <span>ENGINE: {fps} FPS // WEBGL SPATIAL</span>
        <span className="text-brand-teal font-bold">[ + ]</span>
      </div>

      {/* Bottom Left Cardiac HUD */}
      <div className="absolute bottom-6 left-6 hidden lg:flex items-center gap-3 font-mono text-[11px] text-slate-700 bg-white/85 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-teal-200/80 shadow-md">
        <span className="text-brand-teal font-bold">[ CARDIAC TELEMETRY ]</span>
        <span className="text-slate-300">•</span>
        <span className="text-emerald-600 font-semibold">72 BPM SINUS</span>
      </div>

      {/* Bottom Right Scroll Depth */}
      <div className="absolute bottom-6 right-28 hidden lg:flex items-center gap-2 font-mono text-[11px] text-slate-700 bg-white/85 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-teal-200/80 shadow-md">
        <span>SPATIAL DEPTH:</span>
        <span className="text-brand-teal font-bold">{scrollPercent}%</span>
      </div>
    </div>
  );
};
