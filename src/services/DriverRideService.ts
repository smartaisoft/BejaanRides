// src/services/DriverRideService.ts

import database from '@react-native-firebase/database';

export const listenForPendingRideRequests = (
  onUpdate: (rides: any[]) => void,
) => {
  const ref = database()
    .ref('rideRequests')
    .orderByChild('status')
    .equalTo('pending');

  const listener = ref.on('value', snapshot => {
    const data = snapshot.val();
    if (data) {
      const rides = Object.keys(data).map(key => ({
        id: key,
        ...data[key],
      }));
      onUpdate(rides);
    } else {
      onUpdate([]);
    }
  });

  return () => ref.off('value', listener);
};
// src/services/DriverRideService.ts
export const acceptRideRequest = async (rideId: string, driverId: string) => {
  await database().ref(`rideRequests/${rideId}`).update({
    status: "accepted",
    driverId,
    acceptedAt: Date.now(),
  });
};

export const startTrip = async (rideId: string) => {
  await database().ref(`rideRequests/${rideId}`).update({
    status: 'ongoing',
    tripStartedAt: Date.now(),
  });
};
