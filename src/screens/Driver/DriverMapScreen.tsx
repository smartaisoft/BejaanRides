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

import React, {useEffect, useRef} from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Text,
  ActivityIndicator,
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
import StartTripCard from '../../components/BottomCard/AcceptedRideCard';
import {
  acceptRideRequest,
  listenForPendingRideRequests,
} from '../../services/DriverRideService';

const GOOGLE_MAPS_API_KEY = 'AIzaSyCb2ys2AD6NTFhnEGXNsDrjSXde6d569vU';
const defaultLat = 37.7749;
const defaultLng = -122.4194;

const DriverMapScreen: React.FC = () => {
  const {status, currentRide, rideRequests} = useSelector(
    (state: RootState) => state.driver,
  );

  console.log('CurrentRide:', currentRide);

  const dispatch = useDispatch<AppDispatch>();
  const unsubscribeRef = useRef<(() => void) | null>(null);

  const myDriverId = auth().currentUser?.uid ?? 'unknown_driver';

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
          distanceText: ride.distanceText ?? null,
          durationText: ride.durationText ?? null,
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
    if (!currentRide) return null;
    return (
      <>
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
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        region={{
          latitude: currentRide?.pickupLocation.latitude ?? defaultLat,
          longitude: currentRide?.pickupLocation.longitude ?? defaultLng,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}>
        {renderMapDirections()}
      </MapView>

      {/* OFFLINE */}
      {status === DriverStatus.OFFLINE && (
        <OfflinePanel
          onGoOnline={() => dispatch(setDriverStatus(DriverStatus.ONLINE))}
        />
      )}

      {/* ONLINE */}
      {status === DriverStatus.ONLINE && (
        <View style={styles.rideRequestsContainer}>
          {rideRequests.length === 0 ? (
            <View style={styles.loaderContainer}>
              <ActivityIndicator size="large" color="#9b2fc2" />
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
                    dispatch(setDriverStatus(DriverStatus.ARRIVED));
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

      {/* ARRIVED */}
      {status === DriverStatus.ARRIVED && currentRide && (
        <StartTripCard
          eta={currentRide.durationText ?? 'N/A'}
          fare={currentRide.fare}
          rating={4.9}
          distance={currentRide.distanceText ?? 'N/A'}
          onStart={() => dispatch(setDriverStatus(DriverStatus.TRIP_STARTED))}
        />
      )}

      {/* TRIP_STARTED */}
      {status === DriverStatus.TRIP_STARTED && (
        <CompleteTripCard
          onComplete={() => dispatch(setDriverStatus(DriverStatus.PAYMENT))}
        />
      )}

      {/* PAYMENT */}
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
