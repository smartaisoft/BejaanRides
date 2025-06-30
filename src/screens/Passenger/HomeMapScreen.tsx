import React, {useEffect, useState, useRef, useCallback} from 'react';
import {
  View,
  StyleSheet,
  PermissionsAndroid,
  Platform,
  TouchableOpacity,
  Alert,
} from 'react-native';
import Geolocation, {
  GeolocationResponse,
} from '@react-native-community/geolocation';
import MapView, {
  Circle,
  Marker,
  Region,
  MapPressEvent,
} from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import TripSummaryCard from '../../components/PassengerCommonCard/TripSummaryCard';
import LocationSearchModal from '../../components/PassengerCommonCard/LocationSearchModal';
import VehicleSelectionModal from '../../components/PassengerCommonCard/VehicleSelectionModal';
import DriverInfoModal from '../../components/PassengerCommonCard/DriverInfoModal';
import {RouteInfo} from '../../utils/getRouteInfo';
import Locate from '../../../assets/SVG/Locate';
import {
  createRideRequest,
  listenForRideUpdates,
} from '../../services/RideService';
import auth from '@react-native-firebase/auth';
import {
  getDriverByUid,
  getUserByUid,
  UserData,
} from '../../services/realTimeUserService';

const defaultLat = 31.5497;
const defaultLng = 74.3436;
const GOOGLE_MAPS_API_KEY = 'AIzaSyCb2ys2AD6NTFhnEGXNsDrjSXde6d569vU';

