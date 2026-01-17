import * as SecureStore from 'expo-secure-store';
import type { CryptoKeyPair, WrappedGroupKey } from '@draugar/shared';
import { CRYPTO } from '@draugar/shared';
import { getSodium } from './sodium';

const { STORAGE_KEYS } = CRYPTO;

/**
 * Generate a new X25519 keypair and store securely.
 * @returns The public key (base64) for registration with server
 */
export async function generateAndStoreKeypair(): Promise<string> {
  const sodium = getSodium();
  const keypair = sodium.crypto_box_keypair();

  const publicKeyB64 = sodium.to_base64(keypair.publicKey);
  const secretKeyB64 = sodium.to_base64(keypair.privateKey);

  await Promise.all([
    SecureStore.setItemAsync(STORAGE_KEYS.PUBLIC_KEY, publicKeyB64),
    SecureStore.setItemAsync(STORAGE_KEYS.PRIVATE_KEY, secretKeyB64),
  ]);

  return publicKeyB64;
}

/**
 * Get the stored keypair.
 * @returns CryptoKeyPair or null if not generated yet
 */
export async function getKeypair(): Promise<CryptoKeyPair | null> {
  const [publicKey, secretKey] = await Promise.all([
    SecureStore.getItemAsync(STORAGE_KEYS.PUBLIC_KEY),
    SecureStore.getItemAsync(STORAGE_KEYS.PRIVATE_KEY),
  ]);

  if (!publicKey || !secretKey) {
    return null;
  }

  return { publicKey, secretKey };
}

/**
 * Check if a keypair exists in secure storage.
 */
export async function hasKeypair(): Promise<boolean> {
  const pk = await SecureStore.getItemAsync(STORAGE_KEYS.PUBLIC_KEY);
  return pk !== null;
}

/**
 * Unwrap a group key package received from server.
 * @param wrappedKey - The wrapped key package from server
 * @returns Base64-encoded group key, or null if unwrapping fails
 */
export async function unwrapAndStoreGroupKey(
  wrappedKey: WrappedGroupKey
): Promise<boolean> {
  const sodium = getSodium();
  const keypair = await getKeypair();

  if (!keypair) {
    console.error('No keypair available to unwrap group key');
    return false;
  }

  try {
    const combined = sodium.from_base64(wrappedKey.package);
    const adminPk = sodium.from_base64(wrappedKey.adminPublicKey);
    const secretKey = sodium.from_base64(keypair.secretKey);

    // Extract nonce (first 24 bytes) and encrypted key
    const nonce = combined.slice(0, sodium.crypto_box_NONCEBYTES);
    const encrypted = combined.slice(sodium.crypto_box_NONCEBYTES);

    const groupKeyBytes = sodium.crypto_box_open_easy(
      encrypted,
      nonce,
      adminPk,
      secretKey
    );

    const groupKeyB64 = sodium.to_base64(groupKeyBytes);
    await SecureStore.setItemAsync(STORAGE_KEYS.GROUP_KEY, groupKeyB64);

    return true;
  } catch (error) {
    console.error('Failed to unwrap group key:', error);
    return false;
  }
}

/**
 * Get the stored group key.
 * @returns Base64-encoded group key or null
 */
export async function getGroupKey(): Promise<string | null> {
  return SecureStore.getItemAsync(STORAGE_KEYS.GROUP_KEY);
}

/**
 * Clear all crypto keys (for logout/reset).
 */
export async function clearAllKeys(): Promise<void> {
  await Promise.all([
    SecureStore.deleteItemAsync(STORAGE_KEYS.PUBLIC_KEY),
    SecureStore.deleteItemAsync(STORAGE_KEYS.PRIVATE_KEY),
    SecureStore.deleteItemAsync(STORAGE_KEYS.GROUP_KEY),
  ]);
}
