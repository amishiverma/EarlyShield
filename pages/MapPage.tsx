import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Link } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, ZoomControl, useMap } from 'react-leaflet';
import L from 'leaflet';
import { analyzeRiskZone } from '../services/ai';

// CSS for blinking animation (injecting here since we can't easily modify main CSS file from here)
const blinkStyle = `
@keyframes blink-red {
  0% { box-shadow: 0 0 0 0 rgba(179, 38, 30, 0.7); transform: scale(1); }
  70% { box-shadow: 0 0 0 15px rgba(179, 38, 30, 0); transform: scale(1.1); }
  100% { box-shadow: 0 0 0 0 rgba(179, 38, 30, 0); transform: scale(1); }
}
.blink-critical {
  animation: blink-red 1.5s infinite;
}
`;

// Create style tag
const styleSheet = document.createElement("style");
styleSheet.innerText = blinkStyle;
document.head.appendChild(styleSheet);

// Custom Icons
const createCustomIcon = (riskLevel: string) => {
  const color = 
    riskLevel === 'Critical' ? '#B3261E' : 
    riskLevel === 'Moderate' ? '#EA8600' : 
    '#146C2E';

  const isCritical = riskLevel === 'Critical';
  
  // Size logic: Critical is larger (48px), others are smaller (32px)
  const size = isCritical ? 48 : 32;
  const iconSize = isCritical ? 28 : 20;
  const anchor = isCritical ? [24, 48] : [16, 32];
  const popupAnchor = isCritical ? [0, -48] : [0, -32];

  return L.divIcon({
    className: 'custom-div-icon',
    html: `<div class="${isCritical ? 'blink-critical' : ''}" style="
      background-color: white;
      border: ${isCritical ? '4px' : '3px'} solid ${color};
      width: ${size}px;
      height: ${size}px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 10px rgba(0,0,0,0.4);
      transition: all 0.3s ease;
    ">
      <span class="material-symbols-outlined" style="font-size: ${iconSize}px; color: ${color}; font-variation-settings: 'FILL' 1;">
        ${riskLevel === 'Critical' ? 'warning' : 'verified_user'}
      </span>
    </div>`,
    iconSize: [size, size],
    iconAnchor: anchor as [number, number],
    popupAnchor: popupAnchor as [number, number]
  });
};

const MapController = ({ center }: { center: [number, number] }) => {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, map.getZoom());
  }, [center, map]);
  return null;
};

