import React from 'react';
import Layout from '../components/Layout';
import { useApp } from '../context/AppContext';

const SettingsPage = () => {
    const { isDark, toggleTheme } = useApp();

  return (
    <Layout>
      <div className="flex-1 overflow-y-auto no-scrollbar bg-background p-8">
        <h1 className="text-3xl font-display font-bold text-text-main mb-8">Settings</h1>
        
        <div className="max-w-3xl space-y-6">
            <div className="bg-white dark:bg-surface rounded-2xl p-6 border border-surface-variant">
                <h2 className="text-xl font-bold text-text-main mb-4">Appearance</h2>
                <div className="flex items-center justify-between">
                    <div>
                        <p className="font-medium text-text-main">Dark Mode</p>
                        <p className="text-sm text-text-secondary">Adjust the interface for low light environments</p>
                    </div>
                    <button 
                        onClick={toggleTheme}
                        className={`w-14 h-8 rounded-full p-1 transition-colors ${isDark ? 'bg-primary' : 'bg-surface-variant'}`}
                    >
                        <div className={`w-6 h-6 bg-white rounded-full shadow-sm transition-transform ${isDark ? 'translate-x-6' : ''}`}></div>
                    </button>
                </div>
            </div>

            <div className="bg-white dark:bg-surface rounded-2xl p-6 border border-surface-variant">
                <h2 className="text-xl font-bold text-text-main mb-4">Notifications</h2>
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-medium text-text-main">Email Alerts</p>
                            <p className="text-sm text-text-secondary">Receive daily risk summaries</p>
                        </div>
                        <input type="checkbox" className="w-5 h-5 rounded text-primary focus:ring-primary" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-medium text-text-main">Critical Push Notifications</p>
                            <p className="text-sm text-text-secondary">Immediate alerts for high-risk signals</p>
                        </div>
                        <input type="checkbox" className="w-5 h-5 rounded text-primary focus:ring-primary" defaultChecked />
                    </div>
                </div>
            </div>
            
             <div className="bg-white dark:bg-surface rounded-2xl p-6 border border-surface-variant">
                <h2 className="text-xl font-bold text-text-main mb-4">Integrations</h2>
                <div className="flex items-center justify-between">
                     <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#00305e] rounded-lg flex items-center justify-center text-white font-bold">SAP</div>
                        <div>
                            <p className="font-medium text-text-main">SAP Solution Manager</p>
                            <p className="text-sm text-text-secondary">Connected • Last sync 5m ago</p>
                        </div>
                     </div>
                     <button className="text-sm font-bold text-primary border border-surface-variant px-4 py-2 rounded-full hover:bg-surface-variant">Configure</button>
                </div>
            </div>
        </div>
      </div>
    </Layout>
  );
};

export default SettingsPage;