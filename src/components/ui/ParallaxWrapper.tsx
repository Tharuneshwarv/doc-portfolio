import React, { createContext, useContext, useEffect, useRef, useState } from 'react';

// Context for sharing container-level mouse and scroll coordinates across parallax layers
interface LayeredParallaxContextType {
  mouseX: number;
  mouseY: number;
  scrollOffset: number;
}

const LayeredParallaxContext = createContext<LayeredParallaxContextType>({
  mouseX: 0,
  mouseY: 0,
  scrollOffset: 0,
});

interface LayeredParallaxContainerProps {
  children: React.ReactNode;
  className?: string;
  perspective?: number;
}

export const LayeredParallaxContainer: React.FC<LayeredParallaxContainerProps> = ({
  children,
  className = '',
  perspective = 1200,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const [scrollOffset, setScrollOffset] = useState(0);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let animId: number;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      targetX = Math.max(-0.5, Math.min(0.5, x));
      targetY = Math.max(-0.5, Math.min(0.5, y));
    };

    const handleScroll = () => {
      const rect = el.getBoundingClientRect();
      const mid = window.innerHeight / 2;
      const progress = (rect.top + rect.height / 2 - mid);
      setScrollOffset(progress);
    };

    const updateSmoothMouse = () => {
      currentX += (targetX - currentX) * 0.08;
      currentY += (targetY - currentY) * 0.08;
      setMouse({ x: currentX, y: currentY });
      animId = requestAnimationFrame(updateSmoothMouse);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    animId = requestAnimationFrame(updateSmoothMouse);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <LayeredParallaxContext.Provider value={{ mouseX: mouse.x, mouseY: mouse.y, scrollOffset }}>
      <div
        ref={containerRef}
        style={{
          perspective: `${perspective}px`,
          transformStyle: 'preserve-3d',
        }}
        className={`relative ${className}`}
      >
        {children}
      </div>
    </LayeredParallaxContext.Provider>
  );
};

interface ParallaxLayerProps {
  children: React.ReactNode;
  depth?: number; // e.g. -2 (deep bg), -1 (faint bg), 0 (normal), 1 (elevated), 2 (floating front)
  speedY?: number; // Scroll displacement factor
  mouseFactor?: number; // Mouse reaction factor
  className?: string;
  style?: React.CSSProperties;
}

