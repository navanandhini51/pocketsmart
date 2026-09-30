import React, { useState, useEffect } from 'react';
import { 
  User as UserIcon, 
  Mail, 
  Calendar, 
  LogOut, 
  Save, 
  ShieldCheck, 
  CheckCircle2, 
  Layers, 
  Coins, 
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { DashboardStats } from '../types';

interface ProfilePageProps {
  onLogout: () => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({ onLogout }) => {
  const { user, updateName, logout } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [isUpdating, setIsUpdating] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [stats, setStats] = useState<DashboardStats | null>(null);

  useEffect(() => {
    if (user?.name) {
      setName(user.name);
    }
  }, [user?.name]);

  useEffect(() => {
    async function loadStats() {
      try {
        const { stats } = await api.getDashboardStats();
        setStats(stats);
      } catch (e) {
        // ignore
      }
    }
    loadStats();
  }, []);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || name.trim().length < 2) {
      setMessage({ type: 'error', text: 'Name must be at least 2 characters long.' });
      return;
    }

    try {
      setIsUpdating(true);
      setMessage(null);
      await updateName(name.trim());
      setMessage({ type: 'success', text: 'Profile name updated successfully!' });
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Could not update profile.' });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleLogoutClick = () => {
    logout();
    onLogout();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Header */}
      <div className="border-b border-slate-200/80 pb-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider mb-2">
          <UserIcon className="w-3.5 h-3.5 text-blue-600" />
          Account Settings
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-sans">
          My Profile
        </h1>
        <p className="text-sm text-slate-600 mt-1">
          Manage your account information and review your plan stats.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* User Card */}
        <div className="md:col-span-1 bg-white rounded-2xl p-6 border border-slate-200/90 shadow-2xs space-y-6 text-center">
          <div className="relative mx-auto w-20 h-20 rounded-full bg-gradient-to-tr from-slate-900 to-blue-600 text-white font-extrabold text-2xl flex items-center justify-center shadow-md">
            {user?.name?.charAt(0) || 'U'}
          </div>

          <div>
            <h3 className="font-bold text-lg text-slate-900">{user?.name}</h3>
            <p className="text-xs text-slate-500 truncate">{user?.email}</p>
          </div>

          <div className="pt-4 border-t border-slate-100 text-left space-y-3 text-xs">
            <div className="flex items-center justify-between text-slate-600">
              <span className="flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-blue-600" />
                Plans Created:
              </span>
              <span className="font-bold text-slate-900">{stats?.totalPlans || 0}</span>
            </div>

            <div className="flex items-center justify-between text-slate-600">
              <span className="flex items-center gap-1.5">
                <Coins className="w-3.5 h-3.5 text-emerald-600" />
                Total Budget:
              </span>
              <span className="font-bold text-slate-900">
                ₹{(stats?.totalBudgetPlanned || 0).toLocaleString('en-IN')}
              </span>
            </div>

            <div className="flex items-center justify-between text-slate-600">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                Joined:
              </span>
              <span className="font-medium text-slate-700">
                {user?.created_at
                  ? new Date(user.created_at).toLocaleDateString('en-IN', {
                      month: 'short',
                      year: 'numeric',
                    })
                  : 'Recent'}
              </span>
            </div>
          </div>

          <button
            onClick={handleLogoutClick}
            className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>

        {/* Update Form */}
        <div className="md:col-span-2 bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/90 shadow-2xs space-y-6">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Profile Details</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Keep your account details up to date for personalized recommendations.
            </p>
          </div>

          {message && (
            <div
              className={`p-3.5 rounded-xl text-xs flex items-center gap-2 ${
                message.type === 'success'
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : 'bg-rose-50 text-rose-700 border border-rose-200'
              }`}
            >
              {message.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              ) : (
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              )}
              <span>{message.text}</span>
            </div>
          )}

          <form onSubmit={handleUpdate} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                disabled
                value={user?.email || ''}
                className="w-full px-3.5 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-sm text-slate-500 cursor-not-allowed"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Account email is permanent and used for secure plan recovery.
              </p>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isUpdating}
                className="px-5 py-2.5 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-2xs transition-all text-xs sm:text-sm flex items-center gap-2 disabled:opacity-50 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>{isUpdating ? 'Saving...' : 'Update Name'}</span>
              </button>
            </div>
          </form>

          {/* Privacy & Security note */}
          <div className="pt-6 border-t border-slate-100 flex items-start gap-2.5 text-xs text-slate-500">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <p>
              Your plans and search history are privately scoped to your account and never shared across users.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
