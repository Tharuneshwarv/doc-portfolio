import React, { useState } from 'react';
import { Navbar } from './components/layout/Navbar';
import { HeroSection } from './components/sections/HeroSection';
import { QuickInfoBanner } from './components/sections/QuickInfoBanner';
import { ServicesSection } from './components/sections/ServicesSection';
import { AboutDoctor } from './components/sections/AboutDoctor';
import { EcgOscilloscope } from './components/canvas/EcgOscilloscope';
import { CardiacRiskQuiz } from './components/sections/CardiacRiskQuiz';
import { HeartbeatBanner } from './components/sections/HeartbeatBanner';
import { TestimonialsSection } from './components/sections/TestimonialsSection';
import { BlogAndArticles } from './components/sections/BlogAndArticles';
import { AppointmentModal } from './components/sections/AppointmentModal';
import { VideoModal } from './components/sections/VideoModal';
import { Footer } from './components/layout/Footer';
import { ActiveTheoryHeartScene } from './components/canvas/ActiveTheoryHeartScene';
import { CustomCursor } from './components/ui/CustomCursor';
import { HudOverlay } from './components/ui/HudOverlay';
import { ActiveTheoryScrollHarness } from './components/ui/ActiveTheoryScrollHarness';
import { ParallaxSection } from './components/ui/ParallaxWrapper';
import { Activity, Calendar } from 'lucide-react';
import { soundManager } from './components/sound/SoundFX';

export function App() {
  const [isBookingOpen, setIsBookingOpen] = useState<boolean>(false);
  const [isVideoOpen, setIsVideoOpen] = useState<boolean>(false);
  const [selectedService, setSelectedService] = useState<string>('Heart Consultation');

  const handleOpenBooking = (serviceName?: string) => {
    if (serviceName) setSelectedService(serviceName);
    setIsBookingOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 relative selection:bg-teal-700 selection:text-white overflow-x-hidden">
      
      {/* Active Theory Fullscreen WebGL 3D Spatial Universe (Light Crystal Particles) */}
      <ActiveTheoryHeartScene />

      {/* Active Theory Magnetic Custom Cursor */}
      <CustomCursor />

      {/* Active Theory HUD Telemetry Overlay */}
      <HudOverlay />

      {/* Navigation */}
      <Navbar onOpenBooking={() => handleOpenBooking()} />

      {/* Active Theory Kinetic Scroll Harness (Fluid Wave Distortion + Chromatic Aberration + 3D Incline Tilt) */}
      <ActiveTheoryScrollHarness>
        <main className="relative z-10 space-y-24 sm:space-y-32">
          {/* Section 01: Hero & Clinical Quick Info */}
          <section id="hero" className="pt-2">
            <ParallaxSection>
              <HeroSection 
                onOpenBooking={() => handleOpenBooking()} 
                onOpenVideo={() => setIsVideoOpen(true)} 
              />
            </ParallaxSection>
            <div className="mt-8">
              <ParallaxSection>
                <QuickInfoBanner />
              </ParallaxSection>
            </div>
          </section>

          {/* Section 02: Cardiology Services Grid */}
          <section id="services">
            <ParallaxSection>
              <ServicesSection onSelectServiceForBooking={(srv) => handleOpenBooking(srv)} />
            </ParallaxSection>
          </section>

          {/* Section 03: Real-Time Interactive ECG Telemetry Lab */}
          <section id="telemetry" className="relative">
            <ParallaxSection>
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="mb-8 text-center max-w-2xl mx-auto">
                  <span className="inline-flex items-center gap-2 rounded-full bg-teal-50 px-4 py-1.5 text-xs font-mono font-bold text-brand-teal border border-teal-200 shadow-sm">
                    <Activity className="h-3.5 w-3.5 text-brand-teal animate-pulse" />
                    <span>[ 03 // REAL-TIME ECG TELEMETRY ]</span>
                  </span>
                  <h2 className="mt-3 text-3xl sm:text-5xl font-serif font-bold text-slate-900 tracking-tight">
                    Cardiac Telemetry Lab
                  </h2>
                  <p className="mt-2 text-slate-600 text-sm font-mono">
                    Real-time cardiac electrophysiology engine. Adjust cardiac presets and heart rate frequencies below.
                  </p>
                </div>
                <EcgOscilloscope />
              </div>
            </ParallaxSection>
          </section>

          {/* Section 04: About Dr. Anil Sharma */}
          <section id="about">
            <ParallaxSection>
              <AboutDoctor 
                onOpenVideo={() => setIsVideoOpen(true)} 
                onOpenBooking={() => handleOpenBooking()} 
              />
            </ParallaxSection>
          </section>

          {/* Section 05: Cardiac Risk Assessment Calculator */}
          <section id="risk-quiz">
            <ParallaxSection>
              <CardiacRiskQuiz onOpenBooking={() => handleOpenBooking()} />
            </ParallaxSection>
          </section>

          {/* Section 06: Testimonials & Care Experience */}
          <section id="testimonials" className="space-y-16">
            <ParallaxSection>
              <HeartbeatBanner onOpenBooking={() => handleOpenBooking()} />
            </ParallaxSection>
            <ParallaxSection>
              <TestimonialsSection />
            </ParallaxSection>
          </section>

          {/* Section 07: Clinical Articles & Research */}
          <section id="blog">
            <ParallaxSection>
              <BlogAndArticles />
            </ParallaxSection>
          </section>
        </main>

        {/* Footer */}
        <footer id="footer" className="relative z-10 mt-32">
          <Footer />
        </footer>
      </ActiveTheoryScrollHarness>

      {/* Floating CTA Consultation Terminal Button */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col gap-3">
        <button
          onClick={() => {
            soundManager.playClick();
            handleOpenBooking();
          }}
          className="flex items-center gap-2 rounded-full bg-brand-teal hover:bg-brand-tealLight px-6 py-3.5 text-xs font-mono font-bold text-white uppercase shadow-xl shadow-brand-teal/25 hover:scale-105 active:scale-95 transition-all"
        >
          <Calendar className="h-4 w-4 text-teal-200" />
          <span className="hidden sm:inline">Book Consultation</span>
        </button>
      </div>

      {/* Appointment Scheduler Terminal Modal */}
      <AppointmentModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        preSelectedService={selectedService}
      />

      {/* Video Story Broadcast Modal */}
      <VideoModal
        isOpen={isVideoOpen}
        onClose={() => setIsVideoOpen(false)}
        onOpenBooking={() => handleOpenBooking()}
      />
    </div>
  );
}

export default App;
