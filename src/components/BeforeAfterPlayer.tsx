import React, { useState, useRef, useEffect } from 'react';
import { Sliders, Volume2, VolumeX, Sparkles, RefreshCw, Play, Pause } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useCms } from '../context/CmsContext';

export const BeforeAfterPlayer: React.FC = () => {
  const { t } = useLanguage();
  const { cms } = useCms();
  const ba = cms.beforeAfter;
  const [sliderPosition, setSliderPosition] = useState<number>(50);
  const [containerWidth, setContainerWidth] = useState<number>(800);
  const [isAudioActive, setIsAudioActive] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef<boolean>(false);

  // Measure container width for pixel-perfect before/after alignment across all mobile screens
  useEffect(() => {
    if (!containerRef.current) return;
    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.clientWidth);
      }
    };
    updateWidth();
    const observer = new ResizeObserver(updateWidth);
    observer.observe(containerRef.current);
    window.addEventListener('resize', updateWidth);
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', updateWidth);
    };
  }, []);

  // Video references for synchronized real playback
  const afterVideoRef = useRef<HTMLVideoElement>(null);
  const beforeVideoRef = useRef<HTMLVideoElement>(null);

  const videoSource = ba.videoUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4';

  // Synchronize playback between the two video layers
  useEffect(() => {
    const afterVid = afterVideoRef.current;
    const beforeVid = beforeVideoRef.current;
    if (!afterVid || !beforeVid) return;

    const handleTimeUpdate = () => {
      if (Math.abs(beforeVid.currentTime - afterVid.currentTime) > 0.15) {
        beforeVid.currentTime = afterVid.currentTime;
      }
    };

    const handlePlay = () => {
      beforeVid.play().catch(() => {});
      setIsPlaying(true);
    };

    const handlePause = () => {
      beforeVid.pause();
      setIsPlaying(false);
    };

    afterVid.addEventListener('timeupdate', handleTimeUpdate);
    afterVid.addEventListener('play', handlePlay);
    afterVid.addEventListener('pause', handlePause);

    // Initial play attempt
    afterVid.play().catch(() => {});
    beforeVid.play().catch(() => {});

    return () => {
      afterVid.removeEventListener('timeupdate', handleTimeUpdate);
      afterVid.removeEventListener('play', handlePlay);
      afterVid.removeEventListener('pause', handlePause);
    };
  }, []);

  // Sync Audio Toggle
  useEffect(() => {
    if (afterVideoRef.current) {
      afterVideoRef.current.muted = !isAudioActive;
    }
  }, [isAudioActive]);

  const togglePlayPause = () => {
    const afterVid = afterVideoRef.current;
    const beforeVid = beforeVideoRef.current;
    if (!afterVid || !beforeVid) return;

    if (isPlaying) {
      afterVid.pause();
      beforeVid.pause();
      setIsPlaying(false);
    } else {
      afterVid.play().catch(() => {});
      beforeVid.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  const handlePointerDown = () => {
    isDragging.current = true;
  };

  const handlePointerUp = () => {
    isDragging.current = false;
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percentage);
  };

  return (
    <section id="comparison" className="py-24 bg-[#08090D] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-14">
          <div className="text-xs font-semibold uppercase tracking-wider text-cyan-400">
            {ba.preTitle || t('comparePre')}
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight [text-wrap:balance]">
            {ba.title || t('compareTitle')}
          </h2>
          <p className="text-base text-slate-400 leading-relaxed">
            {ba.subtitle || t('compareSubtitle')}
          </p>
        </div>

        {/* Interactive Real Video Split-Screen Container */}
        <div className="max-w-4xl mx-auto">
          <div
            ref={containerRef}
            onPointerDown={(e) => {
              isDragging.current = true;
              try { e.currentTarget.setPointerCapture(e.pointerId); } catch (_) {}
              handlePointerMove(e);
            }}
            onPointerMove={(e) => {
              if (isDragging.current || e.buttons === 1) handlePointerMove(e);
            }}
            onPointerUp={(e) => {
              isDragging.current = false;
              try { e.currentTarget.releasePointerCapture(e.pointerId); } catch (_) {}
            }}
            onPointerCancel={() => {
              isDragging.current = false;
            }}
            className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden select-none cursor-ew-resize border border-slate-800 shadow-2xl bg-black group touch-none"
          >
            {/* 1. RIGHT SIDE: AFTER (Clippasia Master Cut) - Full Width Background Video */}
            <div className="absolute inset-0 w-full h-full">
              <video
                ref={afterVideoRef}
                src={videoSource}
                loop
                playsInline
                autoPlay
                muted={!isAudioActive}
                className="w-full h-full object-cover filter contrast-110 saturate-120"
              />

              {/* Dark vignette gradient for cinematic contrast */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/60 pointer-events-none" />

              {/* Top Tags */}
              <div className="absolute top-2.5 right-2.5 sm:top-4 sm:right-4 z-10 flex items-center gap-2 pointer-events-none">
                <span className="px-2 sm:px-3 py-0.5 sm:py-1 rounded-md bg-cyan-500/30 backdrop-blur-md text-cyan-300 border border-cyan-400/40 font-mono text-[10px] sm:text-xs flex items-center gap-1.5 shadow-lg font-bold">
                  <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-cyan-300" />
                  {ba.afterBadge || 'AFTER: Master Grade'}
                </span>
              </div>

              {/* Center Kinetic Dynamic Title & Subtitles Hook Overlay */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center px-4">
                <div className="space-y-1 sm:space-y-1.5 max-w-md">
                  <div className="inline-block bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 font-black text-[10px] sm:text-sm px-2.5 py-0.5 sm:px-3 sm:py-1 rounded uppercase tracking-wider shadow-lg">
                    {ba.hookPill || '⚡️ 3-SECOND PATTERN INTERRUPT'}
                  </div>
                  <div className="text-lg sm:text-2xl md:text-3xl font-black text-white tracking-tight drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)]">
                    {ba.hookTitle || '"Engineered for Pure Retention"'}
                  </div>
                  <div className="text-[10px] sm:text-sm font-mono text-cyan-300 font-semibold drop-shadow">
                    {ba.hookSubtitle || '+184% Watch Time · Dynamic Zoom Punch-in'}
                  </div>
                </div>
              </div>

              {/* Bottom Multi-Stem Audio & Color Grade Markers */}
              <div className="absolute bottom-2.5 right-2.5 sm:bottom-4 sm:right-4 z-10 flex items-center gap-2 sm:gap-3 text-[10px] sm:text-xs font-mono pointer-events-none">
                <span className="hidden sm:flex items-center gap-1.5 text-emerald-400 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded border border-emerald-500/30">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  {ba.audioStemLabel || 'Foley SFX · Sub-Bass Riser'}
                </span>
                <span className="text-cyan-300 bg-black/60 backdrop-blur-md px-2 sm:px-2.5 py-0.5 sm:py-1 rounded border border-cyan-500/30 font-semibold">
                  {ba.colorGradeLabel || 'DaVinci 3D Grade'}
                </span>
              </div>
            </div>

            {/* 2. LEFT SIDE: BEFORE (Raw Unedited Footage) - Dynamically sized to containerWidth */}
            <div
              className="absolute inset-y-0 left-0 overflow-hidden border-r-2 border-cyan-400 shadow-[6px_0_30px_rgba(6,182,212,0.6)] z-20"
              style={{ width: `${sliderPosition}%` }}
            >
              <div
                className="relative h-full max-w-none"
                style={{ width: `${containerWidth || 800}px` }}
              >
                {/* Real video with authentic flat S-Log3 desaturation & gamma wash */}
                <video
                  ref={beforeVideoRef}
                  src={videoSource}
                  loop
                  playsInline
                  autoPlay
                  muted
                  className="w-full h-full object-cover filter contrast-[0.55] saturate-[0.18] brightness-[1.12]"
                />

                {/* Flat gray haze simulation */}
                <div className="absolute inset-0 bg-[#282f3c]/20 pointer-events-none" />

                {/* Top Badge: Raw Log Footage */}
                <div className="absolute top-2.5 left-2.5 sm:top-4 sm:left-4 z-10 flex items-center gap-2 pointer-events-none">
                  <span className="px-2 sm:px-3 py-0.5 sm:py-1 rounded-md bg-slate-900/85 backdrop-blur-md text-slate-300 border border-slate-700 font-mono text-[10px] sm:text-xs flex items-center gap-1.5 shadow-lg">
                    <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping inline-block mr-0.5" />
                    BEFORE: Raw Log
                  </span>
                </div>

                {/* Center Dull text simulation */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center px-4">
                  <div className="space-y-1 sm:space-y-1.5 max-w-md opacity-80">
                    <div className="text-slate-300 text-[10px] sm:text-xs font-mono bg-black/60 backdrop-blur-md px-2 py-0.5 rounded inline-block">
                      [Raw Log Profile · 0 Color Science]
                    </div>
                    <div className="text-base sm:text-xl font-bold text-slate-200 drop-shadow">
                      &quot;Uh... so today we are talking about...&quot;
                    </div>
                    <div className="text-[10px] sm:text-xs font-mono text-rose-400 font-semibold bg-black/60 px-2 py-0.5 rounded inline-block">
                      Awkward Silence (3.8s dead air)
                    </div>
                  </div>
                </div>

                {/* Bottom flat audio bar */}
                <div className="absolute bottom-2.5 left-2.5 sm:bottom-4 sm:left-4 z-10 flex items-center gap-2 text-[10px] sm:text-xs font-mono pointer-events-none">
                  <span className="text-rose-400 bg-black/70 backdrop-blur-md px-2 sm:px-2.5 py-0.5 sm:py-1 rounded border border-rose-500/30">
                    Room Echo
                  </span>
                  <span className="hidden sm:inline-block text-slate-400 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded border border-slate-700">
                    Flat 0.0dB Unmixed
                  </span>
                </div>
              </div>
            </div>

            {/* 3. Draggable Divider Handle with enhanced mobile touch target */}
            <div
              className="absolute inset-y-0 -ml-5 sm:-ml-4 w-10 sm:w-8 flex items-center justify-center pointer-events-none z-30"
              style={{ left: `${sliderPosition}%` }}
            >
              <div className="w-10 h-10 sm:w-8 sm:h-8 rounded-full bg-cyan-400 text-slate-950 flex items-center justify-center shadow-xl shadow-cyan-500/80 cursor-ew-resize border-2 border-white ring-4 ring-cyan-500/30 transform hover:scale-110 active:scale-110 transition-transform">
                <Sliders className="w-4 h-4 sm:w-3.5 sm:h-3.5" />
              </div>
            </div>
          </div>

          {/* Slider Controls & Real Video Control Bar */}
          <div className="mt-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 text-xs text-slate-400 px-1 sm:px-2 font-mono">
            <div className="flex items-center justify-between sm:justify-start gap-2.5">
              {/* Play / Pause Toggle Button */}
              <button
                onClick={togglePlayPause}
                className="px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 hover:border-cyan-500/50 text-white flex items-center gap-2 transition-colors cursor-pointer shadow-sm text-xs font-semibold"
                aria-label={isPlaying ? 'Pause video' : 'Play video'}
              >
                {isPlaying ? (
                  <>
                    <Pause className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Pause</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 text-cyan-400 fill-cyan-400" />
                    <span>Play</span>
                  </>
                )}
              </button>

              <div className="flex items-center gap-1.5 text-[11px] text-slate-400 truncate">
                <span className="text-cyan-400 font-semibold hidden xs:inline">Drag handle</span>
                <span className="text-slate-500">· Tap anywhere to compare</span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:flex sm:items-center gap-2">
              <button
                onClick={() => setSliderPosition(sliderPosition === 50 ? 85 : 50)}
                className="px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 flex items-center justify-center gap-1.5 transition-colors cursor-pointer text-xs"
              >
                <RefreshCw className="w-3.5 h-3.5 text-cyan-400" />
                <span>Reset 50/50</span>
              </button>

              <button
                onClick={() => setIsAudioActive(!isAudioActive)}
                className="px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 flex items-center justify-center gap-1.5 transition-colors cursor-pointer text-xs"
              >
                {isAudioActive ? (
                  <>
                    <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-300">Sound ON</span>
                  </>
                ) : (
                  <>
                    <VolumeX className="w-3.5 h-3.5 text-slate-500" />
                    <span>Audio Muted</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Key Transformation Checklist */}
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-[#0D0F17] border border-slate-800 space-y-1.5">
              <div className="text-xs font-mono text-cyan-400 font-semibold">01. Dynamic Pacing</div>
              <p className="text-xs text-slate-300">
                All dead air, filler words, and awkward breaths are ruthlessly cut. Micro-zooms are inserted every 3-4 seconds.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#0D0F17] border border-slate-800 space-y-1.5">
              <div className="text-xs font-mono text-cyan-400 font-semibold">02. Sound Design Engine</div>
              <p className="text-xs text-slate-300">
                Studio-grade audio mastering, noise isolation, custom whoosh risers, and subtle bass drops that command attention.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#0D0F17] border border-slate-800 space-y-1.5">
              <div className="text-xs font-mono text-cyan-400 font-semibold">03. Cinema Color Grading</div>
              <p className="text-xs text-slate-300">
                Custom DaVinci Resolve color transforms that convert flat log into rich, filmic, skin-flattering commercial grades.
              </p>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
