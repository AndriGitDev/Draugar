import * as SecureStore from 'expo-secure-store';

const AUTH_TOKEN_KEY = 'auth_token';

/**
 * Save JWT token to secure storage
 */
export async function saveToken(token: string): Promise<void> {
  await SecureStore.setItemAsync(AUTH_TOKEN_KEY, token);
}

/**
 * Retrieve JWT token from secure storage
 */
export async function getToken(): Promise<string | null> {
  return await SecureStore.getItemAsync(AUTH_TOKEN_KEY);
}

/**
 * Remove JWT token from secure storage
 */
export async function clearToken(): Promise<void> {
  await SecureStore.deleteItemAsync(AUTH_TOKEN_KEY);
}
