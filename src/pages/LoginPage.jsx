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
  ShieldCheck 
} from 'lucide-react';

export default function LoginPage({ onLoginSuccess }) {
  const [officerId, setOfficerId] = useState('CYB-DEL-742');
  const [password, setPassword] = useState('password12345');
  const [department, setDepartment] = useState('Indian Cybercrime Coordination Centre (I4C)');

  function handleSubmit(e) {
    e.preventDefault();
    onLoginSuccess({
      officerId: officerId || 'CYB-DEL-742',
      badge: officerId || 'CYB-DEL-742',
      level: 'LVL 4',
      department: department || 'Indian Cybercrime Coordination Centre (I4C)',
      role: 'Law Enforcement Intelligence Officer',
      name: `Officer ${officerId || 'CYB-DEL-742'}`
    });
  }

  return (
    <div className="min-h-screen bg-[#050811] text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200 tactical-grid relative overflow-hidden">
      
      {/* 1. Government of India Top Bar (Matches Screenshot 1) */}
      <header className="w-full px-6 py-4 flex items-center justify-between border-b border-navy-800/80 bg-[#050811]/90 backdrop-blur-md z-10">
        
        {/* Left: Ministry Details */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-[#0e162b] border border-orange-500/80 flex items-center justify-center shadow-lg shadow-orange-500/10 shrink-0">
            <Shield className="w-5 h-5 text-orange-500" strokeWidth={2.2} />
          </div>
          <div>
            <h1 className="text-xs font-bold text-white uppercase tracking-wider font-sans">
              GOVERNMENT OF INDIA
            </h1>
            <p className="text-[11px] text-slate-400 font-sans">
              Ministry of Home Affairs • Cyber and Information Security (CIS) Division
            </p>
          </div>
        </div>

        {/* Right: Security Status Pill */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#091a1e] border border-emerald-500/40 text-emerald-400 font-mono text-xs">
          <Radio className="w-3.5 h-3.5 animate-pulse text-emerald-400" />
          <span className="font-semibold tracking-wide">
            SERVER SECURE // SSL 4096-BIT
          </span>
        </div>

      </header>

      {/* 2. Main Login Content (Matches Screenshot 1 Card) */}
      <main className="flex-1 flex items-center justify-center p-4 relative z-10">
        <div className="max-w-[440px] w-full bg-[#0c1427] border border-[#1b2b4d] rounded-2xl p-8 shadow-2xl relative">
          
          {/* Corner Brackets */}
          <div className="absolute -top-[1px] -left-[1px] w-5 h-5 border-t-2 border-l-2 border-orange-500 rounded-tl-xl pointer-events-none" />
          <div className="absolute -top-[1px] -right-[1px] w-5 h-5 border-t-2 border-r-2 border-cyan-400 rounded-tr-xl pointer-events-none" />

          {/* Centered Orange Shield Icon */}
          <div className="w-12 h-12 rounded-xl bg-[#0e172e] border border-orange-500/70 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-orange-500/15">
            <Shield className="w-6 h-6 text-orange-500" strokeWidth={2} />
          </div>

          {/* Titles */}
          <div className="text-center mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-wide font-display">
              Cybercrime Cash-Out
            </h2>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-wide font-display mt-0.5">
              Prediction Portal
            </h2>

            {/* SIH Badge */}
            <div className="inline-flex items-center gap-2 mt-3 px-3 py-1 rounded-md bg-[#2f140a] border border-orange-700/60">
              <span className="text-[11px] font-mono font-bold text-orange-400 bg-orange-950 px-1 rounded">
                SIH26184
              </span>
              <span className="text-[11px] text-slate-300 font-sans">
                Law Enforcement Intelligence Console
              </span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Field 1: Officer ID */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5 font-sans">
                Officer ID / Service Number
              </label>
              <div className="bg-[#060b17] border border-[#1e293b] rounded-lg px-3.5 py-2.5 flex items-center gap-2.5 focus-within:border-cyan-500 transition">
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
              <label className="block text-xs font-medium text-slate-300 mb-1.5 font-sans">
                Security Password / Token PIN
              </label>
              <div className="bg-[#060b17] border border-[#1e293b] rounded-lg px-3.5 py-2.5 flex items-center gap-2.5 focus-within:border-cyan-500 transition">
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
              <label className="block text-xs font-medium text-slate-300 mb-1.5 font-sans">
                Department / Operational Wing
              </label>
              <div className="bg-[#060b17] border border-[#1e293b] rounded-lg px-3.5 py-2.5 flex items-center gap-2.5 focus-within:border-cyan-500 transition relative">
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
              className="w-full mt-2 py-3 px-4 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-black font-bold text-xs uppercase tracking-wider rounded-lg flex items-center justify-center gap-2 shadow-lg shadow-orange-500/25 transition active:scale-[0.99]"
            >
              <span>SECURE LOGIN</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Prototype Mode Info Box */}
            <div className="mt-3 p-3 rounded-lg bg-[#060b17]/90 border border-navy-800 flex items-start gap-2.5 text-[11px] font-mono text-slate-300">
              <AlertCircle className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
              <p className="leading-snug">
                Prototype Mode: Enter any ID to access command console
              </p>
            </div>

          </form>

          {/* Academic Proof of Concept Disclaimer */}
          <div className="mt-5 pt-3 border-t border-navy-800 text-center">
            <span className="inline-flex items-center gap-1.5 text-[10px] text-cyan-400/80 font-mono">
              <ShieldCheck className="w-3 h-3 text-cyan-400" />
              FORTIVEXA | TRL 3 Experimental Proof-of-Concept • Demo Data Only
            </span>
          </div>

        </div>
      </main>

    </div>
  );
}
