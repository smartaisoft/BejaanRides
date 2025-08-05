import database from '@react-native-firebase/database';

export const createRideRequest = async (
  rideDetails: any,
): Promise<string | null> => {
  try {
    const newRef = database().ref('rideRequests').push();
    const rideId = newRef.key;
    const testRef = database().ref('rideRequests/testWritePermission');
    testRef.set({test: true}); // should succeed if rules are correct

    if (!rideId) {
      throw new Error('Failed to generate ride ID');
    }

    await newRef.set({
      ...rideDetails,
      status: 'pending',
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

  return () => ref.off();
};

export const cancelRideRequest = async (rideId: string) => {
  await database().ref(`rideRequests/${rideId}`).update({status: 'cancelled'});
};

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
