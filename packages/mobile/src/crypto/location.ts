import type { Location, EncryptedPayload } from '@draugar/shared';
import { CRYPTO } from '@draugar/shared';
import { getSodium } from './sodium';
import { getGroupKey } from './keyStore';

/**
 * Encrypt a location update before sending to server.
 * Uses crypto_secretbox (XSalsa20-Poly1305) for React Native compatibility.
 * @param location - The location data to encrypt
 * @returns EncryptedPayload ready for transmission, or null if no group key
 */
export async function encryptLocation(
  location: Location
): Promise<EncryptedPayload | null> {
  const groupKeyB64 = await getGroupKey();
  if (!groupKeyB64) {
    console.error('No group key available for encryption');
    return null;
  }

  const sodium = getSodium();
  const groupKey = sodium.from_base64(groupKeyB64);

  // Serialize location to JSON string
  const message = JSON.stringify(location);

  // Generate random nonce (24 bytes for secretbox)
  const nonce = sodium.randombytes_buf(sodium.crypto_secretbox_NONCEBYTES);

  // Encrypt with authenticated encryption (XSalsa20-Poly1305)
  const ciphertext = sodium.crypto_secretbox_easy(message, nonce, groupKey);

  return {
    v: CRYPTO.PAYLOAD_VERSION,
    n: sodium.to_base64(nonce),
    c: sodium.to_base64(ciphertext),
  };
}

/**
 * Decrypt a location update received from server (via WebSocket).
 * Uses crypto_secretbox_open (XSalsa20-Poly1305) for React Native compatibility.
 * @param payload - The encrypted payload
 * @returns Decrypted Location or null if decryption fails
 */
export async function decryptLocation(
  payload: EncryptedPayload
): Promise<Location | null> {
  const groupKeyB64 = await getGroupKey();
  if (!groupKeyB64) {
    console.error('No group key available for decryption');
    return null;
  }

  const sodium = getSodium();

  try {
    const groupKey = sodium.from_base64(groupKeyB64);
    const nonce = sodium.from_base64(payload.n);
    const ciphertext = sodium.from_base64(payload.c);

    // Decrypt with secretbox (XSalsa20-Poly1305)
    const plaintext = sodium.crypto_secretbox_open_easy(ciphertext, nonce, groupKey);

    const location = JSON.parse(plaintext) as Location;

    return location;
  } catch (error) {
    // Decryption failure could mean:
    // - Tampered data
    // - Wrong group key version
    // - Corrupted transmission
    console.error('Location decryption failed:', error);
    return null;
  }
}
