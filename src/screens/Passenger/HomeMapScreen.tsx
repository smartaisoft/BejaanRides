/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState, useRef, useCallback} from 'react';
import {
  View,
  StyleSheet,
  PermissionsAndroid,
  Platform,
  TouchableOpacity,
  Alert,
  ScrollView,
  Text,
  Image,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import MapView, {Circle, Marker} from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import TripSummaryCard from '../../components/PassengerCommonCard/TripSummaryCard';
import LocationSearchModal from '../../components/PassengerCommonCard/LocationSearchModal';
import DriverInfoModal from '../../components/PassengerCommonCard/DriverInfoModal';
import {RouteInfo} from '../../utils/getRouteInfo';
import Locate from '../../../assets/SVG/Locate';
import {
  createRideRequest,
  listenForRideUpdates,
} from '../../services/RideService';
import {getDriverByUid} from '../../services/realTimeUserService';
import database from '@react-native-firebase/database';
import DriverArrivedCard from '../../components/PassengerCommonCard/DriverArrivedCard';
import {getVehicleInfoByDriverId} from '../../services/vehicleService';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Colors from '../../themes/colors';
import DriverOfferCard from '../../components/PassengerCommonCard/DriverOfferCard';
import SearchingDriverOverlay from '../../components/PassengerCommonCard/SearchingDriverOverlay';
import BookingSuccessModal from '../../components/PassengerCommonCard/BookingSuccessModal';
const GOOGLE_MAPS_API_KEY = 'AIzaSyCb2ys2AD6NTFhnEGXNsDrjSXde6d569vU';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '../../redux/store';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import {
  setAdditionalStops,
  setDriverInfo,
  setDriverInfoModal,
  setDriverLiveCoords,
  setDropoffLocation,
  setFare,
  setPickupLocation,
  setCurrentLocation,
  setRegion,
  setRideId,
  setSelectedOffer,
  setShowSearchModal,
  setShowSummary,
  setSummary,
  setRouteInfo,
  setSelectedVehicle,
  setSelectedVehicleOption,
} from '../../redux/actions/rideActions';
import {calculateFare} from '../../utils/calculateFare';
import Geolocation from '@react-native-community/geolocation';
import VehicleSelectionModal from '../../components/PassengerCommonCard/VehicleSelectionModal';

// type IncomingOffer = {
//   driverId: string;
//   driverName: string;
//   fare: number;
//   eta: string;
//   distance: string;
//   vehicleType: string;
// };

const HomeMapScreen: React.FC = () => {
  const mapRef = useRef<MapView>(null);
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const [mapKey, setMapKey] = useState(0);
  const [showVehicleModal, setShowVehicleModal] = useState(false);
  const unsubscribeListener = useRef<(() => void) | null>(null);
  const [isSearchingDriver, setIsSearchingDriver] = useState(false);
  const [hasDriverArrived, setHasDriverArrived] = useState(false);
  const [isTripSummaryLoading, setIsTripSummaryLoading] = useState(false);
  const [availableDrivers, setAvailableDrivers] = useState<any[]>([]);
  const [incomingOffers, setIncomingOffers] = useState<any[]>([]);
  const [showBookingSuccess, setShowBookingSuccess] = useState(false);
  const [routeInfoToPickup, setRouteInfoToPickup] = useState<RouteInfo | null>(
    null,
  );

  const [rideStatus, setRideStatus] = useState<
    'idle' | 'accepted' | 'arrived' | 'started'
  >('idle');

  const {
    region,
    pickupLocation,
    selectedOffer,
    driverInfo,
    currentRideId,
    summary,
    showSummary,
    dropoffLocation,
    showSearchModal,
    showDriverInfoModal,
    driverLiveCoords,
    additionalStops,
    routeInfo,
    selectedVehicle,
  } = useSelector((state: RootState) => state.ride);

  //Current User
  const currentUser = useSelector((state: RootState) => state.auth.user);

  const currentLocation = useSelector(
    (state: any) => state.ride.currentLocation,
  );

  //Selected Vehicle option fetch
  const selectedVehicleOption = useSelector(
    (state: RootState) => state.ride.selectedVehicleOption,
  );

  const dispatch = useDispatch<AppDispatch>();

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

  const getCurrentLocation = useCallback(async () => {
    console.log('📡 getCurrentLocation called...');
    Geolocation.getCurrentPosition(
      position => {
        const {latitude, longitude} = position.coords;
        const regionData = {
          latitude,
          longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        };
        console.log('✅ Got location from Geolocation:', regionData);

        dispatch(setRegion(regionData));
        dispatch(setPickupLocation({latitude, longitude}));
        dispatch(setCurrentLocation({latitude, longitude}));
      },
      error => {
        console.warn('❌ getCurrentPosition Error:', error.message);

        const fallback = {
          latitude: 33.6844,
          longitude: 73.0479,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        };
        console.log('📍 Using fallback region:', fallback);

        dispatch(setRegion(fallback));
        dispatch(
          setPickupLocation({
            latitude: fallback.latitude,
            longitude: fallback.longitude,
          }),
        );
        dispatch(
          setCurrentLocation({
            latitude: fallback.latitude,
            longitude: fallback.longitude,
          }),
        );
      },
      {enableHighAccuracy: false, timeout: 10000, maximumAge: 10000},
    );
  }, [dispatch]); // 👈 dependency array is correct

  // ✅ Move useEffect **after** getCurrentLocation
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
          dispatch(setSummary({pickup: 'Unknown Location'}));
          return;
        }

        console.log('✅ Location permission granted');
      }

      console.log('👤 Redux user:', currentUser);

      if (!showSummary && !selectedOffer?.driverId) {
        dispatch(setShowSearchModal(true));
      } else {
        dispatch(setShowSearchModal(false));
      }

      getCurrentLocation(); // 👈 now it's safe to call
    };

    init();

    return () => {
      if (unsubscribeListener.current) {
        unsubscribeListener.current();
      }
    };
  }, [
    currentUser,
    dispatch,
    getCurrentLocation,
    selectedOffer?.driverId,
    showSummary,
  ]);

  useEffect(() => {
    const ref = database().ref('driversOnline');
    const listener = ref.on('value', snapshot => {
      const data = snapshot.val() || {};
      const driversArray = Object.keys(data).map(id => ({
        id,
        ...data[id],
      }));

      const filtered = driversArray.filter(
        d => d.vehicleType?.toLowerCase() === selectedVehicle.toLowerCase(),
      );
      setAvailableDrivers(filtered);
    });

    return () => ref.off('value', listener);
  }, [selectedVehicle]);

  useEffect(() => {
    const fetchMultiLegRouteAndFare = async () => {
      try {
        if (!pickupLocation || !dropoffLocation) {
          return;
        }

        const origin = `${pickupLocation.latitude},${pickupLocation.longitude}`;
        const destination = `${dropoffLocation.latitude},${dropoffLocation.longitude}`;

        const waypointsStr = additionalStops
          .filter(
            (stop: {latitude: any; longitude: any}) =>
              stop.latitude && stop.longitude,
          )
          .map(
            (stop: {latitude: any; longitude: any}) =>
              `${stop.latitude},${stop.longitude}`,
          )
          .join('|');

        const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${origin}&destination=${destination}&key=${GOOGLE_MAPS_API_KEY}${
          waypointsStr ? `&waypoints=${waypointsStr}` : ''
        }`;

        const response = await fetch(url);
        const data = await response.json();

        if (!data.routes || data.routes.length === 0) {
          console.warn('❌ No routes found in response');
          return;
        }

        const route = data.routes[0];
        const legs = route.legs;

        let totalDistanceMeters = 0;
        let totalDurationSeconds = 0;

        for (const leg of legs) {
          totalDistanceMeters += leg.distance.value;
          totalDurationSeconds += leg.duration.value;
        }

        const distanceKm = (totalDistanceMeters / 1000).toFixed(1) + ' km';
        const durationMin = Math.ceil(totalDurationSeconds / 60) + ' min';

        const fare = calculateFare(distanceKm, durationMin, selectedVehicle);

        dispatch(
          setRouteInfo({distanceText: distanceKm, durationText: durationMin}),
        );
        console.log('💰 Fare calculation inputs:', {
          distanceKm,
          durationMin,
          selectedVehicle,
        });
        console.log('💰 Calculated fare:', fare);

        dispatch(setFare(fare));
      } catch (error) {
        console.error('🔥 Multi-leg routing error:', error);
      }
    };

    fetchMultiLegRouteAndFare();
  }, [
    pickupLocation,
    dropoffLocation,
    additionalStops,
    selectedVehicle,
    dispatch,
  ]);

  useEffect(() => {
    if (!currentRideId) {
      return;
    }

    const offersRef = database().ref(`rideRequests/${currentRideId}/offers`);
    const handleOffers = (snapshot: {val: () => any}) => {
      const data = snapshot.val();
      if (data) {
        const offers = Object.keys(data).map(driverId => ({
          driverId,
          ...data[driverId],
        }));
        setIncomingOffers(offers);
      } else {
        setIncomingOffers([]);
      }
    };

    offersRef.on('value', handleOffers);
    return () => offersRef.off('value', handleOffers);
  }, [currentRideId]);

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
      !pickupLocation ||
      !dropoffLocation ||
      !currentUser ||
      !summary?.destination ||
      !selectedVehicleOption
    ) {
      console.log(
        'missing data',
        pickupLocation,
        dropoffLocation,
        currentUser,
        summary?.destination,
        selectedVehicleOption,
      );
      Alert.alert('Error', 'Missing data to create ride request.');
      return;
    }

    try {
      setIsSearchingDriver(true);
      const fareEstimate = parseInt(
        selectedVehicleOption.price.replace('RS:', ''),
        10, // ✅ Explicitly specify base-10
      );

      const vehicleType = selectedVehicleOption.type.toLowerCase();
      const rideId = await createRideRequest({
        passengerId: currentUser.uid,
        passengerName: currentUser.name ?? 'Passenger',
        passengerPhone: currentUser.phone ?? 'N/A',
        pickup: {
          latitude: pickupLocation.latitude,
          longitude: pickupLocation.longitude,
          address: summary?.pickup,
        },
        dropoff: {
          latitude: dropoffLocation.latitude,
          longitude: dropoffLocation.longitude,
          address: summary?.destination,
        },
        vehicleType,
        fareEstimate,
        distanceText: routeInfo?.distanceText ?? 'N/A',
        durationText: routeInfo?.durationText ?? 'N/A',
      });
      if (!rideId) {
        console.error('❌ Failed to create ride: rideId was null.');
        setIsSearchingDriver(false);
        return;
      }

      dispatch(setRideId(rideId));
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
            if (loc) {
              dispatch(setDriverLiveCoords(loc));
            }
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
      const [profile, vehicle] = await Promise.all([
        getDriverByUid(driverId),
        getVehicleInfoByDriverId(driverId),
      ]);

      if (profile) {
        const mergedInfo = {
          name: profile.name,
          phone: profile.phone,
          vehicleName: vehicle?.brand
            ? `${vehicle.brand} ${vehicle.model}`
            : 'N/A',
          vehicleColor: vehicle?.color ?? 'N/A',
          vehicleNumber: vehicle?.plateNumber ?? 'N/A',
          vehicleType: vehicle?.vehicleType ?? 'Car',
        };
        dispatch(setDriverInfo(mergedInfo));
        dispatch(setDriverInfoModal(true));
      } else {
        console.warn('⚠️ No driver profile found.');
      }
    } catch (error) {
      console.error('Error fetching driver info:', error);
    }
  };

  const handleAcceptDriver = async (driverId: string) => {
    const offer = incomingOffers.find(o => o.driverId === driverId);
    if (!offer) return;
    dispatch(setSelectedOffer(offer)); // Save for modal
    dispatch(setDriverInfoModal(true));

    // 1. Mark ride as accepted
    await database().ref(`rideRequests/${currentRideId}`).update({
      status: 'accepted',
      driverId,
    });

    // 2. Notify selected driver
    await database().ref(`driverAcceptedOffers/${driverId}`).set({
      rideId: currentRideId,
      status: 'accepted',
    });

    // 3. Optional: clean up offers so others can't accept
    await database().ref(`rideRequests/${currentRideId}/offers`).remove();
    setTimeout(() => {
      setShowBookingSuccess(true);
    }, 1000);
  };

  const handleRejectDriver = (driverId: string) => {
    setIncomingOffers(prev =>
      prev.filter(offer => offer.driverId !== driverId),
    );
  };

  useFocusEffect(
    useCallback(() => {
      setMapKey(prev => prev + 1);
    }, []),
  );
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <TouchableOpacity
          style={[styles.avatarButton, {top: insets.top + 10}]}
          onPress={() => navigation.navigate('Profile')}
          accessibilityLabel="Open Settings">
          <Image
            source={require('../../../assets/images/Avatar.png')}
            style={styles.avatar}
          />
        </TouchableOpacity>
        {region?.latitude ? (
          <MapView
            ref={mapRef}
            key={mapKey}
            style={styles.map}
            initialRegion={region}
            onRegionChangeComplete={async newRegion => {
              dispatch(setRegion(newRegion));

              if (!dropoffLocation) {
                dispatch(
                  setPickupLocation({
                    latitude: newRegion.latitude,
                    longitude: newRegion.longitude,
                  }),
                );
                const address = await reverseGeocode(
                  newRegion.latitude,
                  newRegion.longitude,
                );
                dispatch(setSummary({pickup: address}));
              }
            }}>
            {pickupLocation && (
              <>
                {rideStatus === 'started' && driverInfo ? (
                  <Marker
                    coordinate={pickupLocation}
                    image={getVehicleMarkerIcon(
                      driverInfo.vehicleType || 'Car',
                    )}
                    title="Pickup"
                  />
                ) : (
                  <>
                    <Circle
                      center={pickupLocation}
                      radius={200}
                      strokeColor="#19AF18"
                      fillColor="rgba(25,175,24,0.2)"
                    />

                    <Marker
                      coordinate={pickupLocation}
                      anchor={{x: 0.5, y: 0.5}}>
                      <View style={styles.markerWrapper}>
                        <View style={styles.outerCircle}>
                          <View style={styles.innerCircle}>
                            <Icon name="navigation" size={24} color="#fff" />
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

            {driverLiveCoords &&
              pickupLocation &&
              rideStatus === 'accepted' && (
                <MapViewDirections
                  origin={driverLiveCoords}
                  destination={pickupLocation}
                  apikey={GOOGLE_MAPS_API_KEY}
                  strokeWidth={4}
                  strokeColor="#4CAF50"
                  onReady={result => {
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

            {pickupLocation && dropoffLocation && (
              <MapViewDirections
                origin={pickupLocation}
                destination={dropoffLocation}
                waypoints={additionalStops
                  .filter(
                    (stop: {latitude: number; longitude: number}) =>
                      stop.latitude !== 0 && stop.longitude !== 0,
                  )
                  .map((stop: {latitude: any; longitude: any}) => ({
                    latitude: stop.latitude,
                    longitude: stop.longitude,
                  }))}
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
        ) : (
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              padding: 20,
            }}>
            <ActivityIndicator size="large" color={Colors.primary} />
            <Text
              style={{
                marginTop: 15,
                fontSize: 18,
                fontWeight: '600',
                color: '#555',
                textAlign: 'center',
              }}>
              📍 Finding your location…
            </Text>
            <Text
              style={{
                marginTop: 8,
                fontSize: 14,
                color: '#888',
                textAlign: 'center',
              }}>
              Please ensure GPS is turned on and you have a stable internet
              connection.
            </Text>
          </View>
        )}

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

        {currentLocation && !dropoffLocation && (
          <TouchableOpacity
            style={styles.locateButton}
            onPress={() => {
              dispatch(setPickupLocation(currentLocation));
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
        <LocationSearchModal
          visible={showSearchModal}
          onClose={() => dispatch(setShowSearchModal(false))}
          onSelect={location => {
            dispatch(setSummary({destination: location.description}));
            dispatch(
              setDropoffLocation({
                latitude: location.latitude,
                longitude: location.longitude,
              }),
            );
            dispatch(setShowSearchModal(false));
            dispatch(setShowSummary(true));
          }}
        />

        {showSummary && summary?.destination && (
          <TripSummaryCard
            pickup={summary?.pickup}
            dropoff={summary?.destination}
            distance={routeInfo?.distanceText}
            duration={routeInfo?.durationText}
            additionalStops={additionalStops}
            onStopsChange={(stops: any) => dispatch(setAdditionalStops(stops))}
            fare={calculateFare(
              routeInfo?.distanceText,
              routeInfo?.durationText,
              selectedVehicle,
            )}
            loading={isTripSummaryLoading}
            onCancel={() => {
              dispatch(setSummary({destination: null}));
              dispatch(setDropoffLocation(null));
              setRouteInfo(null);
              setFare(null);
              dispatch(setShowSummary(false));
              dispatch(setShowSearchModal(true));
            }}
            onNext={() => {
              setIsTripSummaryLoading(true);
              setTimeout(() => {
                dispatch(setShowSummary(false));
                setShowVehicleModal(true);
                setIsTripSummaryLoading(false);
              }, 500);
            }}
          />
        )}

        <VehicleSelectionModal
          visible={showVehicleModal}
          onRequest={() => {
            setShowVehicleModal(false);
            handleRequestRide();
          }}
          onClose={() => {
            // Reset everything when cancelling vehicle selection
            dispatch(setDropoffLocation(null));
            dispatch(setSummary({destination: null}));
            setRouteInfo(null);
            setShowVehicleModal(false);
            dispatch(setShowSearchModal(true));

            // Animate back to current location if available
            if (currentLocation) {
              mapRef.current?.animateToRegion({
                latitude: currentLocation.latitude,
                longitude: currentLocation.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              });
              // Optionally update pickup marker and description
              dispatch(setPickupLocation(currentLocation));
              reverseGeocode(
                currentLocation.latitude,
                currentLocation.longitude,
              ).then(address => dispatch(setSummary({pickup: address})));
            }
          }}
          onSelectVehicle={vehicle => {
            dispatch(setSelectedVehicleOption(vehicle)); // full vehicle object
            dispatch(setSelectedVehicle(vehicle.type)); // just the type (e.g., "Car")
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
        <BookingSuccessModal
          visible={showBookingSuccess}
          onDone={() => setShowBookingSuccess(false)}
          time={selectedOffer?.eta}
        />

        {isSearchingDriver && incomingOffers.length <= 0 && (
          <SearchingDriverOverlay
            onCancel={() => {
              setIsSearchingDriver(false);

              // Stop any ride updates
              if (unsubscribeListener.current) {
                unsubscribeListener.current();
                unsubscribeListener.current = null;
              }
              dispatch(setRideId(null));
              // Reset locations and route
              dispatch(setDropoffLocation(null));
              dispatch(setSummary({destination: null}));
              setRouteInfo(null);

              // Show location search modal again
              dispatch(setShowSearchModal(true));

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
        {selectedOffer && !showDriverInfoModal && (
          <TouchableOpacity
            style={styles.info}
            onPress={() => {
              dispatch(setDriverInfoModal(true));
            }}>
            <Text style={{textAlign: 'center', color: 'white'}}>
              Driver Info
            </Text>
          </TouchableOpacity>
        )}
        <DriverInfoModal
          visible={showDriverInfoModal}
          onClose={() => dispatch(setDriverInfoModal(false))}
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
          etaToPickup={selectedOffer?.eta}
          distance={selectedOffer?.distance}
          duration={selectedOffer?.eta}
          fare={selectedOffer?.fare}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff', // ensures iOS notch area isn't black
  },
  container: {
    flex: 1,
    position: 'relative',
  },
  avatarButton: {
    position: 'absolute',
    right: 20,
    zIndex: 1000,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },

  offerOverlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 999,
    paddingTop: 40,
    paddingHorizontal: 12,
  },
  scrollContent: {
    paddingBottom: 100,
  },

  // container: {flex: 1},
  map: {flex: 1},
  drawerButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    borderRadius: 20,
    padding: 8,
    zIndex: 999,
  },
  locateButton: {position: 'absolute', top: 380, right: 10},
  locateIcon: {width: 24, height: 24, tintColor: Colors.primary},
  markerWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  outerCircle: {
    backgroundColor: '#19AF18',
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  innerCircle: {
    backgroundColor: '#19AF18',
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: {
    backgroundColor: '#25B324',
    padding: 15,
    marginVertical: 10,
    width: '80%',
    alignSelf: 'center',
    borderRadius: 10,
  },
});

export default HomeMapScreen;
