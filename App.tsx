
import React, { useState, useEffect } from 'react';
import { User, UserRole, MedicationReminder } from './types';
import { HEALTH_TIPS } from './constants';
import { db } from './services/db';
import Layout from './components/Layout';
import PatientDashboard from './components/PatientDashboard';
import WorkerDashboard from './components/WorkerDashboard';
import VoiceAssistant from './components/VoiceAssistant';
import Reminders from './components/Reminders';
import Settings from './components/Settings';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState('dash');
  const [reminders, setReminders] = useState<MedicationReminder[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize from local storage (Offline-first)
  useEffect(() => {
    const storedUser = db.getUser();
    if (storedUser) {
      setUser(storedUser);
    }
    const storedReminders = db.getReminders();
    setReminders(storedReminders);
    setIsLoading(false);
  }, []);

  const handleLogin = (role: UserRole) => {
    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      name: role === UserRole.PATIENT ? 'Patient User' : 'Health Worker',
      role,
      language: 'English',
      isLoggedIn: true
    };
    setUser(newUser);
    db.setUser(newUser);
  };

  const handleLogout = () => {
    setUser(null);
    db.clearUser();
    setActiveTab('dash');
  };

  const handleUpdateUser = (updates: Partial<User>) => {
    if (user) {
      const updated = { ...user, ...updates };
      setUser(updated);
      db.setUser(updated);
    }
  };

  const handleAddReminder = (name: string, time: string, freq: string) => {
    const newRem: MedicationReminder = {
      id: Date.now().toString(),
      medication: name,
      time,
      taken: false,
      frequency: freq
    };
    db.saveReminder(newRem);
    setReminders(prev => [...prev, newRem]);
  };

  const handleToggleReminder = (id: string) => {
    const rem = reminders.find(r => r.id === id);
    if (rem) {
      const updatedRem = { ...rem, taken: !rem.taken };
      db.updateReminder(id, { taken: updatedRem.taken });
      setReminders(prev => prev.map(r => r.id === id ? updatedRem : r));
    }
  };

  const handleDeleteReminder = (id: string) => {
    db.deleteReminder(id);
    setReminders(prev => prev.filter(r => r.id !== id));
  };

  if (isLoading) return <div className="h-screen flex items-center justify-center bg-blue-50">Loading UHC...</div>;

  // Landing / Auth Screen
  if (!user) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-md space-y-8 text-center">
          <div className="flex flex-col items-center">
            <div className="bg-blue-600 text-white w-20 h-20 rounded-3xl flex items-center justify-center text-4xl font-bold shadow-xl mb-6">
              UHC
            </div>
            <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Universal Health</h1>
            <p className="mt-3 text-lg text-slate-500 max-w-xs mx-auto">Inclusive AI assistant for a healthier world.</p>
          </div>

          <div className="grid grid-cols-1 gap-4 mt-12">
            <button 
              onClick={() => handleLogin(UserRole.PATIENT)}
              className="bg-white p-8 rounded-3xl shadow-sm border-2 border-slate-100 flex flex-col items-center hover:border-blue-500 hover:shadow-md transition-all active:scale-95"
            >
              <span className="text-4xl mb-4">🏠</span>
              <span className="text-xl font-bold text-slate-800">I am a Patient</span>
              <span className="text-sm text-slate-500 mt-1">Get health tips and reminders</span>
            </button>
            <button 
              onClick={() => handleLogin(UserRole.HEALTH_WORKER)}
              className="bg-slate-800 p-8 rounded-3xl shadow-sm border-2 border-slate-700 flex flex-col items-center hover:bg-slate-900 hover:border-slate-600 transition-all active:scale-95 text-white"
            >
              <span className="text-4xl mb-4">⚕️</span>
              <span className="text-xl font-bold">I am a Health Worker</span>
              <span className="text-sm text-slate-400 mt-1">Clinical protocols and guidance</span>
            </button>
          </div>

          <div className="pt-8 text-slate-400 text-sm">
            Available in 10+ regional languages. Voice enabled.
          </div>
        </div>
      </div>
    );
  }

  // Application Layout and Content
  const renderContent = () => {
    switch (activeTab) {
      case 'dash':
        return user.role === UserRole.PATIENT 
          ? <PatientDashboard 
              user={user} 
              reminders={reminders} 
              tips={HEALTH_TIPS} 
              onNavigate={setActiveTab}
              onToggleReminder={handleToggleReminder}
            /> 
          : <WorkerDashboard />;
      case 'voice':
        return <VoiceAssistant user={user} />;
      case 'reminders':
        return (
          <Reminders 
            reminders={reminders} 
            onAdd={handleAddReminder} 
            onToggle={handleToggleReminder} 
            onDelete={handleDeleteReminder}
          />
        );
      case 'tips':
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-800 mb-6">Health Tips</h2>
            {HEALTH_TIPS.map(tip => (
              <div key={tip.id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                <div className="flex justify-between items-start mb-3">
                  <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded ${
                    tip.category === 'DIABETES' ? 'bg-orange-50 text-orange-600' :
                    tip.category === 'HYPERTENSION' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'
                  }`}>
                    {tip.category}
                  </span>
                </div>
                <h3 className="font-bold text-slate-800 mb-2">{tip.title}</h3>
                <p className="text-slate-600 leading-relaxed text-sm">{tip.content}</p>
              </div>
            ))}
          </div>
        );
      case 'protocols':
        return <WorkerDashboard />;
      case 'settings':
        return <Settings user={user} onUpdateUser={handleUpdateUser} />;
      default:
        return <div>Page not found</div>;
    }
  };

  return (
    <Layout 
      user={user} 
      onLogout={handleLogout} 
      activeTab={activeTab} 
      setActiveTab={setActiveTab}
    >
      {renderContent()}
    </Layout>
  );
};

export default App;
