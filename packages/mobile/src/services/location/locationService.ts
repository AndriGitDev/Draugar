import * as Location from 'expo-location';
import { LOCATION_TASK_NAME, setLocationUpdateHandler } from './backgroundTask';

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

export async function startLocationUpdates(
  onUpdate: (location: Location.LocationObject) => void
): Promise<boolean> {
  const permissions = await getLocationPermissionStatus();
  if (!permissions.foreground) {
    console.error('[location] No foreground permission');
    return false;
  }

  // Register the update handler
  setLocationUpdateHandler(onUpdate);

  if (permissions.background) {
    // Check if already running
    const isRunning = await Location.hasStartedLocationUpdatesAsync(LOCATION_TASK_NAME);
    if (!isRunning) {
      await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
        accuracy: Location.Accuracy.Balanced,
        distanceInterval: 50,
        deferredUpdatesInterval: 60000,
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
    console.log('[location] Background tracking started');
  } else {
    // Foreground-only fallback
    console.log('[location] Foreground-only tracking (no background permission)');
  }

  return true;
}

export async function stopLocationUpdates(): Promise<void> {
  setLocationUpdateHandler(null);

  const isRunning = await Location.hasStartedLocationUpdatesAsync(LOCATION_TASK_NAME);
  if (isRunning) {
    await Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME);
  }
  console.log('[location] Tracking stopped');
}
