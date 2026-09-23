import React, { useState, useEffect } from 'react';
import { 
  CreditCard, 
  Search, 
  Filter, 
  ArrowUpDown, 
  ShieldAlert, 
  AlertTriangle, 
  ArrowRight, 
  Layers 
} from 'lucide-react';
import { fetchTransactions } from '../services/api';

const RISK_BADGES = {
  CRITICAL: { bg: 'bg-rose-950/80', border: 'border-rose-700/60', text: 'text-rose-300' },
  HIGH: { bg: 'bg-orange-950/80', border: 'border-orange-700/60', text: 'text-orange-300' },
  MEDIUM: { bg: 'bg-amber-950/80', border: 'border-amber-700/60', text: 'text-amber-300' },
  LOW: { bg: 'bg-emerald-950/80', border: 'border-emerald-700/60', text: 'text-emerald-300' },
};

export default function TransactionsPage({ onSelectCase, onNavigate }) {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [riskLevel, setRiskLevel] = useState('ALL');
  const [type, setType] = useState('ALL');
  const [sortBy, setSortBy] = useState('date_desc');
  const [selectedTxn, setSelectedTxn] = useState(null);

  function loadData() {
    setLoading(true);
    fetchTransactions({ search, risk_level: riskLevel, type, sort_by: sortBy })
      .then(res => {
        setTransactions(res.transactions || []);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }

  useEffect(() => {
    loadData();
  }, [riskLevel, type, sortBy]);

  function handleSearch(e) {
    e.preventDefault();
    loadData();
  }

  function getRiskLevel(score) {
    if (score >= 90) return 'CRITICAL';
    if (score >= 75) return 'HIGH';
    if (score >= 50) return 'MEDIUM';
    return 'LOW';
  }

  return (
    <div className="p-6 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-navy-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold font-display text-white tracking-wide">
              MULTI-HOP TRANSACTION TELEMETRY LEDGER
            </h1>
            <span className="px-2 py-0.5 rounded bg-cyan-950 border border-cyan-500/40 text-cyan-300 font-mono text-[10px]">
              RISK CLASSIFICATION
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Audited financial trace (384 transactions) depicting multi-hop funds movement from victim accounts into mule layers and cashout points.
          </p>
        </div>
      </div>

      {/* Filter and Sort Toolbar */}
      <div className="glass-panel p-4 rounded-xl border-navy-800 flex flex-col md:flex-row items-center justify-between gap-3">
        <form onSubmit={handleSearch} className="flex-1 w-full flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by Txn ID, Case ID, Source, or Destination account..."
              className="w-full bg-navy-950 border border-navy-700 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-400 font-mono"
            />
          </div>
          <button
            type="submit"
            className="px-3 py-2 bg-navy-800 hover:bg-navy-700 text-cyan-300 border border-navy-700 rounded-lg text-xs font-mono transition"
          >
            Search
          </button>
        </form>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto font-mono text-xs">
          {/* Risk Level */}
          <select
            value={riskLevel}
            onChange={(e) => setRiskLevel(e.target.value)}
            className="bg-navy-950 border border-navy-700 rounded-lg px-2.5 py-2 text-slate-300 focus:outline-none focus:border-cyan-400"
          >
            <option value="ALL">All Risk Levels</option>
            <option value="CRITICAL">Critical (90%+)</option>
            <option value="HIGH">High (75-89%)</option>
            <option value="MEDIUM">Medium (50-74%)</option>
            <option value="LOW">Low (&lt;50%)</option>
          </select>

          {/* Type */}
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="bg-navy-950 border border-navy-700 rounded-lg px-2.5 py-2 text-slate-300 focus:outline-none focus:border-cyan-400"
          >
            <option value="ALL">All Channels</option>
            <option value="UPI">UPI</option>
            <option value="IMPS">IMPS</option>
            <option value="NEFT">NEFT</option>
            <option value="ATM_WITHDRAWAL">ATM Withdrawal</option>
          </select>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-navy-950 border border-navy-700 rounded-lg px-2.5 py-2 text-slate-300 focus:outline-none focus:border-cyan-400"
          >
            <option value="date_desc">Latest First</option>
            <option value="amount_desc">Amount (Highest)</option>
            <option value="amount_asc">Amount (Lowest)</option>
            <option value="risk_desc">Risk Score (Highest)</option>
          </select>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="glass-panel rounded-xl border-navy-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-navy-950/80 border-b border-navy-800 text-[10px] uppercase font-mono text-slate-400">
              <tr>
                <th className="py-3 px-4">Txn ID</th>
                <th className="py-3 px-4">Case Ref</th>
                <th className="py-3 px-4">Source Account</th>
                <th className="py-3 px-4"></th>
                <th className="py-3 px-4">Destination Account</th>
                <th className="py-3 px-4">Amount (INR)</th>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Channel</th>
                <th className="py-3 px-4 text-center">Threat Risk</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy-800/60 font-mono">
              {loading ? (
                <tr>
                  <td colSpan="9" className="py-12 text-center text-slate-400">
                    Loading transactions ledger...
                  </td>
                </tr>
              ) : transactions.length === 0 ? (
                <tr>
                  <td colSpan="9" className="py-12 text-center text-slate-400">
                    No transactions match current filters.
                  </td>
                </tr>
              ) : (
                transactions.map((t) => {
                  const rLevel = getRiskLevel(t.risk_score);
                  const badgeStyle = RISK_BADGES[rLevel];

                  return (
                    <tr
                      key={t.transaction_id}
                      onClick={() => setSelectedTxn(t)}
                      className="hover:bg-navy-850/70 transition cursor-pointer"
                    >
                      <td className="py-3 px-4 font-bold text-cyan-300">{t.transaction_id}</td>
                      <td className="py-3 px-4">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (t.case_id) {
                              onSelectCase(t.case_id);
                              onNavigate('complaints');
                            }
                          }}
                          className="text-slate-300 hover:text-cyan-400 underline decoration-slate-600 underline-offset-2"
                        >
                          {t.case_id || 'N/A'}
                        </button>
                      </td>
                      <td className="py-3 px-4 text-slate-400">
                        {t.source_account}
                      </td>
                      <td className="py-3 px-1 text-slate-600">
                        <ArrowRight className="w-3.5 h-3.5" />
                      </td>
                      <td className="py-3 px-4 text-rose-300 font-semibold">
                        {t.destination_account}
                      </td>
                      <td className="py-3 px-4 text-emerald-400 font-semibold">
                        ₹{t.amount.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-slate-400 text-[11px]">
                        {t.timestamp}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] ${
                          t.type === 'ATM_WITHDRAWAL'
                            ? 'bg-purple-950 text-purple-300 border border-purple-800'
                            : 'bg-navy-800 text-slate-300 border border-navy-700'
                        }`}>
                          {t.type}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${badgeStyle.bg} ${badgeStyle.border} ${badgeStyle.text}`}>
                          {rLevel} ({t.risk_score}%)
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Transaction Details Modal */}
      {selectedTxn && (
        <div className="fixed inset-0 bg-navy-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-navy-900 border border-navy-700 rounded-2xl max-w-md w-full p-6 shadow-2xl relative font-mono text-xs">
            <button
              onClick={() => setSelectedTxn(null)}
              className="absolute top-4 right-4 p-1.5 rounded-lg bg-navy-800 text-slate-400 hover:text-white"
            >
              ✕
            </button>

            <h3 className="text-sm font-bold text-white mb-1">TRANSACTION AUDIT TRACE</h3>
            <p className="text-[11px] text-cyan-400 mb-4">{selectedTxn.transaction_id}</p>

            <div className="space-y-2.5 p-3 rounded-xl bg-navy-950 border border-navy-800 mb-4">
              <div className="flex justify-between">
                <span className="text-slate-400">Associated FIR:</span>
                <span className="text-cyan-300 font-bold">{selectedTxn.case_id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Transfer Amount:</span>
                <span className="text-emerald-400 font-bold text-sm">₹{selectedTxn.amount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Payment Gateway:</span>
                <span className="text-slate-200">{selectedTxn.type}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Timestamp:</span>
                <span className="text-slate-300">{selectedTxn.timestamp}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Terminal Location:</span>
                <span className="text-slate-300">{selectedTxn.location}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Calculated Threat Index:</span>
                <span className="text-rose-400 font-bold">{selectedTxn.risk_score}%</span>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-navy-800/40 border border-navy-700 text-slate-300 text-[11px] leading-relaxed mb-4">
              <strong>Routing Hop Classification:</strong> Originates at <code className="text-slate-200">{selectedTxn.source_account}</code> and settles into <code className="text-rose-300">{selectedTxn.destination_account}</code>.
            </div>

            <button
              onClick={() => {
                if (selectedTxn.case_id) {
                  onSelectCase(selectedTxn.case_id);
                  setSelectedTxn(null);
                  onNavigate('linkage');
                }
              }}
              className="w-full py-2 bg-gradient-to-r from-rose-600 to-navy-800 hover:from-rose-500 text-white rounded-lg text-xs font-semibold shadow-lg transition"
            >
              Investigate Associated Fraud Ring
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
