import React from 'react';
import { StyleSheet } from 'react-native';
import MapView, {
  Marker,
  Circle,
  Region,
  PROVIDER_GOOGLE,
  Polyline,
} from 'react-native-maps';
import { Coordinate } from '../utils/types';

type Props = {
  region: Region | null;
  pickupCoords: Coordinate | null;
  dropoffCoords: Coordinate | null;
  onMapPress: (event: any) => void;
  mapRef: React.MutableRefObject<MapView | null>;
};

const isValidCoordinate = (coord: Coordinate | null) =>
  coord &&
  typeof coord.latitude === 'number' &&
  typeof coord.longitude === 'number';

const MapTracker: React.FC<Props> = ({
  region,
  pickupCoords,
  dropoffCoords,
  onMapPress,
  mapRef,
}) => {
  if (
    !region ||
    typeof region.latitude !== 'number' ||
    typeof region.longitude !== 'number'
  ) {
    return null; // Do not render map if region is invalid
  }

  return (
    <MapView
      ref={mapRef}
      provider={PROVIDER_GOOGLE}
      style={StyleSheet.absoluteFill}
      initialRegion={region}
      onPress={onMapPress}
      showsUserLocation
    >
      {isValidCoordinate(pickupCoords) && (
        <Marker coordinate={pickupCoords!} title="Pickup" />
      )}

      {isValidCoordinate(dropoffCoords) && (
        <Marker coordinate={dropoffCoords!} title="Drop-off" />
      )}

      {isValidCoordinate(pickupCoords) &&
        isValidCoordinate(dropoffCoords) && (
          <Polyline
            coordinates={[pickupCoords!, dropoffCoords!]}
            strokeColor="#9b2fc2"
            strokeWidth={4}
          />
        )}

      <Circle
        center={region}
        radius={300}
        fillColor="rgba(139,0,255,0.1)"
        strokeColor="transparent"
      />
    </MapView>
  );
};

export default MapTracker;
