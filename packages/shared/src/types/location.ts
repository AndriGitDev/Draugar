/**
 * Location update from a user's device
 */
export interface Location {
  /** The user this location belongs to */
  userId: string;
  /** Latitude in degrees */
  latitude: number;
  /** Longitude in degrees */
  longitude: number;
  /** When this location was recorded */
  timestamp: Date;
  /** Accuracy in meters */
  accuracy: number;
}
