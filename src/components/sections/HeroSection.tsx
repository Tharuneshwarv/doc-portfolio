import React from 'react';
import { ArrowRight, MessageCircle, Cpu, Users, Heart, Play, ShieldCheck, Activity, Star } from 'lucide-react';
import { soundManager } from '../sound/SoundFX';
import { ParallaxSection, LayeredParallaxContainer, ParallaxLayer, TiltCard, ParallaxImage } from '../ui/ParallaxWrapper';
import doctorData from '../../data/doctorData.json';

interface HeroSectionProps {
  onOpenBooking: () => void;
  onOpenVideo: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onOpenBooking, onOpenVideo }) => {
  const { doctor, clinic } = doctorData;

  const handleWhatsApp = () => {
    soundManager.playClick();
    const phone = clinic.whatsAppNumber;
    const text = encodeURIComponent(clinic.whatsAppDefaultMessage);
    window.open(`https://wa.me/${phone}?text=${text}`, '_blank');
  };

  return (
    <ParallaxSection zoom={true} fade={true} className="relative pt-4 pb-12 sm:pt-8 sm:pb-16 lg:pt-12 lg:pb-20 overflow-hidden z-10">
      <LayeredParallaxContainer className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Layer Depth -2: Deep Background Spatial Telemetry Geometry */}
        <ParallaxLayer depth={-2} speedY={0.08} mouseFactor={12} className="absolute inset-0 pointer-events-none z-0">
          <div className="absolute -top-10 -right-10 w-[300px] sm:w-[550px] h-[300px] sm:h-[550px] rounded-full border border-teal-200/40 pointer-events-none flex items-center justify-center opacity-60">
            <div className="w-[220px] sm:w-[420px] h-[220px] sm:h-[420px] rounded-full border border-dashed border-teal-300/30 flex items-center justify-center">
              <div className="w-[140px] sm:w-[280px] h-[140px] sm:h-[280px] rounded-full border border-teal-400/20"></div>
            </div>
          </div>
          <div className="absolute top-1/2 left-0 text-[60px] sm:text-[100px] font-mono font-black text-teal-900/[0.025] select-none pointer-events-none">
            CARDIOLOGY
          </div>
        </ParallaxLayer>

        {/* Layer Depth 0: Core Content Plane */}
        <ParallaxLayer depth={0} className="relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
            
            {/* Left Hero Content */}
            <div className="lg:col-span-7 space-y-5 sm:space-y-6 text-left">
              
              <div className="inline-flex items-center gap-2 rounded-full bg-teal-50 px-3 py-1 text-[11px] sm:text-xs font-mono font-bold text-[#0A4D52] border border-teal-200/80 shadow-sm max-w-full truncate">
                <span className="h-2 w-2 rounded-full bg-teal-600 animate-pulse shrink-0"></span>
                <span className="truncate">{doctor.badgeText}</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-serif font-bold text-slate-900 leading-[1.12] sm:leading-[1.08] tracking-tight">
                {doctor.heroHeadline.main} <br />
                <span className="font-serif italic font-normal text-[#0A4D52]">
                  {doctor.heroHeadline.italic}
                </span>
              </h1>

              <p className="text-sm sm:text-base lg:text-lg text-slate-600 max-w-xl leading-relaxed font-normal">
                {doctor.heroDescription}
              </p>

              {/* CTAs */}
              <div className="flex flex-col xs:flex-row items-stretch xs:items-center gap-3 sm:gap-4 pt-2">
                <button
                  onClick={() => {
                    soundManager.playClick();
                    onOpenBooking();
                  }}
                  className="group flex items-center justify-center gap-3 rounded-xl bg-[#0A4D52] hover:bg-[#0E7490] text-white px-6 py-3.5 text-xs sm:text-sm font-semibold shadow-xl shadow-teal-900/20 active:scale-95 transition-all hover:scale-105"
                >
                  <span>Book an Appointment</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </button>

                <button
                  onClick={handleWhatsApp}
                  className="flex items-center justify-center gap-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 px-5 py-3.5 text-xs sm:text-sm font-semibold text-emerald-800 backdrop-blur-md active:scale-95 transition-all shadow-sm hover:scale-105"
                >
                  <MessageCircle className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-600 fill-emerald-600" />
                  <span>Talk on WhatsApp</span>
                </button>
              </div>

              {/* 3 Trust Badges - Responsive Grid */}
              <div className="pt-6 sm:pt-8 border-t border-slate-200/80 grid grid-cols-3 gap-2 sm:gap-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 p-2 sm:p-0">
                  <div className="flex h-9 w-9 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-xl sm:rounded-2xl bg-teal-50 text-[#0A4D52] border border-teal-100 shadow-sm">
                    <Users className="h-4 w-4 sm:h-5 sm:w-5" />
                  </div>
                  <div>
                    <h5 className="text-[11px] sm:text-xs font-bold text-slate-900 leading-tight">Trusted by</h5>
                    <p className="text-[10px] sm:text-xs text-slate-500 font-medium truncate">{doctor.stats.patientsTreated}</p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 p-2 sm:p-0">
                  <div className="flex h-9 w-9 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-xl sm:rounded-2xl bg-teal-50 text-[#0A4D52] border border-teal-100 shadow-sm">
                    <Cpu className="h-4 w-4 sm:h-5 sm:w-5" />
                  </div>
                  <div>
                    <h5 className="text-[11px] sm:text-xs font-bold text-slate-900 leading-tight">Advanced</h5>
                    <p className="text-[10px] sm:text-xs text-slate-500 font-medium">Technology</p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 p-2 sm:p-0">
                  <div className="flex h-9 w-9 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-xl sm:rounded-2xl bg-teal-50 text-[#0A4D52] border border-teal-100 shadow-sm">
                    <Heart className="h-4 w-4 sm:h-5 sm:w-5 text-red-500" />
                  </div>
                  <div>
                    <h5 className="text-[11px] sm:text-xs font-bold text-slate-900 leading-tight">Compassionate</h5>
                    <p className="text-[10px] sm:text-xs text-slate-500 font-medium">Care</p>
                  </div>
                </div>
              </div>

            </div>

            {/* Right Doctor Card with 3D Tilt & Parallax Zoom */}
            <div className="lg:col-span-5 relative mt-4 lg:mt-0">
              <TiltCard className="relative mx-auto max-w-sm sm:max-w-md rounded-3xl spatial-card-light p-3 sm:p-3.5 shadow-2xl border border-teal-200/90 overflow-hidden">
                
                <div className="relative h-[320px] sm:h-[400px] rounded-2xl overflow-hidden bg-slate-100 border border-teal-100 group">
                  <ParallaxImage
                    src={doctor.media.heroPortraitUrl}
                    alt={`${doctor.name} - ${doctor.title}`}
                    containerClassName="w-full h-full"
                    className="w-full h-full object-cover object-top"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none"></div>

                  {/* Interactive Video Message */}
                  <button
                    onClick={() => {
                      soundManager.playClick();
                      onOpenVideo();
                    }}
                    className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 right-3 sm:right-4 z-10 flex items-center justify-between rounded-xl bg-white/95 hover:bg-white backdrop-blur-md p-2.5 sm:p-3 border border-slate-200 shadow-md transition-all group/btn"
                  >
                    <div className="flex items-center gap-2.5 sm:gap-3">
                      <div className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full bg-[#0A4D52] text-white shadow-md group-hover/btn:scale-110 transition-transform">
                        <Play className="h-3.5 w-3.5 sm:h-4 sm:w-4 fill-white translate-x-0.5" />
                      </div>
                      <div className="text-left">
                        <div className="text-xs font-bold text-slate-900">Watch Video</div>
                        <div className="text-[10px] text-slate-500">A message from {doctor.name}</div>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-[#0A4D52] group-hover/btn:translate-x-1 transition-transform">
                      Play →
                    </span>
                  </button>
                </div>

                {/* Verified Badge */}
                <div className="mt-3 flex items-center justify-between px-1 sm:px-2 text-[11px] sm:text-xs text-slate-600">
                  <div className="flex items-center gap-1.5 text-[#0A4D52] font-semibold truncate mr-2">
                    <ShieldCheck className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-emerald-600 shrink-0" />
                    <span className="truncate">{doctor.institution.split(',')[0]} • {doctor.degrees.split(',')[1] || doctor.degrees}</span>
                  </div>
                  <span className="text-teal-800 font-bold bg-teal-50 px-2 py-0.5 rounded-full border border-teal-100 text-[10px] sm:text-[11px] shrink-0">
                    {doctor.stats.yearsExperience} Exp
                  </span>
                </div>

              </TiltCard>
            </div>

          </div>
        </ParallaxLayer>

        {/* Layer Depth 1.8: Elevated Floating Foreground Badges (Desktop Only) */}
        <ParallaxLayer depth={1.8} speedY={0.25} mouseFactor={35} className="absolute inset-0 pointer-events-none z-20 hidden lg:block">
          {/* Floating Quote Box Top Right */}
          <div className="absolute -top-4 right-8 pointer-events-auto">
            <div className="rounded-2xl bg-white/95 backdrop-blur-xl p-4 shadow-2xl border border-teal-100/90 text-xs font-medium text-slate-800 max-w-[220px]">
              <div className="flex items-center gap-1.5 text-amber-500 mb-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-3 w-3 fill-amber-400" />
                ))}
                <span className="text-[10px] font-bold text-slate-700 ml-1">{doctor.stats.starRating} ({doctor.stats.totalReviews})</span>
              </div>
              <p className="text-[11px] text-slate-600 italic leading-snug">
                "{doctor.missionQuote}"
              </p>
            </div>
          </div>

          {/* Floating Heart Telemetry Badge Bottom Left */}
          <div className="absolute bottom-4 left-4 pointer-events-auto">
            <div className="flex items-center gap-3 rounded-2xl bg-[#0A4D52] text-white p-3.5 shadow-2xl border border-teal-400/30">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-800/80 text-teal-200">
                <Activity className="h-5 w-5 animate-pulse" />
              </div>
              <div>
                <div className="text-[10px] font-mono uppercase text-teal-300">Survival Metric</div>
                <div className="text-sm font-bold">{doctor.stats.satisfactionRate} Positive Outcomes</div>
              </div>
            </div>
          </div>
        </ParallaxLayer>

      </LayeredParallaxContainer>
    </ParallaxSection>
  );
};
