import React, { useState } from 'react';
import { TrendingUp, DollarSign, Users, AlertCircle, ArrowRight, Sparkles, RefreshCw } from 'lucide-react';
import { useCms } from '../context/CmsContext';

interface RoiCalculatorProps {
  onApplyRoiEstimate?: (summaryText: string) => void;
}

type BusinessPreset = 'ecommerce' | 'creator' | 'saas';

export const RoiCalculator: React.FC<RoiCalculatorProps> = ({ onApplyRoiEstimate }) => {
  const { cms } = useCms();
  const roi = cms.roi;

  const [preset, setPreset] = useState<BusinessPreset>('ecommerce');
  const [monthlyViews, setMonthlyViews] = useState<number>(100000);
  const [churnRate, setChurnRate] = useState<number>(70); // % of viewers who bounce in first 3-5s
  const [conversionRate, setConversionRate] = useState<number>(2.0); // % who convert
  const [avgCustomerValue, setAvgCustomerValue] = useState<number>(65); // $ AOV or Lead Value
  const [editingCostPerMonth, setEditingCostPerMonth] = useState<number>(799); // Growth tier default

  // Presets
  const applyPreset = (type: BusinessPreset) => {
    setPreset(type);
    if (type === 'ecommerce') {
      setMonthlyViews(120000);
      setChurnRate(72);
      setConversionRate(2.2);
      setAvgCustomerValue(75);
      setEditingCostPerMonth(799);
    } else if (type === 'creator') {
      setMonthlyViews(250000);
      setChurnRate(65);
      setConversionRate(1.5);
      setAvgCustomerValue(28); // Blended RPM + affiliate + merch/sponsor
      setEditingCostPerMonth(799);
    } else if (type === 'saas') {
      setMonthlyViews(30000);
      setChurnRate(58);
      setConversionRate(3.0);
      setAvgCustomerValue(320); // Demo to trial / closed deal value
      setEditingCostPerMonth(1490);
    }
  };

  // Math Calculations:
  const churnedViewers = Math.round((monthlyViews * churnRate) / 100);
  const lostConversions = Math.round((churnedViewers * (conversionRate / 100)));
  const grossLostRevenue = Math.round(lostConversions * avgCustomerValue);

  // Clippasia Retention Recovery Engine (dynamic recoveryPercentage)
  const recoveryEfficiency = (roi.recoveryPercentage || 40) / 100;
  const recoveredViewers = Math.round(churnedViewers * recoveryEfficiency);
  const recoveredConversions = Math.round(recoveredViewers * (conversionRate / 100));
  const recoveredMonthlyRevenue = Math.round(recoveredConversions * avgCustomerValue);

  // Net ROI & Multiple
  const netProfitRecovered = Math.max(0, recoveredMonthlyRevenue - editingCostPerMonth);
  const roiMultiplier =
    editingCostPerMonth > 0
      ? (recoveredMonthlyRevenue / editingCostPerMonth).toFixed(1)
      : '0.0';

  const handleClaimEstimate = () => {
    const summary = `ROI Calculator Recovery: Targeting $${recoveredMonthlyRevenue.toLocaleString()}/mo recovered revenue from ${monthlyViews.toLocaleString()} views (${churnRate}% churn rate). Estimated ${roiMultiplier}x ROI over $${editingCostPerMonth}/mo editing investment.`;
    if (onApplyRoiEstimate) {
      onApplyRoiEstimate(summary);
    }
  };

  return (
    <div className="bg-[#0C0F18] border border-slate-800 rounded-2xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-0 right-1/4 w-80 h-80 bg-cyan-500/10 blur-[100px] pointer-events-none rounded-full" />
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 relative z-10">
        <div className="space-y-2 max-w-xl">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-cyan-400">
            <TrendingUp className="w-4 h-4" />
            <span>{roi.preTitle || 'Interactive Video Churn & Revenue Recovery Engine'}</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight [text-wrap:balance]">
            {roi.title || 'Calculate How Much Revenue Your Video Churn Is Leaking'}
          </h3>
          <p className="text-sm text-slate-400 leading-relaxed">
            {roi.subtitle || 'Every viewer that swipes away in the first 3 seconds is ad spend or traffic burned. Move the sliders to calculate your recoverable revenue.'}
          </p>
        </div>

        {/* Business Presets Segmented Bar */}
        <div className="grid grid-cols-3 sm:flex sm:items-center gap-1 sm:gap-1.5 p-1 bg-slate-900 border border-slate-800 rounded-xl w-full sm:w-auto shrink-0">
          <button
            onClick={() => applyPreset('ecommerce')}
            className={`px-2 sm:px-3 py-1.5 text-[11px] sm:text-xs font-medium rounded-lg transition-colors text-center truncate cursor-pointer ${
              preset === 'ecommerce'
                ? 'bg-slate-800 text-cyan-300 shadow-sm border border-slate-700/80 font-semibold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            eCommerce
          </button>
          <button
            onClick={() => applyPreset('creator')}
            className={`px-2 sm:px-3 py-1.5 text-[11px] sm:text-xs font-medium rounded-lg transition-colors text-center truncate cursor-pointer ${
              preset === 'creator'
                ? 'bg-slate-800 text-cyan-300 shadow-sm border border-slate-700/80 font-semibold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            YouTube
          </button>
          <button
            onClick={() => applyPreset('saas')}
            className={`px-2 sm:px-3 py-1.5 text-[11px] sm:text-xs font-medium rounded-lg transition-colors text-center truncate cursor-pointer ${
              preset === 'saas'
                ? 'bg-slate-800 text-cyan-300 shadow-sm border border-slate-700/80 font-semibold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            SaaS / B2B
          </button>
        </div>
      </div>

      {/* Calculator Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative z-10">
        
        {/* Left Column: Sliders and Inputs */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Slider 1: Monthly Video Views / Impressions */}
          <div className="space-y-2 p-4 rounded-xl bg-slate-900/60 border border-slate-800/80">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-slate-300">Monthly Video Views / Ad Impressions</span>
              <span className="font-mono text-cyan-400 font-bold text-sm tabular-nums">
                {monthlyViews.toLocaleString()} views
              </span>
            </div>
            <input
              type="range"
              min="10000"
              max="1000000"
              step="10000"
              value={monthlyViews}
              onChange={(e) => setMonthlyViews(Number(e.target.value))}
              className="w-full accent-cyan-400 cursor-pointer h-2 bg-slate-800 rounded-lg"
            />
            <div className="flex justify-between text-[11px] font-mono text-slate-500">
              <span>10K views</span>
              <span>250K views</span>
              <span>500K views</span>
              <span>1M+ views</span>
            </div>
          </div>

          {/* Slider 2: Current Video Churn Rate (The Core Metric) */}
          <div className="space-y-2 p-4 rounded-xl bg-slate-900/60 border border-slate-800/80">
            <div className="flex items-center justify-between text-xs">
              <div className="space-y-0.5">
                <span className="font-medium text-slate-300 flex items-center gap-1.5">
                  <span>Current 3-Second Churn / Drop-Off Rate</span>
                  <span className="text-rose-400 text-[10px] font-mono">[Attention Leak]</span>
                </span>
                <div className="text-[11px] text-slate-400">
                  Percentage of viewers who swipe or leave before the main value proposition
                </div>
              </div>
              <span className="font-mono text-rose-400 font-bold text-base tabular-nums">
                {churnRate}%
              </span>
            </div>
            <input
              type="range"
              min="30"
              max="90"
              step="1"
              value={churnRate}
              onChange={(e) => setChurnRate(Number(e.target.value))}
              className="w-full accent-rose-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
            />
            <div className="flex justify-between text-[11px] font-mono text-slate-500">
              <span>30% (Industry Elite)</span>
              <span>60% (Average)</span>
              <span>75%+ (Critical Churn)</span>
              <span>90%</span>
            </div>
          </div>

          {/* Row of Two Inputs: Conversion Rate & Average Value */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            <div className="space-y-2 p-4 rounded-xl bg-slate-900/60 border border-slate-800/80">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-slate-300">Avg. Viewer Conversion Rate</span>
                <span className="font-mono text-cyan-400 font-bold text-sm tabular-nums">
                  {conversionRate.toFixed(1)}%
                </span>
              </div>
              <input
                type="range"
                min="0.5"
                max="8.0"
                step="0.1"
                value={conversionRate}
                onChange={(e) => setConversionRate(Number(e.target.value))}
                className="w-full accent-cyan-400 cursor-pointer h-2 bg-slate-800 rounded-lg"
              />
              <div className="text-[10px] font-mono text-slate-500">
                Engaged viewers who buy, subscribe, or book
              </div>
            </div>

            <div className="space-y-2 p-4 rounded-xl bg-slate-900/60 border border-slate-800/80">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-slate-300">Avg. Order / Customer Value</span>
                <span className="font-mono text-cyan-400 font-bold text-sm tabular-nums">
                  ${avgCustomerValue}
                </span>
              </div>
              <input
                type="range"
                min="10"
                max="500"
                step="5"
                value={avgCustomerValue}
                onChange={(e) => setAvgCustomerValue(Number(e.target.value))}
                className="w-full accent-cyan-400 cursor-pointer h-2 bg-slate-800 rounded-lg"
              />
              <div className="text-[10px] font-mono text-slate-500">
                Gross margin, AOV, or lead deal value
              </div>
            </div>

          </div>

          {/* Editing Cost Benchmark Selector */}
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-900/40 border border-slate-800 text-xs text-slate-400">
            <span>Monthly Editing Investment Benchmark:</span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setEditingCostPerMonth(389)}
                className={`px-2.5 py-1 rounded text-xs font-mono transition-colors cursor-pointer ${
                  editingCostPerMonth === 389
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                Starter ($389)
              </button>
              <button
                onClick={() => setEditingCostPerMonth(799)}
                className={`px-2.5 py-1 rounded text-xs font-mono transition-colors cursor-pointer ${
                  editingCostPerMonth === 799
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                Growth ($799)
              </button>
              <button
                onClick={() => setEditingCostPerMonth(1490)}
                className={`px-2.5 py-1 rounded text-xs font-mono transition-colors cursor-pointer ${
                  editingCostPerMonth === 1490
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                Studio Pod ($1,490)
              </button>
            </div>
          </div>

        </div>

        {/* Right Column: Live Projected Returns & Recovery Card */}
        <div className="lg:col-span-5 bg-gradient-to-br from-[#111728] via-[#0E1322] to-[#0A0D16] p-6 sm:p-7 rounded-2xl border border-slate-700/80 shadow-2xl space-y-6">
          
          <div className="space-y-1">
            <div className="text-xs font-mono uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Projected Monthly Recovery</span>
            </div>
            <div className="text-3xl sm:text-4xl font-black text-white font-mono tabular-nums">
              +${recoveredMonthlyRevenue.toLocaleString()}
              <span className="text-xs font-normal text-slate-400 ml-1.5 font-sans">/ month</span>
            </div>
            <p className="text-xs text-emerald-400 font-mono">
              Net ROI Multiple: <span className="font-extrabold text-sm">{roiMultiplier}x</span> your editing cost
            </p>
          </div>

          {/* Visual Retention & Churn Comparison Bar */}
          <div className="space-y-2 pt-2 border-t border-slate-800">
            <div className="text-xs text-slate-400 font-mono flex items-center justify-between">
              <span>Audience Retention Impact</span>
              <span className="text-cyan-400 font-semibold">+{recoveredViewers.toLocaleString()} Viewers Saved</span>
            </div>

            {/* Before vs After Bar */}
            <div className="space-y-2 pt-1">
              <div>
                <div className="flex justify-between text-[11px] text-rose-300 font-mono mb-1">
                  <span>Current Churned Traffic ({churnRate}%)</span>
                  <span>{churnedViewers.toLocaleString()} lost</span>
                </div>
                <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                  <div
                    className="h-full bg-rose-500 transition-all duration-300"
                    style={{ width: `${churnRate}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[11px] text-cyan-300 font-mono mb-1">
                  <span>With Clippasia Retention Architecture (Dropped to ~{Math.round(churnRate * 0.6)}%)</span>
                  <span className="font-bold">+{recoveredConversions.toLocaleString()} extra conversions</span>
                </div>
                <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 transition-all duration-300"
                    style={{ width: `${Math.round(churnRate * 0.4)}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Breakdown KPI Grid */}
          <div className="grid grid-cols-2 gap-3 pt-2 text-xs">
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
              <div className="text-[11px] text-slate-400 font-mono">Gross Revenue Leaked</div>
              <div className="text-base font-bold font-mono text-rose-400 tabular-nums">
                ${grossLostRevenue.toLocaleString()}
              </div>
              <div className="text-[10px] text-slate-500">Lost to early swipes</div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
              <div className="text-[11px] text-slate-400 font-mono">Net Monthly Profit Lift</div>
              <div className="text-base font-bold font-mono text-emerald-400 tabular-nums">
                +${netProfitRecovered.toLocaleString()}
              </div>
              <div className="text-[10px] text-slate-500">After editing retainer</div>
            </div>
          </div>

          {/* Annualized Impact Statement */}
          <div className="p-3 rounded-xl bg-cyan-950/20 border border-cyan-800/40 text-xs text-slate-300 font-mono leading-relaxed">
            Annualized Impact: Recovering an estimated <span className="text-cyan-300 font-bold">+${(recoveredMonthlyRevenue * 12).toLocaleString()}</span> in lost revenue over 12 months with optimized video retention.
          </div>

          {/* Action Button */}
          <div className="pt-2">
            <button
              onClick={handleClaimEstimate}
              className="w-full py-3.5 px-4 text-xs font-semibold text-white bg-gradient-to-r from-cyan-500 via-cyan-400 to-blue-600 hover:from-cyan-400 hover:to-blue-500 rounded-xl shadow-lg shadow-cyan-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer hover:-translate-y-0.5"
            >
              <span>Apply This ROI Estimate to My Free Test Edit</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <div className="text-[11px] text-slate-400 text-center font-mono mt-2">
              Prefills your project notes & secures your 24h review priority
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
