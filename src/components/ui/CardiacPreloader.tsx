import React, { useEffect, useState } from 'react';
import { Heart, Activity, ShieldCheck } from 'lucide-react';
import { soundManager } from '../sound/SoundFX';

interface CardiacPreloaderProps {
  onComplete?: () => void;
}

export const CardiacPreloader: React.FC<CardiacPreloaderProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [stageText, setStageText] = useState('CALIBRATING CARDIAC FREQUENCY OSCILLATOR...');
  const [isDone, setIsDone] = useState(false);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    const duration = 2200; // 2.2s total smooth calibration sequence
    const intervalTime = 25;
    const increment = 100 / (duration / intervalTime);

    const timer = setInterval(() => {
      setProgress((prev) => {
        const next = Math.min(100, prev + increment + (Math.random() * 0.6));
        
        if (next >= 25 && next < 55) {
          setStageText('SYNCHRONIZING 12-LEAD TELEMETRY // NEW DELHI...');
        } else if (next >= 55 && next < 85) {
          setStageText('INITIALIZING 3D SPATIAL PARTICLES & ECG LAB...');
        } else if (next >= 85) {
          setStageText('CLINICAL SUITE READY // DR. ANIL SHARMA, MD, DM');
        }

        if (next >= 100) {
          clearInterval(timer);
          soundManager.playHeartbeat(0.3);
          setTimeout(() => {
            setIsFading(true);
            setTimeout(() => {
              setIsDone(true);
              if (onComplete) onComplete();
            }, 600);
          }, 350);
          return 100;
        }
        return next;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [onComplete]);

  if (isDone) return null;

  return (
    <div
      style={{
        transition: 'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
        opacity: isFading ? 0 : 1,
        transform: isFading ? 'scale(1.04)' : 'scale(1)',
        pointerEvents: isFading ? 'none' : 'all',
      }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#F8FAFC] text-slate-900 overflow-hidden"
    >
      {/* Background Animated Spatial Grid */}
      <div className="absolute inset-0 spatial-grid-bg opacity-70 pointer-events-none"></div>

      {/* Subtle Radial Glow */}
      <div className="absolute w-[500px] h-[500px] rounded-full bg-teal-200/35 blur-3xl pointer-events-none animate-pulse"></div>

      {/* Center Cardiology Hologram Chamber */}
      <div className="relative z-10 flex flex-col items-center max-w-md w-full px-6 text-center space-y-6">
        
        {/* Pulsing Stethoscope / Heart Chamber */}
        <div className="relative flex items-center justify-center">
          
          {/* Animated Concentric Rings */}
          <div className="absolute w-36 h-36 rounded-full border border-teal-300/40 animate-ping opacity-30"></div>
          <div className="absolute w-28 h-28 rounded-full border border-teal-400/50 animate-pulse"></div>
          
          {/* Central Heart Icon with beat oscillation */}
          <div className="relative flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-tr from-[#0A4D52] to-[#0D9488] text-white shadow-2xl shadow-teal-900/30 border border-teal-200">
            <Heart className="h-10 w-10 text-white fill-white animate-bounce" />
            <div className="absolute -top-1 -right-1 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500"></span>
            </div>
          </div>
        </div>

        {/* Live ECG Wave Trace SVG Line */}
        <div className="w-full max-w-[280px] h-12 relative overflow-hidden rounded-xl bg-slate-900/90 border border-teal-800/40 p-1 flex items-center shadow-lg">
          <svg
            viewBox="0 0 300 50"
            className="w-full h-full text-cyan-400"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {/* 12-Lead Real P-Q-R-S-T Animated Path */}
            <path
              d="M0,25 L40,25 L50,18 L60,32 L70,25 L90,25 L100,5 L110,45 L120,25 L140,25 L155,14 L170,25 L210,25 L220,18 L230,32 L240,25 L260,25 L270,5 L280,45 L290,25 L300,25"
              className="animate-dash"
              strokeDasharray="300"
              strokeDashoffset="0"
            />
          </svg>
          <div className="absolute top-1 right-2 text-[9px] font-mono text-teal-300 font-bold">
            LEAD II • 72 BPM
          </div>
        </div>

        {/* Doctor Identity & Calibration Details */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-center gap-1.5 text-xs font-mono font-bold text-[#0A4D52]">
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
            <span>DR. ANIL SHARMA // CARDIOLOGY</span>
          </div>
          <div className="text-[11px] font-mono text-slate-500 tracking-wider">
            AIIMS GOLD MEDALIST • SENIOR CONSULTANT
          </div>
        </div>

        {/* Progress Metric & Stage Text */}
        <div className="w-full space-y-2">
          <div className="flex items-center justify-between text-xs font-mono font-bold text-slate-700">
            <span>[ SYSTEM CALIBRATION ]</span>
            <span className="text-[#0A4D52] font-mono text-sm">{Math.floor(progress)}%</span>
          </div>

          {/* Micro Progress Bar */}
          <div className="h-2 w-full bg-slate-200/90 rounded-full overflow-hidden p-0.5 border border-slate-300/80">
            <div
              className="h-full bg-gradient-to-r from-[#0A4D52] via-[#0D9488] to-emerald-500 rounded-full transition-all duration-75"
              style={{ width: `${progress}%` }}
            ></div>
          </div>

          {/* Dynamic Status Text */}
          <div className="text-[10px] font-mono font-semibold text-slate-500 tracking-tight pt-1 flex items-center justify-center gap-1.5">
            <Activity className="h-3 w-3 text-teal-600 animate-spin" />
            <span>{stageText}</span>
          </div>
        </div>

      </div>
    </div>
  );
};
