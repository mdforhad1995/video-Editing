import React, { useState, useRef, useEffect } from 'react';
import { PortfolioItem } from '../types';
import {
  X,
  Play,
  Pause,
  CheckCircle2,
  Award,
  ArrowRight,
  Sparkles,
  Volume2,
  VolumeX,
  Sliders,
  RotateCcw,
  Check
} from 'lucide-react';

interface ProjectModalProps {
  project: PortfolioItem | null;
  onClose: () => void;
  onRequestStyle: (project: PortfolioItem) => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({ project, onClose, onRequestStyle }) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [isGraded, setIsGraded] = useState<boolean>(true);

  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    setIsPlaying(true);
    setCurrentTime(0);
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {});
    }
  }, [project]);

  if (!project) return null;

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play().catch(() => {});
        setIsPlaying(true);
      }
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
      if (!duration && videoRef.current.duration) {
        setDuration(videoRef.current.duration);
      }
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = Number(e.target.value);
    setCurrentTime(time);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
    }
  };

  const seekToSeconds = (sec: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = sec;
      setCurrentTime(sec);
      if (!isPlaying) {
        videoRef.current.play().catch(() => {});
        setIsPlaying(true);
      }
    }
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = Math.floor(secs % 60);
    return `${mins}:${remainingSecs < 10 ? '0' : ''}${remainingSecs}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/90 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-[#0C0F18] border border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-auto">
        
        {/* Top Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800/80 bg-slate-900/80">
          <div className="flex items-center gap-2.5 text-xs font-mono text-slate-300">
            <span className="text-cyan-400 font-bold">{project.categoryLabel}</span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span>{project.client}</span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span className="text-emerald-400 font-semibold">{project.metrics.value}</span>
          </div>
          
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-8 space-y-4 sm:space-y-6">
          
          {/* Real HTML5 Video Player Container */}
          <div className="relative aspect-[16/9] w-full rounded-xl overflow-hidden bg-black border border-slate-800 shadow-2xl flex flex-col justify-between group">
            
            {/* Live Video Element */}
            <video
              ref={videoRef}
              src={project.videoUrl}
              autoPlay
              playsInline
              loop
              muted={isMuted}
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={() => {
                if (videoRef.current) setDuration(videoRef.current.duration);
              }}
              className="absolute inset-0 w-full h-full object-cover"
              style={{
                filter: isGraded
                  ? 'contrast(1.20) saturate(1.25) brightness(1.02)'
                  : 'contrast(0.68) saturate(0.38) brightness(0.92) sepia(0.08)' // Real S-Log3 simulation
              }}
            />

            {/* Video Overlays */}
            <div className="relative z-10 flex flex-wrap items-center justify-between gap-2 p-2.5 sm:p-4 pointer-events-none">
              <span className="px-2 sm:px-2.5 py-0.5 sm:py-1 rounded bg-black/70 backdrop-blur-md text-cyan-300 border border-cyan-500/30 text-[10px] sm:text-xs font-mono flex items-center gap-1.5 shadow-md">
                <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                {isGraded ? 'DaVinci 3D Grade' : 'Raw Flat Log'}
              </span>

              {/* Grade Toggle Button */}
              <button
                type="button"
                onClick={() => setIsGraded(!isGraded)}
                className="pointer-events-auto px-2.5 py-1 rounded-lg bg-black/80 hover:bg-slate-900 border border-slate-700 hover:border-cyan-400 text-[10px] sm:text-xs font-mono text-slate-200 flex items-center gap-1.5 shadow-lg transition-colors cursor-pointer"
              >
                <Sliders className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-cyan-400" />
                <span>{isGraded ? 'View Raw Log' : 'Apply Grade'}</span>
              </button>
            </div>

            {/* Bottom Controls Bar */}
            <div className="relative z-10 bg-gradient-to-t from-black/95 via-black/70 to-transparent p-4 space-y-2">
              
              {/* Scrub Track */}
              <input
                type="range"
                min="0"
                max={duration || 100}
                step="0.1"
                value={currentTime}
                onChange={handleSeek}
                className="w-full accent-cyan-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
              />

              {/* Action Buttons & Timecode */}
              <div className="flex items-center justify-between text-xs font-mono text-slate-300 pt-1">
                <div className="flex items-center gap-3">
                  <button
                    onClick={togglePlay}
                    className="p-1 text-cyan-400 hover:text-white transition-colors cursor-pointer"
                    aria-label={isPlaying ? 'Pause' : 'Play'}
                  >
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-cyan-400" />}
                  </button>

                  <button
                    onClick={toggleMute}
                    className="p-1 text-slate-400 hover:text-white transition-colors cursor-pointer"
                    aria-label={isMuted ? 'Unmute' : 'Mute'}
                  >
                    {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
                  </button>

                  <span className="text-[11px] text-slate-400">
                    {formatTime(currentTime)} / {formatTime(duration || 45)}
                  </span>
                </div>

                {/* Chapter Seek Quick Tags */}
                <div className="hidden sm:flex items-center gap-1.5 text-[10px]">
                  <span className="text-slate-500 mr-1">Seek:</span>
                  <button
                    onClick={() => seekToSeconds(1)}
                    className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-pointer"
                  >
                    0:01 Hook
                  </button>
                  <button
                    onClick={() => seekToSeconds(4)}
                    className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-pointer"
                  >
                    0:04 Interrupt
                  </button>
                  <button
                    onClick={() => seekToSeconds(10)}
                    className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-pointer"
                  >
                    0:10 Feature Callout
                  </button>
                </div>
              </div>
            </div>

          </div>

          {/* Description & Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            
            {/* Left Col: Details & Highlights */}
            <div className="md:col-span-7 space-y-4">
              <h3 className="text-xl font-bold text-white tracking-tight">
                {project.title}
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                {project.description}
              </p>

              {/* Editing Highlights */}
              <div className="space-y-2 pt-2">
                <div className="text-xs font-mono uppercase tracking-wider text-slate-400">
                  Post-Production Engineering Highlights
                </div>
                <div className="space-y-1.5">
                  {project.editingHighlights.map((hl, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-slate-300">
                      <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                      <span>{hl}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Software Suite */}
              <div className="pt-2 flex items-center gap-2 flex-wrap">
                <span className="text-xs font-mono text-slate-400 mr-1">Tools Used:</span>
                {project.software.map((sw, i) => (
                  <span
                    key={i}
                    className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700/60"
                  >
                    {sw}
                  </span>
                ))}
              </div>
            </div>

            {/* Right Col: Verified Client Outcome & Booking Action */}
            <div className="md:col-span-5 flex flex-col justify-between space-y-4 bg-slate-900/70 border border-slate-800 p-5 rounded-xl">
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
                  <Award className="w-4 h-4" />
                  <span>Verified Performance Outcome</span>
                </div>

                <div className="p-3 bg-black/60 rounded-lg border border-slate-800/80">
                  <div className="text-xs text-slate-400">{project.metrics.label}</div>
                  <div className="text-2xl font-black text-white font-mono mt-0.5">
                    {project.metrics.value}
                  </div>
                </div>

                {project.clientFeedback && (
                  <div className="space-y-1 pt-1">
                    <p className="text-xs italic text-slate-300 leading-relaxed">
                      &quot;{project.clientFeedback.quote}&quot;
                    </p>
                    <div className="text-[11px] font-medium text-slate-400 pt-1">
                      — {project.clientFeedback.author}, {project.clientFeedback.role}
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-slate-800">
                <button
                  onClick={() => onRequestStyle(project)}
                  className="w-full py-3 px-4 text-xs font-semibold text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 rounded-lg shadow-md shadow-cyan-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Book This Video Style for My Project</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
