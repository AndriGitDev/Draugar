# Phase 4: E2E Encryption - Research

**Researched:** 2026-01-17
**Domain:** End-to-end encryption for family location sharing (React Native + Node.js)
**Confidence:** HIGH

<research_summary>
## Summary

Researched the JavaScript/TypeScript cryptography ecosystem for implementing zero-knowledge E2E encryption in a family location sharing app. The standard approach uses libsodium (via `react-native-libsodium` for mobile and `libsodium-wrappers` for backend) with a group key architecture appropriate for small, trusted groups.

Key finding: For a small family group (2-10 users), a **shared group key** approach is simpler and sufficient compared to pairwise keys. Each user generates a keypair; when they join the group, they receive the group encryption key (encrypted with their public key). All location data is encrypted with the group key before leaving the device.

**Primary recommendation:** Use `react-native-libsodium` (Expo-compatible) + `libsodium-wrappers` (Node.js). Implement shared group key with XChaCha20-Poly1305 for location encryption and X25519 for key exchange. Store private keys in `expo-secure-store`.
</research_summary>

<standard_stack>
## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| react-native-libsodium | 1.x | React Native crypto | Expo plugin support, matches libsodium-wrappers API |
| libsodium-wrappers | 0.7.15 | Node.js/web crypto | WebAssembly-based, battle-tested, 188KB |
| expo-secure-store | SDK 53+ | Key storage on device | Hardware-backed encryption on iOS/Android |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| libsodium-wrappers-sumo | 0.7.15 | Extended crypto functions | Only if need `crypto_pwhash` on web |
| base64-js | 1.5.x | Binary encoding | For transmitting encrypted data as JSON |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| libsodium | tweetnacl | TweetNaCl is smaller (25M weekly downloads vs 1M) but lacks `crypto_kx`, less featured |
| libsodium | Web Crypto API | Web Crypto is built-in but API is complex, no React Native support |
| Shared group key | Signal Protocol | Signal provides forward secrecy but massive complexity overkill for family app |
| Shared group key | Pairwise keys | Pairwise scales O(n²), unnecessary for 2-10 users |

**Installation:**
```bash
# Mobile (Expo)
npx expo install react-native-libsodium expo-secure-store

# Backend
pnpm add libsodium-wrappers
pnpm add -D @types/libsodium-wrappers
```

**Expo config (app.config.js):**
```javascript
{
  plugins: [
    ["react-native-libsodium", {}]
  ]
}
```
</standard_stack>

<architecture_patterns>
## Architecture Patterns

### Recommended Project Structure
```
packages/
├── shared/
│   └── src/
│       └── crypto/
│           ├── index.ts        # Re-export for cross-package use
│           ├── types.ts        # EncryptedPayload, KeyPair types
│           └── constants.ts    # Key lengths, algorithm names
├── backend/
│   └── src/
│       └── crypto/
│           ├── sodium.ts       # libsodium-wrappers init
│           └── groupKey.ts     # Group key generation/wrapping
└── mobile/
    └── src/
        └── crypto/
            ├── sodium.ts       # react-native-libsodium init
            ├── keyStore.ts     # SecureStore wrapper for keys
            └── location.ts     # Encrypt/decrypt location data
```

### Pattern 1: Shared Group Key for Family
**What:** Single symmetric key shared among all family members, distributed via key wrapping
**When to use:** Small trusted groups (2-10 members), no need for forward secrecy
**Why:** Simpler than pairwise, O(n) key distribution vs O(n²)

```typescript
// Group key generation (admin creates group)
const groupKey = sodium.crypto_secretbox_keygen();

// Key wrapping: encrypt group key for new member
function wrapGroupKeyForMember(
  groupKey: Uint8Array,
  memberPublicKey: Uint8Array,
  adminSecretKey: Uint8Array
): Uint8Array {
  const nonce = sodium.randombytes_buf(sodium.crypto_box_NONCEBYTES);
  const encrypted = sodium.crypto_box_easy(
    groupKey,
    nonce,
    memberPublicKey,
    adminSecretKey
  );
  // Return nonce + encrypted (nonce is not secret)
  return new Uint8Array([...nonce, ...encrypted]);
}

// Key unwrapping: new member decrypts group key
function unwrapGroupKey(
  wrappedKey: Uint8Array,
  adminPublicKey: Uint8Array,
  memberSecretKey: Uint8Array
): Uint8Array {
  const nonce = wrappedKey.slice(0, sodium.crypto_box_NONCEBYTES);
  const encrypted = wrappedKey.slice(sodium.crypto_box_NONCEBYTES);
  return sodium.crypto_box_open_easy(
    encrypted,
    nonce,
    adminPublicKey,
    memberSecretKey
  );
}
```

