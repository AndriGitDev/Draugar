import { getToken } from './storage';

/**
 * API base URL - defaults to localhost for development
 * Note: Use machine IP (not localhost) for device testing
 */
export const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3001';

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
