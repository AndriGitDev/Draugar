import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { Location as LocationType } from '@draugar/shared';
import * as Location from 'expo-location';
import * as SecureStore from 'expo-secure-store';
import {
  startLocationUpdates,
  stopLocationUpdates,
  requestLocationPermissions,
  getLocationPermissionStatus,
  type LocationPermissions,
} from '../services/location';
import {
  connectSocket,
  sendLocationUpdate,
  onFamilyLocationUpdate,
  disconnectSocket,
  setGhostMode as socketSetGhostMode,
} from '../services/socket';
import { useAuth } from './AuthContext';

const GHOST_MODE_KEY = 'draugar_ghost_mode';

interface FamilyMember {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  lastUpdated: Date;
}

interface LocationContextValue {
  isTracking: boolean;
  permissions: LocationPermissions;
  familyLocations: Map<string, FamilyMember>;
  isGhostMode: boolean;
  startTracking: () => Promise<boolean>;
  stopTracking: () => Promise<void>;
  requestPermissions: () => Promise<LocationPermissions>;
  toggleGhostMode: () => void;
  isAuthenticated: boolean;
}

const LocationContext = createContext<LocationContextValue | null>(null);

export function LocationProvider({ children }: { children: React.ReactNode }): React.JSX.Element {
  const { user, isLoading } = useAuth();
  const isAuthenticated = !!user && !isLoading;
  const [isTracking, setIsTracking] = useState(false);
  const [permissions, setPermissions] = useState<LocationPermissions>({ foreground: false, background: false });
  const [familyLocations, setFamilyLocations] = useState<Map<string, FamilyMember>>(new Map());
  const [isGhostMode, setIsGhostMode] = useState(false);

  // Check permissions and load ghost mode on mount
  useEffect(() => {
    getLocationPermissionStatus().then(setPermissions);

    // Load ghost mode from SecureStore
    SecureStore.getItemAsync(GHOST_MODE_KEY).then((value) => {
      const enabled = value === 'true';
      setIsGhostMode(enabled);
      socketSetGhostMode(enabled);
    });
  }, []);

  // Connect socket when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      // Get server URL from environment or use VPS default
      const serverUrl = process.env.EXPO_PUBLIC_API_URL || 'http://46.62.215.113:3000';
      connectSocket(serverUrl);

      // Listen for family location updates
      const unsubscribe = onFamilyLocationUpdate((userId, location) => {
        setFamilyLocations((prev) => {
          const next = new Map(prev);
          next.set(userId, {
            id: userId,
            name: userId.slice(0, 8), // TODO: Get actual name from user data
            latitude: location.latitude,
            longitude: location.longitude,
            lastUpdated: new Date(location.timestamp),
          });
          return next;
        });
      });

      return () => {
        unsubscribe();
        disconnectSocket();
      };
    }
  }, [isAuthenticated]);

  const handleLocationUpdate = useCallback(async (locationObj: Location.LocationObject) => {
    if (!user?.id) return;

    const location: LocationType = {
      userId: user.id,
      latitude: locationObj.coords.latitude,
      longitude: locationObj.coords.longitude,
      accuracy: locationObj.coords.accuracy ?? 0,
      timestamp: new Date(locationObj.timestamp),
    };

    await sendLocationUpdate(location);
  }, [user?.id]);

  const startTracking = useCallback(async (): Promise<boolean> => {
    const success = await startLocationUpdates(handleLocationUpdate);
    setIsTracking(success);
    return success;
  }, [handleLocationUpdate]);

  const stopTracking = useCallback(async (): Promise<void> => {
    await stopLocationUpdates();
    setIsTracking(false);
  }, []);

  const requestPermissionsHandler = useCallback(async (): Promise<LocationPermissions> => {
    const perms = await requestLocationPermissions();
    setPermissions(perms);
    return perms;
  }, []);

  const toggleGhostMode = useCallback(() => {
    setIsGhostMode((prev) => {
      const newValue = !prev;
      // Update socket service immediately
      socketSetGhostMode(newValue);
      // Persist to SecureStore
      SecureStore.setItemAsync(GHOST_MODE_KEY, newValue ? 'true' : 'false');
      return newValue;
    });
  }, []);

  return (
    <LocationContext.Provider
      value={{
        isTracking,
        permissions,
        familyLocations,
        isGhostMode,
        startTracking,
        stopTracking,
        requestPermissions: requestPermissionsHandler,
        toggleGhostMode,
        isAuthenticated,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
}

export function useLocation(): LocationContextValue {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error('useLocation must be used within LocationProvider');
  }
  return context;
}
