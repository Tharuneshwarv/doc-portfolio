import React, { useState, useEffect } from 'react';
import { Heart, Phone, Calendar, Volume2, VolumeX, Menu, X } from 'lucide-react';
import { soundManager } from '../sound/SoundFX';
import doctorData from '../../data/doctorData.json';

interface NavbarProps {
  onOpenBooking: () => void;
  onNavigate?: (sectionId: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenBooking, onNavigate }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isAudioActive, setIsAudioActive] = useState(!soundManager.getMuted());
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const { doctor, clinic } = doctorData;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleAudioToggle = () => {
    const active = soundManager.toggleMute();
    setIsAudioActive(active);
  };

  const navLinks = [
    { name: 'Home', href: '#hero' },
    { name: 'About', href: '#about' },
    { name: 'Services', href: '#services' },
    { name: 'Telemetry', href: '#telemetry' },
    { name: 'Risk Assessment', href: '#risk-quiz' },
    { name: 'Patient Info', href: '#testimonials' },
    { name: 'Blog', href: '#blog' },
    { name: 'Contact', href: '#footer' },
  ];

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    soundManager.playClick(750, 0.03);
    setMobileMenuOpen(false);
    if (onNavigate) {
      onNavigate(href);
    } else {
      const el = document.getElementById(href.replace('#', ''));
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full transition-all duration-300">
      {/* Top Clinical & Audio Bar - Responsive Collapsible */}
      <div className="bg-[#0A4D52] text-white py-1.5 px-3 sm:px-4 text-[11px] sm:text-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
          {/* Clinic Hours & City */}
          <div className="flex items-center gap-1.5 sm:gap-2 truncate">
            <span className="flex h-2 w-2 relative shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
            </span>
            <span className="text-teal-100 font-medium truncate">
              <span className="hidden sm:inline">{clinic.hours.weekdays} • </span>{clinic.city}, {clinic.country}
            </span>
          </div>

          {/* Quick Call & Sound Toggle */}
          <div className="flex items-center gap-2 sm:gap-4 shrink-0 text-teal-100">
            <a
              href={`tel:${clinic.phoneClean}`}
              className="flex items-center gap-1 hover:text-white font-medium transition-colors text-[11px] sm:text-xs"
            >
              <Phone className="h-3 w-3 text-emerald-300 shrink-0" />
              <span className="hidden md:inline">Call Us: </span>
              <strong>{clinic.phone}</strong>
            </a>
            <button
              onClick={handleAudioToggle}
              className={`flex items-center gap-1 px-2 py-0.5 rounded border text-[10px] sm:text-[11px] font-mono transition-all ${
                isAudioActive
                  ? 'bg-teal-900/80 text-teal-200 border-teal-600'
                  : 'bg-teal-900/40 text-teal-300/80 border-teal-700/50'
              }`}
              title="Toggle interactive cardiac soundscape"
            >
              {isAudioActive ? <Volume2 className="h-3 w-3 text-teal-300" /> : <VolumeX className="h-3 w-3 text-teal-400" />}
              <span className="hidden xs:inline">{isAudioActive ? 'Sound On' : 'Muted'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Glass Navbar */}
      <nav
        className={`w-full transition-all duration-300 ${
          isScrolled
            ? 'spatial-nav-light py-2.5 sm:py-3'
            : 'bg-white/90 backdrop-blur-xl py-3 sm:py-4 border-b border-teal-100/80'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          
          {/* Logo */}
          <a
            href="#hero"
            className="flex items-center gap-2.5 sm:gap-3 group select-none cursor-pointer"
            onClick={(e) => handleLinkClick(e, '#hero')}
          >
            <div className="flex h-9 w-9 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-xl sm:rounded-2xl bg-gradient-to-tr from-[#0A4D52] to-[#0E7490] text-white shadow-md group-hover:scale-105 transition-transform">
              <Heart className="h-5 w-5 sm:h-6 sm:w-6 text-red-400 fill-red-400 animate-pulse" />
            </div>
            <div>
              <div className="font-serif text-base sm:text-xl font-bold text-slate-900 tracking-tight leading-tight">
                {doctor.name}
              </div>
              <p className="text-[10px] sm:text-[11px] text-slate-500 font-medium">
                {doctor.title}
              </p>
            </div>
          </a>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center gap-6 xl:gap-8 text-sm font-medium text-slate-600">
            {navLinks.slice(0, 6).map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => handleLinkClick(e, link.href)}
                className="hover:text-[#0A4D52] transition-colors relative py-1 group cursor-pointer"
              >
                <span>{link.name}</span>
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#0A4D52] transition-all duration-300 group-hover:w-full"></span>
              </a>
            ))}
          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => {
                soundManager.playClick(880, 0.05);
                onOpenBooking();
              }}
              className="flex items-center gap-1.5 sm:gap-2 rounded-xl bg-[#0A4D52] hover:bg-[#0E7490] text-white px-3.5 py-2 sm:px-5 sm:py-2.5 text-xs sm:text-sm font-semibold shadow-md shadow-teal-900/15 active:scale-95 transition-all"
            >
              <Calendar className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span>Book <span className="hidden xs:inline">Appointment</span></span>
            </button>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => {
                soundManager.playClick();
                setMobileMenuOpen(!mobileMenuOpen);
              }}
              className="flex lg:hidden p-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 active:scale-95 transition-all border border-slate-200"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="h-5 w-5 text-slate-900" /> : <Menu className="h-5 w-5 text-slate-800" />}
            </button>
          </div>

        </div>

        {/* Mobile Slide-down Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white/98 backdrop-blur-2xl border-t border-slate-200/80 px-5 pt-3 pb-6 space-y-1 shadow-2xl animate-fadeIn">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => handleLinkClick(e, link.href)}
                className="flex items-center justify-between py-2.5 px-3 rounded-xl text-sm font-semibold text-slate-800 hover:bg-teal-50 hover:text-[#0A4D52] transition-colors"
              >
                <span>{link.name}</span>
                <span className="text-xs text-slate-400 font-mono">→</span>
              </a>
            ))}
            
            <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
              <a
                href={`tel:${clinic.phoneClean}`}
                className="flex items-center justify-center gap-2 rounded-xl bg-teal-50 text-[#0A4D52] py-2.5 text-xs font-bold border border-teal-200"
              >
                <Phone className="h-4 w-4" />
                <span>Call Clinic: {clinic.phone}</span>
              </a>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};
