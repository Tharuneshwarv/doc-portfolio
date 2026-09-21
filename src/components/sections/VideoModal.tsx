import React from 'react';
import { X, Play, Heart, ShieldCheck, Stethoscope } from 'lucide-react';
import { soundManager } from '../sound/SoundFX';
import doctorData from '../../data/doctorData.json';

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenBooking: () => void;
}

export const VideoModal: React.FC<VideoModalProps> = ({ isOpen, onClose, onOpenBooking }) => {
  const { doctor } = doctorData;
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-3xl rounded-3xl bg-slate-900 border border-teal-500/30 overflow-hidden shadow-2xl">
        
        {/* Close button */}
        <button
          onClick={() => {
            soundManager.playClick();
            onClose();
          }}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-slate-800/80 text-white hover:bg-slate-700 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Video Player Container */}
        <div className="relative aspect-video w-full bg-slate-950 flex items-center justify-center overflow-hidden">
          {/* Simulated HD Clinical Video with ambient motion */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/40 z-10"></div>
          
          <img
            src={doctor.media.consultationPhotoUrl}
            alt={`${doctor.name} Video Broadcast`}
            className="w-full h-full object-cover opacity-60 scale-105"
          />

          {/* Center Clinical Broadcast Player */}
          <div className="relative z-20 text-center px-6 max-w-lg">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-brand-teal/90 text-white border-2 border-white/50 shadow-2xl animate-pulse">
              <Play className="h-7 w-7 fill-white translate-x-0.5" />
            </div>
            <h4 className="text-xl sm:text-2xl font-serif font-bold text-white mb-2">
              "{doctor.missionQuote}"
            </h4>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {doctor.name} discusses modern preventative cardiology, deciphering symptoms early, and tailored lifestyle management for lasting heart health.
            </p>
          </div>

          {/* Broadcast telemetry badge */}
          <div className="absolute top-4 left-4 z-20 flex items-center gap-2 rounded-full bg-slate-900/80 px-3 py-1 text-[11px] font-mono text-teal-300 border border-teal-500/30">
            <span className="h-2 w-2 rounded-full bg-red-500 animate-ping"></span>
            <span>HD CLINICAL ARCHIVE • 1080P</span>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-6 bg-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-800">
          <div className="flex items-center gap-3 text-xs text-slate-300">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-teal-900/60 text-teal-400">
              <Stethoscope className="h-4 w-4" />
            </div>
            <div>
              <span className="font-bold text-white block">{doctor.name}</span>
              <span className="text-[11px] text-slate-400">{doctor.title} • {doctor.degrees}</span>
            </div>
          </div>

          <button
            onClick={() => {
              soundManager.playClick();
              onClose();
              onOpenBooking();
            }}
            className="w-full sm:w-auto rounded-xl bg-brand-teal hover:bg-brand-tealLight text-white px-6 py-2.5 text-xs font-mono font-bold uppercase shadow-lg shadow-teal-900/30 transition-all"
          >
            Book Consultation
          </button>
        </div>

      </div>
    </div>
  );
};
