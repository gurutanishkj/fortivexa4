import React, { useState, useEffect } from 'react';
import { Bell, AlertTriangle, ShieldAlert, CheckCircle2, Clock, Filter, ArrowRight } from 'lucide-react';
import { fetchAlerts, updateAlertStatus } from '../services/api';

const STATUS_TABS = ['ALL', 'NEW', 'REVIEWING', 'RESOLVED', 'DISMISSED'];

export default function AlertsCenterPage({ onSelectCase, onNavigate }) {
  const [alerts, setAlerts] = useState([]);
  const [activeTab, setActiveTab] = useState('ALL');
  const [loading, setLoading] = useState(false);

  async function loadAlerts(statusFilter = activeTab) {
    setLoading(true);
    try {
      const filterParam = statusFilter === 'ALL' ? null : statusFilter;
      const data = await fetchAlerts(filterParam);
      setAlerts(data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAlerts(activeTab);
  }, [activeTab]);

  async function handleStatusChange(alertId, newStatus) {
    try {
      await updateAlertStatus(alertId, newStatus);
      // Update local state
      setAlerts(prev => prev.map(a => a.alert_id === alertId ? { ...a, status: newStatus } : a));
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 bg-rose-500/20 text-rose-300 border border-rose-500/30 rounded-full text-xs font-mono font-semibold">
              PREDICTIVE INTERCEPTION ALERTS
            </span>
            <span className="px-2.5 py-0.5 rounded text-xs font-mono bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-bold">
              EARLY WARNING DISPATCH
            </span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Tactical Predictive Alert Center</h1>
          <p className="text-slate-400 text-sm mt-1">
            Real-time automated threat broadcasts triggered when high-velocity mule layering or imminent physical cashout patterns are detected.
          </p>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 bg-slate-950 p-1.5 rounded-xl border border-slate-800">
          {STATUS_TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
                activeTab === tab
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Alerts Stream */}
      <div className="space-y-3.5">
        {alerts.length === 0 ? (
          <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-12 text-center text-slate-500 font-mono text-sm">
            No predictive alerts currently in "{activeTab}" status.
          </div>
        ) : (
          alerts.map((a) => {
            const isCritical = a.priority === 'CRITICAL';
            return (
              <div
                key={a.alert_id}
                className={`p-5 rounded-2xl border transition-all ${
                  isCritical 
                    ? 'bg-slate-900/90 border-rose-500/40 shadow-lg shadow-rose-950/20' 
                    : 'bg-slate-900/60 border-slate-800'
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2.5">
                      <span className="font-mono text-xs font-bold text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-500/30">
                        {a.alert_id}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[11px] font-mono font-bold ${
                        isCritical ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      }`}>
                        {a.priority} PRIORITY
                      </span>
                      <h3 className="font-bold text-white text-sm">{a.alert_type}</h3>
                    </div>
                    <p className="text-xs text-slate-300">{a.message}</p>
                    <div className="flex items-center gap-4 text-[11px] text-slate-500 font-mono pt-1">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" /> Triggered: {new Date(a.triggered_at).toLocaleTimeString()}
                      </span>
                      <span>Case Reference: {a.complaint_id}</span>
                    </div>
                  </div>

                  {/* Actions & Status Dropdown */}
                  <div className="flex items-center gap-3 self-end md:self-center">
                    <select
                      value={a.status}
                      onChange={(e) => handleStatusChange(a.alert_id, e.target.value)}
                      className="bg-slate-950 text-xs font-mono font-semibold px-3 py-2 rounded-xl border border-slate-800 text-slate-200 outline-none cursor-pointer focus:border-cyan-500"
                    >
                      <option value="NEW">Status: NEW</option>
                      <option value="REVIEWING">Status: REVIEWING</option>
                      <option value="RESOLVED">Status: RESOLVED</option>
                      <option value="DISMISSED">Status: DISMISSED</option>
                    </select>

                    {onSelectCase && onNavigate && (
                      <button
                        onClick={() => {
                          onSelectCase(a.complaint_id);
                          onNavigate('prediction');
                        }}
                        className="px-3.5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-mono font-semibold flex items-center gap-1.5 transition-all shadow-md"
                      >
                        Inspect Target
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

    </div>
  );
}
