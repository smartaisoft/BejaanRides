import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import TripSummaryCard from '../../components/PassengerCommonCard/TripSummaryCard';
import LocationSearchModal from '../../components/PassengerCommonCard/LocationSearchModal';
import VehicleSelectionModal from '../../components/PassengerCommonCard/VehicleSelectionModal';
import DriverInfoModal from '../../components/PassengerCommonCard/DriverInfoModal';
import { RouteInfo } from '../../utils/getRouteInfo';

const defaultLat = 31.5497;
const defaultLng = 74.3436;

const HomeMapScreen: React.FC = () => {
  const [destinationDescription, setDestinationDescription] = useState<string | null>(null);
  const [destinationCoords, setDestinationCoords] = useState<{ latitude: number; longitude: number } | null>(null);

  const [showLocationModal, setShowLocationModal] = useState<boolean>(true);
  const [showVehicleModal, setShowVehicleModal] = useState<boolean>(false);
  const [showDriverModal, setShowDriverModal] = useState<boolean>(false);
  const [routeInfo, setRouteInfo] = useState<RouteInfo | null>(null);

  return (
    <View style={styles.container}>
      {/* Map */}
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: defaultLat,
          longitude: defaultLng,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
      >
        <Marker
          coordinate={{ latitude: defaultLat, longitude: defaultLng }}
          title="Your Location"
          pinColor="#9C27B0"
        >
          <View style={styles.markerCircle} />
        </Marker>

        {destinationCoords && (
          <Marker
            coordinate={destinationCoords}
            title="Destination"
            pinColor="#9C27B026"
          />
        )}
      </MapView>

      {/* Trip summary card */}
      {destinationDescription && (
        <TripSummaryCard
          pickup="My current location"
          dropoff={destinationDescription}
          distance={routeInfo?.distanceText}
          duration={routeInfo?.durationText}
          onCancel={() => {
            setDestinationDescription(null);
            setDestinationCoords(null);
            setRouteInfo(null);
            setShowLocationModal(true);
          }}
          onNext={() => setShowVehicleModal(true)}
        />
      )}

      {/* Location Search Modal */}
      <LocationSearchModal
        visible={showLocationModal}
        onClose={() => setShowLocationModal(false)}
        onSelect={(location) => {
          setDestinationDescription(location.description);
          setDestinationCoords({
            latitude: location.latitude,
            longitude: location.longitude,
          });
          setShowLocationModal(false);
        }}
      />

      {/* Vehicle Selection */}
      <VehicleSelectionModal
        visible={showVehicleModal}
        onRequest={() => {
          setShowVehicleModal(false);
          setShowDriverModal(true);
        }}
        onClose={() => setShowVehicleModal(false)}
      />

      {/* Driver Info */}
      <DriverInfoModal
        visible={showDriverModal}
        onClose={() => setShowDriverModal(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  markerCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    // backgroundColor: '#9C27B026',
  },
  whereToButton: {
    position: 'absolute',
    top: 40,
    left: 16,
    right: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 14,
    elevation: 3,
  },
  whereToText: {
    fontSize: 16,
    color: '#333',
  },
});

export default HomeMapScreen;
