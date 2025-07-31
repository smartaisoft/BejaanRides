// services/driverPresenceService.ts
import database from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';

export interface DriverPresence {
  driverId: string;
  name: string;
  vehicleType: string;
  latitude: number;
  longitude: number;
  updatedAt: number;
}

export const updateDriverPresence = async (
  coords: {latitude: number; longitude: number},
  name: string,
  vehicleType: string,
) => {
  const uid = auth().currentUser?.uid;
  if (!uid) {return;}

  await database().ref(`driversOnline/${uid}`).set({
    driverId: uid,
    name,
    vehicleType,
    latitude: coords.latitude,
    longitude: coords.longitude,
    updatedAt: Date.now(),
  });
};

export const removeDriverPresence = async () => {
  const uid = auth().currentUser?.uid;
  if (!uid) {return;}
  await database().ref(`driversOnline/${uid}`).remove();
};

// For passengers to subscribe to available drivers
export const subscribeToAvailableDrivers = (
  callback: (drivers: DriverPresence[]) => void,
) => {
  const ref = database().ref('driversOnline');
  const onValueChange = ref.on('value', snapshot => {
    const data = snapshot.val() || {};
    const drivers = Object.keys(data).map(id => ({
      id,
      ...data[id],
    }));
    callback(drivers);
  });

  return () => ref.off('value', onValueChange);
};
