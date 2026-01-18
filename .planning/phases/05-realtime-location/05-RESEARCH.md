# Phase 5: Real-Time Location - Research

**Researched:** 2026-01-18
**Domain:** React Native background location tracking + MapLibre maps
**Confidence:** HIGH

<research_summary>
## Summary

Researched the ecosystem for building real-time family location sharing with background tracking in Expo/React Native. The standard approach uses **expo-location** for location tracking (both foreground and background) with **expo-task-manager** for background task handling, combined with **@maplibre/maplibre-react-native** for privacy-respecting map display.

Key finding: expo-location handles background location adequately for a family app use case. The more powerful `react-native-background-geolocation` (Transistor Software) is overkill for this project and adds licensing complexity. The critical constraint is iOS — background location stops when the app is terminated, and there's no way to automatically restart on location events (Android limitation too).

**Primary recommendation:** Use expo-location + expo-task-manager for background tracking with Balanced accuracy. Use MapLibre React Native with OpenFreeMap tiles (free, no API key, attribution auto-handled). Accept that terminated apps won't track — this is acceptable for a family app where users keep the app running.
</research_summary>

<standard_stack>
## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| expo-location | ^18.0.0 | Foreground + background location | Built into Expo, handles permissions, TaskManager integration |
| expo-task-manager | ^12.0.0 | Background task registration | Required for expo-location background updates |
| @maplibre/maplibre-react-native | ^10.0.0 | Map display with OSM tiles | Privacy-respecting, no Google dependency, Expo plugin support |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| OpenFreeMap tiles | N/A (free service) | Map tile provider | Default — no API key, free, attribution auto-handled |
| Socket.IO (already installed) | existing | Real-time location broadcast | Already in project from Phase 2 |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| expo-location | react-native-background-geolocation | More powerful but $299/year license, overkill for family app |
| OpenFreeMap | Self-hosted tiles | More control but adds infrastructure complexity |
| OpenFreeMap | Stadia Maps / MapTiler | Free tiers exist but require API keys |
| MapLibre | react-native-maps | Would need Google API key, privacy concern |

**Installation:**
```bash
npx expo install expo-location expo-task-manager @maplibre/maplibre-react-native
```

**app.json config plugin:**
```json
{
  "expo": {
    "plugins": [
      "@maplibre/maplibre-react-native",
      [
        "expo-location",
        {
          "locationAlwaysAndWhenInUsePermission": "Allow Draugar to access your location for family location sharing.",
          "locationAlwaysPermission": "Allow Draugar to track your location in the background for family location sharing.",
          "locationWhenInUsePermission": "Allow Draugar to access your location while using the app.",
          "isAndroidBackgroundLocationEnabled": true,
          "isAndroidForegroundServiceEnabled": true
        }
      ]
    ]
  }
}
```
</standard_stack>

<architecture_patterns>
## Architecture Patterns

### Recommended Project Structure
```
packages/mobile/src/
├── services/
│   └── location/
│       ├── locationService.ts      # Start/stop tracking, permission handling
│       ├── backgroundTask.ts       # TaskManager task definition
│       └── locationBroadcast.ts    # Send encrypted location via Socket.IO
├── screens/
│   └── MapScreen.tsx               # Map display with family markers
├── components/
│   └── FamilyMarker.tsx            # Custom marker for family members
└── hooks/
    └── useLocationPermissions.ts   # Permission request flow
```

### Pattern 1: Background Location Task with TaskManager
**What:** Define background task outside component tree, register on app start
**When to use:** Always for background location
**Example:**
```typescript
// backgroundTask.ts - MUST be imported at app entry point
import * as TaskManager from 'expo-task-manager';
import * as Location from 'expo-location';

export const LOCATION_TASK_NAME = 'draugar-background-location';

TaskManager.defineTask(LOCATION_TASK_NAME, async ({ data, error }) => {
  if (error) {
    console.error('Background location error:', error);
    return;
  }
  if (data) {
    const { locations } = data as { locations: Location.LocationObject[] };
    // Encrypt and broadcast via Socket.IO
    // Note: Socket connection must be maintained separately
    await broadcastLocation(locations[0]);
  }
});
```

### Pattern 2: Permission Request Flow (iOS requires specific order)
**What:** Request foreground first, then background
**When to use:** On first app launch or settings screen
**Example:**
```typescript
// locationService.ts
import * as Location from 'expo-location';

export async function requestLocationPermissions(): Promise<boolean> {
  // Step 1: Foreground permission first (required)
  const { status: foregroundStatus } = await Location.requestForegroundPermissionsAsync();
  if (foregroundStatus !== 'granted') {
    return false;
  }

  // Step 2: Background permission (iOS will show "Always" prompt)
  const { status: backgroundStatus } = await Location.requestBackgroundPermissionsAsync();
  if (backgroundStatus !== 'granted') {
    // Can still work in foreground-only mode
    console.warn('Background permission not granted');
  }

  return true;
}
```

