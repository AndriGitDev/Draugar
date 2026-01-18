import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { MapView, Camera, UserLocation, MarkerView, UserTrackingMode } from '@maplibre/maplibre-react-native';
import { useLocation } from '../context/LocationContext';

// OpenFreeMap - free OSM tiles, no API key needed
// Attribution is auto-handled by MapLibre when logoEnabled and attributionEnabled are true
const OPENFREEMAP_STYLE = 'https://tiles.openfreemap.org/styles/liberty/style.json';

// Note: No token needed for OpenFreeMap - it's free and open

export function MapScreen(): React.JSX.Element {
  const { isTracking, familyLocations, startTracking, stopTracking, permissions, isGhostMode, toggleGhostMode } = useLocation();

  const handleToggleTracking = async () => {
    if (isTracking) {
      await stopTracking();
    } else {
      await startTracking();
    }
  };

  const familyMembers = Array.from(familyLocations.values());

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        mapStyle={OPENFREEMAP_STYLE}
        logoEnabled={true}
        attributionEnabled={true}
      >
        <Camera
          zoomLevel={14}
          followUserLocation={true}
          followUserMode={UserTrackingMode.Follow}
          animationMode="flyTo"
          animationDuration={1000}
        />

        <UserLocation
          visible={true}
          animated={true}
          showsUserHeadingIndicator={true}
          minDisplacement={10}
        />

        {familyMembers.map((member) => (
          <MarkerView
            key={member.id}
            coordinate={[member.longitude, member.latitude]}
          >
            <View style={styles.marker}>
              <Text style={styles.markerText}>
                {member.name.charAt(0).toUpperCase()}
              </Text>
            </View>
          </MarkerView>
        ))}
      </MapView>

      <View style={styles.controls}>
        {isTracking && (
          <TouchableOpacity
            style={[styles.ghostButton, isGhostMode && styles.ghostButtonActive]}
            onPress={toggleGhostMode}
          >
            <Text style={[styles.ghostButtonText, isGhostMode && styles.ghostButtonTextActive]}>
              {isGhostMode ? 'Visible' : 'Go Invisible'}
            </Text>
          </TouchableOpacity>
        )}
        {isTracking && isGhostMode && (
          <Text style={styles.ghostIndicator}>
            You're invisible to family
          </Text>
        )}
        <TouchableOpacity
          style={[styles.button, isTracking && styles.buttonActive]}
          onPress={handleToggleTracking}
        >
          <Text style={styles.buttonText}>
            {isTracking ? 'Stop Sharing' : 'Share Location'}
          </Text>
        </TouchableOpacity>
        {!permissions.background && (
          <Text style={styles.warning}>
            Background location not enabled - sharing stops when app is closed
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  marker: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#4A90A4',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  markerText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  controls: {
    position: 'absolute',
    bottom: 40,
    left: 20,
    right: 20,
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#4A90A4',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonActive: {
    backgroundColor: '#e74c3c',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  ghostButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  ghostButtonActive: {
    backgroundColor: '#6c757d',
    borderColor: '#6c757d',
  },
  ghostButtonText: {
    color: '#333',
    fontWeight: '600',
    fontSize: 13,
  },
  ghostButtonTextActive: {
    color: '#fff',
  },
  ghostIndicator: {
    color: '#6c757d',
    fontSize: 11,
    marginBottom: 8,
    fontStyle: 'italic',
  },
  warning: {
    marginTop: 8,
    color: '#e74c3c',
    fontSize: 12,
    textAlign: 'center',
  },
});

export default MapScreen;
