import React from 'react';
import { Video, ArrowUpRight, Mail, Globe, MapPin, Shield, Camera } from 'lucide-react';

interface FooterProps {
  onOpenAdmin?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenAdmin }) => {
  return (
    <footer className="bg-[#06070A] border-t border-slate-800/80 text-slate-400 text-xs py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          
          {/* Brand Info */}
          <div className="md:col-span-4 space-y-4">
            <a href="#" className="flex items-center gap-2.5 text-lg font-bold text-white tracking-tight group">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform duration-200">
                <Video className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-extrabold text-white flex items-center gap-1.5">
                <span>Clipp<span className="text-cyan-400">Asia</span></span>
                <span className="text-[10px] font-mono font-bold tracking-widest uppercase text-slate-300 px-1.5 py-0.5 rounded bg-slate-800/80 border border-slate-700/60">
                  Studio
                </span>
              </span>
            </a>
            
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              The high-retention video post-production division of clippasia.com. Serving global creators, DTC eCommerce brands, and creative marketing agencies worldwide.
            </p>

            <div className="pt-2 text-[11px] font-mono text-slate-500 space-y-1">
              <div>Email: asiaclipp@gmail.com</div>
              <div>Global Operations: Sylhet, BD · Serving USA, UK & Europe</div>
            </div>
          </div>

          {/* Quick Links: Video Services */}
          <div className="md:col-span-3 space-y-3">
            <div className="text-xs font-mono uppercase tracking-wider text-white font-semibold">
              Video Capabilities
            </div>
            <ul className="space-y-2 text-slate-400">
              <li>
                <a href="#challenges" className="hover:text-cyan-400 transition-colors">
                  Retention Hook Architecture
                </a>
              </li>
              <li>
                <a href="#comparison" className="hover:text-cyan-400 transition-colors">
                  DaVinci Resolve Color Grading
                </a>
              </li>
              <li>
                <a href="#portfolio" className="hover:text-cyan-400 transition-colors">
                  eCommerce Video Ad Creatives
                </a>
              </li>
              <li>
                <a href="#portfolio" className="hover:text-cyan-400 transition-colors">
                  YouTube Long-Form Retainers
                </a>
              </li>
              <li>
                <a href="#portfolio" className="hover:text-cyan-400 transition-colors">
                  TikTok / Shorts Viral Batches
                </a>
              </li>
            </ul>
          </div>

          {/* Main Clippasia Ecosystem */}
          <div className="md:col-span-3 space-y-3">
            <div className="text-xs font-mono uppercase tracking-wider text-white font-semibold flex items-center gap-1.5">
              <Camera className="w-3.5 h-3.5 text-cyan-400" />
              <span>Main Photo Editing Studio</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Need eCommerce clipping paths, ghost mannequin, or high-end retouching?
            </p>
            <ul className="space-y-2 text-slate-400">
              <li>
                <a
                  href="https://clippasia.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-cyan-300 hover:text-white font-semibold transition-colors flex items-center gap-1.5 group"
                >
                  <span>Visit clippasia.com (Photo Hub)</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-cyan-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </a>
              </li>
              <li>
                <a href="https://clippasia.com" target="_blank" rel="noopener noreferrer" className="hover:text-cyan-400 transition-colors flex items-center justify-between">
                  <span>Clipping Path & Background Removal</span>
                  <ArrowUpRight className="w-3 h-3 text-slate-600" />
                </a>
              </li>
              <li>
                <a href="https://clippasia.com" target="_blank" rel="noopener noreferrer" className="hover:text-cyan-400 transition-colors flex items-center justify-between">
                  <span>eCommerce Product Photo Retouching</span>
                  <ArrowUpRight className="w-3 h-3 text-slate-600" />
                </a>
              </li>
              <li>
                <a href="https://clippasia.com" target="_blank" rel="noopener noreferrer" className="hover:text-cyan-400 transition-colors flex items-center justify-between">
                  <span>Ghost Mannequin & Apparel Masking</span>
                  <ArrowUpRight className="w-3 h-3 text-slate-600" />
                </a>
              </li>
              <li>
                <a href="https://clippasia.com" target="_blank" rel="noopener noreferrer" className="hover:text-cyan-400 transition-colors flex items-center justify-between">
                  <span>Jewelry & High-End Beauty Retouch</span>
                  <ArrowUpRight className="w-3 h-3 text-slate-600" />
                </a>
              </li>
            </ul>
          </div>

          {/* Trust Guarantees */}
          <div className="md:col-span-2 space-y-3">
            <div className="text-xs font-mono uppercase tracking-wider text-white font-semibold">
              Our Commitments
            </div>
            <div className="space-y-2 text-[11px] text-slate-400 font-mono">
              <div>✓ 24-48h Delivery SLA</div>
              <div>✓ Unlimited Free Revisions</div>
              <div>✓ Zero-Risk 1-Min Test Edit</div>
              <div>✓ Strict Client NDA & Security</div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500 font-mono">
          <div>
            © {new Date().getFullYear()} Clippasia.com. All rights reserved. Video Post-Production Services.
          </div>
          <div className="flex items-center gap-4">
            <a href="#" className="hover:text-slate-400 transition-colors">Privacy Policy</a>
            <span>·</span>
            <a href="#" className="hover:text-slate-400 transition-colors">Terms of Service</a>
            <span>·</span>
            <a href="#inquiry" className="hover:text-cyan-400 transition-colors">Free Test Edit</a>
          </div>
        </div>

      </div>
    </footer>
  );
};
