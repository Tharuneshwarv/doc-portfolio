import React, { useState } from 'react';
import { MapPin, Clock, Phone, Check, Copy } from 'lucide-react';
import { soundManager } from '../sound/SoundFX';
import { ParallaxItem, TiltCard } from '../ui/ParallaxWrapper';
import doctorData from '../../data/doctorData.json';

export const QuickInfoBanner: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const { clinic } = doctorData;

  const handleCopyPhone = () => {
    soundManager.playClick();
    navigator.clipboard.writeText(clinic.phoneClean);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOpenMap = () => {
    soundManager.playClick();
    window.open(clinic.googleMapsUrl, '_blank');
  };

  return (
    <ParallaxItem speed={0.9} className="relative -mt-6 z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 rounded-3xl bg-white/90 p-4 sm:p-5 shadow-xl shadow-slate-200/50 border border-slate-200/80 backdrop-blur-xl">
        
        {/* Clinic Location */}
        <TiltCard
          onClick={handleOpenMap}
          className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 hover:bg-teal-50/60 border border-slate-100 hover:border-teal-200 transition-all cursor-pointer group"
        >
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-teal-100/80 text-[#0A4D52] group-hover:scale-110 transition-transform">
            <MapPin className="h-6 w-6" />
          </div>
          <div className="flex-1">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Clinic Location</h4>
            <p className="mt-1 text-base font-bold text-slate-900">{clinic.city}, {clinic.country}</p>
            <p className="text-xs text-slate-500">{clinic.address}</p>
          </div>
        </TiltCard>

        {/* Consultation Hours */}
        <TiltCard className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-teal-100/80 text-[#0A4D52]">
            <Clock className="h-6 w-6" />
          </div>
          <div className="flex-1">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Consultation Hours</h4>
            <p className="mt-1 text-base font-bold text-slate-900">{clinic.hours.weekdays}</p>
            <p className="text-xs text-emerald-600 font-medium">{clinic.hours.sunday}</p>
          </div>
        </TiltCard>

        {/* Call Us */}
        <TiltCard
          onClick={handleCopyPhone}
          className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 hover:bg-teal-50/60 border border-slate-100 hover:border-teal-200 transition-all cursor-pointer group"
        >
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-teal-100/80 text-[#0A4D52] group-hover:scale-110 transition-transform">
            <Phone className="h-6 w-6" />
          </div>
          <div className="flex-1">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Direct Consultation</h4>
            <p className="mt-1 text-base font-bold text-slate-900">{clinic.phone}</p>
            <p className="text-xs text-brand-teal flex items-center gap-1 font-medium">
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-600" />
                  <span className="text-emerald-600 font-bold">Copied to Clipboard!</span>
                </>
              ) : (
                <>
                  <Copy className="h-3 w-3" />
                  <span>Click to copy direct line</span>
                </>
              )}
            </p>
          </div>
        </TiltCard>

      </div>
    </ParallaxItem>
  );
};