### Pattern 2: Location Encryption with XChaCha20-Poly1305
**What:** Authenticated encryption for location payloads
**When to use:** All location data before sending to server
**Why:** XChaCha20-Poly1305 allows random nonces safely (192-bit), portable, fast

```typescript
interface LocationPayload {
  lat: number;
  lng: number;
  accuracy: number;
  timestamp: number;
}

interface EncryptedLocation {
  nonce: string;     // base64
  ciphertext: string; // base64
}

function encryptLocation(
  location: LocationPayload,
  groupKey: Uint8Array
): EncryptedLocation {
  const plaintext = new TextEncoder().encode(JSON.stringify(location));
  const nonce = sodium.randombytes_buf(
    sodium.crypto_aead_xchacha20poly1305_ietf_NPUBBYTES
  );
  const ciphertext = sodium.crypto_aead_xchacha20poly1305_ietf_encrypt(
    plaintext,
    null, // no additional data
    null, // unused parameter
    nonce,
    groupKey
  );
  return {
    nonce: sodium.to_base64(nonce),
    ciphertext: sodium.to_base64(ciphertext)
  };
}

function decryptLocation(
  encrypted: EncryptedLocation,
  groupKey: Uint8Array
): LocationPayload {
  const nonce = sodium.from_base64(encrypted.nonce);
  const ciphertext = sodium.from_base64(encrypted.ciphertext);
  const plaintext = sodium.crypto_aead_xchacha20poly1305_ietf_decrypt(
    null, // unused parameter
    ciphertext,
    null, // no additional data
    nonce,
    groupKey
  );
  return JSON.parse(new TextDecoder().decode(plaintext));
}
```

### Pattern 3: Keypair Generation and Storage
**What:** Generate keypair on device, store in secure storage
**When to use:** First app launch / user registration
**Why:** Private key never leaves device

```typescript
import * as SecureStore from 'expo-secure-store';
import sodium from 'react-native-libsodium';

const PRIVATE_KEY_KEY = 'draugar_private_key';
const PUBLIC_KEY_KEY = 'draugar_public_key';

async function generateAndStoreKeypair(): Promise<{ publicKey: Uint8Array }> {
  await sodium.ready;

  const keypair = sodium.crypto_box_keypair();

  // Store both keys securely
  await SecureStore.setItemAsync(
    PRIVATE_KEY_KEY,
    sodium.to_base64(keypair.privateKey)
  );
  await SecureStore.setItemAsync(
    PUBLIC_KEY_KEY,
    sodium.to_base64(keypair.publicKey)
  );

  return { publicKey: keypair.publicKey };
}

async function getPrivateKey(): Promise<Uint8Array | null> {
  await sodium.ready;
  const stored = await SecureStore.getItemAsync(PRIVATE_KEY_KEY);
  return stored ? sodium.from_base64(stored) : null;
}
```

### Anti-Patterns to Avoid
- **Storing private keys in AsyncStorage:** Use SecureStore - it's hardware-backed
- **Using `Math.random()` for anything crypto:** Always use `sodium.randombytes_buf()`
- **ECB mode or unauthenticated encryption:** Always use authenticated encryption (AEAD)
- **Sending encryption keys to server:** Server should only see public keys and encrypted data
- **Implementing custom crypto primitives:** Use libsodium's high-level APIs
</architecture_patterns>

