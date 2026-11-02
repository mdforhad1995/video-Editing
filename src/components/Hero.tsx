import React, { useState } from 'react';
import { Play, Sparkles, CheckCircle2, TrendingUp, Scissors, Volume2, Video, Award, ShieldCheck } from 'lucide-react';
import { CLIPPASIA_INFO } from '../data/mockData';
import { useLanguage } from '../context/LanguageContext';

interface HeroProps {
  onOpenTestEdit: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenTestEdit }) => {
  const [activeMode, setActiveMode] = useState<'with' | 'without'>('with');
  const { t, currentLanguage } = useLanguage();

  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden bg-gradient-to-b from-[#06070B] via-[#090C15] to-[#06070B]">
      {/* Background ambient lighting - unified electric cyan & sapphire cinematic glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[380px] bg-gradient-to-tr from-cyan-500/12 via-blue-600/10 to-transparent blur-[140px] rounded-full pointer-events-none" />
      <div className="absolute top-1/3 -right-24 w-96 h-96 bg-cyan-600/10 blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Core Value Proposition */}
          <div className="lg:col-span-7 space-y-6 text-left">
            {/* Division Sub-Kicker (Zero-pill clean metadata style) */}
            <div className="flex flex-wrap items-center gap-y-1 gap-x-2 text-xs font-medium text-cyan-400 tracking-wide uppercase">
              <span>{CLIPPASIA_INFO.brandName} Studio</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span>{t('heroBadge')}</span>
              <span aria-hidden="true" className="text-slate-600 hidden xs:inline">·</span>
              <span className="text-slate-400 hidden xs:inline">USA · UAE · Global Hub</span>
            </div>

            {/* Display Headline with text-wrap: balance */}
            <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-[3.4rem] font-extrabold text-white tracking-tight leading-[1.12] [text-wrap:balance]">
              {currentLanguage === 'en' ? (
                <>
                  Stop Losing <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-rose-300 to-amber-300">70% of Viewers</span> in the First 3 Seconds.
                </>
              ) : (
                <>
                  {t('heroTitlePart1')} <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-300 to-indigo-300">{t('heroTitlePart2')}</span>
                </>
              )}
            </h1>

            {/* Explanatory Body */}
            <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
              {t('heroSubtitle')}
            </p>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <button
                onClick={onOpenTestEdit}
                className="px-6 py-3.5 text-sm font-semibold text-white bg-gradient-to-r from-cyan-500 via-cyan-400 to-blue-600 hover:from-cyan-400 hover:to-blue-500 rounded-xl shadow-lg shadow-cyan-500/25 transition-all duration-200 hover:-translate-y-0.5 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>{t('heroCtaPrimary')}</span>
              </button>

              <a
                href="#comparison"
                className="px-6 py-3.5 text-sm font-medium text-slate-200 bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 rounded-xl transition-all duration-200 flex items-center justify-center gap-2"
              >
                <Play className="w-4 h-4 text-cyan-400" />
                <span>{t('heroCtaSecondary')}</span>
              </a>
            </div>

            {/* Trust highlights (No pills, clean unboxed markers) */}
            <div className="pt-4 flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-slate-400">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                <span>Zero Risk · No Credit Card Required</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                <span>Unlimited Revisions Included</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                <span>Direct Slack & WhatsApp Support</span>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Video Studio Simulation */}
          <div className="lg:col-span-5">
            {/* Primary Player Authority & Certification Bar */}
            <div className="flex flex-wrap items-center justify-between gap-2.5 mb-3 px-1">
              {/* Clipp Asia Studio Official Logo */}
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/25">
                  <Video className="w-3.5 h-3.5 text-white" />
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-extrabold tracking-tight text-white">
                    Clipp<span className="text-cyan-400">Asia</span>
                  </span>
                  <span className="text-[10px] font-mono font-bold tracking-widest uppercase text-cyan-300 px-1.5 py-0.5 rounded bg-cyan-950/70 border border-cyan-800/60 shadow-sm">
                    Studio
                  </span>
                </div>
              </div>

              {/* Professional Studio Certification Badge */}
              <div className="inline-flex items-center gap-1.5 bg-gradient-to-r from-slate-900 via-slate-900/90 to-cyan-950/60 border border-cyan-500/30 rounded-full px-3 py-1 shadow-md shadow-black/30">
                <div className="w-4 h-4 rounded-full bg-cyan-500/20 flex items-center justify-center text-cyan-300">
                  <ShieldCheck className="w-3 h-3 text-cyan-400" />
                </div>
                <span className="text-[11px] font-medium text-slate-200">
                  <span className="text-cyan-300 font-bold">Studio Certified</span> · Broadcast Facility
                </span>
              </div>
            </div>

            <div className="bg-[#0D0F17] border border-slate-800/90 rounded-2xl shadow-2xl shadow-black/60 p-4 md:p-5 relative overflow-hidden">
              
              {/* Studio Window Header Bar */}
              <div className="flex items-center justify-between pb-3.5 border-b border-slate-800/80 text-xs">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-rose-500/80 inline-block shrink-0" />
                  <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-amber-500/80 inline-block shrink-0" />
                  <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-emerald-500/80 inline-block shrink-0" />
                  <span className="ml-1 font-mono text-slate-300 text-[10px] sm:text-[11px] truncate max-w-[100px] xs:max-w-[140px] sm:max-w-none">
                    ClippAsia_Master_4K.prproj
                  </span>
                </div>
                
                {/* Mode Toggle (Interactive Segmented Control) */}
                <div className="flex items-center bg-slate-900 p-0.5 rounded-lg border border-slate-800 text-[11px] font-medium shrink-0">
                  <button
                    onClick={() => setActiveMode('without')}
                    className={`px-2 sm:px-2.5 py-1 sm:py-1 rounded-md transition-all active:scale-95 ${
                      activeMode === 'without'
                        ? 'bg-rose-500/20 text-rose-300 font-semibold shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Raw Footage
                  </button>
                  <button
                    onClick={() => setActiveMode('with')}
                    className={`px-2 sm:px-2.5 py-1 sm:py-1 rounded-md transition-all active:scale-95 ${
                      activeMode === 'with'
                        ? 'bg-cyan-500/20 text-cyan-300 font-semibold shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Clippasia Cut
                  </button>
                </div>
              </div>

              {/* Real Live Video Preview Frame */}
              <div className="mt-3.5 rounded-xl aspect-[16/10] relative overflow-hidden flex flex-col justify-between p-4 border border-slate-800/60 bg-black">
                
                {/* Background HTML5 Video Element */}
                <video
                  src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4"
                  loop
                  autoPlay
                  muted
                  playsInline
                  className={`absolute inset-0 w-full h-full object-cover transition-all duration-500 ${
                    activeMode === 'with'
                      ? 'filter contrast-115 saturate-125 brightness-105'
                      : 'filter contrast-[0.55] saturate-[0.15] brightness-[1.12]'
                  }`}
                />

                {/* Dark Vignette Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/60 pointer-events-none" />

                {/* Visual Simulation Overlays according to mode */}
                {activeMode === 'without' ? (
                  <div className="relative z-10 flex flex-col justify-between h-full pointer-events-none">
                    {/* Top overlay badge */}
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono tracking-wider uppercase px-2.5 py-0.5 rounded bg-rose-950/80 text-rose-300 border border-rose-800/50 flex items-center gap-1.5 shadow-md">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
                        Raw Sony S-Log3 Uncut
                      </span>
                      <span className="text-[11px] font-mono text-rose-400 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded border border-rose-500/30">
                        72% Drop Rate at 00:03
                      </span>
                    </div>

                    {/* Center Dull Text Hook */}
                    <div className="space-y-1 text-center my-auto">
                      <div className="inline-block bg-rose-950/80 border border-rose-700/50 text-rose-300 text-[10px] font-mono px-2 py-0.5 uppercase tracking-wider rounded">
                        NO HOOK · UNEDITED PAUSE
                      </div>
                      <div className="text-lg sm:text-xl font-bold text-slate-300 tracking-tight drop-shadow">
                        &quot;Awkward 3.5s dead air & room echo...&quot;
                      </div>
                      <div className="text-[10px] text-rose-400 font-mono">
                        Flat 0.0dB Audio · Zero Sound Design
                      </div>
                    </div>

                    {/* Bottom audio alert */}
                    <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono pt-2 border-t border-white/10">
                      <span className="text-rose-400">Mic Hum · No Sound FX</span>
                      <span>Single Stationary Angle</span>
                    </div>
                  </div>
                ) : (
                  <div className="relative z-10 flex flex-col justify-between h-full pointer-events-none">
                    {/* Top overlay badge */}
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono tracking-wider uppercase px-2.5 py-0.5 rounded bg-cyan-500/30 backdrop-blur-md text-cyan-300 border border-cyan-400/40 font-bold shadow-md">
                        Color Graded · DaVinci Cinema LUT
                      </span>
                      <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-1 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded border border-emerald-500/30">
                        <TrendingUp className="w-3.5 h-3.5" />
                        84% Retention at 00:30
                      </span>
                    </div>

                    {/* Center Animated Kinetic Text Hook */}
                    <div className="space-y-1 text-center my-auto">
                      <div className="inline-block bg-cyan-400 text-slate-950 text-[10px] font-black px-2.5 py-0.5 uppercase tracking-wider rounded shadow-md">
                        ⚡️ KINETIC HOOK ARCHITECTURE
                      </div>
                      <div className="text-lg sm:text-2xl font-black text-white tracking-tight drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
                        &quot;How We Tripled Watch Time&quot;
                      </div>
                      <div className="text-[11px] text-cyan-300 font-mono font-semibold">
                        [Foley: Deep Sub-Bass Impact + Whoosh]
                      </div>
                    </div>

                    {/* Bottom audio and kinetic captions */}
                    <div className="flex items-center justify-between text-[11px] text-slate-300 font-mono pt-2 border-t border-white/10">
                      <span className="flex items-center gap-1 text-cyan-400 font-semibold">
                        <Volume2 className="w-3.5 h-3.5" />
                        -14 LUFS Clean Master
                      </span>
                      <span className="text-emerald-400">Pattern Interrupt @ 00:03.2</span>
                    </div>
                  </div>
                )}

                {/* Timecode overlay */}
                <div className="absolute top-3 left-3 z-20 text-[10px] font-mono text-cyan-400 bg-black/80 backdrop-blur-md px-2 py-0.5 rounded border border-slate-800">
                  TC: 00:01:24:18
                </div>

                {/* Studio Certification Watermark Seal */}
                <div className="absolute bottom-3 right-3 z-20 flex items-center gap-1.5 bg-slate-950/85 backdrop-blur-md px-2 py-0.5 rounded border border-cyan-500/40 shadow-lg pointer-events-none">
                  <Award className="w-3 h-3 text-cyan-400" />
                  <span className="text-[9px] font-mono font-bold text-slate-200 tracking-wider uppercase">
                    {activeMode === 'with' ? 'Clipp Asia Studio Certified' : 'Uncertified Ingest'}
                  </span>
                </div>
              </div>

              {/* Simulated NLE Audio & Video Multi-track Timeline */}
              <div className="mt-3.5 space-y-1.5 pt-2 border-t border-slate-800/80">
                <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono px-1">
                  <span>Timeline: Multi-Track Cut</span>
                  <span>{activeMode === 'with' ? '38 Cuts / 4 Audio Stems' : '1 Uncut Raw Clip'}</span>
                </div>

                {/* Video Track V2: B-Roll & Titles */}
                <div className="h-6 bg-slate-900 rounded flex items-center px-2 gap-1 overflow-hidden border border-slate-800">
                  <span className="text-[9px] font-mono text-slate-500 w-5 shrink-0">V2</span>
                  {activeMode === 'with' ? (
                    <div className="flex items-center gap-1.5 w-full">
                      <span className="h-4 px-2 rounded bg-cyan-600/60 text-[9px] text-cyan-200 flex items-center shrink-0">
                        Kinetic Hook
                      </span>
                      <span className="h-4 px-2.5 rounded bg-blue-600/60 text-[9px] text-blue-200 flex items-center shrink-0">
                        4K B-Roll B1
                      </span>
                      <span className="h-4 px-2 rounded bg-amber-600/60 text-[9px] text-amber-200 flex items-center shrink-0">
                        Product Callout
                      </span>
                    </div>
                  ) : (
                    <span className="text-[10px] text-slate-600 italic">No secondary footage or graphic overlays</span>
                  )}
                </div>

                {/* Video Track V1: A-Roll */}
                <div className="h-6 bg-slate-900 rounded flex items-center px-2 gap-1 overflow-hidden border border-slate-800">
                  <span className="text-[9px] font-mono text-slate-500 w-5 shrink-0">V1</span>
                  {activeMode === 'with' ? (
                    <div className="flex items-center gap-1 w-full">
                      <span className="h-4 w-12 rounded bg-slate-700 text-[8px] text-slate-300 flex items-center justify-center shrink-0">
                        Clip 01
                      </span>
                      <span className="h-4 w-16 rounded bg-slate-700 text-[8px] text-slate-300 flex items-center justify-center shrink-0">
                        Jump Cut
                      </span>
                      <span className="h-4 w-20 rounded bg-slate-700 text-[8px] text-slate-300 flex items-center justify-center shrink-0">
                        Zoom Punch
                      </span>
                      <span className="h-4 flex-1 rounded bg-slate-700 text-[8px] text-slate-300 flex items-center justify-center shrink-0">
                        Punch In
                      </span>
                    </div>
                  ) : (
                    <div className="w-full h-4 bg-slate-800/80 rounded flex items-center px-2 text-[9px] text-slate-500">
                      C0042_RAW_FULL_TAKE_UNTRIMMED.MOV (Rambling)
                    </div>
                  )}
                </div>

                {/* Audio Track A1 & A2: Foley Sound Design */}
                <div className="h-6 bg-slate-900 rounded flex items-center px-2 gap-1 overflow-hidden border border-slate-800">
                  <span className="text-[9px] font-mono text-slate-500 w-5 shrink-0">A1</span>
                  {activeMode === 'with' ? (
                    <div className="flex items-center gap-1 w-full">
                      <span className="h-4 px-1.5 rounded bg-emerald-700/60 text-[8px] text-emerald-200 flex items-center shrink-0">
                        Whoosh SFX
                      </span>
                      <span className="h-4 px-2 rounded bg-emerald-700/60 text-[8px] text-emerald-200 flex items-center shrink-0">
                        Sub Bass Drop
                      </span>
                      <span className="h-4 px-2 rounded bg-indigo-700/60 text-[8px] text-indigo-200 flex items-center shrink-0">
                        Lofi Beat Beat-Drop
                      </span>
                    </div>
                  ) : (
                    <span className="text-[10px] text-slate-600 italic">Unprocessed camera mic with room echo</span>
                  )}
                </div>
              </div>

              {/* Professional Studio Certification Specifications Bar */}
              <div className="mt-3.5 pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-[11px]">
                <div className="flex items-center gap-1.5 text-slate-300">
                  <ShieldCheck className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span className="font-semibold text-white">SMPTE & DaVinci Certified</span>
                  <span className="text-slate-600">·</span>
                  <span className="font-mono text-slate-400 text-[10px]">ProRes 422 HQ / -14 LUFS</span>
                </div>
                <div className="flex items-center gap-1.5 font-mono text-[10px] text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 px-2 py-0.5 rounded">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>24-48h SLA Active</span>
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* Full-width 4-Column Proof & Metric Strip below Hero Split */}
        <div className="mt-16 sm:mt-20 pt-8 border-t border-slate-800/80 grid grid-cols-2 md:grid-cols-4 gap-6 text-left">
          <div className="space-y-1">
            <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono tabular-nums">
              {CLIPPASIA_INFO.stats.videosDelivered}
            </div>
            <div className="text-xs text-slate-400 font-medium">
              Commercial Videos Delivered
            </div>
          </div>

          <div className="space-y-1">
            <div className="text-2xl sm:text-3xl font-extrabold text-cyan-400 font-mono tabular-nums">
              {CLIPPASIA_INFO.stats.retentionBoost}
            </div>
            <div className="text-xs text-slate-400 font-medium">
              Average Watch Time Lift
            </div>
          </div>

          <div className="space-y-1">
            <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono tabular-nums">
              4.6x
            </div>
            <div className="text-xs text-slate-400 font-medium">
              Peak Return on Ad Spend (ROAS)
            </div>
          </div>

          <div className="space-y-1">
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400 font-mono tabular-nums">
              {CLIPPASIA_INFO.stats.avgTurnaround}
            </div>
            <div className="text-xs text-slate-400 font-medium">
              Guaranteed Delivery SLA
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
