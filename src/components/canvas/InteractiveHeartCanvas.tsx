import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { soundManager } from '../sound/SoundFX';

interface HeartCanvasProps {
  bpm?: number;
  className?: string;
  onHeartClick?: () => void;
  interactive?: boolean;
}

export const InteractiveHeartCanvas: React.FC<HeartCanvasProps> = ({
  bpm = 72,
  className = 'w-full h-full min-h-[380px]',
  onHeartClick,
  interactive = true,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentBpm, setCurrentBpm] = useState(bpm);
  const [pulseCount, setPulseCount] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    setCurrentBpm(bpm);
  }, [bpm]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 1. Scene setup
    const scene = new THREE.Scene();
    const width = container.clientWidth || 400;
    const height = container.clientHeight || 400;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 0, 4.2);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // 2. Generate 3D Mathematical Heart Geometry Points
    // Parametric heart formula in 3D:
    // x = 16 * sin^3(t) * sin(u)
    // y = (13 * cos(t) - 5 * cos(2t) - 2 * cos(3t) - cos(4t)) * sin(u)
    // z = 12 * cos(u) * (0.8 + 0.2 * sin(t))
    const particleCount = 2400;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const basePositions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);

    const colorTeal = new THREE.Color('#0E7490'); // Medical Teal
    const colorCyan = new THREE.Color('#22D3EE'); // Bright Cyan
    const colorRed = new THREE.Color('#EF4444');  // Arterial Oxygen Red
    const colorWhite = new THREE.Color('#FFFFFF'); // Sparkle

    for (let i = 0; i < particleCount; i++) {
      // Sample parameter t and u
      const t = Math.PI * (2 * Math.random() - 1);
      const u = Math.PI * (Math.random() - 0.5);

      // Heart parametric equation scaled down
      const scale = 0.085;
      const sinT = Math.sin(t);
      const cosT = Math.cos(t);
      const cosU = Math.cos(u);
      const sinU = Math.sin(u);

      const x = 16 * Math.pow(sinT, 3) * cosU * scale;
      const y = (13 * cosT - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)) * cosU * scale;
      const z = 10 * sinU * (0.65 + 0.35 * Math.sin(t * 2)) * scale;

      // Add gentle random internal cloud dispersion for volume
      const spread = 0.92 + Math.random() * 0.16;
      const px = x * spread;
      const py = (y + 0.1) * spread;
      const pz = z * spread;

      positions[i * 3] = px;
      positions[i * 3 + 1] = py;
      positions[i * 3 + 2] = pz;

      basePositions[i * 3] = px;
      basePositions[i * 3 + 1] = py;
      basePositions[i * 3 + 2] = pz;

      // Color variation: higher areas and outer surface glow with teal & cyan, inner core with warm pulse
      const ratio = Math.random();
      const mixedColor = new THREE.Color();
      if (ratio > 0.8) {
        mixedColor.lerpColors(colorCyan, colorWhite, Math.random() * 0.5);
      } else if (ratio > 0.3) {
        mixedColor.lerpColors(colorTeal, colorCyan, Math.random());
      } else {
        mixedColor.lerpColors(colorTeal, colorRed, 0.4);
      }

      colors[i * 3] = mixedColor.r;
      colors[i * 3 + 1] = mixedColor.g;
      colors[i * 3 + 2] = mixedColor.b;

      sizes[i] = 2.5 + Math.random() * 4.0;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    // Particle texture
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
      grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
      grad.addColorStop(0.25, 'rgba(20, 184, 166, 0.8)');
      grad.addColorStop(0.6, 'rgba(14, 116, 144, 0.3)');
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 64, 64);
    }
    const particleTexture = new THREE.CanvasTexture(canvas);

    const material = new THREE.PointsMaterial({
      size: 0.045,
      vertexColors: true,
      map: particleTexture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const heartPoints = new THREE.Points(geometry, material);
    heartPoints.rotation.x = 0.15;
    scene.add(heartPoints);

    // 3. Ambient Flowing Bio-Rings around heart
    const ringGeo = new THREE.TorusGeometry(1.6, 0.015, 16, 100);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x0fa3b1,
      transparent: true,
      opacity: 0.25,
      wireframe: true,
    });
    const bioRing1 = new THREE.Mesh(ringGeo, ringMat);
    bioRing1.rotation.x = Math.PI / 2.3;
    bioRing1.rotation.y = 0.3;
    scene.add(bioRing1);

    const bioRing2 = new THREE.Mesh(ringGeo, ringMat.clone());
    bioRing2.scale.set(1.25, 1.25, 1.25);
    bioRing2.rotation.x = Math.PI / 1.8;
    bioRing2.rotation.z = 0.6;
    scene.add(bioRing2);

    // Mouse Tracking for Active Theory fluid inertia
    let mouseX = 0;
    let mouseY = 0;
    let targetRotX = 0;
    let targetRotY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      mouseX = x;
      mouseY = y;
      targetRotY = mouseX * 0.7;
      targetRotX = -mouseY * 0.5;
    };

    container.addEventListener('mousemove', handleMouseMove);

    // Animation Loop
    let animationId: number;
    let clock = new THREE.Clock();
    let lastBeatTime = 0;

    const animate = () => {
      animationId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Cardiac Cycle Calculation (Lub-Dub rhythm)
      const beatPeriod = 60 / currentBpm;
      const cycleProgress = (elapsedTime % beatPeriod) / beatPeriod;

      // Realistic double-pulse cardiac curve
      let scaleOffset = 0;
      if (cycleProgress < 0.15) {
        // S1 Systole (Lub)
        scaleOffset = Math.sin((cycleProgress / 0.15) * Math.PI) * 0.14;
      } else if (cycleProgress > 0.22 && cycleProgress < 0.36) {
        // S2 Diastole (Dub)
        const dubProgress = (cycleProgress - 0.22) / 0.14;
        scaleOffset = Math.sin(dubProgress * Math.PI) * 0.08;
      }

      // Trigger audio on heart beat stroke
      if (cycleProgress < 0.05 && elapsedTime - lastBeatTime > beatPeriod * 0.8) {
        lastBeatTime = elapsedTime;
        soundManager.playHeartbeat();
        setPulseCount((c) => c + 1);
      }

      const totalScale = 1.0 + scaleOffset;
      heartPoints.scale.set(totalScale, totalScale, totalScale);

      // Inertia lerping on rotation
      heartPoints.rotation.y += (targetRotY + Math.sin(elapsedTime * 0.5) * 0.2 - heartPoints.rotation.y) * 0.05;
      heartPoints.rotation.x += (targetRotX + 0.15 - heartPoints.rotation.x) * 0.05;

      // Dynamic particle flow simulation
      const posArray = heartPoints.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        const bx = basePositions[i3];
        const by = basePositions[i3 + 1];
        const bz = basePositions[i3 + 2];

        // Micro-turbulence wave simulating blood flow
        const wave = Math.sin(elapsedTime * 4 + bx * 3 + by * 2) * 0.02;
        posArray[i3] = bx * (1 + scaleOffset * 0.8) + wave;
        posArray[i3 + 1] = by * (1 + scaleOffset * 0.8) + wave;
        posArray[i3 + 2] = bz * (1 + scaleOffset * 0.8);
      }
      heartPoints.geometry.attributes.position.needsUpdate = true;

      // Orbit bio-rings
      bioRing1.rotation.z += 0.003;
      bioRing2.rotation.y += 0.004;

      renderer.render(scene, camera);
    };

    animate();

    // Resize Handler
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      container.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationId);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      geometry.dispose();
      material.dispose();
      particleTexture.dispose();
      renderer.dispose();
    };
  }, [currentBpm]);

  const handleManualClick = () => {
    soundManager.playClick(900, 0.08);
    soundManager.playHeartbeat(0.3);
    if (onHeartClick) onHeartClick();
  };

  return (
    <div
      ref={containerRef}
      onClick={interactive ? handleManualClick : undefined}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative cursor-pointer select-none overflow-hidden rounded-3xl ${className}`}
      title="Interactive 3D Heart: Move mouse to rotate, click to auscultate"
    >
      {/* Active Theory floating HUD overlay */}
      <div className="absolute bottom-4 left-4 right-4 z-10 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-2 rounded-full bg-slate-900/80 px-3.5 py-1.5 backdrop-blur-md border border-teal-500/30 text-white shadow-lg">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
          <span className="text-xs font-mono font-medium tracking-wide">
            LIVE 3D CARDIAC CORE: <span className="text-teal-300 font-bold">{currentBpm} BPM</span>
          </span>
        </div>

        <div className="hidden sm:flex items-center gap-1 text-[11px] font-mono text-teal-800 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full shadow-sm border border-teal-100">
          <span>{isHovered ? '🖱️ Move cursor to inspect' : '👆 Click to test pulse'}</span>
        </div>
      </div>
    </div>
  );
};
