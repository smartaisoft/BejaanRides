// import React, {useEffect, useRef} from 'react';
// import {View, StyleSheet, FlatList} from 'react-native';
// import MapView, {Marker} from 'react-native-maps';
// import {useSelector, useDispatch} from 'react-redux';
// import {AppDispatch, RootState} from '../../redux/store';
// import {DriverStatus} from '../../redux/types/driverTypes';
// import {
//   clearRideRequests,
//   setCurrentRide,
//   setDriverStatus,
//   setRideRequests,
// } from '../../redux/actions/driverActions';
// import PaymentCard from '../../components/BottomCard/PaymentCard';
// import OfflinePanel from '../../components/BottomCard/OfflinePanel';
// import PassengerRideRequestCard from '../../components/PassengerRideRequestCard';
// import MapViewDirections from 'react-native-maps-directions';
// import CompleteTripCard from '../../components/BottomCard/CompleteTripCard';
// import StartTripCard from '../../components/BottomCard/AcceptedRideCard';
// import OnlinePanel from '../../components/BottomCard/ OnlinePanel';
// import {
//   acceptRideRequest,
//   listenForPendingRideRequests,
// } from '../../services/DriverRideService';
// import auth from '@react-native-firebase/auth';

// const GOOGLE_MAPS_API_KEY = 'AIzaSyCb2ys2AD6NTFhnEGXNsDrjSXde6d569vU';
// const defaultLat = 37.7749;
// const defaultLng = -122.4194;

// const DriverMapScreen: React.FC = () => {
//   const {status, currentRide, rideRequests} = useSelector(
//     (state: RootState) => state.driver,
//   );
//   const dispatch = useDispatch<AppDispatch>();
//   const unsubscribeRef = useRef<(() => void) | null>(null);

//   useEffect(() => {
//     // Start listening when driver goes online
//     if (status === DriverStatus.ONLINE) {
//       unsubscribeRef.current = listenForPendingRideRequests(rides => {
//         // Map raw rides into your Redux format
//         const formatted = rides.map(ride => ({
//           id: ride.id,
//           pickupLocation: {
//             latitude: ride.pickup.latitude,
//             longitude: ride.pickup.longitude,
//           },
//           dropoffLocation: {
//             latitude: ride.dropoff.latitude,
//             longitude: ride.dropoff.longitude,
//           },
//           riderName: ride.passengerId, // You can replace this with passenger name if you store it
//           riderPhone: 'N/A', // Same here
//           distance: 0, // You can calculate distance here if needed
//           fare: ride.fareEstimate,
//         }));
//         dispatch(setRideRequests(formatted));
//       });
//     }

//     // Stop listening when driver goes offline or leaves this screen
//     if (status !== DriverStatus.ONLINE && unsubscribeRef.current) {
//       unsubscribeRef.current();
//       unsubscribeRef.current = null;
//       dispatch(clearRideRequests());
//     }

//     return () => {
//       if (unsubscribeRef.current) {
//         unsubscribeRef.current();
//         unsubscribeRef.current = null;
//       }
//     };
//   }, [status, dispatch]);
//   const myDriverId = auth().currentUser?.uid ?? 'unknown_driver';

//   const renderMapDirections = () => {
//     if (!currentRide) return null;
//     return (
//       <>
//         <Marker coordinate={currentRide.pickupLocation} title="Pickup" />
//         <Marker coordinate={currentRide.dropoffLocation} title="Drop-off" />
//         <MapViewDirections
//           origin={currentRide.pickupLocation}
//           destination={currentRide.dropoffLocation}
//           apikey={GOOGLE_MAPS_API_KEY}
//           strokeWidth={4}
//           strokeColor="#9C27B0"
//         />
//       </>
//     );
//   };

//   return (
//     <View style={styles.container}>
//       <MapView
//         style={styles.map}
//         region={{
//           latitude: currentRide?.pickupLocation.latitude ?? defaultLat,
//           longitude: currentRide?.pickupLocation.longitude ?? defaultLng,
//           latitudeDelta: 0.01,
//           longitudeDelta: 0.01,
//         }}>
//         {renderMapDirections()}
//       </MapView>

