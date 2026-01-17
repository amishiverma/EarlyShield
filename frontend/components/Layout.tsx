import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import ChatBot from './ChatBot';
import Logo from './Logo';

interface LayoutProps {
  children: React.ReactNode;
  hideSidebar?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { userType, user } = useApp();

  // Role label is now derived from the User object for specific roles, or the UserType for generic fallback logic if needed.
  // We'll prioritize the User object's role if it's descriptive.
  
  const getRoleColor = () => {
      switch(userType) {
          case 'Admin': return 'border-primary';
          case 'Student': return 'border-orange-500';
          case 'Management': return 'border-purple-600';
          default: return 'border-gray-500';
      }
  };

  return (
    <div className="flex h-screen bg-surface overflow-hidden">
      {/* Sidebar Rail */}
      <aside 
        className={`${isExpanded ? 'w-64' : 'w-20'} bg-surface border-r border-surface-variant flex flex-col items-center py-6 z-30 shrink-0 transition-all duration-300 ease-in-out`}
      >
        <div className="w-full flex items-center justify-between px-4 mb-8">
            <Link to="/" className={`flex items-center gap-3 overflow-hidden whitespace-nowrap ${isExpanded ? 'opacity-100' : 'opacity-0 w-0'} transition-all hover:opacity-80`}>
                <Logo className="h-9" mode="full" />
            </Link>
            
             {/* Logo when collapsed */}
            {!isExpanded && (
               <Link to="/" className="mx-auto hover:opacity-80 transition-opacity">
                 <Logo className="h-10 w-10" mode="mark" showText={false} />
               </Link>
            )}

            {/* Toggle Button */}
            {isExpanded && (
                <button onClick={() => setIsExpanded(false)} className="p-1 text-text-secondary hover:bg-surface-variant rounded-full">
                    <span className="material-symbols-outlined">chevron_left</span>
                </button>
            )}
        </div>
        
        {/* Toggle Button for Collapsed State */}
        {!isExpanded && (
             <button onClick={() => setIsExpanded(true)} className="mb-6 p-2 text-text-secondary hover:bg-surface-variant rounded-full">
                <span className="material-symbols-outlined">menu</span>
            </button>
        )}
        
        <nav className="flex-1 flex flex-col gap-2 w-full px-3">
          {/* Role Based Navigation */}
          
          {/* Signal Providers (Students) only see Report and basic Home */}
          {userType === 'Student' && (
            <>
               <NavItem to="/" icon="home" label="Portal" expanded={isExpanded} />
               <NavItem to="/report" icon="add_circle" label="Report Signal" expanded={isExpanded} filled />
            </>
          )}

          {/* Operational Admins see everything */}
          {userType === 'Admin' && (
            <>
                <NavItem to="/" icon="dashboard" label="Dashboard" expanded={isExpanded} />
                <NavItem to="/map" icon="map" label="Risk Map" expanded={isExpanded} />
                <NavItem to="/report" icon="add_circle" label="Report" expanded={isExpanded} filled />
                <NavItem to="/case" icon="assignment" label="Cases" expanded={isExpanded} />
            </>
          )}

          {/* Management sees high-level views only */}
          {userType === 'Management' && (
            <>
                <NavItem to="/" icon="monitoring" label="Executive View" expanded={isExpanded} />
                <NavItem to="/map" icon="map" label="Campus Map" expanded={isExpanded} />
            </>
          )}

        </nav>

        <div className={`mt-auto flex flex-col w-full gap-2 px-3 ${isExpanded ? 'items-start' : 'items-center'}`}>
          <NavItem to="/settings" icon="settings" label="Settings" expanded={isExpanded} />
          
          <NavLink to="/profile" className={`flex items-center gap-3 p-2 rounded-full hover:bg-surface-variant transition-all mt-4 ${isExpanded ? 'w-full' : ''}`}>
             <div className={`w-10 h-10 rounded-full border-2 p-0.5 cursor-pointer shrink-0 ${getRoleColor()}`}>
                <img 
                  alt="User" 
                  className="w-full h-full rounded-full object-cover" 
                  src={user.avatar}
                />
             </div>
             {isExpanded && (
                 <div className="flex-1 overflow-hidden">
                     <p className="text-sm font-bold text-text-main truncate">{user.name}</p>
                     <p className="text-xs text-text-secondary truncate">{user.role}</p>
                 </div>
             )}
          </NavLink>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 relative overflow-hidden flex flex-col">
        {children}
        <ChatBot />
      </main>
    </div>
  );
};

const NavItem = ({ to, icon, label, expanded, filled }: { to: string; icon: string; label: string; expanded: boolean; filled?: boolean }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) => `
        flex items-center ${expanded ? 'px-4 gap-4 justify-start h-12 w-full' : 'justify-center h-12 w-12 mx-auto'} 
        rounded-[16px] transition-all duration-200 group
        ${isActive ? 'bg-primary-container text-on-primary-container' : 'text-text-secondary hover:bg-surface-variant'}
      `}
      title={!expanded ? label : ''}
    >
      {({ isActive }) => (
        <>
            <span className={`material-symbols-outlined ${isActive || filled ? 'icon-filled' : ''} ${isActive ? 'text-on-primary-container' : 'text-text-secondary group-hover:text-text-main'}`}>
            {icon}
            </span>
            {expanded && (
                <span className={`font-medium text-sm whitespace-nowrap ${isActive ? 'font-bold' : ''}`}>{label}</span>
            )}
        </>
      )}
    </NavLink>
  );
};

export default Layout;