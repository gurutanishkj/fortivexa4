import React, { useState, useEffect, useRef } from 'react';
import { 
  MapPin, 
  ShieldAlert, 
  Layers, 
  AlertTriangle, 
  Info, 
  Compass, 
  Building2, 
  ExternalLink 
} from 'lucide-react';
import L from 'leaflet';
import { fetchHotspots } from '../services/api';

export default function RiskMapPage({ onSelectCase, onNavigate }) {
  const [locations, setLocations] = useState([]);
  const [selectedLoc, setSelectedLoc] = useState(null);
  const [riskFilter, setRiskFilter] = useState('ALL');
  const [jurisdictionFilter, setJurisdictionFilter] = useState('ALL');
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);

  useEffect(() => {
    fetchHotspots()
      .then(res => setLocations(res.hotspots || []))
      .catch(console.error);
  }, []);

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return; // already initialized

    // Center on fictional metropolitan cyber cluster
    const map = L.map(mapContainerRef.current, {
      center: [12.9716, 77.5946],
      zoom: 12,
      zoomControl: true,
      attributionControl: false
    });

    // Dark-themed CartoDB tiles
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
      subdomains: 'abcd',
    }).addTo(map);

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update Markers when locations or filters change
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || locations.length === 0) return;

    // Clear old markers
    markersRef.current.forEach(m => m.remove());
    markersRef.current = [];

    const filtered = locations.filter(loc => {
      if (riskFilter === 'HIGH' && loc.risk_index < 0.75) return false;
      if (riskFilter === 'MEDIUM' && (loc.risk_index < 0.50 || loc.risk_index >= 0.75)) return false;
      if (riskFilter === 'LOW' && loc.risk_index >= 0.50) return false;
      if (jurisdictionFilter !== 'ALL' && loc.jurisdiction !== jurisdictionFilter) return false;
      return true;
    });

    filtered.forEach((loc, idx) => {
      const isTopHotspot = loc.risk_index >= 0.85 || loc.location_id === 'LOC-DEMO-01';
      const isHigh = loc.risk_index >= 0.75;
      const isMedium = loc.risk_index >= 0.50;

      const color = isTopHotspot ? '#f43f5e' : isHigh ? '#f97316' : isMedium ? '#f59e0b' : '#10b981';
      const radius = isTopHotspot ? 14 : isHigh ? 11 : 9;

      const circle = L.circleMarker([loc.lat, loc.lng], {
        radius,
        fillColor: color,
        color: '#ffffff',
        weight: isTopHotspot ? 2.5 : 1.5,
        opacity: 0.9,
        fillOpacity: 0.85
      }).addTo(map);

      // Popup Content
      const popupHtml = `
        <div style="font-family: monospace; font-size: 11px; color: #0f172a; padding: 4px;">
          <strong style="font-size: 12px; color: #0284c7; display: block; margin-bottom: 2px;">${loc.name}</strong>
          <div>Jurisdiction: <b>${loc.jurisdiction}</b></div>
          <div>Threat Index: <b style="color: ${color};">${(loc.risk_index * 100).toFixed(0)}%</b></div>
          <div>Past Cashout Incidents: <b>${loc.historical_cashouts}</b></div>
          <div style="margin-top: 4px; font-size: 10px; color: #64748b;">(Synthetic Geodesic Coordinates)</div>
        </div>
      `;

      circle.bindPopup(popupHtml);
      circle.on('click', () => {
        setSelectedLoc(loc);
      });

      markersRef.current.push(circle);
    });

    if (filtered.length > 0 && !selectedLoc) {
      setSelectedLoc(filtered[0]);
    }
  }, [locations, riskFilter, jurisdictionFilter]);

  const jurisdictions = ['ALL', ...new Set(locations.map(l => l.jurisdiction))];

  return (
    <div className="p-6 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-navy-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold font-display text-white tracking-wide">
              GEOSPATIAL CASHOUT RISK MAP
            </h1>
            <span className="px-2 py-0.5 rounded bg-purple-950 border border-purple-500/40 text-purple-300 font-mono text-[10px]">
              LEAFLET + OSM
            </span>
            <span className="px-1.5 py-0.5 rounded bg-amber-950 border border-amber-600/40 text-amber-300 font-mono text-[10px]">
              FICTIONAL GEODATA
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Spatial distribution of candidate withdrawal kiosks, high-risk e-lobbies, and law enforcement sector boundaries.
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3 text-xs font-mono">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-rose-500 shadow-sm shadow-rose-500/50"></span>
            <span className="text-slate-300">Predicted Hotspot (&gt;85%)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-orange-500"></span>
            <span className="text-slate-300">High Risk</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-amber-500"></span>
            <span className="text-slate-300">Medium</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
            <span className="text-slate-300">Low</span>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="glass-panel p-3.5 rounded-xl border-navy-800 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
        <div className="flex items-center gap-2">
          <span className="text-slate-400">Risk Severity:</span>
          <select
            value={riskFilter}
            onChange={(e) => setRiskFilter(e.target.value)}
            className="bg-navy-950 border border-navy-700 rounded-lg px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-cyan-400"
          >
            <option value="ALL">All Threat Levels</option>
            <option value="HIGH">High / Predicted Hotspots (&gt;75%)</option>
            <option value="MEDIUM">Medium (50-74%)</option>
            <option value="LOW">Low (&lt;50%)</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-slate-400">Jurisdiction Police Station:</span>
          <select
            value={jurisdictionFilter}
            onChange={(e) => setJurisdictionFilter(e.target.value)}
            className="bg-navy-950 border border-navy-700 rounded-lg px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-cyan-400"
          >
            {jurisdictions.map(j => (
              <option key={j} value={j}>{j === 'ALL' ? 'All Police Stations' : j}</option>
            ))}
          </select>
        </div>

        <span className="text-[11px] text-cyan-400">
          Showing {locations.length} Synthesized Geographic Kiosks
        </span>
      </div>

      {/* Map + Detail Card Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Interactive Leaflet Container */}
        <div className="lg:col-span-2 glass-panel p-2 rounded-2xl border-navy-800 overflow-hidden shadow-2xl relative min-h-[460px]">
          <div 
            ref={mapContainerRef} 
            className="w-full h-[460px] rounded-xl z-10"
          />

          {/* Fictional Data Watermark Badge */}
          <div className="absolute bottom-4 left-4 z-20 px-3 py-1 rounded bg-navy-950/90 border border-cyan-800 text-[10px] font-mono text-cyan-300 backdrop-blur-md">
            FICTIONAL SECTOR COORDINATES • TRL 3 EXPERIMENTAL PROTOTYPE
          </div>
        </div>

        {/* Right Col: Selected Location Intel Dossier */}
        <div className="glass-panel p-5 rounded-2xl border-navy-800 space-y-4">
          <div className="flex items-center justify-between border-b border-navy-800 pb-3">
            <div>
              <span className="text-[10px] font-mono uppercase text-slate-400">
                POINT OF INTEREST DETAILS
              </span>
              <h3 className="text-base font-bold font-display text-white mt-0.5">
                {selectedLoc ? selectedLoc.name : 'Select a Map Marker'}
              </h3>
            </div>
            {selectedLoc && (
              <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                selectedLoc.risk_index >= 0.85
                  ? 'bg-rose-950 text-rose-300 border border-rose-800'
                  : selectedLoc.risk_index >= 0.70
                  ? 'bg-orange-950 text-orange-300 border border-orange-800'
                  : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
              }`}>
                {(selectedLoc.risk_index * 100).toFixed(0)}% Threat Index
              </span>
            )}
          </div>

          {selectedLoc ? (
            <div className="space-y-3 font-mono text-xs">
              <div className="p-3 rounded-xl bg-navy-950 border border-navy-800 space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-400">Kiosk ID:</span>
                  <span className="text-cyan-300 font-bold">{selectedLoc.location_id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Jurisdiction:</span>
                  <span className="text-slate-200">{selectedLoc.jurisdiction}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Terminal Type:</span>
                  <span className="text-slate-200">{selectedLoc.type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Geodesic Coords:</span>
                  <span className="text-slate-400 text-[11px]">{selectedLoc.lat.toFixed(4)}, {selectedLoc.lng.toFixed(4)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Recorded Incident Volume:</span>
                  <span className="text-purple-400 font-bold">{selectedLoc.historical_cashouts} cashouts</span>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-navy-950/60 border border-navy-800 text-slate-300 text-[11px] leading-relaxed">
                <strong className="text-cyan-300 block mb-1">Operational Response Protocol:</strong>
                Designated as high-priority surveillance hub during evening cashout windows (18:00 - 21:30). CCTV camera logs correlate with active multi-hop mule cash extraction rings.
              </div>

              <button
                onClick={() => onNavigate('prediction')}
                className="w-full py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 text-white font-mono text-xs font-semibold rounded-lg shadow-lg shadow-cyan-600/20 transition flex items-center justify-center gap-1.5"
              >
                <Compass className="w-3.5 h-3.5" />
                <span>Evaluate Cases Predicting This Node</span>
              </button>
            </div>
          ) : (
            <div className="py-12 text-center text-slate-500 font-mono text-xs">
              Click any circle marker on the map to inspect surveillance metrics and patrol coordinates.
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
