import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './components/common/Toast';
import { Sidebar } from './components/layout/Sidebar';
import { TopBar } from './components/layout/TopBar';
import { LoginPage } from './pages/LoginPage';
import { CoursueDashboard } from './pages/CoursueDashboard';
import { TrainerDashboard } from './pages/TrainerDashboard';
import { AdminDashboard } from './pages/AdminDashboard';

const MainLayout = () => {
  const { user, role, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');

  // Reset tab when switching roles
  useEffect(() => {
    setActiveTab('dashboard');
  }, [role]);

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  // Trainee → full Capacity Connect trainee dashboard (has its own sidebar/header)
  if (role === 'Trainee') {
    return (
      <div className="portal-shell">
        <CoursueDashboard />
      </div>
    );
  }

  // Trainer & Admin → shared Capacity Connect layout shell
  return (
    <>
      <div className="portal-shell dark-dashboard relative min-h-screen bg-[#0B1020] text-slate-100 antialiased">
        <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none" aria-hidden="true">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(115,191,196,0.26),_transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(255,129,10,0.18),_transparent_32%)]" />
          <div className="absolute inset-0 bg-[#0B1020]/72" />
        </div>

        <div className="relative z-10 flex min-h-screen flex-col md:flex-row">
          <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
          <div className="flex-1 flex flex-col min-w-0 min-h-screen">
            <TopBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
            <main className="flex-1 p-6 md:p-8 overflow-y-auto">
              {role === 'Trainer' ? (
                <TrainerDashboard activeTab={activeTab} setActiveTab={setActiveTab} searchQuery={searchQuery} />
              ) : (
                <AdminDashboard activeTab={activeTab} setActiveTab={setActiveTab} searchQuery={searchQuery} />
              )}
            </main>
          </div>
        </div>
      </div>
    </>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <MainLayout />
      </ToastProvider>
    </AuthProvider>
  );
}
