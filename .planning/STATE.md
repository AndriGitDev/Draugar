# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-01-14)

**Core value:** Smooth real-time location tracking that actually works — privacy is table stakes, but the app must feel responsive and reliable for family to adopt it.
**Current focus:** Phase 6 — Mobile Polish & Deployment

## Current Position

Phase: 6 of 6 (Mobile Polish & Deployment)
Plan: 3 of 3 in current phase
Status: Phase complete
Last activity: 2026-01-18 — Completed 06-03-PLAN.md (Docker setup)

Progress: ████████████████████ 100%

## Performance Metrics

**Velocity:**
- Total plans completed: 20
- Average duration: 3.8 min
- Total execution time: 76 min

**By Phase:**

| Phase | Plans | Total | Avg/Plan |
|-------|-------|-------|----------|
| 1. Foundation | 3/3 | 11 min | 3.7 min |
| 2. Backend Core | 3/3 | 15 min | 5.0 min |
| 3. Authentication | 3/3 | 14 min | 4.7 min |
| 4. E2E Encryption | 4/4 | 12 min | 3.0 min |
| 5. Real-Time Location | 4/4 | 12 min | 3.0 min |
| 6. Mobile Polish | 3/3 | 12 min | 4.0 min |

**Recent Trend:**
- Last 5 plans: 05-04 (8 min), 06-01 (3 min), 06-02 (4 min), 06-03 (5 min)
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
- Handler registration pattern for background task callbacks (avoids circular dependencies)
- Balanced accuracy with 50m/60s intervals for battery efficiency
- Named imports for MapLibre components (MapView vs MapLibreGL.MapView) for better tree-shaking
- Zero-knowledge relay: server broadcasts encrypted payloads without decryption capability
- Callback subscription pattern for family location updates (Set-based callbacks)
- LocationContext manages both tracking state and family member locations
- Broadcast to all authenticated users for MVP (room-based filtering deferred)
- Ghost mode persisted to SecureStore key 'draugar_ghost_mode'
- Module-level ghostMode flag in socket service for broadcast control
- Three frequency presets (low/balanced/high) for battery optimization
- SecureStore key 'draugar_update_frequency' for frequency preference
- HomeScreen as navigation hub with Map and Settings buttons
- Multi-stage Docker build for minimal image size
- Non-root container user (nodejs) for security
- Docker health checks on backend and database services
- PostgreSQL data persisted via Docker volume
- Database not exposed externally (internal Docker network only)

### Pending Todos

None yet.

### Blockers/Concerns

None.

## Session Continuity

Last session: 2026-01-18
Stopped at: Completed 06-03-PLAN.md
Resume file: None
Next: Milestone complete - all 6 phases finished

**Phase 6 Progress:**
- 06-01 (Ghost mode) - COMPLETE
- 06-02 (Battery optimization and settings) - COMPLETE
- 06-03 (Docker setup and VPS deployment) - COMPLETE

3/3 plans complete. Phase 6 (Mobile Polish & Deployment) complete. Milestone 100% done.
