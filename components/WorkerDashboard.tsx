
import React, { useState } from 'react';
import { ClinicalProtocol } from '../types';
import { CLINICAL_PROTOCOLS } from '../constants';

const WorkerDashboard: React.FC = () => {
  const [selectedProtocol, setSelectedProtocol] = useState<ClinicalProtocol | null>(null);

  return (
    <div className="space-y-6">
      <div className="bg-slate-800 rounded-3xl p-6 text-white shadow-lg">
        <h2 className="text-2xl font-bold mb-2">Clinical Support</h2>
        <p className="opacity-90 text-sm">Access step-by-step guidance for rural healthcare procedures.</p>
      </div>

      <section>
        <h3 className="font-bold text-slate-800 text-lg mb-4 px-1">Common Protocols</h3>
        <div className="grid grid-cols-1 gap-4">
          {CLINICAL_PROTOCOLS.map(protocol => (
            <button
              key={protocol.id}
              onClick={() => setSelectedProtocol(protocol)}
              className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 text-left hover:border-blue-300 transition-colors group"
            >
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                  {protocol.category}
                </span>
                <span className="text-slate-300 group-hover:text-blue-500">→</span>
              </div>
              <h4 className="font-bold text-slate-800 text-lg mb-1">{protocol.title}</h4>
              <p className="text-sm text-slate-500 line-clamp-1">
                {protocol.symptoms.join(', ')}
              </p>
            </button>
          ))}
        </div>
      </section>

      {/* Protocol Modal */}
      {selectedProtocol && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-end sm:items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-t-[32px] sm:rounded-[32px] p-6 shadow-2xl overflow-y-auto max-h-[85vh]">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-slate-900">{selectedProtocol.title}</h3>
              <button onClick={() => setSelectedProtocol(null)} className="text-slate-400 text-2xl">✕</button>
            </div>

            <div className="space-y-6">
              <div>
                <h4 className="text-xs font-bold uppercase text-slate-400 mb-2 tracking-widest">Key Symptoms</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedProtocol.symptoms.map((s, i) => (
                    <span key={i} className="bg-red-50 text-red-700 px-3 py-1 rounded-full text-sm font-medium border border-red-100">
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase text-slate-400 mb-3 tracking-widest">Guidance Steps</h4>
                <div className="space-y-4">
                  {selectedProtocol.steps.map((step, i) => (
                    <div key={i} className="flex gap-4">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
                        {i + 1}
                      </div>
                      <p className="text-slate-700 leading-relaxed pt-0.5">{step}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100 flex gap-3">
                <span className="text-xl">ℹ️</span>
                <p className="text-sm text-blue-800">
                  Always consult with a medical officer for cases that do not follow the standard protocol or show worsening signs.
                </p>
              </div>

              <button 
                onClick={() => setSelectedProtocol(null)}
                className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold"
              >
                Close Guidance
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkerDashboard;
