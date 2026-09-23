import React, { useState } from 'react';
import { Network, ShieldAlert, AlertTriangle, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function MuleGraphVisualizer({ 
  nodes = [], 
  edges = [], 
  title = "Multi-Hop Mule Network Topology",
  subtitle = "Interactive node/edge graph representing fund routing & shared mule chains"
}) {
  const [selectedNode, setSelectedNode] = useState(null);

  // Compute layout coordinates (circular or layered layout for deterministic clean rendering)
  const width = 850;
  const height = 480;
  const centerX = width / 2;
  const centerY = height / 2;

  // Position nodes strategically based on type
  const positionedNodes = nodes.map((node, i) => {
    let x = centerX;
    let y = centerY;

    if (node.type === 'TARGET_CASE') {
      x = 120;
      y = centerY;
    } else if (node.type === 'SHARED_MULE' || node.role === 'mule_l1' || node.role === 'mule_l2') {
      const isL2 = node.role === 'mule_l2' || (node.label && node.label.includes('004') || node.label.includes('005') || node.label.includes('009'));
      x = isL2 ? centerX + 80 : centerX - 60;
      const count = nodes.filter(n => n.type === 'SHARED_MULE' || n.role?.includes('mule')).length;
      const offset = (i % 5) - 2;
      y = centerY + offset * 65;
    } else if (node.type === 'LINKED_CASE') {
      x = width - 130;
      const linkedCount = nodes.filter(n => n.type === 'LINKED_CASE').length;
      const step = linkedCount > 1 ? (height - 100) / (linkedCount + 1) : 0;
      y = 60 + ((i % 8) + 1) * 45;
    } else if (node.role === 'victim') {
      x = 100;
      y = 100 + (i * 70);
    } else if (node.role === 'withdrawal') {
      x = width - 110;
      y = 120 + ((i % 4) * 80);
    } else {
      // Circular distribution fallback
      const angle = (i / Math.max(1, nodes.length)) * 2 * Math.PI;
      x = centerX + Math.cos(angle) * (width * 0.35);
      y = centerY + Math.sin(angle) * (height * 0.35);
    }

    return {
      ...node,
      x: Math.max(60, Math.min(width - 60, x)),
      y: Math.max(50, Math.min(height - 50, y))
    };
  });

  const nodeMap = new Map(positionedNodes.map(n => [n.id, n]));

  function getNodeColor(node) {
    if (node.type === 'TARGET_CASE') return { fill: '#f59e0b', stroke: '#fbbf24', text: '#fff' }; // Amber
    if (node.type === 'LINKED_CASE') return { fill: '#3b82f6', stroke: '#60a5fa', text: '#fff' }; // Blue
    if (node.role === 'victim') return { fill: '#10b981', stroke: '#34d399', text: '#fff' }; // Emerald
    if (node.role === 'withdrawal') return { fill: '#a855f7', stroke: '#c084fc', text: '#fff' }; // Purple
    if (node.role === 'mule_l2' || (node.label && (node.label.includes('004') || node.label.includes('005')))) {
      return { fill: '#ef4444', stroke: '#f87171', text: '#fff' }; // Red / Critical
    }
    return { fill: '#f97316', stroke: '#fb923c', text: '#fff' }; // Orange / L1
  }

  return (
    <div className="bg-navy-900 border border-navy-800 rounded-xl overflow-hidden shadow-xl">
      {/* Header */}
      <div className="px-5 py-3 border-b border-navy-800 flex items-center justify-between bg-navy-950/60">
        <div>
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <Network className="w-4 h-4 text-cyan-400" />
            {title}
          </h3>
          <p className="text-[11px] text-slate-400">{subtitle}</p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3 text-[10px] font-mono text-slate-300">
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
            <span>Target FIR</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-orange-500"></span>
            <span>Mule L1</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
            <span>Mule L2 (Hub)</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
            <span>Linked Case</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-500"></span>
            <span>ATM Cashout</span>
          </div>
        </div>
      </div>

      {/* Canvas Area */}
      <div className="relative bg-navy-950 p-2">
        <svg 
          viewBox={`0 0 ${width} ${height}`} 
          className="w-full h-[400px] select-none cursor-crosshair"
        >
          <defs>
            <marker id="arrow" viewBox="0 0 10 10" refX="22" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#06b6d4" opacity="0.8" />
            </marker>
            <marker id="arrow-red" viewBox="0 0 10 10" refX="22" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#ef4444" opacity="0.8" />
            </marker>
          </defs>

          {/* Grid lines for tactical aesthetic */}
          <g opacity="0.1">
            {Array.from({ length: 15 }).map((_, i) => (
              <line key={`v-${i}`} x1={i * 60} y1="0" x2={i * 60} y2={height} stroke="#38bdf8" strokeWidth="0.5" strokeDasharray="4 4" />
            ))}
            {Array.from({ length: 9 }).map((_, i) => (
              <line key={`h-${i}`} x1="0" y1={i * 60} x2={width} y2={i * 60} stroke="#38bdf8" strokeWidth="0.5" strokeDasharray="4 4" />
            ))}
          </g>

          {/* Edges */}
          {edges.map((edge, i) => {
            const src = nodeMap.get(edge.source);
            const tgt = nodeMap.get(edge.target);
            if (!src || !tgt) return null;

            const isHighRisk = edge.amount > 100000 || (src.role === 'mule_l2' || tgt.role === 'mule_l2');

            return (
              <g key={`edge-${i}`}>
                <line
                  x1={src.x}
                  y1={src.y}
                  x2={tgt.x}
                  y2={tgt.y}
                  stroke={isHighRisk ? '#f43f5e' : '#06b6d4'}
                  strokeWidth={isHighRisk ? 2.2 : 1.5}
                  strokeDasharray={edge.label === 'Shares Mule' ? '4 2' : 'none'}
                  opacity={0.65}
                  markerEnd={isHighRisk ? 'url(#arrow-red)' : 'url(#arrow)'}
                />
                {edge.label && (
                  <text
                    x={(src.x + tgt.x) / 2}
                    y={(src.y + tgt.y) / 2 - 4}
                    fill="#94a3b8"
                    fontSize="9"
                    fontFamily="monospace"
                    textAnchor="middle"
                  >
                    {edge.label}
                  </text>
                )}
              </g>
            );
          })}

          {/* Nodes */}
          {positionedNodes.map((node) => {
            const colors = getNodeColor(node);
            const isSelected = selectedNode?.id === node.id;

            return (
              <g
                key={node.id}
                onClick={() => setSelectedNode(node)}
                className="cursor-pointer transition-transform duration-150 hover:scale-110"
              >
                {/* Glow ring if selected */}
                {isSelected && (
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r="24"
                    fill="none"
                    stroke="#22d3ee"
                    strokeWidth="2.5"
                    className="animate-ping-slow"
                  />
                )}

                {/* Node Circle */}
                <circle
                  cx={node.x}
                  cy={node.y}
                  r="18"
                  fill={colors.fill}
                  stroke={isSelected ? '#fff' : colors.stroke}
                  strokeWidth={isSelected ? 3 : 1.5}
                  className="shadow-md"
                />

                {/* Inner Icon or Dot */}
                <circle cx={node.x} cy={node.y} r="5" fill="#fff" opacity="0.8" />

                {/* Node Label */}
                <text
                  x={node.x}
                  y={node.y + 30}
                  fill="#f1f5f9"
                  fontSize="10"
                  fontFamily="monospace"
                  fontWeight="600"
                  textAnchor="middle"
                  className="pointer-events-none drop-shadow-md"
                >
                  {node.id}
                </text>

                {node.role && (
                  <text
                    x={node.x}
                    y={node.y + 42}
                    fill="#94a3b8"
                    fontSize="8"
                    textAnchor="middle"
                    className="pointer-events-none uppercase"
                  >
                    {node.role}
                  </text>
                )}
              </g>
            );
          })}
        </svg>

        {/* Selected Node Details Floating Card */}
        {selectedNode && (
          <div className="absolute top-4 right-4 bg-navy-900/95 border border-cyan-500/50 rounded-lg p-3 w-64 shadow-2xl backdrop-blur-md text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-navy-800">
              <span className="font-mono font-bold text-cyan-300">{selectedNode.id}</span>
              <button 
                onClick={() => setSelectedNode(null)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            <div className="pt-2 space-y-1.5 font-mono text-[11px]">
              <div>
                <span className="text-slate-400">Type / Role: </span>
                <span className="text-slate-200 uppercase font-semibold">{selectedNode.role || selectedNode.type}</span>
              </div>
              {selectedNode.bank && (
                <div>
                  <span className="text-slate-400">Bank Node: </span>
                  <span className="text-slate-200">{selectedNode.bank}</span>
                </div>
              )}
              {selectedNode.amount && (
                <div>
                  <span className="text-slate-400">FIR Value: </span>
                  <span className="text-emerald-400 font-bold">₹{selectedNode.amount.toLocaleString()}</span>
                </div>
              )}
              {selectedNode.volume && (
                <div>
                  <span className="text-slate-400">Total Volume: </span>
                  <span className="text-rose-400 font-bold">₹{selectedNode.volume.toLocaleString()}</span>
                </div>
              )}
              {selectedNode.incoming !== undefined && (
                <div className="flex justify-between text-slate-300">
                  <span>Txn In: {selectedNode.incoming}</span>
                  <span>Txn Out: {selectedNode.outgoing}</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
