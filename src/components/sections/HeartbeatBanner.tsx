import React from 'react';
import { Heart, ArrowRight } from 'lucide-react';
import { soundManager } from '../sound/SoundFX';
import { ParallaxSection, LayeredParallaxContainer, ParallaxLayer, ParallaxImage, TiltCard } from '../ui/ParallaxWrapper';
import doctorData from '../../data/doctorData.json';

interface HeartbeatBannerProps {
  onOpenBooking: () => void;
}

export const HeartbeatBanner: React.FC<HeartbeatBannerProps> = ({ onOpenBooking }) => {
  const { doctor } = doctorData;

  return (
    <ParallaxSection zoom fade className="relative overflow-hidden z-10">
      <LayeredParallaxContainer className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <TiltCard className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-200">
          <div className="relative h-[380px] sm:h-[420px] w-full">
            {/* Background Senior Couple / Healthy Heart Image */}
            <ParallaxImage
              src={doctor.media.bannerCouplePhotoUrl}
              alt={doctor.bannerQuote}
              containerClassName="w-full h-full"
              className="w-full h-full object-cover"
              liquid={true}
            />

            {/* Dark Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/85 via-slate-950/60 to-transparent flex items-center p-8 sm:p-14">
              
              <div className="max-w-xl text-white space-y-4">
                <div className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-md px-3.5 py-1 text-xs font-mono font-bold text-teal-300 border border-white/20">
                  <Heart className="h-3.5 w-3.5 text-red-400 fill-red-400 animate-pulse" />
                  <span>PREVENTIVE WELLNESS</span>
                </div>

                <h2 className="text-3xl sm:text-5xl font-serif font-bold text-white leading-tight">
                  {doctor.bannerQuote}
                </h2>

                <p className="text-slate-200 text-sm sm:text-base leading-relaxed">
                  {doctor.bannerSubtext}
                </p>

                <div className="pt-2">
                  <button
                    onClick={() => {
                      soundManager.playClick();
                      onOpenBooking();
                    }}
                    className="group inline-flex items-center gap-3 rounded-xl bg-white text-slate-900 px-6 py-3.5 text-sm font-semibold hover:bg-teal-50 transition-all shadow-xl hover:scale-105 active:scale-95"
                  >
                    <span>Schedule Heart Checkup</span>
                    <ArrowRight className="h-4 w-4 text-[#0A4D52] transition-transform group-hover:translate-x-1" />
                  </button>
                </div>
              </div>

            </div>

          </div>
        </TiltCard>

      </LayeredParallaxContainer>
    </ParallaxSection>
  );
};