<dont_hand_roll>
## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Authenticated encryption | Custom AES + HMAC | `crypto_aead_xchacha20poly1305_ietf_*` | Subtle timing attacks, nonce management |
| Key exchange | Custom DH | `crypto_box_*` or `crypto_kx_*` | Edge cases with weak keys, constant-time ops |
| Key derivation | Custom PBKDF | `crypto_kdf_derive_from_key` | Parameter tuning, side channels |
| Random bytes | `Math.random()` or custom PRNG | `sodium.randombytes_buf()` | CSPRNG required, platform-specific |
| Base64 encoding | Custom or `atob/btoa` | `sodium.to_base64/from_base64` | Binary-safe, consistent across platforms |
| Constant-time comparison | `===` for secrets | `sodium.compare()` | Timing attacks leak information |

**Key insight:** Cryptography has 40+ years of subtle bugs. Libsodium implements NaCl's high-level "secure by default" API. Every custom implementation risks timing attacks, nonce reuse, or weak randomness that looks correct but leaks secrets.
</dont_hand_roll>

<common_pitfalls>
## Common Pitfalls

### Pitfall 1: Not Waiting for `sodium.ready`
**What goes wrong:** Crypto functions throw or return undefined
**Why it happens:** Libsodium loads WebAssembly asynchronously
**How to avoid:** Always `await sodium.ready` before any crypto operation
**Warning signs:** "sodium not initialized" errors, undefined results

```typescript
// WRONG
import sodium from 'libsodium-wrappers';
const key = sodium.crypto_secretbox_keygen(); // May fail!

// RIGHT
import sodium from 'libsodium-wrappers';
await sodium.ready;
const key = sodium.crypto_secretbox_keygen();
```

### Pitfall 2: Nonce Reuse
**What goes wrong:** Complete loss of confidentiality - plaintext can be recovered
**Why it happens:** Reusing nonce with same key breaks XOR-based stream ciphers
**How to avoid:** Use random 192-bit nonces (XChaCha20) - collision probability negligible up to 2^48 messages
**Warning signs:** Static nonces, counters that reset, nonce stored globally

```typescript
// WRONG - static nonce
const nonce = new Uint8Array(24).fill(0);

// RIGHT - random nonce each time
const nonce = sodium.randombytes_buf(sodium.crypto_aead_xchacha20poly1305_ietf_NPUBBYTES);
```

### Pitfall 3: Storing Keys in Plain AsyncStorage
**What goes wrong:** Keys readable by any app with device access (rooted/jailbroken)
**Why it happens:** AsyncStorage is unencrypted key-value store
**How to avoid:** Use `expo-secure-store` (iOS Keychain / Android Keystore)
**Warning signs:** Using `AsyncStorage` for anything called "key", "secret", "private"

### Pitfall 4: Exposing Private Keys to Server
**What goes wrong:** Zero-knowledge architecture compromised - server can decrypt
**Why it happens:** Sending keypair instead of just public key during registration
**How to avoid:** Only send `publicKey` to server, never `privateKey` or `secretKey`
**Warning signs:** API payloads containing "privateKey" or "secretKey" fields

### Pitfall 5: Not Handling Decryption Failures
**What goes wrong:** App crashes or silent data corruption
**Why it happens:** Tampered data, wrong key, or corrupted transmission
**How to avoid:** Wrap decryption in try/catch, handle failures gracefully
**Warning signs:** Unhandled promise rejections from crypto functions

```typescript
// WRONG
const plaintext = sodium.crypto_aead_xchacha20poly1305_ietf_decrypt(...);

// RIGHT
try {
  const plaintext = sodium.crypto_aead_xchacha20poly1305_ietf_decrypt(...);
  return JSON.parse(new TextDecoder().decode(plaintext));
} catch (e) {
  console.error('Decryption failed - corrupted or tampered data');
  return null;
}
```

### Pitfall 6: Group Key Not Rotated on Member Removal
**What goes wrong:** Removed member can still decrypt future messages
**Why it happens:** Same group key used before and after removal
**How to avoid:** Generate new group key and re-wrap for remaining members when someone leaves
**Warning signs:** No key rotation logic, "removeFromGroup" without crypto handling
</common_pitfalls>

<code_examples>
## Code Examples

Verified patterns from official sources:

### Libsodium Initialization (Both Platforms)
```typescript
// Source: libsodium-wrappers documentation
// Backend (Node.js)
import sodium from 'libsodium-wrappers';

export async function initSodium() {
  await sodium.ready;
  return sodium;
}

// Mobile (React Native with Expo)
import sodium from 'react-native-libsodium';

export async function initSodium() {
  await sodium.ready;
  return sodium;
}
```

