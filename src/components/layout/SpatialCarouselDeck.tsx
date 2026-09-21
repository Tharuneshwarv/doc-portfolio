import React, { useEffect, useRef, useState, useCallback } from 'react';
import { ChevronLeft, ChevronRight, LayoutGrid, Layers, Activity } from 'lucide-react';
import { soundManager } from '../sound/SoundFX';

export interface SlideItem {
  id: string;
  title: string;
  code: string;
  component: React.ReactNode;
}

interface SpatialCarouselDeckProps {
  slides: SlideItem[];
  activeSlideIndex: number;
  onSlideChange: (index: number) => void;
  isCarouselMode: boolean;
  onToggleMode: () => void;
}

export const SpatialCarouselDeck: React.FC<SpatialCarouselDeckProps> = ({
  slides,
  activeSlideIndex,
  onSlideChange,
  isCarouselMode,
  onToggleMode,
}) => {
  const isThrottled = useRef(false);
  const touchStartY = useRef(0);
  const touchStartX = useRef(0);

  const goToSlide = useCallback((newIndex: number) => {
    if (newIndex < 0 || newIndex >= slides.length || newIndex === activeSlideIndex) return;
    soundManager.playClick(650 + newIndex * 40, 0.04);
    onSlideChange(newIndex);
  }, [activeSlideIndex, onSlideChange, slides.length]);

  const handleNext = useCallback(() => {
    if (activeSlideIndex < slides.length - 1) {
      goToSlide(activeSlideIndex + 1);
    }
  }, [activeSlideIndex, goToSlide, slides.length]);

  const handlePrev = useCallback(() => {
    if (activeSlideIndex > 0) {
      goToSlide(activeSlideIndex - 1);
    }
  }, [activeSlideIndex, goToSlide]);

  // Wheel & Trackpad scroll listener for Carousel Mode
  useEffect(() => {
    if (!isCarouselMode) return;

    const handleWheel = (e: WheelEvent) => {
      // Threshold to distinguish deliberate scroll from jitter
      if (Math.abs(e.deltaY) < 25 && Math.abs(e.deltaX) < 25) return;
      if (isThrottled.current) return;

      isThrottled.current = true;
      setTimeout(() => {
        isThrottled.current = false;
      }, 750); // 750ms glide debounce for silky smooth deck pacing

      if (e.deltaY > 25 || e.deltaX > 25) {
        handleNext();
      } else if (e.deltaY < -25 || e.deltaX < -25) {
        handlePrev();
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === 'PageDown') {
        e.preventDefault();
        handleNext();
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp' || e.key === 'PageUp') {
        e.preventDefault();
        handlePrev();
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      touchStartY.current = e.touches[0].clientY;
      touchStartX.current = e.touches[0].clientX;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      const deltaY = touchStartY.current - e.changedTouches[0].clientY;
      const deltaX = touchStartX.current - e.changedTouches[0].clientX;
      if (Math.abs(deltaY) > 40 || Math.abs(deltaX) > 40) {
        if (deltaY > 40 || deltaX > 40) {
          handleNext();
        } else {
          handlePrev();
        }
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: true });
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isCarouselMode, handleNext, handlePrev]);

  if (!isCarouselMode) {
    // Continuous Flow Mode
    return (
      <div className="w-full space-y-16 lg:space-y-24">
        {slides.map((slide) => (
          <div key={slide.id} id={slide.id} className="w-full">
            {slide.component}
          </div>
        ))}
      </div>
    );
  }

  // 3D Spatial Carousel Deck Mode
  return (
    <div className="relative w-full min-h-[calc(100vh-140px)] flex flex-col justify-between overflow-hidden pt-4 pb-24">
      
      {/* 3D Carousel Stage Track */}
      <div 
        style={{ perspective: '1400px', transformStyle: 'preserve-3d' }}
        className="relative w-full max-w-7xl mx-auto flex-1 flex items-center justify-center min-h-[640px] px-4 sm:px-6"
      >
        {slides.map((slide, idx) => {
          const delta = idx - activeSlideIndex;
          const isActive = delta === 0;
          const isPrev = delta < 0;
          const isNext = delta > 0;
          const absDelta = Math.abs(delta);

          // Calculate 3D transformation matrices based on offset
          let translateX = delta * 105; // Percentage offset
          let translateZ = -absDelta * 140; // Depth pushback in pixels
          let rotateY = isPrev ? Math.min(30, absDelta * 18) : isNext ? -Math.min(30, absDelta * 18) : 0;
          let scale = isActive ? 1.0 : Math.max(0.78, 1 - absDelta * 0.12);
          let opacity = isActive ? 1.0 : absDelta === 1 ? 0.22 : 0;
          let pointerEvents = isActive ? ('auto' as const) : ('none' as const);

          return (
            <div
              key={slide.id}
              onClick={() => {
                if (!isActive) goToSlide(idx);
              }}
              style={{
                transform: `translate3d(${translateX}%, 0, ${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`,
                opacity,
                zIndex: 20 - absDelta,
                pointerEvents,
                transition: 'transform 0.75s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.75s cubic-bezier(0.16, 1, 0.3, 1)',
                willChange: 'transform, opacity',
              }}
              className="absolute inset-0 w-full h-full flex items-center justify-center max-h-[85vh] overflow-y-auto custom-scroll cursor-default select-none"
            >
              <div className="w-full h-full py-4 flex flex-col justify-center">
                {slide.component}
              </div>
            </div>
          );
        })}
      </div>

      {/* Floating Bottom Active Theory HUD Carousel Controller Dock */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-full max-w-2xl px-4 pointer-events-none">
        <div className="pointer-events-auto flex items-center justify-between gap-3 rounded-full bg-white/95 backdrop-blur-2xl px-5 py-3 border border-teal-200/90 shadow-2xl shadow-teal-900/15 text-slate-900">
          
          {/* Previous Button */}
          <button
            onClick={handlePrev}
            disabled={activeSlideIndex === 0}
            className={`flex h-9 w-9 items-center justify-center rounded-full border transition-all ${
              activeSlideIndex > 0
                ? 'bg-teal-50 text-[#0A4D52] border-teal-200 hover:bg-[#0A4D52] hover:text-white active:scale-95'
                : 'bg-slate-100 text-slate-300 border-slate-200 cursor-not-allowed'
            }`}
            title="Previous Section (Left Arrow / Scroll Up)"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          {/* Current Slide Info & Progress */}
          <div className="flex-1 px-3 text-center">
            <div className="flex items-center justify-center gap-2 text-xs font-mono font-bold text-[#0A4D52]">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>[ {slides[activeSlideIndex].code} ]</span>
              <span className="text-slate-800 uppercase font-bold tracking-tight">{slides[activeSlideIndex].title}</span>
            </div>

            {/* Micro Scrub Dots */}
            <div className="mt-1.5 flex items-center justify-center gap-1.5">
              {slides.map((s, idx) => (
                <button
                  key={s.id}
                  onClick={() => goToSlide(idx)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    idx === activeSlideIndex
                      ? 'w-6 bg-[#0A4D52]'
                      : 'w-2 bg-slate-200 hover:bg-teal-300'
                  }`}
                  title={`Go to ${s.title}`}
                />
              ))}
            </div>
          </div>

          {/* Next Button */}
          <button
            onClick={handleNext}
            disabled={activeSlideIndex === slides.length - 1}
            className={`flex h-9 w-9 items-center justify-center rounded-full border transition-all ${
              activeSlideIndex < slides.length - 1
                ? 'bg-teal-50 text-[#0A4D52] border-teal-200 hover:bg-[#0A4D52] hover:text-white active:scale-95'
                : 'bg-slate-100 text-slate-300 border-slate-200 cursor-not-allowed'
            }`}
            title="Next Section (Right Arrow / Scroll Down)"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          {/* Mode Switcher */}
          <div className="pl-2 border-l border-slate-200">
            <button
              onClick={() => {
                soundManager.playClick();
                onToggleMode();
              }}
              className="flex items-center gap-1.5 rounded-full bg-teal-50 hover:bg-teal-100 text-[#0A4D52] border border-teal-200 px-3 py-1.5 text-[11px] font-mono font-bold transition-all"
              title="Toggle between 3D Spatial Carousel and Continuous Flow view"
            >
              <Layers className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">3D CAROUSEL</span>
            </button>
          </div>

        </div>
      </div>

    </div>
  );
};
