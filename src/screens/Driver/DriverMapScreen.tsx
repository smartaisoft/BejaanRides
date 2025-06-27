import React from 'react';
import {View, StyleSheet, FlatList} from 'react-native';
import MapView, {Marker} from 'react-native-maps';
import {useSelector, useDispatch} from 'react-redux';
import {AppDispatch, RootState} from '../../redux/store';
import {DriverStatus} from '../../redux/types/driverTypes';
import {
  clearRideRequests,
  setCurrentRide,
  setDriverStatus,
  setRideRequests,
} from '../../redux/actions/driverActions';
import TripInfoCard from '../../components/BottomCard/TripInfoCard';
import PaymentCard from '../../components/BottomCard/PaymentCard';
import OfflinePanel from '../../components/BottomCard/OfflinePanel';
import PassengerRideRequestCard from '../../components/PassengerRideRequestCard';
import MapViewDirections from 'react-native-maps-directions';
import OnlinePanel from '../../components/BottomCard/ OnlinePanel';

const GOOGLE_MAPS_API_KEY = 'AIzaSyCb2ys2AD6NTFhnEGXNsDrjSXde6d569vU';
const defaultLat = 37.7749;
const defaultLng = -122.4194;

const DriverMapScreen: React.FC = () => {
  const {status, currentRide, rideRequests} = useSelector(
    (state: RootState) => state.driver,
  );
  const dispatch = useDispatch<AppDispatch>();

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        region={{
          latitude: currentRide
            ? currentRide.pickupLocation.latitude
            : defaultLat,
          longitude: currentRide
            ? currentRide.pickupLocation.longitude
            : defaultLng,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}>
        {currentRide && (
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
        )}
      </MapView>

      {/* Ride Requests stacked vertically */}
      {status === DriverStatus.REQUEST_RECEIVED && (
        <View style={styles.rideRequestsContainer}>
          <FlatList
            data={rideRequests}
            keyExtractor={item => item.id}
            renderItem={({item}) => (
              <PassengerRideRequestCard
                ride={item}
                onAccept={() => {
                  dispatch(setCurrentRide(item));
                  dispatch(clearRideRequests());
                  dispatch(setDriverStatus(DriverStatus.ARRIVED));
                }}
                onReject={() => {
                  dispatch(
                    setRideRequests(rideRequests.filter(r => r.id !== item.id)),
                  );
                }}
              />
            )}
          />
        </View>
      )}

      {status === DriverStatus.OFFLINE && (
        <OfflinePanel
          onGoOnline={() => dispatch(setDriverStatus(DriverStatus.ONLINE))}
        />
      )}

      {status === DriverStatus.ONLINE && (
        <OnlinePanel
          onFindTrips={() => {
            dispatch(setDriverStatus(DriverStatus.REQUEST_RECEIVED));
            dispatch(
              setRideRequests([
                {
                  id: 'ride1',
                  pickupLocation: {latitude: 37.7749, longitude: -122.4194},
                  dropoffLocation: {latitude: 37.7849, longitude: -122.4094},
                  riderName: 'John Doe',
                  riderPhone: '1234567890',
                  distance: 5.0,
                  fare: 450,
                },
                {
                  id: 'ride2',
                  pickupLocation: {latitude: 37.7649, longitude: -122.4294},
                  dropoffLocation: {latitude: 37.7549, longitude: -122.4394},
                  riderName: 'Jane Smith',
                  riderPhone: '9876543210',
                  distance: 3.2,
                  fare: 320,
                },
                {
                  id: 'ride3',
                  pickupLocation: {latitude: 37.7849, longitude: -122.4194},
                  dropoffLocation: {latitude: 37.7949, longitude: -122.4094},
                  riderName: 'Alice Johnson',
                  riderPhone: '5555555555',
                  distance: 4.5,
                  fare: 400,
                },
              ]),
            );
          }}
        />
      )}

      {status === DriverStatus.ARRIVED && currentRide && (
        <TripInfoCard
          riderName={currentRide.riderName}
          riderPhone={currentRide.riderPhone}
          eta="1"
          distance={currentRide.distance.toFixed(1)}
          onChat={() => console.log('Chat with rider')}
          onCall={() => console.log('Call rider')}
          onCancel={() => dispatch(setDriverStatus(DriverStatus.ONLINE))}
          onArrived={() => dispatch(setDriverStatus(DriverStatus.TRIP_STARTED))}
        />
      )}

      {status === DriverStatus.TRIP_STARTED && currentRide && (
        <TripInfoCard
          riderName={currentRide.riderName}
          riderPhone={currentRide.riderPhone}
          eta="In Progress"
          distance={currentRide.distance.toFixed(1)}
          onChat={() => console.log('Chat with rider')}
          onCall={() => console.log('Call rider')}
          onCancel={() => dispatch(setDriverStatus(DriverStatus.ONLINE))}
          onArrived={() => dispatch(setDriverStatus(DriverStatus.PAYMENT))}
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
});

export default DriverMapScreen;
