import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  CheckCircle2, 
  Sparkles, 
  ExternalLink, 
  Bookmark, 
  Share2, 
  Printer, 
  ArrowLeft, 
  ShieldCheck, 
  AlertCircle, 
  TrendingUp, 
  ShoppingBag, 
  Percent, 
  Coins, 
  PiggyBank, 
  Tag, 
  Layers,
  Copy,
  Check
} from 'lucide-react';
import { PlanResultData, PlanRequestData } from '../types';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

interface PlanResultViewProps {
  result: PlanResultData;
  request: PlanRequestData;
  onBack: () => void;
  onSaved?: () => void;
  isSavedView?: boolean;
}

export const PlanResultView: React.FC<PlanResultViewProps> = ({
  result,
  request,
  onBack,
  onSaved,
  isSavedView = false,
}) => {
  const { user } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(isSavedView);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const totalBudget = request.total_budget;
  const budgetUsed = result.budget_used;
  const budgetRemaining = result.budget_remaining;
  const percentageUsed = Math.min(100, Math.round((budgetUsed / Math.max(1, totalBudget)) * 100));

  const handleSavePlan = async () => {
    if (!user) {
      setSaveError('Please log in or create an account to save plans to your history.');
      return;
    }

    try {
      setIsSaving(true);
      setSaveError(null);
      await api.savePlan({
        plan_type: request.plan_type,
        title: result.title,
        budget: totalBudget,
        budget_used: budgetUsed,
        budget_remaining: budgetRemaining,
        request_data: request,
        result_data: result,
      });

      setSaveSuccess(true);

      // Trigger celebratory confetti
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });

      if (onSaved) onSaved();
    } catch (err: any) {
      setSaveError(err.message || 'Could not save plan. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCopySummary = () => {
    const textToCopy = `📌 ${result.title}
💰 Total Budget: ₹${totalBudget.toLocaleString('en-IN')}
✅ Budget Used: ₹${budgetUsed.toLocaleString('en-IN')} (${percentageUsed}%)
🛡️ Buffer Remaining: ₹${budgetRemaining.toLocaleString('en-IN')}

Summary: ${result.summary}

Top Categories:
${result.budget_breakdown.map(c => `• ${c.category}: ₹${c.allocated_budget.toLocaleString('en-IN')} (${c.percentage_of_budget}%)`).join('\n')}

Generated with PocketSmart AI - Your Smart Budget & Recommendation Assistant`;

    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-16 print:p-0 print:space-y-4">
      {/* Top action bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 print:hidden">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 px-3.5 py-2 text-sm font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg shadow-2xs transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Planner
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopySummary}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg shadow-2xs transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'Copied!' : 'Copy Summary'}
          </button>

          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg shadow-2xs transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            Print Plan
          </button>

          {!isSavedView && (
            <button
              onClick={handleSavePlan}
              disabled={isSaving || saveSuccess}
              className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg shadow-xs transition-all ${
                saveSuccess
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-300'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              {saveSuccess ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Saved to History
                </>
              ) : (
                <>
                  <Bookmark className="w-4 h-4" />
                  {isSaving ? 'Saving...' : 'Save Plan'}
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {saveError && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-sm text-rose-700 flex items-center gap-2 print:hidden">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{saveError}</span>
        </div>
      )}

      {/* Plan Header Card */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/90 shadow-xs relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50/70 rounded-full blur-2xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold uppercase tracking-wider mb-3">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              {request.plan_type.toUpperCase()} BUDGET RECOMMENDATION
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-sans">
              {result.title}
            </h1>
            <p className="mt-2 text-sm sm:text-base text-slate-600 leading-relaxed max-w-3xl">
              {result.summary}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row md:flex-col gap-3 shrink-0">
            <div className="px-4 py-3 bg-slate-900 text-white rounded-xl text-center shadow-xs">
              <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Total Budget Limit</div>
              <div className="text-2xl font-extrabold text-orange-400">
                ₹{totalBudget.toLocaleString('en-IN')}
              </div>
            </div>
          </div>
        </div>

        {/* Section 11: Budget Overview Progress Bar */}
        <div className="bg-slate-50 rounded-xl p-5 border border-slate-200/80 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-800">
              <Coins className="w-4 h-4 text-blue-600" />
              Budget Utilization Overview
            </div>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
              {percentageUsed}% Allocated
            </span>
          </div>

          {/* Large Progress Bar */}
          <div className="w-full bg-slate-200 h-4 rounded-full overflow-hidden p-0.5 shadow-inner">
            <div
              className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full transition-all duration-700 shadow-xs"
              style={{ width: `${percentageUsed}%` }}
            />
          </div>

          {/* 3 Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div className="bg-white p-3.5 rounded-lg border border-slate-200 text-center">
              <div className="text-xs font-medium text-slate-500">Total Budget</div>
              <div className="text-lg font-bold text-slate-900 mt-0.5">
                ₹{totalBudget.toLocaleString('en-IN')}
              </div>
            </div>

            <div className="bg-white p-3.5 rounded-lg border border-blue-200 text-center relative overflow-hidden">
              <div className="text-xs font-medium text-blue-600">Budget Used</div>
              <div className="text-lg font-bold text-blue-700 mt-0.5">
                ₹{budgetUsed.toLocaleString('en-IN')}
              </div>
            </div>

            <div className="bg-white p-3.5 rounded-lg border border-emerald-200 text-center">
              <div className="text-xs font-medium text-emerald-600 flex items-center justify-center gap-1">
                <PiggyBank className="w-3.5 h-3.5" />
                Remaining Buffer
              </div>
              <div className="text-lg font-bold text-emerald-700 mt-0.5">
                ₹{budgetRemaining.toLocaleString('en-IN')}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Section 12: Category-Wise Budget Breakdown */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Layers className="w-5 h-5 text-blue-600" />
              Category-Wise Budget Allocation
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Balanced spending breakdown ensuring no category monopolizes your funds
            </p>
          </div>
          <span className="text-xs font-semibold text-slate-500 self-start sm:self-auto">
            {result.budget_breakdown.length} Categories
          </span>
        </div>

        {/* Visual Category Breakdown Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {result.budget_breakdown.map((cat, idx) => (
            <div
              key={idx}
              className="bg-slate-50/80 rounded-xl p-4 border border-slate-200 hover:border-blue-300 transition-colors space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-slate-800">{cat.category}</span>
                <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-700">
                  {cat.percentage_of_budget}%
                </span>
              </div>

              <div className="flex items-baseline justify-between">
                <span className="text-xs text-slate-500">Allocated</span>
                <span className="text-base font-extrabold text-blue-900">
                  ₹{cat.allocated_budget.toLocaleString('en-IN')}
                </span>
              </div>

              {/* Progress bar for category */}
              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-600 rounded-full"
                  style={{ width: `${Math.min(100, cat.percentage_of_budget)}%` }}
                />
              </div>

              <div className="text-[11px] text-slate-500">
                {cat.items?.length || 0} item{cat.items?.length === 1 ? '' : 's'} suggested
              </div>
            </div>
          ))}
        </div>

        {/* Responsive Table View */}
        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-100/80 text-xs font-semibold uppercase text-slate-700">
              <tr>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4 text-right">Allocated Budget</th>
                <th className="py-3 px-4 text-right">Percentage</th>
                <th className="py-3 px-4 text-center">Items Included</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 font-sans">
              {result.budget_breakdown.map((cat, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50">
                  <td className="py-3 px-4 font-semibold text-slate-900 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-600" />
                    {cat.category}
                  </td>
                  <td className="py-3 px-4 text-right font-bold text-slate-800">
                    ₹{cat.allocated_budget.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3 px-4 text-right font-medium text-slate-600">
                    {cat.percentage_of_budget}%
                  </td>
                  <td className="py-3 px-4 text-center text-xs text-slate-500 font-medium">
                    {cat.items?.length || 0}
                  </td>
                </tr>
              ))}
              <tr className="bg-slate-50/90 font-bold text-slate-900">
                <td className="py-3 px-4">Total Spending Planned</td>
                <td className="py-3 px-4 text-right text-blue-700">
                  ₹{budgetUsed.toLocaleString('en-IN')}
                </td>
                <td className="py-3 px-4 text-right">{percentageUsed}%</td>
                <td className="py-3 px-4 text-center text-xs text-emerald-600">
                  Buffer: ₹{budgetRemaining.toLocaleString('en-IN')}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Section 13: RECOMMENDED ITEMS */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-blue-600" />
              Recommended Items & Verified Links
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Click dynamically generated links to search and purchase on verified e-commerce platforms
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {result.budget_breakdown.flatMap((cat) =>
            cat.items.map((item, itemIdx) => (
              <div
                key={`${cat.category}-${itemIdx}`}
                className="bg-white rounded-2xl p-5 border border-slate-200/90 hover:border-slate-300 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                      {item.category || cat.category}
                    </span>
                    <div className="text-right">
                      <div className="text-base font-extrabold text-slate-900">
                        ₹{(item.estimated_price * (item.quantity || 1)).toLocaleString('en-IN')}
                      </div>
                      {item.quantity > 1 && (
                        <div className="text-[11px] text-slate-500">
                          ₹{item.estimated_price.toLocaleString('en-IN')} × {item.quantity}
                        </div>
                      )}
                    </div>
                  </div>

                  <h3 className="font-bold text-base text-slate-900 leading-snug">
                    {item.name}
                  </h3>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-600 leading-relaxed">
                    <span className="font-semibold text-slate-700 block mb-0.5">Why recommended:</span>
                    "{item.reason}"
                  </div>
                </div>

                {/* Section 13: Shopping Links (Google Shopping, Amazon, Flipkart) */}
                <div className="pt-4 mt-4 border-t border-slate-100">
                  <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
                    Check Prices On:
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <a
                      href={`https://www.google.com/search?tbm=shop&q=${encodeURIComponent(item.name)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors group"
                      title={`Search ${item.name} on Google Shopping`}
                    >
                      <span>Google</span>
                      <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-slate-600" />
                    </a>

                    <a
                      href={`https://www.amazon.in/s?k=${encodeURIComponent(item.name)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-amber-900 bg-amber-50 hover:bg-amber-100 border border-amber-200/80 rounded-lg transition-colors group"
                      title={`Search ${item.name} on Amazon India`}
                    >
                      <span className="font-bold">Amazon</span>
                      <ExternalLink className="w-3 h-3 text-amber-600 group-hover:text-amber-800" />
                    </a>

                    <a
                      href={`https://www.flipkart.com/search?q=${encodeURIComponent(item.name)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-blue-900 bg-blue-50 hover:bg-blue-100 border border-blue-200/80 rounded-lg transition-colors group"
                      title={`Search ${item.name} on Flipkart`}
                    >
                      <span className="font-bold">Flipkart</span>
                      <ExternalLink className="w-3 h-3 text-blue-600 group-hover:text-blue-800" />
                    </a>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Section 14: AI Smart Tips */}
      <div className="bg-gradient-to-br from-blue-900 to-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-md">
        <div className="flex items-center gap-2 mb-4">
          <div className="p-2 bg-blue-500/20 rounded-lg border border-blue-400/30">
            <Sparkles className="w-5 h-5 text-orange-400" />
          </div>
          <div>
            <h3 className="text-lg font-bold">Smart AI Procurement Tips</h3>
            <p className="text-xs text-slate-300">Actionable advice to stretch your budget further</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 mt-4">
          {result.tips.map((tip, idx) => (
            <div
              key={idx}
              className="flex items-start gap-3 p-3.5 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-colors"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">{tip}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Section 15: DISCLAIMER */}
      <div className="p-4 bg-slate-100 rounded-xl border border-slate-200 flex items-start gap-3 text-xs text-slate-600">
        <ShieldCheck className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong className="font-semibold text-slate-700">Disclaimer: </strong>
          {result.disclaimer ||
            'Prices and recommendations are estimates and may change based on availability, location, seller, and market conditions. Verify final prices before purchasing.'}
        </p>
      </div>

      {/* Bottom Sticky Action Bar on Mobile */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 p-3 bg-white/95 backdrop-blur-md border-t border-slate-200 z-30 flex items-center gap-2 print:hidden shadow-lg">
        <button
          onClick={onBack}
          className="flex-1 py-2.5 text-center text-xs font-semibold text-slate-700 bg-slate-100 rounded-lg"
        >
          Change Input
        </button>
        {!isSavedView && (
          <button
            onClick={handleSavePlan}
            disabled={isSaving || saveSuccess}
            className={`flex-1 py-2.5 text-center text-xs font-semibold rounded-lg shadow-sm ${
              saveSuccess
                ? 'bg-emerald-600 text-white'
                : 'bg-blue-600 text-white'
            }`}
          >
            {saveSuccess ? 'Saved!' : 'Save Plan'}
          </button>
        )}
      </div>
    </div>
  );
};
