/* eslint-disable @typescript-eslint/no-shadow */
import React, {useEffect, useRef, useState, useCallback} from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Text,
  ActivityIndicator,
  Linking,
  Alert,
  TouchableOpacity,
  Image,
} from 'react-native';
import MapView, {Marker} from 'react-native-maps';
import {useSelector, useDispatch} from 'react-redux';
import auth from '@react-native-firebase/auth';
import {AppDispatch, RootState} from '../../redux/store';
import {DriverStatus, RideData} from '../../redux/types/driverTypes';
import {
  clearRideRequests,
  setCurrentRide,
  setDriverStatus,
  setRideRequests,
} from '../../redux/actions/driverActions';
import PaymentCard from '../../components/BottomCard/PaymentCard';
import OfflinePanel from '../../components/BottomCard/OfflinePanel';
import PassengerRideRequestCard from '../../components/PassengerRideRequestCard';
import MapViewDirections from 'react-native-maps-directions';
import CompleteTripCard from '../../components/BottomCard/CompleteTripCard';
import TripInfoCard from '../../components/BottomCard/TripInfoCard';
import StartTripCard from '../../components/BottomCard/AcceptedRideCard';
import {
  acceptRideRequest,
  getETAFromDriverToPickup,
  // listenForPendingRideRequests,
  startTrip,
} from '../../services/DriverRideService';
import Geolocation from '@react-native-community/geolocation';
import database from '@react-native-firebase/database';
import {getDriverByUid} from '../../services/realTimeUserService';
import Colors from '../../themes/colors';
import Locate from '../../../assets/SVG/Locate';
import {
  removeDriverPresence,
  updateDriverPresence,
} from '../../services/driverPresenceService';
import {getVehicleInfo, VehicleInfo} from '../../services/vehicleService';
import {listenForPendingRideRequests} from '../../services/Driver/DriverServices';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {DriverStackParamList} from '../../navigation/DriverStack';

const GOOGLE_MAPS_API_KEY = 'AIzaSyCb2ys2AD6NTFhnEGXNsDrjSXde6d569vU';
type DriverMapScreenNavigationProp = NativeStackNavigationProp<
  DriverStackParamList,
  'DriverMapScreen'
>;

