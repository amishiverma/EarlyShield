/**
 * API Service for EarlyShield Backend
 * Handles all communication with the FastAPI backend
 */

import { Signal, Zone, Stats, User } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

// Generic fetch wrapper with error handling
async function fetchAPI<T>(
    endpoint: string,
    options?: RequestInit
): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;

    const response = await fetch(url, {
        headers: {
            'Content-Type': 'application/json',
            ...options?.headers,
        },
        ...options,
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({ detail: 'Unknown error' }));
        throw new Error(error.detail || `HTTP error ${response.status}`);
    }

    return response.json();
}

// ============== SIGNALS ==============
export const signalsAPI = {
    getAll: () => fetchAPI<Signal[]>('/signals'),

    getById: (id: string) => fetchAPI<Signal>(`/signals/${id}`),

    create: (signal: Omit<Signal, 'id' | 'timestamp' | 'status'>) =>
        fetchAPI<Signal>('/signals', {
            method: 'POST',
            body: JSON.stringify(signal),
        }),

    updateStatus: (id: string, status: Signal['status']) =>
        fetchAPI<Signal>(`/signals/${id}/status`, {
            method: 'PATCH',
            body: JSON.stringify({ status }),
        }),

    delete: (id: string) =>
        fetchAPI<{ message: string }>(`/signals/${id}`, {
            method: 'DELETE',
        }),
};

// ============== ZONES ==============
export const zonesAPI = {
    getAll: () => fetchAPI<Zone[]>('/zones'),

    getById: (id: string) => fetchAPI<Zone>(`/zones/${id}`),

    update: (id: string, data: Partial<Zone>) =>
        fetchAPI<Zone>(`/zones/${id}`, {
            method: 'PATCH',
            body: JSON.stringify(data),
        }),
};

// ============== STATS ==============
export const statsAPI = {
    get: () => fetchAPI<Stats>('/stats'),
};

// ============== USERS ==============
export const usersAPI = {
    getByType: (userType: 'Admin' | 'Student' | 'Management') =>
        fetchAPI<User>(`/users/${userType}`),

    update: (userType: string, data: Partial<User>) =>
        fetchAPI<User>(`/users/${userType}`, {
            method: 'PATCH',
            body: JSON.stringify(data),
        }),
};

// ============== NOTIFICATIONS ==============
export interface Notification {
    id: number;
    title: string;
    time: string;
    read: boolean;
}

export const notificationsAPI = {
    getAll: () => fetchAPI<Notification[]>('/notifications'),

    markRead: (id: number) =>
        fetchAPI<Notification>(`/notifications/${id}/read`, {
            method: 'PATCH',
            body: JSON.stringify({ read: true }),
        }),

    markAllRead: () =>
        fetchAPI<{ message: string }>('/notifications/mark-all-read', {
            method: 'POST',
        }),
};
