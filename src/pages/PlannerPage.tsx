import React, { useState, useEffect } from 'react';
import { 
  Home, 
  PartyPopper, 
  Gem, 
  Sparkles, 
  ArrowRight, 
  IndianRupee, 
  Check, 
  Plus, 
  X, 
  HelpCircle,
  AlertCircle
} from 'lucide-react';
import { PlanType, PlanRequestData, PlanResultData } from '../types';
import { api } from '../services/api';
import { LoadingPlanModal } from '../components/LoadingPlanModal';
import { PlanResultView } from '../components/PlanResultView';

interface PlannerPageProps {
  initialType?: PlanType;
  onPlanCreated?: () => void;
}

export const PlannerPage: React.FC<PlannerPageProps> = ({ 
  initialType = 'home',
  onPlanCreated 
}) => {
  const [activeType, setActiveType] = useState<PlanType>(initialType);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentResult, setCurrentResult] = useState<{
    result: PlanResultData;
    request: PlanRequestData;
  } | null>(null);

  // Sync if initialType changes from prop
  useEffect(() => {
    if (initialType) {
      setActiveType(initialType);
    }
  }, [initialType]);

  /* ================= HOME FORM STATE ================= */
  const [homeBudget, setHomeBudget] = useState('50000');
  const [homeRoom, setHomeRoom] = useState('Living Room');
  const [homeType, setHomeType] = useState('2/3 BHK Apartment');
  const [homeStyle, setHomeStyle] = useState('Modern');
  const [homePriority, setHomePriority] = useState('Balanced');
  const [homeItems, setHomeItems] = useState<string[]>([
    'Sofa Seating',
    'Coffee Table',
    'Ambient Lighting',
    'Ceiling Fan',
  ]);
  const [newHomeItem, setNewHomeItem] = useState('');
  const [homeNotes, setHomeNotes] = useState('');

  /* ================= PARTY FORM STATE ================= */
  const [partyBudget, setPartyBudget] = useState('30000');
  const [partyType, setPartyType] = useState('College Event');
  const [partyGuests, setPartyGuests] = useState('30');
  const [partyLocation, setPartyLocation] = useState('Terrace / Rooftop');
  const [partyFood, setPartyFood] = useState('Finger Foods & Snacks');
  const [partyDecor, setPartyDecor] = useState('Balloon & Fairy Lights Theme');
  const [partyEntertainment, setPartyEntertainment] = useState('DJ / Music System');
  const [partyDate, setPartyDate] = useState('2026-10-15');
  const [partyNotes, setPartyNotes] = useState('');

  /* ================= JEWELRY FORM STATE ================= */
  const [jewelryBudget, setJewelryBudget] = useState('75000');
  const [jewelryType, setJewelryType] = useState('Set');
  const [jewelryOccasion, setJewelryOccasion] = useState('Wedding');
  const [jewelryMetal, setJewelryMetal] = useState('Gold');
  const [jewelryStyle, setJewelryStyle] = useState('Elegant');
  const [jewelryMainPiece, setJewelryMainPiece] = useState('Choker Necklace');
  const [jewelryMatching, setJewelryMatching] = useState('Matching Earrings');
  const [jewelryNotes, setJewelryNotes] = useState('');

  // Preset budget clickers
  const budgetPresets: Record<PlanType, number[]> = {
    home: [25000, 50000, 100000, 200000],
    party: [15000, 30000, 60000, 100000],
    jewelry: [30000, 75000, 120000, 250000],
  };

  const handleAddHomeItem = () => {
    if (newHomeItem.trim() && !homeItems.includes(newHomeItem.trim())) {
      setHomeItems([...homeItems, newHomeItem.trim()]);
      setNewHomeItem('');
    }
  };

  const handleRemoveHomeItem = (itemToRemove: string) => {
    setHomeItems(homeItems.filter((i) => i !== itemToRemove));
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    let budget = 0;
    let details: Record<string, any> = {};
    let title = '';

    if (activeType === 'home') {
      budget = parseInt(homeBudget, 10);
      if (isNaN(budget) || budget <= 0) {
        setError('Please enter a valid budget for your home plan (e.g. ₹50,000).');
        return;
      }
      title = `${homeStyle} ${homeRoom} Plan for ₹${budget.toLocaleString('en-IN')}`;
      details = {
        room: homeRoom,
        homeType,
        requiredItems: homeItems.join(', '),
        stylePreference: homeStyle,
        priority: homePriority,
        additionalRequirements: homeNotes,
      };
    } else if (activeType === 'party') {
      budget = parseInt(partyBudget, 10);
      const guests = parseInt(partyGuests, 10);
      if (isNaN(budget) || budget <= 0) {
        setError('Please enter a valid budget for your party plan (e.g. ₹30,000).');
        return;
      }
      if (isNaN(guests) || guests <= 0) {
        setError('Please enter a valid number of guests.');
        return;
      }
      title = `${partyType} Plan for ₹${budget.toLocaleString('en-IN')}`;
      details = {
        partyType,
        guests,
        location: partyLocation,
        foodPreference: partyFood,
        decorationPreference: partyDecor,
        entertainmentPreference: partyEntertainment,
        date: partyDate,
        additionalRequirements: partyNotes,
      };
    } else {
      budget = parseInt(jewelryBudget, 10);
      if (isNaN(budget) || budget <= 0) {
        setError('Please enter a valid budget for your jewelry plan (e.g. ₹75,000).');
        return;
      }
      title = `${jewelryStyle} ${jewelryMetal} ${jewelryType} Plan for ₹${budget.toLocaleString('en-IN')}`;
      details = {
        jewelryType,
        occasion: jewelryOccasion,
        preferredMetal: jewelryMetal,
        style: jewelryStyle,
        mainPiece: jewelryMainPiece,
        matchingRequirements: jewelryMatching,
        additionalRequirements: jewelryNotes,
      };
    }

    const requestPayload: PlanRequestData = {
      plan_type: activeType,
      total_budget: budget,
      title,
      details,
    };

    try {
      setLoading(true);
      const response = await api.generatePlan(requestPayload);
      setCurrentResult({
        result: response.result,
        request: requestPayload,
      });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      setError(err.message || 'Something went wrong while generating your plan. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // If a plan was generated, show the AI Result View
  if (currentResult) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <PlanResultView
          result={currentResult.result}
          request={currentResult.request}
          onBack={() => setCurrentResult(null)}
          onSaved={() => {
            if (onPlanCreated) onPlanCreated();
          }}
        />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Loading Modal */}
      {loading && (
        <LoadingPlanModal
          planType={activeType}
          budget={
            activeType === 'home'
              ? parseInt(homeBudget, 10) || 50000
              : activeType === 'party'
              ? parseInt(partyBudget, 10) || 30000
              : parseInt(jewelryBudget, 10) || 75000
          }
        />
      )}

      {/* Header section */}
      <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold uppercase tracking-wider mb-3">
          <Sparkles className="w-3.5 h-3.5 text-blue-600" />
          Smart Spending Planners
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-sans">
          What would you like to plan today?
        </h1>
        <p className="mt-2 text-sm sm:text-base text-slate-600">
          Enter your total budget and criteria. PocketSmart AI ensures the final recommendations never exceed your limit.
        </p>
      </div>

      {/* 3 Planner Selector Tabs */}
      <div className="grid grid-cols-3 gap-2 p-1.5 bg-slate-200/70 rounded-2xl mb-8">
        <button
          type="button"
          onClick={() => setActiveType('home')}
          className={`flex items-center justify-center gap-2 py-3 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            activeType === 'home'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
          }`}
        >
          <Home className={`w-4 h-4 ${activeType === 'home' ? 'text-blue-600' : 'text-slate-400'}`} />
          <span>Home Planner</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveType('party')}
          className={`flex items-center justify-center gap-2 py-3 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            activeType === 'party'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
          }`}
        >
          <PartyPopper className={`w-4 h-4 ${activeType === 'party' ? 'text-purple-600' : 'text-slate-400'}`} />
          <span>Party Planner</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveType('jewelry')}
          className={`flex items-center justify-center gap-2 py-3 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            activeType === 'jewelry'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
          }`}
        >
          <Gem className={`w-4 h-4 ${activeType === 'jewelry' ? 'text-amber-500' : 'text-slate-400'}`} />
          <span>Jewelry Planner</span>
        </button>
      </div>

      {/* Error Notice */}
      {error && (
        <div className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-xl text-sm text-rose-700 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Main Form Container */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/90 shadow-xs">
        <form onSubmit={handleGenerate} className="space-y-6">
          {/* =========================================================================
              A. HOME PLANNER FORM
             ========================================================================= */}
          {activeType === 'home' && (
            <>
              <div className="border-b border-slate-100 pb-4 mb-2">
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2 font-sans">
                  <Home className="w-5 h-5 text-blue-600" />
                  Home Budget Planner
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                  Plan your home purchases and furnishings based on your available budget.
                </p>
              </div>

              {/* Total Budget Field with Quick Presets */}
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  Total Budget (₹) <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <span className="font-bold text-base text-slate-600">₹</span>
                  </div>
                  <input
                    type="number"
                    min="1000"
                    step="500"
                    required
                    value={homeBudget}
                    onChange={(e) => setHomeBudget(e.target.value)}
                    placeholder="e.g. 50000"
                    className="w-full pl-9 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-lg font-bold text-slate-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
                {/* Presets */}
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <span className="text-xs text-slate-400 font-medium">Quick Presets:</span>
                  {budgetPresets.home.map((amount) => (
                    <button
                      key={amount}
                      type="button"
                      onClick={() => setHomeBudget(amount.toString())}
                      className={`px-2.5 py-1 text-xs rounded-lg font-semibold transition-colors ${
                        homeBudget === amount.toString()
                          ? 'bg-blue-600 text-white shadow-2xs'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      ₹{amount.toLocaleString('en-IN')}
                    </button>
                  ))}
                </div>
              </div>

              {/* Room / Area & Home Type */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Room / Area <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={homeRoom}
                    onChange={(e) => setHomeRoom(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Living Room">Living Room</option>
                    <option value="Bedroom">Bedroom</option>
                    <option value="Kitchen">Kitchen</option>
                    <option value="Dining Room">Dining Room</option>
                    <option value="Full Home">Full Home</option>
                    <option value="Home Office / Study">Home Office / Study</option>
                    <option value="Balcony / Patio">Balcony / Patio</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Home Type
                  </label>
                  <select
                    value={homeType}
                    onChange={(e) => setHomeType(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="1 BHK Apartment">1 BHK Apartment</option>
                    <option value="2/3 BHK Apartment">2/3 BHK Apartment</option>
                    <option value="Independent House / Villa">Independent House / Villa</option>
                    <option value="Studio / PG">Studio / PG</option>
                  </select>
                </div>
              </div>

              {/* Style Preference & Priority */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Style Preference
                  </label>
                  <select
                    value={homeStyle}
                    onChange={(e) => setHomeStyle(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Modern">Modern</option>
                    <option value="Minimal">Minimal</option>
                    <option value="Traditional">Traditional</option>
                    <option value="Budget Friendly">Budget Friendly</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Priority Focus
                  </label>
                  <select
                    value={homePriority}
                    onChange={(e) => setHomePriority(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Essential">Essential (Core Utility & Longevity)</option>
                    <option value="Balanced">Balanced (Comfort & Aesthetics)</option>
                    <option value="Premium">Premium (Luxury Accents & Finishes)</option>
                  </select>
                </div>
              </div>

              {/* Required Items Tags */}
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  Required Items
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {homeItems.map((item) => (
                    <span
                      key={item}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-blue-50 text-blue-800 border border-blue-200"
                    >
                      {item}
                      <button
                        type="button"
                        onClick={() => handleRemoveHomeItem(item)}
                        className="text-blue-500 hover:text-blue-800"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newHomeItem}
                    onChange={(e) => setNewHomeItem(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddHomeItem();
                      }
                    }}
                    placeholder="Add an item (e.g. Curtains, Bookshelf, Planters)"
                    className="flex-1 px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={handleAddHomeItem}
                    className="px-3.5 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add
                  </button>
                </div>
              </div>

              {/* Additional Requirements */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Additional Requirements / Specific Needs
                </label>
                <textarea
                  rows={2}
                  value={homeNotes}
                  onChange={(e) => setHomeNotes(e.target.value)}
                  placeholder="e.g. Pet-friendly sofa fabric, warm 3000K lighting, neutral color palette"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Submit button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-6 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 text-sm sm:text-base cursor-pointer disabled:opacity-50"
              >
                <Sparkles className="w-4 h-4 text-orange-300" />
                <span>Generate Home Plan</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </>
          )}

          {/* =========================================================================
              B. PARTY PLANNER FORM
             ========================================================================= */}
          {activeType === 'party' && (
            <>
              <div className="border-b border-slate-100 pb-4 mb-2">
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2 font-sans">
                  <PartyPopper className="w-5 h-5 text-purple-600" />
                  Party Budget Planner
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                  Create a complete party plan without exceeding your budget.
                </p>
              </div>

              {/* Total Budget Field with Quick Presets */}
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  Total Budget (₹) <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <span className="font-bold text-base text-slate-600">₹</span>
                  </div>
                  <input
                    type="number"
                    min="1000"
                    step="500"
                    required
                    value={partyBudget}
                    onChange={(e) => setPartyBudget(e.target.value)}
                    placeholder="e.g. 30000"
                    className="w-full pl-9 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-lg font-bold text-slate-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  />
                </div>
                {/* Presets */}
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <span className="text-xs text-slate-400 font-medium">Quick Presets:</span>
                  {budgetPresets.party.map((amount) => (
                    <button
                      key={amount}
                      type="button"
                      onClick={() => setPartyBudget(amount.toString())}
                      className={`px-2.5 py-1 text-xs rounded-lg font-semibold transition-colors ${
                        partyBudget === amount.toString()
                          ? 'bg-purple-600 text-white shadow-2xs'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      ₹{amount.toLocaleString('en-IN')}
                    </button>
                  ))}
                </div>
              </div>

              {/* Party Type & Number of Guests */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Party Type <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={partyType}
                    onChange={(e) => setPartyType(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="Birthday">Birthday</option>
                    <option value="College Event">College Event</option>
                    <option value="Anniversary">Anniversary</option>
                    <option value="Family Function">Family Function</option>
                    <option value="Celebration">Celebration</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Number of Guests <span className="text-rose-500">*</span>
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="range"
                      min="5"
                      max="150"
                      value={partyGuests}
                      onChange={(e) => setPartyGuests(e.target.value)}
                      className="flex-1 accent-purple-600"
                    />
                    <span className="w-14 text-center py-2 px-2.5 bg-slate-100 rounded-xl font-bold text-slate-900 text-sm">
                      {partyGuests}
                    </span>
                  </div>
                </div>
              </div>

              {/* Location & Food Preference */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Location
                  </label>
                  <select
                    value={partyLocation}
                    onChange={(e) => setPartyLocation(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="Home">Home</option>
                    <option value="Terrace / Rooftop">Terrace / Rooftop</option>
                    <option value="Banquet Hall">Banquet Hall</option>
                    <option value="Restaurant / Cafe">Restaurant / Cafe</option>
                    <option value="Outdoor Lawn">Outdoor Lawn</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Food Preference
                  </label>
                  <select
                    value={partyFood}
                    onChange={(e) => setPartyFood(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="Finger Foods & Snacks">Finger Foods & Snacks</option>
                    <option value="Vegetarian Buffet">Vegetarian Buffet</option>
                    <option value="Non-Veg & Veg Spread">Non-Veg & Veg Spread</option>
                    <option value="High Tea & Mocktails">High Tea & Mocktails</option>
                    <option value="Custom Catering">Custom Catering</option>
                  </select>
                </div>
              </div>

              {/* Decoration & Entertainment */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Decoration Preference
                  </label>
                  <select
                    value={partyDecor}
                    onChange={(e) => setPartyDecor(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="Balloon & Fairy Lights Theme">Balloon & Fairy Lights Theme</option>
                    <option value="Minimal & Elegant">Minimal & Elegant</option>
                    <option value="Floral & Traditional">Floral & Traditional</option>
                    <option value="Glamorous Party Theme">Glamorous Party Theme</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Entertainment Preference
                  </label>
                  <select
                    value={partyEntertainment}
                    onChange={(e) => setPartyEntertainment(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="DJ / Music System">DJ / Music System</option>
                    <option value="Live Acoustic">Live Acoustic</option>
                    <option value="Party Games & Host">Party Games & Host</option>
                    <option value="DIY Playlist / Bluetooth Speaker">DIY Playlist / Bluetooth Speaker</option>
                  </select>
                </div>
              </div>

              {/* Date & Additional Requirements */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Target Date
                  </label>
                  <input
                    type="date"
                    value={partyDate}
                    onChange={(e) => setPartyDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Additional Requirements
                  </label>
                  <input
                    type="text"
                    value={partyNotes}
                    onChange={(e) => setPartyNotes(e.target.value)}
                    placeholder="e.g. Polaroid photo zone, cake cutting table, mocktail dispenser"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              {/* Submit button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-6 rounded-xl font-bold text-white bg-purple-600 hover:bg-purple-700 shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 text-sm sm:text-base cursor-pointer disabled:opacity-50"
              >
                <Sparkles className="w-4 h-4 text-orange-300" />
                <span>Generate Party Plan</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </>
          )}

          {/* =========================================================================
              C. JEWELRY PLANNER FORM
             ========================================================================= */}
          {activeType === 'jewelry' && (
            <>
              <div className="border-b border-slate-100 pb-4 mb-2">
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2 font-sans">
                  <Gem className="w-5 h-5 text-amber-500" />
                  Jewelry Budget Planner
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                  Find suitable jewelry combinations within your budget.
                </p>
              </div>

              {/* Total Budget Field with Quick Presets */}
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  Total Budget (₹) <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <span className="font-bold text-base text-slate-600">₹</span>
                  </div>
                  <input
                    type="number"
                    min="1000"
                    step="1000"
                    required
                    value={jewelryBudget}
                    onChange={(e) => setJewelryBudget(e.target.value)}
                    placeholder="e.g. 75000"
                    className="w-full pl-9 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-lg font-bold text-slate-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                  />
                </div>
                {/* Presets */}
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <span className="text-xs text-slate-400 font-medium">Quick Presets:</span>
                  {budgetPresets.jewelry.map((amount) => (
                    <button
                      key={amount}
                      type="button"
                      onClick={() => setJewelryBudget(amount.toString())}
                      className={`px-2.5 py-1 text-xs rounded-lg font-semibold transition-colors ${
                        jewelryBudget === amount.toString()
                          ? 'bg-amber-600 text-white shadow-2xs'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      ₹{amount.toLocaleString('en-IN')}
                    </button>
                  ))}
                </div>
              </div>

              {/* Jewelry Type & Occasion */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Jewelry Type <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={jewelryType}
                    onChange={(e) => setJewelryType(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="Set">Complete Set</option>
                    <option value="Necklace">Necklace</option>
                    <option value="Earrings">Earrings</option>
                    <option value="Bracelet">Bracelet / Bangles</option>
                    <option value="Ring">Ring</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Occasion <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={jewelryOccasion}
                    onChange={(e) => setJewelryOccasion(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="Wedding">Wedding</option>
                    <option value="Festival / Puja">Festival / Puja</option>
                    <option value="Daily Wear">Daily Wear</option>
                    <option value="College Farewell / Party">College Farewell / Party</option>
                    <option value="Office Wear">Office Wear</option>
                    <option value="Gift">Gift</option>
                  </select>
                </div>
              </div>

              {/* Metal & Style */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Preferred Metal
                  </label>
                  <select
                    value={jewelryMetal}
                    onChange={(e) => setJewelryMetal(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="Gold">Gold (22K / 18K Hallmarked)</option>
                    <option value="Silver">Silver (925 Sterling)</option>
                    <option value="Platinum">Platinum</option>
                    <option value="Other / Brass Plated">Other / Fashion Metal</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Style
                  </label>
                  <select
                    value={jewelryStyle}
                    onChange={(e) => setJewelryStyle(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="Traditional">Traditional / Heritage</option>
                    <option value="Modern">Modern</option>
                    <option value="Minimal">Minimal</option>
                    <option value="Elegant">Elegant</option>
                  </select>
                </div>
              </div>

              {/* Main Piece & Matching Requirements */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Main Piece
                  </label>
                  <input
                    type="text"
                    value={jewelryMainPiece}
                    onChange={(e) => setJewelryMainPiece(e.target.value)}
                    placeholder="e.g. Statement Choker, Solitaire Pendant"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Matching Requirements
                  </label>
                  <input
                    type="text"
                    value={jewelryMatching}
                    onChange={(e) => setJewelryMatching(e.target.value)}
                    placeholder="e.g. Matching earrings, Maang Tikka, Ring"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              {/* Additional Requirements */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Additional Requirements
                </label>
                <textarea
                  rows={2}
                  value={jewelryNotes}
                  onChange={(e) => setJewelryNotes(e.target.value)}
                  placeholder="e.g. BIS Hallmarked, lightweight for long wear, includes velvet travel case"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                />
              </div>

              {/* Submit button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-6 rounded-xl font-bold text-white bg-amber-600 hover:bg-amber-700 shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 text-sm sm:text-base cursor-pointer disabled:opacity-50"
              >
                <Sparkles className="w-4 h-4 text-amber-200" />
                <span>Generate Jewelry Plan</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </>
          )}
        </form>
      </div>
    </div>
  );
};
