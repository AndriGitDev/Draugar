/**
 * Crypto constants matching libsodium
 * These are standard sizes, not secrets
 */
export const CRYPTO = {
  // XChaCha20-Poly1305 (location encryption)
  NONCE_BYTES: 24, // crypto_aead_xchacha20poly1305_ietf_NPUBBYTES
  KEY_BYTES: 32, // crypto_aead_xchacha20poly1305_ietf_KEYBYTES
  TAG_BYTES: 16, // Poly1305 auth tag

  // X25519 key exchange (crypto_box)
  BOX_NONCE_BYTES: 24, // crypto_box_NONCEBYTES
  BOX_PUBLIC_KEY_BYTES: 32, // crypto_box_PUBLICKEYBYTES
  BOX_SECRET_KEY_BYTES: 32, // crypto_box_SECRETKEYBYTES
  BOX_MAC_BYTES: 16, // crypto_box_MACBYTES

  // Key identifiers for SecureStore
  STORAGE_KEYS: {
    PRIVATE_KEY: 'draugar_sk',
    PUBLIC_KEY: 'draugar_pk',
    GROUP_KEY: 'draugar_gk',
  },

  // Current payload version
  PAYLOAD_VERSION: 1,
} as const;