### Pattern 3: Start Background Updates with Battery Optimization
**What:** Configure location updates for battery efficiency
**When to use:** After permissions granted
**Example:**
```typescript
import * as Location from 'expo-location';
import { LOCATION_TASK_NAME } from './backgroundTask';

export async function startBackgroundLocation(): Promise<void> {
  const isTaskDefined = TaskManager.isTaskDefined(LOCATION_TASK_NAME);
  if (!isTaskDefined) {
    console.error('Background task not defined');
    return;
  }

  const hasStarted = await Location.hasStartedLocationUpdatesAsync(LOCATION_TASK_NAME);
  if (hasStarted) {
    return; // Already running
  }

  await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
    accuracy: Location.Accuracy.Balanced, // Good accuracy, reasonable battery
    distanceInterval: 50, // Update every 50 meters
    deferredUpdatesInterval: 60000, // Batch updates every 60 seconds when backgrounded
    pausesUpdatesAutomatically: true, // iOS: pause when stationary
    activityType: Location.ActivityType.Other, // Family tracking, not fitness/navigation
    showsBackgroundLocationIndicator: true, // iOS: blue bar indicator
    foregroundService: {
      notificationTitle: 'Draugar',
      notificationBody: 'Sharing location with family',
      notificationColor: '#4A90A4',
    },
  });
}
```

### Pattern 4: MapLibre with OpenFreeMap Tiles
**What:** Display map with free OSM tiles, no API key required
**When to use:** Map display screen
**Example:**
```typescript
import MapLibreGL from '@maplibre/maplibre-react-native';
import { useEffect } from 'react';

// Initialize MapLibre (call once at app startup)
MapLibreGL.setAccessToken(null); // No token needed for OpenFreeMap

const OPENFREEMAP_STYLE = 'https://tiles.openfreemap.org/styles/liberty/style.json';

export function MapScreen() {
  return (
    <MapLibreGL.MapView
      style={{ flex: 1 }}
      styleURL={OPENFREEMAP_STYLE}
      logoEnabled={true} // Required attribution
      attributionEnabled={true}
    >
      <MapLibreGL.Camera
        zoomLevel={14}
        followUserLocation={true}
        followUserMode="normal"
      />
      <MapLibreGL.UserLocation visible={true} />
    </MapLibreGL.MapView>
  );
}
```

### Anti-Patterns to Avoid
- **Requesting background permission before foreground:** iOS will deny or behave unexpectedly
- **High accuracy for background tracking:** Drains battery fast, use Balanced
- **Continuous polling without distance filter:** Use distanceInterval to reduce updates
- **Not handling terminated app state:** Accept it won't track when killed, inform users
- **Using tile.openstreetmap.org for production:** Violates usage policy, use OpenFreeMap
</architecture_patterns>

<dont_hand_roll>
## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Background location | Custom location polling loop | expo-location + TaskManager | OS kills custom loops, TaskManager integrates with OS lifecycle |
| Permission flow | Manual Alert.alert() prompts | expo-location permission APIs | Platform-specific dialogs, handles edge cases |
| Map tiles | Fetching PNG tiles manually | MapLibre with style URL | Tile caching, zoom levels, gestures all handled |
| Battery optimization | Custom timers/intervals | Location.Accuracy + distanceInterval | expo-location integrates with OS power management |
| Location encryption | Custom crypto | Existing Phase 4 crypto utilities | Already built, tested, working |

**Key insight:** Mobile location is heavily regulated by OS. Both iOS and Android have strict rules about background execution. Fighting the OS leads to apps being killed, denied, or rejected from app stores. expo-location abstracts these platform rules correctly.
</dont_hand_roll>

<common_pitfalls>
## Common Pitfalls

### Pitfall 1: App Termination Stops Tracking
**What goes wrong:** User force-quits app, location stops, family can't see them
**Why it happens:** iOS and Android don't restart terminated apps on location events
**How to avoid:**
- Accept this limitation — it's a platform constraint
- Show clear UI when someone's location is stale
- Add "last seen" timestamp to markers
- Consider push notification if someone goes offline for extended period
**Warning signs:** User complaints about "location not updating"

