import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  Network, 
  Crosshair, 
  CheckCircle2, 
  Plus, 
  ArrowUpRight, 
  MapPin, 
  Activity, 
  Compass, 
  GitMerge, 
  Clock, 
  ShieldAlert 
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { fetchStats } from '../services/api';

// 24h extraction wave curve data (peaking at 16:00 - 20:00)
const EXTRACTION_WAVE_DATA = [
  { hour: '00:00', volume: 4.2 },
  { hour: '02:00', volume: 2.1 },
  { hour: '04:00', volume: 1.8 },
  { hour: '06:00', volume: 3.5 },
  { hour: '08:00', volume: 6.2 },
  { hour: '10:00', volume: 9.8 },
  { hour: '12:00', volume: 14.5 },
  { hour: '14:00', volume: 21.0 },
  { hour: '16:00', volume: 31.4 },
  { hour: '18:00', volume: 35.8 },
  { hour: '20:00', volume: 32.1 },
  { hour: '22:00', volume: 18.6 },
  { hour: '24:00', volume: 8.4 },
];

// NCRP Taxonomy Breakdown matching Screenshot 2
const TAXONOMY_DATA = [
  { name: 'Digital Arrest', count: 88, color: '#f97316', width: '92%' },
  { name: 'Crypto Ponzi', count: 68, color: '#06b6d4', width: '74%' },
  { name: 'Job Task Fraud', count: 59, color: '#3b82f6', width: '64%' },
  { name: 'Electricity Phish', count: 48, color: '#f59e0b', width: '52%' },
  { name: 'SIM Swap', count: 37, color: '#ec4899', width: '40%' },
  { name: 'Loan App Extortion', count: 28, color: '#a855f7', width: '30%' },
];

