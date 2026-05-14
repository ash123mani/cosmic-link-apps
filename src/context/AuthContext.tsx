import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { api, setToken, removeToken, getToken } from '@/src/api/client';

interface Category {
  name: string;
  id: string;
}

interface User {
  id: string;
  username: string;
  email: string;
  categories: Category[];
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  forgotPassword: (email: string) => Promise<{ message: string; email: string }>;
  resetPassword: (token: string, password: string) => Promise<{ message: string }>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setTokenState] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initAuth();
  }, []);

  async function initAuth() {
    try {
      const stored = await getToken();
      if (stored) {
        setTokenState(stored);
        const res = await api<{ success: boolean; user: User }>('/api/v1/user', { auth: true });
        setUser(res.user);
      }
    } catch (err: any) {
      if (err.statusCode === 401) {
        await removeToken();
      }
    } finally {
      setLoading(false);
    }
  }

  const login = useCallback(async (email: string, password: string) => {
    const res = await api<{ success: boolean; token: string; user: User }>('/api/v1/auth/login', {
      method: 'POST',
      body: { email, password },
    });
    await setToken(res.token);
    setTokenState(res.token);
    setUser(res.user);
  }, []);

  const register = useCallback(async (username: string, email: string, password: string) => {
    const res = await api<{ success: boolean; token: string; user: User }>('/api/v1/auth/register', {
      method: 'POST',
      body: { username, email, password },
    });
    await setToken(res.token);
    setTokenState(res.token);
    setUser(res.user);
  }, []);

  const logout = useCallback(async () => {
    await removeToken();
    setTokenState(null);
    setUser(null);
  }, []);

  const forgotPassword = useCallback(async (email: string) => {
    const res = await api<{ success: boolean; message: string; email: string }>('/api/v1/auth/forgotpassword', {
      method: 'POST',
      body: { email },
    });
    return { message: res.message, email: res.email };
  }, []);

  const resetPassword = useCallback(async (resetToken: string, password: string) => {
    const res = await api<{ success: boolean; message: string }>(`/api/v1/auth/resetpassword/${resetToken}`, {
      method: 'PUT',
      body: { password },
    });
    return { message: res.message };
  }, []);

  const refreshUser = useCallback(async () => {
    const res = await api<{ success: boolean; user: User }>('/api/v1/user', { auth: true });
    setUser(res.user);
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, forgotPassword, resetPassword, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
