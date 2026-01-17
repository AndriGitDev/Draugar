import sodium from 'react-native-libsodium';

let initialized = false;

/**
 * Initialize libsodium. Must be called before any crypto operations.
 * Safe to call multiple times - will only initialize once.
 */
export async function initSodium(): Promise<typeof sodium> {
  if (!initialized) {
    await sodium.ready;
    initialized = true;
  }
  return sodium;
}

/**
 * Get initialized sodium instance.
 * Throws if called before initSodium().
 */
export function getSodium(): typeof sodium {
  if (!initialized) {
    throw new Error('Sodium not initialized. Call initSodium() first.');
  }
  return sodium;
}
