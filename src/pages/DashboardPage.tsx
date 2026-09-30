import React, { useEffect, useState } from 'react';
import { 
  Sparkles, 
  Home, 
  PartyPopper, 
  Gem, 
  ArrowRight, 
  Coins, 
  Layers, 
  History, 
  PiggyBank, 
  Calendar, 
  Plus, 
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Tag
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { PlanRecord, PlanType, DashboardStats } from '../types';

interface DashboardPageProps {
  onSelectPlanner: (type: PlanType) => void;
  onViewPlan: (plan: PlanRecord) => void;
  onViewHistory: () => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  onSelectPlanner,
  onViewPlan,
  onViewHistory,
}) => {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalPlans: 0,
    recentPlan: null,
    totalBudgetPlanned: 0,
    totalRemainingBudget: 0,
  });
  const [recentPlans, setRecentPlans] = useState<PlanRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [statsRes, plansRes] = await Promise.all([
          api.getDashboardStats().catch(() => ({ stats: null })),
          api.getPlans().catch(() => ({ plans: [] })),
        ]);

        if (statsRes?.stats) {
          setStats(statsRes.stats);
        }
        if (plansRes?.plans) {
          setRecentPlans(plansRes.plans);
        }
      } catch (e) {
        console.error('Error loading dashboard data', e);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-10">
      {/* Welcome Greeting */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            Financial Assistant Dashboard
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-sans">
            Welcome, {user?.name || 'User'}!
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Let's plan your spending smarter today.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onSelectPlanner('home')}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-xs hover:shadow transition-all text-xs sm:text-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Plan</span>
          </button>
        </div>
      </div>

      {/* Summary Metric Cards (Section 6) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Total Plans */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Total Plans</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-sans">
            {stats.totalPlans}
          </div>
          <p className="text-[11px] text-slate-500">
            Number of budget plans created
          </p>
        </div>

        {/* Recent Plan */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Recent Plan</span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="text-base font-bold text-slate-900 truncate">
            {stats.recentPlan ? stats.recentPlan.title : 'No plans yet'}
          </div>
          <p className="text-[11px] text-slate-500">
            {stats.recentPlan
              ? `Budget: ₹${stats.recentPlan.budget.toLocaleString('en-IN')}`
              : 'Start by creating your first plan'}
          </p>
        </div>

        {/* Budget Planned */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Budget Planned</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Coins className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-sans">
            ₹{stats.totalBudgetPlanned.toLocaleString('en-IN')}
          </div>
          <p className="text-[11px] text-slate-500">
            Cumulative total across your plans
          </p>
        </div>

        {/* Remaining Budget */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Remaining Budget</span>
            <div className="w-8 h-8 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center">
              <PiggyBank className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-orange-600 font-sans">
            ₹{stats.totalRemainingBudget.toLocaleString('en-IN')}
          </div>
          <p className="text-[11px] text-slate-500">
            Buffer saved from your most recent plan
          </p>
        </div>
      </div>

      {/* Main Planner Section (Section 7) */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight font-sans">
              What would you like to plan today?
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Select one of our specialized budgeting engines to configure your requirements.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Home */}
          <div 
            onClick={() => onSelectPlanner('home')}
            className="group bg-white rounded-2xl p-6 border border-slate-200/90 hover:border-blue-500 shadow-2xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Home className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-slate-900 group-hover:text-blue-700 transition-colors">
                Home Budget Planner
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                "Plan your home purchases based on your available budget."
              </p>
              <div className="text-[11px] text-slate-500 pt-1">
                Living room, bedroom, kitchen, dining, BLDC fans & lighting.
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-blue-700 font-bold text-xs">
              <span>Generate Home Plan</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 2: Party */}
          <div 
            onClick={() => onSelectPlanner('party')}
            className="group bg-white rounded-2xl p-6 border border-slate-200/90 hover:border-purple-500 shadow-2xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-11 h-11 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                <PartyPopper className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-slate-900 group-hover:text-purple-700 transition-colors">
                Party Budget Planner
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                "Create a complete party plan without exceeding your budget."
              </p>
              <div className="text-[11px] text-slate-500 pt-1">
                College events, birthdays, catering, sound, fairy lights & decor.
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-purple-700 font-bold text-xs">
              <span>Generate Party Plan</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 3: Jewelry */}
          <div 
            onClick={() => onSelectPlanner('jewelry')}
            className="group bg-white rounded-2xl p-6 border border-slate-200/90 hover:border-amber-500 shadow-2xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Gem className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-slate-900 group-hover:text-amber-700 transition-colors">
                Jewelry Budget Planner
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                "Find suitable jewelry combinations within your budget."
              </p>
              <div className="text-[11px] text-slate-500 pt-1">
                Gold, silver, platinum, statement chokers, earrings & hallmarking.
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-amber-700 font-bold text-xs">
              <span>Generate Jewelry Plan</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Plans Table / List */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/90 shadow-2xs space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Recent Plans</h3>
            <p className="text-xs text-slate-500 mt-0.5">Quickly access and view your generated recommendations</p>
          </div>
          {recentPlans.length > 0 && (
            <button
              onClick={onViewHistory}
              className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1"
            >
              <span>View All History</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {recentPlans.length === 0 ? (
          <div className="text-center py-10 px-4 bg-slate-50 rounded-xl border border-dashed border-slate-200">
            <History className="w-10 h-10 text-slate-400 mx-auto mb-3" />
            <h4 className="text-sm font-bold text-slate-800">No plans yet</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4">
              "Create your first smart budget plan and it will appear here."
            </p>
            <button
              onClick={() => onSelectPlanner('home')}
              className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-2xs"
            >
              Create a Plan
            </button>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {recentPlans.slice(0, 5).map((plan) => (
              <div
                key={plan.id}
                onClick={() => onViewPlan(plan)}
                className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/80 -mx-4 px-4 rounded-xl transition-colors cursor-pointer group"
              >
                <div className="flex items-start gap-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                    plan.plan_type === 'home'
                      ? 'bg-blue-50 text-blue-600'
                      : plan.plan_type === 'party'
                      ? 'bg-purple-50 text-purple-600'
                      : 'bg-amber-50 text-amber-600'
                  }`}>
                    {plan.plan_type === 'home' && <Home className="w-4 h-4" />}
                    {plan.plan_type === 'party' && <PartyPopper className="w-4 h-4" />}
                    {plan.plan_type === 'jewelry' && <Gem className="w-4 h-4" />}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                      {plan.title}
                    </h4>
                    <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                      <span className="capitalize">{plan.plan_type} Planner</span>
                      <span>•</span>
                      <span>{new Date(plan.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0">
                  <div className="text-right">
                    <div className="text-sm font-extrabold text-slate-900">
                      ₹{plan.budget.toLocaleString('en-IN')}
                    </div>
                    <div className="text-[11px] text-emerald-600 font-medium">
                      Buffer: ₹{plan.budget_remaining.toLocaleString('en-IN')}
                    </div>
                  </div>
                  <span className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-slate-100 group-hover:bg-blue-600 group-hover:text-white transition-colors text-slate-700 flex items-center gap-1">
                    <span>View Plan</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
