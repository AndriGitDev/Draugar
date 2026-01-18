import * as TaskManager from 'expo-task-manager';
import * as Location from 'expo-location';

export const LOCATION_TASK_NAME = 'draugar-background-location';

// This will be set by locationService when it starts
let onLocationUpdate: ((location: Location.LocationObject) => void) | null = null;

export function setLocationUpdateHandler(
  handler: ((location: Location.LocationObject) => void) | null
): void {
  onLocationUpdate = handler;
}

TaskManager.defineTask(LOCATION_TASK_NAME, async ({ data, error }) => {
  if (error) {
    console.error('[location] Background task error:', error.message);
    return;
  }

  if (data) {
    const { locations } = data as { locations: Location.LocationObject[] };
    if (locations.length > 0 && onLocationUpdate) {
      // Process most recent location
      onLocationUpdate(locations[locations.length - 1]);
    }
  }
});
