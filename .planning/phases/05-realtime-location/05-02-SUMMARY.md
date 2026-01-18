---
phase: 05-realtime-location
plan: 02
subsystem: location
tags: [expo-location, expo-task-manager, background-tracking, permissions]

# Dependency graph
requires:
  - phase: 05-01
    provides: expo-location and expo-task-manager packages installed
provides:
  - Background location task with TaskManager
  - Location service with permission flow
  - Start/stop location tracking controls
  - Battery-optimized location settings
affects: [05-03, 05-04]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - TaskManager.defineTask for background location
    - Foreground-first permission flow for iOS compatibility
    - Handler registration pattern for background task callbacks

key-files:
  created:
    - packages/mobile/src/services/location/backgroundTask.ts
    - packages/mobile/src/services/location/locationService.ts
    - packages/mobile/src/services/location/index.ts
  modified:
    - packages/mobile/App.tsx

key-decisions:
  - "Handler registration pattern - setLocationUpdateHandler allows locationService to inject callback into background task"
  - "Balanced accuracy over High - battery optimization for family app use case"
  - "50m distance interval with 60s deferred updates - reasonable tracking without battery drain"

patterns-established:
  - "Background task registration at app entry point via barrel import"
  - "Permission check before starting location updates"
  - "Foreground service notification for Android background tracking"

# Metrics
duration: 1min
completed: 2026-01-18
---

# Phase 5 Plan 2: Background Location Service Summary

**Background location tracking service using expo-location and expo-task-manager with battery-optimized settings and iOS/Android permission flow**

## Performance

- **Duration:** 1 min
- **Started:** 2026-01-18T16:58:15Z
- **Completed:** 2026-01-18T16:59:17Z
- **Tasks:** 3
- **Files modified:** 4

## Accomplishments
- Created background location task with TaskManager.defineTask
- Implemented location service with permission handling (foreground-first for iOS)
- Configured battery-optimized tracking (Balanced accuracy, 50m distance, 60s batching)
- Set up foreground service notification for Android
- Registered background task at app startup via barrel import

## Task Commits

Each task was committed atomically:

1. **Task 1: Create background location task** - `e55bf97` (feat)
2. **Task 2: Create location service with permission flow** - `47eff55` (feat)
3. **Task 3: Create location service barrel export and import at app entry** - `b90974d` (feat)

**Plan metadata:** (this commit) (docs: complete plan)

## Files Created/Modified
- `packages/mobile/src/services/location/backgroundTask.ts` - TaskManager task definition with handler registration
- `packages/mobile/src/services/location/locationService.ts` - Permission flow and tracking controls
- `packages/mobile/src/services/location/index.ts` - Barrel export ensuring task registration order
- `packages/mobile/App.tsx` - Import for location service (already present, anticipating this plan)

## Decisions Made
- **Handler registration pattern:** setLocationUpdateHandler allows the background task to call back into application code without circular dependencies
- **Balanced accuracy:** Uses Location.Accuracy.Balanced instead of High for battery efficiency (per RESEARCH.md recommendations)
- **Distance and time intervals:** 50m distance, 60s deferred updates - balances location freshness with battery life

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
None

## Next Phase Readiness
- Location service ready for use by MapScreen (plan 05-03)
- Permission flow handles iOS foreground-first requirement
- Background tracking will work when app is backgrounded (not terminated)
- Handler pattern ready for socket integration in plan 05-04

---
*Phase: 05-realtime-location*
*Completed: 2026-01-18*
