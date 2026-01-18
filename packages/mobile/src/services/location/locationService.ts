import * as Location from 'expo-location';
import * as SecureStore from 'expo-secure-store';
import { LOCATION_TASK_NAME, setLocationUpdateHandler } from './backgroundTask';

const FREQUENCY_KEY = 'draugar_update_frequency';

type FrequencyPreset = 'low' | 'balanced' | 'high';

interface FrequencySettings {
  distanceInterval: number;
  deferredUpdatesInterval: number;
}

const FREQUENCY_PRESETS: Record<FrequencyPreset, FrequencySettings> = {
  low: { distanceInterval: 100, deferredUpdatesInterval: 300000 }, // 100m, 5 min
  balanced: { distanceInterval: 50, deferredUpdatesInterval: 60000 }, // 50m, 1 min
  high: { distanceInterval: 20, deferredUpdatesInterval: 30000 }, // 20m, 30 sec
};

export async function getUpdateFrequencySettings(): Promise<FrequencySettings> {
  try {
    const stored = await SecureStore.getItemAsync(FREQUENCY_KEY);
    if (stored && stored in FREQUENCY_PRESETS) {
      console.log('[location] Using frequency preset:', stored);
      return FREQUENCY_PRESETS[stored as FrequencyPreset];
    }
  } catch (error) {
    console.error('[location] Failed to read frequency setting:', error);
  }
  console.log('[location] Using default balanced preset');
  return FREQUENCY_PRESETS.balanced;
}

export interface LocationPermissions {
  foreground: boolean;
  background: boolean;
}

export async function getLocationPermissionStatus(): Promise<LocationPermissions> {
  const { status: foreground } = await Location.getForegroundPermissionsAsync();
  const { status: background } = await Location.getBackgroundPermissionsAsync();
  return {
    foreground: foreground === 'granted',
    background: background === 'granted',
  };
}

export async function requestLocationPermissions(): Promise<LocationPermissions> {
  // Foreground first (required before background on iOS)
  const { status: foreground } = await Location.requestForegroundPermissionsAsync();
  if (foreground !== 'granted') {
    return { foreground: false, background: false };
  }

  // Then background
  const { status: background } = await Location.requestBackgroundPermissionsAsync();
  return {
    foreground: true,
    background: background === 'granted',
  };
}

// Store subscription for foreground updates
let foregroundSubscription: Location.LocationSubscription | null = null;

export async function startLocationUpdates(
  onUpdate: (location: Location.LocationObject) => void
): Promise<boolean> {
  const permissions = await getLocationPermissionStatus();
  if (!permissions.foreground) {
    console.error('[location] No foreground permission');
    return false;
  }

  // Register the update handler for background task
  setLocationUpdateHandler(onUpdate);

  // Get user-selected frequency settings
  const frequencySettings = await getUpdateFrequencySettings();

  // Always start foreground watcher for immediate updates while app is open
  if (foregroundSubscription) {
    foregroundSubscription.remove();
  }
  foregroundSubscription = await Location.watchPositionAsync(
    {
      accuracy: Location.Accuracy.Balanced,
      distanceInterval: 10, // More sensitive for foreground
      timeInterval: 10000, // Every 10 seconds
    },
    (location) => {
      console.log('[location] Foreground update:', location.coords.latitude, location.coords.longitude);
      onUpdate(location);
    }
  );
  console.log('[location] Foreground watcher started');

  if (permissions.background) {
    // Check if already running
    const isRunning = await Location.hasStartedLocationUpdatesAsync(LOCATION_TASK_NAME);
    if (!isRunning) {
      await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
        accuracy: Location.Accuracy.Balanced,
        distanceInterval: frequencySettings.distanceInterval,
        deferredUpdatesInterval: frequencySettings.deferredUpdatesInterval,
        pausesUpdatesAutomatically: true,
        activityType: Location.ActivityType.Other,
        showsBackgroundLocationIndicator: true,
        foregroundService: {
          notificationTitle: 'Draugar',
          notificationBody: 'Sharing location with family',
          notificationColor: '#4A90A4',
        },
      });
    }
    console.log(
      '[location] Background tracking started with intervals:',
      frequencySettings.distanceInterval,
      'm /',
      frequencySettings.deferredUpdatesInterval / 1000,
      's'
    );
  } else {
    // Foreground-only fallback
    console.log('[location] Foreground-only tracking (no background permission)');
  }

  return true;
}

export async function stopLocationUpdates(): Promise<void> {
  setLocationUpdateHandler(null);

  // Stop foreground watcher
  if (foregroundSubscription) {
    foregroundSubscription.remove();
    foregroundSubscription = null;
  }

  const isRunning = await Location.hasStartedLocationUpdatesAsync(LOCATION_TASK_NAME);
  if (isRunning) {
    await Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME);
  }
  console.log('[location] Tracking stopped');
}