const DriverMapScreen: React.FC = () => {
  const navigation = useNavigation<DriverMapScreenNavigationProp>();

  const {status, currentRide, rideRequests} = useSelector(
    (state: RootState) => state.driver,
  );
  console.log('current ride ✅✅✅✅✅✅✅✅✅✅✅:', currentRide);
  console.log('ride request ✅✅✅✅✅✅✅✅✅✅✅:', rideRequests);

  const [driverCoords, setDriverCoords] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [driverName, setDriverName] = useState<string>('Driver');
  const mapRef = useRef<MapView | null>(null);
  const unsubscribeRef = useRef<() => void | null>(null);
  const dispatch = useDispatch<AppDispatch>();
  const myDriverId = auth().currentUser?.uid ?? 'unknown_driver';
  const [vehicleType, setVehicleType] = useState<string | null>(null);
  const [mapKey, setMapKey] = useState(0);
  useEffect(() => {
    console.log('Driver id:', myDriverId);
    const fetchDriverName = async () => {
      try {
        const uid = auth().currentUser?.uid;
        if (!uid) {
          return;
        }
        const profile = await getDriverByUid(uid);
        if (profile?.name) {
          setDriverName(profile.name);
        }
      } catch (error) {
        console.error('Error fetching driver profile:', error);
      }
    };
    fetchDriverName();
  }, [myDriverId]);

  useEffect(() => {
    const fetchVehicleType = async () => {
      try {
        console.log('fetching vehicle information');
        const info: VehicleInfo | null = await getVehicleInfo();
        if (info?.vehicleType) {
          setVehicleType(info.vehicleType.toLowerCase());
        } else {
          console.warn('🚫 Vehicle type not found');
        }
      } catch (error) {
        console.error('❌ Error fetching vehicle info:', error);
      }
    };

    fetchVehicleType();
  }, []);

  // Step 2: Listen for ride requests matching vehicleType
  useEffect(() => {
    if (status !== DriverStatus.ONLINE) {
      console.log('🛑 Driver is offline. Unsubscribing from ride requests.');
      unsubscribeRef.current?.();
      dispatch(clearRideRequests());
      return;
    }

    if (!vehicleType) {
      console.warn('🚫 Vehicle type is missing, cannot subscribe to requests');
      return;
    }

    console.log('📡 Subscribing to pending ride requests...');
    const unsubscribe = listenForPendingRideRequests(
      myDriverId,
      vehicleType,
      pendingRides => {
        console.log('🚕 New pending rides received:', pendingRides);
        dispatch(setRideRequests(pendingRides));
      },
    );

    unsubscribeRef.current = unsubscribe;

    return () => {
      console.log('🧹 Cleaning up ride request listener');
      unsubscribe();
    };
  }, [dispatch, myDriverId, status, vehicleType]);

  // real time tracking of driver
  useEffect(() => {
    console.log('🛰️ Geolocation watcher initializing...');

    const watchId = Geolocation.watchPosition(
      pos => {
        if (!pos || !pos.coords) {
          console.warn('⚠️ No coordinates received from Geolocation');
          return;
        }

        const coords = {
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        };

        console.log('📍 Driver coordinates received:', coords);
        setDriverCoords(coords);

        if (currentRide && currentRide.id) {
          console.log(
            `🚗 Updating Firebase with driver location for ride ID: ${currentRide.id}`,
          );
          database()
            .ref(`rideRequests/${currentRide.id}/driverLocation`)
            .set(coords)
            .then(() => {
              console.log('✅ Driver location updated in Firebase.');
            })
            .catch(error => {
              console.error(
                '❌ Failed to update driver location in Firebase:',
                error,
              );
            });
        } else {
          console.warn(
            '⚠️ No active ride found – skipping driver location update.',
          );
        }
      },
      err => {
        console.error('❌ Geolocation watchPosition error:', err);
      },
      {
        enableHighAccuracy: false,
        distanceFilter: 5,
      },
    );

    return () => {
      console.log('🧹 Clearing Geolocation watcher:', watchId);
      Geolocation.clearWatch(watchId);
    };
  }, [currentRide]);

  const getVehicleMarkerIcon = (vehicleType: string) => {
    switch (vehicleType) {
      case 'Bike':
        return require('../../../assets/images/vehicles/bikeVehicle.png');
      case 'Car':
      default:
        return require('../../../assets/images/vehicles/carRoute.png');
    }
  };

  useEffect(() => {
    if (!currentRide?.id) {
      return;
    }

    const ref = database().ref(`rideRequests/${currentRide.id}/status`);
    const listener = ref.on('value', snapshot => {
      const status = snapshot.val();
      if (status) {
        dispatch(setCurrentRide({...currentRide, status}));
      }
    });

    return () => ref.off('value', listener);
  }, [currentRide, currentRide?.id, dispatch]);

  const renderMapMarkersAndDirections = useCallback(() => {
    if (!currentRide || !driverCoords) {
      return null;
    }
    const vehicleIcon = getVehicleMarkerIcon(currentRide.vehicleType);
    const isOnTheWay = status === DriverStatus.ON_THE_WAY;
    const isTripStarted = status === DriverStatus.TRIP_STARTED;
    const isWaiting = status === DriverStatus.WAITING_FOR_PASSENGER;

    return (
      <>
        <Marker coordinate={driverCoords} title="You" image={vehicleIcon} />
        <Marker coordinate={currentRide.pickupLocation} title="Pickup" />
        {(isTripStarted || isWaiting) && (
          <Marker coordinate={currentRide.dropoffLocation} title="Drop-off" />
        )}
        {isOnTheWay && (
          <MapViewDirections
            origin={driverCoords}
            destination={currentRide.pickupLocation}
            apikey={GOOGLE_MAPS_API_KEY}
            strokeWidth={4}
            strokeColor="#9C27B0"
          />
        )}
        {(isTripStarted || isWaiting) && (
          <MapViewDirections
            origin={currentRide.pickupLocation}
            destination={currentRide.dropoffLocation}
            apikey={GOOGLE_MAPS_API_KEY}
            strokeWidth={4}
            strokeColor="#9C27B0"
          />
        )}
      </>
    );
  }, [currentRide, driverCoords, status]);

  const handleLocatePress = () => {
    if (driverCoords) {
      mapRef.current?.animateToRegion(
        {
          ...driverCoords,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        },
        500,
      );
    }
  };

  const handleAcceptRide = async (ride: RideData, customFare: number) => {
    if (!driverCoords) {
      Alert.alert(
        'Location Required',
        'Unable to send offer without location.',
      );
      return;
    }

    try {
      // Step 1: Calculate ETA and Distance to pickup
      const {durationText, distanceText} = await getETAFromDriverToPickup(
        driverCoords,
        ride.pickup,
      );

      // Step 2: Send offer to Firebase
      await acceptRideRequest(
        ride.id,
        myDriverId,
        driverName,
        durationText,
        distanceText,
        customFare,
        ride.vehicleType,
        driverCoords,
      );

      // Step 3: Update Redux state
      dispatch(setCurrentRide({...ride, fare: customFare}));
      dispatch(clearRideRequests());
      dispatch(setDriverStatus(DriverStatus.ON_THE_WAY));
    } catch (error) {
      console.error('❌ Error sending offer:', error);
      Alert.alert('Error', 'Failed to send offer to passenger.');
    }
  };
  useFocusEffect(
    useCallback(() => {
      setMapKey(prev => prev + 1);
    }, []),
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        {/* Go Back button appears only when driver is NOT offline */}

        {status !== DriverStatus.OFFLINE && (
          <TouchableOpacity
            onPress={() => dispatch(setDriverStatus(DriverStatus.OFFLINE))}
            style={styles.backButton}>
            <Icon name="arrow-back" size={26} color={Colors.tabBarBackground} />
          </TouchableOpacity>
        )}

        <View style={styles.spacer} />

        <View style={styles.profileInfo}>
          <TouchableOpacity
            onPress={() => navigation.navigate('DriverProfile')}>
            <Image
              source={require('../../../assets/images/Avatar.png')}
              style={styles.avatar}
            />
          </TouchableOpacity>
        </View>
      </View>

      <MapView
        ref={mapRef}
        key={mapKey}
        style={styles.map}
        region={
          driverCoords
            ? {
                ...driverCoords,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              }
            : {
                latitude: 31.5497,
                longitude: 74.3436,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              }
        }>
        {driverCoords && (
          <Marker
            coordinate={driverCoords}
            title="You"
            image={getVehicleMarkerIcon('Car')}
          />
        )}
        {renderMapMarkersAndDirections()}
      </MapView>
      {/* {driverCoords && (
        <TouchableOpacity
          style={styles.locateButtonContainer}
          onPress={handleLocatePress}>
          <Locate width={50} height={50} />
        </TouchableOpacity>
      )} */}
      {status === DriverStatus.OFFLINE && (
        <OfflinePanel
          onGoOnline={() => dispatch(setDriverStatus(DriverStatus.ONLINE))}
          driverName={driverName}
        />
      )}
      {status === DriverStatus.ONLINE && (
        <View style={styles.rideRequestsContainer}>
          {rideRequests.length === 0 ? (
            <View style={styles.loaderContainer}>
              <ActivityIndicator size="large" color={Colors.primary} />
              <Text style={styles.loaderText}>
                Searching for rides nearby...
              </Text>
            </View>
          ) : (
            <FlatList
              data={rideRequests}
              keyExtractor={item => item.id}
              renderItem={({item}) => (
                <PassengerRideRequestCard
                  ride={item}
                  passengerFare={item.fareEstimate ?? item.fare ?? 0}
                  onAccept={customFare => handleAcceptRide(item, customFare)}
                  onReject={() => {
                    database()
                      .ref(
                        `rideRequests/${item.id}/rejectedDrivers/${myDriverId}`,
                      )
                      .set(true);
                    dispatch(
                      setRideRequests(
                        rideRequests.filter(r => r.id !== item.id),
                      ),
                    );
                  }}
                />
              )}
            />
          )}
        </View>
      )}
      {status === DriverStatus.ON_THE_WAY &&
        currentRide?.status === 'accepted' && (
          <TripInfoCard
            eta={currentRide.durationText}
            distance={currentRide.distanceText}
            riderName={currentRide.riderName}
            riderPhone={currentRide.riderPhone}
            onChat={() => Alert.alert('Chat', 'Chat not implemented')}
            onCall={() => Linking.openURL(`tel:${currentRide.riderPhone}`)}
            onCancel={() => {
              dispatch(setCurrentRide(null));
              dispatch(setDriverStatus(DriverStatus.ONLINE));
            }}
            onArrived={() => {
              database()
                .ref(`rideRequests/${currentRide.id}/status`)
                .set('arrived')
                .then(() =>
                  dispatch(setDriverStatus(DriverStatus.WAITING_FOR_PASSENGER)),
                )
                .catch(err => {
                  console.error('Failed to update ride status to arrived', err);
                  Alert.alert('Error', 'Failed to update ride status.');
                });
            }}
          />
        )}
      {status === DriverStatus.ON_THE_WAY &&
        currentRide?.status === 'pending' && (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color={Colors.primary} />
            <Text style={styles.loaderText}>
              Waiting for passenger to accept your offer...
            </Text>
          </View>
        )}

      {status === DriverStatus.WAITING_FOR_PASSENGER && currentRide && (
        <StartTripCard
          eta="Ready"
          fare={currentRide.fare}
          rating={4.9}
          distance={currentRide.distanceText ?? 'N/A'}
          onStart={() => {
            startTrip(currentRide.id);
            dispatch(setDriverStatus(DriverStatus.TRIP_STARTED));
          }}
        />
      )}
      {status === DriverStatus.TRIP_STARTED && (
        <CompleteTripCard
          onComplete={() => dispatch(setDriverStatus(DriverStatus.PAYMENT))}
        />
      )}
      {status === DriverStatus.PAYMENT && currentRide && (
        <PaymentCard
          amount={currentRide.fare}
          onConfirm={() => dispatch(setDriverStatus(DriverStatus.ONLINE))}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1},
  header: {
    position: 'absolute',
    top: 10,
    left: 0,
    right: 0,
    zIndex: 100,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between', // 🔁 this is key
    paddingHorizontal: 16,
  },

  backButton: {
    padding: 6,
  },

  spacer: {
    flex: 1, // pushes avatar to far right
  },

  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#fff',
  },

  map: {flex: 1},
  rideRequestsContainer: {
    position: 'absolute',
    top: 60,
    left: 0,
    right: 0,
    paddingHorizontal: 12,
  },
  loaderContainer: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 16,
    paddingVertical: 24,
    paddingHorizontal: 16,
    alignItems: 'center',
    marginHorizontal: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  loaderText: {
    marginTop: 12,
    fontSize: 16,
    color: '#333',
    fontWeight: '600',
  },
  locateButtonContainer: {
    position: 'absolute',
    bottom: 250,
    right: 20,
    borderRadius: 24,
    padding: 6,
  },
});

export default DriverMapScreen;
