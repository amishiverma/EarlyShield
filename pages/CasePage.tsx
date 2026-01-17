import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { useApp } from '../context/AppContext';
import { analyzeCaseSignals } from '../services/ai';

const CasePage = () => {
  const { signals } = useApp();
  const [isSyncing, setIsSyncing] = useState(false);
  const [isSynced, setIsSynced] = useState(false);
  const [activeTab, setActiveTab] = useState<'AI' | 'Signals' | 'SAP'>('AI');
  
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
     // Trigger analysis once when entering AI tab if not present
     if (activeTab === 'AI' && !aiAnalysis && !isAnalyzing) {
         runAnalysis();
     }
  }, [activeTab]);

  const runAnalysis = async () => {
      setIsAnalyzing(true);
      // Filter relevant signals for this mock "Case #402"
      // In a real app, we'd filter by case ID. Here we just take the first few signals.
      const relevantSignals = signals.slice(0, 5); 
      
      const result = await analyzeCaseSignals(relevantSignals);
      setAiAnalysis(result || "AI Analysis unavailable at this time.");
      setIsAnalyzing(false);
  };

  const handleExport = () => {
    setIsSyncing(true);
    setTimeout(() => {
        setIsSyncing(false);
        setIsSynced(true);
    }, 2500);
  };

  return (
    <Layout>
      <div className="flex-1 w-full overflow-y-auto no-scrollbar bg-surface h-full">
        {/* Sticky Header */}
        <div className="sticky top-0 z-40 bg-surface/80 backdrop-blur-md border-b border-surface-variant px-8 py-4 flex items-center justify-between">
           <div className="flex items-center gap-2 text-sm text-text-secondary">
              <Link to="/" className="hover:text-primary">Dashboard</Link>
              <span className="material-symbols-outlined text-sm">chevron_right</span>
              <span>Case #402</span>
           </div>
           <div className="flex gap-3">
              <button className="h-10 px-4 rounded-full border border-surface-variant bg-white dark:bg-surface text-text-main text-sm font-medium hover:bg-surface-variant transition-colors flex items-center gap-2">
                 <span className="material-symbols-outlined text-lg">share</span>
                 Share
              </button>
              <button className="h-10 px-4 rounded-full bg-text-main text-white dark:text-black text-sm font-medium hover:opacity-90 transition-colors flex items-center gap-2">
                 <span className="material-symbols-outlined text-lg">download</span>
                 Export
              </button>
           </div>
        </div>

        <div className="max-w-7xl mx-auto px-8 py-10">
           {/* Title Section */}
           <div className="mb-10">
              <h1 className="text-4xl font-display font-medium text-text-main mb-4">Case #402: Library Wi-Fi Degradation</h1>
              <div className="flex flex-wrap items-center gap-3">
                 <Badge icon="group_work" label="Clustered (12 Reports)" color="bg-primary-container text-primary" />
                 <Badge icon="bolt" label="Confidence: High (92%)" color="bg-amber-100 text-risk-med" />
                 <Badge icon="adjust" label="Status: Open" color="bg-white border border-surface-variant text-text-main" />
                 <span className="text-sm font-medium text-text-secondary ml-2">Active since Oct 24, 09:30 AM</span>
              </div>
           </div>

           {/* Tabs */}
           <div className="flex gap-8 border-b border-surface-variant mb-10">
              <button 
                onClick={() => setActiveTab('AI')}
                className={`pb-3 text-sm font-bold flex items-center gap-2 border-b-2 transition-colors ${activeTab === 'AI' ? 'border-primary text-primary' : 'border-transparent text-text-secondary hover:text-text-main'}`}
              >
                 <span className={`material-symbols-outlined ${activeTab === 'AI' ? 'icon-filled' : ''}`}>auto_awesome</span>
                 AI Analysis
              </button>
              <button 
                onClick={() => setActiveTab('Signals')}
                className={`pb-3 text-sm font-medium flex items-center gap-2 border-b-2 transition-colors ${activeTab === 'Signals' ? 'border-primary text-primary' : 'border-transparent text-text-secondary hover:text-text-main'}`}
              >
                 <span className="material-symbols-outlined">podcasts</span>
                 Raw Signals ({signals.length})
              </button>
              <button 
                onClick={() => setActiveTab('SAP')}
                className={`pb-3 text-sm font-medium flex items-center gap-2 border-b-2 transition-colors ${activeTab === 'SAP' ? 'border-primary text-primary' : 'border-transparent text-text-secondary hover:text-text-main'}`}
              >
                 <span className="material-symbols-outlined">settings_input_component</span>
                 SAP Export Settings
              </button>
           </div>

           <div className="grid grid-cols-12 gap-8 items-start">
              {/* Left Column Content Based on Tab */}
              <div className="col-span-12 lg:col-span-8 space-y-8">
                 
                 {activeTab === 'AI' && (
                     <>
                        {/* AI Summary Card */}
                        <div className="bg-white dark:bg-surface rounded-[24px] p-8 border border-surface-variant/50 shadow-sm animate-in fade-in">
                            <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-xl bg-primary-container flex items-center justify-center text-primary">
                                <span className="material-symbols-outlined icon-filled">auto_awesome</span>
                            </div>
                            <h3 className="text-xl font-medium text-text-main">Cluster Intelligence</h3>
                            </div>
                            
                            {isAnalyzing ? (
                                <div className="space-y-4 mb-8">
                                    <div className="flex items-center gap-3 text-primary">
                                        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></span>
                                        <span className="text-sm font-bold">Gemini is analyzing signal patterns...</span>
                                    </div>
                                    <div className="h-4 bg-surface-variant/50 rounded w-full animate-pulse"></div>
                                    <div className="h-4 bg-surface-variant/50 rounded w-5/6 animate-pulse"></div>
                                    <div className="h-4 bg-surface-variant/50 rounded w-4/6 animate-pulse"></div>
                                </div>
                            ) : (
                                <div className="text-text-secondary text-lg leading-relaxed mb-8 space-y-4">
                                   {aiAnalysis ? (
                                       <div dangerouslySetInnerHTML={{ __html: aiAnalysis }} />
                                   ) : (
                                       <p>No analysis available.</p>
                                   )}
                                </div>
                            )}
                            
                            <div className="bg-surface rounded-xl p-4 border border-surface-variant">
                            <p className="text-xs font-bold text-text-secondary uppercase tracking-widest mb-4">Confidence Factors</p>
                            <div className="space-y-3">
                                <ProbabilityRow label="Corroborated by multiple devices" value="High" icon="devices" highlight />
                                <ProbabilityRow label="Geo-spatial cluster density > 80%" value="Verified" icon="location_on" />
                            </div>
                            </div>
                        </div>

                        {/* Timeline */}
                        <div>
                            <h3 className="text-xl font-medium text-text-main mb-6">Signal Timeline</h3>
                            <div className="relative pl-4 border-l border-surface-variant ml-2 space-y-8 pb-4">
                            <TimelineItem time="09:00 AM" title="First Signal Received" type="default" content="Single report from 'Signal Provider' (Student)." />
                            <TimelineItem time="09:15 AM" title="Cluster Threshold Met" type="primary" expanded content="12 signals received within 15 minutes. AI elevated confidence score to 92%." />
                            <TimelineItem time="09:30 AM" title="Case Created" type="critical" content="Auto-escalated to IT Admin based on severity rules." />
                            
                            <div className="relative pl-8">
                                <div className="absolute left-[-5px] top-1 w-2.5 h-2.5 bg-risk-low rounded-full animate-pulse ring-4 ring-white"></div>
                                <p className="text-xs font-bold text-text-secondary uppercase tracking-widest">Awaiting Admin Action...</p>
                            </div>
                            </div>
                        </div>
                     </>
                 )}

                 {activeTab === 'Signals' && (
                     <div className="bg-white dark:bg-surface rounded-[24px] p-6 border border-surface-variant/50 shadow-sm animate-in fade-in">
                         <div className="flex justify-between items-center mb-6">
                             <h3 className="text-xl font-medium text-text-main">Raw Signal Feed</h3>
                             <span className="px-3 py-1 bg-surface-variant rounded-full text-xs font-bold text-text-secondary">Anonymized</span>
                         </div>
                         <div className="space-y-2">
                            {signals.slice(0, 10).map((s, i) => (
                                <div key={s.id} className="flex items-center gap-4 p-4 hover:bg-surface rounded-xl border-b border-surface-variant last:border-0">
                                    <div className="w-10 h-10 rounded-full bg-surface-variant flex items-center justify-center">
                                        <span className="material-symbols-outlined text-text-secondary">person</span>
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-bold text-text-main">"{s.title}"</p>
                                        <p className="text-xs text-text-secondary">Source: Signal Provider #{4200+i}</p>
                                    </div>
                                    <span className="text-xs font-bold text-text-secondary opacity-60">{s.timestamp}</span>
                                </div>
                            ))}
                         </div>
                     </div>
                 )}

                 {activeTab === 'SAP' && (
                     <div className="bg-white dark:bg-surface rounded-[24px] p-8 border border-surface-variant/50 shadow-sm animate-in fade-in">
                         <h3 className="text-xl font-medium text-text-main mb-6">SAP Integration Configuration</h3>
                         <div className="space-y-4">
                             <div className="p-4 border border-surface-variant rounded-xl flex items-center justify-between">
                                 <div>
                                     <p className="font-bold text-text-main">Automatic Ticket Creation</p>
                                     <p className="text-sm text-text-secondary">Create ITSM ticket when confidence {'>'} 80%</p>
                                 </div>
                                 <div className="w-12 h-6 bg-primary rounded-full relative cursor-pointer"><div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div></div>
                             </div>
                             <div className="p-4 border border-surface-variant rounded-xl flex items-center justify-between">
                                 <div>
                                     <p className="font-bold text-text-main">Asset Synchronization</p>
                                     <p className="text-sm text-text-secondary">Update asset health status in S/4HANA</p>
                                 </div>
                                 <div className="w-12 h-6 bg-surface-variant rounded-full relative cursor-pointer"><div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm"></div></div>
                             </div>
                         </div>
                     </div>
                 )}

              </div>

              {/* Right Column - SAP Integration (Always Visible for Context) */}
              <div className="col-span-12 lg:col-span-4 space-y-6 sticky top-28">
                  <div className="bg-white dark:bg-surface rounded-[24px] overflow-hidden border border-surface-variant shadow-m3-1">
                      <div className="bg-[#041E49] p-6 text-white">
                          <div className="flex items-center gap-2 mb-2 opacity-80">
                             <span className="material-symbols-outlined text-sm">hub</span>
                             <span className="text-[10px] font-bold uppercase tracking-widest">Integration Bridge</span>
                          </div>
                          <h2 className="text-2xl font-medium">Forward to SAP</h2>
                          <p className="text-sm opacity-70 mt-2">Automate ticket creation in SAP Solution Manager.</p>
                      </div>
                      <div className="p-6 space-y-6">
                          <div className="space-y-2">
                             <label className="text-[10px] font-bold text-text-secondary uppercase tracking-widest">SAP Target Module</label>
                             <select className="w-full bg-surface dark:bg-surface-variant border-surface-variant rounded-lg p-3 text-sm font-medium focus:ring-2 focus:ring-primary/20 text-text-main">
                                <option>SAP Solution Manager (ITSM)</option>
                                <option>SAP S/4HANA Plant Maint.</option>
                             </select>
                          </div>
                          
                          <div className="bg-surface dark:bg-surface-variant p-4 rounded-xl border border-surface-variant/50 space-y-3">
                             <div className="flex justify-between items-center text-sm">
                                <span className="text-text-secondary">Priority</span>
                                <div className="flex items-center gap-2">
                                   <span className="material-symbols-outlined text-xs text-text-secondary">arrow_forward</span>
                                   <span className="font-bold bg-white dark:bg-surface px-2 py-0.5 rounded border border-surface-variant">P2 - High</span>
                                </div>
                             </div>
                             <div className="flex justify-between items-center text-sm">
                                <span className="text-text-secondary">Category</span>
                                <div className="flex items-center gap-2">
                                   <span className="material-symbols-outlined text-xs text-text-secondary">arrow_forward</span>
                                   <span className="font-bold text-text-main">Network Issue</span>
                                </div>
                             </div>
                          </div>

                          <button 
                             onClick={handleExport}
                             disabled={isSyncing || isSynced}
                             className={`w-full h-14 rounded-xl font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed ${
                                 isSynced ? 'bg-risk-low text-white' : 'bg-primary text-white'
                             }`}
                          >
                             {isSyncing ? (
                                <>
                                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                  <span>Syncing...</span>
                                </>
                             ) : isSynced ? (
                                <>
                                   <span className="material-symbols-outlined">check_circle</span>
                                   <span>Export Successful</span>
                                </>
                             ) : (
                                <>
                                  <span className="material-symbols-outlined">rocket_launch</span>
                                  <span>Initiate Export</span>
                                </>
                             )}
                          </button>
                      </div>
                  </div>
              </div>
           </div>
        </div>
      </div>
    </Layout>
  );
};

