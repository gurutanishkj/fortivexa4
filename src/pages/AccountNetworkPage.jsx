import React, { useState, useEffect } from 'react';
import { 
  Network, 
  Search, 
  Filter, 
  ShieldAlert, 
  AlertTriangle, 
  ArrowRight, 
  Building2, 
  CheckCircle2, 
  Layers 
} from 'lucide-react';
import { fetchAccounts } from '../services/api';
import MuleGraphVisualizer from '../components/MuleGraphVisualizer';

export default function AccountNetworkPage({ onNavigate }) {
  const [data, setData] = useState({ accounts: [], network_graph: { nodes: [], edges: [] } });
  const [loading, setLoading] = useState(true);
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [search, setSearch] = useState('');
  const [selectedAccount, setSelectedAccount] = useState(null);

  useEffect(() => {
    fetchAccounts()
      .then(res => {
        setData(res);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const accounts = data.accounts || [];
  const graph = data.network_graph || { nodes: [], edges: [] };

  const filteredAccounts = accounts.filter(a => {
    const matchesRole = roleFilter === 'ALL' || a.role === roleFilter;
    const matchesSearch = !search || 
      a.account_id.toLowerCase().includes(search.toLowerCase()) ||
      a.bank.toLowerCase().includes(search.toLowerCase()) ||
      a.ifsc.toLowerCase().includes(search.toLowerCase());
    return matchesRole && matchesSearch;
  });

  return (
    <div className="p-6 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-navy-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold font-display text-white tracking-wide">
              ACCOUNT TOPOLOGY & MULE DETECTION ENGINE
            </h1>
            <span className="px-2 py-0.5 rounded bg-cyan-950 border border-cyan-500/40 text-cyan-300 font-mono text-[10px]">
              LAYER CLASSIFICATION
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Structural topology identifying entry mules (L1), intermediary layering hubs (L2), and cashout extraction proxies.
          </p>
        </div>
      </div>

      {/* Interactive Node/Edge Graph Canvas */}
      <div className="space-y-2">
        <MuleGraphVisualizer
          nodes={graph.nodes}
          edges={graph.edges}
          title="Interactive Cybercrime Mule Network Graph"
          subtitle="Topological flow from victim deposits into multi-hop mule layering and cash-out endpoints. Click any node to inspect telemetry."
        />
      </div>

      {/* Mule Detection Table */}
      <div className="glass-panel p-5 rounded-xl border-navy-800 space-y-4">
        
        {/* Table Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search account ID, bank, IFSC..."
              className="w-full bg-navy-950 border border-navy-700 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-400 font-mono"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto font-mono text-xs">
            <span className="text-slate-400 text-[11px]">Filter Role:</span>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="bg-navy-950 border border-navy-700 rounded-lg px-2.5 py-1.5 text-slate-300 focus:outline-none focus:border-cyan-400"
            >
              <option value="ALL">All Roles</option>
              <option value="victim">Victim Nodes</option>
              <option value="mule_l1">Mule Layer 1 (Entry)</option>
              <option value="mule_l2">Mule Layer 2 (Consolidation)</option>
              <option value="withdrawal">Cashout / ATM Proxies</option>
            </select>
          </div>
        </div>

        {/* Accounts Table */}
        <div className="overflow-x-auto rounded-lg border border-navy-800">
          <table className="w-full text-left text-xs">
            <thead className="bg-navy-950 text-[10px] uppercase font-mono text-slate-400">
              <tr>
                <th className="py-3 px-4">Account ID</th>
                <th className="py-3 px-4">Bank / Institution</th>
                <th className="py-3 px-4">IFSC Routing</th>
                <th className="py-3 px-4">Role Classification</th>
                <th className="py-3 px-4">Txn Traffic (In/Out)</th>
                <th className="py-3 px-4">Cumulative Volume</th>
                <th className="py-3 px-4">Threat Rating</th>
                <th className="py-3 px-4 text-right">Connections</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy-800/60 font-mono">
              {loading ? (
                <tr>
                  <td colSpan="8" className="py-10 text-center text-slate-400">
                    Loading accounts topology...
                  </td>
                </tr>
              ) : filteredAccounts.length === 0 ? (
                <tr>
                  <td colSpan="8" className="py-10 text-center text-slate-400">
                    No accounts matching selected role or search query.
                  </td>
                </tr>
              ) : (
                filteredAccounts.map(acc => {
                  const isMuleL2 = acc.role === 'mule_l2';
                  const isWithdrawal = acc.role === 'withdrawal';
                  const isMuleL1 = acc.role === 'mule_l1';

                  return (
                    <tr
                      key={acc.account_id}
                      onClick={() => setSelectedAccount(acc)}
                      className="hover:bg-navy-850/70 transition cursor-pointer"
                    >
                      <td className="py-3 px-4 font-bold text-cyan-300">
                        {acc.account_id}
                      </td>
                      <td className="py-3 px-4 text-slate-200 flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-slate-500" />
                        <span>{acc.bank}</span>
                      </td>
                      <td className="py-3 px-4 text-slate-400 text-[11px]">{acc.ifsc}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          isMuleL2 
                            ? 'bg-rose-950 text-rose-300 border border-rose-800'
                            : isWithdrawal
                            ? 'bg-purple-950 text-purple-300 border border-purple-800'
                            : isMuleL1
                            ? 'bg-orange-950 text-orange-300 border border-orange-800'
                            : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                        }`}>
                          {acc.role.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-300">
                        <span className="text-emerald-400">{acc.incoming_txn_count} In</span> / <span className="text-rose-400">{acc.outgoing_txn_count} Out</span>
                      </td>
                      <td className="py-3 px-4 font-bold text-slate-200">
                        ₹{acc.total_amount.toLocaleString()}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          acc.risk_rating === 'CRITICAL'
                            ? 'bg-rose-950 text-rose-400 border border-rose-800'
                            : acc.risk_rating === 'HIGH'
                            ? 'bg-orange-950 text-orange-400 border border-orange-800'
                            : acc.risk_rating === 'MEDIUM'
                            ? 'bg-amber-950 text-amber-400 border border-amber-800'
                            : 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                        }`}>
                          {acc.risk_rating}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right text-slate-400 text-[11px]">
                        {acc.connected_accounts ? acc.connected_accounts.length : 0} nodes
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

      </div>

      {/* Account Details Drawer / Modal */}
      {selectedAccount && (
        <div className="fixed inset-0 bg-navy-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-navy-900 border border-navy-700 rounded-2xl max-w-md w-full p-6 shadow-2xl relative font-mono text-xs">
            <button
              onClick={() => setSelectedAccount(null)}
              className="absolute top-4 right-4 p-1.5 rounded-lg bg-navy-800 text-slate-400 hover:text-white"
            >
              ✕
            </button>

            <h3 className="text-sm font-bold text-white mb-1">NODE DOSSIER</h3>
            <p className="text-[11px] text-cyan-400 mb-4">{selectedAccount.account_id}</p>

            <div className="space-y-2 p-3 rounded-xl bg-navy-950 border border-navy-800 mb-4">
              <div className="flex justify-between">
                <span className="text-slate-400">Institutional Branch:</span>
                <span className="text-slate-200">{selectedAccount.bank}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">IFSC Code:</span>
                <span className="text-slate-200">{selectedAccount.ifsc}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Registered Phone Suffix:</span>
                <span className="text-slate-200">******{selectedAccount.phone_suffix}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Layer Role:</span>
                <span className="text-rose-400 font-bold uppercase">{selectedAccount.role}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Cumulative Funneled Volume:</span>
                <span className="text-emerald-400 font-bold">₹{selectedAccount.total_amount.toLocaleString()}</span>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-semibold text-slate-300 mb-2">CONNECTED COUNTERPARTIES ({selectedAccount.connected_accounts?.length || 0}):</h4>
              <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto p-2 rounded bg-navy-950 border border-navy-800 text-[10px]">
                {selectedAccount.connected_accounts?.map(con => (
                  <span key={con} className="px-2 py-0.5 rounded bg-navy-800 text-slate-300 border border-navy-700">
                    {con}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
