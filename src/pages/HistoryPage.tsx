import React, { useEffect, useState } from 'react';
import { 
  History, 
  Search, 
  Home, 
  PartyPopper, 
  Gem, 
  Calendar, 
  Trash2, 
  ExternalLink, 
  Coins, 
  ArrowRight, 
  Filter,
  AlertCircle,
  Plus
} from 'lucide-react';
import { PlanRecord, PlanType } from '../types';
import { api } from '../services/api';

interface HistoryPageProps {
  onViewPlan: (plan: PlanRecord) => void;
  onCreatePlan: () => void;
}

export const HistoryPage: React.FC<HistoryPageProps> = ({ onViewPlan, onCreatePlan }) => {
  const [plans, setPlans] = useState<PlanRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchPlans = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.getPlans();
      setPlans(res.plans || []);
    } catch (err: any) {
      setError(err.message || 'Could not load plan history.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this plan?')) {
      return;
    }

    try {
      setDeletingId(id);
      await api.deletePlan(id);
      setPlans((prev) => prev.filter((p) => p.id !== id));
    } catch (err: any) {
      alert(err.message || 'Failed to delete plan.');
    } finally {
      setDeletingId(null);
    }
  };

  const filteredPlans = plans.filter((plan) => {
    const matchesFilter = filterType === 'all' || plan.plan_type === filterType;
    const matchesSearch =
      plan.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      plan.plan_type.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider mb-2">
            <History className="w-3.5 h-3.5 text-blue-600" />
            Saved Records
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-sans">
            My Plan History
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Access, view, or manage your previous budget blueprints and shopping lists.
          </p>
        </div>

        <button
          onClick={onCreatePlan}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-xs hover:shadow transition-all text-xs sm:text-sm self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Budget Plan</span>
        </button>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-sm text-rose-700 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search plans by title or keyword..."
            className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500 shadow-2xs"
          />
        </div>

        <div className="flex gap-1.5 p-1 bg-slate-200/60 rounded-xl shrink-0">
          {(['all', 'home', 'party', 'jewelry'] as const).map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-colors ${
                filterType === type
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="py-20 text-center space-y-3">
          <div className="w-10 h-10 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-slate-500 font-medium">Loading your plan history...</p>
        </div>
      ) : filteredPlans.length === 0 ? (
        /* Empty State (Section 26) */
        <div className="text-center py-16 px-4 bg-white rounded-2xl border border-slate-200/90 shadow-2xs space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto shadow-2xs">
            <History className="w-7 h-7" />
          </div>
          <div className="space-y-1 max-w-sm mx-auto">
            <h3 className="text-lg font-bold text-slate-900">No plans yet</h3>
            <p className="text-xs sm:text-sm text-slate-500">
              "Create your first smart budget plan and it will appear here."
            </p>
          </div>
          <button
            onClick={onCreatePlan}
            className="px-5 py-2.5 text-xs sm:text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs transition-colors"
          >
            Create a Plan
          </button>
        </div>
      ) : (
        /* Plan History Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredPlans.map((plan) => {
            const percentageUsed = Math.min(
              100,
              Math.round((plan.budget_used / Math.max(1, plan.budget)) * 100)
            );

            return (
              <div
                key={plan.id}
                onClick={() => onViewPlan(plan)}
                className="bg-white rounded-2xl p-5 border border-slate-200/90 hover:border-blue-400 shadow-2xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
              >
                <div className="space-y-4">
                  {/* Top Bar of Card */}
                  <div className="flex items-center justify-between">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider ${
                        plan.plan_type === 'home'
                          ? 'bg-blue-50 text-blue-700'
                          : plan.plan_type === 'party'
                          ? 'bg-purple-50 text-purple-700'
                          : 'bg-amber-50 text-amber-700'
                      }`}
                    >
                      {plan.plan_type === 'home' && <Home className="w-3.5 h-3.5" />}
                      {plan.plan_type === 'party' && <PartyPopper className="w-3.5 h-3.5" />}
                      {plan.plan_type === 'jewelry' && <Gem className="w-3.5 h-3.5" />}
                      {plan.plan_type}
                    </span>

                    <span className="text-[11px] text-slate-400 font-medium">
                      {new Date(plan.created_at).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </span>
                  </div>

                  {/* Title & Summary */}
                  <div>
                    <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                      {plan.title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                      {plan.result_data?.summary || 'Custom AI-generated budget allocation and verified shopping links.'}
                    </p>
                  </div>

                  {/* Budget Progress Indicator */}
                  <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 space-y-2">
                    <div className="flex justify-between items-baseline text-xs">
                      <span className="font-semibold text-slate-700">Total Budget:</span>
                      <span className="font-extrabold text-slate-900">
                        ₹{plan.budget.toLocaleString('en-IN')}
                      </span>
                    </div>

                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-600 rounded-full"
                        style={{ width: `${percentageUsed}%` }}
                      />
                    </div>

                    <div className="flex justify-between text-[11px]">
                      <span className="text-slate-500">
                        Used: ₹{plan.budget_used.toLocaleString('en-IN')}
                      </span>
                      <span className="text-emerald-600 font-bold">
                        Buffer: ₹{plan.budget_remaining.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Bottom Action Footer */}
                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="font-bold text-blue-600 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                    <span>View Plan</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>

                  <button
                    onClick={(e) => handleDelete(e, plan.id)}
                    disabled={deletingId === plan.id}
                    title="Delete plan"
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
