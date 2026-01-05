
import React, { useState } from 'react';
import { MedicationReminder } from '../types';

interface RemindersProps {
  reminders: MedicationReminder[];
  onAdd: (name: string, time: string, freq: string) => void;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

const Reminders: React.FC<RemindersProps> = ({ reminders, onAdd, onToggle, onDelete }) => {
  const [showAdd, setShowAdd] = useState(false);
  const [medName, setMedName] = useState('');
  const [medTime, setMedTime] = useState('08:00');
  const [medFreq, setMedFreq] = useState('Once daily');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!medName) return;
    onAdd(medName, medTime, medFreq);
    setMedName('');
    setShowAdd(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">Reminders</h2>
        <button 
          onClick={() => setShowAdd(!showAdd)}
          className="bg-blue-600 text-white p-2 px-4 rounded-xl text-sm font-bold shadow-md active:scale-95"
        >
          {showAdd ? 'Close' : '+ Add New'}
        </button>
      </div>

      {showAdd && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 space-y-4">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Medicine Name</label>
            <input 
              type="text" 
              value={medName}
              onChange={(e) => setMedName(e.target.value)}
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="e.g. Paracetamol"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Time</label>
              <input 
                type="time" 
                value={medTime}
                onChange={(e) => setMedTime(e.target.value)}
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Frequency</label>
              <select 
                value={medFreq}
                onChange={(e) => setMedFreq(e.target.value)}
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none"
              >
                <option>Once daily</option>
                <option>Twice daily</option>
                <option>Three times daily</option>
                <option>Every other day</option>
              </select>
            </div>
          </div>
          <button type="submit" className="w-full bg-blue-600 text-white p-4 rounded-2xl font-bold shadow-lg hover:bg-blue-700 transition-colors">
            Save Reminder
          </button>
        </form>
      )}

      <div className="space-y-4">
        {reminders.length === 0 ? (
          <div className="text-center py-12 text-slate-400">
            <div className="text-5xl mb-4">💊</div>
            <p>No medication reminders yet.</p>
          </div>
        ) : (
          reminders.sort((a,b) => a.time.localeCompare(b.time)).map(r => (
            <div key={r.id} className={`bg-white p-5 rounded-2xl border transition-all ${r.taken ? 'border-green-100 bg-green-50/30' : 'border-slate-100 shadow-sm'}`}>
              <div className="flex justify-between items-start mb-3">
                <div className="flex gap-3">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl ${r.taken ? 'bg-green-100 text-green-600' : 'bg-blue-50 text-blue-600'}`}>
                    {r.taken ? '✅' : '💊'}
                  </div>
                  <div>
                    <h3 className={`font-bold text-lg ${r.taken ? 'line-through text-slate-400' : 'text-slate-800'}`}>
                      {r.medication}
                    </h3>
                    <p className="text-sm text-slate-500">{r.time} • {r.frequency}</p>
                  </div>
                </div>
                <button onClick={() => onDelete(r.id)} className="text-slate-300 hover:text-red-500 p-1">
                  ✕
                </button>
              </div>
              <button 
                onClick={() => onToggle(r.id)}
                className={`w-full py-3 rounded-xl font-bold text-sm transition-all active:scale-[0.98] ${
                  r.taken 
                    ? 'bg-slate-200 text-slate-600' 
                    : 'bg-green-500 text-white shadow-md shadow-green-100'
                }`}
              >
                {r.taken ? 'Mark as Not Taken' : 'Mark as Taken'}
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Reminders;
