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
    { name: 'Patient Info', href: '#testimonials' },
    { name: 'Blog', href: '#blog' },
    { name: 'Contact', href: '#footer' },
  ];

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    soundManager.playClick(750, 0.03);
    if (onNavigate) {
      onNavigate(href);
    } else {
      const el = document.getElementById(href.replace('#', ''));
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full transition-all duration-300">
      {/* Top Clinical & Audio Bar */}
      <div className="bg-[#0A4D52] text-white py-1.5 px-4 text-xs">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
            </span>
            <span className="text-teal-100 font-medium">{clinic.hours.weekdays} • {clinic.city}, {clinic.country}</span>
          </div>

          <div className="flex items-center gap-4 text-teal-100">
            <a
              href={`tel:${clinic.phoneClean}`}
              className="flex items-center gap-1.5 hover:text-white font-medium transition-colors"
            >
              <Phone className="h-3 w-3 text-emerald-300" />
              <span>Call Us: <strong>{clinic.phone}</strong></span>
            </a>
            <button
              onClick={handleAudioToggle}
              className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded border text-[11px] font-mono transition-all ${
                isAudioActive
                  ? 'bg-teal-900/80 text-teal-200 border-teal-600'
                  : 'bg-teal-900/40 text-teal-300/80 border-teal-700/50'
              }`}
              title="Toggle interactive cardiac soundscape"
            >
              {isAudioActive ? <Volume2 className="h-3 w-3 text-teal-300" /> : <VolumeX className="h-3 w-3 text-teal-400" />}
              <span>{isAudioActive ? 'Sound On' : 'Sound Muted'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Glass Navbar exactly matching Design 1 */}
      <nav
        className={`w-full transition-all duration-300 ${
          isScrolled
            ? 'spatial-nav-light py-3'
            : 'bg-white/85 backdrop-blur-xl py-4 border-b border-teal-100/80'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          
          {/* Logo */}
          <a
            href="#hero"
            className="flex items-center gap-3 group select-none cursor-pointer"
            onClick={(e) => handleLinkClick(e, '#hero')}
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-[#0A4D52] to-[#0E7490] text-white shadow-md shadow-teal-900/10 group-hover:scale-105 transition-transform">
              <Heart className="h-6 w-6 text-red-400 fill-red-400 animate-pulse" />
            </div>
            <div>
              <div className="font-serif text-xl font-bold text-slate-900 tracking-tight leading-tight">
                {doctor.name}
              </div>
              <p className="text-[11px] text-slate-500 font-medium">
                {doctor.title}
              </p>
              <p className="text-[9px] text-teal-700 font-medium tracking-wide">
                {doctor.missionQuote}
              </p>
            </div>
          </a>

          {/* Nav Items */}
          <div className="hidden lg:flex items-center gap-8 text-sm font-medium text-slate-600">
            {navLinks.map((link) => (
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

          {/* Book Appointment CTA Button */}
          <div className="hidden sm:flex items-center gap-3">
            <button
              onClick={() => {
                soundManager.playClick(880, 0.05);
                onOpenBooking();
              }}
              className="flex items-center gap-2 rounded-xl bg-[#0A4D52] hover:bg-[#0E7490] text-white px-5 py-2.5 text-sm font-semibold shadow-lg shadow-teal-900/20 active:scale-95 transition-all"
            >
              <Calendar className="h-4 w-4" />
              <span>Book Appointment</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={() => {
                soundManager.playClick();
                setMobileMenuOpen(!mobileMenuOpen);
              }}
              className="p-2 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

        </div>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white/95 backdrop-blur-2xl border-b border-slate-200 px-4 pt-3 pb-6 space-y-3 mt-3 shadow-xl">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => {
                  handleLinkClick(e, link.href);
                  setMobileMenuOpen(false);
                }}
                className="block py-2 text-base font-semibold text-slate-800 hover:text-[#0A4D52] border-b border-slate-100"
              >
                {link.name}
              </a>
            ))}
            <div className="pt-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenBooking();
                }}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#0A4D52] text-white py-3 font-semibold shadow-md"
              >
                <Calendar className="h-4 w-4" />
                <span>Book Appointment</span>
              </button>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};
