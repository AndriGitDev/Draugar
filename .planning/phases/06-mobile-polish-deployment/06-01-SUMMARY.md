---
phase: 06-mobile-polish-deployment
plan: 01
subsystem: mobile
tags: [ghost-mode, location-sharing, privacy, react-native, secure-store]

# Dependency graph
requires:
  - phase: 05-real-time-location
    provides: LocationContext, socket service, MapScreen
provides:
  - Ghost mode state management with SecureStore persistence
  - Ghost mode toggle UI on MapScreen
  - Location broadcast suppression when invisible
affects: [mobile-ui, location-privacy, user-settings]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - SecureStore persistence for user preferences
    - Module-level flag pattern in socket service

key-files:
  created: []
  modified:
    - packages/mobile/src/context/LocationContext.tsx
    - packages/mobile/src/services/socket/index.ts
    - packages/mobile/src/screens/MapScreen.tsx

key-decisions:
  - "Ghost mode persisted to SecureStore key 'draugar_ghost_mode'"
  - "Ghost mode only shown when tracking is active"
  - "Module-level ghostMode flag in socket service for broadcast control"

patterns-established:
  - "SecureStore for user preference persistence"
  - "Conditional UI based on tracking state"

# Metrics
duration: 3 min
completed: 2026-01-18
---

# Phase 6 Plan 01: Ghost Mode Summary

**Ghost mode feature allowing users to pause location sharing while staying connected and receiving family locations**

## Performance

- **Duration:** 3 min
- **Started:** 2026-01-18T18:02:58Z
- **Completed:** 2026-01-18T18:06:28Z
- **Tasks:** 2
- **Files modified:** 3

## Accomplishments

- Ghost mode state with SecureStore persistence across app restarts
- Socket service blocks outgoing location broadcasts when ghost mode enabled
- Toggle UI on MapScreen with visual feedback when invisible
- User continues receiving family locations while invisible

## Task Commits

Each task was committed atomically:

1. **Task 1: Add ghost mode state to LocationContext and socket service** - `b5b8431` (feat)
2. **Task 2: Add ghost mode toggle UI to MapScreen** - `086ced7` (feat)

## Files Created/Modified

- `packages/mobile/src/context/LocationContext.tsx` - Added isGhostMode state, toggleGhostMode function, SecureStore persistence
- `packages/mobile/src/services/socket/index.ts` - Added setGhostMode/isGhostModeEnabled exports, skip broadcast when ghost mode active
- `packages/mobile/src/screens/MapScreen.tsx` - Ghost mode toggle button with conditional styling and visibility indicator

## Decisions Made

- Ghost mode persisted using SecureStore with key `draugar_ghost_mode` for consistency with other Draugar keys
- Ghost mode toggle only appears when tracking is active (logical UX - can't go invisible if not sharing)
- Module-level `ghostMode` flag in socket service rather than passing through function params (simpler API)

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None

## Next Phase Readiness

- Ghost mode complete, ready for 06-02 (Battery optimization and settings)
- No blockers

---
*Phase: 06-mobile-polish-deployment*
*Completed: 2026-01-18*
