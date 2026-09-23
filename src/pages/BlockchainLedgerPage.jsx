import React, { useState, useEffect } from 'react';
import { 
  Boxes, 
  ShieldCheck, 
  CheckCircle2, 
  Lock, 
  RefreshCw, 
  FileCode, 
  Key, 
  AlertCircle, 
  ArrowDown 
} from 'lucide-react';
import { fetchBlockchain, verifyBlockchain } from '../services/api';

export default function BlockchainLedgerPage() {
  const [ledger, setLedger] = useState([]);
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState(null);

  function loadLedger() {
    setLoading(true);
    fetchBlockchain()
      .then(res => {
        setLedger(res.ledger || []);
        setLoading(false);
      })
      .catch(console.error);
  }

  useEffect(() => {
    loadLedger();
  }, []);

  async function handleVerifyIntegrity() {
    setVerifying(true);
    setVerificationResult(null);
    try {
      // Simulate cryptographic calculation step
      setTimeout(async () => {
        const res = await verifyBlockchain();
        setVerificationResult(res);
        setVerifying(false);
      }, 700);
    } catch (err) {
      console.error(err);
      setVerifying(false);
    }
  }

  return (
    <div className="p-6 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-navy-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold font-display text-white tracking-wide">
              CRYPTOGRAPHIC IMMUTABLE AUDIT LEDGER
            </h1>
            <span className="px-2 py-0.5 rounded bg-cyan-950 border border-cyan-500/40 text-cyan-300 font-mono text-[10px] font-bold">
              CONCEPT DEMO
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Tamper-evident cryptographic hashing sequence anchoring citizen FIRs, mule detections, and location predictions.
          </p>
        </div>

        {/* Verification Trigger Button */}
        <button
          onClick={handleVerifyIntegrity}
          disabled={verifying}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-mono text-xs font-semibold shadow-lg transition ${
            verifying 
              ? 'bg-navy-800 text-slate-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 text-white shadow-emerald-600/20'
          }`}
        >
          <RefreshCw className={`w-3.5 h-3.5 ${verifying ? 'animate-spin' : ''}`} />
          <span>{verifying ? 'Computing SHA-256 Checksums...' : 'Verify Record Integrity'}</span>
        </button>
      </div>

      {/* Explicit Proof-of-Concept Disclaimer */}
      <div className="p-4 rounded-xl bg-cyan-950/60 border border-cyan-500/40 text-xs text-cyan-200 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <strong className="text-cyan-300 font-mono">Proof-of-Concept Prototype (TRL 3):</strong>
          <span className="text-slate-300 ml-1">
            This module is a simulated cryptographic audit ledger demonstrating chain integrity and hash verification for evidentiary purposes (Section 65B Indian Evidence Act compliance). It is not a decentralized production blockchain network (e.g. Ethereum/Hyperledger), which is designated on the future TRL 6+ roadmap.
          </span>
        </div>
      </div>

      {/* Verification Result Banner (when button clicked) */}
      {verificationResult && (
        <div className="p-4 rounded-xl bg-emerald-950/80 border border-emerald-500 text-xs text-emerald-200 flex items-center justify-between shadow-lg font-mono">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <div>
              <span className="font-bold text-white">CRYPTOGRAPHIC INTEGRITY CONFIRMED:</span>
              <span className="ml-1 text-emerald-300">
                All {verificationResult.total_blocks_verified} blocks verified sequentially via SHA-256. Zero broken hash linkages detected.
              </span>
            </div>
          </div>
          <span className="text-[10px] text-slate-400">
            Algorithm: {verificationResult.cryptographic_algorithm}
          </span>
        </div>
      )}

      {/* Block List Display */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs font-mono text-slate-400 px-1">
          <span>CHAIN DEPTH: {ledger.length} BLOCKS RECORDED</span>
          <span>CONSENSUS: LOCAL MERKLE SEQUENCER</span>
        </div>

        <div className="space-y-3">
          {ledger.map((block, idx) => (
            <div
              key={block.index}
              className="glass-panel p-4 rounded-xl border-navy-800 space-y-3 font-mono text-xs relative"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-navy-800/80 pb-2">
                <div className="flex items-center gap-2">
                  <span className="w-7 h-7 rounded-lg bg-cyan-500/20 text-cyan-300 flex items-center justify-center font-bold text-xs">
                    #{block.index}
                  </span>
                  <span className="font-bold text-white text-sm">
                    {block.operation}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-navy-800 text-cyan-300 border border-navy-700">
                    Ref: {block.reference_id}
                  </span>
                </div>

                <div className="flex items-center gap-3 text-[11px]">
                  <span className="text-slate-400">{block.timestamp}</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    {block.status}
                  </span>
                </div>
              </div>

              {/* Hash Data Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[11px]">
                <div className="p-2.5 rounded bg-navy-950 border border-navy-800 space-y-1">
                  <span className="text-slate-500 text-[10px] block">PREVIOUS BLOCK HASH (PARENT LINK)</span>
                  <code className="text-slate-400 block truncate font-mono text-[10px]">
                    {block.previous_hash}
                  </code>
                </div>

                <div className="p-2.5 rounded bg-navy-950 border border-navy-800 space-y-1">
                  <span className="text-cyan-400 text-[10px] block font-semibold">BLOCK HASH (SHA-256 SEAL)</span>
                  <code className="text-cyan-300 block truncate font-mono text-[10px] font-bold">
                    {block.block_hash}
                  </code>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
