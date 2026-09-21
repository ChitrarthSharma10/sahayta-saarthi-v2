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

  // Trainee → full Coursue standalone dashboard (has its own sidebar/header)
  if (role === 'Trainee') {
    return <CoursueDashboard />;
  }

  // Trainer & Admin → shared Coursue-themed layout shell
  return (
    <div className="min-h-screen bg-[#F6F7FB] text-[#19191F] flex flex-col md:flex-row antialiased">
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