//       {/* 1️⃣ OFFLINE */}
//       {status === DriverStatus.OFFLINE && (
//         <OfflinePanel
//           onGoOnline={() => dispatch(setDriverStatus(DriverStatus.ONLINE))}
//         />
//       )}

//       {/* 2️⃣ ONLINE */}
//       {status === DriverStatus.ONLINE && (
//         <OnlinePanel
//           onFindTrips={() => {
//             dispatch(setDriverStatus(DriverStatus.REQUEST_RECEIVED));
//             dispatch(
//               setRideRequests([
//                 {
//                   id: 'ride1',
//                   pickupLocation: {latitude: 37.7749, longitude: -122.4194},
//                   dropoffLocation: {latitude: 37.7849, longitude: -122.4094},
//                   riderName: 'John Doe',
//                   riderPhone: '1234567890',
//                   distance: 5.0,
//                   fare: 450,
//                 },
//                 {
//                   id: 'ride2',
//                   pickupLocation: {latitude: 37.7649, longitude: -122.4294},
//                   dropoffLocation: {latitude: 37.7549, longitude: -122.4394},
//                   riderName: 'Jane Smith',
//                   riderPhone: '9876543210',
//                   distance: 3.2,
//                   fare: 320,
//                 },
//                 {
//                   id: 'ride3',
//                   pickupLocation: {latitude: 37.7849, longitude: -122.4194},
//                   dropoffLocation: {latitude: 37.7949, longitude: -122.4094},
//                   riderName: 'Alice Johnson',
//                   riderPhone: '5555555555',
//                   distance: 4.5,
//                   fare: 400,
//                 },
//               ]),
//             );
//           }}
//         />
//       )}

//       {/* 3️⃣ REQUEST_RECEIVED */}
//       {status === DriverStatus.REQUEST_RECEIVED && (
//         <View style={styles.rideRequestsContainer}>
//           <FlatList
//             data={rideRequests}
//             keyExtractor={item => item.id}
//             renderItem={({item}) => (
//               <PassengerRideRequestCard
//                 ride={item}
//                 onAccept={() => {
//                   acceptRideRequest(item.id, myDriverId);

//                   dispatch(setCurrentRide(item));
//                   dispatch(clearRideRequests());
//                   dispatch(setDriverStatus(DriverStatus.ARRIVED));
//                 }}
//                 onReject={() => {
//                   dispatch(
//                     setRideRequests(rideRequests.filter(r => r.id !== item.id)),
//                   );
//                 }}
//               />
//             )}
//           />
//         </View>
//       )}

//       {/* 4️⃣ ARRIVED */}
//       {status === DriverStatus.ARRIVED && currentRide && (
//         <StartTripCard
//           eta="25 min"
//           fare={currentRide.fare}
//           rating={4.9}
//           distance={currentRide.distance}
//           onStart={() => dispatch(setDriverStatus(DriverStatus.TRIP_STARTED))}
//         />
//       )}

//       {/* 5️⃣ TRIP_STARTED */}
//       {status === DriverStatus.TRIP_STARTED && (
//         <CompleteTripCard
//           onComplete={() => dispatch(setDriverStatus(DriverStatus.PAYMENT))}
//         />
//       )}

//       {/* 6️⃣ PAYMENT */}
//       {status === DriverStatus.PAYMENT && currentRide && (
//         <PaymentCard
//           amount={currentRide.fare}
//           onConfirm={() => dispatch(setDriverStatus(DriverStatus.ONLINE))}
//         />
//       )}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {flex: 1},
//   map: {flex: 1},
//   rideRequestsContainer: {
//     position: 'absolute',
//     top: 60,
//     left: 0,
//     right: 0,
//     paddingHorizontal: 12,
//   },
// });

