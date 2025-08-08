// src/services/DriverRideService.ts

import database from '@react-native-firebase/database';
const cleanupTimers: Record<string, NodeJS.Timeout> = {};

export const listenForPendingRideRequests = (
  driverId: string,
  onUpdate: (rides: any[]) => void,
  driverVehicleType?: string, // optional filter
) => {
  console.log('listenForPendingRideRequests', driverId, driverVehicleType);
  const ref = database()
    .ref('rideRequests')
    .orderByChild('status')
    .equalTo('pending');
  console.log('ref', ref);
  const listener = ref.on('value', snapshot => {
    const data = snapshot.val();
    console.log('data', data);
    if (data) {
      const rides = Object.keys(data)
        .map(key => ({
          id: key,
          ...data[key],
        }))
        // ✅ Filter out rides rejected by this driver
        .filter(ride => !(ride.rejectedDrivers && ride.rejectedDrivers[driverId]),)
        // ✅ (Optional) Filter by vehicle type
        .filter(
          ride => !driverVehicleType || ride.vehicleType === driverVehicleType,
        );
      console.log('data', rides);
      // 🔍 Debug: log each incoming ride (especially additionalStops)
      rides.forEach(ride => {
        console.log('🚕 New pending ride:', {
          id: ride.id,
          pickup: ride.pickup,
          additionalStops: ride.additionalStops || 'No extra stops',
          dropoff: ride.dropoff,
          fareEstimate: ride.fareEstimate,
          passenger: ride.passengerName,
        });
      });

      // ⏳ Start 30-second auto-delete timers for new rides
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
          }, 30000); // 30 seconds
        }
      });

      // 🧹 Clear timers for rides no longer in the list
      const currentIds = new Set(rides.map(r => r.id));
      Object.keys(cleanupTimers).forEach(id => {
        if (!currentIds.has(id)) {
          clearTimeout(cleanupTimers[id]);
          delete cleanupTimers[id];
        }
      });

      onUpdate(rides);
    } else {
      // ❌ No rides – clear all timers
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
    status: 'pending',
  });
};

export const startTrip = async (rideId: string) => {
  await database().ref(`rideRequests/${rideId}`).update({
    status: 'ongoing',
    tripStartedAt: Date.now(),
  });
};