### Pitfall 2: iOS "Always" Permission Prompt Appears Later
**What goes wrong:** User grants "While Using", then iOS shows "Always" prompt unexpectedly later
**Why it happens:** iOS provisional authorization — grants "When In Use" first, prompts for "Always" after app demonstrates background use
**How to avoid:**
- Explain to users why background is needed BEFORE requesting
- Handle "When In Use" only gracefully — app still works, just no background
- Don't repeatedly prompt if user denied "Always"
**Warning signs:** App works in foreground but stops in background

### Pitfall 3: Android Battery Optimization Kills Background Service
**What goes wrong:** Location updates stop after a while on Android
**Why it happens:** Aggressive battery optimization (especially on Samsung, Xiaomi, Huawei)
**How to avoid:**
- Use foregroundService option in startLocationUpdatesAsync (shows notification)
- Guide users to disable battery optimization for the app (settings link)
- Accept some Android OEMs are aggressive — document known issues
**Warning signs:** Works fine on Pixel, fails on Samsung

### Pitfall 4: MapLibre Doesn't Work in Expo Go
**What goes wrong:** Map crashes or doesn't render in Expo Go
**Why it happens:** MapLibre requires native code not in Expo Go
**How to avoid:**
- Use development build (expo run:ios, expo run:android)
- Document that Expo Go is development-only for non-map features
**Warning signs:** "Native module not found" errors

### Pitfall 5: Location Updates Flood WebSocket
**What goes wrong:** High-frequency updates overwhelm server/clients
**Why it happens:** distanceInterval too low, deferredUpdatesInterval not set
**How to avoid:**
- Use distanceInterval: 50 (meters) minimum
- Use deferredUpdatesInterval: 60000 (1 minute) for background batching
- Server-side: Rate limit per user, only broadcast if location changed significantly
**Warning signs:** High server CPU, clients lagging
</common_pitfalls>

<code_examples>
## Code Examples

### Complete Permission + Start Flow
```typescript
// Source: Expo Location docs + Context7
import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';

const LOCATION_TASK_NAME = 'draugar-background-location';

export async function initializeLocationTracking(): Promise<{
  foreground: boolean;
  background: boolean;
}> {
  // Check current permissions
  const { status: existingForeground } = await Location.getForegroundPermissionsAsync();
  const { status: existingBackground } = await Location.getBackgroundPermissionsAsync();

  let foreground = existingForeground === 'granted';
  let background = existingBackground === 'granted';

  // Request if not granted
  if (!foreground) {
    const { status } = await Location.requestForegroundPermissionsAsync();
    foreground = status === 'granted';
  }

  if (foreground && !background) {
    const { status } = await Location.requestBackgroundPermissionsAsync();
    background = status === 'granted';
  }

  // Start tracking if we have at least foreground
  if (foreground) {
    await startLocationUpdates(background);
  }

  return { foreground, background };
}

async function startLocationUpdates(hasBackground: boolean): Promise<void> {
  if (hasBackground) {
    await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
      accuracy: Location.Accuracy.Balanced,
      distanceInterval: 50,
      deferredUpdatesInterval: 60000,
      pausesUpdatesAutomatically: true,
      showsBackgroundLocationIndicator: true,
      foregroundService: {
        notificationTitle: 'Draugar',
        notificationBody: 'Sharing location with family',
      },
    });
  } else {
    // Foreground-only: use watchPositionAsync
    await Location.watchPositionAsync(
      { accuracy: Location.Accuracy.Balanced, distanceInterval: 50 },
      (location) => broadcastLocation(location)
    );
  }
}
```

### MapLibre Setup with Family Markers
```typescript
// Source: MapLibre React Native docs + Context7
import MapLibreGL from '@maplibre/maplibre-react-native';
import { View, StyleSheet } from 'react-native';

interface FamilyMember {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  lastUpdated: Date;
}

const OPENFREEMAP_STYLE = 'https://tiles.openfreemap.org/styles/liberty/style.json';

export function FamilyMapScreen({ members }: { members: FamilyMember[] }) {
  return (
    <MapLibreGL.MapView style={styles.map} styleURL={OPENFREEMAP_STYLE}>
      <MapLibreGL.Camera
        zoomLevel={14}
        centerCoordinate={[24.9384, 60.1699]} // Helsinki default
        animationMode="flyTo"
      />

      {/* Current user location */}
      <MapLibreGL.UserLocation
        visible={true}
        showsUserHeadingIndicator={true}
        minDisplacement={10}
      />

      {/* Family member markers */}
      {members.map((member) => (
        <MapLibreGL.MarkerView
          key={member.id}
          coordinate={[member.longitude, member.latitude]}
        >
          <View style={styles.marker}>
            <Text style={styles.markerText}>{member.name[0]}</Text>
          </View>
        </MapLibreGL.MarkerView>
      ))}
    </MapLibreGL.MapView>
  );
}

const styles = StyleSheet.create({
  map: { flex: 1 },
  marker: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#4A90A4',
    justifyContent: 'center',
    alignItems: 'center',
  },
  markerText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
```