export default function DashboardPage({ onNavigate, onSelectCase }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats()
      .then(data => {
        setStats(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching stats:', err);
        setLoading(false);
      });
  }, []);

  const kpis = stats?.kpis || {};
  const topHotspots = stats?.top_hotspots || [];
  const alerts = stats?.recent_alerts || [];

  return (
    <div className="p-6 space-y-6 bg-[#050811] text-slate-100 min-h-screen">
      
      {/* ======================================================== */}
      {/* 1. NCTAU BANNER (MATCHES SCREENSHOT 2)                    */}
      {/* ======================================================== */}
      <div className="glass-panel p-6 rounded-2xl border-navy-800 bg-gradient-to-r from-[#091124] via-[#070d1c] to-[#091124] shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
            <span className="font-mono text-xs font-bold text-cyan-400 tracking-wider">
              NATIONAL CYBER THREAT ANALYTICS UNIT (NCTAU)
            </span>
          </div>

          <h1 className="text-2xl font-bold font-display text-white tracking-wide">
            Predictive Cash-Out Interception Console
          </h1>
          
          <p className="text-xs text-slate-400 font-sans mt-1">
            Real-time multi-hop mule trail tracking and preemptive ATM withdrawal forecasting
          </p>
        </div>

        {/* Action Button: Ingest Complaint */}
        <button
          onClick={() => onNavigate('complaints')}
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-black font-bold text-xs uppercase tracking-wider rounded-lg shadow-lg shadow-orange-500/20 transition self-start md:self-auto shrink-0"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>+ INGEST COMPLAINT</span>
        </button>
      </div>

      {/* ======================================================== */}
      {/* 2. TOP 4 KPI CARDS (MATCHES SCREENSHOT 2)                */}
      {/* ======================================================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: TOTAL COMPLAINTS TODAY */}
        <div className="bg-[#0a1122] border border-[#16233f] p-5 rounded-2xl shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-mono tracking-wider font-semibold">
              TOTAL COMPLAINTS TODAY
            </span>
            <div className="w-8 h-8 rounded-lg bg-[#27120a] border border-orange-600/50 flex items-center justify-center">
              <Shield className="w-4 h-4 text-orange-400" />
            </div>
          </div>

          <p className="text-3xl font-extrabold font-display text-white mb-3">
            {kpis.total_complaints ? Math.round(kpis.total_complaints * 0.33) : 42}
          </p>

          <div className="flex items-center gap-2 font-mono text-xs text-slate-400">
            <span className="px-1.5 py-0.5 rounded bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 font-bold text-[10px]">
              +14%
            </span>
            <span className="text-[11px]">vs 37 daily avg</span>
          </div>
        </div>

        {/* Card 2: ACTIVE MULE CHAINS TRACKED */}
        <div className="bg-[#0a1122] border border-[#16233f] p-5 rounded-2xl shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-mono tracking-wider font-semibold">
              ACTIVE MULE CHAINS TRACKED
            </span>
            <div className="w-8 h-8 rounded-lg bg-[#07242c] border border-cyan-500/50 flex items-center justify-center">
              <Network className="w-4 h-4 text-cyan-400" />
            </div>
          </div>

          <p className="text-3xl font-extrabold font-display text-white mb-3">
            {kpis.flagged_mule_accounts || 18}
          </p>

          <div className="flex items-center gap-2 font-mono text-xs text-slate-400">
            <span className="px-1.5 py-0.5 rounded bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 font-bold text-[10px]">
              +3 new
            </span>
            <span className="text-[11px]">across 8 banking nodes</span>
          </div>
        </div>

        {/* Card 3: HIGH-RISK PREDICTIONS PENDING */}
        <div className="bg-[#0a1122] border border-[#16233f] p-5 rounded-2xl shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-mono tracking-wider font-semibold">
              HIGH-RISK PREDICTIONS PENDING
            </span>
            <div className="w-8 h-8 rounded-lg bg-[#2b0c13] border border-rose-600/50 flex items-center justify-center">
              <Crosshair className="w-4 h-4 text-rose-400" />
            </div>
          </div>

          <p className="text-3xl font-extrabold font-display text-white mb-3">
            3
          </p>

          <div className="flex items-center gap-2 font-mono text-xs text-slate-400">
            <span className="px-1.5 py-0.5 rounded bg-[#16233f] text-slate-200 font-bold text-[9px] uppercase tracking-wider">
              ACTION REQUIRED
            </span>
            <span className="text-[11px]">withdrawal within 4 hrs</span>
          </div>
        </div>

        {/* Card 4: CASES INTERCEPTED (30 DAYS) */}
        <div className="bg-[#0a1122] border border-[#16233f] p-5 rounded-2xl shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-mono tracking-wider font-semibold">
              CASES INTERCEPTED (30 DAYS)
            </span>
            <div className="w-8 h-8 rounded-lg bg-[#072418] border border-emerald-500/50 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            </div>
          </div>

          <p className="text-3xl font-extrabold font-display text-white mb-3">
            29
          </p>

          <div className="flex items-center gap-2 font-mono text-xs text-slate-400">
            <span className="px-1.5 py-0.5 rounded bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 font-bold text-[10px]">
              +87% success
            </span>
            <span className="text-[11px]">₹1.84 Cr safeguarded</span>
          </div>
        </div>

      </div>

      {/* ======================================================== */}
      {/* 3. TWO PRIMARY CHARTS (MATCHES SCREENSHOT 2)              */}
      {/* ======================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Left Chart: 24h Siphoned Fund Velocity & Extraction Wave */}
        <div className="bg-[#0a1122] border border-[#16233f] p-6 rounded-2xl shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-orange-500"></span>
                <h3 className="text-sm font-bold text-white tracking-wide">
                  24h Siphoned Fund Velocity & Extraction Wave
                </h3>
              </div>

              {/* Peak Window Badge */}
              <span className="px-2.5 py-0.5 rounded bg-[#351509] border border-orange-600/70 text-orange-400 font-mono text-[10px] font-bold">
                PEAK: 16:00 - 20:00
              </span>
            </div>
            
            <p className="text-xs text-slate-400 font-sans mb-4">
              Total volume in ₹ Lakhs routed to withdrawal nodes
            </p>
          </div>

          {/* Area Wave */}
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={EXTRACTION_WAVE_DATA}>
                <defs>
                  <linearGradient id="orangeWave" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#f97316" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#16233f" opacity={0.6} />
                <XAxis dataKey="hour" stroke="#64748b" fontSize={10} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={10} tickLine={false} unit="L" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#060b17', borderColor: '#1e293b', fontSize: '11px', borderRadius: '8px' }}
                  itemStyle={{ color: '#f97316' }}
                  formatter={(val) => [`₹${val} Lakhs`, 'Siphoned Velocity']}
                />
                <Area 
                  type="monotone" 
                  dataKey="volume" 
                  stroke="#f97316" 
                  strokeWidth={3} 
                  fillOpacity={1} 
                  fill="url(#orangeWave)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right Chart: Cybercrime Taxonomy Breakdown (Today) */}
        <div className="bg-[#0a1122] border border-[#16233f] p-6 rounded-2xl shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400"></span>
                <h3 className="text-sm font-bold text-white tracking-wide">
                  Cybercrime Taxonomy Breakdown (Today)
                </h3>
              </div>

              <span className="px-2 py-0.5 rounded bg-cyan-950 border border-cyan-800 text-cyan-300 font-mono text-[10px] font-bold">
                NCRP TAXONOMY
              </span>
            </div>

            <p className="text-xs text-slate-400 font-sans mb-5">
              Cases flagged by I4C National Cyber Intelligence
            </p>
          </div>

          {/* Custom Horizontal Bar Breakdown matching Screenshot 2 */}
          <div className="space-y-3 font-mono text-xs">
            {TAXONOMY_DATA.map((item) => (
              <div key={item.name} className="flex items-center gap-3">
                <span className="w-36 text-[11px] text-slate-300 truncate text-right shrink-0">
                  {item.name}
                </span>

                <div className="flex-1 h-5 bg-[#060b17] rounded-md overflow-hidden p-0.5 border border-navy-800">
                  <div 
                    className="h-full rounded transition-all duration-500 shadow-sm"
                    style={{ 
                      width: item.width, 
                      backgroundColor: item.color 
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-3 border-t border-navy-800/80 flex items-center justify-between text-[11px] text-slate-400 font-mono">
            <span>Source: NCRP Cyber Crime Portal Ingestion</span>
            <button 
              onClick={() => onNavigate('complaints')}
              className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-semibold"
            >
              <span>View All 128 Complaints</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>

      {/* ======================================================== */}
      {/* 4. SECONDARY SECTION: HOTSPOTS PREVIEWS & RECENT SIGNALS */}
      {/* ======================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Hotspots Preview */}
        <div className="bg-[#0a1122] border border-[#16233f] p-5 rounded-2xl shadow-xl space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-navy-800/80">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-purple-400" />
              <h3 className="text-sm font-bold text-white tracking-wide">
                High-Probability ATM Kiosks for Interception
              </h3>
            </div>
            <button 
              onClick={() => onNavigate('map')}
              className="text-xs text-purple-400 hover:text-purple-300 font-mono flex items-center gap-1"
            >
              <span>Full Risk Map</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2">
            {topHotspots.map((loc, idx) => (
              <div 
                key={loc.location_id}
                className="flex items-center justify-between p-3 rounded-xl bg-[#060b17] border border-navy-800 hover:border-purple-500/40 transition"
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-md bg-purple-950 text-purple-300 font-mono text-xs flex items-center justify-center font-bold">
                    #{idx + 1}
                  </span>
                  <div>
                    <p className="text-xs font-semibold text-slate-200">{loc.name}</p>
                    <p className="text-[10px] text-slate-400 font-mono">{loc.jurisdiction}</p>
                  </div>
                </div>

                <div className="text-right font-mono">
                  <span className="text-[11px] font-bold text-rose-400">
                    {(loc.risk_index * 100).toFixed(0)}% Risk
                  </span>
                  <span className="text-[10px] text-slate-400 block">
                    {loc.historical_cashouts} incidents
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Live Tactical Alerts */}
        <div className="bg-[#0a1122] border border-[#16233f] p-5 rounded-2xl shadow-xl space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-navy-800/80">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-rose-400" />
              <h3 className="text-sm font-bold text-white tracking-wide">
                Live Syndicate Detection & Dispatch Signals
              </h3>
            </div>
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping"></span>
          </div>

          <div className="space-y-2.5">
            {alerts.map((alt) => (
              <div 
                key={alt.id}
                className="p-3 rounded-xl bg-[#060b17] border border-navy-800 flex items-start justify-between gap-3 text-xs"
              >
                <div className="flex items-start gap-2.5">
                  <span className="w-2 h-2 rounded-full mt-1.5 shrink-0 bg-rose-500" />
                  <div>
                    <p className="text-slate-200 leading-snug">{alt.text}</p>
                    <span className="text-[10px] text-slate-400 font-mono">{alt.time} • Severity: {alt.severity}</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    if (alt.type === 'RING_DETECTED') onNavigate('linkage');
                    else if (alt.type === 'PREDICTION_DISPATCH') onNavigate('prediction');
                    else onNavigate('intelligence');
                  }}
                  className="px-2.5 py-1 bg-navy-800 hover:bg-navy-700 text-cyan-300 rounded font-mono text-[10px] shrink-0"
                >
                  Action
                </button>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
