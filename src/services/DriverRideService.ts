import database from '@react-native-firebase/database';
const cleanupTimers: Record<string, NodeJS.Timeout> = {};

import axios from 'axios';

export const getETAFromDriverToPickup = async (
  driverCoords: {latitude: number; longitude: number},
  pickupCoords: {latitude: number; longitude: number},
): Promise<{durationText: string; distanceText: string}> => {
  const GOOGLE_MAPS_API_KEY = 'AIzaSyCb2ys2AD6NTFhnEGXNsDrjSXde6d569vU'; // replace this
  const origin = `${driverCoords.latitude},${driverCoords.longitude}`;
  const destination = `${pickupCoords.latitude},${pickupCoords.longitude}`;

  const response = await axios.get(
    `https://maps.googleapis.com/maps/api/directions/json?origin=${origin}&destination=${destination}&key=${GOOGLE_MAPS_API_KEY}`,
  );

  const route = response.data.routes?.[0]?.legs?.[0];
  return {
    durationText: route?.duration?.text ?? 'Unknown',
    distanceText: route?.distance?.text ?? 'Unknown',
  };
};

export const acceptRideRequest = async (
  rideId: string,
  driverId: string,
  driverName: string,
  eta: string,
  distance: string,
  fare: number,
  vehicleType: string,
  driverCoords: {latitude: number; longitude: number},
) => {
  await database().ref(`rideRequests/${rideId}/offers/${driverId}`).set({
    driverName,
    eta,
    distance,
    fare,
    vehicleType,
    timestamp: Date.now(),
    status: 'pending',
    driverLocation: driverCoords, // ✅ Add this!
  });
};

export const listenForPendingRideRequests = (
  driverId: string,
  onUpdate: (rides: any[]) => void,
  driverVehicleType?: string,
) => {
  const ref = database()
    .ref('rideRequests')
    .orderByChild('status')
    .equalTo('pending');
  console.log('ref', ref);
  const listener = ref.on('value', snapshot => {
    const data = snapshot.val();
    if (data) {
      const rides = Object.keys(data)
        .map(key => ({
          id: key,
          ...data[key],
        }))
        .filter(
          ride => !(ride.rejectedDrivers && ride.rejectedDrivers[driverId]),
        )
        .filter(
          ride => !driverVehicleType || ride.vehicleType === driverVehicleType,
        );
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

export const startTrip = async (rideId: string) => {
  await database().ref(`rideRequests/${rideId}`).update({
    status: 'ongoing',
    tripStartedAt: Date.now(),
  });
};
