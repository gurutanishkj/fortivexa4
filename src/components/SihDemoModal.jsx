import React, { useState } from 'react';
import { 
  X, ChevronLeft, ChevronRight, CheckCircle2, Play, 
  ShieldCheck, ArrowRight, Sparkles, Terminal, Layers
} from 'lucide-react';

const STEPS = [
  {
    step: 1,
    title: '1. Restricted Cyber Command Access',
    page: 'login',
    summary: 'Authenticate into FORTIVEXA using officer persona credentials with RBAC privilege boundaries.',
    highlight: 'Select "Cybercrime Investigator" to access FIR ingestion and cross-case syndicate analysis.'
  },
  {
    step: 2,
    title: '2. Live Tactical Dashboard & KPIs',
    page: 'dashboard',
    summary: 'Command overview summarizing 500 synthetic complaints, 5,000 transactions, 24-hr fund velocity wave, and regional risk distribution.',
    highlight: 'Real-time telemetry reflects live database counts with zero fabricated placeholder figures.'
  },
  {
    step: 3,
    title: '3. Complaint Repository & Multi-Hop Telemetry',
    page: 'complaints',
    summary: 'Search, filter, and inspect incoming cybercrime complaints across categories (UPI Phishing, Task Scam, Digital Arrest).',
    highlight: 'Select case CMP-1001 to inspect victim account SBIN-001 and siphoned amount ₹95,000.'
  },
  {
    step: 4,
    title: '4. Multi-Hop Transaction Flow Inspector',
    page: 'transactions',
    summary: 'Trace the rapid dispersal of siphoned funds through intermediary mule tiers (Victim → Mule L1 → Mule L2 → Withdrawal).',
    highlight: 'Notice how transactions split across banking channels (UPI, IMPS, NEFT) to evade AML thresholds.'
  },
  {
    step: 5,
    title: '5. Account Network & Centrality Analytics',
    page: 'accounts',
    summary: 'Graph analysis computing Degree Centrality, Betweenness Centrality, and PageRank over NetworkX & Neo4j.',
    highlight: 'Mule accounts with highest betweenness score identify key syndicate consolidation bottlenecks.'
  },
  {
    step: 6,
    title: '6. Cross-Case Linkage [Core Innovation]',
    page: 'linkage',
    summary: 'Bipartite graph engine correlates distinct police station FIRs sharing the same intermediary mule accounts.',
    highlight: 'Alert banner flags: "3 other active cases share this Layer 2 mule across distinct jurisdictions".'
  },
  {
    step: 7,
    title: '7. Geospatial-Temporal Location Prediction',
    page: 'prediction',
    summary: 'XGBoost ML engine predicts likely physical cashout locations and ranks candidate ATMs with calibrated probability.',
    highlight: 'Outputs Top-3 ranked ATM kiosks with nearest police Quick Response Team (QRT) mapping.'
  },
  {
    step: 8,
    title: '8. Explainable AI (XAI) Attribution',
    page: 'prediction',
    summary: 'Transparent feature attribution explaining WHY a specific ATM was forecasted without black-box opacity.',
    highlight: 'Attributes weights to geographic proximity, historical kiosk frequency, and evening cashout window match.'
  },
  {
    step: 9,
    title: '9. Pan-India Geo-Intelligence & Hotspots',
    page: 'map',
    summary: 'Dark Leaflet map consolidating high-risk withdrawal ATM clusters across major Indian metropolitan hubs.',
    highlight: 'Switch between Bangalore, Delhi-NCR, and Mumbai sectors to inspect jurisdictional boundaries.'
  },
  {
    step: 10,
    title: '10. Actionable Tactical Dispatch Advisory',
    page: 'intelligence',
    summary: 'Formal police dispatch advisory memo with neutral investigative framing and field patrol checklists.',
    highlight: 'Click "Mark as Intercepted" to update platform-wide telemetry and record preserved funds.'
  },
  {
    step: 11,
    title: '11. Cybercrime Scenario Simulator',
    page: 'simulator',
    summary: 'Adjust siphoned volume, inter-hop delay, mule density, and time-of-day to observe live risk recalculation.',
    highlight: 'Interactive sliders trigger immediate inference through the live FastAPI backend.'
  },
  {
    step: 12,
    title: '12. Cryptographic Evidence Ledger & Tamper Test',
    page: 'blockchain',
    summary: 'Tamper-evident SHA-256 chain of custody anchoring complaint seals, prediction broadcasts, and field dispatches.',
    highlight: 'Click "Simulate Tamper Attack" to prove the verification engine detects hash mismatch immediately.'
  },
  {
    step: 13,
    title: '13. TRL 5 Empirical Benchmark Validation',
    page: 'trl5',
    summary: 'End-to-end automated validation runner executing scenarios TEST-001 through TEST-008 with real measured telemetry.',
    highlight: 'Highlights TRL 5 roadmap milestone backed by 96.0% Top-3 accuracy and 100% security controls pass.'
  }
];

