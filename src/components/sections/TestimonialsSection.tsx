import React from 'react';
import { Star, ArrowRight } from 'lucide-react';
import { soundManager } from '../sound/SoundFX';
import { ParallaxSection, TiltCard, ParallaxItem } from '../ui/ParallaxWrapper';
import doctorData from '../../data/doctorData.json';

export const TestimonialsSection: React.FC = () => {
  const { testimonials } = doctorData;

  return (
    <ParallaxSection className="py-20 relative z-10" zoom fade>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header matching Design 1 */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
          <ParallaxItem speed={0.9}>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-slate-900">
              Patient Testimonials
            </h2>
          </ParallaxItem>

          <a
            href="#testimonials"
            onClick={(e) => { e.preventDefault(); soundManager.playClick(); }}
            className="group inline-flex items-center gap-1.5 text-sm font-bold text-[#0A4D52] hover:text-[#0E7490] transition-colors"
          >
            <span>View All</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </a>
        </div>

        {/* Testimonials Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <TiltCard
              key={t.id}
              className="flex flex-col justify-between rounded-2xl bg-white/90 backdrop-blur-md p-6 border border-slate-200/80 shadow-sm hover:shadow-xl transition-all"
            >
              <div>
                {/* 5 Stars */}
                <div className="flex items-center gap-1 text-amber-400 mb-4">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-amber-400" />
                  ))}
                </div>

                {/* Comment */}
                <p className="text-slate-700 text-sm leading-relaxed italic">
                  {t.comment}
                </p>
              </div>

              {/* Patient Profile */}
              <div className="flex items-center gap-3 pt-6 mt-6 border-t border-slate-100">
                <img
                  src={t.avatar}
                  alt={t.name}
                  className="h-10 w-10 rounded-full object-cover border border-teal-200"
                />
                <div>
                  <h4 className="text-sm font-bold text-slate-900">{t.name}</h4>
                  <p className="text-xs text-slate-500">{t.location}</p>
                </div>
              </div>
            </TiltCard>
          ))}
        </div>

      </div>
    </ParallaxSection>
  );
};
