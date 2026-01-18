# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-01-14)

**Core value:** Smooth real-time location tracking that actually works — privacy is table stakes, but the app must feel responsive and reliable for family to adopt it.
**Current focus:** Phase 5 — Location Tracking

## Current Position

Phase: 5 of 6 (Real-Time Location)
Plan: 1 of 3 in current phase
Status: In progress
Last activity: 2026-01-18 — Completed 05-01-PLAN.md (Location dependencies)

Progress: █████████████████░░ 88%

## Performance Metrics

**Velocity:**
- Total plans completed: 14
- Average duration: 3.9 min
- Total execution time: 54 min

**By Phase:**

| Phase | Plans | Total | Avg/Plan |
|-------|-------|-------|----------|
| 1. Foundation | 3/3 | 11 min | 3.7 min |
| 2. Backend Core | 3/3 | 15 min | 5.0 min |
| 3. Authentication | 3/3 | 14 min | 4.7 min |
| 4. E2E Encryption | 4/4 | 12 min | 3.0 min |
| 5. Real-Time Location | 1/3 | 2 min | 2.0 min |

**Recent Trend:**
- Last 5 plans: 04-02 (4 min), 04-03 (4 min), 04-04 (3 min), 05-01 (2 min)
- Trend: Stable velocity

## Accumulated Context

### Decisions

Decisions are logged in PROJECT.md Key Decisions table.
Recent decisions affecting current work:

- pnpm over npm/yarn for monorepo (better workspace support)
- Shared types in dedicated package for cross-package type safety
- TypeScript strict mode as default
- Express 4.x with tsx for fast development mode
- Health endpoint at /health for service monitoring
- Drizzle ORM over Prisma (lighter weight, pure TypeScript)
- UUID primary keys for all database tables
- Simple console logging with ANSI colors for request logger
- Explicit RouterType annotations for pnpm monorepo compatibility
- Socket.IO over raw ws for reconnection and mobile-friendly transport fallbacks
- HTTP and WebSocket on same port for mobile client simplicity
- 8-char invite codes with 32-char charset (excludes ambiguous 0/O, 1/l/I)
- Silent validation failure returns valid:false without error details (security)
- jose library over jsonwebtoken for Edge compatibility and ESM-native support
- 30-day JWT token expiry (no refresh tokens - family app simplicity)
- HS256 algorithm for JWT signing
- expo-secure-store for encrypted token storage on mobile
- React Context for auth state (simplicity over state libraries for family app)
- API utilities pattern with centralized fetch wrapper for auth headers
- XChaCha20-Poly1305 payload format with version field for future compatibility
- Base64 encoding for all binary crypto data (keys, nonces, ciphertext)
- Consistent SecureStore key naming (draugar_sk, draugar_pk, draugar_gk)
- Singleton sodium initialization pattern (initSodium() before any crypto ops)
- Graceful null returns on decryption failure (no exceptions thrown)
- Type assertions for libsodium return types (Uint8Array casts)
- Nonce prepended to encrypted data for single-string transmission
- groupMembers junction table for user-group relationships
- Graceful crypto errors in auth flow (log but don't block)
- Async main() wrapper for backend startup with sodium init
- MapLibre over react-native-maps for privacy (no Google dependency)
- expo-location over react-native-background-geolocation (simpler, no license cost)

### Pending Todos

None yet.

### Blockers/Concerns

None.

## Session Continuity

Last session: 2026-01-18
Stopped at: Completed 05-01-PLAN.md
Resume file: None
Next: 05-02-PLAN.md (Location broadcasting)

**Phase 5 Progress:**
- 05-01 (Location dependencies) - COMPLETE
- 05-02 (Location broadcasting) - Not started
- 05-03 (Background tracking) - Not started

1/3 plans complete. Dependencies installed, ready for implementation.
