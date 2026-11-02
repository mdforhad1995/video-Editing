import React, { useState, useRef } from 'react';
import { PORTFOLIO_DATA } from '../data/mockData';
import { PortfolioItem, VideoCategory } from '../types';
import { Play, TrendingUp, Sparkles, ArrowUpRight, Film } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface PortfolioSectionProps {
  onSelectProject: (project: PortfolioItem) => void;
}

export const PortfolioSection: React.FC<PortfolioSectionProps> = ({ onSelectProject }) => {
  const { t } = useLanguage();
  const [activeCategory, setActiveCategory] = useState<VideoCategory>('all');
  const [hoveredProjectId, setHoveredProjectId] = useState<string | null>(null);

  const filteredProjects =
    activeCategory === 'all'
      ? PORTFOLIO_DATA
      : PORTFOLIO_DATA.filter((p) => p.category === activeCategory);

  const categories: { id: VideoCategory; label: string }[] = [
    { id: 'all', label: t('portfolioAll') },
    { id: 'ecommerce', label: t('portfolioEcommerce') },
    { id: 'youtube', label: t('portfolioYoutube') },
    { id: 'shortform', label: t('portfolioShorts') },
    { id: 'explainer', label: t('portfolioExplainer') }
  ];

  return (
    <section id="portfolio" className="py-24 bg-gradient-to-b from-[#06070B] via-[#090C16] to-[#06070B] border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="space-y-3 max-w-xl text-left">
            <div className="text-xs font-semibold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
              <Film className="w-3.5 h-3.5" />
              <span>{t('portfolioPre')}</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight [text-wrap:balance]">
              {t('portfolioTitle')}
            </h2>
            <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
              {t('portfolioSubtitle')}
            </p>
          </div>

          {/* Interactive Filter Tabs (Segmented controls with touch scrolling) */}
          <div className="flex items-center gap-1.5 p-1 sm:p-1.5 bg-slate-900/90 border border-slate-800 rounded-xl overflow-x-auto max-w-full no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3 py-2 sm:px-3.5 sm:py-1.5 text-xs font-medium rounded-lg transition-all whitespace-nowrap shrink-0 cursor-pointer active:scale-95 ${
                  activeCategory === cat.id
                    ? 'bg-slate-800 text-cyan-300 shadow-sm border border-cyan-500/50 font-semibold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Portfolio Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => {
            const isHovered = hoveredProjectId === project.id;
            return (
              <div
                key={project.id}
                onClick={() => onSelectProject(project)}
                onMouseEnter={() => setHoveredProjectId(project.id)}
                onMouseLeave={() => setHoveredProjectId(null)}
                className="group bg-[#0C0F18] hover:bg-[#111624] border border-slate-800/90 hover:border-cyan-500/50 rounded-2xl overflow-hidden transition-all duration-300 cursor-pointer flex flex-col justify-between shadow-xl hover:shadow-cyan-500/10 hover:-translate-y-1.5"
              >
                {/* Media Card Preview Frame with Real Live Video Playback on Hover */}
                <div className="relative aspect-[16/10] bg-black overflow-hidden flex items-center justify-center">
                  
                  {/* Real Live HTML5 Video element */}
                  <video
                    src={project.videoUrl}
                    muted
                    loop
                    playsInline
                    autoPlay={isHovered}
                    className={`w-full h-full object-cover transition-transform duration-500 ${
                      isHovered ? 'scale-105 filter contrast-110 saturate-110' : 'opacity-85'
                    }`}
                    ref={(el) => {
                      if (el) {
                        if (isHovered) {
                          el.play().catch(() => {});
                        } else {
                          el.pause();
                          el.currentTime = 1.5; // Set to attractive intro frame
                        }
                      }
                    }}
                  />

                  {/* Top Meta Badges Overlay */}
                  <div className="absolute top-3 inset-x-3 flex items-center justify-between text-[11px] font-mono z-10 pointer-events-none">
                    <span className="bg-black/70 backdrop-blur-md px-2.5 py-0.5 rounded text-cyan-300 border border-cyan-500/30">
                      {project.categoryLabel}
                    </span>
                    <span className="bg-black/70 backdrop-blur-md px-2 py-0.5 rounded text-white font-mono">
                      {project.duration}
                    </span>
                  </div>

                  {/* Bottom Metrics Bar Overlay */}
                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/95 via-black/50 to-transparent p-3 pt-6 flex items-center justify-between text-[11px] font-mono text-emerald-400 z-10 pointer-events-none">
                    <span className="flex items-center gap-1.5 font-bold">
                      <TrendingUp className="w-3.5 h-3.5" />
                      {project.metrics.value}
                    </span>
                    <span className="text-slate-400 font-mono">{project.aspectRatio}</span>
                  </div>

                  {/* Center Play Indicator (fades on hover when video is rolling) */}
                  <div
                    className={`absolute inset-0 bg-black/30 flex items-center justify-center transition-opacity duration-200 pointer-events-none ${
                      isHovered ? 'opacity-0' : 'opacity-100'
                    }`}
                  >
                    <div className="w-12 h-12 rounded-full bg-cyan-400 text-slate-950 flex items-center justify-center shadow-lg transform transition-transform group-hover:scale-110">
                      <Play className="w-5 h-5 ml-0.5 fill-slate-950" />
                    </div>
                  </div>
                </div>

                {/* Card Meta Content */}
                <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <div className="text-xs font-mono text-cyan-400">
                      {project.client}
                    </div>
                    <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors line-clamp-1">
                      {project.title}
                    </h3>
                    <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                      {project.description}
                    </p>
                  </div>

                  {/* Software and Action Footer */}
                  <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1 text-[10px] font-mono text-slate-400 truncate max-w-[200px]">
                      {project.software.slice(0, 2).join(' · ')}
                    </div>
                    <span className="text-cyan-400 font-medium flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      <span>Watch Full Cut</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
