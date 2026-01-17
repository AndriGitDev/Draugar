import type { Location, EncryptedPayload } from '@draugar/shared';
import { CRYPTO } from '@draugar/shared';
import { getSodium } from './sodium';
import { getGroupKey } from './keyStore';

/**
 * Encrypt a location update before sending to server.
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

  // Serialize location to JSON bytes
  const plaintext = new TextEncoder().encode(JSON.stringify(location));

  // Generate random nonce (24 bytes for XChaCha20-Poly1305)
  const nonce = sodium.randombytes_buf(
    sodium.crypto_aead_xchacha20poly1305_ietf_NPUBBYTES
  );

  // Encrypt with authenticated encryption
  const ciphertext = sodium.crypto_aead_xchacha20poly1305_ietf_encrypt(
    plaintext,
    null, // no additional authenticated data
    null, // unused parameter (secret nonce)
    nonce,
    groupKey
  );

  return {
    v: CRYPTO.PAYLOAD_VERSION,
    n: sodium.to_base64(nonce),
    c: sodium.to_base64(ciphertext),
  };
}

/**
 * Decrypt a location update received from server (via WebSocket).
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

    const plaintext = sodium.crypto_aead_xchacha20poly1305_ietf_decrypt(
      null, // unused parameter (secret nonce)
      ciphertext,
      null, // no additional authenticated data
      nonce,
      groupKey
    );

    const location = JSON.parse(
      new TextDecoder().decode(plaintext)
    ) as Location;

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
