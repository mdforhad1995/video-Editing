import React, { useState } from 'react';
import { PROBLEMS_DATA } from '../data/mockData';
import { AlertTriangle, CheckCircle, TrendingUp, Clock, Zap, ArrowRight, Activity, Users, DollarSign } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useCms } from '../context/CmsContext';

interface ProblemChallengeSectionProps {
  onSelectSolution: (problemId: string) => void;
}

export const ProblemChallengeSection: React.FC<ProblemChallengeSectionProps> = ({ onSelectSolution }) => {
  const { t } = useLanguage();
  const { cms } = useCms();
  const challenges = cms.challenges;
  const problemsList = challenges.items && challenges.items.length > 0 ? challenges.items : PROBLEMS_DATA;

  const [activeTab, setActiveTab] = useState<number>(0);
  const [retentionScrubSec, setRetentionScrubSec] = useState<number>(3);

  const currentProblem = problemsList[activeTab] || problemsList[0];

  return (
    <section id="challenges" className="py-24 bg-[#090B10] border-t border-b border-slate-800/80 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header with balanced headlines and anti-slop restraint */}
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-16">
          <div className="text-xs font-semibold uppercase tracking-wider text-rose-400">
            {challenges.preTitle || t('challengesPre')}
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight [text-wrap:balance]">
            {challenges.title || t('challengesTitle')}
          </h2>
          <p className="text-base text-slate-400 leading-relaxed">
            {challenges.subtitle || t('challengesSubtitle')}
          </p>
        </div>

        {/* Challenge Interactive Selector Tabs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 p-1.5 bg-[#0F121C] border border-slate-800 rounded-xl mb-12">
          {problemsList.map((problem, index) => {
            const isActive = activeTab === index;
            return (
              <button
                key={problem.id}
                onClick={() => setActiveTab(index)}
                className={`py-3 px-3.5 rounded-lg text-left transition-all duration-200 cursor-pointer flex flex-col justify-between ${
                  isActive
                    ? 'bg-slate-800 text-white shadow-md border border-slate-700/60'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 border border-transparent'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-1">
                  <span className="text-[11px] font-mono text-cyan-400 font-medium">
                    0{index + 1}
                  </span>
                  {isActive && (
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                  )}
                </div>
                <div className="text-xs sm:text-sm font-semibold truncate w-full">
                  {problem.title.replace('The ', '')}
                </div>
              </button>
            );
          })}
        </div>

        {/* Main Problem & Solution Animated Dual-Stage Card */}
        <div className="bg-[#0E121B] border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-slate-800">
            
            {/* Left Stage: The Customer's Pain Point Diagnostic */}
            <div className="lg:col-span-6 p-6 sm:p-8 space-y-6 flex flex-col justify-between bg-gradient-to-br from-[#121624] to-[#0E121B]">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono uppercase tracking-wider text-rose-400 flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    Customer Challenge Diagnostic
                  </span>
                  <span className="text-xs font-mono px-2.5 py-0.5 rounded bg-rose-500/10 text-rose-300 border border-rose-500/30">
                    {currentProblem.painStat}
                  </span>
                </div>

                <h3 className="text-2xl font-bold text-white tracking-tight">
                  {currentProblem.title}
                </h3>

                <p className="text-slate-300 text-sm leading-relaxed">
                  {currentProblem.painExplanation}
                </p>
              </div>

              {/* Animated Interactive Diagnostic Visualizer */}
              <div className="pt-4">
                {currentProblem.animationType === 'retention_curve' && (
                  <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 space-y-4">
                    <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                      <span>Interactive Retention Timeline</span>
                      <span className="text-cyan-400">Second: 00:0{retentionScrubSec}s</span>
                    </div>

                    {/* Interactive Scrub Slider */}
                    <div className="space-y-1">
                      <input
                        type="range"
                        min="1"
                        max="10"
                        value={retentionScrubSec}
                        onChange={(e) => setRetentionScrubSec(Number(e.target.value))}
                        className="w-full accent-cyan-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
                      />
                      <div className="flex justify-between text-[10px] font-mono text-slate-500">
                        <span>0:01s (Intro Hook)</span>
                        <span>0:05s (Pattern Interrupt)</span>
                        <span>0:10s (Retention Anchor)</span>
                      </div>
                    </div>

                    {/* Visual Comparison Graph */}
                    <div className="space-y-2 pt-2">
                      <div>
                        <div className="flex justify-between text-xs text-rose-300 font-mono mb-1">
                          <span>Without Clippasia (Raw Pacing)</span>
                          <span className="font-bold">
                            {retentionScrubSec <= 2 ? '85%' : retentionScrubSec <= 4 ? '29%' : '14%'} left
                          </span>
                        </div>
                        <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-rose-500 transition-all duration-300"
                            style={{
                              width: `${retentionScrubSec <= 2 ? 85 : retentionScrubSec <= 4 ? 29 : 14}%`
                            }}
                          />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-xs text-cyan-300 font-mono mb-1">
                          <span>With Clippasia (Kinetic Cut)</span>
                          <span className="font-bold">
                            {retentionScrubSec <= 2 ? '96%' : retentionScrubSec <= 4 ? '88%' : '79%'} left
                          </span>
                        </div>
                        <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-300"
                            style={{
                              width: `${retentionScrubSec <= 2 ? 96 : retentionScrubSec <= 4 ? 88 : 79}%`
                            }}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="text-[11px] text-slate-400 bg-slate-950/60 p-2.5 rounded border border-slate-800/80 font-mono">
                      {retentionScrubSec <= 3
                        ? '⚠️ Critical Danger Zone: Viewers leave if there is no immediate visual punch-in or sound cue in first 3.2s.'
                        : '✅ Pacing Sustained: Clippasia inserts dynamic zoom-crop and b-roll sync every 3.5s to reset attention.'}
                    </div>
                  </div>
                )}

                {currentProblem.animationType === 'timeline_burnout' && (
                  <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 space-y-3">
                    <div className="text-xs font-mono text-slate-400">Where 21 Hours Disappear Every Week</div>
                    <div className="space-y-2">
                      {[
                        { task: 'Cutting pauses & dead air', hrs: '4.5 hrs', pct: 85 },
                        { task: 'Color grading & skin balance', hrs: '3.5 hrs', pct: 70 },
                        { task: 'Hunting royalty-free music & SFX', hrs: '4.0 hrs', pct: 80 },
                        { task: 'Kinetic subtitles & caption timing', hrs: '5.0 hrs', pct: 95 },
                        { task: 'Export crashes & re-rendering', hrs: '4.0 hrs', pct: 75 }
                      ].map((item, i) => (
                        <div key={i} className="space-y-1">
                          <div className="flex justify-between text-xs text-slate-300">
                            <span>{item.task}</span>
                            <span className="font-mono text-rose-400 font-semibold">{item.hrs}</span>
                          </div>
                          <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                            <div className="h-full bg-rose-500/70" style={{ width: `${item.pct}%` }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {currentProblem.animationType === 'roas_scale' && (
                  <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 space-y-3">
                    <div className="text-xs font-mono text-slate-400">Ad Creative Performance Breakdown</div>
                    <div className="grid grid-cols-2 gap-3 pt-1">
                      <div className="p-3 rounded-lg bg-rose-950/30 border border-rose-900/40 text-center">
                        <div className="text-[11px] text-slate-400 mb-1">Standard Product Clip</div>
                        <div className="text-xl font-bold font-mono text-rose-400">1.1x ROAS</div>
                        <div className="text-[10px] text-slate-500 mt-1">High CAC · Ad Fatigue</div>
                      </div>
                      <div className="p-3 rounded-lg bg-cyan-950/30 border border-cyan-800/50 text-center">
                        <div className="text-[11px] text-slate-400 mb-1">Clippasia UGC / Split-Hook</div>
                        <div className="text-xl font-bold font-mono text-cyan-400">4.6x ROAS</div>
                        <div className="text-[10px] text-emerald-400 mt-1">+38% Conversion Lift</div>
                      </div>
                    </div>
                  </div>
                )}

                {currentProblem.animationType === 'quality_gap' && (
                  <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 space-y-2 text-xs">
                    <div className="text-slate-400 font-mono mb-2">The Freelancer Roulette vs Clippasia</div>
                    <div className="flex items-center justify-between p-2 rounded bg-rose-950/20 border border-rose-900/30 text-rose-300">
                      <span>Random Freelancer: 4-7 days late</span>
                      <span className="font-mono font-semibold">Ghosting Risk</span>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded bg-cyan-950/30 border border-cyan-800/40 text-cyan-300">
                      <span>Clippasia: 24-48h Guaranteed SLA</span>
                      <span className="font-mono font-semibold">Dedicated Pod</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right Stage: Clippasia Solution & Mechanism */}
            <div className="lg:col-span-6 p-6 sm:p-8 space-y-6 flex flex-col justify-between bg-[#0B0E17]">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                    <CheckCircle className="w-3.5 h-3.5" />
                    How Clippasia Solves This
                  </span>
                  <span className="text-xs font-mono px-2.5 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                    {currentProblem.solutionMetric}
                  </span>
                </div>

                <h3 className="text-2xl font-bold text-white tracking-tight">
                  {currentProblem.solutionTitle}
                </h3>

                <p className="text-slate-300 text-sm leading-relaxed">
                  {currentProblem.solutionExplanation}
                </p>
              </div>

              {/* Solution feature pillars */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="p-3 rounded-lg bg-slate-900/70 border border-slate-800 space-y-1">
                  <div className="text-xs font-semibold text-white flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-cyan-400" />
                    Turnkey Hand-off
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Drop raw files in Drive or Dropbox; receive finished cuts ready to publish.
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-slate-900/70 border border-slate-800 space-y-1">
                  <div className="text-xs font-semibold text-white flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5 text-cyan-400" />
                    Retention Soundscapes
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Cinema-grade DaVinci color grading & calibrated -14 LUFS Foley sound design.
                  </div>
                </div>
              </div>

              {/* Action Callout */}
              <div className="pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                <div className="text-xs text-slate-400 font-mono">
                  Test this on your own footage:
                </div>
                <button
                  onClick={() => onSelectSolution(currentProblem.id)}
                  className="px-4 py-2.5 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>Request Free Test Edit for This</span>
                  <ArrowRight className="w-3.5 h-3.5 text-cyan-400" />
                </button>
              </div>

            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
