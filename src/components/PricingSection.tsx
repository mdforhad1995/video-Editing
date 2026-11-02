import React, { useState } from 'react';
import { PRICING_TIERS } from '../data/mockData';
import { PricingTier } from '../types';
import { Check, Sparkles, ArrowRight, Calculator, ShieldCheck, Zap } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface PricingSectionProps {
  onSelectTier: (
    tierName: string,
    calculatedDetails?: string,
    packagePrice?: string,
    mode?: 'package_order' | 'free_test_edit'
  ) => void;
}

export const PricingSection: React.FC<PricingSectionProps> = ({ onSelectTier }) => {
  const { t } = useLanguage();
  // Calculator state
  const [calcVideoType, setCalcVideoType] = useState<'shortform' | 'youtube' | 'ecommerce' | 'explainer'>('shortform');
  const [calcQuantity, setCalcQuantity] = useState<number>(4);
  const [needPriority24h, setNeedPriority24h] = useState<boolean>(false);
  const [needThumbnail, setNeedThumbnail] = useState<boolean>(true);
  const [needSourceFiles, setNeedSourceFiles] = useState<boolean>(false);

  // Pricing formula
  const baseRate =
    calcVideoType === 'shortform'
      ? 49
      : calcVideoType === 'ecommerce'
      ? 149
      : calcVideoType === 'youtube'
      ? 169
      : 220;

  const rawTotal = baseRate * calcQuantity;
  const bulkDiscount = calcQuantity >= 8 ? 0.2 : calcQuantity >= 4 ? 0.1 : 0;
  const discountedBase = rawTotal * (1 - bulkDiscount);

  const priorityCost = needPriority24h ? 25 * calcQuantity : 0;
  const thumbnailCost = needThumbnail ? 20 * calcQuantity : 0;
  const sourceFilesCost = needSourceFiles ? 35 * calcQuantity : 0;

  const finalEstimate = Math.round(discountedBase + priorityCost + thumbnailCost + sourceFilesCost);

  const handleBookCalculated = () => {
    const typeLabel =
      calcVideoType === 'shortform'
        ? 'Short-Form Reels/TikTok'
        : calcVideoType === 'ecommerce'
        ? 'DTC eCommerce Ads'
        : calcVideoType === 'youtube'
        ? 'YouTube Long-form'
        : 'SaaS / Corporate Explainer';

    const details = `Custom Scope: ${calcQuantity}x ${typeLabel} (${needPriority24h ? '24h Priority SLA' : '48h Standard'}${needThumbnail ? ' + 4K Thumbnails' : ''}${needSourceFiles ? ' + Clean Project Files' : ''})`;
    const priceText = `$${finalEstimate} / month`;
    onSelectTier('Custom Production Scope', details, priceText, 'package_order');
  };

  return (
    <section id="pricing" className="py-24 bg-[#08090D] relative space-y-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-16">
          <div className="text-xs font-semibold uppercase tracking-wider text-cyan-400">
            {t('pricingPre')}
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight [text-wrap:balance]">
            {t('pricingTitle')}
          </h2>
          <p className="text-base text-slate-400 leading-relaxed">
            {t('pricingSubtitle')}
          </p>
        </div>

        {/* 3 Core Pricing Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16 items-stretch">
          {PRICING_TIERS.map((tier) => (
            <div
              key={tier.id}
              className={`rounded-2xl p-5 sm:p-8 flex flex-col justify-between transition-all duration-200 relative ${
                tier.isPopular
                  ? 'bg-[#0F1422] border-2 border-cyan-500/80 shadow-2xl shadow-cyan-500/10'
                  : 'bg-[#0D0F17] border border-slate-800'
              }`}
            >
              {tier.isPopular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-md">
                  Most Popular for Brands
                </div>
              )}

              <div className="space-y-6">
                {/* Header */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold text-white tracking-tight">{tier.name}</h3>
                    <span className="text-xs font-mono text-cyan-400 font-medium">
                      {tier.turnaround}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed min-h-[36px]">
                    {tier.tagline}
                  </p>
                </div>

                {/* Price Display */}
                <div className="pt-2 pb-4 border-b border-slate-800/80">
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl sm:text-4xl font-black text-white font-mono tabular-nums">
                      ${tier.monthlyPrice}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">/ month</span>
                  </div>
                  {tier.pricePerVideo && (
                    <div className="text-xs text-slate-400 mt-1 font-mono">
                      or ${tier.pricePerVideo} / single video cut
                    </div>
                  )}
                </div>

                {/* Features List */}
                <div className="space-y-3 pt-2">
                  <div className="text-xs font-mono uppercase tracking-wider text-slate-400">
                    What&apos;s Included:
                  </div>
                  <div className="space-y-2.5">
                    {tier.features.map((feature, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-300">
                        <Check className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom CTA */}
              <div className="pt-8 border-t border-slate-800/80 mt-6 space-y-2">
                <button
                  onClick={() =>
                    onSelectTier(
                      tier.name,
                      `Plan Selected: ${tier.name} (${tier.monthlyPrice ? `$${tier.monthlyPrice}/mo` : `$${tier.pricePerVideo}/cut`}) · ${tier.turnaround}`,
                      tier.monthlyPrice ? `$${tier.monthlyPrice}/month` : `$${tier.pricePerVideo} / single cut`,
                      'package_order'
                    )
                  }
                  className={`w-full py-3 px-4 text-xs font-semibold rounded-xl transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer ${
                    tier.isPopular
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-lg shadow-cyan-500/25 hover:-translate-y-0.5'
                      : 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700'
                  }`}
                >
                  <span>Book {tier.name}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <div className="text-[11px] text-center text-slate-400 font-mono">
                  Ideal for: {tier.idealFor}
                </div>
              </div>

            </div>
          ))}
        </div>

        {/* Interactive Custom Quote & Turnaround Calculator */}
        <div className="bg-[#0D101A] border border-slate-800 rounded-2xl p-4 sm:p-10 shadow-2xl">
          <div className="max-w-2xl mb-8 space-y-2">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-cyan-400">
              <Calculator className="w-4 h-4" />
              <span>Interactive Scope & Budget Calculator</span>
            </div>
            <h3 className="text-2xl font-bold text-white tracking-tight">
              Estimate Your Exact Monthly Video Output
            </h3>
            <p className="text-sm text-slate-400">
              Adjust format and volume to see real-time price estimates with applied volume discounts.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Controls */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Video Format Selector */}
              <div className="space-y-2">
                <label className="text-xs font-mono text-slate-300">1. Video Format</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'shortform', label: 'Reels / Shorts', rate: '$49' },
                    { id: 'ecommerce', label: 'eCom Ad', rate: '$149' },
                    { id: 'youtube', label: 'YouTube Long', rate: '$169' },
                    { id: 'explainer', label: 'SaaS Demo', rate: '$220' }
                  ].map((fmt) => (
                    <button
                      key={fmt.id}
                      onClick={() => setCalcVideoType(fmt.id as any)}
                      className={`p-3 rounded-lg text-left border transition-all cursor-pointer ${
                        calcVideoType === fmt.id
                          ? 'bg-slate-800 border-cyan-500/80 text-white shadow-sm'
                          : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      <div className="text-xs font-semibold">{fmt.label}</div>
                      <div className="text-[11px] font-mono text-cyan-400 mt-1">{fmt.rate}/cut</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity Slider */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-300">2. Monthly Video Volume</span>
                  <span className="text-cyan-400 font-bold text-sm">{calcQuantity} Videos / Month</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="16"
                  value={calcQuantity}
                  onChange={(e) => setCalcQuantity(Number(e.target.value))}
                  className="w-full accent-cyan-400 cursor-pointer h-2 bg-slate-800 rounded-lg"
                />
                <div className="flex justify-between text-[11px] font-mono text-slate-500">
                  <span>1 video</span>
                  <span>4 videos (10% off)</span>
                  <span>8+ videos (20% off)</span>
                  <span>16 videos</span>
                </div>
              </div>

              {/* Add-ons Checklist */}
              <div className="space-y-2 pt-2">
                <label className="text-xs font-mono text-slate-300">3. Optional Add-ons</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <label className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300 cursor-pointer hover:border-slate-700">
                    <input
                      type="checkbox"
                      checked={needPriority24h}
                      onChange={(e) => setNeedPriority24h(e.target.checked)}
                      className="accent-cyan-400 rounded"
                    />
                    <span>Priority 24h SLA</span>
                  </label>

                  <label className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300 cursor-pointer hover:border-slate-700">
                    <input
                      type="checkbox"
                      checked={needThumbnail}
                      onChange={(e) => setNeedThumbnail(e.target.checked)}
                      className="accent-cyan-400 rounded"
                    />
                    <span>4K Thumbnail Concept</span>
                  </label>

                  <label className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300 cursor-pointer hover:border-slate-700">
                    <input
                      type="checkbox"
                      checked={needSourceFiles}
                      onChange={(e) => setNeedSourceFiles(e.target.checked)}
                      className="accent-cyan-400 rounded"
                    />
                    <span>Full Source Files</span>
                  </label>
                </div>
              </div>

            </div>

            {/* Right Summary Box */}
            <div className="lg:col-span-5 bg-gradient-to-br from-[#121726] to-[#0A0D15] p-6 rounded-xl border border-slate-800/90 space-y-4">
              <div className="text-xs font-mono uppercase tracking-wider text-slate-400">
                Estimated Production Summary
              </div>

              <div className="space-y-2 py-2 border-t border-b border-slate-800/80 text-xs">
                <div className="flex justify-between text-slate-300">
                  <span>Base rate ({calcQuantity}x videos)</span>
                  <span className="font-mono">${rawTotal}</span>
                </div>
                {bulkDiscount > 0 && (
                  <div className="flex justify-between text-emerald-400">
                    <span>Volume Discount ({bulkDiscount * 100}%)</span>
                    <span className="font-mono">-${Math.round(rawTotal * bulkDiscount)}</span>
                  </div>
                )}
                {priorityCost > 0 && (
                  <div className="flex justify-between text-slate-300">
                    <span>24h Rush Turnaround</span>
                    <span className="font-mono">+${priorityCost}</span>
                  </div>
                )}
                {thumbnailCost > 0 && (
                  <div className="flex justify-between text-slate-300">
                    <span>Custom Thumbnails ({calcQuantity}x)</span>
                    <span className="font-mono">+${thumbnailCost}</span>
                  </div>
                )}
                {sourceFilesCost > 0 && (
                  <div className="flex justify-between text-slate-300">
                    <span>Clean Project Files</span>
                    <span className="font-mono">+${sourceFilesCost}</span>
                  </div>
                )}
              </div>

              <div className="space-y-1">
                <div className="text-xs text-slate-400">Total Estimated Monthly Price</div>
                <div className="text-3xl font-black text-white font-mono tabular-nums flex items-baseline gap-2">
                  <span>${finalEstimate}</span>
                  <span className="text-xs font-normal text-slate-400">/ estimated</span>
                </div>
                <div className="text-[11px] text-cyan-400 font-mono flex items-center gap-1 pt-1">
                  <Zap className="w-3.5 h-3.5" />
                  <span>Estimated delivery: {needPriority24h ? '24 Hours / video' : '48 Hours / video'}</span>
                </div>
              </div>

              <button
                onClick={handleBookCalculated}
                className="w-full py-3 px-4 text-xs font-semibold text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 rounded-xl shadow-lg shadow-cyan-500/25 transition-all flex items-center justify-center gap-1.5 cursor-pointer mt-2"
              >
                <span>Book This Custom Scope</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <div className="text-[11px] text-slate-400 text-center font-mono">
                Includes 100% money-back guarantee & unlimited revisions
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
