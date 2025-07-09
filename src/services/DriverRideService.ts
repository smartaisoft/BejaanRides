// src/services/DriverRideService.ts

import database from '@react-native-firebase/database';
const cleanupTimers: Record<string, NodeJS.Timeout> = {};

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

      // Start 20-second timers for new rides
      rides.forEach(ride => {
        if (!cleanupTimers[ride.id]) {
          cleanupTimers[ride.id] = setTimeout(() => {
            database()
              .ref(`rideRequests/${ride.id}`)
              .remove()
              .then(() => console.log(`⏳ Auto-deleted ride ${ride.id}`))
              .catch(err =>
                console.error(`❌ Failed to auto-delete ride ${ride.id}`, err),
              );
          }, 10000); // 20 seconds
        }
      });

      // Clear any timers for rides no longer in the list
      const currentIds = new Set(rides.map(r => r.id));
      Object.keys(cleanupTimers).forEach(id => {
        if (!currentIds.has(id)) {
          clearTimeout(cleanupTimers[id]);
          delete cleanupTimers[id];
        }
      });

      onUpdate(rides);
    } else {
      // Clear all timers when no rides
      Object.keys(cleanupTimers).forEach(id => {
        clearTimeout(cleanupTimers[id]);
        delete cleanupTimers[id];
      });

      onUpdate([]);
    }
  });

  return () => {
    ref.off('value', listener);
    Object.values(cleanupTimers).forEach(clearTimeout);
  };
};
// src/services/DriverRideService.ts
// export const acceptRideRequest = async (rideId: string, driverId: string) => {
//   await database().ref(`rideRequests/${rideId}`).update({
//     status: 'accepted',
//     driverId,
//     acceptedAt: Date.now(),
//   });
// };

export const acceptRideRequest = async (
  rideId: string,
  driverId: string,
  driverName: string,
  eta: string,
  distance: string,
  fare: number,
  vehicleType: string,
) => {
  await database().ref(`rideRequests/${rideId}/offers/${driverId}`).set({
    driverName,
    eta,
    distance,
    fare,
    vehicleType,
    timestamp: Date.now(),
  });
};

export const startTrip = async (rideId: string) => {
  await database().ref(`rideRequests/${rideId}`).update({
    status: 'ongoing',
    tripStartedAt: Date.now(),
  });
};
