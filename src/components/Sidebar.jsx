import React from 'react';
import { 
  LayoutDashboard, FileText, CreditCard, Network, GitMerge, 
  Compass, Workflow, MapPin, ShieldCheck, Boxes, Award, 
  LogIn, Bell, Sliders, BarChart3, History, Activity, 
  Layers, Lock, Database
} from 'lucide-react';

const NAV_GROUPS = [
  {
    group: 'OPERATIONS',
    items: [
      { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, badge: 'Overview' },
      { id: 'complaints', label: 'Complaints', icon: FileText, badge: '500 FIRs' },
      { id: 'transactions', label: 'Transactions', icon: CreditCard, badge: '5,000 Tx' },
      { id: 'accounts', label: 'Account Network', icon: Network, badge: 'Centrality' },
      { id: 'linkage', label: 'Cross-Case Linkage', icon: GitMerge, badge: 'RINGS', highlight: true },
      { id: 'intelligence', label: 'Investigation Workspace', icon: ShieldCheck, badge: 'Dispatch' },
    ]
  },
  {
    group: 'INTELLIGENCE & PREDICTION',
    items: [
      { id: 'prediction', label: 'Prediction & XAI', icon: Compass, badge: 'XGBoost', highlight: true },
      { id: 'map', label: 'Geo-Intelligence Map', icon: MapPin, badge: 'Hotspots' },
      { id: 'alerts', label: 'Predictive Alerts', icon: Bell, badge: 'LIVE ALERTS' },
      { id: 'simulator', label: 'Scenario Simulator', icon: Sliders, badge: 'WHAT-IF' },
      { id: 'pipeline', label: 'Prediction Pipeline', icon: Workflow, badge: '9 Stages' },
    ]
  },
  {
    group: 'MODEL BENCHMARKS & DRIFT',
    items: [
      { id: 'validation', label: 'Model Validation', icon: BarChart3, badge: 'ROC 95.8%' },
      { id: 'backtesting', label: 'Historical Backtesting', icon: History, badge: '96.0% Acc', highlight: true },
      { id: 'monitoring', label: 'Model Monitoring', icon: Activity, badge: 'p50 18ms' },
      { id: 'experiments', label: 'Experiment Manager', icon: Layers, badge: 'Registry' },
    ]
  },
  {
    group: 'INTEGRITY & COMPLIANCE',
    items: [
      { id: 'blockchain', label: 'Blockchain Integrity', icon: Boxes, badge: 'SHA-256' },
      { id: 'security', label: 'Security Center', icon: Lock, badge: 'SEC 10/10' },
      { id: 'database', label: 'Database Health', icon: Database, badge: 'Postgres/Lite' },
      { id: 'trl5', label: 'TRL 5 Validation Center', icon: Award, badge: 'TRL 5 (8/8)', highlight: true },
      { id: 'login', label: 'Persona & Role Switch', icon: LogIn, badge: 'RBAC' },
    ]
  }
];

export default function Sidebar({ currentPage, onNavigate }) {
  return (
    <aside className="w-64 bg-[#050811] border-r border-slate-800 flex flex-col shrink-0 min-h-[calc(100vh-6rem)] select-none">
      
      {/* Scrollable Nav Area */}
      <div className="flex-1 px-3 py-4 space-y-5 overflow-y-auto max-h-[calc(100vh-14rem)]">
        {NAV_GROUPS.map((grp) => (
          <div key={grp.group} className="space-y-1">
            <p className="px-3 text-[10px] font-mono uppercase tracking-wider text-slate-500 font-semibold mb-1.5">
              {grp.group}
            </p>
            {grp.items.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-cyan-950/80 to-slate-800 text-cyan-300 border-l-4 border-cyan-400 font-semibold shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/80'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-500'}`} />
                    <span className="truncate">{item.label}</span>
                  </div>

                  {item.badge && (
                    <span className={`text-[9px] px-1.5 py-0.5 rounded font-mono shrink-0 ${
                      item.highlight
                        ? isActive
                          ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                          : 'bg-rose-950/80 text-rose-300 border border-rose-800/40'
                        : isActive
                          ? 'bg-cyan-900/40 text-cyan-300'
                          : 'bg-slate-800 text-slate-400'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* Persistent Bottom Status Panel */}
      <div className="p-3 m-3 rounded-2xl bg-slate-900/90 border border-slate-800 text-slate-400 text-[11px] font-mono shadow-inner shrink-0">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-slate-300 font-bold">TRL Stage:</span>
          <span className="text-cyan-400 font-bold bg-cyan-950 px-1.5 py-0.2 rounded border border-cyan-500/30">
            TRL 5 VALIDATED
          </span>
        </div>
        <div className="flex items-center justify-between mb-1">
          <span>Top-3 Precision:</span>
          <span className="text-emerald-400 font-bold">96.0%</span>
        </div>
        <div className="flex items-center justify-between mb-1">
          <span>Mean Geodesic Err:</span>
          <span className="text-amber-300 font-bold">2.08 km</span>
        </div>
        <div className="flex items-center justify-between pt-1 border-t border-slate-800">
          <span>Proactive Lead:</span>
          <span className="text-white font-bold">75.1 min</span>
        </div>
      </div>

    </aside>
  );
}
