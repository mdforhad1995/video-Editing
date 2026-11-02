import React from 'react';
import { UploadCloud, Film, Sparkles, Send, CheckCircle2 } from 'lucide-react';
import { useCms } from '../context/CmsContext';

export const ProcessSection: React.FC = () => {
  const { cms } = useCms();
  const proc = cms.process;

  const stepIcons = [UploadCloud, Film, Sparkles, Send];

  const steps = proc.steps && proc.steps.length > 0 ? proc.steps : [
    {
      num: '01',
      title: 'Hand-off Your Raw Footage',
      subtitle: 'Effortless Cloud Intake',
      desc: 'Drop your Google Drive, Dropbox, or camera memory card links directly into your Clippasia portal. No tedious brief paperwork required.',
      highlight: 'Takes < 2 minutes'
    },
    {
      num: '02',
      title: 'The Kinetic A-Roll Cut',
      subtitle: 'Pacing & Narrative Hook',
      desc: 'Our editors cut all awkward pauses, breaths, and rambling takes. We build the first 3.5-second visual hook to halt feed scrolling.',
      highlight: 'Zero dead air'
    },
    {
      num: '03',
      title: 'Retention Sound & Color Polish',
      subtitle: 'Commercial Production Value',
      desc: 'We layer kinetic animated typography, subtle zoom punch-ins, synchronized Foley whooshes, and cinema DaVinci 3D LUT color grading.',
      highlight: '-14 LUFS calibrated audio'
    },
    {
      num: '04',
      title: 'Review & 24-48h Delivery',
      subtitle: 'Guaranteed On-Time SLA',
      desc: 'Inspect your master 4K cut with our interactive review player. Request any tweaks or download your publish-ready video immediately.',
      highlight: 'Unlimited revisions'
    }
  ];

  return (
    <section id="process" className="py-24 bg-[#090B10] border-t border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-16">
          <div className="text-xs font-semibold uppercase tracking-wider text-cyan-400">
            {proc.preTitle || 'Frictionless Production'}
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight [text-wrap:balance]">
            {proc.title || 'From Raw SD Card to High-Retention Master in 4 Steps'}
          </h2>
          <p className="text-base text-slate-400 leading-relaxed">
            {proc.subtitle || 'Stop spending 20+ hours per week trapped in video editing timelines. Our specialized post-production team operates in the background while you focus on creating and scaling.'}
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, idx) => {
            const Icon = stepIcons[idx % stepIcons.length] || Sparkles;
            return (
              <div
                key={step.num}
                className="bg-[#0D0F17] border border-slate-800 rounded-2xl p-6 flex flex-col justify-between hover:border-slate-700 transition-all duration-200 group"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-black font-mono text-cyan-400/80 group-hover:text-cyan-400 transition-colors">
                      {step.num}
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-cyan-400 group-hover:border-cyan-500/40 transition-colors">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400">
                      {step.subtitle}
                    </div>
                    <h3 className="text-base font-bold text-white tracking-tight">
                      {step.title}
                    </h3>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    {step.desc}
                  </p>
                </div>

                <div className="mt-6 pt-3 border-t border-slate-800/80 flex items-center gap-1.5 text-[11px] font-mono text-cyan-400">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{step.highlight}</span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
