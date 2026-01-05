
import React from 'react';
import { User, MedicationReminder, HealthTip } from '../types';

interface PatientDashboardProps {
  user: User;
  reminders: MedicationReminder[];
  tips: HealthTip[];
  onNavigate: (tab: string) => void;
  onToggleReminder: (id: string) => void;
}

const PatientDashboard: React.FC<PatientDashboardProps> = ({ user, reminders, tips, onNavigate, onToggleReminder }) => {
  const pendingReminders = reminders.filter(r => !r.taken);

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-6 text-white shadow-lg">
        <h2 className="text-2xl font-bold mb-2">Hello, {user.name}!</h2>
        <p className="opacity-90 text-sm">Welcome back to your health companion. How can I help you today?</p>
      </div>

      {/* Quick Action Large Buttons */}
      <div className="grid grid-cols-2 gap-4">
        <button 
          onClick={() => onNavigate('voice')}
          className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col items-center text-center hover:shadow-md transition-shadow active:scale-95"
        >
          <div className="bg-red-50 text-red-500 w-16 h-16 rounded-full flex items-center justify-center text-3xl mb-3">🎙️</div>
          <span className="font-bold text-slate-800">Ask AI</span>
          <span className="text-xs text-slate-500">Voice Assistant</span>
        </button>
        <button 
          onClick={() => onNavigate('reminders')}
          className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col items-center text-center hover:shadow-md transition-shadow active:scale-95"
        >
          <div className="bg-blue-50 text-blue-500 w-16 h-16 rounded-full flex items-center justify-center text-3xl mb-3">⏰</div>
          <span className="font-bold text-slate-800">Medicines</span>
          <span className="text-xs text-slate-500">{pendingReminders.length} pending today</span>
        </button>
      </div>

      {/* Daily Reminders Preview */}
      <section>
        <div className="flex justify-between items-center mb-3 px-1">
          <h3 className="font-bold text-slate-800 text-lg">Next Medication</h3>
          <button onClick={() => onNavigate('reminders')} className="text-blue-600 text-sm font-semibold">View All</button>
        </div>
        {pendingReminders.length > 0 ? (
          <div className="space-y-3">
            {pendingReminders.slice(0, 2).map(r => (
              <div key={r.id} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-indigo-100 text-indigo-600 p-2 rounded-lg">💊</div>
                  <div>
                    <h4 className="font-bold text-slate-800">{r.medication}</h4>
                    <p className="text-xs text-slate-500">{r.time} • {r.frequency}</p>
                  </div>
                </div>
                <button 
                  onClick={() => onToggleReminder(r.id)}
                  className="bg-green-500 text-white px-4 py-2 rounded-xl text-sm font-bold active:scale-95"
                >
                  Mark Taken
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-slate-100 p-8 rounded-2xl text-center border-2 border-dashed border-slate-200">
            <p className="text-slate-500">All caught up! No pending medications.</p>
          </div>
        )}
      </section>

      {/* Daily Tip */}
      <section className="bg-yellow-50 p-6 rounded-3xl border border-yellow-100">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xl">💡</span>
          <h3 className="font-bold text-yellow-800">Health Tip of the Day</h3>
        </div>
        <p className="text-yellow-900 leading-relaxed">
          {tips[Math.floor(Math.random() * tips.length)].content}
        </p>
      </section>
    </div>
  );
};

export default PatientDashboard;
