import React from 'react';
import { AlertTriangle, ShieldCheck, Info } from 'lucide-react';

export default function DisclaimerBanner() {
  return (
    <div className="bg-navy-900 border-b border-cyan-900/60 px-4 py-2 flex flex-col md:flex-row items-center justify-between text-xs text-slate-300 gap-2 shadow-inner">
      <div className="flex items-center gap-2">
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-cyan-950 border border-cyan-500/40 text-cyan-400 font-mono font-semibold tracking-wider text-[11px]">
          <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
          FORTIVEXA | TRL 3 PROOF OF CONCEPT
        </span>
        <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-amber-950/80 border border-amber-600/40 text-amber-300 font-mono text-[10px] font-bold">
          DEMO / SAMPLE DATA
        </span>
      </div>

      <div className="flex items-center gap-1.5 text-slate-400 text-center md:text-left">
        <Info className="w-3.5 h-3.5 text-slate-400 shrink-0 hidden sm:inline" />
        <span>
          <strong className="text-slate-300">Research Prototype:</strong> Synthesized multi-hop telemetry. Predictions are experimental probabilities, not evidence of criminal activity. Human investigator verification is strictly required prior to field response.
        </span>
      </div>

      <div className="hidden lg:flex items-center gap-1 font-mono text-[11px] text-slate-400">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
        <span>Local ML Engine: Active</span>
      </div>
    </div>
  );
}
