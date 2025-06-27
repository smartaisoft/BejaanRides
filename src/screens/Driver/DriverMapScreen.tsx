import React from 'react';
import {View, StyleSheet} from 'react-native';
import MapView from 'react-native-maps';
import {useSelector, useDispatch} from 'react-redux';
import {AppDispatch, RootState} from '../../redux/store';
import {DriverStatus} from '../../redux/types/driverTypes';
import {
  setCurrentRide,
  setDriverStatus,
} from '../../redux/actions/driverActions';
import TripInfoCard from '../../components/BottomCard/TripInfoCard';
import PaymentCard from '../../components/BottomCard/PaymentCard';
import OfflinePanel from '../../components/BottomCard/OfflinePanel';
import RideRequestCard from '../../components/BottomCard/ RideRequestCard';
import OnlinePanel from '../../components/BottomCard/ OnlinePanel';

const DriverMapScreen: React.FC = () => {
  const {status, currentRide} = useSelector((state: RootState) => state.driver);
  const dispatch = useDispatch<AppDispatch>();

  return (
    <View style={styles.container}>
      <MapView style={styles.map} />

      {status === DriverStatus.OFFLINE && (
        <OfflinePanel
          onGoOnline={() => dispatch(setDriverStatus(DriverStatus.ONLINE))}
        />
      )}

      {status === DriverStatus.ONLINE && (
        <OnlinePanel
          onFindTrips={() => {
            // When clicking Finding Trips:
            // 1) Set status to REQUEST_RECEIVED
            dispatch(setDriverStatus(DriverStatus.REQUEST_RECEIVED));
            // 2) Optionally set a dummy ride
            dispatch(
              setCurrentRide({
                id: 'dummy-ride',
                pickupLocation: {latitude: 37.7749, longitude: -122.4194},
                dropoffLocation: {latitude: 37.7849, longitude: -122.4094},
                riderName: 'John Doe',
                riderPhone: '1234567890',
                distance: 5,
                fare: 450,
              }),
            );
          }}
        />
      )}
      {status === DriverStatus.REQUEST_RECEIVED && currentRide && (
        <RideRequestCard
          ride={currentRide}
          onAccept={() => dispatch(setDriverStatus(DriverStatus.ARRIVED))}
          onReject={() => dispatch(setDriverStatus(DriverStatus.ONLINE))}
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
});

export default DriverMapScreen;
