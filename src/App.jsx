import React, { useState } from 'react';
import DisclaimerBanner from './components/DisclaimerBanner';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';

import DashboardPage from './pages/DashboardPage';
import ComplaintsPage from './pages/ComplaintsPage';
import TransactionsPage from './pages/TransactionsPage';
import AccountNetworkPage from './pages/AccountNetworkPage';
import CrossCaseLinkagePage from './pages/CrossCaseLinkagePage';
import PredictionPage from './pages/PredictionPage';
import PredictionPipelinePage from './pages/PredictionPipelinePage';
import RiskMapPage from './pages/RiskMapPage';
import ActionableIntelligencePage from './pages/ActionableIntelligencePage';
import BlockchainLedgerPage from './pages/BlockchainLedgerPage';
import Trl3ValidationPage from './pages/Trl3ValidationPage';
import LoginPage from './pages/LoginPage';

import { resetComplaints } from './services/api';

export default function App() {
  // Start on login page to match Screenshot 1 immediately
  const [currentPage, setCurrentPage] = useState('login');
  const [activeCaseId, setActiveCaseId] = useState('CMP-1001');
  const [currentUser, setCurrentUser] = useState({
    name: 'Officer CYB-DEL-742',
    officerId: 'CYB-DEL-742',
    level: 'LVL 4',
    department: 'Indian Cybercrime Coordination Centre (I4C)',
    role: 'Law Enforcement Intelligence Officer',
    badge: 'CYB-DEL-742'
  });
  const [notification, setNotification] = useState(null);

  function triggerNotification(msg) {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  }

  async function handleResetDataset() {
    try {
      await resetComplaints();
      triggerNotification('Dataset reset to default 128 clean cases with ground-truth seeded rings.');
    } catch (err) {
      triggerNotification('Failed to reset dataset: ' + err.message);
    }
  }

  function handleLogout() {
    setCurrentPage('login');
    triggerNotification('Signed out from command console.');
  }

  function handleLoginSuccess(userProfile) {
    setCurrentUser(userProfile);
    setCurrentPage('dashboard');
    triggerNotification(`Authenticated: ${userProfile.officerId} • ${userProfile.department}`);
  }

  // If on login screen, render full-screen login matching Screenshot 1
  if (currentPage === 'login') {
    return <LoginPage onLoginSuccess={handleLoginSuccess} />;
  }

  // Dashboard & Workspaces view matching Screenshot 2
  return (
    <div className="min-h-screen bg-[#050811] text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      
      {/* 1. Persistent Ethical & Stage Notice */}
      <DisclaimerBanner />

      {/* 2. Top Taskbar Header & Tabs (Matches Screenshot 2) */}
      <Navbar
        activeCaseId={activeCaseId}
        onSelectCase={setActiveCaseId}
        onResetDataset={handleResetDataset}
        currentUser={currentUser}
        onLogout={handleLogout}
        currentPage={currentPage}
        onNavigate={setCurrentPage}
        onOpenCreateComplaint={() => setCurrentPage('complaints')}
      />

      {/* Quick Toast Notification */}
      {notification && (
        <div className="fixed bottom-5 right-5 z-50 px-4 py-2.5 rounded-xl bg-cyan-950 border border-cyan-400 text-cyan-200 font-mono text-xs shadow-2xl animate-bounce">
          {notification}
        </div>
      )}

      {/* 3. Main Workspace Area: Sidebar + Content */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Sidebar Nav */}
        <Sidebar
          currentPage={currentPage}
          onNavigate={setCurrentPage}
        />

        {/* Dynamic Page Router */}
        <main className="flex-1 overflow-y-auto max-h-[calc(100vh-8.5rem)] bg-[#050811]">
          {currentPage === 'dashboard' && (
            <DashboardPage
              onNavigate={setCurrentPage}
              onSelectCase={setActiveCaseId}
            />
          )}

          {currentPage === 'complaints' && (
            <ComplaintsPage
              onNavigate={setCurrentPage}
              onSelectCase={setActiveCaseId}
            />
          )}

          {currentPage === 'transactions' && (
            <TransactionsPage
              onNavigate={setCurrentPage}
              onSelectCase={setActiveCaseId}
            />
          )}

          {currentPage === 'accounts' && (
            <AccountNetworkPage
              onNavigate={setCurrentPage}
            />
          )}

          {currentPage === 'linkage' && (
            <CrossCaseLinkagePage
              activeCaseId={activeCaseId}
              onSelectCase={setActiveCaseId}
              onNavigate={setCurrentPage}
            />
          )}

          {currentPage === 'prediction' && (
            <PredictionPage
              activeCaseId={activeCaseId}
              onSelectCase={setActiveCaseId}
              onNavigate={setCurrentPage}
            />
          )}

          {currentPage === 'pipeline' && (
            <PredictionPipelinePage
              onNavigate={setCurrentPage}
            />
          )}

          {currentPage === 'map' && (
            <RiskMapPage
              onSelectCase={setActiveCaseId}
              onNavigate={setCurrentPage}
            />
          )}

          {currentPage === 'intelligence' && (
            <ActionableIntelligencePage
              onSelectCase={setActiveCaseId}
              onNavigate={setCurrentPage}
            />
          )}

          {currentPage === 'blockchain' && (
            <BlockchainLedgerPage />
          )}

          {currentPage === 'trl3' && (
            <Trl3ValidationPage />
          )}
        </main>

      </div>

    </div>
  );
}