export default function SihDemoModal({ isOpen, onClose, onNavigate }) {
  const [currentStep, setCurrentStep] = useState(0);

  if (!isOpen) return null;

  const active = STEPS[currentStep];

  function handleGoToStep(idx) {
    setCurrentStep(idx);
    const stepTarget = STEPS[idx];
    if (onNavigate && stepTarget.page) {
      onNavigate(stepTarget.page);
    }
  }

  function handleNext() {
    if (currentStep < STEPS.length - 1) {
      handleGoToStep(currentStep + 1);
    }
  }

  function handlePrev() {
    if (currentStep > 0) {
      handleGoToStep(currentStep - 1);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="bg-slate-900 border border-cyan-500/40 rounded-3xl max-w-2xl w-full p-6 shadow-2xl relative overflow-hidden flex flex-col justify-between">
        
        {/* Glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 blur-3xl pointer-events-none"></div>

        <div>
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <span className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                <Sparkles className="w-5 h-5" />
              </span>
              <div>
                <span className="text-[11px] font-mono text-cyan-400 font-bold uppercase tracking-wider block">
                  SIH26184 Evaluator Walkthrough Guide
                </span>
                <h2 className="text-lg font-bold text-white">13-Step Guided Evaluation Protocol</h2>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Progress bar */}
          <div className="py-4">
            <div className="flex justify-between text-xs font-mono text-slate-400 mb-1.5">
              <span>Step {currentStep + 1} of {STEPS.length}</span>
              <span className="text-cyan-300 font-bold">{Math.round(((currentStep + 1) / STEPS.length) * 100)}% Completed</span>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all duration-300"
                style={{ width: `${((currentStep + 1) / STEPS.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Step Detail */}
          <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-5 my-2 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                {active.title}
              </h3>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/30">
                Route: /{active.page}
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              {active.summary}
            </p>

            <div className="p-3 bg-cyan-950/20 border border-cyan-500/20 rounded-xl text-xs text-cyan-200">
              <span className="font-semibold text-cyan-300 font-mono block mb-0.5">What to Observe:</span>
              {active.highlight}
            </div>
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-800 mt-2">
          <button
            onClick={handlePrev}
            disabled={currentStep === 0}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-mono font-semibold hover:bg-slate-700 disabled:opacity-30 transition-all"
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </button>

          <button
            onClick={() => handleGoToStep(currentStep)}
            className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-mono font-semibold transition-all shadow-md flex items-center gap-1.5"
          >
            Go to This View
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          {currentStep < STEPS.length - 1 ? (
            <button
              onClick={handleNext}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-mono font-semibold transition-all shadow-md shadow-cyan-950"
            >
              Next Step
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={onClose}
              className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-mono font-semibold transition-all shadow-md shadow-emerald-950"
            >
              Complete Tour
              <CheckCircle2 className="w-4 h-4" />
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
