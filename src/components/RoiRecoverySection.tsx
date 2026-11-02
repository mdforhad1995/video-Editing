import React from 'react';
import { RoiCalculator } from './RoiCalculator';

interface RoiRecoverySectionProps {
  onApplyRoiEstimate?: (summaryText: string) => void;
}

export const RoiRecoverySection: React.FC<RoiRecoverySectionProps> = ({ onApplyRoiEstimate }) => {
  return (
    <section id="roi-calculator" className="py-20 bg-[#06070B] relative overflow-hidden border-b border-slate-900/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <RoiCalculator onApplyRoiEstimate={onApplyRoiEstimate} />
      </div>
    </section>
  );
};
