import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Search, 
  Filter, 
  Plus, 
  ArrowRight, 
  GitMerge, 
  Compass, 
  Clock, 
  ShieldCheck, 
  Trash2, 
  Edit3, 
  X, 
  Check 
} from 'lucide-react';
import { fetchComplaints, createComplaint, updateComplaint, fetchComplaintById } from '../services/api';

const CATEGORIES = [
  'ALL',
  'UPI Phishing / Impersonation',
  'Part-Time Job / Task Scam',
  'Fake Investment / Stock Advisory',
  'Electricity Bill / KYC Suspension',
  'Loan App Extortion / Quick Credit',
  'SIM Swap / OTP Interception',
  'Card Skimming & Unauthorized Debit',
  'Crypto Arbitrage Scam'
];

const STATUSES = ['ALL', 'Open', 'Under Investigation', 'Escalated', 'Actioned - Location Flagged'];

export default function ComplaintsPage({ onNavigate, onSelectCase }) {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('ALL');
  const [status, setStatus] = useState('ALL');
  
  // Selected detail modal
  const [selectedCase, setSelectedCase] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  // Create Modal
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newAmount, setNewAmount] = useState('85000');
  const [newCategory, setNewCategory] = useState('UPI Phishing / Impersonation');
  const [newVictim, setNewVictim] = useState('ACC-VICTIM-001');
  const [newSuspicious, setNewSuspicious] = useState('ACC-MULE-001');
  const [newNarrative, setNewNarrative] = useState('');

  function loadData() {
    setLoading(true);
    fetchComplaints({ search, category, status, limit: 100 })
      .then(res => {
        setComplaints(res.complaints || []);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }

  useEffect(() => {
    loadData();
  }, [category, status]);

  function handleSearchSubmit(e) {
    e.preventDefault();
    loadData();
  }

  async function handleRowClick(cid) {
    setDetailLoading(true);
    try {
      const data = await fetchComplaintById(cid);
      setSelectedCase(data);
    } catch (e) {
      console.error(e);
    } finally {
      setDetailLoading(false);
    }
  }

  async function handleCreateComplaint(e) {
    e.preventDefault();
    try {
      const created = await createComplaint({
        amount: Number(newAmount),
        category: newCategory,
        victim_account: newVictim,
        suspicious_account: newSuspicious,
        narrative: newNarrative || `Field intake cyber complaint logged: ₹${newAmount} transferred to ${newSuspicious}.`
      });
      setShowCreateModal(false);
      loadData();
      setSelectedCase(created);
    } catch (err) {
      alert('Failed to create complaint: ' + err.message);
    }
  }

  async function handleStatusChange(cid, newStat) {
    try {
      const updated = await updateComplaint(cid, { status: newStat });
      setComplaints(prev => prev.map(c => c.complaint_id === cid ? { ...c, status: newStat } : c));
      if (selectedCase && selectedCase.complaint_id === cid) {
        setSelectedCase(prev => ({ ...prev, status: newStat }));
      }
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="p-6 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-navy-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold font-display text-white tracking-wide">
              CYBERCRIME COMPLAINTS REPOSITORY
            </h1>
            <span className="px-2 py-0.5 rounded bg-cyan-950 border border-cyan-500/40 text-cyan-300 font-mono text-[10px]">
              CRUD & SEARCH
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Standardized complaint dossiers (128 cases: 8 clean demo cases for walkthrough + 120 synthetic cases).
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-1.5 px-3 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-lg text-xs font-semibold shadow-lg shadow-cyan-600/20 transition self-start"
        >
          <Plus className="w-4 h-4" />
          <span>Intake New Complaint</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-panel p-4 rounded-xl border-navy-800 flex flex-col md:flex-row items-center justify-between gap-3">
        <form onSubmit={handleSearchSubmit} className="flex-1 w-full flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by Complaint ID (e.g. CMP-1001), Account ID, Category, or Location..."
              className="w-full bg-navy-950 border border-navy-700 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-400 font-mono"
            />
          </div>
          <button
            type="submit"
            className="px-3 py-2 bg-navy-800 hover:bg-navy-700 text-cyan-300 border border-navy-700 rounded-lg text-xs font-mono transition"
          >
            Filter
          </button>
        </form>

        <div className="flex items-center gap-2 w-full md:w-auto">
          {/* Category Filter */}
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="bg-navy-950 border border-navy-700 rounded-lg px-2.5 py-2 text-xs text-slate-300 focus:outline-none focus:border-cyan-400 font-mono"
          >
            {CATEGORIES.map(c => (
              <option key={c} value={c}>{c === 'ALL' ? 'All Categories' : c}</option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="bg-navy-950 border border-navy-700 rounded-lg px-2.5 py-2 text-xs text-slate-300 focus:outline-none focus:border-cyan-400 font-mono"
          >
            {STATUSES.map(s => (
              <option key={s} value={s}>{s === 'ALL' ? 'All Statuses' : s}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Complaints Table */}
      <div className="glass-panel rounded-xl border-navy-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-navy-950/80 border-b border-navy-800 text-[10px] uppercase font-mono text-slate-400">
              <tr>
                <th className="py-3 px-4">Case ID</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Defrauded Amount</th>
                <th className="py-3 px-4">Fraud Category</th>
                <th className="py-3 px-4">Victim Node</th>
                <th className="py-3 px-4">Entry Mule Account</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy-800/60 font-mono">
              {loading ? (
                <tr>
                  <td colSpan="8" className="py-12 text-center text-slate-400 font-mono">
                    Loading complaints dataset...
                  </td>
                </tr>
              ) : complaints.length === 0 ? (
                <tr>
                  <td colSpan="8" className="py-12 text-center text-slate-400 font-mono">
                    No matching complaints found. Try clearing search filters.
                  </td>
                </tr>
              ) : (
                complaints.map(c => (
                  <tr 
                    key={c.complaint_id}
                    onClick={() => handleRowClick(c.complaint_id)}
                    className="hover:bg-navy-850/70 transition cursor-pointer group"
                  >
                    <td className="py-3 px-4 font-bold text-cyan-300 group-hover:text-cyan-200">
                      {c.complaint_id}
                      {c.complaint_id.startsWith('CMP-100') && parseInt(c.complaint_id.slice(4)) <= 8 && (
                        <span className="ml-1.5 px-1 py-0.2 rounded bg-amber-950 text-amber-300 text-[9px] border border-amber-800">
                          CLEAN DEMO
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-slate-400">{c.date}</td>
                    <td className="py-3 px-4 text-emerald-400 font-semibold">₹{c.amount.toLocaleString()}</td>
                    <td className="py-3 px-4 text-slate-300 max-w-[200px] truncate">{c.category}</td>
                    <td className="py-3 px-4 text-slate-400">{c.victim_account}</td>
                    <td className="py-3 px-4 text-rose-300 font-semibold">{c.suspicious_account}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                        c.status === 'Actioned - Location Flagged' 
                          ? 'bg-purple-950 text-purple-300 border border-purple-800'
                          : c.status === 'Escalated'
                          ? 'bg-rose-950 text-rose-300 border border-rose-800'
                          : c.status === 'Under Investigation'
                          ? 'bg-amber-950 text-amber-300 border border-amber-800'
                          : 'bg-navy-800 text-slate-300 border border-navy-700'
                      }`}>
                        {c.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectCase(c.complaint_id);
                          onNavigate('linkage');
                        }}
                        title="Check Cross-Case Ring"
                        className="p-1 rounded hover:bg-navy-700 text-cyan-400 mr-1"
                      >
                        <GitMerge className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectCase(c.complaint_id);
                          onNavigate('prediction');
                        }}
                        title="Run Withdrawal Location Prediction"
                        className="p-1 rounded hover:bg-navy-700 text-emerald-400"
                      >
                        <Compass className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Case Detail Modal */}
      {selectedCase && (
        <div className="fixed inset-0 bg-navy-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-navy-900 border border-navy-700 rounded-2xl max-w-2xl w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedCase(null)}
              className="absolute top-4 right-4 p-1.5 rounded-lg bg-navy-800 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2 mb-4">
              <span className="text-xl font-bold font-display text-white">{selectedCase.complaint_id}</span>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-cyan-950 border border-cyan-800 text-cyan-300 font-semibold">
                {selectedCase.category}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3 rounded-xl bg-navy-950 border border-navy-800 mb-4 font-mono text-xs">
              <div>
                <span className="text-slate-500 text-[10px] block">AMOUNT DEFRAUDED</span>
                <span className="text-emerald-400 font-bold text-sm">₹{selectedCase.amount.toLocaleString()}</span>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] block">INCIDENT DATE</span>
                <span className="text-slate-200">{selectedCase.date}</span>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] block">VICTIM NODE</span>
                <span className="text-slate-300">{selectedCase.victim_account}</span>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] block">ENTRY MULE</span>
                <span className="text-rose-400 font-bold">{selectedCase.suspicious_account}</span>
              </div>
            </div>

            <div className="space-y-3 mb-6">
              <div>
                <h4 className="text-xs font-semibold text-slate-300 font-mono mb-1">INCIDENT NARRATIVE (FIR SUMMARY)</h4>
                <p className="text-xs text-slate-300 leading-relaxed bg-navy-950/60 p-3 rounded-lg border border-navy-800/80">
                  {selectedCase.narrative || 'Detailed cybercrime intake statement recorded.'}
                </p>
              </div>

              {selectedCase.transactions && selectedCase.transactions.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold text-slate-300 font-mono mb-2">TRACED MULTI-HOP TELEMETRY</h4>
                  <div className="space-y-1.5 font-mono text-[11px]">
                    {selectedCase.transactions.map((t, i) => (
                      <div key={t.transaction_id} className="p-2 rounded bg-navy-950 border border-navy-800 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-cyan-400 font-bold">Hop {i+1}:</span>
                          <span className="text-slate-300">{t.source_account}</span>
                          <ArrowRight className="w-3 h-3 text-slate-500" />
                          <span className="text-rose-300 font-semibold">{t.destination_account}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-slate-400 text-[10px]">{t.type}</span>
                          <span className="text-emerald-400 font-bold">₹{t.amount.toLocaleString()}</span>
                          <span className="text-rose-400 text-[10px]">{t.risk_score}% Risk</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <label className="text-xs font-semibold text-slate-300 font-mono block mb-1">UPDATE INVESTIGATION STATUS</label>
                <div className="flex flex-wrap gap-2">
                  {STATUSES.filter(s => s !== 'ALL').map(stat => (
                    <button
                      key={stat}
                      onClick={() => handleStatusChange(selectedCase.complaint_id, stat)}
                      className={`px-2.5 py-1 rounded text-xs font-mono transition ${
                        selectedCase.status === stat
                          ? 'bg-cyan-600 text-white font-bold'
                          : 'bg-navy-950 hover:bg-navy-800 text-slate-300 border border-navy-700'
                      }`}
                    >
                      {stat}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Bottom Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-navy-800">
              <span className="text-[11px] text-slate-400 font-mono">
                SIH Problem Statement Proactive Analytics
              </span>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={() => {
                    onSelectCase(selectedCase.complaint_id);
                    setSelectedCase(null);
                    onNavigate('linkage');
                  }}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-2 bg-rose-950 hover:bg-rose-900 border border-rose-700/60 text-rose-300 rounded-lg text-xs font-semibold font-mono transition"
                >
                  <GitMerge className="w-3.5 h-3.5" />
                  <span>Scan Cross-Case Ring</span>
                </button>

                <button
                  onClick={() => {
                    onSelectCase(selectedCase.complaint_id);
                    setSelectedCase(null);
                    onNavigate('prediction');
                  }}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-lg text-xs font-semibold font-mono shadow-lg transition"
                >
                  <Compass className="w-3.5 h-3.5" />
                  <span>Forecast Location</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Create Complaint Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-navy-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-navy-900 border border-navy-700 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setShowCreateModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg bg-navy-800 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="text-base font-bold font-display text-white mb-1">
              LOG NEW CYBERCRIME COMPLAINT (DEMO INTAKE)
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Simulates FIR receipt from citizen or 1930 Cyber Fraud Helpline.
            </p>

            <form onSubmit={handleCreateComplaint} className="space-y-3 font-mono text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Defrauded Amount (INR)</label>
                <input
                  type="number"
                  value={newAmount}
                  onChange={(e) => setNewAmount(e.target.value)}
                  className="w-full bg-navy-950 border border-navy-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-400 font-semibold text-emerald-400"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Fraud Category</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full bg-navy-950 border border-navy-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-400"
                >
                  {CATEGORIES.filter(c => c !== 'ALL').map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Victim Account</label>
                  <input
                    type="text"
                    value={newVictim}
                    onChange={(e) => setNewVictim(e.target.value)}
                    className="w-full bg-navy-950 border border-navy-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-400"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Reported Mule Account</label>
                  <input
                    type="text"
                    value={newSuspicious}
                    onChange={(e) => setNewSuspicious(e.target.value)}
                    className="w-full bg-navy-950 border border-navy-700 rounded-lg px-3 py-2 text-rose-300 font-semibold focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Incident Summary / Modus Operandi</label>
                <textarea
                  rows="3"
                  value={newNarrative}
                  onChange={(e) => setNewNarrative(e.target.value)}
                  placeholder="e.g. Victim enticed by counterfeit Telegram task group. Funds funneled into Axis mule account..."
                  className="w-full bg-navy-950 border border-navy-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-400 text-xs"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 bg-navy-800 text-slate-300 rounded-lg text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-semibold shadow-lg shadow-cyan-600/20"
                >
                  Submit & Log to Ledger
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