// export default DriverMapScreen;
// import React, { useEffect, useRef, useState } from 'react';
// import {
//   View,
//   StyleSheet,
//   FlatList,
//   Text,
//   ActivityIndicator,
//   Linking,
//   Alert,
// } from 'react-native';
// import MapView, { Marker } from 'react-native-maps';
// import { useSelector, useDispatch } from 'react-redux';
// import auth from '@react-native-firebase/auth';
// import { AppDispatch, RootState } from '../../redux/store';
// import { DriverStatus } from '../../redux/types/driverTypes';
// import {
//   clearRideRequests,
//   setCurrentRide,
//   setDriverStatus,
//   setRideRequests,
// } from '../../redux/actions/driverActions';
// import PaymentCard from '../../components/BottomCard/PaymentCard';
// import OfflinePanel from '../../components/BottomCard/OfflinePanel';
// import PassengerRideRequestCard from '../../components/PassengerRideRequestCard';
// import MapViewDirections from 'react-native-maps-directions';
// import CompleteTripCard from '../../components/BottomCard/CompleteTripCard';
// import TripInfoCard from '../../components/BottomCard/TripInfoCard';
// import StartTripCard from '../../components/BottomCard/AcceptedRideCard';
// import {
//   acceptRideRequest,
//   listenForPendingRideRequests,
//   startTrip,
// } from '../../services/DriverRideService';
// import Geolocation from '@react-native-community/geolocation';
// import database from '@react-native-firebase/database';

// const GOOGLE_MAPS_API_KEY = 'AIzaSyCb2ys2AD6NTFhnEGXNsDrjSXde6d569vU';
// const defaultLat = 31.475268; // Lahore Latitude
// const defaultLng = 74.401224; // Lahore Longitude
// const DriverMapScreen: React.FC = () => {
//   const { status, currentRide, rideRequests } = useSelector(
//     (state: RootState) => state.driver
//   );

//   // Driver location starts in Lahore
//   const [driverCoords, setDriverCoords] = useState<{
//     latitude: number;
//     longitude: number;
//   }>({
//     latitude: defaultLat,
//     longitude: defaultLng,
//   });

//   const dispatch = useDispatch<AppDispatch>();
//   const unsubscribeRef = useRef<(() => void) | null>(null);
//   const myDriverId = auth().currentUser?.uid ?? 'unknown_driver';

//   /**
//    * Watch driver GPS and update Firebase location
//    */
//   useEffect(() => {
//     let watchId: number | null = null;

//     if (currentRide) {
//       watchId = Geolocation.watchPosition(
//         pos => {
//           const coords = {
//             latitude: pos.coords.latitude,
//             longitude: pos.coords.longitude,
//           };
//           setDriverCoords(coords);

//           database()
//             .ref(`rideRequests/${currentRide.id}/driverLocation`)
//             .set(coords);
//         },
//         err => {
//           console.error('Driver location error:', err);
//           // Keep Lahore as fallback
//           setDriverCoords({
//             latitude: defaultLat,
//             longitude: defaultLng,
//           });
//         },
//         { enableHighAccuracy: false, distanceFilter: 5 }
//       );
//     }

//     return () => {
//       if (watchId !== null) {
//         Geolocation.clearWatch(watchId);
//       }
//     };
//   }, [currentRide]);

//   /**
//    * Listen for new ride requests when ONLINE
//    */
//   useEffect(() => {
//     if (status === DriverStatus.ONLINE) {
//       unsubscribeRef.current = listenForPendingRideRequests(rides => {
//         const formatted = rides.map(ride => ({
//           id: ride.id,
//           riderName: ride.passengerName ?? 'Unknown Passenger',
//           riderPhone: ride.passengerPhone ?? 'N/A',
//           pickupLocation: {
//             latitude: ride.pickup.latitude,
//             longitude: ride.pickup.longitude,
//           },
//           dropoffLocation: {
//             latitude: ride.dropoff.latitude,
//             longitude: ride.dropoff.longitude,
//           },
//           distanceText: ride.distanceText ?? 'N/A',
//           durationText: ride.durationText ?? 'N/A',
//           fare: ride.fareEstimate,
//         }));
//         dispatch(setRideRequests(formatted));
//       });
//     }

//     if (status !== DriverStatus.ONLINE && unsubscribeRef.current) {
//       unsubscribeRef.current();
//       unsubscribeRef.current = null;
//       dispatch(clearRideRequests());
//     }

//     return () => {
//       if (unsubscribeRef.current) {
//         unsubscribeRef.current();
//         unsubscribeRef.current = null;
//       }
//     };
//   }, [status, dispatch]);

