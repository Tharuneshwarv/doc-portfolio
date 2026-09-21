import React, { useState } from 'react';
import { ArrowRight, Clock, X } from 'lucide-react';
import { soundManager } from '../sound/SoundFX';
import { ParallaxSection, TiltCard, ParallaxImage, ParallaxItem } from '../ui/ParallaxWrapper';
import doctorData from '../../data/doctorData.json';

export const BlogAndArticles: React.FC = () => {
  const [activeArticle, setActiveArticle] = useState<number | null>(null);
  const { articles } = doctorData;

  const currentArticleData = articles.find(a => a.id === activeArticle);

  return (
    <ParallaxSection className="py-24 relative z-10" zoom fade>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-16">
          <div>
            <div className="flex items-center gap-2 mb-2 font-mono text-xs text-brand-teal font-bold">
              <span>[ 07 // CLINICAL DISPATCHES ]</span>
            </div>
            <ParallaxItem speed={0.9}>
              <h2 className="text-3xl sm:text-5xl font-serif font-bold text-slate-900 tracking-tight">
                Latest from the Blog
              </h2>
            </ParallaxItem>
            <p className="mt-2 text-base text-slate-600">
              Evidence-based heart health articles, preventive routines, and dietary science.
            </p>
          </div>

          <a
            href="#blog"
            onClick={(e) => { e.preventDefault(); soundManager.playClick(); }}
            className="group inline-flex items-center gap-2 text-sm font-bold text-[#0A4D52] hover:text-[#0E7490] transition-colors"
          >
            <span>View All Articles</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </a>
        </div>

        {/* 3 Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {articles.map((art) => (
            <TiltCard
              key={art.id}
              onClick={() => {
                soundManager.playClick();
                setActiveArticle(art.id);
              }}
              className="flex flex-col rounded-3xl bg-white overflow-hidden border border-slate-200 shadow-sm hover:shadow-2xl hover:border-teal-200 transition-all cursor-pointer group"
            >
              {/* Article Image */}
              <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                <ParallaxImage
                  src={art.image}
                  alt={art.title}
                  containerClassName="w-full h-full"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute top-3 left-3 rounded-full bg-slate-900/80 backdrop-blur-md px-3 py-1 text-[10px] font-mono font-bold text-teal-300">
                  {art.category}
                </div>
              </div>

              {/* Body */}
              <div className="flex-1 p-6 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
                    <Clock className="h-3 w-3" />
                    <span>{art.readTime}</span>
                    <span>•</span>
                    <span>{art.date}</span>
                  </div>

                  <h3 className="text-lg font-serif font-bold text-slate-900 group-hover:text-[#0A4D52] transition-colors leading-snug">
                    {art.title}
                  </h3>

                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {art.excerpt}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-bold text-[#0A4D52] group-hover:underline">
                    Read Article →
                  </span>
                  <span className="text-[10px] font-mono text-slate-400 font-medium">
                    {art.code}
                  </span>
                </div>
              </div>
            </TiltCard>
          ))}
        </div>

      </div>

      {/* Reader Modal */}
      {currentArticleData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-3xl bg-white p-6 sm:p-8 shadow-2xl border border-slate-200">
            
            <button
              onClick={() => setActiveArticle(null)}
              className="absolute top-6 right-6 flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900 transition-all"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="space-y-4">
              <span className="inline-block rounded-full bg-teal-50 px-3 py-1 text-xs font-mono font-bold text-[#0A4D52] border border-teal-200">
                {currentArticleData.category}
              </span>

              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900">
                {currentArticleData.title}
              </h2>

              <div className="flex items-center gap-3 text-xs font-mono text-slate-500 pb-4 border-b border-slate-100">
                <span>{currentArticleData.date}</span>
                <span>•</span>
                <span>{currentArticleData.readTime}</span>
              </div>

              <div className="relative h-64 w-full rounded-2xl overflow-hidden my-4">
                <img
                  src={currentArticleData.image}
                  alt={currentArticleData.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="prose prose-slate max-w-none text-slate-700 text-sm leading-relaxed space-y-4">
                <p className="font-semibold text-slate-900 text-base">
                  {currentArticleData.excerpt}
                </p>
                <p>
                  {currentArticleData.content}
                </p>
              </div>

              <div className="pt-6 mt-6 border-t border-slate-100 flex justify-end">
                <button
                  onClick={() => setActiveArticle(null)}
                  className="rounded-xl bg-[#0A4D52] text-white px-6 py-2.5 text-xs font-bold hover:bg-[#0E7490] transition-colors"
                >
                  Close Article
                </button>
              </div>
            </div>

          </div>
        </div>
      )}
    </ParallaxSection>
  );
};
