import React, { useEffect, useState } from 'react';
import { Sparkles, BrainCircuit, Calculator, ShieldCheck, ShoppingCart } from 'lucide-react';

interface LoadingPlanModalProps {
  planType: string;
  budget: number;
}

export const LoadingPlanModal: React.FC<LoadingPlanModalProps> = ({ planType, budget }) => {
  const [tipIndex, setTipIndex] = useState(0);

  const tips = [
    'Analyzing current market prices across verified sellers...',
    'Balancing priorities to avoid exceeding your spending limit...',
    'Curating dynamic shopping links for Amazon, Flipkart, and Google...',
    'Ensuring strict budget compliance and buffer reserve calculation...',
    'Crafting personalized procurement tips tailored to your occasion...',
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setTipIndex((prev) => (prev + 1) % tips.length);
    }, 2400);
    return () => clearInterval(timer);
  }, [tips.length]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 border border-slate-100 text-center relative overflow-hidden">
        {/* Animated glowing background accent */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-blue-100 rounded-full blur-2xl opacity-60 animate-pulse pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-orange-100 rounded-full blur-2xl opacity-60 animate-pulse pointer-events-none" />

        {/* Central Icon Radar Animation */}
        <div className="relative mx-auto w-20 h-20 mb-6 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-blue-500/10 animate-ping" />
          <div className="absolute inset-2 rounded-full border-2 border-dashed border-blue-400 animate-spin" style={{ animationDuration: '8s' }} />
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
            <BrainCircuit className="w-7 h-7 text-white animate-pulse" />
          </div>
        </div>

        {/* Main Heading */}
        <h3 className="text-xl font-bold text-slate-900 mb-2 font-sans tracking-tight">
          PocketSmart AI is creating your smart plan...
        </h3>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 border border-orange-200 text-orange-800 text-xs font-semibold mb-6">
          <Calculator className="w-3.5 h-3.5 text-orange-600" />
          Target Budget: ₹{budget.toLocaleString('en-IN')}
        </div>

        {/* Dynamic Step indicator */}
        <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/80 mb-6 text-left">
          <div className="flex items-center gap-2 mb-2 text-xs font-semibold uppercase tracking-wider text-blue-700">
            <Sparkles className="w-3.5 h-3.5" />
            AI Processing in Progress
          </div>
          <p className="text-xs text-slate-600 font-medium h-8 transition-all duration-300">
            {tips[tipIndex]}
          </p>
          {/* Progress bar shimmer */}
          <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden mt-3">
            <div className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-orange-400 rounded-full animate-pulse w-3/4" />
          </div>
        </div>

        {/* Safety Guarantee */}
        <div className="flex items-center justify-center gap-2 text-xs text-slate-500">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Strict guarantee: Total spending will never exceed ₹{budget.toLocaleString('en-IN')}</span>
        </div>
      </div>
    </div>
  );
};