### Complete Location Encryption Flow
```typescript
// Source: Derived from libsodium-doc authenticated encryption examples
import sodium from 'libsodium-wrappers';

interface Location {
  lat: number;
  lng: number;
  accuracy: number;
  timestamp: number;
  userId: string;
}

interface EncryptedPayload {
  v: 1;  // version for future compatibility
  n: string;  // nonce (base64)
  c: string;  // ciphertext (base64)
}

export function encryptLocation(
  location: Location,
  groupKey: Uint8Array
): EncryptedPayload {
  const plaintext = new TextEncoder().encode(JSON.stringify(location));
  const nonce = sodium.randombytes_buf(
    sodium.crypto_aead_xchacha20poly1305_ietf_NPUBBYTES
  );

  const ciphertext = sodium.crypto_aead_xchacha20poly1305_ietf_encrypt(
    plaintext,
    null,
    null,
    nonce,
    groupKey
  );

  return {
    v: 1,
    n: sodium.to_base64(nonce),
    c: sodium.to_base64(ciphertext)
  };
}

export function decryptLocation(
  payload: EncryptedPayload,
  groupKey: Uint8Array
): Location | null {
  try {
    const nonce = sodium.from_base64(payload.n);
    const ciphertext = sodium.from_base64(payload.c);

    const plaintext = sodium.crypto_aead_xchacha20poly1305_ietf_decrypt(
      null,
      ciphertext,
      null,
      nonce,
      groupKey
    );

    return JSON.parse(new TextDecoder().decode(plaintext));
  } catch {
    return null;
  }
}
```

### Key Exchange for Group Join
```typescript
// Source: Derived from libsodium-doc crypto_box examples
import sodium from 'libsodium-wrappers';

// Admin wraps group key for new member
export function createGroupKeyPackage(
  groupKey: Uint8Array,
  newMemberPublicKey: Uint8Array,
  adminSecretKey: Uint8Array
): string {
  const nonce = sodium.randombytes_buf(sodium.crypto_box_NONCEBYTES);
  const encrypted = sodium.crypto_box_easy(
    groupKey,
    nonce,
    newMemberPublicKey,
    adminSecretKey
  );

  // Combine: nonce (24 bytes) + encrypted (key + MAC)
  const combined = new Uint8Array(nonce.length + encrypted.length);
  combined.set(nonce);
  combined.set(encrypted, nonce.length);

  return sodium.to_base64(combined);
}

// New member unwraps group key
export function unwrapGroupKey(
  package_: string,
  adminPublicKey: Uint8Array,
  memberSecretKey: Uint8Array
): Uint8Array | null {
  try {
    const combined = sodium.from_base64(package_);
    const nonce = combined.slice(0, sodium.crypto_box_NONCEBYTES);
    const encrypted = combined.slice(sodium.crypto_box_NONCEBYTES);

    return sodium.crypto_box_open_easy(
      encrypted,
      nonce,
      adminPublicKey,
      memberSecretKey
    );
  } catch {
    return null;
  }
}
```

### Secure Key Storage (Mobile)
```typescript
// Source: Expo SecureStore documentation
import * as SecureStore from 'expo-secure-store';
import sodium from 'react-native-libsodium';

const KEYS = {
  PRIVATE: 'draugar_sk',
  PUBLIC: 'draugar_pk',
  GROUP: 'draugar_gk'
} as const;

export async function storeKeypair(
  publicKey: Uint8Array,
  secretKey: Uint8Array
): Promise<void> {
  await SecureStore.setItemAsync(KEYS.PUBLIC, sodium.to_base64(publicKey));
  await SecureStore.setItemAsync(KEYS.PRIVATE, sodium.to_base64(secretKey));
}

export async function getKeypair(): Promise<{
  publicKey: Uint8Array;
  secretKey: Uint8Array;
} | null> {
  const [pk, sk] = await Promise.all([
    SecureStore.getItemAsync(KEYS.PUBLIC),
    SecureStore.getItemAsync(KEYS.PRIVATE)
  ]);

  if (!pk || !sk) return null;

  return {
    publicKey: sodium.from_base64(pk),
    secretKey: sodium.from_base64(sk)
  };
}

export async function storeGroupKey(groupKey: Uint8Array): Promise<void> {
  await SecureStore.setItemAsync(KEYS.GROUP, sodium.to_base64(groupKey));
}

export async function getGroupKey(): Promise<Uint8Array | null> {
  const gk = await SecureStore.getItemAsync(KEYS.GROUP);
  return gk ? sodium.from_base64(gk) : null;
}
```
</code_examples>

