import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Link } from 'react-router-dom';
import { LineChart, Line, ResponsiveContainer, XAxis, Tooltip } from 'recharts';
import { NOTIFICATIONS } from '../services/mockData';

const Dashboard = () => {
  const { stats, signals, isDark, toggleTheme, userType, setUserType, user } = useApp();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const chartData = stats.trend.map((val, idx) => ({ name: idx, value: val }));

  return (
    <div className="flex flex-col h-full bg-background overflow-y-auto no-scrollbar" onClick={() => { setShowNotifications(false); setShowUserMenu(false); }}>
      {/* Header */}
      <header className="h-20 flex items-center justify-between px-8 sticky top-0 bg-background/80 backdrop-blur-md z-20 border-b border-transparent">
        {userType === 'Student' ? (
             <div className="flex items-center gap-2">
                 <h1 className="text-xl font-display font-bold text-text-main">Student Portal</h1>
             </div>
        ) : (
            <div className="w-full max-w-2xl bg-surface-variant/40 hover:bg-surface-variant/70 transition-colors h-12 rounded-full flex items-center px-5 gap-3 shadow-sm focus-within:bg-white focus-within:shadow-md focus-within:ring-2 focus-within:ring-primary/20 dark:focus-within:bg-surface">
            <span className="material-symbols-outlined text-text-secondary">search</span>
            <input className="bg-transparent border-none focus:ring-0 flex-1 text-sm font-medium text-text-main placeholder-text-secondary/60" placeholder="Search risks, zones, or intelligence feed" type="text" />
            <div className="flex items-center gap-2 text-text-secondary">
                <button className="p-1 hover:bg-black/5 rounded-full"><span className="material-symbols-outlined text-[20px]">mic</span></button>
            </div>
            </div>
        )}

        <div className="flex items-center gap-4 ml-auto">
          <button onClick={toggleTheme} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-variant transition-colors text-text-secondary">
            <span className="material-symbols-outlined">{isDark ? 'light_mode' : 'dark_mode'}</span>
          </button>
          
          {/* Notifications - Hidden for Students */}
          {userType !== 'Student' && (
            <div className="relative">
                <button 
                    onClick={(e) => {
                        e.stopPropagation();
                        setShowNotifications(!showNotifications);
                        setShowUserMenu(false);
                    }}
                    className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-variant transition-colors relative"
                >
                    <span className="material-symbols-outlined text-text-secondary">notifications</span>
                    <span className="absolute top-2 right-2 w-2 h-2 bg-risk-high rounded-full border border-white"></span>
                </button>
                
                {showNotifications && (
                    <div className="absolute right-0 top-12 w-80 bg-white dark:bg-surface rounded-2xl shadow-m3-2 border border-surface-variant overflow-hidden z-50">
                        <div className="p-4 border-b border-surface-variant flex justify-between items-center">
                            <h4 className="font-bold text-text-main">Notifications</h4>
                            <button className="text-xs text-primary font-bold">Mark all read</button>
                        </div>
                        <div className="max-h-64 overflow-y-auto">
                            {NOTIFICATIONS.map(n => (
                                <div key={n.id} className={`p-4 border-b border-surface-variant last:border-0 hover:bg-surface-variant/30 cursor-pointer ${!n.read ? 'bg-primary-container/10' : ''}`}>
                                    <div className="flex justify-between items-start mb-1">
                                        <p className={`text-sm ${!n.read ? 'font-bold text-text-main' : 'text-text-secondary'}`}>{n.title}</p>
                                        {!n.read && <span className="w-2 h-2 rounded-full bg-primary shrink-0 mt-1.5"></span>}
                                    </div>
                                    <p className="text-xs text-text-secondary opacity-70">{n.time}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
          )}

          {/* User Type Selector */}
          <div className="relative">
            <button 
                onClick={(e) => {
                    e.stopPropagation();
                    setShowUserMenu(!showUserMenu);
                    setShowNotifications(false);
                }}
                className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-full border border-surface-variant hover:bg-surface-variant transition-all bg-surface"
            >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white transition-colors ${
                    userType === 'Admin' ? 'bg-primary' : userType === 'Management' ? 'bg-purple-600' : 'bg-orange-600'
                }`}>
                     <span className="material-symbols-outlined text-lg">
                        {userType === 'Admin' ? 'admin_panel_settings' : userType === 'Management' ? 'monitoring' : 'school'}
                     </span>
                </div>
                <div className="hidden md:flex flex-col items-start">
                    <span className="text-xs font-bold text-text-main leading-none">{userType}</span>
                </div>
                <span className="material-symbols-outlined text-text-secondary text-sm">arrow_drop_down</span>
            </button>
            
            {showUserMenu && (
                <div className="absolute right-0 top-12 w-56 bg-white dark:bg-surface rounded-2xl shadow-m3-2 border border-surface-variant overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                     <div className="p-3 border-b border-surface-variant bg-surface-variant/20">
                        <p className="text-xs font-bold text-text-secondary uppercase tracking-widest">Select Role</p>
                     </div>
                     <button 
                        onClick={() => { setUserType('Student'); setShowUserMenu(false); }}
                        className={`w-full text-left px-4 py-3 text-sm font-medium hover:bg-surface-variant flex items-center gap-3 transition-colors ${userType === 'Student' ? 'text-orange-600 bg-orange-50' : 'text-text-main'}`}
                     >
                        <span className="material-symbols-outlined">school</span>
                        <div>
                            <span className="block">Signal Provider</span>
                            <span className="text-[10px] text-text-secondary font-normal block">Student / Staff View</span>
                        </div>
                        {userType === 'Student' && <span className="material-symbols-outlined text-sm ml-auto">check</span>}
                     </button>
                     <button 
                        onClick={() => { setUserType('Admin'); setShowUserMenu(false); }}
                        className={`w-full text-left px-4 py-3 text-sm font-medium hover:bg-surface-variant flex items-center gap-3 transition-colors ${userType === 'Admin' ? 'text-primary bg-primary/5' : 'text-text-main'}`}
                     >
                        <span className="material-symbols-outlined">admin_panel_settings</span>
                        <div>
                            <span className="block">Admin</span>
                            <span className="text-[10px] text-text-secondary font-normal block">Operations View</span>
                        </div>
                        {userType === 'Admin' && <span className="material-symbols-outlined text-sm ml-auto">check</span>}
                     </button>
                     <button 
                        onClick={() => { setUserType('Management'); setShowUserMenu(false); }}
                        className={`w-full text-left px-4 py-3 text-sm font-medium hover:bg-surface-variant flex items-center gap-3 transition-colors ${userType === 'Management' ? 'text-purple-600 bg-purple-50' : 'text-text-main'}`}
                     >
                        <span className="material-symbols-outlined">monitoring</span>
                        <div>
                            <span className="block">Management</span>
                            <span className="text-[10px] text-text-secondary font-normal block">Oversight View</span>
                        </div>
                        {userType === 'Management' && <span className="material-symbols-outlined text-sm ml-auto">check</span>}
                     </button>
                </div>
            )}
          </div>
        </div>
      </header>

      {/* VIEW: STUDENT / SIGNAL PROVIDER */}
      {userType === 'Student' && (
          <div className="flex-1 px-8 pb-10 max-w-4xl mx-auto w-full flex flex-col items-center justify-center">
              <div className="text-center mb-12">
                  <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 mx-auto mb-6">
                      <span className="material-symbols-outlined text-4xl">campaign</span>
                  </div>
                  <h1 className="text-4xl font-display font-bold text-text-main mb-4">See something? Say something.</h1>
                  <p className="text-lg text-text-secondary max-w-xl mx-auto">
                      Your inputs help our AI identify clusters of issues before they become critical. 
                      <br/>You are one of <strong>840</strong> active signal providers on campus.
                  </p>
              </div>

              <Link to="/report" className="w-full max-w-md group relative">
                  <div className="absolute inset-0 bg-primary blur-xl opacity-20 group-hover:opacity-40 transition-opacity rounded-full"></div>
                  <div className="relative bg-primary hover:bg-primary/90 text-white h-20 rounded-full flex items-center justify-center gap-4 shadow-xl transition-all transform group-hover:scale-105">
                      <span className="material-symbols-outlined text-3xl">add_circle</span>
                      <span className="text-xl font-bold tracking-wide">SUBMIT NEW SIGNAL</span>
                  </div>
              </Link>

              <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
                  <div className="bg-white dark:bg-surface p-6 rounded-2xl border border-surface-variant text-center">
                      <p className="text-4xl font-bold text-primary mb-2">12</p>
                      <p className="text-sm font-bold text-text-secondary uppercase tracking-widest">Your Signals</p>
                  </div>
                  <div className="bg-white dark:bg-surface p-6 rounded-2xl border border-surface-variant text-center">
                      <p className="text-4xl font-bold text-risk-med mb-2">Top 5%</p>
                      <p className="text-sm font-bold text-text-secondary uppercase tracking-widest">Contributor</p>
                  </div>
                  <div className="bg-white dark:bg-surface p-6 rounded-2xl border border-surface-variant text-center">
                      <p className="text-4xl font-bold text-green-600 mb-2">98%</p>
                      <p className="text-sm font-bold text-text-secondary uppercase tracking-widest">Accuracy Score</p>
                  </div>
              </div>
          </div>
      )}

      {/* VIEW: MANAGEMENT / OVERSIGHT */}
      {userType === 'Management' && (
          <div className="flex-1 px-8 pb-10 max-w-[1600px] w-full mx-auto">
               <div className="pt-6 pb-8">
                  <h1 className="text-3xl font-display font-medium text-text-main">Executive Risk Overview</h1>
                  <p className="text-text-secondary mt-2">High-level insights for campus administration.</p>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white dark:bg-surface p-8 rounded-[24px] border border-surface-variant shadow-sm flex flex-col justify-center">
                         <p className="text-sm font-bold text-text-secondary uppercase tracking-widest mb-2">Overall Campus Health</p>
                         <div className="flex items-center gap-4">
                             <span className="text-6xl font-display font-bold text-primary">{stats.healthScore}</span>
                             <span className="text-sm px-2 py-1 bg-green-100 text-green-800 rounded-lg font-bold">Stable</span>
                         </div>
                    </div>
                    <div className="bg-white dark:bg-surface p-8 rounded-[24px] border border-surface-variant shadow-sm flex flex-col justify-center">
                         <p className="text-sm font-bold text-text-secondary uppercase tracking-widest mb-2">Critical Incidents (Today)</p>
                         <div className="flex items-center gap-4">
                             <span className="text-6xl font-display font-bold text-text-main">3</span>
                             <span className="text-sm text-text-secondary">Requires review</span>
                         </div>
                    </div>
                    <div className="bg-white dark:bg-surface p-8 rounded-[24px] border border-surface-variant shadow-sm flex flex-col justify-center">
                         <p className="text-sm font-bold text-text-secondary uppercase tracking-widest mb-2">AI Cost Savings</p>
                         <div className="flex items-center gap-4">
                             <span className="text-6xl font-display font-bold text-text-main">$12k</span>
                             <span className="text-sm text-text-secondary">Projected this month</span>
                         </div>
                    </div>
               </div>

               <div className="bg-white dark:bg-surface rounded-[24px] border border-surface-variant p-8 mb-8 h-96">
                   <h3 className="text-lg font-bold text-text-main mb-6">Weekly Risk Trend</h3>
                   <ResponsiveContainer width="100%" height="80%">
                    <LineChart data={chartData}>
                        <XAxis dataKey="name" hide />
                        <Tooltip />
                        <Line type="monotone" dataKey="value" stroke="#0B57D0" strokeWidth={4} dot={true} />
                    </LineChart>
                   </ResponsiveContainer>
               </div>
          </div>
      )}

      {/* VIEW: ADMIN / OPERATIONAL (Existing Dashboard) */}
      {userType === 'Admin' && (
      <div className="flex-1 px-8 pb-10 max-w-[1600px] w-full mx-auto">
        <div className="pt-6 pb-8 flex justify-between items-end">
          <div>
            <h1 className="text-3xl md:text-4xl font-display font-medium text-text-main tracking-tight">Good morning, {user.name.split(' ')[0]}</h1>
            <p className="text-text-secondary mt-2 font-medium flex items-center gap-2 text-sm">
              <span className={`w-2.5 h-2.5 rounded-full ${stats.healthScore > 80 ? 'bg-risk-low' : 'bg-risk-med'}`}></span>
              Campus systems are performing {stats.healthScore > 80 ? 'optimally' : 'moderately'}.
            </p>
          </div>
          <Link to="/report" className="hidden md:flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-full shadow-m3-1 hover:shadow-m3-2 transition-all font-medium text-sm">
             <span className="material-symbols-outlined text-[20px]">add</span>
             New Report
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-12 gap-6 mb-8">
          {/* Health Score */}
          <div className="col-span-12 md:col-span-6 lg:col-span-4 bg-white dark:bg-surface rounded-m3 p-6 flex flex-col justify-between h-64 border border-surface-variant/50 shadow-sm hover:shadow-m3-1 transition-all relative overflow-hidden">
            <div className="flex justify-between items-start z-10">
              <p className="text-xs font-bold text-text-secondary uppercase tracking-widest">Health Score</p>
              <span className="material-symbols-outlined text-primary bg-primary-container/30 p-2 rounded-full">monitoring</span>
            </div>
            <div className="flex items-baseline gap-2 z-10">
              <span className="text-7xl font-display font-medium text-primary">{stats.healthScore}</span>
              <span className="text-xl text-text-secondary/60">/100</span>
            </div>
            <div className="flex items-center gap-2 text-risk-low font-bold text-sm z-10">
              <span className="material-symbols-outlined text-sm">trending_up</span>
              <span>+2.4% from last week</span>
            </div>
            {/* Decorative BG */}
             <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-primary/5 rounded-full blur-3xl"></div>
          </div>

          {/* Active Signals */}
          <div className="col-span-12 md:col-span-6 lg:col-span-4 bg-white dark:bg-surface rounded-m3 p-6 flex flex-col justify-between h-64 border border-surface-variant/50 shadow-sm hover:shadow-m3-1 transition-all relative overflow-hidden">
            <div className="flex justify-between items-start z-10">
              <p className="text-xs font-bold text-text-secondary uppercase tracking-widest">Active Signals</p>
              <span className="material-symbols-outlined text-risk-med bg-risk-med/10 p-2 rounded-full">warning</span>
            </div>
            <div className="z-10">
              <span className="text-7xl font-display font-medium text-text-main">{stats.activeSignals}</span>
              <p className="text-text-secondary font-medium mt-1 text-sm">Requiring immediate triage</p>
            </div>
            <div className="flex gap-1 z-10 mt-auto">
              <div className="h-2 flex-1 rounded-full bg-risk-high" style={{ width: '20%' }}></div>
              <div className="h-2 flex-1 rounded-full bg-risk-med" style={{ width: '50%' }}></div>
              <div className="h-2 flex-1 rounded-full bg-surface-variant" style={{ width: '30%' }}></div>
            </div>
          </div>

          {/* Trend Chart */}
          <div className="col-span-12 lg:col-span-4 bg-primary-container rounded-m3 p-6 flex flex-col justify-between h-64 shadow-sm border border-transparent">
             <div className="flex justify-between items-start">
              <p className="text-xs font-bold text-on-primary-container uppercase tracking-widest">Risk Trend</p>
              <span className="material-symbols-outlined text-on-primary-container">insights</span>
            </div>
            <div className="flex-1 w-full h-full min-h-[100px] mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                   <Tooltip 
                    contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
                    itemStyle={{ color: '#0B57D0', fontSize: '12px', fontWeight: 'bold' }}
                    labelStyle={{ display: 'none' }}
                    cursor={{ stroke: 'rgba(0,0,0,0.1)', strokeWidth: 2 }}
                   />
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#0B57D0" 
                    strokeWidth={4} 
                    dot={false} 
                    isAnimationActive={true}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <p className="text-on-primary-container font-bold text-sm mt-2">Decreasing risk volatility in Zone A</p>
          </div>
        </div>

        {/* Feeds Grid */}
        <div className="grid grid-cols-12 gap-8">
           {/* Recent Feed */}
           <div className="col-span-12 lg:col-span-8 bg-white dark:bg-surface rounded-m3 shadow-sm border border-surface-variant/50 overflow-hidden flex flex-col min-h-[400px]">
              <div className="p-6 pb-0">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-display font-medium text-text-main">Recent Signals Feed</h3>
                  <button className="text-primary font-bold text-sm hover:underline">Download Report</button>
                </div>
                <div className="flex gap-6 overflow-x-auto no-scrollbar border-b border-surface-variant">
                  <button className="pb-3 text-primary font-bold text-sm border-b-2 border-primary">All Signals</button>
                  <button className="pb-3 text-text-secondary font-medium text-sm hover:text-text-main transition-colors">Flagged</button>
                  <button className="pb-3 text-text-secondary font-medium text-sm hover:text-text-main transition-colors">Categorized</button>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-2 no-scrollbar">
                {signals.map((signal) => (
                  <Link to="/case" key={signal.id} className="flex items-center gap-4 p-4 rounded-2xl hover:bg-surface hover:shadow-sm border border-transparent hover:border-surface-variant transition-all cursor-pointer group">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 transition-transform group-hover:scale-105 ${
                      signal.riskLevel === 'Critical' ? 'bg-red-50 text-risk-high' :
                      signal.riskLevel === 'Moderate' ? 'bg-amber-50 text-risk-med' :
                      'bg-blue-50 text-primary'
                    }`}>
                      <span className="material-symbols-outlined">
                        {signal.category === 'IT Infrastructure' ? 'wifi_off' :
                         signal.category === 'Safety' ? 'experiment' : 'person_search'}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-text-main truncate">{signal.title}</p>
                      <p className="text-sm text-text-secondary mt-0.5 truncate">{signal.location} • {signal.category}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-xs font-bold text-text-secondary/60">{signal.timestamp}</p>
                      <div className="mt-2 flex gap-1 justify-end">
                         <span className={`w-2 h-2 rounded-full ${
                           signal.riskLevel === 'Critical' ? 'bg-risk-high' :
                           signal.riskLevel === 'Moderate' ? 'bg-risk-med' : 'bg-primary'
                         }`}></span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
           </div>

           {/* Mini Map Widget */}
           <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
              <div className="bg-white dark:bg-surface rounded-m3 p-6 shadow-sm border border-surface-variant/50 h-full">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-display font-medium text-text-main">Risk Zones</h3>
                  <Link to="/map" className="material-symbols-outlined text-text-secondary hover:text-primary">open_in_new</Link>
                </div>
                <div className="space-y-6">
                   {/* Zone Item */}
                   <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-surface-variant/50 rounded-2xl flex items-center justify-center text-text-secondary">
                        <span className="material-symbols-outlined">apartment</span>
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between mb-2">
                          <p className="font-bold text-sm text-text-main">Engineering Quad</p>
                          <span className="text-xs font-bold text-risk-high">High Risk</span>
                        </div>
                        <div className="w-full bg-surface-variant h-1.5 rounded-full overflow-hidden">
                          <div className="bg-risk-high h-full rounded-full" style={{ width: '78%' }}></div>
                        </div>
                      </div>
                   </div>
                   {/* Zone Item */}
                   <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-surface-variant/50 rounded-2xl flex items-center justify-center text-text-secondary">
                        <span className="material-symbols-outlined">school</span>
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between mb-2">
                          <p className="font-bold text-sm text-text-main">Arts Center</p>
                          <span className="text-xs font-bold text-risk-low">Stable</span>
                        </div>
                        <div className="w-full bg-surface-variant h-1.5 rounded-full overflow-hidden">
                          <div className="bg-risk-low h-full rounded-full" style={{ width: '15%' }}></div>
                        </div>
                      </div>
                   </div>
                </div>
                <Link to="/map" className="mt-8 w-full py-3.5 border border-primary text-primary font-bold text-sm rounded-full flex items-center justify-center hover:bg-primary/5 transition-colors">
                  Explore Detailed Map
                </Link>
              </div>
           </div>
        </div>
      </div>
      )}
      
      {/* Mobile FAB */}
      {userType === 'Admin' && (
        <Link to="/report" className="md:hidden fixed bottom-6 right-6 w-14 h-14 bg-primary text-white rounded-2xl shadow-m3-2 flex items-center justify-center z-50">
            <span className="material-symbols-outlined text-2xl">add</span>
        </Link>
      )}
    </div>
  );
};

export default Dashboard;