// const renderMapDirections = () => {
//   if (!currentRide || !driverCoords) return null;

//   if (status === DriverStatus.ON_THE_WAY) {
//     return (
//       <>
//         <Marker coordinate={driverCoords} title="You" />
//         <Marker coordinate={currentRide.pickupLocation} title="Pickup" />
//         <MapViewDirections
//           origin={driverCoords}
//           destination={currentRide.pickupLocation}
//           apikey={GOOGLE_MAPS_API_KEY}
//           strokeWidth={4}
//           strokeColor="#9C27B0"
//         />
//       </>
//     );
//   }

//   if (
//     status === DriverStatus.WAITING_FOR_PASSENGER ||
//     status === DriverStatus.TRIP_STARTED
//   ) {
//     return (
//       <>
//         <Marker coordinate={driverCoords} title="You" />
//         <Marker coordinate={currentRide.pickupLocation} title="Pickup" />
//         <Marker coordinate={currentRide.dropoffLocation} title="Drop-off" />
//         <MapViewDirections
//           origin={currentRide.pickupLocation}
//           destination={currentRide.dropoffLocation}
//           apikey={GOOGLE_MAPS_API_KEY}
//           strokeWidth={4}
//           strokeColor="#9C27B0"
//         />
//       </>
//     );
//   }

//   return null;
// };

//   return (
//     <View style={styles.container}>
//       <MapView
//         style={styles.map}
//         region={{
//           latitude:
//             driverCoords?.latitude ??
//             currentRide?.pickupLocation.latitude ??
//             defaultLat,
//           longitude:
//             driverCoords?.longitude ??
//             currentRide?.pickupLocation.longitude ??
//             defaultLng,
//           latitudeDelta: 0.01,
//           longitudeDelta: 0.01,
//         }}
//       >
//         {renderMapDirections()}
//       </MapView>

//       {/* OFFLINE */}
//       {status === DriverStatus.OFFLINE && (
//         <OfflinePanel
//           onGoOnline={() => dispatch(setDriverStatus(DriverStatus.ONLINE))}
//         />
//       )}

//       {/* ONLINE */}
//       {status === DriverStatus.ONLINE && (
//         <View style={styles.rideRequestsContainer}>
//           {rideRequests.length === 0 ? (
//             <View style={styles.loaderContainer}>
//               <ActivityIndicator size="large" color="#9b2fc2" />
//               <Text style={styles.loaderText}>Searching for rides nearby...</Text>
//             </View>
//           ) : (
//             <FlatList
//               data={rideRequests}
//               keyExtractor={item => item.id}
//               renderItem={({ item }) => (
//                 <PassengerRideRequestCard
//                   ride={item}
//                   onAccept={() => {
//                     acceptRideRequest(item.id, myDriverId);
//                     dispatch(setCurrentRide(item));
//                     dispatch(clearRideRequests());
//                     dispatch(setDriverStatus(DriverStatus.ON_THE_WAY));

//                     // Immediately get location
//                     Geolocation.getCurrentPosition(
//                       pos => {
//                         const coords = {
//                           latitude: pos.coords.latitude,
//                           longitude: pos.coords.longitude,
//                         };
//                         setDriverCoords(coords);
//                         database()
//                           .ref(`rideRequests/${item.id}/driverLocation`)
//                           .set(coords);
//                       },
//                       err => {
//                         console.error('Error getting initial driver location', err);
//                         setDriverCoords({
//                           latitude: defaultLat,
//                           longitude: defaultLng,
//                         });
//                       },
//                       { enableHighAccuracy: true, timeout: 20000 }
//                     );
//                   }}
//                   onReject={() => {
//                     dispatch(
//                       setRideRequests(
//                         rideRequests.filter(r => r.id !== item.id)
//                       )
//                     );
//                   }}
//                 />
//               )}
//             />
//           )}
//         </View>
//       )}

