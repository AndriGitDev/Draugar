import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { MapView, Camera, UserLocation, MarkerView, UserTrackingMode } from '@maplibre/maplibre-react-native';

// OpenFreeMap - free OSM tiles, no API key needed
// Attribution is auto-handled by MapLibre when logoEnabled and attributionEnabled are true
const OPENFREEMAP_STYLE = 'https://tiles.openfreemap.org/styles/liberty/style.json';

// Note: No token needed for OpenFreeMap - it's free and open

interface FamilyMember {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  lastUpdated: Date;
}

interface MapScreenProps {
  familyMembers?: FamilyMember[];
}

export function MapScreen({ familyMembers = [] }: MapScreenProps): React.JSX.Element {
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

        {/* Family member markers - will be populated by Plan 04 */}
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
});

export default MapScreen;
