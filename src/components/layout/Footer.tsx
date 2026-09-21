import React from 'react';
import { 
  Heart, 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  ArrowUp
} from 'lucide-react';
import { soundManager } from '../sound/SoundFX';
import doctorData from '../../data/doctorData.json';

export const Footer: React.FC = () => {
  const { doctor, clinic, socialLinks } = doctorData;

  const scrollToTop = () => {
    soundManager.playClick();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer id="footer" className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-teal-900/40 relative z-10 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Row exactly matching Design 1 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-slate-800">
          
          {/* Brand Info (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-[#0A4D52] to-[#0E7490] text-white shadow-lg">
                <Heart className="h-6 w-6 text-red-400 fill-red-400 animate-pulse" />
              </div>
              <div>
                <span className="font-serif text-lg font-bold text-white tracking-tight">
                  {doctor.name}
                </span>
                <p className="text-[11px] text-slate-400 font-medium">
                  {doctor.title}
                </p>
                <p className="text-[9px] text-teal-400 font-medium tracking-wide">
                  {doctor.missionQuote}
                </p>
              </div>
            </div>

            {/* Social Icons */}
            <div className="flex items-center gap-3 pt-3">
              <a
                href={socialLinks.linkedin}
                target="_blank"
                rel="noreferrer"
                onClick={() => soundManager.playClick()}
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-800 text-slate-300 hover:bg-[#0A4D52] hover:text-white transition-all border border-slate-700/80"
                title="LinkedIn"
              >
                <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24"><path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.64c-.88 0-1.6.72-1.6 1.6s.72 1.6 1.6 1.6 1.6-.72 1.6-1.6-.72-1.6-1.6-1.6Z"/></svg>
              </a>
              <a
                href={socialLinks.facebook}
                target="_blank"
                rel="noreferrer"
                onClick={() => soundManager.playClick()}
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-800 text-slate-300 hover:bg-[#0A4D52] hover:text-white transition-all border border-slate-700/80"
                title="Facebook"
              >
                <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24"><path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95z"/></svg>
              </a>
              <a
                href={socialLinks.twitter}
                target="_blank"
                rel="noreferrer"
                onClick={() => soundManager.playClick()}
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-800 text-slate-300 hover:bg-[#0A4D52] hover:text-white transition-all border border-slate-700/80"
                title="Twitter"
              >
                <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"/></svg>
              </a>
              <a
                href={socialLinks.youtube}
                target="_blank"
                rel="noreferrer"
                onClick={() => soundManager.playClick()}
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-800 text-slate-300 hover:bg-[#0A4D52] hover:text-white transition-all border border-slate-700/80"
                title="YouTube"
              >
                <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
              </a>
            </div>
          </div>

          {/* Quick Links (2 cols) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-sm font-bold text-white tracking-wide uppercase font-mono text-[11px]">
              Quick Links
            </h4>
            <ul className="space-y-2 text-slate-400">
              <li><a href="#hero" className="hover:text-teal-300 transition-colors">Home</a></li>
              <li><a href="#about" className="hover:text-teal-300 transition-colors">About Doctor</a></li>
              <li><a href="#services" className="hover:text-teal-300 transition-colors">Services</a></li>
              <li><a href="#telemetry" className="hover:text-teal-300 transition-colors">ECG Telemetry</a></li>
              <li><a href="#testimonials" className="hover:text-teal-300 transition-colors">Testimonials</a></li>
              <li><a href="#blog" className="hover:text-teal-300 transition-colors">Health Blog</a></li>
            </ul>
          </div>

          {/* Services (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-sm font-bold text-white tracking-wide uppercase font-mono text-[11px]">
              Specializations
            </h4>
            <ul className="space-y-2 text-slate-400">
              {doctorData.services.map((s) => (
                <li key={s.id}>
                  <a href="#services" className="hover:text-teal-300 transition-colors">
                    {s.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Details (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-sm font-bold text-white tracking-wide uppercase font-mono text-[11px]">
              Contact Clinic
            </h4>
            <div className="space-y-2.5 text-slate-400">
              <div className="flex items-start gap-2.5">
                <MapPin className="h-4 w-4 text-teal-400 shrink-0 mt-0.5" />
                <span>{clinic.address}, {clinic.city}, {clinic.country}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 text-teal-400 shrink-0" />
                <a href={`tel:${clinic.phoneClean}`} className="hover:text-white transition-colors">{clinic.phone}</a>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 text-teal-400 shrink-0" />
                <a href={`mailto:${clinic.email}`} className="hover:text-white transition-colors">{clinic.email}</a>
              </div>
              <div className="flex items-center gap-2.5">
                <Clock className="h-4 w-4 text-teal-400 shrink-0" />
                <span>{clinic.hours.weekdays}</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Copyright Row */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500 text-[11px]">
          <div>
            © {new Date().getFullYear()} {doctor.name}. All rights reserved. Medical registration verifiable via MCI/NMC.
          </div>
          <div className="flex items-center gap-6">
            <a href="#terms" onClick={(e) => e.preventDefault()} className="hover:text-slate-300 transition-colors">Privacy Policy</a>
            <a href="#privacy" onClick={(e) => e.preventDefault()} className="hover:text-slate-300 transition-colors">Terms of Service</a>
            <button
              onClick={scrollToTop}
              className="flex items-center gap-1 text-teal-400 hover:text-teal-300 font-bold ml-4 group"
            >
              <span>Back to Top</span>
              <ArrowUp className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-1" />
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
