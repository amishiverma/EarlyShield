import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Signal, Stats, Zone, User } from '../types';
import { signalsAPI, zonesAPI, statsAPI, usersAPI, notificationsAPI, Notification } from '../services/api';

interface AppContextType {
  signals: Signal[];
  stats: Stats;
  zones: Zone[];
  notifications: Notification[];
  addSignal: (signal: Omit<Signal, 'id' | 'timestamp' | 'status'>) => Promise<void>;
  updateSignalStatus: (id: string, status: Signal['status']) => Promise<void>;
  markNotificationRead: (id: number) => Promise<void>;
  markAllNotificationsRead: () => Promise<void>;
  isDark: boolean;
  toggleTheme: () => void;
  userType: 'Admin' | 'Student' | 'Management';
  setUserType: (type: 'Admin' | 'Student' | 'Management') => void;
  user: User;
  updateUser: (updates: Partial<User>) => Promise<void>;
  loading: boolean;
  error: string | null;
  refreshData: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Default values for initial state
const DEFAULT_STATS: Stats = { healthScore: 0, activeSignals: 0, trend: [] };
const DEFAULT_USER: User = {
  name: "",
  role: "",
  avatar: "",
  email: "",
  department: "",
  idString: ""
};

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [signals, setSignals] = useState<Signal[]>([]);
  const [stats, setStats] = useState<Stats>(DEFAULT_STATS);
  const [zones, setZones] = useState<Zone[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isDark, setIsDark] = useState(false);
  const [userType, setUserTypeState] = useState<'Admin' | 'Student' | 'Management'>('Admin');
  const [user, setUser] = useState<User>(DEFAULT_USER);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch all data from API
  const refreshData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [signalsData, zonesData, statsData, notificationsData] = await Promise.all([
        signalsAPI.getAll(),
        zonesAPI.getAll(),
        statsAPI.get(),
        notificationsAPI.getAll(),
      ]);

      setSignals(signalsData);
      setZones(zonesData);
      setStats(statsData);
      setNotifications(notificationsData);
    } catch (err) {
      console.error('Failed to fetch data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  // Fetch user when userType changes
  const fetchUser = async (type: 'Admin' | 'Student' | 'Management') => {
    try {
      const userData = await usersAPI.getByType(type);
      setUser(userData);
    } catch (err) {
      console.error('Failed to fetch user:', err);
    }
  };

  // Initial data load
  useEffect(() => {
    refreshData();
  }, []);

  // Load user when userType changes
  useEffect(() => {
    fetchUser(userType);
  }, [userType]);

  // Theme effect
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const toggleTheme = () => setIsDark(prev => !prev);

  const setUserType = (type: 'Admin' | 'Student' | 'Management') => {
    setUserTypeState(type);
  };

  const addSignal = async (signalData: Omit<Signal, 'id' | 'timestamp' | 'status'>) => {
    try {
      const newSignal = await signalsAPI.create(signalData);
      setSignals(prev => [newSignal, ...prev]);
      // Refresh stats after adding signal
      const newStats = await statsAPI.get();
      setStats(newStats);
    } catch (err) {
      console.error('Failed to create signal:', err);
      throw err;
    }
  };

  const updateSignalStatus = async (id: string, status: Signal['status']) => {
    try {
      const updated = await signalsAPI.updateStatus(id, status);
      setSignals(prev => prev.map(s => (s.id === id ? updated : s)));
      // Refresh stats after status change
      const newStats = await statsAPI.get();
      setStats(newStats);
    } catch (err) {
      console.error('Failed to update signal status:', err);
      throw err;
    }
  };

  const updateUser = async (updates: Partial<User>) => {
    try {
      const updated = await usersAPI.update(userType, updates);
      setUser(updated);
    } catch (err) {
      console.error('Failed to update user:', err);
      throw err;
    }
  };

  const markNotificationRead = async (id: number) => {
    try {
      const updated = await notificationsAPI.markRead(id);
      setNotifications(prev => prev.map(n => (n.id === id ? updated : n)));
    } catch (err) {
      console.error('Failed to mark notification as read:', err);
      throw err;
    }
  };

  const markAllNotificationsRead = async () => {
    try {
      await notificationsAPI.markAllRead();
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    } catch (err) {
      console.error('Failed to mark all notifications as read:', err);
      throw err;
    }
  };

  return (
    <AppContext.Provider
      value={{
        signals,
        stats,
        zones,
        notifications,
        addSignal,
        updateSignalStatus,
        markNotificationRead,
        markAllNotificationsRead,
        isDark,
        toggleTheme,
        userType,
        setUserType,
        user,
        updateUser,
        loading,
        error,
        refreshData
      }}
    >
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