import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  Radio, 
  Clock, 
  User, 
  LogOut, 
  LayoutGrid, 
  Plus, 
  GitFork, 
  MapPin, 
  Bell, 
  RotateCcw, 
  ChevronDown, 
  Sparkles, 
  Boxes, 
  Award, 
  Network, 
  CreditCard 
} from 'lucide-react';

export default function Navbar({ 
  activeCaseId, 
  onSelectCase, 
  onResetDataset, 
  currentUser, 
  onLogout,
  currentPage,
  onNavigate,
  onOpenCreateComplaint
}) {
  const [currentTimeStr, setCurrentTimeStr] = useState('');
  const [moreNavOpen, setMoreNavOpen] = useState(false);

  // Live IST Clock (Matches Screenshot 2)
  useEffect(() => {
    function updateClock() {
      const now = new Date();
      // Format: "Wed, 23 Sept, 2026 09:38:32 pm IST"
      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
      
      const dayName = days[now.getDay()];
      const dayNum = now.getDate();
      const monthName = months[now.getMonth()];
      const year = now.getFullYear();

      let hours = now.getHours();
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');
      const ampm = hours >= 12 ? 'pm' : 'am';
      hours = hours % 12;
      hours = hours ? hours : 12; // 0 becomes 12
      const hoursStr = String(hours).padStart(2, '0');

      setCurrentTimeStr(`${dayName}, ${dayNum} ${monthName}, ${year} ${hoursStr}:${minutes}:${seconds} ${ampm} IST`);
    }

    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  const officerId = currentUser?.officerId || currentUser?.badge || 'CYB-DEL-742';
  const department = currentUser?.department || 'Indian Cybercrime Coordination Centre (I4C)';

  return (
    <header className="bg-[#050811] border-b border-navy-800/80 sticky top-0 z-40 select-none shadow-xl">
      
      {/* ======================================================== */}
      {/* ROW 1: PRIMARY TASKBAR HEADER (MATCHES SCREENSHOT 2)    */}
      {/* ======================================================== */}
      <div className="px-5 py-2.5 flex items-center justify-between border-b border-navy-800/60 bg-[#070c1a]">
        
        {/* Left: Brand Identity & SIH Badge */}
        <div className="flex items-center gap-3">
          <button 
            onClick={() => onNavigate('dashboard')} 
            className="w-9 h-9 rounded-lg bg-[#0e162b] border border-orange-500/80 flex items-center justify-center shadow-lg shadow-orange-500/10 hover:border-orange-400 transition shrink-0"
            title="Return to Dashboard"
          >
            <Shield className="w-5 h-5 text-orange-500" strokeWidth={2.2} />
          </button>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-display font-extrabold text-base tracking-wide text-white">
                FORTIVEXA
              </span>
              <span className="font-display font-extrabold text-base tracking-wide text-cyan-400">
                INTELLIGENCE
              </span>
              <span className="bg-[#431407] border border-orange-600/70 text-orange-400 font-mono text-[10px] font-bold px-1.5 py-0.2 rounded">
                SIH26184
              </span>
            </div>
            
            <p className="text-[11px] text-slate-400 font-sans tracking-tight flex items-center gap-1.5">
              <span>Cybercrime Cash-Out Prediction & Interception</span>
              <span className="text-slate-600">•</span>
              <span className="text-slate-300">MHA / I4C Portal</span>
            </p>
          </div>
        </div>

        {/* Center-Left: NCRP Secure Feed Indicator */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#07191d] border border-teal-500/40 text-teal-400 font-mono text-xs shadow-inner">
          <Radio className="w-3.5 h-3.5 animate-pulse text-teal-300" />
          <span className="font-bold text-[11px] tracking-wide">
            NCRP SECURE FEED: ACTIVE
          </span>
        </div>

        {/* Center: Live Time IST */}
        <div className="hidden md:flex items-center gap-2 font-mono text-xs text-slate-300 px-3 py-1 rounded-lg bg-[#060b17] border border-navy-800">
          <Clock className="w-3.5 h-3.5 text-cyan-400" />
          <span className="text-[11px] font-semibold text-slate-200">
            {currentTimeStr || 'Wed, 23 Sept, 2026 09:38:32 pm IST'}
          </span>
        </div>

        {/* Right: Officer Profile & Exit Button */}
        <div className="flex items-center gap-3">
          
          {/* Officer Details */}
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-300 shrink-0">
              <User className="w-3.5 h-3.5" />
            </div>

            <div className="text-right">
              <div className="flex items-center justify-end gap-1.5 leading-none">
                <span className="text-xs font-bold font-mono text-white tracking-wide">
                  {officerId}
                </span>
                <span className="px-1.5 py-0.2 rounded bg-cyan-950 border border-cyan-700/60 text-cyan-300 font-mono text-[9px] font-bold">
                  LVL 4
                </span>
              </div>
              <span className="text-[10px] text-slate-400 block truncate max-w-[150px] sm:max-w-[210px] mt-0.5">
                {department}
              </span>
            </div>
          </div>

          {/* Exit Button (Matches Screenshot 2 "[→ Exit") */}
          <button
            onClick={onLogout}
            title="Log Out / Return to Login Portal"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-navy-700 bg-navy-900/60 hover:bg-rose-950/70 hover:border-rose-600/70 hover:text-rose-300 text-slate-300 text-xs font-mono font-medium transition"
          >
            <LogOut className="w-3.5 h-3.5 text-slate-400 group-hover:text-rose-400" />
            <span>Exit</span>
          </button>

        </div>

      </div>

      {/* ======================================================== */}
      {/* ROW 2: TASKBAR NAVIGATION TABS (MATCHES SCREENSHOT 2)     */}
      {/* ======================================================== */}
      <div className="px-5 py-1.5 bg-[#050811] flex items-center justify-between gap-3 overflow-x-auto text-xs font-sans">
        
        {/* Core Taskbar Tabs */}
        <div className="flex items-center gap-2 shrink-0">
          
          {/* Tab 1: Dashboard */}
          <button
            onClick={() => onNavigate('dashboard')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg font-medium transition ${
              currentPage === 'dashboard'
                ? 'bg-[#3c1407]/40 text-orange-400 border border-orange-500/80 font-semibold shadow-sm shadow-orange-500/10'
                : 'text-slate-400 hover:text-slate-200 hover:bg-navy-900'
            }`}
          >
            <LayoutGrid className={`w-3.5 h-3.5 ${currentPage === 'dashboard' ? 'text-orange-400' : 'text-slate-400'}`} />
            <span>Dashboard</span>
          </button>

          {/* Tab 2: + New Complaint Intake */}
          <button
            onClick={() => {
              if (onOpenCreateComplaint) {
                onOpenCreateComplaint();
              } else {
                onNavigate('complaints');
              }
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-navy-900 border border-transparent hover:border-navy-700 transition"
          >
            <Plus className="w-3.5 h-3.5 text-cyan-400" />
            <span>+ New Complaint Intake</span>
          </button>

          {/* Tab 3: Case Analysis */}
          <button
            onClick={() => onNavigate('linkage')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition ${
              currentPage === 'linkage' || currentPage === 'prediction'
                ? 'bg-cyan-950/60 text-cyan-300 border border-cyan-600/70 font-semibold'
                : 'text-slate-300 hover:text-white hover:bg-navy-900'
            }`}
          >
            <GitFork className="w-3.5 h-3.5 text-cyan-400" />
            <span>Case Analysis ({activeCaseId || 'CMP-2026-8941'})</span>
          </button>

          {/* Tab 4: Risk Map Hotspots */}
          <button
            onClick={() => onNavigate('map')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition ${
              currentPage === 'map'
                ? 'bg-purple-950/60 text-purple-300 border border-purple-600/70 font-semibold'
                : 'text-slate-300 hover:text-white hover:bg-navy-900'
            }`}
          >
            <MapPin className="w-3.5 h-3.5 text-purple-400" />
            <span>Risk Map Hotspots</span>
          </button>

          {/* Tab 5: Tactical Alerts */}
          <button
            onClick={() => onNavigate('intelligence')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition ${
              currentPage === 'intelligence'
                ? 'bg-rose-950/60 text-rose-300 border border-rose-600/70 font-semibold'
                : 'text-slate-300 hover:text-white hover:bg-navy-900'
            }`}
          >
            <Bell className="w-3.5 h-3.5 text-rose-400" />
            <span>Tactical Alerts</span>
            <span className="w-4 h-4 rounded-full bg-rose-600 text-white text-[10px] font-bold font-mono flex items-center justify-center">
              4
            </span>
          </button>

        </div>

        {/* Quick Module Switcher & Case Context */}
        <div className="flex items-center gap-2 shrink-0">
          
          {/* Active Case Selector */}
          <div className="flex items-center gap-1.5 bg-[#0a1124] px-2.5 py-1 rounded-lg border border-navy-700/80 font-mono text-[11px]">
            <span className="text-slate-400">FIR:</span>
            <select
              value={activeCaseId}
              onChange={(e) => onSelectCase(e.target.value)}
              className="bg-transparent text-cyan-300 font-bold focus:outline-none cursor-pointer"
            >
              <optgroup label="Guided Walkthrough Cases">
                <option value="CMP-1001" className="bg-[#0c1427]">CMP-1001 (UPI ₹95k)</option>
                <option value="CMP-1002" className="bg-[#0c1427]">CMP-1002 (Task ₹142k)</option>
                <option value="CMP-1003" className="bg-[#0c1427]">CMP-1003 (Trade ₹210k)</option>
                <option value="CMP-1004" className="bg-[#0c1427]">CMP-1004 (Bill ₹68k)</option>
                <option value="CMP-1005" className="bg-[#0c1427]">CMP-1005 (Loan ₹185k)</option>
                <option value="CMP-1006" className="bg-[#0c1427]">CMP-1006 (SIM ₹74k)</option>
                <option value="CMP-1007" className="bg-[#0c1427]">CMP-1007 (Crypto ₹320k)</option>
                <option value="CMP-1008" className="bg-[#0c1427]">CMP-1008 (Card ₹115k)</option>
              </optgroup>
              <optgroup label="Cross-Case Linked Rings">
                <option value="CMP-1014" className="bg-[#0c1427]">CMP-1014 (Shares Mule ACC-004)</option>
                <option value="CMP-1019" className="bg-[#0c1427]">CMP-1019 (Shares Mule ACC-005)</option>
                <option value="CMP-1028" className="bg-[#0c1427]">CMP-1028 (Apex Syndicate)</option>
              </optgroup>
            </select>
          </div>

          {/* Reset Demo Data */}
          <button
            onClick={onResetDataset}
            title="Reset dataset back to default 128 clean cases"
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-navy-900 hover:bg-navy-800 text-slate-300 border border-navy-700 text-[11px] font-mono transition"
          >
            <RotateCcw className="w-3 h-3 text-cyan-400" />
            <span className="hidden sm:inline">Reset</span>
          </button>

        </div>

      </div>

    </header>
  );
}
