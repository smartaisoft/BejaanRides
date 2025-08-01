// src/services/RideService.ts

import database from '@react-native-firebase/database';

interface Location {
  latitude: number;
  longitude: number;
  address: string;
}

interface RideRequestData {
  passengerId: string;
  passengerName: string;
  passengerPhone: string;
  pickup: Location;
  dropoff: Location;
  vehicleType: string;
  fareEstimate: number;
  distanceText: string;
  durationText: string;
}

// export const createRideRequest = async (data: RideRequestData) => {
//   const requestRef = database().ref('rideRequests').push();
//   await requestRef.set({
//     ...data,
//     status: 'pending',
//     createdAt: Date.now(),
//   });
//   return requestRef.key;
// };

export const createRideRequest = async (
  rideDetails: any,
): Promise<string | null> => {
  try {
    const newRef = database().ref('rideRequests').push(); // This generates a new unique rideId
    const rideId = newRef.key;

    if (!rideId) {
      throw new Error('Failed to generate ride ID');
    }

    await newRef.set({
      ...rideDetails,
      status: 'pending', // ✅ This is crucial
      createdAt: Date.now(),
    });

    return rideId;
  } catch (error) {
    console.error('❌ Error in createRideRequest:', error);
    return null;
  }
};

export const listenForRideStatus = (
  rideId: string,
  callback: (status: string) => void,
) => {
  const ref = database().ref(`rideRequests/${rideId}/status`);
  ref.on('value', snapshot => {
    const status = snapshot.val();
    callback(status);
  });

  return () => ref.off(); // unsubscribe function
};

export const cancelRideRequest = async (rideId: string) => {
  await database().ref(`rideRequests/${rideId}`).update({status: 'cancelled'});
};

// src/services/RideService.ts

export const listenForRideUpdates = (
  rideId: string,
  callback: (ride: any) => void,
) => {
  const ref = database().ref(`rideRequests/${rideId}`);
  ref.on('value', snapshot => {
    const ride = snapshot.val();
    if (ride) {
      callback(ride);
    }
  });

  return () => ref.off();
};