export const ParallaxLayer: React.FC<ParallaxLayerProps> = ({
  children,
  depth = 0,
  speedY,
  mouseFactor,
  className = '',
  style = {},
}) => {
  const { mouseX, mouseY, scrollOffset } = useContext(LayeredParallaxContext);

  // Compute default multipliers based on depth layer
  const effectiveSpeedY = speedY !== undefined ? speedY : 0.15 * depth;
  const effectiveMouseFactor = mouseFactor !== undefined ? mouseFactor : 25 * (depth === 0 ? 0.4 : depth);
  const zTranslation = depth * 45; // Physical Z separation in 3D perspective space

  const translateY = scrollOffset * effectiveSpeedY;
  const translateX = mouseX * effectiveMouseFactor;
  const rotateX = -mouseY * 4 * (depth > 0 ? 1.2 : 0.6);
  const rotateY = mouseX * 4 * (depth > 0 ? 1.2 : 0.6);

  return (
    <div
      style={{
        transform: `translate3d(${translateX}px, ${translateY}px, ${zTranslation}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
        transformStyle: 'preserve-3d',
        willChange: 'transform',
        transition: 'transform 0.1s ease-out',
        ...style,
      }}
      className={className}
    >
      {children}
    </div>
  );
};

interface ParallaxSectionProps {
  children: React.ReactNode;
  className?: string;
  zoom?: boolean;
  fade?: boolean;
  blur?: boolean;
  threshold?: number;
}

export const ParallaxSection: React.FC<ParallaxSectionProps> = ({
  children,
  className = '',
  zoom = true,
  fade = true,
  blur = true,
  threshold = 0.15,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting);
      },
      { threshold: [0, 0.15, 0.3, 0.5, 0.75, 1] }
    );

    observer.observe(el);

    const onScroll = () => {
      const rect = el.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const progress = (windowHeight - rect.top) / (windowHeight + rect.height * 0.4);
      setScrollProgress(Math.min(1.2, Math.max(0, progress)));
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  // Ultra-Smooth & Cinematic: 1.0s silkier float with gentler ease curve
  const clamped = Math.min(1, Math.max(0, scrollProgress));
  const scale = zoom ? 0.96 + clamped * 0.04 : 1;
  const translateY = (1 - clamped) * 24; // Gentle 24px float
  const opacity = fade ? (inView ? Math.min(1, clamped * 1.4) : 0.2) : 1;
  const blurAmount = blur ? (1 - clamped) * 2.0 : 0;

  return (
    <div
      ref={ref}
      style={{
        transform: `translate3d(0, ${translateY}px, 0) scale3d(${scale}, ${scale}, 1)`,
        opacity,
        filter: blurAmount > 0.1 ? `blur(${blurAmount}px)` : 'none',
        transition: 'transform 1.05s cubic-bezier(0.22, 1, 0.36, 1), opacity 1.05s cubic-bezier(0.22, 1, 0.36, 1), filter 1.05s cubic-bezier(0.22, 1, 0.36, 1)',
        willChange: 'transform, opacity, filter',
      }}
      className={className}
    >
      {children}
    </div>
  );
};

interface ParallaxItemProps {
  children: React.ReactNode;
  speed?: number; // 0.5 = slower, 1.2 = faster floating
  className?: string;
}

export const ParallaxItem: React.FC<ParallaxItemProps> = ({
  children,
  speed = 0.5,
  className = '',
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [offsetY, setOffsetY] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const onScroll = () => {
      const rect = el.getBoundingClientRect();
      const mid = window.innerHeight / 2;
      const delta = (rect.top + rect.height / 2 - mid) * (speed - 1) * 0.35;
      setOffsetY(delta);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, [speed]);

  return (
    <div
      ref={ref}
      style={{
        transform: `translate3d(0, ${offsetY}px, 0)`,
        willChange: 'transform',
        transition: 'transform 0.15s ease-out',
      }}
      className={className}
    >
      {children}
    </div>
  );
};

interface ParallaxImageProps {
  src: string;
  alt: string;
  className?: string;
  containerClassName?: string;
  liquid?: boolean;
}

export const ParallaxImage: React.FC<ParallaxImageProps> = ({
  src,
  alt,
  className = 'w-full h-full object-cover',
  containerClassName = 'overflow-hidden relative',
  liquid = true,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1.0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const onScroll = () => {
      const rect = el.getBoundingClientRect();
      const viewHeight = window.innerHeight;
      if (rect.top < viewHeight && rect.bottom > 0) {
        const factor = (viewHeight - rect.top) / (viewHeight + rect.height);
        setScale(1.02 + factor * 0.08);
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  const totalScale = isHovered ? scale * 1.05 : scale;

  return (
    <div
      ref={ref}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`${containerClassName} ${liquid ? 'liquid-distortion' : ''}`}
    >
      <img
        src={src}
        alt={alt}
        style={{
          transform: `scale(${totalScale})`,
          transition: 'transform 0.7s cubic-bezier(0.16, 1, 0.3, 1)',
          willChange: 'transform, filter',
        }}
        className={className}
      />
    </div>
  );
};

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export const TiltCard: React.FC<TiltCardProps> = ({
  children,
  className = '',
  onClick,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const midX = rect.width / 2;
    const midY = rect.height / 2;
    const rotX = -((y - midY) / midY) * 6; // 6 deg max tilt
    const rotY = ((x - midX) / midX) * 6;
    setTilt({ x: rotX, y: rotY });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTilt({ x: 0, y: 0 });
  };

  return (
    <div
      ref={ref}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale3d(${isHovered ? 1.015 : 1}, ${isHovered ? 1.015 : 1}, 1)`,
        transition: isHovered
          ? 'transform 0.15s ease-out'
          : 'transform 0.75s cubic-bezier(0.22, 1, 0.36, 1)',
        willChange: 'transform',
      }}
      className={className}
    >
      {children}
    </div>
  );
};