### Encrypted Location Broadcast
```typescript
// Source: Project Phase 4 crypto + Socket.IO from Phase 2
import { encryptForGroup } from '@draugar/shared/crypto';
import { socket } from '../services/socket';

interface LocationPayload {
  lat: number;
  lng: number;
  accuracy: number;
  timestamp: number;
}

export async function broadcastLocation(location: Location.LocationObject): Promise<void> {
  const payload: LocationPayload = {
    lat: location.coords.latitude,
    lng: location.coords.longitude,
    accuracy: location.coords.accuracy ?? 0,
    timestamp: location.timestamp,
  };

  // Encrypt with group key (from Phase 4)
  const encrypted = await encryptForGroup(JSON.stringify(payload));

  // Send via Socket.IO (from Phase 2)
  socket.emit('location:update', { encrypted });
}
```
</code_examples>

<sota_updates>
## State of the Art (2025-2026)

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| react-native-maps with Google | MapLibre React Native | 2023+ | Privacy-respecting, no API key needed |
| Mapbox GL React Native | MapLibre (fork) | 2021 | Open source, no proprietary lock-in |
| expo-location v17 | expo-location v18+ | 2024 | Better background support, Expo SDK 52+ |
| Custom tile servers | OpenFreeMap | 2024 | Free hosted tiles with no API key |
| Always-high accuracy | Balanced accuracy default | Ongoing | Battery efficiency more important |

**New tools/patterns to consider:**
- **iOS 17+ CoreLocation APIs:** New background location improvements, but expo-location abstracts this
- **OpenFreeMap:** Launched 2024, simplest free tile option, auto-attribution with MapLibre
- **MapLibre v10:** Expo config plugin support, easier setup than v9

**Deprecated/outdated:**
- **tile.openstreetmap.org for production:** Use OpenFreeMap or self-host
- **react-native-mauron85-background-geolocation:** Abandoned, use expo-location or Transistor's library
- **Manual Podfile modifications for MapLibre:** Use Expo config plugin instead
</sota_updates>

<open_questions>
## Open Questions

1. **Socket.IO background connection persistence**
   - What we know: Socket.IO connections may drop when app backgrounds
   - What's unclear: Best pattern for reconnection in background task
   - Recommendation: Test on device, may need to reconnect in each background task invocation

2. **OpenFreeMap reliability for production**
   - What we know: Free service, runs on donations, used by MapHub for 9 years
   - What's unclear: SLA guarantees, uptime history
   - Recommendation: Use as primary, have fallback plan to self-host if needed

3. **Exact battery impact of Balanced accuracy + 50m interval**
   - What we know: Balanced is recommended, 50m is reasonable
   - What's unclear: Real-world battery drain on target devices
   - Recommendation: Test on physical devices, adjust if needed during Phase 6
</open_questions>

<sources>
## Sources

### Primary (HIGH confidence)
- /expo/expo Context7 — expo-location TaskManager integration, background permissions
- /maplibre/maplibre-react-native Context7 — UserLocation, Camera, MarkerView components
- https://docs.expo.dev/versions/latest/sdk/location/ — Full expo-location API reference
- https://maplibre.org/maplibre-react-native/docs/setup/expo/ — Expo setup guide

### Secondary (MEDIUM confidence)
- https://developer.apple.com/documentation/corelocation/handling-location-updates-in-the-background — iOS background location rules
- https://openfreemap.org/ — Free tile provider details
- npm trends comparison — expo-location vs react-native-background-geolocation popularity

### Tertiary (LOW confidence - needs validation)
- Battery optimization behavior on Samsung/Xiaomi — anecdotal reports, test on actual devices
</sources>

<metadata>
## Metadata

**Research scope:**
- Core technology: expo-location + expo-task-manager
- Ecosystem: MapLibre React Native, OpenFreeMap tiles
- Patterns: Background task registration, permission flow, battery optimization
- Pitfalls: App termination, iOS Always permission, Android battery killers

**Confidence breakdown:**
- Standard stack: HIGH — verified with Context7 and official docs
- Architecture: HIGH — patterns from official examples
- Pitfalls: HIGH — documented in Apple/Android docs, Expo issues
- Code examples: HIGH — from Context7 and official sources

**Research date:** 2026-01-18
**Valid until:** 2026-02-18 (30 days — Expo ecosystem stable)
</metadata>

---

*Phase: 05-realtime-location*
*Research completed: 2026-01-18*
*Ready for planning: yes*
