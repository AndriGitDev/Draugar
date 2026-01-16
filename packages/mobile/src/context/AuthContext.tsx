import React, { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { saveToken, getToken, clearToken } from '../utils/storage';
import { apiRequest, type ApiError } from '../utils/api';
import type { AuthResponse } from '@draugar/shared';

interface User {
  id: string;
  name: string;
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
}

interface AuthContextType extends AuthState {
  join: (code: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [state, setState] = useState<AuthState>({
    user: null,
    isLoading: true,
  });
  const [error, setError] = useState<string | null>(null);

  // Check for existing token on mount
  useEffect(() => {
    async function checkAuth() {
      try {
        const token = await getToken();
        if (!token) {
          setState({ user: null, isLoading: false });
          return;
        }

        // Validate token with /api/auth/me
        const response = await apiRequest<{ user: User }>('/api/auth/me');
        setState({ user: response.user, isLoading: false });
      } catch (err) {
        // Token invalid or expired, clear it
        await clearToken();
        setState({ user: null, isLoading: false });
      }
    }

    checkAuth();
  }, []);

  const join = useCallback(async (code: string, name: string) => {
    setError(null);
    setState((prev) => ({ ...prev, isLoading: true }));

    try {
      const response = await apiRequest<AuthResponse>('/api/auth/join', {
        method: 'POST',
        body: JSON.stringify({ code, name }),
      });

      await saveToken(response.token);
      setState({ user: response.user, isLoading: false });
    } catch (err) {
      setState((prev) => ({ ...prev, isLoading: false }));
      const apiError = err as ApiError;
      setError(apiError.message || 'Failed to join');
      throw err;
    }
  }, []);

  const logout = useCallback(async () => {
    await clearToken();
    setState({ user: null, isLoading: false });
    setError(null);
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, join, logout, error }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
