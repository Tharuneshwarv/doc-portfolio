import React, { useState } from 'react';
import { 
  Stethoscope, 
  Activity, 
  Scan, 
  Flame, 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  X,
  Calendar
} from 'lucide-react';
import { soundManager } from '../sound/SoundFX';
import { ParallaxSection, LayeredParallaxContainer, ParallaxLayer, TiltCard } from '../ui/ParallaxWrapper';
import doctorData from '../../data/doctorData.json';

interface ServicesSectionProps {
  onSelectServiceForBooking: (serviceName: string) => void;
}

const iconMap: Record<string, React.ElementType> = {
  Stethoscope,
  Activity,
  Scan,
  Flame,
  ShieldCheck,
};

export const ServicesSection: React.FC<ServicesSectionProps> = ({ onSelectServiceForBooking }) => {
  const [selectedService, setSelectedService] = useState<number | null>(null);
  const { services } = doctorData;

  const activeServiceData = services.find(s => s.id === selectedService);

  return (
    <ParallaxSection zoom={true} fade={true} className="py-24 relative overflow-hidden z-10">
      <LayeredParallaxContainer className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Layer Depth -2: CAD Background Technical Nomenclature */}
        <ParallaxLayer depth={-2} speedY={0.06} mouseFactor={10} className="absolute inset-0 pointer-events-none z-0">
          <div className="absolute top-0 left-1/4 text-[140px] font-mono font-black text-teal-900/[0.02] select-none">
            SERVICES
          </div>
        </ParallaxLayer>

        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-16 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2 font-mono text-xs text-brand-teal font-bold">
              <span>[ 02 // CLINICAL DISCIPLINES ]</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-serif font-bold text-slate-900 tracking-tight">
              Cardiology Services
            </h2>
            <p className="mt-2 text-base text-slate-600 max-w-xl">
              Comprehensive diagnostic, therapeutic, and preventive interventions tailored to your cardiovascular health.
            </p>
          </div>

          <button
            onClick={() => {
              soundManager.playClick();
              onSelectServiceForBooking('General Cardiac Consultation');
            }}
            className="inline-flex items-center gap-2 text-sm font-bold text-[#0A4D52] hover:text-[#0E7490] transition-colors group"
          >
            <span>View All Services</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>

        {/* Services Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
          {services.map((service) => {
            const IconComponent = iconMap[service.iconKey] || Stethoscope;

            return (
              <TiltCard
                key={service.id}
                onClick={() => {
                  soundManager.playClick();
                  setSelectedService(service.id);
                }}
                className="group relative flex flex-col justify-between rounded-3xl bg-white/90 backdrop-blur-md p-8 border border-slate-200/90 shadow-sm hover:shadow-2xl hover:border-teal-300 transition-all cursor-pointer"
              >
                <div>
                  {/* Icon & Duration Header */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-50 text-[#0A4D52] border border-teal-100 group-hover:bg-[#0A4D52] group-hover:text-white transition-all group-hover:scale-110 shadow-sm">
                      <IconComponent className="h-7 w-7" />
                    </div>
                    <div className="flex items-center gap-1.5 text-xs font-mono font-medium text-slate-400 bg-slate-50 px-3 py-1 rounded-full border border-slate-200">
                      <Clock className="h-3.5 w-3.5 text-brand-teal" />
                      <span>{service.duration}</span>
                    </div>
                  </div>

                  {/* Title & Tagline */}
                  <h3 className="text-xl font-serif font-bold text-slate-900 group-hover:text-[#0A4D52] transition-colors">
                    {service.title}
                  </h3>
                  <p className="mt-2 text-xs font-mono text-slate-500 uppercase tracking-wider">
                    {service.tagline}
                  </p>

                  {/* Highlights Bullet List */}
                  <ul className="mt-6 space-y-2.5">
                    {service.highlights.slice(0, 3).map((hl, i) => (
                      <li key={i} className="flex items-center gap-2.5 text-xs text-slate-600">
                        <CheckCircle2 className="h-4 w-4 shrink-0 text-teal-600" />
                        <span className="leading-snug">{hl}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Card Footer CTA */}
                <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-bold text-[#0A4D52] group-hover:translate-x-0.5 transition-transform">
                    Explore Details & Protocol
                  </span>
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-teal-50 text-[#0A4D52] group-hover:bg-[#0A4D52] group-hover:text-white transition-all">
                    <ArrowRight className="h-3.5 w-3.5" />
                  </div>
                </div>
              </TiltCard>
            );
          })}
        </div>

      </LayeredParallaxContainer>

      {/* Service Deep-Inspection Diagnostic Modal */}
      {activeServiceData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-2xl rounded-3xl bg-white p-8 shadow-2xl border border-slate-200">
            
            <button
              onClick={() => setSelectedService(null)}
              className="absolute top-6 right-6 flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900 transition-all"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#0A4D52] text-white">
                  {React.createElement(iconMap[activeServiceData.iconKey] || Stethoscope, { className: "h-7 w-7" })}
                </div>
                <div>
                  <h3 className="text-2xl font-serif font-bold text-slate-900">{activeServiceData.title}</h3>
                  <p className="text-xs font-mono text-brand-teal uppercase">{activeServiceData.tagline}</p>
                </div>
              </div>

              <p className="text-slate-600 text-sm leading-relaxed">
                {activeServiceData.description}
              </p>

              <div>
                <h4 className="text-xs font-mono font-bold uppercase text-slate-400 mb-3 tracking-wider">
                  Diagnostic Scope & Clinical Deliverables:
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {activeServiceData.highlights.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2.5 rounded-xl bg-slate-50 p-3 text-xs text-slate-700 border border-slate-100 font-medium">
                      <CheckCircle2 className="h-4 w-4 text-brand-teal shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <div className="text-xs font-mono text-slate-500">
                  Typical Duration: <strong className="text-slate-900">{activeServiceData.duration}</strong>
                </div>

                <button
                  onClick={() => {
                    const name = activeServiceData.title;
                    setSelectedService(null);
                    onSelectServiceForBooking(name);
                  }}
                  className="flex items-center gap-2 rounded-xl bg-[#0A4D52] hover:bg-[#0E7490] text-white px-6 py-3 text-xs font-bold uppercase transition-all shadow-lg"
                >
                  <Calendar className="h-4 w-4" />
                  <span>Book This Service</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}
    </ParallaxSection>
  );
};