const MapPage = () => {
  const { zones } = useApp();
  const [selectedZoneId, setSelectedZoneId] = useState<string | null>(null);
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiReport, setAiReport] = useState<string | null>(null);

  const filteredZones = zones.filter(z => {
      const matchesFilter = filter === 'All' || z.category === filter;
      const matchesSearch = z.name.toLowerCase().includes(search.toLowerCase());
      return matchesFilter && matchesSearch;
  });

  const selectedZone = zones.find(z => z.id === selectedZoneId);
  
  // Center map on Vile Parle West (SVKM)
  const mapCenter: [number, number] = [19.1035, 72.8365];

  const handleGenerateReport = async () => {
    if (!selectedZone) return;
    setIsGenerating(true);
    setAiReport(null);
    try {
        const report = await analyzeRiskZone(selectedZone.name, selectedZone.riskLevel);
        setAiReport(report || "No data returned.");
    } catch (e) {
        setAiReport("Analysis failed.");
    } finally {
        setIsGenerating(false);
    }
  };

  useEffect(() => {
    setAiReport(null); // Clear report on zone change
  }, [selectedZoneId]);

  return (
    <div className="relative w-full h-full bg-[#E5E7EB] overflow-hidden flex">
      {/* Search & Filter Bar - Aligned to Start (Left) to avoid Right Panel overlap */}
      <div className="absolute top-4 left-4 right-4 z-[400] pointer-events-none flex flex-col items-start">
        <div className="pointer-events-auto w-full max-w-4xl flex gap-4">
            <div className="flex-1 bg-white h-12 rounded-full shadow-md border border-gray-200 flex items-center px-4 gap-3 max-w-md">
                 <Link to="/" className="material-symbols-outlined text-text-secondary hover:text-primary">arrow_back</Link>
                 <input 
                    className="flex-1 border-none focus:ring-0 text-sm bg-transparent text-text-main" 
                    placeholder="Search campus buildings..." 
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                 />
                 <span className="material-symbols-outlined text-text-secondary">search</span>
            </div>
            <div className="flex gap-2 overflow-x-auto no-scrollbar py-1">
                {['All', 'Safety', 'IT', 'Facilities'].map(f => (
                    <button 
                        key={f}
                        onClick={() => setFilter(f)}
                        className={`px-4 h-10 rounded-full text-sm font-medium transition-all shadow-sm border ${
                            filter === f 
                            ? 'bg-primary text-white border-primary' 
                            : 'bg-white text-text-secondary border-gray-200 hover:bg-surface-variant'
                        }`}
                    >
                        {f}
                    </button>
                ))}
            </div>
        </div>
      </div>

      <div className="flex-1 relative z-0">
          <MapContainer 
            center={mapCenter} 
            zoom={16} 
            scrollWheelZoom={true} 
            style={{ height: "100%", width: "100%" }}
            zoomControl={false}
          >
             <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
             />
             <ZoomControl position="bottomright" />
             
             {selectedZone && <MapController center={selectedZone.latLng} />}

             {filteredZones.map(zone => (
                <Marker 
                    key={zone.id} 
                    position={zone.latLng}
                    icon={createCustomIcon(zone.riskLevel)}
                    eventHandlers={{
                        click: () => setSelectedZoneId(zone.id),
                    }}
                >
                </Marker>
             ))}
          </MapContainer>
      </div>

      {/* Floating Sidebar (Left) - Stats */}
      <div className="absolute left-6 top-24 bottom-6 w-80 z-[400] bg-white rounded-[28px] shadow-2xl border border-white/50 flex flex-col overflow-hidden hidden lg:flex">
         <div className="p-6">
             <h2 className="text-xl font-display font-medium text-text-main mb-6">Risk Intelligence</h2>
             <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="bg-red-50 p-4 rounded-2xl border border-red-100">
                    <p className="text-[11px] text-risk-high font-bold uppercase mb-1">Signals</p>
                    <p className="text-3xl font-display font-medium text-risk-high">42</p>
                </div>
                <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100">
                    <p className="text-[11px] text-primary font-bold uppercase mb-1">Active Zones</p>
                    <p className="text-3xl font-display font-medium text-primary">3</p>
                </div>
             </div>
             <h3 className="text-sm font-bold text-text-secondary mb-4">Critical Hotspots</h3>
             <div className="space-y-2 overflow-y-auto max-h-[200px] no-scrollbar">
                 {zones.filter(z => z.riskLevel !== 'Stable').map(z => (
                     <button key={z.id} onClick={() => setSelectedZoneId(z.id)} className="w-full flex items-center gap-4 p-3 rounded-2xl hover:bg-surface-variant/50 transition-colors text-left">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                            z.riskLevel === 'Critical' ? 'bg-red-100 text-risk-high' : 'bg-amber-100 text-risk-med'
                        }`}>
                             <span className="material-symbols-outlined text-sm">location_on</span>
                        </div>
                        <div>
                             <p className="text-sm font-bold text-text-main">{z.name}</p>
                             <p className="text-[10px] text-text-secondary">{z.details}</p>
                        </div>
                     </button>
                 ))}
             </div>
         </div>
         <div className="mt-auto p-6 bg-surface-variant/20 border-t border-surface-variant/50">
             <p className="text-[11px] font-bold text-text-secondary uppercase mb-2">Predicted Risk Trend</p>
             <div className="h-24 flex items-end gap-1 px-1">
                  {[30, 50, 40, 70, 85, 100, 45].map((h, i) => (
                      <div key={i} className={`flex-1 rounded-t-sm ${h > 80 ? 'bg-risk-high' : 'bg-primary/40'}`} style={{ height: `${h}%` }}></div>
                  ))}
             </div>
         </div>
      </div>

      {/* Details Panel (Right) */}
      <div className={`absolute top-0 right-0 h-full w-full md:w-[420px] z-[500] bg-white shadow-2xl transition-transform duration-300 transform ${selectedZoneId ? 'translate-x-0' : 'translate-x-full'}`}>
         {selectedZone && (
             <div className="flex flex-col h-full">
                 <div className="p-6 border-b border-surface-variant flex items-center justify-between">
                     <div>
                         <h2 className="text-2xl font-display font-medium text-text-main">{selectedZone.name}</h2>
                         <div className="flex items-center gap-2 mt-1">
                             <span className={`material-symbols-outlined text-lg ${
                                 selectedZone.riskLevel === 'Critical' ? 'text-risk-high' : 'text-risk-med'
                             }`}>warning</span>
                             <span className="text-sm font-medium text-text-secondary">{selectedZone.details}</span>
                         </div>
                     </div>
                     <button onClick={() => setSelectedZoneId(null)} className="w-10 h-10 rounded-full hover:bg-surface-variant flex items-center justify-center">
                         <span className="material-symbols-outlined">close</span>
                     </button>
                 </div>
                 <div className="flex-1 overflow-y-auto p-6 space-y-6">
                      <div className="bg-surface p-4 rounded-2xl border border-surface-variant">
                          <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center gap-2">
                                  <span className="w-2 h-2 rounded-full bg-risk-high"></span>
                                  <span className="text-sm font-bold text-text-main">Unattended Object</span>
                              </div>
                              <span className="text-xs text-text-secondary">2m ago</span>
                          </div>
                          <p className="text-sm text-text-secondary mb-4">Spatial anomaly detected in Ground Floor foyer near Cafe. Cross-referencing with CCTV-104.</p>
                          <div className="flex gap-2">
                              <button className="flex-1 py-2 bg-white border border-surface-variant rounded-full text-xs font-bold hover:bg-surface-variant transition-colors">ACKNOWLEDGE</button>
                              <Link to="/case" className="flex-1 py-2 bg-primary-container text-primary rounded-full text-xs font-bold hover:bg-primary-container/80 transition-colors text-center">INVESTIGATE</Link>
                          </div>
                      </div>

                      {/* AI Warning Box */}
                      <div className="bg-primary p-6 rounded-[24px] text-white relative overflow-hidden shadow-lg">
                          <span className="material-symbols-outlined absolute -bottom-4 -right-4 text-white/10 text-9xl">auto_awesome</span>
                          <h4 className="text-sm font-bold mb-3 flex items-center gap-2 relative z-10">
                              <span className="material-symbols-outlined text-lg">insights</span>
                              Gemini Maps Intelligence
                          </h4>
                          
                          {aiReport ? (
                              <div className="relative z-10 animate-in fade-in">
                                  <div className="text-xs text-white/90 leading-relaxed mb-4 p-3 bg-white/10 rounded-xl max-h-40 overflow-y-auto">
                                      {aiReport}
                                  </div>
                                  <button 
                                      onClick={() => setAiReport(null)}
                                      className="w-full py-2 bg-white/20 text-white text-xs font-bold rounded-full hover:bg-white/30"
                                  >
                                      Refresh Analysis
                                  </button>
                              </div>
                          ) : (
                              <>
                                <p className="text-xs text-white/90 leading-relaxed mb-6 relative z-10">
                                    Generate a real-time risk assessment for {selectedZone.name} using Google Maps Grounding data.
                                </p>
                                <button 
                                    onClick={handleGenerateReport}
                                    disabled={isGenerating}
                                    className="w-full py-3 bg-white text-primary text-xs font-bold rounded-full relative z-10 uppercase tracking-widest hover:bg-white/90 disabled:opacity-70 flex items-center justify-center gap-2"
                                >
                                    {isGenerating ? (
                                        <>
                                        <span className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></span>
                                        <span>Analyzing...</span>
                                        </>
                                    ) : (
                                        <>
                                        <span className="material-symbols-outlined text-sm">travel_explore</span>
                                        <span>Scan Location</span>
                                        </>
                                    )}
                                </button>
                              </>
                          )}
                      </div>
                 </div>
             </div>
         )}
      </div>
    </div>
  );
};

export default MapPage;