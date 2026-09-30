import React, { useState } from 'react';
import { 
  Sparkles, 
  Home, 
  PartyPopper, 
  Gem, 
  ShieldCheck, 
  Send, 
  CheckCircle2, 
  MessageSquare,
  Lock,
  Calculator,
  ArrowRight
} from 'lucide-react';
import { api } from '../services/api';

interface AboutContactPageProps {
  initialSection?: 'about' | 'contact' | 'privacy';
  onSelectPlanner: (type: 'home' | 'party' | 'jewelry') => void;
}

export const AboutContactPage: React.FC<AboutContactPageProps> = ({ 
  initialSection = 'about',
  onSelectPlanner 
}) => {
  const [activeSection, setActiveSection] = useState<'about' | 'contact' | 'privacy'>(initialSection);

  // Contact form
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) {
      setError('Please fill in all fields.');
      return;
    }
    try {
      setSubmitting(true);
      setError('');
      await api.sendContact(name, email, message);
      setSuccess(true);
      setName('');
      setEmail('');
      setMessage('');
    } catch (err: any) {
      setError(err.message || 'Could not send message.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-10">
      {/* Navigation tabs */}
      <div className="flex justify-center">
        <div className="inline-flex p-1 bg-slate-200/80 rounded-2xl">
          <button
            onClick={() => setActiveSection('about')}
            className={`px-5 py-2 text-xs sm:text-sm font-bold rounded-xl transition-all ${
              activeSection === 'about'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            About PocketSmart AI
          </button>
          <button
            onClick={() => setActiveSection('contact')}
            className={`px-5 py-2 text-xs sm:text-sm font-bold rounded-xl transition-all ${
              activeSection === 'contact'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Contact & Support
          </button>
          <button
            onClick={() => setActiveSection('privacy')}
            className={`px-5 py-2 text-xs sm:text-sm font-bold rounded-xl transition-all ${
              activeSection === 'privacy'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Privacy & Trust
          </button>
        </div>
      </div>

      {/* ABOUT SECTION (Section 30) */}
      {activeSection === 'about' && (
        <div className="space-y-8 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/90 shadow-2xs space-y-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              Our Mission
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-sans">
              "PocketSmart AI is a smart budgeting and recommendation platform designed to help users make better spending decisions based on their available budget and personal requirements."
            </h1>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              We eliminate buyer's remorse and runaway shopping carts. Traditional e-commerce encourages you to spend more; PocketSmart AI works in reverse by locking your upper financial boundary and curating top-tier selections that fit comfortably within that ceiling.
            </p>
          </div>

          {/* 3 Planners Deep Dive */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Home className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-lg text-slate-900">Home Budget Planner</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Whether furnishing an apartment or refreshing a single living room, our model splits funds between ergonomic seating, power-efficient BLDC appliances, atmospheric lighting, and decor without compromising durability.
              </p>
              <button
                onClick={() => onSelectPlanner('home')}
                className="text-xs font-bold text-blue-600 flex items-center gap-1 hover:underline pt-2"
              >
                <span>Try Home Planner</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                <PartyPopper className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-lg text-slate-900">Party Budget Planner</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Tailored for college farewells, family functions, and birthdays. Takes your exact headcount and balances catering trays, sound speaker rentals, balloon backdrops, and leaves an emergency 10% cash buffer.
              </p>
              <button
                onClick={() => onSelectPlanner('party')}
                className="text-xs font-bold text-purple-600 flex items-center gap-1 hover:underline pt-2"
              >
                <span>Try Party Planner</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <Gem className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-lg text-slate-900">Jewelry Budget Planner</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Precious metals fluctuate daily. PocketSmart AI accounts for making charges and hallmarking buffers while matching necklaces, earrings, and heirloom packaging within your exact festive or bridal limit.
              </p>
              <button
                onClick={() => onSelectPlanner('jewelry')}
                className="text-xs font-bold text-amber-600 flex items-center gap-1 hover:underline pt-2"
              >
                <span>Try Jewelry Planner</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CONTACT SECTION (Section 31) */}
      {activeSection === 'contact' && (
        <div className="max-w-xl mx-auto bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/90 shadow-2xs space-y-6 animate-in fade-in duration-200">
          <div className="text-center space-y-1.5">
            <h2 className="text-2xl font-bold text-slate-900">Contact Us</h2>
            <p className="text-xs sm:text-sm text-slate-500">
              We love feedback from students, homemakers, and party hosts.
            </p>
          </div>

          {success ? (
            <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
              <h4 className="font-bold text-emerald-900">Message Received!</h4>
              <p className="text-xs text-emerald-700">
                Thank you for reaching out. We will get back to your email shortly.
              </p>
              <button
                onClick={() => setSuccess(false)}
                className="text-xs font-bold text-emerald-800 underline mt-2 block mx-auto"
              >
                Send another note
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your Name"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Message
                </label>
                <textarea
                  rows={4}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Your inquiry or suggestion..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 px-4 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-sm transition-all flex items-center justify-center gap-2 text-sm disabled:opacity-50 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>{submitting ? 'Sending...' : 'Send Message'}</span>
              </button>
            </form>
          )}
        </div>
      )}

      {/* PRIVACY SECTION */}
      {activeSection === 'privacy' && (
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/90 shadow-2xs space-y-6 text-slate-700 text-sm leading-relaxed animate-in fade-in duration-200">
          <div className="flex items-center gap-2 mb-2">
            <ShieldCheck className="w-6 h-6 text-emerald-600" />
            <h2 className="text-2xl font-bold text-slate-900 font-sans">
              Privacy, Security & Estimates Notice
            </h2>
          </div>

          <div className="space-y-4">
            <h4 className="font-bold text-slate-900 text-base">1. User Data & Authentication</h4>
            <p className="text-xs sm:text-sm text-slate-600">
              PocketSmart AI uses user-isolated account storage. Your plans, budget inputs, and profile details are visible strictly to your authenticated session.
            </p>

            <h4 className="font-bold text-slate-900 text-base">2. Server-Side AI Security</h4>
            <p className="text-xs sm:text-sm text-slate-600">
              All Gemini AI inference operations execute safely on our backend server proxy. No API keys or internal tokens are ever exposed to the client browser.
            </p>

            <h4 className="font-bold text-slate-900 text-base">3. Disclaimer on Commercial Pricing</h4>
            <p className="text-xs sm:text-sm text-slate-600">
              Prices and recommendations are estimates and may change based on availability, location, seller, and market conditions. Verify final prices before purchasing on third-party websites like Amazon, Flipkart, or local retail jewelers.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
