"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient, User, LoginData, RegisterData } from '../lib/api';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<any>;
  register: (userData: RegisterData) => Promise<any>;
  logout: () => void;
  isAuthenticated: boolean;
  clearError: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('auth_token');
        if (token) {
          const response = await apiClient.getCurrentUser();
          if (response.success) {
            setUser(response.user);
          } else {
            localStorage.removeItem('auth_token');
          }
        }
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth_token');
      }
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<any> => {
    try {
      setError(null);
      setLoading(true);

      const loginData: LoginData = { email, password };
      const response = await apiClient.login(loginData);

      if (response.success && response.token) {
        localStorage.setItem('auth_token', response.token);
        setUser(response.user);
        return response;
      }
      return response;
    } catch (error: any) {
      setError(error.message || 'Login failed');
      return { success: false, message: error.message || 'Login failed' };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData: RegisterData): Promise<any> => {
    try {
      setError(null);
      setLoading(true);

      const response = await apiClient.register(userData);

      if (response.success && response.token) {
        localStorage.setItem('auth_token', response.token);
        setUser(response.user);
        return response;
      }
      return response;
    } catch (error: any) {
      setError(error.message || 'Registration failed');
      return { success: false, message: error.message || 'Registration failed' };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
    }
    setUser(null);
    router.push('/login');
  };

  const clearError = () => {
    setError(null);
  };

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    isAuthenticated: !!user,
    clearError,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}