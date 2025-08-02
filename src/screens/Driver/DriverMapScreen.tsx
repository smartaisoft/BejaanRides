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
} from 'react-native';
import MapView, {Marker} from 'react-native-maps';
import {useSelector, useDispatch} from 'react-redux';
import auth from '@react-native-firebase/auth';
import {AppDispatch, RootState} from '../../redux/store';
import {DriverStatus} from '../../redux/types/driverTypes';
import PaymentCard from '../../components/BottomCard/PaymentCard';
import OfflinePanel from '../../components/BottomCard/OfflinePanel';
import PassengerRideRequestCard from '../../components/PassengerRideRequestCard';
import MapViewDirections from 'react-native-maps-directions';
import CompleteTripCard from '../../components/BottomCard/CompleteTripCard';
import TripInfoCard from '../../components/BottomCard/TripInfoCard';
import StartTripCard from '../../components/BottomCard/AcceptedRideCard';
import Colors from '../../themes/colors';
import Locate from '../../../assets/SVG/Locate';

import {
  clearRideRequests,
  setCurrentRide,
  setDriverStatus,
  setRideRequests,
} from '../../redux/actions/driverActions';

import {
  acceptRideRequest,
  listenForPendingRideRequests,
  startTrip,
} from '../../services/DriverRideService';
import Geolocation from '@react-native-community/geolocation';
import database from '@react-native-firebase/database';
import {getDriverByUid} from '../../services/realTimeUserService';
import {
  removeDriverPresence,
  updateDriverPresence,
} from '../../services/driverPresenceService';
import {getVehicleInfo} from '../../services/vehicleService';
import { GOOGLE_MAPS_API_KEY } from '../../utils/googleMap';

const DriverMapScreen: React.FC = () => {
  const {status, currentRide, rideRequests} = useSelector(
    (state: RootState) => state.driver,
  );

  const [driverCoords, setDriverCoords] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [driverName, setDriverName] = useState<string>('Driver');
  const mapRef = useRef<MapView | null>(null);
  const unsubscribeRef = useRef<() => void | null>(null);
  const dispatch = useDispatch<AppDispatch>();
  const myDriverId = auth().currentUser?.uid ?? 'unknown_driver';

  // Fetch driver profile
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

  // useEffect(() => {
  //   return () => {
  //     (async () => {
  //       try {
  //         await removeDriverPresence();
  //         console.log('✅ Driver presence removed successfully');
  //       } catch (err) {
  //         console.warn('Failed to remove driver presence:', err);
  //       }
  //     })();
  //   };
  // }, []);

  // Watch driver location
  useEffect(() => {
    const watchId = Geolocation.watchPosition(
      pos => {
        const coords = {
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        };
        setDriverCoords(coords);
        if (currentRide) {
          database()
            .ref(`rideRequests/${currentRide.id}/driverLocation`)
            .set(coords);
        }
      },
      err => console.error('Driver location error:', err),
      {enableHighAccuracy: false, distanceFilter: 5},
    );
    return () => Geolocation.clearWatch(watchId);
  }, [currentRide]);

  useEffect(() => {
    const setup = async () => {
      if (status === DriverStatus.ONLINE) {
        const vehicleInfo = await getVehicleInfo();

        if (driverCoords && vehicleInfo) {
          try {
            await updateDriverPresence(
              driverCoords,
              driverName,
              vehicleInfo.vehicleType,
            );
          } catch (error) {
            console.error('❌ Failed to update driver presence:', error);
          }
        }

        unsubscribeRef.current = listenForPendingRideRequests(
          myDriverId,
          rides => {
            const formatted = rides.map(ride => ({
              id: ride.id,
              riderName: ride.passengerName ?? 'Unknown Passenger',
              riderPhone: ride.passengerPhone ?? 'N/A',
              pickupLocation: ride.pickup,
              dropoffLocation: ride.dropoff,
              additionalStops: ride.additionalStops || [], // ✅ Add this line
              distanceText: ride.distanceText ?? 'N/A',
              durationText: ride.durationText ?? 'N/A',
              fare: ride.fareEstimate,
              status: ride.status,
              vehicleType: ride.vehicleType,
            }));
            dispatch(setRideRequests(formatted));
          },
          // vehicleInfo.vehicleType, // ✅ Pass filter
        );
      } else {
        unsubscribeRef.current?.();
        dispatch(clearRideRequests());
      }
    };

    setup();

    return () => {
      unsubscribeRef.current?.();
    };
  }, [status, dispatch, driverCoords, driverName, myDriverId]);

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
    if (!currentRide?.id) return;

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
    if (!currentRide || !driverCoords) return null;
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

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
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
      {driverCoords && (
        <TouchableOpacity
          style={styles.locateButtonContainer}
          onPress={handleLocatePress}>
          <Locate width={50} height={50} />
        </TouchableOpacity>
      )}
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
                  passengerFare={item.fare}
                  onAccept={customFare => {
                    acceptRideRequest(
                      item.id,
                      myDriverId,
                      driverName,
                      item.durationText ?? '5 min',
                      item.distanceText ?? '1.2 km',
                      customFare,
                    );
                    dispatch(setCurrentRide(item));
                    dispatch(clearRideRequests());
                    dispatch(setDriverStatus(DriverStatus.ON_THE_WAY));
                  }}
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
    top: 50,
    right: 20,
    borderRadius: 24,
    padding: 6,
  },
});

export default DriverMapScreen;
