import React, { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { saveToken, getToken, clearToken } from '../utils/storage';
import { apiRequest, registerPublicKey, fetchGroupKey, type ApiError } from '../utils/api';
import type { AuthResponse } from '@draugar/shared';
import {
  initSodium,
  generateAndStoreKeypair,
  hasKeypair,
  unwrapAndStoreGroupKey,
  getGroupKey,
  getKeypair,
  clearAllKeys,
} from '../crypto';

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
        // Initialize sodium early
        await initSodium();

        const token = await getToken();
        if (!token) {
          setState({ user: null, isLoading: false });
          return;
        }

        // Validate token with /api/auth/me
        const response = await apiRequest<{ id: string; name: string }>('/api/auth/me');
        const user = { id: response.id, name: response.name };

        // Ensure crypto is set up for returning users
        try {
          if (await hasKeypair()) {
            // Have keypair, check if we have group key
            if (!(await getGroupKey())) {
              // Fetch group key from server
              const wrappedKey = await fetchGroupKey();
              await unwrapAndStoreGroupKey(wrappedKey);
            }
          }
          // Note: If no keypair, user will need to re-join to generate one
        } catch (cryptoErr) {
          // Crypto errors shouldn't prevent auth - log and continue
          console.warn('Crypto setup error:', cryptoErr);
        }

        setState({ user, isLoading: false });
      } catch (err) {
        // Token invalid or expired, clear it
        await clearToken();
        await clearAllKeys();
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

      // Setup crypto after successful auth
      try {
        await initSodium();

        // Check if we have a keypair already (shouldn't for new user)
        if (!(await hasKeypair())) {
          // Generate new keypair and register with server
          const publicKey = await generateAndStoreKeypair();
          // Register public key and get wrapped group key
          const wrappedKey = await registerPublicKey(publicKey);
          await unwrapAndStoreGroupKey(wrappedKey);
        } else if (!(await getGroupKey())) {
          // Have keypair but no group key - fetch it
          const keypair = await getKeypair();
          if (keypair) {
            const wrappedKey = await fetchGroupKey();
            await unwrapAndStoreGroupKey(wrappedKey);
          }
        }
      } catch (cryptoErr) {
        // Crypto errors shouldn't block auth - log and continue
        console.warn('Crypto setup error during join:', cryptoErr);
      }

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
    // Clear all crypto keys on logout
    await clearAllKeys();
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
