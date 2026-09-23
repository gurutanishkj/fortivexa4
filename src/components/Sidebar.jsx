import React from 'react';
import { 
  LayoutDashboard, 
  FileText, 
  CreditCard, 
  Network, 
  GitMerge, 
  Compass, 
  Workflow, 
  MapPin, 
  ShieldCheck, 
  Boxes, 
  Award, 
  LogIn
} from 'lucide-react';

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, badge: 'Overview' },
  { id: 'complaints', label: 'Complaints', icon: FileText, badge: '128 Cases' },
  { id: 'transactions', label: 'Transactions', icon: CreditCard, badge: 'Risk Ledger' },
  { id: 'accounts', label: 'Account Network', icon: Network, badge: 'Mule Graph' },
  { id: 'linkage', label: 'Cross-Case Linkage', icon: GitMerge, badge: 'INNOVATION', highlight: true },
  { id: 'prediction', label: 'Prediction Engine', icon: Compass, badge: 'EXPLAINABLE', highlight: true },
  { id: 'pipeline', label: 'Prediction Pipeline', icon: Workflow, badge: '9 Stages' },
  { id: 'map', label: 'Risk Map', icon: MapPin, badge: 'Geo Hotspots' },
  { id: 'intelligence', label: 'Actionable Intel', icon: ShieldCheck, badge: 'Dispatch' },
  { id: 'blockchain', label: 'Blockchain Ledger', icon: Boxes, badge: 'Audit POC' },
  { id: 'trl3', label: 'TRL 3 Validation', icon: Award, badge: 'REAL METRICS', highlight: true },
  { id: 'login', label: 'Auth / Switch Role', icon: LogIn, badge: 'Demo Login' },
];

export default function Sidebar({ currentPage, onNavigate }) {
  return (
    <aside className="w-64 bg-navy-950 border-r border-navy-800 flex flex-col shrink-0 min-h-[calc(100vh-6rem)]">
      {/* Sidebar Section Title */}
      <div className="px-4 py-3 border-b border-navy-800/80">
        <p className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
          ANALYTICS & DISPATCH MODULES
        </p>
      </div>

      {/* Nav List */}
      <nav className="flex-1 px-2 py-3 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all ${
                isActive
                  ? 'bg-gradient-to-r from-cyan-950/80 to-navy-800 text-cyan-300 border-l-4 border-cyan-400 font-semibold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-navy-900/80'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-400 group-hover:text-slate-300'}`} />
                <span>{item.label}</span>
              </div>

              {item.badge && (
                <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
                  item.highlight
                    ? isActive
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                      : 'bg-rose-950/80 text-rose-300 border border-rose-800/40'
                    : isActive
                      ? 'bg-cyan-900/40 text-cyan-300'
                      : 'bg-navy-800/60 text-slate-400'
                }`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Persistent Bottom Status Panel */}
      <div className="p-3 m-2 rounded-lg bg-navy-900/60 border border-navy-800 text-slate-400 text-[11px] font-mono">
        <div className="flex items-center justify-between mb-1">
          <span className="text-slate-300">TRL Stage:</span>
          <span className="text-cyan-400 font-bold">TRL 3 (Exp POC)</span>
        </div>
        <div className="flex items-center justify-between mb-1">
          <span>Cross-Case Linkage:</span>
          <span className="text-emerald-400">94.7% Prec</span>
        </div>
        <div className="flex items-center justify-between">
          <span>Top-3 Accuracy:</span>
          <span className="text-emerald-400">91.7%</span>
        </div>
      </div>
    </aside>
  );
}
