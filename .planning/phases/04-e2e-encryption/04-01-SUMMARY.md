---
phase: 04-e2e-encryption
plan: 01
subsystem: crypto
tags: [libsodium, e2e-encryption, xchacha20-poly1305, x25519, typescript]

# Dependency graph
requires:
  - phase: 01-foundation
    provides: shared package structure
provides:
  - EncryptedPayload type for E2E encrypted location data
  - CryptoKeyPair type for user keypairs
  - WrappedGroupKey type for key distribution
  - PublicKeyRegistration type for server storage
  - CRYPTO constants matching libsodium values
affects: [04-02-backend-libsodium, 04-03-mobile-libsodium, 04-04-key-exchange]

# Tech tracking
tech-stack:
  added: []
  patterns: [shared-crypto-types, xchacha20-poly1305-payload-format, x25519-key-exchange]

key-files:
  created:
    - packages/shared/src/crypto/types.ts
    - packages/shared/src/crypto/constants.ts
    - packages/shared/src/crypto/index.ts
  modified:
    - packages/shared/src/index.ts

key-decisions:
  - "XChaCha20-Poly1305 payload format with version field for future compatibility"
  - "Base64 encoding for all binary data (keys, nonces, ciphertext)"
  - "Consistent storage key naming (draugar_sk, draugar_pk, draugar_gk)"

patterns-established:
  - "EncryptedPayload: {v: 1, n: nonce, c: ciphertext} format for all encrypted data"
  - "CRYPTO constants object for consistent byte sizes across packages"

# Metrics
duration: 1 min
completed: 2026-01-17
---

# Phase 4 Plan 01: Crypto Types Summary

**Shared TypeScript types and constants for E2E encryption, enabling type-safe crypto operations across backend and mobile packages**

## Performance

- **Duration:** 1 min
- **Started:** 2026-01-17T15:52:56Z
- **Completed:** 2026-01-17T15:53:57Z
- **Tasks:** 3
- **Files modified:** 4

## Accomplishments
- Created EncryptedPayload type for XChaCha20-Poly1305 encrypted location data
- Defined CryptoKeyPair and WrappedGroupKey types for key management
- Established CRYPTO constants matching libsodium byte sizes
- Exported all crypto types from @draugar/shared package

## Task Commits

Each task was committed atomically:

1. **Task 1: Create crypto types** - `505f1a9` (feat)
2. **Task 2: Create crypto constants** - `0dc432e` (feat)
3. **Task 3: Export crypto module from shared** - `b173dd7` (feat)

## Files Created/Modified
- `packages/shared/src/crypto/types.ts` - EncryptedPayload, CryptoKeyPair, WrappedGroupKey, PublicKeyRegistration interfaces
- `packages/shared/src/crypto/constants.ts` - CRYPTO object with libsodium byte sizes and storage keys
- `packages/shared/src/crypto/index.ts` - Re-exports for cross-package use
- `packages/shared/src/index.ts` - Root exports including crypto types

## Decisions Made
- Used version field (v: 1) in EncryptedPayload for future format migrations
- Followed libsodium naming conventions for constants (NONCE_BYTES, KEY_BYTES, etc.)
- Used short property names (n, c) in EncryptedPayload to minimize payload size

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None.

## Next Phase Readiness
- Crypto types available for use in subsequent plans (04-02, 04-03, 04-04)
- Backend and mobile can import from @draugar/shared with full type safety
- Ready for libsodium implementation on both platforms

---
*Phase: 04-e2e-encryption*
*Completed: 2026-01-17*
