import React, { useState, useRef, useEffect } from 'react';
import { TESTIMONIALS_DATA } from '../data/mockData';
import { TestimonialItem } from '../types';
import {
  TrendingUp,
  Star,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Building,
  MapPin,
  Sparkles
} from 'lucide-react';

export const TestimonialsSection: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const filteredTestimonials =
    activeCategory === 'all'
      ? TESTIMONIALS_DATA
      : TESTIMONIALS_DATA.filter((t) => t.category === activeCategory);

  const checkScrollButtons = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 10);
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 10);
    }
  };

  useEffect(() => {
    checkScrollButtons();
    const el = scrollContainerRef.current;
    if (el) {
      el.addEventListener('scroll', checkScrollButtons);
      return () => el.removeEventListener('scroll', checkScrollButtons);
    }
  }, [filteredTestimonials]);

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const { clientWidth } = scrollContainerRef.current;
      const scrollAmount = direction === 'left' ? -clientWidth * 0.75 : clientWidth * 0.75;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const categories = [
    { id: 'all', label: `All Reviews (${TESTIMONIALS_DATA.length})` },
    { id: 'ecommerce', label: 'eCommerce & DTC Brands' },
    { id: 'youtube', label: 'YouTube Creators' },
    { id: 'shortform', label: 'Shorts & TikTok UGC' },
    { id: 'agency', label: 'Agencies & Retainers' }
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-[#06070B] via-[#090C15] to-[#06070B] relative overflow-hidden border-t border-slate-800/80">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-cyan-500/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-96 h-96 bg-blue-600/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div className="space-y-3 max-w-2xl text-left">
            <div className="text-xs font-semibold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Real Quantitative Impact</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight [text-wrap:balance]">
              Verified Client Outcomes Across Global Channels
            </h2>
            <p className="text-base text-slate-400 leading-relaxed">
              Real creators, DTC store owners, and marketing directors sharing verified watch-time, ROAS, and subscriber growth with Clippasia.
            </p>
          </div>

          {/* Scroll Navigation Arrows */}
          <div className="flex items-center gap-3 self-start md:self-end">
            <button
              onClick={() => handleScroll('left')}
              disabled={!canScrollLeft}
              className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 hover:border-cyan-500/50 disabled:opacity-40 disabled:hover:border-slate-800 text-white flex items-center justify-center transition-all cursor-pointer shadow-md"
              aria-label="Previous testimonials"
            >
              <ChevronLeft className="w-5 h-5 text-cyan-400" />
            </button>
            <button
              onClick={() => handleScroll('right')}
              disabled={!canScrollRight}
              className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 hover:border-cyan-500/50 disabled:opacity-40 disabled:hover:border-slate-800 text-white flex items-center justify-center transition-all cursor-pointer shadow-md"
              aria-label="Next testimonials"
            >
              <ChevronRight className="w-5 h-5 text-cyan-400" />
            </button>
          </div>
        </div>

        {/* Category Filter Pills (Functional Buttons) */}
        <div className="flex items-center gap-2 pb-6 overflow-x-auto no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all whitespace-nowrap cursor-pointer shrink-0 ${
                activeCategory === cat.id
                  ? 'bg-slate-800 text-cyan-300 border border-cyan-500/50 shadow-sm font-semibold'
                  : 'bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Horizontal Scrolling Carousel Track */}
        <div
          ref={scrollContainerRef}
          className="flex gap-6 overflow-x-auto pb-8 pt-2 scroll-smooth select-none focus:outline-none"
          style={{ scrollbarWidth: 'thin' }}
        >
          {filteredTestimonials.map((t) => (
            <div
              key={t.id}
              className="w-[320px] sm:w-[380px] md:w-[420px] shrink-0 bg-[#0C0F18] border border-slate-800/90 hover:border-cyan-500/40 rounded-2xl p-6 sm:p-7 flex flex-col justify-between space-y-6 shadow-xl transition-all duration-200 group hover:-translate-y-1 hover:shadow-cyan-500/5"
            >
              <div className="space-y-4">
                {/* Top Row: Stars + Category */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>

                  <span className="text-[11px] font-mono text-cyan-400 bg-cyan-950/40 px-2 py-0.5 rounded border border-cyan-800/40">
                    {t.categoryLabel}
                  </span>
                </div>

                {/* Measurable Metric Result */}
                <div className="flex items-center gap-2 text-sm font-mono text-emerald-400 font-bold bg-emerald-950/20 p-2.5 rounded-lg border border-emerald-900/30">
                  <TrendingUp className="w-4 h-4 shrink-0" />
                  <span>{t.stat}</span>
                </div>

                {/* Review Text */}
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed italic">
                  &quot;{t.quote}&quot;
                </p>
              </div>

              {/* Author & Verification Footer */}
              <div className="space-y-3 pt-4 border-t border-slate-800/80">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-cyan-600 via-blue-600 to-indigo-700 flex items-center justify-center font-bold text-white text-xs font-mono shadow-md shrink-0">
                    {t.avatar}
                  </div>
                  <div className="overflow-hidden">
                    <div className="text-sm font-bold text-white truncate">{t.name}</div>
                    <div className="text-xs text-slate-400 truncate">
                      {t.role} · <span className="text-slate-300">{t.company}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 pt-1">
                  <span className="flex items-center gap-1 text-slate-400">
                    <MapPin className="w-3 h-3 text-cyan-400" />
                    <span>{t.location}</span>
                  </span>
                  <span className="flex items-center gap-1 text-emerald-400">
                    <ShieldCheck className="w-3 h-3" />
                    <span>Verified Deliverable</span>
                  </span>
                </div>
              </div>

            </div>
          ))}
        </div>

        {/* Bottom Social Proof Bar */}
        <div className="mt-8 pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-slate-400">
          <div className="flex items-center gap-2">
            <span className="text-white font-bold">1,250+</span>
            <span>commercial videos edited across USA, UK, UAE & Europe</span>
          </div>

          <div className="flex items-center gap-4 text-cyan-400">
            <span>Average 4.9/5 Rating</span>
            <span>·</span>
            <span>99.4% On-Time SLA Delivery</span>
          </div>
        </div>

      </div>
    </section>
  );
};
