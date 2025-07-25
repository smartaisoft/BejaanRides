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
} from 'react-native';
import Geolocation, {
  GeolocationResponse,
} from '@react-native-community/geolocation';
import MapView, {Circle, Marker, Region} from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import TripSummaryCard from '../../components/PassengerCommonCard/TripSummaryCard';
import LocationSearchModal from '../../components/PassengerCommonCard/LocationSearchModal';
import VehicleSelectionModal, {
  VehicleOption,
} from '../../components/PassengerCommonCard/VehicleSelectionModal';
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
import BookingSuccessModal from '../../components/PassengerCommonCard/BookingSuccessModal';
const GOOGLE_MAPS_API_KEY = 'AIzaSyCb2ys2AD6NTFhnEGXNsDrjSXde6d569vU';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '../../redux/store';
import {
  setDriverInfo,
  setDriverInfoModal,
  setDriverLiveCoords,
  setDropoffLocation,
  setPickupLocation,
  setRegion,
  setRideId,
  setSelectedOffer,
  setShowSearchModal,
  setShowSummary,
  setSummary,
} from '../../redux/actions/rideActions';

type IncomingOffer = {
  driverId: string;
  driverName: string;
  fare: number;
  eta: string;
  distance: string;
  vehicleType: string;
};

const HomeMapScreen: React.FC = () => {
  const mapRef = useRef<MapView>(null);
  const navigation = useNavigation();
  const [showVehicleModal, setShowVehicleModal] = useState(false);
  const [routeInfo, setRouteInfo] = useState<RouteInfo | null>(null);
  const [currentUser, setCurrentUser] = useState<UserData | null>(null);
  const unsubscribeListener = useRef<(() => void) | null>(null);
  const [selectedVehicle, setSelectedVehicle] = useState<string>('Car');
  const [isSearchingDriver, setIsSearchingDriver] = useState(false);
  const [hasDriverArrived, setHasDriverArrived] = useState(false);
  const [isTripSummaryLoading, setIsTripSummaryLoading] = useState(false);
  const [availableDrivers, setAvailableDrivers] = useState<any[]>([]);
  const [incomingOffers, setIncomingOffers] = useState<any[]>([]);
  const [selectedVehicleOption, setSelectedVehicleOption] =
    useState<VehicleOption | null>(null);
  const [showBookingSuccess, setShowBookingSuccess] = useState(false);
  const [routeInfoToPickup, setRouteInfoToPickup] = useState<RouteInfo | null>(
    null,
  );
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
  } = useSelector((state: RootState) => state.ride);
  const dispatch = useDispatch<AppDispatch>();
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
          dispatch(setSummary({pickup: 'Unknown Location'}));
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
      if (!showSummary && !selectedOffer?.driverId) {
        dispatch(setShowSearchModal(true));
      } else {
        dispatch(setShowSearchModal(false));
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

      const filtered = driversArray.filter(
        d => d.vehicleType?.toLowerCase() === selectedVehicle.toLowerCase(),
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
      } else {
        setIncomingOffers([]);
      }
    };

    offersRef.on('value', handleOffers);
    return () => offersRef.off('value', handleOffers);
  }, [currentRideId]);

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
      ? parseFloat(parseFloat(distanceText.replace('km', '').trim()).toFixed(1))
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
        const {latitude, longitude} = position.coords;

        setCurrentLocation({latitude, longitude}); // <--- NEW
        dispatch(setPickupLocation({latitude, longitude}));
        dispatch(
          setRegion({
            latitude,
            longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }),
        );

        const address = await reverseGeocode(latitude, longitude);
        dispatch(setSummary({pickup: address}));
      },
      error => {
        console.warn('⚠️ High Accuracy failed, falling back:', error);

        // Fall back to Low Accuracy
        Geolocation.getCurrentPosition(
          async (fallbackPosition: GeolocationResponse) => {
            const {latitude, longitude} = fallbackPosition.coords;
            setCurrentLocation({latitude, longitude}); // <--- NEW
            dispatch(setPickupLocation({latitude, longitude}));
            dispatch(
              setRegion({
                latitude,
                longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              }),
            );
            console.log('errrrrrrr', error);
            const address = await reverseGeocode(latitude, longitude);
            dispatch(setSummary({pickup: address}));
          },
          fallbackError => {
            console.error('❌ Both location methods failed:', fallbackError);
            dispatch(setSummary({pickup: 'Unknown Location'}));
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
      !pickupLocation ||
      !dropoffLocation ||
      !currentUser ||
      !summary?.destination ||
      !selectedVehicleOption
    ) {
      Alert.alert('Error', 'Missing data to create ride request.');
      return;
    }

    try {
      setIsSearchingDriver(true);
      const fareEstimate = parseInt(
        selectedVehicleOption.price.replace('RS:', ''),
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
            if (loc) dispatch(setDriverLiveCoords(loc));
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
  console.log('driver', driverInfo, selectedOffer?.eta);
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
  const [mapKey, setMapKey] = useState(0);

  useFocusEffect(
    useCallback(() => {
      setMapKey(prev => prev + 1);
    }, []),
  );
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.avatarButton}
        onPress={() => navigation.navigate('Profile')}
        accessibilityLabel="Open Settings">
        <Image
          source={require('../../../assets/images/Avatar.png')}
          style={styles.avatar}
        />
      </TouchableOpacity>
      {region?.latitude && (
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
                  image={getVehicleMarkerIcon(driverInfo.vehicleType || 'Car')}
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

                  <Marker coordinate={pickupLocation} anchor={{x: 0.5, y: 0.5}}>
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

          {driverLiveCoords && pickupLocation && rideStatus === 'accepted' && (
            <MapViewDirections
              origin={driverLiveCoords}
              destination={pickupLocation}
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

          {pickupLocation && dropoffLocation && (
            <MapViewDirections
              origin={pickupLocation}
              destination={dropoffLocation}
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
      )}

      {/* {availableDrivers
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
        ))} */}

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

      {showSummary && summary?.destination && (
        <TripSummaryCard
          pickup={summary?.pickup}
          dropoff={summary?.destination}
          distance={routeInfo?.distanceText}
          duration={routeInfo?.durationText}
          fare={calculateFare(
            routeInfo?.distanceText,
            routeInfo?.durationText,
            selectedVehicle,
          )}
          loading={isTripSummaryLoading} // 👈 HERE
          onCancel={() => {
            dispatch(setSummary({destination: null}));
            dispatch(setDropoffLocation(null));
            setRouteInfo(null);
            dispatch(setShowSummary(false));
            dispatch(setShowSearchModal(true));
          }}
          onNext={() => {
            setIsTripSummaryLoading(true);
            // Simulate async or prepare for VehicleSelectionModal
            setTimeout(() => {
              dispatch(setShowSummary(false));
              setShowVehicleModal(true);
              setIsTripSummaryLoading(false);
            }, 500); // adjust delay if needed
          }}
        />
      )}
      <BookingSuccessModal
        visible={showBookingSuccess}
        onDone={() => setShowBookingSuccess(false)}
        time={selectedOffer?.eta}
      />
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
          setSelectedVehicleOption(vehicle); // Store full object including edited fare
          setSelectedVehicle(vehicle.type.toLowerCase());
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
          <Text style={{textAlign:'center', color: 'white'}}>Driver Info</Text>
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
        duration={selectedOffer?.eta} // or reuse eta if no separate duration
        fare={selectedOffer?.fare}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  avatarButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 999,
    padding: 4,
    borderRadius: 30,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 3,
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
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },

  container: {flex: 1},
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
  info:{
    backgroundColor: '#25B324',
    padding: 15, 
    marginVertical: 10,
    width: '80%',
    alignSelf: 'center',
    borderRadius: 10
  }
});

export default HomeMapScreen;
