import React, { useState, useEffect } from 'react';
import { Shield, Lock, Key, FileText, CheckCircle2, Play, Activity, AlertOctagon } from 'lucide-react';
import { fetchSecurityTests } from '../services/api';

export default function SecurityCenterPage() {
  const [suite, setSuite] = useState(null);
  const [running, setRunning] = useState(false);

  async function loadTests() {
    setRunning(true);
    try {
      const data = await fetchSecurityTests();
      setSuite(data);
    } catch (e) {
      console.error(e);
    } finally {
      setRunning(false);
    }
  }

  useEffect(() => {
    loadTests();
  }, []);

  const tests = suite?.tests || [];
  const passed = tests.filter(t => t.status === 'PASS').length;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full text-xs font-mono font-semibold">
              CYBERSECURITY CONTROL SUITE
            </span>
            <span className="px-2.5 py-0.5 rounded text-xs font-mono bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              AES-256-GCM • TLS 1.3 • RBAC
            </span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Security & Cryptographic Compliance Center</h1>
          <p className="text-slate-400 text-sm mt-1">
            Automated execution of technical controls SEC-001 through SEC-010. Validates encryption at rest, token signing, SQL injection prevention, and credential redaction.
          </p>
        </div>

        <button
          onClick={loadTests}
          disabled={running}
          className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-medium text-sm shadow-lg shadow-emerald-950 transition-all disabled:opacity-50"
        >
          {running ? (
            <>
              <Activity className="w-4 h-4 animate-spin" />
              Running SEC-001..010...
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-current" />
              Run Security Test Suite
            </>
          )}
        </button>
      </div>

      {/* Control Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center gap-2 text-cyan-400 mb-1">
            <Lock className="w-4 h-4" />
            <span className="text-xs font-mono uppercase">Encryption At Rest</span>
          </div>
          <div className="text-lg font-bold text-white">AES-256-GCM</div>
          <p className="text-[11px] text-slate-400 mt-1">96-bit random nonce + 128-bit authentication tag per record.</p>
        </div>

        <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center gap-2 text-emerald-400 mb-1">
            <Key className="w-4 h-4" />
            <span className="text-xs font-mono uppercase">Access Control</span>
          </div>
          <div className="text-lg font-bold text-white">RBAC 3-Tier Policy</div>
          <p className="text-[11px] text-slate-400 mt-1">ADMIN, ANALYST, VIEWER with strict 403 authorization gates.</p>
        </div>

        <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center gap-2 text-amber-400 mb-1">
            <Shield className="w-4 h-4" />
            <span className="text-xs font-mono uppercase">Password Security</span>
          </div>
          <div className="text-lg font-bold text-white">PBKDF2-HMAC-SHA256</div>
          <p className="text-[11px] text-slate-400 mt-1">100,000 hash iterations with cryptographically random salts.</p>
        </div>

        <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center gap-2 text-rose-400 mb-1">
            <FileText className="w-4 h-4" />
            <span className="text-xs font-mono uppercase">Audit Shield</span>
          </div>
          <div className="text-lg font-bold text-white">Zero Raw Secret Leakage</div>
          <p className="text-[11px] text-slate-400 mt-1">Automatic redaction of tokens, passwords, and keys before audit storage.</p>
        </div>
      </div>

      {/* Security Test Table */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl backdrop-blur-md">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <h2 className="text-sm font-mono text-cyan-400 uppercase tracking-wider">
              Technical Security Verification Matrix
            </h2>
            <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-mono font-bold">
              {passed} / {tests.length} Controls Verified
            </span>
          </div>
          <span className="text-xs font-mono text-slate-500">Live Execution Results</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-mono">
                <th className="py-2.5 px-3">Control ID</th>
                <th className="py-2.5 px-3">Security Name & Scope</th>
                <th className="py-2.5 px-3">Test Input</th>
                <th className="py-2.5 px-3">Expected Outcome</th>
                <th className="py-2.5 px-3">Actual Measured Result</th>
                <th className="py-2.5 px-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {tests.map((t) => (
                <tr key={t.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-3 px-3 font-bold text-cyan-400">{t.id}</td>
                  <td className="py-3 px-3">
                    <div className="font-semibold text-white font-sans text-xs">{t.name}</div>
                    <span className="text-[10px] text-slate-500 font-mono">{t.scope}</span>
                  </td>
                  <td className="py-3 px-3 text-slate-400 max-w-xs truncate" title={t.input}>
                    {t.input}
                  </td>
                  <td className="py-3 px-3 text-amber-200/80 max-w-xs truncate" title={t.expected}>
                    {t.expected}
                  </td>
                  <td className="py-3 px-3 text-emerald-300 max-w-sm truncate" title={t.actual}>
                    {t.actual}
                  </td>
                  <td className="py-3 px-3">
                    <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                      t.status === 'PASS' 
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' 
                        : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                    }`}>
                      {t.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
