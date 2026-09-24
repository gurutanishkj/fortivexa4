import React, { useState } from 'react';
import { Layers, Activity, Sliders, CheckCircle2, TrendingUp, Cpu } from 'lucide-react';
import { retrainModel } from '../services/api';

const EXPERIMENTS = [
  {
    id: 'EXP-001',
    name: 'XGBoost Primary (TRL 5 Candidate)',
    model_type: 'XGBoost Classifier',
    params: { n_estimators: 100, max_depth: 5, learning_rate: 0.08 },
    metrics: { accuracy: '94.2%', top3_precision: '96.0%', recall: '90.8%', roc_auc: '95.8%' },
    status: 'DEPLOYED_ACTIVE'
  },
  {
    id: 'EXP-002',
    name: 'Random Forest Ensemble Baseline',
    model_type: 'Random Forest (50 Trees)',
    params: { n_estimators: 50, max_depth: 6, criterion: 'gini' },
    metrics: { accuracy: '89.4%', top3_precision: '91.2%', recall: '86.5%', roc_auc: '92.1%' },
    status: 'BENCHMARKED'
  },
  {
    id: 'EXP-003',
    name: 'Linear Logistic Baseline',
    model_type: 'Logistic Regression L2',
    params: { C: 1.0, max_iter: 200, solver: 'lbfgs' },
    metrics: { accuracy: '78.6%', top3_precision: '82.0%', recall: '73.4%', roc_auc: '81.5%' },
    status: 'BENCHMARKED'
  }
];

export default function ExperimentManagerPage() {
  const [experiments, setExperiments] = useState(EXPERIMENTS);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 bg-purple-500/20 text-purple-300 border border-purple-500/30 rounded-full text-xs font-mono font-semibold">
              ML EXPERIMENT REGISTRY
            </span>
            <span className="px-2.5 py-0.5 rounded text-xs font-mono bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-bold">
              CROSS-ALGORITHM COMPARISON
            </span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Experiment & Model Benchmark Manager</h1>
          <p className="text-slate-400 text-sm mt-1">
            Comparative performance telemetry across XGBoost, Random Forest ensembles, and linear baselines evaluated on identical holdout test distributions.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-cyan-300 bg-cyan-950/40 px-3 py-2 rounded-xl border border-cyan-500/30">
          <Cpu className="w-4 h-4" />
          <span>Champion Model: EXP-001 (XGBoost 96.0% Top-3)</span>
        </div>
      </div>

      {/* Experiments List */}
      <div className="space-y-4">
        {experiments.map((exp) => {
          const isActive = exp.status === 'DEPLOYED_ACTIVE';
          return (
            <div
              key={exp.id}
              className={`p-6 rounded-2xl border transition-all ${
                isActive 
                  ? 'bg-slate-900/90 border-cyan-500/50 shadow-lg shadow-cyan-950/20 ring-1 ring-cyan-500/30' 
                  : 'bg-slate-900/60 border-slate-800'
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
                <div>
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono text-xs font-bold text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-500/30">
                      {exp.id}
                    </span>
                    <h3 className="font-bold text-white text-base">{exp.name}</h3>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                      isActive ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-slate-800 text-slate-400'
                    }`}>
                      {exp.status}
                    </span>
                  </div>
                  <span className="text-xs text-slate-400 font-mono mt-1 block">Architecture: {exp.model_type}</span>
                </div>

                {/* Hyperparams chip */}
                <div className="flex items-center gap-2 text-xs font-mono text-slate-400 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800">
                  <Sliders className="w-3.5 h-3.5 text-slate-500" />
                  <span>{JSON.stringify(exp.params).replace(/["{}]/g, '')}</span>
                </div>
              </div>

              {/* Metrics strip */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 font-mono">
                <div>
                  <span className="text-[11px] text-slate-500 block mb-0.5">Top-3 Precision</span>
                  <div className="text-xl font-bold text-emerald-400">{exp.metrics.top3_precision}</div>
                </div>
                <div>
                  <span className="text-[11px] text-slate-500 block mb-0.5">ROC-AUC</span>
                  <div className="text-xl font-bold text-cyan-300">{exp.metrics.roc_auc}</div>
                </div>
                <div>
                  <span className="text-[11px] text-slate-500 block mb-0.5">Holdout Accuracy</span>
                  <div className="text-xl font-bold text-slate-200">{exp.metrics.accuracy}</div>
                </div>
                <div>
                  <span className="text-[11px] text-slate-500 block mb-0.5">Recall</span>
                  <div className="text-xl font-bold text-slate-200">{exp.metrics.recall}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