// Sub-components for cleaner code
const Badge = ({ icon, label, color }: any) => (
  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${color}`}>
     <span className="material-symbols-outlined text-[16px] icon-filled">{icon}</span>
     {label}
  </span>
);

const ProbabilityRow = ({ label, value, icon, highlight }: any) => (
  <div className={`flex items-center justify-between p-3 rounded-lg ${highlight ? 'bg-white dark:bg-surface shadow-sm border border-surface-variant' : ''}`}>
     <div className="flex items-center gap-3">
        <span className="material-symbols-outlined text-text-secondary">{icon}</span>
        <span className="text-sm font-medium text-text-main">{label}</span>
     </div>
     <span className={`text-xs font-bold ${highlight ? 'text-primary' : 'text-text-secondary'}`}>{value}</span>
  </div>
);

const TimelineItem = ({ time, title, type, expanded, content }: any) => (
  <div className="relative pl-8 group">
     <div className={`absolute left-[-5px] top-1 w-2.5 h-2.5 rounded-full border-2 border-white ring-1 ring-surface-variant ${
         type === 'critical' ? 'bg-risk-high' : type === 'primary' ? 'bg-primary' : 'bg-text-secondary'
     }`}></div>
     <div className={`p-4 rounded-2xl border border-surface-variant/50 transition-all ${expanded ? 'bg-primary-container/20 border-primary-container/50' : 'bg-white dark:bg-surface hover:shadow-sm'}`}>
         <div className="flex justify-between items-center mb-1">
            <span className="text-xs font-bold text-text-secondary">{time}</span>
            {expanded && <span className="material-symbols-outlined text-primary text-sm">expand_less</span>}
         </div>
         <h4 className="font-bold text-text-main text-sm">{title}</h4>
         {content && <p className="text-sm text-text-secondary mt-2">{content}</p>}
         {expanded && (
             <button className="mt-3 text-xs font-bold text-primary hover:underline uppercase tracking-wider">View Details</button>
         )}
     </div>
  </div>
);

export default CasePage;