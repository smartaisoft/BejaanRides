// i am giving you my whole HomeMapScreenCode,
// please analyze it and read it carefully , its every feature and every function carefully,  becuase this code rely on 681 lines, and its very messy code, when you read it then i will give you a task to refactor this complete code with fully optimized way. and each line aligned like a pro "/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useState, useRef} from 'react';
import {
  View,
  StyleSheet,
  PermissionsAndroid,
  Platform,
  FlatList,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';
import Geolocation, {
  GeolocationResponse,
} from '@react-native-community/geolocation';
import MapView, {Circle, Marker, Region} from 'react-native-maps';
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
import database from '@react-native-firebase/database';
import DriverArrivedCard from '../../components/PassengerCommonCard/DriverArrivedCard';
import {getVehicleInfoByDriverId} from '../../services/vehicleService';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Colors from '../../themes/colors';
import DriverOfferCard from '../../components/PassengerCommonCard/DriverOfferCard';
import SearchingDriverOverlay from '../../components/PassengerCommonCard/SearchingDriverOverlay';
// import {AppDispatch} from '../../redux/store';

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
  const [availableDrivers, setAvailableDrivers] = useState<any[]>([]);
  const [incomingOffers, setIncomingOffers] = useState<any[]>([]);

  const [routeInfoToPickup, setRouteInfoToPickup] = useState<RouteInfo | null>(
    null,
  );

  const [mapRegion, setMapRegion] = useState<Region>({
    latitude: defaultLat,
    longitude: defaultLng,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });
  const [currentLocation, setCurrentLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

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
  useEffect(() => {
    const ref = database().ref('driversOnline');
    const listener = ref.on('value', snapshot => {
      const data = snapshot.val() || {};
      const driversArray = Object.keys(data).map(id => ({
        id,
        ...data[id],
      }));

      console.log('🟢 All Online Drivers:', driversArray);
      console.log('📌 Current selectedVehicle:', selectedVehicle);

      const filtered = driversArray.filter(
        d => d.vehicleType?.toLowerCase() === selectedVehicle.toLowerCase(),
      );
      console.log(
        `🚗 Online Drivers Matching Selected Vehicle (${selectedVehicle}):`,
        filtered,
      );

      setAvailableDrivers(filtered); // ✅ FIX: only set filtered list
    });

    return () => ref.off('value', listener);
  }, [selectedVehicle]);
  useEffect(() => {
    if (!currentRideId) return;

    const offersRef = database().ref(`rideRequests/${currentRideId}/offers`);
    const handleOffers = (snapshot: {val: () => any}) => {
      const data = snapshot.val();
      if (data) {
        const offers = Object.keys(data).map(driverId => ({
          driverId,
          ...data[driverId],
        }));
        setIncomingOffers(offers);
        // dispatch(setIncomingOffers(offers));
        console.log('📥 Incoming Offers:', offers);
      } else {
        setIncomingOffers([]);
      }
    };

    offersRef.on('value', handleOffers);
    return () => offersRef.off('value', handleOffers);
  }, [currentRideId]);

  // useEffect(() => {
  //   if (!currentRideId) return;

  //   const ref = database().ref(`rideRequests/${currentRideId}/offers`);
  //   const listener = ref.on('value', snapshot => {
  //     const data = snapshot.val() || {};
  //     const offers = Object.keys(data).map(id => ({
  //       driverId: id,
  //       ...data[id],
  //     }));
  //     dispatch(setIncomingOffers(offers));
  //   });

  //   return () => ref.off('value', listener);
  // }, [currentRideId, dispatch]); // ✅ Add dispatch here

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

        setCurrentLocation({latitude, longitude}); // <--- NEW
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
            setCurrentLocation({latitude, longitude}); // <--- NEW

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

  const handleAcceptDriver = async (driverId: string) => {
    await database().ref(`rideRequests/${currentRideId}`).update({
      status: 'accepted',
      driverId,
    });

    // Optionally remove other offers
    await database().ref(`rideRequests/${currentRideId}/offers`).remove();

    // Navigate to trip screen or modal
  };


  const handleRejectDriver = (driverId: string) => {
    setIncomingOffers(prev =>
      prev.filter(offer => offer.driverId !== driverId),
    );
  };

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={mapRegion}
        onRegionChangeComplete={async newRegion => {
          setMapRegion(newRegion);

          // ✅ Only update pickupCoords if no destination is selected
          if (!destinationCoords) {
            setPickupCoords({
              latitude: newRegion.latitude,
              longitude: newRegion.longitude,
            });

            // Fetch address and update pickupDescription
            const address = await reverseGeocode(
              newRegion.latitude,
              newRegion.longitude,
            );
            setPickupDescription(address);
          }
        }}>
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
        {driverLiveCoords && driverInfo && (
          <Marker
            coordinate={driverLiveCoords}
            title="Driver"
            image={getVehicleMarkerIcon(driverInfo.vehicleType || 'Car')}
          />
        )}

        {driverLiveCoords && pickupCoords && rideStatus === 'accepted' && (
          <MapViewDirections
            origin={driverLiveCoords}
            destination={pickupCoords}
            apikey={GOOGLE_MAPS_API_KEY}
            strokeWidth={4}
            strokeColor="#4CAF50"
            onReady={result => {
              // You can store this ETA in state for your modal:
              setRouteInfoToPickup({
                distanceText: `${result.distance.toFixed(1)} km`,
                durationText: `${Math.ceil(result.duration)} min`,
              });
            }}
            onError={err =>
              console.error('Directions error (driver to pickup):', err)
            }
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
      {availableDrivers
        .filter(
          d => d.vehicleType?.toLowerCase() === selectedVehicle.toLowerCase(),
        )
        .map(driver => (
          <Marker
            key={driver.id}
            coordinate={{
              latitude: driver.latitude,
              longitude: driver.longitude,
            }}
            title={driver.name}
            description={`Vehicle: ${driver.vehicleType}`}
            image={getVehicleMarkerIcon(driver.vehicleType)}
          />
        ))}

      {currentLocation && !destinationCoords && (
        <TouchableOpacity
          style={styles.locateButton}
          onPress={() => {
            setPickupCoords(currentLocation);
            mapRef.current?.animateToRegion({
              latitude: currentLocation.latitude,
              longitude: currentLocation.longitude,
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
        onClose={() => {
          // Reset everything when cancelling vehicle selection
          setDestinationCoords(null);
          setDestinationDescription(null);
          setRouteInfo(null);
          setShowVehicleModal(false);
          setShowLocationModal(true);

          // Animate back to current location if available
          if (currentLocation) {
            mapRef.current?.animateToRegion({
              latitude: currentLocation.latitude,
              longitude: currentLocation.longitude,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            });
            // Optionally update pickup marker and description
            setPickupCoords(currentLocation);
            reverseGeocode(
              currentLocation.latitude,
              currentLocation.longitude,
            ).then(address => setPickupDescription(address));
          }
        }}
        onSelectVehicle={vehicle => {
          setSelectedVehicle(vehicle.type.toLowerCase()); // 👈 Normalize to lowercase
        }}
        routeInfo={routeInfo}
      />
      {incomingOffers.length > 0 && (
        <ScrollView
          style={styles.offerOverlay}
          contentContainerStyle={styles.scrollContent}>
          {incomingOffers.map(offer => (
            <DriverOfferCard
              key={offer.driverId}
              driver={{
                name: offer.driverName,
                rating: 4.8,
                totalRides: 200,
                vehicleName: offer.vehicleType,
                fare: offer.fare,
                eta: offer.eta,
                distance: offer.distance,
              }}
              onAccept={() => handleAcceptDriver(offer.driverId)}
              onReject={() => handleRejectDriver(offer.driverId)}
            />
          ))}
        </ScrollView>
      )}

      {isSearchingDriver && incomingOffers.length <= 0 && (
        <SearchingDriverOverlay
          onCancel={() => {
            setIsSearchingDriver(false);

            // Stop any ride updates
            if (unsubscribeListener.current) {
              unsubscribeListener.current();
              unsubscribeListener.current = null;
            }

            setCurrentRideId(null);

            // Reset locations and route
            setDestinationCoords(null);
            setDestinationDescription(null);
            setRouteInfo(null);

            // Show location search modal again
            setShowLocationModal(true);

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
            vehicleName: driverInfo.vehicleName,
            vehicleColor: driverInfo.vehicleColor,
            vehicleNumber: driverInfo.vehicleNumber,
            rating: driverInfo.rating,
            avatarUrl: driverInfo.avatarUrl,
          }
        }
        etaToPickup={routeInfoToPickup?.durationText}
        distance={routeInfoToPickup?.distanceText}
        duration={routeInfoToPickup?.durationText}
        fare={calculateFare(
          routeInfoToPickup?.distanceText,
          routeInfoToPickup?.durationText,
          driverInfo?.vehicleType || 'Car',
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  offerOverlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    // backgroundColor: 'rgba(255,255,255,0.96)', // or '#fff'
    zIndex: 999,
    paddingTop: 40,
    paddingHorizontal: 12,
  },

  scrollContent: {
    paddingBottom: 100,
  },

  container: {flex: 1},
  map: {flex: 1},
  locateButton: {position: 'absolute', top: 40, right: 10},
  locateIcon: {width: 24, height: 24, tintColor: Colors.primary},
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