//       {/* ON_THE_WAY */}
//       {status === DriverStatus.ON_THE_WAY && currentRide && (
//         <TripInfoCard
//           eta={currentRide.durationText}
//           distance={currentRide.distanceText}
//           riderName={currentRide.riderName}
//           riderPhone={currentRide.riderPhone}
//           onChat={() => Alert.alert('Chat', 'Chat not implemented')}
//           onCall={() => Linking.openURL(`tel:${currentRide.riderPhone}`)}
//           onCancel={() => {
//             dispatch(setCurrentRide(null));
//             dispatch(setDriverStatus(DriverStatus.ONLINE));
//           }}
//           onArrived={() => {
//             dispatch(setDriverStatus(DriverStatus.WAITING_FOR_PASSENGER));
//           }}
//         />
//       )}

//       {/* WAITING_FOR_PASSENGER */}
//       {status === DriverStatus.WAITING_FOR_PASSENGER && currentRide && (
//         <StartTripCard
//           eta="Ready"
//           fare={currentRide.fare}
//           rating={4.9}
//           distance={currentRide.distanceText ?? 'N/A'}
//           onStart={() => {
//             startTrip(currentRide.id);
//             dispatch(setDriverStatus(DriverStatus.TRIP_STARTED));
//           }}
//         />
//       )}

//       {/* TRIP_STARTED */}
//       {status === DriverStatus.TRIP_STARTED && (
//         <CompleteTripCard
//           onComplete={() => dispatch(setDriverStatus(DriverStatus.PAYMENT))}
//         />
//       )}

//       {/* PAYMENT */}
//       {status === DriverStatus.PAYMENT && currentRide && (
//         <PaymentCard
//           amount={currentRide.fare}
//           onConfirm={() => dispatch(setDriverStatus(DriverStatus.ONLINE))}
//         />
//       )}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: { flex: 1 },
//   map: { flex: 1 },
//   rideRequestsContainer: {
//     position: 'absolute',
//     top: 60,
//     left: 0,
//     right: 0,
//     paddingHorizontal: 12,
//   },
//   loaderContainer: {
//     backgroundColor: 'rgba(255,255,255,0.9)',
//     borderRadius: 16,
//     paddingVertical: 24,
//     paddingHorizontal: 16,
//     alignItems: 'center',
//     marginHorizontal: 20,
//     shadowColor: '#000',
//     shadowOpacity: 0.1,
//     shadowRadius: 10,
//     elevation: 5,
//   },
//   loaderText: {
//     marginTop: 12,
//     fontSize: 16,
//     color: '#333',
//     fontWeight: '600',
//   },
// });

// export default DriverMapScreen;

import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Text,
  ActivityIndicator,
  Linking,
  Alert,
} from 'react-native';
import MapView, {Marker} from 'react-native-maps';
import {useSelector, useDispatch} from 'react-redux';
import auth from '@react-native-firebase/auth';
import {AppDispatch, RootState} from '../../redux/store';
import {DriverStatus} from '../../redux/types/driverTypes';
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
  listenForPendingRideRequests,
  startTrip,
} from '../../services/DriverRideService';
import Geolocation from '@react-native-community/geolocation';
import database from '@react-native-firebase/database';
import { getDriverByUid } from '../../services/realTimeUserService';
import Colors from '../../themes/colors';

const GOOGLE_MAPS_API_KEY = 'AIzaSyCb2ys2AD6NTFhnEGXNsDrjSXde6d569vU';

