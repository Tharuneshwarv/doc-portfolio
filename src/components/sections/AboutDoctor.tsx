import React from 'react';
import { 
  Award, 
  Users, 
  Smile, 
  Star, 
  Play, 
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { soundManager } from '../sound/SoundFX';
import { ParallaxSection, LayeredParallaxContainer, ParallaxLayer, ParallaxImage, TiltCard } from '../ui/ParallaxWrapper';
import doctorData from '../../data/doctorData.json';

interface AboutDoctorProps {
  onOpenVideo: () => void;
  onOpenBooking: () => void;
}

export const AboutDoctor: React.FC<AboutDoctorProps> = ({ onOpenVideo, onOpenBooking }) => {
  const { doctor } = doctorData;

  return (
    <ParallaxSection zoom={true} fade={true} className="py-20 bg-white/70 backdrop-blur-md relative overflow-hidden z-10">
      <LayeredParallaxContainer className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Layer Depth -2: Deep Background CAD / Clinical Geometry */}
        <ParallaxLayer depth={-2} speedY={0.06} mouseFactor={10} className="absolute inset-0 pointer-events-none z-0">
          <div className="absolute top-10 right-10 text-[120px] font-mono font-black text-slate-900/[0.02] select-none">
            {doctor.institution.split(',')[0]}
          </div>
          <div className="absolute bottom-0 left-10 w-96 h-96 rounded-full bg-teal-50/60 blur-3xl pointer-events-none"></div>
        </ParallaxLayer>

        {/* Layer Depth 0: Main Bio & Consultation Media Plane */}
        <ParallaxLayer depth={0} className="relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Consultation Video Thumbnail */}
            <div className="lg:col-span-5 relative">
              <TiltCard className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-200 group bg-slate-900">
                <ParallaxImage
                  src={doctor.media.consultationPhotoUrl}
                  alt={`${doctor.name} consulting a cardiac patient`}
                  containerClassName="w-full h-[360px]"
                  className="w-full h-full object-cover opacity-90"
                />

                {/* Video Overlay Button */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-transparent to-transparent flex items-end p-6 pointer-events-none">
                  <button
                    onClick={() => {
                      soundManager.playClick();
                      onOpenVideo();
                    }}
                    className="w-full flex items-center justify-between rounded-2xl bg-white/95 backdrop-blur-md p-4 shadow-xl border border-white/80 hover:bg-white transition-all group/btn pointer-events-auto"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#0A4D52] text-white shadow-lg group-hover/btn:scale-110 transition-transform">
                        <Play className="h-5 w-5 fill-white translate-x-0.5" />
                      </div>
                      <div className="text-left">
                        <div className="text-sm font-bold text-slate-900">Watch Video</div>
                        <div className="text-xs text-slate-500">A message from {doctor.name}</div>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-[#0A4D52] group-hover/btn:translate-x-1 transition-transform">
                      Watch →
                    </span>
                  </button>
                </div>
              </TiltCard>
            </div>

            {/* Right Text Description */}
            <div className="lg:col-span-7 space-y-6">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full bg-teal-50 px-3.5 py-1 text-xs font-mono font-bold text-[#0A4D52] border border-teal-200/80 mb-2">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  <span>{doctor.title.toUpperCase()}</span>
                </div>
                <h2 className="text-3xl sm:text-5xl font-serif font-bold text-slate-900">
                  About {doctor.name}
                </h2>
                <div className="mt-2 text-base font-semibold text-[#0A4D52] font-mono">
                  {doctor.degrees}
                </div>
              </div>

              <p className="text-slate-600 text-base sm:text-lg leading-relaxed font-normal">
                {doctor.bio}
              </p>

              <div className="pt-2">
                <button
                  onClick={() => {
                    soundManager.playClick();
                    onOpenBooking();
                  }}
                  className="group inline-flex items-center gap-2 rounded-xl bg-white border border-slate-300 hover:border-[#0A4D52] px-6 py-3 text-sm font-semibold text-slate-800 hover:text-[#0A4D52] transition-all shadow-sm hover:scale-105"
                >
                  <span>Know More About Me</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </button>
              </div>

              {/* 4 Stats Cards matching Design 1 */}
              <div className="pt-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
                <TiltCard className="rounded-2xl bg-white p-4 text-center border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
                  <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-[#0A4D52] mb-2">
                    <Award className="h-5 w-5" />
                  </div>
                  <div className="text-2xl font-bold font-mono text-slate-900">{doctor.stats.yearsExperience}</div>
                  <div className="text-xs text-slate-500 font-medium">Years Experience</div>
                </TiltCard>

                <TiltCard className="rounded-2xl bg-white p-4 text-center border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
                  <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-[#0A4D52] mb-2">
                    <Users className="h-5 w-5" />
                  </div>
                  <div className="text-2xl font-bold font-mono text-slate-900">{doctor.stats.patientsTreated}</div>
                  <div className="text-xs text-slate-500 font-medium">Patients Treated</div>
                </TiltCard>

                <TiltCard className="rounded-2xl bg-white p-4 text-center border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
                  <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-[#0A4D52] mb-2">
                    <Smile className="h-5 w-5" />
                  </div>
                  <div className="text-2xl font-bold font-mono text-slate-900">{doctor.stats.satisfactionRate}</div>
                  <div className="text-xs text-slate-500 font-medium">Satisfaction Rate</div>
                </TiltCard>

                <TiltCard className="rounded-2xl bg-white p-4 text-center border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
                  <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-amber-500 mb-2">
                    <Star className="h-5 w-5 fill-amber-400" />
                  </div>
                  <div className="text-2xl font-bold font-mono text-slate-900">{doctor.stats.starRating}★</div>
                  <div className="text-xs text-slate-500 font-medium">Patient Rating</div>
                </TiltCard>
              </div>

            </div>

          </div>
        </ParallaxLayer>

      </LayeredParallaxContainer>
    </ParallaxSection>
  );
};
