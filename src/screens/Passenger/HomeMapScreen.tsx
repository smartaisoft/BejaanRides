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
import SearchingDriverOverlay from '../../components/PassengerCommonCard/ SearchingDriverOverlay';
import database from '@react-native-firebase/database';
import DriverArrivedCard from '../../components/PassengerCommonCard/DriverArrivedCard';
import {getVehicleInfoByDriverId} from '../../services/vehicleService';
import {useSelector} from 'react-redux';
import {RootState} from '../../redux/store';
import Icon from 'react-native-vector-icons/MaterialIcons';

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
  const [currentRideId, setCurrentRideId] = useState<string | null>(null);
  const unsubscribeListener = useRef<(() => void) | null>(null);
  const [driverInfo, setDriverInfo] = useState<any | null>(null);
  const [selectedVehicle, setSelectedVehicle] = useState<string>('Car');
  const [isSearchingDriver, setIsSearchingDriver] = useState(false);
  const [driverLiveCoords, setDriverLiveCoords] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [hasDriverArrived, setHasDriverArrived] = useState(false);
  const [isTripSummaryLoading, setIsTripSummaryLoading] = useState(false);

  const [mapRegion, setMapRegion] = useState<Region>({
    latitude: defaultLat,
    longitude: defaultLng,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });
  const [rideStatus, setRideStatus] = useState<
    'idle' | 'accepted' | 'arrived' | 'started'
  >('idle');

  const getVehicleMarkerIcon = (vehicleType: string) => {
    switch (vehicleType) {
      case 'Bike':
        return require('../../../assets/images/vehicles/bikeVehicle.png');
      case 'Car':
        return require('../../../assets/images/vehicles/carRoute.png');
      default:
        return require('../../../assets/images/vehicles/carRoute.png');
    }
  };

  // Initialize: permissions + user profile + location
  useEffect(() => {
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
    vehicleType: string,
  ): number => {
    const baseFare = 100;
    const perKm = 40;
    const perMin = 3;

    let vehicleMultiplier = 1;
    switch (vehicleType) {
      case 'Bike':
        vehicleMultiplier = 0.7;
        break;
      case 'Car':
        vehicleMultiplier = 1;
        break;
      case 'Luxury':
        vehicleMultiplier = 1.8;
        break;
      case 'ElectricCar':
        vehicleMultiplier = 1.3;
        break;
      case 'Limousine':
        vehicleMultiplier = 2.2;
        break;
      default:
        vehicleMultiplier = 1;
    }

    const distanceKm = distanceText
      ? parseFloat(distanceText.replace('km', '').trim())
      : 0;
    const durationMin = durationText
      ? parseInt(durationText.replace('min', '').trim(), 10)
      : 0;

    const fare =
      vehicleMultiplier *
      (baseFare + distanceKm * perKm + durationMin * perMin);

    return Math.round(fare);
  };

  const getCurrentLocation = () => {
    // First, try High Accuracy
    Geolocation.getCurrentPosition(
      async (position: GeolocationResponse) => {
        console.log('✅ Got High Accuracy Location');
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
        console.warn('⚠️ High Accuracy failed, falling back:', error);

        // Fall back to Low Accuracy
        Geolocation.getCurrentPosition(
          async (fallbackPosition: GeolocationResponse) => {
            console.log('✅ Got Low Accuracy Location');
            const {latitude, longitude} = fallbackPosition.coords;

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
          fallbackError => {
            console.error('❌ Both location methods failed:', fallbackError);
            setPickupDescription('Unknown Location');
          },
          {
            enableHighAccuracy: false,
            timeout: 10000,
            maximumAge: 10000,
          },
        );
      },
      {
        enableHighAccuracy: false,
        timeout: 15000,
        maximumAge: 0,
      },
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
      setIsSearchingDriver(true); // <-- Show the overlay

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
          selectedVehicle,
        ),
        distanceText: routeInfo?.distanceText ?? 'N/A',
        durationText: routeInfo?.durationText ?? 'N/A',
      });

      if (!rideId) {
        console.error('❌ Failed to create ride: rideId was null.');
        setIsSearchingDriver(false);
        return;
      }

      setCurrentRideId(rideId);
      unsubscribeListener.current = listenForRideUpdates(rideId, ride => {
        if (ride.status === 'accepted' && ride.driverId) {
          setRideStatus('accepted');
          setIsSearchingDriver(false);
          fetchDriverInfo(ride.driverId);

          const driverLocRef = database().ref(
            `rideRequests/${rideId}/driverLocation`,
          );
          driverLocRef.on('value', snap => {
            const loc = snap.val();
            if (loc) setDriverLiveCoords(loc);
          });
        }

        if (ride.status === 'arrived') {
          setRideStatus('arrived');
          setHasDriverArrived(true);
        }

        if (ride.status === 'started') {
          setRideStatus('started');
        }
      });
    } catch (error) {
      console.error('Error creating ride:', error);
      setIsSearchingDriver(false);
    }
  };

  const fetchDriverInfo = async (driverId: string) => {
    try {
      console.log(`🔍 Fetching driver profile for UID: ${driverId}`);
      console.log(`🔍 Fetching vehicle info for UID: ${driverId}`);

      const [profile, vehicle] = await Promise.all([
        getDriverByUid(driverId),
        getVehicleInfoByDriverId(driverId),
      ]);
      console.log('✅ Driver profile fetched:', profile);
      console.log('✅ Vehicle info fetched:', vehicle);

      if (profile) {
        const mergedInfo = {
          name: profile.name,
          phone: profile.phone,
          // avatarUrl: profile.avatarUrl,
          // rating: profile.rating,
          vehicleName: vehicle?.brand
            ? `${vehicle.brand} ${vehicle.model}`
            : 'N/A',
          vehicleColor: vehicle?.color ?? 'N/A',
          vehicleNumber: vehicle?.plateNumber ?? 'N/A',
          vehicleType: vehicle?.vehicleType ?? 'Car',
        };

        console.log(
          '✅ Merged driver+vehicle info to show in modal:',
          mergedInfo,
        );

        setDriverInfo(mergedInfo);
        setShowDriverModal(true);
      } else {
        console.warn('⚠️ No driver profile found.');
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
        >
        {pickupCoords && (
          <>
            {rideStatus === 'started' && driverInfo ? (
              // Show vehicle icon when ride started
              <Marker
                coordinate={pickupCoords}
                image={getVehicleMarkerIcon(driverInfo.vehicleType || 'Car')}
                title="Pickup"
              />
            ) : (
              <>
                {/* Circle */}
                <Circle
                  center={pickupCoords}
                  radius={200}
                  strokeColor="#19AF18"
                  fillColor="rgba(25,175,24,0.2)"
                />

                <Marker coordinate={pickupCoords} anchor={{x: 0.5, y: 0.5}}>
                  <View style={styles.markerWrapper}>
                    <View style={styles.outerCircle}>
                      <View style={styles.innerCircle}>
                        <Icon name="navigation" size={18} color="#fff" />
                      </View>
                    </View>
                  </View>
                </Marker>
              </>
            )}
          </>
        )}

        {destinationCoords && (
          <Marker
            coordinate={destinationCoords}
            title="Destination"
            pinColor="#F44336"
          />
        )}
        {driverLiveCoords && (
          <Marker
            coordinate={driverLiveCoords}
            title="Driver"
            pinColor="#4CAF50"
          />
        )}
        {driverLiveCoords && destinationCoords && (
          <MapViewDirections
            origin={driverLiveCoords}
            destination={destinationCoords}
            apikey={GOOGLE_MAPS_API_KEY}
            strokeWidth={4}
            strokeColor="#9C27B0"
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
          fare={calculateFare(
            routeInfo?.distanceText,
            routeInfo?.durationText,
            selectedVehicle,
          )}
          loading={isTripSummaryLoading} // 👈 HERE
          onCancel={() => {
            setDestinationDescription(null);
            setDestinationCoords(null);
            setRouteInfo(null);
            setShowTripSummary(false);
            setShowLocationModal(true);
          }}
          onNext={() => {
            setIsTripSummaryLoading(true);
            // Simulate async or prepare for VehicleSelectionModal
            setTimeout(() => {
              setShowTripSummary(false);
              setShowVehicleModal(true);
              setIsTripSummaryLoading(false);
            }, 500); // adjust delay if needed
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
        onSelectVehicle={vehicle => {
          setSelectedVehicle(vehicle.type);
        }}
        routeInfo={routeInfo}
      />
      {isSearchingDriver && (
        <SearchingDriverOverlay
          onCancel={() => {
            setIsSearchingDriver(false);
            if (unsubscribeListener.current) {
              unsubscribeListener.current();
              unsubscribeListener.current = null;
            }
            setCurrentRideId(null);
            Alert.alert(
              'Ride Cancelled',
              'You have cancelled the ride request.',
            );
          }}
        />
      )}
      {hasDriverArrived && driverInfo && (
        <DriverArrivedCard
          driver={{
            name: driverInfo.name,
            phone: driverInfo.phone,
            vehicleName: driverInfo.vehicleName,
            vehicleColor: driverInfo.vehicleColor,
            vehicleNumber: driverInfo.vehicleNumber,
            rating: driverInfo.rating,
            avatarUrl: driverInfo.avatarUrl,
          }}
          onClose={() => setHasDriverArrived(false)}
        />
      )}

      <DriverInfoModal
        visible={showDriverModal}
        onClose={() => setShowDriverModal(false)}
        driver={
          driverInfo && {
            name: driverInfo.name,
            phone: driverInfo.phone,
            // vehicleName: driverInfo.vehicleName,
            // vehicleColor: driverInfo.vehicleColor,
            // vehicleNumber: driverInfo.vehicleNumber,
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
  markerWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  outerCircle: {
    backgroundColor: '#19AF18',
    width: 40,
    height: 40,
    borderRadius: 20, // half of width/height
    borderWidth: 2,
    borderColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  innerCircle: {
    backgroundColor: '#19AF18',
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default HomeMapScreen;