const DriverMapScreen: React.FC = () => {
  const {status, currentRide, rideRequests} = useSelector(
    (state: RootState) => state.driver,
  );

  const [driverCoords, setDriverCoords] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  const dispatch = useDispatch<AppDispatch>();
  const unsubscribeRef = useRef<(() => void) | null>(null);
  const myDriverId = auth().currentUser?.uid ?? 'unknown_driver';
  console.log('👤 Current Driver ID:', myDriverId);
const [driverName, setDriverName] = useState<string>('Driver');

useEffect(() => {
  const fetchDriverName = async () => {
    try {
      const uid = auth().currentUser?.uid;
      if (!uid) return;
      console.log('🔍 Fetching driver profile for offline panel...');
      const profile = await getDriverByUid(uid);
      if (profile) {
        console.log('✅ Driver profile fetched:', profile);
        setDriverName(profile.name);
      } else {
        console.warn('⚠️ Driver profile not found.');
      }
    } catch (error) {
      console.error('❌ Error fetching driver profile:', error);
    }
  };

  fetchDriverName();
}, []);

  /**
   * Watch driver GPS continuously
   */
  useEffect(() => {
    const watchId = Geolocation.watchPosition(
      pos => {
        const coords = {
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        };
        setDriverCoords(coords);

        // Update Firebase only if on a ride
        if (currentRide) {
          database()
            .ref(`rideRequests/${currentRide.id}/driverLocation`)
            .set(coords);
        }
      },
      err => {
        console.error('Driver location error:', err);
      },
      {enableHighAccuracy: true, distanceFilter: 5},
    );

    return () => {
      Geolocation.clearWatch(watchId);
    };
  }, [currentRide]);

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

  /**
   * Listen for new ride requests when ONLINE
   */
  useEffect(() => {
    if (status === DriverStatus.ONLINE) {
      unsubscribeRef.current = listenForPendingRideRequests(rides => {
        const formatted = rides.map(ride => ({
          id: ride.id,
          riderName: ride.passengerName ?? 'Unknown Passenger',
          riderPhone: ride.passengerPhone ?? 'N/A',
          pickupLocation: {
            latitude: ride.pickup.latitude,
            longitude: ride.pickup.longitude,
          },
          dropoffLocation: {
            latitude: ride.dropoff.latitude,
            longitude: ride.dropoff.longitude,
          },
          distanceText: ride.distanceText ?? 'N/A',
          durationText: ride.durationText ?? 'N/A',
          fare: ride.fareEstimate,
        }));
        dispatch(setRideRequests(formatted));
      });
    }

    if (status !== DriverStatus.ONLINE && unsubscribeRef.current) {
      unsubscribeRef.current();
      unsubscribeRef.current = null;
      dispatch(clearRideRequests());
    }

    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
        unsubscribeRef.current = null;
      }
    };
  }, [status, dispatch]);

  const renderMapDirections = () => {
    if (!currentRide || !driverCoords) return null;

    const vehicleIcon = getVehicleMarkerIcon(currentRide.vehicleType);

    if (status === DriverStatus.ON_THE_WAY) {
      return (
        <>
          <Marker coordinate={driverCoords} title="You" image={vehicleIcon} />
          <Marker coordinate={currentRide.pickupLocation} title="Pickup" />
          <MapViewDirections
            origin={driverCoords}
            destination={currentRide.pickupLocation}
            apikey={GOOGLE_MAPS_API_KEY}
            strokeWidth={4}
            strokeColor="#9C27B0"
          />
        </>
      );
    }

    if (
      status === DriverStatus.WAITING_FOR_PASSENGER ||
      status === DriverStatus.TRIP_STARTED
    ) {
      return (
        <>
          <Marker coordinate={driverCoords} title="You" image={vehicleIcon} />
          <Marker coordinate={currentRide.pickupLocation} title="Pickup" />
          <Marker coordinate={currentRide.dropoffLocation} title="Drop-off" />
          <MapViewDirections
            origin={currentRide.pickupLocation}
            destination={currentRide.dropoffLocation}
            apikey={GOOGLE_MAPS_API_KEY}
            strokeWidth={4}
            strokeColor="#9C27B0"
          />
        </>
      );
    }

    return null;
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        region={
          driverCoords
            ? {
                latitude: driverCoords.latitude,
                longitude: driverCoords.longitude,
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
        {renderMapDirections()}
      </MapView>

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
                  onAccept={() => {
                    acceptRideRequest(item.id, myDriverId);
                    dispatch(setCurrentRide(item));
                    dispatch(clearRideRequests());
                    dispatch(setDriverStatus(DriverStatus.ON_THE_WAY));
                  }}
                  onReject={() => {
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

      {status === DriverStatus.ON_THE_WAY && currentRide && (
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
            if (currentRide) {
              database()
                .ref(`rideRequests/${currentRide.id}/status`)
                .set('arrived')
                .then(() => {
                  dispatch(setDriverStatus(DriverStatus.WAITING_FOR_PASSENGER));
                })
                .catch(err => {
                  console.error('Failed to update ride status to arrived', err);
                  Alert.alert('Error', 'Failed to update ride status.');
                });
            }
          }}
        />
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
});

export default DriverMapScreen;
