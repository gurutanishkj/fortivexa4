import React, { useState, useEffect } from 'react';
import { Sliders, Activity, MapPin, ShieldAlert, Clock, ArrowRight, Zap, Target } from 'lucide-react';
import { simulateScenario } from '../services/api';

const METRO_REGIONS = [
  'Bengaluru', 'Delhi-NCR', 'Mumbai', 'Hyderabad',
  'Kolkata', 'Chennai', 'Ahmedabad', 'Pune'
];

export default function ScenarioSimulatorPage() {
  const [amount, setAmount] = useState(145000);
  const [hopDelay, setHopDelay] = useState(25);
  const [mules, setMules] = useState(4);
  const [city, setCity] = useState('Bengaluru');
  const [timeHour, setTimeHour] = useState(19.5); // 7:30 PM peak
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  async function runSimulation() {
    setLoading(true);
    try {
      const data = await simulateScenario({
        amount: Number(amount),
        hop_delay_min: Number(hopDelay),
        connected_mules: Number(mules),
        city,
        time_of_day_hour: Number(timeHour)
      });
      setResult(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    runSimulation();
  }, [amount, hopDelay, mules, city, timeHour]);

  const topLoc = result?.top_predicted_location;
  const riskVal = result?.calculated_risk || 0.75;
  const riskPct = Math.round(riskVal * 100);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex items-center gap-2 mb-2">
          <span className="px-3 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-full text-xs font-mono font-semibold">
            WHAT-IF CYBERCRIME SCENARIO SIMULATOR
          </span>
          <span className="px-2.5 py-0.5 rounded text-xs font-mono bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
            Real-Time Model Inference
          </span>
        </div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Predictive Scenario Laboratory</h1>
        <p className="text-slate-400 text-sm mt-1">
          Adjust transaction siphoning volume, inter-hop routing velocity, syndicate mule density, and time-of-day parameters to observe live risk recalibration and forecast likely cashout targets.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Sliders Panel (5 Cols) */}
        <div className="lg:col-span-5 bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur-md space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h2 className="text-sm font-mono text-cyan-400 uppercase tracking-wider flex items-center gap-2">
              <Sliders className="w-4 h-4" /> Tactical Control Sliders
            </h2>
            {loading && <Activity className="w-4 h-4 text-cyan-400 animate-spin" />}
          </div>

          {/* Amount Slider */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-slate-400 font-mono">Siphoned Volume (₹)</span>
              <span className="text-cyan-300 font-mono font-bold text-sm">₹{Number(amount).toLocaleString()}</span>
            </div>
            <input
              type="range"
              min="10000"
              max="500000"
              step="5000"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full accent-cyan-500 bg-slate-800 h-2 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>₹10,000</span>
              <span>₹2,50,000</span>
              <span>₹5,00,000</span>
            </div>
          </div>

          {/* Hop Delay */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-slate-400 font-mono">Layering Velocity / Hop Delay</span>
              <span className="text-amber-300 font-mono font-bold text-sm">{hopDelay} mins</span>
            </div>
            <input
              type="range"
              min="5"
              max="180"
              step="5"
              value={hopDelay}
              onChange={(e) => setHopDelay(e.target.value)}
              className="w-full accent-amber-500 bg-slate-800 h-2 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>5 min (Rapid)</span>
              <span>60 min</span>
              <span>180 min (Dormant)</span>
            </div>
          </div>

          {/* Connected Mules */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-slate-400 font-mono">Syndicate Mules Count</span>
              <span className="text-emerald-300 font-mono font-bold text-sm">{mules} accounts</span>
            </div>
            <input
              type="range"
              min="1"
              max="8"
              step="1"
              value={mules}
              onChange={(e) => setMules(e.target.value)}
              className="w-full accent-emerald-500 bg-slate-800 h-2 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>1 Mule (Single Hop)</span>
              <span>4 Mules</span>
              <span>8 Mules (Deep Ring)</span>
            </div>
          </div>

          {/* Time of Day */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-slate-400 font-mono">Simulated Incident Time</span>
              <span className="text-cyan-300 font-mono font-bold text-sm">
                {Math.floor(timeHour)}:{(Math.floor((timeHour % 1) * 60) === 0 ? '00' : '30')} hrs
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="23.5"
              step="0.5"
              value={timeHour}
              onChange={(e) => setTimeHour(e.target.value)}
              className="w-full accent-cyan-500 bg-slate-800 h-2 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>00:00 (Night)</span>
              <span>12:00 (Noon)</span>
              <span>19:30 (Peak)</span>
              <span>23:30</span>
            </div>
          </div>

          {/* Regional Hub Selector */}
          <div className="space-y-2">
            <span className="text-slate-400 font-mono text-xs block">Operational Metro Sector</span>
            <div className="grid grid-cols-4 gap-2">
              {METRO_REGIONS.map((r) => (
                <button
                  key={r}
                  onClick={() => setCity(r)}
                  className={`py-1.5 px-2 rounded-lg text-xs font-mono transition-all ${
                    city === r
                      ? 'bg-cyan-500 text-slate-950 font-bold shadow-md'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {r.split('-')[0]}
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Live Forecast & Explainability Output (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Top Forecast Card */}
          <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-cyan-950/40 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5 text-cyan-400" />
                <h3 className="font-semibold text-white text-base">Model Forecasted Cashout Target</h3>
              </div>
              <span className="px-2.5 py-1 bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 rounded text-xs font-mono font-bold">
                RANK 1 CANDIDATE
              </span>
            </div>

            {topLoc ? (
              <div className="space-y-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 bg-slate-950/60 rounded-xl border border-slate-800">
                  <div>
                    <h4 className="text-lg font-bold text-white flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-rose-400 shrink-0" />
                      {topLoc.name}
                    </h4>
                    <span className="text-xs text-slate-400 font-mono block mt-1">
                      {topLoc.jurisdiction} • {topLoc.city} • Type: {topLoc.type}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-[11px] font-mono text-slate-400 block">Model-Estimated Risk</span>
                    <div className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-rose-400 font-mono">
                      {riskPct}%
                    </div>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="space-y-1">
                  <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-cyan-500 via-amber-500 to-rose-500 transition-all duration-300"
                      style={{ width: `${Math.min(riskPct, 100)}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                    <span>Low Risk (0-40%)</span>
                    <span>Medium (40-70%)</span>
                    <span>Critical Cashout Probability (&gt;70%)</span>
                  </div>
                </div>

                {/* QRT Routing Advisory */}
                <div className="p-3 bg-cyan-950/20 border border-cyan-500/20 rounded-xl flex items-center justify-between text-xs">
                  <span className="text-slate-300 font-mono">Assigned Interception Unit:</span>
                  <span className="text-cyan-300 font-bold font-mono">{topLoc.nearest_qrt}</span>
                </div>
              </div>
            ) : (
              <div className="p-8 text-center text-slate-500 font-mono text-sm">
                Recalculating forecast model...
              </div>
            )}
          </div>

          {/* Explainable AI Attribution Panel */}
          {topLoc?.explanation_factors && (
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl backdrop-blur-md">
              <h3 className="text-xs font-mono text-cyan-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                <Zap className="w-4 h-4" /> Explainable AI — Why this location was ranked #1
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {topLoc.explanation_factors.map((f, i) => (
                  <div key={i} className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/80">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-semibold text-white">{f.factor}</span>
                      <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-500/30">
                        {f.weight}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-snug">{f.detail}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
