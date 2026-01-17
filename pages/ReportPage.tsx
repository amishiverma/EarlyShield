import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import Logo from '../components/Logo';

const ReportPage = () => {
  const navigate = useNavigate();
  const { addSignal, zones } = useApp();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    category: '',
    location: zones[0]?.name || '',
    severity: 'Moderate',
    description: ''
  });

  const handleCategorySelect = (cat: string) => {
    setFormData(prev => ({ ...prev, category: cat }));
    setStep(2);
  };

  const handleSubmit = () => {
    addSignal({
      id: Date.now().toString(),
      title: `${formData.category} Issue Reported`,
      category: formData.category,
      location: formData.location,
      timestamp: 'Just now',
      riskLevel: formData.severity as any,
      description: formData.description,
      status: 'Open'
    });
    // Normally would show success state, but for demo navigate back
    navigate('/');
  };

  const getSeverityColor = (sev: string) => {
     // If not selected, return light grey (visible) style
     if (formData.severity !== sev) return 'bg-gray-100 dark:bg-surface-variant text-text-secondary hover:bg-gray-200 dark:hover:bg-surface-variant/80';
     
     // If selected, return specific color
     switch(sev) {
         case 'Minor': return 'bg-green-600 text-white shadow-md ring-2 ring-green-200 dark:ring-green-900';
         case 'Moderate': return 'bg-orange-500 text-white shadow-md ring-2 ring-orange-200 dark:ring-orange-900';
         case 'Critical': return 'bg-red-600 text-white shadow-md ring-2 ring-red-200 dark:ring-red-900';
         default: return 'bg-gray-100 text-text-secondary';
     }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 flex items-center justify-between bg-white dark:bg-surface px-6 py-4 border-b border-surface-variant/50">
        <div className="flex items-center gap-4">
           <Logo className="h-10" />
           <div className="h-6 w-px bg-surface-variant"></div>
           <p className="text-[11px] font-bold text-text-secondary uppercase tracking-wider opacity-60 pt-1">Campus Management</p>
        </div>
        <Link to="/" className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-variant text-text-secondary">
           <span className="material-symbols-outlined">close</span>
        </Link>
      </header>

      <main className="flex-1 w-full max-w-7xl mx-auto px-6 py-10 flex flex-col gap-10">
        {/* Stepper */}
        <div className="w-full max-w-2xl mx-auto mb-4">
           <div className="flex items-center justify-between relative">
              <div className="absolute top-1/2 left-0 w-full h-0.5 bg-surface-variant -z-10"></div>
              <div className={`absolute top-1/2 left-0 h-0.5 bg-primary -z-10 transition-all duration-500`} style={{ width: step === 1 ? '0%' : step === 2 ? '50%' : '100%' }}></div>
              
              {[
                { s: 1, icon: 'category', label: 'Category' },
                { s: 2, icon: 'edit_note', label: 'Details' },
                { s: 3, icon: 'fact_check', label: 'Review' }
              ].map((item) => (
                  <div key={item.s} className="flex flex-col items-center gap-2 bg-background px-2">
                     <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                         step >= item.s ? 'bg-primary text-white shadow-m3-1' : 'bg-surface-variant text-text-secondary'
                     }`}>
                        <span className="material-symbols-outlined text-sm">{item.icon}</span>
                     </div>
                     <span className={`text-xs font-medium ${step >= item.s ? 'text-primary' : 'text-text-secondary'}`}>{item.label}</span>
                  </div>
              ))}
           </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-start">
           {/* Form Area */}
           <div className="flex-1 w-full space-y-8">
              <div>
                  <h2 className="text-3xl font-display font-medium text-text-main mb-3">Signal Capture</h2>
                  <p className="text-text-secondary text-lg leading-relaxed max-w-xl">Tell us what's happening. Your report helps create a safer, more reliable campus for everyone.</p>
              </div>

              <div className="bg-white dark:bg-surface rounded-[24px] shadow-sm border border-surface-variant/50 p-8 min-h-[400px]">
                 {step === 1 && (
                     <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <label className="text-base font-medium text-text-main">What kind of issue is this?</label>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                           {[
                               { id: 'Connectivity', icon: 'router', color: 'text-primary' },
                               { id: 'Facilities', icon: 'construction', color: 'text-risk-med' },
                               { id: 'Amenities', icon: 'coffee', color: 'text-text-secondary' },
                               { id: 'Security', icon: 'verified_user', color: 'text-risk-high' },
                           ].map(cat => (
                               <button 
                                  key={cat.id} 
                                  onClick={() => handleCategorySelect(cat.id)}
                                  className="group flex flex-col items-center justify-center p-6 rounded-2xl bg-surface border-2 border-transparent hover:border-primary hover:bg-primary-container/10 transition-all"
                               >
                                  <span className={`material-symbols-outlined text-4xl mb-3 ${cat.color} group-hover:scale-110 transition-transform`}>{cat.icon}</span>
                                  <span className="text-sm font-medium text-text-main">{cat.id}</span>
                               </button>
                           ))}
                        </div>
                     </div>
                 )}

                 {step === 2 && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-300">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-text-secondary">Location</label>
                                <div className="relative">
                                    <span className="material-symbols-outlined absolute left-4 top-3.5 text-text-secondary">location_on</span>
                                    <select 
                                        className="w-full pl-12 pr-4 py-3 bg-surface-variant/30 border-0 border-b-2 border-text-secondary/20 focus:border-primary focus:ring-0 rounded-t-lg transition-colors text-black dark:text-white"
                                        value={formData.location}
                                        onChange={(e) => setFormData({...formData, location: e.target.value})}
                                    >
                                        {zones.map((zone) => (
                                            <option key={zone.id} value={zone.name} className="text-black">{zone.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-text-secondary">Impact Severity</label>
                                <div className="flex gap-3">
                                    {['Minor', 'Moderate', 'Critical'].map(sev => (
                                        <button 
                                            key={sev}
                                            onClick={() => setFormData({...formData, severity: sev})}
                                            className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all transform active:scale-95 duration-200 ${getSeverityColor(sev)}`}
                                        >
                                            {sev}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-text-secondary">Observations</label>
                            <textarea 
                                className="w-full p-4 bg-surface-variant/30 border-0 border-b-2 border-text-secondary/20 focus:border-primary focus:ring-0 rounded-t-lg min-h-[120px] text-text-main"
                                placeholder="Describe the issue in detail..."
                                value={formData.description}
                                onChange={(e) => setFormData({...formData, description: e.target.value})}
                            ></textarea>
                        </div>
                        <div className="flex justify-between pt-4">
                            <button onClick={() => setStep(1)} className="px-6 py-2 text-text-secondary font-medium hover:bg-surface-variant rounded-full">Back</button>
                            <button onClick={() => setStep(3)} className="px-6 py-2 bg-primary text-white font-medium rounded-full shadow-md hover:shadow-lg transition-all">Next: Review</button>
                        </div>
                    </div>
                 )}

                 {step === 3 && (
                     <div className="flex flex-col items-center justify-center text-center h-full py-10 animate-in fade-in zoom-in duration-300">
                         <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-6">
                            <span className="material-symbols-outlined text-4xl">check</span>
                         </div>
                         <h3 className="text-2xl font-display font-medium text-text-main mb-2">Ready to submit?</h3>
                         <p className="text-text-secondary mb-8 max-w-sm">You are reporting a <span className="font-bold text-text-main">{formData.severity}</span> issue in <span className="font-bold text-text-main">{formData.location}</span>.</p>
                         
                         <div className="flex gap-4">
                             <button onClick={() => setStep(2)} className="px-6 py-3 border border-text-secondary/20 text-text-main font-medium rounded-full hover:bg-surface-variant">Edit</button>
                             <button onClick={handleSubmit} className="px-8 py-3 bg-primary text-white font-medium rounded-full shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all flex items-center gap-2">
                                <span>Submit Report</span>
                                <span className="material-symbols-outlined text-sm">send</span>
                             </button>
                         </div>
                     </div>
                 )}
              </div>
           </div>

           {/* Live Preview Sidebar */}
           <div className="hidden lg:block w-[360px] sticky top-28 space-y-6">
               <div className="bg-white dark:bg-surface rounded-2xl shadow-sm border border-surface-variant/50 overflow-hidden">
                   <div className="bg-primary-container/40 p-5 flex items-center justify-between border-b border-primary-container/20">
                       <div className="flex items-center gap-2 text-primary">
                           <span className="material-symbols-outlined">analytics</span>
                           <span className="text-sm font-bold font-display">Live Preview</span>
                       </div>
                       <span className="bg-white px-2 py-0.5 rounded-full text-[10px] font-bold text-primary uppercase tracking-wider">Draft</span>
                   </div>
                   <div className="p-6 space-y-6">
                       <div className="space-y-1">
                           <p className="text-[10px] font-bold text-text-secondary uppercase tracking-widest opacity-60">Category</p>
                           <div className="flex items-center gap-2">
                               <span className="material-symbols-outlined text-primary text-xl">
                                   {formData.category === 'Connectivity' ? 'router' : formData.category === 'Facilities' ? 'construction' : 'category'}
                               </span>
                               <p className="text-lg font-medium text-text-main">{formData.category || 'Not selected'}</p>
                           </div>
                       </div>
                       <div className="grid grid-cols-2 gap-4">
                           <div>
                               <p className="text-[10px] font-bold text-text-secondary uppercase tracking-widest opacity-60 mb-1">Location</p>
                               <p className="text-sm font-medium text-text-main">{formData.location}</p>
                           </div>
                           <div>
                               <p className="text-[10px] font-bold text-text-secondary uppercase tracking-widest opacity-60 mb-1">Severity</p>
                               <div className="flex items-center gap-1">
                                   <span className={`material-symbols-outlined text-sm ${
                                       formData.severity === 'Critical' ? 'text-risk-high' : 
                                       formData.severity === 'Moderate' ? 'text-risk-med' : 'text-risk-low'
                                   }`}>
                                       {formData.severity === 'Critical' ? 'error' : 'warning'}
                                   </span>
                                   <p className={`text-sm font-bold ${
                                       formData.severity === 'Critical' ? 'text-risk-high' : 
                                       formData.severity === 'Moderate' ? 'text-risk-med' : 'text-risk-low'
                                   }`}>{formData.severity}</p>
                                </div>
                           </div>
                       </div>
                   </div>
               </div>
               
               <div className="p-4 bg-primary-container/20 border border-primary-container/50 rounded-xl flex gap-4">
                   <span className="material-symbols-outlined text-primary">lightbulb</span>
                   <p className="text-sm text-on-primary-container font-medium leading-snug">Did you know? Precise locations help our teams resolve IT issues 40% faster.</p>
               </div>
           </div>
        </div>
      </main>
    </div>
  );
};

export default ReportPage;