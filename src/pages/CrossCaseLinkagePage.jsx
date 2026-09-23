import React, { useState, useEffect } from 'react';
import { 
  GitMerge, 
  ShieldAlert, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowRight, 
  Building2, 
  Users, 
  Activity, 
  Compass, 
  ExternalLink 
} from 'lucide-react';
import { fetchCaseLinkage, fetchAllRings } from '../services/api';
import MuleGraphVisualizer from '../components/MuleGraphVisualizer';

export default function CrossCaseLinkagePage({ activeCaseId, onSelectCase, onNavigate }) {
  const [currentCaseId, setCurrentCaseId] = useState(activeCaseId || 'CMP-1001');
  const [linkageData, setLinkageData] = useState(null);
  const [allRings, setAllRings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllRings()
      .then(res => setAllRings(res.detected_rings || []))
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (activeCaseId && activeCaseId !== currentCaseId) {
      setCurrentCaseId(activeCaseId);
    }
  }, [activeCaseId]);

  useEffect(() => {
    setLoading(true);
    fetchCaseLinkage(currentCaseId)
      .then(data => {
        setLinkageData(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [currentCaseId]);

  const targetCase = linkageData?.target_case;
  const linkedCases = linkageData?.linked_cases || [];
  const sharedEntities = linkageData?.shared_entities || [];
  const ring = linkageData?.affiliated_ring;
  const subgraph = linkageData?.subgraph || { nodes: [], edges: [] };

  return (
    <div className="p-6 space-y-6">
      
      {/* Header & Core Innovation Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-navy-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold font-display text-white tracking-wide">
              CROSS-CASE MULE RING DETECTOR
            </h1>
            <span className="px-2 py-0.5 rounded bg-rose-950 border border-rose-500/50 text-rose-300 font-mono text-[10px] font-bold">
              CORE INNOVATION
            </span>
            <span className="px-1.5 py-0.5 rounded bg-cyan-950 border border-cyan-800 text-cyan-300 font-mono text-[10px]">
              GRAPH-BACKED
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Detects recurring organized fraud rings by correlating shared intermediary mule accounts across disparate FIR complaints.
          </p>
        </div>

        {/* Case Selector Dropdown */}
        <div className="flex items-center gap-2 self-start md:self-auto font-mono text-xs">
          <span className="text-slate-400">Select Case to Correlate:</span>
          <select
            value={currentCaseId}
            onChange={(e) => {
              setCurrentCaseId(e.target.value);
              onSelectCase(e.target.value);
            }}
            className="bg-navy-950 border border-cyan-600 rounded-lg px-3 py-2 text-cyan-300 font-bold focus:outline-none focus:border-cyan-400 cursor-pointer"
          >
            <optgroup label="Walkthrough Demos (Known Seeded Rings)">
              <option value="CMP-1001">CMP-1001 (Apex Syndicate Ring 1)</option>
              <option value="CMP-1002">CMP-1002 (East Coast Ring 2)</option>
              <option value="CMP-1003">CMP-1003 (FastCash Ring 3)</option>
              <option value="CMP-1004">CMP-1004 (Metro North Ring 4)</option>
              <option value="CMP-1005">CMP-1005 (Industrial Sector Ring 5)</option>
              <option value="CMP-1006">CMP-1006 (Tech Corridor Ring 6)</option>
              <option value="CMP-1007">CMP-1007 (Outer Ring Ring 7)</option>
              <option value="CMP-1008">CMP-1008 (Terminal Ring 8)</option>
            </optgroup>
            <optgroup label="Correlated Synthetic Cases">
              <option value="CMP-1014">CMP-1014 (Shares Mule with CMP-1001)</option>
              <option value="CMP-1019">CMP-1019 (Shares Mule with CMP-1002)</option>
              <option value="CMP-1022">CMP-1022 (Shares Mule with CMP-1003)</option>
              <option value="CMP-1028">CMP-1028 (Shares Mule with CMP-1001)</option>
              <option value="CMP-1052">CMP-1052 (Shares Mule with CMP-1001)</option>
            </optgroup>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="p-12 flex flex-col items-center justify-center font-mono text-cyan-400 space-y-3">
          <Activity className="w-8 h-8 animate-spin" />
          <span>Executing Cross-Case Bipartite Graph Correlation...</span>
        </div>
      ) : (
        <>
          {/* Prominent Cross-Case Alert Banner */}
          <div className="glass-panel p-5 rounded-2xl border-rose-600/50 bg-gradient-to-r from-rose-950/60 via-navy-900 to-navy-950 shadow-xl shadow-rose-950/20">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30 shrink-0">
                  <ShieldAlert className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-rose-400 text-sm tracking-wide">
                      MULE INFRASTRUCTURE OVERLAP DETECTED
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800">
                      ORGANIZED SYNDICATE
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-white mt-1">
                    {linkageData?.banner_message || 'Multi-case linkage active.'}
                  </p>
                  <p className="text-xs text-slate-300 mt-1">
                    Primary victim transfer of <strong className="text-emerald-400">₹{targetCase?.amount.toLocaleString()}</strong> in {targetCase?.complaint_id} shares accounts with {linkedCases.length} other registered FIR complaints.
                  </p>
                </div>
              </div>

              <div className="bg-navy-950/90 border border-navy-800 px-4 py-2.5 rounded-xl font-mono text-right shrink-0">
                <span className="text-[10px] text-slate-400 block uppercase">Combined Stolen Sum in Ring</span>
                <span className="text-xl font-bold text-emerald-400 font-display">
                  ₹{linkageData?.total_combined_theft_inr?.toLocaleString() || '0'}
                </span>
                <span className="text-[10px] text-cyan-400 block">Across {linkedCases.length + 1} FIR Files</span>
              </div>
            </div>
          </div>

          {/* Ring Profile & Shared Entities Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left 2 Cols: Shared Entities & Ring Breakdown */}
            <div className="lg:col-span-2 space-y-4">
              
              {/* Shared Mules Card */}
              <div className="glass-panel p-5 rounded-xl border-navy-800 space-y-3">
                <h3 className="text-sm font-semibold text-white font-mono flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-cyan-400" />
                  SHARED INTERMEDIARY ENTITIES ({sharedEntities.length})
                </h3>
                <p className="text-xs text-slate-400">
                  These accounts or IFSC branches were utilized by perpetrators across separate cyber incident reports.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  {sharedEntities.map((se) => (
                    <div
                      key={se.entity_id}
                      className="p-3.5 rounded-xl bg-navy-950/90 border border-navy-800 space-y-2 font-mono text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-rose-300">{se.entity_id}</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-rose-950 text-rose-400 border border-rose-800">
                          {se.role}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-300 space-y-0.5">
                        <p><span className="text-slate-500">Bank:</span> {se.bank}</p>
                        <p><span className="text-slate-500">IFSC:</span> {se.ifsc}</p>
                        <p><span className="text-slate-500">Mobile Suffix:</span> ******{se.phone_suffix}</p>
                      </div>
                      <div className="pt-1.5 border-t border-navy-900 flex items-center justify-between text-[11px]">
                        <span className="text-cyan-400 font-semibold">{se.linked_case_count} other FIRs</span>
                        <span className="text-slate-500">Cross-Jurisdiction</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bipartite Graph Visualization */}
              <MuleGraphVisualizer
                nodes={subgraph.nodes}
                edges={subgraph.edges}
                title={`Syndicate Topology: ${targetCase?.complaint_id} Subgraph`}
                subtitle="Visual correlation linking the investigated complaint (Amber) through shared intermediary mules (Red/Orange) to related active FIRs (Blue)."
              />

            </div>

            {/* Right Col: Affiliated Syndicate Dossier */}
            <div className="space-y-4">
              
              <div className="glass-panel p-5 rounded-xl border-navy-800 space-y-4">
                <div className="flex items-center justify-between border-b border-navy-800 pb-3">
                  <div>
                    <h3 className="text-sm font-semibold text-white font-mono flex items-center gap-1.5">
                      <GitMerge className="w-4 h-4 text-rose-400" />
                      AFFILIATED RING DOSSIER
                    </h3>
                    <p className="text-[10px] text-cyan-400 font-mono mt-0.5">
                      {ring?.detected_ring_id || 'RING-01 (Apex Syndicate)'}
                    </p>
                  </div>
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 font-bold">
                    {((ring?.confidence_score || 0.94) * 100).toFixed(0)}% CONF
                  </span>
                </div>

                <div className="space-y-2.5 font-mono text-xs">
                  <div>
                    <span className="text-slate-500 text-[10px] block">SYNDICATE NAME / CLUSTER</span>
                    <span className="text-slate-200 font-semibold">{ring?.name || 'Apex Syndicate Layer A'}</span>
                  </div>

                  <div>
                    <span className="text-slate-500 text-[10px] block">CENTRAL CONSOLIDATION HUB</span>
                    <span className="text-rose-400 font-bold">{ring?.shared_account_id || 'ACC-MULE-004'}</span>
                  </div>

                  <div>
                    <span className="text-slate-500 text-[10px] block">TOTAL MEMBER CASES IN POLICE SYSTEM</span>
                    <span className="text-slate-200 font-bold">{linkedCases.length + 1} Cases Correlated</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-navy-800">
                  <h4 className="text-[11px] font-mono font-bold text-slate-400 uppercase mb-2">
                    HEURISTIC CORRELATION SIGNALS
                  </h4>
                  <ul className="space-y-1.5 font-mono text-[11px] text-slate-300">
                    <li className="flex items-start gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                      <span>Same L2 mule utilized across multiple FIRs</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                      <span>IFSC routing convergence at clearing switch</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                      <span>Withdrawal window temporal alignment (&lt; 45m)</span>
                    </li>
                  </ul>
                </div>

                {/* Direct Action */}
                <button
                  onClick={() => onNavigate('prediction')}
                  className="w-full py-2.5 px-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 text-white font-mono text-xs font-semibold rounded-lg shadow-lg shadow-cyan-600/20 transition flex items-center justify-center gap-2"
                >
                  <Compass className="w-4 h-4" />
                  <span>Forecast Syndicate Cashout Location</span>
                </button>
              </div>

              {/* Seeded Rings Overview Preview */}
              <div className="glass-panel p-4 rounded-xl border-navy-800 space-y-2">
                <span className="text-[10px] font-mono uppercase text-slate-400 block">
                  SYSTEM-WIDE DISCOVERED SYNDICATES (20 DETECTED)
                </span>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  The graph correlation engine continuously evaluates 128 complaints to update syndicate membership as new complaints are lodged.
                </p>
              </div>

            </div>

          </div>

          {/* Correlated Complaints Table */}
          <div className="glass-panel p-5 rounded-xl border-navy-800 space-y-3">
            <h3 className="text-sm font-semibold text-white font-mono flex items-center gap-2">
              <Users className="w-4 h-4 text-cyan-400" />
              OTHER ACTIVE COMPLAINTS LINKED TO THIS MULE RING ({linkedCases.length})
            </h3>
            <p className="text-xs text-slate-400">
              Each of these complaints independently reported losses funneled into the same mule intermediary infrastructure.
            </p>

            <div className="overflow-x-auto rounded-lg border border-navy-800">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-navy-950 text-[10px] uppercase text-slate-400">
                  <tr>
                    <th className="py-2.5 px-4">Linked Case ID</th>
                    <th className="py-2.5 px-4">Date</th>
                    <th className="py-2.5 px-4">Defrauded Value</th>
                    <th className="py-2.5 px-4">Fraud Modus</th>
                    <th className="py-2.5 px-4">Shared Mule Entity</th>
                    <th className="py-2.5 px-4 text-right">Inspect</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-navy-800/60">
                  {linkedCases.map((lc) => (
                    <tr key={lc.complaint_id} className="hover:bg-navy-850/60 transition">
                      <td className="py-2.5 px-4 font-bold text-cyan-300">
                        {lc.complaint_id}
                      </td>
                      <td className="py-2.5 px-4 text-slate-400">{lc.date}</td>
                      <td className="py-2.5 px-4 text-emerald-400 font-semibold">
                        ₹{lc.amount.toLocaleString()}
                      </td>
                      <td className="py-2.5 px-4 text-slate-300 max-w-[200px] truncate">{lc.category}</td>
                      <td className="py-2.5 px-4 text-rose-300 font-bold">
                        {lc.shared_mules?.join(', ')}
                      </td>
                      <td className="py-2.5 px-4 text-right">
                        <button
                          onClick={() => {
                            setCurrentCaseId(lc.complaint_id);
                            onSelectCase(lc.complaint_id);
                          }}
                          className="px-2.5 py-1 bg-navy-800 hover:bg-navy-700 text-cyan-300 border border-navy-700 rounded text-[10px] transition"
                        >
                          Focus This Case
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

    </div>
  );
}
