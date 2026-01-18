---
phase: 05-realtime-location
plan: 01
subsystem: infra
tags: [expo-location, expo-task-manager, maplibre-react-native, openfreemap, background-location]

# Dependency graph
requires:
  - phase: 04-e2e-encryption
    provides: libsodium crypto utilities for encrypting location data
provides:
  - expo-location and expo-task-manager for background location tracking
  - MapLibre React Native for privacy-respecting map display
  - Expo config plugins for iOS/Android location permissions
affects: [05-02-location-broadcast, 05-03-background-tracking, 06-battery-optimization]

# Tech tracking
tech-stack:
  added: [expo-location ~19.0.8, expo-task-manager ~14.0.9, @maplibre/maplibre-react-native ^10.4.2]
  patterns: [Expo config plugins for native module configuration]

key-files:
  created: []
  modified: [packages/mobile/package.json, packages/mobile/app.json]

key-decisions:
  - "MapLibre over react-native-maps for privacy (no Google dependency)"
  - "expo-location over react-native-background-geolocation (simpler, no license cost)"
  - "All three permission strings configured for full iOS/Android background support"

patterns-established:
  - "Expo plugin configuration for native modules with custom settings"

# Metrics
duration: 2min
completed: 2026-01-18
---

# Phase 5 Plan 01: Location Dependencies Summary

**Installed expo-location, expo-task-manager, and MapLibre React Native with Expo config plugins for iOS/Android background location permissions**

## Performance

- **Duration:** 2 min
- **Started:** 2026-01-18T16:50:36Z
- **Completed:** 2026-01-18T16:52:15Z
- **Tasks:** 2
- **Files modified:** 2

## Accomplishments

- Installed expo-location ~19.0.8 for foreground and background location tracking
- Installed expo-task-manager ~14.0.9 for background task registration
- Installed @maplibre/maplibre-react-native ^10.4.2 for privacy-respecting map display
- Configured Expo plugins with all three iOS permission strings
- Enabled Android background location and foreground service

## Task Commits

Each task was committed atomically:

1. **Task 1: Install location and map dependencies** - `e11b247` (feat)
2. **Task 2: Configure Expo plugins for location and MapLibre** - `60863fa` (feat)

## Files Created/Modified

- `packages/mobile/package.json` - Added expo-location, expo-task-manager, @maplibre/maplibre-react-native dependencies
- `packages/mobile/app.json` - Added @maplibre/maplibre-react-native and expo-location plugins with permission strings

## Decisions Made

- Used MapLibre React Native (privacy-respecting, no Google API key required) over react-native-maps
- Used expo-location (built-in Expo support, no license cost) over react-native-background-geolocation ($299/year)
- Configured all three iOS permission strings for maximum flexibility (foreground, background, always)
- Enabled both Android background location and foreground service for reliable background tracking

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None

## Next Phase Readiness

- Dependencies installed and plugins configured
- Ready for Plan 05-02 (location service implementation)
- Ready for Plan 05-03 (map screen implementation)
- Note: Development build required for testing (MapLibre doesn't work in Expo Go)

---
*Phase: 05-realtime-location*
*Completed: 2026-01-18*