const HomeMapScreen: React.FC = () => {
  const mapRef = useRef<MapView>(null);

  const [pickupDescription, setPickupDescription] = useState(
    'Fetching current location...',
  );
  const [pickupCoords, setPickupCoords] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [destinationDescription, setDestinationDescription] = useState<
    string | null
  >(null);
  const [destinationCoords, setDestinationCoords] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [showTripSummary, setShowTripSummary] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(true);
  const [showVehicleModal, setShowVehicleModal] = useState(false);
  const [showDriverModal, setShowDriverModal] = useState(false);
  const [routeInfo, setRouteInfo] = useState<RouteInfo | null>(null);
  const [currentUser, setCurrentUser] = useState<UserData | null>(null);
  const [selectedVehicle] = useState<string>('car');
  const [currentRideId, setCurrentRideId] = useState<string | null>(null);
  const unsubscribeListener = useRef<(() => void) | null>(null);
  const [driverInfo, setDriverInfo] = useState<any | null>(null);

  const [mapRegion, setMapRegion] = useState<Region>({
    latitude: defaultLat,
    longitude: defaultLng,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });

  // Initialize: permissions + user profile + location
  useEffect(() => {
    console.log('currentRideId', currentRideId);
    const init = async () => {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Permission',
            message: 'This app needs access to your location.',
            buttonPositive: 'OK',
          },
        );
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          Alert.alert(
            'Permission Denied',
            'Location permission is required to use this feature.',
          );
          setPickupDescription('Unknown Location');
          return;
        }
      }

      const authUser = auth().currentUser;
      if (authUser) {
        const profile = await getUserByUid(authUser.uid);
        if (profile) {
          setCurrentUser(profile);
        } else {
          console.warn('No Firestore user found.');
        }
      }

      getCurrentLocation();
    };

    init();

    return () => {
      if (unsubscribeListener.current) {
        unsubscribeListener.current();
      }
    };
  }, []);

  const calculateFare = (
    distanceText: string | undefined,
    durationText: string | undefined,
  ): number => {
    const baseFare = 150;
    const perKm = 50;
    const perMin = 5;

    // Parse distance "4.5 km"
    const distanceKm = distanceText
      ? parseFloat(distanceText.replace('km', '').trim())
      : 0;

    // Parse duration "12 min"
    const durationMin = durationText
      ? parseInt(durationText.replace('min', '').trim(), 10)
      : 0;

    const fare = baseFare + distanceKm * perKm + durationMin * perMin;

    return Math.round(fare);
  };

  const getCurrentLocation = () => {
    Geolocation.getCurrentPosition(
      async (position: GeolocationResponse) => {
        const {latitude, longitude} = position.coords;
        setPickupCoords({latitude, longitude});
        setMapRegion({
          latitude,
          longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        });

        const address = await reverseGeocode(latitude, longitude);
        setPickupDescription(address);
      },
      error => {
        console.error('Error getting location:', error);
        setPickupDescription('Current Location');
      },
      {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
    );
  };

  const reverseGeocode = async (lat: number, lng: number) => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${GOOGLE_MAPS_API_KEY}`,
      );
      const json = await response.json();
      return json.results?.[0]?.formatted_address ?? 'Unknown Location';
    } catch (error) {
      console.error('Reverse geocoding failed:', error);
      return 'Unknown Location';
    }
  };

  const handleMapPress = useCallback(async (event: MapPressEvent) => {
    const {latitude, longitude} = event.nativeEvent.coordinate;
    const address = await reverseGeocode(latitude, longitude);
    setDestinationCoords({latitude, longitude});
    setDestinationDescription(address);
    setShowLocationModal(false);
    setShowTripSummary(true);
  }, []);

  const handleRequestRide = async () => {
    if (
      !pickupCoords ||
      !destinationCoords ||
      !currentUser ||
      !destinationDescription
    ) {
      Alert.alert('Error', 'Missing data to create ride request.');
      return;
    }

    try {
      const rideId = await createRideRequest({
        passengerId: currentUser.uid,
        passengerName: currentUser.name ?? 'Passenger',
        passengerPhone: currentUser.phone ?? 'N/A',
        pickup: {
          latitude: pickupCoords.latitude,
          longitude: pickupCoords.longitude,
          address: pickupDescription,
        },
        dropoff: {
          latitude: destinationCoords.latitude,
          longitude: destinationCoords.longitude,
          address: destinationDescription,
        },
        vehicleType: selectedVehicle,
        fareEstimate: calculateFare(
          routeInfo?.distanceText,
          routeInfo?.durationText,
        ),
        distanceText: routeInfo?.distanceText ?? 'N/A',
        durationText: routeInfo?.durationText ?? 'N/A',
      });

      if (!rideId) {
        console.error('❌ Failed to create ride: rideId was null.');
        return;
      }

      setCurrentRideId(rideId);
      const unsubscribe = listenForRideUpdates(rideId, ride => {
        if (ride.status === 'accepted' && ride.driverId) {
          fetchDriverInfo(ride.driverId);
        }
      });

      unsubscribeListener.current = unsubscribe;
    } catch (error) {
      console.error('Error creating ride:', error);
    }
  };
  const fetchDriverInfo = async (driverId: string) => {
    try {
      const info = await getDriverByUid(driverId);
      if (info) {
        setDriverInfo(info);
        setShowDriverModal(true);
      }
    } catch (error) {
      console.error('Error fetching driver info:', error);
    }
  };

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        region={mapRegion}
        onPress={handleMapPress}>
        {pickupCoords && (
          <>
            <Marker
              coordinate={pickupCoords}
              title="You are here"
              pinColor="#9b2fc2"
            />
            <Circle
              center={pickupCoords}
              radius={100}
              strokeColor="#9b2fc2"
              fillColor="rgba(155,47,194,0.2)"
            />
          </>
        )}
        {destinationCoords && (
          <Marker
            coordinate={destinationCoords}
            title="Destination"
            pinColor="#F44336"
          />
        )}
        {pickupCoords && destinationCoords && (
          <MapViewDirections
            origin={pickupCoords}
            destination={destinationCoords}
            apikey={GOOGLE_MAPS_API_KEY}
            strokeWidth={4}
            strokeColor="#9C27B0"
            onReady={result => {
              setRouteInfo({
                distanceText: `${result.distance.toFixed(1)} km`,
                durationText: `${Math.ceil(result.duration)} min`,
              });
            }}
            onError={err => console.error('Directions error:', err)}
          />
        )}
      </MapView>

      {pickupCoords && (
        <TouchableOpacity
          style={styles.locateButton}
          onPress={() => {
            setShowLocationModal(true);
            mapRef.current?.animateToRegion({
              latitude: pickupCoords.latitude,
              longitude: pickupCoords.longitude,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            });
          }}>
          <Locate style={styles.locateIcon} />
        </TouchableOpacity>
      )}

      {showTripSummary && destinationDescription && (
        <TripSummaryCard
          pickup={pickupDescription}
          dropoff={destinationDescription}
          distance={routeInfo?.distanceText}
          duration={routeInfo?.durationText}
          fare={calculateFare(routeInfo?.distanceText, routeInfo?.durationText)}
          onCancel={() => {
            setDestinationDescription(null);
            setDestinationCoords(null);
            setRouteInfo(null);
            setShowTripSummary(false);
            setShowLocationModal(true);
          }}
          onNext={() => {
            setShowTripSummary(false);
            setShowVehicleModal(true);
          }}
        />
      )}

      <LocationSearchModal
        visible={showLocationModal}
        onClose={() => setShowLocationModal(false)}
        onSelect={location => {
          setDestinationDescription(location.description);
          setDestinationCoords({
            latitude: location.latitude,
            longitude: location.longitude,
          });
          setShowLocationModal(false);
          setShowTripSummary(true);
        }}
      />

      <VehicleSelectionModal
        visible={showVehicleModal}
        onRequest={() => {
          setShowVehicleModal(false);
          handleRequestRide();
        }}
        onClose={() => setShowVehicleModal(false)}
      />

      <DriverInfoModal
        visible={showDriverModal}
        onClose={() => setShowDriverModal(false)}
        driver={
          driverInfo && {
            name: driverInfo.name,
            phone: driverInfo.phone,
            vehicleName: driverInfo.vehicleName,
            vehicleColor: driverInfo.vehicleColor,
            vehicleNumber: driverInfo.vehicleNumber,
            rating: driverInfo.rating,
            avatarUrl: driverInfo.avatarUrl,
          }
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1},
  map: {flex: 1},
  locateButton: {position: 'absolute', top: 40, right: 10},
  locateIcon: {width: 24, height: 24, tintColor: '#9b2fc2'},
});

export default HomeMapScreen;
