
import React from 'react';
import { User, Language } from '../types';
import { SUPPORTED_LANGUAGES } from '../constants';

interface SettingsProps {
  user: User;
  onUpdateUser: (updates: Partial<User>) => void;
}

const Settings: React.FC<SettingsProps> = ({ user, onUpdateUser }) => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-800">Settings</h2>

      <section className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 space-y-6">
        <div>
          <h3 className="font-bold text-slate-700 mb-4 flex items-center gap-2">
            <span>🌐</span> Select Language
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {SUPPORTED_LANGUAGES.map((lang: Language) => (
              <button
                key={lang.code}
                onClick={() => onUpdateUser({ language: lang.name })}
                className={`p-4 rounded-2xl text-left border-2 transition-all ${
                  user.language === lang.name 
                    ? 'border-blue-600 bg-blue-50 text-blue-700' 
                    : 'border-slate-100 bg-slate-50 text-slate-600 hover:border-slate-200'
                }`}
              >
                <div className="font-bold">{lang.nativeName}</div>
                <div className="text-xs opacity-70">{lang.name}</div>
              </button>
            ))}
          </div>
        </div>

        <hr className="border-slate-100" />

        <div>
          <h3 className="font-bold text-slate-700 mb-4 flex items-center gap-2">
            <span>👤</span> Profile Info
          </h3>
          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-1">Display Name</label>
              <input 
                type="text" 
                value={user.name}
                onChange={(e) => onUpdateUser({ name: e.target.value })}
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none font-medium"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-1">App Role</label>
              <div className="p-4 bg-slate-100 rounded-2xl text-slate-600 font-medium">
                {user.role === 'PATIENT' ? 'Patient Assistant' : 'Healthcare Worker'}
              </div>
            </div>
          </div>
        </div>

        <hr className="border-slate-100" />

        <div>
          <h3 className="font-bold text-slate-700 mb-4 flex items-center gap-2">
            <span>♿</span> Accessibility
          </h3>
          <div className="space-y-3">
            <label className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl cursor-pointer">
              <span className="font-medium text-slate-700">Voice Navigation</span>
              <input type="checkbox" className="w-6 h-6 rounded-lg" defaultChecked />
            </label>
            <label className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl cursor-pointer">
              <span className="font-medium text-slate-700">High Contrast Mode</span>
              <input type="checkbox" className="w-6 h-6 rounded-lg" />
            </label>
          </div>
        </div>
      </section>

      <div className="text-center py-4">
        <p className="text-slate-400 text-xs">UHC Companion v1.0.0 (Offline Mode Enabled)</p>
      </div>
    </div>
  );
};

export default Settings;
