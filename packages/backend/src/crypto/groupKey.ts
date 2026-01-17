import type { WrappedGroupKey } from '@draugar/shared';
import { getSodium } from './sodium';

/**
 * Generate a new group encryption key.
 * Uses crypto_aead_xchacha20poly1305_ietf_keygen internally.
 * @returns Base64-encoded 32-byte key
 */
export function generateGroupKey(): string {
  const sodium = getSodium();
  const key = sodium.crypto_aead_xchacha20poly1305_ietf_keygen();
  return sodium.to_base64(key);
}

/**
 * Generate a keypair for the server/admin.
 * Used for wrapping group keys for new members.
 */
export function generateServerKeypair(): { publicKey: string; secretKey: string } {
  const sodium = getSodium();
  const keypair = sodium.crypto_box_keypair();
  return {
    publicKey: sodium.to_base64(keypair.publicKey),
    secretKey: sodium.to_base64(keypair.privateKey),
  };
}

/**
 * Wrap a group key for a specific member using their public key.
 * @param groupKey - Base64-encoded group key
 * @param memberPublicKey - Base64-encoded member's public key
 * @param serverSecretKey - Base64-encoded server's secret key
 * @returns Wrapped key package (nonce + encrypted key as base64)
 */
export function wrapGroupKeyForMember(
  groupKey: string,
  memberPublicKey: string,
  serverSecretKey: string
): string {
  const sodium = getSodium();

  const groupKeyBytes = sodium.from_base64(groupKey);
  const memberPkBytes = sodium.from_base64(memberPublicKey);
  const serverSkBytes = sodium.from_base64(serverSecretKey);

  // randombytes_buf returns Uint8Array when called without output format
  const nonce = sodium.randombytes_buf(sodium.crypto_box_NONCEBYTES) as Uint8Array;
  // crypto_box_easy returns Uint8Array when called without output format
  const encrypted = sodium.crypto_box_easy(
    groupKeyBytes,
    nonce,
    memberPkBytes,
    serverSkBytes
  ) as Uint8Array;

  // Combine nonce + encrypted for transmission
  const combined = new Uint8Array(nonce.length + encrypted.length);
  combined.set(nonce);
  combined.set(encrypted, nonce.length);

  return sodium.to_base64(combined);
}

/**
 * Create a complete wrapped group key package for a member.
 */
export function createWrappedGroupKeyPackage(
  groupKey: string,
  memberPublicKey: string,
  serverSecretKey: string,
  serverPublicKey: string,
  keyVersion: number
): WrappedGroupKey {
  return {
    package: wrapGroupKeyForMember(groupKey, memberPublicKey, serverSecretKey),
    adminPublicKey: serverPublicKey,
    keyVersion,
  };
}
