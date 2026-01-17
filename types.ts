export type RiskLevel = 'Low' | 'Moderate' | 'Critical' | 'Stable';

export interface Signal {
  id: string;
  title: string;
  category: string;
  location: string;
  timestamp: string; // ISO or relative string for demo
  riskLevel: RiskLevel;
  description: string;
  status: 'Open' | 'Investigating' | 'Resolved';
}

export interface Zone {
  id: string;
  name: string;
  category: 'Safety' | 'IT' | 'Facilities' | 'General';
  riskLevel: RiskLevel;
  signalCount: number;
  coordinates: { x: number; y: number }; // Percentage for map placement fallback
  latLng: [number, number]; // Real coordinates
  details: string;
}

export interface Stats {
  healthScore: number;
  activeSignals: number;
  trend: number[]; // For sparkline
}

export interface User {
  name: string;
  role: string;
  avatar: string;
  email: string;
  department: string;
  idString: string; // studentId or employeeId
}