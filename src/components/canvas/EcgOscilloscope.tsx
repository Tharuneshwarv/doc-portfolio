import React, { useEffect, useRef, useState } from 'react';
import { Activity, Heart, Volume2, VolumeX } from 'lucide-react';
import { soundManager } from '../sound/SoundFX';

interface EcgOscilloscopeProps {
  initialBpm?: number;
  onBpmChange?: (bpm: number) => void;
}

export const EcgOscilloscope: React.FC<EcgOscilloscopeProps> = ({
  initialBpm = 72,
  onBpmChange,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [bpm, setBpm] = useState(initialBpm);
  const [isMuted, setIsMuted] = useState(soundManager.getMuted());
  const [rhythmMode, setRhythmMode] = useState<'normal' | 'rest' | 'active' | 'athlete'>('normal');
  const [vitals, setVitals] = useState({
    bp: '120/80',
    spo2: '99%',
    cardiacOutput: '5.4 L/min',
    prInterval: '160 ms',
    qrsDuration: '88 ms',
    qtInterval: '380 ms'
  });

  const handleBpmUpdate = (newBpm: number) => {
    setBpm(newBpm);
    if (onBpmChange) onBpmChange(newBpm);
  };

  const handlePreset = (mode: 'normal' | 'rest' | 'active' | 'athlete') => {
    setRhythmMode(mode);
    soundManager.playClick();
    if (mode === 'normal') {
      handleBpmUpdate(72);
      setVitals({ bp: '120/80', spo2: '99%', cardiacOutput: '5.4 L/min', prInterval: '160 ms', qrsDuration: '88 ms', qtInterval: '380 ms' });
    } else if (mode === 'rest') {
      handleBpmUpdate(58);
      setVitals({ bp: '112/74', spo2: '99%', cardiacOutput: '4.6 L/min', prInterval: '175 ms', qrsDuration: '84 ms', qtInterval: '410 ms' });
    } else if (mode === 'athlete') {
      handleBpmUpdate(52);
      setVitals({ bp: '115/70', spo2: '100%', cardiacOutput: '5.8 L/min', prInterval: '180 ms', qrsDuration: '92 ms', qtInterval: '420 ms' });
    } else if (mode === 'active') {
      handleBpmUpdate(108);
      setVitals({ bp: '135/88', spo2: '98%', cardiacOutput: '7.8 L/min', prInterval: '130 ms', qrsDuration: '80 ms', qtInterval: '330 ms' });
    }
  };

  const toggleSound = () => {
    const unmuted = soundManager.toggleMute();
    setIsMuted(!unmuted);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let scanX = 0;
    const height = canvas.height;
    const width = canvas.width;
    const midY = height / 2;

    const points: number[] = new Array(width).fill(midY);

    const getCardiacY = (pos: number): number => {
      const microNoise = (Math.random() - 0.5) * 1.5;

      if (pos >= 0.12 && pos < 0.22) {
        const pProgress = (pos - 0.12) / 0.10;
        return -Math.sin(pProgress * Math.PI) * 18 + microNoise;
      } else if (pos >= 0.28 && pos < 0.31) {
        const qProgress = (pos - 0.28) / 0.03;
        return Math.sin(qProgress * Math.PI) * 12 + microNoise;
      } else if (pos >= 0.31 && pos < 0.37) {
        const rProgress = (pos - 0.31) / 0.06;
        if (rProgress < 0.5) {
          return -(rProgress * 2) * 85 + microNoise;
        } else {
          return -((1 - (rProgress - 0.5) * 2)) * 85 + microNoise;
        }
      } else if (pos >= 0.37 && pos < 0.41) {
        const sProgress = (pos - 0.37) / 0.04;
        return Math.sin(sProgress * Math.PI) * 24 + microNoise;
      } else if (pos >= 0.48 && pos < 0.65) {
        const tProgress = (pos - 0.48) / 0.17;
        return -Math.sin(tProgress * Math.PI) * 28 + microNoise;
      } else if (pos >= 0.68 && pos < 0.74) {
        const uProgress = (pos - 0.68) / 0.06;
        return -Math.sin(uProgress * Math.PI) * 6 + microNoise;
      }

      return microNoise;
    };

    let beatProgress = 0;
    const pixelsPerSecond = 140;
    let lastTime = performance.now();

    const render = (time: number) => {
      const dt = (time - lastTime) / 1000;
      lastTime = time;

      const advancePixels = Math.max(1, Math.floor(pixelsPerSecond * dt * 1.5));
      const beatsPerSecond = bpm / 60;

      for (let p = 0; p < advancePixels; p++) {
        beatProgress += (beatsPerSecond / pixelsPerSecond);
        if (beatProgress >= 1.0) {
          beatProgress -= 1.0;
        }

        const yOffset = getCardiacY(beatProgress);
        points[scanX] = midY + yOffset;

        scanX = (scanX + 1) % width;
      }

      // Background grid
      ctx.fillStyle = '#062529';
      ctx.fillRect(0, 0, width, height);

      // Minor grid
      ctx.strokeStyle = 'rgba(20, 184, 166, 0.1)';
      ctx.lineWidth = 1;
      for (let x = 0; x < width; x += 15) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += 15) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Major grid
      ctx.strokeStyle = 'rgba(20, 184, 166, 0.22)';
      ctx.lineWidth = 1;
      for (let x = 0; x < width; x += 75) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += 75) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Draw ECG trace
      ctx.shadowColor = '#22d3ee';
      ctx.shadowBlur = 12;
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2.4;
      ctx.lineJoin = 'round';
      ctx.lineCap = 'round';

      ctx.beginPath();
      let isFirst = true;

      for (let x = 0; x < width; x++) {
        const distFromScan = (scanX - x + width) % width;
        if (distFromScan < 25) continue;

        if (isFirst) {
          ctx.moveTo(x, points[x]);
          isFirst = false;
        } else {
          ctx.lineTo(x, points[x]);
        }
      }
      ctx.stroke();

      // Scanline glowing head
      const currentY = points[scanX];
      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = '#67e8f9';
      ctx.shadowBlur = 15;
      ctx.beginPath();
      ctx.arc(scanX, currentY, 3.5, 0, Math.PI * 2);
      ctx.fill();

      ctx.shadowBlur = 0;

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [bpm]);

  return (
    <div className="w-full rounded-3xl spatial-card-light p-6 sm:p-8 text-slate-900 shadow-2xl border border-teal-200/90 backdrop-blur-xl">
      {/* Top Header Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-teal-100 pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-teal-50 text-brand-teal border border-teal-100 shadow-sm">
            <Activity className="h-5 w-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-serif font-bold text-slate-900 tracking-wide text-base">
                Interactive ECG & Rhythm Telemetry
              </h4>
              <span className="inline-flex items-center gap-1 rounded-full bg-teal-50 px-2.5 py-0.5 text-[10px] font-mono text-brand-teal font-bold border border-teal-200">
                <span className="h-1.5 w-1.5 rounded-full bg-teal-600 animate-ping"></span>
                Lead II Realtime
              </span>
            </div>
            <p className="text-xs text-slate-500">
              High-resolution digital cardiac rhythm simulator by Dr. Anil Sharma Clinic
            </p>
          </div>
        </div>

        {/* Audio Toggle */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggleSound}
            className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-mono font-bold transition-all ${
              !isMuted
                ? 'bg-brand-teal text-white shadow-md shadow-brand-teal/20'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200'
            }`}
            title="Toggle procedural cardiac sound synthesis"
          >
            {!isMuted ? <Volume2 className="h-3.5 w-3.5" /> : <VolumeX className="h-3.5 w-3.5" />}
            <span>{!isMuted ? 'AUDIO // ON' : 'AUDIO // MUTED'}</span>
          </button>
        </div>
      </div>

      {/* Main Screen Layout */}
      <div className="mt-5 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Realtime Canvas Display */}
        <div className="lg:col-span-8 relative overflow-hidden rounded-2xl border border-teal-900/30 bg-[#062529] shadow-xl">
          <canvas
            ref={canvasRef}
            width={720}
            height={220}
            className="w-full h-[180px] sm:h-[220px] block"
          />

          <div className="absolute top-3 left-3 text-[11px] font-mono text-teal-300/80 tracking-wider">
            25mm/s • 10mm/mV • {rhythmMode.toUpperCase()} SINUS RHYTHM
          </div>

          <div className="absolute top-3 right-3 flex items-center gap-2 font-mono text-xs">
            <span className="text-slate-300">HEART RATE:</span>
            <span className="text-xl font-bold text-cyan-300 animate-pulse">{bpm}</span>
            <span className="text-[10px] text-teal-300">BPM</span>
          </div>
        </div>

        {/* Telemetry Readouts */}
        <div className="lg:col-span-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 gap-3">
          <div className="rounded-2xl bg-slate-50 p-3.5 border border-slate-200/80">
            <div className="text-[10px] font-mono text-slate-500 uppercase tracking-wider font-bold">Blood Pressure</div>
            <div className="mt-1 text-lg font-bold text-slate-900 font-mono">{vitals.bp}</div>
            <div className="text-[10px] text-emerald-600 font-semibold">Optimal Systolic</div>
          </div>

          <div className="rounded-2xl bg-slate-50 p-3.5 border border-slate-200/80">
            <div className="text-[10px] font-mono text-slate-500 uppercase tracking-wider font-bold">Pulse SpO2</div>
            <div className="mt-1 text-lg font-bold text-brand-teal font-mono">{vitals.spo2}</div>
            <div className="text-[10px] text-teal-700 font-semibold">Arterial Oxygen</div>
          </div>

          <div className="rounded-2xl bg-slate-50 p-3.5 border border-slate-200/80">
            <div className="text-[10px] font-mono text-slate-500 uppercase tracking-wider font-bold">Cardiac Output</div>
            <div className="mt-1 text-lg font-bold text-slate-900 font-mono">{vitals.cardiacOutput}</div>
            <div className="text-[10px] text-slate-500">Resting Perfusion</div>
          </div>

          <div className="rounded-2xl bg-slate-50 p-3.5 border border-slate-200/80">
            <div className="text-[10px] font-mono text-slate-500 uppercase tracking-wider font-bold">PR Interval</div>
            <div className="mt-1 text-base font-bold text-slate-800 font-mono">{vitals.prInterval}</div>
            <div className="text-[10px] text-slate-500">AV Conduction</div>
          </div>

          <div className="rounded-2xl bg-slate-50 p-3.5 border border-slate-200/80">
            <div className="text-[10px] font-mono text-slate-500 uppercase tracking-wider font-bold">QRS Width</div>
            <div className="mt-1 text-base font-bold text-slate-800 font-mono">{vitals.qrsDuration}</div>
            <div className="text-[10px] text-slate-500">Ventricular Sync</div>
          </div>

          <div className="rounded-2xl bg-slate-50 p-3.5 border border-slate-200/80">
            <div className="text-[10px] font-mono text-slate-500 uppercase tracking-wider font-bold">QTc Interval</div>
            <div className="mt-1 text-base font-bold text-slate-800 font-mono">{vitals.qtInterval}</div>
            <div className="text-[10px] text-slate-500">Repolarization</div>
          </div>
        </div>
      </div>

      {/* Interactive Controls & Presets */}
      <div className="mt-5 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 pt-4 border-t border-teal-100">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
          <span className="text-xs font-mono text-slate-500 uppercase font-bold whitespace-nowrap">Preset:</span>
          {[
            { id: 'athlete', label: 'Athlete (52)', icon: '🏃' },
            { id: 'rest', label: 'Rest (58)', icon: '🛋️' },
            { id: 'normal', label: 'Normal (72)', icon: '💚' },
            { id: 'active', label: 'Active (108)', icon: '⚡' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => handlePreset(item.id as 'normal' | 'rest' | 'active' | 'athlete')}
              className={`rounded-xl px-3 py-1.5 text-xs font-mono font-bold transition-all whitespace-nowrap ${
                rhythmMode === item.id
                  ? 'bg-brand-teal text-white shadow-md'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
              }`}
            >
              <span>{item.icon} {item.label}</span>
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3 bg-slate-50 px-4 py-2 rounded-2xl border border-slate-200/80">
          <Heart className="h-4 w-4 text-red-500 fill-red-500 animate-pulse" />
          <span className="text-xs font-mono font-bold text-slate-700 whitespace-nowrap">Adjust BPM:</span>
          <input
            type="range"
            min="45"
            max="140"
            value={bpm}
            onChange={(e) => handleBpmUpdate(Number(e.target.value))}
            className="h-2 w-32 md:w-40 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-teal-700"
          />
          <span className="text-xs font-mono font-bold text-brand-teal w-8 text-right">{bpm}</span>
        </div>
      </div>
    </div>
  );
};
