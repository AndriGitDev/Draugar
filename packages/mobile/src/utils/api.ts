import { getToken } from './storage';
import type { WrappedGroupKey } from '@draugar/shared';

/**
 * API base URL - defaults to VPS for testing
 * Override with EXPO_PUBLIC_API_URL env var for local development
 */
export const API_URL = process.env.EXPO_PUBLIC_API_URL || 'https://draugar-app.andri.is';

export interface ApiError {
  message: string;
  status: number;
}

/**
 * Make an authenticated API request
 * Automatically adds Authorization header if token exists
 */
export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = await getToken();

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
  }

  const url = `${API_URL}${endpoint}`;

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      // Handle 401 Unauthorized
      if (response.status === 401) {
        const error: ApiError = {
          message: 'Unauthorized - please log in again',
          status: 401,
        };
        throw error;
      }

      // Try to parse error response
      let errorMessage = 'Request failed';
      try {
        const errorData = await response.json();
        errorMessage = errorData.error || errorData.message || errorMessage;
      } catch {
        // Response wasn't JSON
      }

      const error: ApiError = {
        message: errorMessage,
        status: response.status,
      };
      throw error;
    }

    return await response.json() as T;
  } catch (error) {
    // Handle network errors
    if (error instanceof TypeError && error.message.includes('Network')) {
      const networkError: ApiError = {
        message: 'Network error - please check your connection',
        status: 0,
      };
      throw networkError;
    }

    // Re-throw ApiErrors
    if ((error as ApiError).status !== undefined) {
      throw error;
    }

    // Unknown error
    const unknownError: ApiError = {
      message: 'An unexpected error occurred',
      status: 0,
    };
    throw unknownError;
  }
}

/**
 * Register public key with server and get wrapped group key
 */
export async function registerPublicKey(
  publicKey: string
): Promise<WrappedGroupKey> {
  return apiRequest<WrappedGroupKey>('/api/crypto/register-key', {
    method: 'POST',
    body: JSON.stringify({ publicKey }),
  });
}

/**
 * Fetch wrapped group key (for re-fetching on app restart)
 */
export async function fetchGroupKey(): Promise<WrappedGroupKey> {
  return apiRequest<WrappedGroupKey>('/api/crypto/group-key');
}
