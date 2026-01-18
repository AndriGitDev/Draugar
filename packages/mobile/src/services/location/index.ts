// CRITICAL: Import backgroundTask first to register TaskManager task
import './backgroundTask';

export { LOCATION_TASK_NAME, setLocationUpdateHandler } from './backgroundTask';
export {
  requestLocationPermissions,
  startLocationUpdates,
  stopLocationUpdates,
  getLocationPermissionStatus,
  type LocationPermissions,
} from './locationService';
