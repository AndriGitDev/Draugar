/**
 * Encrypted payload format for location data
 * Uses XChaCha20-Poly1305 authenticated encryption
 */
export interface EncryptedPayload {
  v: 1; // Version for future compatibility
  n: string; // Nonce (base64)
  c: string; // Ciphertext (base64)
}

/**
 * User's encryption keypair (X25519)
 * Public key is shared with server, private key stays on device
 */
export interface CryptoKeyPair {
  publicKey: string; // Base64-encoded public key
  secretKey: string; // Base64-encoded secret key (device only)
}

/**
 * Wrapped group key package sent from server to new member
 * Encrypted with member's public key using crypto_box
 */
export interface WrappedGroupKey {
  /** Base64-encoded wrapped key (nonce + encrypted group key) */
  package: string;
  /** Public key of the admin who wrapped this key */
  adminPublicKey: string;
  /** Version of the group key (for rotation tracking) */
  keyVersion: number;
}

/**
 * User's public key registration with server
 */
export interface PublicKeyRegistration {
  userId: string;
  publicKey: string; // Base64-encoded
}