<sota_updates>
## State of the Art (2025-2026)

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| tweetnacl | libsodium-wrappers | 2020+ | Libsodium has more features, better maintained |
| AES-GCM | XChaCha20-Poly1305 | 2018+ | XChaCha allows random nonces, no nonce limit |
| Manual key management | react-native-libsodium | 2023 | Native bindings with Expo support |
| AsyncStorage for secrets | expo-secure-store | 2020+ | Hardware-backed security standard |

**New tools/patterns to consider:**
- **Signal Protocol (PQXDH):** Post-quantum key exchange added in 2024, but overkill for family app
- **react-native-libsodium:** Actively maintained, Expo plugin system support
- **Argon2id:** For any password-derived keys (not needed if using device-generated keys)

**Deprecated/outdated:**
- **crypto-js:** Lacks authenticated encryption, not recommended for new projects
- **node-forge:** Complex API, libsodium is simpler and faster
- **Manual AES-CBC + HMAC:** Use AEAD instead (XChaCha20-Poly1305 or AES-GCM)
- **tweetnacl alone:** Missing `crypto_kx`, limited function set
</sota_updates>

<open_questions>
## Open Questions

Things that couldn't be fully resolved:

1. **Group key rotation frequency**
   - What we know: Must rotate when member removed
   - What's unclear: Should there be time-based rotation for forward secrecy?
   - Recommendation: Start without time-based rotation (simpler), add later if needed

2. **Key backup/recovery**
   - What we know: Private key loss = lose access to group
   - What's unclear: How to handle device replacement without compromising security
   - Recommendation: Admin can re-invite user with new keypair (regenerate wrapped group key)

3. **Multi-device support**
   - What we know: Each device needs its own keypair
   - What's unclear: Should same user on multiple devices share group key or have separate wrapped copies?
   - Recommendation: Treat each device as separate "member" with own wrapped group key copy
</open_questions>

<sources>
## Sources

### Primary (HIGH confidence)
- /jedisct1/libsodium-doc (Context7) - authenticated encryption, key exchange, nonce handling
- /expo/expo (Context7) - SecureStore API and usage patterns
- [react-native-libsodium GitHub](https://github.com/serenity-kit/react-native-libsodium) - supported functions, Expo compatibility

### Secondary (MEDIUM confidence)
- [npm trends comparison](https://npmtrends.com/crypto-js-vs-libsodium-vs-libsodium-wrappers-vs-tweetnacl) - library popularity and maintenance
- [Paralino](https://paralino.com/) - real-world E2E encrypted location sharing app using similar stack
- [TICE](https://f-droid.org/packages/app.tice.TICE.production/) - another E2E encrypted location app

### Tertiary (LOW confidence - needs validation)
- Group key rotation patterns - derived from general E2E messaging literature, needs validation during implementation
</sources>

<metadata>
## Metadata

**Research scope:**
- Core technology: libsodium (JS bindings)
- Ecosystem: react-native-libsodium, libsodium-wrappers, expo-secure-store
- Patterns: Shared group key, XChaCha20-Poly1305, key wrapping
- Pitfalls: Nonce reuse, key storage, async initialization

**Confidence breakdown:**
- Standard stack: HIGH - verified with Context7, active maintenance
- Architecture: HIGH - derived from libsodium official examples
- Pitfalls: HIGH - documented in official docs and security literature
- Code examples: HIGH - adapted from Context7/official sources

**Research date:** 2026-01-17
**Valid until:** 2026-02-17 (30 days - crypto ecosystem stable)
</metadata>

---

*Phase: 04-e2e-encryption*
*Research completed: 2026-01-17*
*Ready for planning: yes*
