import React, { useState } from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  TrendingUp, 
  PieChart, 
  ShoppingBag, 
  Home, 
  PartyPopper, 
  Gem, 
  CheckCircle2, 
  Calculator, 
  History, 
  Send,
  MessageSquare,
  Users,
  Layers,
  Percent,
  Sliders,
  Wallet
} from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

interface LandingPageProps {
  onGetStarted: () => void;
  onLoginClick: () => void;
  onSelectPlanner: (type: 'home' | 'party' | 'jewelry') => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onGetStarted,
  onLoginClick,
  onSelectPlanner,
}) => {
  const { user, demoLogin } = useAuth();

  // Contact form state
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [contactStatus, setContactStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [contactError, setContactError] = useState('');

  // Interactive Live Teaser Calculator
  const [teaserBudget, setTeaserBudget] = useState(50000);
  const [teaserType, setTeaserType] = useState<'home' | 'party' | 'jewelry'>('home');

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName || !contactEmail || !contactMessage) {
      setContactError('Please fill in all fields.');
      return;
    }

    try {
      setContactStatus('submitting');
      setContactError('');
      await api.sendContact(contactName, contactEmail, contactMessage);
      setContactStatus('success');
      setContactName('');
      setContactEmail('');
      setContactMessage('');
    } catch (err: any) {
      setContactStatus('error');
      setContactError(err.message || 'Unable to submit message. Please try again.');
    }
  };

  return (
    <div className="space-y-20 sm:space-y-28 pb-16 overflow-hidden">
      {/* =========================================================================
          HERO SECTION (Section 4)
         ========================================================================= */}
      <section className="relative pt-12 sm:pt-20 pb-12 overflow-hidden">
        {/* Soft Background Glows */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-tr from-blue-200/40 via-indigo-100/30 to-orange-100/30 rounded-full blur-3xl -z-10 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Hero Column */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-xs font-bold tracking-wide uppercase shadow-2xs">
                <Sparkles className="w-3.5 h-3.5 text-blue-600 animate-spin" style={{ animationDuration: '6s' }} />
                Your Smart Budget & Recommendation Assistant
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.12] font-sans">
                Plan smarter. <br />
                Spend better. <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-500">
                  Choose confidently.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 max-w-xl mx-auto lg:mx-0 leading-relaxed font-sans">
                "Set your budget, tell us what you need, and get smart recommendations that fit your spending limit."
              </p>

              {/* Call to Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-2">
                <button
                  onClick={onGetStarted}
                  className="w-full sm:w-auto px-7 py-3.5 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 text-base cursor-pointer"
                >
                  <span>Get Started</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                {!user ? (
                  <>
                    <button
                      onClick={onLoginClick}
                      className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 shadow-2xs transition-colors text-base"
                    >
                      Login
                    </button>
                    <button
                      onClick={async () => {
                        await demoLogin();
                        onGetStarted();
                      }}
                      className="w-full sm:w-auto px-5 py-3.5 rounded-xl font-semibold text-orange-700 bg-orange-50 hover:bg-orange-100 border border-orange-200 transition-colors text-sm"
                    >
                      Try 1-Click Demo
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => onSelectPlanner('home')}
                    className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors text-base"
                  >
                    Open Planners
                  </button>
                )}
              </div>

              {/* Trust Badges */}
              <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-5 text-xs text-slate-500 font-medium">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Strict Budget Adherence</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-blue-600" />
                  <span>Indian Rupees (₹) Live Market Estimates</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <ShoppingBag className="w-4 h-4 text-purple-600" />
                  <span>Amazon, Flipkart & Google Links</span>
                </div>
              </div>
            </div>

            {/* Right Hero Column: Visual Interactive Graphic */}
            <div className="lg:col-span-5">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-xl border border-slate-200/80 relative z-10 space-y-5">
                  {/* Top Bar of Graphic */}
                  <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
                        <Wallet className="w-5 h-5 text-orange-300" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900">PocketSmart AI Blueprint</div>
                        <div className="text-[11px] text-slate-500">Live Budget Allocation</div>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 font-bold text-xs border border-emerald-200">
                      Within Limit
                    </span>
                  </div>

                  {/* Budget Dial Snapshot */}
                  <div className="bg-slate-900 text-white rounded-2xl p-4 space-y-3">
                    <div className="flex justify-between items-baseline">
                      <span className="text-xs text-slate-400 font-medium">Total Target Budget</span>
                      <span className="text-xl font-extrabold text-orange-400">₹50,000</span>
                    </div>
                    <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                      <div className="bg-gradient-to-r from-blue-500 via-indigo-500 to-orange-400 h-full rounded-full w-[94%]" />
                    </div>
                    <div className="flex justify-between text-xs pt-1">
                      <span className="text-slate-300 font-medium">Allocated: ₹47,200 (94%)</span>
                      <span className="text-emerald-400 font-bold">Buffer: ₹2,800</span>
                    </div>
                  </div>

                  {/* Mini Cards of Categories */}
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                      <div className="flex items-center gap-2">
                        <Home className="w-4 h-4 text-blue-600" />
                        <span className="font-semibold text-slate-800">Furniture & Seating</span>
                      </div>
                      <span className="font-bold text-slate-900">₹18,000 (36%)</span>
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-amber-500" />
                        <span className="font-semibold text-slate-800">Smart Lighting & Fans</span>
                      </div>
                      <span className="font-bold text-slate-900">₹13,200 (26%)</span>
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                      <div className="flex items-center gap-2">
                        <ShoppingBag className="w-4 h-4 text-purple-600" />
                        <span className="font-semibold text-slate-800">Dining & Decor Elements</span>
                      </div>
                      <span className="font-bold text-slate-900">₹16,000 (32%)</span>
                    </div>
                  </div>

                  {/* Sample Item Card with shopping pills */}
                  <div className="p-3.5 bg-blue-50/70 rounded-xl border border-blue-100 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-slate-900">BLDC Energy Efficient Fan</div>
                      <div className="text-[11px] text-blue-700 font-medium">₹3,800 • Verified fit</div>
                    </div>
                    <div className="flex gap-1.5">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-white text-slate-700 border border-slate-200">
                        Amazon
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-white text-blue-700 border border-slate-200">
                        Flipkart
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          WHAT WOULD YOU LIKE TO PLAN TODAY? (Planner Cards Section 7-9)
         ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-sans">
            What would you like to plan today?
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-600">
            Choose a specialized budgeting module to generate intelligent, bounded recommendations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Home Planner */}
          <div 
            onClick={() => onSelectPlanner('home')}
            className="group bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/90 hover:border-blue-500 shadow-2xs hover:shadow-lg transition-all duration-200 cursor-pointer flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-blue-50 group-hover:bg-blue-600 text-blue-600 group-hover:text-white flex items-center justify-center transition-colors shadow-2xs">
                <Home className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-700 transition-colors">
                  Home Budget Planner
                </h3>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                  "Plan your home purchases based on your available budget."
                </p>
              </div>
              <div className="pt-2 text-xs text-slate-500 space-y-1">
                <div>• Living Room, Bedroom, Kitchen, Full Home</div>
                <div>• Furniture, Lighting, BLDC Fans, Decor</div>
                <div>• Modern, Minimal, Traditional styles</div>
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between text-blue-700 font-bold text-sm">
              <span>Generate Home Plan</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 2: Party Planner */}
          <div 
            onClick={() => onSelectPlanner('party')}
            className="group bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/90 hover:border-purple-500 shadow-2xs hover:shadow-lg transition-all duration-200 cursor-pointer flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-purple-50 group-hover:bg-purple-600 text-purple-600 group-hover:text-white flex items-center justify-center transition-colors shadow-2xs">
                <PartyPopper className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 group-hover:text-purple-700 transition-colors">
                  Party Budget Planner
                </h3>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                  "Create a complete party plan without exceeding your budget."
                </p>
              </div>
              <div className="pt-2 text-xs text-slate-500 space-y-1">
                <div>• Birthdays, College Events, Anniversaries</div>
                <div>• Venue, Catering, Music & Sound, Fairy Lights</div>
                <div>• Scaled exactly for your guest headcount</div>
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between text-purple-700 font-bold text-sm">
              <span>Generate Party Plan</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 3: Jewelry Planner */}
          <div 
            onClick={() => onSelectPlanner('jewelry')}
            className="group bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/90 hover:border-amber-500 shadow-2xs hover:shadow-lg transition-all duration-200 cursor-pointer flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-amber-50 group-hover:bg-amber-600 text-amber-600 group-hover:text-white flex items-center justify-center transition-colors shadow-2xs">
                <Gem className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 group-hover:text-amber-700 transition-colors">
                  Jewelry Budget Planner
                </h3>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                  "Find suitable jewelry combinations within your budget."
                </p>
              </div>
              <div className="pt-2 text-xs text-slate-500 space-y-1">
                <div>• Gold, Silver, Platinum, Bridal Sets</div>
                <div>• Centerpiece + Matching pieces + Hallmarking</div>
                <div>• Daily wear, Wedding, Festival occasions</div>
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between text-amber-700 font-bold text-sm">
              <span>Generate Jewelry Plan</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          FEATURE SECTION (Section 4)
         ========================================================================= */}
      <section className="bg-slate-100/70 py-16 sm:py-20 border-y border-slate-200/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-sans">
              Designed for Smarter Financial Planning
            </h2>
            <p className="mt-2 text-sm sm:text-base text-slate-600">
              Six core pillars that make PocketSmart AI your most trusted procurement companion.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Calculator className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-slate-900">1. Smart Budget Planning</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Deterministic mathematical constraints verify that every recommended item collectively never exceeds your stated spending limit.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-slate-900">2. AI Recommendations</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Leverages Google Gemini AI to analyze market options, materials, energy efficiency, and value-for-money tradeoffs.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-slate-900">3. Multiple Planning Categories</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Dedicated specialized form criteria for Home Decor, Festive Parties & Events, and Fine Jewelry collections.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <TrendingUp className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-slate-900">4. Budget Tracking</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Interactive percentage progress bars, categorized breakdowns, and dedicated remaining buffer reserves for taxes and delivery.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <History className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-slate-900">5. Recommendation History</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Every generated blueprint can be saved to your private database and recalled anytime across your phone or desktop.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-slate-900">6. Personalized Suggestions</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Includes real-time dynamically formulated search queries for Google Shopping, Amazon India, and Flipkart for 1-click buying.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          HOW IT WORKS 4-STEP SECTION (Section 4)
         ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold uppercase tracking-wider mb-3">
            Simple 4-Step Process
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-sans">
            How PocketSmart AI Works
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-600">
            From entering your initial budget to receiving verified shopping links in under 5 seconds.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
          {/* Step 1 */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs relative space-y-3 text-center md:text-left">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white font-extrabold flex items-center justify-center text-base shadow-xs mx-auto md:mx-0">
              1
            </div>
            <h3 className="text-base font-bold text-slate-900">Enter Budget</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Define your strict monetary limit in Indian Rupees (₹) with zero guesswork.
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs relative space-y-3 text-center md:text-left">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white font-extrabold flex items-center justify-center text-base shadow-xs mx-auto md:mx-0">
              2
            </div>
            <h3 className="text-base font-bold text-slate-900">Tell Us What You Need</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Select room, guest count, jewelry metals, aesthetic styles, and priorities.
            </p>
          </div>

          {/* Step 3 */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs relative space-y-3 text-center md:text-left">
            <div className="w-10 h-10 rounded-xl bg-purple-600 text-white font-extrabold flex items-center justify-center text-base shadow-xs mx-auto md:mx-0">
              3
            </div>
            <h3 className="text-base font-bold text-slate-900">AI Creates a Budget Plan</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Gemini AI models balance category allocations and calculates a protective buffer.
            </p>
          </div>

          {/* Step 4 */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs relative space-y-3 text-center md:text-left">
            <div className="w-10 h-10 rounded-xl bg-orange-500 text-white font-extrabold flex items-center justify-center text-base shadow-xs mx-auto md:mx-0">
              4
            </div>
            <h3 className="text-base font-bold text-slate-900">Get Recommendations</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Receive itemized cards with prices, quantities, and direct shopping links.
            </p>
          </div>
        </div>
      </section>

      {/* =========================================================================
          ABOUT SECTION (Section 30)
         ========================================================================= */}
      <section className="bg-slate-900 text-white py-16 sm:py-20 rounded-3xl mx-4 sm:mx-6 lg:mx-8 px-6 sm:px-12 relative overflow-hidden">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold uppercase tracking-wider border border-blue-500/30">
            About PocketSmart AI
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight font-sans">
            "PocketSmart AI is a smart budgeting and recommendation platform designed to help users make better spending decisions based on their available budget and personal requirements."
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 text-slate-300 text-sm">
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2">
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <Home className="w-4 h-4 text-blue-400" />
                Home Planning
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Balancing furniture, ambient lighting, BLDC fans, dining tables, and decor without high retail markups.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2">
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <PartyPopper className="w-4 h-4 text-purple-400" />
                Party Planning
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Catering to guest headcounts with venue options, finger foods, fairy lights, sound systems, and a 10% contingency cushion.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2">
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <Gem className="w-4 h-4 text-amber-400" />
                Jewelry Planning
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Optimizing certified hallmarked gold, silver, and platinum ensembles for weddings and festive pujas.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          CONTACT SECTION (Section 31)
         ========================================================================= */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/90 shadow-sm space-y-6">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold uppercase tracking-wider">
              <MessageSquare className="w-3.5 h-3.5" />
              Contact Us
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-sans">
              Have Questions or Feedback?
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Send us a message and our team will get back to you shortly.
            </p>
          </div>

          {contactStatus === 'success' ? (
            <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
              <h4 className="font-bold text-emerald-900 text-base">Message Sent Successfully!</h4>
              <p className="text-xs sm:text-sm text-emerald-700">
                Thank you for contacting PocketSmart AI. We will review your inquiry and reply via email.
              </p>
              <button
                onClick={() => setContactStatus('idle')}
                className="mt-3 text-xs font-bold text-emerald-800 underline"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleContactSubmit} className="space-y-4">
              {contactError && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700">
                  {contactError}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    placeholder="e.g. Navanandhini"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    placeholder="e.g. name@example.com"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Message
                </label>
                <textarea
                  rows={3}
                  required
                  value={contactMessage}
                  onChange={(e) => setContactMessage(e.target.value)}
                  placeholder="Tell us what features or categories you would like to see in PocketSmart AI..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <button
                type="submit"
                disabled={contactStatus === 'submitting'}
                className="w-full py-3 px-6 rounded-xl font-bold text-white bg-slate-900 hover:bg-slate-800 shadow-sm transition-all flex items-center justify-center gap-2 text-sm disabled:opacity-50 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>{contactStatus === 'submitting' ? 'Sending...' : 'Send Message'}</span>
              </button>
            </form>
          )}
        </div>
      </section>
    </div>
  );
};
