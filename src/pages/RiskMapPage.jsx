import React, { useState, useEffect, useRef } from 'react';
import { 
  MapPin, 
  ShieldAlert, 
  ShieldCheck, 
  Navigation, 
  ArrowRight, 
  Layers, 
  AlertTriangle, 
  Info, 
  Compass, 
  Building2, 
  ExternalLink,
  Clock,
  Radio,
  CheckCircle2,
  FileText,
  Search,
  Crosshair
} from 'lucide-react';
import L from 'leaflet';
import { PAN_INDIA_REGIONS, PAN_INDIA_HOTSPOTS } from '../data/panIndiaHotspots';

export default function RiskMapPage({ onSelectCase, onNavigate }) {
  const [selectedRegion, setSelectedRegion] = useState('ALL');
  const [selectedHotspot, setSelectedHotspot] = useState(PAN_INDIA_HOTSPOTS[0]);
  const [actionNotice, setActionNotice] = useState(null);

  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);

  // Initialize Leaflet Map once
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    // Centered on Central India
    const map = L.map(mapContainerRef.current, {
      center: [22.9734, 78.6569],
      zoom: 5,
      zoomControl: true,
      attributionControl: false
    });

    // Dark-themed tiles with reliable tile server
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
      subdomains: 'abcd',
    }).addTo(map);

    mapInstanceRef.current = map;

    // Invalidate size to ensure canvas renders properly after mounting
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 250);

    return () => {
      clearTimeout(timer);
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update Markers when map or region changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Clear existing markers
    markersRef.current.forEach(m => m.remove());
    markersRef.current = [];

    const bounds = [];

    // Filter hotspots if a specific region is chosen
    const activeHotspots = selectedRegion === 'ALL' 
      ? PAN_INDIA_HOTSPOTS 
      : PAN_INDIA_HOTSPOTS.filter(h => h.region === selectedRegion);

    activeHotspots.forEach((h) => {
      const primary = h.primaryTarget;
      const isIntercepted = h.interceptStatus === 'Intercepted';
      const isHigh = primary.confidence >= 80;
      const color = isIntercepted ? '#10b981' : isHigh ? '#ef4444' : '#f97316';

      // Custom Glowing DivIcon
      const customIcon = L.divIcon({
        className: 'custom-pan-india-marker',
        html: `
          <div style="
            position: relative;
            width: 32px;
            height: 32px;
            border-radius: 50%;
            background: ${color};
            color: #030712;
            font-size: 11px;
            font-weight: 800;
            font-family: monospace;
            display: flex;
            align-items: center;
            justify-content: center;
            border: 2.5px solid #ffffff;
            box-shadow: 0 0 16px ${color}bb, 0 0 32px ${color}66;
            cursor: pointer;
            transition: transform 0.2s ease;
          ">
            ${primary.confidence}%
            <div style="
              position: absolute;
              inset: -5px;
              border-radius: 50%;
              border: 1.5px solid ${color};
              opacity: 0.7;
              animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;
            "></div>
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
        popupAnchor: [0, -16]
      });

      const marker = L.marker([primary.lat, primary.lng], { icon: customIcon }).addTo(map);

      // Interactive Popup
      const popupHtml = `
        <div style="font-family: monospace; min-width: 220px; color: #0f172a; padding: 2px;">
          <div style="font-size: 10px; font-weight: bold; color: ${color}; text-transform: uppercase; margin-bottom: 2px;">
            ${h.caseId} • ${h.interceptStatus}
          </div>
          <div style="font-size: 12px; font-weight: bold; color: #0284c7; margin-bottom: 2px;">
            ${primary.locationName}
          </div>
          <div style="font-size: 10px; color: #475569; margin-bottom: 6px;">
            ${primary.address}
          </div>
          <div style="font-size: 11px; border-top: 1px solid #cbd5e1; padding-top: 4px; display: flex; justify-content: space-between;">
            <span>Siphoned: <strong>₹${h.amount.toLocaleString('en-IN')}</strong></span>
            <span>Conf: <strong>${primary.confidence}%</strong></span>
          </div>
        </div>
      `;

      marker.bindPopup(popupHtml);
      marker.on('click', () => {
        setSelectedHotspot(h);
      });

      markersRef.current.push(marker);
      bounds.push([primary.lat, primary.lng]);

      // Secondary target marker if present
      if (h.secondaryTarget) {
        const sec = h.secondaryTarget;
        const secColor = '#f59e0b';
        const secIcon = L.divIcon({
          className: 'sec-marker',
          html: `
            <div style="
              width: 22px;
              height: 22px;
              border-radius: 50%;
              background: ${secColor};
              color: #030712;
              font-size: 9px;
              font-weight: 700;
              font-family: monospace;
              display: flex;
              align-items: center;
              justify-content: center;
              border: 1.5px solid #ffffff;
              box-shadow: 0 0 10px ${secColor}88;
              cursor: pointer;
            ">
              ${sec.confidence}%
            </div>
          `,
          iconSize: [22, 22],
          iconAnchor: [11, 11],
          popupAnchor: [0, -11]
        });

        const secMarker = L.marker([sec.lat, sec.lng], { icon: secIcon }).addTo(map);
        secMarker.bindPopup(`
          <div style="font-family: monospace; font-size: 11px; color: #0f172a;">
            <strong>${sec.locationName}</strong><br/>
            <span style="font-size: 10px; color: #64748b;">Secondary Candidate (${sec.confidence}%)</span>
          </div>
        `);
        secMarker.on('click', () => setSelectedHotspot(h));
        markersRef.current.push(secMarker);
      }
    });

    // If region changed and not ALL, center on that region
    if (selectedRegion !== 'ALL') {
      const regObj = PAN_INDIA_REGIONS.find(r => r.id === selectedRegion);
      if (regObj) {
        map.flyTo(regObj.center, regObj.zoom, { duration: 1.2 });
      }
    } else if (bounds.length > 0) {
      map.fitBounds(bounds, { padding: [40, 40], maxZoom: 6 });
    }
  }, [selectedRegion]);

  function handleSelectRegion(regionId) {
    setSelectedRegion(regionId);
    if (regionId !== 'ALL') {
      const match = PAN_INDIA_HOTSPOTS.find(h => h.region === regionId);
      if (match) setSelectedHotspot(match);
    }
  }

  function handleDispatchAlert(hotspot) {
    setActionNotice(`Dispatch Order Issued: Section 91 CrPC notice routed to ${hotspot.primaryTarget.bank} branch & CCTV surveillance locked.`);
    setTimeout(() => setActionNotice(null), 4000);
  }

  const primary = selectedHotspot?.primaryTarget;
  const isIntercepted = selectedHotspot?.interceptStatus === 'Intercepted';
  const isHigh = primary?.confidence >= 80;
  const statusColor = isIntercepted ? 'text-emerald-400 border-emerald-500/40 bg-emerald-950/60' : isHigh ? 'text-rose-400 border-rose-500/40 bg-rose-950/60' : 'text-orange-400 border-orange-500/40 bg-orange-950/60';

  return (
    <div className="p-6 space-y-6 bg-[#050811] text-slate-100 min-h-screen">
      
      {/* ======================================================== */}
      {/* 1. PAN-INDIA HEADER CARD (MATCHES USER SCREENSHOT)       */}
      {/* ======================================================== */}
      <div className="glass-panel p-6 rounded-2xl border-navy-800 bg-gradient-to-r from-[#091124] via-[#070d1c] to-[#091124] shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono font-bold text-cyan-400 tracking-wider uppercase">
            PAN-INDIA GEOSPATIAL INTELLIGENCE
          </span>
          <h1 className="text-xl sm:text-2xl font-bold font-mono text-white mt-1 tracking-wide">
            Predicted Cybercrime Cash-Out Hotspots
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Aggregated predictive targets across NCR, Mumbai, Bengaluru, Hyderabad, Kolkata, Ahmedabad, Jaipur, and Lucknow
          </p>
        </div>

        {/* Legend Badge (Matches Screenshot Pill) */}
        <div className="flex items-center space-x-3 text-xs font-mono bg-navy-950 px-4 py-2.5 rounded-xl border border-navy-800 shrink-0">
          <span className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 shadow-sm shadow-red-500/50" />
            <span className="text-slate-300">High Risk</span>
          </span>
          <span className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-orange-500 shadow-sm shadow-orange-500/50" />
            <span className="text-slate-300">Medium</span>
          </span>
          <span className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50" />
            <span className="text-slate-300">Intercepted</span>
          </span>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 2. REGIONAL CORRIDOR QUICK-SELECTOR PILLS                */}
      {/* ======================================================== */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-mono">
        <span className="text-slate-400 text-[11px] shrink-0 mr-1 flex items-center gap-1">
          <Crosshair className="w-3 h-3 text-cyan-400" /> Corridors:
        </span>
        {PAN_INDIA_REGIONS.map((r) => {
          const isActive = selectedRegion === r.id;
          return (
            <button
              key={r.id}
              onClick={() => handleSelectRegion(r.id)}
              className={`px-3 py-1.5 rounded-lg shrink-0 transition-all font-semibold ${
                isActive
                  ? 'bg-cyan-500 text-navy-950 shadow-md shadow-cyan-500/30 border border-cyan-400'
                  : 'bg-navy-900/90 text-slate-300 hover:bg-navy-800 hover:text-white border border-navy-700/80'
              }`}
            >
              {r.name}
            </button>
          );
        })}
      </div>

      {/* Action Notification Toast */}
      {actionNotice && (
        <div className="p-3 rounded-xl bg-cyan-950 border border-cyan-400 text-cyan-200 font-mono text-xs shadow-xl animate-fade-in flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-cyan-400" />
            <span>{actionNotice}</span>
          </div>
          <button onClick={() => setActionNotice(null)} className="text-cyan-400 hover:text-white ml-4">✕</button>
        </div>
      )}

      {/* ======================================================== */}
      {/* 3. MAIN WORKSPACE: MAP (LEFT) + DOSSIER (RIGHT)          */}
      {/* ======================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Interactive Leaflet Map */}
        <div className="lg:col-span-2 glass-panel p-2 rounded-2xl border-navy-800 overflow-hidden shadow-2xl relative">
          
          {/* Map Container with explicit pixel height */}
          <div 
            ref={mapContainerRef} 
            style={{ height: '540px', minHeight: '540px', width: '100%' }}
            className="rounded-xl z-10"
          />

          {/* Map Overlay Badge */}
          <div className="absolute top-4 left-4 z-20 px-3 py-1.5 rounded-lg bg-navy-950/90 border border-navy-700 text-[11px] font-mono text-cyan-300 backdrop-blur-md flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span>Interactive Leaflet + CartoDB Dark Tiles • 16 Pan-India Nodes</span>
          </div>

          {/* Quick Reset Center Button */}
          <button
            onClick={() => handleSelectRegion('ALL')}
            className="absolute bottom-4 right-4 z-20 px-3 py-1.5 rounded-lg bg-navy-900/90 hover:bg-navy-800 border border-navy-700 text-xs font-mono text-slate-200 shadow-lg backdrop-blur-md transition flex items-center gap-1.5"
          >
            <Navigation className="w-3.5 h-3.5 text-cyan-400" />
            <span>Reset Pan-India View</span>
          </button>
        </div>

        {/* Right Col: Selected Hotspot Tactical Dossier */}
        <div className="glass-panel p-5 rounded-2xl border-navy-800 bg-[#091124] flex flex-col justify-between space-y-4 shadow-xl">
          
          <div>
            {/* Dossier Header */}
            <div className="pb-3 border-b border-navy-800 mb-4 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider block">
                  SELECTED REGIONAL TARGET
                </span>
                <h3 className="font-bold text-sm text-slate-100 mt-0.5">
                  {selectedHotspot ? selectedHotspot.cityLabel : 'Select Hotspot'}
                </h3>
              </div>
              <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${statusColor}`}>
                {selectedHotspot?.interceptStatus || 'MONITORED'}
              </span>
            </div>

            {selectedHotspot && primary ? (
              <div className="space-y-4 text-xs font-mono">
                
                {/* Target Location & Bank */}
                <div>
                  <span className="text-slate-500 text-[10px] uppercase block">Target Kiosk / Vestibule</span>
                  <h4 className="font-bold text-sm text-white mt-0.5">
                    {primary.locationName}
                  </h4>
                  <p className="text-slate-400 text-[11px] mt-0.5">
                    {primary.address}
                  </p>
                </div>

                {/* KPI Metrics Grid */}
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <div className="p-2.5 rounded-xl bg-navy-950 border border-navy-800">
                    <span className="text-[10px] text-slate-400 block">Siphoned Volume</span>
                    <span className="text-sm font-bold text-rose-400">
                      ₹{selectedHotspot.amount.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-navy-950 border border-navy-800">
                    <span className="text-[10px] text-slate-400 block">Prediction Confidence</span>
                    <span className="text-sm font-bold text-cyan-400">
                      {primary.confidence}% Match
                    </span>
                  </div>
                </div>

                {/* Confidence Bar Meter */}
                <div>
                  <div className="flex justify-between text-[10px] text-slate-400 mb-1">
                    <span>Interception Probability</span>
                    <span className="font-bold text-cyan-400">{primary.confidence}%</span>
                  </div>
                  <div className="w-full bg-navy-950 rounded-full h-2 border border-navy-800 overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${
                        isIntercepted ? 'bg-emerald-500' : isHigh ? 'bg-gradient-to-r from-orange-500 to-rose-500' : 'bg-orange-400'
                      }`}
                      style={{ width: `${primary.confidence}%` }}
                    />
                  </div>
                </div>

                {/* Withdrawal Window */}
                <div className="p-2.5 rounded-xl bg-navy-950 border border-navy-800">
                  <div className="flex items-center gap-1.5 text-purple-400 text-[11px] font-bold mb-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Forecasted Cashout Window</span>
                  </div>
                  <p className="text-slate-200 text-xs">{primary.window}</p>
                  <p className="text-[10px] text-slate-500 mt-1">
                    Past Cluster Hits: <strong>{primary.historicalWithdrawals} recorded extractions</strong>
                  </p>
                </div>

                {/* Nearest Law Enforcement Unit */}
                <div className="p-2.5 rounded-xl bg-navy-950 border border-navy-800">
                  <div className="flex items-center gap-1.5 text-cyan-400 text-[11px] font-bold mb-1">
                    <Radio className="w-3.5 h-3.5" />
                    <span>Nearest Police Intercept Squad</span>
                  </div>
                  <p className="text-slate-300 text-[11px]">{primary.nearestUnit}</p>
                </div>

                {/* Explainable Rationale */}
                <div className="p-2.5 rounded-xl bg-navy-950/80 border border-navy-800 text-[11px] text-slate-300 leading-relaxed">
                  <span className="text-amber-400 font-bold block mb-1">Predictive Model Rationale:</span>
                  {primary.rationale}
                </div>

              </div>
            ) : (
              <div className="py-12 text-center text-slate-500 font-mono text-xs">
                Select a hotspot marker on the map to inspect intelligence.
              </div>
            )}
          </div>

          {/* Action Buttons */}
          {selectedHotspot && (
            <div className="space-y-2 pt-2 border-t border-navy-800 font-mono text-xs">
              <button
                onClick={() => handleDispatchAlert(selectedHotspot)}
                className="w-full py-2.5 px-3 bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-bold rounded-xl shadow-lg shadow-rose-600/20 transition flex items-center justify-center gap-2"
              >
                <ShieldAlert className="w-4 h-4" />
                <span>Issue Section 91 CrPC Notice</span>
              </button>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    if (onSelectCase) onSelectCase(selectedHotspot.caseId);
                    if (onNavigate) onNavigate('prediction');
                  }}
                  className="py-2 px-2.5 bg-navy-900 hover:bg-navy-800 border border-navy-700 text-cyan-300 rounded-lg transition flex items-center justify-center gap-1 text-[11px]"
                >
                  <Compass className="w-3 h-3" />
                  <span>Explain Prediction</span>
                </button>

                <button
                  onClick={() => {
                    if (onSelectCase) onSelectCase(selectedHotspot.caseId);
                    if (onNavigate) onNavigate('linkage');
                  }}
                  className="py-2 px-2.5 bg-navy-900 hover:bg-navy-800 border border-navy-700 text-purple-300 rounded-lg transition flex items-center justify-center gap-1 text-[11px]"
                >
                  <Layers className="w-3 h-3" />
                  <span>Mule Linkage</span>
                </button>
              </div>
            </div>
          )}

        </div>

      </div>

      {/* ======================================================== */}
      {/* 4. TRL 3 SCIENTIFIC DISCLAIMER FOOTER                     */}
      {/* ======================================================== */}
      <div className="p-3 rounded-xl bg-navy-950/80 border border-navy-800 text-[11px] font-mono text-slate-400 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Info className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
          <span>
            <strong>TRL 3 Experimental Proof-of-Concept:</strong> Synthetic Geodesic Simulation across 8 Major Cybercrime Corridors (NCR, Mumbai, Bengaluru, Hyderabad, Kolkata, Ahmedabad, Jaipur, Lucknow).
          </span>
        </div>
        <span className="text-slate-500 shrink-0">
          Complies with Section 91 CrPC &amp; IT Act 2000
        </span>
      </div>

    </div>
  );
}
