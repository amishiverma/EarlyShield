import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Signal, Stats, Zone, User } from '../types';
import { INITIAL_SIGNALS, INITIAL_STATS, ZONES } from '../services/mockData';

interface AppContextType {
  signals: Signal[];
  stats: Stats;
  zones: Zone[];
  addSignal: (signal: Signal) => void;
  updateSignalStatus: (id: string, status: Signal['status']) => void;
  isDark: boolean;
  toggleTheme: () => void;
  userType: 'Admin' | 'Student' | 'Management';
  setUserType: (type: 'Admin' | 'Student' | 'Management') => void;
  user: User;
  updateUser: (updates: Partial<User>) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [signals, setSignals] = useState<Signal[]>(INITIAL_SIGNALS);
  const [stats, setStats] = useState<Stats>(INITIAL_STATS);
  const [zones] = useState<Zone[]>(ZONES);
  const [isDark, setIsDark] = useState(false);
  const [userType, setUserType] = useState<'Admin' | 'Student' | 'Management'>('Admin');
  
  const [user, setUser] = useState<User>({
    name: "Elena R.",
    role: "Senior Safety Officer",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuCDsquM8W_8wrc4mSLbXSGzX5Ol8iJZV3n7h3UIQoKQN0cvhsZtHPaO6EgSEKgK1AQL9Vi8Fmel7QH4GApvEQwRjNPbCW6vBxZArxuFfrqUt6UEQYOUHKwqwMJ7txroBdbflF0259u8ctVeFsXx_xN57yaKyWG9aTm0LWN-Js6LJtzh9WJTq18jWCryU6-L0vHzX1GVS2f15SaacTOaVoOVLUvOYWc200qDBqrTjce1HJkgCQ9cc9jdo6pEiEMcQnPoYLz0kqG1cBo",
    email: "elena.r@earlyshield.edu",
    department: "Campus Security & Risk",
    idString: "CSR-2024-8842"
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  // Switch Persona when UserType changes
  useEffect(() => {
     if (userType === 'Admin') {
         setUser({
            name: "Elena R.",
            role: "Senior Safety Officer",
            avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuCDsquM8W_8wrc4mSLbXSGzX5Ol8iJZV3n7h3UIQoKQN0cvhsZtHPaO6EgSEKgK1AQL9Vi8Fmel7QH4GApvEQwRjNPbCW6vBxZArxuFfrqUt6UEQYOUHKwqwMJ7txroBdbflF0259u8ctVeFsXx_xN57yaKyWG9aTm0LWN-Js6LJtzh9WJTq18jWCryU6-L0vHzX1GVS2f15SaacTOaVoOVLUvOYWc200qDBqrTjce1HJkgCQ9cc9jdo6pEiEMcQnPoYLz0kqG1cBo",
            email: "elena.r@earlyshield.edu",
            department: "Campus Security & Risk",
            idString: "CSR-2024-8842"
         });
     } else if (userType === 'Student') {
         setUser({
            name: "Alex M.",
            role: "Computer Science",
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix",
            email: "alex.m@student.earlyshield.edu",
            department: "Engineering",
            idString: "S-2109923"
         });
     } else {
         setUser({
            name: "Dr. Sarah J.",
            role: "Dean of Student Affairs",
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sorelle",
            email: "sarah.j@earlyshield.edu",
            department: "Administration",
            idString: "ADM-004"
         });
     }
  }, [userType]);

  const toggleTheme = () => setIsDark(prev => !prev);

  const addSignal = (signal: Signal) => {
    setSignals((prev) => [signal, ...prev]);
    setStats((prev) => ({
      ...prev,
      activeSignals: prev.activeSignals + 1,
      healthScore: Math.max(0, prev.healthScore - (signal.riskLevel === 'Critical' ? 5 : 2)),
    }));
  };

  const updateSignalStatus = (id: string, status: Signal['status']) => {
    setSignals((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status } : s))
    );
  };
  
  const updateUser = (updates: Partial<User>) => {
      setUser(prev => ({ ...prev, ...updates }));
  };

  return (
    <AppContext.Provider value={{ signals, stats, zones, addSignal, updateSignalStatus, isDark, toggleTheme, userType, setUserType, user, updateUser }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};