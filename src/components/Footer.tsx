import React from 'react';
import { Wallet, ShieldCheck, Heart, ExternalLink, Sparkles } from 'lucide-react';

interface FooterProps {
  setActiveTab: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ setActiveTab }) => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-14 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-slate-800">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md">
                <Wallet className="w-5 h-5 text-orange-300" />
              </div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-xl text-white tracking-tight">PocketSmart</span>
                <span className="text-xs font-bold uppercase px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30">
                  AI
                </span>
              </div>
            </div>
            <p className="text-sm text-slate-400 max-w-md leading-relaxed font-sans">
              Your Smart Budget & Recommendation Assistant. Plan smarter, spend better, and choose confidently with AI-powered allocations that stay strictly within your budget limits.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span className="inline-flex items-center gap-1 text-emerald-400 font-medium">
                <ShieldCheck className="w-4 h-4" />
                Guaranteed Budget Bounds
              </span>
              <span>•</span>
              <span className="inline-flex items-center gap-1 text-blue-400 font-medium">
                <Sparkles className="w-3.5 h-3.5" />
                Powered by Gemini AI
              </span>
            </div>
          </div>

          {/* Quick Planners */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white mb-4">
              AI Planners
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button
                  onClick={() => {
                    setActiveTab('home-planner');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  Home Budget Planner
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActiveTab('party-planner');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  Party Budget Planner
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActiveTab('jewelry-planner');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  Jewelry Budget Planner
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActiveTab('dashboard');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  Dashboard & Stats
                </button>
              </li>
            </ul>
          </div>

          {/* Navigation & Company */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white mb-4">
              Explore & Support
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button
                  onClick={() => {
                    setActiveTab('landing');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActiveTab('about');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  About PocketSmart AI
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActiveTab('contact');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  Contact Us
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActiveTab('privacy');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  Privacy & Terms
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Disclaimer & Copyright */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p className="text-center md:text-left leading-relaxed">
            Prices and recommendations are estimates and may change based on availability, location, seller, and market conditions. Verify final prices before purchasing.
          </p>
          <div className="flex items-center gap-2 shrink-0">
            <span>© 2026 PocketSmart AI. All rights reserved.</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
