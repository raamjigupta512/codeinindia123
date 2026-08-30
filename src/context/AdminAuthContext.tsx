import React, { createContext, useContext, useState, useEffect } from 'react';
import { AdminUser, AdminRole } from '../types/admin';

export interface AdminAuthContextType {
  admin: AdminUser | null;
  currentAdmin: AdminUser | null;
  isAuthenticated: boolean;
  token: string | null;
  isLoading: boolean;
  viewMode: 'all' | 'live' | 'test';
  setViewMode: (mode: 'all' | 'live' | 'test') => void;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  hasRole: (roles: AdminRole[]) => boolean;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('ci_admin_token'));
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [viewMode, setViewMode] = useState<'all' | 'live' | 'test'>('all');

  useEffect(() => {
    async function verifyExistingSession() {
      const savedToken = localStorage.getItem('ci_admin_token');
      if (!savedToken) {
        setIsLoading(false);
        return;
      }

      try {
        const res = await fetch('/api/admin/me', {
          headers: {
            Authorization: `Bearer ${savedToken}`
          }
        });
        const data = await res.json();
        if (data.success && data.admin) {
          setAdmin(data.admin);
          setToken(savedToken);
        } else {
          localStorage.removeItem('ci_admin_token');
          setAdmin(null);
          setToken(null);
        }
      } catch (e) {
        console.error('Session verify error:', e);
        localStorage.removeItem('ci_admin_token');
      } finally {
        setIsLoading(false);
      }
    }

    verifyExistingSession();
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();

      if (data.success && data.token && data.admin) {
        localStorage.setItem('ci_admin_token', data.token);
        setToken(data.token);
        setAdmin(data.admin);
        return { success: true };
      } else {
        return { success: false, error: data.error || 'Invalid credentials' };
      }
    } catch (err: any) {
      return { success: false, error: err.message || 'Login network error' };
    }
  };

  const logout = async () => {
    if (token) {
      try {
        await fetch('/api/admin/logout', {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` }
        });
      } catch (e) {
        console.error('Logout error:', e);
      }
    }
    localStorage.removeItem('ci_admin_token');
    setAdmin(null);
    setToken(null);
  };

  const hasRole = (roles: AdminRole[]): boolean => {
    if (!admin) return false;
    return roles.includes(admin.role);
  };

  return (
    <AdminAuthContext.Provider
      value={{
        admin,
        currentAdmin: admin,
        isAuthenticated: !!admin,
        token,
        isLoading,
        viewMode,
        setViewMode,
        login,
        logout,
        hasRole
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};
