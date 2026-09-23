import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  ShieldAlert, 
  AlertTriangle, 
  MapPin, 
  CheckSquare, 
  Printer, 
  ExternalLink, 
  Clock, 
  ArrowRight, 
  CheckCircle2, 
  FileText 
} from 'lucide-react';
import { fetchIntelligence } from '../services/api';

export default function ActionableIntelligencePage({ onSelectCase, onNavigate }) {
  const [dossiers, setDossiers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDossier, setSelectedDossier] = useState(null);

  useEffect(() => {
    fetchIntelligence()
      .then(res => {
        setDossiers(res.dossiers || []);
        if (res.dossiers && res.dossiers.length > 0) {
          setSelectedDossier(res.dossiers[0]);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  function handlePrintBrief() {
    window.print();
  }

  return (
    <div className="p-6 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-navy-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold font-display text-white tracking-wide">
              ACTIONABLE LAW ENFORCEMENT INTELLIGENCE BRIEFS
            </h1>
            <span className="px-2 py-0.5 rounded bg-cyan-950 border border-cyan-500/40 text-cyan-300 font-mono text-[10px] font-bold">
              NEUTRAL LEGAL FRAMING
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Synthesized operational dossiers formulated to support field patrol interception, bank lien notices, and evidence preservation.
          </p>
        </div>

        <button
          onClick={handlePrintBrief}
          className="flex items-center gap-1.5 px-3 py-2 bg-navy-800 hover:bg-navy-700 text-slate-200 border border-navy-700 rounded-lg text-xs font-mono font-semibold transition self-start md:self-auto"
        >
          <Printer className="w-4 h-4 text-cyan-400" />
          <span>Print / Export Dispatch Brief</span>
        </button>
      </div>

      {/* Persistent Legal Caution Notice */}
      <div className="p-3.5 rounded-xl bg-navy-900 border border-navy-700 text-xs text-slate-300 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <strong className="text-slate-100 font-mono">Standard Legal Framing & Ethical Mandate:</strong>
          <p className="mt-0.5 text-slate-300">
            "Indicative behavioral pattern detected via multi-hop graph analysis. The predictions provided by FORTIVEXA serve as investigative leads and require physical verification by a designated investigating officer. This system does not auto-accuse or establish criminal culpability."
          </p>
        </div>
      </div>

      {/* Main Content Grid: Dossier Selector + Detailed Brief */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Col: Dossiers List */}
        <div className="space-y-3">
          <span className="text-[10px] font-mono uppercase text-slate-400 block px-1">
            PENDING FIELD INTERCEPTION DOSSIERS ({dossiers.length})
          </span>

          <div className="space-y-2.5 max-h-[600px] overflow-y-auto pr-1">
            {dossiers.map((dos) => {
              const isSelected = selectedDossier?.dossier_id === dos.dossier_id;
              const isP1 = dos.priority.includes('P1');

              return (
                <div
                  key={dos.dossier_id}
                  onClick={() => setSelectedDossier(dos)}
                  className={`p-3.5 rounded-xl border transition cursor-pointer ${
                    isSelected
                      ? 'bg-navy-850 border-cyan-500 shadow-lg shadow-cyan-950/40'
                      : 'bg-navy-900/80 border-navy-800 hover:border-navy-700'
                  }`}
                >
                  <div className="flex items-center justify-between font-mono text-xs mb-1.5">
                    <span className="font-bold text-cyan-300">{dos.case_id}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      isP1 
                        ? 'bg-rose-950 text-rose-300 border border-rose-800' 
                        : 'bg-amber-950 text-amber-300 border border-amber-800'
                    }`}>
                      {dos.priority.split(' - ')[0]}
                    </span>
                  </div>

                  <p className="text-xs text-slate-200 font-medium truncate mb-1">
                    {dos.fraud_pattern}
                  </p>

                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                    <span className="text-emerald-400 font-semibold">₹{dos.amount_inr.toLocaleString()}</span>
                    <span>{dos.date_reported}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 2 Cols: Selected Detailed Dossier Document */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-2xl border-navy-800 space-y-6">
          {selectedDossier ? (
            <>
              {/* Document Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-navy-800 gap-3">
                <div>
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800">
                    OFFICIAL DISPATCH BRIEF • {selectedDossier.dossier_id}
                  </span>
                  <h2 className="text-lg font-bold font-display text-white mt-1.5">
                    FIELD INTERVENTION ADVISORY: {selectedDossier.case_id}
                  </h2>
                </div>

                <div className="text-right font-mono text-xs">
                  <span className={`px-2.5 py-1 rounded text-xs font-bold block ${
                    selectedDossier.priority.includes('P1')
                      ? 'bg-rose-950 text-rose-300 border border-rose-800'
                      : 'bg-amber-950 text-amber-300 border border-amber-800'
                  }`}>
                    {selectedDossier.priority}
                  </span>
                  <span className="text-[10px] text-slate-400 mt-1 block">Threat: {selectedDossier.risk_level}</span>
                </div>
              </div>

              {/* Case Metadata Bar */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 rounded-xl bg-navy-950 border border-navy-800 font-mono text-xs">
                <div>
                  <span className="text-slate-500 text-[10px] block">INCIDENT DATE</span>
                  <span className="text-slate-200">{selectedDossier.date_reported}</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] block">DEFRAUDED VALUE</span>
                  <span className="text-emerald-400 font-bold">₹{selectedDossier.amount_inr.toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] block">MODUS OPERANDI</span>
                  <span className="text-slate-200 truncate">{selectedDossier.fraud_pattern}</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] block">TARGET KIOSK</span>
                  <span className="text-purple-300 font-semibold truncate">{selectedDossier.predicted_target_location}</span>
                </div>
              </div>

              {/* Involved Accounts Routing */}
              <div>
                <h4 className="text-xs font-mono font-bold text-slate-300 uppercase mb-2">
                  ASSOCIATED TELEMETRIC ACCOUNTS
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-xs">
                  {selectedDossier.flagged_accounts?.map((acc, i) => (
                    <div key={i} className="p-3 rounded-lg bg-navy-950/80 border border-navy-800 flex justify-between">
                      <span className="text-slate-400">{acc.role}:</span>
                      <span className="text-cyan-300 font-bold">{acc.account}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Investigative Reasoning (Neutral language) */}
              <div className="space-y-2">
                <h4 className="text-xs font-mono font-bold text-slate-300 uppercase">
                  INVESTIGATIVE RATIONALE & CORRELATION
                </h4>
                <p className="text-xs text-slate-200 leading-relaxed bg-navy-950/60 p-4 rounded-xl border border-navy-800 font-sans">
                  {selectedDossier.investigative_reasoning}
                </p>
              </div>

              {/* Recommended Field Checklist */}
              <div className="space-y-2.5">
                <h4 className="text-xs font-mono font-bold text-slate-300 uppercase">
                  RECOMMENDED LAW ENFORCEMENT ACTION PROTOCOLS
                </h4>
                <div className="space-y-2 font-mono text-xs">
                  {selectedDossier.action_checklist?.map((action, idx) => (
                    <div key={idx} className="flex items-center gap-2.5 p-2.5 rounded-lg bg-navy-950/70 border border-navy-800">
                      <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                      <span className="text-slate-200">{action}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="pt-4 border-t border-navy-800 flex flex-wrap items-center justify-between gap-3">
                <span className="text-[11px] font-mono text-slate-400">
                  {selectedDossier.legal_framing}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      onSelectCase(selectedDossier.case_id);
                      onNavigate('linkage');
                    }}
                    className="px-3 py-1.5 bg-navy-800 hover:bg-navy-700 text-cyan-300 rounded font-mono text-xs border border-navy-700 transition"
                  >
                    View Cross-Case Ring
                  </button>
                  <button
                    onClick={() => {
                      onSelectCase(selectedDossier.case_id);
                      onNavigate('prediction');
                    }}
                    className="px-3 py-1.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 text-white rounded font-mono text-xs font-semibold shadow transition"
                  >
                    Check Location Model
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="py-20 text-center text-slate-500 font-mono text-xs">
              Select an intelligence brief from the left queue to view full tactical dispatch protocols.
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
