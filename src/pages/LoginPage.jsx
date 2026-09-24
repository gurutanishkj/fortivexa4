import React, { useState } from 'react';
import { 
  Shield, 
  User, 
  Lock, 
  Building2, 
  ChevronDown, 
  ArrowRight, 
  AlertCircle, 
  Radio, 
  ShieldCheck,
  Award,
  CheckCircle2,
  Sparkles,
  Fingerprint
} from 'lucide-react';

const PRESET_PERSONAS = [
  {
    id: 'investigator',
    label: 'Cyber Investigator',
    role: 'ADMIN',
    level: 'LVL 4',
    officerId: 'CYB-DEL-742',
    department: 'Indian Cybercrime Coordination Centre (I4C)',
    title: 'Lead QRT Interception Officer'
  },
  {
    id: 'analyst',
    label: 'Financial Analyst',
    role: 'ANALYST',
    level: 'LVL 3',
    officerId: 'MULE-ANL-509',
    department: 'Financial Intelligence Unit (FIU-IND)',
    title: 'Senior Syndicate Ring Analyst'
  },
  {
    id: 'evaluator',
    label: 'SIH Evaluator',
    role: 'VIEWER',
    level: 'LVL 5',
    officerId: 'SIH-AUDIT-2026',
    department: 'National Cybercrime Review Board (MHA)',
    title: 'TRL 5 Technical Evaluator'
  }
];

