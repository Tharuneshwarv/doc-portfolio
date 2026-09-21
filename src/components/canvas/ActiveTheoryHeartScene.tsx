import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { soundManager } from '../sound/SoundFX';

export const ActiveTheoryHeartScene: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    let width = window.innerWidth;
    let height = window.innerHeight;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 0, 5.2);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // 1. Ambient Light Bio-Particle Cloud
    const starCount = 1400;
    const starGeo = new THREE.BufferGeometry();
    const starPos = new Float32Array(starCount * 3);
    const starCol = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount; i++) {
      const i3 = i * 3;
      starPos[i3] = (Math.random() - 0.5) * 18;
      starPos[i3 + 1] = (Math.random() - 0.5) * 18;
      starPos[i3 + 2] = (Math.random() - 0.5) * 14 - 1;

      const isTeal = Math.random() > 0.3;
      starCol[i3] = isTeal ? 0.04 : 0.88;
      starCol[i3 + 1] = isTeal ? 0.45 : 0.15;
      starCol[i3 + 2] = isTeal ? 0.52 : 0.25;
    }

    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
    starGeo.setAttribute('color', new THREE.BufferAttribute(starCol, 3));

    // Particle texture
    const starCanvas = document.createElement('canvas');
    starCanvas.width = 64;
    starCanvas.height = 64;
    const starCtx = starCanvas.getContext('2d');
    if (starCtx) {
      const grad = starCtx.createRadialGradient(32, 32, 0, 32, 32, 32);
      grad.addColorStop(0, 'rgba(10, 77, 82, 0.95)');
      grad.addColorStop(0.35, 'rgba(14, 116, 144, 0.7)');
      grad.addColorStop(0.7, 'rgba(13, 148, 136, 0.25)');
      grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
      starCtx.fillStyle = grad;
      starCtx.fillRect(0, 0, 64, 64);
    }
    const starTexture = new THREE.CanvasTexture(starCanvas);

    const starMat = new THREE.PointsMaterial({
      size: 0.052,
      vertexColors: true,
      map: starTexture,
      transparent: true,
      opacity: 0.65,
      depthWrite: false,
    });
    const starField = new THREE.Points(starGeo, starMat);
    scene.add(starField);

    // 1B. Foreground Floating Bokeh Crystal Particles (Layer 3)
    const foreCount = 350;
    const foreGeo = new THREE.BufferGeometry();
    const forePos = new Float32Array(foreCount * 3);
    const foreCol = new Float32Array(foreCount * 3);

    for (let i = 0; i < foreCount; i++) {
      const i3 = i * 3;
      forePos[i3] = (Math.random() - 0.5) * 10;
      forePos[i3 + 1] = (Math.random() - 0.5) * 10;
      forePos[i3 + 2] = 1.0 + Math.random() * 3.5; // In front of heart, near camera

      const isRuby = Math.random() > 0.75;
      foreCol[i3] = isRuby ? 0.88 : 0.05;
      foreCol[i3 + 1] = isRuby ? 0.12 : 0.58;
      foreCol[i3 + 2] = isRuby ? 0.28 : 0.54;
    }

    foreGeo.setAttribute('position', new THREE.BufferAttribute(forePos, 3));
    foreGeo.setAttribute('color', new THREE.BufferAttribute(foreCol, 3));

    const foreMat = new THREE.PointsMaterial({
      size: 0.095,
      vertexColors: true,
      map: starTexture,
      transparent: true,
      opacity: 0.75,
      depthWrite: false,
    });
    const foreField = new THREE.Points(foreGeo, foreMat);
    scene.add(foreField);

    // 2. 3D Mathematical Parametric Crystal Heart
    const heartCount = 3800;
    const heartGeo = new THREE.BufferGeometry();
    const heartPos = new Float32Array(heartCount * 3);
    const heartBasePos = new Float32Array(heartCount * 3);
    const heartCol = new Float32Array(heartCount * 3);

    const colorTealDark = new THREE.Color('#0A4D52');
    const colorTealBright = new THREE.Color('#0D9488');
    const colorCyan = new THREE.Color('#0284C7');
    const colorCoralRed = new THREE.Color('#E11D48');

    for (let i = 0; i < heartCount; i++) {
      const i3 = i * 3;
      const t = Math.PI * (2 * Math.random() - 1);
      const u = Math.PI * (Math.random() - 0.5);

      const scale = 0.095;
      const sinT = Math.sin(t);
      const cosT = Math.cos(t);
      const cosU = Math.cos(u);
      const sinU = Math.sin(u);

      const x = 16 * Math.pow(sinT, 3) * cosU * scale;
      const y = (13 * cosT - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)) * cosU * scale;
      const z = 10 * sinU * (0.7 + 0.3 * Math.sin(t * 2)) * scale;

      const spread = 0.9 + Math.random() * 0.2;
      heartPos[i3] = x * spread;
      heartPos[i3 + 1] = (y + 0.1) * spread;
      heartPos[i3 + 2] = z * spread;

      heartBasePos[i3] = heartPos[i3];
      heartBasePos[i3 + 1] = heartPos[i3 + 1];
      heartBasePos[i3 + 2] = heartPos[i3 + 2];

      const r = Math.random();
      const mixed = new THREE.Color();
      if (r > 0.75) {
        mixed.lerpColors(colorTealDark, colorCyan, Math.random());
      } else if (r > 0.3) {
        mixed.lerpColors(colorTealDark, colorTealBright, Math.random());
      } else {
        mixed.lerpColors(colorTealBright, colorCoralRed, 0.4);
      }

      heartCol[i3] = mixed.r;
      heartCol[i3 + 1] = mixed.g;
      heartCol[i3 + 2] = mixed.b;
    }

    heartGeo.setAttribute('position', new THREE.BufferAttribute(heartPos, 3));
    heartGeo.setAttribute('color', new THREE.BufferAttribute(heartCol, 3));

    const heartMat = new THREE.PointsMaterial({
      size: 0.054,
      vertexColors: true,
      map: starTexture,
      transparent: true,
      opacity: 0.88,
      depthWrite: false,
    });

    const heartMesh = new THREE.Points(heartGeo, heartMat);
    heartMesh.position.set(1.4, 0.1, 0);
    scene.add(heartMesh);

    // 3. Bio-Rings in Teal / Turquoise
    const ringGeo = new THREE.TorusGeometry(1.8, 0.012, 16, 120);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x0d9488,
      transparent: true,
      opacity: 0.35,
      wireframe: true,
    });
    const ring1 = new THREE.Mesh(ringGeo, ringMat);
    ring1.rotation.x = Math.PI / 2.2;
    ring1.rotation.y = 0.4;
    heartMesh.add(ring1);

    const ring2 = new THREE.Mesh(ringGeo, ringMat.clone());
    ring2.scale.set(1.3, 1.3, 1.3);
    ring2.rotation.x = Math.PI / 1.7;
    ring2.rotation.z = 0.8;
    heartMesh.add(ring2);

    // Shockwave Ring
    const shockwaveGeo = new THREE.RingGeometry(0.1, 0.15, 64);
    const shockwaveMat = new THREE.MeshBasicMaterial({
      color: 0x0d9488,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0,
    });
    const shockwave = new THREE.Mesh(shockwaveGeo, shockwaveMat);
    heartMesh.add(shockwave);

    let shockwaveActive = false;
    let shockwaveScale = 0.1;

    // Mouse Tracking & Dynamic Scroll Zoom Parallax
    let mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    let scrollY = window.scrollY;
    let currentCameraZ = 5.2;

    const handleMouseMove = (e: MouseEvent) => {
      mouse.targetX = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.targetY = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    const handleScroll = () => {
      scrollY = window.scrollY;
    };

    const handleClick = () => {
      soundManager.playHeartbeat(0.28);
      shockwaveActive = true;
      shockwaveScale = 0.1;
      shockwaveMat.opacity = 0.85;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('click', handleClick);

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener('resize', handleResize);

    // Animation Loop with Smooth Camera Dolly Zoom Parallax
    let animId: number;
    let clock = new THREE.Clock();
    let lastBeat = 0;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const time = clock.getElapsedTime();

      // Lerp mouse
      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;

      // Scroll progress
      const maxScroll = document.body.scrollHeight - window.innerHeight || 2000;
      const scrollNorm = Math.min(1, Math.max(0, scrollY / maxScroll));

      // Active Theory Dynamic Zoom / Fade Parallax Trajectory
      // Section 1 (Hero): Camera Z ~ 5.2, Heart on right (X: 1.4)
      // Section 2 (Services): Camera dives in (Z ~ 3.8, X: 0.2, zoom in)
      // Section 3 (Telemetry): Camera shifts (Z ~ 4.2, X: -0.8)
      // Section 4 (About): Camera (Z ~ 3.6, X: 1.0)
      // Section 5 (Risk/Testimonials): Camera pulls back (Z ~ 5.5, X: 0)
      
      const targetCameraZ = 5.2 - Math.sin(scrollNorm * Math.PI) * 1.6;
      currentCameraZ += (targetCameraZ - currentCameraZ) * 0.05;
      camera.position.z = currentCameraZ;

      const targetHeartX = 1.4 * Math.cos(scrollNorm * Math.PI * 1.8);
      const targetHeartY = 0.1 - scrollNorm * 0.9 + Math.sin(time * 0.8) * 0.1;
      const targetHeartZ = -scrollNorm * 1.5;

      heartMesh.position.x += (targetHeartX - heartMesh.position.x) * 0.06;
      heartMesh.position.y += (targetHeartY - heartMesh.position.y) * 0.06;
      heartMesh.position.z += (targetHeartZ - heartMesh.position.z) * 0.06;

      // Dynamic Rotation with Parallax Inertia
      heartMesh.rotation.y = time * 0.25 + mouse.x * 0.7 + scrollNorm * Math.PI * 1.5;
      heartMesh.rotation.x = 0.15 - mouse.y * 0.45 + Math.sin(time * 0.5) * 0.1;

      // Heartbeat pulse calculation
      const bpm = 72;
      const beatPeriod = 60 / bpm;
      const cycleProgress = (time % beatPeriod) / beatPeriod;

      let scaleOffset = 0;
      if (cycleProgress < 0.14) {
        scaleOffset = Math.sin((cycleProgress / 0.14) * Math.PI) * 0.13;
      } else if (cycleProgress > 0.22 && cycleProgress < 0.35) {
        scaleOffset = Math.sin(((cycleProgress - 0.22) / 0.13) * Math.PI) * 0.07;
      }

      if (cycleProgress < 0.04 && time - lastBeat > beatPeriod * 0.8) {
        lastBeat = time;
        soundManager.playHeartbeat(0.12);
      }

      const currentScale = 1.0 + scaleOffset;
      heartMesh.scale.set(currentScale, currentScale, currentScale);

      // Particle turbulence
      const positions = heartMesh.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < heartCount; i++) {
        const i3 = i * 3;
        const bx = heartBasePos[i3];
        const by = heartBasePos[i3 + 1];
        const bz = heartBasePos[i3 + 2];

        const wave = Math.sin(time * 3.5 + bx * 4.0 + by * 3.0) * 0.025;
        positions[i3] = bx * (1 + scaleOffset * 0.6) + wave;
        positions[i3 + 1] = by * (1 + scaleOffset * 0.6) + wave;
        positions[i3 + 2] = bz * (1 + scaleOffset * 0.6);
      }
      heartMesh.geometry.attributes.position.needsUpdate = true;

      // Shockwave expansion
      if (shockwaveActive) {
        shockwaveScale += 0.08;
        shockwaveMat.opacity *= 0.94;
        shockwave.scale.set(shockwaveScale, shockwaveScale, shockwaveScale);
        if (shockwaveMat.opacity < 0.01) {
          shockwaveActive = false;
        }
      }

      // Parallax rotation on starField (slow background)
      starField.rotation.y = time * 0.02 + scrollNorm * 0.5;
      starField.rotation.x = time * 0.01 + mouse.y * 0.2;

      // Layered Parallax on foreField (fast foreground bokeh particles)
      foreField.rotation.y = -time * 0.05 - scrollNorm * 1.8;
      foreField.rotation.x = -time * 0.03 - mouse.y * 0.6;
      foreField.position.y = Math.sin(time * 0.6) * 0.15 - scrollNorm * 2.0;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('click', handleClick);
      window.removeEventListener('resize', handleResize);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      heartGeo.dispose();
      heartMat.dispose();
      starGeo.dispose();
      starMat.dispose();
      foreGeo.dispose();
      foreMat.dispose();
      starTexture.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-0 pointer-events-none w-full h-full overflow-hidden"
    />
  );
};
