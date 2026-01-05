
import React from 'react';
import { User, UserRole } from '../types';

interface LayoutProps {
  user: User | null;
  onLogout: () => void;
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ user, onLogout, children, activeTab, setActiveTab }) => {
  if (!user) return <>{children}</>;

  const tabs = user.role === UserRole.PATIENT 
    ? [
        { id: 'dash', label: 'Home', icon: '🏠' },
        { id: 'voice', label: 'Ask AI', icon: '🎙️' },
        { id: 'reminders', label: 'Reminders', icon: '⏰' },
        { id: 'tips', label: 'Health Tips', icon: '💡' },
      ]
    : [
        { id: 'dash', label: 'Dashboard', icon: '📊' },
        { id: 'protocols', label: 'Protocols', icon: '📋' },
        { id: 'voice', label: 'Consult AI', icon: '🎙️' },
      ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-blue-600 text-white p-4 shadow-md sticky top-0 z-50 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="bg-white text-blue-600 p-1.5 rounded-lg font-bold text-xl">UHC</div>
          <div>
            <h1 className="font-bold text-lg leading-tight">Universal Health</h1>
            <p className="text-xs opacity-90">{user.role === UserRole.PATIENT ? 'Patient Assistant' : 'Health Worker Pro'}</p>
          </div>
        </div>
        <button 
          onClick={onLogout}
          className="bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors"
          title="Log out"
        >
          <span className="text-sm">Log out</span>
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-grow p-4 pb-24 max-w-2xl mx-auto w-full">
        {children}
      </main>

      {/* Mobile-First Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 flex justify-around p-2 shadow-lg z-50">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all ${
              activeTab === tab.id ? 'bg-blue-50 text-blue-600' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <span className="text-2xl mb-1">{tab.icon}</span>
            <span className="text-xs font-medium">{tab.label}</span>
          </button>
        ))}
        <button
          onClick={() => setActiveTab('settings')}
          className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all ${
            activeTab === 'settings' ? 'bg-blue-50 text-blue-600' : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          <span className="text-2xl mb-1">⚙️</span>
          <span className="text-xs font-medium">Settings</span>
        </button>
      </nav>
    </div>
  );
};

export default Layout;