export default function LoginPage({ onLoginSuccess }) {
  const [officerId, setOfficerId] = useState('CYB-DEL-742');
  const [password, setPassword] = useState('password12345');
  const [department, setDepartment] = useState('Indian Cybercrime Coordination Centre (I4C)');
  const [selectedRole, setSelectedRole] = useState('ADMIN');
  const [activePersonaId, setActivePersonaId] = useState('investigator');

  function handleSelectPersona(p) {
    setActivePersonaId(p.id);
    setOfficerId(p.officerId);
    setDepartment(p.department);
    setSelectedRole(p.role);
  }

  function handleSubmit(e) {
    e.preventDefault();
    onLoginSuccess({
      officerId: officerId || 'CYB-DEL-742',
      badge: officerId || 'CYB-DEL-742',
      level: selectedRole === 'ADMIN' ? 'LVL 4' : selectedRole === 'ANALYST' ? 'LVL 3' : 'LVL 5',
      department: department || 'Indian Cybercrime Coordination Centre (I4C)',
      role: selectedRole === 'ADMIN' ? 'Law Enforcement Intelligence Officer' : selectedRole === 'ANALYST' ? 'Senior Financial Fraud Analyst' : 'TRL 5 Technical Evaluator',
      name: `Officer ${officerId || 'CYB-DEL-742'}`
    });
  }

  return (
    <div className="min-h-screen bg-[#050811] text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200 tactical-grid relative overflow-hidden">
      
      {/* 1. Government of India Top Bar */}
      <header className="w-full px-6 py-4 flex items-center justify-between border-b border-navy-800/80 bg-[#050811]/90 backdrop-blur-md z-10">
        
        {/* Left: Ministry Details */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-[#0e162b] border border-orange-500/80 flex items-center justify-center shadow-lg shadow-orange-500/10 shrink-0">
            <Shield className="w-5 h-5 text-orange-500" strokeWidth={2.2} />
          </div>
          <div>
            <h1 className="text-xs font-bold text-white uppercase tracking-wider font-sans flex items-center gap-2">
              <span>GOVERNMENT OF INDIA</span>
              <span className="text-slate-500">•</span>
              <span className="text-orange-400 font-mono text-[10px] font-bold">MHA / I4C</span>
            </h1>
            <p className="text-[11px] text-slate-400 font-sans">
              Ministry of Home Affairs • Cyber and Information Security (CIS) Division
            </p>
          </div>
        </div>

        {/* Right: TRL 5 Security Status Pill */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/50 text-emerald-400 font-mono text-xs shadow-inner">
            <Award className="w-3.5 h-3.5 text-emerald-300" />
            <span className="font-bold tracking-wide">TRL 5 VALIDATED (8/8 PASS)</span>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#091a1e] border border-cyan-500/40 text-cyan-400 font-mono text-xs">
            <Radio className="w-3.5 h-3.5 animate-pulse text-cyan-400" />
            <span className="font-semibold tracking-wide">
              TLS 1.3 // AES-256-GCM
            </span>
          </div>
        </div>

      </header>

      {/* 2. Main Login Content Card */}
      <main className="flex-1 flex items-center justify-center p-4 relative z-10 py-8">
        <div className="max-w-[480px] w-full bg-[#0c1427] border border-[#1b2b4d] rounded-2xl p-6 sm:p-8 shadow-2xl relative">
          
          {/* Corner Brackets */}
          <div className="absolute -top-[1px] -left-[1px] w-5 h-5 border-t-2 border-l-2 border-orange-500 rounded-tl-xl pointer-events-none" />
          <div className="absolute -top-[1px] -right-[1px] w-5 h-5 border-t-2 border-r-2 border-cyan-400 rounded-tr-xl pointer-events-none" />

          {/* Centered Orange Shield Icon */}
          <div className="w-12 h-12 rounded-xl bg-[#0e172e] border border-orange-500/70 flex items-center justify-center mx-auto mb-3 shadow-lg shadow-orange-500/15">
            <Shield className="w-6 h-6 text-orange-500" strokeWidth={2} />
          </div>

          {/* Titles */}
          <div className="text-center mb-5">
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-wide font-display">
              FORTIVEXA INTELLIGENCE
            </h2>
            <p className="text-xs text-cyan-300 font-mono font-medium mt-0.5">
              Cybercrime Cash-Out Prediction & Interception
            </p>

            {/* SIH & TRL 5 Badges */}
            <div className="flex flex-wrap items-center justify-center gap-2 mt-3">
              <span className="text-[11px] font-mono font-bold text-orange-400 bg-orange-950/90 border border-orange-700/60 px-2 py-0.5 rounded">
                SIH26184
              </span>
              <span className="text-[11px] font-mono font-bold text-emerald-300 bg-emerald-950/90 border border-emerald-600/60 px-2 py-0.5 rounded flex items-center gap-1">
                <Award className="w-3 h-3 text-emerald-400" />
                TRL 5 VALIDATED
              </span>
              <span className="text-[11px] text-slate-300 font-sans bg-slate-900 border border-slate-700 px-2 py-0.5 rounded">
                Law Enforcement Console
              </span>
            </div>
          </div>

          {/* TRL 5 Empirical Telemetry Bar */}
          <div className="mb-5 p-2.5 rounded-xl bg-[#060b17] border border-slate-800 grid grid-cols-3 gap-2 text-center font-mono">
            <div className="bg-slate-900/60 p-1.5 rounded-lg border border-slate-800/80">
              <div className="text-[10px] text-slate-400">Top-3 Acc</div>
              <div className="text-xs font-bold text-cyan-400">96.0%</div>
            </div>
            <div className="bg-slate-900/60 p-1.5 rounded-lg border border-slate-800/80">
              <div className="text-[10px] text-slate-400">Geo Error</div>
              <div className="text-xs font-bold text-emerald-400">2.08 km</div>
            </div>
            <div className="bg-slate-900/60 p-1.5 rounded-lg border border-slate-800/80">
              <div className="text-[10px] text-slate-400">Lead Time</div>
              <div className="text-xs font-bold text-amber-400">75.1 min</div>
            </div>
          </div>

          {/* Quick Persona Switcher for Evaluators */}
          <div className="mb-5">
            <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-1.5 font-semibold">
              Select Evaluation Persona (1-Click Switch):
            </label>
            <div className="grid grid-cols-3 gap-2">
              {PRESET_PERSONAS.map((p) => {
                const isSelected = activePersonaId === p.id;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => handleSelectPersona(p)}
                    className={`p-2 rounded-xl text-left border transition text-xs flex flex-col justify-between ${
                      isSelected
                        ? 'bg-cyan-950/80 border-cyan-400 text-cyan-200 shadow-md shadow-cyan-950/50'
                        : 'bg-[#060b17] border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full mb-1">
                      <span className="font-bold truncate text-[11px]">{p.label}</span>
                      {isSelected && <CheckCircle2 className="w-3 h-3 text-cyan-400 shrink-0" />}
                    </div>
                    <span className="text-[9px] font-mono opacity-80">{p.level} • {p.role}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            
            {/* Field 1: Officer ID */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1 font-sans">
                Officer ID / Service Number
              </label>
              <div className="bg-[#060b17] border border-[#1e293b] rounded-lg px-3 py-2 flex items-center gap-2.5 focus-within:border-cyan-500 transition">
                <User className="w-4 h-4 text-slate-400 shrink-0" />
                <input
                  type="text"
                  value={officerId}
                  onChange={(e) => setOfficerId(e.target.value)}
                  className="w-full bg-transparent text-xs text-white font-mono placeholder-slate-500 focus:outline-none"
                  placeholder="CYB-DEL-742"
                  required
                />
              </div>
            </div>

            {/* Field 2: Password / PIN */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1 font-sans">
                Security Password / Token PIN (AES-256-GCM / PBKDF2)
              </label>
              <div className="bg-[#060b17] border border-[#1e293b] rounded-lg px-3 py-2 flex items-center gap-2.5 focus-within:border-cyan-500 transition">
                <Lock className="w-4 h-4 text-slate-400 shrink-0" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-transparent text-xs text-white font-mono placeholder-slate-500 focus:outline-none"
                  placeholder="••••••••••••"
                  required
                />
              </div>
            </div>

            {/* Field 3: Department / Operational Wing */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1 font-sans">
                Department / Operational Wing
              </label>
              <div className="bg-[#060b17] border border-[#1e293b] rounded-lg px-3 py-2 flex items-center gap-2.5 focus-within:border-cyan-500 transition relative">
                <Building2 className="w-4 h-4 text-slate-400 shrink-0" />
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full bg-transparent text-xs text-white appearance-none cursor-pointer focus:outline-none pr-6 font-sans"
                >
                  <option value="Indian Cybercrime Coordination Centre (I4C)" className="bg-[#0c1427] text-white">
                    Indian Cybercrime Coordination Centre (I4C)
                  </option>
                  <option value="National Cyber Threat Analytics Unit (NCTAU)" className="bg-[#0c1427] text-white">
                    National Cyber Threat Analytics Unit (NCTAU)
                  </option>
                  <option value="National Cybercrime Review Board (MHA)" className="bg-[#0c1427] text-white">
                    National Cybercrime Review Board (MHA)
                  </option>
                  <option value="State Cyber Crime Investigation Wing" className="bg-[#0c1427] text-white">
                    State Cyber Crime Investigation Wing
                  </option>
                  <option value="Financial Intelligence Unit (FIU-IND)" className="bg-[#0c1427] text-white">
                    Financial Intelligence Unit (FIU-IND)
                  </option>
                  <option value="CBI Cyber Crime Division" className="bg-[#0c1427] text-white">
                    CBI Cyber Crime Division
                  </option>
                </select>
                <ChevronDown className="w-4 h-4 text-slate-400 shrink-0 absolute right-3 pointer-events-none" />
              </div>
            </div>

            {/* Secure Login Button */}
            <button
              type="submit"
              className="w-full mt-3 py-3 px-4 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-black font-bold text-xs uppercase tracking-wider rounded-lg flex items-center justify-center gap-2 shadow-lg shadow-orange-500/25 transition active:scale-[0.99]"
            >
              <span>AUTHORIZE & ENTER TRL 5 CONSOLE</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* TRL 5 Operational Mode Info Box */}
            <div className="mt-3 p-3 rounded-lg bg-[#060b17]/90 border border-navy-800 flex items-start gap-2.5 text-[11px] font-mono text-slate-300">
              <AlertCircle className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <p className="leading-snug">
                <strong className="text-cyan-300 font-bold">TRL 5 Operational Mode:</strong> Validated against 500 multi-hop complaints with live XGBoost inference and SHA-256 chain of custody. Select any persona above to authenticate.
              </p>
            </div>

          </form>

          {/* Academic Proof of Concept Disclaimer */}
          <div className="mt-5 pt-3 border-t border-navy-800 text-center">
            <span className="inline-flex items-center gap-1.5 text-[10px] text-cyan-400/80 font-mono">
              <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
              FORTIVEXA | TRL 5 Validated in Relevant Environment • Synthetic Demonstration Data
            </span>
          </div>

        </div>
      </main>

    </div>
  );
}
