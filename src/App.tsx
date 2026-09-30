/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { LandingPage } from './pages/LandingPage';
import { DashboardPage } from './pages/DashboardPage';
import { PlannerPage } from './pages/PlannerPage';
import { HistoryPage } from './pages/HistoryPage';
import { ProfilePage } from './pages/ProfilePage';
import { AuthPage } from './pages/AuthPage';
import { AboutContactPage } from './pages/AboutContactPage';
import { PlanResultView } from './components/PlanResultView';
import { PlanRecord, PlanType } from './types';

function MainApp() {
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState<string>('landing');
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [viewingSavedPlan, setViewingSavedPlan] = useState<PlanRecord | null>(null);

  const handleOpenAuth = (mode: 'login' | 'register') => {
    setAuthMode(mode);
    setActiveTab('auth');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectPlanner = (type: PlanType) => {
    setViewingSavedPlan(null);
    if (type === 'home') setActiveTab('home-planner');
    else if (type === 'party') setActiveTab('party-planner');
    else if (type === 'jewelry') setActiveTab('jewelry-planner');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleViewPlan = (plan: PlanRecord) => {
    setViewingSavedPlan(plan);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-semibold text-slate-500">Loading PocketSmart AI...</p>
        </div>
      </div>
    );
  }

  // Render view
  const renderContent = () => {
    // If viewing a previous plan from history or dashboard
    if (viewingSavedPlan) {
      return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <PlanResultView
            result={viewingSavedPlan.result_data}
            request={viewingSavedPlan.request_data}
            isSavedView={true}
            onBack={() => setViewingSavedPlan(null)}
          />
        </div>
      );
    }

    switch (activeTab) {
      case 'landing':
        return (
          <LandingPage
            onGetStarted={() => {
              if (user) setActiveTab('dashboard');
              else handleOpenAuth('register');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onLoginClick={() => handleOpenAuth('login')}
            onSelectPlanner={handleSelectPlanner}
          />
        );

      case 'dashboard':
        if (!user) {
          return (
            <AuthPage
              initialMode="login"
              onSuccess={() => setActiveTab('dashboard')}
            />
          );
        }
        return (
          <DashboardPage
            onSelectPlanner={handleSelectPlanner}
            onViewPlan={handleViewPlan}
            onViewHistory={() => {
              setActiveTab('history');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        );

      case 'home-planner':
        return (
          <PlannerPage
            initialType="home"
            onPlanCreated={() => setActiveTab('history')}
          />
        );

      case 'party-planner':
        return (
          <PlannerPage
            initialType="party"
            onPlanCreated={() => setActiveTab('history')}
          />
        );

      case 'jewelry-planner':
        return (
          <PlannerPage
            initialType="jewelry"
            onPlanCreated={() => setActiveTab('history')}
          />
        );

      case 'history':
        if (!user) {
          return (
            <AuthPage
              initialMode="login"
              onSuccess={() => setActiveTab('history')}
            />
          );
        }
        return (
          <HistoryPage
            onViewPlan={handleViewPlan}
            onCreatePlan={() => setActiveTab('home-planner')}
          />
        );

      case 'profile':
        if (!user) {
          return (
            <AuthPage
              initialMode="login"
              onSuccess={() => setActiveTab('profile')}
            />
          );
        }
        return <ProfilePage onLogout={() => setActiveTab('landing')} />;

      case 'auth':
        return (
          <AuthPage
            initialMode={authMode}
            onSuccess={() => {
              setActiveTab('dashboard');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        );

      case 'about':
        return <AboutContactPage initialSection="about" onSelectPlanner={handleSelectPlanner} />;

      case 'contact':
        return <AboutContactPage initialSection="contact" onSelectPlanner={handleSelectPlanner} />;

      case 'privacy':
        return <AboutContactPage initialSection="privacy" onSelectPlanner={handleSelectPlanner} />;

      default:
        return (
          <LandingPage
            onGetStarted={() => {
              if (user) setActiveTab('dashboard');
              else handleOpenAuth('register');
            }}
            onLoginClick={() => handleOpenAuth('login')}
            onSelectPlanner={handleSelectPlanner}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900 selection:bg-blue-100 selection:text-blue-900">
      <Navbar
        activeTab={viewingSavedPlan ? 'history' : activeTab}
        setActiveTab={(tab) => {
          setViewingSavedPlan(null);
          setActiveTab(tab);
        }}
        onOpenAuthModal={handleOpenAuth}
      />

      <main className="flex-1">
        {renderContent()}
      </main>

      <Footer
        setActiveTab={(tab) => {
          setViewingSavedPlan(null);
          setActiveTab(tab);
        }}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
