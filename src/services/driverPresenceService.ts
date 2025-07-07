import database from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';

let updateInterval: NodeJS.Timeout | null = null;

export const startDriverPresence = (vehicleType: string) => {
  const uid = auth().currentUser?.uid;
  if (!uid) return;

  updateInterval = setInterval(() => {
    navigator.geolocation.getCurrentPosition(
      pos => {
        database().ref(`driversOnline/${uid}`).set({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          vehicleType,
          isAvailable: true,
          timestamp: Date.now(),
        });
      },
      err => {
        console.error('Driver location error:', err);
      },
      {enableHighAccuracy: true},
    );
  }, 5000); // Update every 5 seconds
};

export const stopDriverPresence = () => {
  const uid = auth().currentUser?.uid;
  if (!uid) return;
  if (updateInterval) clearInterval(updateInterval);
  database().ref(`driversOnline/${uid}`).remove();
};
