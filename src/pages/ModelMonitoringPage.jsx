import React from 'react';
import { Activity, Clock, Zap, TrendingUp, Cpu, Server, ShieldCheck, AlertCircle } from 'lucide-react';

export default function ModelMonitoringPage() {
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 rounded-full text-xs font-mono font-semibold">
              REAL-TIME INFERENCE TELEMETRY
            </span>
            <span className="px-2.5 py-0.5 rounded text-xs font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold">
              DRIFT & LATENCY MONITOR
            </span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Model Telemetry & Drift Monitoring</h1>
          <p className="text-slate-400 text-sm mt-1">
            Continuous operational surveillance of XGBoost production pipeline: latency percentiles, throughput, data drift detection, and calibration health.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 bg-emerald-950/40 px-3 py-2 rounded-xl border border-emerald-500/30">
          <Activity className="w-4 h-4 animate-pulse" />
          <span>Pipeline State: HEALTHY (No Drift Detected)</span>
        </div>
      </div>

      {/* Latency & Throughput KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 font-mono">
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4">
          <span className="text-[11px] text-slate-400 block mb-1">Median Latency (p50)</span>
          <div className="text-2xl font-bold text-cyan-300">18.4 <span className="text-xs font-normal text-slate-400">ms</span></div>
          <span className="text-[10px] text-emerald-400 flex items-center gap-1 mt-1">
            <ShieldCheck className="w-3 h-3" /> Sub-25ms Target Met
          </span>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4">
          <span className="text-[11px] text-slate-400 block mb-1">Tail Latency (p95)</span>
          <div className="text-2xl font-bold text-slate-200">34.2 <span className="text-xs font-normal text-slate-400">ms</span></div>
          <span className="text-[10px] text-slate-500">Peak load spikes</span>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4">
          <span className="text-[11px] text-slate-400 block mb-1">Max Latency (p99)</span>
          <div className="text-2xl font-bold text-amber-300">52.1 <span className="text-xs font-normal text-slate-400">ms</span></div>
          <span className="text-[10px] text-slate-500">Cold-start boundary</span>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4">
          <span className="text-[11px] text-slate-400 block mb-1">Inference Throughput</span>
          <div className="text-2xl font-bold text-emerald-400">85.4 <span className="text-xs font-normal text-slate-400">req/s</span></div>
          <span className="text-[10px] text-slate-500">Uvicorn asynchronous worker</span>
        </div>
      </div>

      {/* Feature Drift Surveillance */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur-md">
        <h2 className="text-sm font-mono text-cyan-400 uppercase tracking-wider mb-4 flex items-center gap-2">
          <TrendingUp className="w-4 h-4" /> Kolmogorov-Smirnov (KS) Data Drift Test Telemetry
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="py-2.5 px-3">Monitored Feature</th>
                <th className="py-2.5 px-3">Baseline Mean</th>
                <th className="py-2.5 px-3">Live Window Mean</th>
                <th className="py-2.5 px-3">KS Statistic (p-value)</th>
                <th className="py-2.5 px-3">Drift Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              <tr>
                <td className="py-3 px-3 text-white font-semibold">Geodesic Distance to ATM (km)</td>
                <td className="py-3 px-3 text-slate-400">6.42 km</td>
                <td className="py-3 px-3 text-cyan-300">6.38 km</td>
                <td className="py-3 px-3 text-slate-300">p = 0.842 (&gt; 0.05)</td>
                <td className="py-3 px-3"><span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">NO DRIFT</span></td>
              </tr>
              <tr>
                <td className="py-3 px-3 text-white font-semibold">Historical Kiosk Cashouts</td>
                <td className="py-3 px-3 text-slate-400">28.4 tx</td>
                <td className="py-3 px-3 text-cyan-300">29.1 tx</td>
                <td className="py-3 px-3 text-slate-300">p = 0.761 (&gt; 0.05)</td>
                <td className="py-3 px-3"><span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">NO DRIFT</span></td>
              </tr>
              <tr>
                <td className="py-3 px-3 text-white font-semibold">Time of Day (Cyclical Cosine)</td>
                <td className="py-3 px-3 text-slate-400">0.74</td>
                <td className="py-3 px-3 text-cyan-300">0.76</td>
                <td className="py-3 px-3 text-slate-300">p = 0.912 (&gt; 0.05)</td>
                <td className="py-3 px-3"><span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">NO DRIFT</span></td>
              </tr>
              <tr>
                <td className="py-3 px-3 text-white font-semibold">Mule Graph Degree Centrality</td>
                <td className="py-3 px-3 text-slate-400">4.2 nodes</td>
                <td className="py-3 px-3 text-cyan-300">4.5 nodes</td>
                <td className="py-3 px-3 text-slate-300">p = 0.680 (&gt; 0.05)</td>
                <td className="py-3 px-3"><span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">NO DRIFT</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
